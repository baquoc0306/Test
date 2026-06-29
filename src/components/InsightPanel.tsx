import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Zap, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';

interface InsightPanelProps {
  featureKey: '9box' | 'pipeline' | 'devplan' | 'idp';
  lang: 'VI' | 'EN';
  selectedSite: 'MLN' | 'WNK' | 'ASH';
  selectedDept: string;
}

type InsightEntry = { vi: string; en: string };
type InsightRecord = { insight: InsightEntry; risk: InsightEntry; nextStep: InsightEntry };

function bold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} className="text-white font-extrabold">{p.slice(2, -2)}</strong>
      : p
  );
}

const DATA: Record<string, Record<string, InsightRecord>> = {
  '9box': {
    'ASH_ALL': {
      insight: { vi: '**Ashton tổng thể (44 nhân tài):** Cơ cấu **Growers 34% / Keepers 61% / Movers 5%**. Tỷ lệ Keepers cao phản ánh đội ngũ vận hành ổn định nhưng thiếu động lực tăng trưởng. Chỉ có **1 Superstar (Windy Sy, FA)** — rủi ro tập trung năng lực lãnh đạo cao nhất. 8 Rising Stars phân bổ rải rác ở Customs và Warehouse — tiềm năng tốt nhưng chưa được đầu tư có hệ thống.', en: '**Ashton overall (44 talents):** **Growers 34% / Keepers 61% / Movers 5%** structure. High Keepers ratio reflects stable operations but lacks growth momentum. Only **1 Superstar (Windy Sy, FA)** — highest leadership capability concentration risk. 8 Rising Stars scattered across Customs and Warehouse — good potential but no systematic investment yet.' },
      risk: { vi: 'Với chỉ 1 Superstar, nếu Windy Sy rời đi, **toàn bộ năng lực FA Manager bị gián đoạn ngay lập tức**. Tỷ lệ Growers 34% thấp hơn benchmark lý tưởng (≥40%) — nếu không đầu tư Rising Stars trong 6 tháng tới, Ashton sẽ phải tuyển dụng bên ngoài cho các vị trí quản lý.', en: 'With only 1 Superstar, if Windy Sy leaves, **all FA Manager capability will be immediately disrupted**. Growers ratio 34% below ideal benchmark (≥40%) — without investing in Rising Stars in 6 months, Ashton will need external recruitment for management positions.' },
      nextStep: { vi: 'L&D + HRBP: **Xác định 3 Rising Star ưu tiên** (Mi Nguyen/CS, Clara Chau/WH, Maya Nguyen/FA) → Assign Windy Sy làm Executive Mentor → Thiết kế stretch assignment cụ thể trong Q3/2026.', en: 'L&D + HRBP: **Identify top 3 Rising Stars** (Mi Nguyen/CS, Clara Chau/WH, Maya Nguyen/FA) → Assign Windy Sy as Executive Mentor → Design specific stretch assignments in Q3/2026.' }
    },
    'ASH_CUSTOMER SERVICE': {
      insight: { vi: '**Customer Service (9 người):** Cơ cấu **Growers 11% / Keepers 78% / Movers 11%** — tỷ lệ Growers thấp nhất toàn site. Chỉ có **Mi Nguyen (Rising Star)** là nhân tài tăng trưởng duy nhất. Helen Nguyen (Seasoned Professional) là trụ cột kinh nghiệm nhưng tiềm năng học hỏi đã bão hòa. **Amy Nguyen (Diamond in the Rough)** — tiềm năng cao nhưng hiệu suất chưa đạt, cần can thiệp ngay.', en: '**Customer Service (9 people):** **Growers 11% / Keepers 78% / Movers 11%** — lowest Growers ratio site-wide. Only **Mi Nguyen (Rising Star)** as sole growth talent. Helen Nguyen (Seasoned Professional) is experience anchor but learning potential has plateaued. **Amy Nguyen (Diamond in the Rough)** — high potential but underperforming, needs immediate intervention.' },
      risk: { vi: 'CS là bộ phận tiếp xúc khách hàng trực tiếp nhưng không có Superstar hay High Professional — năng lực giải quyết vấn đề phức tạp đang thiếu hụt. Nếu Mi Nguyen (Rising Star duy nhất) rời đi, bộ phận sẽ không có ai đủ năng lực kế thừa Team Leader trong 1-2 năm tới.', en: 'CS is direct customer-facing but has no Superstar or High Professional — complex problem-solving capability is deficient. If Mi Nguyen (sole Rising Star) leaves, no one will be capable of succeeding Team Leader within 1-2 years.' },
      nextStep: { vi: '**Amy Nguyen PIP 90 ngày** với Helen Nguyen làm Mentor trực tiếp. **Mi Nguyen:** Giao 1 dự án cross-functional để phát triển tư duy hệ thống và test leadership readiness.', en: '**Amy Nguyen 90-day PIP** with Helen Nguyen as direct Mentor. **Mi Nguyen:** Assign 1 cross-functional project to develop systems thinking and test leadership readiness.' }
    },
    'ASH_CUSTOMS': {
      insight: { vi: '**Customs (8 người):** Cơ cấu **Growers 38% / Keepers 62% / Movers 0%** — không có Movers, dấu hiệu tích cực. **Julie Phung (High Professional)** là trụ cột kỹ thuật. **Tiny Nguyen và Harry Nguyen (Rising Stars)** đang phát triển tốt. 3 Valued Contributors (Susan, Lona, Anna) có nguy cơ "bình nguyên hóa" nếu không có thách thức mới.', en: '**Customs (8 people):** **Growers 38% / Keepers 62% / Movers 0%** — no Movers, positive sign. **Julie Phung (High Professional)** is technical anchor. **Tiny Nguyen and Harry Nguyen (Rising Stars)** developing well. 3 Valued Contributors (Susan, Lona, Anna) risk "plateauing" without new challenges.' },
      risk: { vi: 'Julie Phung là **Customs Team Leader duy nhất không có Successor** (xem Pipeline). Nếu Julie nghỉ đột xuất, không ai đủ năng lực thay thế ngay — rủi ro vận hành nghiêm trọng vì Customs liên quan trực tiếp đến thông quan hàng hóa xuất nhập khẩu.', en: 'Julie Phung is the **only Customs Team Leader with No Successor** (see Pipeline). If Julie leaves suddenly, no one can immediately replace her — serious operational risk as Customs directly impacts import/export clearance.' },
      nextStep: { vi: '**Khẩn cấp:** Assign Tiny Nguyen hoặc Harry Nguyen làm Successor candidate cho Julie Phung → Bắt đầu Shadowing program Q3/2026. Mục tiêu: 1 người đạt "Ready < 1 Year" trước Q1/2027.', en: '**Urgent:** Assign Tiny Nguyen or Harry Nguyen as Successor candidate for Julie Phung → Start Shadowing program Q3/2026. Target: 1 person achieves "Ready < 1 Year" before Q1/2027.' }
    },
    'ASH_FINANCE & ACCOUNTING': {
      insight: { vi: '**Finance & Accounting (5 người):** Cơ cấu **Growers 60% / Keepers 40% / Movers 0%** — tỷ lệ Growers cao nhất toàn site. **Windy Sy (Superstar)** + **Ha Nguyen (High Professional)** tạo thành cặp lãnh đạo mạnh nhất Ashton. **Maya Nguyen (Rising Star)** đang phát triển nhanh với 23 Top Opportunities trong IDP — nhân tài cần đầu tư ưu tiên cao nhất.', en: '**Finance & Accounting (5 people):** **Growers 60% / Keepers 40% / Movers 0%** — highest Growers ratio site-wide. **Windy Sy (Superstar)** + **Ha Nguyen (High Professional)** form Ashton\'s strongest leadership pair. **Maya Nguyen (Rising Star)** developing rapidly with 23 Top Opportunities in IDP — highest priority talent for investment.' },
      risk: { vi: 'FA có pipeline kế thừa tốt nhất (100% covered) nhưng **quá phụ thuộc vào Windy Sy**. Nếu Windy Sy được thăng chức lên cấp Group/Regional, Ha Nguyen lên FA Manager — nhưng vị trí Assistant FA Manager sẽ trống và Maya Nguyen chưa chắc sẵn sàng trong 1 năm.', en: 'FA has best succession pipeline (100% covered) but **over-reliant on Windy Sy**. If Windy Sy is promoted to Group/Regional level, Ha Nguyen becomes FA Manager — but Assistant FA Manager will be vacant and Maya Nguyen may not be ready within 1 year.' },
      nextStep: { vi: '**Đầu tư Maya Nguyen:** Giao thêm trách nhiệm Financial Modeling và Tax Declaration để đẩy nhanh từ Rising Star → High Professional trong 12 tháng. Đây là khoản đầu tư có ROI cao nhất cho FA.', en: '**Invest in Maya Nguyen:** Assign additional Financial Modeling and Tax Declaration responsibilities to accelerate from Rising Star → High Professional within 12 months. Highest ROI investment for FA.' }
    },
    'ASH_HUMAN RESOURCES': {
      insight: { vi: '**Human Resources (7 người):** Cơ cấu **Growers 29% / Keepers 57% / Movers 14%**. **Carlo Pham (Future Utility)** là Mover duy nhất — hiệu suất thấp, tiềm năng trung bình, cần PIP ngay. **Lisa Nguyen và Ellie Tran (High Professionals)** tạo thành cặp HR Specialist mạnh với khả năng backup lẫn nhau tốt. Không có Superstar trong HR — năng lực chiến lược HR đang thiếu.', en: '**Human Resources (7 people):** **Growers 29% / Keepers 57% / Movers 14%**. **Carlo Pham (Future Utility)** is sole Mover — low performance, mid potential, needs immediate PIP. **Lisa Nguyen and Ellie Tran (High Professionals)** form strong HR Specialist pair with good mutual backup. No Superstar in HR — strategic HR capability is lacking.' },
      risk: { vi: 'HR là bộ phận hỗ trợ toàn site nhưng không có ai ở cấp Superstar để dẫn dắt các sáng kiến HR chiến lược. Carlo Pham nếu không cải thiện trong 90 ngày sẽ trở thành gánh nặng vận hành — chi phí cơ hội cao khi HR cần tập trung vào ramp-up nhân sự cho Ashton.', en: 'HR supports entire site but no one at Superstar level to lead strategic HR initiatives. Carlo Pham without improvement in 90 days will become operational burden — high opportunity cost when HR needs to focus on Ashton personnel ramp-up.' },
      nextStep: { vi: '**Carlo Pham PIP:** KPI cụ thể 90 ngày với Lisa Nguyen làm Supervisor trực tiếp. **Lisa hoặc Ellie:** Assign dẫn dắt 1 dự án HR chiến lược (Onboarding Program mới) để phát triển lên Superstar trong 18 tháng.', en: '**Carlo Pham PIP:** Specific 90-day KPIs with Lisa Nguyen as direct Supervisor. **Lisa or Ellie:** Assign to lead 1 strategic HR project (new Onboarding Program) to develop toward Superstar within 18 months.' }
    },
    'ASH_INFORMATION SYSTEM': {
      insight: { vi: '**Information System (4 người):** Cơ cấu **Growers 50% / Keepers 50% / Movers 0%** — cân bằng tốt. **River Le và Harry Hoang (Rising Stars)** đang phát triển tích cực. Tuy nhiên, **75% IDP records có R-Rating N/A** — đây là khoảng trống đánh giá lớn nhất site, không phải thiếu năng lực mà là chưa hoàn thiện assessment.', en: '**Information System (4 people):** **Growers 50% / Keepers 50% / Movers 0%** — well balanced. **River Le and Harry Hoang (Rising Stars)** developing positively. However, **75% of IDP records have N/A R-Rating** — largest assessment gap on site, not lack of capability but incomplete assessment.' },
      risk: { vi: 'Với **3/4 vị trí IT "At Risk"** trong Pipeline (Denis Vy, Ryder Nguyen, Harry Hoang không có Successor), nếu bất kỳ ai nghỉ việc, **hệ thống IT toàn site Ashton sẽ bị ảnh hưởng nghiêm trọng**. Harry Hoang (IT Software Developer) — kỹ năng phát triển phần mềm rất khó thay thế trong ngắn hạn.', en: 'With **3/4 IT positions "At Risk"** in Pipeline (Denis Vy, Ryder Nguyen, Harry Hoang have no Successor), if anyone leaves, **Ashton\'s entire IT infrastructure will be severely impacted**. Harry Hoang (IT Software Developer) — software development skills very difficult to replace short-term.' },
      nextStep: { vi: '**Ưu tiên #1:** HOD IT hoàn thiện R-Rating assessment cho Denis Vy, River Le, Ryder Nguyen trong tháng 7/2026. **Ưu tiên #2:** River Le học thêm Software Development từ Harry Hoang để tạo backup capability.', en: '**Priority #1:** IT HOD completes R-Rating assessment for Denis Vy, River Le, Ryder Nguyen by July 2026. **Priority #2:** River Le learns Software Development from Harry Hoang to create backup capability.' }
    },
    'ASH_LOGISTICS': {
      insight: { vi: '**Logistics (6 người):** Cơ cấu **Growers 17% / Keepers 83% / Movers 0%** — tỷ lệ Growers thấp thứ 2 sau CS. **KYLIE (Rising Star)** là nhân tài tăng trưởng duy nhất nhưng đang ở vị trí High Risk trong Pipeline (1-2 Years readiness). **ALANA (Seasoned Professional)** là trụ cột kinh nghiệm — cần khai thác theo hướng Mentoring thay vì phát triển thêm.', en: '**Logistics (6 people):** **Growers 17% / Keepers 83% / Movers 0%** — second lowest Growers ratio after CS. **KYLIE (Rising Star)** is sole growth talent but High Risk in Pipeline (1-2 Years readiness). **ALANA (Seasoned Professional)** is experience anchor — should be leveraged for Mentoring rather than further development.' },
      risk: { vi: 'KYLIE và ALICE đều là **High Risk trong Pipeline** — 2 vị trí Logistics Specialist quan trọng nhất đang trong giai đoạn phát triển Successor. Nếu cả 2 nghỉ việc cùng lúc, **toàn bộ mảng FCA Transportation và Inbound sẽ bị tê liệt**.', en: 'KYLIE and ALICE are both **High Risk in Pipeline** — the 2 most critical Logistics Specialist positions in Successor development. If both leave simultaneously, **entire FCA Transportation and Inbound operations will be paralyzed**.' },
      nextStep: { vi: '**Đẩy nhanh KYLIE:** Giao thêm trách nhiệm quản lý FCA Transportation độc lập trong Q3 để rút ngắn readiness từ "1-2 Years" xuống "< 1 Year". **ALANA làm Mentor chính thức** cho KYLIE và ALICE.', en: '**Accelerate KYLIE:** Assign independent FCA Transportation management in Q3 to shorten readiness from "1-2 Years" to "< 1 Year". **ALANA as official Mentor** for KYLIE and ALICE.' }
    },
    'ASH_WAREHOUSE': {
      insight: { vi: '**Warehouse (5 người trong 9-Box):** Cơ cấu **Growers 60% / Keepers 40% / Movers 0%** — tỷ lệ Growers tốt nhất trong nhóm quản lý. **Thinh Mai và Violet Nguyen (High Professionals)** là cặp lãnh đạo mạnh. **Clara Chau (Rising Star)** có tiềm năng cao nhất. Tuy nhiên, đây chỉ là 5 người quản lý cấp cao — **34 vị trí operational trong Pipeline đang có Coverage Rate chỉ 9%**.', en: '**Warehouse (5 people in 9-Box):** **Growers 60% / Keepers 40% / Movers 0%** — best Growers ratio among management group. **Thinh Mai and Violet Nguyen (High Professionals)** form strong leadership pair. **Clara Chau (Rising Star)** has highest potential. However, these are only 5 senior managers — **34 operational positions in Pipeline have only 9% Coverage Rate**.' },
      risk: { vi: '**Warehouse là điểm rủi ro nghiêm trọng nhất của Ashton:** 23 vị trí "No Successor", 3 vị trí "Critical" (Võ Anh Cảnh/Manager, Francisco Gonzalez/Director, Kim Trần/Manager). Nếu Francisco Gonzalez (Warehouse Director) rời đi, **không có ai trong site có thể thay thế ngay** — rủi ro vận hành cấp độ site.', en: '**Warehouse is Ashton\'s most critical risk point:** 23 "No Successor" positions, 3 "Critical" positions (Võ Anh Cảnh/Manager, Francisco Gonzalez/Director, Kim Trần/Manager). If Francisco Gonzalez (Warehouse Director) leaves, **no one in the site can immediately replace him** — site-level operational risk.' },
      nextStep: { vi: '**Khẩn cấp nhất toàn site:** Thinh Mai + Violet Nguyen lập **Cross-training Matrix** cho 23 vị trí No Successor — ưu tiên Loading (3 Supervisors) và UPH Team Leaders (3 người) trước. Mục tiêu Q3: mỗi vị trí có ít nhất 1 người backup được đào tạo.', en: '**Most urgent site-wide:** Thinh Mai + Violet Nguyen create **Cross-training Matrix** for 23 No Successor positions — prioritize Loading (3 Supervisors) and UPH Team Leaders (3 people) first. Q3 target: each position has at least 1 trained backup.' }
    },
    'WNK_ALL': {
      insight: { vi: '**Wanek tổng thể:** 55 nhân tài trong giai đoạn ramp-up mạnh. Điểm nóng: **UPH Support WNK3** có tỷ lệ Low Readiness cao nhất (6/16 duties = 37.5%) — cần can thiệp ngay trước khi ramp-up Q4. Growers tập trung ở Training và IT — đây là 2 bộ phận có thể làm Train-the-Trainer cho toàn site.', en: '**Wanek overall:** 55 talents in strong ramp-up phase. Hotspot: **UPH Support WNK3** has highest Low Readiness rate (6/16 duties = 37.5%) — needs immediate intervention before Q4 ramp-up. Growers concentrated in Training and IT — these 2 departments can serve as Train-the-Trainer for the entire site.' },
      risk: { vi: 'Wanek đang mở rộng song song với phát triển nhân tài — thách thức kép. Nếu Coaching Program không được triển khai trong Q3, **Train-the-Trainer sẽ không có người thực hiện** và L&D sẽ phải đào tạo trực tiếp 100% — không thể scale khi nhà máy tiếp tục mở rộng.', en: 'Wanek is expanding simultaneously with talent development — dual challenge. Without Q3 Coaching Program, **Train-the-Trainer will have no one to execute** and L&D must train 100% directly — cannot scale as factory continues expanding.' },
      nextStep: { vi: 'Xác định **10 Trainer nội bộ tiềm năng** từ nhóm Growers (Training dept ưu tiên) → Triển khai Coaching Program pilot Q3 → Trainer nội bộ bắt đầu đào tạo lại nhóm của mình từ Q4.', en: 'Identify **10 potential internal Trainers** from Growers group (Training dept priority) → Launch Coaching Program pilot Q3 → Internal Trainers begin training their own teams from Q4.' }
    },
    'MLN_ALL': {
      insight: { vi: '**Millennium tổng thể:** Site trưởng thành nhất với hệ thống 9-Box đầy đủ nhất. Cơ cấu nhân tài cân bằng hơn WNK và ASH. Điểm cần chú ý: nhóm **Movers cần được theo dõi chặt** — đây là nhóm có nguy cơ nghỉ việc cao nhất và ảnh hưởng trực tiếp đến năng suất vận hành.', en: '**Millennium overall:** Most mature site with most complete 9-Box system. More balanced talent structure than WNK and ASH. Key attention: **Movers group needs close monitoring** — highest attrition risk group, directly impacts operational productivity.' },
      risk: { vi: 'Movers không được can thiệp kịp thời → tự nghỉ việc hoặc phải cho thôi việc → chi phí tuyển dụng + đào tạo người mới tốn **3-6 tháng lương/người**. Với quy mô MLN, mỗi năm mất 5-10 Movers = chi phí nhân sự tăng đáng kể.', en: 'Movers not intervened timely → voluntary resignation or termination → recruitment + training costs **3-6 months salary/person**. At MLN scale, losing 5-10 Movers per year = significant HR cost increase.' },
      nextStep: { vi: 'HOD xác nhận danh sách Movers → Phân loại: ai có thể phát triển (PIP) vs ai cần chuyển vị trí → L&D thiết kế chương trình can thiệp phù hợp cho từng nhóm.', en: 'HODs confirm Movers list → Classify: who can develop (PIP) vs who needs role transition → L&D designs appropriate intervention programs for each group.' }
    },
  },
  'pipeline': {
    'ASH_ALL': {
      insight: { vi: '**Ashton Pipeline tổng thể:** 60 critical roles, **Coverage Rate 30%** (18 Covered / 13 Developing / 26 At Risk / 3 Critical). Thấp nhất trong 3 sites. **Warehouse chiếm 57% tổng roles** (34/60) nhưng Coverage Rate chỉ 9%. FA và HR là 2 bộ phận duy nhất đạt 100% coverage — đây là model tốt để các dept khác học hỏi.', en: '**Ashton Pipeline overall:** 60 critical roles, **30% Coverage Rate** (18 Covered / 13 Developing / 26 At Risk / 3 Critical). Lowest across all 3 sites. **Warehouse accounts for 57% of total roles** (34/60) but only 9% Coverage Rate. FA and HR are the only 2 departments achieving 100% coverage — good model for other departments.' },
      risk: { vi: '3 vị trí **Critical** tại Warehouse (Võ Anh Cảnh/Manager, Francisco Gonzalez/Director, Kim Trần/Manager) — không có Successor, không có Interim. Nếu cả 3 người này nghỉ cùng lúc, **toàn bộ hoạt động Warehouse Ashton sẽ tê liệt**. Đây là rủi ro business continuity cấp độ site.', en: '3 **Critical** positions in Warehouse (Võ Anh Cảnh/Manager, Francisco Gonzalez/Director, Kim Trần/Manager) — no Successor, no Interim. If all 3 leave simultaneously, **all Ashton Warehouse operations will be paralyzed**. This is a site-level business continuity risk.' },
      nextStep: { vi: '**Tuần này:** HRBP Ashton lập danh sách ưu tiên 3 vị trí Critical → Đề xuất Interim candidate tạm thời → Trình HRD phê duyệt kế hoạch khẩn cấp. Không thể chờ đến Q4.', en: '**This week:** Ashton HRBP lists 3 Critical positions → Proposes temporary Interim candidates → Presents emergency plan to HRD for approval. Cannot wait until Q4.' }
    },
    'ASH_WAREHOUSE': {
      insight: { vi: '**Warehouse Pipeline:** 34 roles, Coverage Rate **9%** (3 Covered / 8 Developing / 20 At Risk / 3 Critical). Cấu trúc rủi ro theo tầng: **Tầng 1 (Critical):** Warehouse Director + 2 Managers không có Successor. **Tầng 2 (At Risk):** 3 Loading Supervisors, 3 UPH Team Leaders, 3 Picking Team Leaders — toàn bộ cấp Supervisor/Team Leader đang trống Successor.', en: '**Warehouse Pipeline:** 34 roles, **9% Coverage Rate** (3 Covered / 8 Developing / 20 At Risk / 3 Critical). Layered risk: **Layer 1 (Critical):** Warehouse Director + 2 Managers with no Successor. **Layer 2 (At Risk):** 3 Loading Supervisors, 3 UPH Team Leaders, 3 Picking Team Leaders — all Supervisor/Team Leader levels have no Successors.' },
      risk: { vi: 'Warehouse Ashton đang vận hành với **"single point of failure" ở mọi cấp độ**. Trong ngành Logistics/Warehouse, tỷ lệ turnover trung bình 15-25%/năm — với 34 roles và 0 backup, xác suất gián đoạn vận hành trong 12 tháng tới là rất cao.', en: 'Ashton Warehouse operates with **"single point of failure" at every level**. In Logistics/Warehouse industry, average turnover is 15-25%/year — with 34 roles and 0 backup, probability of operational disruption in next 12 months is very high.' },
      nextStep: { vi: '**Cross-training Matrix khẩn cấp:** Thinh Mai + Ngoc Dinh lập ma trận đào tạo chéo cho Loading và Picking trước. Mỗi Supervisor cần đào tạo ít nhất 1 Team Leader làm backup trong 60 ngày.', en: '**Emergency Cross-training Matrix:** Thinh Mai + Ngoc Dinh create cross-training matrix for Loading and Picking first. Each Supervisor needs to train at least 1 Team Leader as backup within 60 days.' }
    },
    'ASH_LOGISTICS': {
      insight: { vi: '**Logistics Pipeline:** 6 roles, Coverage Rate **50%** (3 Covered / 3 Developing). ALANA, STEPHEN, TANA đã có Successor — nền tảng tốt. **2 vị trí High Risk** (KYLIE - 1-2 Years, ALICE - < 1 Year) đang trong giai đoạn phát triển Successor dài hạn. KYLIE phụ trách FCA Transportation project — dự án chiến lược với kiến thức chuyên biệt cao.', en: '**Logistics Pipeline:** 6 roles, **50% Coverage Rate** (3 Covered / 3 Developing). ALANA, STEPHEN, TANA have Successors — good foundation. **2 High Risk positions** (KYLIE - 1-2 Years, ALICE - < 1 Year) in long-term Successor development. KYLIE manages FCA Transportation project — strategic project with highly specialized knowledge.' },
      risk: { vi: 'KYLIE (FCA Transportation) là vị trí **High Risk với Successor "1-2 Years"** — khoảng cách quá dài. Nếu KYLIE nghỉ trước khi Successor sẵn sàng, **toàn bộ kiến thức FCA Transportation process sẽ bị mất** và dự án chiến lược bị gián đoạn nghiêm trọng.', en: 'KYLIE (FCA Transportation) is **High Risk with "1-2 Years" Successor** — too long a gap. If KYLIE leaves before Successor is ready, **all FCA Transportation process knowledge will be lost** and the strategic project severely disrupted.' },
      nextStep: { vi: 'Rút ngắn readiness của KYLIE\'s Successor (Alice Le): Giao thêm trách nhiệm FCA Transportation độc lập trong Q3 → Mục tiêu chuyển từ "1-2 Years" xuống "< 1 Year" trước Q1/2027. KYLIE document FCA SOP trong tháng 7.', en: 'Shorten KYLIE\'s Successor (Alice Le) readiness: Assign independent FCA Transportation in Q3 → Target: move from "1-2 Years" to "< 1 Year" before Q1/2027. KYLIE documents FCA SOP in July.' }
    },
    'ASH_INFORMATION SYSTEM': {
      insight: { vi: '**IT Pipeline:** 4 roles, Coverage Rate **25%** (1 Covered / 3 At Risk). Chỉ River Le có Successor (Jindo Nguyen). Denis Vy và Ryder Nguyen ở trạng thái **"Interim Only"** — có người tạm quyền nhưng không có Successor thực sự. **Harry Hoang (IT Software Developer) hoàn toàn không có backup** — rủi ro kỹ thuật cao nhất.', en: '**IT Pipeline:** 4 roles, **25% Coverage Rate** (1 Covered / 3 At Risk). Only River Le has Successor (Jindo Nguyen). Denis Vy and Ryder Nguyen in **"Interim Only"** status — temporary coverage but no real Successor. **Harry Hoang (IT Software Developer) has absolutely no backup** — highest technical risk.' },
      risk: { vi: 'Harry Hoang là người duy nhất có kỹ năng **Software Development và System Integration** tại Ashton. Nếu Harry nghỉ việc, **toàn bộ hệ thống phần mềm nội bộ sẽ không có người maintain** — bao gồm BI reports, database management, và API integrations.', en: 'Harry Hoang is the only person with **Software Development and System Integration** skills at Ashton. If Harry leaves, **all internal software systems will have no one to maintain** — including BI reports, database management, and API integrations.' },
      nextStep: { vi: '**Ưu tiên Harry Hoang:** Lập kế hoạch Knowledge Transfer — Harry document toàn bộ hệ thống và đào tạo River Le về Software basics trong Q3. Đây là biện pháp giảm thiểu rủi ro tối thiểu cần làm ngay.', en: '**Prioritize Harry Hoang:** Create Knowledge Transfer plan — Harry documents all systems and trains River Le on Software basics in Q3. This is the minimum risk mitigation measure needed immediately.' }
    },
    'ASH_FINANCE & ACCOUNTING': {
      insight: { vi: '**FA Pipeline:** 5 roles, Coverage Rate **100%** — bộ phận duy nhất đạt coverage hoàn hảo. Cấu trúc kế thừa rõ ràng: Windy Sy → Ha Nguyen → Maya Nguyen. Tuy nhiên, đây là **chuỗi kế thừa tuyến tính** — nếu 1 người trong chuỗi rời đi, toàn bộ chuỗi bị ảnh hưởng.', en: '**FA Pipeline:** 5 roles, **100% Coverage Rate** — only department achieving perfect coverage. Clear succession: Windy Sy → Ha Nguyen → Maya Nguyen. However, this is a **linear succession chain** — if 1 person leaves, the entire chain is affected.' },
      risk: { vi: 'Nếu **Ha Nguyen** (mắt xích giữa) rời đi, Windy Sy mất Successor trực tiếp và Maya Nguyen chưa đủ sẵn sàng để nhảy 2 cấp — đây là "succession chain break" thường bị bỏ qua khi coverage rate đã 100%.', en: 'If **Ha Nguyen** (middle link) leaves, Windy Sy loses direct Successor and Maya Nguyen is not ready to jump 2 levels — this "succession chain break" is often overlooked when coverage rate is already 100%.' },
      nextStep: { vi: 'Xây dựng **lateral backup:** Cheryl Nguyen và Helen Ngo cần được đào tạo thêm để có thể backup Ha Nguyen trong trường hợp khẩn cấp. Nâng cấp từ "100% covered" lên "100% resilient".', en: 'Build **lateral backup:** Cheryl Nguyen and Helen Ngo need additional training to backup Ha Nguyen in emergencies. Upgrade from "100% covered" to "100% resilient".' }
    },
    'ASH_CUSTOMER SERVICE': {
      insight: { vi: '**CS Pipeline:** 5 roles, Coverage Rate **20%** (1 Covered / 2 Developing / 2 At Risk). Helen Nguyen (Team Leader) và Kelly Phan không có Successor. Mi Nguyen và Chloe Truong đang trong giai đoạn phát triển Successor (< 1 Year) — tiến độ tốt.', en: '**CS Pipeline:** 5 roles, **20% Coverage Rate** (1 Covered / 2 Developing / 2 At Risk). Helen Nguyen (Team Leader) and Kelly Phan have no Successor. Mi Nguyen and Chloe Truong in Successor development phase (< 1 Year) — good progress.' },
      risk: { vi: 'Helen Nguyen (CS Team Leader) không có Successor — nếu Helen nghỉ, **không ai có thể quản lý toàn bộ CS team ngay lập tức**. CS là bộ phận tiếp xúc khách hàng trực tiếp — gián đoạn quản lý ảnh hưởng ngay đến chất lượng dịch vụ và SLA.', en: 'Helen Nguyen (CS Team Leader) has no Successor — if Helen leaves, **no one can immediately manage the entire CS team**. CS is direct customer-facing — management disruption immediately impacts service quality and SLA.' },
      nextStep: { vi: 'Assign **Mi Nguyen làm Acting Deputy** cho Helen Nguyen — tham gia tất cả cuộc họp quản lý, học cách ra quyết định và xử lý escalation. Mục tiêu: Mi Nguyen đạt "Ready Now" trong 6 tháng.', en: 'Assign **Mi Nguyen as Acting Deputy** for Helen Nguyen — attend all management meetings, learn decision-making and escalation handling. Target: Mi Nguyen achieves "Ready Now" within 6 months.' }
    },
    'ASH_CUSTOMS': {
      insight: { vi: '**Customs Pipeline:** 4 roles, Coverage Rate **75%** (3 Covered / 1 At Risk). Tốt nhất trong nhóm operational departments. Tiny, Lona, Harry đã có Successor rõ ràng. **Julie Phung (Team Leader) là điểm yếu duy nhất** — không có Successor cho vị trí quan trọng nhất bộ phận.', en: '**Customs Pipeline:** 4 roles, **75% Coverage Rate** (3 Covered / 1 At Risk). Best among operational departments. Tiny, Lona, Harry have clear Successors. **Julie Phung (Team Leader) is the sole weakness** — no Successor for the most critical position.' },
      risk: { vi: 'Julie Phung nắm giữ **toàn bộ kiến thức Customs clearance phức tạp** (inbound/outbound international, payment process, problem-solving với customs officers). Nếu Julie nghỉ đột xuất, **thời gian để người mới đạt năng lực tương đương có thể lên đến 12-18 tháng**.', en: 'Julie Phung holds **all complex Customs clearance expertise** (inbound/outbound international, payment process, problem-solving with customs officers). If Julie leaves suddenly, **time for a new person to reach equivalent capability could be 12-18 months**.' },
      nextStep: { vi: '**Knowledge Transfer ngay:** Julie Phung lập **Customs SOP Manual** chi tiết trong Q3. Đồng thời assign Tiny Nguyen làm Successor candidate và bắt đầu Shadowing cho các case phức tạp.', en: '**Immediate Knowledge Transfer:** Julie Phung creates detailed **Customs SOP Manual** in Q3. Simultaneously assign Tiny Nguyen as Successor candidate and begin Shadowing for complex cases.' }
    },
    'ASH_HUMAN RESOURCES': {
      insight: { vi: '**HR Pipeline:** 2 roles, Coverage Rate **100%** (Lisa Nguyen ↔ Ellie Tran backup lẫn nhau). Cấu trúc kế thừa lý tưởng. Tuy nhiên, với chỉ 2 người, **nếu cả 2 đều nghỉ hoặc bệnh cùng lúc**, HR sẽ không có ai vận hành.', en: '**HR Pipeline:** 2 roles, **100% Coverage Rate** (Lisa Nguyen ↔ Ellie Tran mutual backup). Ideal succession structure. However, with only 2 people, **if both are absent simultaneously**, HR will have no one to operate.' },
      risk: { vi: 'HR Ashton chỉ có 2 người cho toàn site — **minimum viable team** không có buffer. Khi Ashton mở rộng, workload HR sẽ tăng nhưng headcount không tăng kịp — dẫn đến burnout và tăng nguy cơ nghỉ việc của cả 2.', en: 'Ashton HR has only 2 people for entire site — **minimum viable team** with no buffer. As Ashton expands, HR workload will increase but headcount won\'t keep pace — leading to burnout and increased attrition risk for both.' },
      nextStep: { vi: 'Đề xuất với HRD: **Lập kế hoạch tuyển thêm 1 HR Specialist** khi Ashton đạt 200+ nhân sự. Trong thời gian chờ, trang bị thêm công cụ tự động hóa HR (Power Automate, AI tools) để tăng năng suất.', en: 'Propose to HRD: **Plan to hire 1 additional HR Specialist** when Ashton reaches 200+ employees. Meanwhile, equip with additional HR automation tools (Power Automate, AI tools) to increase productivity.' }
    },
    'WNK_ALL': {
      insight: { vi: '**Wanek Pipeline:** Đang xây dựng song song với mở rộng nhà máy. Ưu tiên cao nhất: các vị trí Supervisor tại UPH và Cut&Sew WNK3 cần có Successor "Ready Now" trước Q4/2026 ramp-up.', en: '**Wanek Pipeline:** Being built in parallel with factory expansion. Highest priority: Supervisor positions in UPH and Cut&Sew WNK3 need "Ready Now" Successors before Q4/2026 ramp-up.' },
      risk: { vi: 'Mỗi lần Supervisor vắng mặt mà không có backup → dây chuyền sản xuất dừng hoặc chạy dưới công suất → ảnh hưởng trực tiếp đến KPI sản xuất và kế hoạch giao hàng.', en: 'Every Supervisor absence without backup → production line stops or runs below capacity → directly impacts production KPIs and delivery schedules.' },
      nextStep: { vi: 'HRBP WNK xác định Successor candidate cho tất cả vị trí Supervisor UPH và Cut&Sew WNK3 → Bắt đầu Shadowing program trong Q3.', en: 'WNK HRBP identifies Successor candidates for all UPH and Cut&Sew WNK3 Supervisor positions → Start Shadowing program in Q3.' }
    },
    'MLN_ALL': {
      insight: { vi: '**Millennium Pipeline:** Site có hệ thống kế thừa trưởng thành nhất. Tập trung vào việc nâng cấp các vị trí "Interim Only" và đảm bảo Successor candidates đang được phát triển đúng tiến độ.', en: '**Millennium Pipeline:** Site with most mature succession system. Focus on upgrading "Interim Only" positions and ensuring Successor candidates are developing on schedule.' },
      risk: { vi: 'Các vị trí "Interim Only" kéo dài → người tạm quyền kiệt sức → chất lượng quyết định suy giảm và nguy cơ mất cả người tạm quyền.', en: '"Interim Only" positions prolonged → temporary coverage burnout → decision quality degradation and risk of losing interim person too.' },
      nextStep: { vi: 'HRBP MLN review tất cả vị trí "Interim Only" → Đề xuất Successor candidate cụ thể → Lập kế hoạch phát triển 6 tháng.', en: 'MLN HRBP reviews all "Interim Only" positions → Proposes specific Successor candidates → Creates 6-month development plan.' }
    },
  },
  'devplan': {
    'ASH_ALL': {
      insight: { vi: '**Ashton Training Plan (9 chương trình):** **Coaching Skills (57 needs, 81.8% low readiness)** là khoảng cách lớn nhất — HOD Ashton chưa được trang bị kỹ năng phát triển cấp dưới. **Communication (12 needs, 100% dept coverage)** — toàn bộ 7 departments đều có nhu cầu, đây là năng lực nền tảng cần triển khai trước. Business Acumen (Need Validation) cần được xác nhận thêm trước khi đưa vào kế hoạch chính thức.', en: '**Ashton Training Plan (9 programs):** **Coaching Skills (57 needs, 81.8% low readiness)** is the largest gap — Ashton HODs not equipped with subordinate development skills. **Communication (12 needs, 100% dept coverage)** — all 7 departments have needs, foundational competency to deploy first. Business Acumen (Need Validation) needs further confirmation before official planning.' },
      risk: { vi: 'Coaching Skills 81.8% low readiness + HOD không biết cách phát triển cấp dưới = **vòng lặp thiếu hụt năng lực tự duy trì**. Nếu không phá vỡ vòng lặp này trong 2026, Ashton sẽ tiếp tục phụ thuộc vào L&D để đào tạo mọi thứ — không thể scale.', en: 'Coaching Skills 81.8% low readiness + HODs unable to develop subordinates = **self-sustaining competency gap cycle**. Without breaking this cycle in 2026, Ashton will continue depending on L&D for all training — cannot scale.' },
      nextStep: { vi: '**Phá vỡ vòng lặp:** Triển khai Communication Workshop trước (Q3, dễ nhất, 100% coverage) → Sau đó Coaching Program cho HOD (Q3-Q4) → HOD tự đào tạo team của mình từ Q1/2027.', en: '**Break the cycle:** Deploy Communication Workshop first (Q3, easiest, 100% coverage) → Then Coaching Program for HODs (Q3-Q4) → HODs train their own teams from Q1/2027.' }
    },
    'ASH_INFORMATION SYSTEM': {
      insight: { vi: '**IT Training (40 duties):** 75% N/A rating, 12 Add to Training Plan actions. Nhu cầu tập trung vào **Digital (AI & Automation)** và **People Development (Coaching)**. Harry Hoang (R3-R4 đầy đủ) là benchmark năng lực IT của Ashton — có thể làm IT Champion cho chương trình Digital.', en: '**IT Training (40 duties):** 75% N/A rating, 12 Add to Training Plan actions. Needs focused on **Digital (AI & Automation)** and **People Development (Coaching)**. Harry Hoang (complete R3-R4) is Ashton\'s IT competency benchmark — can serve as IT Champion for Digital program.' },
      risk: { vi: 'Nếu IT team không được đào tạo AI & Automation tools, họ sẽ không thể hỗ trợ các bộ phận khác triển khai Power Automate và BI reports — **làm chậm toàn bộ chương trình Digital transformation của Ashton**.', en: 'If IT team is not trained in AI & Automation tools, they cannot support other departments in deploying Power Automate and BI reports — **slowing down Ashton\'s entire Digital transformation program**.' },
      nextStep: { vi: 'Harry Hoang làm **IT Champion** cho AI & Automation — đào tạo lại cho Denis Vy, River Le, Ryder Nguyen. Đây là cách hiệu quả nhất với nguồn lực L&D hạn chế.', en: 'Harry Hoang acts as **IT Champion** for AI & Automation — trains Denis Vy, River Le, Ryder Nguyen. Most efficient approach with limited L&D resources.' }
    },
    'ASH_FINANCE & ACCOUNTING': {
      insight: { vi: '**FA Training (43 duties):** 21% low readiness (9 duties R2), 23 Top Opportunities — cao nhất toàn site (53%). 9 duties R2 tập trung ở Cheryl Nguyen (Financial Modeling, Business Performance Analysis) và Maya Nguyen (Leadership Mindset) — đây là 3 kỹ năng cần thiết để succession chain FA hoạt động trơn tru.', en: '**FA Training (43 duties):** 21% low readiness (9 R2 duties), 23 Top Opportunities — highest site-wide (53%). 9 R2 duties concentrated in Cheryl Nguyen (Financial Modeling, Business Performance Analysis) and Maya Nguyen (Leadership Mindset) — these 3 skills are needed for FA succession chain to work smoothly.' },
      risk: { vi: 'Cheryl Nguyen có R2 trong Financial Modeling và Business Performance Analysis — 2 kỹ năng cốt lõi của GL Accountant. Nếu không được đào tạo trong Q3, Cheryl sẽ tiếp tục phụ thuộc vào Ha Nguyen và Windy Sy cho các task phức tạp — **tạo bottleneck trong FA team**.', en: 'Cheryl Nguyen has R2 in Financial Modeling and Business Performance Analysis — 2 core GL Accountant skills. Without Q3 training, Cheryl will continue depending on Ha Nguyen and Windy Sy for complex tasks — **creating a bottleneck in the FA team**.' },
      nextStep: { vi: 'Maya Nguyen shadow Ha Nguyen trong **Financial Modeling và Tax Declaration** (Top Opportunities). Cheryl Nguyen tham gia **Finance / Cost Management Follow-up** program. Cả 2 trong Q3/2026.', en: 'Maya Nguyen shadows Ha Nguyen in **Financial Modeling and Tax Declaration** (Top Opportunities). Cheryl Nguyen joins **Finance / Cost Management Follow-up** program. Both in Q3/2026.' }
    },
    'ASH_HUMAN RESOURCES': {
      insight: { vi: '**HR Training (31 duties):** 6% low readiness, 10 Top Opportunities. Nhu cầu tập trung vào **People Development (Coaching)** và **Business Acumen** — phù hợp với định hướng phát triển HR Business Partner. Lisa và Ellie đều cần Coaching Skills để hỗ trợ HOD các bộ phận tốt hơn.', en: '**HR Training (31 duties):** 6% low readiness, 10 Top Opportunities. Needs focused on **People Development (Coaching)** and **Business Acumen** — aligned with HR Business Partner development. Lisa and Ellie both need Coaching Skills to better support department HODs.' },
      risk: { vi: 'HR không có Coaching Skills → không thể hỗ trợ HOD xây dựng IDP và phát triển nhân viên → **L&D phải làm thay toàn bộ** → quá tải cho 1 L&D person.', en: 'HR without Coaching Skills → cannot support HODs in building IDPs and developing employees → **L&D must do everything** → overload for 1 L&D person.' },
      nextStep: { vi: 'Lisa và Ellie tham gia **Coaching Program** cùng với HOD (Q3) → Sau đó HR có thể hỗ trợ HOD trong IDP review và talent development — giảm tải cho L&D.', en: 'Lisa and Ellie join **Coaching Program** together with HODs (Q3) → HR can then support HODs in IDP review and talent development — reducing L&D workload.' }
    },
    'WNK_ALL': {
      insight: { vi: '**Wanek Training Plan (10 chương trình, 803 records):** **Coaching Skills (122 needs)** là nhu cầu lớn nhất — gấp đôi Leadership (47 needs). Điều này phản ánh Wanek đang trong giai đoạn xây dựng năng lực đào tạo nội bộ để scale. **Digital (34 needs)** tập trung ở 5 departments — IT, Training, HR, Planning, TAT Quality.', en: '**Wanek Training Plan (10 programs, 803 records):** **Coaching Skills (122 needs)** is the largest need — double Leadership (47 needs). This reflects Wanek building internal training capability to scale. **Digital (34 needs)** concentrated in 5 departments — IT, Training, HR, Planning, TAT Quality.' },
      risk: { vi: 'Coaching Skills là nền tảng để Train-the-Trainer hoạt động. Nếu không triển khai trong Q3, **toàn bộ kế hoạch đào tạo nội bộ của Wanek sẽ bị trì hoãn** — L&D không thể đào tạo trực tiếp 55 người với 803 duties.', en: 'Coaching Skills is the foundation for Train-the-Trainer to work. Without Q3 deployment, **Wanek\'s entire internal training plan will be delayed** — L&D cannot directly train 55 people with 803 duties.' },
      nextStep: { vi: 'Xác định **10 Trainer nội bộ** từ Training dept (Ashton Vo, Quach Le Du, Phan Thi Ha) → Coaching Program pilot 4 tuần → Trainer bắt đầu đào tạo lại nhóm của mình.', en: 'Identify **10 internal Trainers** from Training dept (Ashton Vo, Quach Le Du, Phan Thi Ha) → 4-week Coaching Program pilot → Trainers begin training their own teams.' }
    },
    'MLN_ALL': {
      insight: { vi: '**Millennium Training Plan (14 chương trình):** AI & Automation (H.1) và Leadership (H.2) là 2 ưu tiên hàng đầu — đây là 2 năng lực quyết định năng suất dài hạn của MLN trong bối cảnh Industry 4.0.', en: '**Millennium Training Plan (14 programs):** AI & Automation (P.1) and Leadership (P.2) are top 2 priorities — these 2 competencies determine MLN\'s long-term productivity in Industry 4.0 context.' },
      risk: { vi: 'Không triển khai AI & Automation → nhân sự tiếp tục làm báo cáo thủ công → lãng phí 2-4 giờ/người/tuần = hàng trăm giờ/năm toàn site.', en: 'No AI & Automation deployment → staff continue manual reporting → 2-4 hours/person/week wasted = hundreds of hours/year site-wide.' },
      nextStep: { vi: 'HOD xác nhận danh sách tham gia → Cam kết 80% participation rate → Triển khai AI & Automation và Leadership trong Q3.', en: 'HODs confirm participant lists → Commit to 80% participation rate → Deploy AI & Automation and Leadership in Q3.' }
    },
  },
  'idp': {
    'ASH_ALL': {
      insight: { vi: '**Ashton IDP tổng thể (199 records, 16 nhân sự):** **FA có tỷ lệ Low Readiness cao nhất (21%)** với 9 duties R2 — tập trung ở Cheryl và Maya. **IT có 75% N/A rating** — chưa hoàn thiện đánh giá. **HR và Logistics có Low Readiness thấp nhất (6%)** — đội ngũ vận hành ổn định. Tổng cộng **64 Top Opportunities** được đánh dấu — đây là 64 điểm can thiệp ưu tiên cao nhất.', en: '**Ashton IDP overall (199 records, 16 employees):** **FA has highest Low Readiness (21%)** with 9 R2 duties — concentrated in Cheryl and Maya. **IT has 75% N/A rating** — assessment not yet complete. **HR and Logistics have lowest Low Readiness (6%)** — stable operational teams. Total **64 Top Opportunities** marked — these are the 64 highest priority intervention points.' },
      risk: { vi: '64 Top Opportunities không được follow-up → khoảng cách năng lực tích lũy → HOD tiếp tục phải làm thay nhân viên trong các task phức tạp → **burnout quản lý và giảm năng suất toàn bộ phận**.', en: '64 Top Opportunities not followed up → competency gaps accumulate → HODs continue doing complex tasks for employees → **management burnout and reduced department productivity**.' },
      nextStep: { vi: 'Mỗi HOD chọn **Top 3 Opportunities** quan trọng nhất của từng nhân viên → Assign action owner và timeline cụ thể → Review trong 1-1 hàng tuần. Không cần làm tất cả 64 cùng lúc.', en: 'Each HOD selects **Top 3 most important Opportunities** per employee → Assigns action owner and specific timeline → Reviews in weekly 1-1. No need to address all 64 simultaneously.' }
    },
    'ASH_FINANCE & ACCOUNTING': {
      insight: { vi: '**FA IDP (43 duties):** 21% low readiness, 23 Top Opportunities. Cheryl Nguyen có R2 trong Financial Modeling và Business Performance Analysis. Maya Nguyen có R2 trong Leadership Mindset — kỹ năng cần thiết để tiến lên High Professional. Windy Sy và Ha Nguyen đều R3-R4 — đội ngũ senior ổn định.', en: '**FA IDP (43 duties):** 21% low readiness, 23 Top Opportunities. Cheryl Nguyen has R2 in Financial Modeling and Business Performance Analysis. Maya Nguyen has R2 in Leadership Mindset — skill needed to advance to High Professional. Windy Sy and Ha Nguyen are R3-R4 — stable senior team.' },
      risk: { vi: 'Maya Nguyen là Rising Star với tiềm năng cao nhất FA — nếu R2 gaps không được giải quyết trong 6 tháng, Maya có thể cảm thấy thiếu lộ trình phát triển rõ ràng và **tăng nguy cơ nghỉ việc** (Rising Stars thường nghỉ khi không thấy cơ hội phát triển).', en: 'Maya Nguyen is the Rising Star with highest FA potential — if R2 gaps not addressed within 6 months, Maya may feel lack of clear development path and **increased attrition risk** (Rising Stars often leave when they don\'t see growth opportunities).' },
      nextStep: { vi: 'Ha Nguyen assign Maya **2 stretch projects cụ thể trong Q3:** (1) Tự lập Financial Model cho 1 dự án mới, (2) Tham gia Tax Declaration process với Ha Nguyen. OJT trực tiếp — hiệu quả hơn đào tạo lý thuyết.', en: 'Ha Nguyen assigns Maya **2 specific stretch projects in Q3:** (1) Independently build Financial Model for 1 new project, (2) Participate in Tax Declaration process with Ha Nguyen. Direct OJT — more effective than theoretical training.' }
    },
    'ASH_INFORMATION SYSTEM': {
      insight: { vi: '**IT IDP (40 duties):** 75% N/A, 23 Top Opportunities. Harry Hoang là người duy nhất có R3-R4 đầy đủ — benchmark năng lực IT của Ashton. Denis Vy, River Le, Ryder Nguyen đều N/A — cần hoàn thiện đánh giá để biết chính xác khoảng cách năng lực và thiết kế IDP phù hợp.', en: '**IT IDP (40 duties):** 75% N/A, 23 Top Opportunities. Harry Hoang is the only one with complete R3-R4 — Ashton\'s IT competency benchmark. Denis Vy, River Le, Ryder Nguyen all N/A — need to complete assessment to accurately identify competency gaps and design appropriate IDPs.' },
      risk: { vi: 'Không có R-Rating → không có IDP cụ thể → không có kế hoạch phát triển → **IT team không thấy lộ trình thăng tiến** → tăng nguy cơ nghỉ việc. IT professionals thường nghỉ khi không có cơ hội học hỏi và phát triển kỹ thuật.', en: 'No R-Rating → no specific IDP → no development plan → **IT team sees no career path** → increased attrition risk. IT professionals often leave when there are no technical learning and development opportunities.' },
      nextStep: { vi: 'HOD IT (Jindo Nguyen) thực hiện **R-Rating assessment** cho Denis Vy, River Le, Ryder Nguyen trong tháng 7/2026 — sử dụng Harry Hoang làm benchmark. Sau đó L&D thiết kế IDP cụ thể dựa trên kết quả.', en: 'IT HOD (Jindo Nguyen) conducts **R-Rating assessment** for Denis Vy, River Le, Ryder Nguyen in July 2026 — using Harry Hoang as benchmark. Then L&D designs specific IDPs based on results.' }
    },
    'ASH_HUMAN RESOURCES': {
      insight: { vi: '**HR IDP (31 duties):** 6% low readiness, 10 Top Opportunities. Lisa và Ellie đều có profile tốt — R3-R4 trong hầu hết duties. Top Opportunities tập trung vào **People Development và Business Acumen** — phù hợp với định hướng phát triển HR Business Partner. Đây là 2 nhân sự có IDP chất lượng cao nhất Ashton.', en: '**HR IDP (31 duties):** 6% low readiness, 10 Top Opportunities. Lisa and Ellie both have good profiles — R3-R4 in most duties. Top Opportunities focused on **People Development and Business Acumen** — aligned with HR Business Partner development. These are the 2 employees with highest quality IDPs in Ashton.' },
      risk: { vi: 'Lisa và Ellie đang ở mức R3-R4 trong hầu hết duties — nếu không có thách thức mới, họ có nguy cơ "bình nguyên hóa" và mất động lực. HR professionals thường tìm kiếm cơ hội phát triển chiến lược — nếu Ashton không cung cấp, họ sẽ tìm ở nơi khác.', en: 'Lisa and Ellie are at R3-R4 in most duties — without new challenges, they risk "plateauing" and losing motivation. HR professionals often seek strategic development opportunities — if Ashton doesn\'t provide them, they will look elsewhere.' },
      nextStep: { vi: 'Assign Lisa hoặc Ellie dẫn dắt **1 dự án HR chiến lược** trong Q3 (ví dụ: xây dựng Onboarding Program mới, hoặc thiết kế Competency Framework cho Ashton). Stretch assignment phù hợp với level của họ.', en: 'Assign Lisa or Ellie to lead **1 strategic HR project** in Q3 (e.g., building new Onboarding Program, or designing Competency Framework for Ashton). Appropriate stretch assignment for their level.' }
    },
    'ASH_LOGISTICS': {
      insight: { vi: '**Logistics IDP (17 duties, Henry Le):** 6% low readiness, 4 Top Opportunities. Nhu cầu tập trung vào **People Development và Business Acumen** — phản ánh Henry Le đang phát triển từ Specialist sang Manager mindset. Đây là dấu hiệu tốt cho succession planning của Logistics.', en: '**Logistics IDP (17 duties, Henry Le):** 6% low readiness, 4 Top Opportunities. Needs focused on **People Development and Business Acumen** — reflecting Henry Le developing from Specialist to Manager mindset. Good sign for Logistics succession planning.' },
      risk: { vi: 'Henry Le là người duy nhất đại diện cho toàn bộ Logistics team trong IDP — 6 nhân sự Logistics nhưng chỉ có 1 IDP. Điều này cho thấy **5 nhân sự còn lại (ALANA, ALICE, STEPHEN, TANA, CRYSTAL) chưa có IDP cá nhân** — khoảng trống phát triển lớn.', en: 'Henry Le is the only person representing the entire Logistics team in IDP — 6 Logistics employees but only 1 IDP. This shows **5 remaining employees (ALANA, ALICE, STEPHEN, TANA, CRYSTAL) have no individual IDPs** — large development gap.' },
      nextStep: { vi: 'Henry Le phối hợp với HRBP để **xây dựng IDP cá nhân cho 5 nhân sự Logistics còn lại** trong Q3 — ưu tiên KYLIE và ALICE trước vì đây là 2 High Risk positions trong Pipeline.', en: 'Henry Le coordinates with HRBP to **build individual IDPs for 5 remaining Logistics employees** in Q3 — prioritize KYLIE and ALICE first as these are 2 High Risk positions in Pipeline.' }
    },
    'ASH_WAREHOUSE': {
      insight: { vi: '**Warehouse IDP (34 duties, Shen Jim + Kim Tran):** 6% low readiness, 8 Top Opportunities. Nhu cầu tập trung vào **People Development và Business Acumen** — phản ánh Warehouse managers đang phát triển năng lực lãnh đạo. Tuy nhiên, tương tự Logistics, **chỉ có 2 IDP cho 5 nhân sự Warehouse trong 9-Box** — 3 người còn lại chưa có IDP.', en: '**Warehouse IDP (34 duties, Shen Jim + Kim Tran):** 6% low readiness, 8 Top Opportunities. Needs focused on **People Development and Business Acumen** — reflecting Warehouse managers developing leadership capability. However, similar to Logistics, **only 2 IDPs for 5 Warehouse employees in 9-Box** — 3 remaining have no IDPs.' },
      risk: { vi: 'Thinh Mai, Violet Nguyen, Clara Chau (3 Growers trong Warehouse) chưa có IDP cá nhân — đây là 3 nhân tài quan trọng nhất cần được đầu tư phát triển để giải quyết Pipeline crisis của Warehouse.', en: 'Thinh Mai, Violet Nguyen, Clara Chau (3 Growers in Warehouse) have no individual IDPs — these are the 3 most critical talents needed for development to address Warehouse Pipeline crisis.' },
      nextStep: { vi: 'Shen Jim phối hợp với HRBP để **xây dựng IDP cho Thinh Mai, Violet Nguyen, Clara Chau** trong Q3 — tập trung vào Leadership và Operations Management để chuẩn bị họ làm Successor cho các vị trí Supervisor.', en: 'Shen Jim coordinates with HRBP to **build IDPs for Thinh Mai, Violet Nguyen, Clara Chau** in Q3 — focus on Leadership and Operations Management to prepare them as Successors for Supervisor positions.' }
    },
    'ASH_CUSTOMER SERVICE': {
      insight: { vi: '**CS IDP (17 duties, Trudy Dinh):** 6% low readiness, 4 Top Opportunities. Nhu cầu tập trung vào **People Development và Business Acumen** — phản ánh Trudy Dinh đang phát triển năng lực quản lý team CS. Tương tự Logistics và Warehouse, **8 nhân sự CS còn lại chưa có IDP cá nhân**.', en: '**CS IDP (17 duties, Trudy Dinh):** 6% low readiness, 4 Top Opportunities. Needs focused on **People Development and Business Acumen** — reflecting Trudy Dinh developing CS team management capability. Similar to Logistics and Warehouse, **8 remaining CS employees have no individual IDPs**.' },
      risk: { vi: 'Amy Nguyen (Diamond in the Rough) và Mi Nguyen (Rising Star) — 2 nhân sự cần được đầu tư nhất trong CS — đều chưa có IDP cá nhân. Không có IDP → không có kế hoạch phát triển rõ ràng → Amy có thể tiếp tục underperform và Mi có thể không được accelerate đúng mức.', en: 'Amy Nguyen (Diamond in the Rough) and Mi Nguyen (Rising Star) — the 2 employees most needing investment in CS — both have no individual IDPs. No IDP → no clear development plan → Amy may continue underperforming and Mi may not be properly accelerated.' },
      nextStep: { vi: 'Trudy Dinh phối hợp với HRBP để **xây dựng IDP cho Amy Nguyen và Mi Nguyen trước** trong Q3 — Amy cần PIP-style IDP với KPI cụ thể, Mi cần stretch assignment IDP với leadership focus.', en: 'Trudy Dinh coordinates with HRBP to **build IDPs for Amy Nguyen and Mi Nguyen first** in Q3 — Amy needs PIP-style IDP with specific KPIs, Mi needs stretch assignment IDP with leadership focus.' }
    },
    'ASH_CUSTOMS': {
      insight: { vi: '**Customs IDP (17 duties, Rita Hoang):** 6% low readiness, 4 Top Opportunities. Nhu cầu tập trung vào **People Development và Business Acumen** — phản ánh Rita Hoang đang phát triển năng lực quản lý Customs team. **7 nhân sự Customs còn lại chưa có IDP cá nhân** — đặc biệt Julie Phung (Team Leader) cần IDP để chuẩn bị Successor.', en: '**Customs IDP (17 duties, Rita Hoang):** 6% low readiness, 4 Top Opportunities. Needs focused on **People Development and Business Acumen** — reflecting Rita Hoang developing Customs team management capability. **7 remaining Customs employees have no individual IDPs** — especially Julie Phung (Team Leader) needs IDP to prepare Successor.' },
      risk: { vi: 'Julie Phung (Customs Team Leader, No Successor) chưa có IDP cá nhân — không có kế hoạch Knowledge Transfer chính thức. Nếu Julie nghỉ mà không có SOP và IDP cho Successor, **toàn bộ kiến thức Customs clearance phức tạp sẽ bị mất**.', en: 'Julie Phung (Customs Team Leader, No Successor) has no individual IDP — no formal Knowledge Transfer plan. If Julie leaves without SOP and Successor IDP, **all complex Customs clearance knowledge will be lost**.' },
      nextStep: { vi: 'Rita Hoang phối hợp với HRBP để **xây dựng IDP cho Julie Phung** trong Q3 — tập trung vào Knowledge Transfer và Mentoring skills để Julie có thể đào tạo Successor (Tiny Nguyen) hiệu quả.', en: 'Rita Hoang coordinates with HRBP to **build IDP for Julie Phung** in Q3 — focus on Knowledge Transfer and Mentoring skills so Julie can effectively train Successor (Tiny Nguyen).' }
    },
    'WNK_ALL': {
      insight: { vi: '**Wanek IDP (803 records, 55 nhân sự):** Trung bình 14.6 duties/người, cao hơn chuẩn. Top Opportunities tập trung vào Digital và Coaching — phản ánh nhu cầu tự động hóa và phát triển năng lực đào tạo nội bộ. UPH Support WNK3 có Low Readiness cao nhất — cần ưu tiên can thiệp.', en: '**Wanek IDP (803 records, 55 employees):** Average 14.6 duties/person, above standard. Top Opportunities focused on Digital and Coaching — reflecting automation needs and internal training capability development. UPH Support WNK3 has highest Low Readiness — needs priority intervention.' },
      risk: { vi: 'Top Opportunities không được ưu tiên → khoảng cách năng lực tích lũy → KPI bộ phận không đạt trong 2 quý liên tiếp.', en: 'Top Opportunities not prioritized → competency gaps accumulate → department KPIs missed for 2 consecutive quarters.' },
      nextStep: { vi: 'HOD xác định Top 3 Opportunities (đánh dấu X) cho từng nhân sự → Assign action owner → Review trong 1-1 hàng tuần.', en: 'HODs identify Top 3 Opportunities (marked X) per employee → Assign action owner → Review in weekly 1-1.' }
    },
    'MLN_ALL': {
      insight: { vi: '**Millennium IDP:** Hệ thống IDP đầy đủ nhất trong 3 sites. Các IDP có R1/R2 cần được HOD review và xác nhận kế hoạch can thiệp trong 30 ngày.', en: '**Millennium IDP:** Most complete IDP system across 3 sites. IDPs with R1/R2 need HOD review and intervention plan confirmation within 30 days.' },
      risk: { vi: 'IDP R1/R2 không được follow-up → nhân viên cảm thấy bị bỏ rơi → tăng nguy cơ nghỉ việc của nhóm có tiềm năng cao.', en: 'R1/R2 IDPs not followed up → employees feel abandoned → increased attrition risk for high-potential group.' },
      nextStep: { vi: 'HOD review tất cả IDP có R1/R2 → Xác nhận kế hoạch can thiệp trong 30 ngày → Tích hợp vào 1-1 hàng tuần.', en: 'HODs review all R1/R2 IDPs → Confirm intervention plans within 30 days → Integrate into weekly 1-1s.' }
    },
  }
};

export default function InsightPanel({ featureKey, lang, selectedSite, selectedDept }: InsightPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const siteKey = selectedSite || 'MLN';
  const deptKey = selectedDept && selectedDept !== 'ALL' ? selectedDept : 'ALL';
  const lookupKey = `${siteKey}_${deptKey}`;
  const fallbackKey = `${siteKey}_ALL`;

  const featureData = DATA[featureKey];
  if (!featureData) return null;

  const entry: InsightRecord | undefined = featureData[lookupKey] || featureData[fallbackKey];
  if (!entry) return null;

  const isVi = lang === 'VI';
  const insight = isVi ? entry.insight.vi : entry.insight.en;
  const risk = isVi ? entry.risk.vi : entry.risk.en;
  const nextStep = isVi ? entry.nextStep.vi : entry.nextStep.en;

  const deptLabel = deptKey === 'ALL'
    ? (isVi ? 'Toàn Site' : 'All Departments')
    : deptKey;

  const accentColor = siteKey === 'MLN' ? 'text-emerald-400' : siteKey === 'WNK' ? 'text-indigo-400' : 'text-amber-400';
  const borderColor = siteKey === 'MLN' ? 'border-emerald-800/40' : siteKey === 'WNK' ? 'border-indigo-800/40' : 'border-amber-800/40';
  const bgColor = siteKey === 'MLN' ? 'bg-emerald-950/20' : siteKey === 'WNK' ? 'bg-indigo-950/20' : 'bg-amber-950/20';
  const badgeBg = siteKey === 'MLN' ? 'bg-emerald-500/15 border-emerald-500/30' : siteKey === 'WNK' ? 'bg-indigo-500/15 border-indigo-500/30' : 'bg-amber-500/15 border-amber-500/30';

  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl overflow-hidden shadow-sm`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 ${badgeBg} rounded-lg border`}>
            <BarChart2 className={`w-4 h-4 ${accentColor}`} />
          </div>
          <div className="text-left">
            <span className={`text-[11px] font-black uppercase tracking-widest ${accentColor} font-mono`}>
              {isVi ? '📊 Phân tích & Khuyến nghị' : '📊 Analysis & Recommendations'}
            </span>
            <span className="text-[10px] text-slate-500 ml-2 font-mono">
              — {siteKey} / {deptLabel}
            </span>
          </div>
        </div>
        <div className="text-slate-500">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-200">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/50 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-3.5 h-3.5 ${accentColor} shrink-0`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${accentColor} font-mono`}>
                {isVi ? 'Nhận định' : 'Insight'}
              </span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-300 font-medium">{bold(insight)}</p>
          </div>
          <div className="bg-rose-950/30 rounded-xl p-4 border border-rose-900/40 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 font-mono">
                {isVi ? 'Rủi ro' : 'Risk'}
              </span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-300 font-medium">{bold(risk)}</p>
          </div>
          <div className="bg-emerald-950/25 rounded-xl p-4 border border-emerald-900/35 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                {isVi ? 'Bước tiếp theo' : 'Next Step'}
              </span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-300 font-medium">{bold(nextStep)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
