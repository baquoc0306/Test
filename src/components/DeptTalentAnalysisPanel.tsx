import React, { useState, useMemo, useEffect } from 'react';
import { Talent } from '../types';
import { ShieldAlert, Users, TrendingUp, HelpCircle, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Info, RefreshCw, Briefcase, Award, BellRing, X } from 'lucide-react';
import Markdown from 'react-markdown';

interface Props {
  talents: Talent[];
  lang: 'VI' | 'EN';
  selectedDept: string;
  onDeptChange?: (dept: string) => void;
  isLdMode?: boolean;
}

const compileClientInsight = (
  deptData: any,
  phase: 'FAST_GROWTH' | 'STABLE_SCALE',
  lang: 'VI' | 'EN'
) => {
  const isVi = lang === 'VI';
  const profileName = isVi ? deptData.profileVi : deptData.profileEn;
  const phaseName = phase === 'FAST_GROWTH' ? (isVi ? 'Tăng trưởng nhanh' : 'Rapid Expansion') : (isVi ? 'Vận hành Ổn định' : 'Operational Stability');

  if (isVi) {
    return `#### 💡 Nhận định Khái quát về Cơ cấu
Bộ phận **${deptData.dept}** hiện có **${deptData.total}** nhân sự được chuẩn hóa trên Ma trận 9-Box với tỷ lệ phân bổ: **${deptData.growersPct}% Growers** (Nhóm phát triển), **${deptData.keepersPct}% Keepers** (Nhóm duy trì), và **${deptData.moversPct}% Movers** (Nhóm cần bồi dưỡng).

Đánh giá tổng quan cấu trúc của bộ phận này được xác lập là **${profileName}** phù hợp với chế độ **${phaseName}**:
${deptData.growersPct > 35 ? '- **Đội ngũ giàu tiềm năng (nhiều Growers)**: Thuộc Nhóm phát triển rất năng nổ, học nhanh nhưng cần được phân giao công việc thử thách và rõ ràng cơ hội thăng tiến để giữ chân tài năng.' : ''}
${deptData.keepersPct > 65 ? '- **Đội ngũ nòng cốt vững tay nghề (nhiều Keepers)**: Thuộc Nhóm duy trì giúp công việc vận hành hàng ngày cực kỳ trôi chảy ổn định. Tuy nhiên cần khuyến khích học thêm kỹ năng mới để sẵn sàng cho thay đổi.' : ''}
${deptData.moversPct > 20 ? '- **Cần sát sao hỗ trợ hiệu suất (Movers hơi nhiều)**: Thuộc Nhóm cần bồi dưỡng đang ở mức cần lưu ý. Quản lý bộ phận nên cùng họ lập kế hoạch hướng dẫn cầm tay chỉ việc để nâng cao hiệu năng.' : ''}
${(deptData.keepersPct >= 40 && deptData.growersPct >= 20 && deptData.moversPct <= 20) ? '- **Cơ cấu phân bổ cân đối lý tưởng**: Tỷ lệ vàng lý tưởng giữa Nhóm duy trì và Nhóm phát triển giúp duy trì vận hành ổn định đồng thời luôn sẵn có đội ngũ kế cận kế tiếp.' : ''}

#### ⚠️ Những lưu ý thực tế để giữ chân nhân sự
1. **Theo dõi nguy cơ nghỉ việc**: ${deptData.highRisk > 0 ? `Phát hiện có **${deptData.highRisk}** nhân sự có nguy cơ nghỉ việc cao: **${deptData.redAlertNames.join(', ')}**. Quản lý nên chủ động trò chuyện thân mật, lắng nghe nguyện vọng ngay.` : `Hiện tại không có trường hợp báo động nguy cơ nghỉ việc cao ở những vị trí nòng cốt.`}
2. **Kỳ vọng thăng tiến**: Khi lượng nhân sự tiềm năng cao (Growers) đông đảo mà số vị trí quản lý có hạn, dễ dẫn đến tâm lý nản chí nếu họ không thấy lộ trình phát triển rõ ràng.

#### 🎯 Gợi ý hành động thực tế cho Quản lý
- ${phase === 'FAST_GROWTH' 
    ? '**Tăng tốc cho nhân sự tiềm năng**: Ưu tiên giao việc mới thử thách, luân dời vai trò hoặc dẫn dắt các nhóm nhỏ để giữ lửa nhiệt huyết.' 
    : '**Đào tạo đa năng cho nhân sự vững vàng**: Hướng dẫn anh em làm được nhiều việc khác nhau trong bộ phận để luân phiên hỗ trợ nhau dễ dàng hơn.'}
- **Lập kế hoạch rèn luyện cá nhân**: Giúp từng người nhìn rõ điểm cần cải thiện, đồng thời cử nhân sự vững tay nghề kèm cặp cụ thể cho nhân sự mới.`;
  } else {
    return `#### 💡 General Team Structure Assessment
The department **${deptData.dept}** currently has **${deptData.total}** personnel mapped on the 9-Box Matrix with a distribution of: **${deptData.growersPct}% Growers** (High Potential), **${deptData.keepersPct}% Keepers** (Solid Operators), and **${deptData.moversPct}% Movers** (Need Support/Learning).

The team structure is assessed as **${profileName}** configured for **${phaseName}** mode:
${deptData.growersPct > 35 ? '- **Talent-Rich Potential (Many Growers)**: Highly proactive, but requires clear career opportunities and challenging goals to remain engaged.' : ''}
${deptData.keepersPct > 65 ? '- **Solid Operational Core (Many Keepers)**: Excellent day-to-day stability. Encourage minor skill expansions to ensure adaptability.' : ''}
${deptData.moversPct > 20 ? '- **Support Needed (Many Movers)**: A high ratio of training/learning personnel. Direct coaching and close supervision are recommended.' : ''}
${(deptData.keepersPct >= 40 && deptData.growersPct >= 20 && deptData.moversPct <= 20) ? '- **Resilient Balanced Structure**: Ensures highly consistent operations alongside a steady, ready-to-step-up succession pipeline.' : ''}

#### ⚠️ Retention & Engagement Warnings
1. **Retention Focus**: ${deptData.highRisk > 0 ? `Detected **${deptData.highRisk}** key personnel with higher flight risk: **${deptData.redAlertNames.join(', ')}**. A direct, friendly check-in is recommended.` : `Direct retention risk is low.`}
2. **Career Progression Gripes**: A large concentration of high potential contributors without enough promotion slots could trigger stagnation. Clear micro-progression paths are advised.

#### 🎯 Recommended Practical Actions for HODs
- ${phase === 'FAST_GROWTH' 
    ? '**Accelerate Growers**: Deploy quick rotations and assign leadership over small tasks to maintain engagement and velocity.' 
    : '**Encourage Cross-training for Keepers**: Train the team on multiple functional tasks to secure daily operability.'}
- **Activate Simple Coaching**: Pair solid keepers with newer team members to quickly raise overall department performance.`;
  }
};

const getDeptNicheText = (dept: string, lang: 'VI' | 'EN') => {
  const d = dept.toUpperCase();
  const isVi = lang === 'VI';
  if (d.includes('ENGINEERING') || d.includes('PE') || d.includes('AUTOMATION') || d.includes('MAIN') || d.includes('TECH') || d.includes('PLANT')) {
    return {
      strength: isVi 
        ? 'Bộ phận Kỹ thuật đóng vai trò cốt lõi trong việc bảo trì bảo dưỡng, tối ưu chỉ số hiệu suất OEE và hạn chế tối đa thời gian dừng máy (Machine Downtime).' 
        : 'The engineering unit is vital for asset reliability, OEE optimization, and minimizing machine downtime.',
      risk: isVi
        ? 'Nếu các nhân sự cốt lõi rời đi, nguy cơ dừng máy kéo dài, thất thoát dữ liệu tự động hóa và đứt gãy quy trình sửa chữa khẩn cấp là cực kỳ lớn.'
        : 'Losing core tech personnel directly threatens asset uptime, automation data flows, and emergency maintenance responsiveness.',
      focus: isVi ? 'bảo trì dự phòng & tự động hóa' : 'preventive upkeep & PLC automation'
    };
  } else if (d.includes('QUALITY') || d.includes('QC') || d.includes('QA') || d.includes('TEST')) {
    return {
      strength: isVi 
        ? 'Đội ngũ kiểm soát chất lượng (QC) là chốt chặn cuối cùng bảo đảm mọi lô sản phẩm xuất xưởng đều đáp ứng 100% tiêu chí kỹ thuật và giảm thiểu phế phẩm tiêu hao.' 
        : 'The QC department serves as the ultimate quality gateway, securing zero-defect batches and maintaining regulatory compliance.',
      risk: isVi
        ? 'Thiếu hụt người vững tay nghề có thể dẫn tới rủi ro sai sót lọt lỗi sản phẩm lỗi ra thị trường, tăng tỉ lệ hàng lỗi trả về (NCR) và gây căng thẳng khi khách hàng đánh giá đột xuất.'
        : 'QC skill gaps immediately risk defect leaks, rise in Non-Conformance Reports (NCR), and direct vulnerability during surprise customer audits.',
      focus: isVi ? 'kiểm soát quy trình & phòng ngừa lỗi lọt chuyền' : 'in-process analysis & defect prevention'
    };
  } else if (d.includes('PROD') || d.includes('OPERAT') || d.includes('LINE') || d.includes('MANUF')) {
    return {
      strength: isVi 
        ? 'Lực lượng Sản xuất trực tiếp định hình năng suất và sản lượng thực tế của nhà máy, quyết định tiến độ giao hàng và tỷ lệ hao hụt nguyên vật liệu.' 
        : 'Production operations capture direct inventory-to-product cycles, defining weekly volume quotas and raw material yields.',
      risk: isVi
        ? 'Rủi ro lớn nhất là năng suất chuyền giảm sút, mất an toàn lao động và tỷ lệ hao hụt tăng do thao tác sai kỹ thuật hoặc thiếu người rèn cặp kèm cặp trên chuyền.'
        : 'The key threat is floor utility drops, safety incidents, and wastage spikes from improper material handling or unguided floor operators.',
      focus: isVi ? 'ổn định năng suất chuyền & kỷ luật 5S' : 'line efficiency & 5S discipline'
    };
  } else {
    return {
      strength: isVi 
        ? 'Bộ phận tối ưu hóa các luồng dịch vụ, điều phối thông tin nội bộ đảm bảo vận hành nhịp nhàng thông suốt.' 
        : 'This business partner unit coordinates continuous informational flow and multi-disciplinary synergy safely.',
      risk: isVi
        ? 'Dễ rơi vào bẫy nghẽn việc (Process Bottlenecks) do phụ thuộc độc quyền chuyên môn vào một cá nhân, làm giảm tốc độ xử lý các nghiệp vụ chung.'
        : 'Highly exposed to bottlenecks if specialized administrative processes reside within a single person, risking internal service delays.',
      focus: isVi ? 'tối ưu hóa quy trình nội bộ & chia sẻ tri thức' : 'workflow simplification & cross-coverage'
    };
  }
};

const getPersonalizedStrengths = (item: any, lang: 'VI' | 'EN') => {
  const isVi = lang === 'VI';
  const niche = getDeptNicheText(item.dept, lang);
  
  if (isVi) {
    let lines: string[] = [];
    lines.push(`- **Đặc trưng nghiệp vụ:** ${niche.strength}`);
    lines.push(`- **Đánh giá cấu trúc:** Đội ngũ đang phân bổ theo cấu trúc **${item.profileVi}** (quy tụ **${item.growersPct}%** Nhóm phát triển và **${item.keepersPct}%** Nhóm duy trì).`);
    if (item.growersPct > 30) {
      lines.push(`- **Ưu thế bứt phá:** Nhóm phát triển dồi dào ${item.growerMembers.slice(0, 2).join(', ') ? `(*tiêu biểu như ${item.growerMembers.slice(0, 2).join(', ')}*)` : ''} mang lại sức bật cải tiến lớn, sẵn sàng đảm nhiệm quy trình mới.`);
    } else {
      lines.push(`- **Lực lượng trụ cột:** Nhóm duy trì chiếm phần lớn, giữ nhịp độ vận hành bền bỉ và duy trì chất lượng đầu ra cực kỳ ổn định.`);
    }
    if (item.keeperMembers.length > 0) {
      lines.push(`- **Hạt nhân kinh nghiệm:** Sự hiện diện của các nhân sự kinh nghiệm ${item.keeperMembers.slice(0, 2).join(', ') ? `(*như ${item.keeperMembers.slice(0, 2).join(', ')}*)` : ''} là chốt chặn vững chắc ngăn ngừa hư hao và sai lỗi vận hành chỉ số.`);
    }
    return lines.join('\n');
  } else {
    let lines: string[] = [];
    lines.push(`- **Core Business Profile:** ${niche.strength}`);
    lines.push(`- **Structural Alignment:** Currently classified under **${item.profileEn}** configuration (consisting of **${item.growersPct}%** Growers and **${item.keepersPct}%** Keepers).`);
    if (item.growersPct > 30) {
      lines.push(`- **Growth Engine:** High density of high-potential Growers ${item.growerMembers.slice(0, 2).join(', ') ? `(*e.g., ${item.growerMembers.slice(0, 2).join(', ')}*)` : ''} guarantees continuous improvement agility and painless transition steps.`);
    } else {
      lines.push(`- **Steady Foundation:** Keepers form the dominant backbone, assuring robust daily execution and excellent throughput consistency.`);
    }
    if (item.keeperMembers.length > 0) {
      lines.push(`- **Core Operators:** Highly experienced members ${item.keeperMembers.slice(0, 2).join(', ') ? `(*e.g., ${item.keeperMembers.slice(0, 2).join(', ')}*)` : ''} serve as the primary defense against unexpected downtime or key delivery slippages.`);
    }
    return lines.join('\n');
  }
};

const getPersonalizedRisks = (item: any, lang: 'VI' | 'EN') => {
  const isVi = lang === 'VI';
  const niche = getDeptNicheText(item.dept, lang);
  
  if (isVi) {
    let lines: string[] = [];
    
    if (item.redAlertNames.length > 0) {
      lines.push(`- **Hao hụt rủi ro cao:** Phát hiện nòng cốt có nguy cơ nghỉ việc: **${item.redAlertNames.join(', ')}**. ${niche.risk} Đề xuất lãnh đạo đối thoại 1-kèm-1 giải quyết sớm.`);
    } else {
      lines.push(`- **Độ ổn định cốt lõi:** Trạng thái an toàn, chưa ghi nhận rủi ro hao hụt nhân sự báo động đỏ (High Risk) trong đơn vị.`);
    }
    
    if (item.growersPct > 35) {
      const growerNames = item.growerMembers.slice(0, 2).join(', ');
      lines.push(`- **Nghẽn lộ trình phát triển (Growers dồi dào):** Nhóm phát triển chiếm tỉ trọng lớn (${item.growersPct}%), dễ nảy sinh tâm lý sốt ruột nếu hạn chế ghế quản lý. Cần quy hoạch thăng tiến ngang cho ${growerNames ? growerNames : 'nhân tố tốp đầu'}.`);
    } else if (item.growersPct < 15) {
      lines.push(`- **Hụt dòng kế cận (Growers thưa thớt):** Tỷ lệ Nhóm phát triển quá mỏng (${item.growersPct}%), khiến mọi quy trình cốt yếu bị phụ thuộc độc quyền vào một vài cá thâm niên, gây rủi ro nếu có đột biến nghỉ việc.`);
    }
    
    if (item.moversPct > 20) {
      const moverNames = item.moverMembers.slice(0, 3).join(', ');
      lines.push(`- **Gánh nặng đào tạo OJT (Nhiều Movers):** Nhóm cần bồi dưỡng khá đông (${item.moversPct}%), cụ thể: **${moverNames}**. Dễ gây quá tải cho người hướng dẫn nếu thiếu lộ trình bồi dưỡng 60 ngày.`);
    } else {
      lines.push(`- **Chi phí bồi dưỡng tối thiểu:** Tốc độ tự học tốt, số nhân sự cần kèm cặp thấp (${item.moversPct}%), giúp giải phóng nguồn lực cho tối ưu năng suất.`);
    }
    
    if (item.keepersPct > 60) {
      lines.push(`- **Rủi ro quán tính vận hành (Nhiều Keepers):** Lực lượng Nhóm duy trì quá trội (${item.keepersPct}%) có nguy cơ ngại thay đổi. Cần định hướng học bổ trợ tập trung về *${niche.focus}*.`);
    } else {
      lines.push(`- **Chuyển dịch linh hoạt:** Sự tương tác lành mạnh song hành giữa các hạt giống đổi mới (Nhóm phát triển) và bộ khung duy trì công việc (Nhóm duy trì).`);
    }
    
    return lines.join('\n');
  } else {
    let lines: string[] = [];
    
    if (item.redAlertNames.length > 0) {
      lines.push(`- **Attrition Alert:** Elevated flight danger warning for key contributors: **${item.redAlertNames.join(', ')}**. ${niche.risk} Schedule a 1-on-1 feedback session immediately.`);
    } else {
      lines.push(`- **Stability Check:** Safe status. No senior active members fall into high retention alert zones.`);
    }
    
    if (item.growersPct > 35) {
      const growerNames = item.growerMembers.slice(0, 2).join(', ');
      lines.push(`- **Progression Stagnation:** Highly concentrated Growers (${item.growersPct}%) could feel blocked without active vacancies. Offer clear horizontal achievements to keep ${growerNames ? growerNames : 'top performers'} active.`);
    } else if (item.growersPct < 15) {
      lines.push(`- **Succession Deficit:** Succession pipeline is extremely dry (${item.growersPct}% Growers), making core practices highly vulnerable to individual exits.`);
    }
    
    if (item.moversPct > 20) {
      const moverNames = item.moverMembers.slice(0, 3).join(', ');
      lines.push(`- **Capacity Bottlenecks (Movers):** Training cohort is high (${item.moversPct}%), specifically: **${moverNames}**. Risk of manager burnout unless explicit OJT routines are scheduled.`);
    } else {
      lines.push(`- **Minimal Learning Costs:** Very few members needing corrective tutoring (${item.moversPct}%), allowing focus on large development programs.`);
    }
    
    if (item.keepersPct > 60) {
      lines.push(`- **Inertia Risk:** Overly high operational Keepers concentration (${item.keepersPct}%) risks complacency. Focus upskilling on: *${niche.focus}*.`);
    } else {
      lines.push(`- **Optimal Adaptation:** Talent diversity guarantees smooth operation handoffs and open learning culture.`);
    }
    
    return lines.join('\n');
  }
};

const getPersonalizedActions = (item: any, phase: 'FAST_GROWTH' | 'STABLE_SCALE', lang: 'VI' | 'EN') => {
  const isVi = lang === 'VI';
  const niche = getDeptNicheText(item.dept, lang);
  const isGrowth = phase === 'FAST_GROWTH';
  
  if (isVi) {
    let lines: string[] = [];
    
    // Action 1: For Growers
    if (item.growerMembers.length > 0) {
      const firstGrower = item.growerMembers[0];
      const otherGrowers = item.growerMembers.slice(1, 3).join(', ');
      if (isGrowth) {
        lines.push(`- **Nhóm phát triển (${item.growers} nhân sự - Giao quyền):** Đề xuất thăng chức thử thách hoặc cử **${firstGrower}**${otherGrowers ? ` và ${otherGrowers}` : ''} chủ trì dự án cải tiến mới phục vụ nhu cầu mở rộng bộ phận.`);
      } else {
        lines.push(`- **Nhóm phát triển (${item.growers} nhân sự - Thăng tiến ngang):** Thiết lập lộ trình IDP sâu sắc, giao **${firstGrower}**${otherGrowers ? ` và ${otherGrowers}` : ''} giải quyết bài toán cốt lõi để nuôi dưỡng lớp lãnh đạo kế cận.`);
      }
    } else {
      lines.push(`- **Nhóm phát triển (Không thăng tiến nội bộ):** Chủ động tuyển lựa hạt giống mới hoặc luân chuyển nội bộ để kích hoạt luồng đổi mới cho đơn vị.`);
    }
    
    // Action 2: For Keepers
    if (item.keeperMembers.length > 0) {
      const firstKeeper = item.keeperMembers[0];
      const otherKeepers = item.keeperMembers.slice(1, 3).join(', ');
      if (isGrowth) {
        lines.push(`- **Nhóm duy trì (${item.keepers} nhân sự - Trang bị công nghệ):** Tạo lực đẩy cho **${firstKeeper}**${otherKeepers ? ` và ${otherKeepers}` : ''} ứng dụng công cụ tự động hóa nhằm tăng năng suất thao tác.`);
      } else {
        lines.push(`- **Nhóm duy trì (${item.keepers} nhân sự - Tri ân & Đào tạo chéo):** Bố trí đãi ngộ thâm niên thiết thực cho **${firstKeeper}**${otherKeepers ? ` và ${otherKeepers}` : ''}; lập ma trận đào tạo chéo phòng ngừa rủi ro vận hành.`);
      }
    } else {
      lines.push(`- **Nhóm duy trì (0 nhân sự):** Tập trung chuẩn hóa quy trình SOP để có thể bồi đắp và đào tạo giữ chân lực lượng cơ bản vững vàng nhất.`);
    }
    
    // Action 3: For Movers
    if (item.moverMembers.length > 0) {
      const firstMover = item.moverMembers[0];
      const otherMovers = item.moverMembers.slice(1, 3).join(', ');
      lines.push(`- **Nhóm cần bồi dưỡng (${item.movers} nhân sự - Kèm sát 1-1):** Hoàn tất lộ trình IDP 60 ngày củng cố kỹ năng về *${niche.focus}* cho **${firstMover}**${otherMovers ? ` và ${otherMovers}` : ''}, phân công nòng cốt vững kèm cặp sát sao.`);
    } else {
      lines.push(`- **Nhóm cần bồi dưỡng (0 nhân sự):** Tiếp tục kiểm soát tốt tỷ lệ học việc ở mức thấp dưới 15% nhằm duy trì tối đa năng suất sẵn có.`);
    }
    
    return lines.join('\n');
  } else {
    let lines: string[] = [];
    
    // Action 1: For Growers
    if (item.growerMembers.length > 0) {
      const firstGrower = item.growerMembers[0];
      const otherGrowers = item.growerMembers.slice(1, 3).join(', ');
      if (isGrowth) {
        lines.push(`- **Growers (${item.growers} heads - High-speed Deployment):** Assign **${firstGrower}**${otherGrowers ? ` or ${otherGrowers}` : ''} to lead critical expansion projects to build extreme capabilities.`);
      } else {
        lines.push(`- **Growers (${item.growers} heads - Horizontal Mentoring):** Build comprehensive developmental mentoring for **${firstGrower}**${otherGrowers ? ` and ${otherGrowers}` : ''} alongside strategic cross-training sponsors.`);
      }
    } else {
      lines.push(`- **Growers (Empty cohort):** Proactively source high-potentials from other departments to spark collaborative innovation.`);
    }
    
    // Action 2: For Keepers
    if (item.keeperMembers.length > 0) {
      const firstKeeper = item.keeperMembers[0];
      const otherKeepers = item.keeperMembers.slice(1, 3).join(', ');
      if (isGrowth) {
        lines.push(`- **Keepers (${item.keepers} heads - On-floor Aids):** Empower **${firstKeeper}**${otherKeepers ? ` and ${otherKeepers}` : ''} with smart technological tools to boost hourly output.`);
      } else {
        lines.push(`- **Keepers (${item.keepers} heads - Long-term Loyalty):** Design loyalty recognition schemes for **${firstKeeper}**${otherKeepers ? ` and ${otherKeepers}` : ''}, while activating robust cross-training backups.`);
      }
    } else {
      lines.push(`- **Keepers (0 personnel):** Focus on closing SOP documentation to secure easy onboarding pathways.`);
    }
    
    // Action 3: For Movers
    if (item.moverMembers.length > 0) {
      const firstMover = item.moverMembers[0];
      const otherMovers = item.moverMembers.slice(1, 3).join(', ');
      lines.push(`- **Movers (${item.movers} heads - Buddying Routine):** Launch targeted 60-day recovery plans focusing on *${niche.focus}* errors for **${firstMover}**${otherMovers ? ` and ${otherMovers}` : ''}, supervised by HOD-designated buddy.`);
    } else {
      lines.push(`- **Movers (0 personnel):** Control and maintain this apprentice segment density below 15% to safeguard standard operational throughput.`);
    }
    
    return lines.join('\n');
  }
};

export const DeptTalentAnalysisPanel: React.FC<Props> = ({ talents, lang, selectedDept, onDeptChange, isLdMode = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'insights'>('overview');
  const [selectedDeptDetail, setSelectedDeptDetail] = useState<any>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedDeptDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDeptDetail]);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [businessPhase, setBusinessPhase] = useState<'FAST_GROWTH' | 'STABLE_SCALE'>('STABLE_SCALE');

  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Dynamic department list from talents
  const departmentList = useMemo(() => {
    const raw = Array.from(new Set(talents.map(t => t.dept || 'Other'))).filter(Boolean);
    return ['ALL', ...raw.sort()];
  }, [talents]);

  // Compute live analytical indicators per department
  const analysisData = useMemo(() => {
    let rawDepts = Array.from(new Set(talents.map(t => t.dept || 'Other'))).filter(Boolean);
    
    return rawDepts.map(dept => {
      const pInDept = talents.filter(t => t.dept === dept);
      const total = pInDept.length;
      
      // Categorize exact members
      const localGrowers = pInDept.filter(t => t.group === 'Growers');
      const localKeepers = pInDept.filter(t => t.group === 'Keepers');
      const localMovers = pInDept.filter(t => t.group === 'Movers');
      
      const growersCount = localGrowers.length;
      const keepersCount = localKeepers.length;
      const moversCount = localMovers.length;
      
      // Dynamic Red Alert High Risk Talents list
      const redAlertTalents = pInDept.filter(t => t.highRisk === true);
      const redAlertNames = redAlertTalents.map(t => t.name);
      const highRisk = redAlertNames.length;
      
      const growersPct = total > 0 ? Math.round((growersCount / total) * 100) : 0;
      const keepersPct = total > 0 ? Math.round((keepersCount / total) * 100) : 0;
      const moversPct = total > 0 ? Math.round((moversCount / total) * 100) : 0;
      
      // Standard 9-box organizational health distribution profiles
      let profileVi = '';
      let profileEn = '';
      let profileBg = '';
      let profileText = '';
      let profileBorder = '';

      if (keepersPct >= 40 && growersPct >= 20 && moversPct <= 20) {
        profileVi = '🟢 Cân đối - Đủ Kế thừa';
        profileEn = '🟢 Balanced - Ready Pipeline';
        profileBg = 'bg-indigo-50/90 text-indigo-700 border-indigo-200';
        profileText = 'text-indigo-800';
        profileBorder = 'border-indigo-200/60';
      } else if (growersPct > 35) {
        profileVi = '⚡ Nhiều Tiềm năng (Growers)';
        profileEn = '⚡ High Potential (Growers)';
        profileBg = 'bg-emerald-50/90 text-emerald-700 border-emerald-200';
        profileText = 'text-emerald-800';
        profileBorder = 'border-emerald-200/60';
      } else if (keepersPct > 65) {
        profileVi = '🧱 Nòng cốt Vững chắc (Keepers)';
        profileEn = '🧱 Solid Backbone (Keepers)';
        profileBg = 'bg-amber-50/90 text-amber-700 border-amber-200';
        profileText = 'text-amber-800';
        profileBorder = 'border-amber-200/60';
      } else if (moversPct > 20) {
        profileVi = '⚠️ Cần Hỗ trợ Đào tạo (Movers)';
        profileEn = '⚠️ Needs Training (Movers)';
        profileBg = 'bg-rose-50/95 text-rose-700 border-rose-200';
        profileText = 'text-rose-800';
        profileBorder = 'border-rose-200/60';
      } else {
        profileVi = '⚖️ Phân bổ Tiêu chuẩn';
        profileEn = '⚖️ Standard Distribution';
        profileBg = 'bg-slate-50/90 text-slate-700 border-slate-200';
        profileText = 'text-slate-800';
        profileBorder = 'border-slate-200/60';
      }

      return {
        dept,
        total,
        growers: growersCount,
        keepers: keepersCount,
        movers: moversCount,
        growerMembers: localGrowers.map(t => t.name),
        keeperMembers: localKeepers.map(t => t.name),
        moverMembers: localMovers.map(t => t.name),
        members: [
          ...localGrowers.map(t => ({ name: t.name, group: 'Growers', cell: t.cell })),
          ...localKeepers.map(t => ({ name: t.name, group: 'Keepers', cell: t.cell })),
          ...localMovers.map(t => ({ name: t.name, group: 'Movers', cell: t.cell })),
        ],
        highRisk,
        growersPct,
        keepersPct,
        moversPct,
        redAlertNames,
        profileVi,
        profileEn,
        profileBg,
        profileText,
        profileBorder
      };
    }).sort((a, b) => b.total - a.total);
  }, [talents]);

  // Expand and direct user attention to selected department details
  useEffect(() => {
    if (selectedDept && selectedDept !== 'ALL') {
      setExpandedDept(selectedDept);
    } else {
      setExpandedDept(null);
    }
  }, [selectedDept]);

  // Clear AI Insight when filter options change, requiring user to trigger it manually
  useEffect(() => {
    setAiInsight('');
    setIsAiLoading(false);
  }, [selectedDept, businessPhase, lang]);

  const handleTriggerAiAnalysis = async () => {
    if (!selectedDept || selectedDept === 'ALL') return;
    const deptData = analysisData.find(d => d.dept === selectedDept);
    if (!deptData) return;

    setIsAiLoading(true);
    setAiInsight('');

    try {
      const response = await fetch('/api/gemini/dept-insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dept: deptData.dept,
          total: deptData.total,
          growers: deptData.growers,
          growersPct: deptData.growersPct,
          keepers: deptData.keepers,
          keepersPct: deptData.keepersPct,
          movers: deptData.movers,
          moversPct: deptData.moversPct,
          businessPhase,
          profile: lang === 'VI' ? deptData.profileVi : deptData.profileEn,
          lang
        }),
      });

      if (!response.ok) {
        throw new Error('API response error: ' + response.status);
      }

      const json = await response.json();
      if (json.insight) {
        setAiInsight(json.insight);
      } else {
        throw new Error('No advice text generated by Gemini.');
      }
    } catch (err: any) {
      console.warn("Using compiled L&D local heuristics advisor:", err);
      const backupText = compileClientInsight(deptData, businessPhase, lang);
      setAiInsight(backupText);
    } finally {
      setIsAiLoading(false);
    }
  };

  // filtered data reference is verified lower down

  // Filter dynamic list based on selection
  const filteredAnalysisData = useMemo(() => {
    if (selectedDept && selectedDept !== 'ALL') {
      return analysisData.filter(d => d.dept === selectedDept);
    }
    return analysisData;
  }, [analysisData, selectedDept]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col w-full select-none" id="dept-analysis-component">
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h4 className="text-[14px] md:text-[15px] font-bold text-slate-800 uppercase tracking-wider font-sans flex items-center gap-1.5 leading-snug">
            📊 <span>{lang === 'VI' ? 'TỔNG QUAN & PHÂN TÍCH' : 'OVERVIEW & ANALYSIS'}</span>
          </h4>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] uppercase tracking-wider font-bold text-slate-400">
                {lang === 'VI' ? 'Bộ phận:' : 'Dept:'}
              </span>
              <select
                id="internal-dept-select"
                value={selectedDept}
                onChange={(e) => onDeptChange && onDeptChange(e.target.value)}
                className="text-[13px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
              >
                {departmentList.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'ALL' ? (lang === 'VI' ? 'Tất cả bộ phận' : 'All Departments') : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] uppercase tracking-wider font-bold text-slate-400">
                {lang === 'VI' ? 'Giai đoạn:' : 'Stage:'}
              </span>
              <div className="inline-flex bg-slate-100/80 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setBusinessPhase('FAST_GROWTH')}
                  className={`text-[9.5px] px-2 py-0.5 rounded font-extrabold transition-all ${
                    businessPhase === 'FAST_GROWTH' 
                      ? 'bg-white text-indigo-700 shadow-3xs border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title={lang === 'VI' ? 'Khởi nghiệp, tăng trưởng nhanh' : 'Startup, Rapid expansion'}
                >
                  🚀 {lang === 'VI' ? 'Tăng trưởng' : 'Growth'}
                </button>
                <button
                  type="button"
                  onClick={() => setBusinessPhase('STABLE_SCALE')}
                  className={`text-[9.5px] px-2 py-0.5 rounded font-extrabold transition-all ${
                    businessPhase === 'STABLE_SCALE' 
                      ? 'bg-white text-indigo-700 shadow-3xs border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title={lang === 'VI' ? 'Doanh nghiệp lớn, duy trì ổn định' : 'Large scale, stable market'}
                >
                  ⚖️ {lang === 'VI' ? 'Ổn định' : 'Stable'}
                </button>
              </div>
            </div>


          </div>
        </div>

        {/* Current Active Filter Info Banner */}
        <div className="flex items-center justify-between mt-2.5">
          <p className="text-[12.5px] text-slate-500 leading-normal font-medium">
            {selectedDept && selectedDept !== 'ALL' ? (
              <span className="inline-flex items-center gap-1.5 bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded-md text-indigo-800 font-bold font-sans">
                🔍 {lang === 'VI' ? `Đang phân tích bộ phận: ${selectedDept}` : `Analyzing Department: ${selectedDept}`}
              </span>
            ) : null}
          </p>
        </div>

        {/* Overview Table */}
        <div className="mt-3">
          {filteredAnalysisData.length === 0 ? (
            <div className="py-8 text-center text-slate-400 font-bold text-sm">
              {lang === 'VI' ? 'Chưa có dữ liệu bộ phận.' : 'No department data available.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-2 px-3 text-[12px] font-black text-slate-500 uppercase tracking-wider w-[28%]">{lang === 'VI' ? 'Bộ phận' : 'Department'}</th>
                    <th className="text-center py-2 px-2 text-[12px] font-black text-slate-400 uppercase tracking-wider w-[8%]">{lang === 'VI' ? 'Nhân sự' : 'Headcount'}</th>
                    <th className="text-left py-2 px-3 text-[12px] font-black text-emerald-600 uppercase tracking-wider w-[18%]">{lang === 'VI' ? 'Nhóm Phát triển' : 'Growers'}</th>
                    <th className="text-left py-2 px-3 text-[12px] font-black text-amber-600 uppercase tracking-wider w-[18%]">{lang === 'VI' ? 'Nhóm Duy trì' : 'Keepers'}</th>
                    <th className="text-left py-2 px-3 text-[12px] font-black text-rose-500 uppercase tracking-wider w-[18%]">{lang === 'VI' ? 'Nhóm Cần bồi dưỡng' : 'Movers'}</th>
                    <th className="text-right py-2 px-3 text-[12px] font-black text-slate-400 uppercase tracking-wider w-[10%]">{lang === 'VI' ? 'Hồ sơ' : 'Profile'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalysisData.map((item, rowIdx) => (
                    <tr
                      key={item.dept}
                      onClick={() => setSelectedDeptDetail(item)}
                      className={`border-b border-slate-100 hover:bg-indigo-50/40 hover:border-indigo-200 transition-colors cursor-pointer ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                      title={lang === 'VI' ? 'Bấm để xem phân tích chi tiết' : 'Click for detailed analysis'}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-slate-900 leading-tight">{item.dept}</span>
                          <span className="text-[8px] text-indigo-400 font-bold opacity-0 group-hover:opacity-100">→</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-[13px] font-black text-slate-600">{item.total}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[12.5px] font-black text-emerald-600 w-8 shrink-0">{item.growersPct}%</span>
                          <div className="flex-1 bg-emerald-100 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${item.growersPct}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-400 w-4 text-right shrink-0">{item.growers}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[12.5px] font-black text-amber-600 w-8 shrink-0">{item.keepersPct}%</span>
                          <div className="flex-1 bg-amber-100 rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${item.keepersPct}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-400 w-4 text-right shrink-0">{item.keepers}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[12.5px] font-black text-rose-500 w-8 shrink-0">{item.moversPct}%</span>
                          <div className="flex-1 bg-rose-100 rounded-full h-2">
                            <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${item.moversPct}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-400 w-4 text-right shrink-0">{item.movers}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${item.profileBg}`}>
                          {lang === 'VI' ? item.profileVi : item.profileEn}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Popup Modal: Phân tích chi tiết từng bộ phận */}
        {selectedDeptDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedDeptDetail(null)}>
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-4 fade-in duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between rounded-t-2xl sticky top-0 z-10">
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wide">{selectedDeptDetail.dept}</h3>
                  <p className="text-slate-400 text-[12px] mt-0.5">
                    {selectedDeptDetail.total} {lang === 'VI' ? 'nhân sự' : 'people'} · {lang === 'VI' ? selectedDeptDetail.profileVi : selectedDeptDetail.profileEn}
                  </p>
                </div>
                <button onClick={() => setSelectedDeptDetail(null)} className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {/* Tỷ lệ 3 nhóm */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                    <span className="block text-2xl font-black text-emerald-600">{selectedDeptDetail.growersPct}%</span>
                    <span className="block text-[9px] font-bold text-emerald-600 uppercase mt-0.5">{lang === 'VI' ? 'Nhóm Phát triển' : 'Growers'}</span>
                    <span className="block text-[9px] text-slate-400 mt-0.5">{selectedDeptDetail.growers} {lang === 'VI' ? 'người' : 'people'}</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                    <span className="block text-2xl font-black text-amber-600">{selectedDeptDetail.keepersPct}%</span>
                    <span className="block text-[9px] font-bold text-amber-600 uppercase mt-0.5">{lang === 'VI' ? 'Nhóm Duy trì' : 'Keepers'}</span>
                    <span className="block text-[9px] text-slate-400 mt-0.5">{selectedDeptDetail.keepers} {lang === 'VI' ? 'người' : 'people'}</span>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                    <span className="block text-2xl font-black text-rose-600">{selectedDeptDetail.moversPct}%</span>
                    <span className="block text-[9px] font-bold text-rose-600 uppercase mt-0.5">{lang === 'VI' ? 'Cần bồi dưỡng' : 'Movers'}</span>
                    <span className="block text-[9px] text-slate-400 mt-0.5">{selectedDeptDetail.movers} {lang === 'VI' ? 'người' : 'people'}</span>
                  </div>
                </div>

                {/* Danh sách thành viên theo nhóm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[12px] uppercase tracking-wider font-extrabold text-amber-800 block mb-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {lang === 'VI' ? `Nhóm Duy trì (${selectedDeptDetail.keepers}):` : `Keepers (${selectedDeptDetail.keepers}):`}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedDeptDetail.keeperMembers?.length > 0 ? selectedDeptDetail.keeperMembers.map((name: string) => (
                        <span key={name} className="px-3 py-1 rounded-lg border text-[12px] font-semibold bg-white border-amber-200 text-amber-800">👤 {name}</span>
                      )) : <span className="text-[12px] text-slate-400 italic">{lang === 'VI' ? 'Không có' : 'None'}</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-[12px] uppercase tracking-wider font-extrabold text-emerald-800 block mb-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {lang === 'VI' ? `Nhóm Phát triển (${selectedDeptDetail.growers}):` : `Growers (${selectedDeptDetail.growers}):`}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedDeptDetail.growerMembers?.length > 0 ? selectedDeptDetail.growerMembers.map((name: string) => (
                        <span key={name} className="px-3 py-1 rounded-lg border text-[12px] font-semibold bg-white border-emerald-200 text-emerald-800">👤 {name}</span>
                      )) : <span className="text-[12px] text-slate-400 italic">{lang === 'VI' ? 'Không có' : 'None'}</span>}
                    </div>
                  </div>
                </div>

                {/* Đánh giá cấu trúc & Điểm mạnh */}
                <div className="p-5 bg-indigo-50/50 rounded-xl border border-indigo-200/50 space-y-3">
                  <span className="text-[12px] uppercase tracking-wider font-extrabold text-indigo-950 flex items-center gap-1.5 border-b border-indigo-100 pb-1.5">
                    🛡️ {lang === 'VI' ? 'ĐÁNH GIÁ CẤU TRÚC & ĐIỂM MẠNH ĐỘI NGŨ:' : 'STRUCTURAL STRENGTHS & ALIGNMENT ASSESSMENT:'}
                  </span>
                  <div className="prose prose-slate max-w-none text-slate-700 text-[13.5px] leading-relaxed font-sans space-y-2.5 markdown-body [&_strong]:font-extrabold [&_p]:font-medium">
                    <Markdown>{getPersonalizedStrengths(selectedDeptDetail, lang)}</Markdown>
                  </div>
                </div>

                {/* Rủi ro & Cảnh báo */}
                <div className="p-5 bg-rose-50/50 rounded-xl border border-rose-200/50 space-y-3">
                  <span className="text-[12px] uppercase tracking-wider font-extrabold text-rose-950 flex items-center gap-1.5 border-b border-rose-100 pb-1.5">
                    ⚠️ {lang === 'VI' ? 'RỦI RO THÁCH THỨC QUẢN TRỊ CHIẾN LƯỢC:' : 'CRITICAL RETENTION RISKS & DIAGNOSTIC WARNINGS:'}
                  </span>
                  <div className="prose prose-slate max-w-none text-slate-700 text-[13.5px] leading-relaxed font-sans space-y-2.5 markdown-body [&_strong]:font-extrabold [&_p]:font-medium">
                    <Markdown>{getPersonalizedRisks(selectedDeptDetail, lang)}</Markdown>
                  </div>
                </div>

                {/* Khuyến nghị hành động */}
                <div className="p-5 bg-indigo-950 text-indigo-50 rounded-xl space-y-3 border border-slate-900 shadow-md">
                  <span className="text-[12px] uppercase tracking-wider font-extrabold text-indigo-300 flex items-center justify-between border-b border-indigo-900/80 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      {lang === 'VI' ? 'KHUYẾN NGHỊ HÀNH ĐỘNG CHO MANAGER:' : 'DECISIONAL ROADMAPS FOR MANAGERS:'}
                    </span>
                    <span className="font-mono text-[9px] bg-indigo-900 px-2 py-0.5 rounded-full text-indigo-200">
                      {businessPhase === 'FAST_GROWTH'
                        ? (lang === 'VI' ? 'Tăng trưởng nhanh' : 'Fast Expansion')
                        : (lang === 'VI' ? 'Quy mô ổn định' : 'Stable Scale')}
                    </span>
                  </span>
                  <div className="prose prose-indigo max-w-none text-slate-100 text-[13.5px] leading-relaxed font-sans space-y-3 markdown-body [&_strong]:font-bold [&_p]:font-medium [&_li]:text-slate-200">
                    <Markdown>{getPersonalizedActions(selectedDeptDetail, businessPhase, lang)}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
