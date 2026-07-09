import React, { useState, useMemo, useEffect } from 'react';
import { Talent } from '../types';
import { ShieldAlert, Users, TrendingUp, HelpCircle, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Info, RefreshCw, Briefcase, Award, BellRing } from 'lucide-react';
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
          <h4 className="text-[12px] md:text-[13px] font-bold text-slate-800 uppercase tracking-wider font-sans flex items-center gap-1.5 leading-snug">
            📊 <span>{lang === 'VI' ? 'TỔNG QUAN & PHÂN TÍCH' : 'OVERVIEW & ANALYSIS'}</span>
          </h4>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                {lang === 'VI' ? 'Bộ phận:' : 'Dept:'}
              </span>
              <select
                id="internal-dept-select"
                value={selectedDept}
                onChange={(e) => onDeptChange && onDeptChange(e.target.value)}
                className="text-[11px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
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
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
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

            {/* Tabs Controllers */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                id="onboarding-dept-tab-overview"
                onClick={() => setActiveTab('overview')}
                className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeTab === 'overview' ? 'bg-white text-indigo-700 shadow-3xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                📊 {lang === 'VI' ? 'Tổng Quan' : 'Overview'}
              </button>
              <button
                type="button"
                id="onboarding-dept-tab-insights"
                onClick={() => setActiveTab('insights')}
                className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeTab === 'insights' ? 'bg-white text-indigo-700 shadow-3xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                💡 {lang === 'VI' ? 'Phân Tích Chi Tiết' : 'Diagnostics'}
              </button>
            </div>
          </div>
        </div>

        {/* Current Active Filter Info Banner */}
        <div className="flex items-center justify-between mt-2.5">
          <p className="text-[10.5px] text-slate-500 leading-normal font-medium">
            {selectedDept && selectedDept !== 'ALL' ? (
              <span className="inline-flex items-center gap-1.5 bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded-md text-indigo-800 font-bold font-sans">
                🔍 {lang === 'VI' ? `Đang phân tích bộ phận: ${selectedDept}` : `Analyzing Department: ${selectedDept}`}
              </span>
            ) : (
              <span>
                {lang === 'VI' 
                  ? 'Công cụ chẩn đoán nhân sự: Đánh giá tỉ lệ Keeper & Grower từ ma trận 9-Box để tối ưu hoá văn hoá & thăng tiến.'
                  : 'HR diagnostics: Evaluating Keeper & Grower ratios from 9-Box mapping to balance stability vs advancement.'}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex-1 pr-1">
        {selectedDept && selectedDept !== 'ALL' && (
          <div className="mb-4 bg-indigo-50/40 border border-indigo-200/60 rounded-xl p-4.5 text-left shadow-2xs hover:border-indigo-300 transition-all duration-200">
            <div className="flex items-start justify-between gap-3 border-b border-indigo-200 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100/85 rounded-lg text-indigo-700 font-bold text-sm">
                  🧠
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 font-display">
                    {lang === 'VI' ? 'Chẩn Đoán Chiến Lược Doanh Nghiệp (Bộ Phận)' : 'Strategic Business BU Talent Diagnostic (AI)'}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[9.5px] text-indigo-600 font-black font-mono">
                      L&D AI
                    </p>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-md text-[8.5px] font-extrabold text-amber-700 font-sans uppercase tracking-wider select-none">
                      ⚠️ {lang === 'VI' ? 'Đề xuất hỗ trợ bởi AI' : 'AI-Assisted Suggestion'}
                    </span>
                  </div>
                </div>
              </div>

              {isAiLoading && (
                <div className="flex items-center gap-1 bg-white border border-indigo-100 px-2.5 py-1 rounded-full text-[9.5px] text-indigo-700 font-extrabold shadow-3xs">
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                  <span>{lang === 'VI' ? 'Đang phân tích...' : 'Analyzing...'}</span>
                </div>
              )}
            </div>

            {isAiLoading ? (
              <div className="space-y-2.5 animate-pulse py-2">
                <div className="h-3 w-3/4 bg-indigo-100/70 rounded-full" />
                <div className="h-3 w-5/6 bg-indigo-100/70 rounded-full" />
                <div className="h-3 w-2/3 bg-indigo-100/70 rounded-full" />
                <div className="h-3 w-1/2 bg-indigo-100/70 rounded-full" />
              </div>
            ) : aiInsight ? (
              <div className="space-y-4">
                <div className="prose prose-slate max-w-none text-[11px] text-slate-700 leading-relaxed font-sans space-y-3.5 markdown-body [&_h4]:text-xs [&_h4]:font-black [&_h4]:text-indigo-950 [&_h4]:mt-4 [&_h4]:first:mt-0 [&_h4]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_li]:font-semibold [&_p]:font-medium">
                  <Markdown>{aiInsight}</Markdown>
                </div>
                
                {/* AI Advice warning disclaimer */}
                <div id="ai-disclaimer-diag" className="mt-3.5 flex items-start gap-2 p-2.5 bg-rose-50/70 border border-rose-200/60 rounded-xl text-[10px] sm:text-[11px] leading-relaxed text-rose-800 shadow-3xs select-none">
                  <BellRing className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <span className="font-extrabold uppercase tracking-wider text-rose-900 mr-1.5 inline-block text-[9.5px] sm:text-[10.5px]">
                      {lang === 'VI' ? '⚠️ ĐỀ XUẤT HỖ TRỢ TỪ AI:' : '⚠️ AI-DRIVEN ASSISTANT SUGGESTION:'}
                    </span>
                    {lang === 'VI'
                      ? 'Ý kiến chẩn đoán này là đề xuất hỗ trợ từ AI phục vụ công tác tham khảo, không phải là quyết định chính thức. Các quyết định cuối cùng thuộc về các Bộ phận Chức năng/ Chuyên môn hoặc Trưởng bộ phận.'
                      : 'This advisory diagnostic is an AI suggestion for planning reference. Final decisions belong to the Functional/Specialized Departments or Department Heads.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-3 text-center flex flex-col items-center justify-center gap-2.5">
                <p className="text-[10.5px] text-slate-500 font-semibold max-w-[420px] mx-auto">
                  {lang === 'VI'
                    ? 'Bấm nút bên dưới để Trợ lý AI phân tích và đưa ra đánh giá, lưu ý thực tế kèm gợi ý hành động bằng ngôn ngữ đời thường cho bộ phận này.'
                    : 'Click the button below to have the AI Advisor analyze the team and draft easy-to-understand guidance for this department.'}
                </p>
                <button
                  type="button"
                  onClick={handleTriggerAiAnalysis}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10.5px] px-4 py-1.5 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer border-none"
                >
                  ✨ {lang === 'VI' ? 'Kích hoạt AI Phân tích' : 'Activate AI Analysis'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' ? (
          <div>
            {/* Redesigned: Clean table layout */}
            {filteredAnalysisData.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-bold text-sm">
                {lang === 'VI' ? 'Chưa có dữ liệu bộ phận.' : 'No department data available.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[30%]">{lang === 'VI' ? 'Bộ phận' : 'Department'}</th>
                      <th className="text-center py-2 px-2 text-[10px] font-black text-slate-400 uppercase tracking-wider w-[6%]">NS</th>
                      <th className="text-left py-2 px-3 text-[10px] font-black text-emerald-600 uppercase tracking-wider w-[18%]">Growers</th>
                      <th className="text-left py-2 px-3 text-[10px] font-black text-amber-600 uppercase tracking-wider w-[18%]">Keepers</th>
                      <th className="text-left py-2 px-3 text-[10px] font-black text-rose-500 uppercase tracking-wider w-[18%]">Movers</th>
                      <th className="text-right py-2 px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-[10%]">{lang === 'VI' ? 'Hồ sơ' : 'Profile'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnalysisData.map((item, rowIdx) => (
                      <tr key={item.dept} className={`border-b border-slate-100 hover:bg-slate-50/60 transition-colors cursor-pointer ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                        {/* Bộ phận */}
                        <td className="py-2.5 px-3">
                          <span className="text-[12px] font-bold text-slate-900 leading-tight">{item.dept}</span>
                        </td>
                        {/* Nhân sự */}
                        <td className="py-2.5 px-2 text-center">
                          <span className="text-[12px] font-black text-slate-600">{item.total}</span>
                        </td>
                        {/* Growers */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-emerald-600 w-8 shrink-0">{item.growersPct}%</span>
                            <div className="flex-1 bg-emerald-100 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${item.growersPct}%` }} />
                            </div>
                            <span className="text-[9px] text-slate-400 w-4 text-right shrink-0">{item.growers}</span>
                          </div>
                        </td>
                        {/* Keepers */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-amber-600 w-8 shrink-0">{item.keepersPct}%</span>
                            <div className="flex-1 bg-amber-100 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${item.keepersPct}%` }} />
                            </div>
                            <span className="text-[9px] text-slate-400 w-4 text-right shrink-0">{item.keepers}</span>
                          </div>
                        </td>
                        {/* Movers */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-rose-500 w-8 shrink-0">{item.moversPct}%</span>
                            <div className="flex-1 bg-rose-100 rounded-full h-2">
                              <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${item.moversPct}%` }} />
                            </div>
                            <span className="text-[9px] text-slate-400 w-4 text-right shrink-0">{item.movers}</span>
                          </div>
                        </td>
                        {/* Profile badge */}
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setShowExplanation(true); }}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap cursor-pointer ${item.profileBg}`}
                          >
                            {lang === 'VI' ? item.profileVi : item.profileEn}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* EXPANDABLE LOGIC CRITERIA & EXPLANATION LEGEND */}
            <div id="explanation-legend-card" className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4.5 text-xs text-left transition-all duration-500">
              <button 
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full flex items-center justify-between text-[11.5px] font-black text-indigo-950 cursor-pointer hover:text-indigo-800 select-none pb-0.5"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
                  <span>{lang === 'VI' ? 'HỌC THUẬT: ĐỊNH NGHĨA KHOA HỌC & HƯỚNG DẪN HÀNH ĐỘNG CHI TIẾT' : 'ACADEMIC THEORY: SCIENTIFIC TERMS & STRATEGIC ACTION GUIDE'}</span>
                </span>
                {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showExplanation && (
                <div className="mt-4 space-y-6">
                  {/* Part 0: Academic Origin Citation */}
                  <div className="bg-indigo-950 text-indigo-100 rounded-2xl p-5 border border-indigo-900 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-indigo-900 pb-2">
                      <h5 className="text-[11px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-2">
                        🎓 {lang === 'VI' ? 'CƠ SỞ KHOA HỌC & LÝ THUYẾT QUẢN TRỊ' : 'ACADEMIC FOUNDATION & MANAGEMENT THEORY'}
                      </h5>
                      <span className="text-[8.5px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-mono font-black uppercase tracking-wider">
                        {lang === 'VI' ? 'Chuẩn Quốc Tế' : 'Global Standards'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10.5px] leading-relaxed relative hover:bg-white/10 transition-colors">
                        <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 text-[8.5px] font-black bg-indigo-500 text-slate-950 rounded-full font-mono uppercase tracking-widest scale-90">1970s</span>
                        <span className="block font-bold text-indigo-300 mb-1">🏛️ {lang === 'VI' ? 'Lý thuyết Gốc' : 'Historical Root'}</span>
                        <p className="text-indigo-200/90 font-medium">
                          {lang === 'VI' ? (
                            <>Kế thừa trực tiếp từ <strong>Ma trận GE-McKinsey 9-Box</strong> cổ điển do McKinsey & Company phát triển vào những năm 1970.</>
                          ) : (
                            <>Directly inherited from the classic <strong>GE-McKinsey 9-Box Grid</strong>, pioneered by McKinsey & Company and General Electric.</>
                          )}
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10.5px] leading-relaxed relative hover:bg-white/10 transition-colors">
                        <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 text-[8.5px] font-black bg-teal-500 text-slate-950 rounded-full font-mono uppercase tracking-widest scale-90">Lean</span>
                        <span className="block font-bold text-indigo-300 mb-1">📐 {lang === 'VI' ? 'Cải tiến Tinh gọn' : 'Lean Optimization'}</span>
                        <p className="text-indigo-200/90 font-medium">
                          {lang === 'VI' ? (
                            <>Gộp 9 ô phức tạp thành <strong>3 phân khúc cốt lõi</strong> để tránh gây rối mắt và lãng phí nguồn lực trong thực tế sản xuất.</>
                          ) : (
                            <>Consolidates 9 complex coordinates into <strong>3 core strategic cohorts</strong> to avoid visual overload on the shopfloor.</>
                          )}
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10.5px] leading-relaxed relative hover:bg-white/10 transition-colors">
                        <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 text-[8.5px] font-black bg-amber-500 text-slate-950 rounded-full font-mono uppercase tracking-widest scale-90">Impact</span>
                        <span className="block font-bold text-indigo-300 mb-1">🎯 {lang === 'VI' ? 'Tính Thực Tiễn' : 'Direct Impact'}</span>
                        <p className="text-indigo-200/90 font-medium">
                          {lang === 'VI' ? (
                            <>Được khuyên dùng bởi <strong>CIPD, Korn Ferry, SHL</strong> nhằm giúp HOD và L&D đưa ra quyết định hành động ngay lập tức.</>
                          ) : (
                            <>Validated by <strong>CIPD, Korn Ferry, and SHL</strong> to help supervisors and L&D launch instant targeted interventions.</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Part 1: 3 Talent Cohorts */}
                  <div>
                    <h6 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2.5 border-b border-slate-200 pb-1">
                      {lang === 'VI' ? '1. ĐỊNH NGHĨA 3 PHÂN KHÚC NHÂN SỰ CHIẾN LƯỢC' : '1. STRATEGIC DEFINITIONS OF THE 3 COHORTS'}
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Growers */}
                      <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/80 text-[11px] space-y-1.5">
                        <h5 className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{lang === 'VI' ? 'Nhóm phát triển (Growers)' : 'Growers (Talent Pipeline)'}</span>
                        </h5>
                        <p className="text-slate-650 leading-relaxed">
                          {lang === 'VI'
                            ? 'Thuộc các ô (1, 2, 4) trên 9-Box có tiềm năng phát triển và học hỏi rất nhanh. Đây là nguồn nhân tài kế thừa trực tiếp để dẫn dắt các dự án cải tiến và sẵn sàng bứt phá lên các cấp quản lý.'
                            : 'Mapped to cells (1, 2, 4) in the 9-Box. Characterized by high learning agility and drive. They represent the immediate succession pipeline ready to steer complex future projects.'}
                        </p>
                        <div className="text-[10px] font-mono text-emerald-700 bg-white/80 px-2 py-0.5 rounded border border-emerald-100 font-bold inline-block">
                          {lang === 'VI' ? 'Mục tiêu: Tăng tốc & Thử thách' : 'Focus: Accelerate & Challenge'}
                        </div>
                      </div>

                      {/* Keepers */}
                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 text-[11px] space-y-1.5">
                        <h5 className="font-extrabold text-amber-950 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{lang === 'VI' ? 'Nhóm duy trì (Keepers)' : 'Keepers (Core Backbone)'}</span>
                        </h5>
                        <p className="text-slate-655 leading-relaxed">
                          {lang === 'VI'
                            ? 'Thuộc các ô (3, 5, 6) làm việc với hiệu suất rất vững vàng, có chuyên môn nghiệp vụ sâu sắc. Họ là "xương sống" bảo đảm các mảng vận hành của nhà máy luôn ổn định và đạt chỉ tiêu.'
                            : 'Mapped to cells (3, 5, 6). Highly reliable performers with deep institutional knowledge. They are the backbone of daily operations, ensuring consistent factory output and stable processes.'}
                        </p>
                        <div className="text-[10px] font-mono text-amber-700 bg-white/80 px-2 py-0.5 rounded border border-amber-100 font-bold inline-block">
                          {lang === 'VI' ? 'Mục tiêu: Ghi nhận & Giữ chân' : 'Focus: Recognize & Retain'}
                        </div>
                      </div>

                      {/* Movers */}
                      <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200/80 text-[11px] space-y-1.5">
                        <h5 className="font-extrabold text-rose-950 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                          <span>{lang === 'VI' ? 'Nhóm cần bồi dưỡng (Movers)' : 'Movers (Support Cohort)'}</span>
                        </h5>
                        <p className="text-slate-650 leading-relaxed">
                          {lang === 'VI'
                            ? 'Thuộc các ô (7, 8, 9) gồm nhân sự mới học việc, người vừa nhận việc chưa quen tay, hoặc đang hụt hiệu suất. Cần có sự đồng hành rèn rũa nghiêm túc từ cấp trên và buddy.'
                            : 'Mapped to cells (7, 8, 9). Represents new joiners, recently promoted individuals still in training, or underperformers. They require targeted OJT and active mentorship to bridge gaps.'}
                        </p>
                        <div className="text-[10px] font-mono text-rose-700 bg-white/80 px-2 py-0.5 rounded border border-rose-100 font-bold inline-block">
                          {lang === 'VI' ? 'Mục tiêu: Kèm cặp & Đào tạo lại' : 'Focus: Mentor & Re-skill'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Part 2: 5 Health Statuses with actionable plans */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 border-b border-slate-200 pb-1.5">
                      <h6 className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                        {lang === 'VI' ? '2. CHI TIẾT Ý NGHĨA BIỂU ĐỒ & KHUYẾN NGHỊ HÀNH ĐỘNG HOD / HRBP' : '2. DETAILED STATUS INTERPRETATION & HOD / HRBP ACTION GUIDE'}
                      </h6>
                      <div className="text-[9px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold font-sans">
                        {isLdMode ? (
                          <span>✨ {lang === 'VI' ? 'Chế độ L&D đang Bật: Hiển thị Đề xuất L&D' : 'L&D Mode Active: Showing L&D Action Plans'}</span>
                        ) : (
                          <span>💡 {lang === 'VI' ? 'Bật chế độ L&D trên thanh công cụ để xem thêm đề xuất cho L&D' : 'Toggle L&D Specialist mode on top header to show L&D actions'}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Balanced */}
                      <div className="bg-white p-3 rounded-xl border-l-4 border-l-indigo-500 border-slate-200/80 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100 mb-2">
                          <span className="font-extrabold text-indigo-950 text-[11.5px] flex items-center gap-1">
                            <span>🟢 {lang === 'VI' ? 'Cơ cấu Cân đối - Đủ Kế thừa' : 'Balanced - Ready Pipeline'}</span>
                            <span className="text-[9.5px] text-slate-400 font-mono font-bold">(Keepers ≥ 40%, Growers ≥ 20%, Movers ≤ 20%)</span>
                          </span>
                          <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{lang === 'VI' ? 'Tối Ưu' : 'Optimal'}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                          <div>
                            <span className="font-bold text-slate-700 block">{lang === 'VI' ? '🔍 Ý nghĩa chỉ số:' : '🔍 Meaning:'}</span>
                            <p className="text-slate-500 mt-0.5">
                              {lang === 'VI' ? 'Đội ngũ có độ ổn định cực cao nhờ lực lượng nòng cốt (Keepers) vững vàng, đồng thời có đủ hạt giống kế thừa (Growers) để sẵn sàng thay thế khi có thay đổi nhân sự chủ chốt.' : 'The team boasts extreme stability due to solid core experts (Keepers), backed by a healthy pool of high-potential leaders (Growers) ready for seamless transition.'}
                            </p>
                          </div>
                          <div>
                            <span className="font-black text-indigo-950 block">{lang === 'VI' ? '🚀 Việc cần làm ngay (Action Plan):' : '🚀 Immediate Next Steps:'}</span>
                            <ul className="list-disc list-inside text-slate-650 mt-0.5 space-y-1">
                              {lang === 'VI' ? (
                                <>
                                  <li>🌱 <strong>Đề xuất cân nhắc:</strong> Tạo điều kiện cho nhóm Growers tham gia chương trình Thử thách tạm quyền (Shadowing) các vị trí quản lý để tích lũy kinh nghiệm thực tế.</li>
                                  {isLdMode && (
                                    <li className="text-indigo-950 font-medium">📚 <strong>Lập kế hoạch L&D:</strong> Triển khai các hoạt động ghi nhận đóng góp và vinh danh lực lượng Keepers cốt cán, tránh bỏ quên họ do quá tập trung vào nhóm Growers tiềm năng.</li>
                                  )}
                                </>
                              ) : (
                                <>
                                  <li>🌱 <strong>Suggested Action:</strong> Consider involving Growers in executive shadowing or minor operational leadership roles to build practical headroom.</li>
                                  {isLdMode && (
                                    <li className="text-indigo-950 font-medium">📚 <strong>L&D Engagement:</strong> Design recognition schemes specifically for core Keepers to secure long-term operational loyalty.</li>
                                  )}
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Growth Nucleus */}
                      <div className="bg-white p-3 rounded-xl border-l-4 border-l-emerald-500 border-slate-200/80 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100 mb-2">
                          <span className="font-extrabold text-emerald-950 text-[11.5px] flex items-center gap-1">
                            <span>⚡ {lang === 'VI' ? 'Nhiều Tiềm năng (Growers)' : 'High Potential (Growers)'}</span>
                            <span className="text-[9.5px] text-slate-400 font-mono font-bold">(Growers ≥ 35%)</span>
                          </span>
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{lang === 'VI' ? 'Cơ Hội & Rủi Ro Rời Bỏ Cao' : 'High Opportunity & Retention Risk'}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                          <div>
                            <span className="font-bold text-slate-700 block">{lang === 'VI' ? '🔍 Ý nghĩa chỉ số:' : '🔍 Meaning:'}</span>
                            <p className="text-slate-500 mt-0.5">
                              {lang === 'VI' ? 'Bộ phận có năng lực học hỏi, đổi mới sáng tạo xuất sắc. Tuy nhiên, nếu không có đủ không gian để họ thăng tiến hoặc cọ xát thực tế, nhóm này sẽ rất nhanh chán và rời bỏ tổ chức.' : 'Highly innovative and agile team profile. However, if there are insufficient promotion avenues or lack of dynamic work, this talent group will quickly disengage and look for external offers.'}
                            </p>
                          </div>
                          <div>
                            <span className="font-black text-emerald-950 block">{lang === 'VI' ? '🚀 Việc cần làm ngay (Action Plan):' : '🚀 Immediate Next Steps:'}</span>
                            <ul className="list-disc list-inside text-slate-650 mt-0.5 space-y-1">
                              {lang === 'VI' ? (
                                <>
                                  <li>🌱 <strong>Đề xuất cân nhắc:</strong> Ưu tiên giao các dự án cải tiến thực tiễn (Kaizen/Six Sigma) hoặc áp dụng luân chuyển công việc (Job Rotation) linh hoạt để thử sức nhân sự.</li>
                                  {isLdMode && (
                                    <li className="text-emerald-950 font-medium">📚 <strong>Lập kế hoạch L&D:</strong> Chủ động làm việc với HRBP để thiết lập cơ chế lộ trình thăng tiến nhanh (Fast-track) và rà soát các chính sách giữ chân tài năng xuất sắc.</li>
                                  )}
                                </>
                              ) : (
                                <>
                                  <li>🌱 <strong>Suggested Action:</strong> Consider assigning ambitious Kaizen/Six Sigma improvement projects or initiating structured job rotations to expand capabilities.</li>
                                  {isLdMode && (
                                    <li className="text-emerald-950 font-medium">📚 <strong>L&D Engagement:</strong> Partner with HRBPs to co-design fast-track progression programs and evaluate retention packages for critical growth talent.</li>
                                  )}
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Core Backbone */}
                      <div className="bg-white p-3 rounded-xl border-l-4 border-l-amber-500 border-slate-200/80 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100 mb-2">
                          <span className="font-extrabold text-amber-950 text-[11.5px] flex items-center gap-1">
                            <span>🧱 {lang === 'VI' ? 'Nòng cốt Vững chắc (Keepers)' : 'Solid Backbone (Keepers)'}</span>
                            <span className="text-[9.5px] text-slate-400 font-mono font-bold">(Keepers ≥ 65%)</span>
                          </span>
                          <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{lang === 'VI' ? 'Bền Bỉ & Nguy Cơ Trì Trệ' : 'Highly Stable & Complacency Risk'}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                          <div>
                            <span className="font-bold text-slate-700 block">{lang === 'VI' ? '🔍 Ý nghĩa chỉ số:' : '🔍 Meaning:'}</span>
                            <p className="text-slate-500 mt-0.5">
                              {lang === 'VI' ? 'Đội ngũ cực kỳ lành nghề, vận hành trơn tru hàng ngày. Tuy vậy, điểm yếu là thiếu tính đột phá, ít người có thể đứng ra kế thừa các vị trí quản lý cốt cán nếu có biến động đột ngột.' : 'Superior operational execution and day-to-day throughput. The main risk is a lack of leadership successors and reduced agility toward strategic changes.'}
                            </p>
                          </div>
                          <div>
                            <span className="font-black text-amber-950 block">{lang === 'VI' ? '🚀 Việc cần làm ngay (Action Plan):' : '🚀 Immediate Next Steps:'}</span>
                            <ul className="list-disc list-inside text-slate-650 mt-0.5 space-y-1">
                              {lang === 'VI' ? (
                                <>
                                  <li>🌱 <strong>Đề xuất cân nhắc:</strong> Khích lệ và tạo cơ chế cho các Keepers đứng lớp chia sẻ kinh nghiệm nội bộ (Knowledge Sharing) hoặc làm Mentor kèm cặp nhân sự mới.</li>
                                  {isLdMode && (
                                    <li className="text-amber-950 font-medium">📚 <strong>Lập kế hoạch L&D:</strong> Thiết kế và đề xuất các chương trình Đào tạo Chuyên sâu (Subject Matter Expert) để nâng cao tầm chuyên môn kỹ thuật xuất sắc bậc cao cho tổ chức.</li>
                                  )}
                                </>
                              ) : (
                                <>
                                  <li>🌱 <strong>Suggested Action:</strong> Encourage Keepers to act as internal trainers, subject mentors, or key buddies to systematically transfer plant skills.</li>
                                  {isLdMode && (
                                    <li className="text-amber-950 font-medium">📚 <strong>L&D Engagement:</strong> Develop specialist training pathways and professional certifications to build a solid network of Subject Matter Experts (SMEs).</li>
                                  )}
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Performance Deficit */}
                      <div className="bg-white p-3 rounded-xl border-l-4 border-l-rose-500 border-slate-200/80 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100 mb-2">
                          <span className="font-extrabold text-rose-950 text-[11.5px] flex items-center gap-1">
                            <span>⚠️ {lang === 'VI' ? 'Cần Hỗ trợ Đào tạo (Movers)' : 'Needs Training (Movers)'}</span>
                            <span className="text-[9.5px] text-slate-400 font-mono font-bold">(Movers ≥ 20%)</span>
                          </span>
                          <span className="text-[9px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{lang === 'VI' ? 'Báo Động Hiệu Suất' : 'Performance Alert'}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                          <div>
                            <span className="font-bold text-slate-700 block">{lang === 'VI' ? '🔍 Ý nghĩa chỉ số:' : '🔍 Meaning:'}</span>
                            <p className="text-slate-500 mt-0.5">
                              {lang === 'VI' ? 'Mật độ nhân sự học việc hoặc tay nghề yếu vượt ngưỡng an toàn. Hiệu suất đầu ra của cả bộ phận đang gánh rủi ro lớn, dễ xảy ra lỗi quy trình, phế phẩm hoặc đình trệ công việc.' : 'Apprentice density has exceeded safe thresholds. The department output is under severe strain, threatening quality metrics and overall throughput goals.'}
                            </p>
                          </div>
                          <div>
                            <span className="font-black text-rose-950 block">{lang === 'VI' ? '🚀 Việc cần làm ngay (Action Plan):' : '🚀 Immediate Next Steps:'}</span>
                            <ul className="list-disc list-inside text-slate-650 mt-0.5 space-y-1">
                              {lang === 'VI' ? (
                                <>
                                  <li>🌱 <strong>Đề xuất cân nhắc:</strong> Phối hợp sắp xếp lộ trình Kèm cặp 1-kèm-1 (Buddy System) với nhân sự lành nghề hỗ trợ trong vòng 60 ngày.</li>
                                  {isLdMode && (
                                    <li className="text-rose-950 font-medium">📚 <strong>Lập kế hoạch L&D:</strong> Hỗ trợ thiết kế bộ tài liệu huấn luyện thực hành (On-the-Job Training) và đồng hành kiểm tra sát sao định kỳ tay nghề của nhân sự.</li>
                                  )}
                                </>
                              ) : (
                                <>
                                  <li>🌱 <strong>Suggested Action:</strong> Recommend pairing learners/new staff with a senior buddy in a structured 1-on-1 development plan for 60 days.</li>
                                  {isLdMode && (
                                    <li className="text-rose-950 font-medium">📚 <strong>L&D Engagement:</strong> Launch targeted skill-gap refresher interventions and supply structured tracking templates for weekly capability audits.</li>
                                  )}
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Standard */}
                      <div className="bg-white p-3 rounded-xl border-l-4 border-l-slate-400 border-slate-200/80 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100 mb-2">
                          <span className="font-extrabold text-slate-950 text-[11.5px] flex items-center gap-1">
                            <span>⚖️ {lang === 'VI' ? 'Phân bổ Tiêu chuẩn' : 'Standard Distribution'}</span>
                            <span className="text-[9.5px] text-slate-400 font-mono font-bold">({lang === 'VI' ? 'Phân bổ đều' : 'Standard balance'})</span>
                          </span>
                          <span className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{lang === 'VI' ? 'Ổn Định Thường Nhật' : 'Business As Usual'}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                          <div>
                            <span className="font-bold text-slate-700 block">{lang === 'VI' ? '🔍 Ý nghĩa chỉ số:' : '🔍 Meaning:'}</span>
                            <p className="text-slate-500 mt-0.5">
                              {lang === 'VI' ? 'Tỷ lệ phân bổ nằm ở mức trung bình ổn định của nhà máy. Chưa có nguy cơ bùng phát rủi ro nhưng cũng chưa bộc lộ điểm bứt phá nhân lực vượt trội.' : 'Metrics sit within general plant averages. The team has no active talent crises but is also missing clear catalysts for high-velocity breakthrough growth.'}
                            </p>
                          </div>
                          <div>
                            <span className="font-black text-slate-950 block">{lang === 'VI' ? '🚀 Việc cần làm ngay (Action Plan):' : '🚀 Immediate Next Steps:'}</span>
                            <ul className="list-disc list-inside text-slate-650 mt-0.5 space-y-1">
                              {lang === 'VI' ? (
                                <>
                                  <li>🌱 <strong>Đề xuất cân nhắc:</strong> Khuyến khích nhân viên tự rà soát lỗ hổng kỹ năng và chủ động đề xuất các chuyên đề học tập tự chọn phù hợp với nguyện vọng cá nhân.</li>
                                  {isLdMode && (
                                    <li className="text-slate-650 font-medium">📚 <strong>Lập kế hoạch L&D:</strong> Định kỳ theo dõi sự chuyển dịch hiệu suất/tiềm năng qua các đợt đánh giá 9-Box tiếp theo để phát hiện sớm hạt giống tiềm năng mới nổi lên.</li>
                                  )}
                                </>
                              ) : (
                                <>
                                  <li>🌱 <strong>Suggested Action:</strong> Encourage employees to self-audit their skill gaps and request customized credentials or elective courses.</li>
                                  {isLdMode && (
                                    <li className="text-slate-650 font-medium">📚 <strong>L&D Engagement:</strong> Track micro-performance and potential changes over the next formal assessment cycles to catch newly emerging talent sparks early.</li>
                                  )}
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[9.5px] text-slate-500 italic bg-white p-3 rounded-xl border border-slate-200 leading-relaxed shadow-3xs">
                    💡 {lang === 'VI' 
                      ? 'Lưu ý vận hành: Đây là cẩm nang chiến lược chuyển dịch lý thuyết nhân sự 9-Box kinh điển thành hành động cụ thể tại Wanek & Millennium. HOD và L&D nên ngồi lại định kỳ mỗi quý một lần để rà soát danh sách và điều chỉnh các biện pháp rèn rũa nhân lực kịp thời.' 
                      : 'Operational Note: This framework is a practical guide mapping academic 9-Box theory into factory-floor actions at Wanek & Millennium. HODs and L&D partners should review this list quarterly to ensure correct resource allocation.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 font-sans text-left pb-2">
            {/* Top Warning disclaimer for AI output */}
            <div className="bg-indigo-50/50 border border-indigo-150/70 text-indigo-900 rounded-2xl p-3.5 text-[10.5px] leading-relaxed font-semibold flex items-start gap-2.5 shadow-3xs select-none">
              <span className="p-1 bg-indigo-100 rounded-lg text-indigo-700 font-bold text-xs">✨</span>
              <div>
                <span className="font-extrabold text-indigo-950 uppercase tracking-wider block mb-0.5">
                  {lang === 'VI' ? '🤖 NHẬN ĐỊNH & KHUYẾN NGHỊ ĐƯỢC ĐỀ XUẤT BỞI AI' : '🤖 AI-GENERATED ASSESSMENTS & RETENTION WARNINGS'}
                </span>
                {lang === 'VI' 
                  ? 'Toàn bộ các rà soát cấu trúc phòng ban, dự đoán rủi ro nghỉ việc và kế hoạch hoạt động dưới đây được xử lý tự động, cung cấp góc nhìn và cảnh báo chiến lược tối ưu cho nhà quản lý.'
                  : 'All departmental structure checks, attrition warning thresholds, and operational checklists below are generated automatically by AI to assist supervisors and HODs.'}
              </div>
            </div>

            {filteredAnalysisData.map((item, idx) => {
              const isOptimal = item.keepersPct >= 40 && item.growersPct >= 20 && item.moversPct <= 20;
              
              return (
                <div key={item.dept} className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-slate-50/30 interactive-hover-lift" id={idx === 0 ? "onboarding-dept-detail-card" : `detail-acc-${item?.dept}`}>
                  {/* Item Header */}
                  <div className="bg-slate-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs md:text-[13px] text-slate-800 tracking-tight">{item.dept}</span>
                        <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                          {item.total} {lang === 'VI' ? 'nhân sự' : 'heads'}
                        </span>
                        {/* AI suggest tag */}
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[8.5px] font-extrabold rounded-md uppercase tracking-wider select-none">
                          ⚠️ {lang === 'VI' ? 'AI Đề xuất & Cảnh báo' : 'AI Suggested & Warned'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                        <span>{lang === 'VI' ? 'Kiểu cơ cấu:' : 'Structure Profile:'}</span>
                        <span className={`font-extrabold uppercase ${item.profileText}`}>
                          {lang === 'VI' ? item.profileVi : item.profileEn}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10.5px] font-mono text-slate-500 bg-white border border-slate-250/55 rounded-lg px-2.5 py-1 flex items-center gap-3">
                      <span>🟢 Growers: <strong className="text-emerald-700">{item.growersPct}%</strong></span>
                      <span className="text-slate-300">|</span>
                      <span>🟡 Keepers: <strong className="text-amber-700">{item.keepersPct}%</strong></span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white space-y-4 text-xs">
                    {/* FACTUAL REAL-TIME BINDING OF MEMBERS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50/50 p-3 rounded-xl border border-slate-200/60 shadow-3xs">
                      <div>
                        <span className="text-[10.5px] uppercase tracking-wider font-extrabold text-amber-800 block mb-1.5 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          {lang === 'VI' ? `Lực lượng Keepers (${item.keepers} nhân sự):` : `Keeper Core Personnel (${item.keepers}):`}
                        </span>
                        {item.keeperMembers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.keeperMembers.map(name => {
                              return (
                                <span 
                                  key={name} 
                                  className="px-2 py-0.5 rounded border text-[10px] font-extrabold transition-all shadow-3xs bg-white border-slate-200 text-slate-700"
                                >
                                  👤 {name}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[10.5px] text-slate-400 italic font-medium block">
                            {lang === 'VI' ? 'Không có nhân viên nhóm này.' : 'Zero Keeper personnel in this BU.'}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10.5px] uppercase tracking-wider font-extrabold text-emerald-800 block mb-1.5 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          {lang === 'VI' ? `Lực lượng Growers (${item.growers} nhân sự):` : `Grower Core Personnel (${item.growers}):`}
                        </span>
                        {item.growerMembers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.growerMembers.map(name => {
                              return (
                                <span 
                                  key={name} 
                                  className="px-2 py-0.5 rounded border text-[10px] font-extrabold transition-all shadow-3xs bg-white border-slate-200 text-slate-700"
                                >
                                  👤 {name}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[10.5px] text-slate-400 italic font-medium block">
                            {lang === 'VI' ? 'Không có nhân viên nhóm này.' : 'Zero Grower personnel in this BU.'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DYNAMIC METRIC-BASED CORP HEALTH ASSESSMENT */}
                    <div className="space-y-3.5 pt-0.5">
                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200/50 space-y-2" id={idx === 0 ? "onboarding-dept-strengths" : `strengths-${item?.dept}`}>
                        <span className="text-[11px] uppercase tracking-wider font-extrabold text-indigo-950 flex items-center gap-1.5 border-b border-indigo-100/80 pb-1.5">
                          🛡️ {lang === 'VI' ? 'ĐÁNH GIÁ CẤU TRÚC VÀ ĐIỂM MẠNH ĐỘI NGŨ:' : 'STRUCTURAL STRENGTHS & ALIGNMENT ASSESSMENT:'}
                        </span>

                        <div className="prose prose-slate max-w-none text-slate-700 text-[11px] leading-relaxed font-sans space-y-2 markdown-body [&_strong]:font-extrabold [&_p]:font-medium">
                          <Markdown>{getPersonalizedStrengths(item, lang)}</Markdown>
                        </div>
                      </div>

                      {/* RISKS AND STRATEGIC THREATS */}
                      <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200/50 space-y-2" id={idx === 0 ? "onboarding-dept-risks" : `risks-${item?.dept}`}>
                        <span className="text-[11px] uppercase tracking-wider font-extrabold text-rose-950 flex items-center gap-1.5 border-b border-rose-100 pb-1.5">
                          ⚠️ {lang === 'VI' ? 'RỦI RO THÁCH THỨC QUẢN TRỊ CHIẾN LƯỢC:' : 'CRITICAL RETENTION RISKS & DIAGNOSTIC WARNINGS:'}
                        </span>

                        <div className="prose prose-slate max-w-none text-slate-700 text-[11px] leading-relaxed font-sans space-y-2 markdown-body [&_strong]:font-extrabold [&_p]:font-medium">
                          <Markdown>{getPersonalizedRisks(item, lang)}</Markdown>
                        </div>
                      </div>

                      {/* TAILORED ACTIONS BASED ON CHOSEN BUSINESS STAGE */}
                      <div className="p-4 bg-indigo-950 text-indigo-50 rounded-xl space-y-2 border border-slate-900 shadow-md" id={idx === 0 ? "onboarding-dept-actions" : `actions-${item?.dept}`}>
                        <span className="text-[11px] uppercase tracking-wider font-extrabold text-indigo-300 flex items-center justify-between border-b border-indigo-900/80 pb-2">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-emerald-400" />
                            {lang === 'VI' ? 'KHUYẾN NGHỊ HÀNH ĐỘNG CHO MANAGER (MÁP THEO GIAI ĐOẠN HOẠT ĐỘNG):' : 'DECISIONAL ROADMAPS FOR MANAGERS BASED ON ACTIVITY STAGE:'}
                          </span>
                          <span className="font-mono text-[9px] bg-indigo-900 px-2 py-0.5 rounded-full text-indigo-200">
                            {businessPhase === 'FAST_GROWTH' 
                              ? (lang === 'VI' ? 'Giai đoạn: TĂNG TRƯỞNG NHANH' : 'Phase: FAST EXPANSION')
                              : (lang === 'VI' ? 'Giai đoạn: QUY MÔ ỔN ĐỊNH' : 'Phase: LARGE-STABLE SCALE')}
                          </span>
                        </span>

                        <div className="prose prose-indigo max-w-none text-slate-100 text-[11px] leading-relaxed font-sans space-y-2.5 markdown-body [&_strong]:font-bold [&_p]:font-medium [&_li]:text-slate-200">
                          <Markdown>{getPersonalizedActions(item, businessPhase, lang)}</Markdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
