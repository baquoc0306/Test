import React, { useState, useEffect, useMemo } from 'react';
import { Talent, NineBoxCell, NineBoxGroup } from '../types';
import { X, Award, Briefcase, Star, Layout, RefreshCw, Layers, Sparkles, Info, AlertTriangle, Users, BellRing } from 'lucide-react';
import { dbIndividualIDPs } from '../individualDevPlansData';
import { dbTalentPool } from '../data';

interface TalentProfileModalProps {
  talent: Talent | null;
  onClose: () => void;
  onUpdateTalent: (updated: Talent) => void;
  lang?: 'VI' | 'EN';
  isLdMode?: boolean;
}

// Custom Markdown to React parser to prevent static flag error on React 19 / HMR reloads
const parseBoldText = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const innerText = part.slice(2, -2);
      return <strong key={index} className="font-sans font-black text-indigo-950">{innerText}</strong>;
    }
    return part;
  });
};

const renderCustomMarkdown = (markdown: string): React.ReactNode => {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentListItems: React.ReactNode[] = [];
  let listKey = 0;
  
  const pushListIfExist = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-disc pl-5 mt-1.5 mb-2.5 space-y-1 text-slate-705 font-sans text-[10.5px]">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      pushListIfExist();
      continue;
    }

    // Headers: #### or ###
    const headerMatch = line.match(/^(#{1,6})\s*(.*)$/);
    if (headerMatch) {
      pushListIfExist();
      const text = headerMatch[2];
      elements.push(
        <h4 key={`h-${i}`} className="font-sans font-black text-slate-800 text-[11px] mt-3 mb-1 border-b border-indigo-50 pb-0.5 uppercase tracking-wide">
          {parseBoldText(text)}
        </h4>
      );
      continue;
    }

    // Direct bullet points
    const listMatch = line.match(/^[-*+]\s+(.*)$/);
    if (listMatch) {
      currentListItems.push(
        <li key={`li-${i}`} className="font-sans text-[10.5px] text-slate-650 leading-relaxed pl-1">
          {parseBoldText(listMatch[1])}
        </li>
      );
      continue;
    }

    // Numbered list item or dynamic header with number (e.g. "1. **💡 Title**")
    const numMatch = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (numMatch) {
      pushListIfExist();
      const content = numMatch[2];
      // If it contains bold layout title, render nicely
      if (content.startsWith('**')) {
        elements.push(
          <div key={`numhead-${i}`} className="font-sans font-black text-indigo-950 text-[11px] mt-3.5 mb-1.5 border-b border-indigo-50/70 pb-0.5 uppercase flex items-center gap-1">
            <span>{numMatch[1]}.</span>
            <span>{parseBoldText(content)}</span>
          </div>
        );
      } else {
        elements.push(
          <p key={`p-${i}`} className="font-sans text-[10.5px] text-slate-650 leading-relaxed mb-2">
            <strong>{numMatch[1]}.</strong> {parseBoldText(content)}
          </p>
        );
      }
      continue;
    }

    // Regular line / Paragraph
    pushListIfExist();
    elements.push(
      <p key={`p-${i}`} className="font-sans text-[10.5px] text-slate-650 leading-relaxed mb-2">
        {parseBoldText(line)}
      </p>
    );
  }

  pushListIfExist();
  return <div className="space-y-1">{elements}</div>;
};

const cellsMapping: { name: NineBoxCell; group: NineBoxGroup }[] = [
  { name: 'Superstar', group: 'Growers' },
  { name: 'High Professional', group: 'Growers' },
  { name: 'Rising Star', group: 'Growers' },
  { name: 'Seasoned Professional', group: 'Keepers' },
  { name: 'Solid Professional', group: 'Keepers' },
  { name: 'Valued Contributor', group: 'Keepers' },
  { name: 'Learning Professional', group: 'Movers' },
  { name: 'Future Utility', group: 'Movers' },
  { name: 'Diamond in the Rough', group: 'Movers' },
];

const translateCell = (cell: NineBoxCell, lang: 'VI' | 'EN'): string => {
  if (lang !== 'VI') return cell;
  switch (cell) {
    case 'Seasoned Professional': return 'Nhân sự dày dặn';
    case 'High Professional': return 'Nhân sự xuất sắc';
    case 'Superstar': return 'Siêu sao';
    case 'Solid Professional': return 'Nhân sự vững vàng';
    case 'Valued Contributor': return 'Người Đóng góp Chủ lực';
    case 'Rising Star': return 'Ngôi sao đang lên';
    case 'Learning Professional': return 'Nhân sự cần hoàn thiện';
    case 'Future Utility': return 'Nhân tố dự phòng tương lai';
    case 'Diamond in the Rough': return 'Kim cương thô';
    default: return cell;
  }
};

export default function TalentProfileModal({
  talent,
  onClose,
  onUpdateTalent,
  lang = 'VI',
  isLdMode = false,
}: TalentProfileModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<NineBoxCell>(talent?.cell || 'Solid Professional');
  const [results, setResults] = useState<'High Effective' | 'Effective' | 'Less Effective'>(
    talent?.results || 'Effective'
  );
  const [potential, setPotential] = useState<'High' | 'Mid' | 'Low'>(talent?.potential || 'Low');

  // AI-Powered Peer-to-Peer Development states
  const [matchingMentors, setMatchingMentors] = useState<string | null>(null);
  const [loadingMentors, setLoadingMentors] = useState<boolean>(false);

  const handleFetchMentors = async () => {
    if (!talent) return;
    setLoadingMentors(true);
    setMatchingMentors(null);
    try {
      const superstars = dbTalentPool.filter(
        (t) => t.cell === 'Superstar' && t.name?.toUpperCase() !== talent.name?.toUpperCase()
      );

      const response = await fetch('/api/gemini/peer-mentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentee: {
            name: talent.name,
            dept: talent.dept,
            cell: talent.cell,
            results: talent.results,
            potential: talent.potential,
          },
          superstars,
          lang,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setMatchingMentors(data.advice);
    } catch (error) {
      console.error(error);
      setMatchingMentors(
        lang === 'VI'
          ? '### ❌ Lỗi kết nối\n\nKhông thể kết nối đến máy chủ AI lúc này. Vui lòng thử lại sau.'
          : '### ❌ Connection Error\n\nUnable to reach the AI engine at the moment. Please try again later.'
      );
    } finally {
      setLoadingMentors(false);
    }
  };

  useEffect(() => {
    if (talent) {
      setMatchingMentors(null);
      setLoadingMentors(false);
      handleFetchMentors();
    }
  }, [talent]);



  // Utility to match talent cards against base development IDP spreadsheet rows
  const getIndividualIDPItems = (talentName: string) => {
    const norm = (s: string) => (s || '').toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
    
    const targetNorm = norm(talentName);
    return dbIndividualIDPs.filter(idp => {
      const viNorm = norm(idp.viName || '');
      const engNorm = norm(idp.engName || '');
      return viNorm.includes(targetNorm) || engNorm.includes(targetNorm) || targetNorm.includes(viNorm) || targetNorm.includes(engNorm);
    });
  };

  // Helper to get 2026 9-Box position analysis when clicking on individual
  const getCell9BoxAnalysis = (cell: NineBoxCell, l: 'VI' | 'EN'): string => {
    if (l === 'VI') {
      switch (cell) {
        case 'Superstar':
          return 'Cá nhân xuất sắc vượt trội về cả hiệu suất công việc và năng lực dẫn dắt. Đang thể hiện triển vọng lãnh đạo mở rộng, sẵn sàng kế thừa các vị trí quản lý nòng cốt.';
        case 'High Professional':
          return 'Cung cấp hiệu suất làm việc ấn tượng với chất lượng đầu ra ổn định, có năng lực nâng cấp cao. Thích hợp giữ vai trò chuyên gia kỹ thuật dẫn đầu hoặc quản lý dự án trọng yếu.';
        case 'Rising Star':
          return 'Thể hiện hiệu suất tốt đi kèm tư duy sáng tạo chủ động cao. Có triển vọng thăng tiến khả quan lên các vị trí quản trị dự án hoặc trưởng nhóm nghiệp vụ.';
        case 'Seasoned Professional':
          return 'Là chuyên gia nghiệp vụ kỳ cựu với hiệu năng vận hành bền bỉ. Đóng vai trò là điểm tựa kỹ thuật tuyệt vời, cực kỳ phù hợp làm giảng viên nội bộ hoặc Coach/Mentor.';
        case 'Solid Professional':
          return 'Hoàn thành tốt và tin cậy tất cả chỉ tiêu vận hành cốt lõi được giao. Điểm tựa vận hành ổn định cho tập thể phòng ban.';
        case 'Valued Contributor':
          return 'Thành viên đóng góp tích cực và hoàn thành đúng yêu cầu công việc chuẩn. Có cơ hội thăng tiến tốt nếu được đào tạo phát triển trọng điểm các kỹ năng bổ trợ.';
        case 'Learning Professional':
          return 'Thường là nhân sự mới nhận việc hoặc vừa hoán đổi phòng ban, đang học hỏi làm quen tiêu chuẩn nghiệp vụ. Cần chương trình hướng dẫn OJT sát sao.';
        case 'Future Utility':
          return 'Thể hiện tiềm lực đóng góp tiềm năng khá tốt, nhưng hiệu suất vận hành thực tế tại chỗ còn thiếu ổn định. Cần tập trung chuẩn hóa kỹ thuật hành vi làm việc.';
        case 'Diamond in the Rough':
          return 'Nhân tố có tố chất cá nhân cao nhưng kết quả làm việc tạm thời chưa đạt kỳ vọng do rào cản thích ứng quy trình. Cần trao đổi định kỳ 1-on-1 để tháo gỡ khó khăn.';
        default:
          return 'Đang cập nhật đánh giá đóng góp nhân sự.';
      }
    } else {
      switch (cell) {
        case 'Superstar':
          return 'Exceptional operational execution paired with rapid leadership progression criteria. A natural candidate for key succession pipelines.';
        case 'High Professional':
          return 'Outstanding operational quality combined with strong technical development potential. Best suited for complex continuous improvements or lead expert spots.';
        case 'Rising Star':
          return 'Steep developmental curve with clear creative initiative. Positioned excellently for future management and project lead opportunities.';
        case 'Seasoned Professional':
          return 'Elite technical expertise and highly robust, stable day-to-day execution. Exceptionally positioned to guide internal standards or serve as key mentors.';
        case 'Solid Professional':
          return 'A highly reliable anchor who guarantees core quality execution. Focus on continuous skills training to preserve high domain excellence.';
        case 'Valued Contributor':
          return 'A solid core contributor showing steady results. High growth potential is achievable under tailored mentorship focused on operational blocks.';
        case 'Learning Professional':
          return 'Commonly newly onboarded or transferred personnel adapting to new workflows. Main focus must be structured on-the-job training (OJT).';
        case 'Future Utility':
          return 'Clear latent potential but operational output is variable. Requires close supervision and structured repetition of fundamental workflow skills.';
        case 'Diamond in the Rough':
          return 'High natural capability masked by transient struggles in performance. Demands dedicated 1-on-1 focus to pinpoint and address skill bugs.';
        default:
          return 'Assessment pending alignment review.';
      }
    }
  };

  // Helper to get 2026 9-Box development direction when clicking on individual
  const getCellDevelopmentDirection = (cell: NineBoxCell, l: 'VI' | 'EN'): string => {
    if (l === 'VI') {
      switch (cell) {
        case 'Superstar':
          return 'Đưa ngay vào quy hoạch kế thừa; đề cử đào tạo Mini-MBA/AI Tools; giao quyền chỉ đạo các dự án đột phá liên chức năng.';
        case 'High Professional':
          return 'Trao quyền quản trị các cải tiến quy mô phòng ban; bồi dưỡng nâng cao phong cách quản trị dự án; khuyến khích chia sẻ kỹ năng chuyên sâu.';
        case 'Rising Star':
          return 'Giao điều phối các tiểu ban hoặc dự án thí nghiệm; đào tạo nâng cao năng lực giải quyết vấn đề và kỹ năng quản lý nhóm.';
        case 'Seasoned Professional':
          return 'Ủy thác việc soạn thảo cẩm nang kỹ thuật vận hành tiêu chuẩn; tài trợ hoàn thành chứng chỉ Sư phạm đào tạo nội bộ để tối ưu nguồn lực giảng dạy.';
        case 'Solid Professional':
          return 'Chuẩn hóa kỹ năng thông qua tập huấn định kỳ; định hướng nâng cấp năng lực số hóa/AI Office và duy trì động lực cống hiến.';
        case 'Valued Contributor':
          return 'Đồng hành xây dựng mục tiêu IDP rõ ràng; cử tham gia các lớp chia sẻ kỹ năng cộng tác nhóm và công cụ cải thiện năng suất.';
        case 'Learning Professional':
          return 'Phân công Mentor kèm cặp trực quan (Buddy) theo sát lộ trình hội nhập 30-60-90 ngày; rà soát lỗi nghiệp vụ hàng tuần.';
        case 'Future Utility':
          return 'Xác định các lỗ hổng kỹ năng hành vi cụ thể; giao các chỉ tiêu công việc vừa sức và tăng tần suất phản hồi 1-on-1 nâng đỡ kịp thời.';
        case 'Diamond in the Rough':
          return 'Khảo sát rào cản công cụ/quy trình làm việc; thiết lập thỏa thuận cam kết thực hiện mục tiêu cụ thể và tái đào tạo chuyên môn bổ khuyết.';
        default:
          return 'Theo dõi sát tiến độ tích lũy chứng chỉ bồi dưỡng bắt buộc.';
      }
    } else {
      switch (cell) {
        case 'Superstar':
          return 'Place in fast-track succession planning, recommend leadership courses (Servant Leadership, Business Acumen), assign cross-division high-stake projects.';
        case 'High Professional':
          return 'Delegate authority for autonomous internal scopes, expand problem-solving frameworks, and encourage ownership of corporate improvement groups.';
        case 'Rising Star':
          return 'Sponsor specialized project leadership tasks, assign small cross-unit initiatives, and enroll in advanced operations classes.';
        case 'Seasoned Professional':
          return 'Empower to build corporate training tools, complete advanced Coaching & Mentoring课程, and lead train-the-trainer academies.';
        case 'Solid Professional':
          return 'Preserve stable task delivery, standard process updates, and assign micro-level troubleshooting scopes.';
        case 'Valued Contributor':
          return 'Clarify clear career path milestone expectations, resolve potential operational bottlenecks via regular feedback sessions.';
        case 'Learning Professional':
          return 'Build a strict 30-60-90 day OJT roadmap with specific senior checkers assigned for systematic workflow checks.';
        case 'Future Utility':
          return 'Simplify quarterly objectives, implement high-frequency OJT repetition, and focus on removing volatility in core work cycles.';
        case 'Diamond in the Rough':
          return 'Initiate direct 1-on-1 diagnostic talks, resolve potential misfit variables, and provide clean, focused technical retraining.';
        default:
          return 'Monitor alignment and assign on-demand support as necessary.';
      }
    }
  };

  // Memoized IDP progress rate for current talent
  const idleProgressRate = useMemo(() => {
    const list = getIndividualIDPItems(talent?.name || '');
    const total = list.length;
    if (total === 0) return 0;
    const weight = list.reduce((acc, item) => {
      const r = (item.rRating || '').toUpperCase().trim();
      if (r.includes('R4')) return acc + 100;
      if (r.includes('R3')) return acc + 75;
      if (r.includes('R2')) return acc + 50;
      if (r.includes('R1')) return acc + 25;
      return acc + 10;
    }, 0);
    return Math.round(weight / total);
  }, [talent?.name]);



  const handleCellChange = (cellName: NineBoxCell) => {
    setSelectedCell(cellName);
    // Auto align results and potential based on matrix theory:
    if (['Superstar', 'High Professional', 'Seasoned Professional'].includes(cellName)) {
      setResults('High Effective');
    } else if (['Rising Star', 'Valued Contributor', 'Solid Professional'].includes(cellName)) {
      setResults('Effective');
    } else {
      setResults('Less Effective');
    }

    if (['Superstar', 'Rising Star', 'Diamond in the Rough'].includes(cellName)) {
      setPotential('High');
    } else if (['High Professional', 'Valued Contributor', 'Future Utility'].includes(cellName)) {
      setPotential('Mid');
    } else {
      setPotential('Low');
    }
  };

  const handleSave = () => {
    const matchedMap = cellsMapping.find((c) => c.name === selectedCell);
    onUpdateTalent({
      ...talent,
      cell: selectedCell,
      results,
      potential,
      group: matchedMap ? matchedMap.group : 'Keepers',
    });
    setEditMode(false);
  };

  const [scrolled, setScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const sTop = e.currentTarget.scrollTop;
    if (sTop > 80) {
      setScrolled(true);
    } else if (sTop < 15) {
      setScrolled(false);
    }
  };

  if (!talent) return null;

  const badgeColor =
    talent.group === 'Growers'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-250'
      : talent.group === 'Keepers'
      ? 'bg-amber-50 text-amber-800 border-amber-250'
      : 'bg-rose-50 text-rose-800 border-rose-250';

  const dotColor =
    talent.group === 'Growers'
      ? 'bg-emerald-500'
      : talent.group === 'Keepers'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div id="onboarding-9box-detail-modal" className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all transition-shadow">
        
        {/* Single Scroll Container wrapping EVERYTHING to ensure zero-jitter scroll collapse */}
        <div 
          onScroll={handleScroll} 
          className="overflow-y-auto flex-1 text-left bg-white flex flex-col relative"
        >
          {/* Top Header - No dynamic height changes to prevent scroll viewport resizing */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 h-13.5">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-indigo-400" />
              <span className="font-display font-black text-xs uppercase tracking-wider font-mono text-indigo-100">
                {lang === 'VI' ? 'Hồ Sơ Nhân Sự Chi Tiết' : 'Detailed Personnel Profile'}
              </span>
            </div>
            <button
              id="onboarding-9box-detail-close-btn"
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('onboarding-9box-detail-closed'));
              }}
              className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg cursor-pointer animate-pulse"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Name and Group row (becomes compact and receives sticky stats level with name on scroll) */}
          <div 
            className={`sticky top-0 z-20 border-b border-slate-150 bg-slate-50/95 flex shrink-0 transition-all duration-200 ${
              scrolled ? 'py-2.5 px-6 shadow-sm ring-1 ring-slate-200/50' : 'py-5 px-6'
            }`}
          >
            <div className="flex items-center justify-between w-full gap-3.5 select-none">
              <div className="flex items-center gap-2.5 min-w-0 shrink">
                <div className="min-w-0 shrink-0">
                  <h3 className={`font-bold font-display text-slate-800 transition-all duration-200 whitespace-nowrap truncate leading-tight ${
                    scrolled ? 'text-sm max-w-[125px] sm:max-w-[185px]' : 'text-xl'
                  }`}>
                    {talent.name}
                  </h3>
                  {!scrolled && (
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5 flex items-center gap-1 whitespace-nowrap truncate animate-in fade-in duration-200">
                      <Briefcase className="w-3.5 h-3.5 inline text-slate-405 shrink-0" />
                      {talent.dept}
                    </p>
                  )}
                </div>
                <span
                  className={`text-[8.5px] font-mono font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${badgeColor} transition-all duration-200 ${
                    scrolled ? 'scale-90 opacity-90' : 'scale-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  {lang === 'VI'
                    ? talent.group === 'Growers' ? 'PHÁT TRIỂN' : talent.group === 'Keepers' ? 'DUY TRÌ' : 'LUÂN CHUYỂN'
                    : talent.group.toUpperCase()}
                </span>
              </div>

              {/* When scrolled: horizontal compact info block gets pulled up level with target name */}
              {scrolled && (
                <div className="flex items-center gap-2 text-[9px] font-mono font-black text-slate-650 bg-white border border-slate-200/90 py-1.5 px-2.5 rounded-xl shadow-4xs animate-in slide-in-from-right-4 duration-200 shrink-0 select-none">
                  <span className="text-slate-400">
                    {lang === 'VI' ? 'HS:' : 'Perf:'}{' '}
                    <span className="text-indigo-950 font-sans font-black">
                      {lang === 'VI'
                        ? results === 'High Effective' ? 'Hiệu quả cao' : results === 'Effective' ? 'Hiệu quả' : 'Kém hiệu quả'
                        : results}
                    </span>
                  </span>
                  <span className="text-slate-350">|</span>
                  <span className="text-slate-400">
                    {lang === 'VI' ? 'TN:' : 'Pot:'}{' '}
                    <span className="text-indigo-950 font-sans font-black">
                      {lang === 'VI' ? (potential === 'High' ? 'Cao' : potential === 'Mid' ? 'TB' : 'Thấp') : potential}
                    </span>
                  </span>
                  <span className="text-slate-350">|</span>
                  <span className="text-brand-blue font-sans font-black">{translateCell(talent.cell, lang)}</span>
                </div>
              )}

              {/* In scrolled mode, append close button here */}
              {scrolled && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-200/60 rounded-lg cursor-pointer transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-6 flex-1 text-left bg-white">
          {!editMode ? (
            <div className="space-y-4">
              {/* Static stats block - only visible initially at the top of content */}
              {!scrolled && (
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-center">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                      {lang === 'VI' ? 'Hiệu Suất' : 'Performance'}
                    </span>
                    <span className="block text-xs font-semibold text-slate-700 mt-1">
                      {lang === 'VI'
                        ? results === 'High Effective' ? 'Hiệu quả cao' : results === 'Effective' ? 'Hiệu quả' : 'Kém hiệu quả'
                        : results}
                    </span>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                      {lang === 'VI' ? 'Tiềm Năng' : 'Potential'}
                    </span>
                    <span className="block text-xs font-semibold text-slate-700 mt-1">
                      {lang === 'VI'
                        ? potential === 'High' ? 'Cao' : potential === 'Mid' ? 'Trung bình' : 'Thấp'
                        : potential}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                      {lang === 'VI' ? 'Phân Vị 9-Box' : '9-Box Quadrant'}
                    </span>
                    <span className="block text-xs font-semibold text-brand-blue mt-1 whitespace-nowrap">
                      {translateCell(talent.cell, lang)}
                    </span>
                  </div>
                </div>
              )}

              {/* Information Cards */}
              <div className="space-y-3">
                <div className="bg-slate-50 hover:bg-slate-100/70 p-3 rounded-lg border border-slate-200/55 flex gap-3 items-start transition-colors">
                  <Star className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {lang === 'VI' ? 'Khuyến Nghị Hành Động (Core Action Suggestion)' : 'Core Action Recommendation'}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {talent.group === 'Growers'
                        ? (lang === 'VI' 
                          ? 'Đưa ngay vào danh sách kế thừa khẩn cấp, phân bổ các chương trình Mini-MBA, AI For Everyone, giao dự án đột phá hoặc ủy giữ vai trò quyền hạn cao hơn.'
                          : 'Immediate addition to core succession lines, recommend enrollment in leadership fast-tracks (MBA/AI tools), assign cross-functional breakthrough projects.')
                        : talent.group === 'Keepers'
                        ? (lang === 'VI'
                          ? 'Tập trung duy trì và đào sâu kỹ năng chuyên môn chuyên sâu, nâng tầm kỹ năng huấn luyện đàn em và giao phụ trách các quy trình cải thiện chất lượng.'
                          : 'Focus on scaling domain mastery, elevate mentoring/coaching obligations, and assign leadership over continuous quality improvement workflows.')
                        : (lang === 'VI'
                          ? 'Lập biểu đồ theo dõi hiệu suất 1-on-1 trong 3 tháng, rà soát lại mức độ phù hợp công việc, tái đào tạo hoặc luân chuyển sang phòng ban cần thiết.'
                          : 'Establish structured 1-on-1 performance reviews for 3 months, review job-fit parameters, provide direct action retraining, or transfer to suitable departments.')}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/70 p-3 rounded-lg border border-slate-200/55 flex gap-3 items-start transition-colors">
                  <Layers className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {lang === 'VI' ? 'Lộ Trình Đào Tạo Phát Triển (L&D Target)' : 'L&D Targeted Development Path'}
                    </h5>
                    <p className="text-xs text-slate-600 mt-1">
                      {talent.group === 'Growers'
                        ? (lang === 'VI'
                          ? 'Đề xuất khóa học: Servant Leadership, Business Acumen & Decision Making, AI for Everyone; Power Automate in Office.'
                          : 'Recommended Courses: Servant Leadership, Business Acumen & Decision Making, AI for Everyone; Power Automate in Office.')
                        : talent.group === 'Keepers'
                        ? (lang === 'VI'
                          ? 'Đề xuất khóa học: Coaching & Mentorial, Process Improvement & Compliance, Workforce Planning.'
                          : 'Recommended Courses: Coaching & Mentorial, Process Improvement & Compliance, Workforce Planning.')
                        : (lang === 'VI'
                          ? 'Đề xuất khóa học: Function-specific Development Plan (IDP Specialist).'
                          : 'Recommended Courses: Specialized Technical Retraining & Targeted IDP Action Steps.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strategic 2026 9-Box Assessment & Growth Path (replaces the fictional history block) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2 select-none">
                  <div className="flex items-center gap-1.5 text-slate-850">
                    <Layers className="w-4 h-4 text-indigo-550 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-wider font-sans">
                      {lang === 'VI' ? 'ĐÁNH GIÁ 9-BOX 2026 & HƯỚNG PHÁT TRIỂN' : '2026 9-BOX ASSESSMENT & GROWTH PATH'}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-black text-slate-400">Millennium HR Review</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Position analysis (no fake history!) */}
                  <div className="space-y-1 text-xs">
                    <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">
                      {lang === 'VI' ? 'Phân tích định vị' : 'Quadrant Analysis'}
                    </span>
                    <p className="text-[11px] font-bold text-indigo-950 font-sans leading-snug">
                      {translateCell(selectedCell, lang)}:
                    </p>
                    <p className="text-[10.5px] text-slate-600 leading-relaxed font-sans mt-1">
                      {getCell9BoxAnalysis(selectedCell, lang)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* IDP Progress indicator */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">
                          {lang === 'VI' ? 'Tiến độ hoàn thành IDP' : 'IDP Completion Rate'}
                        </span>
                        <span className="text-[11px] font-mono font-black text-emerald-600">
                          {idleProgressRate}%
                        </span>
                      </div>
                      <div className="relative w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-555 rounded-full transition-all duration-300" 
                          style={{ width: `${idleProgressRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Propose development direction */}
                    <div className="space-y-0.5 text-xs">
                      <span className="block text-[9px] uppercase font-black text-slate-400 tracking-wider">
                        {lang === 'VI' ? 'Đề xuất định hướng' : 'Development Guideline'}
                      </span>
                      <p className="text-[10.5px] text-indigo-750 font-medium leading-relaxed font-sans mt-0.5">
                        {getCellDevelopmentDirection(selectedCell, lang)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Evaluation disclaimer */}
                <div id="ai-disclaimer-profile" className="flex items-start gap-2 p-2.5 bg-rose-50/70 border border-rose-200/60 rounded-xl text-[10px] sm:text-[11px] leading-relaxed text-rose-800 shadow-3xs select-none">
                  <BellRing className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <span className="font-extrabold uppercase tracking-wider text-rose-900 mr-1.5 inline-block text-[9.5px] sm:text-[10.5px]">
                      {lang === 'VI' ? '⚠️ ĐỀ XUẤT HỖ TRỢ TỪ AI:' : '⚠️ AI-DRIVEN ASSISTANT SUGGESTION:'}
                    </span>
                    {lang === 'VI'
                      ? 'Các đề xuất lộ trình định vị này được lập tự động từ AI phục vụ bồi dưỡng và quy hoạch nòng cốt. Các quyết định cuối cùng thuộc về các Bộ phận Chức năng/ Chuyên môn hoặc Trưởng bộ phận.'
                      : 'Career guidelines are compiled automatically by AI to support talent development. Final decisions belong to the Functional/Specialized Departments or Department Heads.'}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                {isLdMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> {lang === 'VI' ? 'Chỉnh Sửa Phân Phối 9-Box' : 'Edit 9-Box Placement'}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {lang === 'VI' ? 'Đóng lại' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {lang === 'VI' ? `Chọn Phân Vị 9-Box Mới Cho ${talent.name}:` : `Select New 9-Box Quadrant for ${talent.name}:`}
              </span>

              <div className="grid grid-cols-2 gap-2">
                {cellsMapping.map((option) => {
                  const checkStyle =
                    selectedCell === option.name
                      ? 'border-brand-cyan bg-blue-50 text-brand-blue font-semibold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50';
                  return (
                    <button
                      key={option.name}
                      onClick={() => handleCellChange(option.name)}
                      className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${checkStyle}`}
                    >
                      <span className="block font-medium">{translateCell(option.name, lang)}</span>
                      <span className="block text-[9px] text-slate-400 uppercase mt-0.5 font-bold font-sans">
                        {lang === 'VI' ? `Nhóm: ${option.group === 'Growers' ? 'Phát triển' : option.group === 'Keepers' ? 'Duy trì' : 'Luân chuyển'}` : `Group: ${option.group}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected stats info */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'VI' ? 'Mức Hiệu Suất tự động:' : 'Auto Performance level:'}</span>
                  <span className="font-semibold text-slate-700">
                    {lang === 'VI'
                      ? results === 'High Effective' ? 'Hiệu quả cao' : results === 'Effective' ? 'Hiệu quả' : 'Kém hiệu quả'
                      : results}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'VI' ? 'Mức Tiêu chuẩn Tiềm năng:' : 'Auto Potential standard:'}</span>
                  <span className="font-semibold text-slate-700">
                    {lang === 'VI'
                      ? potential === 'High' ? 'Cao' : potential === 'Mid' ? 'Trung bình' : 'Thấp'
                      : potential}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {lang === 'VI' ? 'Hủy bỏ' : 'Cancel'}
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {lang === 'VI' ? 'Lưu thay đổi [Cập nhật]' : 'Save Placement Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
