import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Lightbulb, Target } from 'lucide-react';

interface WhyHowPlaybookProps {
  featureKey: '9box' | 'pipeline' | 'devplan' | 'idp';
  lang: 'VI' | 'EN';
  isLdMode?: boolean;
  selectedSite?: 'MLN' | 'WNK' | 'ASH';
}

export default function WhyHowPlaybook({ featureKey, lang, isLdMode = false, selectedSite = 'MLN' }: WhyHowPlaybookProps) {
  const [isOpen, setIsOpen] = useState(false);

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-amber-600 font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderFormattedParagraphs = (text: string, dotColorClass: string = "text-amber-500") => {
    return text.split('\n').map((line, lineIdx) => {
      if (!line.trim()) return null;
      const cleanedLine = line.replace(/^[•\-\*✦]\s*/, '');
      return (
        <div key={lineIdx} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-slate-700 mt-1.5 first:mt-0">
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
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — QUY HOẠCH KẾ THỪA NHÂN SỰ',
      titleEn: 'MANAGEMENT PLAYBOOK — CRITICAL SUCCESSION PLANNING',
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
    <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400" />

      {/* Header and Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-indigo-50/50 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl border border-indigo-200 text-indigo-600 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[11px] md:text-xs font-black tracking-widest text-indigo-800 uppercase font-mono">
              {lang === 'VI' ? item.titleVi : item.titleEn}
            </h4>
            <p className="text-[9.5px] text-indigo-500 uppercase tracking-wider font-bold mt-0.5">
              🚀 {lang === 'VI' ? 'Khung hành động & Định hướng chiến lược của Quản lý' : 'Management Framework & Strategic Alignment'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider hidden sm:block">
            {isOpen ? (lang === 'VI' ? 'Thu gọn' : 'Collapse') : (lang === 'VI' ? 'Xem hướng dẫn' : 'View guide')}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-indigo-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-left animate-in fade-in duration-200 border-t border-indigo-100">
          {/* Tầm nhìn & Ý nghĩa Card */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
              <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 border border-amber-200 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h5 className="text-[10px] font-black uppercase text-amber-700 tracking-widest font-mono">
                {lang === 'VI' ? item.whyTitleVi : item.whyTitleEn}
              </h5>
            </div>
            <div className="space-y-1.5">
              {renderFormattedParagraphs(lang === 'VI' ? item.whyVi : item.whyEn, "text-amber-500")}
            </div>
          </div>

          {/* Mục tiêu chiến lược Card */}
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 pb-2 border-b border-indigo-200">
              <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600 border border-indigo-200 shrink-0">
                <Target className="w-3.5 h-3.5" />
              </div>
              <h5 className="text-[10px] font-black uppercase text-indigo-700 tracking-widest font-mono">
                {lang === 'VI' ? item.goalTitleVi : item.goalTitleEn}
              </h5>
            </div>
            <div className="space-y-1.5">
              {renderFormattedParagraphs(
                (lang === 'VI' ? item.goalVi : item.goalEn).replace('72', selectedSite === 'WNK' ? '56' : '72'),
                "text-indigo-500"
              )}
            </div>
          </div>

          {/* Các bước hành động Card */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
              <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600 border border-emerald-200 shrink-0">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <h5 className="text-[10px] font-black uppercase text-emerald-700 tracking-widest font-mono">
                {lang === 'VI' ? item.howTitleVi : item.howTitleEn}
              </h5>
            </div>
            <ul className="space-y-2">
              {(lang === 'VI' ? item.howVi : item.howEn).map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-slate-700">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 font-black font-mono text-[9px] flex items-center justify-center shrink-0 border border-emerald-200 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="flex-1 font-medium">{renderFormattedText(step)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}