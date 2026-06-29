import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Info,
  Layers,
  Network,
  Compass,
  Calendar
} from 'lucide-react';

interface OnboardingStep {
  targetId: string;
  badgeVi: string;
  badgeEn: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  pointsVi: string[];
  pointsEn: string[];
  tipVi: string;
  tipEn: string;
  targetTab?: 'tab-9box' | 'tab-pipeline' | 'tab-devplan' | 'tab-indiv-idp';
}

interface OnboardingGuideProps {
  lang: 'VI' | 'EN';
  activeTab: string;
  onChangeTab: (tab: 'tab-9box' | 'tab-pipeline' | 'tab-devplan' | 'tab-indiv-idp') => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingGuide({
  lang,
  activeTab,
  onChangeTab,
  isOpen,
  onClose
}: OnboardingGuideProps) {
  const [guideMode, setGuideMode] = useState<'SELECT' | '9BOX' | 'PIPELINE' | 'DEVPLAN' | 'IDP'>('SELECT');
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [clickTargetRect, setClickTargetRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [cardHeight, setCardHeight] = useState(280);
  
  const isVi = lang === 'VI';
  const resizeIntervalRef = useRef<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastAdvanceTimeRef = useRef<number>(0);

  // --- 9-BOX WORKSPACE SEQUENCE ---
    const steps9Box: OnboardingStep[] = [
    {
      targetId: 'onboarding-9box-grid',
      badgeVi: 'Sơ đồ 9-Box',
      badgeEn: '9-Box Foundations',
      titleVi: '🗺️ Bản đồ phân phân loại Ma trận 9-Box chiến lược',
      titleEn: '9-Box Matrix Grid',
      descVi: 'Chào mừng bạn đến với Tour! Đây chính là tấm bản đồ hạt nhân giúp bạn phân loại và định vị năng lực cho toàn bộ đội ngũ. Sơ đồ này tự động chia nhân sự thành 9 nhóm dựa trên kết quả Hiệu suất công việc (trục ngang) và Tiềm năng tương lai (trục dọc), giúp bạn có cái nhìn tổng quan nhất.',
      descEn: 'This is our core talent classification matrix. It helps you map employee capabilities based on Performance (horizontal) and Potential (vertical). You can click any cell to filter the list below, or drag-and-drop cards to instantly reclassify team members.',
      pointsVi: [
        'Kéo thả trực tiếp: Bạn có thể kéo thả thẻ nhân viên giữa các ô để tái phân loại năng lực ngay lập tức.',
        'Lịch sử an tâm: Mọi thao tác kéo thả đều được ghi lại, giúp bạn hoàn tác (Undo) vị trí cũ cực kỳ thuận tiện.'
      ],
      pointsEn: [
        'Drag & drop labels between coordinates: updates values in real-time with automatic saving.',
        'Undo safety: Action logs tracking lets you restore prior grid positions with a single click.'
      ],
      tipVi: 'Hãy ngắm thử giao diện ma trận 9 ô đầy màu sắc này rồi bấm "Tiếp tục" để chúng ta bắt đầu hành trình nhé!',
      tipEn: 'Review this 9-cell overview grid, then click "Next"!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-cell-superstar',
      badgeVi: 'Nhóm Siêu sao',
      badgeEn: 'Superstar Segment',
      titleVi: '⭐ Nhóm hạt giống Siêu sao (Superstars)',
      titleEn: 'Superstar Cell Actions & Filtering',
      descVi: 'Đây là ô Siêu sao - nơi hội tụ những nhân tài xuất sắc nhất của chúng ta, đạt điểm tuyệt đối ở cả hiệu suất lẫn tiềm năng. Hệ thống đã bấm chọn sẵn ô này để hiển thị riêng danh sách của họ ở bên dưới, giúp bạn nhanh chóng quy hoạch nguồn quản lý kế cận cho đơn vị.',
      descEn: 'This is the Superstar cell - highlighting elite performers with maximum potential and output. We have pre-selected this for you so the table below displays ONLY this high-potential cohort, ready for promotion or succession pipelines.',
      pointsVi: [
        'Bấm chọn thông minh: Hệ thống tự động click sẵn ô Siêu sao giúp dọn sạch thông tin nhiễu bên dưới.',
        'Động lực đột phá: Làm cơ sở để bạn giao các dự án thử thách mới, chuẩn bị lộ trình bồi dưỡng nâng tầm.'
      ],
      pointsEn: [
        'Dynamic synchronization: System auto-clicks the "Superstar" cell to isolate key personnel below.',
        'Fast-track promotion: Build strategic leadership pipelines directly around this elite group.'
      ],
      tipVi: 'Nhóm nhân sự ưu tú này luôn được ưu ái đặt tại góc trên cùng bên phải đấy bạn!',
      tipEn: 'The Superstar cohort is always located at the top-right corner of the grid!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-cell-seasoned',
      badgeVi: 'Trụ cột vững vàng',
      badgeEn: 'Seasoned Professionals',
      titleVi: '⚡ Thử thách: Click đúp vào ô Trụ cột vững vàng',
      titleEn: 'Action: Double click on Seasoned Professionals Cell',
      descVi: 'Mọi ô trên ma trận đều có thể tương tác rất mượt mà! Bạn hãy BẤM ĐÚP CHUỘT TRÁI (nhấp chuột liên tiếp 2 lần) trực tiếp vào ô "Nhân sự dày dặn" (Seasoned Professionals) này để bùng mở nhanh một danh bạ nhỏ, hiển thị chi tiết các nhân tố nòng cốt của đội ngũ nhé.',
      descEn: 'Let\'s try an interactive action: Please DOUBLE-CLICK directly on the "Seasoned Professionals" cell! A full roster containing all employees under this group will slide open instantly, without cluttering the primary workspace.',
      pointsVi: [
        'Thao tác nhấp đúp: Gõ 2 lần nút chuột trái liên tục để kích hoạt xem nhanh an toàn.',
        'Lọc thông tin nòng cốt: Hiển thị ngay nhóm cán bộ tay nghề cao của Millennium mà không thay đổi bộ chọn chính.'
      ],
      pointsEn: [
        'Double-click trigger: Perform a rapid double click with your left mouse button on this cell.',
        'Smooth auditing: View the full list of consistent, high-performing experts immediately.'
      ],
      tipVi: 'Hãy click đúp chuột trái trực tiếp vào ô Trụ cột màu xanh để trải nghiệm ngay và luôn nhé!',
      tipEn: 'Double-click the "Seasoned Professionals" cell to trigger the detailed roster popup!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-cell-detail-modal',
      badgeVi: 'Danh sách nhân sự',
      badgeEn: 'Employee List',
      titleVi: '📋 Xem danh bạ nhân sự Trụ cột',
      titleEn: '📋 Seasoned Professionals Roster Details',
      descVi: 'Bảng thông tin nhỏ này giúp bạn theo sát dải nhân sự giàu kinh nghiệm - những người đang gánh vác hoạt động hàng ngày vững vàng nhất của Millennium. Hãy dùng nó để rà soát và kịp thời xây dựng các chương trình bồi dưỡng kỹ năng chéo, giúp họ phát huy tối đa phong độ.',
      descEn: 'This houses the list of your Seasoned Professionals - key experienced drivers maintaining steady operations. Use this roster to check individual profiles, making it easy to schedule relevant training programs or retention schemes.',
      pointsVi: [
        'Thông tin sắc nét: Xem nhanh họ tên, mã nhân mã và dải đánh giá năng lực tương ứng.',
        'Lên lịch phát triển: Định hướng dải kế hoạch huấn luyện chéo chính xác cho từng nhân viên.'
      ],
      pointsEn: [
        'Detailed view: View full names, employee codes, and associated ratings clearly.',
        'Strategic training base: Simple breakdown to help you structure appropriate developmental plans.'
      ],
      tipVi: 'Review nhanh dải họ tên của đội ngũ và nhấn "Tiếp tục" nha!',
      tipEn: 'Review the names and codes in this panel, then click "Next"!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-cell-detail-close-btn',
      badgeVi: 'Đóng danh sách',
      badgeEn: 'Close Cell Roster',
      titleVi: '✕ Nhấn Đóng để quay lại ma trận',
      titleEn: '❌ Close Cell Roster popup',
      descVi: 'Khi đã nắm được thông tin của nhóm, bạn hãy BẤM vào dấu (✕) ở góc trên bên phải để đóng cửa sổ này lại. Chúng ta sẽ cùng di chuyển xuống khu vực bảng chỉ số đo lường hiệu năng phía dưới.',
      descEn: 'Once you are finished reviewing the cell roster, simply click the close icon (✕) in the upper-right corner to exit this popup and return to our main tour.',
      pointsVi: [
        'Thao tác đóng gọn: Click vào nút X đưa chúng ta trở về giao diện thiết lập mặc định tức thì.',
        'Chuyển tiêu cự: Hệ thống hướng dẫn sẽ tự động dịch chuyển xuống phần Dashboard chỉ số vĩ mô bên dưới.'
      ],
      pointsEn: [
        '👉 Try closing: Left-click on the close cross button at the top right!',
        'Guide progression: Dismissing the popup automatically advances to the KPI Dashboard indicator blocks.'
      ],
      tipVi: 'Hãy click chuột trái vào dấu (✕) ở góc phải để quay về giao diện chính nha!',
      tipEn: 'Click the ✕ close button at the top-right to shut down the card overlay!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-kpi-cards',
      badgeVi: 'Dashboard Chỉ số',
      badgeEn: 'KPI Indicators',
      titleVi: '📊 Bảng điều khiển KPI năng lực tóm tắt',
      titleEn: 'KPI Dashboard & Smart Toggles',
      descVi: 'Phía dưới là 4 khối chỉ số tổng hợp lực lượng lao động của bạn theo 3 nhóm chiến lược cốt lõi: Growers, Keepers và Movers. Các thẻ này không chỉ tóm tắt số lượng mà còn hoạt động như một bộ lọc nhanh tiện lợi - bạn nhấp vào thẻ nào, danh sách nhân viên phía dưới sẽ lập tức chuyển đổi theo nhóm đó.',
      descEn: 'These premium KPI cards summarize your workforce into four key strategic segments. They also act as interactive filters—clicking any card instantly displays only the corresponding employees in the bottom table.',
      pointsVi: [
        'Phân loại khoa học: Chia rõ rệt 3 nhóm chiến lược độc lập phục vụ cho dải chính sách giữ chân nhân tài.',
        'Bộ lọc một chạm: Đồng bộ trực quan, chỉ cần bấm vào ô để thay đổi danh sách bảng hiển thị.'
      ],
      pointsEn: [
        'Growers, Keepers, Movers: Direct organizational allocation of high potential and active operators.',
        'Dynamic Filter: Click these KPI blocks directly to filter the corresponding staff list below.'
      ],
      tipVi: 'Hãy nhấn "Tiếp tục" để chúng ta đi chi tiết từng nhóm chỉ số nhé!',
      tipEn: 'Click "Next" to explore each of these KPI indicator cards step-by-step!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-kpi-card-growers',
      badgeVi: 'Nhóm Phát triển',
      badgeEn: 'Growers Cohort',
      titleVi: '🚀 Nhóm hạt giống Phát triển (Growers)',
      titleEn: 'KPI Card: Growers (High Potential)',
      descVi: 'Thẻ này thống kê Nhóm Phát triển (Growers) - những hạt giống đỏ có tiềm năng thăng tiến vượt trội bước vào lộ trình sẵn sàng kế cận. Hệ thống đã bấm chọn Growers để lọc danh sách dưới bảng, phục vụ bạn thiết kế các chương trình đào tạo quản lý hoặc giao dự án thử thách mới.',
      descEn: 'This card displays the high-potential Growers cohort - strategic individuals slated for key leadership roles. Tapping this block isolates them below, making it incredibly simple to structure executive training or special development plans.',
      pointsVi: [
        'Quy hoạch kế cận: Sàng lọc nhanh những gương mặt thích hợp nhất giúp gánh vác các vai trò lãnh đạo tương lai.',
        'Thao tác tự động: Click sẵn chỉ số giúp bạn tiết kiệm hàng tá thời gian tra soát bảng biểu.'
      ],
      pointsEn: [
        'Developmental focus: Triggers a click on the Growers indicator card to filter the talent table.',
        'Succession blueprint: Instantly displays high-potential candidates to assign mentoring path.'
      ],
      tipVi: 'Nhóm Phát triển thường được ưu tiên giao các dự án thử thách mới.',
      tipEn: 'Growers are always the prime target for high-level succession plans!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-kpi-card-keepers',
      badgeVi: 'Nhóm Duy trì',
      badgeEn: 'Keepers Cohort',
      titleVi: '⚖️ Nhóm Duy trì Phong độ (Keepers)',
      titleEn: 'KPI Card: Keepers (Solid Performers)',
      descVi: 'Đây là nhóm gánh vác vận hành cốt lõi (Keepers) - những người duy trì sự bền bỉ của các phòng ban chức năng. Việc rà soát nhóm này giúp bạn kịp thời đưa ra các cơ chế tri ân, đãi ngộ và đào tạo nâng cao để họ gắn bó lâu dài.',
      descEn: 'This card represents your reliable Keepers - the cornerstone cohort handling core operational sequences. Clicking this block filters the table to check their files, helping HODs deploy cross-training and retention rewards.',
      pointsVi: [
        'Trọng tâm ổn định: Click tự động điều chuyển bảng hiển thị sang nhóm giữ ổn định biên năng lực.',
        'Chiến sách giữ chân: Lịch trình cho phép bạn phân bổ chính xác nguồn tri ân, chăm sóc chế độ thâm niên.'
      ],
      pointsEn: [
        'Operational backing: Triggers a click on the Keepers card to inspect consistent executors.',
        'Retention strategy: Plan for seniority bonuses, expert roles, and cross-training drives.'
      ],
      tipVi: 'Hãy bấm "Tiếp tục" để tìm hiểu nhóm Movers tiếp theo nhé.',
      tipEn: 'Click "Next" to evaluate the Movers cohort!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-kpi-card-movers',
      badgeVi: 'Cần chuyển dịch',
      badgeEn: 'Movers Cohort',
      titleVi: '🔄 Nhóm cần Chuyển dịch Năng lực (Movers)',
      titleEn: 'KPI Card: Movers (Action Required)',
      descVi: 'Đây là nhóm Luân chuyển (Movers) - gồm những nhân sự mới hoặc đang có năng lực thích thích ứng cần cải thiện. Hệ thống gom họ lại đây để bạn dễ dàng lên kế hoạch hỗ trợ và kèm cặp 1-kèm-1, giúp họ sớm bắt kịp nhịp độ vận hành của bộ phận.',
      descEn: 'This card spotlights the Movers cohort - employees requiring focused training, close mentoring, or tactical role adjustments to excel. Keeping close track of the Movers lets HODs intervene before skill deficits impact floor output.',
      pointsVi: [
        'Can thiệp sớm: Lọc nhanh các nhân viên cần có sự can thiệp, đào tạo củng cố khẩn cấp.',
        'Giảm rủi ro: Bảo vệ năng suất và hạn chế đứt gãy tay nghề trên sàn sản xuất Millennium.'
      ],
      pointsEn: [
        'Early support: Auto-clicks the Movers KPI card to display the action required list below.',
        'Productivity guardrails: Helps HODs identify work bottlenecks and initiate quick recovery schedules.'
      ],
      tipVi: 'Hỗ trợ kịp thời giúp các Movers nhanh chóng tiến lên nhóm vững tay nghề.',
      tipEn: 'Early support allows Movers to shift safely up to the Keepers category!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-kpi-card-total',
      badgeVi: 'Cơ sở Dữ liệu',
      badgeEn: 'Full Reset',
      titleVi: '🔄 Khôi phục danh sách đầy đủ',
      titleEn: 'KPI Total Reviewed: Full Dataset',
      descVi: 'Và đây là nút Tổng đánh giá. Hệ thống tự động kích hoạt nút này để xóa sạch các bộ lọc tạm thời, đưa ma trận và danh sách trở lại trạng thái ban đầu để bạn xem trọn vẹn 100% dữ liệu nhân sự của đơn vị.',
      descEn: 'This is the master Total card. We have triggered a reset click on this card so you can review the full, unfiltered 100% workforce dataset simultaneously across all 9-box grids and tables.',
      pointsVi: [
        'Xóa bộ lọc nhanh: Phục hồi ma trận 9-Box và bảng dữ liệu về trạng thái cơ bản ban đầu.',
        'Điều hướng vĩ mô: Hỗ trợ nhìn nhận toàn vẹn tiến độ đánh giá của cả bộ phận Millennium.'
      ],
      pointsEn: [
        'Restores full view: Instantly clears active Growers, Keepers, or Movers filters.',
        'Executive tracking: Regain a balanced, wide-angle inspect mode of your entire workspace.'
      ],
      tipVi: 'Bên phải của bạn là cụm các biểu đồ xu hướng vô cùng sống động nhé.',
      tipEn: 'To the right is a series of beautiful trend analysis charts.',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-right-charts',
      badgeVi: 'Biểu đồ Xu hướng',
      badgeEn: 'Trend Charts',
      titleVi: '📈 Biểu đồ dữ liệu & Xu hướng thông minh',
      titleEn: 'Trend Charts & Analytical Statistics',
      descVi: 'Bên phải màn hình là tổ hợp các biểu đồ phân tích trực quan. Chúng tự động đo lường tỷ lệ cân bằng nhân lực, rủi ro rời đi của nhân tài và mật độ phân vị, giúp bạn có số liệu khoa học để báo cáo lên Ban Giám đốc chỉ trong vài giây.',
      descEn: 'To the right is our analytical chart series. These visuals summarize overall talent balance, density distributions, and team flight risks, providing immediate data for high-level management reports.',
      pointsVi: [
        'Đo đạc cân bằng: Nhìn nhận ngay phòng ban đang thừa hay thiếu hụt lãnh đạo tương lai.',
        'Biểu đồ phân vị: Hiển thị định lượng số nhân viên nằm trong từng góc phần tư của ma trận.'
      ],
      pointsEn: [
        'Balance ratio chart: Reflects future leadership bandwidth.',
        'Cell distribution chart: Visualizes headcount count inside the grid coordinates.'
      ],
      tipVi: 'Các số liệu của biểu đồ biểu thị linh hoạt theo dải phòng ban bạn đang lọc.',
      tipEn: 'Every chart is fully dynamic and updates with your selectors.',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'dept-analysis-component',
      badgeVi: 'Chẩn đoán phòng ban',
      badgeEn: 'Strategic Diagnostics',
      titleVi: '🩺 Khung chẩn đoán sức khỏe phòng ban',
      titleEn: 'Overview & Analysis Panel',
      descVi: 'Khu vực này tổng hợp báo cáo sức khỏe nhân sự tổng quan của từng bộ phận. Trước khi đi sâu vào rà soát từng cá nhân, bảng chẩn đoán này giúp bạn nhanh chóng đánh giá xem cơ cấu của phòng ban đó đã được quy hoạch cân đối và vững chắc hay chưa.',
      descEn: 'This sections is the Strategic Diagnostics panel. It provides a high-level organizational review, allowing you to assess if a department is structured sustainably before drill-down checks.',
      pointsVi: [
        'Xếp hạng sức khỏe: Đo lường mức độ thăng tiến và rủi ro hoạt động của ban hành phòng dịch.',
        'Gợi ý L&D chuẩn xác: Cung cấp góc nhìn bao quát ban sơ trước khi can thiệp điều khối học phần.'
      ],
      pointsEn: [
        'Structural view: Aggregates metrics to evaluate organizational talent density.',
        'High-level summary: Instant look at health statuses before auditing individual departments.'
      ],
      tipVi: 'Hãy cùng tìm hiểu cách chuyển đổi chế độ xem ở bước tiếp theo nha.',
      tipEn: 'Let us check the mode toggle view options below.',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-dept-tab-overview',
      badgeVi: 'Chế độ xem',
      badgeEn: 'Toggle Views',
      titleVi: '👀 Chế độ xem Tổng quan',
      titleEn: 'Diagnostic Mode Overview',
      descVi: 'Trong tab Tổng quan này, sức khỏe phòng ban được số hóa thành biểu đồ phần trăm Growers - Keepers - Movers rất trực quan, kèm lời nhận xét trạng thái từ AI như "Cân đối - Đủ Kế thừa" hay "Cần Hỗ trợ Đào tạo (Movers)" để bạn định vị nhanh thế sự.',
      descEn: 'In the Overview tab, the system visualizes department composition using percentages on a clear radial axis, complete with health classifications like Balanced - Ready Pipeline, Needs Training, or High Potential (Growers).',
      pointsVi: [
        'Biểu đồ tròn trực quan: Chỉ rõ tỉ trọng Growers, Keepers, Movers phân bổ của đơn vị.',
        'Nhãn trạng thái tức thì: Xếp thứ tự đánh giá nhanh sức khỏe tổng quát tiện lợi.'
      ],
      pointsEn: [
        'Percentage statistics: Clear display of department metrics breakdown.',
        'Status classification: Standardized labels such as Balanced - Ready Pipeline, Needs Training, or High Potential (Growers).'
      ],
      tipVi: 'Cách hiển thị này giúp bạn so sánh nhanh sự phân bổ cấu trợ giữa các mảng.',
      tipEn: 'This makes comparing metrics across departments incredibly simple.',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-dept-tab-insights',
      badgeVi: 'Chế độ xem Chi tiết',
      badgeEn: 'Detailed Insights',
      titleVi: '💡 Chế độ xem Phân tích Chi tiết',
      titleEn: 'Detailed Diagnostic View Toggle',
      descVi: 'Khi bạn chọn tab này, hệ thống chẩn đoán sẽ kích hoạt phân tích chuyên sâu nhằm bóc tách rủi ro năng lực, lỗ hổng kỹ năng, rào cản đào tạo và đưa ra các đề xuất L&D chuẩn xác nhất cho bộ phận.',
      descEn: 'Selecting the "Detailed Diagnostics" tab prompts our analysis framework to reveal deep competence gaps, leadership risks, and target training recommendations tailored to your operations.',
      pointsVi: [
        'Pháo đài phân tích: Click và bung mở đầy đủ thế mạnh lẫn điểm nghẽn của tổ chuyên môn.',
        'Đối sách thiết thực: Mở ra bách khoa lời khuyên huấn luyện và đào tạo kỹ năng chi tiết.'
      ],
      pointsEn: [
        'Interactive toggle: Automatically switches active analysis tab to "Detailed Diagnostics".',
        'In-depth diagnosis: Highlights core talent strengths, training needs, and operational blindspots.'
      ],
      tipVi: 'Nhấn "Tiếp tục" để xem bộ chọn phòng ban cục bộ nhé.',
      tipEn: 'Next, let us evaluate the local department filter dropdown.',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'internal-dept-select',
      badgeVi: 'Lọc cục bộ',
      badgeEn: 'Local Filter',
      titleVi: '🔍 Bộ lọc Phòng ban cục bộ',
      titleEn: 'Local Department Selector',
      descVi: 'Hãy dùng bộ chọn phòng ban phụ này để khóa riêng mảng ban hành bạn muốn chẩn đoán sâu. Trợ lý thông minh sẽ tức tốc tinh chỉnh lời khuyên bám sát tình hình thực tế của tổ đó đang ở giai đoạn "Tăng trưởng nhanh" hay "Ổn định".',
      descEn: 'Use this local dropdown to isolate individual departments. The strategic advisor adjusts its feedback dynamically to align with that team\'s operational phase, such as Fast Growth or Stable Scale.',
      pointsVi: [
        'Chẩn đoán độc lập: Phân tích sâu sắc thế mạnh và rủi ro rò rỉ của bộ phận được lọc.',
        'Kịch bản sinh động: Cân bằng lời khuyên theo các chế độ [Tăng trưởng 🚀] hoặc [Ổn định ⚖️].'
      ],
      pointsEn: [
        'Isolated analysis: Highlights specific department advice without outer visual clutter.',
        'Business dynamics: Dynamically adapts guidance for [Fast Growth 🚀] or [Stable Scale ⚖️] periods.'
      ],
      tipVi: 'Hãy thử chọn một phòng ban bất kỳ để trải nghiệm lời khuyên thay đổi sinh động!',
      tipEn: 'Select any department to see the active recommendations shift dynamically!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-dept-strengths',
      badgeVi: 'Thế mạnh Đội ngũ',
      badgeEn: 'Key Strengths',
      titleVi: '💪 Khung chẩn đoán Thế mạnh đội ngũ',
      titleEn: 'Structural Strengths Box',
      descVi: 'Ô này làm nổi bật những kỹ năng vượt trội đang chiếm ưu thế lớn nhất trong nội bộ phòng ban được chọn. Hãy tận dụng tối đa thế mạnh này để tự tin phân bổ các mục tiêu đột phá hơn cho đội ngũ của bạn nhé.',
      descEn: 'This card spotlights the dominant capabilities of the selected department. Relying on these key strengths lets you safely assign challenging projects or scale operation speeds with confidence.',
      pointsVi: [
        'Kỹ năng mũi nhọn: Nêu rõ những kỹ năng vượt trội đang giúp ổn định và giúp bộ phận hoàn thành tiến độ.',
        'Điểm tựa vận hành: Bảo chứng cho việc dời dời dịch vị trí hoặc gánh vác các nhiệm vụ khẩn.'
      ],
      pointsEn: [
        'Core capabilities: Explicitly defines top-performing skills currently shielding your workforce.',
        'Structural buffer: Calculates capacity to absorb rapid business shifts without drop in quality.'
      ],
      tipVi: 'Nhìn vào đây để biết phòng ban của bạn đang dẫn đầu về năng lực gì nhé!',
      tipEn: 'Allows you to easily spot which core skills are shielding your active workflow!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-dept-risks',
      badgeVi: 'Cảnh báo Rủi ro',
      badgeEn: 'Threat Warnings',
      titleVi: '⚠️ Khung chẩn đoán Điểm nghẽn & Rủi ro',
      titleEn: 'Critical Risks & Diagnostic Warnings',
      descVi: 'Khung màu hồng này hiển thị các cảnh báo rủi ro về năng lực (như khuyết thiếu hạt giống đỏ) hoặc cảnh báo tình trạng thụ động học tập, giúp bạn sớm lên phương án khắc phục trước khi nó ảnh hưởng đến năng suất lao động.',
      descEn: 'The rose-colored alert box exposes urgent capability shortfalls or operational complacency issues—such as teams with heavy Keeper levels showing slow motivation to Upskill.',
      pointsVi: [
        'Chạm trán Complacency: Cảnh báo khi lực lượng Keepers quá đông dẫn tới tâm lý ngại đổi mới và trì trệ học tập.',
        'Dự phòng rào cản: Phát hiện lỗ hổng kỹ năng kế nhiệm sớm để lên phương án đào tạo nước rút.'
      ],
      pointsEn: [
        'Complacency check: Spots teams with heavy keeper concentration avoiding active learning.',
        'Critical shortfalls: Warns of leadership talent depletion in time to launch headhunting drives.'
      ],
      tipVi: 'Nhận diện sớm các rào cản giúp bạn thiết lập chương trình kèm cặp kịp thời nhất.',
      tipEn: 'Spotting competence bottlenecks early allows you to intervene before productivity drops.',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-dept-actions',
      badgeVi: 'Kế hoạch Hành động',
      badgeEn: 'Action Roadmaps',
      titleVi: '🧭 Kịch bản hành động cho Quản lý',
      titleEn: 'Manager Action Roadmap',
      descVi: 'Đây chính là cuốn cẩm nang hành động thực chiến thiết thực nhất dành cho bạn! Hệ thống vạch rõ từng hành động cụ thể cho Growers, Keepers và Movers giúp bạn dễ dàng điều phối, giữ chân tài năng và củng cố tay nghề cho nhân viên.',
      descEn: 'This is the tactical playbook designed for HODs. It lays down concrete steps to develop your Growers, retain your Keepers, and upskill your Movers with focus.',
      pointsVi: [
        'Đồng bộ kịch bản: Hướng dẫn chi tiết bồi dưỡng nhân sự theo ngạch năng lực.',
        'Chương trình kèm cặp: Tự động tư vấn lộ trình 1-kèm-1 nhằm củng cố năng lực tay nghề nhanh chóng.'
      ],
      pointsEn: [
        'Buddy mentoring: Structured recipes to guide lower performance staff into safe zone ranges within 60 days.',
        'Fast growth deployment: Action steps designed specifically for growth or stability phases.'
      ],
      tipVi: 'Kế hoạch hành động được biên sẵn, gạt bỏ hoàn toàn từ ngữ phức tạp để bạn áp dụng trực tiếp.',
      tipEn: 'Action tasks are simplified and direct, free of complex corporate jargon.',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-dept-filter',
      badgeVi: 'Lọc toàn diện',
      badgeEn: 'Master Filter',
      titleVi: '🎛️ Bộ lọc Phòng ban chính toàn trang',
      titleEn: 'Master Top Department Filter',
      descVi: 'Đây là bộ chọn phòng ban cấp cao nhất trên thanh menu. Hãy gõ từ khóa lọc để đồng bộ lập tức 100% dữ liệu từ Ma trận 9-Box, biểu đồ xu hướng cho tới bảng hồ sơ chi tiết bên dưới về cùng một phòng ban bạn đang quản lý.',
      descEn: 'This is the primary top-level department selector. Selecting a department here filters the entire workspace—updating the 9-box matrix, charts, and profiles below in real time.',
      pointsVi: [
        'Đồng bộ tức thì: Kết nối toàn diện dải chỉ số, sơ đồ ma trận kéo thả và bảng điểm nóng.',
        'Sử dụng thuận tiện: Nhập từ khóa tìm kiếm nhanh gọn giữa hàng chục tổ chức hành chính đơn vị.'
      ],
      pointsEn: [
        'Total Sync: Controls downstream modules so you get an aligned view across all charts.',
        'Fuzzy Search: Find departments using instant keyword lookup.'
      ],
      tipVi: 'Gõ từ khóa để nhanh chóng tìm thấy phòng ban bạn cần rà soát nhé.',
      tipEn: 'Type keywords for quick, fluid search among all departments.',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-bottom-analysis',
      badgeVi: 'Danh sách nhân sự',
      badgeEn: 'Talent Directory',
      titleVi: '📂 Thư mục Hồ sơ năng lực chi tiết',
      titleEn: 'Detailed Talent Roster',
      descVi: 'Chào mừng bạn đến với khu vực bách khoa toàn thư chứa hồ sơ năng lực của từng nhân viên, đi kèm ý kiến nhận xét sống động về thái độ và đề xuất đào tạo (L&D) của Trưởng bộ phận (HOD).',
      descEn: 'The bottom encyclopedic table hosts the complete employee performance records and strategic commentary directly written by Department Heads (HODs).',
      pointsVi: [
        'Nhận xét từ HOD: Đọc đề xuất và ghi chú thực tế về năng lực, điểm cải thiện của từng cá nhân.',
        'Thông số đầy đủ: Tổng hợp điểm số hiệu quả làm việc, tiềm năng và ô classification bám sát.'
      ],
      pointsEn: [
        'HOD Commentary: Professional notes on individual capabilities, strengths, and goals.',
        'Performance levels: Explicitly displays grades and current 9-box classifications.'
      ],
      tipVi: 'Sử dụng ô tìm kiếm để tra cứu nhanh họ tên hoặc mã số nhân viên nhé.',
      tipEn: 'Use the table search box to quickly locate employee codes.',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-th-name',
      badgeVi: 'Sắp xếp Họ & Tên',
      badgeEn: 'Sort by Full Name',
      titleVi: '🔤 Sắp xếp Họ & Tên theo bảng chữ cái',
      titleEn: 'Sort Column: "Full Name" (A-Z / Z-A)',
      descVi: 'Bạn có thể bấm trực tiếp vào tiêu đề cột "Họ và tên" để lập tức sắp xếp danh sách nhân sự theo thứ tự chữ cái A-Z hoặc ngược lại, giúp bạn đối chiếu và tìm kiếm nhân viên vô cùng thuận tiện.',
      descEn: 'Click the "Full Name" column header to instantly sort your talent roster alphabetically. Click it again to reverse the order for fast navigation.',
      pointsVi: [
        'Bảng chữ cái A-Z: Dễ dàng ghép cặp kiểm soát danh bạ hồ sơ Millennium thực tế.',
        'Sắp xếp ngược Z-A: Tìm nhanh các họ tên nhóm dưới cực nhanh.'
      ],
      pointsEn: [
        'Order A-to-Z: Arranges names alphabetically to easily match physical directories.',
        'Order Z-to-A: Reverses the sequence for specialized review checks.'
      ],
      tipVi: 'Nhấp chuột vào tiêu đề cột để đảo hướng sắp xếp theo nhu cầu nha!',
      tipEn: 'Left-click the header cell to alternate sorting directions!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-th-cell',
      badgeVi: 'Sắp xếp Ô Ma trận',
      badgeEn: 'Sort by 9-Box Cell',
      titleVi: '🗂️ Sắp xếp theo phân vị 9-Box',
      titleEn: 'Sort Column: "9-Box Classification"',
      descVi: 'Bấm vào tiêu đề cột này để gom nhóm những nhân sự có cùng xếp hạng năng lực đứng cạnh nhau (từ Siêu sao đến các nhóm cần hỗ trợ), giúp bạn dễ dàng so sánh và đánh giá đồng bộ.',
      descEn: 'Click this header cell to group your employees consecutively by their assigned 9-box coordinate. It helps HODs assess clusters of equivalent capability levels together.',
      pointsVi: [
        'Xếp loại năng lực liền kề: Trình bày trọn vẹn nhóm Siêu sao hoặc nhóm Lực lượng nòng cốt cạnh nhau.',
        'Rà soát dọn dẹp: Phát hiện nhanh những phân vị nào đang chiếm ưu thế đột xuất của đơn vị.'
      ],
      pointsEn: [
        'Spot top talent: Groups all "Superstar" or "Key Core" holders together instantly.',
        'Identify risk zones: Helps locate cohorts needing training or new to duties.'
      ],
      tipVi: 'Tìm nhanh toàn bộ Siêu sao của bộ phận đang xếp kề cận nhau cực kì thuận tiện bạn nhé!',
      tipEn: 'Quickly group and audit all Superstar staff together in a single sweep!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-9box-row-0',
      badgeVi: 'Điều chỉnh Hồ sơ',
      badgeEn: 'Adjust Profile',
      titleVi: '🖱️ Click để xem và cập nhật Hồ sơ cá nhân',
      titleEn: 'Click Staff Row to Adjust Profile',
      descVi: 'Giao diện làm việc của chúng ta cực kỳ trực quan! Bạn hãy thử BẤM CHUỘT TRỰC TIẾP lên dòng đầu tiên để bùng mở hồ sơ năng lực chi tiết của nhân viên và điều chỉnh điểm số hoặc nhập nhận xét.',
      descEn: 'Our tables are fully interactive! Please CLICK directly anywhere on the first employee row of the table to pop open their full capability profile and launch direct editing controls.',
      pointsVi: [
        'Bật form hiệu hiệu chỉnh: Bấm thẳng vào hàng nhân sự để bật ô cửa sổ rà rà soát chi tiết.',
        'Đồng bộ tức thì: Khi bạn sửa đổi và lưu, Ma trận 9-Box và biểu đồ phía trên sẽ nhảy số thích ứng lập tức.'
      ],
      pointsEn: [
        'Instant Workspace Modal: Tapping any row opens up their exhaustive profile drawer.',
        'Edit values: Adjust Performance points, Potential ratings, or write direct HOD notes.',
        'Real-time Updates: Saving instantly syncs the 9-box matrix and updates downstream charts.'
      ],
      tipVi: 'Hãy nhấp chuột trái trực tiếp lên dải dòng đầu bảng nào bạn ơi!',
      tipEn: 'Please click the first row of the table to proceed forward!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-9box-detail-modal',
      badgeVi: 'Hồ sơ Chi tiết',
      badgeEn: 'Employee Profile',
      titleVi: '🔍 Chi tiết Hồ sơ năng lực cá nhân',
      titleEn: '🔍 Employee Profile Insights',
      descVi: 'Bảng thông tin chi tiết này hiển thị trọn vẹn kết quả đánh giá, đề xuất học tập và nhận xét của nhân sự. Tại đây, bạn có thể dễ dàng kiểm tra, phê duyệt hoặc chỉnh sửa để thông tin luôn khớp chuẩn với thực tế.',
      descEn: 'The detailed employee card is now open! Check their complete grades, view descriptive comments, and evaluate the specific upskilling proposals written for them.',
      pointsVi: [
        'Báo cáo đầy đủ: Đầy đủ các điểm kĩ năng và nhận xét thực chất của nhân sự.',
        'Giao diện trực quan: Thiết kế gọn gàng giúp bạn kiểm soát chất lượng đánh giá dễ tuyển.'
      ],
      pointsEn: [
        'Comprehensive data: Read reviews, advice, and useful stats.',
        'Streamlined view: Floating layout displays detailed qualitative notes comfortably.'
      ],
      tipVi: 'Hãy lướt qua hồ sơ cá nhân của nhân sự này một lượt rồi nhấn "Tiếp tục" nhé!',
      tipEn: 'Review their profile parameters, then click "Next"!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-9box-detail-close-btn',
      badgeVi: 'Đóng Hồ Sơ',
      badgeEn: 'Close Profile',
      titleVi: '✕ Nhấn Đóng hồ sơ cá nhân',
      titleEn: '✕ Dismiss Profile Drawer',
      descVi: 'Khi đã hoàn tất rà soát thông tin nhân viên, bạn hãy CLICK vào dấu (✕) ở góc trên bên phải để đóng popup này lại và quay trở lại ma trận làm việc chính.',
      descEn: 'Once you are satisfied with your review, click the close cross icon (✕) in the top-right corner to close this modal and safely return to the main matrix.',
      pointsVi: [
        '👉 Trải nghiệm thực tế: Hãy click chuột TRỰC TIẾP lên nút X ở góc trên của form đóng này nhé!',
        'Đồng bộ dòng chảy: Đóng popup đưa bạn dọn dẹp màn hình ngăn nắp để bước sang bài học tiếp theo.'
      ],
      pointsEn: [
        '👉 TRY CLOSING: Left-click EXACTLY on the close X button at the top right of this modal!',
        'Sequential sync: Closing the modal automatically advances to the table sort filter guide.'
      ],
      tipVi: 'Nhấp chuột vào biểu tượng X ở góc trên bên phải để đóng popup an toàn bạn nhé!',
      tipEn: 'Left-click the close ✕ button at the top-right to dismiss!',
      targetTab: 'tab-9box'
    },
    {
      targetId: 'onboarding-table-filters',
      badgeVi: 'Sắp xếp nhanh',
      badgeEn: 'Group Filters',
      titleVi: '💊 Bộ lọc nhanh kẹo dẻo',
      titleEn: 'Interactive Category Toggles',
      descVi: 'Dải nút kẹo dẻo nhỏ gọn này giúp bạn nhanh chóng sàng lọc danh sách nhân sự theo Growers, Keepers hoặc Movers ngay trên bảng để tập trung phân tích một nhóm kỹ năng chiến lược nhất định.',
      descEn: 'Use these pill buttons right on the table to isolate Growers, Keepers, or Movers on the fly. It is a fantastic shortcut to review strategic talent pools directly.',
      pointsVi: [
        'Tiện ích lọc nhanh: Cực kỳ thích hợp khi bạn cần tách lọc gấp nhóm năng lực để lên danh sách.',
        'Mạch lạc dữ liệu: Xử lý thông tin mượt, không làm xáo trộn hiển thị cấu trúc.'
      ],
      pointsEn: [
        'Instant triage: Isolate specific workforce segments with a single tap.',
        'Clean UI experience: Keeps your focus focused purely on target coordinates.'
      ],
      tipVi: 'Bạn đã hoàn tất dải hướng dẫn 9-box! Hãy nhấn Hoàn Thành để bắt đầu trải nghiệm thực tế nhé. Chúc mừng bạn!',
      tipEn: 'You have mastered our 9-Box guide! Click Finish to design.',
      targetTab: 'tab-9box'
    }
  ];

    // --- SUCCESSION PIPELINE WORKSPACE SEQUENCE ---
    const stepsPipeline: OnboardingStep[] = [
    {
      targetId: 'onboarding-pipeline-kpis',
      badgeVi: 'Mạng lưới chỉ số',
      badgeEn: 'Pipeline KPIs',
      titleVi: '📊 Bộ đếm Chỉ số Quy hoạch Kế thừa',
      titleEn: 'Succession Pipeline Metrics',
      descVi: 'Chào mừng bạn đến với dải quy hoạch kế thừa! Phân hệ này tập trung đo lường tính an toàn, rủi ro rời bỏ và lộ trình chuẩn bị nhân sự dự phòng cho các chiến danh chủ chốt trong Millennium.',
      descEn: 'Welcome to the Succession Pipeline! Four unified aggregate counters showcasing role exposure levels, department safety, and key successor metrics.',
      pointsVi: [
        'Tổng số ghế nóng: Số lượng vị trí nhân sự cốt nòng then chốt đã được đưa vào dải rà soát.',
        'Nguy cơ biến động: Thống kê số nhân tố chủ chốt mang rủi ro dời đi báo động đỏ.',
        'Khoảng trống kế nhiệm: Nhận diện ghế then chốt chưa được gán bất kỳ ứng viên dự phòng nào.'
      ],
      pointsEn: [
        'Total Key Roles: Total critical leadership roles reviewed under the pipeline.',
        'High Risk Incumbents: Critical actors likely to depart with severe vacancy threat levels.',
        'Successor Gaps: Positions lacking designated standard back-ups or with interim only.'
      ],
      tipVi: 'Chúng ta bắt đầu tour khám phá các điểm rủi ro quy hoạch. Nhấn "Tiếp tục" nhé!',
      tipEn: 'Click Next to explore how these parameters are represented visually!',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-charts',
      badgeVi: 'Thống kê tự động',
      badgeEn: 'Succession Charts',
      titleVi: '📊 Biểu đồ trực quan tỷ lệ kế thừa',
      titleEn: 'Analytics Visualizations',
      descVi: 'Hai sơ đồ này số hóa mức độ rủi ro rời đi của nhân sĩ chủ chốt và tính dự phòng của tổ chức, giúp bạn dễ dàng đánh giá sức đề kháng của các phòng chức năng trước nguy cơ khuyết nhân tài.',
      descEn: 'These two charts help you evaluate your bench strength and overall risk exposure levels visually by department.',
      pointsVi: [
        'Cơ cấu chuyển giao (Doughnut): Cho thấy tỉ trọng sẵn sàng bàn giao quyền lực của nhân viên.',
        'Lỗ hổng phòng ban (Cột): Cảnh báo rõ ràng mảng cơ cấu nào đang mất cân đối dự phòng nặng nhất.'
      ],
      pointsEn: [
        'Status Distribution: Radial chart categorizing readiness statuses (Ready-Now, in-development, empty).',
        'Challenges by BU: Multi-bar breakdown spotlighting high-risk zones across different departments.'
      ],
      tipVi: 'Bảng biểu đồ này sẽ tự động nhảy số đồng bộ khi bạn điều chỉnh dải phòng ban trên đầu trang nhé!',
      tipEn: 'Charts dynamically adjust to your choice of department configurations immediately.',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-table-container',
      badgeVi: 'Mạng lưới kế thừa',
      badgeEn: 'Succession Panel',
      titleVi: '📋 Bảng Quản lý quy hoạch kế thừa',
      titleEn: 'Standard Succession Network',
      descVi: 'Đây là không gian làm việc chính của mạng lưới quy hoạch. Bảng này liệt kê mọi vị trí then chốt, cho phép bạn lọc phòng ban, tìm kiếm nhanh theo tên hoặc xuất báo cáo CSV chuẩn chỉ trong tích tắc.',
      descEn: 'This is your primary workplace. It displays the key roles matrix, allows searching by incumbents/successors, exporting to CSV, or isolating specific departments.',
      pointsVi: [
        'Nút tải CSV tiện ích: Tải nhanh tệp Excel báo cáo kế hoạch phủ ghế chỉ bằng 1 nút nhấn.',
        'Hộp lọc nhanh: Hỗ trợ tìm kiếm theo Họ tên quản lý, Tên vị trí hoặc Ứng viên kế kỳ linh hoạt.'
      ],
      pointsEn: [
        'BU Filter: Isolate key positions by choosing individual business departments.',
        'Export CSV: Download filtered pipeline data into spreadsheet files with one click.',
        'Live search bar: Filter records using incumbent names, role keys, or candidate names.'
      ],
      tipVi: 'Hãy bấm "Tiếp tục" để chúng ta tìm tìm hiểu cách sắp xếp thứ tự của từng cột nha.',
      tipEn: 'Click Next to review individual column sorting step-by-step.',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-th-incumbent',
      badgeVi: 'Sắp xếp Nhân sự',
      badgeEn: 'Sort by Incumbent',
      titleVi: '🔤 Sắp xếp theo cán bộ Đương nhiệm',
      titleEn: 'Sort Column: "Current Incumbent"',
      descVi: 'Bấm chọn "Nhân sự hiện tại" để sắp xếp danh sách theo họ tên của những cán bộ đương nhiệm, giúp bạn dễ dàng tra cứu, đối chiếu danh sách tổng.',
      descEn: 'Click this header cell to sort the records alphabetically based on the current executive\'s name.',
      pointsVi: [
        'Thứ tự A-Z: Gom danh mục bám sát họ chữ cái phục vụ rà soát sổ bạ truyền thống tiện ích.',
        'Sắp xếp dễ dàng: Click trực tiếp lên tiêu đề hàng để thay đổi chiều dời danh sách.'
      ],
      pointsEn: [
        'Alphabetical lists: Arrange A-to-Z or Z-to-A to locate key officers quickly.',
        'Enhanced audit: Review positions based on leader names rather than departmental codes.'
      ],
      tipVi: 'Việc sắp xếp giúp bạn tìm kiếm cá nhân nhanh hơn rất nhiều.',
      tipEn: 'Sorting alphabetically is a great entry paint to review HOD lists.',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-th-dept',
      badgeVi: 'Sắp xếp Phòng ban',
      badgeEn: 'Sort by BU',
      titleVi: '🗂️ Sắp xếp theo Phòng ban chuyên môn',
      titleEn: 'Sort Column: "Department (BU)"',
      descVi: 'Bấm chọn "Bộ phận" để gom tất cả các ghế nóng và chức danh then chốt của cùng một phòng ban đứng kề cạnh nhau, giúp bạn có cái nhìn tổng lượng về mức độ ổn định của bộ phận đó.',
      descEn: 'Click this header cell to group all executive responsibilities by their associated functional teams or business units.',
      pointsVi: [
        'Gom phòng ban: Gom tất cả vị trí của ban hành PE, Mattress hoặc QA về chung một góc đứng.',
        'Rà chẩn sức mạnh: Đo lường nhanh mật độ vị trí then chốt của từng đơn vị Millennium dễ kiểm soát.'
      ],
      pointsEn: [
        'Functional groupings: Bring crucial responsibilities of a single business block side-by-side.',
        'Team health audit: Instantly assess leadership density and pipeline vulnerabilities in specific departments.'
      ],
      tipVi: 'Hãy nhấn "Tiếp tục" để chúng ta sang cột chức danh kề bên nha.',
      tipEn: 'Click "Next" to continue exploring table features.',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-th-role',
      badgeVi: 'Sắp xếp Vị trí',
      badgeEn: 'Sort by Key Role',
      titleVi: '👔 Sắp xếp theo Tên vai trò chức danh',
      titleEn: 'Sort Column: "Key Role"',
      descVi: 'Nhấp chọn tiêu đề cột này để sắp xếp theo chữ cái của chức danh (như CEO, HOD Engineering, v.v.). Thao tác này giúp bạn dễ dàng so sánh quy hoạch giữa các vị trí tương đương cấu trúc.',
      descEn: 'Sort titles alphabetically to group similar leadership roles across different functions together.',
      pointsVi: [
        'Tìm chức danh đồng cấp: Gom nhóm toàn bộ ngạch quản lý, kỹ sư hoặc tổ trưởng để cân đối phúc lợi.',
        'Đồng hóa tên: Phát hiện ngay những vị trí trùng tên nhưng đang thiết lập lộ trình kế thừa lệch pha.'
      ],
      pointsEn: [
        'Title alignment: Groups duplicate or corresponding hierarchical roles together.',
        'Structure sanity: Review equivalent executive levels consecutively.'
      ],
      tipVi: 'Nhấn "Tiếp tục" để xem dải rủi ro vô cùng khẩn thiết nhé.',
      tipEn: 'Let us move to the "Risk Level" sort column.',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-th-risk',
      badgeVi: 'Sắp xếp Rủi ro',
      badgeEn: 'Sort by Risk',
      titleVi: '⚠️ Sắp xếp theo mức độ Rủi ro Rời bỏ',
      titleEn: 'Sort Column: "Risk Level" of Incumbent',
      descVi: 'Tính năng an toàn quan trọng! Sắp xếp theo cốt rủi ro để đưa ngay các "ghế nóng" có nguy cơ rời đi cao (báo động đỏ) lên đầu bảng để bạn có giải pháp đãi ngộ giữ chân kịp thời.',
      descEn: 'This sorting function prioritizes your high-risk leadership roles. It pushes roles with active "High Risk" flight indicators to the top, so you can allocate retention measures immediately.',
      pointsVi: [
        'Phòng khuyết nhân sự: Đẩy nhóm rủi ro cao (High Risk) lên đầu để kịp phối hợp với phòng nhân sự.',
        'Tối ưu bảo vệ: Nhận ra phần gốc ổn định (Low Risk) để phân bổ tài nguyên hợp lý dẹp lo âu.'
      ],
      pointsEn: [
        'Crisis prevention: Flags departments with "High Risk" leaders to lock in containment plans early.',
        'Budget optimization: Highlights stable "Low Risk" sections to allocate resources efficiently.'
      ],
      tipVi: 'Hãy nhấn "Tiếp tục" để chúng ta sang xem cột tình trạng bàn giao nha.',
      tipEn: 'Let us explore the "Succession Map" status column.',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-th-status',
      badgeVi: 'Sắp xếp Tình Trạng',
      badgeEn: 'Sort by Status',
      titleVi: '🎯 Sắp xếp theo Bản đồ Tình trạng kế thừa',
      titleEn: 'Sort Column: "Succession Map"',
      descVi: 'Bấm chọn "Bản đồ Tình trạng" giúp bạn phát hiện ngay các vị trí then chốt đang khuyết ứng viên kế thừa (No Successor Mapped), từ đó dồn sự tập trung để tuyển dụng hoặc đào tạo thay thế.',
      descEn: 'Click this header to organize roles by planning status, helping you instantly identify critical positions which currently have "No Successor Mapped".',
      pointsVi: [
        'Tìm hổng kế cận: Dồn các dòng khuyết người kế nhiệm (No Successor Identified) kề nhau để ưu hoạch bồi dưỡng.',
        'Giữ vững thành quả: Kiểm tra những ghế then then chốt đã có nhân lực Sẵn sẵn sẵn sàng gác đền.'
      ],
      pointsEn: [
        'Expose pipeline gaps: Pools all unassigned position gaps consecutively for immediate action.',
        'Celebrate coverage: Easily review which positions are securely backed up by "Ready" talents.'
      ],
      tipVi: 'Vị trí khuyết kế thừa luôn cần nhận được nhãn dán quan tâm hành động sớm.',
      tipEn: 'Roles without backups represent top organizational risks!',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-th-interim',
      badgeVi: 'Sắp xếp Tạm quyền',
      badgeEn: 'Sort by Interim',
      titleVi: '🛡️ Sắp xếp theo nhân sự Tạm quyền',
      titleEn: 'Sort Column: "Interim Head"',
      descVi: 'Nhấp chọn tiêu đề này để kiểm tra xem mỗi vị trí chủ chốt đã có phương án cử người gánh vác tạm thời khẩn cấp (Interim Head) trong trường hợp khẩn cấp hay chưa, phòng ngừa đứt gãy vận hành.',
      descEn: 'Sort by designated interim backups in the organization. This ensures a temporary head is listed to step up if a leader departs unexpectedly.',
      pointsVi: [
        'Khóa chặt đứt gãy: Xác định kịp thời người đứng mũi chịu sào lâm thời nếu cán bộ có biến động.',
        'Nguyên tắc phân chia: Đảm bảo một nhân vật không gánh quá nhiều ghế tạm quyền một lúc.'
      ],
      pointsEn: [
        'Rotational backup: Track who handles critical business tasks during crisis transition periods.',
        'Prevent fatigue: Ensure no single employee is assigned to manage too many interim roles.'
      ],
      tipVi: 'Phân phối đồng đều vai trò tạm quyền giúp tối ưu hóa sức khỏe của Millennium.',
      tipEn: 'An ideal pipeline ensures back-up officers are well distributed.',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-th-successor',
      badgeVi: 'Sắp xếp Người kế thừa',
      badgeEn: 'Sort by Successor',
      titleVi: '👥 Sắp xếp theo Ứng viên kế kỳ',
      titleEn: 'Sort Column: "Mapped Successor"',
      descVi: 'Bấm chọn sắp xếp theo ứng viên kế thừa để xem một hạt giống đỏ có đang bị quy hoạch gánh cùng lúc quá nhiều vai trò hay không, giúp phân bổ trách nhiệm đồng đều hơn.',
      descEn: 'Sort positions by current successor candidate names. Use this view to verify that high-potential talent is not overmapped for too many executive vacancies.',
      pointsVi: [
        'Tránh gánh đôi: Nhận diện một ngôi sao đang làm dự phòng cùng lúc cho 3-4 ghế chủ chốt để phân bổ lại.',
        'Nhận mặt tài năng: Giúp bạn nắm rõ dải quy mô bồi dưỡng nguồn kế cận của tổ chức.'
      ],
      pointsEn: [
        'Candidate tracking: Review if a high-potential talent is over-mapped as a backup for multiple roles.',
        'Clean gaps: Directly filters records to split assigned backups from unassigned roles.'
      ],
      tipVi: 'Hãy nhấn "Tiếp tục" để kiểm tra dải thời gian sẵn sàng chuyển giao nha bạn.',
      tipEn: 'Now we look at the crucial "Readiness" sorting column.',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-th-readiness',
      badgeVi: 'Sắp xếp Sẵn sàng',
      badgeEn: 'Sort by Readiness',
      titleVi: '⏳ Sắp xếp mức độ Sẵn sàng bàn giao',
      titleEn: 'Sort Column: "Readiness Level"',
      descVi: 'Cột này phân loại ứng viên theo lộ trình thời gian (Sẵn sàng ngay, Dưới 1 năm, lân cận 1-2 năm), giúp bạn thiết kế chương trình đào tạo nước rút cho phù hợp với từng giai đoạn chuyển giao.',
      descEn: 'Sort records to show candidates ready to assume duties based on developmental timelines. Put "Ready Now" successors consecutively or group those requiring prep training.',
      pointsVi: [
        'Bàn giao tức thì (Ready Now): Cực kỳ vững tâm, có thể nhận nhiệm quyền ngay khi ghế nóng có sự cố.',
        'Lộ trình dài hơi: Gom nhóm những người cần 1-2 năm chuẩn bị để dồn ngân sách cử học khóa đào tạo.'
      ],
      pointsEn: [
        'Ready Now backup: Spotlights immediate successors capable of scaling operations with zero delay.',
        'Educational roadmap: Groups members needing 1-2 years of prep to direct them to targeted training courses.'
      ],
      tipVi: 'Hãy cùng tìm hiểu cách thay đổi thông số quy hoạch nhân viên ở bước sau nha.',
      tipEn: 'Incomplete readiness levels are automatically queued for development pathing.',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-row-0',
      badgeVi: 'Điều chỉnh Quy hoạch',
      badgeEn: 'Edit Succession',
      titleVi: '🖱️ Click dòng để Tinh chỉnh quy hoạch',
      titleEn: 'Click Roster Row to Edit Succession',
      descVi: 'Bạn hãy BẤM CHUỘT TRỰC TIẾP lên dòng đầu tiên để mở biểu mẫu thiết lập kế thừa chi tiết, cho phép bạn chỉ định ứng viên thay thế, thiết lập tạm quyền hoặc điều chỉnh mức độ rủi ro rời đi của ghế nóng này.',
      descEn: 'Our succession board is completely direct. Please CLICK anywhere on the first row of the list to pop open the planning dialog and fine-tune its parameters.',
      pointsVi: [
        'Thao tác tiện tay: Click thẳng lên dải hàng nhân sự để bật cửa sổ form hiệu chỉnh quy hoạch.',
        'Số hóa lập tức: Nhấn Lưu để ghi nhận, hệ thống chỉ số lớn và đồ thị trên đầu trang sẽ tự động nhảy số đồng nhất.'
      ],
      pointsEn: [
        'Launch Succession Modal: Choose backups, interim roles, or adjust developmental periods.',
        'Update Risk Levels: Modify crucial indicators or comment directly on key management risks.'
      ],
      tipVi: 'Hãy click chuột trái trực tiếp lên dải dòng đầu tiên để bùng mở popup quy hoạch nhé!',
      tipEn: 'Please click the row directly to open succession settings modal!',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-modal',
      badgeVi: 'Form Quy hoạch',
      badgeEn: 'Succession Form',
      titleVi: '📋 Form Thiết lập quy hoạch chi tiết',
      titleEn: '📋 Detailed Succession Settings Form',
      descVi: 'Form chi tiết hiển thị toàn diện thông số của vị trí và các ứng viên thay thế tiềm năng. Tại đây, bạn có thể nhanh chóng chấm lại trạng thái bàn giao và viết nhận xét rủi ro trực quan.',
      descEn: 'This houses the active key role succession settings, letting you manage successors and backup readiness.',
      pointsVi: [
        'Tính nhất quán cao: Đồng bộ dải thông số cán bộ đương nhiệm và các hồ sơ ứng viên thay thế đề xuất.',
        'Xây dựng phòng bị: Thiết lập dải rào bảo vệ ghế then chốt giúp vận hành Millennium bền vững dài lâu.'
      ],
      pointsEn: [
        'Detailed view: Review candidates, backlog backup options, and direct comments.',
        'Safe transitions: Builds robust, resilient candidate pools to protect primary roles.'
      ],
      tipVi: 'Lướt xem nhanh các thông tin và click "Tiếp tục" bạn nhé!',
      tipEn: 'Review the succession details panel parameters, then click "Next"!',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-modal-close-btn',
      badgeVi: 'Đóng Quy hoạch',
      badgeEn: 'Close Succession',
      titleVi: '✕ Đóng biểu mẫu quy hoạch',
      titleEn: '❌ Close Succession Modal popup',
      descVi: 'Sau khi rà soát hoặc lưu chỉnh thông số kế thừa xong, bạn hãy CLICK vào dấu (✕) ở góc trên bên phải để đóng cửa sổ lại và quay về danh sách làm việc chính.',
      descEn: 'Successfully updated the roles? Just press the close cross button (✕) in the top-right corner to exit this dialog.',
      pointsVi: [
        '👉 Trải nghiệm đóng form: Bấm thẳng vào icon X để thu dọn sạch popup khỏi tầm nhìn.',
        'Kết nối tiếp mạch: Hệ thống tour hướng dẫn sẽ tự động chuyển dời xuống cụm Điểm nóng bên dưới.'
      ],
      pointsEn: [
        '👉 Try closing: Left-click exactly on the standard close cross button at the top right!',
        'Guide progression: Dismissing the popup automatically advances to the Risk Hotspots log below.'
      ],
      tipVi: 'Hãy bấm click chuột trái lên dấu ✕ ở góc phải để đóng bảng quy hoạch nha!',
      tipEn: 'Left-click the close ✕ button to dismiss the overlay card!',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-hotspots',
      badgeVi: 'Nội bộ Điểm nóng',
      badgeEn: 'Risk Hotspots',
      titleVi: '🔥 Radar Cảnh báo Điểm nóng Rủi ro',
      titleEn: 'Comprehensive High Risk Hotspots Detail',
      descVi: 'Đây là bảng radar thông minh tự động đưa ra 3 nhóm cảnh báo đỏ cấp bách nhất: ghế trống chưa quy hoạch, khuyết tạm quyền và đương nhiệm rủi ro rời bỏ cao. Bạn hãy dùng nó để giải quyết khẩn cấp các lỗ hổng nhân tài dạn dày.',
      descEn: 'This live tracking radar breaks down the critical roles dataset into three focused hotspot tabs: Vacancies, No Backups, and High-Risk Incumbents.',
      pointsVi: [
        'Hành động cấp bách: Nhìn ra bộ phận nào đang lay động tư tưởng để HR nhanh chóng can thiệp đãi ngộ dài thâm.',
        'Click liên kết: Bạn có thể click gõ trực tiếp lên bất kỳ dòng điểm nóng nào để mở form quy hoạch điều phối tức khắc.'
      ],
      pointsEn: [
        'Universal interactivity: Click any row inside any hotspot sub-table to adjust individual succession routes.',
        'Isolated sorting metrics: Every sub-grid has independent column headers supporting localized data ordering.'
      ],
      tipVi: 'Hãy ưu tiên xử lý dứt điểm các hàng điểm nóng để bảo an cho bộ máy Millennium.',
      tipEn: 'The Hotspot dashboard enables quick isolation of vulnerabilities!',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-hotspots-tab-highrisk',
      badgeVi: 'Cảnh báo Đỏ',
      badgeEn: 'Flight Risk Tracker',
      titleVi: '🔴 Tab Cảnh báo đỏ: Nhân sự rủi ro rời đi cao',
      titleEn: 'Tab Filter: Flight Risk Hotspots',
      descVi: 'Hãy click chọn tab này để rà soát riêng những nhân vật nòng cốt đang có tín hiệu rủi ro dao động tư tưởng cao. Giúp HR và lãnh đạo kịp thời trao đổi, giải bày tâm tư và tăng cường đãi ngộ dài hạn.',
      descEn: 'Select this sub-tab directly to isolate personnel holding "High Risk" scores of leaving. It enables you to initiate engagement plans before talent losses disrupt team operations.',
      pointsVi: [
        'Dò lường ổn định: Định vị chính xác bộ phận có nhiều nhân sự dao động để HR vào cuộc giữ chân.',
        'Tránh rủi ro vận hành: Giữ lại các khối óc kinh nghiệm lâu dài trước khi giông bão nhân sự nhen nhóm.'
      ],
      pointsEn: [
        'Department alerts: Instantly identify which business unit suffers from high leadership departure risk.',
        'Retention planning: Design localized compensation packages and engagement sessions.'
      ],
      tipVi: 'Can thiệp tâm lý và chế độ phúc lợi kịp thời là đối sách vàng dẹp rủi ro dời đi.',
      tipEn: 'Proactive intervention is the best strategy against core talent losses!',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-hr-th-risk',
      badgeVi: 'Sắp xếp Điểm nóng',
      badgeEn: 'Sort flight risk',
      titleVi: '⚡ Sắp xếp rủi ro trong dải Điểm nóng',
      titleEn: 'Priority Sorting: "Risk Level" & "Readiness"',
      descVi: 'Nhấp tiêu đề "Mức rủi ro" hoặc "Sẵn sàng" ngay trong bảng radar phụ này để sắp xếp nhanh các ưu tiên ứng phó khẩn cấp của đơn vị.',
      descEn: 'Click the "Risk" or "Readiness" columns directly inside this sub-tab to sort priorities for emergency response right inside the hotspot.',
      pointsVi: [
        'Đạt mốc nhanh: Nhấp cột đảo lật danh mục phân cấp để lọc cán cốt lung lay có người sẵn sàng bàn giao lân cận.',
        'Sử dụng dễ dàng: Click đảo nghịch linh hoạt, số liệu cập nhật đồng nhất tức thì.'
      ],
      pointsEn: [
        'Easy sorting: Click column headers to alternate descending or ascending priority layout.',
        'High-priority triage: Learn which spots demand secondary backing immediately.'
      ],
      tipVi: 'Nhấp chọn tiêu đề cột trong dải điểm nóng để thay đổi thứ tự sắp xếp nha!',
      tipEn: 'Simply click the table header to flip sorting order dynamically.',
      targetTab: 'tab-pipeline'
    },
    {
      targetId: 'onboarding-pipeline-deep-analysis',
      badgeVi: 'Đánh giá Chuyên sâu',
      badgeEn: 'Strategic Review',
      titleVi: '✨ Báo cáo Chẩn đoán Chuyên sâu & Lời khuyên',
      titleEn: '✨ SUCCESSION PIPELINE DEEP ANALYSIS & RECOMMENDATIONS',
      descVi: 'Báo cáo ở cuối trang tổng hợp tỉ số rủi ro rời bỏ và đề xuất những giải pháp L&D hiệu quả nhất, giúp bạn củng cố và bảo vệ dòng chảy lãnh đạo bền vững tại Millennium.',
      descEn: 'This high-fidelity strategic summary wraps up the succession workspace, providing actionable advice for vacancy fill, backup setup, and business continuation.',
      pointsVi: [
        'Tư vấn tối cao: Phân tích 3 cột điểm cảnh báo đỏ, lỗ hổng kế cận và chuẩn bị tạm quyền.',
        'Kiến nghị chất lượng: Các chương trình đào bồi bồi dưỡng cán bộ, giữ chân chất lượng cao được thiết kế sẵn sàng.'
      ],
      pointsEn: [
        'Strategic roadmaps: Delivers targeted action guides addressable for key position risks.',
        'Structured pipeline safety: Formulates training recommendations for critical talent retention.'
      ],
      tipVi: 'Bạn đã hoàn tất học tập mạng lưới kế thừa rồi đó! Hãy nhấn "Hoàn thành" để bắt đầu trải nghiệm thực biểu nhé. Chúc mừng bạn nha!',
      tipEn: 'You have mastered our succession framework! Click Finish to exit the tour.',
      targetTab: 'tab-pipeline'
    }
  ];

    // --- DEVELOPMENT PLAN / TRAINING PLAN SEQUENCE ---
    const stepsDevPlan: OnboardingStep[] = [
    {
      targetId: 'onboarding-devplan-visual-analytics',
      badgeVi: 'Nhu cầu Đào tạo',
      badgeEn: 'Learning Demands',
      titleVi: '🧯 Phân tích Nhu cầu Đào tạo chung',
      titleEn: 'Capacity Development Needs Overview',
      descVi: 'Chào mừng bạn đến với sơ đồ Kế hoạch Đào tạo! Khối phân tích này giúp bạn số hóa các khoảng trống kỹ năng hiện thời và dải ưu tiên của các ban hành đào tạo trong Millennium.',
      descEn: 'Welcome to the Development Plan! This analytics space highlights overall skill gaps in the workforce and distributes them by priority levels, either broadly or for specific teams.',
      pointsVi: [
        'Sơ đồ tóm lược: Đọc vị nhanh những kỹ năng nào đang thiếu hụt trầm trọng nhất của Millennium.',
        'Tính đồng bộ 100%: Thay đổi lựa chọn phòng ban ở menu trên cùng để đồ thị tự động chuyển đổi dữ liệu và vẽ lại tức thì.'
      ],
      pointsEn: [
        'Core Bar Chart summary: Represents exactly the quantitative educational volume requested for top core topics.',
        'Dynamic synchronization: The analytics framework recalculates immediately as you select different department filters.'
      ],
      tipVi: 'Hãy bấm Tiếp tục để chúng ta cùng xem Biểu đồ cột nhu cầu nhé.',
      tipEn: 'Next, let us look at the details of the interactive Bar Chart.',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-barchart',
      badgeVi: 'Biểu đồ tương tác',
      badgeEn: 'Interactive Chart',
      titleVi: '📊 Biểu đồ cột nhu cầu kỹ năng tương tác',
      titleEn: '📊 Capacity Development Column Chart Metrics',
      descVi: 'Biểu đồ Recharts cao cấp mô phỏng số lượng nhu cầu bồi dưỡng thực tế của Millennium. Hãy thử BẤM CHUỘT TRỰC TIẾP lên cột màu bất kỳ, hệ thống sẽ bùng mở ngay thông tin chi tiết của bộ kỹ năng đó ở cột bên cạnh.',
      descEn: 'A high-fidelity Recharts statistical visual distributing empirical training proposals from H.1 (AI & Automation) to H.7 (Business Acumen).',
      pointsVi: [
        '👉 Trải nghiệm nhấp cột: Click vào khối hình để chứng chứng kiến bảng thông tin kề bên chuyển dịch nội học liệu.',
        'Dải màu rực rỡ: Mỗi kỹ năng thừa hưởng dải màu ưu tiên đồng nhất, từ Đỏ cảnh báo cho tới Xanh bình yên.'
      ],
      pointsEn: [
        '👉 Try clicking a Bar Column: Tap directly on any of the chart\'s color bars! The adjacent information layout panel will dynamically open to reveal associated materials.',
        'Visual color mapping: Each bar inherits its priority scale dye directly from the master registry, sorting from Rose Red to Cyan.'
      ],
      tipVi: 'Bấm click thử lên dải cột màu sắc để trải nghiệm nhé bạn ơi.',
      tipEn: 'Feel free to hover or click on the color bars to see details.',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-trend-cards',
      badgeVi: 'Năng lực xu hướng',
      badgeEn: 'Emerging Trends',
      titleVi: '✨ 4 Thẻ Bento Kỹ năng Xu hướng',
      titleEn: '✨ 4 Elite Emerging Competencies Clusters',
      descVi: 'Bốn ô bento hiển thị chi tiết 4 dải năng lực then chốt hàng đầu: Lãnh đạo, Công nghệ (AI), Giao tiếp và Huấn luyện. Bạn có thể theo sát số lượng nhu cầu phát sinh và tỉ lẹ phủ đào tạo thực tế.',
      descEn: 'Four elegant interactive bento-style cards presenting central skill areas: Leadership, Digital/AI, Communication, and Mentorship.',
      pointsVi: [
        'Thống kê định lượng: Theo sát số lượng yêu cầu học tập (Demands) và tỷ lệ giải quyết (Coverage) thực chất.',
        'Phong cách bento: Bố cục đẹp, icon sắc sảo từ thư viện giúp giao diện bắt mắt và có điểm nhấn cực kỳ.'
      ],
      pointsEn: [
        'Metric analysis: See precisely calculated headcounts requested alongside existing active staff coverage quotas.',
        'Visual cues: Standardized styling, crisp backgrounds, and custom symbols reinforce structural layout hierarchies.'
      ],
      tipVi: 'Hãy nhấn Tiếp tục để xem dải giáo án mẫu biên thiết bằng Trí Tuệ Nhân Tạo nha bạn.',
      tipEn: 'Click Next to learn how to open targeted syllabuses from these blocks.',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-first-bento',
      badgeVi: 'Xem Giáo trình',
      badgeEn: 'Syllabus Trigger',
      titleVi: '🔍 Click Bento để xem Giáo án chi tiết (Syllabus)',
      titleEn: '🔍 Try Clicking Bento for Detailed Syllabus Popup',
      descVi: 'Mỗi bento card đều tương tác tuyệt vời! Bạn hãy BẤM CHUỘT vào thẻ "Lãnh đạo" hoặc "Công nghệ" để bùng mở một cửa sổ Giáo trình mẫu chi tiết do AI biên soạn tương ứng, giúp bạn duyệt nội học trình cực nhanh.',
      descEn: 'Exceptional UX focus here! Click directly on a competency bento card to launch a custom detailed syllabus list generated for that professional field.',
      pointsVi: [
        '👉 Trải nghiệm nhấp bento: Hãy click chuột trái lên thẻ bento Lãnh đạo hoặc Công nghệ có bọc viền nhũ rực rỡ để bật popup giáo án nhé!',
        'Biên soạn thần tốc: Giúp các cấp quản lý và HOD nắm thấu lộ trình bài giảng mà không cần lần tìm file đính kèm.'
      ],
      pointsEn: [
        '👉 CLICK TO EXPERIENCE IT: Left-click on this specific competency bento card! A lovely custom detail sheet slides open to expose targeted curriculum outlines and syllabus contents.',
        'Unified knowledge access: Saves organizational decision-makers hours of browsing by housing structures right next to core gaps.'
      ],
      tipVi: 'Hãy thử nhấp chuột trái lên thân thẻ bento nhũ để chứng kiến popup bùng nở!',
      tipEn: 'Please click the bento card directly to see the syllabus popup in action!',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-competency-details-modal',
      badgeVi: 'Bảng Chi Tiết',
      badgeEn: 'Detail Table',
      titleVi: '📋 Xem Giáo trình mẫu chi tiết từ AI',
      titleEn: '🎯 Competency Detailed Syllabus Layout',
      descVi: 'Cửa sổ vừa hiển thị chính là cuốn học trình hoàn thiện gồm: mục tiêu học phần bồi bồi dưỡng, dải chủ đề giảng dạy và đối tượng đề xuất, giúp bạn phê duyệt kế hoạch đào tạo của Millennium mà không cần xem các file PDF truyền thống.',
      descEn: 'High-fidelity syllabus review is here! Houses curriculum blocks, specific training target parameters, and affected cohorts.',
      pointsVi: [
        'Thiết kế sư phạm: Phân chia cấu trúc bài bài giảng, giờ học, mục tiêu đạt được cụ thể.',
        'Rõ ràng minh bạch: Hỗ trợ người duyệt nắm nhanh tính khả thi của giáo trình để duyệt chi kinh phí.'
      ],
      pointsEn: [
        'Deep educational overview: Inspect core training curriculum with modular class components.',
        'Direct information: Elevates decision-making by placing academic modules adjacent to core gaps.'
      ],
      tipVi: 'Lướt xem nhanh đề cương bài học rồi click Tiếp tục nha!',
      tipEn: 'Click Next to see how to dismiss this list.',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-competency-details-close-btn',
      badgeVi: 'Nút Đóng',
      badgeEn: 'Close Button',
      titleVi: '✕ Nhấn Đóng để tắt Giáo trình',
      titleEn: '❌ Tap "Close" to return to guide',
      descVi: 'Khi đã tham khảo xong khung học liệu, bạn hãy BẤM nút (✕) ở góc phải hoặc nhấp nút "ĐÃ ĐỌC & ĐÓNG" màu xanh phía dưới để tắt đi và quay về bệ lập lịch học.',
      descEn: 'Ready to exit? Click the close [X] icon on the top right, or tap the blue "DISMISS & RETURN" button at the bottom of the card.',
      pointsVi: [
        '👉 Trải nghiệm đóng form: Bấm vào dấu nhân hoặc nút lớn bên dưới để cất gọn popup.',
        'Trượt dòng thông minh: Tour hướng dẫn sẽ tự hiểu bạn đóng form để dẫn lối tiêu điểm xuống kho Khóa học đầu vào.'
      ],
      pointsEn: [
        '👉 CLICK TO EXPERIENCE IT: Click the close [X] icon on the top right, or scroll and tap the blue "DISMISS & RETURN" button!',
        'Chronological syncing: Closing the popup automatically pushes our guide focus down onto the active course inputs deck.'
      ],
      tipVi: 'Hãy nhấn click chuột lên dấu X hoặc nút Đóng bên dưới lân cận nhé bạn.',
      tipEn: 'Left-click standard close elements to return to key dashboard layers.',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-inputs',
      badgeVi: 'Đầu vào Đào tạo',
      badgeEn: 'Course Inputs',
      titleVi: '📥 Nguồn Khóa học đầu vào lập Lịch',
      titleEn: '👉 Course Toggle Deck & Visual Drag Guide Handles',
      descVi: 'Đây là kho chứa các khóa đào tạo đề xuất được tự động sinh ra giúp vá khoảng trống kỹ năng của Millennium. Hãy dùng ô tick góc thẻ để kích hoạt khóa học hoặc bấm trực tiếp vào thẻ để chỉnh sửa.',
      descEn: 'The core deck displaying Millennium\'s 6 suggestion programs generated from local gap reviews, fueling development sequences.',
      pointsVi: [
        'Chỉ dẫn Kéo Thả (Drag cue): Các thẻ khóa đang hoạt động gỡ bỏ móng vuốt kéo cứng, bọc dải viền nhũ sinh động để bạn nhận diện kéo thả.',
        'Bấm tinh tùy chỉnh: Bấm vào thân thẻ để đổi tên khóa học, số giờ học bồi dưỡng hoặc độ ưu tiên cực linh động.'
      ],
      pointsEn: [
        '👉 Animated Drag Handles: Active course cards dynamically present a pulsing border indicator, making draggability immediately intuitive.',
        'Quick Toggle Switch: Tick or untick checkboxes in the upper right to immediately activate or suspend courses from the active timeline.',
        'Inline Editor: Click inside any card body to launch a reactive form modifier for hours, labels, or importance ratings.'
      ],
      tipVi: 'Nhấn Tiếp tục để chúng ta học học cách điều chỉnh giáo thiết lập khóa học.',
      tipEn: 'Click Next to learn how to open a specific course\'s detail customizer.',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-ai-card',
      badgeVi: 'Bật Khóa Học',
      badgeEn: 'Toggle Course',
      titleVi: '💡 Thử thách: Click thẻ để điều chỉnh Khóa học',
      titleEn: '👉 Click on the AI / Automation Course Card',
      descVi: 'Bạn hãy BẤM CHUỘT chuẩn xác lên thẻ "AI/ Tự động hóa trong Văn phòng" màu đỏ để bộc lộ bảng chỉnh sửa nhanh và soạn giáo án giáo trình chi tiết nhé.',
      descEn: 'Let\'s try launching the quick editor! Click directly onto the "AI/ Automation" course card layout to open target parameters.',
      pointsVi: [
        '👉 Trải nghiệm nhấp thử: Gõ chuột trái lên thẻ AI màu đỏ bọc viền nháy rực rỡ.',
        'Đáp ứng tức thời: Bảng tinh chỉnh giáo án từ AI sẽ trỗi dậy lập tức trên màn hình.'
      ],
      pointsEn: [
        '👉 TRY CLICKING: Left-click exactly on this "AI/ Automation" course card!',
        'Active cascade: The interactive course customizer panel overlay will load up instantly.'
      ],
      tipVi: 'Hãy bấm click chuột trái lên thẻ khóa học có viền rực rỡ đầu bảng nha bạn ơi!',
      tipEn: 'Simply click the red AI course card to edit parameters!',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-course-modal',
      badgeVi: 'Chi Tiết Khóa Học',
      badgeEn: 'Course Details',
      titleVi: '📋 Khung tùy biến Khóa học thông minh',
      titleEn: '💡 Overview of AI Syllabus Customizer Modal',
      descVi: 'Form điều phối khóa học giúp bạn đổi tên khóa, thiết lập lượng giờ học bồi dưỡng tối ưu bám sát khoảng trống thực tế và ra lệnh cho AI soạn học liệu chi tiết.',
      descEn: 'A high-fidelity details modifier: Customize academic tags, training duration, month intervals, and trigger AI syllabus formulation.',
      pointsVi: [
        'Dò năng lực bám sát: Đề nghị thời lượng giờ học bồi dưỡng chuẩn khớp khoảng trống bộ kỹ năng Millennium.',
        'Biên học trình từ AI: Lắp ráp khung sườn hành lang chủ đề học trình kĩ lưỡng chỉ với 1 click.'
      ],
      pointsEn: [
        'Gap alignment: Highlights ideal duration based on target department skill gaps.',
        'Smart syllabus generator: Let AI build structured modules for classes with a single click.'
      ],
      tipVi: 'Hãy nhấn Tiếp tục để xem dải tắt đóng popup an toàn nha.',
      tipEn: 'Click Next to see how to dismiss this dialog.',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-course-modal-close-btn',
      badgeVi: 'Nút Tắt',
      badgeEn: 'Close Modal',
      titleVi: '✕ Nhấn Đóng để quay lại dải lập lịch',
      titleEn: '✕ Dismiss quick editor to return',
      descVi: 'Khi đã lưu chỉnh hoặc tham khảo xong, bạn hãy nhấp chọn dấu (✕) ở góc trên bên phải để đóng popup này lại và tiếp tục bước học lập lịch timeline nhé.',
      descEn: 'Done with your edits? Click the standard close cross button (✕) at the top-right corner or CANCEL to return safely.',
      pointsVi: [
        '👉 Thử nghiệm đóng: Bấm click chuột lên dấu X trắng góc form để cất gọn bảng biểu nhỏ.',
        'Lăn trượt đồng bộ: Tour hướng dẫn đóng form xong sẽ tự đẩy góc học xuống dải Gantt Timeline cực đỉnh.'
      ],
      pointsEn: [
        '👉 CLICK TO CLOSE: Left-click on the standard close cross button at the top right!',
        'Auto progress: The guide highlights the interactive Scheduler Timeline next.'
      ],
      tipVi: 'Nhấp chuột trái lên nút X hoặc Cancel để tắt popup đi nha.',
      tipEn: 'Left-click standard close triggers to exit this overlay panel.',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-chronology',
      badgeVi: 'Sơ đồ Timeline',
      badgeEn: 'Timeline Track',
      titleVi: '📅 Lập lịch Timeline kéo thả trực quan',
      titleEn: '📅 Interactive Drag-and-Drop Chronological Timeline',
      descVi: 'Tuyệt phẩm tương tác là đây! Bạn hãy THỬ GIỮ CHUỘT VÀ KÉO THẢ dải băng màu của khóa học để dời dịch tháng bắt đầu hiển thị (từ Tháng 4 đến Tháng 12) hoặc nắm biên của dải để co giãn số tháng huấn luyện vô cùng linh hoạt.',
      descEn: 'This Gantt/Scheduler timeline track puts planning literally in your hands. Shift, scale, or move training blocks anywhere from Month 4 to Month 12 visually.',
      pointsVi: [
        '👉 THỬ KÉO & THẢ: Giữ chuột trái lên thẻ khóa học có viền pulsing đỏ và thử kéo rê thả vào một ô Tháng lân cận bất kì nằm tại dòng Timeline bên trên! Vị trí lịch học khóa sẽ tự dời nhảy bám bám theo thao tác của bạn.',
        'Co dãn thời học: Đưa chuột nắm cạnh viền ngoài của dải băng lịch để kéo trượt rộng dãn số tháng học một cách thông minh mượt mà.'
      ],
      pointsEn: [
        '👉 TRY DRAGGING & DROPPING: Drag any active course card and directly hover and drop it onto any column month heading. Notice how the schedule instantly shifts to reflect your alignment!',
        'Horizontal Slider & Resizer: Hover over schedule bands to click-drag programs left/right, or grip the borders to organically stretch training durations.'
      ],
      tipVi: 'Hãy dời dải màu của khóa AI sang Tháng khác để trải nghiệm tính năng Gantt thời gian thực nhé!',
      tipEn: 'Gently hover and drag program coordinates on the timeline to reorganize the curriculum schedule.',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-matrix',
      badgeVi: 'Ma trận Đề xuất',
      badgeEn: 'Proposal Matrix',
      titleVi: '📋 Ma trận Kế hoạch Đào tạo Đề xuất',
      titleEn: 'Proposal Framework Matrix Overview',
      descVi: 'Đây là sổ cái thông số tổng thể của kế hoạch đào tạo, hiển thị rõ số lượng học viên dự kiến, dải mức độ ưu tiên và tích hợp nút xuất tệp báo cáo Excel/CSV chỉ trong 1 click.',
      descEn: 'The suggested suggesting suggested suggested Suggested suggested Suggested suggesting Suggested suggesting suggesting Suggested suggested',
      pointsVi: [
        'Quản lý bao phủ: Thống kê số lượng học viên, dải giờ, giáo mục và tình trạng phê duyệt theo các tháng thiết lập.',
        'Xuất Excel tích tắc: Nhấn chọn nút "Xuất CSV" để lưu dải kế hoạch về máy tính làm báo cáo gửi ban Giám đốc.'
      ],
      pointsEn: [
        'Consolidated spreadsheet view: Inspect metrics regarding projected participant pools, prioritization, and course curricula.',
        'Instant CSV Export: Ready for integration with corporate offices via a single-click CSV spreadsheet download.'
      ],
      tipVi: 'Bấm click Tiếp tục để chúng ta khám phá dải Tỷ lệ Phủ đào tạo nha bạn.',
      tipEn: 'Use the Export CSV button on the right edge to save Excel layouts.',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-matrix-coverage',
      badgeVi: 'Cột Tỷ lệ Phủ',
      badgeEn: 'Coverage Column',
      titleVi: '📊 Cột chỉ số Tỷ lệ phủ Đào tạo',
      titleEn: '📊 Training Coverage Column',
      descVi: 'Cột hiển thị thước đo định lượng cực kỳ quan trọng thể hiện mức độ đáp ứng kỹ năng của khóa học đối với các khoảng trống của phòng ban. Bấm chọn tiêu đề cột để sắp xếp thứ tự ưu tiên dễ dàng.',
      descEn: 'This column indicates the Coverage percentage, representing how much of the Millennium competency requirements are met by each training program.',
      pointsVi: [
        'Thuật toán đồng dạng: Đo dải % phủ chính xác bám sát số Growers/Keepers/Movers thực chất trên sàn Millennium.',
        'Nhấn chọn tiêu đề sắp xếp: Sắp xếp danh sách ngược xuôi để định vị khóa học phủ sâu nhất.'
      ],
      pointsEn: [
        'Accoladed calculation: Computed based on skill gaps on the plant floor.',
        'Sort options: Click on the header cell to sort programs by coverage rate.'
      ],
      tipVi: 'Bấm tiêu đề cột Tỉ lệ phủ để sắp xếp thứ tự tăng/giảm dần nhé.',
      tipEn: 'Sort coverage metrics by clicking directly on the column header cell!',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-matrix-depts',
      badgeVi: 'Bung Phòng Ban',
      badgeEn: 'Expand Departments',
      titleVi: '⚡ Thử thách: Click số % để bung phòng ban chi tiết',
      titleEn: '⚡ Tap to Toggle Department Breakdowns',
      descVi: 'Bạn hãy BẤM THẲNG vào con số tỷ lệ phần trăm (%) ở cột Tỷ lệ phủ. Hệ thống sẽ bộc lộ ngay danh sách các bộ phận đang có nhu cầu đào tạo tương ứng ngay phía dưới dòng đó.',
      descEn: 'This percentage indicator toggles detailed department breakdowns. CLICK directly on this item to inspect which organizational teams require this specific curriculum!',
      pointsVi: [
        '👉 Trải nghiệm nhấp số %: Click chuột lên con số % bất kì màu sắc để trải nghiệm hiệu ứng bung dòng phòng ban cực bắt mắt.',
        'Chi tiết bộ phận yêu cầu: Cho biết PE, Quality hay Warehouse chiếm học số bao nhiêu người.'
      ],
      pointsEn: [
        '👉 PRACTICE TIME: Tap this percentage badge directly to toggle-expand the departments sub-table block below the row!',
        'Fine-grained monitoring: View the counts of personnel awaiting training across individual sections.'
      ],
      tipVi: 'Hãy click gõ chuột trái trực tiếp lên ô số % màu xanh/đỏ để trải nghiệm bung phòng ban nha bạn ơi!',
      tipEn: 'Tap the percentage number to expand department targets!',
      targetTab: 'tab-devplan'
    },
    {
      targetId: 'onboarding-devplan-expanded-depts',
      badgeVi: 'Danh sách Phòng Ban',
      badgeEn: 'Department List',
      titleVi: '📂 Danh sách bộ phận yêu cầu chi tiết',
      titleEn: 'Expanded Departments List',
      descVi: 'Đây là danh sách hiển thị tất cả các phòng ban (như Quality Assurance, PE, Logistics, Mattress...) có đề cập đến kỹ năng này. Giao diện này giúp bạn nắm bắt nhanh chóng kỹ năng tương ứng đang được yêu cầu từ các phòng ban nào và với số lượng nhân viên cần bồi dưỡng cụ thể tại mỗi nơi là bao nhiêu.',
      descEn: 'This list displays all business units (such as Quality Assurance, PE, Logistics, Mattress) requiring this competency. It helps you immediately identify where this skill gap originates and the specific trainee counts at each department.',
      pointsVi: [
        'Xem độ phân bố nhu cầu: Giúp bạn biết rõ từng kỹ năng đang cần thiết ở những phòng ban nào để lên giáo trình sát sườn.',
        'Khớp nối phòng ban gốc: Các nhãn bộ phận được đồng bộ chuẩn xác với cơ sở dữ liệu nhân sự Millennium để phân bổ chính xác nguồn lực.'
      ],
      pointsEn: [
        'Analyze skill distribution: View exactly which teams require this training to target your design budget effectively.',
        'Unified department alignment: Kept standard English labels consistent with parent database fields for reliable mapping.'
      ],
      tipVi: 'Xin chúc mừng bạn đã xuất sắc vượt qua Tour Kế hoạch Đào tạo nâng tầm! Nhấn "Hoàn thành" để đi tiếp nhé.',
      tipEn: 'Incredible success! You have completed our suggested development syllabus guide! Click Finish to close this tour.',
      targetTab: 'tab-devplan'
    }
  ];

    // --- INDIVIDUAL IDP WORKSPACE WALKTHROUGH ---
  const stepsIDP: OnboardingStep[] = [
    {
      targetId: 'onboarding-idp-metrics-block',
      badgeVi: '1. Chỉ số tóm tắt',
      badgeEn: '1. Dashboard Cards',
      titleVi: '📊 Khối chỉ số tổng quan IDP của bộ phận',
      titleEn: '📊 Department IDP Overall Dashboard KPIs',
      descVi: 'Đây là các ô chỉ số vĩ mô của bộ phận. Các ô này tóm tắt số lượng nhân sự tham gia lập kế hoạch phát triển cá nhân (IDP) và mật độ R1 đến R4 của bộ phận. Mục đích là giúp bạn có cái nhìn nhanh về mức sẵn sàng tổng thể trước khi đi sâu vào chi tiết.',
      descEn: 'Provides an instant bird-eye overview tracking overall IDP completion rates and readiness counts from R1 (low readiness) to R4 (high autonomous execution).',
      pointsVi: [
        'Xem lượng nhân sự thực tế: Thống kê tổng số lượng nhân viên thực tế có lộ trình phát triển.',
        'Mạch lạc trực quan: Giúp nhà quản trị so sánh nhanh tiến độ và độ phủ của các kế hoạch.'
      ],
      pointsEn: [
        'Total headcount: Dynamically calculates all employees in the current dashboard view.',
        'Visual summary: Allows quick analysis of current readiness statistics across teams.'
      ],
      tipVi: 'Chúng ta hãy bắt đầu hành trình bằng việc quan sát khối chỉ số tổng quan này nhé!',
      tipEn: 'We start our IDP tour with these macro-level dashboard metric boxes!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-table-container',
      badgeVi: '2. Bảng quản lý IDP',
      badgeEn: '2. Plan Review Table',
      titleVi: '📋 Danh sách lộ trình phát triển chi tiết',
      titleEn: '📋 Detailed IDP Plan Review Table',
      descVi: 'Đây là bảng danh sách tổng hợp kế hoạch IDP của các nhân sự. Bảng này hiển thị đầy đủ thông tin định danh và dải phân bổ năng lực cụ thể của từng người. Bạn hãy dùng nó để theo dõi sát sao tiến trình học tập của đội ngũ.',
      descEn: 'Presents a complete scrollable outline of the overall IDPs, summarizing IDs, names (e.g. Angela Tran), departments, and adaptation counts.',
      pointsVi: [
        'Thông tin đồng bộ: Phản ánh chi tiết kết quả rà soát của từng thành viên trong đơn vị.',
        'Dễ dàng đối soát: Rà soát nhanh các chỉ số liên quan tiện lợi, gọn gàng.'
      ],
      pointsEn: [
        'Unified record logs: Access and crosscheck items across teammate groups.',
        'Intuitive overview: Review overall statuses comfortably.'
      ],
      tipVi: 'Bây giờ, hãy cùng lướt qua các hàng nhân sự ở bên dưới nhé!',
      tipEn: 'Now, let us move down to examine individual employee rows!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-row-rating',
      badgeVi: '3. Phân hạng R-Rating',
      badgeEn: '3. Readiness Overview',
      titleVi: '🎯 Xem phân bổ mức sẵn sàng thích ứng R1 - R4',
      titleEn: '🎯 Readiness Ratings Segment R1 - R4 & Column Title',
      descVi: 'Đây là chỉ số R-Rating, thể hiện độ sẵn sàng thực thi độc lập của nhân viên từ R1 (mới nhận việc, cần hướng dẫn sát) đến R4 (làm chủ công việc, được ủy quyền chủ động). Mục đích là giúp bạn định vị nhanh khoảng trống năng lực để phân bổ mentor kèm cặp phù hợp. Bạn chỉ cần quan sát phần này, không cần bấm nhé!',
      descEn: 'Shows task ratios from standard beginner R1 (requires high directive style) to senior R4 (fully delegated autonomy), ensuring strategic team configuration. Read-only highlight!',
      pointsVi: [
        'Định vị năng lực: Nhìn nhanh dải R1 -> R4 để nhanh chóng có sách lược đào tạo.',
        'Không cần click: Giao diện này chỉ yêu cầu highlight giới thiệu thông tin trực quan.'
      ],
      pointsEn: [
        'Track capabilities: Spot developmental splits instantly at a glance.',
        'Read-only highlight: Simply review this key metric; no direct click is needed here.'
      ],
      tipVi: 'Hãy rà soát kỹ các xếp hạng R-Rating để lên phương án hỗ trợ tối ưu nhất!',
      tipEn: 'Review the detailed R-ratings distribution on the first row to determine next steps.',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-row-priority',
      badgeVi: '4. Xem việc khẩn cấp',
      badgeEn: '4. Priority Filter Button',
      titleVi: '🔥 Lọc nhanh các nhiệm vụ ưu tiên khẩn cấp',
      titleEn: '🔥 Action: Open Burning Priorities Group',
      descVi: 'Mỗi nhân viên sẽ có một vài mục tiêu khẩn cấp, cần ưu tiên hoàn thành trước. Bạn hãy CLICK vào nút "🔥 4 ƯU TIÊN" của Angela Tran để kích hoạt bộ lọc, giúp dồn sự tập trung vào các điểm nghẽn quan trọng nhất của cô ấy.',
      descEn: 'Isolates and highlights only the burning priorities assigned to the worker. CLICK on this pulsing fire badge to launch the filtered modal!',
      pointsVi: [
        'Bộ lọc ưu tiên: Bấm trực tiếp vào nút lửa màu sắc để mở riêng hồ sơ của Angela Tran.',
        'Dọn sạch nhiễu: Loại bỏ các đầu việc chưa gấp, bừng sáng rõ nét nút thắt khẩn cấp.'
      ],
      pointsEn: [
        'Trigger priority filter: Click directly on this badge to show Angela Tran\'s profile in priority mode.',
        'Eliminate noise: Immediately view the critical bottlenecks that require focus.'
      ],
      tipVi: 'Hãy BẤM chọn biểu tượng "4 ƯU TIÊN" trên dòng của Angela Tran để kiểm tra ngay nhé!',
      tipEn: 'Click on the "4 PRIORITY" red badge in the first row to open the modal directly under a priority-only filter!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-modal-table',
      badgeVi: '5. Bản ghi ưu tiên',
      badgeEn: '5. Review Priority Filter',
      titleVi: '🔥 Bảng lọc nhiệm vụ khẩn cấp tự động',
      titleEn: '🔥 Table Showing Priority Tasks Only',
      descVi: 'Hệ thống đã tự động lọc sạch các nội dung nhiễu và chỉ hiển thị đúng 4 nhiệm vụ khẩn cấp của Angela Tran. Bản ghi này giúp bạn rà soát và đánh giá nhanh các mục tiêu trọng điểm mà không tốn thời gian đọc toàn bộ lộ trình.',
      descEn: 'The detailed modal is now open under the dynamic priority filter. Notice that the roadmap table contains ONLY the high-importance priority tasks of Angela Tran.',
      pointsVi: [
        'Đúng mức ưu tiên: Bản ghi lọc sạch sẽ, bỏ qua các nhiệm vụ đại trà chưa khẩn cấp.',
        'Hỗ trợ tập trung: Nhà quản lý đánh giá nhanh chóng và đề ra phương án hỗ trợ kịp thời.'
      ],
      pointsEn: [
        'Filtered precision: Roadmaps show only rows tagged as high priority.',
        'Enhanced actionability: Spot bottleneck developments directly without reading filler lines.'
      ],
      tipVi: 'Khi chỉ hiển thị các mục ưu tiên, bảng sẽ ngắn gọn hơn rất nhiều. Hãy bấm Tiếp tục!',
      tipEn: 'This list strictly filters down to the hot priorities. Click "Next" to continue!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-modal-close-btn',
      badgeVi: '6. Tắt cửa sổ lọc',
      badgeEn: '6. Close Priority Modal',
      titleVi: '❌ Đóng bảng xem ưu tiên khẩn cấp',
      titleEn: '❌ Dismiss and Close Priority Filter View',
      descVi: 'Sau khi rà soát xong, bạn hãy CLICK vào biểu tượng đóng (✕) ở góc trên bên phải để tắt bảng thu gọn này đi. Chúng ta sẽ cùng chuẩn bị mở xem lộ trình học tập đầy đủ không giới hạn.',
      descEn: 'With the priority review finished, let\'s CLICK the close button (X) at the top-right to safely close this pop-up card.',
      pointsVi: [
        'Đóng nhanh gọn: Click nút X đưa chúng ta trở lại danh sách rà soát ban đầu.',
        'Sẵn sàng lộ trình đầy đủ: Để sau đó chúng ta mở toàn vẹn lộ trình đào tạo không giới hạn.'
      ],
      pointsEn: [
        'Clean exit: Closes the modal smoothly to return to the root workspace.',
        'Next steps: Click the close button to proceed to the full development plan review.'
      ],
      tipVi: 'Hãy nhấn vào biểu tượng (✕) để đóng bảng này lại nhé!',
      tipEn: 'Tap the close button (X) now to back out and proceed to the unfiltered roadmap!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-row-view-plan',
      badgeVi: '7. Toàn bộ lộ trình',
      badgeEn: '7. View 8 Roadmaps',
      titleVi: '🧭 Bấm để xem toàn bộ 8 lộ trình phát triển',
      titleEn: '🧭 Action: View Complete 8 Roadmap Items',
      descVi: 'Bây giờ, bạn hãy CLICK vào nút "Xem lộ trình (8)" màu xanh dương của Angela Tran. Nút này giúp bừng mở toàn bộ danh sách 8 mục phát triển chi tiết, đồng dạng kích hoạt các công cụ trợ giúp AI cá nhân hóa.',
      descEn: 'Now, let\'s CLICK on the blue "View Plan (8)" button to load the full unfiltered development roster of Angela Tran with her 8 roadmap goals.',
      pointsVi: [
        'Mở rà soát đầy đủ: Tiếp cận toàn diện 8 chương trình và hành động phát triển.',
        'Bật tính năng AI: Sẵn sàng các dải công cụ phân tích và tư vấn khóa học trực quan.'
      ],
      pointsEn: [
        'Full portfolio access: Opens all 8 action plans without any pre-applied priority filters.',
        'Visual layouts: Instantly prepares AI coaching logs and development timelines for review.'
      ],
      tipVi: 'Hãy click vào nút "Xem lộ trình" màu xanh dương ở dòng đầu tiên nhé!',
      tipEn: 'Click the "View Plan" button in the first row to pop open the full development dossier!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-modal',
      badgeVi: '8. Hồ sơ cá nhân',
      badgeEn: '8. Angela\'s IDP Portfolio',
      titleVi: '👤 Khảo sát thông tin cá nhân của Angela Tran',
      titleEn: '👤 Angela Tran (Mã NV: 22596) Profile View',
      descVi: 'Chào mừng bạn đến với Hồ sơ Lộ trình đào tạo cá nhân (IDP) chi tiết của Angela Tran (Trần Thị Thu Hà) - Mã số NV: 22596, vị trí EHS Trainer, phòng ban EHS. Toàn bộ thông tin định danh được đồng bộ chuẩn xác từ hồ sơ nhân sự.',
      descEn: 'The detailed portfolio has opened! Here you are reviewing Trần Thị Thu Hà (Angela Tran), ID 22596, from EHS department.',
      pointsVi: [
        'Họ tên & ID chuẩn hóa: Đặt nổi bật, sáng rõ góc trên giúp hướng dòng mắt dễ dàng.',
        'Thông tin khớp nối: Đồng bộ 100% chức vụ, site thuộc, tổ chuyên môn của nhân sự.'
      ],
      pointsEn: [
        'Primary Identity: Clearly emphasizes name and employee codes in the header bar.',
        'Real-time integration: Fully synchronized with titles and section names from the database.'
      ],
      tipVi: 'Hãy quan sát dải thông tin màu tối nổi bật ở trên cùng trước khi đi tiếp!',
      tipEn: 'Observe the clear ID and info panel at the top header of the modal!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-ai-panel',
      badgeVi: '9. Trợ lý AI khuyên học',
      badgeEn: '9. Progress & AI',
      titleVi: '✨ Tiến độ thực tế và Đề xuất khóa học thông minh',
      titleEn: '✨ IDP Setup Progress & AI Personalized Suggestions',
      descVi: 'Đây là khu vực hiển thị Tiến độ hoàn thành (%) cùng với Trợ lý AI cá nhân hóa. AI sẽ tự động phân tích những khoảng trống kỹ năng hiện tại của Angela Tran để gợi ý ngay những khóa học thiết thực nhất. Bạn có thể ẩn/hiện khu vực này bằng nút bấm tiện ích.',
      descEn: 'Monitors training setups (%) and consults our smart AI assistant which auto-recommends optimized training courses based on actual capability gaps of Angela Tran.',
      pointsVi: [
        'Thanh tiến trình: Thể hiện sinh động lượng năng lực thích nghi tích lũy của nhân sự.',
        'Khóa học từ AI đề cử: Phân tách rõ kỹ năng cứng/mềm và gợi ý giải pháp bồi dưỡng OJT.'
      ],
      pointsEn: [
        'Linear timeline progression: Visual charts depicting learning benchmarks and readiness completion.',
        'AI targeted recommendations: Dynamically advises tailored courses and OJT schemes based on plans.'
      ],
      tipVi: 'Bạn có thể thu gọn bảng AI này bất cứ lúc nào để có thêm không gian đọc dữ liệu!',
      tipEn: 'You can toggle or hide this panel easily by using the "Expand/Collapse AI Panel" button!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-modal-table',
      badgeVi: '10. Bảng IDP chi tiết',
      badgeEn: '10. Detailed Roadmap Table',
      titleVi: '📋 Giao diện bảng lộ trình phát triển đầy đủ',
      titleEn: '📋 Introduction to Detailed Table Header Columns',
      descVi: 'Đây là bảng chi tiết 8 hạng mục phát triển của Angela Tran. Bảng này hiển thị đầy đủ: kỹ năng cốt lõi cần đào tạo, mức độ sẵn sàng R1 - R4, người kèm cặp (Mentor) và khóa học đề xuất, giúp bạn có cái nhìn toàn diện để dễ dàng quản lý.',
      descEn: 'Presents the comprehensive development sheet of 8 roadmap items. Notice the dark table header row at the top summarizing crucial items: STT, Index Code, Core Skills/Tasks, R1 - R4 Readiness Ratings, Mentor assignments, and Proposed L&D Classes.',
      pointsVi: [
        'Tiêu đề rõ rệt: Làm rõ dải phân lớp R1-R4, người bảo trợ và dải khóa học đề xuất.',
        'Tiện lợi cuốn cuộn: Thanh tiêu đề cố định giúp rà soát cực kỳ thuận tiện và không mỏi mắt.'
      ],
      pointsEn: [
        'Structured header: Highlights columns for core goals, R1-R4 distributions, assigned mentors, and courses.',
        'Aligned autoscroll: Ensures the main dark header row remains comfortably inside the viewport for easy review.'
      ],
      tipVi: 'Hãy rà soát kỹ hàng tiêu đề tối màu của bảng chi tiết ở trên nhé!',
      tipEn: 'Review the detailed column titles at the top of the table before we continue!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-edit-btn',
      badgeVi: '11. Nút Chỉnh sửa',
      badgeEn: '11. Edit Button',
      titleVi: '✏️ Khởi động tính năng chỉnh sửa dòng lộ trình',
      titleEn: '✏️ IDP Row Edit Action Trigger',
      descVi: 'Để thuận tiện cho bạn cập nhật thông tin dòng, hệ thống đã chủ động cuộn bảng sang phải để làm lộ diện cột Thao tác. Bạn hãy CLICK vào nút "Sửa" có biểu tượng cây bút của dòng đầu tiên để chuẩn bị điều chỉnh thông số.',
      descEn: 'Under the Action columns of the table, you can trigger full-fidelity edits. The guide has automatically scrolled horizontally to the far right columns. CLICK the "Sửa" (Edit) button of the first row to prompt the float editor!',
      pointsVi: [
        'Căn lề tự động: Trượt nhanh bảng dữ liệu sang ngang, giúp thao tác trực diện vô cùng thoải mái.',
        'Tính năng hiệu chỉnh: Cho phép can thiệp bổ sung mô tả, điều chỉnh mentor và niên hạn.'
      ],
      pointsEn: [
        'Horizontal autoscroll: Directs you straight to the end column to prevent scrolling fatigue.',
        'Contextual inputs: Change timelines, comment logs, way forwards or priority indices.'
      ],
      tipVi: 'Hãy bấm trực tiếp vào nút "Sửa" ở cạnh phải dòng đầu tiên nhé!',
      tipEn: 'Click the edit "Sửa" button on the right edge of the first row to pop open the editor dialog!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-edit-modal-body',
      badgeVi: '12. Form điều chỉnh',
      badgeEn: '12. Detailed Edit Form',
      titleVi: '✏️ Bảng Chỉnh sửa thông tin lộ trình chi tiết',
      titleEn: '✏️ Overview of the Detailed Edit Form Popup',
      descVi: 'Đây là Form chỉnh sửa chi tiết. Tại đây, bạn có thể thay đổi mức ưu tiên, nâng cấp đánh giá R-Rating, chỉnh sửa thời hạn, nhập nhận xét hoặc bổ sung cách thức thực hiện. Khi bạn Lưu lại, toàn bộ tiến độ và chỉ số sẽ cập nhật đồng bộ tức thì!',
      descEn: 'The floating edit dialog has opened above the sheet. Observe how the system organizes fields: modify Priority, Competency category, R-Rating benchmarks, Timelines, Comments, and your Kế hoạch phát triển (Development Actions). Modifying values here dynamically syncs active progress bars immediately!',
      pointsVi: [
        'Giao diện trực quan: Sắp đặt rõ ràng giúp điều chỉnh nhanh các thông tin cốt yếu nhất.',
        'Cơ chế đồng bộ: Phản hồi lập tức các thay đổi lên biểu đồ tiến trình và KPI.'
      ],
      pointsEn: [
        'Visual entry fields: Modify priority ranks, mentors, and timelines side-by-side.',
        'Dynamic sync: Instantly updates back to the master IDP chart and dashboard tags.'
      ],
      tipVi: 'Hãy rà soát nhanh các trường dữ liệu trên form rồi nhấn Tiếp tục nhé!',
      tipEn: 'Review all the input fields quickly, then click Next!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-edit-modal-close-btn',
      badgeVi: '13. Đóng Form sửa',
      badgeEn: '13. Dismiss Editor',
      titleVi: '✕ Đóng hộp thoại Chỉnh sửa',
      titleEn: '✕ Dismiss Editor and Close Popup',
      descVi: 'Khi đã xem xong hoặc lưu cập nhật thành công, bạn chỉ cần CLICK vào biểu tượng dấu (✕) ở góc trên bên phải để đóng biểu mẫu điều chỉnh này lại một cách an toàn và thuận tiện.',
      descEn: 'With the roadmap row updated, let\'s CLICK the corner X button to close this editor safely!',
      pointsVi: [
        'Hoàn tất an tâm: Đóng form an toàn mà không lo bị mất mát hay rò rỉ dữ liệu dở dang.',
        'Xóa nhiễu tầm nhìn: Đưa bạn quay lại ngay với giao diện xem lộ trình chính của Angela Tran.'
      ],
      pointsEn: [
        'Safe dismiss: Tap the corner close X to close the panel comfortably.',
        'Focus restored: Restores focus back onto the primary IDP table entries.'
      ],
      tipVi: 'Hãy CLICK vào biểu tượng ✕ ở góc trên bên phải của form chỉnh sửa để đi tiếp!',
      tipEn: 'Click the corner close X button now to dismiss the editor and continue!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-modal-close-btn',
      badgeVi: '14. Đóng Hồ sơ',
      badgeEn: '14. Exit Modal',
      titleVi: '❌ Đóng bảng chi tiết Hồ sơ IDP',
      titleEn: '❌ Close Angela\'s Detailed Portfolio',
      descVi: 'Bạn đã hoàn tất việc rà soát tất cả 8 hạng mục lộ trình phát triển của Angela Tran! Bây giờ, bạn hãy CLICK vào biểu tượng dấu (✕) ở góc trên bên phải để đóng hồ sơ cá nhân và quay lại trang quản lý chung của bộ phận.',
      descEn: 'Our inspection of Angela\'s comprehensive roadmap goals is complete. Now, CLICK on the close button (X) at the top-right to shut down the card overlay.',
      pointsVi: [
        'Trượt lướt mượt mà: Quay lại giao diện quản lý vĩ mô của toàn bộ phòng ban.',
        'Trạng thái bảo toàn: Đảm bảo các cấu hình tìm kiếm và sắp xếp của bạn không bị xáo trộn.'
      ],
      pointsEn: [
        'Clean transition: Triggers immediate exit to return to the core tab.',
        'Workflow safety: All underlying lists and metric boxes retain their original layouts.'
      ],
      tipVi: 'Hãy nhấn vào biểu tượng ✕ ở góc trên bên phải để đóng hồ sơ chi tiết nhé!',
      tipEn: 'Click the X close button at the top-right now to shut down the portfolio modal!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-search-filter-panel',
      badgeVi: '15. Lọc thông minh',
      badgeEn: '15. Dept & R-Rating Selector',
      titleVi: '🔍 Bộ công cụ lọc Phòng ban và Chỉ số R-Rating',
      titleEn: '🔍 Department & R-Rating Filter Tools',
      descVi: 'Hệ thống đã đưa bạn quay lại màn hình chính! Đây là bộ chọn phòng ban (được giữ nguyên tên tiếng Anh chuẩn như EHS, Quality Control, Warehouse...) ghép cặp với bộ lọc R1-R4 nhằm giúp bạn dễ dàng sàng lọc và bồi dưỡng nhân sự cho các bộ phận khác.',
      descEn: 'Back to the main screen! Focuses on the Department filter panel (preserving original English values like Quality Control, Warehouse, Mattress...) and R1 - R4 selects to search other segments.',
      pointsVi: [
        'Đồng bộ tên chính thức: Giúp đối soát nhất quán với cơ sở dữ liệu Millennium mà không lo dịch nhầm.',
        'Lọc đa chiều thông suốt: Giúp bạn dễ hoạch định chiến lược bồi dưỡng độc lập cho từng tổ nhóm.'
      ],
      pointsEn: [
        'Original department names preserved: Safeguards against translation confusion.',
        'Multidimensional query: Narrow down segment search or schedule custom courses.'
      ],
      tipVi: 'Hãy nhấn Tiếp tục để chuyển sang dốc nạp tài liệu cuối cùng của lộ trình!',
      tipEn: 'Click "Next" to continue to the final plan uploading zone!',
      targetTab: 'tab-indiv-idp'
    },
    {
      targetId: 'onboarding-idp-upload-zone',
      badgeVi: '16. Tải lên IDP',
      badgeEn: '16. Ingest IDP Plan',
      titleVi: '📤 Khép lại chuỗi hướng dẫn: Cổng tải lên IDP',
      titleEn: '📤 Conclude IDP Tour: Ingest Development Plan',
      descVi: 'Đây là Cổng nộp file kế hoạch IDP. Bạn có thể dễ dàng tải lên hoặc đồng bộ hóa các chương trình đào tạo ngoại tuyến mới bằng phương thức kéo thả trực quan các tệp Excel/CSV vào vùng hiển thị này.',
      descEn: 'Conclude the tour here! Instantly sync new offline reviews or plan matrices into our platform using this unified drag-and-drop gateway.',
      pointsVi: [
        'Kết nối hoàn thiện: Khép kín toàn bộ lộ trình: từ rà soát, đánh giá đến tải lên đồng bộ.',
        'Tour hướng dẫn hoàn thành: Bạn đã nắm vững mọi chiêu thức và sẵn sàng vận hành IDP thực tế!'
      ],
      pointsEn: [
        'End-to-end flow: Closes the plan cycle from inspection down to raw storage ingest.',
        'Tour concluded: You are now fully trained and ready to launch individual IDP schemes!'
      ],
      tipVi: 'Bạn đã hoàn tất xuất sắc khóa học hành lang Lộ trình phát triển cá nhân (IDP)! Chúc mừng bạn!',
      tipEn: 'The interactive IDP onboarding tour is now successfully complete! Congratulations!',
      targetTab: 'tab-indiv-idp'
    }
  ];

  const activeSteps = 
    guideMode === '9BOX' 
      ? steps9Box 
      : guideMode === 'PIPELINE' 
        ? stepsPipeline 
        : guideMode === 'IDP'
          ? stepsIDP
          : stepsDevPlan;

  const safeAdvanceStep = () => {
    const now = Date.now();
    if (now - lastAdvanceTimeRef.current < 250) {
      return;
    }
    lastAdvanceTimeRef.current = now;
    setCurrentStep(prev => Math.min(activeSteps.length - 1, prev + 1));
  };

  // Sync state when open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setGuideMode('SELECT');
    } else {
      setHighlightRect(null);
      setClickTargetRect(null);
    }
  }, [isOpen]);

  // Handle auto tab-switching during step transition
  useEffect(() => {
    if (!isOpen || guideMode === 'SELECT') return;

    const step = activeSteps[currentStep];
    if (!step) return;

    if (step.targetTab && activeTab !== step.targetTab) {
      onChangeTab(step.targetTab);
    }

    // --- AUTOMATIC HOTSPOT SUB-TAB CLICKING TRIGER ---
    if (step.targetId.startsWith('onboarding-pipeline-hr-') || step.targetId === 'onboarding-pipeline-hotspots-tab-highrisk') {
      const btn = document.getElementById('onboarding-pipeline-hotspots-tab-highrisk');
      if (btn) {
        btn.click();
      }
    } else if (step.targetId.startsWith('onboarding-pipeline-fail-') || step.targetId === 'onboarding-pipeline-hotspots-tab-failed') {
      const btn = document.getElementById('onboarding-pipeline-hotspots-tab-failed');
      if (btn) {
        btn.click();
      }
    } else if (step.targetId.startsWith('onboarding-pipeline-critical-') || step.targetId === 'onboarding-pipeline-hotspots-tab-critical' || step.targetId === 'onboarding-pipeline-hotspots') {
      const btn = document.getElementById('onboarding-pipeline-hotspots-tab-critical');
      if (btn) {
        btn.click();
      }
    }

    // --- AUTOMATIC 9-BOX INTERACTIONS ---
    if (guideMode === '9BOX') {
      const targetsToClick = [
        'onboarding-cell-superstar',
        'onboarding-cell-seasoned',
        'onboarding-kpi-card-growers',
        'onboarding-kpi-card-keepers',
        'onboarding-kpi-card-movers',
        'onboarding-kpi-card-total',
        'onboarding-dept-tab-overview',
        'onboarding-dept-tab-insights'
      ];
      if (targetsToClick.includes(step.targetId)) {
        setTimeout(() => {
          const targetEl = document.getElementById(step.targetId);
          if (targetEl) {
            targetEl.click();
          }
        }, 300);
      }
    }

    // Delay scroll offset calculations to let tab view mount
    const token = setTimeout(() => {
      const el = document.getElementById(step.targetId);
      if (el) {
        // --- CUSTOM SUB-SCROLL POSITION DIRECTORS ---
        if (guideMode === 'IDP') {
          const targetId = step.targetId;

          // 1. Scroll main review list container horizontally to center rating, priority, or view plan columns
          if (targetId === 'onboarding-idp-row-rating' || targetId === 'onboarding-idp-row-priority' || targetId === 'onboarding-idp-row-view-plan') {
            const container = document.getElementById('onboarding-idp-outer-table-scroll-container');
            if (container) {
              let scrollLeftPos = 0;
              if (targetId === 'onboarding-idp-row-rating') scrollLeftPos = 280;
              else if (targetId === 'onboarding-idp-row-priority') scrollLeftPos = 480;
              else if (targetId === 'onboarding-idp-row-view-plan') scrollLeftPos = 750;

              container.scrollTo({
                left: scrollLeftPos,
                behavior: 'smooth'
              });
            }
          }

          // 2. Scroll modal body vertically to fully reveal components inside the IDP Detailed Modal
          if (targetId === 'onboarding-idp-modal-table' || targetId === 'onboarding-idp-edit-btn') {
            const modalBody = document.getElementById('onboarding-idp-modal-body');
            const tableEl = document.getElementById('onboarding-idp-modal-table');
            if (modalBody && tableEl) {
              modalBody.scrollTo({
                top: tableEl.offsetTop - 15, // Align detailed table top nicely with its headers at viewport top
                behavior: 'smooth'
              });
            }
          } else if (targetId === 'onboarding-idp-ai-panel' || targetId === 'onboarding-idp-modal') {
            const modalBody = document.getElementById('onboarding-idp-modal-body');
            if (modalBody) {
              modalBody.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }
          }

          // 3. Scroll detailed table horizontal container to reveal Edit button on far right column
          if (targetId === 'onboarding-idp-edit-btn') {
            const tableScroll = document.getElementById('onboarding-idp-modal-table-scroll-container');
            if (tableScroll) {
              tableScroll.scrollTo({
                left: 9999, // Scroll to the end of columns (Far right column)
                behavior: 'smooth'
              });
            }
          } else if (targetId === 'onboarding-idp-modal-table') {
            const tableScroll = document.getElementById('onboarding-idp-modal-table-scroll-container');
            if (tableScroll) {
              tableScroll.scrollTo({
                left: 0, // Reset to visual start
                behavior: 'smooth'
              });
            }
          }
        }

        if (['onboarding-dept-strengths', 'onboarding-dept-risks', 'onboarding-dept-actions'].includes(step.targetId)) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const rect = el.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          let targetY = scrollTop + rect.top - (window.innerHeight / 2) + (rect.height / 2);
          
          if (step.targetId === 'onboarding-idp-table-container') {
            targetY = scrollTop + rect.top - 120; // Align table top nicely in sight
          }
          
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: 'smooth'
          });
        }

        setTimeout(updateHighlightCoordinates, 400);
      } else {
        setHighlightRect(null);
      }
    }, 200);

    return () => clearTimeout(token);
  }, [currentStep, guideMode, isOpen]);

  // Hook resize observer to card measurements
  useEffect(() => {
    if (isOpen && cardRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentBoxSize 
            ? entry.contentBoxSize[0].blockSize 
            : entry.target.clientHeight;
          if (height > 0) {
            setCardHeight(height);
          }
        }
      });
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }
  }, [isOpen, currentStep, guideMode]);

  // Event listener hook to auto-advance onboarding on user interaction signals
  useEffect(() => {
    if (!isOpen) return;

    // Advanced, capture-phase document listener to auto-next clickable hotspots with complete safety
    const handleGlobalClick = (e: MouseEvent) => {
      const step = activeSteps[currentStep];
      if (!step) return;

      const targetEl = document.getElementById(step.targetId);
      if (targetEl && (targetEl === e.target || targetEl.contains(e.target as Node))) {
        const devPlanTargets = [
          'onboarding-devplan-first-bento',
          'onboarding-devplan-ai-card',
          'onboarding-devplan-matrix-program-name',
          'onboarding-devplan-competency-details-close-btn',
          'onboarding-devplan-course-modal-close-btn',
          'onboarding-devplan-matrix-depts'
        ];

        const pipelineTargets = [
          'onboarding-pipeline-th-status',  // Step 8 -> 9
          'onboarding-pipeline-row-0',       // Step 12 -> 13
          'onboarding-pipeline-modal-close-btn'
        ];

        const nineBoxTargets = [
          'onboarding-9box-row-0',
          'onboarding-cell-detail-close-btn'
        ];

        const idpTargets = [
          'onboarding-idp-row-0',
          'onboarding-idp-row-priority',
          'onboarding-idp-row-view-plan',
          'onboarding-idp-edit-btn',
          'onboarding-idp-edit-modal-close-btn',
          'onboarding-idp-modal-close-btn'
        ];

        const isTargetMatch = 
          (guideMode === 'DEVPLAN' && devPlanTargets.includes(step.targetId)) ||
          (guideMode === 'PIPELINE' && pipelineTargets.includes(step.targetId)) ||
          (guideMode === '9BOX' && nineBoxTargets.includes(step.targetId)) ||
          (guideMode === 'IDP' && idpTargets.includes(step.targetId));

        if (isTargetMatch) {
          setTimeout(() => {
            safeAdvanceStep();
          }, 150);
        }
      }
    };

    const handleBentoClick = () => {
      const step = activeSteps[currentStep];
      if (step && (step.targetId === 'onboarding-devplan-first-bento')) {
        safeAdvanceStep();
      }
    };

    const handleModalClose = () => {
      const step = activeSteps[currentStep];
      if (step && (step.targetId === 'onboarding-devplan-competency-details-close-btn' || step.targetId === 'onboarding-devplan-course-modal-close-btn')) {
        safeAdvanceStep();
      }
    };

    const handleCourseClick = () => {
      const step = activeSteps[currentStep];
      if (step && (step.targetId === 'onboarding-devplan-inputs' || step.targetId === 'onboarding-devplan-ai-card')) {
        safeAdvanceStep();
      }
    };

    const handleCourseDropped = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-devplan-chronology') {
        safeAdvanceStep();
      }
    };

    const handleMatrixProgramClicked = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-devplan-matrix-program-name') {
        safeAdvanceStep();
      }
    };

    const handleMatrixDeptsClicked = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-devplan-matrix-depts') {
        safeAdvanceStep();
      }
    };

    const handleCellDoubleclicked = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-cell-seasoned') {
        safeAdvanceStep();
      }
    };

    const handleCellModalClosed = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-cell-detail-close-btn') {
        safeAdvanceStep();
      }
    };

    const handle9BoxDetailClosedEvent = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-9box-detail-close-btn') {
        safeAdvanceStep();
      }
    };

    const handlePipelineModalClosedEvent = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-pipeline-modal-close-btn') {
        safeAdvanceStep();
      }
    };

    const handleIDPRowRatingClicked = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-idp-row-rating') {
        safeAdvanceStep();
      }
    };

    const handleIDPRowPriorityClicked = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-idp-row-priority') {
        safeAdvanceStep();
      }
    };

    const handleIDPRowViewPlanClicked = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-idp-row-view-plan') {
        safeAdvanceStep();
      }
    };

    const handleIDPModalClosedEvent = () => {
      const step = activeSteps[currentStep];
      if (step && step.targetId === 'onboarding-idp-modal-close-btn') {
        safeAdvanceStep();
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('onboarding-bento-clicked', handleBentoClick);
    window.addEventListener('onboarding-modal-closed', handleModalClose);
    window.addEventListener('onboarding-course-clicked', handleCourseClick);
    window.addEventListener('onboarding-course-dropped', handleCourseDropped);
     window.addEventListener('onboarding-devplan-matrix-program-clicked', handleMatrixProgramClicked);
    window.addEventListener('onboarding-devplan-matrix-depts-clicked', handleMatrixDeptsClicked);
    window.addEventListener('onboarding-cell-doubleclicked', handleCellDoubleclicked);
    window.addEventListener('onboarding-cell-modal-closed', handleCellModalClosed);
    window.addEventListener('onboarding-9box-detail-closed', handle9BoxDetailClosedEvent);
    window.addEventListener('onboarding-pipeline-modal-closed', handlePipelineModalClosedEvent);
    window.addEventListener('onboarding-idp-row-rating-clicked', handleIDPRowRatingClicked);
    window.addEventListener('onboarding-idp-row-priority-clicked', handleIDPRowPriorityClicked);
    window.addEventListener('onboarding-idp-row-view-plan-clicked', handleIDPRowViewPlanClicked);
    window.addEventListener('onboarding-idp-modal-closed', handleIDPModalClosedEvent);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('onboarding-bento-clicked', handleBentoClick);
      window.removeEventListener('onboarding-modal-closed', handleModalClose);
      window.removeEventListener('onboarding-course-clicked', handleCourseClick);
      window.removeEventListener('onboarding-course-dropped', handleCourseDropped);
      window.removeEventListener('onboarding-devplan-matrix-program-clicked', handleMatrixProgramClicked);
      window.removeEventListener('onboarding-devplan-matrix-depts-clicked', handleMatrixDeptsClicked);
      window.removeEventListener('onboarding-cell-doubleclicked', handleCellDoubleclicked);
      window.removeEventListener('onboarding-cell-modal-closed', handleCellModalClosed);
      window.removeEventListener('onboarding-9box-detail-closed', handle9BoxDetailClosedEvent);
      window.removeEventListener('onboarding-pipeline-modal-closed', handlePipelineModalClosedEvent);
      window.removeEventListener('onboarding-idp-row-rating-clicked', handleIDPRowRatingClicked);
      window.removeEventListener('onboarding-idp-row-priority-clicked', handleIDPRowPriorityClicked);
      window.removeEventListener('onboarding-idp-row-view-plan-clicked', handleIDPRowViewPlanClicked);
      window.removeEventListener('onboarding-idp-modal-closed', handleIDPModalClosedEvent);
    };
  }, [isOpen, guideMode, currentStep, activeSteps]);

  const updateHighlightCoordinates = () => {
    if (!isOpen || guideMode === 'SELECT') {
      setHighlightRect(null);
      setClickTargetRect(null);
      return;
    }
    const step = activeSteps[currentStep];
    if (!step) return;

    // Map each close button to its parent modal/popup container for high-fidelity full-panel highlighting
    const closeToModalMap: Record<string, string> = {
      'onboarding-cell-detail-close-btn': 'onboarding-cell-detail-modal',
      'onboarding-9box-detail-close-btn': 'onboarding-9box-detail-modal',
      'onboarding-pipeline-modal-close-btn': 'onboarding-pipeline-modal',
      'onboarding-idp-modal-close-btn': 'onboarding-idp-modal',
      'onboarding-devplan-competency-details-close-btn': 'onboarding-devplan-competency-details-modal',
      'onboarding-devplan-course-modal-close-btn': 'onboarding-devplan-course-modal'
    };

    const targetIdToHighlight = closeToModalMap[step.targetId] || step.targetId;

    const elHighlight = document.getElementById(targetIdToHighlight);
    const elClickTarget = document.getElementById(step.targetId);

    if (elHighlight) {
      const rect = elHighlight.getBoundingClientRect();
      let top = rect.top;
      let height = rect.height;

      // Expand highlight upwards to include parent table column headers (Xếp hạng Mức Sẵn sàng, Mức ưu tiên, and Kế hoạch phát triển)
      if (
        targetIdToHighlight === 'onboarding-idp-row-rating' || 
        targetIdToHighlight === 'onboarding-idp-row-priority' ||
        targetIdToHighlight === 'onboarding-idp-row-view-plan'
      ) {
        top -= 44;
        height += 44;
      }

      setHighlightRect({
        top,
        left: rect.left,
        width: rect.width,
        height
      });
    } else {
      setHighlightRect(null);
    }

    if (elClickTarget) {
      const rect = elClickTarget.getBoundingClientRect();
      setClickTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    } else {
      setClickTargetRect(null);
    }
  };

  useEffect(() => {
    if (isOpen && guideMode !== 'SELECT') {
      window.addEventListener('resize', updateHighlightCoordinates);
      window.addEventListener('scroll', updateHighlightCoordinates, true); // capture-phase captures nested local container scroll events
      resizeIntervalRef.current = setInterval(updateHighlightCoordinates, 700);
      updateHighlightCoordinates();
    } else {
      setHighlightRect(null);
      setClickTargetRect(null);
    }

    return () => {
      window.removeEventListener('resize', updateHighlightCoordinates);
      window.removeEventListener('scroll', updateHighlightCoordinates, true);
      if (resizeIntervalRef.current) {
        clearInterval(resizeIntervalRef.current);
      }
    };
  }, [isOpen, currentStep, guideMode]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const step = activeSteps[currentStep];
      if (step) {
        // Programmatically close any modal that was opened at this step when user goes backward
        const targetId = step.targetId;

        // 1. 9-Box Guide Modals
        if (guideMode === '9BOX') {
          if (targetId === 'onboarding-cell-detail-close-btn' || targetId === 'onboarding-cell-detail-modal') {
            const btn = document.getElementById('onboarding-cell-detail-close-btn');
            if (btn) btn.click();
          } else if (targetId === 'onboarding-9box-detail-modal' || targetId === 'onboarding-9box-detail-close-btn') {
            const btn = document.getElementById('onboarding-9box-detail-close-btn');
            if (btn) btn.click();
          }
        }

        // 2. Pipeline Guide Modals
        if (guideMode === 'PIPELINE') {
          if (targetId === 'onboarding-pipeline-modal-close-btn' || targetId === 'onboarding-pipeline-modal') {
            const btn = document.getElementById('onboarding-pipeline-modal-close-btn');
            if (btn) btn.click();
          }
        }

        // 3. DevPlan Guide Modals
        if (guideMode === 'DEVPLAN') {
          if (targetId === 'onboarding-devplan-course-modal' || targetId === 'onboarding-devplan-course-modal-close-btn') {
            const btn = document.getElementById('onboarding-devplan-course-modal-close-btn');
            if (btn) btn.click();
          } else if (targetId === 'onboarding-devplan-matrix-depts') {
            // Collapse depts if open
            const btn = document.getElementById('onboarding-devplan-matrix-depts');
            if (btn && btn.classList.contains('bg-indigo-100/70')) {
              btn.click();
            }
          }
        }

        // 4. IDP Guide Modals
        if (guideMode === 'IDP') {
          if (targetId === 'onboarding-idp-modal-table' || targetId === 'onboarding-idp-modal-close-btn') {
            const btn = document.getElementById('onboarding-idp-modal-close-btn');
            if (btn) btn.click();
          } else if (targetId === 'onboarding-idp-modal' || targetId === 'onboarding-idp-ai-panel') {
            const btn = document.getElementById('onboarding-idp-modal-close-btn');
            if (btn) btn.click();
          } else if (targetId === 'onboarding-idp-edit-modal-body' || targetId === 'onboarding-idp-edit-modal-close-btn') {
            const btn = document.getElementById('onboarding-idp-edit-modal-close-btn');
            if (btn) btn.click();
          }
        }
      }

      setCurrentStep(prev => prev - 1);
    } else {
      // Go back to selection screen
      setGuideMode('SELECT');
      setCurrentStep(0);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('hasCompletedOnboarding', 'true');
    } catch {
      // Ignored
    }
    onClose();
  };

  const handleSkip = () => {
    handleComplete();
  };

  // Mask calculations for lighting box around the key element
  const getMaskStyles = () => {
    if (!highlightRect || guideMode === 'SELECT') return { show: false };
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const padding = 6;
    const t = Math.max(0, highlightRect.top - padding);
    const l = Math.max(0, highlightRect.left - padding);
    const w = Math.min(viewportWidth, highlightRect.width + padding * 2);
    const h = Math.min(viewportHeight, highlightRect.height + padding * 2);

    return {
      show: true,
      top: { top: 0, left: 0, width: '100vw', height: `${t}px` },
      bottom: { top: `${t + h}px`, left: 0, width: '100vw', height: `calc(100vh - ${t + h}px)` },
      left: { top: `${t}px`, left: 0, width: `${l}px`, height: `${h}px` },
      right: { top: `${t}px`, left: `${l + w}px`, width: `calc(100vw - ${l + w}px)`, height: `${h}px` },
      borderBox: { top: `${t}px`, left: `${l}px`, width: `${w}px`, height: `${h}px` }
    };
  };

  const masks = getMaskStyles();

  // Tooltip dynamic alignment logic
  const getCardStyle = (): React.CSSProperties => {
    if (typeof window === 'undefined') return {};
    const isMobile = window.innerWidth < 640;
    
    if (guideMode === 'SELECT' || !highlightRect || highlightRect.width < 10 || highlightRect.height < 10 || isMobile) {
      return {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: isMobile ? '430px' : '480px',
        zIndex: 55,
      };
    }

    const cardW = 400; 

    // Custom placement override for step 12 to make sure it floats clear of the centralized edit modal and doesn't obscure the button
    const step = activeSteps[currentStep];
    if (step && (step.targetId === 'onboarding-idp-edit-modal-close-btn' || step.targetId === 'onboarding-idp-edit-modal-body')) {
      return {
        position: 'fixed',
        top: '110px',
        left: '24px',
        width: `${cardW}px`,
        zIndex: 55,
        pointerEvents: 'none',
        transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
      };
    }

    const cardH = cardHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const elCenterX = highlightRect.left + highlightRect.width / 2;
    const elCenterY = highlightRect.top + highlightRect.height / 2;

    const spaceBelow = viewportHeight - (highlightRect.top + highlightRect.height);
    const spaceAbove = highlightRect.top;
    const spaceRight = viewportWidth - (highlightRect.left + highlightRect.width);
    const spaceLeft = highlightRect.left;

    let positionMode: 'below' | 'above' | 'right' | 'left' | 'corner' = 'below';

    if (spaceBelow >= cardH + 40) {
      positionMode = 'below';
    } else if (spaceAbove >= cardH + 40) {
      positionMode = 'above';
    } else if (spaceRight >= cardW + 24) {
      positionMode = 'right';
    } else if (spaceLeft >= cardW + 24) {
      positionMode = 'left';
    } else {
      positionMode = 'corner';
    }

    let calculatedTop = 0;
    let calculatedLeft = 0;

    if (positionMode === 'below') {
      calculatedTop = highlightRect.top + highlightRect.height + 14;
      calculatedLeft = elCenterX - cardW / 2;
    } else if (positionMode === 'above') {
      calculatedTop = highlightRect.top - cardH - 14;
      calculatedLeft = elCenterX - cardW / 2;
    } else if (positionMode === 'right') {
      calculatedTop = elCenterY - cardH / 2;
      calculatedLeft = highlightRect.left + highlightRect.width + 16;
    } else if (positionMode === 'left') {
      calculatedTop = elCenterY - cardH / 2;
      calculatedLeft = highlightRect.left - cardW - 16;
    } else {
      const cornerX = elCenterX > viewportWidth / 2 ? 'left' : 'right';
      const cornerY = elCenterY > viewportHeight / 2 ? 'top' : 'bottom';
      
      calculatedTop = cornerY === 'top' ? 100 : viewportHeight - cardH - 80;
      calculatedLeft = cornerX === 'left' ? 24 : viewportWidth - cardW - 24;
    }

    const safetyMarginSide = 16;
    const safetyMarginTop = 80;
    const safetyMarginBottom = 80;
    calculatedLeft = Math.max(safetyMarginSide, Math.min(viewportWidth - cardW - safetyMarginSide, calculatedLeft));
    calculatedTop = Math.max(safetyMarginTop, Math.min(viewportHeight - cardH - safetyMarginBottom, calculatedTop)); 

    return {
      position: 'fixed',
      top: `${calculatedTop}px`,
      left: `${calculatedLeft}px`,
      width: `${cardW}px`,
      zIndex: 55,
      pointerEvents: 'none',
      transition: 'top 0.35s cubic-bezier(0.25, 1, 0.5, 1), left 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
    };
  };

  const cardStyle = getCardStyle();
  const currentStepData = guideMode !== 'SELECT' ? activeSteps[currentStep] : null;

  // Identify steps where user is explicitly directed to click
  const isClickStep = currentStepData ? [
    'onboarding-cell-seasoned',
    'onboarding-cell-detail-close-btn',
    'onboarding-9box-row-0',
    'onboarding-9box-detail-close-btn',
    'onboarding-pipeline-row-0',
    'onboarding-pipeline-modal-close-btn',
    'onboarding-devplan-first-bento',
    'onboarding-devplan-competency-details-close-btn',
    'onboarding-devplan-ai-card',
    'onboarding-devplan-course-modal-close-btn',
    'onboarding-devplan-matrix-program-name',
    'onboarding-devplan-matrix-depts',
    'onboarding-idp-row-priority',
    'onboarding-idp-row-view-plan',
    'onboarding-idp-modal-close-btn',
    'onboarding-idp-edit-btn',
    'onboarding-idp-edit-modal-close-btn'
  ].includes(currentStepData.targetId) : false;

  return (
    <div className="fixed inset-0 z-[100000] overflow-hidden pointer-events-none">
      <style>{`
        @keyframes spotlightPulse {
          0%, 100% {
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.65), 0 0 15px rgba(99, 102, 241, 0.45);
            transform: scale(1);
            border-color: rgba(99, 102, 241, 0.85);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.35), 0 0 25px rgba(99, 102, 241, 0.65);
            transform: scale(1.002);
            border-color: rgba(129, 140, 248, 1);
          }
        }
        .animate-spotlight-active {
          animation: spotlightPulse 2.2s infinite ease-in-out;
        }
        @keyframes handClick {
          0%, 100% {
            transform: scale(1) translate(0, 0);
          }
          50% {
            transform: scale(0.85) translate(-4px, -4.5px);
          }
        }
        .animate-hand-click {
          animation: handClick 1.1s infinite ease-in-out;
        }
      `}</style>

      {/* Backdrop overlay */}
      {masks.show && masks.top && (
        <>
          <div style={masks.top} className="fixed bg-slate-950/65 backdrop-blur-[0.5px] transition-all duration-300 pointer-events-auto" />
          <div style={masks.bottom} className="fixed bg-slate-950/65 backdrop-blur-[0.5px] transition-all duration-300 pointer-events-auto" />
          <div style={masks.left} className="fixed bg-slate-950/65 backdrop-blur-[0.5px] transition-all duration-300 pointer-events-auto" />
          <div style={masks.right} className="fixed bg-slate-950/65 backdrop-blur-[0.5px] transition-all duration-300 pointer-events-auto" />
          
          <div 
            style={masks.borderBox} 
            className="fixed border-[1.5px] border-indigo-500/90 bg-indigo-600/[0.02] rounded-xl transition-all duration-75 pointer-events-none animate-spotlight-active flex items-start justify-end p-1.5"
          >
            {!isClickStep && (
              <div 
                className="absolute inset-0 pointer-events-auto bg-transparent cursor-default" 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            )}
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
          </div>

          {/* Floating glowing, point-to-click hand pointer placed with viewport absolute coordinate precision on the target element */}
          {isClickStep && clickTargetRect && (() => {
            const targetId = currentStepData?.targetId;
            const isWideElement = clickTargetRect.width > 400;
            
            // For wide elements (like rows), place the indicator inside viewport space, partially left offset.
            // For regular elements, place it at the bottom-right corner rather than dead center to avoid blocking centered text!
            const handStyle: React.CSSProperties = isWideElement
              ? {
                  position: 'fixed',
                  top: `${clickTargetRect.top + clickTargetRect.height - 4}px`,
                  left: `${clickTargetRect.left + 24}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 100010,
                }
              : {
                  position: 'fixed',
                  top: `${clickTargetRect.top + clickTargetRect.height - 3}px`,
                  left: `${clickTargetRect.left + clickTargetRect.width - 3}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 100010,
                };

            return (
              <div 
                style={handStyle}
                className="animate-hand-click select-none pointer-events-none flex items-center justify-center w-1 h-1"
              >
                {/* Clicking ripple wave - Shrunk nicely to h-5.5/w-5.5 */}
                <span className="absolute h-5.5 w-5.5 border-[1.5px] border-amber-400 rounded-full animate-ping opacity-60"></span>
                <div className="bg-amber-500 text-slate-900 rounded-full p-1.5 shadow-md border-[1.5px] border-white flex items-center justify-center shrink-0">
                  <svg 
                    viewBox="0 0 24 24" 
                    width="14" 
                    height="14" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-3.5 h-3.5 text-slate-900"
                  >
                    <path d="M12 12V4.5a1.5 1.5 0 1 0-3 0v10a1.5 1.5 0 0 1-3 0V9.5a1.5 1.5 0 1 0-3 0V17c0 3.3 2.7 6 6 6h4a6 6 0 0 0 6-6v-3.5a1.5 1.5 0 0 0-3 0V12" />
                  </svg>
                </div>
              </div>
            );
          })()}
        </>
      )}

      {(!masks.show || guideMode === 'SELECT') && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[1px] pointer-events-auto transition-all" />
      )}

      {/* Guided Card */}
      <div style={cardStyle} className="p-3 md:p-4 z-55 pointer-events-none transition-all duration-300">
        <div 
          ref={cardRef}
          className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.22)] pointer-events-auto flex flex-col relative"
        >
          {/* Top colored indicator line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-indigo-600 to-emerald-500 rounded-t-2xl" />

          {/* Guide Mode Select Screen */}
          {guideMode === 'SELECT' ? (
            <div className="space-y-4 text-left select-none">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 spin-slow" />
                  <h3 className="font-sans font-black text-slate-900 text-sm md:text-base tracking-tight leading-none uppercase">
                    {isVi ? 'Hệ thống Hướng dẫn nhanh' : 'Millennium Interactive Tour'}
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Guide Selector Option Buttons */}
              <div className="space-y-3 pt-1">
                {/* 1. 9-BOX WALKTHROUGH */}
                <button
                  onClick={() => {
                    onChangeTab('tab-9box');
                    setGuideMode('9BOX');
                    setCurrentStep(0);
                  }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-indigo-50/50 border border-slate-205 hover:border-indigo-300 rounded-xl transition-all cursor-pointer text-left flex items-center gap-3 group group-hover:scale-101 active:scale-99 shadow-3xs"
                >
                  <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 shrink-0 group-hover:bg-indigo-100 transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-sans font-extrabold text-xs text-slate-800 group-hover:text-indigo-900 flex items-center justify-between gap-1.5 leading-none">
                      <span className="truncate">{isVi ? '📊 HƯỚNG DẪN MA TRẬN 9-BOX' : '📊 9-BOX MATRIX GUIDE'}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                        {isVi ? `${steps9Box.length} Bước` : `${steps9Box.length} Steps`}
                      </span>
                    </h4>
                  </div>
                </button>

                {/* 2. SUCCESSION WORKSPACE WALKTHROUGH */}
                <button
                  onClick={() => {
                    onChangeTab('tab-pipeline');
                    setGuideMode('PIPELINE');
                    setCurrentStep(0);
                  }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-205 hover:border-emerald-300 rounded-xl transition-all cursor-pointer text-left flex items-center gap-3 group group-hover:scale-101 active:scale-99 shadow-3xs"
                >
                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <Network className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-sans font-extrabold text-xs text-slate-800 group-hover:text-emerald-950 flex items-center justify-between gap-1.5 leading-none">
                      <span className="truncate">{isVi ? '🕸️ HƯỚNG DẪN MẠNG LƯỚI NHÂN TÀI' : '🕸️ TALENT PIPELINE GUIDE'}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                        {isVi ? `${stepsPipeline.length} Bước` : `${stepsPipeline.length} Steps`}
                      </span>
                    </h4>
                  </div>
                </button>

                {/* 3. DEVELOPMENT PLAN WALKTHROUGH */}
                <button
                  onClick={() => {
                    onChangeTab('tab-devplan');
                    setGuideMode('DEVPLAN');
                    setCurrentStep(0);
                  }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-amber-50/50 border border-slate-205 hover:border-amber-300 rounded-xl transition-all cursor-pointer text-left flex items-center gap-3 group group-hover:scale-101 active:scale-99 shadow-3xs"
                >
                  <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg text-amber-600 shrink-0 group-hover:bg-amber-100 transition-colors">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-sans font-extrabold text-xs text-slate-800 group-hover:text-amber-900 flex items-center justify-between gap-1.5 leading-none">
                      <span className="truncate">{isVi ? '🧭 HƯỚNG DẪN KẾ HOẠCH ĐÀO TẠO' : '🧭 TRAINING PLAN GUIDE'}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                        {isVi ? `${stepsDevPlan.length} Bước` : `${stepsDevPlan.length} Steps`}
                      </span>
                    </h4>
                  </div>
                </button>

                {/* 4. INDIVIDUAL IDP CLIENT WALKTHROUGH */}
                <button
                  onClick={() => {
                    onChangeTab('tab-indiv-idp');
                    setGuideMode('IDP');
                    setCurrentStep(0);
                  }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-indigo-50/50 border border-slate-205 hover:border-indigo-300 rounded-xl transition-all cursor-pointer text-left flex items-center gap-3 group group-hover:scale-101 active:scale-99 shadow-3xs"
                >
                  <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-650 shrink-0 group-hover:bg-indigo-100 transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-sans font-extrabold text-xs text-slate-800 group-hover:text-indigo-950 flex items-center justify-between gap-1.5 leading-none">
                      <span className="truncate">{isVi ? '📅 HƯỚNG DẪN KẾ HOẠCH CÁ NHÂN IDP' : '📅 INDIVIDUAL IDP PLAN GUIDE'}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                        {isVi ? `${stepsIDP.length} Bước` : `${stepsIDP.length} Steps`}
                      </span>
                    </h4>
                  </div>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-[10.5px] font-extrabold bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-650 rounded-lg transition-all cursor-pointer active:scale-95"
                >
                  {isVi ? 'Đóng lại' : 'Close Window'}
                </button>
              </div>
            </div>
          ) : (
            /* Active Guided Step View Screen */
            <div className="text-left flex flex-col h-full overflow-hidden select-none" style={{ maxHeight: 'calc(82vh - 40px)' }}>
              {/* Card Header progress tracker */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 select-none gap-2 shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded font-extrabold text-[8.5px] uppercase tracking-wider font-mono shrink-0">
                    {guideMode === '9BOX' 
                      ? (isVi ? 'Lộ Trình 9-Box' : '9-Box Track') 
                      : guideMode === 'PIPELINE' 
                        ? (isVi ? 'Lộ Trình Kế Thừa' : 'Succession Track') 
                        : guideMode === 'IDP'
                          ? (isVi ? 'Kế Hoạch IDP' : 'IDP Track')
                          : (isVi ? 'Lộ Trình Đào Tạo' : 'Training Track')
                    }
                  </span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold text-[8.5px] uppercase tracking-wider font-mono shrink-0">
                    {currentStep + 1} / {activeSteps.length}
                  </span>
                </div>
                
                {/* Skip button top right */}
                <button 
                  type="button" 
                  onClick={handleSkip}
                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 hover:border-rose-300 text-rose-700 hover:text-rose-800 text-[9.5px] font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 select-none shrink-0 pointer-events-auto"
                >
                  <span>{isVi ? 'Bỏ qua' : 'Skip Tour'}</span>
                  <span className="text-[10px]">✕</span>
                </button>
              </div>

              {/* Scrollable body content */}
              <div className="overflow-y-auto pr-1 py-3.5 space-y-3.5 flex-1 max-h-[46vh] sm:max-h-[50vh] scrollbar-thin pointer-events-auto">
                {/* Step Badges and Titles */}
                <div className="space-y-0.5 select-none shrink-0">
                  <span className="text-[8.5px] uppercase font-black tracking-widest text-indigo-600 font-mono leading-none">
                    🎯 {isVi ? currentStepData?.badgeVi : currentStepData?.badgeEn}
                  </span>
                  <h3 className="font-sans font-black text-slate-900 text-xs md:text-[13px] leading-snug tracking-tight">
                    {isVi ? currentStepData?.titleVi : currentStepData?.titleEn}
                  </h3>
                </div>

                {/* Main textual description */}
                <p className="text-slate-700 text-[11px] leading-relaxed font-semibold">
                  {isVi ? currentStepData?.descVi : currentStepData?.descEn}
                </p>

                {/* Bullet points for better readability and structure */}
                {((isVi ? currentStepData?.pointsVi : currentStepData?.pointsEn) || []).length > 0 && (
                  <div className="mt-3 bg-slate-50 border border-slate-200/50 rounded-xl p-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-2">
                      {isVi ? '🎯 Chi tiết hành động / Lưu ý:' : '🎯 Actions & Key Notes:'}
                    </span>
                    <ul className="space-y-2 pl-3.5 list-disc text-slate-650 text-[10.5px] leading-relaxed font-sans">
                      {((isVi ? currentStepData?.pointsVi : currentStepData?.pointsEn) || []).map((pt, index) => (
                        <li key={index} className="pl-0.5">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Information Footnote - Tip box wraps and remains fully visible */}
                <div className="flex items-start gap-2 px-3 py-2.5 bg-indigo-50/45 rounded-xl border border-indigo-100 text-[10.5px] text-slate-650 font-sans shadow-2xs select-none">
                  <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-semibold">
                    <strong className="text-indigo-950">{isVi ? 'Mẹo:' : 'Tip:'}</strong> {isVi ? currentStepData?.tipVi : currentStepData?.tipEn}
                  </p>
                </div>
              </div>

              {/* Footer Actions buttons */}
              <div className="flex items-center justify-between gap-2 mt-2 pt-3 border-t border-slate-100 select-none w-full shrink-0">
                
                {/* Back to selection screen/index link */}
                <button
                  type="button"
                  onClick={() => {
                    setGuideMode('SELECT');
                    setCurrentStep(0);
                  }}
                  className="text-[9.5px] text-indigo-650 hover:text-indigo-800 hover:underline font-extrabold cursor-pointer flex items-center gap-1 shrink-0 pointer-events-auto"
                >
                  ◀ {isVi ? 'Mở lại Menu chọn' : 'Back to Menu'}
                </button>

                {/* Left/Right pagination controls */}
                <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-2.5 py-1 border border-slate-205 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-extrabold flex items-center gap-0.5 cursor-pointer transition-all active:scale-95 select-none"
                    >
                      <ChevronLeft className="w-3 h-3 text-slate-500" />
                      <span>{isVi ? 'Quay lại' : 'Back'}</span>
                    </button>
                  )}

                  {!isClickStep ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 rounded-lg text-[10px] font-black flex items-center gap-0.5 shadow-3xs cursor-pointer transition-all active:scale-95 shrink-0 select-none animate-pulse-subtle"
                    >
                      <span>
                        {currentStep === activeSteps.length - 1 
                          ? (isVi ? 'Thoát' : 'Finish') 
                          : (isVi ? 'Tiếp tục' : 'Next')
                        }
                      </span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span 
                      className="px-3.5 py-1 bg-slate-100 text-slate-450 border border-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-3xs select-none opacity-90 cursor-not-allowed text-stone-500"
                      title={isVi ? "Hãy bấm đúng thao tác được hướng dẫn tại vùng sáng để tiếp tục" : "Please click on the highlighted element to continue"}
                    >
                      <span>{isVi ? 'Hãy click thao tác' : 'Perform Action'}</span>
                      <Sparkles className="w-3 h-3 text-amber-500 animate-pulse shrink-0" />
                    </span>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
