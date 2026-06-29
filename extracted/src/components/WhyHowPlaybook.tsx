import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Lightbulb, Target } from 'lucide-react';

interface WhyHowPlaybookProps {
  featureKey: '9box' | 'pipeline' | 'devplan' | 'idp';
  lang: 'VI' | 'EN';
  isLdMode?: boolean;
  selectedSite?: 'MLN' | 'WNK';
}

export default function WhyHowPlaybook({ featureKey, lang, isLdMode = false, selectedSite = 'MLN' }: WhyHowPlaybookProps) {
  const [isOpen, setIsOpen] = useState(true);

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-amber-400 font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderFormattedParagraphs = (text: string, dotColorClass: string = "text-amber-400") => {
    return text.split('\n').map((line, lineIdx) => {
      if (!line.trim()) return null;
      // Strip leading bullets if any
      const cleanedLine = line.replace(/^[•\-\*✦]\s*/, '');
      return (
        <div key={lineIdx} className="flex items-start gap-2 text-[12px] leading-relaxed text-slate-200 mt-2 first:mt-0">
          <span className={`${dotColorClass} mt-1 font-sans text-xs select-none shrink-0`}>✦</span>
          <span className="flex-1 font-medium">{renderFormattedText(cleanedLine)}</span>
        </div>
      );
    });
  };

  const content = {
    '9box': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — MA TRẬN PHÁT TRIỂN TÀI NĂNG 9-BOX',
      titleEn: 'MANAGEMENT PLAYBOOK — 9-BOX TALENT ALIGNMENT',
      
      whyTitleVi: 'Tầm nhìn & Ý nghĩa',
      whyTitleEn: 'Vision & Purpose',
      whyVi: 'Đưa ra **bức tranh khách quan, khoa học** về sức mạnh thực tế của đội ngũ.\nĐánh giá toàn diện dựa trên hai chiều cốt lõi: **Tiêu điểm Tiềm năng học tập** (Learning Agility) và **Hiệu quả Đóng góp thực tế** (Performance).',
      whyEn: 'Provides an **objective, data-driven assessment** of workforce strength.\nEvaluates capabilities along two primary axes: **Learning Agility** (potential) and **Actual Contribution** (performance).',
      
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Target',
      goalVi: 'Định vị rõ nét **3 nhóm chiến lược hạt nhân**: **Growers** (Hạt giống bồi dưỡng), **Keepers** (Trụ cột vận hành), và **Movers** (Nhóm cần cơ cấu lại).\nTối ưu hóa việc phân bổ nguồn lực bồi dưỡng và quy hoạch phát triển nhân tài chính xác.',
      goalEn: 'Clearly isolate **3 critical talent cohorts**: **Growers** (High potential), **Keepers** (Operational anchors), and **Movers** (Transitioning candidates).\nDeploy corporate developmental efforts effectively to secure high-performance delivery.',
      
      howTitleVi: 'Các bước hành động của Quản lý',
      howTitleEn: 'Actionable Steps',
      howVi: [
        'Quan sát tỷ lệ phân bổ trên **Ma trận 9 Ô** để kiểm tra ngay "sức khỏe" nhân sự phòng ban.',
        '**Nhấp chuột trực tiếp** vào các thẻ ô 9-box hoặc chỉ số để xem danh sách nhân sự tương ứng.',
        'Phân tích **hồ sơ năng lực chuyên sâu** của từng thành viên để có quyết định giao việc & quy hoạch kế thừa chính xác.'
      ],
      howEn: [
        'Study density distribution across the **9-Cell Grid** to verify overall talent pipeline health.',
        '**Click directly** on any 9-box card or summary indicator to filter the matching employee list.',
        'Review **detailed competence profiles** and comments to optimize workload distribution and mentorship.'
      ]
    },
    'pipeline': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — QUY HOẠCH KẾ THỪA SUCCESSION PIPELINE',
      titleEn: 'MANAGEMENT PLAYBOOK — CRITICAL SUCCESSION PIPELINE',
      
      whyTitleVi: 'Tầm nhìn & Ý nghĩa',
      whyTitleEn: 'Vision & Purpose',
      whyVi: 'Sự biến động đột xuất của nhân sự cốt cán là rủi ro vận hành lớn nhất cho tổ chức.\nQuy hoạch kế thừa đảm bảo **tính liên tục kinh doanh (Business Continuity)** và bảo vệ tài sản tri thức phòng ban.',
      whyEn: 'Unexpected attrition in key roles is a major operating risk.\nSuccession planning safeguards **Business Continuity** and retains invaluable department knowledge.',
      
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Target',
      goalVi: 'Bảo vệ và củng cố vững chắc **72 vị trí lãnh đạo then chốt** của doanh nghiệp.\nXây dựng tuyến **Successor Bench** (bể dự bị kế thừa) chất lượng cao ở cả ngắn, trung và dài hạn.',
      goalEn: 'Shield and fortify **72 key leadership roles** with high-quality candidates.\nConstruct robust **Successor Benches** across short, medium, and long-term readiness milestones.',
      
      howTitleVi: 'Các bước hành động của Quản lý',
      howTitleEn: 'Actionable Steps',
      howVi: [
        'Duyệt **Sơ đồ kế thừa bộ phận** để nhận diện ngay các vị trí cốt lõi đang "trống" hoặc "thiếu người thay thế".',
        'Theo dõi **chỉ số tiến độ sẵn sàng** để giao thêm các dự án thử thách hoặc chương trình shadowing.',
        'Phối hợp với HRBP xây dựng **kế hoạch giữ chân khẩn cấp** đối với nhân sự có rủi ro rời bỏ cao.'
      ],
      howEn: [
        'Review the **Departmental succession chart** to spot critical roles currently "vacant" or "at risk".',
        'Monitor **readiness progress scores** to assign stretch assignments or shadowing opportunities.',
        'Partner with HRBP to initiate **proactive retention strategies** for key flight-risk talents.'
      ]
    },
    'devplan': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — KẾ HOẠCH BỒI DƯỠNG TIÊU ĐIỂM',
      titleEn: 'MANAGEMENT PLAYBOOK — TARGETED LEARNING CURRICULUMS',
      
      whyTitleVi: 'Tầm nhìn & Ý nghĩa',
      whyTitleEn: 'Vision & Purpose',
      whyVi: 'Xóa bỏ hoàn toàn việc cử đi học dàn trải, không sát thực tế gây lãng phí nguồn lực.\nBiến chương trình đào tạo nội bộ thành **vũ khí gia tăng năng suất trực tiếp** cho đội ngũ.',
      whyEn: 'Eliminate generalized, low-impact training that wastes resources.\nTransform corporate learning into a **direct driver of team performance**.',
      
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Target',
      goalVi: 'Tổng hợp các khoảng hụt năng lực cốt lõi từ kết quả đánh giá 9-Box thực tế.\nTập trung nguồn lực bồi dưỡng tổ chức các **chương trình đào tạo tập trung có độ ưu tiên cao nhất**.',
      goalEn: 'Aggregate shared competency gaps from 9-box evaluations to allocate resources.\nOrganize **centralized, high-priority learning curriculums** that solve immediate bottlenecks.',
      
      howTitleVi: 'Các bước hành động của Quản lý',
      howTitleEn: 'Actionable Steps',
      howVi: [
        'Đọc **Biểu đồ nhu cầu** để thấy kỹ năng nào đang thiếu hụt lớn nhất tại bộ phận mình phụ trách.',
        'Xem xét giáo trình, thời lượng, và lịch học dự kiến để **sắp xếp phân bổ ca kíp hợp lý** cho nhân viên.',
        'Phối hợp chặt chẽ cùng ban L&D để **thúc đẩy tỷ lệ hoàn thành đào tạo** đúng hạn theo từng quý.'
      ],
      howEn: [
        'Study the **Demand Chart** to immediately detect the most severe skill gaps in your business unit.',
        'Inspect course syllabi, duration, and schedules to **optimize shift layouts** and workload.',
        'Collaborate with L&D team to **drive and monitor quarterly completion rates**.'
      ]
    },
    'idp': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — KẾ HOẠCH HÀNH ĐỘNG CÁ NHÂN (IDP)',
      titleEn: 'MANAGEMENT PLAYBOOK — INDIVIDUAL DEVELOPMENT PLANS',
      
      whyTitleVi: 'Tầm nhìn & Ý nghĩa',
      whyTitleEn: 'Vision & Purpose',
      whyVi: 'Kế hoạch phát triển nhân tài chỉ thành công khi được cụ thể hóa thành hành động.\nThiết lập **cam kết hành động riêng biệt** kết nối năng lực thiếu hụt với nhiệm vụ thực chiến của từng người.',
      whyEn: 'Talent development succeeds only when translated into actionable commitments.\nEstablish **individualized action plans** linking competency gaps with practical stretch duties.',
      
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Target',
      goalVi: 'Xây dựng lộ trình bồi dưỡng cá nhân hóa chất lượng cao cho nhân sự kế nhiệm.\nKết hợp chặt chẽ giữa **Nhiệm vụ thực tế** (Job Duty), **Mentor/Coach đồng hành**, và **lịch kèm cặp 1-1**.',
      goalEn: 'Establish highly personalized progress tracks for successor benches.\nTightly couple **Practical Job Duties**, **Assigned Mentors/Coaches**, and **1-to-1 feedback loops**.',
      
      howTitleVi: 'Các bước hành động của Quản lý',
      howTitleEn: 'Actionable Steps',
      howVi: [
        'Tìm kiếm và xem chi tiết **lộ trình IDP cá nhân** của từng nhân sự kế nhiệm trong bộ phận.',
        'Đánh giá tính phù hợp của các **nhiệm vụ được gán**, thời hạn sẵn sàng và vai trò người cố vấn.',
        'Lồng ghép trao đổi tiến độ IDP vào **các buổi trò chuyện 1-1 hàng tuần** để tháo gỡ khó khăn kịp thời.'
      ],
      howEn: [
        'Search and explore the **individualized IDP roadmap** of each successor in your department.',
        'Review the appropriateness of **assigned job duties**, readiness timelines, and mentor guidance.',
        'Incorporate IDP milestones into **weekly 1-to-1 alignment chats** to eliminate obstacles.'
      ]
    }
  };

  const item = content[featureKey];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-indigo-900/60 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Decorative ambient background glowing circles */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Toggle */}
      <div className="flex items-center justify-between gap-4 border-b border-indigo-900/40 pb-4">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 text-indigo-300 shadow-inner">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm md:text-base font-extrabold tracking-wide text-white uppercase font-sans">
              {lang === 'VI' ? item.titleVi : item.titleEn}
            </h4>
            <p className="text-[10px] text-indigo-400/90 uppercase tracking-widest font-mono font-bold mt-1">
              🚀 {lang === 'VI' ? 'Khung hành động & Định hướng chiến lược của Quản lý' : 'Management Framework & Strategic Alignment'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105"
          title={lang === 'VI' ? 'Thu gọn / Mở rộng hướng dẫn' : 'Collapse / Expand Playbook'}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-in fade-in duration-300">
          {/* Tầm nhìn & Ý nghĩa Card */}
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-indigo-950/60 hover:border-amber-500/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-indigo-950/80 pb-2.5">
                <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold uppercase text-amber-400 tracking-wider font-mono">
                  {lang === 'VI' ? item.whyTitleVi : item.whyTitleEn}
                </h5>
              </div>
              <div className="space-y-2">
                {renderFormattedParagraphs(lang === 'VI' ? item.whyVi : item.whyEn, "text-amber-400")}
              </div>
            </div>
          </div>

          {/* Mục tiêu chiến lược Card */}
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-indigo-950/60 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition-all" />
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-indigo-950/80 pb-2.5">
                <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                  <Target className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold uppercase text-indigo-300 tracking-wider font-mono">
                  {lang === 'VI' ? item.goalTitleVi : item.goalTitleEn}
                </h5>
              </div>
              <div className="space-y-2">
                {renderFormattedParagraphs(
                  (lang === 'VI' ? item.goalVi : item.goalEn).replace('72', selectedSite === 'WNK' ? '56' : '72'),
                  "text-indigo-400"
                )}
              </div>
            </div>
          </div>

          {/* Các bước hành động Card */}
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-indigo-950/60 hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-indigo-950/80 pb-2.5">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold uppercase text-emerald-400 tracking-wider font-mono">
                  {lang === 'VI' ? item.howTitleVi : item.howTitleEn}
                </h5>
              </div>
              <ul className="space-y-2.5">
                {(lang === 'VI' ? item.howVi : item.howEn).map((step, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-slate-200">
                    <span className="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 border border-emerald-500/20 mt-0.5 shadow-xs">
                      {index + 1}
                    </span>
                    <span className="flex-1 font-semibold">{renderFormattedText(step)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
