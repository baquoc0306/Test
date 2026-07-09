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

  // Ghi chú liên kết giữa các tab — hiển thị ở cuối mỗi card
  const tabLinks: Record<string, { vi: string; en: string }> = {
    '9box':    { vi: '→ Kết quả Ma trận 9 ô là đầu vào cho Bước 3: Xác định Ứng viên Kế thừa (tab Kế hoạch Kế thừa)', en: '→ 9-Box results feed into Step 3: Identifying Successors (Succession Pipeline tab)' },
    'pipeline':{ vi: '→ Ứng viên Kế thừa được xác định ở đây sẽ có Kế hoạch Phát triển riêng (tab Kế hoạch Đào tạo)', en: '→ Identified successors receive tailored Development Plans (Training Plan tab)' },
    'devplan': { vi: '→ Kế hoạch Đào tạo được cụ thể hóa thành Kế hoạch Phát triển Cá nhân cho từng người (tab IDP)', en: '→ Training Plans are individualized into Personal Development Plans for each person (IDP tab)' },
    'idp':     { vi: '→ Tiến độ IDP được rà soát định kỳ và cập nhật lại vào Ma trận 9 ô & Kế hoạch Kế thừa hàng năm', en: '→ IDP progress is reviewed periodically and feeds back into the 9-Box Matrix & Succession Plan annually' },
  };

  const content = {
    '9box': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — BƯỚC 3: MA TRẬN ĐÁNH GIÁ NHÂN TÀI 9 Ô',
      titleEn: 'MANAGEMENT GUIDE — STEP 3: 9-BOX TALENT REVIEW MATRIX',

      whyTitleVi: 'Bối cảnh & Tại sao quan trọng',
      whyTitleEn: 'Context & Why It Matters',
      whyVi: 'Cạnh tranh nhân tài trong ngành ngày càng gay gắt — **chảy máu chất xám ở nhóm Hiệu suất cao** diễn ra rõ nét, trong khi các vị trí Then chốt mất nhiều thời gian tuyển dụng.\nHiện tại, nhiều phòng ban **chưa có bức tranh tổng thể** về trạng thái nhân tài và mức độ sẵn sàng kế thừa — dẫn đến rủi ro "khoảng trống" khi nhân sự chủ chốt rời đi.',
      whyEn: 'Talent competition in the industry is intensifying — **brain drain among high performers** is increasingly evident, while key positions take a long time to fill.\nCurrently, many departments **lack a comprehensive view** of talent status and succession readiness — creating risk of critical gaps when key personnel leave.',

      goalTitleVi: 'Mục tiêu của hạng mục này',
      goalTitleEn: 'Objective of This Section',
      goalVi: 'Tạo **bức tranh tổng thể, khách quan** về sức mạnh đội ngũ dựa trên hai trục: **Hiệu suất** (kết quả công việc hiện tại) và **Tiềm năng** (khả năng phát triển lên vị trí cao hơn).\nPhân loại rõ **3 nhóm chiến lược**: **Growers** (Tiềm năng phát triển — ưu tiên đầu tư), **Keepers** (Nhân sự chủ lực ổn định — duy trì gắn kết), **Movers** (Cần can thiệp hoặc bố trí lại vị trí).',
      goalEn: 'Create a **comprehensive, objective picture** of workforce strength based on two axes: **Performance** (current results) and **Potential** (ability to grow into higher roles).\nClearly classify **3 strategic groups**: **Growers** (High potential — priority investment), **Keepers** (Stable core — maintain engagement), **Movers** (Needs intervention or repositioning).',

      howTitleVi: 'Quản lý cần làm gì',
      howTitleEn: 'What Managers Need to Do',
      howVi: [
        '**Thu thập dữ liệu**: Xem xét kết quả KPIs và đánh giá năng lực của từng nhân viên trong phòng ban trước buổi đánh giá.',
        '**Xếp loại**: Đặt từng nhân viên vào ô tương ứng trên Ma trận dựa trên Hiệu suất (trục X) và Tiềm năng (trục Y).',
        '**Hiệu chuẩn**: Thảo luận cùng các Quản lý khác để đảm bảo đánh giá công bằng, nhất quán và không thiên vị.',
        '**Hành động theo nhóm**: Growers → Quy hoạch kế nhiệm, giao trọng trách. Keepers → Phát triển kỹ năng, duy trì động lực. Movers → Kế hoạch cải thiện (PIP) hoặc điều chuyển phù hợp.'
      ],
      howEn: [
        '**Data Collection**: Review KPIs and competency ratings for each team member before the review session.',
        '**Plotting**: Place each employee into the appropriate grid cell based on Performance (X-axis) and Potential (Y-axis).',
        '**Calibration**: Discuss with other managers to ensure fair, consistent, and unbiased ratings.',
        '**Act by Group**: Growers → Succession planning, stretch assignments. Keepers → Skill development, engagement. Movers → Performance Improvement Plan (PIP) or appropriate transfer.'
      ]
    },

    'pipeline': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — BƯỚC 1 & 3: QUY HOẠCH KẾ THỪA VỊ TRÍ THEN CHỐT',
      titleEn: 'MANAGEMENT GUIDE — STEP 1 & 3: CRITICAL ROLE SUCCESSION PLANNING',

      whyTitleVi: 'Bối cảnh & Tại sao quan trọng',
      whyTitleEn: 'Context & Why It Matters',
      whyVi: 'Các vị trí Then chốt (Quản lý cấp cao, Kỹ thuật, IE, Bảo trì, Tự động hóa...) **mất nhiều thời gian tuyển dụng** và khan hiếm ứng viên có kinh nghiệm trong sản xuất quy mô lớn.\nHiện tại, **chưa có cơ chế theo dõi và cập nhật định kỳ** về trạng thái kế thừa — dẫn đến rủi ro gián đoạn vận hành khi nhân sự chủ chốt rời đi đột xuất.',
      whyEn: 'Key positions (senior leaders, IE, maintenance, automation...) **take a long time to fill** and qualified candidates with large-scale manufacturing experience are scarce.\nCurrently, there is **no established mechanism for regular monitoring and updates** on succession status — creating risk of operational disruption when key personnel leave unexpectedly.',

      goalTitleVi: 'Mục tiêu của hạng mục này',
      goalTitleEn: 'Objective of This Section',
      goalVi: 'Xác định và bảo vệ các **Vị trí Then chốt** — những vị trí nếu bị bỏ trống sẽ gây rủi ro lớn hoặc ảnh hưởng nghiêm trọng đến vận hành ngay lập tức.\nXây dựng tuyến **Successor Bench** chất lượng: mỗi Vị trí Then chốt có **1-3 ứng viên** với mức độ sẵn sàng rõ ràng — Sẵn sàng ngay / 1-2 năm / 2+ năm.',
      goalEn: 'Identify and protect **Critical Roles** — positions whose vacancy would significantly disrupt operational continuity immediately.\nBuild a quality **Successor Bench**: each Critical Role has **1-3 candidates** with clear readiness levels — Ready Now / 1-2 Years / 2+ Years.',

      howTitleVi: 'Quản lý cần làm gì',
      howTitleEn: 'What Managers Need to Do',
      howVi: [
        '**Rà soát Sơ đồ tổ chức**: Xem xét các vị trí báo cáo trực tiếp và xác định Vị trí Then chốt dựa trên 3 tiêu chí: Tác động chiến lược cao / Rủi ro trống vị trí cao / Khó thay thế.',
        '**Xác định Ứng viên Kế thừa**: Ưu tiên nhóm Growers từ kết quả Ma trận 9 ô — Lãnh đạo tương lai, Tiềm năng cao, Hiệu suất vượt trội.',
        '**Đánh giá Mức độ Sẵn sàng**: Sẵn sàng ngay (<6 tháng) / 1-2 năm (cần thêm trải nghiệm) / 2+ năm (tiềm năng dài hạn). Mục tiêu: 1-3 ứng viên/vị trí.',
        '**Đánh giá Rủi ro Giữ chân**: Ứng viên "Sẵn sàng ngay" + "Rủi ro cao" = Cần kế hoạch giữ chân ngay lập tức. Phối hợp với HRBP để có hành động kịp thời.'
      ],
      howEn: [
        '**Review Org Chart**: Examine direct-reporting roles and identify Critical Roles based on 3 criteria: High Strategic Impact / High Vacancy Risk / Hard to Fill.',
        '**Identify Successors**: Prioritize Growers from the 9-Box Matrix — Future Leaders, High Potentials, Top Performers.',
        '**Assess Readiness**: Ready Now (<6 months) / 1-2 Years (needs more experience) / 2+ Years (long-term potential). Target: 1-3 candidates per role.',
        '**Retention Risk Assessment**: "Ready Now" + "High Risk" = Retention plan needed immediately. Coordinate with HRBP for timely action.'
      ]
    },

    'devplan': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — BƯỚC 4: KẾ HOẠCH PHÁT TRIỂN NĂNG LỰC',
      titleEn: 'MANAGEMENT GUIDE — STEP 4: CAPABILITY DEVELOPMENT PLAN',

      whyTitleVi: 'Bối cảnh & Tại sao quan trọng',
      whyTitleEn: 'Context & Why It Matters',
      whyVi: 'Lao động trẻ ngày càng **ưu tiên doanh nghiệp có cơ hội học tập và lộ trình phát triển rõ ràng** — đây là yếu tố cạnh tranh nhân tài quan trọng không kém lương thưởng.\nChiến lược nhân sự của công ty hướng đến **phát triển con người trước khi nhu cầu phát sinh** — không chờ đến khi vị trí trống mới bắt đầu đào tạo.',
      whyEn: 'Young professionals increasingly **prioritize companies with learning opportunities and clear development paths** — this is as important a talent differentiator as compensation.\nThe company\'s HR strategy focuses on **developing people before the need arises** — not waiting until a position is vacant to start training.',

      goalTitleVi: 'Mục tiêu của hạng mục này',
      goalTitleEn: 'Objective of This Section',
      goalVi: 'Lấp đầy **khoảng cách năng lực** giữa trình độ hiện tại của Ứng viên Kế thừa và yêu cầu của Vị trí Then chốt mục tiêu — dựa trên kết quả đánh giá từ Ma trận 9 ô và Kế hoạch Kế thừa.\nÁp dụng nguyên tắc **70-20-10**: 70% Trải nghiệm thực tế (giao việc khó, luân chuyển, dẫn dắt dự án) — 20% Tiếp xúc & Kèm cặp (mentoring, coaching, dự họp chiến lược) — 10% Đào tạo chính thức (khóa học, hội thảo).',
      goalEn: 'Close the **competency gap** between the successor candidate\'s current level and the requirements of the target Critical Role — based on assessment results from the 9-Box Matrix and Succession Plan.\nApply the **70-20-10 principle**: 70% On-the-job Experience (stretch assignments, rotation, project leading) — 20% Exposure & Coaching (mentoring, coaching, strategic meetings) — 10% Formal Training (courses, workshops).',

      howTitleVi: 'Quản lý cần làm gì',
      howTitleEn: 'What Managers Need to Do',
      howVi: [
        '**Phân tích Khoảng cách Năng lực**: Dựa trên kết quả đánh giá 9 ô và Kế hoạch Kế thừa, xác định 2-3 kỹ năng ưu tiên cần phát triển nhất cho từng Ứng viên.',
        '**Thiết kế Lộ trình 70-20-10**: 70% giao việc khó/luân chuyển/dẫn dắt dự án/tạm quyền; 20% kèm cặp bởi lãnh đạo cấp cao/coaching; 10% khóa học chuyên môn/hội thảo.',
        '**Thống nhất & Cam kết**: Tổ chức buổi họp IDP ba bên (Nhân viên — Quản lý trực tiếp — HR) để thống nhất mục tiêu, hành động cụ thể và thời gian hoàn thành.',
        '**Theo dõi định kỳ**: Rà soát tiến độ hàng quý, cập nhật kế hoạch khi cần — kết quả phát triển sẽ được phản ánh lại vào Ma trận 9 ô và Kế hoạch Kế thừa năm tiếp theo.'
      ],
      howEn: [
        '**Competency Gap Analysis**: Based on 9-Box and Succession Plan results, identify the top 2-3 priority skills to develop for each candidate.',
        '**Design 70-20-10 Roadmap**: 70% stretch assignments/rotation/project leading/acting roles; 20% mentoring by senior leaders/coaching; 10% professional courses/workshops.',
        '**Align & Commit**: Conduct a three-way IDP meeting (Employee — Direct Manager — HR) to align on goals, specific actions, and completion timeline.',
        '**Periodic Monitoring**: Review progress quarterly, update plans as needed — development results feed back into the 9-Box Matrix and Succession Plan for the following year.'
      ]
    },

    'idp': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — BƯỚC 4: KẾ HOẠCH PHÁT TRIỂN CÁ NHÂN (IDP)',
      titleEn: 'MANAGEMENT GUIDE — STEP 4: INDIVIDUAL DEVELOPMENT PLAN (IDP)',

      whyTitleVi: 'Bối cảnh & Tại sao quan trọng',
      whyTitleEn: 'Context & Why It Matters',
      whyVi: 'Kế hoạch Phát triển chỉ hiệu quả khi được **cụ thể hóa thành hành động cá nhân** — không phải kế hoạch chung chung cho cả nhóm.\nHiện tại, **chưa có cơ chế theo dõi và cập nhật định kỳ** tiến độ phát triển của từng cá nhân — dẫn đến khoảng cách năng lực tích lũy theo thời gian mà không được phát hiện kịp thời.',
      whyEn: 'Development Plans are only effective when **translated into individual actions** — not generic group-level plans.\nCurrently, there is **no established mechanism for regular monitoring** of each individual\'s development progress — causing competency gaps to accumulate over time without timely detection.',

      goalTitleVi: 'Mục tiêu của hạng mục này',
      goalTitleEn: 'Objective of This Section',
      goalVi: 'Xác định **Mức độ Sẵn sàng** (R1-R4) của từng nhân viên đối với các nhiệm vụ công việc trọng tâm — làm cơ sở để thiết kế Kế hoạch Phát triển phù hợp và hỗ trợ quyết định kế nhiệm minh bạch.\nKết hợp chặt chẽ giữa **Nhiệm vụ thực tế** (Job Duty), **Mentor/Coach đồng hành** và **lịch rà soát 1-1 định kỳ** để đảm bảo tiến độ phát triển được theo dõi liên tục.',
      goalEn: 'Determine the **Readiness Level** (R1-R4) of each employee for key job duties — providing the foundation for appropriate Development Plans and transparent succession decisions.\nTightly couple **Practical Job Duties**, **Assigned Mentors/Coaches**, and **regular 1-1 review schedules** to ensure development progress is continuously monitored.',

      howTitleVi: 'Quản lý cần làm gì',
      howTitleEn: 'What Managers Need to Do',
      howVi: [
        '**Nhân viên tự đánh giá trước**: Xem xét tất cả nhiệm vụ trong Readiness Matrix và tự đánh giá theo thang R1-R4 — chuẩn bị trước buổi thảo luận 1:1.',
        '**Quản lý đánh giá độc lập**: Hoàn thành đánh giá R1-R4 và ghi chú nhận xét trước buổi họp — không tham khảo đánh giá của nhân viên trước để đảm bảo khách quan.',
        '**Thảo luận 1:1**: Hai bên so sánh đánh giá, làm rõ chênh lệch và thống nhất mức độ sẵn sàng cuối cùng cho từng nhiệm vụ — ghi nhận động lực, thách thức và điểm cần tái tập trung.',
        '**Thống nhất Hướng thực hiện & Rà soát định kỳ**: Xác định hành động cụ thể, hỗ trợ cần thiết và mốc thời gian cải thiện — rà soát hàng quý để cập nhật tiến độ và điều chỉnh kế hoạch.'
      ],
      howEn: [
        '**Employee Self-Assessment First**: Review all job duties in the Readiness Matrix and rate each one (R1-R4) — prepare before the 1:1 discussion.',
        '**Manager Independent Review**: Complete R1-R4 ratings and comments before the meeting — without referencing the employee\'s ratings first to ensure objectivity.',
        '**1:1 Discussion**: Both parties compare ratings, clarify gaps, and agree on the final readiness level for each duty — document motivation, challenges, and areas needing refocus.',
        '**Agree on Way Forward & Periodic Review**: Define concrete actions, support needed, and improvement milestones — review quarterly to update progress and adjust the plan.'
      ]
    }
  };

  const item = content[featureKey];
  const link = tabLinks[featureKey];

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
        <div className="border-t border-indigo-900/40">
          <div className="px-5 pt-4 pb-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-left animate-in fade-in duration-200">
            {/* Bối cảnh & Tại sao */}
            <div className="bg-slate-950/40 rounded-xl p-4 border border-amber-900/30 hover:border-amber-500/30 flex flex-col gap-2 transition-all">
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

            {/* Mục tiêu */}
            <div className="bg-slate-950/40 rounded-xl p-4 border border-indigo-900/40 hover:border-indigo-500/30 flex flex-col gap-2 transition-all">
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

            {/* Quản lý cần làm gì */}
            <div className="bg-slate-950/40 rounded-xl p-4 border border-emerald-900/30 hover:border-emerald-500/30 flex flex-col gap-2 transition-all">
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

          {/* Liên kết giữa các tab */}
          <div className="mx-5 mb-4 px-3.5 py-2.5 bg-indigo-950/60 border border-indigo-800/40 rounded-xl flex items-center gap-2">
            <span className="text-indigo-400 text-[10px] shrink-0">🔗</span>
            <p className="text-[10px] text-indigo-300 font-medium leading-relaxed">
              {lang === 'VI' ? link.vi : link.en}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}