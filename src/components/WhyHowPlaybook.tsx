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
      const cleanedLine = line.replace(/^[•\-\*✦]\s*/, '');
      return (
        <div key={lineIdx} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-slate-200 mt-1.5 first:mt-0">
          <span className={`${dotColorClass} mt-1 font-sans text-xs select-none shrink-0`}>✦</span>
          <span className="flex-1 font-medium">{renderFormattedText(cleanedLine)}</span>
        </div>
      );
    });
  };

  const content = {
    '9box': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — MA TRẬN ĐÁNH GIÁ NHÂN TÀI 9 Ô',
      titleEn: 'MANAGEMENT GUIDE — 9-BOX TALENT REVIEW MATRIX',

      whyTitleVi: 'Tầm nhìn & Ý nghĩa',
      whyTitleEn: 'Vision & Purpose',
      whyVi: 'Ma trận 9 ô là **công cụ Quản lý Nhân tài** được sử dụng để đánh giá và phân loại nhân viên dựa trên hai tiêu chí: **Hiệu suất** và **Tiềm năng**.\nGiúp Quản lý đưa ra các quyết định **đầu tư và phát triển nhân tài** một cách chiến lược, đảm bảo có lộ trình đào tạo và phát triển hiệu quả cho đội ngũ kế thừa.',
      whyEn: 'The 9-Box Matrix is a **Talent Management tool** used to assess and categorize employees based on two criteria: **Performance** and **Potential**.\nHelps leaders make **strategic talent investment and development decisions**, ensuring a robust leadership pipeline for the future.',

      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Target',
      goalVi: 'Xác định rõ **3 nhóm chiến lược**: **Growers** (Tiềm năng phát triển), **Keepers** (Nhân sự chủ lực ổn định), **Movers** (Nhân sự cần bố trí lại vị trí).\nTạo bức tranh tổng thể về trạng thái nhân tài và rủi ro, từ đó có **hành động theo dõi và can thiệp kịp thời** tránh "khoảng trống" ở các vị trí Then chốt.',
      goalEn: 'Clearly identify **3 strategic groups**: **Growers** (High potential), **Keepers** (Stable core performers), **Movers** (Needs repositioning).\nCreate a comprehensive overview of talent and risk status, enabling **timely monitoring and intervention** to prevent gaps in critical positions.',

      howTitleVi: 'Các bước hành động của Quản lý',
      howTitleEn: 'Actionable Steps',
      howVi: [
        '**Thu thập dữ liệu**: Xem xét kết quả KPIs và đánh giá năng lực của từng nhân viên trong phòng ban.',
        '**Xếp loại**: Đặt nhân viên vào ô tương ứng trên ma trận dựa trên Hiệu suất (trục X) và Tiềm năng (trục Y).',
        '**Hiệu chuẩn**: Thảo luận giữa các Quản lý để đảm bảo công bằng và thống nhất trong đánh giá.',
        '**Hành động**: Nhóm Ngôi sao → Quy hoạch kế nhiệm, giao trọng trách. Nhóm Cốt lõi → Phát triển kỹ năng, duy trì động lực. Nhóm Cần cải thiện → Kế hoạch cải thiện (PIP) hoặc điều chuyển.'
      ],
      howEn: [
        '**Data Collection**: Review KPIs and competency ratings for each team member.',
        '**Plotting**: Place employees into the appropriate grid cell based on Performance (X-axis) and Potential (Y-axis).',
        '**Calibration**: Discuss among managers to ensure fairness and consistency in ratings.',
        '**Action**: Top Right → Succession planning, stretch assignments. Middle → Skill development, engagement. Bottom Left → Performance Improvement Plan (PIP) or transfer.'
      ]
    },

    'pipeline': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — QUY HOẠCH KẾ THỪA VỊ TRÍ THEN CHỐT',
      titleEn: 'MANAGEMENT GUIDE — CRITICAL ROLE SUCCESSION PLANNING',

      whyTitleVi: 'Tầm nhìn & Ý nghĩa',
      whyTitleEn: 'Vision & Purpose',
      whyVi: 'Xây dựng và Phát triển Đội ngũ Kế thừa là một hoạt động tiếp cận **có hệ thống**, nhằm đảm bảo **hiệu quả hoạt động liên tục** và sự phát triển bền vững của tổ chức.\nGiúp xác định lộ trình thăng tiến cá nhân, **tăng cường sự gắn kết và giữ chân nhân tài** — đặc biệt quan trọng trong bối cảnh cạnh tranh nhân tài ngày càng gay gắt.',
      whyEn: 'Building and developing a succession pipeline is a **systematic approach** to ensure **business continuity** and sustainable organizational growth.\nHelps define career development paths, **increase engagement and retain talent** — especially critical in an increasingly competitive talent market.',

      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Target',
      goalVi: 'Bảo vệ và củng cố vững chắc các **Vị trí Then chốt** của doanh nghiệp — những vị trí nếu bị bỏ trống sẽ gây rủi ro lớn hoặc ảnh hưởng nghiêm trọng ngay lập tức.\nXây dựng tuyến **Successor Bench** (bể dự bị kế thừa) chất lượng cao: mỗi vị trí Then chốt có **1-3 ứng viên** với mức độ sẵn sàng rõ ràng (Sẵn sàng ngay / 1-2 năm / 2+ năm).',
      goalEn: 'Protect and fortify **Critical Roles** — positions whose vacancy would significantly disrupt operational continuity.\nBuild a quality **Successor Bench**: each critical role has **1-3 candidates** with clear readiness levels (Ready Now / 1-2 Years / 2+ Years).',

      howTitleVi: 'Các bước hành động của Quản lý',
      howTitleEn: 'Actionable Steps',
      howVi: [
        '**Rà soát Sơ đồ tổ chức**: Xem xét các vị trí báo cáo trực tiếp và xác định Vị trí Then chốt dựa trên mức độ ảnh hưởng chiến lược, rủi ro trống vị trí và độ khó thay thế.',
        '**Xác định Ứng viên Kế thừa**: Tập trung vào nhóm Lãnh đạo tương lai, Tiềm năng cao, Hiệu suất vượt trội từ kết quả Ma trận 9 ô.',
        '**Đánh giá Mức độ Sẵn sàng**: Sẵn sàng ngay (<6 tháng), 1-2 năm (cần thêm trải nghiệm), 2+ năm (tiềm năng dài hạn).',
        '**Đánh giá Rủi ro Giữ chân**: Ứng viên "Sẵn sàng ngay" + "Rủi ro cao" = Cần kế hoạch giữ chân ngay lập tức.'
      ],
      howEn: [
        '**Review Org Chart**: Examine direct-reporting roles and identify Critical Roles based on strategic impact, vacancy risk, and difficulty to fill.',
        '**Identify Successors**: Focus on Future Leaders, High Potentials, Top Performers identified from the 9-Box Matrix.',
        '**Assess Readiness**: Ready Now (<6 months), 1-2 Years (needs more experience), 2+ Years (long-term potential).',
        '**Retention Risk Assessment**: "Ready Now" + "High Risk" = Retention plan needed immediately.'
      ]
    },

    'devplan': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — KẾ HOẠCH PHÁT TRIỂN NĂNG LỰC',
      titleEn: 'MANAGEMENT GUIDE — CAPABILITY DEVELOPMENT PLAN',

      whyTitleVi: 'Tầm nhìn & Ý nghĩa',
      whyTitleEn: 'Vision & Purpose',
      whyVi: 'Kế hoạch Phát triển nhằm **lấp đầy khoảng trống năng lực**: trang bị kiến thức, kỹ năng còn thiếu để ứng viên đủ khả năng đảm nhiệm vị trí mục tiêu.\nÁp dụng nguyên tắc cốt lõi **mô hình 70-20-10**: 70% Trải nghiệm thực tế, 20% Tiếp xúc & Kèm cặp, 10% Đào tạo chính thức.',
      whyEn: 'Development Plans aim to **close competency gaps**: equip successors with missing skills to meet target role requirements.\nApply the core principle of the **70-20-10 Model**: 70% On-the-job Experience, 20% Exposure & Coaching, 10% Formal Training.',

      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Target',
      goalVi: 'Cung cấp nội dung đào tạo **phù hợp, đúng người, đúng thời điểm** — nhất quán với nhu cầu phát triển của tổ chức/phòng ban/đội nhóm.\n**Tăng tốc độ sẵn sàng**: Rút ngắn thời gian chuẩn bị (từ R3 lên R2, từ R2 lên R1) thông qua lộ trình bài bản và có mục tiêu rõ ràng.',
      goalEn: 'Provide **right learning, right person, right time** — aligned to business needs of the organization/department/team.\n**Accelerate Readiness**: Shorten the preparation timeline (R3→R2→R1) through a structured and goal-oriented roadmap.',

      howTitleVi: 'Các bước hành động của Quản lý',
      howTitleEn: 'Actionable Steps',
      howVi: [
        '**Phân tích Nhu cầu**: Dựa trên kết quả đánh giá 9 ô, xác định 2-3 kỹ năng ưu tiên cần cải thiện nhất cho từng ứng viên.',
        '**Áp dụng 70-20-10**: 70% giao việc khó/luân chuyển/dẫn dắt dự án; 20% kèm cặp bởi lãnh đạo cấp cao/coaching; 10% khóa học chuyên môn/hội thảo.',
        '**Thống nhất & Cam kết**: Tổ chức buổi họp IDP giữa Nhân viên - Quản lý trực tiếp - HR để thống nhất mục tiêu, hành động, thời gian hoàn thành.',
        '**Rà soát định kỳ**: Theo dõi tiến độ hàng quý và điều chỉnh kế hoạch phát triển khi cần thiết.'
      ],
      howEn: [
        '**Needs Analysis**: Based on 9-Box assessment results, identify top 2-3 priority skills for improvement for each candidate.',
        '**Apply 70-20-10**: 70% stretch assignments/job rotation/project leading; 20% mentoring by senior leaders/coaching; 10% professional courses/workshops.',
        '**Align & Commit**: Conduct IDP meeting (Employee - Manager - HR) to align on goals, actions, timeline, and resources.',
        '**Periodic Review**: Monitor progress quarterly and adjust the development plan as needed.'
      ]
    },

    'idp': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — KẾ HOẠCH PHÁT TRIỂN CÁ NHÂN (IDP)',
      titleEn: 'MANAGEMENT GUIDE — INDIVIDUAL DEVELOPMENT PLAN (IDP)',

      whyTitleVi: 'Tầm nhìn & Ý nghĩa',
      whyTitleEn: 'Vision & Purpose',
      whyVi: 'Kế hoạch Phát triển Cá nhân (IDP) là công cụ giúp **xác định mức độ sẵn sàng** (R1-R4) của từng nhân viên đối với các nhiệm vụ công việc trọng tâm trong vai trò hiện tại.\nLà cơ sở để **lập Kế hoạch Phát triển** phù hợp và **hỗ trợ quyết định kế nhiệm** minh bạch, nhất quán.',
      whyEn: 'The Individual Development Plan (IDP) is a tool to **determine readiness levels** (R1-R4) of each employee for key job duties in their current role.\nProvides the foundation for **appropriate Development Plans** and supports **fair and consistent succession decisions**.',

      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Target',
      goalVi: 'Xây dựng lộ trình bồi dưỡng **cá nhân hóa** chất lượng cao cho nhân sự kế nhiệm — dựa trên khoảng cách năng lực thực tế.\nKết hợp chặt chẽ giữa **Nhiệm vụ thực tế** (Job Duty), **Mentor/Coach đồng hành**, và **lịch kèm cặp 1-1** để tối đa hóa hiệu quả phát triển.',
      goalEn: 'Build **personalized** high-quality development roadmaps for successor candidates — based on actual competency gaps.\nTightly couple **Practical Job Duties**, **Assigned Mentors/Coaches**, and **1-to-1 coaching schedules** to maximize development effectiveness.',

      howTitleVi: 'Các bước hành động của Quản lý',
      howTitleEn: 'Actionable Steps',
      howVi: [
        '**Nhân viên tự đánh giá**: Xem xét tất cả các nhiệm vụ trong Readiness Matrix và tự đánh giá theo thang R1-R4 trước buổi thảo luận.',
        '**Quản lý đánh giá độc lập**: Hoàn thành đánh giá R1-R4 và ghi chú trước buổi họp 1:1 — không tham khảo đánh giá của nhân viên trước.',
        '**Thảo luận 1:1**: Hai bên trao đổi để so sánh đánh giá, làm rõ chênh lệch và thống nhất mức độ sẵn sàng cuối cùng cho từng nhiệm vụ.',
        '**Thống nhất Hướng thực hiện**: Xác định hành động cụ thể, hỗ trợ cần thiết và mốc thời gian cải thiện — rà soát định kỳ hàng quý.'
      ],
      howEn: [
        '**Employee Self-Assessment**: Review all job duties in the Readiness Matrix and rate each one (R1-R4) independently before the discussion.',
        '**Manager Independent Review**: Complete the same R1-R4 rating and comments before the 1:1 meeting — without referencing the employee\'s ratings first.',
        '**1:1 Discussion**: Both parties compare ratings, clarify gaps, and agree on the final readiness level for each key duty.',
        '**Agree on Way Forward**: Define concrete actions, support needed, and target milestones — review quarterly.'
      ]
    }
  };

  const item = content[featureKey];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-indigo-900/60 rounded-2xl shadow-md overflow-hidden transition-all duration-300 text-white">
      {/* Header and Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/15 rounded-xl border border-indigo-500/30 text-indigo-300 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[11px] md:text-xs font-black tracking-widest text-white uppercase font-display">
              {lang === 'VI' ? item.titleVi : item.titleEn}
            </h4>
            <p className="text-[9.5px] text-indigo-400/90 uppercase tracking-wider font-bold mt-0.5">
              📋 {lang === 'VI' ? 'Khung hành động & Định hướng chiến lược của Quản lý' : 'Management Framework & Strategic Alignment'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
            {isOpen ? (lang === 'VI' ? 'Thu gọn' : 'Collapse') : (lang === 'VI' ? 'Xem hướng dẫn' : 'View guide')}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-left animate-in fade-in duration-200 border-t border-indigo-900/40">
          {/* Tầm nhìn & Ý nghĩa Card */}
          <div className="bg-slate-950/40 rounded-xl p-4 border border-amber-900/30 hover:border-amber-500/30 flex flex-col gap-2 mt-4 transition-all">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-900/40">
              <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h5 className="text-[10px] font-black uppercase text-amber-400 tracking-widest font-mono">
                {lang === 'VI' ? item.whyTitleVi : item.whyTitleEn}
              </h5>
            </div>
            <div className="space-y-1.5">
              {renderFormattedParagraphs(lang === 'VI' ? item.whyVi : item.whyEn, "text-amber-400")}
            </div>
          </div>

          {/* Mục tiêu chiến lược Card */}
          <div className="bg-slate-950/40 rounded-xl p-4 border border-indigo-900/40 hover:border-indigo-500/30 flex flex-col gap-2 mt-4 transition-all">
            <div className="flex items-center gap-2 pb-2 border-b border-indigo-900/50">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 shrink-0">
                <Target className="w-3.5 h-3.5" />
              </div>
              <h5 className="text-[10px] font-black uppercase text-indigo-300 tracking-widest font-mono">
                {lang === 'VI' ? item.goalTitleVi : item.goalTitleEn}
              </h5>
            </div>
            <div className="space-y-1.5">
              {renderFormattedParagraphs(lang === 'VI' ? item.goalVi : item.goalEn, "text-indigo-400")}
            </div>
          </div>

          {/* Các bước hành động Card */}
          <div className="bg-slate-950/40 rounded-xl p-4 border border-emerald-900/30 hover:border-emerald-500/30 flex flex-col gap-2 mt-4 transition-all">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/40">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 shrink-0">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <h5 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest font-mono">
                {lang === 'VI' ? item.howTitleVi : item.howTitleEn}
              </h5>
            </div>
            <ul className="space-y-2">
              {(lang === 'VI' ? item.howVi : item.howEn).map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-slate-200">
                  <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 font-black font-mono text-[9px] flex items-center justify-center shrink-0 border border-emerald-500/20 mt-0.5">
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