import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Lightbulb, Target, AlertTriangle, TrendingUp, Zap, Clock } from 'lucide-react';

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

  // ── SITE-SPECIFIC INSIGHT DATA ─────────────────────────────────────────────
  const siteInsights: Record<string, Record<string, { vi: string; en: string }>> = {
    '9box': {
      MLN: {
        vi: '**Millennium** có cơ cấu nhân tài tương đối cân bằng. Tuy nhiên, tỷ lệ **Movers cần được theo dõi chặt** — nếu không có kế hoạch can thiệp trong 2 quý tới, nguy cơ mất nhân sự vận hành nòng cốt là hiện hữu. HOD cần xác nhận danh sách Movers và lên kế hoạch PIP (Performance Improvement Plan) cụ thể.',
        en: '**Millennium** has a relatively balanced talent structure. However, the **Movers segment requires close monitoring** — without intervention in the next 2 quarters, core operational talent attrition risk is real. HODs must confirm the Movers list and initiate specific PIPs.'
      },
      WNK: {
        vi: '**Wanek** đang trong giai đoạn mở rộng nhanh với **55 nhân sự / 803 IDP records**. Điểm nóng: UPH Support WNK3 có tỷ lệ Low Readiness cao nhất (6/16 duties). Nếu không triển khai Coaching Program trong Q3/2026, năng suất khu vực này sẽ bị ảnh hưởng trực tiếp khi ramp-up.',
        en: '**Wanek** is in rapid expansion with **55 employees / 803 IDP records**. Critical hotspot: UPH Support WNK3 has the highest Low Readiness rate (6/16 duties). Without a Coaching Program in Q3/2026, this area\'s productivity will be directly impacted during ramp-up.'
      },
      ASH: {
        vi: '**Ashton** có cơ cấu nhân tài tập trung vào **Keepers (59%)** — đội ngũ ổn định nhưng thiếu động lực tăng trưởng. Chỉ có **1 Superstar (Windy Sy)** — rủi ro phụ thuộc vào cá nhân rất cao. HOD cần xác định ngay 2-3 Rising Star tiềm năng để đầu tư phát triển.',
        en: '**Ashton** has a talent structure heavily weighted toward **Keepers (59%)** — stable but lacking growth momentum. Only **1 Superstar (Windy Sy)** — single-point dependency risk is high. HODs must immediately identify 2-3 potential Rising Stars for accelerated development.'
      }
    },
    'pipeline': {
      MLN: {
        vi: '**Millennium** có pipeline kế thừa tương đối đầy đủ cho các vị trí cấp cao. Tuy nhiên, các vị trí **"Interim Coverage Only"** cần được giải quyết trong vòng 6 tháng — đây là khoảng trống nguy hiểm nhất vì không có người thay thế thực sự, chỉ có người tạm quyền.',
        en: '**Millennium** has a relatively complete succession pipeline for senior roles. However, **"Interim Coverage Only"** positions must be resolved within 6 months — these are the most dangerous gaps as there is no real successor, only temporary coverage.'
      },
      WNK: {
        vi: '**Wanek** đang xây dựng pipeline kế thừa song song với việc mở rộng nhà máy. Ưu tiên #1: Các vị trí Supervisor tại UPH và Cut&Sew WNK3 cần có **Successor "Ready Now"** trước khi ramp-up Q4/2026. Nếu không, mỗi lần Supervisor nghỉ phép/nghỉ việc sẽ gây gián đoạn dây chuyền.',
        en: '**Wanek** is building its succession pipeline in parallel with factory expansion. Priority #1: Supervisor positions in UPH and Cut&Sew WNK3 need **"Ready Now" Successors** before Q4/2026 ramp-up. Otherwise, every Supervisor absence will disrupt the production line.'
      },
      ASH: {
        vi: '**Ashton** có **26/60 vị trí "No Successor" (43%)** — tỷ lệ rủi ro kế thừa cao nhất trong 3 sites. Đặc biệt nghiêm trọng tại Warehouse với 23 vị trí không có người thay thế. Một sự cố nhân sự đơn lẻ có thể gây **gián đoạn toàn bộ chuỗi xuất hàng**.',
        en: '**Ashton** has **26/60 positions with "No Successor" (43%)** — the highest succession risk rate across all 3 sites. Critically severe in Warehouse with 23 positions without backup. A single personnel incident could cause **complete disruption to the outbound logistics chain**.'
      }
    },
    'devplan': {
      MLN: {
        vi: '**Millennium** đã xác định được **14 chương trình đào tạo ưu tiên**. Điểm mấu chốt: AI & Automation (H.1) và Leadership (H.2) là 2 năng lực quyết định năng suất dài hạn. HOD cần **cam kết tỷ lệ tham gia tối thiểu 80%** để chương trình đạt ROI kỳ vọng.',
        en: '**Millennium** has identified **14 priority training programs**. Key insight: AI & Automation (P.1) and Leadership (P.2) are the 2 competencies determining long-term productivity. HODs must **commit to minimum 80% participation rate** for programs to achieve expected ROI.'
      },
      WNK: {
        vi: '**Wanek** có nhu cầu đào tạo lớn nhất trong 3 sites với **803 records / 10 chương trình**. Coaching Skills (122 needs) chiếm tỷ trọng cao nhất — đây là năng lực nền tảng để nhân rộng Train-the-Trainer. Nếu không triển khai trong Q3, toàn bộ kế hoạch đào tạo nội bộ sẽ bị trì hoãn theo.',
        en: '**Wanek** has the highest training demand across 3 sites with **803 records / 10 programs**. Coaching Skills (122 needs) has the highest weight — this is the foundational competency for scaling Train-the-Trainer. Without Q3 deployment, the entire internal training plan will cascade-delay.'
      },
      ASH: {
        vi: '**Ashton** có **9 chương trình đào tạo** tập trung vào Coaching (57 needs, 81.8% low readiness) và Communication (12 needs, 100% dept coverage). Đây là 2 năng lực thiếu hụt nghiêm trọng nhất — ảnh hưởng trực tiếp đến chất lượng phục vụ khách hàng và hiệu quả phối hợp nội bộ.',
        en: '**Ashton** has **9 training programs** focused on Coaching (57 needs, 81.8% low readiness) and Communication (12 needs, 100% dept coverage). These are the 2 most critically deficient competencies — directly impacting customer service quality and internal coordination effectiveness.'
      }
    },
    'idp': {
      MLN: {
        vi: '**Millennium** có hệ thống IDP đầy đủ nhất. Điểm cần chú ý: Các IDP có **R1/R2 rating** cần được HOD review và xác nhận kế hoạch can thiệp trong vòng **30 ngày** — đây là cam kết tối thiểu để IDP không chỉ là "tài liệu lưu trữ" mà trở thành công cụ phát triển thực sự.',
        en: '**Millennium** has the most complete IDP system. Key attention: IDPs with **R1/R2 ratings** require HOD review and intervention plan confirmation within **30 days** — this is the minimum commitment to ensure IDPs become real development tools, not just archived documents.'
      },
      WNK: {
        vi: '**Wanek** có **803 IDP records** từ 55 nhân sự — trung bình 14.6 duties/người, cao hơn chuẩn. Điều này cho thấy scope công việc rộng và áp lực ramp-up lớn. HOD cần **ưu tiên Top Opportunities (đánh dấu X)** — đây là những khoảng cách năng lực có tác động cao nhất đến KPI bộ phận.',
        en: '**Wanek** has **803 IDP records** from 55 employees — averaging 14.6 duties/person, above standard. This indicates broad job scope and high ramp-up pressure. HODs must **prioritize Top Opportunities (marked X)** — these are the competency gaps with highest impact on department KPIs.'
      },
      ASH: {
        vi: '**Ashton** có **199 IDP records** từ 16 nhân sự cấp quản lý. Đặc biệt: Nhóm IT (Denis Vy, River Le, Ryder Nguyen) có rating **N/A** — đang trong quá trình đánh giá. HOD IT cần hoàn thiện đánh giá trong **Q3/2026** để đảm bảo kế hoạch phát triển không bị gián đoạn.',
        en: '**Ashton** has **199 IDP records** from 16 management-level employees. Notable: IT team (Denis Vy, River Le, Ryder Nguyen) has **N/A ratings** — currently under assessment. IT HOD must complete evaluations by **Q3/2026** to ensure development plans are not disrupted.'
      }
    }
  };

  // ── RISK IF NO ACTION ──────────────────────────────────────────────────────
  const riskData: Record<string, Record<string, { vi: string; en: string }>> = {
    '9box': {
      MLN: { vi: 'Không nhận diện sớm Movers → mất nhân sự vận hành đột ngột → chi phí tuyển dụng + đào tạo người mới tốn **3-6 tháng lương**', en: 'Failing to identify Movers early → sudden operational talent loss → recruitment + onboarding costs **3-6 months salary**' },
      WNK: { vi: 'Không can thiệp UPH Support WNK3 → năng suất giảm khi ramp-up → **delay kế hoạch sản xuất Q4**', en: 'No intervention in UPH Support WNK3 → productivity drop during ramp-up → **Q4 production plan delay**' },
      ASH: { vi: 'Chỉ 1 Superstar → nếu Windy Sy rời đi → **mất toàn bộ năng lực FA Manager** không có người thay thế ngay', en: 'Only 1 Superstar → if Windy Sy leaves → **complete FA Manager capability loss** with no immediate replacement' }
    },
    'pipeline': {
      MLN: { vi: 'Vị trí "Interim Only" kéo dài → người tạm quyền kiệt sức → **chất lượng quyết định suy giảm** và nguy cơ mất cả người tạm quyền', en: '"Interim Only" positions prolonged → temporary coverage burnout → **decision quality degradation** and risk of losing interim person too' },
      WNK: { vi: 'Không có Successor "Ready Now" trước ramp-up → mỗi lần Supervisor vắng → **dây chuyền dừng hoặc chạy dưới công suất**', en: 'No "Ready Now" Successor before ramp-up → every Supervisor absence → **line stops or runs below capacity**' },
      ASH: { vi: '26 vị trí No Successor → 1 sự cố nhân sự tại Warehouse → **gián đoạn xuất hàng → vi phạm SLA với khách hàng**', en: '26 No Successor positions → 1 Warehouse personnel incident → **outbound disruption → customer SLA violation**' }
    },
    'devplan': {
      MLN: { vi: 'Không triển khai AI & Automation → nhân sự tiếp tục làm báo cáo thủ công → **lãng phí 2-4 giờ/người/tuần** = hàng trăm giờ/năm toàn site', en: 'No AI & Automation deployment → staff continue manual reporting → **2-4 hours/person/week wasted** = hundreds of hours/year site-wide' },
      WNK: { vi: 'Không có Coaching Program → không có Train-the-Trainer → **L&D phải đào tạo trực tiếp 100%** → không scale được khi nhà máy mở rộng', en: 'No Coaching Program → no Train-the-Trainer → **L&D must train 100% directly** → cannot scale as factory expands' },
      ASH: { vi: 'Coaching Skills 81.8% low readiness không được giải quyết → HOD không biết cách phát triển cấp dưới → **vòng lặp thiếu hụt năng lực kéo dài**', en: '81.8% Coaching low readiness unaddressed → HODs cannot develop subordinates → **perpetual competency gap cycle**' }
    },
    'idp': {
      MLN: { vi: 'IDP R1/R2 không được follow-up → nhân viên cảm thấy bị bỏ rơi → **tăng nguy cơ nghỉ việc của nhóm có tiềm năng cao**', en: 'R1/R2 IDPs not followed up → employees feel abandoned → **increased attrition risk for high-potential group**' },
      WNK: { vi: 'Top Opportunities không được ưu tiên → khoảng cách năng lực tích lũy → **KPI bộ phận không đạt trong 2 quý liên tiếp**', en: 'Top Opportunities not prioritized → competency gaps accumulate → **department KPIs missed for 2 consecutive quarters**' },
      ASH: { vi: 'IT team N/A rating kéo dài → không có kế hoạch phát triển → **rủi ro mất nhân sự IT khi không thấy lộ trình thăng tiến**', en: 'IT team N/A ratings prolonged → no development plan → **IT talent attrition risk when no career path is visible**' }
    }
  };

  // ── NEXT 90 DAYS ROADMAP ───────────────────────────────────────────────────
  const roadmapData: Record<string, Record<string, { vi: string[]; en: string[] }>> = {
    '9box': {
      MLN: {
        vi: ['**Tháng 1:** HOD xác nhận danh sách Movers và lên kế hoạch PIP cụ thể cho từng người', '**Tháng 2:** L&D + HRBP review tiến độ PIP và điều chỉnh nếu cần', '**Tháng 3:** Cập nhật lại 9-Box sau khi có kết quả PIP — đo lường chuyển dịch nhóm'],
        en: ['**Month 1:** HODs confirm Movers list and create specific PIPs for each individual', '**Month 2:** L&D + HRBP review PIP progress and adjust as needed', '**Month 3:** Update 9-Box after PIP results — measure group transition movement']
      },
      WNK: {
        vi: ['**Tháng 1:** HOD UPH Support WNK3 xác nhận danh sách 6 nhân sự Low Readiness và assign Mentor', '**Tháng 2:** Triển khai Coaching Program pilot cho nhóm này', '**Tháng 3:** Đánh giá lại R-Rating và cập nhật 9-Box — mục tiêu: ít nhất 4/6 người lên R3'],
        en: ['**Month 1:** UPH Support WNK3 HOD confirms 6 Low Readiness employees and assigns Mentors', '**Month 2:** Launch Coaching Program pilot for this group', '**Month 3:** Re-evaluate R-Ratings and update 9-Box — target: at least 4/6 move to R3']
      },
      ASH: {
        vi: ['**Tháng 1:** HOD xác định 2-3 Rising Star tiềm năng từ nhóm Keepers để đầu tư phát triển', '**Tháng 2:** Assign stretch assignments và Mentor từ Superstar cohort (Windy Sy)', '**Tháng 3:** Review tiến độ và cập nhật 9-Box — mục tiêu: tăng Growers từ 36% lên 40%'],
        en: ['**Month 1:** HODs identify 2-3 potential Rising Stars from Keepers group for accelerated development', '**Month 2:** Assign stretch assignments and Mentors from Superstar cohort (Windy Sy)', '**Month 3:** Review progress and update 9-Box — target: increase Growers from 36% to 40%']
      }
    },
    'pipeline': {
      MLN: {
        vi: ['**Tháng 1:** HRBP lập danh sách ưu tiên các vị trí "Interim Only" và đề xuất Successor candidate', '**Tháng 2:** HOD + HRBP xây dựng kế hoạch phát triển 6 tháng cho từng Successor candidate', '**Tháng 3:** Review readiness và cập nhật trạng thái pipeline — mục tiêu: 0 vị trí "No Successor"'],
        en: ['**Month 1:** HRBP prioritizes "Interim Only" positions and proposes Successor candidates', '**Month 2:** HOD + HRBP build 6-month development plans for each Successor candidate', '**Month 3:** Review readiness and update pipeline status — target: 0 "No Successor" positions']
      },
      WNK: {
        vi: ['**Tháng 1:** Xác định Successor candidate cho tất cả vị trí Supervisor UPH và Cut&Sew WNK3', '**Tháng 2:** Triển khai chương trình Shadowing — Successor đi kèm Supervisor trong 4 tuần', '**Tháng 3:** Đánh giá readiness và cập nhật trạng thái — mục tiêu: 80% vị trí có Successor "< 1 Year"'],
        en: ['**Month 1:** Identify Successor candidates for all UPH and Cut&Sew WNK3 Supervisor positions', '**Month 2:** Launch Shadowing program — Successors shadow Supervisors for 4 weeks', '**Month 3:** Assess readiness and update status — target: 80% positions have "< 1 Year" Successors']
      },
      ASH: {
        vi: ['**Tháng 1:** Warehouse HOD lập Cross-training Matrix cho 23 vị trí No Successor — mỗi vị trí cần ít nhất 1 người backup', '**Tháng 2:** Triển khai Cross-training theo ma trận — ưu tiên Loading và Picking trước', '**Tháng 3:** Review và cập nhật pipeline — mục tiêu: giảm No Successor từ 43% xuống dưới 25%'],
        en: ['**Month 1:** Warehouse HOD creates Cross-training Matrix for 23 No Successor positions — each needs at least 1 backup', '**Month 2:** Execute Cross-training per matrix — prioritize Loading and Picking first', '**Month 3:** Review and update pipeline — target: reduce No Successor from 43% to below 25%']
      }
    },
    'devplan': {
      MLN: {
        vi: ['**Tháng 1:** HOD xác nhận danh sách tham gia từng chương trình — cam kết tỷ lệ tối thiểu 80%', '**Tháng 2:** Triển khai 2 chương trình ưu tiên cao nhất (AI & Automation + Leadership)', '**Tháng 3:** Đo lường completion rate và thu thập feedback — điều chỉnh lịch cho Q4'],
        en: ['**Month 1:** HODs confirm participant lists for each program — commit to minimum 80% rate', '**Month 2:** Launch 2 highest priority programs (AI & Automation + Leadership)', '**Month 3:** Measure completion rate and collect feedback — adjust schedule for Q4']
      },
      WNK: {
        vi: ['**Tháng 1:** Xác định 10-15 Trainer nội bộ tiềm năng để tham gia Train-the-Trainer program', '**Tháng 2:** Triển khai Coaching Program cho nhóm Trainer — 3 buổi/tuần trong 4 tuần', '**Tháng 3:** Trainer nội bộ bắt đầu đào tạo lại cho nhóm của mình — L&D giám sát chất lượng'],
        en: ['**Month 1:** Identify 10-15 potential internal Trainers for Train-the-Trainer program', '**Month 2:** Launch Coaching Program for Trainer group — 3 sessions/week for 4 weeks', '**Month 3:** Internal Trainers begin training their own teams — L&D monitors quality']
      },
      ASH: {
        vi: ['**Tháng 1:** Triển khai Communication Workshop cho tất cả 7 departments (100% coverage)', '**Tháng 2:** Bắt đầu Coaching Program — ưu tiên HOD và Team Leader trước', '**Tháng 3:** Đo lường impact: tỷ lệ Low Readiness Coaching giảm từ 81.8% xuống dưới 60%'],
        en: ['**Month 1:** Launch Communication Workshop for all 7 departments (100% coverage)', '**Month 2:** Begin Coaching Program — prioritize HODs and Team Leaders first', '**Month 3:** Measure impact: Coaching Low Readiness rate drops from 81.8% to below 60%']
      }
    },
    'idp': {
      MLN: {
        vi: ['**Tháng 1:** HOD review tất cả IDP có R1/R2 và xác nhận kế hoạch can thiệp trong 30 ngày', '**Tháng 2:** Tích hợp IDP review vào lịch 1-1 hàng tuần — ít nhất 15 phút/người/tuần', '**Tháng 3:** L&D tổng hợp tiến độ IDP toàn site — báo cáo lên HRD về completion rate'],
        en: ['**Month 1:** HODs review all R1/R2 IDPs and confirm intervention plans within 30 days', '**Month 2:** Integrate IDP review into weekly 1-1 schedule — minimum 15 min/person/week', '**Month 3:** L&D consolidates site-wide IDP progress — report completion rate to HRD']
      },
      WNK: {
        vi: ['**Tháng 1:** HOD xác định Top 3 Opportunities (đánh dấu X) cho từng nhân sự và assign action owner', '**Tháng 2:** Triển khai action plan cho Top Opportunities — giao việc thực tế, không chỉ đào tạo lý thuyết', '**Tháng 3:** Đánh giá lại R-Rating cho Top Opportunities — mục tiêu: 70% tăng ít nhất 1 bậc'],
        en: ['**Month 1:** HODs identify Top 3 Opportunities (marked X) per employee and assign action owners', '**Month 2:** Execute action plans for Top Opportunities — real work assignments, not just theory training', '**Month 3:** Re-evaluate R-Ratings for Top Opportunities — target: 70% improve by at least 1 level']
      },
      ASH: {
        vi: ['**Tháng 1:** IT HOD hoàn thiện đánh giá R-Rating cho Denis Vy, River Le, Ryder Nguyen', '**Tháng 2:** Xây dựng IDP cụ thể cho nhóm IT dựa trên kết quả đánh giá', '**Tháng 3:** Review tiến độ IDP toàn site ASH — đảm bảo 100% nhân sự có IDP hoàn chỉnh'],
        en: ['**Month 1:** IT HOD completes R-Rating assessment for Denis Vy, River Le, Ryder Nguyen', '**Month 2:** Build specific IDPs for IT team based on assessment results', '**Month 3:** Review ASH site-wide IDP progress — ensure 100% employees have complete IDPs']
      }
    }
  };

  // ── MAIN CONTENT ───────────────────────────────────────────────────────────
  const content = {
    '9box': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — MA TRẬN PHÁT TRIỂN TÀI NĂNG 9-BOX',
      titleEn: 'MANAGEMENT PLAYBOOK — 9-BOX TALENT ALIGNMENT',
      whyTitleVi: 'Tại sao cần 9-Box?',
      whyTitleEn: 'Why 9-Box?',
      whyVi: '**9-Box không phải là công cụ đánh giá** — đây là **bản đồ chiến lược nhân tài**.\nGiúp HOD và HRBP nhìn thấy ngay: ai cần đầu tư phát triển, ai cần giữ chân, ai cần can thiệp — dựa trên **2 chiều khoa học**: Hiệu suất thực tế (Performance) và Tiềm năng học hỏi (Learning Agility).\nKhông có 9-Box, mọi quyết định nhân sự đều dựa trên cảm tính — **rủi ro cao, chi phí lớn**.',
      whyEn: '**9-Box is not an appraisal tool** — it is a **strategic talent map**.\nHelps HODs and HRBPs immediately see: who needs development investment, who needs retention, who needs intervention — based on **2 scientific dimensions**: Actual Performance and Learning Agility (Potential).\nWithout 9-Box, all talent decisions are intuition-based — **high risk, high cost**.',
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Goal',
      goalVi: 'Xây dựng **đội ngũ tự phát triển** — nơi Growers kéo Keepers lên, Keepers ổn định vận hành, và Movers được can thiệp kịp thời.\nMục tiêu lý tưởng: **Growers ≥ 30%, Keepers ≥ 50%, Movers ≤ 20%** — đây là cơ cấu nhân tài bền vững cho môi trường sản xuất.',
      goalEn: 'Build a **self-developing team** — where Growers pull Keepers up, Keepers stabilize operations, and Movers receive timely intervention.\nIdeal target: **Growers ≥ 30%, Keepers ≥ 50%, Movers ≤ 20%** — this is the sustainable talent structure for manufacturing environments.',
      howTitleVi: 'HOD cần làm gì với dữ liệu này?',
      howTitleEn: 'What should HODs do with this data?',
      howVi: ['**Xem tỷ lệ phân bổ** Growers/Keepers/Movers của bộ phận mình — so sánh với mục tiêu lý tưởng', '**Click vào từng ô 9-Box** để xem danh sách nhân sự cụ thể và hồ sơ năng lực chi tiết', '**Ưu tiên hành động** theo thứ tự: Movers (can thiệp ngay) → Growers (đầu tư phát triển) → Keepers (giữ chân)'],
      howEn: ['**Review distribution ratio** of Growers/Keepers/Movers in your department — compare with ideal targets', '**Click each 9-Box cell** to see specific employee lists and detailed competency profiles', '**Prioritize actions** in order: Movers (intervene now) → Growers (invest in development) → Keepers (retain)']
    },
    'pipeline': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — QUY HOẠCH KẾ THỪA SUCCESSION PIPELINE',
      titleEn: 'MANAGEMENT PLAYBOOK — CRITICAL SUCCESSION PIPELINE',
      whyTitleVi: 'Tại sao cần Succession Planning?',
      whyTitleEn: 'Why Succession Planning?',
      whyVi: '**Không ai là không thể thay thế — nhưng thời gian thay thế mới là vấn đề.**\nMỗi vị trí "No Successor" là một **quả bom hẹn giờ**: khi người đó nghỉ việc, bệnh, hoặc thăng chức — bộ phận sẽ mất từ **3-12 tháng** để ổn định lại.\nSuccession Planning không phải là "chuẩn bị cho người nghỉ" — đó là **bảo hiểm vận hành cho toàn tổ chức**.',
      whyEn: '**No one is irreplaceable — but the replacement time is the real problem.**\nEach "No Successor" position is a **ticking time bomb**: when that person resigns, falls ill, or gets promoted — the department needs **3-12 months** to stabilize.\nSuccession Planning is not "preparing for departures" — it is **operational insurance for the entire organization**.',
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Goal',
      goalVi: 'Đạt **Succession Coverage Rate ≥ 80%** cho tất cả vị trí critical roles trong vòng 12 tháng.\nMỗi vị trí cần có ít nhất **1 Successor "Ready Now" hoặc "< 1 Year"** — không chấp nhận "Interim Only" kéo dài quá 6 tháng.',
      goalEn: 'Achieve **Succession Coverage Rate ≥ 80%** for all critical roles within 12 months.\nEach position needs at least **1 "Ready Now" or "< 1 Year" Successor** — "Interim Only" status lasting more than 6 months is not acceptable.',
      howTitleVi: 'HOD cần làm gì với dữ liệu này?',
      howTitleEn: 'What should HODs do with this data?',
      howVi: ['**Xác định ngay** các vị trí "No Successor" và "Interim Only" trong bộ phận — đây là ưu tiên #1', '**Đề xuất Successor candidate** cho HRBP trong vòng 2 tuần — dựa trên 9-Box Growers của bộ phận', '**Theo dõi Readiness Timeline** và giao stretch assignments để đẩy nhanh tiến độ sẵn sàng'],
      howEn: ['**Immediately identify** "No Successor" and "Interim Only" positions in your department — this is Priority #1', '**Propose Successor candidates** to HRBP within 2 weeks — based on department\'s 9-Box Growers', '**Monitor Readiness Timeline** and assign stretch assignments to accelerate readiness progress']
    },
    'devplan': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — KẾ HOẠCH BỒI DƯỠNG TIÊU ĐIỂM',
      titleEn: 'MANAGEMENT PLAYBOOK — TARGETED LEARNING CURRICULUMS',
      whyTitleVi: 'Tại sao cần Training Plan tập trung?',
      whyTitleEn: 'Why Focused Training Plan?',
      whyVi: '**Đào tạo dàn trải = không ai giỏi thêm.** Nghiên cứu của McKinsey (2022) cho thấy chỉ **25% chương trình đào tạo** tạo ra thay đổi hành vi thực sự.\nLý do: đào tạo không gắn với nhu cầu thực tế của công việc.\nTraining Plan này được xây dựng **từ dưới lên** — từ IDP records thực tế → tổng hợp khoảng cách năng lực → thiết kế chương trình có mục tiêu đo lường được.',
      whyEn: '**Scattered training = no one improves.** McKinsey research (2022) shows only **25% of training programs** create real behavioral change.\nReason: training not linked to actual job needs.\nThis Training Plan is built **bottom-up** — from real IDP records → aggregated competency gaps → programs with measurable objectives.',
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Goal',
      goalVi: 'Mỗi chương trình đào tạo phải có **KPI đo lường cụ thể** sau 3 tháng triển khai:\n**Completion Rate ≥ 80%** | **Behavior Transfer Rate ≥ 60%** | **Manager Satisfaction ≥ 4/5**\nKhông đạt KPI → L&D và HOD cùng review và điều chỉnh chương trình.',
      goalEn: 'Each training program must have **specific measurable KPIs** after 3 months of deployment:\n**Completion Rate ≥ 80%** | **Behavior Transfer Rate ≥ 60%** | **Manager Satisfaction ≥ 4/5**\nKPIs not met → L&D and HOD jointly review and adjust the program.',
      howTitleVi: 'HOD cần làm gì với dữ liệu này?',
      howTitleEn: 'What should HODs do with this data?',
      howVi: ['**Xem bộ phận mình** có trong danh sách departments của chương trình nào — đó là chương trình bắt buộc tham gia', '**Cam kết tỷ lệ tham gia** tối thiểu 80% và sắp xếp ca kíp phù hợp để nhân viên có thể tham gia', '**Theo dõi và báo cáo** hành vi áp dụng sau đào tạo — đây là bằng chứng ROI quan trọng nhất'],
      howEn: ['**Check if your department** appears in any program\'s department list — those are mandatory participation programs', '**Commit to minimum 80% participation** and arrange shift schedules so employees can attend', '**Monitor and report** post-training behavior application — this is the most important ROI evidence']
    },
    'idp': {
      titleVi: 'HƯỚNG DẪN DÀNH CHO QUẢN LÝ — KẾ HOẠCH HÀNH ĐỘNG CÁ NHÂN (IDP)',
      titleEn: 'MANAGEMENT PLAYBOOK — INDIVIDUAL DEVELOPMENT PLANS',
      whyTitleVi: 'Tại sao IDP quan trọng?',
      whyTitleEn: 'Why IDP matters?',
      whyVi: '**IDP là hợp đồng phát triển giữa nhân viên và tổ chức** — không phải form điền cho có.\nNghiên cứu của Gallup (2023): nhân viên có **IDP được follow-up đều đặn** có tỷ lệ gắn kết cao hơn **3.5 lần** và tỷ lệ nghỉ việc thấp hơn **40%**.\nIDP không có follow-up = lãng phí thời gian của cả nhân viên lẫn quản lý.',
      whyEn: '**IDP is a development contract between employee and organization** — not a form to fill for compliance.\nGallup research (2023): employees with **regularly followed-up IDPs** have **3.5x higher engagement** and **40% lower turnover**.\nIDP without follow-up = wasted time for both employees and managers.',
      goalTitleVi: 'Mục tiêu chiến lược',
      goalTitleEn: 'Strategic Goal',
      goalVi: '**100% nhân sự kế thừa** có IDP hoàn chỉnh với action items cụ thể, timeline rõ ràng, và người chịu trách nhiệm được xác định.\nMỗi IDP được review **ít nhất 1 lần/tháng** trong cuộc họp 1-1 — không phải chỉ review khi đến kỳ đánh giá.',
      goalEn: '**100% successor employees** have complete IDPs with specific action items, clear timelines, and identified accountability owners.\nEach IDP reviewed **at least once/month** in 1-1 meetings — not only during performance review cycles.',
      howTitleVi: 'HOD cần làm gì với dữ liệu này?',
      howTitleEn: 'What should HODs do with this data?',
      howVi: ['**Tìm kiếm nhân sự bộ phận mình** và xem chi tiết IDP — đặc biệt chú ý các duties có R1/R2 và Top Opportunity (X)', '**Tích hợp IDP vào 1-1 hàng tuần** — dành 15 phút cuối mỗi buổi để review tiến độ 1-2 action items', '**Ghi nhận và khen thưởng** khi nhân viên hoàn thành milestone IDP — đây là động lực quan trọng nhất'],
      howEn: ['**Search for your department employees** and review IDP details — especially duties with R1/R2 and Top Opportunity (X)', '**Integrate IDP into weekly 1-1s** — spend last 15 minutes reviewing progress on 1-2 action items', '**Recognize and reward** when employees complete IDP milestones — this is the most important motivator']
    }
  };

  const item = content[featureKey];
  const siteKey = selectedSite || 'MLN';
  const insight = siteInsights[featureKey]?.[siteKey];
  const risk = riskData[featureKey]?.[siteKey];
  const roadmap = roadmapData[featureKey]?.[siteKey];

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
        <div className="mt-6 space-y-5 animate-in fade-in duration-300">

          {/* ── ROW 1: WHY / GOAL / HOW ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
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

          {/* ── ROW 2: SITE INSIGHT + RISK ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insight && (
              <div className="bg-blue-950/30 border border-blue-800/40 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/15 rounded-lg border border-blue-500/25">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 font-mono">
                    {lang === 'VI' ? `📊 Nhận định từ Data — Site ${siteKey}` : `📊 Data Insight — Site ${siteKey}`}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-slate-200 font-medium">
                  {renderFormattedText(lang === 'VI' ? insight.vi : insight.en)}
                </p>
              </div>
            )}
            {risk && (
              <div className="bg-rose-950/30 border border-rose-800/40 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-500/15 rounded-lg border border-rose-500/25">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 font-mono">
                    {lang === 'VI' ? '⚠️ Rủi ro nếu không hành động' : '⚠️ Risk if No Action'}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-slate-200 font-medium">
                  {renderFormattedText(lang === 'VI' ? risk.vi : risk.en)}
                </p>
              </div>
            )}
          </div>

          {/* ── ROW 3: NEXT 90 DAYS ── */}
          {roadmap && (
            <div className="bg-emerald-950/25 border border-emerald-800/35 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-emerald-500/15 rounded-lg border border-emerald-500/25">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">
                  {lang === 'VI' ? '🗓️ Lộ trình hành động 90 ngày tiếp theo' : '🗓️ Next 90-Day Action Roadmap'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(lang === 'VI' ? roadmap.vi : roadmap.en).map((step, idx) => (
                  <div key={idx} className="bg-slate-950/40 rounded-xl p-3.5 border border-emerald-900/30 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-[11.5px] leading-relaxed text-slate-200 font-medium">
                      {renderFormattedText(step)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FOOTER ── */}
          <div className="flex items-start gap-2.5 bg-slate-950/30 rounded-xl p-3.5 border border-slate-800/40">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'VI'
                ? 'Dữ liệu trên được tổng hợp từ kết quả đánh giá thực tế của từng site. HOD và HRBP có trách nhiệm xác nhận và cập nhật thông tin định kỳ mỗi quý để đảm bảo tính chính xác và hành động kịp thời.'
                : 'Data above is aggregated from actual site assessment results. HODs and HRBPs are responsible for confirming and updating information quarterly to ensure accuracy and timely action.'}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}