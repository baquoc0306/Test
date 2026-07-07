import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Zap, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';

interface InsightPanelProps {
  featureKey: '9box' | 'pipeline' | 'devplan' | 'idp';
  lang: 'VI' | 'EN';
  selectedSite: 'MLN' | 'WNK' | 'ASH';
  selectedDept: string;
}

type InsightEntry = { vi: string };
type InsightRecord = { insight: InsightEntry; risk: InsightEntry; nextStep: InsightEntry };

function bold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: '#fbbf24', fontWeight: 800 }}>{p.slice(2, -2)}</strong>
      : p
  );
}

// ── DATA: Tiếng Việt thuần, tập trung từng site, dựa trên data thực ──────────
const DATA: Record<string, Record<string, InsightRecord>> = {

  // ══════════════════════════════════════════════════════════════════════════
  // 9-BOX
  // ══════════════════════════════════════════════════════════════════════════
  '9box': {
    'ASH_ALL': {
      insight: { vi: 'Dữ liệu 9-Box của Ashton ghi nhận **44 nhân sự** với cơ cấu **Growers 34% — Keepers 61% — Movers 5%**. Tỷ lệ Keepers chiếm đa số phản ánh đội ngũ đang vận hành ổn định nhưng thiếu lực kéo tăng trưởng từ bên trong. Toàn site chỉ có **1 Superstar duy nhất (Windy Sy, Tài chính)** và **8 Rising Stars** phân tán ở 5 bộ phận khác nhau — cho thấy tiềm năng phát triển đang bị phân mảnh, chưa được đầu tư có hệ thống.' },
      risk: { vi: 'Khi toàn site chỉ có 1 Superstar, mọi quyết định tài chính chiến lược đang phụ thuộc vào 1 cá nhân. Nếu Windy Sy rời đi hoặc thăng chức lên cấp cao hơn, **năng lực lãnh đạo tài chính của Ashton sẽ bị gián đoạn ngay lập tức** mà không có người thay thế sẵn sàng. Đồng thời, 8 Rising Stars không được đầu tư đúng mức sẽ dần chuyển sang Keepers — mất đi lực kéo phát triển dài hạn của site.' },
      nextStep: { vi: 'Ưu tiên xây dựng **chương trình phát triển tăng tốc cho 3 Rising Stars tiềm năng nhất** (Mi Nguyen/Dịch vụ khách hàng, Clara Chau/Kho vận, Maya Nguyen/Tài chính) thông qua giao việc thực chiến liên phòng ban trong quý 3. Đồng thời khởi động kế hoạch can thiệp cho Carlo Pham (Future Utility) và Amy Nguyen (Diamond in the Rough) trước ngày 31/7.' }
    },
    'ASH_CUSTOMER SERVICE': {
      insight: { vi: 'Bộ phận Dịch vụ Khách hàng có **9 nhân sự** với cơ cấu **Growers 11% — Keepers 78% — Movers 11%** — tỷ lệ Growers thấp, cần được cải thiện. Dữ liệu cho thấy đây là bộ phận vận hành ổn định nhưng **thiếu hoàn toàn nhân tài cấp cao** (không có Superstar hay High Professional). Chỉ có Mi Nguyen (Rising Star) là nhân tài tăng trưởng duy nhất. Amy Nguyen (Diamond in the Rough) có tiềm năng cao nhưng hiệu suất chưa đạt — đây là tín hiệu của việc thiếu định hướng hoặc không phù hợp vai trò.' },
      risk: { vi: 'Bộ phận tiếp xúc khách hàng trực tiếp nhưng không có nhân sự cấp Superstar hay High Professional để xử lý các tình huống phức tạp và ra quyết định nhanh. Nếu Mi Nguyen (Rising Star duy nhất) rời đi, **bộ phận sẽ không có ai đủ năng lực kế thừa vị trí Trưởng nhóm trong 1-2 năm tới** — ảnh hưởng trực tiếp đến chất lượng phục vụ khách hàng.' },
      nextStep: { vi: 'Gặp 1-1 với Amy Nguyen để chẩn đoán nguyên nhân gốc rễ của hiệu suất thấp (phù hợp vai trò? khối lượng công việc? thiếu hướng dẫn?). Giao cho Mi Nguyen **1 dự án liên phòng ban** để kiểm tra và phát triển tư duy lãnh đạo — đây là bước chuẩn bị kế thừa vị trí Trưởng nhóm.' }
    },
    'ASH_CUSTOMS': {
      insight: { vi: 'Bộ phận Hải quan có **8 nhân sự** với cơ cấu **Growers 38% — Keepers 62% — Movers 0%** — không có Movers, đây là tín hiệu tích cực về sức khỏe đội ngũ. Julie Phung (High Professional) là trụ cột kỹ thuật. Tiny Nguyen và Harry Nguyen (Rising Stars) đang phát triển tốt. Tuy nhiên, 3 Valued Contributors (Susan Dang, Lona Nguyen, Anna Nguyen) đang ở giai đoạn ổn định — cần thách thức mới để tránh "bình nguyên hóa" năng lực.' },
      risk: { vi: 'Julie Phung là Trưởng nhóm Hải quan **không có người kế thừa** trong hệ thống Pipeline. Hải quan là nghiệp vụ đặc thù cao — kiến thức về thông quan quốc tế, xử lý giấy tờ và quan hệ với cơ quan hải quan rất khó chuyển giao nhanh. Nếu Julie nghỉ đột xuất, **thời gian để người mới đạt năng lực tương đương có thể lên đến 12-18 tháng**.' },
      nextStep: { vi: 'Chỉ định Tiny Nguyen hoặc Harry Nguyen làm **ứng viên kế thừa chính thức** cho Julie Phung và bắt đầu chương trình kèm cặp thực chiến ngay trong quý 3. Mục tiêu: 1 người đạt mức "Sẵn sàng trong vòng 1 năm" trước quý 1/2027.' }
    },
    'ASH_FINANCE & ACCOUNTING': {
      insight: { vi: 'Bộ phận Tài chính & Kế toán có **5 nhân sự** với cơ cấu **Growers 60% — Keepers 40% — Movers 0%** — tỷ lệ Growers cao. Windy Sy (Superstar) và Ha Nguyen (High Professional) tạo thành cặp lãnh đạo mạnh của Ashton. Maya Nguyen (Rising Star) đang phát triển nhanh với **23 Cơ hội Ưu tiên** được ghi nhận trong hồ sơ phát triển cá nhân — đây là nhân tài cần được đầu tư ưu tiên cao nhất.' },
      risk: { vi: 'Mặc dù hệ thống kế thừa đạt 100% độ phủ, chuỗi kế thừa Windy Sy → Ha Nguyen → Maya Nguyen là **chuỗi tuyến tính** — nếu Ha Nguyen (mắt xích giữa) rời đi, Windy Sy mất người kế thừa trực tiếp trong khi Maya Nguyen chưa đủ sẵn sàng để nhảy 2 cấp. Đây là điểm yếu ẩn thường bị bỏ qua khi tỷ lệ phủ đã đạt 100%.' },
      nextStep: { vi: 'Ha Nguyen giao cho Maya Nguyen **2 dự án thực chiến trong quý 3**: (1) Tự lập mô hình tài chính cho 1 dự án mới, (2) Tham gia trực tiếp quy trình khai báo thuế. Đây là hình thức đào tạo tại chỗ hiệu quả hơn bất kỳ khóa học lý thuyết nào.' }
    },
    'ASH_HUMAN RESOURCES': {
      insight: { vi: 'Bộ phận Nhân sự có **7 nhân sự** với cơ cấu **Growers 29% — Keepers 57% — Movers 14%**. Carlo Pham (Future Utility) là Mover duy nhất — hiệu suất thấp và tiềm năng trung bình, cần can thiệp ngay. Lisa Nguyen và Ellie Tran (High Professionals) tạo thành cặp chuyên viên nhân sự mạnh với khả năng hỗ trợ lẫn nhau tốt. Tuy nhiên, **không có Superstar trong bộ phận** — năng lực dẫn dắt các sáng kiến nhân sự chiến lược đang thiếu hụt.' },
      risk: { vi: 'Bộ phận Nhân sự hỗ trợ toàn site nhưng không có ai ở cấp Superstar để dẫn dắt các chương trình nhân sự chiến lược. Carlo Pham nếu không cải thiện trong 90 ngày sẽ trở thành gánh nặng vận hành — **chi phí cơ hội cao** khi bộ phận Nhân sự cần tập trung vào việc mở rộng nhân sự cho Ashton.' },
      nextStep: { vi: 'Thiết lập kế hoạch cải thiện hiệu suất 90 ngày cho Carlo Pham với **3 chỉ tiêu cụ thể** và Lisa Nguyen làm người giám sát trực tiếp. Giao cho Lisa hoặc Ellie dẫn dắt **1 dự án nhân sự chiến lược** (ví dụ: xây dựng chương trình hội nhập nhân viên mới) để phát triển lên cấp Superstar trong 18 tháng.' }
    },
    'ASH_INFORMATION SYSTEM': {
      insight: { vi: 'Bộ phận Công nghệ Thông tin có **4 nhân sự** với cơ cấu **Growers 50% — Keepers 50% — Movers 0%** — cân bằng tốt. River Le và Harry Hoang (Rising Stars) đang phát triển tích cực. Tuy nhiên, **75% hồ sơ phát triển cá nhân của bộ phận có mức đánh giá "Chưa xác định"** — đây không phải thiếu năng lực mà là chưa hoàn thiện quy trình đánh giá, tạo ra điểm mù trong quản lý nhân tài.' },
      risk: { vi: 'Ba trong bốn vị trí của bộ phận Công nghệ Thông tin đang ở trạng thái "Có rủi ro" trong hệ thống kế thừa — Denis Vy, Ryder Nguyen và Harry Hoang đều không có người kế thừa. Harry Hoang là người duy nhất nắm giữ toàn bộ kiến thức phát triển phần mềm và tích hợp hệ thống. Nếu Harry nghỉ việc, **toàn bộ hệ thống phần mềm nội bộ của Ashton sẽ không có người bảo trì**.' },
      nextStep: { vi: 'Trưởng bộ phận Công nghệ Thông tin hoàn thiện **đánh giá năng lực** cho Denis Vy, River Le và Ryder Nguyen trong tháng 7/2026 — sử dụng Harry Hoang làm chuẩn tham chiếu. Đồng thời, Harry Hoang lập **tài liệu hệ thống toàn diện** và đào tạo River Le về các kỹ năng phát triển phần mềm cơ bản trong quý 3.' }
    },
    'ASH_LOGISTICS': {
      insight: { vi: 'Bộ phận Logistics có **6 nhân sự** với cơ cấu **Growers 17% — Keepers 83% — Movers 0%**. Đây là bộ phận có tỷ lệ Keepers cao — phản ánh đội ngũ giàu kinh nghiệm, vận hành ổn định. KYLIE (Rising Star) là nhân tài tăng trưởng duy nhất nhưng đang ở vị trí "Rủi ro cao" trong hệ thống kế thừa với mức sẵn sàng "1-2 năm". ALANA (Chuyên gia Kỳ cựu) đã đạt trần tiềm năng học hỏi — cần được khai thác theo hướng kèm cặp thay vì tiếp tục phát triển thêm.' },
      risk: { vi: 'KYLIE và ALICE đều là vị trí "Rủi ro cao" trong hệ thống kế thừa — 2 chuyên viên Logistics quan trọng nhất đang trong giai đoạn phát triển người kế thừa dài hạn. KYLIE phụ trách dự án FCA Transportation chiến lược với kiến thức chuyên biệt cao. Nếu KYLIE rời đi trước khi người kế thừa sẵn sàng, **toàn bộ kiến thức về quy trình FCA Transportation sẽ bị mất** và dự án chiến lược bị gián đoạn.' },
      nextStep: { vi: 'Giao cho KYLIE thêm trách nhiệm quản lý FCA Transportation độc lập trong quý 3 để rút ngắn mức sẵn sàng của người kế thừa từ "1-2 năm" xuống "dưới 1 năm". Chỉ định ALANA làm **người kèm cặp chính thức** cho KYLIE và ALICE — tận dụng kinh nghiệm thực chiến của chuyên gia kỳ cựu.' }
    },
    'ASH_WAREHOUSE': {
      insight: { vi: 'Nhóm quản lý Kho vận có **5 nhân sự** với cơ cấu **Growers 60% — Keepers 40% — Movers 0%** — tỷ lệ Growers cao trong nhóm quản lý. Thinh Mai và Violet Nguyen (High Professionals) tạo thành cặp lãnh đạo mạnh. Clara Chau (Rising Star) có tiềm năng cao nhất. Tuy nhiên, đây chỉ là 5 nhà quản lý cấp cao — **34 vị trí vận hành trong hệ thống kế thừa đang có tỷ lệ phủ chỉ 9%**, tạo ra nghịch lý: nhóm quản lý tốt nhưng hệ thống kế thừa cần được cải thiện khẩn cấp.' },
      risk: { vi: 'Ba vị trí "Khủng hoảng" tại Kho vận (Võ Anh Cảnh/Quản lý Kho, Francisco Gonzalez/Giám đốc Kho, Kim Trần/Quản lý Kho) không có người kế thừa và không có người tạm quyền. Đây là **rủi ro liên tục kinh doanh cấp độ site** — nếu bất kỳ 1 trong 3 người này nghỉ đột xuất, toàn bộ hoạt động Kho vận Ashton có thể bị tê liệt.' },
      nextStep: { vi: 'Thinh Mai và Violet Nguyen lập ngay **Ma trận Đào tạo Chéo** cho 23 vị trí không có người kế thừa — ưu tiên chuỗi Bốc xếp (3 Giám sát) và Trưởng nhóm UPH (3 người) trước. Mục tiêu quý 3: mỗi vị trí có ít nhất 1 người được đào tạo làm dự phòng.' }
    },
    'WNK_ALL': {
      insight: { vi: 'Dữ liệu 9-Box của Wanek ghi nhận **55 nhân sự** đang trong giai đoạn mở rộng nhà máy. Cơ cấu nhân tài đang được xây dựng song song với việc tăng quy mô sản xuất — đây là thách thức kép đặc thù của giai đoạn ramp-up. Điểm nóng cần chú ý: **Bộ phận Hỗ trợ UPH WNK3** có tỷ lệ năng lực thấp cao nhất (6/16 nhiệm vụ = 37,5%) — đây là khu vực cần can thiệp ưu tiên trước khi bước vào giai đoạn tăng tốc sản xuất quý 4.' },
      risk: { vi: 'Wanek đang mở rộng quy mô trong khi đồng thời phải phát triển nhân tài — đây là thách thức kép. Nếu chương trình Kèm cặp không được triển khai trong quý 3, **hệ thống Đào tạo Viên Nội bộ sẽ không có người thực hiện** và bộ phận Đào tạo & Phát triển sẽ phải đào tạo trực tiếp 100% nhân sự — không thể mở rộng quy mô khi nhà máy tiếp tục phát triển.' },
      nextStep: { vi: 'Xác định **10 Đào tạo Viên Nội bộ tiềm năng** từ nhóm Growers (ưu tiên bộ phận Đào tạo) → Triển khai chương trình Kèm cặp thí điểm trong quý 3 → Đào tạo Viên Nội bộ bắt đầu đào tạo lại nhóm của mình từ quý 4.' }
    },
    'MLN_ALL': {
      insight: { vi: 'Dữ liệu 9-Box của Millennium phản ánh tổ chức đang ở giai đoạn **củng cố năng lực** — đủ Growers để tạo động lực, đủ Keepers để ổn định vận hành. Hệ thống đánh giá nhân tài đã được vận hành ổn định. Thách thức chính: duy trì đà phát triển và tránh "bình nguyên hóa" ở nhóm Keepers lâu năm.' },
      risk: { vi: 'Nhóm Movers không được can thiệp kịp thời sẽ tự nghỉ việc hoặc phải cho thôi việc — **chi phí thay thế 1 nhân sự vận hành có kinh nghiệm tương đương 3-6 tháng lương cộng 2-3 tháng hội nhập**. Với quy mô Millennium, mỗi năm mất 5-10 Movers là khoản chi phí nhân sự đáng kể và ảnh hưởng đến năng suất vận hành.' },
      nextStep: { vi: 'Trưởng bộ phận xác nhận danh sách Movers → Phân loại: ai có thể phát triển (kế hoạch cải thiện hiệu suất) so với ai cần chuyển vị trí → Bộ phận Đào tạo & Phát triển thiết kế chương trình can thiệp phù hợp cho từng nhóm trong quý 3.' }
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PIPELINE
  // ══════════════════════════════════════════════════════════════════════════
  'pipeline': {
    'ASH_ALL': {
      insight: { vi: 'Hệ thống kế thừa của Ashton ghi nhận **60 vị trí then chốt** với **tỷ lệ phủ tổng thể chỉ 30%** (18 Đã phủ / 13 Đang phát triển / 26 Có rủi ro / 3 Khủng hoảng). Đây là mức cần được cải thiện khẩn cấp. Phân tích theo bộ phận: Tài chính & Kế toán và Nhân sự đạt 100% phủ (điểm sáng), trong khi Kho vận chỉ đạt 9% (điểm tối nhất). Ba vị trí "Khủng hoảng" tại Kho vận là rủi ro vận hành cấp độ site cần xử lý ngay.' },
      risk: { vi: 'Ba vị trí Khủng hoảng tại Kho vận (Quản lý Kho x2, Giám đốc Kho) không có người kế thừa và không có người tạm quyền. Nếu bất kỳ 1 trong 3 người này nghỉ đột xuất, **toàn bộ hoạt động Kho vận Ashton sẽ tê liệt** — ảnh hưởng trực tiếp đến chuỗi xuất hàng và có thể vi phạm cam kết dịch vụ với khách hàng.' },
      nextStep: { vi: 'Ngay trong tuần này: Bộ phận Nhân sự Ashton lập danh sách ưu tiên 3 vị trí Khủng hoảng → Đề xuất ứng viên tạm quyền → Trình Giám đốc Nhân sự phê duyệt kế hoạch khẩn cấp. Đây là vấn đề vượt quá phạm vi của bộ phận Đào tạo & Phát triển và cần quyết định cấp cao hơn.' }
    },
    'ASH_WAREHOUSE': {
      insight: { vi: 'Hệ thống kế thừa Kho vận ghi nhận **34 vị trí then chốt** với **tỷ lệ phủ chỉ 9%** (3 Đã phủ / 8 Đang phát triển / 20 Có rủi ro / 3 Khủng hoảng). Cấu trúc rủi ro theo tầng: Tầng 1 (Khủng hoảng) — Giám đốc Kho và 2 Quản lý Kho không có người kế thừa. Tầng 2 (Có rủi ro) — 3 Giám sát Bốc xếp, 3 Trưởng nhóm UPH, 3 Trưởng nhóm Lấy hàng — toàn bộ cấp Giám sát và Trưởng nhóm đang trống người kế thừa.' },
      risk: { vi: 'Kho vận Ashton đang vận hành với **"điểm thất bại đơn lẻ" ở mọi cấp độ quản lý**. Trong ngành Logistics và Kho vận, tỷ lệ nghỉ việc trung bình 15-25%/năm — với 34 vị trí và 0 người dự phòng, xác suất gián đoạn vận hành trong 12 tháng tới là rất cao và có thể xảy ra bất kỳ lúc nào.' },
      nextStep: { vi: 'Thinh Mai và Ngoc Dinh lập **Ma trận Đào tạo Chéo khẩn cấp** cho chuỗi Bốc xếp và Lấy hàng trước (ưu tiên vì khối lượng cao nhất). Mỗi Giám sát cần đào tạo ít nhất 1 Trưởng nhóm làm người dự phòng trong vòng 60 ngày — không cần chương trình đào tạo chính thức, đào tạo tại chỗ là đủ.' }
    },
    'ASH_LOGISTICS': {
      insight: { vi: 'Hệ thống kế thừa Logistics ghi nhận **6 vị trí then chốt** với **tỷ lệ phủ 50%** (3 Đã phủ / 3 Đang phát triển). ALANA, STEPHEN và TANA đã có người kế thừa — nền tảng tốt. Hai vị trí Rủi ro cao (KYLIE — 1-2 năm, ALICE — dưới 1 năm) đang trong giai đoạn phát triển người kế thừa dài hạn. KYLIE phụ trách dự án FCA Transportation chiến lược với kiến thức chuyên biệt cao.' },
      risk: { vi: 'KYLIE là vị trí Rủi ro cao với người kế thừa cần "1-2 năm" để sẵn sàng — khoảng cách quá dài cho một vị trí chiến lược. Nếu KYLIE rời đi trước khi người kế thừa (Alice Le) sẵn sàng, **toàn bộ kiến thức về quy trình FCA Transportation sẽ bị mất** và dự án chiến lược bị gián đoạn nghiêm trọng.' },
      nextStep: { vi: 'Rút ngắn mức sẵn sàng của người kế thừa KYLIE (Alice Le): Giao thêm trách nhiệm quản lý FCA Transportation độc lập trong quý 3 → Mục tiêu chuyển từ "1-2 năm" xuống "dưới 1 năm" trước quý 1/2027. KYLIE lập tài liệu quy trình FCA trong tháng 7.' }
    },
    'ASH_INFORMATION SYSTEM': {
      insight: { vi: 'Hệ thống kế thừa Công nghệ Thông tin ghi nhận **4 vị trí then chốt** với **tỷ lệ phủ chỉ 25%** (1 Đã phủ / 3 Có rủi ro). Chỉ River Le có người kế thừa (Jindo Nguyen). Denis Vy và Ryder Nguyen đang ở trạng thái "Chỉ có người tạm quyền" — có người tạm thời nhưng không có người kế thừa thực sự. Harry Hoang (Chuyên viên Phát triển Phần mềm) hoàn toàn không có người dự phòng — rủi ro kỹ thuật nghiêm trọng.' },
      risk: { vi: 'Harry Hoang là người duy nhất nắm giữ toàn bộ kiến thức phát triển phần mềm và tích hợp hệ thống tại Ashton. Nếu Harry nghỉ việc, **toàn bộ hệ thống phần mềm nội bộ sẽ không có người bảo trì** — bao gồm báo cáo phân tích dữ liệu, quản lý cơ sở dữ liệu và các kết nối hệ thống. Chi phí thuê ngoài hoặc tuyển dụng mới sẽ rất cao.' },
      nextStep: { vi: 'Ưu tiên Harry Hoang: Lập kế hoạch Chuyển giao Kiến thức — Harry lập tài liệu toàn bộ hệ thống và đào tạo River Le về các kỹ năng phát triển phần mềm cơ bản trong quý 3. Đây là biện pháp giảm thiểu rủi ro tối thiểu cần thực hiện ngay.' }
    },
    'ASH_FINANCE & ACCOUNTING': {
      insight: { vi: 'Hệ thống kế thừa Tài chính & Kế toán ghi nhận **5 vị trí then chốt** với **tỷ lệ phủ 100%** — bộ phận đạt độ phủ hoàn hảo. Chuỗi kế thừa rõ ràng: Windy Sy → Ha Nguyen → Maya Nguyen. Đây là mô hình tốt nhất Ashton và có thể làm chuẩn tham chiếu cho các bộ phận khác.' },
      risk: { vi: 'Chuỗi kế thừa tuyến tính có điểm yếu ẩn: nếu Ha Nguyen (mắt xích giữa) rời đi, Windy Sy mất người kế thừa trực tiếp trong khi Maya Nguyen chưa đủ sẵn sàng để nhảy 2 cấp. **Rủi ro "đứt gãy chuỗi kế thừa"** này thường bị bỏ qua khi tỷ lệ phủ đã đạt 100%.' },
      nextStep: { vi: 'Xây dựng **người dự phòng theo chiều ngang**: Cheryl Nguyen và Helen Ngo cần được đào tạo thêm để có thể hỗ trợ Ha Nguyen trong các tình huống khẩn cấp. Đây là bước nâng cấp từ "100% phủ" lên "100% bền vững".' }
    },
    'ASH_CUSTOMER SERVICE': {
      insight: { vi: 'Hệ thống kế thừa Dịch vụ Khách hàng ghi nhận **5 vị trí then chốt** với **tỷ lệ phủ 20%** (1 Đã phủ / 2 Đang phát triển / 2 Có rủi ro). Helen Nguyen (Trưởng nhóm) và Kelly Phan không có người kế thừa. Mi Nguyen và Chloe Truong đang trong giai đoạn phát triển người kế thừa (dưới 1 năm) — tiến độ tốt.' },
      risk: { vi: 'Helen Nguyen (Trưởng nhóm Dịch vụ Khách hàng) không có người kế thừa — nếu Helen nghỉ, **không ai có thể quản lý toàn bộ nhóm ngay lập tức**. Đây là bộ phận tiếp xúc khách hàng trực tiếp — gián đoạn quản lý sẽ ảnh hưởng ngay đến chất lượng dịch vụ và cam kết với khách hàng.' },
      nextStep: { vi: 'Chỉ định Mi Nguyen làm **Phó Trưởng nhóm Quyền hạn** cho Helen Nguyen — tham gia tất cả cuộc họp quản lý, học cách ra quyết định và xử lý các vấn đề leo thang. Mục tiêu: Mi Nguyen đạt mức "Sẵn sàng ngay" trong 6 tháng.' }
    },
    'ASH_CUSTOMS': {
      insight: { vi: 'Hệ thống kế thừa Hải quan ghi nhận **4 vị trí then chốt** với **tỷ lệ phủ 75%** (3 Đã phủ / 1 Có rủi ro) — đạt mức tốt trong nhóm bộ phận vận hành. Tiny, Lona và Harry đã có người kế thừa rõ ràng. Julie Phung (Trưởng nhóm Hải quan) là điểm yếu duy nhất — không có người kế thừa cho vị trí quan trọng nhất bộ phận.' },
      risk: { vi: 'Julie Phung nắm giữ toàn bộ kiến thức nghiệp vụ Hải quan phức tạp (thông quan quốc tế, xử lý chứng từ, giải quyết vấn đề với cơ quan hải quan). Nếu Julie nghỉ đột xuất, **thời gian để người mới đạt năng lực tương đương có thể lên đến 12-18 tháng** — ảnh hưởng trực tiếp đến hoạt động xuất nhập khẩu của Ashton.' },
      nextStep: { vi: 'Ngay trong quý 3: Julie Phung lập **Tài liệu Quy trình Hải quan** chi tiết. Đồng thời chỉ định Tiny Nguyen làm ứng viên kế thừa chính thức và bắt đầu chương trình kèm cặp cho các trường hợp phức tạp.' }
    },
    'ASH_HUMAN RESOURCES': {
      insight: { vi: 'Hệ thống kế thừa Nhân sự ghi nhận **2 vị trí then chốt** với **tỷ lệ phủ 100%** (Lisa Nguyen và Ellie Tran hỗ trợ lẫn nhau). Cấu trúc kế thừa lý tưởng cho nhóm 2 người. Tuy nhiên, với chỉ 2 nhân sự cho toàn site, **nếu cả 2 đều vắng mặt cùng lúc**, bộ phận Nhân sự sẽ không có ai vận hành.' },
      risk: { vi: 'Bộ phận Nhân sự Ashton chỉ có 2 người cho toàn site — đây là **đội ngũ tối thiểu** không có vùng đệm. Khi Ashton mở rộng quy mô, khối lượng công việc Nhân sự sẽ tăng nhưng nhân sự không tăng kịp — dẫn đến kiệt sức và tăng nguy cơ nghỉ việc của cả 2.' },
      nextStep: { vi: 'Đề xuất với Giám đốc Nhân sự: **Lập kế hoạch tuyển thêm 1 Chuyên viên Nhân sự** khi Ashton đạt 200+ nhân sự. Trong thời gian chờ, trang bị thêm công cụ tự động hóa nhân sự (Power Automate, công cụ trí tuệ nhân tạo) để tăng năng suất.' }
    },
    'WNK_ALL': {
      insight: { vi: 'Hệ thống kế thừa của Wanek đang được xây dựng song song với việc mở rộng nhà máy. Ưu tiên cao nhất: các vị trí Giám sát tại khu vực Lắp ráp UPH và May Cắt WNK3 cần có người kế thừa "Sẵn sàng ngay" trước giai đoạn tăng tốc sản xuất quý 4/2026.' },
      risk: { vi: 'Mỗi lần Giám sát vắng mặt mà không có người dự phòng → dây chuyền sản xuất dừng hoặc chạy dưới công suất → ảnh hưởng trực tiếp đến chỉ tiêu sản xuất và kế hoạch giao hàng.' },
      nextStep: { vi: 'Bộ phận Nhân sự Wanek xác định ứng viên kế thừa cho tất cả vị trí Giám sát tại khu vực Lắp ráp UPH và May Cắt WNK3 → Bắt đầu chương trình kèm cặp thực chiến trong quý 3.' }
    },
    'MLN_ALL': {
      insight: { vi: 'Hệ thống kế thừa của Millennium đang vận hành ổn định. Tập trung vào việc nâng cấp các vị trí "Chỉ có người tạm quyền" và đảm bảo các ứng viên kế thừa đang được phát triển đúng tiến độ.' },
      risk: { vi: 'Các vị trí "Chỉ có người tạm quyền" kéo dài → người tạm quyền kiệt sức → chất lượng quyết định suy giảm và nguy cơ mất cả người tạm quyền.' },
      nextStep: { vi: 'Bộ phận Nhân sự Millennium rà soát tất cả vị trí "Chỉ có người tạm quyền" → Đề xuất ứng viên kế thừa cụ thể → Lập kế hoạch phát triển 6 tháng.' }
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DEVPLAN
  // ══════════════════════════════════════════════════════════════════════════
  'devplan': {
    'ASH_ALL': {
      insight: { vi: 'Kế hoạch đào tạo của Ashton ghi nhận **9 chương trình** với tổng **226 nhu cầu phát triển**. Dữ liệu cho thấy **Kỹ năng Kèm cặp (57 nhu cầu, 81,8% năng lực thấp)** là khoảng cách đáng chú ý nhất — phản ánh thực tế các Trưởng bộ phận chưa được trang bị đủ kỹ năng phát triển cấp dưới. **Kỹ năng Giao tiếp (12 nhu cầu, 100% bộ phận có nhu cầu)** — toàn bộ 7 bộ phận đều cần, đây là năng lực nền tảng cần triển khai trước.' },
      risk: { vi: 'Kỹ năng Kèm cặp 81,8% năng lực thấp kết hợp với việc Trưởng bộ phận không biết cách phát triển cấp dưới tạo ra **vòng lặp thiếu hụt năng lực tự duy trì**. Nếu không phá vỡ vòng lặp này trong năm 2026, Ashton sẽ tiếp tục phụ thuộc vào bộ phận Đào tạo & Phát triển để đào tạo mọi thứ — không thể mở rộng quy mô.' },
      nextStep: { vi: 'Phá vỡ vòng lặp theo thứ tự: Triển khai Hội thảo Giao tiếp trước (quý 3, dễ nhất, 100% phủ) → Sau đó Chương trình Kèm cặp cho Trưởng bộ phận (quý 3-4) → Trưởng bộ phận tự đào tạo nhóm của mình từ quý 1/2027.' }
    },
    'ASH_INFORMATION SYSTEM': {
      insight: { vi: 'Hồ sơ đào tạo của bộ phận Công nghệ Thông tin ghi nhận **40 nhiệm vụ** với 75% chưa có đánh giá năng lực và **12 hành động Đưa vào Kế hoạch Đào tạo**. Nhu cầu tập trung vào **Kỹ thuật Số (Trí tuệ Nhân tạo & Tự động hóa)** và **Phát triển Con người (Kèm cặp)**. Harry Hoang (đánh giá R3-R4 đầy đủ) là chuẩn tham chiếu năng lực Công nghệ Thông tin của Ashton.' },
      risk: { vi: 'Nếu bộ phận Công nghệ Thông tin không được đào tạo về công cụ Trí tuệ Nhân tạo và Tự động hóa, họ sẽ không thể hỗ trợ các bộ phận khác triển khai Power Automate và báo cáo phân tích dữ liệu — **làm chậm toàn bộ chương trình chuyển đổi số của Ashton**.' },
      nextStep: { vi: 'Harry Hoang đảm nhận vai trò **Đại sứ Công nghệ Số** — đào tạo lại cho Denis Vy, River Le và Ryder Nguyen về các công cụ Trí tuệ Nhân tạo và Tự động hóa. Đây là cách tiếp cận hiệu quả nhất với nguồn lực bộ phận Đào tạo & Phát triển hạn chế.' }
    },
    'ASH_FINANCE & ACCOUNTING': {
      insight: { vi: 'Hồ sơ đào tạo của bộ phận Tài chính & Kế toán ghi nhận **43 nhiệm vụ** với 21% năng lực thấp (9 nhiệm vụ đánh giá R2) và **23 Cơ hội Ưu tiên** — tỷ lệ 53% Cơ hội Ưu tiên trên tổng nhiệm vụ. 9 nhiệm vụ R2 tập trung ở Cheryl Nguyen (Mô hình Tài chính, Phân tích Hiệu quả Kinh doanh) và Maya Nguyen (Tư duy Lãnh đạo) — đây là 3 kỹ năng cần thiết để chuỗi kế thừa Tài chính hoạt động trơn tru.' },
      risk: { vi: 'Cheryl Nguyen có năng lực thấp trong Mô hình Tài chính và Phân tích Hiệu quả Kinh doanh — 2 kỹ năng cốt lõi của Kế toán Tổng hợp. Nếu không được đào tạo trong quý 3, Cheryl sẽ tiếp tục phụ thuộc vào Ha Nguyen và Windy Sy cho các nhiệm vụ phức tạp — **tạo ra điểm nghẽn trong nhóm Tài chính**.' },
      nextStep: { vi: 'Ha Nguyen giao cho Maya Nguyen **2 dự án thực chiến cụ thể trong quý 3**: (1) Tự lập Mô hình Tài chính cho 1 dự án mới, (2) Tham gia quy trình Khai báo Thuế cùng Ha Nguyen. Cheryl Nguyen tham gia chương trình Theo dõi Tài chính & Quản lý Chi phí.' }
    },
    'ASH_HUMAN RESOURCES': {
      insight: { vi: 'Hồ sơ đào tạo của bộ phận Nhân sự ghi nhận **31 nhiệm vụ** với 6% năng lực thấp và **10 Cơ hội Ưu tiên**. Nhu cầu tập trung vào **Phát triển Con người (Kèm cặp)** và **Tư duy Kinh doanh** — phù hợp với định hướng phát triển vai trò Đối tác Kinh doanh Nhân sự. Lisa và Ellie đều cần kỹ năng Kèm cặp để hỗ trợ Trưởng bộ phận các phòng ban tốt hơn.' },
      risk: { vi: 'Bộ phận Nhân sự không có kỹ năng Kèm cặp → không thể hỗ trợ Trưởng bộ phận xây dựng kế hoạch phát triển cá nhân và phát triển nhân viên → **bộ phận Đào tạo & Phát triển phải làm thay toàn bộ** → quá tải cho 1 người phụ trách Đào tạo & Phát triển.' },
      nextStep: { vi: 'Lisa và Ellie tham gia **Chương trình Kèm cặp** cùng với Trưởng bộ phận (quý 3) → Sau đó bộ phận Nhân sự có thể hỗ trợ Trưởng bộ phận trong việc rà soát kế hoạch phát triển cá nhân và phát triển nhân tài — giảm tải cho bộ phận Đào tạo & Phát triển.' }
    },
    'WNK_ALL': {
      insight: { vi: 'Kế hoạch đào tạo của Wanek ghi nhận **10 chương trình** với **803 hồ sơ phát triển cá nhân**. Dữ liệu cho thấy **Kỹ năng Kèm cặp (122 nhu cầu)** là nhu cầu đứng đầu trong kế hoạch — phản ánh nhu cầu xây dựng năng lực đào tạo nội bộ để mở rộng quy mô. Điều này phản ánh Wanek đang trong giai đoạn xây dựng năng lực đào tạo nội bộ để mở rộng quy mô. Kỹ thuật Số (34 nhu cầu) tập trung ở 5 bộ phận — Công nghệ Thông tin, Đào tạo, Nhân sự, Kế hoạch và Kiểm soát Chất lượng.' },
      risk: { vi: 'Kỹ năng Kèm cặp là nền tảng để hệ thống Đào tạo Viên Nội bộ hoạt động. Nếu không triển khai trong quý 3, **toàn bộ kế hoạch đào tạo nội bộ của Wanek sẽ bị trì hoãn** — bộ phận Đào tạo & Phát triển không thể đào tạo trực tiếp 55 người với 803 nhiệm vụ.' },
      nextStep: { vi: 'Xác định **10 Đào tạo Viên Nội bộ** từ bộ phận Đào tạo (Ashton Vo, Quach Le Du, Phan Thi Ha) → Chương trình Kèm cặp thí điểm 4 tuần → Đào tạo Viên bắt đầu đào tạo lại nhóm của mình.' }
    },
    'MLN_ALL': {
      insight: { vi: 'Kế hoạch đào tạo của Millennium ghi nhận **14 chương trình** với Trí tuệ Nhân tạo & Tự động hóa (Ưu tiên 1) và Kỹ năng Lãnh đạo (Ưu tiên 2) là 2 ưu tiên hàng đầu — phản ánh định hướng nâng cao năng suất và năng lực lãnh đạo trong môi trường sản xuất.' },
      risk: { vi: 'Không triển khai Trí tuệ Nhân tạo & Tự động hóa → nhân sự tiếp tục làm báo cáo thủ công → lãng phí 2-4 giờ/người/tuần = hàng trăm giờ/năm toàn site.' },
      nextStep: { vi: 'Trưởng bộ phận xác nhận danh sách tham gia → Cam kết tỷ lệ tham gia tối thiểu 80% → Triển khai Trí tuệ Nhân tạo & Tự động hóa và Kỹ năng Lãnh đạo trong quý 3.' }
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // IDP
  // ══════════════════════════════════════════════════════════════════════════
  'idp': {
    'ASH_ALL': {
      insight: { vi: 'Hệ thống kế hoạch phát triển cá nhân của Ashton ghi nhận **199 hồ sơ từ 16 nhân sự quản lý**. Dữ liệu cho thấy bộ phận Tài chính & Kế toán có tỷ lệ năng lực thấp đáng chú ý (21%) với 9 nhiệm vụ đánh giá R2. Bộ phận Công nghệ Thông tin có 75% hồ sơ chưa được đánh giá — khoảng trống đánh giá cần được ưu tiên giải quyết. Tổng cộng **64 Cơ hội Ưu tiên** được đánh dấu — đây là 64 điểm can thiệp có tác động trực tiếp cần được theo dõi.' },
      risk: { vi: '64 Cơ hội Ưu tiên không được theo dõi → khoảng cách năng lực tích lũy → Trưởng bộ phận tiếp tục phải làm thay nhân viên trong các nhiệm vụ phức tạp → **kiệt sức quản lý và giảm năng suất toàn bộ phận**.' },
      nextStep: { vi: 'Mỗi Trưởng bộ phận chọn **3 Cơ hội Ưu tiên quan trọng nhất** của từng nhân viên → Chỉ định người chịu trách nhiệm và thời hạn cụ thể → Rà soát trong cuộc họp 1-1 hàng tuần. Không cần xử lý tất cả 64 cùng lúc.' }
    },
    'ASH_FINANCE & ACCOUNTING': {
      insight: { vi: 'Hồ sơ phát triển cá nhân của bộ phận Tài chính & Kế toán ghi nhận **43 nhiệm vụ** với 21% năng lực thấp và **23 Cơ hội Ưu tiên** — tỷ lệ 53% Cơ hội Ưu tiên trên tổng nhiệm vụ. Cheryl Nguyen có năng lực thấp trong Mô hình Tài chính và Phân tích Hiệu quả Kinh doanh. Maya Nguyen có năng lực thấp trong Tư duy Lãnh đạo — kỹ năng cần thiết để tiến lên cấp Chuyên gia Cao cấp.' },
      risk: { vi: 'Maya Nguyen là Rising Star với tiềm năng phát triển rõ ràng trong bộ phận Tài chính — nếu các khoảng cách năng lực không được giải quyết trong 6 tháng, Maya có thể cảm thấy thiếu lộ trình phát triển rõ ràng và **tăng nguy cơ nghỉ việc** — Rising Stars thường rời đi khi không thấy cơ hội phát triển.' },
      nextStep: { vi: 'Ha Nguyen giao cho Maya **2 dự án thực chiến cụ thể trong quý 3**: (1) Tự lập Mô hình Tài chính cho 1 dự án mới, (2) Tham gia quy trình Khai báo Thuế cùng Ha Nguyen. Đào tạo tại chỗ trực tiếp — hiệu quả hơn đào tạo lý thuyết.' }
    },
    'ASH_INFORMATION SYSTEM': {
      insight: { vi: 'Hồ sơ phát triển cá nhân của bộ phận Công nghệ Thông tin ghi nhận **40 nhiệm vụ** với 75% chưa được đánh giá và **23 Cơ hội Ưu tiên**. Harry Hoang là người duy nhất có đánh giá R3-R4 đầy đủ — chuẩn tham chiếu năng lực Công nghệ Thông tin của Ashton. Denis Vy, River Le và Ryder Nguyen đều chưa được đánh giá — cần hoàn thiện để xác định chính xác khoảng cách năng lực và thiết kế kế hoạch phát triển phù hợp.' },
      risk: { vi: 'Không có đánh giá năng lực → không có kế hoạch phát triển cá nhân cụ thể → không có lộ trình thăng tiến → **nhóm Công nghệ Thông tin không thấy cơ hội phát triển** → tăng nguy cơ nghỉ việc. Chuyên viên Công nghệ Thông tin thường rời đi khi không có cơ hội học hỏi và phát triển kỹ thuật.' },
      nextStep: { vi: 'Trưởng bộ phận Công nghệ Thông tin thực hiện **đánh giá năng lực** cho Denis Vy, River Le và Ryder Nguyen trong tháng 7/2026 — sử dụng Harry Hoang làm chuẩn tham chiếu. Sau đó bộ phận Đào tạo & Phát triển thiết kế kế hoạch phát triển cá nhân cụ thể dựa trên kết quả.' }
    },
    'ASH_HUMAN RESOURCES': {
      insight: { vi: 'Hồ sơ phát triển cá nhân của bộ phận Nhân sự ghi nhận **31 nhiệm vụ** với 6% năng lực thấp và **10 Cơ hội Ưu tiên**. Lisa và Ellie đều có hồ sơ tốt — đánh giá R3-R4 trong hầu hết nhiệm vụ. Cơ hội Ưu tiên tập trung vào Phát triển Con người và Tư duy Kinh doanh — phù hợp với định hướng phát triển Đối tác Kinh doanh Nhân sự.' },
      risk: { vi: 'Lisa và Ellie đang ở mức R3-R4 trong hầu hết nhiệm vụ — nếu không có thách thức mới, họ có nguy cơ "bình nguyên hóa" và mất động lực. Chuyên viên Nhân sự thường tìm kiếm cơ hội phát triển chiến lược — nếu Ashton không cung cấp, họ sẽ tìm ở nơi khác.' },
      nextStep: { vi: 'Giao cho Lisa hoặc Ellie dẫn dắt **1 dự án nhân sự chiến lược** trong quý 3 (ví dụ: xây dựng Chương trình Hội nhập Nhân viên Mới, hoặc thiết kế Khung Năng lực cho Ashton). Đây là nhiệm vụ thực chiến phù hợp với cấp độ của họ.' }
    },
    'ASH_LOGISTICS': {
      insight: { vi: 'Hồ sơ phát triển cá nhân của bộ phận Logistics ghi nhận **17 nhiệm vụ (Henry Le)** với 6% năng lực thấp và **4 Cơ hội Ưu tiên**. Nhu cầu tập trung vào Phát triển Con người và Tư duy Kinh doanh — phản ánh Henry Le đang phát triển từ tư duy Chuyên viên sang tư duy Quản lý. Tuy nhiên, **5 nhân sự Logistics còn lại (ALANA, ALICE, STEPHEN, TANA, CRYSTAL) chưa có kế hoạch phát triển cá nhân** — khoảng trống phát triển lớn.' },
      risk: { vi: 'KYLIE và ALICE là 2 vị trí Rủi ro cao trong hệ thống kế thừa nhưng chưa có kế hoạch phát triển cá nhân cụ thể. Không có kế hoạch phát triển cá nhân → không có lộ trình rõ ràng → **tăng nguy cơ nghỉ việc của 2 nhân tài quan trọng nhất bộ phận**.' },
      nextStep: { vi: 'Henry Le phối hợp với bộ phận Nhân sự để **xây dựng kế hoạch phát triển cá nhân cho KYLIE và ALICE trước** trong quý 3 — tập trung vào Kỹ năng Lãnh đạo và Quản lý Vận hành để chuẩn bị họ làm người kế thừa.' }
    },
    'ASH_WAREHOUSE': {
      insight: { vi: 'Hồ sơ phát triển cá nhân của bộ phận Kho vận ghi nhận **34 nhiệm vụ (Shen Jim và Kim Tran)** với 6% năng lực thấp và **8 Cơ hội Ưu tiên**. Nhu cầu tập trung vào Phát triển Con người và Tư duy Kinh doanh. Tuy nhiên, **Thinh Mai, Violet Nguyen và Clara Chau (3 Growers quan trọng nhất) chưa có kế hoạch phát triển cá nhân** — đây là 3 nhân tài cần được đầu tư để giải quyết khủng hoảng kế thừa của Kho vận.' },
      risk: { vi: 'Thinh Mai, Violet Nguyen và Clara Chau là 3 Growers duy nhất có thể trở thành người kế thừa cho các vị trí Giám sát và Trưởng nhóm. Không có kế hoạch phát triển cá nhân → không có lộ trình phát triển rõ ràng → **3 nhân tài này có thể không phát triển đủ nhanh** để lấp đầy 23 vị trí không có người kế thừa.' },
      nextStep: { vi: 'Shen Jim phối hợp với bộ phận Nhân sự để **xây dựng kế hoạch phát triển cá nhân cho Thinh Mai, Violet Nguyen và Clara Chau** trong quý 3 — tập trung vào Kỹ năng Lãnh đạo và Quản lý Vận hành để chuẩn bị họ làm người kế thừa cho các vị trí Giám sát.' }
    },
    'ASH_CUSTOMER SERVICE': {
      insight: { vi: 'Hồ sơ phát triển cá nhân của bộ phận Dịch vụ Khách hàng ghi nhận **17 nhiệm vụ (Trudy Dinh)** với 6% năng lực thấp và **4 Cơ hội Ưu tiên**. Nhu cầu tập trung vào Phát triển Con người và Tư duy Kinh doanh. **8 nhân sự còn lại của bộ phận chưa có kế hoạch phát triển cá nhân** — đặc biệt Amy Nguyen và Mi Nguyen là 2 người cần được đầu tư nhất.' },
      risk: { vi: 'Amy Nguyen (Diamond in the Rough) và Mi Nguyen (Rising Star) — 2 nhân sự cần được đầu tư nhất trong bộ phận — đều chưa có kế hoạch phát triển cá nhân. Không có kế hoạch phát triển cá nhân → không có lộ trình rõ ràng → Amy có thể tiếp tục hiệu suất thấp và Mi có thể không được phát triển đúng mức.' },
      nextStep: { vi: 'Trudy Dinh phối hợp với bộ phận Nhân sự để **xây dựng kế hoạch phát triển cá nhân cho Amy Nguyen và Mi Nguyen trước** trong quý 3 — Amy cần kế hoạch cải thiện hiệu suất với chỉ tiêu cụ thể, Mi cần kế hoạch thực chiến với trọng tâm lãnh đạo.' }
    },
    'ASH_CUSTOMS': {
      insight: { vi: 'Hồ sơ phát triển cá nhân của bộ phận Hải quan ghi nhận **17 nhiệm vụ (Rita Hoang)** với 6% năng lực thấp và **4 Cơ hội Ưu tiên**. Nhu cầu tập trung vào Phát triển Con người và Tư duy Kinh doanh. **7 nhân sự Hải quan còn lại chưa có kế hoạch phát triển cá nhân** — đặc biệt Julie Phung (Trưởng nhóm) cần kế hoạch phát triển để chuẩn bị người kế thừa.' },
      risk: { vi: 'Julie Phung (Trưởng nhóm Hải quan, không có người kế thừa) chưa có kế hoạch phát triển cá nhân — không có kế hoạch Chuyển giao Kiến thức chính thức. Nếu Julie nghỉ mà không có tài liệu quy trình và kế hoạch phát triển cá nhân cho người kế thừa, **toàn bộ kiến thức nghiệp vụ Hải quan phức tạp sẽ bị mất**.' },
      nextStep: { vi: 'Rita Hoang phối hợp với bộ phận Nhân sự để **xây dựng kế hoạch phát triển cá nhân cho Julie Phung** trong quý 3 — tập trung vào Kỹ năng Chuyển giao Kiến thức và Kèm cặp để Julie có thể đào tạo người kế thừa (Tiny Nguyen) hiệu quả.' }
    },
    'WNK_ALL': {
      insight: { vi: 'Hệ thống kế hoạch phát triển cá nhân của Wanek ghi nhận **803 hồ sơ từ 55 nhân sự** — trung bình 14,6 nhiệm vụ/người, phản ánh phạm vi công việc rộng trong giai đoạn mở rộng. Cơ hội Ưu tiên tập trung vào Kỹ thuật Số và Kèm cặp — phản ánh nhu cầu tự động hóa và phát triển năng lực đào tạo nội bộ. Bộ phận Hỗ trợ UPH WNK3 có tỷ lệ năng lực thấp đáng chú ý — cần ưu tiên can thiệp.' },
      risk: { vi: 'Cơ hội Ưu tiên không được theo dõi → khoảng cách năng lực tích lũy → chỉ tiêu bộ phận không đạt trong 2 quý liên tiếp.' },
      nextStep: { vi: 'Trưởng bộ phận xác định 3 Cơ hội Ưu tiên (đánh dấu X) cho từng nhân viên → Chỉ định người chịu trách nhiệm → Rà soát trong cuộc họp 1-1 hàng tuần.' }
    },
    'MLN_ALL': {
      insight: { vi: 'Hệ thống kế hoạch phát triển cá nhân của Millennium đang vận hành đầy đủ. Các hồ sơ có đánh giá R1/R2 cần được Trưởng bộ phận rà soát và xác nhận kế hoạch can thiệp trong 30 ngày.' },
      risk: { vi: 'Hồ sơ R1/R2 không được theo dõi → nhân viên cảm thấy bị bỏ rơi → tăng nguy cơ nghỉ việc của nhóm có tiềm năng cao.' },
      nextStep: { vi: 'Trưởng bộ phận rà soát tất cả hồ sơ có R1/R2 → Xác nhận kế hoạch can thiệp trong 30 ngày → Tích hợp vào cuộc họp 1-1 hàng tuần.' }
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
  const insight = isVi ? entry.insight.vi : (entry.insight.en || entry.insight.vi);
  const risk = isVi ? entry.risk.vi : (entry.risk.en || entry.risk.vi);
  const nextStep = isVi ? entry.nextStep.vi : (entry.nextStep.en || entry.nextStep.vi);

  const deptLabel = deptKey === 'ALL' ? (lang === 'VI' ? 'Toàn Site' : 'All Departments') : deptKey;
  const siteName = siteKey === 'MLN' ? 'MILLENNIUM' : siteKey === 'WNK' ? 'WANEK' : 'ASHTON';
  const siteAccent = siteKey === 'MLN' ? '#2dd4bf' : siteKey === 'WNK' ? '#818cf8' : '#f59e0b';

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: `${siteAccent}20`, border: `1px solid ${siteAccent}35` }}>
            <BarChart2 className="w-4 h-4" style={{ color: siteAccent }} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-widest font-mono" style={{ color: siteAccent }}>
                {lang === 'VI' ? 'PHÂN TÍCH & KHUYẾN NGHỊ' : 'ANALYSIS & RECOMMENDATIONS'}
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full font-mono" style={{ background: `${siteAccent}18`, color: siteAccent, border: `1px solid ${siteAccent}35` }}>
                {siteName} / {deptLabel}
              </span>
            </div>
            <p className="text-[10px] mt-0.5 font-mono" style={{ color: '#475569' }}>
              {lang === 'VI' ? 'Dựa trên dữ liệu thực tế — Cập nhật theo bộ phận được chọn' : 'Based on actual data — Updated per selected department'}
            </p>
          </div>
        </div>
        <div style={{ color: '#475569' }}>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">

          {/* NHẬN ĐỊNH - Teal */}
          <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.22)' }}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(20,184,166,0.14)' }}>
                <TrendingUp className="w-3.5 h-3.5" style={{ color: '#2dd4bf' }} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest font-mono" style={{ color: '#2dd4bf' }}>
                {lang === 'VI' ? 'NHẬN ĐỊNH TỪ DATA' : 'DATA INSIGHT'}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed font-medium" style={{ color: '#cbd5e1' }}>
              {bold(insight)}
            </p>
          </div>

          {/* RỦI RO - Rose */}
          <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.22)' }}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(244,63,94,0.14)' }}>
                <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#fb7185' }} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest font-mono" style={{ color: '#fb7185' }}>
                {lang === 'VI' ? 'RỦI RO NẾU KHÔNG HÀNH ĐỘNG' : 'RISK IF NO ACTION'}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed font-medium" style={{ color: '#cbd5e1' }}>
              {bold(risk)}
            </p>
          </div>

          {/* BƯỚC TIẾP THEO - Amber */}
          <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)' }}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.14)' }}>
                <Zap className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest font-mono" style={{ color: '#fbbf24' }}>
                {lang === 'VI' ? 'BƯỚC TIẾP THEO ĐỀ XUẤT' : 'RECOMMENDED NEXT STEP'}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed font-medium" style={{ color: '#cbd5e1' }}>
              {bold(nextStep)}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}