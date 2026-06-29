import React, { useMemo } from 'react';
import { 
  Users, 
  ArrowLeftRight, 
  Zap, 
  Sparkles, 
  Award, 
  TrendingUp, 
  BookOpen, 
  X,
  Target,
  FileText,
  CheckCircle2,
  Calendar,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Talent, NineBoxCell } from '../types';

interface TalentComparisonViewProps {
  talents: Talent[];
  onClear: () => void;
  lang: 'VI' | 'EN';
}

export default function TalentComparisonView({ talents, onClear, lang }: TalentComparisonViewProps) {
  if (talents.length !== 2) return null;
  const [t1, t2] = talents;

  // 1. HELPERS FOR 9-BOX DEVELOPMENT RECOMMENDATIONS
  const getCellLDPairing = (cell: NineBoxCell) => {
    switch (cell) {
      case 'Superstar':
        return {
          focus: lang === 'VI' ? 'Đường lăn kế cận cao cấp (Executive Succession)' : 'Executive Leadership Track',
          programs: lang === 'VI' 
            ? 'Chương trình Mini-MBA, thử thách dự án chiến lược toàn cầu, cử làm cố vấn chuyên môn cao' 
            : 'Executive coaching programs, global strategic task forces, executive-level sponsorship',
          timeline: lang === 'VI' ? 'Khẩn trương (3 - 6 tháng)' : 'Accelerated (3-6 Months)'
        };
      case 'Rising Star':
        return {
          focus: lang === 'VI' ? 'Mở rộng kỹ năng lãnh đạo & quản trị chéo bộ phận' : 'Cross-functional Leadership Capability',
          programs: lang === 'VI'
            ? 'Đào tạo kỹ năng quản lý dự án Agile, luân chuyển vị trí Section Lead, huấn luyện nhóm kế cận'
            : 'Agile core project leadership, department rotational programs, team coaching assignment',
          timeline: lang === 'VI' ? 'Trung hạn (6 - 12 tháng)' : 'Medium Term (6-12 Months)'
        };
      case 'High Professional':
        return {
          focus: lang === 'VI' ? 'Đóng góp năng lực chuyên môn sâu sắc & huấn luyện nội bộ' : 'Deep Domain Mastery & On-the-job Coaching',
          programs: lang === 'VI'
            ? 'Chứng chỉ chuyên môn cao cấp, thiết lập ma trận kỹ năng phòng ban, kỹ thuật chuyên môn cao'
            : 'Advanced technical certifications, departmental skill matrix deployment, technical curriculum advisor',
          timeline: lang === 'VI' ? 'Liên tục (1 năm)' : 'Ongoing (12 Months)'
        };
      case 'Seasoned Professional':
        return {
          focus: lang === 'VI' ? 'Không ngừng cải tiến hiệu quả hoạt động & tối ưu nguồn cung' : 'Efficiency Innovation & Subject Matter Expertise',
          programs: lang === 'VI'
            ? 'Đào tạo Kaizen/Six Sigma Green Belt, giao cải tiến quy trình nghiệp vụ nội bộ'
            : 'Lean Six Sigma training, process innovation ownership, institutional mentoring lead',
          timeline: lang === 'VI' ? 'Định kỳ (Hàng quý)' : 'Quarterly Cycles'
        };
      case 'Solid Professional':
      case 'Valued Contributor':
        return {
          focus: lang === 'VI' ? 'Khắc phục các lỗ hổng kỹ năng hiện tại & giữ chân lâu dài' : 'Competency Consolidation & Retention Drive',
          programs: lang === 'VI'
            ? 'Cải thiện kỹ năng mềm tự tin thuyết trình, tham gia khóa đào tạo nghiệp vụ cốt lõi mới'
            : 'Presentation soft-skills training, industry-specific refresher courses, peer pairing programs',
          timeline: lang === 'VI' ? 'Hàng năm' : 'Annual Cycle'
        };
      case 'Diamond in the Rough':
        return {
          focus: lang === 'VI' ? 'Khai phóng tiềm năng lãnh đạo cao bằng khắc phục kết quả công việc' : 'Remedying Performance Barriers to Unlock High Potential',
          programs: lang === 'VI'
            ? 'Đặt chỉ tiêu KPI sát sao hàng tháng, kèm cặp 1-1 tăng kỹ năng hành động, đánh giá định kỳ'
            : 'Strict monthly KPI alignment, close performance buddy pairing, 1-1 coaching, routine supervisor check-ins',
          timeline: lang === 'VI' ? 'Ngắn hạn (3 tháng)' : 'Short Term (3 Months)'
        };
      case 'Future Utility':
      case 'Learning Professional':
      default:
        return {
          focus: lang === 'VI' ? 'Tối ưu kỹ năng thực hành nghiệp vụ cơ bản & đào tạo bù đắp' : 'Fundamental Upskilling & Focused Performance Correction',
          programs: lang === 'VI'
            ? 'Đào tạo lại nội quy chính sách & kỹ thuật thực hành quy chuẩn, hướng dẫn kèm cặp sát sao'
            : 'L&D tailored basic training plan, rigorous SOP re-evaluations, high-frequency mentor supervision',
          timeline: lang === 'VI' ? 'Cấp bách (1 - 3 tháng)' : 'Urgent (1-3 Months)'
        };
    }
  };

  const rec1 = getCellLDPairing(t1.cell);
  const rec2 = getCellLDPairing(t2.cell);

  const getCellTranslation = (cell: NineBoxCell) => {
    if (lang !== 'VI') return cell;
    switch (cell) {
      case 'Seasoned Professional': return 'Nhân sự dày dặn';
      case 'High Professional': return 'Nhân sự xuất sắc';
      case 'Superstar': return 'Siêu sao';
      case 'Solid Professional': return 'Nhân sự vững vàng';
      case 'Valued Contributor': return 'Người đóng góp chủ lực';
      case 'Rising Star': return 'Ngôi sao đang lên';
      case 'Learning Professional': return 'Nhân sự cần hoàn thiện';
      case 'Future Utility': return 'Dự phòng tương lai';
      case 'Diamond in the Rough': return 'Kim cương thô';
      default: return cell;
    }
  };

  const getCellColorClassesLight = (cell: NineBoxCell) => {
    switch (cell) {
      case 'Superstar':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-350';
      case 'High Professional':
        return 'bg-teal-50 text-teal-800 border border-teal-350';
      case 'Rising Star':
        return 'bg-indigo-50 text-indigo-850 border border-indigo-350';
      case 'Seasoned Professional':
        return 'bg-blue-50 text-blue-800 border border-blue-350';
      case 'Solid Professional':
        return 'bg-sky-50 text-sky-800 border border-sky-350';
      case 'Valued Contributor':
        return 'bg-amber-50 text-amber-850 border border-amber-350';
      case 'Diamond in the Rough':
        return 'bg-pink-50 text-pink-850 border border-pink-350';
      case 'Future Utility':
        return 'bg-purple-50 text-purple-850 border border-purple-350';
      case 'Learning Professional':
      default:
        return 'bg-rose-50 text-rose-850 border border-rose-350';
    }
  };

  // 2. COMPETENCY GENERATOR ENGINE BASE ON 9-BOX PROPERTIES
  const getCompetencyScores = (talent: Talent) => {
    let strat = 55;
    let tech = 60;
    let lead = 50;
    let exec = 60;
    let soft = 55;
    let adapt = 55;

    // Potential Adjustment
    if (talent.potential === 'High') {
      strat += 30;
      adapt += 30;
      lead += 20;
    } else if (talent.potential === 'Mid') {
      strat += 15;
      adapt += 15;
      lead += 5;
    } else {
      strat += 0;
      adapt += 5;
    }

    // Results/Performance Adjustment
    if (talent.results === 'High Effective') {
      exec += 30;
      tech += 25;
      soft += 15;
    } else if (talent.results === 'Effective') {
      exec += 20;
      tech += 15;
      soft += 5;
    } else {
      exec += 5;
      tech += 2;
    }

    // Grid Cell Adjustment
    switch (talent.cell) {
      case 'Superstar':
        lead = 95; soft = 90; strat = 95; adapt = 95;
        break;
      case 'Rising Star':
        lead = 90; soft = 85; strat = 85; adapt = 92;
        break;
      case 'High Professional':
        tech = 98; lead = 72; soft = 78; strat = 70;
        break;
      case 'Seasoned Professional':
        tech = 95; exec = 95; lead = 68; soft = 75;
        break;
      case 'Solid Professional':
        tech = 80; exec = 80; soft = 65; lead = 60;
        break;
      case 'Valued Contributor':
        tech = 76; exec = 75; soft = 78; lead = 70;
        break;
      case 'Diamond in the Rough':
        strat = 88; adapt = 90; exec = 45; tech = 60; soft = 70;
        break;
      case 'Learning Professional':
        tech = 48; exec = 45; lead = 40; soft = 50; adapt = 50;
        break;
      case 'Future Utility':
        strat = 60; adapt = 68; tech = 42; exec = 45;
        break;
    }

    const clamp = (val: number) => Math.max(25, Math.min(100, val));
    return {
      strat: clamp(strat),
      tech: clamp(tech),
      lead: clamp(lead),
      exec: clamp(exec),
      soft: clamp(soft),
      adapt: clamp(adapt),
    };
  };

  const scores1 = useMemo(() => getCompetencyScores(t1), [t1]);
  const scores2 = useMemo(() => getCompetencyScores(t2), [t2]);

  // Symmetrical Skills Radar dataset
  const radarData = useMemo(() => {
    return [
      {
        subject: lang === 'VI' ? 'Chiến lược (Strategy)' : 'Strategic Vision',
        A: scores1.strat,
        B: scores2.strat,
      },
      {
        subject: lang === 'VI' ? 'Chuyên môn (Technical)' : 'Technical/Domain',
        A: scores1.tech,
        B: scores2.tech,
      },
      {
        subject: lang === 'VI' ? 'Lãnh đạo (Leadership)' : 'Team Leadership',
        A: scores1.lead,
        B: scores2.lead,
      },
      {
        subject: lang === 'VI' ? 'Thích ứng (Adaptability)' : 'Adaptability',
        A: scores1.adapt,
        B: scores2.adapt,
      },
      {
        subject: lang === 'VI' ? 'Kỹ năng mềm (Soft Skills)' : 'Soft Skills',
        A: scores1.soft,
        B: scores2.soft,
      },
      {
        subject: lang === 'VI' ? 'Thực thi (Execution)' : 'Execution/Results',
        A: scores1.exec,
        B: scores2.exec,
      },
    ];
  }, [scores1, scores2, lang]);

  // Compute biggest gap
  const gapAnalysis = useMemo(() => {
    const list = radarData.map(d => {
      const diff = d.A - d.B;
      return {
        subject: d.subject,
        abs: Math.abs(diff),
        leader: diff > 0 ? t1.name : t2.name,
        follower: diff > 0 ? t2.name : t1.name,
      };
    });
    list.sort((a, b) => b.abs - a.abs);
    return list[0] || null;
  }, [radarData, t1, t2]);

  // Cross correlation indicators
  const isDeptMatch = t1.dept.trim().toLowerCase() === t2.dept.trim().toLowerCase();
  const isCellMatch = t1.cell === t2.cell;
  const isGroupMatch = t1.group === t2.group;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] overflow-y-auto font-sans">
      <div className="bg-white text-slate-800 rounded-3xl max-w-6xl w-full border border-slate-200/90 shadow-2xl relative overflow-hidden flex flex-col my-4 animate-in zoom-in-95 duration-200">
        
        {/* LIGHT THEMED HEADER BAR */}
        <div className="relative px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-2xs">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider block">
                {lang === 'VI' ? 'MODULE SO SÁNH PROFILE SONG SONG' : 'SIDE-BY-SIDE ANALYTICS MODULE'}
              </span>
              <h3 className="text-base font-extrabold tracking-tight font-display text-slate-900 leading-tight">
                {lang === 'VI' ? 'ĐỐI CHIẾU THÔNG TIN & ĐÁNH GIÁ NĂNG LỰC' : 'SIDE-BY-SIDE INTERVENTION PROFILE COMPARE'}
              </h3>
            </div>
          </div>
          
          <button 
            onClick={onClear}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl cursor-pointer transition-all duration-150 border border-slate-205"
            title={lang === 'VI' ? 'Đóng so sánh' : 'Close comparison'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WORKSPACE AREA (SCROLLABLE & LIGHT INTERFACE) */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
          
          {/* Quick Cross-correlation indicators with sharp contrasting borders */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-slate-700">
                {lang === 'VI' ? 'Tổng quan đối chiếu:' : 'Dynamic assessment cross correlation:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5 text-[11px]">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-medium ${
                isDeptMatch 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
                  : 'bg-rose-50 text-rose-800 border-rose-250'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDeptMatch ? 'bg-emerald-550' : 'bg-rose-505'}`} />
                <span>
                  {lang === 'VI' 
                    ? isDeptMatch ? 'Cùng bộ phận' : 'Khác bộ phận'
                    : isDeptMatch ? 'Same Department' : 'Different Department'}
                </span>
              </span>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-medium ${
                isCellMatch 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
                  : 'bg-indigo-50 text-indigo-850 border-indigo-250'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCellMatch ? 'bg-emerald-555' : 'bg-indigo-555'}`} />
                <span>
                  {lang === 'VI'
                    ? isCellMatch ? 'Cùng thứ hạng 9-Box' : 'Khác biệt thứ hạng 9-Box'
                    : isCellMatch ? 'Identical 9-Box Cell' : 'Distinct 9-Box Quadrants'}
                </span>
              </span>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-medium ${
                isGroupMatch 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
                  : 'bg-amber-50 text-amber-800 border-amber-250'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isGroupMatch ? 'bg-emerald-555' : 'bg-amber-555'}`} />
                <span>
                  {lang === 'VI'
                    ? isGroupMatch ? 'Cùng nhóm chiến lược' : 'Khác biệt vị thế chiến lược'
                    : isGroupMatch ? 'Same Strategic Group' : 'Different Strategic Groups'}
                </span>
              </span>
            </div>
          </div>

          {/* TWO-COLUMN GRID splits visually table and radar to prevent fatigue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: CRISP PARALLEL TABLE COMPARISON */}
            <div className="lg:col-span-7 space-y-4">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-3xs">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-205">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[26%]">
                        {lang === 'VI' ? 'CHỈ SỐ SO SÁNH' : 'INDICATOR'}
                      </th>
                      <th className="px-4 py-3 border-l border-slate-200/80 w-[37%] bg-indigo-50/20">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-5 bg-indigo-500 rounded-full shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider block leading-none mb-0.5">
                              {lang === 'VI' ? 'NHÂN SỰ A' : 'PERSONNEL A'}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-xs truncate leading-tight">{t1.name}</h4>
                          </div>
                        </div>
                      </th>
                      <th className="px-4 py-3 border-l border-slate-200/80 w-[37%] bg-teal-50/15">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-5 bg-teal-500 rounded-full shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[9px] text-teal-600 font-bold uppercase tracking-wider block leading-none mb-0.5">
                              {lang === 'VI' ? 'NHÂN SỰ B' : 'PERSONNEL B'}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-xs truncate leading-tight">{t2.name}</h4>
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                    
                    {/* Dept */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 bg-slate-50/40 text-slate-600 font-bold flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{lang === 'VI' ? 'Phòng ban' : 'Department'}</span>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150 text-slate-800 font-mono font-bold uppercase text-[10.5px]">
                        {t1.dept}
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150 text-slate-800 font-mono font-bold uppercase text-[10.5px]">
                        {t2.dept}
                      </td>
                    </tr>

                    {/* Cell 9Box */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 bg-slate-50/40 text-slate-600 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lang === 'VI' ? 'Vị trí 9-Box' : '9-Box Quadrant'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold inline-block tracking-tight ${getCellColorClassesLight(t1.cell)}`}>
                          {getCellTranslation(t1.cell)}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold inline-block tracking-tight ${getCellColorClassesLight(t2.cell)}`}>
                          {getCellTranslation(t2.cell)}
                        </span>
                      </td>
                    </tr>

                    {/* Group */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 bg-slate-50/40 text-slate-600 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lang === 'VI' ? 'Lớp Quy hoạch' : 'Strategic Group'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase inline-block ${
                          t1.group === 'Growers' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-250' 
                            : t1.group === 'Keepers' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-250' 
                            : 'bg-rose-100 text-rose-800 border border-rose-250'
                        }`}>
                          {lang === 'VI' 
                            ? t1.group === 'Growers' ? 'Phát triển (Growers)' : t1.group === 'Keepers' ? 'Duy trì (Keepers)' : 'Mover (Sắp xếp)'
                            : t1.group}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase inline-block ${
                          t2.group === 'Growers' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-250' 
                            : t2.group === 'Keepers' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-250' 
                            : 'bg-rose-100 text-rose-800 border border-rose-250'
                        }`}>
                          {lang === 'VI' 
                            ? t2.group === 'Growers' ? 'Phát triển (Growers)' : t2.group === 'Keepers' ? 'Duy trì (Keepers)' : 'Mover (Sắp xếp)'
                            : t2.group}
                        </span>
                      </td>
                    </tr>

                    {/* Performance */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 bg-slate-50/40 text-slate-600 font-bold">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lang === 'VI' ? 'Hiệu suất thực tế' : 'Performance Level'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold inline-block ${
                          t1.results === 'High Effective' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : t1.results === 'Effective' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-250' 
                            : 'bg-rose-100 text-rose-800 border border-rose-250'
                        }`}>
                          {lang === 'VI'
                            ? t1.results === 'High Effective' ? 'Hiệu quả cao' : t1.results === 'Effective' ? 'Hiệu quả' : 'Kém hiệu quả'
                            : t1.results}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold inline-block ${
                          t2.results === 'High Effective' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : t2.results === 'Effective' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-250' 
                            : 'bg-rose-100 text-rose-800 border border-rose-250'
                        }`}>
                          {lang === 'VI'
                            ? t2.results === 'High Effective' ? 'Hiệu quả cao' : t2.results === 'Effective' ? 'Hiệu quả' : 'Kém hiệu quả'
                            : t2.results}
                        </span>
                      </td>
                    </tr>

                    {/* Potential */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 bg-slate-50/40 text-slate-600 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lang === 'VI' ? 'Mức tiềm năng' : 'Potential Criteria'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold inline-block ${
                          t1.potential === 'High' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : t1.potential === 'Mid' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-250' 
                            : 'bg-rose-100 text-rose-800 border border-rose-250'
                        }`}>
                          {lang === 'VI'
                            ? t1.potential === 'High' ? 'Cao' : t1.potential === 'Mid' ? 'Trung bình' : 'Thấp'
                            : t1.potential}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold inline-block ${
                          t2.potential === 'High' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : t2.potential === 'Mid' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-250' 
                            : 'bg-rose-100 text-rose-800 border border-rose-250'
                        }`}>
                          {lang === 'VI'
                            ? t2.potential === 'High' ? 'Cao' : t2.potential === 'Mid' ? 'Trung bình' : 'Thấp'
                            : t2.potential}
                        </span>
                      </td>
                    </tr>

                    {/* Growth Focus */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 bg-slate-50/40 text-slate-600 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lang === 'VI' ? 'Trọng tâm L&D' : 'L&D Focus Area'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150 font-sans text-[11px] text-slate-800 font-medium leading-relaxed">
                        <div className="font-extrabold text-indigo-900 mb-0.5">{rec1.focus}</div>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150 font-sans text-[11px] text-slate-800 font-medium leading-relaxed">
                        <div className="font-extrabold text-teal-900 mb-0.5">{rec2.focus}</div>
                      </td>
                    </tr>

                    {/* Mentoring programs with soft styled highlight cards */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 bg-slate-50/40 text-slate-600 font-bold">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lang === 'VI' ? 'Chương trình đề xuất' : 'Proposed Action'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <div className="bg-indigo-50/40 border border-indigo-100 p-2.5 rounded-lg text-[10.5px] text-slate-700 leading-normal">
                          <div className="text-[10px] uppercase font-bold text-indigo-700 mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>{lang === 'VI' ? 'PHÁT TRIỂN A' : 'DEVELOPMENT A'}</span>
                          </div>
                          {rec1.programs}
                        </div>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <div className="bg-teal-50/30 border border-teal-100/80 p-2.5 rounded-lg text-[10.5px] text-slate-700 leading-normal">
                          <div className="text-[10px] uppercase font-bold text-teal-700 mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>{lang === 'VI' ? 'PHÁT TRIỂN B' : 'DEVELOPMENT B'}</span>
                          </div>
                          {rec2.programs}
                        </div>
                      </td>
                    </tr>

                    {/* Duration / Timeline */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 bg-slate-50/40 text-slate-600 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lang === 'VI' ? 'Thời hạn thực thi' : 'Implementation'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10.5px]">
                          ⏱️ {rec1.timeline}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-l border-slate-150">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200/80 font-bold text-[10.5px]">
                          ⏱️ {rec2.timeline}
                        </span>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Textual gap insights review panel */}
              {gapAnalysis && (
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs text-slate-700 space-y-1.5 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                    <FileText className="w-12 h-12 text-amber-600" />
                  </div>
                  <h5 className="text-[11px] uppercase font-black tracking-wider text-amber-800 flex items-center gap-1.5 font-display">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{lang === 'VI' ? 'PHÂN TÍCH SUY LUẬN CHÊNH LỆCH KỸ NĂNG CHỦ CHỐT' : 'KEY SKILL GAP ANALYTIC INSIGHT'}</span>
                  </h5>
                  <p className="leading-relaxed font-sans text-slate-700 text-[11px]">
                    {lang === 'VI' ? (
                      <>
                        Sự chênh lệch phát triển lớn nhất giữa 2 bên ứng phó ở cột tiêu chí <strong>{gapAnalysis.subject}</strong> (mức lệch khoảng {gapAnalysis.abs} điểm). Trong đó, nhân sự <strong>{gapAnalysis.leader}</strong> thể hiện chỉ số vượt trội hơn so với <strong>{gapAnalysis.follower}</strong>. Khuyến nghị áp dụng mô hình liên kết kèm cặp chéo (Peer-Buddy Mentorship) để tối ưu tiến bồi dưỡng nội bộ.
                      </>
                    ) : (
                      <>
                        The most significant talent divergence is found in <strong>{gapAnalysis.subject}</strong> (variance gap of {gapAnalysis.abs} points). <strong>{gapAnalysis.leader}</strong> exhibits advanced proficiency compared to <strong>{gapAnalysis.follower}</strong>. Empower functional integration with buddy pairing to fast-track organic knowledge sharing.
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* COLUMN 2: CUSTOM COMPETENCY RADAR VISUAL BLOCK WITH SEPARATED CARD LAYOUT */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Radar Chart Container (Soft White Canvas with Slate boundaries) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-3xs flex flex-col justify-between h-[340px]">
                <div className="text-left mb-2">
                  <span className="text-[9px] text-indigo-600 font-extrabold uppercase tracking-widest block font-mono">
                    {lang === 'VI' ? 'BẢN ĐỒ KỸ NĂNG SO SÁNH' : 'RADAR SYSTEM PROFILE MAP'}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{lang === 'VI' ? 'Đồ thị Sai biệt Năng lực Chỉ đạo' : 'Visual Competency Delta Map'}</span>
                  </h4>
                </div>

                <div className="h-[260px] w-full text-[9px] relative flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#475569', fontSize: 8.5, fontWeight: 700 }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: '#64748b', fontSize: 8 }}
                      />
                      
                      {/* Radar for Talent A */}
                      <Radar 
                        name={t1.name} 
                        dataKey="A" 
                        stroke="#4f46e5" 
                        fill="#4f46e5" 
                        fillOpacity={0.16} 
                        strokeWidth={2}
                      />
                      
                      {/* Radar for Talent B */}
                      <Radar 
                        name={t2.name} 
                        dataKey="B" 
                        stroke="#0d9488" 
                        fill="#0d9488" 
                        fillOpacity={0.16} 
                        strokeWidth={2}
                      />

                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: 'none', 
                          borderRadius: '8px', 
                          color: '#f8fafc',
                          fontSize: '10px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }} 
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Structural Planner Action Advice Notes Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 text-left space-y-2.5">
                <span className="text-[10px] uppercase font-extrabold text-slate-500 block tracking-wider font-mono">
                  {lang === 'VI' ? 'ĐỊNH HƯỚNG BỒI DƯỠNG LIÊN KẾT' : 'CROSS-DEVELOPMENT PROTOCOLS'}
                </span>
                
                <div className="space-y-2">
                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-250 flex items-center justify-center shrink-0 text-indigo-600 font-extrabold text-[10px]">
                      1
                    </div>
                    <div className="text-[11px] leading-relaxed">
                      <strong>
                        {lang === 'VI' 
                          ? `Uỷ thác và Giao quyền cho ${t1.name}` 
                          : `Succession Assignment for ${t1.name}`}
                      </strong>: {lang === 'VI' 
                        ? `Đặt mục tiêu rèn luyện tập trung vào nhóm chương trình đề xuất đối ứng (${rec1.focus}). Công việc liên kết đòi hỏi năng lực chéo.`
                        : `Empower candidate actions with immediate intervention programs for (${rec1.focus}). Core alignment with targeted pipeline.`}
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-md bg-teal-50 border border-teal-205 flex items-center justify-center shrink-0 text-teal-700 font-extrabold text-[10px]">
                      2
                    </div>
                    <div className="text-[11px] leading-relaxed">
                      <strong>
                        {lang === 'VI' 
                          ? `Theo dõi & Đôn đốc ${t2.name}` 
                          : `Supervision Framework for ${t2.name}`}
                      </strong>: {lang === 'VI'
                        ? `Thiết lập chu kỳ kiểm soát tiến độ đặc thù (${rec2.timeline}) để kiểm định năng lực thực tiễn và cam kết nội bộ.`
                        : `Apply structured evaluations of (${rec2.timeline}) parameters to verify practical execution and track development goals.`}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* CONTROLS BAR IN LIGHT-ACCENT THEME */}
        <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {lang === 'VI' ? 'Dữ liệu đối chiếu đồng bộ thành công' : 'Two profiles successfully selected for matching review'}
            </span>
          </div>
          
          <button
            onClick={onClear}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all duration-150 cursor-pointer shadow-md shadow-indigo-600/10 flex items-center gap-1.5"
          >
            <span>{lang === 'VI' ? 'Đóng đối chiếu' : 'Close Comparison'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
