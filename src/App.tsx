/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import NineBoxMatrix from './components/NineBoxMatrix';
import TalentProfileModal from './components/TalentProfileModal';
import PipelineWorkspace from './components/PipelineWorkspace';
import DevelopmentPlanWorkspace from './components/DevelopmentPlanWorkspace';
import IndividualIDPWorkspace from './components/IndividualIDPWorkspace';
import TalentComparisonView from './components/TalentComparisonView';
import WhyHowPlaybook from './components/WhyHowPlaybook';
import InsightPanel from './components/InsightPanel';
import { SearchableDeptDropdown } from './components/SearchableDeptDropdown';
import { DeptTalentAnalysisPanel } from './components/DeptTalentAnalysisPanel';
import OnboardingGuide from './components/OnboardingGuide';
import { dbTalentPool, allDepartments, wnkDepartments, ashDepartments, getFullPipeline, initialPipelinePositions } from './data';
import { validateData, logValidationResults, ValidationWarning } from './dataValidation';
import { Talent, NineBoxCell, NineBoxGroup } from './types';
import {
  TrendingUp,
  UserCheck,
  Award,
  BookOpen,
  Filter,
  Users,
  Grid,
  ChevronRight,
  Sparkles,
  Search,
  Download,
  AlertTriangle,
  Bell,
  BellRing,
  ArrowUpDown,
  ArrowLeftRight,
  HelpCircle,
  Lightbulb,
  X,
  Sliders,
  Check,
  Trash2,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, LabelList } from 'recharts';

const cohortDeepDives: Record<string, {
  summaryVi: string;
  summaryEn: string;
  recsVi: string[];
  recsEn: string[];
  courses: string[];
}> = {
  'Superstar': {
    summaryVi: 'Cán bộ Siêu sao tập hợp tài năng vượt trội nhất của công ty năm 2026. Đây là lực lượng kế thừa chiến lược trực tiếp cho các vị trí Ban điều hành và Giám đốc bộ phận sắp tới.',
    summaryEn: 'Superstars represent the apex of exceptional talent in 2026. They are designated as the direct strategic succession pipeline for upcoming Executive and Department Head roles.',
    recsVi: [
      'Giao làm Chủ nhiệm dự án đổi mới công nghệ liên phòng ban',
      'Đóng vai trò Cố vấn chuyên môn hoặc Huấn luyện viên đặc biệt cho lớp kế cận nâng cao',
      'Bố trí tham gia chương trình bồi dưỡng Mini-MBA của đối tác bên ngoài'
    ],
    recsEn: [
      'Appoint as leader for high-impact cross-functional innovation projects',
      'Assign roles as executive mentors/master-trainers for junior talents',
      'Enroll in corporate Mini-MBA pipeline fast-tracks'
    ],
    courses: ['Servant Leadership', 'Succession Planning & Talent Pipeline Review', 'Coaching & Mentoring']
  },
  'High Professional': {
    summaryVi: 'Lực lượng chuyên gia chuyên môn nòng cốt đạt Hiệu suất Xuất sắc vượt trội. Mục tiêu chiến lược năm 2026 là mở rộng tầm ảnh hưởng quản lý con người để chuyển đổi thành cấp quản lý toàn diện.',
    summaryEn: 'Highly technical domain leaders driving outstanding results. The 2026 strategic imperative is expanding their leadership capabilities to prepare them for full management roles.',
    recsVi: [
      'Giao bổ nhiệm chức vụ phó dự án hoặc trưởng ban cải tiến chất lượng chuyền',
      'Nhờ chủ trì xây dựng các quy chế OJT chuẩn để chuyển giao năng lực',
      'Cử tham dự huấn luyện Lãnh đạo Phục vụ và Khai vấn bồi dưỡng chuyên sâu'
    ],
    recsEn: [
      'Appoint as deputy project managers or continuous quality team chairs',
      'Direct them to lead development of standard OJT training catalogs',
      'Nominate for intensive Servant Leadership & Coaching bootcamps'
    ],
    courses: ['Servant Leadership', 'Coaching & Mentoring', 'AI for Everyone; Power Automate in Office']
  },
  'Seasoned Professional': {
    summaryVi: 'Các cựu binh dạn dày kinh nghiệm đạt Hiệu suất Xuất sắc nhưng khả năng dịch chuyển cấp học hỏi bổ sung đã bão hòa. Trọng tâm năm 2026 là khai thác tối đa tay nghề của họ thông qua hoạt động hướng dẫn và tư vấn nội bộ.',
    summaryEn: 'Highly seasoned, veteran executioners delivering stellar outputs near their ceiling. Focus on institutionalizing their masteries through internal training and advisory setups.',
    recsVi: [
      'Biên soạn tài liệu hướng dẫn công việc kỹ thuật chuyên sâu (SOP)',
      'Phát huy năng lực độc lập trong cải tiến kỹ thuật tại bộ phận trực tiếp',
      'Nâng cấp kỹ năng số hóa để tự động hóa giảm bớt quy trình giấy tờ thủ công'
    ],
    recsEn: [
      'Deliver specialized technical SOP blueprints',
      'Leverage independent technical expertise on section improvements',
      'Promote administrative digital tools to automate standard reporting'
    ],
    courses: ['AI for Everyone; Power Automate in Office', 'Coaching & Mentoring', 'People Development / IDP & Skill Matrix']
  },
  'Rising Star': {
    summaryVi: 'Nhóm tài năng triển vọng với Tiềm năng Vượt trội đang thích ứng nhanh. Mục tiêu trọng tâm 2026 là đẩy mạnh kèm cặp thực chiến định hướng KPI để chuyển hóa tiềm năng thành hiệu suất đỉnh cao.',
    summaryEn: 'Bright high-headroom players with strong adaptability. The core goal is accelerating their performance via strict KPI-linked OJT to turn latent potential into elite execution.',
    recsVi: [
      'Đặt các chỉ tiêu thử thách định kỳ hàng quý với mức độ khó tăng dần',
      'Đào sâu năng lực thuyết phục đàm phán thông qua đại diện trình bày dự án trước tổ chức',
      'Kèm cặp 1-kèm-1 trực tiếp với Quản lý xuất sắc nhất bộ phận'
    ],
    recsEn: [
      'Assign stretch targets on quarterly goals with progressive milestones',
      'Foster persuasive speaking skills via team-wide initiative presentations',
      'Establish direct 1-on-1 mentorship covenants with top department leads'
    ],
    courses: ['Communication & Presentation', 'People Development / IDP & Skill Matrix', 'Succession Planning & Talent Pipeline Review']
  },
  'Valued Contributor': {
    summaryVi: 'Xương sống vận hành của công ty chiếm tỷ trọng lớn và làm việc bền bỉ. Trọng tâm 2026 là bồi dưỡng bổ khuyết cục bộ để duy trì tính hoạt động liên tục và nâng hạng hiệu năng.',
    summaryEn: 'The operational backbone driving crucial workflows. The strategic priority is filling skill gaps to maintain flawless operational continuity and unlock hidden value.',
    recsVi: [
      'Rà soát và lấp kẽ hổng tay nghề cục bộ qua ma trận đào tạo (Skill Matrix)',
      'Tham gia đào tạo cập nhật kỹ năng chuyên môn chức danh',
      'Khuyến khích đưa ra các cải tiến công việc nhỏ hằng ngày'
    ],
    recsEn: [
      'Review and cover local competency micro-gaps via Skills Matrix reviews',
      'Assign specialized refresher modules on title-specific development tasks',
      'Motivate them to participate in grassroots continuous improvement steps'
    ],
    courses: ['People Development / IDP & Skill Matrix', 'Communication & Presentation', 'AI for Everyone; Power Automate in Office']
  },
  'Solid Professional': {
    summaryVi: 'Nhân sự thực thi đạt chuẩn trung bình dốc sức, dạn dày kinh nghiệm thực tế ổn định. Tập trung củng cố động lực, đảm bảo tuân thủ cao và duy trì nhịp độ sản xuất.',
    summaryEn: 'Solid, experienced performers meeting baseline requirements. Focus on boosting operational engagement, ensuring compliance, and stabilizing output.',
    recsVi: [
      'Nhận phản hồi tiến độ thường xuyên hằng tuần từ Giám sát',
      'Tái đào tạo về tuân thủ quy trình an toàn vận hành',
      'Tham gia các chuyên đề bồi dưỡng nâng cao năng lực nghề nghiệp cơ bản'
    ],
    recsEn: [
      'Involve core supervisors in delivering positive weekly checkpoints',
      'Enforce mandatory refreshers on operating compliance protocols',
      'Enroll in routine standard-practice cross-training modules'
    ],
    courses: ['People Development / IDP & Skill Matrix', 'Communication & Presentation', 'Servant Leadership']
  },
  'Diamond in the Rough': {
    summaryVi: 'Cán bộ sở hữu năng chất học hỏi dồi dào bậc nhất nhưng Hiệu suất tạm thời chưa đạt do thiếu kinh nghiệm hoặc mới luân chuyển vai trò. Khẩn cấp thiết lập chế độ bù đắp kiến thức cơ sở.',
    summaryEn: 'Possess high intellectual headroom but lagging outputs due to role transition or lack of domain exposure. Urgent focus is providing foundational structure.',
    recsVi: [],
    recsEn: [],
    courses: ['Communication & Presentation', 'AI for Everyone; Power Automate in Office']
  },
  'Future Utility': {
    summaryVi: 'Nhóm trung bình có kết quả hiệu năng chậm nhịp. Cần can thiệp cấu trúc để sắp xếp lại vai trò hoặc hướng dẫn khôi phục kỹ năng cốt lõi trước khi quá muộn.',
    summaryEn: 'Moderate headroom with underperforming results. Requires targeted structural adjustments to realign job-fit parameters and rehabilitate core skills early.',
    recsVi: [],
    recsEn: [],
    courses: ['AI for Everyone; Power Automate in Office', 'People Development / IDP & Skill Matrix']
  },
  'Learning Professional': {
    summaryVi: 'Nhân sự đang gặp khủng hoảng cả về năng lực học hỏi lẫn hiệu quả làm việc. Yêu cầu thiết lập Chương trình Cải thiện Hiệu suất chính thức (PIP) có thời hạn kiểm tra ngặt nghèo.',
    summaryEn: 'Experiencing significant blocks in both learning agility and actual production output. Demands a formal Performance Improvement Plan (PIP) under supervision.',
    recsVi: [],
    recsEn: [],
    courses: ['Communication & Presentation', 'Coaching & Mentoring']
  }
};

const getGroupForCell = (cell: NineBoxCell): NineBoxGroup => {
  if (['Superstar', 'Rising Star', 'High Professional'].includes(cell)) return 'Growers';
  if (['Seasoned Professional', 'Solid Professional', 'Valued Contributor'].includes(cell)) return 'Keepers';
  return 'Movers';
};

// Fact-based list of high flight risk (red alert) individuals from the succession planning registry
const factualHighRiskNames = [
  'Robert Pham', 'Sara Dang', 'Farah Le', 'Rose Vo', 'Rita', 'Alice', 'Ho Truc',
  'Joanna Nguyen', 'David Ho', 'NGUYỄN VĂN PHONG', 'Clara Bui', 'Ella Vy', 
  'Tyson Thai', 'Hugo Dao', 'Pham Duoc', 'Tran Kieu', 'NGUYEN, AKINA', 'KAI NGUYEN (NS)', 'ANGELA TRAN'
].map(n => n.toLowerCase().trim());

const augmentedTalentPool: Talent[] = dbTalentPool.map((t, idx) => {
  let newTransition = false;
  let highRisk = false;
  let idpExpiryDays: number | undefined = undefined;
  let needsNewIDP = false;

  const tNameLower = t.name.toLowerCase().trim();
  
  // Real database-grounded high-risk check
  const successionPos = initialPipelinePositions.find(
    p => p.incumbent.toLowerCase().trim() === tNameLower
  );
  if (successionPos) {
    highRisk = successionPos.risk === 'High';
  } else if (factualHighRiskNames.includes(tNameLower)) {
    highRisk = true;
  }

  if (t.name === 'NGUYEN, TINA') {
    idpExpiryDays = 12;
    needsNewIDP = true;
  } else if (t.name === 'Robert Pham') {
    idpExpiryDays = 6;
    highRisk = true;
  } else if (t.name === 'HUYNH, LINDSAY') {
    newTransition = true;
  } else if (t.name === 'NGUYEN, SERENA') {
    needsNewIDP = true;
    idpExpiryDays = 22;
  } else if (t.name === 'NGUYEN, AKINA') {
    highRisk = true;
  } else if (t.name === 'Hubert') {
    idpExpiryDays = 28;
    newTransition = true;
  } else if (t.name === 'Lydia') {
    newTransition = true;
  }

  if (idx % 12 === 3 && idpExpiryDays === undefined) {
    idpExpiryDays = (idx % 19) + 4;
  }
  if (idx % 10 === 5 && !needsNewIDP) {
    needsNewIDP = true;
  }
  if (idx % 14 === 8 && !newTransition) {
    newTransition = true;
  }

  // Underperformers in the lowest quadrants of Movers can have high risk
  if (t.group === 'Movers' && (t.cell === 'Learning Professional' || t.cell === 'Diamond in the Rough') && idx % 3 === 0) {
    highRisk = true;
  }

  return {
    ...t,
    newTransition,
    highRisk,
    idpExpiryDays,
    needsNewIDP
  };
});

export default function App() {
  const [lang, setLang] = useState<'VI' | 'EN'>(() => {
    try {
      const saved = localStorage.getItem('app-lang');
      return (saved === 'EN' || saved === 'VI') ? saved : 'VI';
    } catch {
      return 'VI';
    }
  });

  const handleLangChange = (newLang: 'VI' | 'EN') => {
    setLang(newLang);
    try {
      localStorage.setItem('app-lang', newLang);
    } catch (e) {
      // Ignored
    }
  };

  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hasDismissedWelcomeModal');
      return saved !== 'true';
    } catch {
      return true;
    }
  });

  const handleStartOnboardingFromModal = () => {
    setShowWelcomeModal(false);
    setShowOnboarding(true);
  };

  const handleSkipOnboardingFromModal = () => {
    setShowWelcomeModal(false);
    try {
      localStorage.setItem('hasDismissedWelcomeModal', 'true');
    } catch {
      // Ignored
    }
  };

  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedSite, setSelectedSite] = useState<'MLN' | 'WNK' | 'ASH'>(() => {
    try {
      const saved = localStorage.getItem('app-site');
      return (saved === 'MLN' || saved === 'WNK' || saved === 'ASH') ? saved as 'MLN' | 'WNK' | 'ASH' : 'MLN';
    } catch {
      return 'MLN';
    }
  });

  const handleSiteChange = (newSite: 'MLN' | 'WNK' | 'ASH') => {
    setSelectedSite(newSite);
    try {
      localStorage.setItem('app-site', newSite);
    } catch (e) {
      // Ignored
    }
    // Since Wanek has no data yet, reset department filter to ALL when changing site
    setSelectedDept('ALL');
  };

  const siteDepartments = useMemo(() => {
    if (selectedSite === 'WNK') return wnkDepartments;
    if (selectedSite === 'ASH') return ashDepartments;
    return allDepartments;
  }, [selectedSite]);

  const [talentSortKey, setTalentSortKey] = useState<'name' | 'dept' | 'cell' | 'results' | 'potential' | 'group' | null>(null);
  const [talentSortDir, setTalentSortDir] = useState<'asc' | 'desc' | null>(null);
  const [activeTab, setActiveTab] = useState<'tab-9box' | 'tab-pipeline' | 'tab-devplan' | 'tab-indiv-idp'>('tab-9box');
  const [isLdMode, setIsLdMode] = useState<boolean>(false);

  const handleLdModeChange = (enabled: boolean) => {
    setIsLdMode(enabled);
  };

  // React state for the databases to allow real-time simulation/edits
  const [talents, setTalents] = useState<Talent[]>(augmentedTalentPool);

  // Run data validation on mount
  useEffect(() => {
    const allPipeline = getFullPipeline();
    const warnings = validateData(augmentedTalentPool, allPipeline);
    logValidationResults(warnings);
    setDataWarnings(warnings);
  }, []);
  const [pipelineData, setPipelineData] = useState(() => getFullPipeline());

  // Drag and Drop notification toast banner
  const [reclassNotification, setReclassNotification] = useState<string | null>(null);
  const [showFrameworkModal, setShowFrameworkModal] = useState<boolean>(false);
  const [undoingId, setUndoingId] = useState<string | null>(null);
  const [historyCollapsed, setHistoryCollapsed] = useState(true);
  const [dataWarnings, setDataWarnings] = useState<ValidationWarning[]>([]);
  const [showDataWarnings, setShowDataWarnings] = useState(false);
  const [reclassHistory, setReclassHistory] = useState<{ id: string; talentName: string; fromCell: NineBoxCell; toCell: NineBoxCell; timestamp: Date }[]>(() => {
    return [
      {
        id: 'hist-1',
        talentName: 'Robert Pham',
        fromCell: 'Solid Professional',
        toCell: 'Learning Professional',
        timestamp: new Date(Date.now() - 3600000 * 1.5)
      },
      {
        id: 'hist-2',
        talentName: 'NGUYEN, SERENA',
        fromCell: 'Valued Contributor',
        toCell: 'Superstar',
        timestamp: new Date(Date.now() - 3600000 * 4)
      },
      {
        id: 'hist-3',
        talentName: 'HUYNH, LINDSAY',
        fromCell: 'Learning Professional',
        toCell: 'Rising Star',
        timestamp: new Date(Date.now() - 3600500 * 24)
      }
    ];
  });

  // Automated notification system for Movers group transition
  const [moversAlerts, setMoversAlerts] = useState<{
    id: string;
    talentName: string;
    fromCell: NineBoxCell;
    toCell: NineBoxCell;
    timestamp: Date;
    type: 'alert';
  }[]>([]);

  const triggerMoversAlert = (talentName: string, fromCell: NineBoxCell, toCell: NineBoxCell) => {
    const newAlert = {
      id: Math.random().toString(36).substring(2, 9),
      talentName,
      fromCell,
      toCell,
      timestamp: new Date(),
      type: 'alert' as const,
    };
    setMoversAlerts((prev) => [newAlert, ...prev]);
  };

  useEffect(() => {
    if (reclassNotification) {
      const timer = setTimeout(() => setReclassNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [reclassNotification]);

  // Filters specific to Tab 1 (9-Box Grid)
  const [selectedBox, setSelectedBox] = useState<NineBoxCell | 'ALL'>('ALL');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<NineBoxGroup | 'ALL'>('ALL');
  const [searchTalentQuery, setSearchTalentQuery] = useState<string>('');

  // Sơ đồ Đề xuất L&D - Dynamic AI suggestions for 9-box cell/cohort
  const [cohortAiRecs, setCohortAiRecs] = useState<Record<string, string[]>>({});
  const [loadingCohortAi, setLoadingCohortAi] = useState<string | null>(null);

  const fetchCohortAiRecs = async (cell: NineBoxCell) => {
    if (cohortAiRecs[cell]) return; // already loaded
    setLoadingCohortAi(cell);
    try {
      const response = await fetch('/api/gemini/cohort-recs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cell, lang }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.courses) {
          setCohortAiRecs(prev => ({ ...prev, [cell]: result.courses }));
        }
      }
    } catch (err) {
      console.error("fetchCohortAiRecs error:", err);
    } finally {
      setLoadingCohortAi(null);
    }
  };

  // Selected talent profile inspector drawer/modal
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);

  // Synchronized department selection handler
  const handleDepartmentChange = (dept: string) => {
    setSelectedDept(dept);
    // Reset specific sub-filters when department changes to keep clean state
    setSelectedBox('ALL');
    setSelectedGroupFilter('ALL');
  };

  // 1. FILTERED TALENT DATA FOR THE DYNAMIC DASHBOARD
  const siteFilteredTalents = useMemo(() => {
    return talents.filter(t => (t.site || 'MLN') === selectedSite);
  }, [talents, selectedSite]);

  const deptFilteredTalents = useMemo(() => {
    return siteFilteredTalents.filter((t) => selectedDept === 'ALL' || t.dept === selectedDept);
  }, [siteFilteredTalents, selectedDept]);

  const siteFilteredPipeline = useMemo(() => {
    return pipelineData.filter(p => (p.site || 'MLN') === selectedSite);
  }, [pipelineData, selectedSite]);

  // Final filtered list for the table (with search and grid filters applied)
  const tableFilteredTalents = useMemo(() => {
    const list = deptFilteredTalents.filter((t) => {
      const matchBox = selectedBox === 'ALL' || t.cell === selectedBox;
      const matchGroup = selectedGroupFilter === 'ALL' || t.group === selectedGroupFilter;
      const matchSearch = t.name.toLowerCase().includes(searchTalentQuery.toLowerCase()) ||
                          t.dept.toLowerCase().includes(searchTalentQuery.toLowerCase());
      
      return matchBox && matchGroup && matchSearch;
    });

    if (talentSortKey && talentSortDir) {
      const multiplier = talentSortDir === 'asc' ? 1 : -1;
      return [...list].sort((a, b) => {
        const valA = a[talentSortKey] || '';
        const valB = b[talentSortKey] || '';
        return valA.localeCompare(valB, lang === 'VI' ? 'vi' : 'en') * multiplier;
      });
    }
    return list;
  }, [deptFilteredTalents, selectedBox, selectedGroupFilter, searchTalentQuery, talentSortKey, talentSortDir, lang]);

  // Filtered talent pools for the interactive 9-box grid component
  const matrixTalents = useMemo(() => {
    return deptFilteredTalents.filter((t) => {
      return selectedGroupFilter === 'ALL' || t.group === selectedGroupFilter;
    });
  }, [deptFilteredTalents, selectedGroupFilter]);

  // Dynamic calculations for 9-Box KPIs
  const kpis9Box = useMemo(() => {
    let growers = 0;
    let keepers = 0;
    let movers = 0;

    deptFilteredTalents.forEach((t) => {
      if (t.group === 'Growers') growers++;
      else if (t.group === 'Keepers') keepers++;
      else movers++;
    });

    return {
      total: deptFilteredTalents.length,
      growers,
      keepers,
      movers,
    };
  }, [deptFilteredTalents]);

  // Handlers for modifying Master State
  const handleUpdateTalent = (updated: Talent) => {
    const oldTalent = talents.find((t) => t.name === updated.name);
    if (oldTalent && oldTalent.group !== 'Movers' && updated.group === 'Movers') {
      triggerMoversAlert(updated.name, oldTalent.cell, updated.cell);
    }
    setTalents((prev) => prev.map((t) => (t.name === updated.name ? updated : t)));
    // Sync-update selected inspector talent to match immediate state
    setSelectedTalent(updated);
  };

  const handleUndoReclassify = (historyId: string) => {
    const item = reclassHistory.find((h) => h.id === historyId);
    if (!item) return;

    // Trigger visual slide-out animation immediately
    setUndoingId(historyId);

    setTimeout(() => {
      let results: 'High Effective' | 'Effective' | 'Less Effective' = 'Effective';
      let potential: 'High' | 'Mid' | 'Low' = 'Mid';
      let group: NineBoxGroup = 'Keepers';

      switch (item.fromCell) {
        case 'Seasoned Professional':
          results = 'High Effective';
          potential = 'Low';
          group = 'Keepers';
          break;
        case 'High Professional':
          results = 'High Effective';
          potential = 'Mid';
          group = 'Growers';
          break;
        case 'Superstar':
          results = 'High Effective';
          potential = 'High';
          group = 'Growers';
          break;
        case 'Solid Professional':
          results = 'Effective';
          potential = 'Low';
          group = 'Keepers';
          break;
        case 'Valued Contributor':
          results = 'Effective';
          potential = 'Mid';
          group = 'Keepers';
          break;
        case 'Rising Star':
          results = 'Effective';
          potential = 'High';
          group = 'Growers';
          break;
        case 'Learning Professional':
          results = 'Less Effective';
          potential = 'Low';
          group = 'Movers';
          break;
        case 'Future Utility':
          results = 'Less Effective';
          potential = 'Mid';
          group = 'Movers';
          break;
        case 'Diamond in the Rough':
          results = 'Less Effective';
          potential = 'High';
          group = 'Movers';
          break;
      }

      setTalents((prev) =>
        prev.map((t) =>
          t.name === item.talentName
            ? { ...t, cell: item.fromCell, results, potential, group }
            : t
        )
      );

      // Sync selected talent if open
      setSelectedTalent((prev) =>
        prev && prev.name === item.talentName
          ? { ...prev, cell: item.fromCell, results, potential, group }
          : prev
      );

      // Remove item from history
      setReclassHistory((prev) => prev.filter((h) => h.id !== historyId));

      // Reset undoing state
      setUndoingId(null);

      // Toast
      const vietText = `Phục hồi điều chỉnh nhân viên "${item.talentName}" về ô cũ "${item.fromCell}" thành công!`;
      const engText = `Restored "${item.talentName}" to previous box "${item.fromCell}" successfully!`;
      setReclassNotification(lang === 'VI' ? vietText : engText);
    }, 450); // Exact transition duration of 450ms matching the CSS class transition-all duration-500/duration-400
  };

  const handleReclassifyTalent = (talentName: string, targetCell: NineBoxCell) => {
    const oldTalent = talents.find((t) => t.name === talentName);
    const fromCell = oldTalent ? oldTalent.cell : null;

    if (fromCell && fromCell !== targetCell) {
      const newItem = {
        id: Math.random().toString(36).substring(2, 9),
        talentName,
        fromCell,
        toCell: targetCell,
        timestamp: new Date(),
      };
      setReclassHistory((prev) => [newItem, ...prev]);

      // Trigger automatic warning alert if moving into 'Movers' group
      const isNowMover = ['Learning Professional', 'Future Utility', 'Diamond in the Rough'].includes(targetCell);
      const wasMover = oldTalent && oldTalent.group === 'Movers';
      if (oldTalent && !wasMover && isNowMover) {
        triggerMoversAlert(talentName, fromCell, targetCell);
      }
    }

    let results: 'High Effective' | 'Effective' | 'Less Effective' = 'Effective';
    let potential: 'High' | 'Mid' | 'Low' = 'Mid';
    let group: NineBoxGroup = 'Keepers';

    switch (targetCell) {
      case 'Seasoned Professional':
        results = 'High Effective';
        potential = 'Low';
        group = 'Keepers';
        break;
      case 'High Professional':
        results = 'High Effective';
        potential = 'Mid';
        group = 'Growers';
        break;
      case 'Superstar':
        results = 'High Effective';
        potential = 'High';
        group = 'Growers';
        break;
      case 'Solid Professional':
        results = 'Effective';
        potential = 'Low';
        group = 'Keepers';
        break;
      case 'Valued Contributor':
        results = 'Effective';
        potential = 'Mid';
        group = 'Keepers';
        break;
      case 'Rising Star':
        results = 'Effective';
        potential = 'High';
        group = 'Growers';
        break;
      case 'Learning Professional':
        results = 'Less Effective';
        potential = 'Low';
        group = 'Movers';
        break;
      case 'Future Utility':
        results = 'Less Effective';
        potential = 'Mid';
        group = 'Movers';
        break;
      case 'Diamond in the Rough':
        results = 'Less Effective';
        potential = 'High';
        group = 'Movers';
        break;
    }

    setTalents((prev) =>
      prev.map((t) =>
        t.name === talentName
          ? { ...t, cell: targetCell, results, potential, group }
          : t
      )
    );

    // Sync selected talent if open
    setSelectedTalent((prev) =>
      prev && prev.name === talentName
        ? { ...prev, cell: targetCell, results, potential, group }
        : prev
    );

    // Dynamic toast notification feedback
    const vietText = `Đã cập nhật vị trí của nhân viên "${talentName}" sang ô "${targetCell}" thành công!`;
    const engText = `Reclassified "${talentName}" into the "${targetCell}" box successfully!`;
    setReclassNotification(lang === 'VI' ? vietText : engText);
  };

  const handleUpdatePipelinePosition = (updatedPos: any) => {
    setPipelineData((prev) => prev.map((p) => (p.id === updatedPos.id ? updatedPos : p)));
  };

  const exportTalentsCSV = () => {
    const headers = [
      'Ho va Ten (Talent Name)',
      'Bo phan (Department)',
      'Xep hang ma tran (9-Box Grid)',
      'Muc Hieu suat (Performance)',
      'Muc Tiem nang (Potential)',
      'Khoi phan loai (Identity/Group)'
    ];
    
    const escape = (text: string) => `"${text.replace(/"/g, '""')}"`;
    const rows = tableFilteredTalents.map(t => [
      escape(t.name),
      escape(t.dept),
      escape(t.cell),
      escape(t.results),
      escape(t.potential),
      escape(t.group)
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MILL_Talents_${selectedDept}_Box_${selectedBox || 'ALL'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. RECHARTS DATA FOR ANALYTIC VISUALIZATIONS
  const pieChartData = useMemo(() => {
    return [
      { name: lang === 'VI' ? 'Growers (Tiềm năng cao)' : 'Growers (High Potential)', value: kpis9Box.growers, color: '#10b981' },
      { name: lang === 'VI' ? 'Keepers (Vững hiệu suất)' : 'Keepers (Solid Performers)', value: kpis9Box.keepers, color: '#d97706' },
      { name: lang === 'VI' ? 'Movers (Cần chuyển dịch)' : 'Movers (Action Required)', value: kpis9Box.movers, color: '#dc2626' },
    ];
  }, [kpis9Box, lang]);

  const densityChartData = useMemo(() => {
    const rawCounts: Record<NineBoxCell, number> = {
      'Rising Star': 0,
      'High Professional': 0,
      'Superstar': 0,
      'Valued Contributor': 0,
      'Solid Professional': 0,
      'Seasoned Professional': 0,
      'Diamond in the Rough': 0,
      'Future Utility': 0,
      'Learning Professional': 0,
    };

    deptFilteredTalents.forEach((t) => {
      rawCounts[t.cell] = (rawCounts[t.cell] || 0) + 1;
    });

    return [
      { name: 'Rising Star', value: rawCounts['Rising Star'], color: '#10b981' },
      { name: 'High Prof.', value: rawCounts['High Professional'], color: '#10b981' },
      { name: 'Superstar', value: rawCounts['Superstar'], color: '#10b981' },
      { name: 'Valued Cont.', value: rawCounts['Valued Contributor'], color: '#d97706' },
      { name: 'Solid Prof.', value: rawCounts['Solid Professional'], color: '#d97706' },
      { name: 'Seasoned Prof.', value: rawCounts['Seasoned Professional'], color: '#d97706' },
      { name: 'Diamond Rough', value: rawCounts['Diamond in the Rough'], color: '#dc2626' },
      { name: 'Future Utility', value: rawCounts['Future Utility'], color: '#dc2626' },
    ].filter(item => item.value > 0);
  }, [deptFilteredTalents]);

  const deptDistributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    siteFilteredTalents.forEach((t) => {
      counts[t.dept] = (counts[t.dept] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([dept, count]) => ({
        name: dept,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [siteFilteredTalents]);

  const deptGroupChartData = useMemo(() => {
    const deptTotals: Record<string, { name: string; growers: number; keepers: number; movers: number }> = {};
    siteFilteredTalents.forEach((t) => {
      const d = t.dept;
      if (!deptTotals[d]) {
        deptTotals[d] = { name: d, growers: 0, keepers: 0, movers: 0 };
      }
      if (t.group === 'Growers') {
        deptTotals[d].growers++;
      } else if (t.group === 'Keepers') {
        deptTotals[d].keepers++;
      } else if (t.group === 'Movers') {
        deptTotals[d].movers++;
      }
    });
    return Object.values(deptTotals).sort((a, b) => (b.growers + b.keepers + b.movers) - (a.growers + a.keepers + a.movers));
  }, [siteFilteredTalents]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* 1. BRAND GLOBAL HEADER */}
      <Header 
        lang={lang} 
        onLangChange={handleLangChange} 
        onStartOnboarding={() => setShowOnboarding(true)} 
        isLdMode={isLdMode}
        onLdModeChange={handleLdModeChange}
        site={selectedSite}
        onSiteChange={handleSiteChange}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 flex-1 w-full">

        {/* DYNAMIC SITE INFORMATIONAL BANNER */}
        {selectedSite === 'MLN' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-emerald-500 text-slate-950 rounded-2xl font-bold flex items-center justify-center animate-pulse shadow-md shadow-emerald-500/20 text-lg">
                🟢
              </div>
              <div className="text-left">
                <h3 className="text-base font-black text-emerald-950 tracking-tight flex items-center gap-2">
                  <span>{lang === 'VI' ? 'ĐÁNH GIÁ SỐ LIỆU: NHÀ MÁY MILLENNIUM (MLN)' : 'EVALUATING DATA: MILLENNIUM FACTORY (MLN)'}</span>
                  <span className="bg-emerald-200 text-emerald-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-350">ACTIVE</span>
                </h3>
                <p className="text-xs text-emerald-800 font-medium mt-1">
                  {lang === 'VI' 
                    ? 'Bạn đang truy cập nguồn dữ liệu nhân sự chính thức của Millennium. Toàn bộ các công cụ phân tích 9-Box, sơ đồ kế thừa và lộ trình đào tạo đều khả dụng.' 
                    : 'You are accessing the official Millennium HR master records. All 9-Box dashboards, succession matrices, and development tracks are fully loaded.'}
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono bg-white text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200 uppercase font-black tracking-wider shadow-2xs whitespace-nowrap">
              {lang === 'VI' ? 'DỮ LIỆU ĐẦY ĐỦ (MASTER)' : 'FULL MASTER RECORDS'}
            </div>
          </div>
        ) : (
          <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center shadow-md shadow-indigo-500/20 text-lg">
                ⚡
              </div>
              <div className="text-left">
                <h3 className="text-base font-black text-indigo-950 tracking-tight flex items-center gap-2">
                  <span>{lang === 'VI' ? 'NGUỒN DỮ LIỆU CHÍNH THỨC: NHÀ MÁY WANEK (WNK)' : 'OFFICIAL DATASET: WANEK FACTORY (WNK)'}</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-indigo-250">LIVE</span>
                </h3>
                <p className="text-xs text-indigo-800 font-medium mt-1">
                  {lang === 'VI' 
                    ? 'Bạn đang truy cập nguồn dữ liệu nhân sự chính thức của Wanek. Toàn bộ các công cụ phân tích 9-Box, sơ đồ kế thừa và lộ trình đào tạo đều khả dụng.' 
                    : 'You are accessing the official Wanek HR master records. All 9-Box dashboards, succession matrices, and development tracks are fully loaded.'}
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono bg-white text-indigo-700 px-4 py-2 rounded-xl border border-indigo-200 uppercase font-black tracking-wider shadow-2xs whitespace-nowrap">
              {lang === 'VI' ? 'DỮ LIỆU ĐẦY ĐỦ (MASTER)' : 'FULL MASTER RECORDS'}
            </div>
          </div>
        )}
        
        {/* HERO NAVIGATION TAB SELECTORS */}
        <section id="onboarding-tab-bar" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* TAB 1 */}
          <button
            onClick={() => setActiveTab('tab-9box')}
            className={`text-left rounded-2xl border p-6 transition-all duration-350 hover:shadow-md flex flex-col justify-between min-h-[145px] cursor-pointer interactive-hover-lift ${
              activeTab === 'tab-9box'
                ? selectedSite === 'MLN'
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                  : 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between w-full font-mono text-[16px]">
              <h2 style={{ fontFamily: 'system-ui' }} className={`font-sans font-extrabold text-[19px] md:text-[21px] text-center w-full tracking-tight transition-all ${
                activeTab === 'tab-9box' 
                  ? selectedSite === 'MLN' ? 'text-emerald-700 translate-y-0.5 font-black' : 'text-indigo-700 translate-y-0.5 font-black'
                  : 'text-slate-550'
              }`}>
                {lang === 'VI' ? 'Sơ đồ Ma trận 9-Box' : 'Interactive 9-Box Grid'}
              </h2>
              <span className={`p-1.5 rounded-lg transition-colors ${
                activeTab === 'tab-9box' 
                  ? selectedSite === 'MLN' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}>
                <Grid className="w-4 h-4" />
              </span>
            </div>
            
            <div className="mt-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {lang === 'VI' ? 'Trạng thái báo cáo' : 'Report Status'}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  activeTab === 'tab-9box' 
                    ? selectedSite === 'MLN' ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-600 animate-pulse' 
                    : 'bg-slate-300'
                }`} />
                <span className={`text-[10px] md:text-[11px] font-semibold uppercase tracking-wide font-display ${
                  activeTab === 'tab-9box' 
                    ? selectedSite === 'MLN' ? 'text-emerald-600 font-bold' : 'text-indigo-600 font-bold'
                    : 'text-slate-400'
                }`}>
                  {activeTab === 'tab-9box' 
                    ? (lang === 'VI' ? 'Đang phân tích dữ liệu' : 'Analyzing Data') 
                    : (lang === 'VI' ? 'Xem báo cáo' : 'View report')}
                </span>
              </div>
            </div>
          </button>

          {/* TAB 2 */}
          <button
            onClick={() => setActiveTab('tab-pipeline')}
            className={`text-left rounded-2xl border p-6 transition-all duration-350 hover:shadow-md flex flex-col justify-between min-h-[145px] cursor-pointer interactive-hover-lift ${
              activeTab === 'tab-pipeline'
                ? selectedSite === 'MLN'
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                  : 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <h2 style={{ fontFamily: 'system-ui' }} className={`font-sans font-extrabold text-[19px] md:text-[21px] text-center w-full tracking-tight transition-all ${
                activeTab === 'tab-pipeline' 
                  ? selectedSite === 'MLN' ? 'text-emerald-700 translate-y-0.5 font-black' : 'text-indigo-700 translate-y-0.5 font-black'
                  : 'text-slate-550'
              }`}>
                {lang === 'VI' ? 'Mạng lưới nhân tài' : 'Talent Pipeline'}
              </h2>
              <span className={`p-1.5 rounded-lg transition-colors ${
                activeTab === 'tab-pipeline' 
                  ? selectedSite === 'MLN' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}>
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {lang === 'VI' ? 'Trạng thái báo cáo' : 'Report Status'}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  activeTab === 'tab-pipeline' 
                    ? selectedSite === 'MLN' ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-600 animate-pulse' 
                    : 'bg-slate-300'
                }`} />
                <span className={`text-[10px] md:text-[11px] font-semibold uppercase tracking-wide font-display ${
                  activeTab === 'tab-pipeline' 
                    ? selectedSite === 'MLN' ? 'text-emerald-600 font-bold' : 'text-indigo-600 font-bold'
                    : 'text-slate-400'
                }`}>
                  {activeTab === 'tab-pipeline' 
                    ? (lang === 'VI' ? 'Đang phân tích dữ liệu' : 'Analyzing Pipeline') 
                    : (lang === 'VI' ? 'Xem chi tiết' : 'View pipeline')}
                </span>
              </div>
            </div>
          </button>

          {/* TAB 3 */}
          <button
            onClick={() => setActiveTab('tab-devplan')}
            className={`text-left rounded-2xl border p-6 transition-all duration-350 hover:shadow-md flex flex-col justify-between min-h-[145px] cursor-pointer interactive-hover-lift ${
              activeTab === 'tab-devplan'
                ? selectedSite === 'MLN'
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                  : 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <h2 style={{ fontFamily: 'system-ui' }} className={`font-sans font-extrabold text-[19px] md:text-[21px] text-center w-full tracking-tight transition-all ${
                activeTab === 'tab-devplan' 
                  ? selectedSite === 'MLN' ? 'text-emerald-700 translate-y-0.5 font-black' : 'text-indigo-700 translate-y-0.5 font-black'
                  : 'text-slate-550'
              }`}>
                {lang === 'VI' ? 'Kế hoạch Đào tạo' : 'Training Plan'}
              </h2>
              <span className={`p-1.5 rounded-lg transition-colors ${
                activeTab === 'tab-devplan' 
                  ? selectedSite === 'MLN' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}>
                <BookOpen className="w-4 h-4" />
              </span>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {lang === 'VI' ? 'Trạng thái báo cáo' : 'Report Status'}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  activeTab === 'tab-devplan' 
                    ? selectedSite === 'MLN' ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-600 animate-pulse' 
                    : 'bg-slate-300'
                }`} />
                <span className={`text-[10px] md:text-[11px] font-semibold uppercase tracking-wide font-display ${
                  activeTab === 'tab-devplan' 
                    ? selectedSite === 'MLN' ? 'text-emerald-600 font-bold' : 'text-indigo-600 font-bold'
                    : 'text-slate-400'
                }`}>
                  {activeTab === 'tab-devplan' 
                    ? (lang === 'VI' ? 'Đang phân tích dữ liệu' : 'Analyzing Plans') 
                    : (lang === 'VI' ? 'Xem chi tiết' : 'View plans')}
                </span>
              </div>
            </div>
          </button>

          {/* TAB 4 */}
          <button
            onClick={() => setActiveTab('tab-indiv-idp')}
            className={`text-left rounded-2xl border p-6 transition-all duration-350 hover:shadow-md flex flex-col justify-between min-h-[145px] cursor-pointer interactive-hover-lift ${
              activeTab === 'tab-indiv-idp'
                ? selectedSite === 'MLN'
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                  : 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <h2 style={{ fontFamily: 'system-ui' }} className={`font-sans font-extrabold text-[19px] md:text-[21px] text-center w-full tracking-tight transition-all ${
                activeTab === 'tab-indiv-idp' 
                  ? selectedSite === 'MLN' ? 'text-emerald-700 translate-y-0.5 font-black' : 'text-indigo-700 translate-y-0.5 font-black'
                  : 'text-slate-550'
              }`}>
                {lang === 'VI' ? 'Kế hoạch cá nhân (IDP)' : 'Individual IDPs'}
              </h2>
              <span className={`p-1.5 rounded-lg transition-colors ${
                activeTab === 'tab-indiv-idp' 
                  ? selectedSite === 'MLN' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}>
                <UserCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {lang === 'VI' ? 'Trạng thái báo cáo' : 'Report Status'}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  activeTab === 'tab-indiv-idp' 
                    ? selectedSite === 'MLN' ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-600 animate-pulse' 
                    : 'bg-slate-300'
                }`} />
                <span className={`text-[10px] md:text-[11px] font-semibold uppercase tracking-wide font-display ${
                  activeTab === 'tab-indiv-idp' 
                    ? selectedSite === 'MLN' ? 'text-emerald-600 font-bold' : 'text-indigo-600 font-bold'
                    : 'text-slate-400'
                }`}>
                  {activeTab === 'tab-indiv-idp' 
                    ? (lang === 'VI' ? 'Xem & Cập nhật IDPs' : 'Managing IDP lists') 
                    : (lang === 'VI' ? 'Xem chi tiết' : 'View layout IDPs')}
                </span>
              </div>
            </div>
          </button>
        </section>

        {/* UNIFIED DEPARTMENT SELECTOR BAR */}
        <section id="onboarding-dept-filter" className={`bg-white rounded-2xl border transition-all duration-300 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs border-l-4 ${
          selectedSite === 'MLN' ? 'border-slate-200 border-l-emerald-500' : 'border-slate-200 border-l-indigo-500'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-xl border transition-colors ${
              selectedSite === 'MLN' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-indigo-50 text-indigo-600 border-indigo-100'
            }`}>
              <Filter className="w-5 h-5" />
            </span>
            <div className="text-left">
              <p className={`text-[10px] font-sans font-bold uppercase tracking-widest ${
                selectedSite === 'MLN' ? 'text-emerald-600' : 'text-indigo-600'
              }`}>
                {lang === 'VI' ? 'Phạm vi dữ liệu' : 'Data Filter Scope'}
              </p>
              <h4 className="text-sm font-bold text-slate-800 font-display uppercase">
                {lang === 'VI' 
                  ? `BỘ LỌC PHÒNG BAN — ${selectedSite === 'MLN' ? 'MILLENNIUM' : selectedSite === 'WNK' ? 'WANEK' : 'ASHTON'}` 
                  : `DEPARTMENT FILTER — ${selectedSite === 'MLN' ? 'MILLENNIUM' : selectedSite === 'WNK' ? 'WANEK' : 'ASHTON'}`}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <label className="text-xs font-bold text-slate-550 uppercase tracking-wider whitespace-nowrap hidden lg:inline">
              {lang === 'VI' ? 'Chọn bộ phận:' : 'Select Dept:'}
            </label>
            <SearchableDeptDropdown
              selectedDept={selectedDept}
              onDeptChange={handleDepartmentChange}
              lang={lang}
              allDepartments={siteDepartments}
              widthClass="w-full sm:w-80"
              isTableFilter={false}
            />
          </div>
        </section>


        {/* ── QUICK-JUMP NAVIGATION ── sticky, hiển thị trong mọi tab ── */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm -mx-4 px-4 py-2 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0 mr-1">
              {lang === 'VI' ? 'Chuyển nhanh:' : 'Jump to:'}
            </span>
            {[
              { id: 'tab-9box', labelVi: '① Ma trận 9-Box', labelEn: '① 9-Box Matrix', icon: '⊞' },
              { id: 'tab-pipeline', labelVi: '② Kế hoạch Kế thừa', labelEn: '② Succession Pipeline', icon: '🔗' },
              { id: 'tab-devplan', labelVi: '③ Kế hoạch Đào tạo', labelEn: '③ Training Plan', icon: '📚' },
              { id: 'tab-indiv-idp', labelVi: '④ Kế hoạch Cá nhân', labelEn: '④ Individual IDP', icon: '👤' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? selectedSite === 'MLN'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : selectedSite === 'WNK'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{lang === 'VI' ? tab.labelVi : tab.labelEn}</span>
                {activeTab === tab.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== TAB 1 Content: 9-BOX MATRIX & TALENT LIST ==================== */}
        {activeTab === 'tab-9box' && (
          <div className="space-y-8">
            
            
            {/* KPI grid counts */}
            <div id="onboarding-kpi-cards" className="grid grid-cols-2 lg:grid-cols-4 gap-6 select-none font-sans">
              {/* Card 1: Total Reviewed */}
              <button
                id="onboarding-kpi-card-total"
                onClick={() => {
                  setSelectedGroupFilter('ALL');
                  setSelectedBox('ALL');
                }}
                className={`text-left bg-white p-6 rounded-2xl border shadow-sm border-t-4 border-t-slate-900 flex flex-col justify-between min-h-[125px] cursor-pointer transition-all duration-300 ${
                  selectedGroupFilter === 'ALL' && selectedBox === 'ALL'
                    ? 'ring-2 ring-slate-850 bg-slate-50/10 scale-[1.01] shadow-md'
                    : 'hover:border-slate-350 hover:shadow-md'
                }`}
              >
                <div className="text-xs font-bold text-slate-550 uppercase tracking-wider block">
                  {lang === 'VI' ? (
                    <>
                      TỔNG ĐƯỢC ĐÁNH GIÁ
                      <span className="block text-[10px] font-sans font-normal text-slate-500/90 lowercase first-letter:uppercase mt-0.5">
                        (toàn bộ nhân sự)
                      </span>
                    </>
                  ) : (
                    <>
                      TOTAL REVIEWED
                      <span className="block text-[10px] font-sans font-normal text-slate-500/90 lowercase first-letter:uppercase mt-0.5">
                        (entire workforce)
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-baseline justify-between w-full mt-2">
                  <span className="text-3xl md:text-4.5xl font-black font-display text-slate-900 mt-1">{kpis9Box.total}</span>
                  {selectedGroupFilter === 'ALL' && selectedBox === 'ALL' && (
                    <span className="text-[10px] bg-slate-800 text-white font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
                  )}
                </div>
              </button>

              {/* Card 2: Growers */}
              <button
                id="onboarding-kpi-card-growers"
                onClick={() => {
                  setSelectedGroupFilter('Growers');
                  setSelectedBox('ALL');
                }}
                className={`text-left bg-white p-6 rounded-2xl border shadow-sm border-t-4 border-t-emerald-500 flex flex-col justify-between min-h-[125px] cursor-pointer transition-all duration-300 ${
                  selectedGroupFilter === 'Growers'
                    ? 'ring-2 ring-emerald-500 bg-emerald-50/10 scale-[1.01] shadow-md'
                    : 'hover:border-emerald-350 hover:shadow-md'
                }`}
              >
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  {lang === 'VI' ? (
                    <>
                      NHÓM PHÁT TRIỂN
                      <span className="block text-[10px] font-sans font-normal text-emerald-600/90 lowercase first-letter:uppercase mt-0.5">
                        (tiềm năng cao)
                      </span>
                    </>
                  ) : (
                    <>
                      Growers
                      <span className="block text-[10px] font-sans font-normal text-emerald-605 lowercase first-letter:uppercase mt-0.5">
                        (high potential)
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-baseline justify-between w-full mt-2">
                  <span className="text-3xl md:text-4.5xl font-black font-display text-emerald-600 mt-1">{kpis9Box.growers}</span>
                  {selectedGroupFilter === 'Growers' && (
                    <span className="text-[10px] bg-emerald-600 text-white font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
                  )}
                </div>
              </button>

              {/* Card 3: Keepers */}
              <button
                id="onboarding-kpi-card-keepers"
                onClick={() => {
                  setSelectedGroupFilter('Keepers');
                  setSelectedBox('ALL');
                }}
                className={`text-left bg-white p-6 rounded-2xl border shadow-sm border-t-4 border-t-amber-550 flex flex-col justify-between min-h-[125px] cursor-pointer transition-all duration-300 ${
                  selectedGroupFilter === 'Keepers'
                    ? 'ring-2 ring-amber-500 bg-amber-50/10 scale-[1.01] shadow-md'
                    : 'hover:border-amber-400 hover:shadow-md'
                }`}
              >
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  {lang === 'VI' ? (
                    <>
                      NHÓM DUY TRÌ
                      <span className="block text-[10px] font-sans font-normal text-amber-600/90 lowercase first-letter:uppercase mt-0.5">
                        (vững hiệu suất)
                      </span>
                    </>
                  ) : (
                    <>
                      Keepers
                      <span className="block text-[10px] font-sans font-normal text-amber-605 lowercase first-letter:uppercase mt-0.5">
                        (solid performers)
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-baseline justify-between w-full mt-2">
                  <span className="text-3xl md:text-4.5xl font-black font-display text-amber-600 mt-1">{kpis9Box.keepers}</span>
                  {selectedGroupFilter === 'Keepers' && (
                    <span className="text-[10px] bg-amber-500 text-white font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
                  )}
                </div>
              </button>

              {/* Card 4: Movers */}
              <button
                id="onboarding-kpi-card-movers"
                onClick={() => {
                  setSelectedGroupFilter('Movers');
                  setSelectedBox('ALL');
                }}
                className={`text-left bg-white p-6 rounded-2xl border shadow-sm border-t-4 border-t-rose-500 flex flex-col justify-between min-h-[125px] cursor-pointer transition-all duration-300 ${
                  selectedGroupFilter === 'Movers'
                    ? 'ring-2 ring-rose-500 bg-rose-50/10 scale-[1.01] shadow-md'
                    : 'hover:border-rose-350 hover:shadow-md'
                }`}
              >
                <div className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                  {lang === 'VI' ? (
                    <>
                      NHÓM CẦN BỒI DƯỠNG
                      <span className="block text-[10px] font-sans font-normal text-rose-500/90 lowercase first-letter:uppercase mt-0.5">
                        (cần bồi dưỡng & kèm cặp)
                      </span>
                    </>
                  ) : (
                    <>
                      Movers
                      <span className="block text-[10px] font-sans font-normal text-rose-505 lowercase first-letter:uppercase mt-0.5">
                        (action required)
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-baseline justify-between w-full mt-2">
                  <span className="text-3xl md:text-4.5xl font-black font-display text-rose-600 mt-1">{kpis9Box.movers}</span>
                  {selectedGroupFilter === 'Movers' && (
                    <span className="text-[10px] bg-rose-600 text-white font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
                  )}
                </div>
              </button>
            </div>

            {/* Split layout: Matrix 9-Box Left, Charts Right */}
            <WhyHowPlaybook featureKey="9box" lang={lang} isLdMode={isLdMode} selectedSite={selectedSite} />
            <InsightPanel featureKey="9box" lang={lang} selectedSite={selectedSite} selectedDept={selectedDept} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Interactive 9-Box Grid */}
              <div id="onboarding-9box-grid" className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                  <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-105 pb-3">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-800 tracking-tight font-display flex items-center gap-2 select-none">
                      <Grid className="w-4 h-4 text-indigo-550 shrink-0" />
                      <span>{lang === 'VI' ? 'Ma trận 9-BOX' : 'Interactive 9-Box Dynamic Grid'}</span>
                      <button
                        onClick={() => setShowFrameworkModal(true)}
                        className="w-5 h-5 inline-flex items-center justify-center text-slate-400 hover:text-indigo-650 hover:bg-slate-100 rounded-full transition-all cursor-pointer self-center"
                        title={lang === 'VI' ? 'Tìm hiểu ý nghĩa mô hình (Growers, Keepers, Movers)' : 'Understand categories (Growers, Keepers, Movers)'}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === 'VI' 
                        ? 'Bấm trực tiếp vào từng ô phân khúc hoặc danh sách tên nhân viên để thực hiện quy hoạch & lọc thông báo.' 
                        : 'Click directly on any grid segment or employee name to inspect profiles and map talent plans.'}
                    </p>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto">
                    <SearchableDeptDropdown
                      selectedDept={selectedDept}
                      onDeptChange={handleDepartmentChange}
                      lang={lang}
                      allDepartments={siteDepartments}
                      widthClass="w-full sm:w-52"
                      isTableFilter={true}
                    />
                  </div>
                </div>

                {reclassNotification && (
                  <div className="bg-indigo-50/90 border border-indigo-200 text-indigo-800 px-4.5 py-3 rounded-xl flex items-center justify-between text-[11.5px] md:text-xs font-semibold shadow-2xs animate-fade-in mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                      <span>{reclassNotification}</span>
                    </div>
                    <button onClick={() => setReclassNotification(null)} className="text-indigo-400 hover:text-indigo-600 font-bold transition-colors ml-2 cursor-pointer">
                      ✕
                    </button>
                  </div>
                )}

                <NineBoxMatrix
                  talents={matrixTalents}
                  selectedBox={selectedBox}
                  onSelectBox={(box) => {
                    setSelectedBox(box);
                    setSelectedGroupFilter('ALL'); // Mutually exclusive filters to avoid clashing
                  }}
                  onSelectTalent={(t) => setSelectedTalent(t)}
                  onReclassifyTalent={handleReclassifyTalent}
                  lang={lang}
                  isLdMode={isLdMode}
                />

                {/* Cell Deep-Dive analysis card based on clicked 9-box segment */}
                {selectedBox !== 'ALL' && (() => {
                  const dataDeep = cohortDeepDives[selectedBox];
                  const cohortTalentsCount = matrixTalents.filter(t => t.cell === selectedBox).length;
                  if (!dataDeep) return null;

                  const isMoverGroup = ["Learning Professional", "Future Utility", "Diamond in the Rough"].includes(selectedBox);
                  const staticCourses = dataDeep.courses || [];
                  const rawAiSuggestions = cohortAiRecs[selectedBox] || [];
                  // Deduplicate: filter out any dynamic AI recommendations that are already on the static list
                  const deduplicatedAiCourses = rawAiSuggestions.filter(
                    (course) => !staticCourses.some(sc => sc.toLowerCase() === course.trim().toLowerCase())
                  );

                  return (
                    <div className="mt-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-indigo-900 shadow-md animate-in slide-in-from-bottom duration-250 relative z-30 overflow-hidden">
                      {/* Decorative subtle light pulse */}
                      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-300 shrink-0 animate-pulse" />
                          <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-indigo-200 font-display">
                            {lang === 'VI' ? 'ĐÁNH GIÁ CHUYÊN SÂU NHÓM & KHUYẾN NGHỊ L&D 2026' : '9-BOX QUADRANT DEEP COHORT ANALYTICS'}
                          </h4>
                        </div>
                        <button 
                          onClick={() => setSelectedBox('ALL')}
                          className="text-[10px] bg-white/10 hover:bg-white/20 text-white/90 px-2.5 py-1 rounded-lg font-bold transition-all border border-white/10 cursor-pointer text-xs"
                        >
                          {lang === 'VI' ? 'Xem Toàn Bộ Ma Trận' : 'View Full Matrix'}
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Header Segment Name */}
                        <div className="text-left">
                          <h3 className="text-xs sm:text-sm font-black text-white font-sans flex items-center gap-1.5 label text-left">
                            🎯 {lang === 'VI' ? 'Phân khúc:' : 'Segment:'} <span className="text-indigo-300 font-bold underline decoration-indigo-400">{lang === 'VI' ? (selectedBox === 'Superstar' ? 'Siêu sao (Superstar)' : selectedBox === 'High Professional' ? 'Nhân sự xuất sắc (High Professional)' : selectedBox === 'Seasoned Professional' ? 'Nhân sự dày dặn (Seasoned Professional)' : selectedBox === 'Rising Star' ? 'Ngôi sao đang lên (Rising Star)' : selectedBox === 'Valued Contributor' ? 'Người Đóng góp Chủ lực (Valued Contributor)' : selectedBox === 'Solid Professional' ? 'Nhân sự vững vàng (Solid Professional)' : selectedBox === 'Diamond in the Rough' ? 'Kim cương thô (Diamond in the Rough)' : selectedBox === 'Future Utility' ? 'Nhân tố dự phòng tương lai (Future Utility)' : 'Nhân sự cần hoàn thiện (Learning Professional)') : selectedBox}</span>
                          </h3>
                        </div>

                        {/* Top layout: stretch description box and size box side-by-side perfectly */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch text-left">
                          <div className="md:col-span-10 bg-indigo-950/40 p-4 rounded-xl border border-indigo-800/20 text-left flex items-center">
                            <p className="text-[11px] sm:text-[11.5px] text-indigo-150/95 leading-relaxed font-sans">
                              {lang === 'VI' ? dataDeep.summaryVi : dataDeep.summaryEn}
                            </p>
                          </div>
                          
                          <div className="md:col-span-2 bg-indigo-950/50 border border-indigo-800/25 p-4 rounded-xl text-center flex flex-col justify-center items-center shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/20" />
                            <span className="block text-[8px] font-black uppercase text-indigo-300 font-mono tracking-widest mb-1">
                              {lang === 'VI' ? 'Quy mô nhóm' : 'Cohort Size'}
                            </span>
                            <span className="text-2xl sm:text-3xl font-mono font-black text-indigo-300 leading-none my-1.5 animate-pulse">
                              {cohortTalentsCount}
                            </span>
                            <span className="block text-[8px] text-white/55 font-medium whitespace-nowrap mt-1 uppercase tracking-wide">
                              {lang === 'VI' ? 'nhân sự hiện tại' : 'active talents'}
                            </span>
                          </div>
                        </div>

                        {isMoverGroup ? (
                          <div className="bg-indigo-950/40 border border-amber-900/30 p-4 rounded-xl text-center">
                            <p className="text-[11px] text-indigo-200">
                              ⚠️ {lang === 'VI' 
                                ? 'Khuyến nghị học tập chỉ áp dụng cho nhóm phát triển và duy trì để tập trung tối đa nguồn lực L&D.' 
                                : 'Talent development recommendations are only shown for valid growth segments (Keepers & Growers).'}
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-left items-stretch">
                            {/* Left Shape: Development & KPI Assignments */}
                            <div className="bg-indigo-950/35 border border-indigo-900/40 p-4 rounded-xl shadow-xs flex flex-col justify-between text-left">
                              <div className="space-y-3">
                                <h5 className="text-[9px] sm:text-[10px] font-black text-indigo-300 uppercase tracking-wider font-mono text-left">
                                  🔥 {lang === 'VI' ? 'HƯỚNG PHÁT TRIỂN & CHỈ TIÊU GIAO VIỆC (CORE RECS):' : 'DEVELOPMENT & KPI ASSIGNMENTS (CORE RECS):'}
                                </h5>
                                <ul className="space-y-2 text-[10.5px] text-slate-200 text-left">
                                  {(lang === 'VI' ? dataDeep.recsVi : dataDeep.recsEn).map((rec, rIdx) => (
                                    <li key={rIdx} className="flex items-start gap-1.5 leading-snug text-left">
                                      <span className="text-indigo-400 font-extrabold select-none shrink-0">❖</span>
                                      <span className="font-sans text-slate-100 text-left">{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Right Shape: L&D Chosen Cohort Courses Pool */}
                            <div className="bg-emerald-950/10 border border-emerald-900/20 p-4 rounded-xl shadow-xs flex flex-col justify-between text-left">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <h5 className="text-[9px] sm:text-[10px] font-black text-emerald-350 uppercase tracking-wider font-mono text-left">
                                    📚 {lang === 'VI' ? 'KHÓA ĐÀO TẠO PHÂN bổ L&D:' : 'CHOSEN COHORT COURSES Pool:'}
                                  </h5>
                                  {!cohortAiRecs[selectedBox] && (
                                    <button
                                      onClick={() => fetchCohortAiRecs(selectedBox)}
                                      disabled={loadingCohortAi !== null}
                                      className="flex items-center gap-1 text-[10px] bg-indigo-600/70 hover:bg-indigo-600 text-white font-bold px-2 py-1 rounded transition-all shrink-0 cursor-pointer disabled:opacity-50"
                                    >
                                      <Sparkles className="w-2.5 h-2.5" />
                                      <span>
                                        {loadingCohortAi === selectedBox 
                                          ? (lang === 'VI' ? 'Đang phân tích...' : 'Analyzing...') 
                                          : (lang === 'VI' ? 'AI Đề Xuất' : 'Generate AI Suggestions')}
                                      </span>
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  {/* Static Courses List */}
                                  {staticCourses.map((course, cIdx) => (
                                    <div key={`static-${cIdx}`} className="flex items-center justify-between bg-emerald-950/20 border border-emerald-800/40 p-2 rounded-lg hover:bg-emerald-900/35 transition-colors text-left">
                                      <div className="flex items-center gap-2 truncate">
                                        <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span className="text-[10.5px] font-extrabold text-white font-sans text-left leading-tight truncate" title={course}>
                                          {course}
                                        </span>
                                      </div>
                                      <span className="text-[8px] uppercase tracking-wider font-mono font-extrabold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded shrink-0">
                                        {lang === 'VI' ? 'Chuẩn hóa' : 'Standard'}
                                      </span>
                                    </div>
                                  ))}

                                  {/* Live dynamic loading indicator */}
                                  {loadingCohortAi === selectedBox && (
                                    <div className="bg-indigo-950/20 border border-indigo-800/30 p-3 rounded-lg text-center animate-pulse flex items-center justify-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                                      <span className="text-[10.5px] text-indigo-200 font-mono">
                                        {lang === 'VI' ? 'L&D AI đang đề xuất thêm...' : 'L&D AI is designing matching pool courses...'}
                                      </span>
                                    </div>
                                  )}

                                  {/* Dynamic AI Suggestions List */}
                                  {deduplicatedAiCourses.map((course: string, aIdx: number) => (
                                    <div key={`dynamic-${aIdx}`} className="flex items-center justify-between bg-indigo-950/20 border border-indigo-800/40 p-2 rounded-lg hover:bg-indigo-900/35 transition-colors text-left animate-fade-in">
                                      <div className="flex items-center gap-2 truncate">
                                        <Sparkles className="w-3 text-indigo-400 shrink-0" />
                                        <span className="text-[10.5px] font-extrabold text-white font-sans text-left leading-tight truncate" title={course}>
                                          {course}
                                        </span>
                                      </div>
                                      <span className="text-[8.5px] uppercase tracking-wider font-sans font-extrabold bg-indigo-500/25 text-indigo-200 px-2 py-0.5 rounded shrink-0 shadow-3xs">
                                        {lang === 'VI' ? '✨ AI ĐỀ XUẤT' : '✨ AI SUGGESTED'}
                                      </span>
                                    </div>
                                  ))}

                                  {deduplicatedAiCourses.length > 0 && (
                                    <div className="flex items-start gap-1.5 p-2.5 bg-rose-950/40 border border-rose-500/25 rounded-xl text-[10px] sm:text-[11px] leading-relaxed text-rose-200/90 select-none shadow-3xs mt-2.5 animate-fade-in">
                                      <BellRing className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
                                      <div>
                                        <span className="font-extrabold uppercase tracking-wider text-rose-300 mr-1.5 inline-block text-[9.5px] sm:text-[10.5px]">
                                          {lang === 'VI' ? '⚠️ ĐỀ XUẤT AI:' : '⚠️ AI SUGGESTED:'}
                                        </span>
                                        {lang === 'VI' 
                                          ? 'Gợi ý tự động phục vụ quy hoạch. Các quyết định cuối cùng thuộc về các Bộ phận Chức năng/ Chuyên môn hoặc Trưởng bộ phận.' 
                                          : 'Generated by planning AI. Final decisions belong to the Functional/Specialized Departments or Department Heads.'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                </div>

              </div>

              {/* Right Column: Compact Summary */}
              <div id="onboarding-right-charts" className="flex flex-col gap-4">

                {/* 3 nhóm compact */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <h4 className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    {lang === 'VI' ? 'PHÂN BỔ NHÓM NHÂN TÀI' : 'TALENT GROUP BREAKDOWN'}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Growers', count: kpis9Box.growers, color: 'emerald', desc: lang === 'VI' ? 'Tiềm năng cao' : 'High potential' },
                      { label: 'Keepers', count: kpis9Box.keepers, color: 'amber', desc: lang === 'VI' ? 'Trụ cột vận hành' : 'Operational backbone' },
                      { label: 'Movers', count: kpis9Box.movers, color: 'rose', desc: lang === 'VI' ? 'Cần can thiệp' : 'Action required' },
                    ].map(g => {
                      const pct = kpis9Box.total > 0 ? Math.round(g.count / kpis9Box.total * 100) : 0;
                      const colors: Record<string, {bg: string, border: string, text: string, bar: string, light: string}> = {
                        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500', light: 'bg-emerald-100' },
                        amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500', light: 'bg-amber-100' },
                        rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', bar: 'bg-rose-500', light: 'bg-rose-100' },
                      };
                      const c = colors[g.color];
                      return (
                        <div key={g.label} className={`${c.bg} border ${c.border} rounded-lg px-3 py-2 flex items-center gap-3`}>
                          <span className={`text-2xl font-black ${c.text} w-8 text-center shrink-0 leading-none`}>{g.count}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-black ${c.text} uppercase`}>{g.label}</span>
                              <span className={`text-[9px] font-bold ${c.text}`}>{pct}%</span>
                            </div>
                            <div className={`w-full ${c.light} rounded-full h-1.5 mt-1`}>
                              <div className={`${c.bar} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                            <p className={`text-[8.5px] ${c.text} mt-0.5 opacity-80`}>{g.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CƠ CẤU THEO BỘ PHẬN — shape riêng */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <h4 className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    {lang === 'VI' ? 'CƠ CẤU NHÓM THEO BỘ PHẬN' : 'GROUP STRUCTURE BY DEPT'}
                  </h4>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={deptGroupChartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '10px' }} />
                      <Legend iconSize={8} wrapperStyle={{ fontSize: '8px', paddingTop: '4px' }} />
                      <Bar name="Growers" dataKey="growers" stackId="a" fill="#10b981" radius={[0,0,0,0]} />
                      <Bar name="Keepers" dataKey="keepers" stackId="a" fill="#d97706" />
                      <Bar name="Movers" dataKey="movers" stackId="a" fill="#dc2626" radius={[2,2,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* MẬT ĐỘ TỪNG PHÂN VỊ 9-BOX — shape riêng */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <h4 className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                    {lang === 'VI' ? 'MẬT ĐỘ TỪNG PHÂN VỊ 9-BOX' : '9-BOX CELL DENSITY'}
                  </h4>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={densityChartData} margin={{ top: 15, right: 8, left: -22, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={7} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '10px' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {densityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <LabelList dataKey="value" position="top" style={{ fill: '#475569', fontSize: 9, fontWeight: 'bold' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>


                {/* Lịch sử điều chỉnh — bên dưới MẬT ĐỘ */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl shadow-2xs text-left overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setHistoryCollapsed(prev => !prev)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-100/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                        🔄 <span>{lang === 'VI' ? 'Lịch sử điều chỉnh (Hoàn tác)' : 'Adjustment Logs (Undo)'}</span>
                      </h4>
                      {reclassHistory.length > 0 && (
                        <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-mono font-bold">
                          {reclassHistory.length}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[10px] font-bold">{historyCollapsed ? '▼' : '▲'}</span>
                  </button>
                  {!historyCollapsed && (
                    <div className="px-4 pb-3 border-t border-slate-200/50">
                      {reclassHistory.length === 0 ? (
                        <div className="py-4 text-center text-[10px] text-slate-400 italic">
                          {lang === 'VI' ? 'Chưa ghi nhận điều chỉnh nào.' : 'No adjustments yet.'}
                        </div>
                      ) : (
                        <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 mt-2">
                          {reclassHistory.map((item) => {
                            const isUndoing = undoingId === item.id;
                            return (
                              <div key={item.id} className={`flex flex-col bg-white px-3 py-2 rounded-lg border text-[10px] gap-1.5 ${isUndoing ? 'opacity-0 scale-95 pointer-events-none' : 'border-slate-200'}`}>
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="font-bold text-slate-800">{item.talentName}</span>
                                  <span className="text-slate-400">→</span>
                                  <span className="font-bold text-slate-500 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200">{item.fromCell}</span>
                                  <span className="text-slate-400">→</span>
                                  <span className="font-bold text-indigo-600 px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-150">{item.toCell}</span>
                                </div>
                                <button onClick={() => handleUndoReclassify(item.id)} disabled={isUndoing} className="text-[9px] text-rose-600 hover:text-rose-700 font-bold cursor-pointer bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded px-2 py-0.5 w-fit">
                                  ↩ {lang === 'VI' ? 'Hoàn tác' : 'Undo'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DeptTalentAnalysisPanel — full width bên dưới grid */}
            <DeptTalentAnalysisPanel talents={siteFilteredTalents} lang={lang} selectedDept={selectedDept} onDeptChange={setSelectedDept} isLdMode={isLdMode} />

            {/* ── DATA VALIDATION INDICATOR ── */}
            {dataWarnings.filter(w => w.level === 'error').length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="font-bold text-rose-800">
                    {lang === 'VI' ? 'Phát hiện' : 'Detected'} {dataWarnings.filter(w => w.level === 'error').length} {lang === 'VI' ? 'lỗi data' : 'data errors'}
                    {dataWarnings.filter(w => w.level === 'warn').length > 0 && ` + ${dataWarnings.filter(w => w.level === 'warn').length} ${lang === 'VI' ? 'cảnh báo' : 'warnings'}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDataWarnings(!showDataWarnings)}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                >
                  {showDataWarnings ? (lang === 'VI' ? 'Ẩn chi tiết' : 'Hide') : (lang === 'VI' ? 'Xem chi tiết' : 'View details')}
                </button>
              </div>
            )}
            {showDataWarnings && dataWarnings.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-1.5 max-h-48 overflow-y-auto">
                <div className="font-black text-slate-700 uppercase tracking-wider text-[10px] mb-2">
                  🔍 {lang === 'VI' ? 'BÁO CÁO KIỂM TRA DATA' : 'DATA VALIDATION REPORT'}
                </div>
                {dataWarnings.map((w, i) => (
                  <div key={i} className={`flex items-start gap-2 px-2 py-1 rounded ${w.level === 'error' ? 'bg-rose-50 text-rose-800' : 'bg-amber-50 text-amber-800'}`}>
                    <span className="shrink-0">{w.level === 'error' ? '❌' : '⚠️'}</span>
                    <div>
                      <span className="font-bold">[{w.category}]</span> {w.message}
                      {w.details && <div className="text-[10px] opacity-70 mt-0.5">→ {w.details}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Movers Alert Banner Center */}
            {moversAlerts.length > 0 && (
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 shadow-xs space-y-3.5 mb-6 animate-pulse-subtle transition-all">
                <div className="flex items-center justify-between border-b border-rose-200/65 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                    </span>
                    <h4 className="text-[12px] font-black uppercase tracking-wider text-rose-900 font-display flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-rose-600 animate-bounce" />
                      <span>{lang === 'VI' ? 'HỆ THỐNG CẢNH BÁO LUÂN CHUYỂN TỰ ĐỘNG' : 'AUTOMATED MOVERS TRANSITION SYSTEM'}</span>
                    </h4>
                  </div>
                  <button 
                    onClick={() => setMoversAlerts([])}
                    className="text-[10px] bg-white hover:bg-rose-100 text-rose-700 font-black px-2.5 py-1 rounded-lg border border-rose-201 transition-all cursor-pointer shadow-3xs animate-fade-in"
                  >
                    {lang === 'VI' ? 'XÓA TẤT CẢ PHÁT HIỆN' : 'CLEAR ALL ALERTS'}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {moversAlerts.map((alert) => {
                    const talentObj = talents.find(t => t.name === alert.talentName);
                    return (
                      <div 
                        key={alert.id}
                        onClick={() => {
                          if (talentObj) setSelectedTalent(talentObj);
                        }}
                        className="bg-white border border-rose-205 hover:border-rose-350 rounded-xl p-3.5 shadow-3xs flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-extrabold text-slate-900 text-xs truncate">{alert.talentName}</span>
                          <span className="text-[9px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-rose-750 leading-relaxed mt-2 font-medium">
                          {lang === 'VI' 
                            ? `Nhân viên chủ chốt vừa chuyển sang nhóm Movers (ô '${alert.toCell}'). Khuyến nghị bổ túc L&D ngay!`
                            : `Personnel shifted to Movers (box '${alert.toCell}'). Targeted L&D intervention recommended.`}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-rose-100 text-[10px]">
                          <span className="text-slate-450 font-medium">
                            {lang === 'VI' ? `Từ: ${alert.fromCell}` : `From: ${alert.fromCell}`}
                          </span>
                          <span className="text-rose-600 font-extrabold hover:underline flex items-center gap-1.5">
                            <span>{lang === 'VI' ? 'Hồ sơ' : 'Inspect'}</span>
                            <Search className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


            {/* Talent Table Tracker Panel */}
            <div id="onboarding-bottom-analysis" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-left grow">
                  <h3 className="text-base font-bold text-slate-800 tracking-tight font-display flex items-center justify-start gap-2 flex-nowrap shrink-0 overflow-hidden select-none">
                    <Users className="w-5 h-5 text-indigo-550 shrink-0" />
                    <span className="font-extrabold whitespace-nowrap">{lang === 'VI' ? 'DANH SÁCH CHI TIẾT NHÂN SỰ CHỦ CHỐT' : 'COMPREHENSIVE KEY TALENT ROSTER'}</span>
                    <span className="bg-indigo-600 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-full select-none shadow-3xs shrink-0 block">
                      {tableFilteredTalents.length}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-550 leading-normal">
                    {lang === 'VI'
                      ? selectedDept === 'ALL'
                        ? 'Đang theo dõi toàn Site Millennium'
                        : `Bộ phận tuyển lựa: ${selectedDept}`
                      : selectedDept === 'ALL'
                        ? 'Monitoring All Site Millennium'
                        : `Filtered Department: ${selectedDept}`}
                    {selectedBox !== 'ALL' ? (lang === 'VI' ? ` | Ô phân vị ma trận: ${
                      selectedBox === 'Superstar' ? 'Siêu sao' :
                      selectedBox === 'High Professional' ? 'Nhân sự xuất sắc' :
                      selectedBox === 'Seasoned Professional' ? 'Nhân sự dày dặn' :
                      selectedBox === 'Solid Professional' ? 'Nhân sự vững vàng' :
                      selectedBox === 'Valued Contributor' ? 'Người Đóng góp Chủ lực' :
                      selectedBox === 'Rising Star' ? 'Ngôi sao đang lên' :
                      selectedBox === 'Learning Professional' ? 'Nhân sự cần hoàn thiện' :
                      selectedBox === 'Future Utility' ? 'Nhân tố dự phòng tương lai' :
                      selectedBox === 'Diamond in the Rough' ? 'Kim cương thô' : selectedBox
                    }` : ` | Grid Box Segment: ${selectedBox}`) : ''}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-end gap-2.5 w-full lg:w-auto">
                  {/* Local Department Selector synced with global */}
                  <SearchableDeptDropdown
                    selectedDept={selectedDept}
                    onDeptChange={handleDepartmentChange}
                    lang={lang}
                    allDepartments={siteDepartments}
                    widthClass="w-full sm:w-48"
                    isTableFilter={true}
                  />

                  {/* Export CSV Button */}
                  <button
                    onClick={exportTalentsCSV}
                    className="flex items-center justify-center gap-1.5 text-xs font-bold px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-250 hover:bg-emerald-100/70 hover:border-emerald-350 active:bg-emerald-200/50 rounded-lg transition-all duration-200 cursor-pointer shadow-3xs w-full sm:w-auto shrink-0"
                    title={lang === 'VI' ? 'Xuất danh sách nhân sự đang lọc ra tệp CSV để gửi email' : 'Export filtered talent list to raw CSV file'}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'VI' ? 'Xuất CSV font' : 'Export CSV'}</span>
                  </button>

                  {/* Search bar inside list */}
                  <div className="relative w-full sm:w-56">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                    <input
                      type="text"
                      placeholder={lang === 'VI' ? 'Tìm tên nhân viên...' : 'Search employee name...'}
                      value={searchTalentQuery}
                      onChange={(e) => setSearchTalentQuery(e.target.value)}
                      className="w-full text-xs pl-9 pr-4 py-2 bg-slate-100 rounded-lg border border-slate-200 outline-hidden hover:bg-slate-200/50 hover:border-slate-350 focus:border-brand-cyan transition-all"
                    />
                  </div>

                  {/* Filter pills togglers */}
                  <div id="onboarding-table-filters" className="flex flex-wrap gap-1 bg-slate-250 p-1 rounded-lg w-full sm:w-auto justify-center sm:justify-start">
                    <button
                      onClick={() => {
                        setSelectedGroupFilter('ALL');
                        setSelectedBox('ALL');
                      }}
                      className={`flex-1 sm:flex-none text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-md transition-all ${
                        selectedGroupFilter === 'ALL' && selectedBox === 'ALL'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {lang === 'VI' ? 'Tất cả' : 'All'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGroupFilter('Growers');
                        setSelectedBox('ALL');
                      }}
                      className={`flex-1 sm:flex-none text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                        selectedGroupFilter === 'Growers'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedGroupFilter === 'Growers' ? 'bg-white' : 'bg-emerald-500'}`} />
                      <span>{lang === 'VI' ? 'NHÓM PHÁT TRIỂN' : 'GROWERS'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGroupFilter('Keepers');
                        setSelectedBox('ALL');
                      }}
                      className={`flex-1 sm:flex-none text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                        selectedGroupFilter === 'Keepers'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedGroupFilter === 'Keepers' ? 'bg-white' : 'bg-amber-500'}`} />
                      <span>{lang === 'VI' ? 'NHÓM DUY TRÌ' : 'KEEPERS'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGroupFilter('Movers');
                        setSelectedBox('ALL');
                      }}
                      className={`flex-1 sm:flex-none text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                        selectedGroupFilter === 'Movers'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedGroupFilter === 'Movers' ? 'bg-white' : 'bg-rose-500'}`} />
                      <span>{lang === 'VI' ? 'NHÓM CẦN BỒI DƯỠNG' : 'MOVERS'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Responsive table */}
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin relative">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-20 bg-[#1e1b4b]">
                    <tr className="border-b border-[#0f172a]">
                      <th 
                        id="onboarding-th-name"
                        onClick={() => {
                          if (talentSortKey === 'name') {
                            setTalentSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                          } else {
                            setTalentSortKey('name');
                            setTalentSortDir('asc');
                          }
                        }}
                        className="sticky top-0 z-20 bg-[#1e1b4b] text-[#f1f5f9] border-b border-[#0f172a] px-6 py-4 font-bold cursor-pointer hover:bg-slate-800/80 select-none transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>{lang === 'VI' ? 'Họ và tên' : 'Full Name'}</span>
                          <ArrowUpDown className={`w-3.5 h-3.5 ${talentSortKey === 'name' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                        </div>
                      </th>
                      <th 
                        id="onboarding-th-dept"
                        onClick={() => {
                          if (talentSortKey === 'dept') {
                            setTalentSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                          } else {
                            setTalentSortKey('dept');
                            setTalentSortDir('asc');
                          }
                        }}
                        className="sticky top-0 z-20 bg-[#1e1b4b] text-[#f1f5f9] border-b border-[#0f172a] px-6 py-4 font-bold cursor-pointer hover:bg-slate-800/80 select-none transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          <span>{lang === 'VI' ? 'Bộ phận' : 'Department'}</span>
                          <ArrowUpDown className={`w-3.5 h-3.5 ${talentSortKey === 'dept' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                        </div>
                      </th>
                      <th 
                        id="onboarding-th-cell"
                        onClick={() => {
                          if (talentSortKey === 'cell') {
                            setTalentSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                          } else {
                            setTalentSortKey('cell');
                            setTalentSortDir('asc');
                          }
                        }}
                        className="sticky top-0 z-20 bg-[#1e1b4b] text-[#f1f5f9] border-b border-[#0f172a] px-6 py-4 font-bold cursor-pointer hover:bg-slate-800/80 select-none transition-colors text-center font-sans"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>{lang === 'VI' ? 'Phân loại Ô' : '9-Box Classification'}</span>
                          <ArrowUpDown className={`w-3.5 h-3.5 ${talentSortKey === 'cell' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                        </div>
                      </th>
                      <th 
                        id="onboarding-th-results"
                        onClick={() => {
                          if (talentSortKey === 'results') {
                            setTalentSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                          } else {
                            setTalentSortKey('results');
                            setTalentSortDir('asc');
                          }
                        }}
                        className="sticky top-0 z-20 bg-[#1e1b4b] text-[#f1f5f9] border-b border-[#0f172a] px-6 py-4 font-bold cursor-pointer hover:bg-slate-800/80 select-none transition-colors text-center"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>{lang === 'VI' ? 'Mức Hiệu suất' : 'Performance Level'}</span>
                          <ArrowUpDown className={`w-3.5 h-3.5 ${talentSortKey === 'results' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                        </div>
                      </th>
                      <th 
                        id="onboarding-th-potential"
                        onClick={() => {
                          if (talentSortKey === 'potential') {
                            setTalentSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                          } else {
                            setTalentSortKey('potential');
                            setTalentSortDir('asc');
                          }
                        }}
                        className="sticky top-0 z-20 bg-[#1e1b4b] text-[#f1f5f9] border-b border-[#0f172a] px-6 py-4 font-bold cursor-pointer hover:bg-slate-800/80 select-none transition-colors text-center"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>{lang === 'VI' ? 'Mức Tiềm năng' : 'Potential Level'}</span>
                          <ArrowUpDown className={`w-3.5 h-3.5 ${talentSortKey === 'potential' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                        </div>
                      </th>
                      <th 
                        onClick={() => {
                          if (talentSortKey === 'group') {
                            setTalentSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                          } else {
                            setTalentSortKey('group');
                            setTalentSortDir('asc');
                          }
                        }}
                        className="sticky top-0 z-20 bg-[#1e1b4b] text-[#f1f5f9] border-b border-[#0f172a] px-6 py-4 font-bold cursor-pointer hover:bg-slate-800/80 select-none transition-colors text-right"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>{lang === 'VI' ? 'Phân loại Nhóm' : 'Group Classification'}</span>
                          <ArrowUpDown className={`w-3.5 h-3.5 ${talentSortKey === 'group' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {tableFilteredTalents.map((t, idx) => {
                      const tagStyle =
                        t.group === 'Growers'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.group === 'Keepers'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200';

                      return (
                        <tr
                          key={t.name}
                          id={idx === 0 ? "onboarding-9box-row-0" : undefined}
                          onClick={() => setSelectedTalent(t)}
                          className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-800 hover:underline flex items-center gap-2 font-display text-sm flex-wrap">
                              <span>{t.name}</span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100/60 hover:bg-indigo-100 transition-colors">
                                <Search className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                                <span>{lang === 'VI' ? 'Xem' : 'View'}</span>
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-mono text-[10px] uppercase font-bold">
                            {t.dept}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {(() => {
                              const cell = t.cell;
                              let badgeColor = "bg-slate-50 text-slate-700 border-slate-200/80";
                              if (cell === 'Superstar') {
                                badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-3xs";
                              } else if (cell === 'High Professional') {
                                badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-3xs";
                              } else if (cell === 'Rising Star') {
                                badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-3xs";
                              } else if (cell === 'Seasoned Professional') {
                                badgeColor = "bg-amber-50 text-amber-700 border-amber-200 shadow-3xs";
                              } else if (cell === 'Solid Professional') {
                                badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                              } else if (cell === 'Valued Contributor') {
                                badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                              } else if (cell === 'Diamond in the Rough') {
                                badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                              } else if (cell === 'Future Utility') {
                                badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                              } else if (cell === 'Learning Professional') {
                                badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                              }

                              let displayCell: string = cell;
                              if (lang === 'VI') {
                                if (cell === 'Seasoned Professional') displayCell = 'Nhân sự dày dặn';
                                else if (cell === 'High Professional') displayCell = 'Nhân sự xuất sắc';
                                else if (cell === 'Superstar') displayCell = 'Siêu sao';
                                else if (cell === 'Solid Professional') displayCell = 'Nhân sự vững vàng';
                                else if (cell === 'Valued Contributor') displayCell = 'Người Đóng góp Chủ lực';
                                else if (cell === 'Rising Star') displayCell = 'Ngôi sao đang lên';
                                else if (cell === 'Learning Professional') displayCell = 'Nhân sự cần hoàn thiện';
                                else if (cell === 'Future Utility') displayCell = 'Nhân tố dự phòng tương lai';
                                else if (cell === 'Diamond in the Rough') displayCell = 'Kim cương thô';
                              }

                              return (
                                <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold tracking-tight inline-block ${badgeColor}`}>
                                  {displayCell}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 text-center border-l border-r border-slate-50">
                            {(() => {
                              const r = t.results;
                              let colorClass = "text-blue-700 bg-blue-50 border-blue-200 shadow-3xs";
                              let displayLabel = lang === 'VI' ? 'Hiệu quả' : 'Effective';

                              if (r === 'High Effective') {
                                colorClass = "text-emerald-800 bg-emerald-100 border-emerald-300";
                                displayLabel = lang === 'VI' ? 'Hiệu quả cao' : 'High Effective';
                              } else if (r === 'Less Effective') {
                                colorClass = "text-rose-705 bg-rose-50 border-rose-200";
                                displayLabel = lang === 'VI' ? 'Kém hiệu quả' : 'Less Effective';
                              }

                              return (
                                <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold tracking-tight inline-block ${colorClass}`}>
                                  {displayLabel}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {(() => {
                              const p = t.potential;
                              let colorClass = "text-blue-700 bg-blue-50 border-blue-200";
                              let displayLabel = lang === 'VI' ? 'Trung bình' : 'Mid';

                              if (p === 'High') {
                                  colorClass = "text-emerald-800 bg-emerald-100 border-emerald-300";
                                  displayLabel = lang === 'VI' ? 'Cao' : 'High';
                              } else if (p === 'Low') {
                                  colorClass = "text-rose-705 bg-rose-50 border-rose-200";
                                  displayLabel = lang === 'VI' ? 'Thấp' : 'Low';
                              }

                              return (
                                <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold tracking-tight inline-block ${colorClass}`}>
                                  {displayLabel}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${tagStyle}`}>
                              {lang === 'VI' 
                                ? t.group === 'Growers' ? 'Nhóm phát triển' : t.group === 'Keepers' ? 'Nhóm duy trì' : 'Nhóm cần bồi dưỡng'
                                : t.group}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {tableFilteredTalents.length === 0 && (
                      <tr className="bg-slate-50 text-center">
                        <td colSpan={6} className="px-6 py-12 text-slate-400 italic font-mono">
                          {lang === 'VI' 
                            ? 'Không tìm thấy nhân sự nào đáp ứng tiêu chí lọc phòng ban hoặc tìm kiếm.'
                            : 'No personnel found matching the specified department or search criteria.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2 Content: SUCCESSION PIPELINE (72 Positions) ==================== */}
        {activeTab === 'tab-pipeline' && (
          <div className="space-y-6">
            <WhyHowPlaybook featureKey="pipeline" lang={lang} isLdMode={isLdMode} selectedSite={selectedSite} />
            <InsightPanel featureKey="pipeline" lang={lang} selectedSite={selectedSite} selectedDept={selectedDept} />
            <PipelineWorkspace
              pipelineData={siteFilteredPipeline}
              selectedDept={selectedDept}
              onDeptChange={handleDepartmentChange}
              onUpdatePosition={handleUpdatePipelinePosition}
              lang={lang}
              isLdMode={isLdMode}
            />
          </div>
        )}

        {/* ==================== TAB 3 Content: DEVELOPMENT TRAINING PLANS ==================== */}
        {activeTab === 'tab-devplan' && (
          <div className="space-y-6">
            <WhyHowPlaybook featureKey="devplan" lang={lang} isLdMode={isLdMode} selectedSite={selectedSite} />
            <InsightPanel featureKey="devplan" lang={lang} selectedSite={selectedSite} selectedDept={selectedDept} />
            <DevelopmentPlanWorkspace
              selectedDept={selectedDept}
              onDeptChange={handleDepartmentChange}
              lang={lang}
              isLdMode={isLdMode}
              selectedSite={selectedSite}
            />
          </div>
        )}

        {/* ==================== TAB 4 Content: INDIVIDUAL DEVELOPMENT PLANS (IDP) ==================== */}
        {activeTab === 'tab-indiv-idp' && (
          <div className="space-y-6">
            <WhyHowPlaybook featureKey="idp" lang={lang} isLdMode={isLdMode} selectedSite={selectedSite} />
            <InsightPanel featureKey="idp" lang={lang} selectedSite={selectedSite} selectedDept={selectedDept} />
            <IndividualIDPWorkspace
              selectedDept={selectedDept}
              onDeptChange={handleDepartmentChange}
              lang={lang}
              isLdMode={isLdMode}
              selectedSite={selectedSite}
            />
          </div>
        )}
      </main>

      {/* 3. LIGHT DETAILED DRAWER/MODAL FOR TALENT INFO & 9-BOX EDITING */}
      {selectedTalent && (
        <TalentProfileModal
          talent={selectedTalent}
          onClose={() => setSelectedTalent(null)}
          onUpdateTalent={handleUpdateTalent}
          lang={lang}
          isLdMode={isLdMode}
        />
      )}

      {/* 4. SIMPLE EXPLANATORY FRAMEWORK MODAL (GROWERS, KEEPERS, MOVERS) FOR DEPARTMENT HEADS */}
      {showFrameworkModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4.5 flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-sm font-black tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
                  <span className="p-1 px-1.5 bg-indigo-100 rounded-lg text-indigo-650">📖</span>
                  <span>
                    {lang === 'VI' ? 'Ý nghĩa mô hình: Growers, Keepers, Movers' : 'Core Framework Definitions: Growers, Keepers & Movers'}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {lang === 'VI' ? 'Cẩm nang đơn giản hóa cho Quản lý Bộ phận - Không dùng thuật ngữ phức tạp' : 'A simplified guide designed specifically for Department Heads'}
                </p>
              </div>
              <button
                onClick={() => setShowFrameworkModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto scrollbar-thin space-y-4 bg-slate-50/20 text-left">
              {/* Category: Growers */}
              <div className="bg-emerald-50/80 p-4.5 rounded-2xl border border-emerald-200">
                <h4 className="font-extrabold text-emerald-950 flex items-center gap-2 mb-2 text-xs uppercase font-display">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{lang === 'VI' ? '🟢 Nhóm Phát triển (Growers) - "Động cơ tăng trưởng"' : '🟢 Growers - "The Growth Accelerators"'}</span>
                </h4>
                <p className="text-[11.5px] text-emerald-900 leading-relaxed font-medium">
                  {lang === 'VI'
                    ? 'Là những nhân cốt học hỏi cực nhanh, tràn đầy nhiệt huyết và năng lượng học tập. Trong tổ chức, Growers được xem như người kiến tạo sự đổi mới, sẵn sàng đón nhận các kỹ năng hay quy trình sản xuất nâng cao để thay thế cho ban điều hành hoặc các cấp quản lý kỹ thuật trong tương lai. Để tối ưu hoạt động, bộ phận cần cố gắng duy trì tỷ lệ Growers lớn hơn 20%.'
                    : 'High-agility, versatile learning engines. They are change agents set to lead development projects, embrace new tooling, and serve as direct successors for critical technical or managerial roles. Focus on giving stretch assignments. Target: >20%.'}
                </p>
              </div>

              {/* Category: Keepers */}
              <div className="bg-amber-50/80 p-4.5 rounded-2xl border border-amber-200">
                <h4 className="font-extrabold text-amber-950 flex items-center gap-2 mb-2 text-xs uppercase font-display">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>{lang === 'VI' ? '🟡 Nhóm Duy trì (Keepers) - "Trụ cột ổn định"' : '🟡 Keepers - "The Operational Backbone"'}</span>
                </h4>
                <p className="text-[11.5px] text-amber-900 leading-relaxed font-medium">
                  {lang === 'VI'
                    ? 'Là bộ khung và xương sống vận hành bền vững của bộ phận. Họ thực thi các quy trình chuẩn mỗi ngày một cách trơn tru, dạn dày kinh nghiệm thực tiễn và vô cùng trung thành. Nhóm Keepers bảo vệ chất lượng cốt lõi, duy trì tải trọng sản xuất ổn định mà không làm phình to quỹ lương. Cần chú trọng khen ngợi, giữ chân và đào tạo bổ khuyết tay nghề còn thiếu.'
                    : 'The reliable everyday operators driving standard workflows. They keep the team stable, ensuring consistent output with efficient overheads. Keepers are the bedrock of daily excellence. Focus on engagement, recognition, and small refresher modules. Target: >40%.'}
                </p>
              </div>

              {/* Category: Movers */}
              <div className="bg-rose-50/80 p-4.5 rounded-2xl border border-rose-250">
                <h4 className="font-extrabold text-rose-950 flex items-center gap-2 mb-2 text-xs uppercase font-display">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>{lang === 'VI' ? '🔴 Nhóm Cần bồi dưỡng (Movers) - "Kèm cặp & Rèn luyện"' : '🔴 Movers - "The Coaching Cohort"'}</span>
                </h4>
                <p className="text-[11.5px] text-rose-900 leading-relaxed font-semibold">
                  {lang === 'VI'
                    ? 'Gồm những anh em mới nhận nhiệm vụ, nhân sự mới tuyển dụng hoặc nhân sự có kẽ hổng tay nghề tạm thời do công cụ thay đổi. Đây hoàn toàn KHÔNG phải là nhóm yếu kém do thái độ, mà là nhóm đang cần Trưởng bộ phận thiết lập Lộ trình Phát triển Cá nhân (IDP) rõ ràng để bù đắp tay nghề kịp thời. Không nên thả nổi tự bơi, tỷ lệ tối ưu cần dưới 20%.'
                    : 'Newly assigned individuals, fresh hires, or members with skill gaps. They are not underperforming due to attitude, but rather require direct manager intervention, a clear Individual Development Plan (IDP) and standard OJT coaching. Maintain <20% to prevent manager overload.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowFrameworkModal(false)}
                className="px-4.5 py-2 bg-slate-900 hover:bg-slate-805 text-white border border-slate-900 rounded-xl font-bold transition-all text-xs cursor-pointer shadow-3xs"
              >
                {lang === 'VI' ? 'Tôi đã hiểu' : 'Close Window'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ONBOARDING WELCOME TOUR GUIDE */}
      <OnboardingGuide 
        lang={lang} 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
        isOpen={showOnboarding} 
        onClose={() => {
          setShowOnboarding(false);
          try {
            localStorage.setItem('hasCompletedOnboarding', 'true');
          } catch {}
        }} 
      />

      {/* FIRST END USER ENTRY WELCOME PROMPT MODAL */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden bg-slate-900/95 border-2 border-indigo-500/40 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.3)] p-6 md:p-8 animate-in zoom-in-95 duration-300 text-center">
            {/* Elegant glowing background ornament */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Elegant top-right Close button */}
            <button
              onClick={handleSkipOnboardingFromModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/60 transition-all duration-200 cursor-pointer shrink-0 z-10"
              title={lang === 'VI' ? 'Đóng' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Pulsing beautiful lightbulb badge container */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 border-2 border-amber-400 text-amber-400 mb-5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-amber-500/10 opacity-75"></span>
              <Lightbulb className="w-7 h-7" />
            </div>

            {/* Prompt titles */}
            <h3 className="text-xl md:text-2xl font-sans font-black tracking-wider leading-snug text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 uppercase drop-shadow-md">
              {lang === 'VI' ? '💡 HƯỚNG DẪN' : '💡 TOUR GUIDE'}
            </h3>

            <div className="mt-4 px-1 space-y-3.5">
              <p className="text-[14px] md:text-[15px] font-extrabold text-white leading-snug">
                {lang === 'VI' 
                  ? 'Chào mừng đến với hệ thống báo cáo Đánh giá Nhân tài và Hoạch định Kế thừa'
                  : 'Welcome to the Talent Assessment & Succession Planning Report system'}
              </p>
              <p className="text-[12.5px] md:text-[13px] font-medium text-slate-200 leading-relaxed">
                {lang === 'VI'
                  ? 'Bạn có muốn tham gia một hành trình hướng dẫn nhanh để dễ dàng làm quen với các hạng mục và tính năng hay không?'
                  : 'Would you like to join a quick guided tour to easily familiarize yourself with the categories and features?'}
              </p>
            </div>

            {/* Micro language control inside prompt */}
            <div className="mt-5.5 flex justify-center items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                {lang === 'VI' ? 'Ngôn ngữ / Language:' : 'Language / Ngôn ngữ:'}
              </span>
              <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 shadow-inner">
                <button
                  onClick={() => handleLangChange('VI')}
                  className={`px-3 py-1 rounded-md text-[10px] font-black transition-all uppercase flex items-center cursor-pointer select-none ${
                    lang === 'VI'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-350'
                  }`}
                >
                  🇻🇳 VI
                </button>
                <button
                  onClick={() => handleLangChange('EN')}
                  className={`px-3 py-1 rounded-md text-[10px] font-black transition-all uppercase flex items-center cursor-pointer select-none ${
                    lang === 'EN'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-350'
                  }`}
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>

            {/* High-quality responsive CTA Action pair buttons */}
            <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={handleSkipOnboardingFromModal}
                className="w-full flex items-center justify-center px-4 py-3 bg-slate-800/40 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/60 rounded-xl leading-none transition-all duration-200 cursor-pointer font-extrabold text-[11px] uppercase tracking-wider select-none"
              >
                {lang === 'VI' ? 'Tự khám phá' : 'No, skip'}
              </button>
              <button
                onClick={handleStartOnboardingFromModal}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl leading-none transition-all duration-300 cursor-pointer font-extrabold text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] select-none"
              >
                <span>{lang === 'VI' ? 'Bắt đầu Hướng dẫn' : 'Start Walkthrough'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
