import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, AlertTriangle, Zap, BarChart2, Users, Shield } from 'lucide-react';

interface InsightPanelProps {
  featureKey: '9box' | 'pipeline' | 'devplan' | 'idp';
  lang: 'VI' | 'EN';
  selectedSite: 'MLN' | 'WNK' | 'ASH';
  selectedDept: string;
}

interface InsightData {
  trend: { vi: string; en: string };
  risk: { vi: string; en: string };
  nextStep: { vi: string; en: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// ── DATA-DRIVEN INSIGHTS ────────────────────────────────────────────────────
// All numbers sourced from actual site data (9-Box, Pipeline, IDP records)

const insights: Record<string, Record<string, Record<string, InsightData>>> = {

  // ══════════════════════════════════════════════════════════════════════════
  // 9-BOX INSIGHTS
  // ══════════════════════════════════════════════════════════════════════════
  '9box': {
    ASH: {
      ALL: {
        severity: 'medium',
        trend: {
          vi: 'Ashton có cơ cấu nhân tài **ổn định nhưng thiếu động lực tăng trưởng**: 61% Keepers, 34% Growers, chỉ 5% Movers. Đây là dấu hiệu đội ngũ vận hành tốt nhưng đang ở giai đoạn "bình nguyên" — không có đủ lực kéo từ nhóm tiềm năng cao để tạo ra đột phá. Đặc biệt, toàn site chỉ có **1 Superstar (Windy Sy, FA)** — mức độ tập trung tài năng đỉnh cao vào 1 cá nhân là rủi ro chiến lược.',
          en: 'Ashton has a **stable but growth-stagnant** talent structure: 61% Keepers, 34% Growers, only 5% Movers. This signals a well-functioning but "plateau" team — insufficient pull from high-potential talent to drive breakthroughs. Critically, the entire site has only **1 Superstar (Windy Sy, FA)** — extreme concentration of peak talent in one individual is a strategic risk.'
        },
        risk: {
          vi: 'Với 8 Rising Stars phân tán ở 5 departments nhưng không có chương trình phát triển tăng tốc, nguy cơ các Rising Star này "dậm chân" ở Valued Contributor sau 12-18 tháng là rất cao. Đồng thời, Amy Nguyen (Diamond in the Rough, CS) và Carlo Pham (Future Utility, HR) cần can thiệp ngay — nếu không có PIP trong Q3, 2 nhân sự này có thể trở thành gánh nặng vận hành.',
          en: 'With 8 Rising Stars scattered across 5 departments but no accelerated development program, the risk of these Rising Stars stagnating at Valued Contributor level within 12-18 months is high. Additionally, Amy Nguyen (Diamond in the Rough, CS) and Carlo Pham (Future Utility, HR) need immediate intervention — without Q3 PIPs, these 2 employees may become operational burdens.'
        },
        nextStep: {
          vi: 'Ưu tiên #1: Thiết lập **Rising Star Acceleration Program** — giao stretch assignment liên phòng ban cho 8 Rising Stars trong Q3. Ưu tiên #2: Khởi động PIP cho Amy Nguyen và Carlo Pham trước 31/7.',
          en: 'Priority #1: Establish **Rising Star Acceleration Program** — assign cross-departmental stretch assignments to 8 Rising Stars in Q3. Priority #2: Initiate PIPs for Amy Nguyen and Carlo Pham before July 31.'
        }
      },
      'CUSTOMER SERVICE': {
        severity: 'high',
        trend: {
          vi: 'Customer Service có cơ cấu **nặng về Keepers (78%)** với chỉ 1 Grower (Mi Nguyen - Rising Star) trong 9 người. Đây là bộ phận có tỷ lệ Growers thấp nhất site — phản ánh đặc thù công việc CS đòi hỏi sự ổn định, nhưng cũng cho thấy thiếu hụt nhân tài kế thừa nghiêm trọng. Helen Nguyen (Seasoned Professional) là trụ cột nhưng đang ở giai đoạn "bão hòa học hỏi" — cần được tái kích hoạt qua vai trò mentor.',
          en: 'Customer Service has a **Keeper-heavy structure (78%)** with only 1 Grower (Mi Nguyen - Rising Star) among 9 people. This is the site\'s lowest Growers ratio — reflecting CS work\'s stability demands, but also revealing a critical succession gap. Helen Nguyen (Seasoned Professional) is a pillar but in "learning saturation" — needs reactivation through a mentor role.'
        },
        risk: {
          vi: 'Amy Nguyen (Diamond in the Rough) là cảnh báo đỏ: hiệu suất thấp nhưng tiềm năng cao — đây là dấu hiệu **role mismatch hoặc thiếu coaching**. Nếu không được can thiệp đúng cách, Amy có thể nghỉ việc trong 6 tháng tới, mang theo tiềm năng chưa được khai thác. Đồng thời, với chỉ 1 Rising Star, nếu Mi Nguyen được thăng chức hoặc rời đi, CS sẽ không có người kế thừa.',
          en: 'Amy Nguyen (Diamond in the Rough) is a red flag: low performance but high potential — this signals **role mismatch or coaching deficit**. Without proper intervention, Amy may resign within 6 months, taking untapped potential with her. Additionally, with only 1 Rising Star, if Mi Nguyen is promoted or leaves, CS will have no successor pipeline.'
        },
        nextStep: {
          vi: 'Gặp 1-1 với Amy Nguyen để chẩn đoán nguyên nhân gốc rễ (role fit? workload? manager relationship?). Assign Mi Nguyen vào 1 dự án cross-functional để test leadership readiness.',
          en: 'Conduct 1-1 with Amy Nguyen to diagnose root cause (role fit? workload? manager relationship?). Assign Mi Nguyen to 1 cross-functional project to test leadership readiness.'
        }
      },
      'CUSTOMS': {
        severity: 'low',
        trend: {
          vi: 'Customs có cơ cấu **tương đối lành mạnh**: 3 Growers (38%), 5 Keepers (62%), 0 Movers. Đặc biệt, 2 Rising Stars (Tiny Nguyen, Harry Nguyen) đang tạo ra động lực tăng trưởng tốt. Julie Phung (High Professional) là anchor của bộ phận — năng lực cao, hiệu suất xuất sắc. Tuy nhiên, tỷ lệ Growers 38% vẫn thấp hơn benchmark lý tưởng (≥40%) cho bộ phận chuyên môn cao như Customs.',
          en: 'Customs has a **relatively healthy structure**: 3 Growers (38%), 5 Keepers (62%), 0 Movers. Notably, 2 Rising Stars (Tiny Nguyen, Harry Nguyen) are creating good growth momentum. Julie Phung (High Professional) is the department anchor — high capability, outstanding performance. However, 38% Growers is still below the ideal benchmark (≥40%) for a high-expertise department like Customs.'
        },
        risk: {
          vi: 'Julie Phung (Customs Team Leader) là vị trí **No Successor** trong pipeline — nếu Julie rời đi, không có ai đủ năng lực thay thế ngay. Tiny và Harry là Rising Stars nhưng cần thêm 1-2 năm để sẵn sàng. Đây là khoảng trống kế thừa cần được lấp đầy chủ động.',
          en: 'Julie Phung (Customs Team Leader) is a **No Successor** position in the pipeline — if Julie leaves, no one is immediately capable of replacing her. Tiny and Harry are Rising Stars but need 1-2 more years to be ready. This succession gap needs to be proactively filled.'
        },
        nextStep: {
          vi: 'Assign Tiny Nguyen hoặc Harry Nguyen vào vai trò "Acting Team Leader" trong các tình huống Julie vắng mặt — đây là cách nhanh nhất để test và build readiness mà không cần chương trình đào tạo chính thức.',
          en: 'Assign Tiny Nguyen or Harry Nguyen as "Acting Team Leader" when Julie is absent — this is the fastest way to test and build readiness without formal training programs.'
        }
      },
      'FINANCE & ACCOUNTING': {
        severity: 'low',
        trend: {
          vi: 'Finance & Accounting là **bộ phận có cơ cấu nhân tài tốt nhất site ASH**: 3 Growers (60%), 2 Keepers (40%), 0 Movers. Windy Sy (Superstar) là tài sản chiến lược duy nhất của toàn site — năng lực vượt trội ở cả 2 chiều Performance và Potential. Maya Nguyen (Rising Star) đang trên đà phát triển tốt và là ứng viên kế thừa tiềm năng nhất cho vị trí Assistant FA Manager.',
          en: 'Finance & Accounting has the **best talent structure on ASH site**: 3 Growers (60%), 2 Keepers (40%), 0 Movers. Windy Sy (Superstar) is the site\'s only strategic asset — outstanding capability on both Performance and Potential dimensions. Maya Nguyen (Rising Star) is on a strong development trajectory and is the most promising succession candidate for Assistant FA Manager.'
        },
        risk: {
          vi: 'Rủi ro tập trung: **Windy Sy là single point of failure** cho toàn bộ năng lực FA Manager. Pipeline đã có Ha Nguyen làm Successor nhưng Ha Nguyen cũng là High Professional — nếu cả 2 rời đi cùng lúc, FA sẽ mất toàn bộ năng lực lãnh đạo. Cần xây dựng "depth 2" cho vị trí này.',
          en: 'Concentration risk: **Windy Sy is a single point of failure** for all FA Manager capability. Pipeline has Ha Nguyen as Successor but Ha Nguyen is also a High Professional — if both leave simultaneously, FA loses all leadership capability. Need to build "depth 2" for this position.'
        },
        nextStep: {
          vi: 'Enroll Maya Nguyen vào chương trình Servant Leadership để accelerate leadership readiness. Đồng thời, document lại toàn bộ knowledge của Windy Sy vào SOP/playbook — đây là bảo hiểm tri thức quan trọng nhất.',
          en: 'Enroll Maya Nguyen in Servant Leadership program to accelerate leadership readiness. Simultaneously, document all of Windy Sy\'s knowledge into SOPs/playbooks — this is the most critical knowledge insurance.'
        }
      },
      'HUMAN RESOURCES': {
        severity: 'medium',
        trend: {
          vi: 'HR có cơ cấu **2 tầng rõ rệt**: Lisa Nguyen và Ellie Tran (High Professional - Growers) tạo thành lớp lãnh đạo mạnh, trong khi 4 Keepers (Jay, Gemma, Luca, Lona) tạo nền tảng vận hành ổn định. Tuy nhiên, Carlo Pham (Future Utility) là điểm yếu cần chú ý — hiệu suất thấp, tiềm năng trung bình, đây là dấu hiệu của **role overload hoặc thiếu direction rõ ràng**.',
          en: 'HR has a **clear 2-tier structure**: Lisa Nguyen and Ellie Tran (High Professional - Growers) form a strong leadership layer, while 4 Keepers (Jay, Gemma, Luca, Lona) provide stable operational foundation. However, Carlo Pham (Future Utility) is a concern — low performance, mid potential, signaling **role overload or lack of clear direction**.'
        },
        risk: {
          vi: 'Lisa và Ellie đang backup lẫn nhau (pipeline đã confirmed) — đây là điểm mạnh. Nhưng nếu cả 2 cùng thăng chức hoặc rời đi, HR sẽ mất toàn bộ năng lực chuyên môn C&B và Recruitment cùng lúc. Carlo Pham nếu không được can thiệp sẽ kéo xuống morale của team.',
          en: 'Lisa and Ellie are backing each other up (pipeline confirmed) — this is a strength. But if both are promoted or leave simultaneously, HR loses all C&B and Recruitment expertise at once. Carlo Pham without intervention will drag down team morale.'
        },
        nextStep: {
          vi: 'Clarify role scope cho Carlo Pham — xác định rõ 3 KPI cụ thể trong 90 ngày. Nếu không cải thiện sau 90 ngày, escalate lên HRBP để xem xét role reassignment.',
          en: 'Clarify role scope for Carlo Pham — define 3 specific KPIs for 90 days. If no improvement after 90 days, escalate to HRBP for role reassignment consideration.'
        }
      },
      'INFORMATION SYSTEM': {
        severity: 'medium',
        trend: {
          vi: 'IT có cơ cấu **cân bằng tốt**: 2 Growers (River Le, Harry Hoang - Rising Stars) và 2 Keepers (Ryder Nguyen, Denis Vy - Solid Professionals). Đây là tỷ lệ 50/50 lý tưởng cho bộ phận kỹ thuật — đủ ổn định để vận hành, đủ động lực để phát triển. Tuy nhiên, **75% IDP records của IT có rating N/A** — đây là khoảng trống đánh giá lớn nhất site, cần được giải quyết ngay để có baseline phát triển.',
          en: 'IT has a **well-balanced structure**: 2 Growers (River Le, Harry Hoang - Rising Stars) and 2 Keepers (Ryder Nguyen, Denis Vy - Solid Professionals). This 50/50 ratio is ideal for a technical department — stable enough to operate, dynamic enough to grow. However, **75% of IT IDP records have N/A ratings** — the largest assessment gap on site, needs immediate resolution to establish a development baseline.'
        },
        risk: {
          vi: '3/4 vị trí IT là "At Risk" hoặc "Interim Only" trong pipeline — Denis Vy, Ryder Nguyen, Harry Hoang đều không có Successor. Với đặc thù IT là kiến thức chuyên biệt khó thay thế nhanh, mỗi lần mất 1 IT staff sẽ gây **downtime hệ thống từ 2-4 tuần** trong khi tìm và onboard người mới.',
          en: '3/4 IT positions are "At Risk" or "Interim Only" in the pipeline — Denis Vy, Ryder Nguyen, Harry Hoang all have no Successors. Given IT\'s specialized knowledge that is hard to replace quickly, losing 1 IT staff will cause **2-4 weeks of system downtime** while finding and onboarding a replacement.'
        },
        nextStep: {
          vi: 'HOD IT hoàn thiện R-Rating assessment cho Denis Vy, River Le, Ryder Nguyen trong tháng 7. Đồng thời, bắt đầu cross-training giữa 4 IT members để mỗi người có thể cover ít nhất 60% công việc của người khác.',
          en: 'IT HOD completes R-Rating assessment for Denis Vy, River Le, Ryder Nguyen in July. Simultaneously, begin cross-training among 4 IT members so each can cover at least 60% of another\'s work.'
        }
      },
      'LOGISTICS': {
        severity: 'medium',
        trend: {
          vi: 'Logistics có cơ cấu **Keeper-dominant (83%)** với chỉ 1 Grower (KYLIE - Rising Star). Đây là đặc thù của bộ phận Logistics chuyên nghiệp — đội ngũ giàu kinh nghiệm, ổn định, nhưng thiếu "fresh energy". ALANA (Seasoned Professional) là chuyên gia kỳ cựu đang ở giai đoạn bão hòa — cần được tái kích hoạt qua vai trò mentor hoặc project lead.',
          en: 'Logistics has a **Keeper-dominant structure (83%)** with only 1 Grower (KYLIE - Rising Star). This is typical of a professional Logistics department — experienced, stable team, but lacking "fresh energy". ALANA (Seasoned Professional) is a veteran expert in saturation phase — needs reactivation through mentor or project lead role.'
        },
        risk: {
          vi: 'KYLIE (Rising Star) là **High Risk trong pipeline** với readiness "1-2 Years" — đây là nhân sự có tiềm năng cao nhất bộ phận nhưng cũng là người dễ bị "poach" nhất nếu không có lộ trình phát triển rõ ràng. ALICE cũng là High Risk với readiness "< 1 Year". Nếu mất cả 2 trong 12 tháng tới, Logistics sẽ mất toàn bộ lực lượng kế thừa.',
          en: 'KYLIE (Rising Star) is **High Risk in pipeline** with "1-2 Years" readiness — the department\'s highest potential talent but also most likely to be poached without a clear development path. ALICE is also High Risk with "< 1 Year" readiness. Losing both within 12 months would eliminate all of Logistics\' succession pipeline.'
        },
        nextStep: {
          vi: 'Có cuộc trò chuyện career development với KYLIE trong tháng 7 — xác nhận lộ trình thăng tiến cụ thể để tăng retention. Assign ALANA làm mentor chính thức cho KYLIE — tận dụng kinh nghiệm của Seasoned Professional để accelerate Rising Star.',
          en: 'Have a career development conversation with KYLIE in July — confirm specific promotion timeline to increase retention. Assign ALANA as official mentor for KYLIE — leverage Seasoned Professional experience to accelerate Rising Star.'
        }
      },
      'WAREHOUSE': {
        severity: 'critical',
        trend: {
          vi: 'Warehouse là **bộ phận có cơ cấu nhân tài tốt nhất trong nhóm Growers (60%)** — Thinh Mai, Violet Nguyen (High Professional) và Clara Chau (Rising Star) tạo ra lực kéo phát triển mạnh. Tuy nhiên, đây là nghịch lý: talent pool tốt nhưng **pipeline kế thừa tệ nhất site (Coverage Rate chỉ 9%)**. 34 vị trí critical roles nhưng chỉ 3 Covered — cho thấy khoảng cách lớn giữa năng lực cá nhân và hệ thống kế thừa được tổ chức.',
          en: 'Warehouse has the **best Growers structure (60%)** — Thinh Mai, Violet Nguyen (High Professional) and Clara Chau (Rising Star) create strong development momentum. However, this is a paradox: good talent pool but **worst succession pipeline on site (Coverage Rate only 9%)**. 34 critical roles but only 3 Covered — showing a large gap between individual capability and organized succession systems.'
        },
        risk: {
          vi: '3 vị trí Critical (Võ Anh Cảnh - Warehouse Manager, Francisco Gonzalez - Warehouse Director, Kim Trần - Warehouse Manager) không có Successor và đều là High Risk. Nếu bất kỳ 1 trong 3 người này rời đi đột ngột, **toàn bộ hoạt động Warehouse có thể bị tê liệt**. Đây là rủi ro vận hành nghiêm trọng nhất của toàn site ASH.',
          en: '3 Critical positions (Võ Anh Cảnh - Warehouse Manager, Francisco Gonzalez - Warehouse Director, Kim Trần - Warehouse Manager) have no Successors and are all High Risk. If any 1 of these 3 leaves suddenly, **entire Warehouse operations could be paralyzed**. This is the most severe operational risk on the entire ASH site.'
        },
        nextStep: {
          vi: 'Khởi động **Cross-training Matrix** ngay trong tháng 7: map 23 vị trí No Successor với 5 Growers hiện có — mỗi Grower cover 4-5 vị trí. Đây không phải giải pháp hoàn hảo nhưng là biện pháp giảm thiểu rủi ro khả thi nhất trong ngắn hạn.',
          en: 'Launch **Cross-training Matrix** immediately in July: map 23 No Successor positions with 5 existing Growers — each Grower covers 4-5 positions. This is not a perfect solution but is the most feasible short-term risk mitigation measure.'
        }
      }
    },
    WNK: {
      ALL: {
        severity: 'medium',
        trend: {
          vi: 'Wanek đang trong giai đoạn **ramp-up mạnh** với 55 nhân sự trải rộng 14 departments. Cơ cấu nhân tài đang được xây dựng song song với mở rộng nhà máy — đây là thách thức kép: vừa vận hành vừa phát triển. Điểm nóng: UPH Support WNK3 có tỷ lệ Low Readiness cao nhất (6/16 duties = 37.5%), cần can thiệp ưu tiên.',
          en: 'Wanek is in a strong **ramp-up phase** with 55 employees across 14 departments. Talent structure is being built in parallel with factory expansion — a dual challenge: operate while developing. Hotspot: UPH Support WNK3 has the highest Low Readiness rate (6/16 duties = 37.5%), needs priority intervention.'
        },
        risk: {
          vi: 'Với 803 IDP records và chỉ 1 L&D, nguy cơ **overload quản lý phát triển** là rất thực. Nếu không có hệ thống Train-the-Trainer, L&D sẽ là bottleneck của toàn bộ kế hoạch phát triển nhân tài Wanek.',
          en: 'With 803 IDP records and only 1 L&D, the risk of **development management overload** is very real. Without a Train-the-Trainer system, L&D will be the bottleneck for all of Wanek\'s talent development plans.'
        },
        nextStep: {
          vi: 'Xác định 5-7 Supervisor/Team Leader có năng lực coaching tốt nhất để đào tạo thành Internal Trainer — đây là đòn bẩy quan trọng nhất để scale development mà không cần thêm L&D headcount.',
          en: 'Identify 5-7 Supervisors/Team Leaders with the best coaching capability to train as Internal Trainers — this is the most important lever to scale development without adding L&D headcount.'
        }
      }
    },
    MLN: {
      ALL: {
        severity: 'low',
        trend: {
          vi: 'Millennium có hệ thống nhân tài **trưởng thành và cân bằng nhất** trong 3 sites. Cơ cấu 9-Box phản ánh tổ chức đang ở giai đoạn **Capability Consolidation** — đủ Growers để tạo động lực, đủ Keepers để ổn định vận hành. Thách thức chính: duy trì momentum phát triển và tránh "talent stagnation" ở nhóm Keepers lâu năm.',
          en: 'Millennium has the **most mature and balanced** talent system among 3 sites. The 9-Box structure reflects an organization in **Capability Consolidation** phase — enough Growers for momentum, enough Keepers for operational stability. Main challenge: maintaining development momentum and avoiding "talent stagnation" in long-tenured Keepers.'
        },
        risk: {
          vi: 'Nhóm Movers cần được theo dõi chặt — nếu không có PIP rõ ràng trong 2 quý tới, nguy cơ mất nhân sự vận hành đột ngột là hiện hữu. Chi phí thay thế 1 nhân sự vận hành có kinh nghiệm = 3-6 tháng lương + 2-3 tháng onboarding.',
          en: 'The Movers group needs close monitoring — without clear PIPs in the next 2 quarters, the risk of sudden operational talent loss is real. Replacing 1 experienced operational employee costs 3-6 months salary + 2-3 months onboarding.'
        },
        nextStep: {
          vi: 'HOD xác nhận danh sách Movers và lên PIP cụ thể. L&D hỗ trợ thiết kế action plan — không cần chương trình đào tạo phức tạp, chỉ cần 3 KPI rõ ràng và checkpoint hàng tháng.',
          en: 'HODs confirm Movers list and create specific PIPs. L&D supports action plan design — no complex training programs needed, just 3 clear KPIs and monthly checkpoints.'
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PIPELINE INSIGHTS
  // ══════════════════════════════════════════════════════════════════════════
  'pipeline': {
    ASH: {
      ALL: {
        severity: 'critical',
        trend: {
          vi: 'ASH Pipeline có **Coverage Rate tổng thể chỉ 30%** (18/60 vị trí Covered) — thấp nhất trong 3 sites. Phân tích theo dept: Finance & Accounting và HR đạt 100% coverage (điểm sáng), trong khi Warehouse chỉ 9% (điểm tối nhất). 3 vị trí Critical (Warehouse Manager x2, Warehouse Director) là rủi ro vận hành cấp độ site.',
          en: 'ASH Pipeline has an **overall Coverage Rate of only 30%** (18/60 positions Covered) — lowest among 3 sites. By department: Finance & Accounting and HR achieve 100% coverage (bright spots), while Warehouse is only 9% (darkest point). 3 Critical positions (Warehouse Manager x2, Warehouse Director) are site-level operational risks.'
        },
        risk: {
          vi: 'Logistics có 2 High Risk positions (KYLIE, ALICE) đang trong giai đoạn Developing — đây là nhóm dễ bị "poach" nhất vì họ đang được đào tạo và nhận ra giá trị của mình. Nếu không có retention plan cụ thể, nguy cơ mất 2 nhân sự này trong 12 tháng tới là rất cao.',
          en: 'Logistics has 2 High Risk positions (KYLIE, ALICE) in Developing stage — this group is most likely to be poached as they are being trained and recognizing their own value. Without a specific retention plan, the risk of losing these 2 within 12 months is very high.'
        },
        nextStep: {
          vi: 'Tập trung vào **Warehouse Cross-training** trước — đây là dept có impact lớn nhất. Mỗi tuần, assign 1 Grower (Thinh Mai, Violet Nguyen, Clara Chau) vào 1 vị trí At Risk để shadow và học. Không cần chương trình chính thức — OJT là đủ.',
          en: 'Focus on **Warehouse Cross-training** first — this dept has the highest impact. Each week, assign 1 Grower (Thinh Mai, Violet Nguyen, Clara Chau) to 1 At Risk position to shadow and learn. No formal program needed — OJT is sufficient.'
        }
      },
      'WAREHOUSE': {
        severity: 'critical',
        trend: {
          vi: 'Warehouse Pipeline là **khủng hoảng kế thừa nghiêm trọng nhất site ASH**: 34 vị trí critical roles, chỉ 3 Covered (9%), 20 At Risk, 3 Critical. Đặc biệt, toàn bộ chuỗi Loading (Supervisor + Team Leaders) và Picking (Supervisor + Team Leaders) đều không có Successor — đây là 2 chuỗi vận hành cốt lõi của Warehouse.',
          en: 'Warehouse Pipeline is the **most severe succession crisis on ASH site**: 34 critical roles, only 3 Covered (9%), 20 At Risk, 3 Critical. Notably, the entire Loading chain (Supervisor + Team Leaders) and Picking chain (Supervisor + Team Leaders) have no Successors — these are the 2 core operational chains of Warehouse.'
        },
        risk: {
          vi: 'Võ Anh Cảnh, Francisco Gonzalez, Kim Trần (3 Critical positions) là **triple point of failure** — nếu bất kỳ 1 trong 3 người này nghỉ đột ngột, không có ai có thể điều hành Warehouse ở cấp độ Manager. Đây là rủi ro business continuity cấp độ site, không chỉ là rủi ro HR.',
          en: 'Võ Anh Cảnh, Francisco Gonzalez, Kim Trần (3 Critical positions) are a **triple point of failure** — if any 1 of these 3 leaves suddenly, no one can manage Warehouse at Manager level. This is a site-level business continuity risk, not just an HR risk.'
        },
        nextStep: {
          vi: 'Báo cáo ngay lên HRD về 3 Critical positions — đây vượt quá phạm vi L&D và cần quyết định cấp cao hơn (có thể cần external hire hoặc internal transfer từ site khác). Trong khi chờ, bắt đầu cross-training Loading và Picking ngay.',
          en: 'Report immediately to HRD about 3 Critical positions — this exceeds L&D scope and requires higher-level decisions (may need external hire or internal transfer from another site). Meanwhile, begin Loading and Picking cross-training immediately.'
        }
      },
      'LOGISTICS': {
        severity: 'high',
        trend: {
          vi: 'Logistics Pipeline có **Coverage Rate 50%** (3/6 Covered) — mức trung bình nhưng ẩn chứa rủi ro cao. 2 High Risk positions (KYLIE - 1-2 Years, ALICE - < 1 Year) đang trong giai đoạn Developing. Điểm tích cực: ALANA, STEPHEN, TANA đã có Successor Ready — đây là nền tảng tốt.',
          en: 'Logistics Pipeline has **50% Coverage Rate** (3/6 Covered) — average but hiding high risk. 2 High Risk positions (KYLIE - 1-2 Years, ALICE - < 1 Year) are in Developing stage. Positive: ALANA, STEPHEN, TANA already have Ready Successors — this is a good foundation.'
        },
        risk: {
          vi: 'KYLIE đang phụ trách FCA Transportation project — đây là dự án chiến lược với kiến thức chuyên biệt cao. Nếu KYLIE rời đi trước khi Successor (Alice Le) sẵn sàng, toàn bộ kiến thức về FCA Transportation process sẽ bị mất theo.',
          en: 'KYLIE is managing the FCA Transportation project — a strategic project with highly specialized knowledge. If KYLIE leaves before Successor (Alice Le) is ready, all FCA Transportation process knowledge will be lost.'
        },
        nextStep: {
          vi: 'Yêu cầu KYLIE document lại FCA Transportation process vào SOP trong tháng 7 — đây vừa là knowledge preservation vừa là cách test KYLIE\'s mastery. Đồng thời, accelerate Alice Le\'s readiness bằng cách assign vào FCA project ngay.',
          en: 'Request KYLIE to document FCA Transportation process into SOP in July — this is both knowledge preservation and a way to test KYLIE\'s mastery. Simultaneously, accelerate Alice Le\'s readiness by assigning her to the FCA project immediately.'
        }
      },
      'INFORMATION SYSTEM': {
        severity: 'high',
        trend: {
          vi: 'IT Pipeline có **Coverage Rate chỉ 25%** (1/4 Covered) — chỉ River Le có Successor (Jindo Nguyen). Denis Vy và Ryder Nguyen đang backup lẫn nhau (Interim Only) nhưng đây không phải giải pháp bền vững. Harry Hoang (IT Software Support & Developer) hoàn toàn không có Successor — đây là vị trí có kiến thức chuyên biệt nhất và khó thay thế nhất.',
          en: 'IT Pipeline has **only 25% Coverage Rate** (1/4 Covered) — only River Le has a Successor (Jindo Nguyen). Denis Vy and Ryder Nguyen are backing each other up (Interim Only) but this is not a sustainable solution. Harry Hoang (IT Software Support & Developer) has absolutely no Successor — this is the most specialized and hardest to replace position.'
        },
        risk: {
          vi: 'Harry Hoang là người duy nhất hiểu toàn bộ software systems của ASH. Nếu Harry nghỉ việc, **không ai có thể maintain hoặc troubleshoot các hệ thống phần mềm nội bộ** — đây là rủi ro IT infrastructure nghiêm trọng.',
          en: 'Harry Hoang is the only person who understands all of ASH\'s software systems. If Harry resigns, **no one can maintain or troubleshoot internal software systems** — this is a serious IT infrastructure risk.'
        },
        nextStep: {
          vi: 'Yêu cầu Harry Hoang tạo **IT System Documentation** toàn diện trong Q3 — bao gồm architecture, troubleshooting guides, và access credentials. Đây là ưu tiên #1 cho IT dept, không phải đào tạo.',
          en: 'Request Harry Hoang to create comprehensive **IT System Documentation** in Q3 — including architecture, troubleshooting guides, and access credentials. This is IT dept\'s #1 priority, not training.'
        }
      },
      'FINANCE & ACCOUNTING': {
        severity: 'low',
        trend: {
          vi: 'Finance & Accounting là **bộ phận duy nhất đạt 100% Coverage Rate** trên toàn site ASH — tất cả 5 vị trí đều có Successor Ready. Đây là kết quả của việc xây dựng pipeline có hệ thống: Windy → Ha → Maya tạo thành chuỗi kế thừa 3 tầng rõ ràng.',
          en: 'Finance & Accounting is the **only department achieving 100% Coverage Rate** on the entire ASH site — all 5 positions have Ready Successors. This is the result of systematic pipeline building: Windy → Ha → Maya forms a clear 3-tier succession chain.'
        },
        risk: {
          vi: 'Rủi ro thấp nhưng cần chú ý: Helen Ngo và Cheryl Nguyen đang backup lẫn nhau (Cheryl & Maya / Maya & Helen). Nếu cả 2 cùng nghỉ phép hoặc bệnh, GL Accountant coverage sẽ bị thiếu hụt. Cần đảm bảo Maya có thể cover cả 2 vị trí này.',
          en: 'Low risk but worth noting: Helen Ngo and Cheryl Nguyen are backing each other up (Cheryl & Maya / Maya & Helen). If both take leave or fall ill simultaneously, GL Accountant coverage will be insufficient. Need to ensure Maya can cover both positions.'
        },
        nextStep: {
          vi: 'Duy trì momentum tốt hiện tại. Tập trung vào việc document lại các quy trình FA phức tạp (Intercompany Loan, Tax declarations) để giảm dependency vào cá nhân. FA là model tốt để các dept khác học hỏi.',
          en: 'Maintain current good momentum. Focus on documenting complex FA processes (Intercompany Loan, Tax declarations) to reduce individual dependency. FA is a good model for other departments to learn from.'
        }
      }
    },
    WNK: {
      ALL: {
        severity: 'medium',
        trend: {
          vi: 'Wanek Pipeline đang được xây dựng song song với ramp-up nhà máy. Ưu tiên cao nhất: các vị trí Supervisor tại UPH và Cut&Sew WNK3 cần có Successor sẵn sàng trước Q4/2026.',
          en: 'Wanek Pipeline is being built in parallel with factory ramp-up. Highest priority: Supervisor positions in UPH and Cut&Sew WNK3 need ready Successors before Q4/2026.'
        },
        risk: {
          vi: 'Mỗi lần Supervisor vắng mặt mà không có người thay thế → dây chuyền sản xuất chạy dưới công suất → ảnh hưởng trực tiếp đến KPI sản lượng.',
          en: 'Every Supervisor absence without a replacement → production line runs below capacity → directly impacts output KPIs.'
        },
        nextStep: {
          vi: 'Triển khai Shadowing Program: mỗi Supervisor chọn 1 Team Leader tiềm năng để shadow trong 4 tuần — đây là cách nhanh nhất để build readiness mà không cần ngân sách đào tạo.',
          en: 'Launch Shadowing Program: each Supervisor selects 1 potential Team Leader to shadow for 4 weeks — the fastest way to build readiness without training budget.'
        }
      }
    },
    MLN: {
      ALL: {
        severity: 'low',
        trend: {
          vi: 'Millennium Pipeline tương đối đầy đủ cho các vị trí cấp cao. Tập trung vào việc giải quyết các vị trí "Interim Only" còn tồn đọng.',
          en: 'Millennium Pipeline is relatively complete for senior positions. Focus on resolving remaining "Interim Only" positions.'
        },
        risk: {
          vi: 'Các vị trí "Interim Only" kéo dài → người tạm quyền kiệt sức → chất lượng quyết định suy giảm.',
          en: '"Interim Only" positions prolonged → temporary coverage burnout → decision quality degradation.'
        },
        nextStep: {
          vi: 'HRBP lập danh sách ưu tiên các vị trí "Interim Only" và đề xuất Successor candidate trong 2 tuần.',
          en: 'HRBP prioritizes "Interim Only" positions and proposes Successor candidates within 2 weeks.'
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TRAINING PLAN INSIGHTS
  // ══════════════════════════════════════════════════════════════════════════
  'devplan': {
    ASH: {
      ALL: {
        severity: 'high',
        trend: {
          vi: 'ASH Training Plan có **9 chương trình** với 2 ưu tiên rõ ràng: Coaching Skills (57 needs, 81.8% low readiness) và Communication (12 needs, 100% dept coverage). Đặc biệt, Coaching Skills có tỷ lệ low readiness cao nhất — phản ánh thực tế HOD ASH chưa được trang bị đủ kỹ năng phát triển cấp dưới. Đây là **root cause** của nhiều vấn đề nhân tài khác.',
          en: 'ASH Training Plan has **9 programs** with 2 clear priorities: Coaching Skills (57 needs, 81.8% low readiness) and Communication (12 needs, 100% dept coverage). Notably, Coaching Skills has the highest low readiness rate — reflecting that ASH HODs are not yet equipped with sufficient subordinate development skills. This is the **root cause** of many other talent issues.'
        },
        risk: {
          vi: 'Nếu Coaching Skills không được giải quyết, HOD sẽ tiếp tục không biết cách phát triển cấp dưới → IDP chỉ là form điền → Rising Stars không được accelerate → talent pipeline không được build → vòng lặp thiếu hụt kéo dài.',
          en: 'If Coaching Skills is not addressed, HODs will continue to not know how to develop subordinates → IDPs are just forms → Rising Stars are not accelerated → talent pipeline is not built → perpetual shortage cycle.'
        },
        nextStep: {
          vi: 'Triển khai **Coaching Skills workshop** cho tất cả HOD ASH trước — đây là investment có ROI cao nhất vì 1 HOD được coaching tốt sẽ phát triển được 5-10 nhân viên. Không cần chương trình dài — 2 buổi workshop thực hành là đủ để bắt đầu.',
          en: 'Deploy **Coaching Skills workshop** for all ASH HODs first — this is the highest ROI investment because 1 well-coached HOD will develop 5-10 employees. No long program needed — 2 practical workshop sessions are enough to start.'
        }
      },
      'FINANCE & ACCOUNTING': {
        severity: 'medium',
        trend: {
          vi: 'FA có 43 IDP duties với **21% Low Readiness (9 duties)** và 23 Top Opportunities — tỷ lệ Top Opps/Total cao nhất site (53%). Điều này cho thấy FA team có **awareness tốt về khoảng cách năng lực** của mình — đây là nền tảng tốt để xây dựng training plan hiệu quả. Functional skills (36/43 duties) là nhu cầu chủ đạo, phản ánh đặc thù công việc kế toán chuyên sâu.',
          en: 'FA has 43 IDP duties with **21% Low Readiness (9 duties)** and 23 Top Opportunities — highest Top Opps/Total ratio on site (53%). This shows FA team has **good awareness of their competency gaps** — a solid foundation for effective training planning. Functional skills (36/43 duties) is the dominant need, reflecting specialized accounting work.'
        },
        risk: {
          vi: '9 Low Readiness duties tập trung ở Cheryl Nguyen (Financial Modeling, Business Performance Analysis) — đây là các kỹ năng cần thiết để Cheryl sẵn sàng thay thế Ha Nguyen. Nếu không được phát triển, succession chain Windy → Ha → Maya sẽ bị gián đoạn ở tầng thứ 3.',
          en: '9 Low Readiness duties concentrated in Cheryl Nguyen (Financial Modeling, Business Performance Analysis) — these are skills needed for Cheryl to be ready to replace Ha Nguyen. Without development, the Windy → Ha → Maya succession chain will be disrupted at the 3rd tier.'
        },
        nextStep: {
          vi: 'Assign Cheryl Nguyen vào 2 dự án cụ thể: (1) Hỗ trợ Maya trong Business Performance Analysis hàng tháng, (2) Shadow Ha Nguyen trong quá trình cập nhật 10-year debt strategy. Đây là OJT hiệu quả hơn bất kỳ khóa học nào.',
          en: 'Assign Cheryl Nguyen to 2 specific projects: (1) Support Maya in monthly Business Performance Analysis, (2) Shadow Ha Nguyen in updating the 10-year debt strategy. This OJT is more effective than any course.'
        }
      },
      'INFORMATION SYSTEM': {
        severity: 'high',
        trend: {
          vi: 'IT có **75% duties với N/A rating** — đây là khoảng trống đánh giá lớn nhất site. Tuy nhiên, 23/40 duties được đánh dấu Top Opportunity — cho thấy IT team có định hướng phát triển rõ ràng dù chưa có baseline rating. Digital (4 duties) và People Development (5 duties) là 2 category nổi bật ngoài Functional.',
          en: 'IT has **75% duties with N/A rating** — the largest assessment gap on site. However, 23/40 duties are marked as Top Opportunity — showing IT team has clear development direction despite no baseline rating. Digital (4 duties) and People Development (5 duties) are 2 notable categories beyond Functional.'
        },
        risk: {
          vi: 'Không có R-Rating baseline → không thể đo lường progress → không thể justify training investment → IT development plan không có accountability. Đây là vòng lặp nguy hiểm cho bộ phận có kiến thức chuyên biệt cao.',
          en: 'No R-Rating baseline → cannot measure progress → cannot justify training investment → IT development plan has no accountability. This is a dangerous cycle for a highly specialized department.'
        },
        nextStep: {
          vi: 'HOD IT thực hiện **R-Rating assessment** cho 4 IT members trong 2 tuần — không cần form phức tạp, chỉ cần HOD đánh giá từng duty theo thang R1-R4 dựa trên quan sát thực tế. Sau đó L&D sẽ update vào hệ thống.',
          en: 'IT HOD conducts **R-Rating assessment** for 4 IT members within 2 weeks — no complex forms needed, just HOD rating each duty on R1-R4 scale based on actual observation. L&D will then update the system.'
        }
      }
    },
    WNK: {
      ALL: {
        severity: 'high',
        trend: {
          vi: 'Wanek có nhu cầu đào tạo lớn nhất trong 3 sites. Coaching Skills (122 needs) là ưu tiên #1 — đây là năng lực nền tảng để scale Train-the-Trainer. Nếu không có Internal Trainers, L&D sẽ không thể phục vụ 55 nhân sự trải rộng 14 departments.',
          en: 'Wanek has the highest training demand among 3 sites. Coaching Skills (122 needs) is Priority #1 — this is the foundational competency to scale Train-the-Trainer. Without Internal Trainers, L&D cannot serve 55 employees across 14 departments.'
        },
        risk: {
          vi: 'L&D là single point of failure cho toàn bộ training delivery. Nếu không build Internal Trainer network trong Q3, Q4 ramp-up sẽ không có đủ training support.',
          en: 'L&D is a single point of failure for all training delivery. Without building an Internal Trainer network in Q3, Q4 ramp-up will not have sufficient training support.'
        },
        nextStep: {
          vi: 'Identify 5 Supervisor/Team Leader có năng lực coaching tốt nhất → Train-the-Trainer 2 buổi → Deploy họ làm Internal Trainer cho dept của mình. L&D chỉ cần QA và support.',
          en: 'Identify 5 Supervisors/Team Leaders with best coaching capability → Train-the-Trainer 2 sessions → Deploy them as Internal Trainers for their departments. L&D only needs to QA and support.'
        }
      }
    },
    MLN: {
      ALL: {
        severity: 'low',
        trend: {
          vi: 'Millennium Training Plan có 14 chương trình với AI & Automation (H.1) và Leadership (H.2) là 2 ưu tiên hàng đầu. Đây là lựa chọn đúng đắn — 2 năng lực này có ROI cao nhất trong môi trường sản xuất hiện đại.',
          en: 'Millennium Training Plan has 14 programs with AI & Automation (P.1) and Leadership (P.2) as top 2 priorities. This is the right choice — these 2 competencies have the highest ROI in modern manufacturing environments.'
        },
        risk: {
          vi: 'Nếu completion rate dưới 80%, chương trình sẽ không đạt ROI kỳ vọng. HOD cần cam kết sắp xếp ca kíp để nhân viên có thể tham gia.',
          en: 'If completion rate falls below 80%, programs will not achieve expected ROI. HODs must commit to arranging shifts so employees can participate.'
        },
        nextStep: {
          vi: 'HOD xác nhận danh sách tham gia và cam kết tỷ lệ 80% trước khi L&D lên lịch chính thức.',
          en: 'HODs confirm participant lists and commit to 80% rate before L&D finalizes the official schedule.'
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  // IDP INSIGHTS
  // ══════════════════════════════════════════════════════════════════════════
  'idp': {
    ASH: {
      ALL: {
        severity: 'medium',
        trend: {
          vi: 'ASH IDP có **199 records từ 16 nhân sự** — trung bình 12.4 duties/người, phù hợp với chuẩn (8-15). Điểm nổi bật: Finance & Accounting có tỷ lệ Top Opportunities cao nhất (23/43 = 53%) — cho thấy team FA có self-awareness tốt về khoảng cách phát triển. IT là ngoại lệ với 75% N/A rating — cần được giải quyết ưu tiên.',
          en: 'ASH IDP has **199 records from 16 employees** — averaging 12.4 duties/person, within standard range (8-15). Highlight: Finance & Accounting has the highest Top Opportunities ratio (23/43 = 53%) — showing FA team has good self-awareness of development gaps. IT is the exception with 75% N/A rating — needs priority resolution.'
        },
        risk: {
          vi: 'IDP của các team leads (Henry Le, Shen Jim, Rita Hoang, Kim Tran, Trudy Dinh) mỗi người có 17 duties — đây là scope rộng nhất. Nếu không được follow-up đều đặn, các IDP này sẽ trở thành "tài liệu lưu trữ" thay vì công cụ phát triển thực sự.',
          en: 'IDPs of team leads (Henry Le, Shen Jim, Rita Hoang, Kim Tran, Trudy Dinh) each have 17 duties — the broadest scope. Without regular follow-up, these IDPs will become "archived documents" rather than real development tools.'
        },
        nextStep: {
          vi: 'Tích hợp IDP review vào lịch 1-1 hàng tháng của HOD — không cần review toàn bộ 17 duties, chỉ cần focus vào **Top Opportunities (đánh dấu X)** mỗi tháng. Đây là cách đơn giản nhất để IDP có tác động thực sự.',
          en: 'Integrate IDP review into HOD monthly 1-1 schedule — no need to review all 17 duties, just focus on **Top Opportunities (marked X)** each month. This is the simplest way for IDPs to have real impact.'
        }
      },
      'FINANCE & ACCOUNTING': {
        severity: 'medium',
        trend: {
          vi: 'FA IDP có **21% Low Readiness (9/43 duties)** — tập trung ở Cheryl Nguyen (R2: Financial Modeling, Business Performance Analysis, Leadership Mindset). Đây là 3 kỹ năng cần thiết để Cheryl sẵn sàng thay thế Ha Nguyen trong succession chain. 23 Top Opportunities phản ánh team FA có định hướng phát triển rõ ràng và chủ động.',
          en: 'FA IDP has **21% Low Readiness (9/43 duties)** — concentrated in Cheryl Nguyen (R2: Financial Modeling, Business Performance Analysis, Leadership Mindset). These are 3 skills needed for Cheryl to be ready to replace Ha Nguyen in the succession chain. 23 Top Opportunities reflect FA team has clear and proactive development direction.'
        },
        risk: {
          vi: 'Cheryl\'s 3 R2 duties đều liên quan đến leadership và strategic finance — đây là kỹ năng không thể học từ sách mà phải học qua thực hành. Nếu không được assign vào các dự án thực tế, Cheryl sẽ mãi ở R2 dù có tham gia bao nhiêu khóa học.',
          en: 'Cheryl\'s 3 R2 duties all relate to leadership and strategic finance — skills that cannot be learned from books but must be learned through practice. Without being assigned to real projects, Cheryl will remain at R2 regardless of how many courses she attends.'
        },
        nextStep: {
          vi: 'Ha Nguyen assign Cheryl vào 1 dự án tài chính chiến lược trong Q3 (ví dụ: cập nhật 10-year debt strategy hoặc chuẩn bị báo cáo BOD). Đây là stretch assignment hiệu quả nhất cho Cheryl.',
          en: 'Ha Nguyen assigns Cheryl to 1 strategic finance project in Q3 (e.g., updating 10-year debt strategy or preparing BOD report). This is the most effective stretch assignment for Cheryl.'
        }
      },
      'INFORMATION SYSTEM': {
        severity: 'high',
        trend: {
          vi: 'IT IDP có **75% N/A rating (30/40 duties)** — đây là khoảng trống đánh giá lớn nhất site. Tuy nhiên, 23/40 duties được đánh dấu Top Opportunity — cho thấy IT team biết mình cần phát triển gì, chỉ chưa có baseline để đo lường. Harry Hoang là ngoại lệ tích cực: tất cả duties đều có R3-R4 rating, phản ánh năng lực kỹ thuật vững chắc.',
          en: 'IT IDP has **75% N/A rating (30/40 duties)** — the largest assessment gap on site. However, 23/40 duties are marked as Top Opportunity — showing IT team knows what they need to develop, just lacks a baseline to measure. Harry Hoang is a positive exception: all duties have R3-R4 ratings, reflecting solid technical capability.'
        },
        risk: {
          vi: 'Denis Vy, River Le, Ryder Nguyen có N/A rating cho tất cả duties — không phải vì họ không có năng lực, mà vì HOD chưa thực hiện assessment. Điều này tạo ra **blind spot trong talent management**: L&D không biết họ cần gì, HOD không có data để ra quyết định phát triển.',
          en: 'Denis Vy, River Le, Ryder Nguyen have N/A ratings for all duties — not because they lack capability, but because HOD has not conducted assessment. This creates a **blind spot in talent management**: L&D doesn\'t know what they need, HOD has no data for development decisions.'
        },
        nextStep: {
          vi: 'HOD IT dành 2 giờ trong tuần tới để đánh giá R-Rating cho Denis Vy, River Le, Ryder Nguyen — sử dụng quan sát thực tế hàng ngày làm cơ sở. Không cần form phức tạp, chỉ cần honest assessment theo thang R1-R4.',
          en: 'IT HOD spends 2 hours next week to assess R-Ratings for Denis Vy, River Le, Ryder Nguyen — using daily practical observation as the basis. No complex forms needed, just honest assessment on R1-R4 scale.'
        }
      },
      'HUMAN RESOURCES': {
        severity: 'low',
        trend: {
          vi: 'HR IDP có **6% Low Readiness (2/31 duties)** — tỷ lệ thấp nhất site, phản ánh Lisa Nguyen và Ellie Tran đều là High Professional với năng lực vững chắc. 10 Top Opportunities tập trung vào People Development (15 duties) — cho thấy HR team đang chủ động phát triển năng lực coaching và talent management, phù hợp với vai trò HR.',
          en: 'HR IDP has **6% Low Readiness (2/31 duties)** — lowest rate on site, reflecting Lisa Nguyen and Ellie Tran are both High Professionals with solid capabilities. 10 Top Opportunities focused on People Development (15 duties) — showing HR team is proactively developing coaching and talent management capabilities, aligned with HR role.'
        },
        risk: {
          vi: 'Rủi ro thấp về năng lực, nhưng cần chú ý: HR đang phụ trách cả C&B (Lisa) và Recruitment (Ellie) — 2 chức năng hoàn toàn khác nhau. Nếu 1 trong 2 vắng mặt, người còn lại phải cover cả 2 chức năng — đây là workload risk, không phải capability risk.',
          en: 'Low capability risk, but worth noting: HR is managing both C&B (Lisa) and Recruitment (Ellie) — 2 completely different functions. If 1 is absent, the other must cover both functions — this is a workload risk, not a capability risk.'
        },
        nextStep: {
          vi: 'Lisa và Ellie dành 1 buổi/tháng để cross-train lẫn nhau về C&B và Recruitment basics — đây là knowledge sharing đơn giản nhưng hiệu quả để giảm single-function dependency.',
          en: 'Lisa and Ellie spend 1 session/month cross-training each other on C&B and Recruitment basics — simple but effective knowledge sharing to reduce single-function dependency.'
        }
      }
    },
    WNK: {
      ALL: {
        severity: 'high',
        trend: {
          vi: 'Wanek IDP có 803 records từ 55 nhân sự — trung bình 14.6 duties/người, cao hơn chuẩn. Top Opportunities tập trung ở UPH Support WNK3 (6 nhân sự, mỗi người 6 Top Opps) — đây là nhóm cần được ưu tiên phát triển nhất.',
          en: 'Wanek IDP has 803 records from 55 employees — averaging 14.6 duties/person, above standard. Top Opportunities concentrated in UPH Support WNK3 (6 employees, 6 Top Opps each) — this group needs the highest development priority.'
        },
        risk: {
          vi: 'Với 803 records, nếu không có hệ thống theo dõi tự động, L&D sẽ không thể track tiến độ của tất cả IDP. Cần thiết lập quy trình review đơn giản: HOD review Top Opps hàng tháng, L&D review tổng hợp hàng quý.',
          en: 'With 803 records, without an automated tracking system, L&D cannot track all IDP progress. Need to establish a simple review process: HOD reviews Top Opps monthly, L&D reviews aggregate quarterly.'
        },
        nextStep: {
          vi: 'HOD UPH Support WNK3 xác định Top 3 Opportunities cho mỗi nhân sự và assign action owner cụ thể. Đây là bước đơn giản nhất để IDP có tác động thực sự.',
          en: 'UPH Support WNK3 HOD identifies Top 3 Opportunities for each employee and assigns specific action owners. This is the simplest step to make IDPs have real impact.'
        }
      }
    },
    MLN: {
      ALL: {
        severity: 'low',
        trend: {
          vi: 'Millennium IDP là hệ thống đầy đủ nhất. Tập trung vào việc follow-up các IDP có R1/R2 rating để đảm bảo chúng không chỉ là tài liệu lưu trữ.',
          en: 'Millennium IDP is the most complete system. Focus on following up R1/R2 rated IDPs to ensure they are not just archived documents.'
        },
        risk: {
          vi: 'IDP R1/R2 không được follow-up → nhân viên cảm thấy bị bỏ rơi → tăng nguy cơ nghỉ việc của nhóm có tiềm năng cao.',
          en: 'R1/R2 IDPs not followed up → employees feel abandoned → increased attrition risk for high-potential group.'
        },
        nextStep: {
          vi: 'HOD review tất cả IDP có R1/R2 và xác nhận kế hoạch can thiệp trong 30 ngày.',
          en: 'HODs review all R1/R2 IDPs and confirm intervention plans within 30 days.'
        }
      }
    }
  }
};

// ── SEVERITY CONFIG ─────────────────────────────────────────────────────────
const severityConfig = {
  low: { color: 'emerald', label: { vi: 'Ổn định', en: 'Stable' }, icon: '🟢' },
  medium: { color: 'amber', label: { vi: 'Cần chú ý', en: 'Attention Needed' }, icon: '🟡' },
  high: { color: 'orange', label: { vi: 'Ưu tiên cao', en: 'High Priority' }, icon: '🟠' },
  critical: { color: 'rose', label: { vi: 'Khẩn cấp', en: 'Critical' }, icon: '🔴' }
};

export default function InsightPanel({ featureKey, lang, selectedSite, selectedDept }: InsightPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const siteData = insights[featureKey]?.[selectedSite];
  if (!siteData) return null;

  // Get dept-specific or fall back to ALL
  const deptKey = selectedDept === 'ALL' ? 'ALL' : selectedDept;
  const data = siteData[deptKey] || siteData['ALL'];
  if (!data) return null;

  const sev = severityConfig[data.severity];
  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-200 bg-emerald-50',
    amber: 'border-amber-200 bg-amber-50',
    orange: 'border-orange-200 bg-orange-50',
    rose: 'border-rose-200 bg-rose-50'
  };
  const textMap: Record<string, string> = {
    emerald: 'text-emerald-800',
    amber: 'text-amber-800',
    orange: 'text-orange-800',
    rose: 'text-rose-800'
  };
  const badgeMap: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    amber: 'bg-amber-100 text-amber-700 border-amber-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    rose: 'bg-rose-100 text-rose-700 border-rose-300'
  };

  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const deptLabel = selectedDept === 'ALL'
    ? (lang === 'VI' ? 'Toàn site' : 'All Departments')
    : selectedDept;

  return (
    <div className={`rounded-2xl border-2 ${colorMap[sev.color]} shadow-sm overflow-hidden`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <BarChart2 className={`w-4 h-4 ${textMap[sev.color]} shrink-0`} />
          <div>
            <span className={`text-[11px] font-black uppercase tracking-widest ${textMap[sev.color]} font-mono`}>
              📊 {lang === 'VI' ? 'Phân tích & Khuyến nghị' : 'Analysis & Recommendations'}
            </span>
            <span className="text-[10px] text-slate-500 ml-2 font-medium">— {deptLabel}</span>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeMap[sev.color]}`}>
            {sev.icon} {lang === 'VI' ? sev.label.vi : sev.label.en}
          </span>
        </div>
        <button className={`p-1 rounded-lg ${textMap[sev.color]} hover:opacity-70 transition-opacity`}>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="px-5 pb-5 space-y-3 border-t border-current border-opacity-10">

          {/* TREND */}
          <div className="pt-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={`w-3.5 h-3.5 ${textMap[sev.color]} shrink-0`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${textMap[sev.color]} font-mono`}>
                {lang === 'VI' ? 'Nhận định xu hướng' : 'Trend Analysis'}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-slate-700 font-medium">
              {renderBold(lang === 'VI' ? data.trend.vi : data.trend.en)}
            </p>
          </div>

          {/* RISK */}
          <div className="bg-white/60 rounded-xl p-3.5 border border-current border-opacity-10">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-3.5 h-3.5 ${textMap[sev.color]} shrink-0`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${textMap[sev.color]} font-mono`}>
                {lang === 'VI' ? 'Rủi ro cần lưu ý' : 'Risk to Watch'}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-slate-700 font-medium">
              {renderBold(lang === 'VI' ? data.risk.vi : data.risk.en)}
            </p>
          </div>

          {/* NEXT STEP */}
          <div className="bg-white/80 rounded-xl p-3.5 border border-current border-opacity-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className={`w-3.5 h-3.5 ${textMap[sev.color]} shrink-0`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${textMap[sev.color]} font-mono`}>
                {lang === 'VI' ? '⚡ Bước tiếp theo' : '⚡ Next Step'}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-slate-700 font-medium">
              {renderBold(lang === 'VI' ? data.nextStep.vi : data.nextStep.en)}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}