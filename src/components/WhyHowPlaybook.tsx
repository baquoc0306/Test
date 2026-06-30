import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Lightbulb, Target } from 'lucide-react';

interface WhyHowPlaybookProps {
  featureKey: '9box' | 'pipeline' | 'devplan' | 'idp';
  lang: 'VI' | 'EN';
  isLdMode?: boolean;
  selectedSite?: 'MLN' | 'WNK' | 'ASH';
}

export default function WhyHowPlaybook({ featureKey, lang, isLdMode = false, selectedSite = 'MLN' }: WhyHowPlaybookProps) {
  const [isOpen, setIsOpen] = useState(true);

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-amber-400 font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderFormattedParagraphs = (text: string, dotColorClass: string = "text-amber-400") => {
    return text.split('\n').map((line, lineIdx) => {
      if (!line.trim()) return null;
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
      whyTitleVi: 'Tại sao cần 9-Box?',
      whyTitleEn: 'Why 9-Box?',
      whyVi: '**9-Box không phải là công cụ đánh giá** — đây là **bản đồ chiến lược nhân tài**.\nGiúp Trưởng bộ phận và Đối tác Nhân sự nhìn thấy ngay: ai cần đầu tư phát triển, ai cần giữ chân, ai cần can thiệp — dựa trên **2 chiều khoa học**: Hiệu suất thực tế và Tiềm năng học hỏi.\nKhông có 9-Box, mọi quyết định nhân sự đều dựa trên cảm tính — **rủi ro cao, chi phí lớn**.',
      whyEn: '**9-Box is not an appraisal tool** — it is a **strategic talent map**.\nHelps HODs and HRBPs immediately see: who needs development investment, who needs retention, who needs intervention — based on **2 scientific dimensions**: Actual Performance and Learning Agility.\nWithout 9-Box, all talent decisions are intuition-based — **high risk, high cost**.',
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Goal',
      goalVi: 'Xây dựng **đội ngũ tự phát triển** — nơi Growers kéo Keepers lên, Keepers ổn định vận hành, và Movers được can thiệp kịp thời.\nMục tiêu lý tưởng: **Growers ≥ 30%, Keepers ≥ 50%, Movers ≤ 20%** — đây là cơ cấu nhân tài bền vững cho môi trường sản xuất.',
      goalEn: 'Build a **self-developing team** — where Growers pull Keepers up, Keepers stabilize operations, and Movers receive timely intervention.\nIdeal target: **Growers ≥ 30%, Keepers ≥ 50%, Movers ≤ 20%** — sustainable talent structure for manufacturing environments.',
      howTitleVi: 'Trưởng bộ phận cần làm gì với dữ liệu này?',
      howTitleEn: 'What should HODs do with this data?',
      howVi: ['**Xem tỷ lệ phân bổ** Growers/Keepers/Movers của bộ phận mình — so sánh với mục tiêu lý tưởng', '**Nhấp vào từng ô 9-Box** để xem danh sách nhân sự cụ thể và hồ sơ năng lực chi tiết', '**Ưu tiên hành động** theo thứ tự: Movers (can thiệp ngay) → Growers (đầu tư phát triển) → Keepers (giữ chân)'],
      howEn: ['**Review distribution ratio** of Growers/Keepers/Movers — compare with ideal targets', '**Click each 9-Box cell** to see specific employee lists and detailed competency profiles', '**Prioritize actions**: Movers (intervene now) → Growers (invest in development) → Keepers (retain)']
    },
    'pipeline': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — QUY HOẠCH KẾ THỪA SUCCESSION PIPELINE',
      titleEn: 'MANAGEMENT PLAYBOOK — CRITICAL SUCCESSION PIPELINE',
      whyTitleVi: 'Tại sao cần Succession Planning?',
      whyTitleEn: 'Why Succession Planning?',
      whyVi: '**Không ai là không thể thay thế — nhưng thời gian thay thế mới là vấn đề.**\nMỗi vị trí "Không có người kế thừa" là một **rủi ro vận hành tiềm ẩn**: khi người đó nghỉ việc, bệnh, hoặc thăng chức — bộ phận sẽ mất từ **3-12 tháng** để ổn định lại.\nQuy hoạch kế thừa không phải là "chuẩn bị cho người nghỉ" — đó là **bảo hiểm vận hành cho toàn tổ chức**.',
      whyEn: '**No one is irreplaceable — but the replacement time is the real problem.**\nEach "No Successor" position is a **latent operational risk**: when that person resigns, falls ill, or gets promoted — the department needs **3-12 months** to stabilize.\nSuccession Planning is not "preparing for departures" — it is **operational insurance for the entire organization**.',
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Goal',
      goalVi: 'Đạt **Tỷ lệ Phủ Kế thừa ≥ 80%** cho tất cả vị trí then chốt trong vòng 12 tháng.\nMỗi vị trí cần có ít nhất **1 người kế thừa "Sẵn sàng ngay" hoặc "Dưới 1 năm"** — không chấp nhận trạng thái "Chỉ có người tạm quyền" kéo dài quá 6 tháng.',
      goalEn: 'Achieve **Succession Coverage Rate ≥ 80%** for all critical roles within 12 months.\nEach position needs at least **1 "Ready Now" or "< 1 Year" Successor** — "Interim Only" status lasting more than 6 months is not acceptable.',
      howTitleVi: 'Trưởng bộ phận cần làm gì với dữ liệu này?',
      howTitleEn: 'What should HODs do with this data?',
      howVi: ['**Xác định ngay** các vị trí "Không có người kế thừa" và "Chỉ có người tạm quyền" trong bộ phận — đây là ưu tiên số 1', '**Đề xuất ứng viên kế thừa** cho Đối tác Nhân sự trong vòng 2 tuần — dựa trên nhóm Growers của bộ phận', '**Theo dõi tiến độ sẵn sàng** và giao thêm nhiệm vụ thực chiến để đẩy nhanh quá trình phát triển'],
      howEn: ['**Immediately identify** "No Successor" and "Interim Only" positions — this is Priority #1', '**Propose Successor candidates** to HRBP within 2 weeks — based on department Growers', '**Monitor readiness progress** and assign stretch assignments to accelerate development']
    },
    'devplan': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — KẾ HOẠCH BỒI DƯỠNG TIÊU ĐIỂM',
      titleEn: 'MANAGEMENT PLAYBOOK — TARGETED LEARNING CURRICULUMS',
      whyTitleVi: 'Tại sao cần Training Plan tập trung?',
      whyTitleEn: 'Why Focused Training Plan?',
      whyVi: '**Đào tạo dàn trải = không ai giỏi thêm.** Nghiên cứu của McKinsey (2022) cho thấy chỉ **25% chương trình đào tạo** tạo ra thay đổi hành vi thực sự.\nLý do: đào tạo không gắn với nhu cầu thực tế của công việc.\nKế hoạch đào tạo này được xây dựng **từ dưới lên** — từ hồ sơ phát triển cá nhân thực tế → tổng hợp khoảng cách năng lực → thiết kế chương trình có mục tiêu đo lường được.',
      whyEn: '**Scattered training = no one improves.** McKinsey research (2022) shows only **25% of training programs** create real behavioral change.\nReason: training not linked to actual job needs.\nThis Training Plan is built **bottom-up** — from real IDP records → aggregated competency gaps → programs with measurable objectives.',
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Goal',
      goalVi: 'Mỗi chương trình đào tạo phải có **chỉ tiêu đo lường cụ thể** sau 3 tháng triển khai:\n**Tỷ lệ hoàn thành ≥ 80%** | **Tỷ lệ áp dụng hành vi ≥ 60%** | **Mức độ hài lòng của Quản lý ≥ 4/5**\nKhông đạt chỉ tiêu → Bộ phận Đào tạo & Phát triển và Trưởng bộ phận cùng rà soát và điều chỉnh chương trình.',
      goalEn: 'Each training program must have **specific measurable KPIs** after 3 months:\n**Completion Rate ≥ 80%** | **Behavior Transfer Rate ≥ 60%** | **Manager Satisfaction ≥ 4/5**\nKPIs not met → L&D and HOD jointly review and adjust the program.',
      howTitleVi: 'Trưởng bộ phận cần làm gì với dữ liệu này?',
      howTitleEn: 'What should HODs do with this data?',
      howVi: ['**Kiểm tra bộ phận mình** có trong danh sách bộ phận của chương trình nào — đó là chương trình bắt buộc tham gia', '**Cam kết tỷ lệ tham gia** tối thiểu 80% và sắp xếp ca kíp phù hợp để nhân viên có thể tham gia', '**Theo dõi và báo cáo** hành vi áp dụng sau đào tạo — đây là bằng chứng hiệu quả đầu tư quan trọng nhất'],
      howEn: ['**Check if your department** appears in any program department list — those are mandatory participation programs', '**Commit to minimum 80% participation** and arrange shifts so employees can attend', '**Monitor and report** post-training behavior application — this is the most important ROI evidence']
    },
    'idp': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — KẾ HOẠCH HÀNH ĐỘNG CÁ NHÂN (IDP)',
      titleEn: 'MANAGEMENT PLAYBOOK — INDIVIDUAL DEVELOPMENT PLANS',
      whyTitleVi: 'Tại sao IDP quan trọng?',
      whyTitleEn: 'Why IDP matters?',
      whyVi: '**IDP là hợp đồng phát triển giữa nhân viên và tổ chức** — không phải form điền cho có.\nNghiên cứu của Gallup (2023): nhân viên có **IDP được theo dõi đều đặn** có tỷ lệ gắn kết cao hơn **3,5 lần** và tỷ lệ nghỉ việc thấp hơn **40%**.\nIDP không có theo dõi = lãng phí thời gian của cả nhân viên lẫn quản lý.',
      whyEn: '**IDP is a development contract between employee and organization** — not a form to fill for compliance.\nGallup research (2023): employees with **regularly followed-up IDPs** have **3.5x higher engagement** and **40% lower turnover**.\nIDP without follow-up = wasted time for both employees and managers.',
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Goal',
      goalVi: '**100% nhân sự kế thừa** có IDP hoàn chỉnh với các hành động cụ thể, thời hạn rõ ràng, và người chịu trách nhiệm được xác định.\nMỗi IDP được rà soát **ít nhất 1 lần/tháng** trong cuộc họp 1-1 — không phải chỉ rà soát khi đến kỳ đánh giá.',
      goalEn: '**100% successor employees** have complete IDPs with specific action items, clear timelines, and identified accountability owners.\nEach IDP reviewed **at least once/month** in 1-1 meetings — not only during performance review cycles.',
      howTitleVi: 'Trưởng bộ phận cần làm gì với dữ liệu này?',
      howTitleEn: 'What should HODs do with this data?',
      howVi: ['**Tìm kiếm nhân sự bộ phận mình** và xem chi tiết IDP — đặc biệt chú ý các nhiệm vụ có R1/R2 và Cơ hội Ưu tiên (X)', '**Tích hợp IDP vào cuộc họp 1-1 hàng tuần** — dành 15 phút cuối mỗi buổi để rà soát tiến độ 1-2 hành động', '**Ghi nhận và khen thưởng** khi nhân viên hoàn thành mốc IDP — đây là động lực quan trọng nhất'],
      howEn: ['**Search for your department employees** and review IDP details — especially duties with R1/R2 and Top Opportunity (X)', '**Integrate IDP into weekly 1-1s** — spend last 15 minutes reviewing progress on 1-2 action items', '**Recognize and reward** when employees complete IDP milestones — this is the most important motivator']
    }
  };

  const item = content[featureKey];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-indigo-900/60 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden transition-all duration-300">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
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
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left animate-in fade-in duration-300">
          {/* WHY */}
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-indigo-950/60 hover:border-amber-500/20 transition-all duration-300 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />
            <div className="flex items-center gap-2 border-b border-indigo-950/80 pb-2.5 mb-3">
              <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold uppercase text-amber-400 tracking-wider font-mono">
                {lang === 'VI' ? item.whyTitleVi : item.whyTitleEn}
              </h5>
            </div>
            <div className="space-y-1 flex-1">
              {renderFormattedParagraphs(lang === 'VI' ? item.whyVi : item.whyEn, "text-amber-400")}
            </div>
          </div>

          {/* GOAL */}
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-indigo-950/60 hover:border-indigo-500/20 transition-all duration-300 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition-all" />
            <div className="flex items-center gap-2 border-b border-indigo-950/80 pb-2.5 mb-3">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                <Target className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold uppercase text-indigo-300 tracking-wider font-mono">
                {lang === 'VI' ? item.goalTitleVi : item.goalTitleEn}
              </h5>
            </div>
            <div className="space-y-1 flex-1">
              {renderFormattedParagraphs(lang === 'VI' ? item.goalVi : item.goalEn, "text-indigo-400")}
            </div>
          </div>

          {/* HOW */}
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-indigo-950/60 hover:border-emerald-500/20 transition-all duration-300 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex items-center gap-2 border-b border-indigo-950/80 pb-2.5 mb-3">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold uppercase text-emerald-400 tracking-wider font-mono">
                {lang === 'VI' ? item.howTitleVi : item.howTitleEn}
              </h5>
            </div>
            <ul className="space-y-2.5 flex-1">
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
      )}
    </div>
  );
}