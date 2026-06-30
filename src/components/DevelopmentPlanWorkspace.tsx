import React, { useState, useEffect, useMemo } from 'react';
import { TrainingProposal } from '../types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { dbProposalTraining, dbProposalTrainingWNK, dbProposalTrainingASH, dbTrainingSummary, allDepartments, wnkDepartments, ashDepartments } from '../data';
import { SearchableDeptDropdown } from './SearchableDeptDropdown';
import {
  Flame,
  Medal,
  Check,
  ExternalLink,
  RefreshCw,
  Send,
  AlertCircle,
  TrendingUp,
  X,
  Settings,
  MessageSquare,
  Star,
  Compass,
  PlusCircle,
  HelpCircle,
  Download,
  Award,
  Calendar,
  Eye,
  Edit3,
  Pencil,
  Layers,
  Sparkles,
  AlertTriangle,
  ArrowUpDown,
  Search,
  Move,
  BellRing,
  Sliders,
} from 'lucide-react';

interface DevelopmentPlanWorkspaceProps {
  selectedDept: string;
  onDeptChange?: (dept: string) => void;
  lang?: 'VI' | 'EN';
  isLdMode?: boolean;
  selectedSite?: 'MLN' | 'WNK' | 'ASH';
}

interface ProgramTimeline {
  priority: number;
  program: string;
  quarter: string;
  status: 'planned' | 'ongoing' | 'completed';
}

// Custom Markdown to React parser to prevent static flag error on React 19 / HMR reloads
const parseBoldText = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const innerText = part.slice(2, -2);
      return <strong key={index} className="font-sans font-black text-indigo-950">{innerText}</strong>;
    }
    return part;
  });
};

const renderCustomMarkdown = (markdown: string): React.ReactNode => {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentListItems: React.ReactNode[] = [];
  let listKey = 0;
  
  const pushListIfExist = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-disc pl-5 mt-1.5 mb-2.5 space-y-1 text-slate-705 font-sans text-[10.5px]">
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      pushListIfExist();
      continue;
    }

    // Headers: #### or ###
    const headerMatch = line.match(/^(#{1,6})\s*(.*)$/);
    if (headerMatch) {
      pushListIfExist();
      const text = headerMatch[2];
      elements.push(
        <h4 key={`h-${i}`} className="font-sans font-black text-slate-800 text-[11px] mt-3 mb-1 border-b border-indigo-50 pb-0.5 uppercase tracking-wide">
          {parseBoldText(text)}
        </h4>
      );
      continue;
    }

    // Direct bullet points
    const listMatch = line.match(/^[-*+]\s+(.*)$/);
    if (listMatch) {
      currentListItems.push(
        <li key={`li-${i}`} className="font-sans text-[10.5px] text-slate-650 leading-relaxed pl-1">
          {parseBoldText(listMatch[1])}
        </li>
      );
      continue;
    }

    // Numbered list item or dynamic header with number (e.g. "1. **💡 Title**")
    const numMatch = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (numMatch) {
      pushListIfExist();
      const content = numMatch[2];
      // If it contains bold layout title, render nicely
      if (content.startsWith('**')) {
        elements.push(
          <div key={`numhead-${i}`} className="font-sans font-black text-indigo-950 text-[11px] mt-3.5 mb-1.5 border-b border-indigo-50/70 pb-0.5 uppercase flex items-center gap-1">
            <span>{numMatch[1]}.</span>
            <span>{parseBoldText(content)}</span>
          </div>
        );
      } else {
        elements.push(
          <p key={`p-${i}`} className="font-sans text-[10.5px] text-slate-650 leading-relaxed mb-2">
            <strong>{numMatch[1]}.</strong> {parseBoldText(content)}
          </p>
        );
      }
      continue;
    }

    // Regular line / Paragraph
    pushListIfExist();
    elements.push(
      <p key={`p-${i}`} className="font-sans text-[10.5px] text-slate-650 leading-relaxed mb-2">
        {parseBoldText(line)}
      </p>
    );
  }

  pushListIfExist();
  return <div className="space-y-1">{elements}</div>;
};

const getCompetencyBadgeClasses = (comp: string) => {
  const c = comp.toLowerCase();
  if (c.includes('digital') || c.includes('số') || c.includes('công nghệ') || c.includes('it') || c.includes('automation')) {
    return 'bg-blue-50/90 text-blue-700 border-blue-200/70';
  }
  if (c.includes('leadership') || c.includes('lãnh đạo') || c.includes('quản lý') || c.includes('mgmt') || c.includes('acumen')) {
    return 'bg-amber-50/90 text-amber-800 border-amber-200/70';
  }
  if (c.includes('soft') || c.includes('mềm') || c.includes('interpersonal') || c.includes('communication') || c.includes('giao tiếp') || c.includes('thuyết trình')) {
    return 'bg-purple-50/90 text-purple-700 border-purple-200/70';
  }
  if (c.includes('coaching') || c.includes('trainer') || c.includes('huấn luyện') || c.includes('đào tạo') || c.includes('l&d')) {
    return 'bg-indigo-50/90 text-indigo-700 border-indigo-200/70';
  }
  if (c.includes('talent') || c.includes('tài năng') || c.includes('kế thừa') || c.includes('succession')) {
    return 'bg-pink-50/90 text-pink-700 border-pink-200/70';
  }
  // For Technical/Compliance/Operational
  return 'bg-emerald-50/90 text-emerald-700 border-emerald-200/70';
};

const COMP_DETAILS: Record<string, {
  mappedNeedVi: string;
  mappedNeedEn: string;
  totalNeeds: number;
  employees: number;
  departments: number;
  r1: number;
  r2: number;
  lowReadinessCount: number;
  lowReadinessPct: string;
  priorityCount: number;
  priorityPct: string;
  actionVi: string;
  actionEn: string;
  depts: string[];
  subNeeds?: {
    mappedNeedVi: string;
    mappedNeedEn: string;
    totalNeeds: number;
    employees: number;
    departments: number;
    r1: number;
    r2: number;
    lowReadinessCount: number;
    lowReadinessPct: string;
    priorityCount: number;
    priorityPct: string;
    depts: string[];
  }[];
}> = {
  '1. Kỹ năng Lãnh đạo': {
    mappedNeedVi: 'Leadership / Stakeholder / Culture (Năng lực Lãnh đạo & Văn hóa tổ chức)',
    mappedNeedEn: 'Leadership / Stakeholder / Culture Coaching support',
    totalNeeds: 79,
    employees: 15,
    departments: 7,
    r1: 0,
    r2: 17,
    lowReadinessCount: 17,
    lowReadinessPct: '22%',
    priorityCount: 21,
    priorityPct: '27%',
    actionVi: 'Đưa vào Kế hoạch Đào tạo',
    actionEn: 'Add to Training Plan',
    depts: ['Quality Control', 'Planning & Inventory', 'EHS', 'Finance & Legal', 'Information System', 'Training', 'Plant Engineering']
  },
  '1. Leadership Skills': {
    mappedNeedVi: 'Leadership / Stakeholder / Culture (Năng lực Lãnh đạo & Văn hóa tổ chức)',
    mappedNeedEn: 'Leadership / Stakeholder / Culture Coaching support',
    totalNeeds: 79,
    employees: 15,
    departments: 7,
    r1: 0,
    r2: 17,
    lowReadinessCount: 17,
    lowReadinessPct: '22%',
    priorityCount: 21,
    priorityPct: '27%',
    actionVi: 'Đưa vào Kế hoạch Đào tạo',
    actionEn: 'Add to Training Plan',
    depts: ['Quality Control', 'Planning & Inventory', 'EHS', 'Finance & Legal', 'Information System', 'Training', 'Plant Engineering']
  },
  '2. Kỹ năng Công nghệ': {
    mappedNeedVi: 'Data Analytics / Reporting & Digital / AI / Automation',
    mappedNeedEn: 'Data Analytics / Reporting & Digital / AI / Automation',
    totalNeeds: 44,
    employees: 21,
    departments: 8,
    r1: 4,
    r2: 4,
    lowReadinessCount: 8,
    lowReadinessPct: '18%',
    priorityCount: 10,
    priorityPct: '23%',
    actionVi: 'Đưa vào Kế hoạch Đào tạo',
    actionEn: 'Add to Training Plan',
    depts: ['Quality Control', 'Planning & Inventory', 'EHS', 'Finance & Legal', 'Logistic & Service', 'Information System', 'Training', 'Plant Engineering'],
    subNeeds: [
      {
        mappedNeedVi: 'Data Analytics & Reporting (Báo cáo & Phân tích Dữ liệu)',
        mappedNeedEn: 'Data Analytics / Reporting',
        totalNeeds: 27,
        employees: 11,
        departments: 5,
        r1: 3,
        r2: 2,
        lowReadinessCount: 5,
        lowReadinessPct: '19%',
        priorityCount: 4,
        priorityPct: '15%',
        depts: ['Quality Control', 'Planning & Inventory', 'EHS', 'Finance & Legal', 'Logistic & Service']
      },
      {
        mappedNeedVi: 'Digital / AI / Automation (Số hóa & Tự động hóa)',
        mappedNeedEn: 'Digital / AI / Automation',
        totalNeeds: 17,
        employees: 10,
        departments: 6,
        r1: 1,
        r2: 2,
        lowReadinessCount: 3,
        lowReadinessPct: '18%',
        priorityCount: 6,
        priorityPct: '35%',
        depts: ['Quality Control', 'Planning & Inventory', 'EHS', 'Finance & Legal', 'Information System', 'Training']
      }
    ]
  },
  '2. AI & Automation': {
    mappedNeedVi: 'Data Analytics / Reporting & Digital / AI / Automation',
    mappedNeedEn: 'Data Analytics / Reporting & Digital / AI / Automation',
    totalNeeds: 44,
    employees: 21,
    departments: 8,
    r1: 4,
    r2: 4,
    lowReadinessCount: 8,
    lowReadinessPct: '18%',
    priorityCount: 10,
    priorityPct: '23%',
    actionVi: 'Đưa vào Kế hoạch Đào tạo',
    actionEn: 'Add to Training Plan',
    depts: ['Quality Control', 'Planning & Inventory', 'EHS', 'Finance & Legal', 'Logistic & Service', 'Information System', 'Training', 'Plant Engineering'],
    subNeeds: [
      {
        mappedNeedVi: 'Data Analytics & Reporting (Báo cáo & Phân tích Dữ liệu)',
        mappedNeedEn: 'Data Analytics / Reporting',
        totalNeeds: 27,
        employees: 11,
        departments: 5,
        r1: 3,
        r2: 2,
        lowReadinessCount: 5,
        lowReadinessPct: '19%',
        priorityCount: 4,
        priorityPct: '15%',
        depts: ['Quality Control', 'Planning & Inventory', 'EHS', 'Finance & Legal', 'Logistic & Service']
      },
      {
        mappedNeedVi: 'Digital / AI / Automation (Số hóa & Tự động hóa)',
        mappedNeedEn: 'Digital / AI / Automation',
        totalNeeds: 17,
        employees: 10,
        departments: 6,
        r1: 1,
        r2: 2,
        lowReadinessCount: 3,
        lowReadinessPct: '18%',
        priorityCount: 6,
        priorityPct: '35%',
        depts: ['Quality Control', 'Planning & Inventory', 'EHS', 'Finance & Legal', 'Information System', 'Training']
      }
    ]
  },
  '3. Kỹ năng Giao tiếp': {
    mappedNeedVi: 'Communication & Presentation (Giao tiếp & Thuyết trình Thuyết phục)',
    mappedNeedEn: 'Communication / Presentation Skill Focus',
    totalNeeds: 30,
    employees: 7,
    departments: 5,
    r1: 0,
    r2: 2,
    lowReadinessCount: 2,
    lowReadinessPct: '7%',
    priorityCount: 16,
    priorityPct: '53%',
    actionVi: 'Đưa vào Kế hoạch Đào tạo',
    actionEn: 'Add to Training Plan',
    depts: ['Quality Control', 'EHS', 'Training', 'Plant Engineering']
  },
  '3. Communication Skills': {
    mappedNeedVi: 'Communication & Presentation (Giao tiếp & Thuyết trình Thuyết phục)',
    mappedNeedEn: 'Communication / Presentation Skill Focus',
    totalNeeds: 30,
    employees: 7,
    departments: 5,
    r1: 0,
    r2: 2,
    lowReadinessCount: 2,
    lowReadinessPct: '7%',
    priorityCount: 16,
    priorityPct: '53%',
    actionVi: 'Đưa vào Kế hoạch Đào tạo',
    actionEn: 'Add to Training Plan',
    depts: ['Quality Control', 'EHS', 'Training', 'Plant Engineering']
  },
  '4. Kỹ năng Huấn luyện': {
    mappedNeedVi: 'Coaching / Mentoring (Khung kèm cặp & Huấn luyện nhân sự)',
    mappedNeedEn: 'Coaching / Mentoring & Instructional Mentorship',
    totalNeeds: 29,
    employees: 10,
    departments: 6,
    r1: 0,
    r2: 9,
    lowReadinessCount: 9,
    lowReadinessPct: '31%',
    priorityCount: 6,
    priorityPct: '21%',
    actionVi: 'Đưa vào Kế hoạch Đào tạo',
    actionEn: 'Add to Training Plan',
    depts: ['Planning & Inventory', 'EHS', 'Finance & Legal', 'Information System', 'Plant Engineering']
  },
  '4. Coaching Skills': {
    mappedNeedVi: 'Coaching / Mentoring (Khung kèm cặp & Huấn luyện nhân sự)',
    mappedNeedEn: 'Coaching / Mentoring & Instructional Mentorship',
    totalNeeds: 29,
    employees: 10,
    departments: 6,
    r1: 0,
    r2: 9,
    lowReadinessCount: 9,
    lowReadinessPct: '31%',
    priorityCount: 6,
    priorityPct: '21%',
    actionVi: 'Đưa vào Kế hoạch Đào tạo',
    actionEn: 'Add to Training Plan',
    depts: ['Planning & Inventory', 'EHS', 'Finance & Legal', 'Information System', 'Plant Engineering']
  }
};

export default function DevelopmentPlanWorkspace({
  selectedDept,
  onDeptChange,
  lang = 'VI',
  isLdMode = false,
  selectedSite = 'MLN',
}: DevelopmentPlanWorkspaceProps) {
  const siteDepartments = useMemo(() => {
    if (selectedSite === 'WNK') return wnkDepartments;
    if (selectedSite === 'ASH') return ashDepartments;
    return allDepartments;
  }, [selectedSite]);

  const schedulerScrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Configured with standard local storage state to preserve edits
  const [editedPrograms, setEditedPrograms] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('development_plan_edited_programs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [editingProgramPriorityId, setEditingProgramPriorityId] = useState<number | null>(null);
  const [editingProgramValue, setEditingProgramValue] = useState<string>('');
  const [expandedDeptsPriority, setExpandedDeptsPriority] = useState<number[]>([]);

  const [confirmedPriorities, setConfirmedPriorities] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('development_plan_confirmed_priorities');
      return saved ? JSON.parse(saved) : [1, 2, 4]; // Default preset priorities in plan
    } catch {
      return [1, 2, 4];
    }
  });

  // Action change log timeline
  const [actionTimeline, setActionTimeline] = useState<ProgramTimeline[]>(() => {
    try {
      const saved = localStorage.getItem('development_plan_timeline');
      if (saved) return JSON.parse(saved);
    } catch {}
    
    return [
      { priority: 1, program: 'Chương trình Mini-MBA Đột phá Năng lực Quản trị', quarter: 'Q3/2026', status: 'planned' },
      { priority: 2, program: 'Digital Leadership & Innovation workshop', quarter: 'Q4/2026', status: 'planned' },
      { priority: 4, program: 'Thấu hiểu Bản thân qua Thấu cảm học & DISC', quarter: 'Q2/2026', status: 'ongoing' },
    ];
  });

  // Site-specific drag-and-drop course schedules state
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('development_plan_millennium_courses2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'ai_automation',
        name: 'AI / Automation',
        viName: 'AI / Automation ứng dụng',
        startMonth: 4, // May
        duration: 3,
        color: 'from-amber-400 to-orange-550 border-amber-500 shadow-amber-100 text-slate-900',
        active: true,
        competency: 'Digital Skills & Tech',
        viCompetency: 'Kỹ năng Số & Công nghệ',
        needs: 44,
        coverage: '88%'
      },
      {
        id: 'servant_leadership',
        name: 'Servant Leadership',
        viName: 'Lãnh đạo phục vụ (Servant)',
        startMonth: 6, // Jul
        duration: 6,
        color: 'from-indigo-600 to-blue-700 border-indigo-700 shadow-indigo-100 text-white',
        active: true,
        competency: 'Leadership & Mgmt',
        viCompetency: 'Lãnh đạo & Quản lý',
        needs: 79,
        coverage: '75%'
      },
      {
        id: 'communication',
        name: 'Communication & Presentation',
        viName: 'Giao tiếp & Thuyết trình chuyên sâu',
        startMonth: 4, // May
        duration: 4,
        color: 'from-sky-500 to-sky-600 border-sky-650 shadow-sky-100 text-white',
        active: true,
        competency: 'Soft Skills',
        viCompetency: 'Kỹ năng Mềm',
        needs: 30,
        coverage: '50%'
      },
      {
        id: 'succession_idp',
        name: 'Succession Pipeline & IDP',
        viName: 'Quy hoạch Kế thừa & Bản đồ IDP',
        startMonth: 8, // Sep
        duration: 4,
        color: 'from-emerald-600 to-emerald-700 border-emerald-700 shadow-emerald-100 text-white',
        active: true,
        competency: 'Talent Management',
        viCompetency: 'Phát triển Tài năng',
        needs: 25,
        coverage: '63%'
      },
      {
        id: 'train_trainer',
        name: 'Train the Trainer',
        viName: 'Đào tạo Giảng viên nội bộ',
        startMonth: 8, // Sep
        duration: 4,
        color: 'from-violet-500 to-purple-600 border-violet-600 shadow-violet-100 text-white',
        active: true,
        competency: 'L&D & Coaching',
        viCompetency: 'Đào tạo & Huấn luyện',
        needs: 29,
        coverage: '63%'
      },
    ];
  });

  // Active inputs card checkboxes mapping
  const [activeCards, setActiveCards] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('development_plan_millennium_active_cards');
      return saved ? JSON.parse(saved) : {
        ai_automation: true,
        communication: true,
        servant_leadership: true,
        train_trainer: true,
        succession_pipeline: true,
        idp_self_dev: true,
      };
    } catch {
      return {
        ai_automation: true,
        communication: true,
        servant_leadership: true,
        train_trainer: true,
        succession_pipeline: true,
        idp_self_dev: true,
      };
    }
  });

  const [editingCourse, setEditingCourse] = useState<any>(null);
  // WNK courses based on DevP.xlsx data
  const wnkCourses = useMemo(() => [
    {
      id: 'wnk_leadership',
      name: 'Servant Leadership Program',
      viName: 'Chương trình Lãnh đạo Phục vụ',
      startMonth: 5,
      duration: 6,
      color: 'from-indigo-600 to-blue-700 border-indigo-700 shadow-indigo-100 text-white',
      active: true,
      competency: 'Leadership Skills',
      viCompetency: 'Kỹ năng Lãnh đạo',
      needs: 47,
      coverage: '41%',
    },
    {
      id: 'wnk_communication',
      name: 'Communication & Presentation Workshop',
      viName: 'Giao tiếp & Thuyết trình',
      startMonth: 4,
      duration: 4,
      color: 'from-sky-500 to-sky-600 border-sky-650 shadow-sky-100 text-white',
      active: true,
      competency: 'Communication Skills',
      viCompetency: 'Kỹ năng Giao tiếp',
      needs: 33,
      coverage: '49%',
    },
    {
      id: 'wnk_coaching',
      name: 'Train the Trainer / Coaching Program',
      viName: 'Đào tạo Giảng viên / Kèm cặp',
      startMonth: 7,
      duration: 5,
      color: 'from-violet-500 to-purple-600 border-violet-600 shadow-violet-100 text-white',
      active: true,
      competency: 'Coaching Skills',
      viCompetency: 'Kỹ năng Kèm cặp',
      needs: 122,
      coverage: '51%',
    },
    {
      id: 'wnk_digital',
      name: 'AI for Everyone; Power Automate; Power BI',
      viName: 'AI & Tự động hóa ứng dụng',
      startMonth: 6,
      duration: 3,
      color: 'from-amber-400 to-orange-550 border-amber-500 shadow-amber-100 text-slate-900',
      active: true,
      competency: 'AI & Automation',
      viCompetency: 'AI & Tự động hóa',
      needs: 34,
      coverage: '20%',
    },
  ], []);

  // ASH courses based on ASH_DevPlan_Master.xlsx
  const ashCourses = useMemo(() => [
    {
      id: 'ash_communication',
      name: 'Communication & Presentation Workshop',
      viName: 'Giao tiếp & Thuyết trình',
      startMonth: 4,
      duration: 3,
      color: 'from-sky-500 to-sky-600 border-sky-650 shadow-sky-100 text-white',
      active: true,
      competency: 'Communication Skills',
      viCompetency: 'Kỹ năng Giao tiếp',
      needs: 12,
      coverage: '100%',
    },
    {
      id: 'ash_coaching',
      name: 'Train the Trainer / Coaching Program',
      viName: 'Đào tạo Giảng viên / Kèm cặp',
      startMonth: 5,
      duration: 5,
      color: 'from-violet-500 to-purple-600 border-violet-600 shadow-violet-100 text-white',
      active: true,
      competency: 'Coaching Skills',
      viCompetency: 'Kỹ năng Kèm cặp',
      needs: 57,
      coverage: '100%',
    },
    {
      id: 'ash_leadership',
      name: 'Servant Leadership Program',
      viName: 'Chương trình Lãnh đạo Phục vụ',
      startMonth: 7,
      duration: 4,
      color: 'from-amber-500 to-orange-600 border-amber-600 shadow-amber-100 text-white',
      active: true,
      competency: 'Leadership Skills',
      viCompetency: 'Kỹ năng Lãnh đạo',
      needs: 4,
      coverage: '29%',
    },
    {
      id: 'ash_digital',
      name: 'AI for Everyone; Power Automate; Power BI',
      viName: 'AI & Tự động hóa ứng dụng',
      startMonth: 8,
      duration: 3,
      color: 'from-amber-400 to-orange-500 border-amber-500 shadow-amber-100 text-slate-900',
      active: true,
      competency: 'AI & Automation',
      viCompetency: 'AI & Tự động hóa',
      needs: 4,
      coverage: '14%',
    },
  ], []);

  const siteActiveCourses = useMemo(() => {
    if (selectedSite === 'WNK') return wnkCourses;
    if (selectedSite === 'ASH') return ashCourses;
    return courses;
  }, [courses, wnkCourses, ashCourses, selectedSite]);

  const siteActionTimeline = useMemo(() => {
    return actionTimeline;
  }, [actionTimeline]);

  const [isLoadingSyllabus, setIsLoadingSyllabus] = useState(false);
  const [syllabusError, setSyllabusError] = useState<string | null>(null);

  // Drag and drop custom tracking states
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  // States for dynamic AI course recommendations (Requirement 1)
  const [aiRecs, setAiRecs] = useState<any[] | null>(null);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);
  const [aiRecsError, setAiRecsError] = useState<string | null>(null);

  const fetchAiRecommendations = async () => {
    setIsGeneratingRecs(true);
    setAiRecsError(null);
    try {
      const res = await fetch("/api/gemini/course-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dept: selectedDept, lang }),
      });
      if (!res.ok) {
        throw new Error(lang === 'VI' ? 'Không thể tổng hợp đề xuất khoa học tự động lúc này.' : 'Failed to query course suggestions.');
      }
      const data = await res.json();
      setAiRecs(data.data);
    } catch (err: any) {
      console.error("fetchAiRecommendations Error:", err);
      setAiRecsError(err.message || "An error occurred.");
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  const handleAddAiCourse = (rec: any) => {
    if (courses.some(c => c.id === rec.id)) {
      setToastMessage(lang === 'VI' ? `Khóa học '${rec.viName}' đã được tích hợp trước đó!` : `Course '${rec.name}' has already been added.`);
      return;
    }

    const newCourse = {
      id: rec.id,
      name: rec.name,
      viName: rec.viName,
      startMonth: 5, // default: June
      duration: 3, // default: 3 months
      color: 'from-indigo-600 to-indigo-800 border-indigo-700 text-white shadow-md shadow-indigo-100',
      active: true,
      competency: rec.competency,
      viCompetency: rec.viCompetency,
      needs: rec.needs,
      coverage: rec.coverage,
    };

    setCourses(prev => [...prev, newCourse]);

    setActiveCards(prev => ({
      ...prev,
      [rec.id]: true
    }));

    setToastMessage(lang === 'VI' ? `Thành công! Đã đồng bộ khóa học AI '${rec.viName}' vào Sơ đồ thời trình!` : `Added and synchronized AI recommended program '${rec.name}' successfully!`);

    setAiRecs(prev => prev ? prev.map(item => item.id === rec.id ? { ...item, statusAction: 'added' } : item) : null);
  };

  const handleConsiderAiCourse = (recId: string) => {
    setAiRecs(prev => prev ? prev.map(item => item.id === recId ? { ...item, statusAction: 'considering' } : item) : null);
    setToastMessage(lang === 'VI' ? `Đã lưu trạng thái: Xem xét thêm khóa học này.` : `Saved as Under Consideration.`);
  };

  const fetchSyllabus = async (course: any) => {
    if (!course) return;
    setIsLoadingSyllabus(true);
    setSyllabusError(null);
    try {
      const res = await fetch("/api/gemini/course-syllabus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          courseName: lang === 'VI' ? course.viName : course.name,
          competency: lang === 'VI' ? course.viCompetency : course.competency,
          lang,
        }),
      });
      if (!res.ok) {
        throw new Error("Cannot produce curriculum details at this moment.");
      }
      const data = await res.json();
      setEditingCourse({
        ...course,
        syllabus: data.syllabus,
      });
    } catch (err: any) {
      console.error("fetchSyllabus Error:", err);
      setSyllabusError(err.message || "An error occurred while generating syllabus.");
    } finally {
      setIsLoadingSyllabus(false);
    }
  };

  const toggleCard = (cardId: string) => {
    setActiveCards(prev => {
      const updated = { ...prev, [cardId]: !prev[cardId] };
      try {
        localStorage.setItem('development_plan_millennium_active_cards', JSON.stringify(updated));
      } catch (e) {}
      
      // Sync active state of mapped course in courses array
      let courseTarget = cardId;
      if (cardId === 'succession_pipeline' || cardId === 'idp_self_dev') {
        courseTarget = 'succession_idp';
      }
      
      setCourses(cPrev => {
        const cUpdated = cPrev.map(c => {
          if (c.id === courseTarget) {
            // Unify: if either is active, display Succession & IDP
            const isBarActive = (courseTarget === 'succession_idp') 
              ? (updated.succession_pipeline || updated.idp_self_dev)
              : updated[cardId];
            
            // Dynamically rename label depending on which cards are active
            let dynamicName = c.name;
            let dynamicViName = c.viName;
            if (courseTarget === 'succession_idp') {
              if (updated.succession_pipeline && updated.idp_self_dev) {
                dynamicName = 'Succession Pipeline & IDP';
                dynamicViName = 'Quy hoạch Kế thừa & Bản đồ IDP';
              } else if (updated.succession_pipeline) {
                dynamicName = 'Succession Pipeline Plan';
                dynamicViName = 'Chương trình Quy hoạch Kế thừa';
              } else if (updated.idp_self_dev) {
                dynamicName = 'Talent IDP Development';
                dynamicViName = 'Hoạch định IDP & Phát triển';
              }
            }
            return { ...c, active: isBarActive, name: dynamicName, viName: dynamicViName };
          }
          return c;
        });
        try {
          localStorage.setItem('development_plan_millennium_courses', JSON.stringify(cUpdated));
        } catch (e) {}
        return cUpdated;
      });

      return updated;
    });
  };

  const handleMoveCourse = (courseId: string, monthIdx: number) => {
    // Map composite cards
    const targetId = (courseId === 'succession_pipeline' || courseId === 'idp_self_dev') ? 'succession_idp' : courseId;
    
    // Auto-activate the card if it was inactive
    setActiveCards(prev => {
      const updated = { ...prev };
      if (!updated[courseId]) {
        updated[courseId] = true;
        try {
          localStorage.setItem('development_plan_millennium_active_cards', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });

    setCourses(prev => {
      const updated = prev.map(c => {
        if (c.id === targetId) {
          const maxStart = 12 - c.duration;
          const startMonth = Math.max(3, Math.min(monthIdx, maxStart));
          
          let dynamicName = c.name;
          let dynamicViName = c.viName;
          
          // Determine composite card dynamic titles
          const nextActiveCardsState = { ...activeCards, [courseId]: true };
          if (targetId === 'succession_idp') {
            if (nextActiveCardsState.succession_pipeline && nextActiveCardsState.idp_self_dev) {
              dynamicName = 'Succession Pipeline & IDP';
              dynamicViName = 'Quy hoạch Kế thừa & Bản đồ IDP';
            } else if (nextActiveCardsState.succession_pipeline) {
              dynamicName = 'Succession Pipeline Plan';
              dynamicViName = 'Chương trình Quy hoạch Kế thừa';
            } else if (nextActiveCardsState.idp_self_dev) {
              dynamicName = 'Talent IDP Development';
              dynamicViName = 'Hoạch định IDP & Phát triển';
            }
          }
          
          return { ...c, startMonth, active: true, name: dynamicName, viName: dynamicViName };
        }
        return c;
      });
      try {
        localStorage.setItem('development_plan_millennium_courses', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    
    setToastMessage(
      lang === 'VI' 
        ? 'Đã đặt hoạt động và xếp lịch học trên sơ đồ kéo thả!' 
        : 'Program scheduled and activated on timeline!'
    );
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search core keywords inside proposals
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [proposalSortKey, setProposalSortKey] = useState<'priority' | 'category' | 'focus' | 'program' | 'coverage' | 'action' | 'owner' | 'needs' | null>(null);
  const [proposalSortDir, setProposalSortDir] = useState<'asc' | 'desc' | null>(null);
  const [selectedTrendComp, setSelectedTrendComp] = useState<any | null>(null);

  const handleSetSelectedTrendComp = (val: any) => {
    setSelectedTrendComp(val);
    if (val) {
      window.dispatchEvent(new CustomEvent('onboarding-bento-clicked'));
    } else {
      window.dispatchEvent(new CustomEvent('onboarding-modal-closed'));
    }
  };

  // Trigger auto close on toast notifications
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Reset AI recommendations when selected department changes to remain hidden until clicked
  useEffect(() => {
    setAiRecs(null);
    setAiRecsError(null);
  }, [selectedDept]);

  // Persist edits to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('development_plan_edited_programs', JSON.stringify(editedPrograms));
    } catch (e) {}
  }, [editedPrograms]);

  useEffect(() => {
    try {
      localStorage.setItem('development_plan_confirmed_priorities', JSON.stringify(confirmedPriorities));
    } catch (e) {}
  }, [confirmedPriorities]);

  useEffect(() => {
    try {
      localStorage.setItem('development_plan_timeline', JSON.stringify(actionTimeline));
    } catch (e) {}
  }, [actionTimeline]);

  // Translate category mapping helper
  const translateCategory = (cat: string) => {
    if (lang === 'EN') return cat;
    switch (cat) {
      case 'Leadership': return 'Năng lực Lãnh đạo';
      case 'Soft Skill': return 'Kỹ năng Mềm';
      case 'Digital': return 'Chuyển đổi số';
      case 'People Development': return 'Phát triển Con người';
      case 'Business Acumen': return 'Nhạy bén Kinh doanh';
      case 'Process / Compliance': return 'Quy trình & Tuân thủ';
      case 'Functional': return 'Kỹ năng Chuyên môn';
      default: return cat;
    }
  };

  // Translate skill focuses
  const translateFocusName = (focus: string) => {
    if (lang === 'EN') return focus;
    switch (focus) {
      case 'AI & Automation': return 'Kỹ năng Công nghệ';
      case 'Leadership Skills': return 'Kỹ năng Lãnh đạo';
      case 'Communication Skills': return 'Kỹ năng Giao tiếp';
      case 'Coaching Skills': return 'Kỹ năng Huấn luyện';
      case 'People Development': return 'Phát triển Con người';
      case 'Succession Planning': return 'Hoạch định Kế thừa';
      case 'Business Acumen': return 'Nhạy bén Kinh doanh';
      case 'Process & Compliance': return 'Quy trình & Tuân thủ';
      case 'Workforce Planning': return 'Hoạch định Lực lượng lao động';
      case 'Functional Skills': return 'Kỹ năng Chuyên môn';
      case 'Employee Relations': return 'Quan hệ Lao động';
      case 'Finance / Cost Management': return 'Quản lý Tài chính / Chi phí';
      case 'Talent Acquisition': return 'Thu hút Tài năng';
      case 'Training Capability': return 'Năng lực Đào tạo';
      case 'Change Management': return 'Quản trị Sự thay đổi';
      case 'Strategic Thinking': return 'Tư duy Chiến lược';
      case 'Active Listening': return 'Kỹ năng Lắng nghe Chủ động';
      case 'Digital Literacy': return 'Năng lực Số hóa';
      case 'Artificial Intelligence': return 'Ứng dụng Trí tuệ Nhân tạo AI';
      case 'Performance Coaching': return 'Kèm cặp và Khai vấn Hiệu suất';
      case 'Financial Literacy': return 'Nhạy bén Tài chính Doanh nghiệp';
      case 'Compliance Rules': return 'Tuân thủ Pháp chế & Quy chế';
      default: return focus;
    }
  };

  // Translate department names for tags
  const translateDept = (d: string) => {
    if (d === 'Information System') return 'IT';
    if (d === 'Training') return 'L&D';
    if (d === 'Quality Control') return 'QC';
    if (d === 'Planning & Inventory') return 'PIC';
    if (d === 'Finance & Legal') return 'FINANCE & LEGAL';
    if (d === 'Finance & Accounting') return 'FINING ACCOUNTS'; // Keep standard English
    if (d === 'EHS') return 'EHS';
    if (d === 'Logistics') return 'LOGISTICS';
    if (d === 'Mattress') return 'MATTRESS';
    if (d === 'Engineering') return 'ENGINEERING';
    if (d === 'Plant Engineering') return 'PLANT ENGINEERING';
    if (d === 'Cut&Sew') return 'CUT & SEW';
    if (d === 'Warehouse') return 'WAREHOUSE';
    if (d === 'Customs') return 'CUSTOMS';
    if (d === 'PIC') return 'PIC';
    if (d === 'TAT') return 'TAT';
    if (d === 'Logistic & Service') return 'LOGISTIC & SERVICE';
    // Let's standard mappings if other strings appear
    return d.toUpperCase();
  };

  // Translate action types
  const translateAction = (action: string, isConfirmed = false) => {
    if (isConfirmed) {
      return lang === 'VI' ? 'Đã duyệt vào Kế hoạch' : 'Approved to Plan';
    }
    if (lang === 'EN') return action;
    switch (action) {
      case 'Add to Training Plan': return 'Đưa vào Kế hoạch Đào tạo';
      case 'Department Follow-up':
      case 'Department self-follow-up': 
        return 'Bộ phận tự bồi dưỡng';
      case 'Need Validation':
        return 'Cần xác minh';
      default: return action;
    }
  };

  // Translate default proposal items names and course names
  const translateProgram = (prog: string) => {
    if (lang === 'EN') return prog;
    switch (prog) {
      case 'Executive Mini-MBA program for Directors':
        return 'Chương trình Mini-MBA Đột phá Năng lực Quản trị';
      case 'Digital Leadership for Future Success':
        return 'Chương trình Kỹ năng Lãnh đạo số L&D';
      case 'Intensive Active Listening course':
        return 'Chương trình Lắng nghe Thấu cảm chiều sâu';
      case 'Data Visualization workshop with PowerBI':
        return 'Khóa học Trực quan dữ liệu báo cáo chuyên nghiệp';
      case 'Generative AI Tools & Prompt Engineering Bootcamp':
        return 'Khóa Bootcamp Ứng dụng Trí tuệ Nhân tạo & ChatGPT';
      case 'Performance Coaching framework':
        return 'Phương pháp Kèm cặp & Đánh thức tiềm năng nhân sự';
      case 'Advanced Corporate Finance for Executives':
        return 'Khóa đào tạo Quản trị tài chính doanh nghiệp nâng cao';
      case 'Code of Conduct Compliance workshop':
        return 'Chương trình Huấn luyện Tuân thủ chuẩn mực ứng xử';
      case 'AI for Everyone; Power Automate in Office':
        return 'AI cho Mọi người; Power Automate trong Văn phòng';
      case 'Servant Leadership':
        return 'Lãnh đạo Phục vụ (Servant Leadership)';
      case 'Communication & Presentation':
        return 'Giao tiếp & Thuyết trình Thuyết phục';
      case 'Coaching & Mentoring':
        return 'Kèm cặp & Huấn luyện nhân sự';
      case 'People Development / IDP & Skill Matrix':
        return 'Phát triển nguồn lực / Kế hoạch Thăng tiến & Ma trận kỹ năng';
      case 'Succession Planning & Talent Pipeline Review':
        return 'Hoạch định Kế thừa & Đánh giá Nguồn lực cốt lõi';
      case 'Business Acumen & Decision Making':
        return 'Nhạy bén Kinh doanh & Ra quyết định Hiệu quả';
      case 'Process Improvement / Compliance Follow-up':
        return 'Cải tiến Quy trình / Giám sát và Đánh giá Tuân thủ';
      case 'Workforce / Ramp Planning Follow-up':
        return 'Giám sát điều chỉnh Định biên và Nhân sự dự phòng';
      case 'Function-specific Development Plan':
        return 'Kế hoạch Đào tạo Chuyên sâu theo Chuyên môn bộ phận';
      case 'Employee Relations Follow-up':
        return 'Gắn kết và Giải quyết Quan hệ Lao động nội bộ';
      case 'Finance / Cost Management Follow-up':
        return 'Tối ưu hóa Chi phí và Quản lý Ngân sách bộ phận';
      case 'Talent Acquisition Follow-up':
        return 'Tuyển dụng và Thu hút Nhân tài Chiến dịch';
      case 'Training Capability Follow-up':
        return 'Nâng cao Năng lực Giảng viên Nội bộ';
      default: return prog;
    }
  };

  // Translate action owners
  const translateOwner = (owner: string) => {
    if (lang === 'EN') return owner;
    switch (owner) {
      case 'L&D + IT/Automation SME':
        return 'L&D + Chuyên viên IT/Tự động hóa';
      case 'L&D + HRBP':
        return 'Bộ phận L&D + HRBP';
      case 'HRBP + Department':
        return 'HRBP + Trưởng bộ phận';
      case 'Department / Functional SME':
        return 'Trưởng Phòng / Chuyên gia Chuyên môn';
      case 'HRBP / Department':
        return 'HRBP / Trưởng Phòng ban';
      case 'HRBP / TA':
        return 'HRBP / Bộ phận Tuyển dụng';
      default: return owner;
    }
  };

  const getCategoryBgColor = (cat: string) => {
    const catLower = cat.toLowerCase();
    if (catLower === 'digital') return 'hover:bg-purple-50/50 bg-white';
    if (catLower === 'leadership') return 'hover:bg-blue-50/50 bg-white';
    if (catLower === 'soft skill') return 'hover:bg-pink-50/50 bg-white';
    if (catLower === 'people development') return 'hover:bg-amber-50/50 bg-white';
    if (catLower === 'business acumen') return 'hover:bg-sky-50/50 bg-white';
    return 'hover:bg-slate-50/50 bg-white';
  };

  const getActionBadgeColor = (action: string) => {
    if (action === 'Add to Training Plan') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    return 'bg-amber-100/90 text-amber-900 border-amber-300/80';
  };

  // Select correct training proposals based on site
  const activeProposals = selectedSite === 'WNK' ? dbProposalTrainingWNK : selectedSite === 'ASH' ? dbProposalTrainingASH : dbProposalTraining;

  // Filter lists based on requirements
  const rawFilteredProposals = useMemo(() => {
    return activeProposals.filter((pt) => {
      // 1. Department match
      if (selectedDept && selectedDept.toUpperCase() !== 'ALL' && selectedDept !== 'Tất cả') {
        const matchDept = pt.depts.some(
          (d) => d.toLowerCase().trim() === selectedDept.toLowerCase().trim()
        );
        if (!matchDept) return false;
      }

      // 2. Category selection match
      if (selectedCategory !== 'All') {
        if (pt.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 3. Search query keyword matches
      if (searchQuery.trim() !== '') {
        const needle = searchQuery.toLowerCase();
        const progValue = editedPrograms[pt.priority] ?? pt.program;
        const matchTitle = translateProgram(progValue).toLowerCase().includes(needle);
        const matchFocus = translateFocusName(pt.focus).toLowerCase().includes(needle);
        const matchCat = translateCategory(pt.category).toLowerCase().includes(needle);
        
        if (!matchTitle && !matchFocus && !matchCat) {
          return false;
        }
      }

      return true;
    });
  }, [activeProposals, selectedDept, selectedCategory, searchQuery, editedPrograms, lang]);

  const filteredProposals = useMemo(() => {
    const list = [...rawFilteredProposals];
    if (proposalSortKey && proposalSortDir) {
      const multiplier = proposalSortDir === 'asc' ? 1 : -1;
      return list.sort((a, b) => {
        let valA = a[proposalSortKey];
        let valB = b[proposalSortKey];
        
        if (proposalSortKey === 'program') {
          valA = editedPrograms[a.priority] ?? a.program;
          valB = editedPrograms[b.priority] ?? b.program;
          return translateProgram(valA).localeCompare(translateProgram(valB), lang === 'VI' ? 'vi' : 'en') * multiplier;
        }

        if (proposalSortKey === 'focus') {
          valA = translateFocusName(a.focus);
          valB = translateFocusName(b.focus);
          return valA.localeCompare(valB, lang === 'VI' ? 'vi' : 'en') * multiplier;
        }

        if (proposalSortKey === 'category') {
          valA = translateCategory(a.category);
          valB = translateCategory(b.category);
          return valA.localeCompare(valB, lang === 'VI' ? 'vi' : 'en') * multiplier;
        }
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * multiplier;
        }
        
        if (proposalSortKey === 'coverage') {
          return (parseInt(String(valA)) - parseInt(String(valB))) * multiplier;
        }
        
        return String(valA).localeCompare(String(valB), lang === 'VI' ? 'vi' : 'en') * multiplier;
      });
    }
    return list;
  }, [rawFilteredProposals, proposalSortKey, proposalSortDir, editedPrograms, lang]);

  // Calculate high-impact summary states
  const totalProposed = filteredProposals.length;
  const approvedCount = filteredProposals.filter(p => confirmedPriorities.includes(p.priority)).length;
  const coverageAvg = totalProposed > 0 
    ? Math.round(filteredProposals.reduce((acc, curr) => acc + parseInt(curr.coverage), 0) / totalProposed)
    : 0;

  // Handle adding an action target to approved list
  const handleActionClick = (pt: TrainingProposal) => {
    if (confirmedPriorities.includes(pt.priority)) return;

    setConfirmedPriorities(prev => [...prev, pt.priority]);
    
    // Add to timeline tracking too
    const currentProgramText = editedPrograms[pt.priority] ?? pt.program;
    setActionTimeline(prev => [
      ...prev,
      {
        priority: pt.priority,
        program: currentProgramText,
        quarter: 'Q3/2026',
        status: 'planned'
      }
    ]);

    setToastMessage(lang === 'VI' ? `Đã thêm chương trình '${translateProgram(currentProgramText)}' vào Kế hoạch Đào tạo!` : `Added and synchronized program containing sequence to training plan.`);
  };

  const handleResetPriority = (priorityId: number) => {
    setConfirmedPriorities(prev => prev.filter(id => id !== priorityId));
    setActionTimeline(prev => prev.filter(item => item.priority !== priorityId));
    setToastMessage(lang === 'VI' ? 'Đã thu hồi trạng thái phê duyệt!' : 'Reverted approval status.');
  };

  const handleUpdateStatus = (priority: number, newStatus: 'planned' | 'ongoing' | 'completed') => {
    setActionTimeline(prev => prev.map(item => {
      if (item.priority === priority) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
    setToastMessage(lang === 'VI' ? 'Cập nhật tiến độ thành công!' : 'Updated schedule milestone successfully!');
  };

  // Export current list to CSV file
  const exportProposalsCSV = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'Category,Skill Focus,Needs Count,Coverage,Proposed Training Program,Action Status,Lead Owner\n';
    
    filteredProposals.forEach((pt) => {
      const cat = translateCategory(pt.category).replace(/"/g, '""');
      const focus = translateFocusName(pt.focus).replace(/"/g, '""');
      const prog = translateProgram(editedPrograms[pt.priority] ?? pt.program).replace(/"/g, '""');
      const isConfirmed = confirmedPriorities.includes(pt.priority) ? 'Approved' : 'Suggested';
      const row = `"${cat}","${focus}",${pt.needs},"${pt.coverage}","${prog}","${isConfirmed}","${pt.owner}"\n`;
      csvContent += row;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Corporate_Training_Proposal_Matrix_${selectedDept.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(lang === 'VI' ? 'Xuất tệp CSV thành công!' : 'Exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-705 text-white text-xs font-bold px-4.5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VISUAL ANALYTICS: CAPACITY DEVELOPMENT NEEDS SUMMARY */}
      <div id="onboarding-devplan-visual-analytics" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-slate-850 flex flex-col gap-5">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-650 shrink-0" />
            <span>
              {lang === 'VI' 
                ? `BẢNG TỔNG HỢP NHU CẦU PHÁT TRIỂN NĂNG LỰC — BỘ PHẬN ${selectedDept === 'ALL' ? 'TẤT CẢ BỘ PHẬN' : selectedDept.toUpperCase()}` 
                : `CAPACITY DEVELOPMENT NEEDS SUMMARY — ${selectedDept === 'ALL' ? 'ALL DEPARTMENTS' : selectedDept.toUpperCase()}`}
            </span>
          </h3>
          <p className="text-[11px] md:text-xs text-slate-500 mt-1">
            {lang === 'VI' 
              ? 'Thống kê lượng nhu cầu đào tạo và mức độ thiếu hụt kỹ năng để lập chương trình tối ưu' 
              : 'Distribution of learning demands and core skill development priorities'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* BarChart visual distribution */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-3 block font-mono">
                {lang === 'VI' ? 'Đo lường mức nhu cầu học tập (7 Năng Lực Đầu)' : 'Empirical Demand Metrics (Top 7 Competencies)'}
              </div>
            </div>
            
            <div id="onboarding-devplan-barchart" className="h-[352px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredProposals.filter(pt => pt.priority <= 7)}
                  margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="priority" 
                    tickFormatter={(val) => `H. ${val}`} 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    fontWeight="bold"
                  />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                    labelFormatter={(lbl) => `${lang === 'VI' ? 'Xếp hạng' : 'Priority Rank'}: H.${lbl}`}
                    formatter={(value: any, name: any, props: any) => {
                      const focusName = props.payload.focus;
                      return [`${value} ${lang === 'VI' ? 'Nhu cầu' : 'Needs'}`, `${lang === 'VI' ? 'Kỹ năng' : 'Skill focus'}: ${translateFocusName(focusName)}`];
                    }}
                  />
                  <Bar dataKey="needs" radius={[5, 5, 0, 0]} fill="#4f46e5" barSize={34}>
                    {filteredProposals.filter(pt => pt.priority <= 7).map((entry, index) => {
                      const colorsMap: Record<number, string> = {
                        1: '#f43f5e', // H.1 - Rose Red (AI & Automation)
                        2: '#ec4899', // H.2 - Servant Leadership / Leadership Skills
                        3: '#6366f1', // H.3 - Indigo (Communication Skills)
                        4: '#8b5cf6', // H.4 - Violet (Coaching Skills)
                        5: '#10b981', // H.5 - Emerald (People Development / IDP)
                        6: '#f59e0b', // H.6 - Amber (Succession Planning)
                        7: '#06b6d4'  // H.7 - Blue (Business Acumen)
                      };
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={colorsMap[entry.priority] || '#818cf8'} 
                          className="cursor-pointer hover:opacity-85 transition-all duration-200"
                          onClick={() => {
                            let labelStr = '';
                            let categoryStr = entry.category;
                            if (entry.priority === 1) {
                              labelStr = lang === 'VI' ? '2. Kỹ năng Công nghệ' : '2. AI & Automation';
                              categoryStr = 'Digital';
                            } else if (entry.priority === 2) {
                              labelStr = lang === 'VI' ? '1. Kỹ năng Lãnh đạo' : '1. Leadership Skills';
                              categoryStr = 'Leadership';
                            } else if (entry.priority === 3) {
                              labelStr = lang === 'VI' ? '3. Kỹ năng Giao tiếp' : '3. Communication Skills';
                              categoryStr = 'Soft Skill';
                            } else if (entry.priority === 4) {
                              labelStr = lang === 'VI' ? '4. Kỹ năng Huấn luyện' : '4. Coaching Skills';
                              categoryStr = 'People Development';
                            } else {
                              labelStr = `${entry.priority}. ${translateFocusName(entry.focus)}`;
                            }
                            
                            const mappedItem = {
                              label: labelStr,
                              needs: entry.needs,
                              coverage: entry.coverage,
                              category: categoryStr,
                              info: entry.action,
                              depts: entry.depts || [],
                              icon: entry.priority === 1 ? <Settings className="w-4 h-4" /> : entry.priority === 2 ? <Star className="w-4 h-4" /> : entry.priority === 3 ? <MessageSquare className="w-4 h-4" /> : <Compass className="w-4 h-4" />
                            };
                            handleSetSelectedTrendComp(mappedItem);
                          }}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Core Program Summary Tables */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-3 block font-mono">
                {lang === 'VI' ? '4 Năng lực xu hướng nổi bật & Thông tin phát triển kỹ năng' : '4 Emerging Talent Trends & Key Training Details'}
              </div>
            </div>

            <div id="onboarding-devplan-trend-cards" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 h-full mt-2">
              {(() => {
                // Dynamic trending competencies from activeProposals (top 4 by priority)
                const iconMap: Record<string, any> = {
                  'Leadership': <Star className="w-4 h-4" />,
                  'Digital': <Settings className="w-4 h-4" />,
                  'Soft Skill': <MessageSquare className="w-4 h-4" />,
                  'People Development': <Compass className="w-4 h-4" />,
                  'Business Acumen': <TrendingUp className="w-4 h-4" />,
                  'Functional': <Sliders className="w-4 h-4" />,
                };
                const infoMap: Record<string, { vi: string; en: string }> = {
                  'Leadership Skills': { vi: 'Nâng cao năng lực dẫn dắt hỗ trợ, xây dựng môi trường gắn kết và an toàn tâm lý cho nhân sự.', en: 'Fosters support-based guidance and psychological safety for all staff members.' },
                  'AI & Automation': { vi: 'Tối ưu hóa quy trình văn phòng và tự động hóa báo cáo bằng AI / Copilot hiệu quả.', en: 'Enhances administrative workflows and automates routine tasks with AI tools.' },
                  'Communication Skills': { vi: 'Thuyết phục đa chiều, tăng cường sự đồng thuận liên phòng ban và truyền tải thông điệp sâu sắc.', en: 'Drives seamless presentation skills and key cross-unit corporate alignment.' },
                  'Coaching Skills': { vi: 'Hoàn thiện kỹ năng sư phạm, kèm cặp nhân sự kế thừa và nâng cao chất lượng tự đào tạo.', en: 'Builds solid instructional mentorship to groom future legacy successors.' },
                  'Business Acumen': { vi: 'Phát triển tư duy kinh doanh chiến lược và năng lực ra quyết định hiệu quả.', en: 'Develops strategic business thinking and effective decision-making capabilities.' },
                  'Process & Compliance': { vi: 'Chuẩn hóa quy trình vận hành và đảm bảo tuân thủ các tiêu chuẩn chất lượng.', en: 'Standardizes operational processes and ensures compliance with quality standards.' },
                  'Workforce Planning': { vi: 'Tối ưu hóa kế hoạch nhân lực và đảm bảo nguồn lực phù hợp với nhu cầu sản xuất.', en: 'Optimizes workforce planning and ensures resources align with production needs.' },
                  'Finance / Cost Management': { vi: 'Quản lý chi phí hiệu quả và tối ưu hóa ngân sách bộ phận.', en: 'Manages costs effectively and optimizes departmental budget allocation.' },
                };
                const trendingCompetencies = (activeProposals
                  .filter(pt => pt.action === 'Add to Training Plan').length >= 2
                    ? activeProposals.filter(pt => pt.action === 'Add to Training Plan')
                    : activeProposals
                  ).slice(0, 4)
                  .map((pt, idx) => ({
                    label: lang === 'VI' ? `${idx + 1}. ${translateFocusName(pt.focus)}` : `${idx + 1}. ${pt.focus}`,
                    needs: pt.needs,
                    coverage: pt.coverage,
                    trend: lang === 'VI' ? 'Xu hướng' : 'Trend',
                    category: pt.category,
                    color: pt.category === 'Leadership' ? 'indigo' : pt.category === 'Digital' ? 'amber' : pt.category === 'Soft Skill' ? 'sky' : 'emerald',
                    icon: iconMap[pt.category] || <Compass className="w-4 h-4" />,
                    info: lang === 'VI' ? (infoMap[pt.focus]?.vi || pt.action) : (infoMap[pt.focus]?.en || pt.action),
                    depts: pt.depts,
                    totalNeeds: pt.needs,
                    employees: pt.needs,
                    departments: pt.depts.length,
                    r1: 0, r2: 0,
                    lowReadinessCount: 0, lowReadinessPct: '0%',
                    priorityCount: 0, priorityPct: '0%',
                    actionVi: 'Đưa vào Kế hoạch Đào tạo',
                    actionEn: pt.action,
                  }));

                return trendingCompetencies.map((item, idx) => {
                  // Uniform theme styled with Indigo accents
                  const borderClass = 'hover:border-indigo-400 hover:shadow-xs';
                  const trendTagStyle = 'bg-indigo-50 border-indigo-150 text-indigo-700';
                  const iconStyle = 'bg-slate-50 text-indigo-600 border-slate-200';

                  // Styles for Category tag corresponding to column Category "Danh mục"
                  let catBadgeStyle = "bg-slate-50 text-slate-600 border-slate-200";
                  if (item.category === 'Leadership') {
                    catBadgeStyle = "bg-blue-50 text-blue-700 border-blue-150";
                  } else if (item.category === 'Digital') {
                    catBadgeStyle = "bg-purple-50 text-purple-700 border-purple-150";
                  } else if (item.category === 'Soft Skill') {
                    catBadgeStyle = "bg-pink-50 text-pink-700 border-pink-150";
                  } else if (item.category === 'People Development') {
                    catBadgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-150";
                  }

                  return (
                    <div 
                      key={idx} 
                      id={idx === 0 ? "onboarding-devplan-first-bento" : undefined}
                      onClick={() => handleSetSelectedTrendComp(item)}
                      title={lang === 'VI' ? 'Bấm để xem chi tiết đầy đủ của năng lực này' : 'Click to view full competency details'}
                      className={`bg-white border border-slate-200 rounded-2xl p-4.5 flex flex-col justify-between hover:bg-slate-50/20 active:scale-[0.99] transition-all duration-200 cursor-pointer ${borderClass} interactive-hover-lift hover:shadow-md`}
                    >
                      <div>
                        {/* Header block within card */}
                        <div className="flex items-center justify-between gap-1.5 mb-3 shrink-0">
                          {/* Left: Icon and Category Tag next to each other */}
                          <div className="flex items-center gap-2">
                            <span className={`p-2 rounded-xl border select-none ${iconStyle}`}>
                              {item.icon}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider border select-none ${catBadgeStyle}`}>
                              {translateCategory(item.category)}
                            </span>
                          </div>
                          
                          {/* Right: Small Trend tag matching the table's styling */}
                          <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[8.5px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-1 shadow-xs select-none">
                            <Flame className="w-2.5 h-2.5 shrink-0" />
                            <span>{lang === 'VI' ? 'Xu hướng' : 'Trend'}</span>
                          </span>
                        </div>

                        {/* Title & Description of competency */}
                        <div className="text-sm font-black leading-snug text-indigo-950 mt-2.5 font-sans">
                          {item.label}
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-normal font-sans">
                          {item.info}
                        </p>
                      </div>

                      {/* Displaying detailed metrics: Highlights with larger visual blocks */}
                      <div className="mt-4 pt-3.5 border-t border-dashed border-slate-200/80 grid grid-cols-2 gap-3.5 text-center select-none">
                        <div className="bg-slate-50/70 border border-slate-100/50 rounded-xl py-2 px-1">
                          <span className="block text-[8.5px] uppercase font-bold text-slate-400 tracking-wider">
                            {lang === 'VI' ? 'Đề cập' : 'Demands'}
                          </span>
                          <span className="mt-1 block text-base font-black text-slate-800 leading-none font-sans">
                            {item.needs}
                          </span>
                        </div>
                        <div className="bg-indigo-50/45 border border-indigo-100/30 rounded-xl py-2 px-1">
                          <span className="block text-[8.5px] uppercase font-bold text-indigo-500 tracking-wider">
                            {lang === 'VI' ? 'Độ phủ' : 'Coverage'}
                          </span>
                          <span className="mt-1 block text-base font-black text-indigo-600 leading-none font-sans">
                            {item.coverage}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Header Area */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs text-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-indigo-50 border border-indigo-150 rounded-lg text-indigo-650 shrink-0">
                <Compass className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-base md:text-lg font-black font-sans leading-tight text-slate-900 uppercase tracking-tight">
                {lang === 'VI' ? 'Kế hoạch & Đề xuất Đào tạo Toàn Công ty' : 'Company-wide Suggested Training framework'}
              </h2>
            </div>
            <p className="text-[11px] md:text-xs text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
              {lang === 'VI'
                ? 'Bộ phận L&D tự động tổng xuất ma trận đào tạo từ khoảng trống kỹ năng & khảo sát năng lực các Phòng ban.'
                : 'Interactive action plans compiled directly from departmental skill deficiency assessments.'}
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-[10.5px] font-black text-slate-400 uppercase tracking-widest font-mono">
              {lang === 'VI' ? 'Đang lọc theo:' : 'Active selection:'}
            </span>
            <div className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[11px] rounded-full uppercase tracking-wide font-mono">
              {selectedDept}
            </div>
          </div>
        </div>

        {/* Unified and logically integrated TRSP inputs toggle deck */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 shrink-0" />
            <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-mono">
              {lang === 'VI' ? 'PHÁT TRIỂN KẾ HOẠCH ĐÀO TẠO — KÉO THẢ ĐỂ XẾP LỊCH HOẶC CLICK BẬT / TẮT KHÓA HỌC' : 'CORE RECRUITMENT & TRAINING INPUTS — DRAG TO CALENDAR OR CLICK TO TOGGLE'}
            </h4>
          </div>

          <div id="onboarding-devplan-inputs" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                id: 'ai_automation',
                title: 'AI / Automation Q2-Q3',
                viTitle: 'AI Automation ứng dụng',
                quarter: 'Q2-Q3',
                tag: 'HIGH',
                icon: 'settings'
              },
              {
                id: 'communication',
                title: 'Communication & Presentation Q3',
                viTitle: 'Giao tiếp & Thuyết trình',
                quarter: 'Q3',
                tag: 'HIGH',
                icon: 'message'
              },
              {
                id: 'servant_leadership',
                title: 'Servant Leadership Q3-Q4',
                viTitle: 'Lãnh đạo Phục vụ (Servant)',
                quarter: 'Q3-Q4',
                tag: 'HIGH',
                icon: 'star'
              },
              {
                id: 'train_trainer',
                title: 'Train the Trainer Q4',
                viTitle: 'Giảng viên nội bộ',
                quarter: 'Q4',
                tag: 'HIGH',
                icon: 'compass'
              },
              {
                id: 'succession_pipeline',
                title: 'Succession Pipeline Q4',
                viTitle: 'Quy hoạch Nhân sự kế thừa',
                quarter: 'Q4',
                tag: 'MEDIUM',
                icon: 'puzzle'
              },
              {
                id: 'idp_self_dev',
                title: 'IDP / Self-Dev Q4',
                viTitle: 'Phát triển Kế hoạch IDP',
                quarter: 'Q4',
                tag: 'MEDIUM',
                icon: 'pencil'
              }
            ].map((card) => {
              const isActive = activeCards[card.id];
              
              let inputIcon = <Settings className="w-3.5 h-3.5" />;
              if (card.icon === 'star') inputIcon = <Star className="w-3.5 h-3.5" />;
              else if (card.icon === 'message') inputIcon = <MessageSquare className="w-3.5 h-3.5" />;
              else if (card.icon === 'compass') inputIcon = <Compass className="w-3.5 h-3.5" />;
              else if (card.icon === 'puzzle') inputIcon = <Layers className="w-3.5 h-3.5" />;
              else if (card.icon === 'pencil') inputIcon = <Award className="w-3.5 h-3.5" />;

               const displayTag = card.tag === 'HIGH' 
                 ? (lang === 'VI' ? 'Mức ưu tiên Cao' : 'High Priority') 
                 : card.tag === 'MEDIUM'
                   ? (lang === 'VI' ? 'Mức ưu tiên Trung bình' : 'Medium Priority')
                   : (lang === 'VI' ? 'Mức ưu tiên Thấp' : 'Low Priority');

               let cardBgClass = '';
               let tagColorClass = '';
               let checkBoxClass = '';
               let iconWrapperClass = '';
               
               if (isActive) {
                 if (card.tag === 'HIGH') {
                   cardBgClass = 'bg-white border-2 border-rose-500 duration-200';
                   tagColorClass = 'bg-rose-50 text-rose-800 border-rose-200';
                   checkBoxClass = 'bg-rose-600 border-rose-500 text-white';
                   iconWrapperClass = 'text-rose-700 bg-rose-50 border border-rose-200';
                 } else if (card.tag === 'MEDIUM') {
                   cardBgClass = 'bg-white border-2 border-amber-500 duration-200';
                   tagColorClass = 'bg-amber-50 text-amber-800 border-amber-200';
                   checkBoxClass = 'bg-amber-600 border-amber-500 text-white';
                   iconWrapperClass = 'text-amber-700 bg-amber-50 border border-amber-200';
                 } else { // 'LOW'
                   cardBgClass = 'bg-white border-2 border-indigo-500 duration-200';
                   tagColorClass = 'bg-indigo-50 text-indigo-805 border-indigo-200';
                   checkBoxClass = 'bg-indigo-600 border-indigo-500 text-white';
                   iconWrapperClass = 'text-indigo-700 bg-indigo-50 border border-indigo-200';
                 }
               } else {
                 cardBgClass = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-80';
                 iconWrapperClass = 'text-slate-400 bg-slate-100 border border-slate-200';
                 checkBoxClass = 'bg-transparent border-slate-300 hover:border-slate-500 text-slate-300';
                 tagColorClass = 'bg-slate-100 text-slate-500 border-slate-200';
               }

              const handleCardClick = (e: React.MouseEvent) => {
                const target = e.target as HTMLElement;
                if (target.closest('.checkbox-trigger')) {
                  toggleCard(card.id);
                } else {
                  window.dispatchEvent(new CustomEvent('onboarding-course-clicked'));
                  // Find corresponding course from courses array
                  let courseTarget = card.id;
                  if (card.id === 'succession_pipeline' || card.id === 'idp_self_dev') {
                    courseTarget = 'succession_idp';
                  }
                  const found = courses.find(c => c.id === courseTarget);
                  if (found) {
                    setEditingCourse({ ...found });
                  }
                }
              };

              const linkedCourseId = (card.id === 'succession_pipeline' || card.id === 'idp_self_dev') ? 'succession_idp' : card.id;
              const linkedCourse = courses.find(c => c.id === linkedCourseId);

              const compText = lang === 'VI' ? (
                card.id === 'ai_automation' ? 'Kỹ năng Công nghệ' :
                card.id === 'servant_leadership' ? 'Phát triển Lãnh đạo' :
                card.id === 'communication' ? 'Kỹ năng Mềm' :
                card.id === 'train_trainer' ? 'Phát triển Con người' :
                'Phát triển Tài năng'
              ) : (
                card.id === 'ai_automation' ? 'Technology Skills' :
                card.id === 'servant_leadership' ? 'Leadership Development' :
                card.id === 'communication' ? 'Soft Skills' :
                card.id === 'train_trainer' ? 'People Development' :
                'Talent Management'
              );
              
              const needsVal = linkedCourse?.needs || (card.id === 'ai_automation' ? 44 : card.id === 'servant_leadership' ? 79 : card.id === 'communication' ? 30 : card.id === 'train_trainer' ? 29 : 25);
              const coverageVal = linkedCourse?.coverage || (card.id === 'ai_automation' ? '88%' : card.id === 'servant_leadership' ? '75%' : card.id === 'communication' ? '50%' : card.id === 'train_trainer' ? '63%' : '63%');

              const cardTitle = lang === 'VI' ? (
                card.id === 'ai_automation' ? 'AI/ Tự động hóa trong Văn phòng' :
                card.id === 'communication' ? 'Giao tiếp & Thuyết trình Chuyên nghiệp' :
                card.id === 'servant_leadership' ? 'Lãnh đạo Phục vụ (Servant Leadership)' :
                card.id === 'train_trainer' ? 'Đào tạo Giảng viên Nội bộ' :
                card.id === 'succession_pipeline' ? 'Quy hoạch Nhân sự Kế thừa' :
                card.id === 'idp_self_dev' ? 'Kế hoạch Phát triển Cá nhân (IDP)' :
                card.viTitle
              ) : card.title;

              return (
                <div 
                  key={card.id}
                  id={card.id === 'ai_automation' ? 'onboarding-devplan-ai-card' : undefined}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", card.id);
                    e.dataTransfer.effectAllowed = "move";
                    setDraggingCardId(card.id);
                  }}
                  onDragEnd={() => {
                    setDraggingCardId(null);
                  }}
                  onClick={handleCardClick}
                  className={`border p-4.5 rounded-2xl transition-all duration-200 cursor-pointer select-none relative group flex flex-col justify-between min-h-[175px] h-auto ${cardBgClass} ${
                    draggingCardId === card.id 
                      ? 'opacity-40 border-dashed border-indigo-400' 
                      : 'hover:-translate-y-0.5 hover:shadow-sm duration-200'
                  }`}
                  title={lang === 'VI' ? 'Kéo thả để xếp lịch học, click để xem nội dung chi tiết' : 'Drag to schedule starting month, click to view details'}
                >
                  {/* Top status info row - Category & Action status pill inside right combo */}
                  <div>
                    <div className="flex items-center justify-between mb-2 shrink-0 w-full gap-2">
                      <span className={`p-1.5 rounded-lg border flex items-center justify-center transition-transform select-none ${iconWrapperClass} shrink-0`}>
                        {inputIcon}
                      </span>
                      <span className={`text-[9px] font-bold tracking-tight uppercase border px-2 py-0.5 rounded-md truncate select-none shrink-0 ${isActive ? getCompetencyBadgeClasses(compText) : 'bg-slate-200/50 text-slate-400 border-slate-300/40'}`}>
                        {compText}
                      </span>
                    </div>

                    {/* Middle Core Title Name */}
                    <div className="text-left flex flex-col mt-1">
                      <h5 className={`text-[13.5px] font-extrabold tracking-tight leading-snug line-clamp-2 select-none duration-150 ${isActive ? 'text-slate-900 group-hover:text-indigo-955' : 'text-slate-400'}`}>
                        {cardTitle}
                      </h5>
                    </div>
                  </div>

                  {/* Bottom Stats pod: Double column bento styled block with dashed top border */}
                  <div className="mt-4">
                    <div className="grid grid-cols-2 gap-3 text-center select-none pt-0.5">
                      <div className={`border rounded-xl py-2 px-1 transition-colors duration-200 ${
                        isActive 
                          ? (card.tag === 'HIGH' ? 'bg-rose-50/30 border-rose-100 text-rose-700' : card.tag === 'MEDIUM' ? 'bg-amber-50/30 border-amber-100 text-amber-700' : 'bg-indigo-50/30 border-indigo-100 text-indigo-700')
                          : 'bg-slate-50/50 border-slate-100/50 text-slate-400'
                      }`}>
                        <span className="block text-[8.5px] uppercase font-bold text-slate-400 tracking-wider">
                          {lang === 'VI' ? 'Mức ưu tiên' : 'Priority'}
                        </span>
                        <span className={`mt-0.5 block text-xs font-black leading-none font-sans ${
                          isActive 
                            ? (card.tag === 'HIGH' ? 'text-rose-700 font-extrabold' : card.tag === 'MEDIUM' ? 'text-amber-700 font-extrabold' : 'text-indigo-700 font-extrabold') 
                            : 'text-slate-400'
                        }`}>
                          {lang === 'VI' 
                            ? (card.tag === 'HIGH' ? 'Ưu tiên Cao' : card.tag === 'MEDIUM' ? 'Trung bình' : 'Ưu tiên Thấp') 
                            : (card.tag === 'HIGH' ? 'High' : card.tag === 'MEDIUM' ? 'Medium' : 'Low')}
                        </span>
                      </div>
                      <div className={`border rounded-xl py-2 px-1 transition-colors duration-200 ${
                        isActive 
                          ? (card.tag === 'HIGH' ? 'bg-rose-50/30 border-rose-100 text-rose-700' : card.tag === 'MEDIUM' ? 'bg-amber-50/30 border-amber-100 text-amber-700' : 'bg-indigo-50/30 border-indigo-100 text-indigo-700')
                          : 'bg-slate-50/50 border-slate-100/50 text-slate-400'
                      }`}>
                        <span className={`block text-[8.5px] uppercase font-bold tracking-wider ${
                          isActive ? (card.tag === 'HIGH' ? 'text-rose-600 font-bold' : card.tag === 'MEDIUM' ? 'text-amber-600 font-bold' : 'text-indigo-600 font-bold') : 'text-slate-400'
                        }`}>
                          {lang === 'VI' ? 'Độ phủ' : 'Coverage'}
                        </span>
                        <span className={`mt-0.5 block text-sm font-black leading-none font-sans ${
                          isActive ? (card.tag === 'HIGH' ? 'text-rose-700 font-black' : card.tag === 'MEDIUM' ? 'text-amber-700 font-black' : 'text-indigo-700 font-black') : 'text-slate-400'
                        }`}>
                          {coverageVal}
                        </span>
                      </div>
                    </div>

                    {/* Quarter timing & active tick selection row */}
                    <div className="mt-4 pt-3 border-t border-dashed border-slate-200/60 flex items-center justify-between w-full shrink-0">
                      <div className="flex items-center gap-1.5 select-none font-sans">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-[12px] font-bold text-slate-650 font-sans tracking-tight">
                          {lang === 'VI' ? card.quarter.replace(/Q/g, 'Quý ').replace(/-/g, ' - ') : card.quarter.replace(/-/g, ' - ')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCard(card.id);
                        }}
                        className={`checkbox-trigger w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 duration-150 ${checkBoxClass}`}
                        title={lang === 'VI' ? 'Click bật / tắt khóa học khỏi sơ đồ' : 'Toggle program inclusion'}
                      >
                        {isActive ? (
                          <Check className="w-4 h-4 text-white stroke-[4px]" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-all" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SƠ ĐỒ KẾ HOẠCH ĐÀO TẠO (HTML5 Drag & Drop Workspace) */}
      <div id="onboarding-devplan-chronology" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-slate-850 relative overflow-hidden flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-indigo-50 border border-indigo-150 rounded-lg text-indigo-650">
                <Calendar className="w-5 h-5 animate-pulse" />
              </span>
              <h3 className="text-sm font-black font-sans tracking-tight text-slate-955 flex items-center gap-2 uppercase">
                <span>{lang === 'VI' ? `SƠ ĐỒ TRÌNH TỰ ĐÀO TẠO KÉO THẢ — ${selectedSite === 'MLN' ? 'MILLENNIUM' : selectedSite === 'WNK' ? 'WANEK' : 'ASHTON'} 2026` : `DRAG-AND-DROP TRAINING PLAN CHRONOLOGY — ${selectedSite === 'MLN' ? 'MILLENNIUM' : selectedSite === 'WNK' ? 'WANEK' : 'ASHTON'} 2026`}</span>
                <span className="bg-indigo-650 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider animate-pulse select-none">
                  UPDATED
                </span>
              </h3>
            </div>
            <p className="text-[11px] md:text-xs text-slate-500 mt-1.5 max-w-3xl leading-relaxed">
              {lang === 'VI'
                ? 'Kéo thả các thanh tiến độ để dời tháng bắt đầu, hoặc click các thẻ khoá học ở dưới để ẩn/hiện khoá học tương ứng. Thả các thẻ từ bên dưới lên các tháng trên tiêu đề để xếp lịch nhanh!'
                : 'Drag horizontal bars left/right to schedule starting months, or toggle card checkboxes below to include/exclude specific topics.'}
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem('development_plan_millennium_courses');
                localStorage.removeItem('development_plan_millennium_active_cards');
              } catch (e) {}
              window.location.reload();
            }}
            className="flex items-center gap-1.5 text-[10.5px] font-bold px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-800 active:scale-95 transition-all self-start md:self-center cursor-pointer"
            title="Khôi phục trạng thái sơ đồ mặc định"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'VI' ? 'Đặt lại Sơ đồ' : 'Reset Timeline'}</span>
          </button>
        </div>

        {/* Scrollable scheduler timeline wrapper */}
        <div 
          ref={schedulerScrollContainerRef}
          className="overflow-x-auto min-w-0 max-w-full scrollbar-thin pb-4"
          onDragOver={(e) => {
            // Allow drop
            e.preventDefault();
            
            // Auto scroll logic when dragging a module near the edge of the scroll visible container
            if (schedulerScrollContainerRef.current) {
              const container = schedulerScrollContainerRef.current;
              const rect = container.getBoundingClientRect();
              const mouseX = e.clientX;
              
              const leftEdge = rect.left;
              const rightEdge = rect.right;
              const scrollSpeed = 22; // Pixels to scroll each step
              const edgeThreshold = 140; // Pixels from edge to start scrolling
              
              if (mouseX < leftEdge + edgeThreshold) {
                // Closer to left edge = scroll left
                const intensity = (leftEdge + edgeThreshold - mouseX) / edgeThreshold;
                container.scrollLeft -= Math.ceil(intensity * scrollSpeed);
              } else if (mouseX > rightEdge - edgeThreshold) {
                // Closer to right edge = scroll right
                const intensity = (mouseX - (rightEdge - edgeThreshold)) / edgeThreshold;
                container.scrollLeft += Math.ceil(intensity * scrollSpeed);
              }
            }
          }}
        >
          <div className="min-w-[1140px] flex flex-col gap-4 pr-12 pl-2">
            {/* Calendar Months Drop Headers - April to December */}
            <div className="grid grid-cols-9 gap-2 mt-1 select-none">
              {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, idx) => {
                const isOdd = idx % 2 === 0;
                const actualMonthIndex = idx + 3; // index 3 to 11 (April to December)
                return (
                  <div 
                    key={m}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const courseId = e.dataTransfer.getData("text/plain");
                      if (courseId) {
                        handleMoveCourse(courseId, actualMonthIndex);
                      }
                    }}
                    className={`text-center py-2 rounded-xl border relative group transition-all duration-250 cursor-pointer min-h-[42px] flex flex-col items-center justify-center ${
                      isOdd 
                        ? 'bg-indigo-50/40 border-indigo-100/70 text-indigo-700 shadow-3xs' 
                        : 'bg-slate-50/50 border-slate-150 text-slate-500'
                    }`}
                    title={lang === 'VI' ? `Thả vào đây để xếp lịch sang tháng ${actualMonthIndex + 1}` : `Drop here to schedule starting month to ${m}`}
                  >
                    <span className="text-[12.5px] font-extrabold tracking-tight block">
                      {lang === 'VI' ? `Tháng ${actualMonthIndex + 1}` : m}
                    </span>
                    
                    {/* Active hover drag highlights */}
                    <div className="absolute inset-0.5 bg-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none transition-opacity border border-dashed border-indigo-400" />
                  </div>
                );
              })}
            </div>

            {/* Dynamic Horizontal Rows for each Course */}
            <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4.5 flex flex-col gap-3.5 min-h-[180px] justify-center shadow-inner relative">
              <div className="absolute top-2.5 right-3.5 flex items-center gap-1 opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                  Live Scheduler Active
                </span>
              </div>

              {siteActiveCourses.filter(c => c.active).length === 0 ? (
                <div className="text-center py-10 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <AlertCircle className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-bold font-display">
                    {lang === 'VI' 
                      ? 'Không có khóa học nào được kích hoạt. Hãy bật các hộp bên dưới!' 
                      : 'No active programs. Please toggle program inputs below to populate.'}
                  </p>
                </div>
              ) : (
                siteActiveCourses.filter(c => c.active).map(course => {
                  const startColumnIndex = Math.max(0, course.startMonth - 3) + 1;
                  const colSpan = course.duration;
                  const courseLabel = lang === 'VI' ? course.viName : course.name;

                  let leadIcon = <Settings className="w-4 h-4 shrink-0" />;
                  let themeColor = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-3xs';
                  let leftBorderColor = 'border-l-4 border-l-slate-400';

                  if (course.id === 'servant_leadership') {
                    leadIcon = <Star className="w-4 h-4 shrink-0 text-indigo-505" />;
                    themeColor = 'bg-indigo-50/70 border-indigo-150 text-indigo-955 hover:bg-indigo-100/60 shadow-3xs';
                    leftBorderColor = 'border-l-4 border-l-indigo-500';
                  } else if (course.id === 'communication') {
                    leadIcon = <MessageSquare className="w-4 h-4 shrink-0 text-sky-505" />;
                    themeColor = 'bg-sky-50/70 border-sky-150 text-sky-955 hover:bg-sky-100/60 shadow-3xs';
                    leftBorderColor = 'border-l-4 border-l-sky-500';
                  } else if (course.id === 'succession_idp') {
                    leadIcon = <Flame className="w-4 h-4 shrink-0 text-emerald-505" />;
                    themeColor = 'bg-emerald-50/70 border-emerald-150 text-emerald-955 hover:bg-emerald-100/60 shadow-3xs';
                    leftBorderColor = 'border-l-4 border-l-emerald-500';
                  } else if (course.id === 'train_trainer') {
                    leadIcon = <Compass className="w-4 h-4 shrink-0 text-violet-555" />;
                    themeColor = 'bg-violet-50/70 border-violet-150 text-violet-955 hover:bg-violet-100/60 shadow-3xs';
                    leftBorderColor = 'border-l-4 border-l-violet-500';
                  } else if (course.id === 'ai_automation') {
                    leadIcon = <Settings className="w-4 h-4 shrink-0 text-amber-505" />;
                    themeColor = 'bg-amber-50/70 border-amber-150 text-amber-955 hover:bg-amber-100/60 shadow-3xs';
                    leftBorderColor = 'border-l-4 border-l-amber-500';
                  }

                  return (
                    <div key={course.id} className="grid grid-cols-9 gap-2 items-center relative py-1.5 hover:bg-slate-100/5 rounded-xl transition-all">
                      {/* Underlay columns making every horizontal point drops targeted but completely visual-free */}
                      {Array.from({ length: 9 }).map((_, idx) => (
                        <div 
                          key={idx}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const courseId = e.dataTransfer.getData("text/plain");
                            if (courseId) {
                              const actualMonthIndex = idx + 3; // April-December
                              handleMoveCourse(courseId, actualMonthIndex);
                            }
                          }}
                          className="h-10 transition-colors cursor-pointer bg-transparent border-none"
                          style={{
                            gridColumnStart: idx + 1,
                            gridRowStart: 1,
                          }}
                        />
                      ))}

                      {/* Top floating draggable scheduler bar */}
                      <div 
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", course.id);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        style={{
                          gridColumnStart: startColumnIndex,
                          gridColumnEnd: `span ${colSpan}`,
                          gridRowStart: 1,
                          zIndex: 10
                        }}
                        className={`border border-y border-r text-xs font-bold py-2 px-4 rounded-xl cursor-grab active:cursor-grabbing hover:scale-[1.01] hover:brightness-95 active:scale-98 transition-all duration-200 flex items-center justify-center text-center group select-none shadow-3xs ${leftBorderColor} ${themeColor}`}
                        title={lang === 'VI' ? 'Kéo để dời lịch, Click để tùy biến nội dung' : 'Drag to adjust schedule, Click to edit content'}
                        onClick={() => setEditingCourse(course)}
                      >
                        <div className="flex items-center justify-center gap-2 overflow-hidden mx-auto">
                          <span className="shrink-0">{leadIcon}</span>
                          <span className="font-extrabold truncate select-none text-[12.5px] text-slate-850 tracking-tight">{courseLabel}</span>
                          <Pencil className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 shrink-0" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Main Container Blocks */}
      <div className="hidden lg:hidden">
        
        {/* Left Interactive Side: L&D Training Blueprint Roadmaps progress */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs flex flex-col gap-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-650" />
              <h3 className="text-sm font-bold text-slate-800 font-display">
                {lang === 'VI' ? 'Bản đồ Tiến độ các Dự án Đào tạo' : 'Program Implementation Roadmap'}
              </h3>
            </div>
            <span className="bg-slate-100 border border-slate-200 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full text-slate-600">
              🎯 Q3-Q4/2026
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-normal">
            {lang === 'VI'
              ? 'Theo dõi thời lượng và giai đoạn triển khai của các hạng mục đề xuất đã duyệt.'
              : 'Track active, planned, or completed phases for scheduled programs.'}
          </p>

          <div className="space-y-3.5 flex-1 max-h-[380px] overflow-y-auto pr-1">
            {siteActionTimeline.map((item) => (
              <div 
                key={item.priority}
                className="p-3 bg-slate-50 border border-slate-150 rounded-xl hover:border-slate-300 transition-all text-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2.5">
                  <span className="bg-indigo-100 text-indigo-805 font-bold px-2 py-0.5 rounded font-mono text-[9px] shrink-0">
                    {lang === 'VI' ? 'Hạng ' : '#Rank '}{item.priority}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-450 font-bold font-mono mr-1">{item.quarter}</span>
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.priority, e.target.value as any)}
                      className="text-[10px] font-bold bg-white border border-slate-200 text-slate-650 px-1.5 py-0.5 rounded-md focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="planned">{lang === 'VI' ? 'Lên lịch' : 'Scheduled'}</option>
                      <option value="ongoing">{lang === 'VI' ? 'Đang chạy' : 'In Progress'}</option>
                      <option value="completed">{lang === 'VI' ? 'Kết thúc' : 'Completed'}</option>
                    </select>
                  </div>
                </div>

                <div className="font-bold text-slate-805 line-clamp-2">
                  {translateProgram(editedPrograms[item.priority] ?? item.program)}
                </div>

                {/* Progress bar visual indicator */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.status === 'completed'
                          ? 'bg-emerald-500'
                          : item.status === 'ongoing'
                            ? 'bg-blue-500 animate-pulse'
                            : 'bg-indigo-305'
                      }`}
                      style={{ width: item.status === 'completed' ? '100%' : item.status === 'ongoing' ? '50%' : '15%' }}
                    />
                  </div>
                  <span className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider">
                    {item.status === 'completed' ? '100%' : item.status === 'ongoing' ? '50%' : '15%'}
                  </span>
                </div>
              </div>
            ))}

            {siteActionTimeline.length === 0 && (
              <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 italic text-xs">
                {lang === 'VI' ? 'Chưa duyệt chương trình nào vào lộ trình.' : 'No programs active in current plan.'}
              </div>
            )}
          </div>

          <div className="bg-indigo-50 border border-indigo-105 p-3 rounded-xl flex items-start gap-2.5">
            <Award className="w-4 h-4 text-indigo-650 shrink-0 mt-0.5 animate-bounce" />
            <div className="text-[10.5px] text-indigo-900 leading-normal">
              <strong>{lang === 'VI' ? 'Lưu ý duyệt tự động:' : 'Pro tip!'}</strong> {lang === 'VI' ? 'Các hạng mục được lưu trữ theo bộ đệm trình duyệt, có sẵn cho xuất báo cáo chiến lược.' : 'All edits and approvals are cached locally ready for instant download.'}
            </div>
          </div>
        </div>

        {/* Right Active Analytics Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-2">
                <BarChart className="w-5 h-5 text-indigo-650 shrink-0" />
                <span>{lang === 'VI' ? 'Xếp hạng Mức nhu cầu Đào tạo' : 'Rank Demand Analytics'}</span>
              </h3>
              <p className="text-[10.5px] text-slate-450 mt-0.5">
                {lang === 'VI' ? 'Đo lường số lượng phòng ban yêu cầu kỹ năng cụ thể' : 'Distribution of demand indices across skills'}
              </p>
            </div>
          </div>

          {/* Simple Analytics Chart */}
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredProposals}
                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="priority" 
                  tickFormatter={(val) => `H. ${val}`} 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold"
                />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelFormatter={(lbl) => `${lang === 'VI' ? 'Xếp hạng' : 'Priority Rank'}: ${lbl}`}
                  formatter={(value: any, name: any, props: any) => {
                    const focusName = props.payload.focus;
                    return [`${value} ${lang === 'VI' ? 'Nhu cầu' : 'Needs'}`, `${lang === 'VI' ? 'Kỹ năng' : 'Skill focus'}: ${translateFocusName(focusName)}`];
                  }}
                />
                <Bar dataKey="needs" radius={[4, 4, 0, 0]} fill="#4f46e5">
                  {filteredProposals.map((entry, index) => {
                    const isOne = entry.priority === 1;
                    const isTwo = entry.priority === 2;
                    const isThree = entry.priority === 3;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={isOne ? '#f43f5e' : isTwo ? '#f59e0b' : isThree ? '#2563eb' : '#818cf8'} 
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* dbTrainingSummary - Core Training Program Demand Summary Tables */}
          <div className="border-t border-slate-100 pt-5 mt-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>
                {lang === 'VI' ? `BẢNG TỔNG HỢP NHU CẦU ĐÀO TẠO — BỘ PHẬN ${selectedDept.toUpperCase()}` : `LEARNING NEEDS SUMMARY — ${selectedDept.toUpperCase()} DEPT`}
              </span>
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {(() => {
                const summaryDataRaw = dbTrainingSummary[selectedDept] || dbTrainingSummary["ALL"] || [0, 0, 0, 0, 0];
                return [
                  { label: lang === 'VI' ? 'Lãnh đạo Phục vụ' : 'Servant Leadership', count: summaryDataRaw[0], color: 'indigo', icon: <Star className="w-3.5 h-3.5" /> },
                  { label: lang === 'VI' ? 'AI & Tự động hóa' : 'AI & Automation', count: summaryDataRaw[1], color: 'amber', icon: <Settings className="w-3.5 h-3.5" /> },
                  { label: lang === 'VI' ? 'Giao tiếp & Thuyết trình' : 'Communication Skill', count: summaryDataRaw[2], color: 'sky', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                  { label: lang === 'VI' ? 'Kèm cặp & Khai vấn' : 'Coaching & Mentoring', count: summaryDataRaw[3], color: 'violet', icon: <Compass className="w-3.5 h-3.5" /> },
                  { label: lang === 'VI' ? 'Phát triển IDP' : 'Talent IDP Development', count: summaryDataRaw[4], color: 'emerald', icon: <Award className="w-3.5 h-3.5" /> },
                ].map((item, idx) => {
                  let colorClass = 'bg-linear-to-r from-indigo-500 to-indigo-600';
                  let bgBadge = 'bg-indigo-50 text-indigo-750';
                  if (item.color === 'amber') {
                    colorClass = 'bg-linear-to-r from-amber-500 to-amber-600';
                    bgBadge = 'bg-amber-50 text-amber-700';
                  } else if (item.color === 'sky') {
                    colorClass = 'bg-linear-to-r from-sky-500 to-sky-600';
                    bgBadge = 'bg-sky-50 text-sky-700';
                  } else if (item.color === 'violet') {
                    colorClass = 'bg-linear-to-r from-violet-500 to-violet-600';
                    bgBadge = 'bg-violet-50 text-violet-700';
                  } else if (item.color === 'emerald') {
                    colorClass = 'bg-linear-to-r from-emerald-500 to-emerald-600';
                    bgBadge = 'bg-emerald-50 text-emerald-700';
                  }

                  // Standardized relative scaling based on max width range (All dept max values = 80, others max values = 40)
                  const maxPctVal = selectedDept === 'ALL' ? 80 : 35;
                  const pct = Math.min(100, Math.max(8, (item.count / maxPctVal) * 100));

                  return (
                    <div key={idx} className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex flex-col justify-between hover:border-indigo-300 hover:shadow-2xs transition-all duration-200">
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-slate-400 p-0.5">
                          {item.icon}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[10.5px] font-black ${bgBadge}`}>
                          {item.count} {lang === 'VI' ? 'Lượt' : 'Qty'}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="text-[10.5px] font-black leading-tight text-slate-800 line-clamp-2 h-7.5" title={item.label}>
                          {item.label}
                        </div>
                        <div className="mt-2.5 w-full bg-slate-200 h-1.2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

      </div>

      {/* Primary Section: The Matrix Table showing recommendations */}
      <div id="onboarding-devplan-matrix" className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-550 shrink-0" />
              <span>{lang === 'VI' ? 'MA TRẬN KẾ HOẠCH ĐÀO TẠO ĐỀ XUẤT' : 'PROPOSAL DEVELOPMENT FRAMEWORK MATRIX'}</span>
            </h3>
            <p className="text-xs text-slate-550">
              {lang === 'VI' 
                ? 'Lộ trình đào tạo được lập tự động từ phân tích kỹ năng và nhu cầu kế thừa.' 
                : 'Customizable action map generated from skill matrix coverage reviews.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            {onDeptChange && (
              <SearchableDeptDropdown
                selectedDept={selectedDept}
                onDeptChange={onDeptChange}
                lang={lang}
                allDepartments={siteDepartments}
                widthClass="w-full sm:w-48"
                isTableFilter={true}
              />
            )}
            <button
              onClick={exportProposalsCSV}
              className="flex items-center justify-center gap-1.5 text-xs font-bold px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-250 hover:bg-emerald-100/70 hover:border-emerald-355 active:bg-emerald-200/50 rounded-lg transition-all duration-200 cursor-pointer shadow-3xs"
              title={lang === 'VI' ? 'Xuất danh mục đào tạo đang lọc ra tệp CSV để gửi email quản lý' : 'Export current list to CSV'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'VI' ? 'Xuất CSV' : 'Export CSV'}</span>
            </button>
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-3xs">
              <Medal className="w-3.5 h-3.5 text-indigo-600" /> {filteredProposals.length} {lang === 'VI' ? 'Chương trình Đào tạo Đề xuất' : 'Proposal records matched'}
            </span>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div id="onboarding-devplan-matrix-filters" className="bg-slate-50 border-b border-slate-100 px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3.5 select-none">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-655 uppercase tracking-wide mr-1.5">
              {lang === 'VI' ? 'Danh mục:' : 'Filter category:'}
            </span>
            {[
              { id: 'All', label: lang === 'VI' ? 'Tất cả' : 'All' },
              { id: 'Leadership', label: lang === 'VI' ? 'Năng lực Lãnh đạo' : 'Leadership' },
              { id: 'Soft Skill', label: lang === 'VI' ? 'Kỹ năng Mềm' : 'Soft Skill' },
              { id: 'Digital', label: lang === 'VI' ? 'Chuyển đổi số' : 'Digital' },
              { id: 'People Development', label: lang === 'VI' ? 'Phát triển Con người' : 'People Dev' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-slate-900 border-slate-950 text-white shadow-3xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <input
              type="text"
              placeholder={lang === 'VI' ? 'Tìm nhanh từ khóa chương trình...' : 'Search programs keyword...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-250 rounded-xl px-3 py-1.5 pl-9.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-full shadow-4xs transition-all"
            />
            <span className="absolute left-3.5 top-2.5 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 hover:bg-slate-100 rounded-full text-slate-500 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Table List */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#0f172a] text-slate-100 font-bold sticky top-0 z-10 select-none border-b-2 border-indigo-950 shadow-sm">
              <tr id="onboarding-devplan-matrix-sort-headers" className="text-[10px] font-bold uppercase tracking-wider text-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
                <th 
                  onClick={() => {
                    if (proposalSortKey === 'priority') {
                      setProposalSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setProposalSortKey('priority');
                      setProposalSortDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:bg-indigo-900/50 transition-colors select-none text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{lang === 'VI' ? 'Xếp hạng' : 'Priority'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${proposalSortKey === 'priority' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                  </div>
                </th>
                <th 
                  onClick={() => {
                    if (proposalSortKey === 'category') {
                      setProposalSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setProposalSortKey('category');
                      setProposalSortDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:bg-indigo-900/50 transition-colors select-none"
                  title={lang === 'VI' 
                    ? `Định nghĩa các nhóm Kỹ năng:\n- Lãnh đạo (Leadership): Tối ưu hiệu suất đội ngũ, dẫn dắt đổi mới & đưa ra quyết định chiến lược.\n- Phát triển con người (People Development): Huấn luyện, kèm cặp (Coaching & Mentoring), nâng cao năng lực và quy hoạch đội ngũ kế thừa vững mạnh.\n- Công nghệ (Technology): Ứng dụng AI, chuyển đổi số & tự động hóa quy trình làm việc.`
                    : `Skill Competency Definitions:\n- Leadership: Optimizing team performance, leading innovation & strategic decisions.\n- People Development: Training, coaching & mentoring, competency enhancement & career/succession planning.\n- Technology: Applying AI, digital transform & office workflow automation.`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{lang === 'VI' ? 'Danh mục' : 'Category'}</span>
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-300 hover:text-indigo-100 shrink-0 cursor-help" />
                    <ArrowUpDown className={`w-3.5 h-3.5 ${proposalSortKey === 'category' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                  </div>
                </th>
                <th 
                  onClick={() => {
                    if (proposalSortKey === 'focus') {
                      setProposalSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setProposalSortKey('focus');
                      setProposalSortDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:bg-indigo-900/50 transition-colors select-none"
                  title={lang === 'VI' 
                    ? `Định nghĩa các nhóm Kỹ năng:\n- Lãnh đạo (Leadership): Tối ưu hiệu suất đội ngũ, dẫn dắt đổi mới & đưa ra quyết định chiến lược.\n- Phát triển con người (People Development): Huấn luyện, kèm cặp (Coaching & Mentoring), nâng cao năng lực và quy hoạch đội ngũ kế thừa vững mạnh.\n- Công nghệ (Technology): Ứng dụng AI, chuyển đổi số & tự động hóa quy trình làm việc.`
                    : `Skill Competency Definitions:\n- Leadership: Optimizing team performance, leading innovation & strategic decisions.\n- People Development: Training, coaching & mentoring, competency enhancement & career/succession planning.\n- Technology: Applying AI, digital transform & office workflow automation.`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{lang === 'VI' ? 'Trọng tâm kỹ năng' : 'Skill focus'}</span>
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-300 hover:text-indigo-100 shrink-0 cursor-help" />
                    <ArrowUpDown className={`w-3.5 h-3.5 ${proposalSortKey === 'focus' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                  </div>
                </th>
                <th 
                  onClick={() => {
                    if (proposalSortKey === 'program') {
                      setProposalSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setProposalSortKey('program');
                      setProposalSortDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:bg-indigo-900/50 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{lang === 'VI' ? 'Chương trình đề xuất & Bộ phận tham dự' : 'Proposed Program & Target Depts'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${proposalSortKey === 'program' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                  </div>
                </th>
                <th 
                  onClick={() => {
                    if (proposalSortKey === 'needs') {
                      setProposalSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setProposalSortKey('needs');
                      setProposalSortDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:bg-indigo-900/50 transition-colors select-none text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{lang === 'VI' ? 'Nhu cầu' : 'Demands'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${proposalSortKey === 'needs' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                  </div>
                </th>
                <th 
                  id="onboarding-devplan-matrix-coverage"
                  onClick={() => {
                    if (proposalSortKey === 'coverage') {
                      setProposalSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setProposalSortKey('coverage');
                      setProposalSortDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:bg-indigo-900/50 transition-colors select-none text-center min-w-[145px]"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{lang === 'VI' ? 'Tỉ lệ phủ' : 'Coverage Rate'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${proposalSortKey === 'coverage' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                  </div>
                </th>
                <th 
                  onClick={() => {
                    if (proposalSortKey === 'action') {
                      setProposalSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setProposalSortKey('action');
                      setProposalSortDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:bg-indigo-900/50 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{lang === 'VI' ? 'Phê duyệt' : 'Status Action'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${proposalSortKey === 'action' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                  </div>
                </th>
                <th 
                  onClick={() => {
                    if (proposalSortKey === 'owner') {
                      setProposalSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setProposalSortKey('owner');
                      setProposalSortDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:bg-indigo-900/50 transition-colors select-none text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{lang === 'VI' ? 'Chủ trì' : 'Action Owner'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${proposalSortKey === 'owner' ? 'text-indigo-200' : 'text-slate-400 opacity-65'}`} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredProposals.map((pt, idx) => {
                const isSiteTrend = pt.priority <= 5 && pt.action === 'Add to Training Plan';
                const rowClass = getCategoryBgColor(pt.category);
                
                const isConfirmed = confirmedPriorities.includes(pt.priority);
                const currentActionLabel = translateAction(pt.action, isConfirmed);

                const badgeClass = isConfirmed
                  ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 font-extrabold shadow-sm'
                  : getActionBadgeColor(pt.action);

                return (
                  <tr
                    key={pt.priority}
                    className={`transition-all hover:bg-slate-50/70 border-b border-slate-100 group ${rowClass}`}
                  >
                    {/* PRIORITY COLUMN WITH ENRICHED PREMIUM CIRCULAR BADGES */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center select-none">
                        {(() => {
                          const badgeClasses = {
                            1: "bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 text-white border-yellow-300 shadow-[0_2px_6px_rgba(239,68,68,0.35)] hover:scale-110 active:scale-95 transition-transform cursor-default",
                            2: "bg-gradient-to-br from-indigo-505 via-indigo-600 to-purple-700 text-white border-indigo-400 shadow-[0_2px_6px_rgba(99,102,241,0.35)] hover:scale-110 active:scale-95 transition-transform cursor-default",
                            3: "bg-gradient-to-br from-emerald-400 via-emerald-555 to-teal-650 text-white border-emerald-355 shadow-[0_2px_6px_rgba(16,185,129,0.35)] hover:scale-110 active:scale-95 transition-transform cursor-default",
                            4: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white border-blue-300 shadow-[0_2px_6px_rgba(14,165,233,0.35)] hover:scale-110 active:scale-95 transition-transform cursor-default",
                            5: "bg-gradient-to-br from-pink-500 via-rose-500 to-pink-700 text-white border-pink-300 shadow-[0_2px_6px_rgba(236,72,153,0.35)] hover:scale-110 active:scale-95 transition-transform cursor-default",
                          };
                          
                          const defaultBgClass = "bg-gradient-to-br from-slate-450 to-slate-650 text-white border-slate-350 shadow-3xs hover:scale-110 transition-all cursor-default";
                          const appliedClass = badgeClasses[pt.priority as keyof typeof badgeClasses] || defaultBgClass;
                          
                          let priorityTitle = `${lang === 'VI' ? 'Độ ưu tiên' : 'Priority Rank'} ${pt.priority}`;
                          if (pt.priority === 1) priorityTitle = lang === 'VI' ? 'Độ ưu tiên cao nhất (Top 1)' : 'Highest priority (Top 1)';
                          else if (pt.priority === 2) priorityTitle = lang === 'VI' ? 'Độ ưu tiên cao (Top 2)' : 'High priority (Top 2)';
                          else if (pt.priority === 3) priorityTitle = lang === 'VI' ? 'Độ ưu tiên trung bình (Top 3)' : 'Medium priority (Top 3)';

                          return (
                            <div 
                              title={priorityTitle}
                              className={`w-7 h-7 rounded-full font-mono font-black text-xs flex items-center justify-center border ${appliedClass}`}
                            >
                              {pt.priority}
                            </div>
                          );
                        })()}
                      </div>
                    </td>

                    {/* COMPETENCY CATEGORY SHORT RECTANGLE TAGS */}
                    <td className="px-5 py-4">
                      {(() => {
                        const catLower = pt.category.toLowerCase();
                        let catStyle = "bg-slate-100 text-slate-800 border-slate-200";
                        
                        if (catLower === 'digital' || catLower === 'technology') {
                          catStyle = "bg-purple-100 text-purple-900 border-purple-200";
                        } else if (catLower === 'leadership') {
                          catStyle = "bg-blue-105 text-blue-900 border-blue-200";
                        } else if (catLower === 'soft skill') {
                          catStyle = "bg-pink-100 text-pink-900 border-pink-200";
                        } else if (catLower === 'people development') {
                          catStyle = "bg-amber-100 text-amber-955 border-amber-200";
                        } else if (catLower === 'business acumen') {
                          catStyle = "bg-sky-100 text-sky-955 border-sky-0";
                        } else if (catLower === 'process / compliance') {
                          catStyle = "bg-cyan-100 text-cyan-955 border-cyan-200";
                        }
                        
                        return (
                          <div className="flex flex-col items-start gap-1 justify-start">
                            {isSiteTrend && (
                              <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[8.5px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-1 shadow-xs pulsate-subtle whitespace-nowrap inline-flex w-fit select-none">
                                <Flame className="w-2.5 h-2.5 animate-bounce shrink-0" /> {lang === 'VI' ? 'Xu hướng' : 'Trend'}
                              </span>
                            )}
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded border text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap ${catStyle}`}>
                              {translateCategory(pt.category)}
                            </span>
                          </div>
                        );
                      })()}
                    </td>

                    {/* FOCUS NAME WITHIN A COMPACT SHAPE BADGE PREVENTING WRAPPING ONTO 3 LINES */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start min-w-[170px]">
                        <span 
                          onClick={() => {
                            const mappedItem = {
                              label: `${pt.priority}. ${translateFocusName(pt.focus)}`,
                              needs: pt.needs,
                              coverage: pt.coverage,
                              category: pt.category,
                              info: pt.action,
                              icon: pt.category.toLowerCase() === 'digital' || pt.category.toLowerCase() === 'technology' ? <Settings className="w-4 h-4" /> : <Compass className="w-4 h-4" />
                            };
                            handleSetSelectedTrendComp(mappedItem);
                          }}
                          title={lang === 'VI' ? 'Bấm để xem Giáo lý & Giáo trình năng lực này 🔍' : 'Click to see Syllabus & Curriculum for this competency 🔍'}
                          className="inline-block px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-205 hover:border-indigo-300 text-slate-850 hover:text-indigo-900 font-extrabold text-[11px] sm:text-[11.5px] rounded-lg tracking-tight leading-none shadow-3xs cursor-pointer active:scale-95 hover:scale-[1.02] hover:-translate-y-[1px] transition-all whitespace-nowrap"
                        >
                          🔍 {translateFocusName(pt.focus)}
                        </span>
                      </div>
                    </td>
                    
                    {/* PROPOSED PROGRAM COVERING TARGET DEPARTMENTS INTERNALLY (FANTASTIC PRESENTATION FEATURE!) */}
                    <td className="px-5 py-4 min-w-[325px]">
                      {editingProgramPriorityId === pt.priority ? (
                        <div className="flex items-center gap-2 max-w-[320px]">
                          <input
                             type="text"
                             value={editingProgramValue}
                             onChange={(e) => setEditingProgramValue(e.target.value)}
                             onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                 setEditedPrograms(prev => ({ ...prev, [pt.priority]: editingProgramValue }));
                                 setEditingProgramPriorityId(null);
                                 setToastMessage(lang === 'VI' ? 'Cập nhật chương trình đào tạo thành công!' : 'Program updated successfully!');
                               } else if (e.key === 'Escape') {
                                 setEditingProgramPriorityId(null);
                                }
                             }}
                             className="bg-white border-2 border-indigo-500 rounded-lg px-2.5 py-1 text-xs text-slate-850 font-bold focus:outline-none w-full shadow-inner"
                             autoFocus
                           />
                           <button
                             onClick={() => {
                               setEditedPrograms(prev => ({ ...prev, [pt.priority]: editingProgramValue }));
                               setEditingProgramPriorityId(null);
                               setToastMessage(lang === 'VI' ? 'Cập nhật chương trình đào tạo thành công!' : 'Program updated successfully!');
                             }}
                             className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-black cursor-pointer transition-all shrink-0"
                           >
                             {lang === 'VI' ? 'Lưu' : 'Save'}
                           </button>
                        </div>
                      ) : (() => {
                        const originalProg = editedPrograms[pt.priority] ?? pt.program;
                        const translatedProgText = translateProgram(originalProg);
                        const programItemsList = translatedProgText.split(';').map(p => p.trim()).filter(Boolean);
 
                        return (
                          <div className="flex flex-col gap-2 justify-start items-start w-full">
                            <div className="flex flex-col gap-1.5 w-full select-none group">
                              <div className="space-y-1.5 w-full">
                                {programItemsList.map((progItem, pIdx) => (
                                  <div 
                                    key={pIdx}
                                    id={idx === 0 && pIdx === 0 ? "onboarding-devplan-matrix-program-name" : undefined}
                                    onClick={() => {
                                      const mappedItem = {
                                        label: `${pt.priority}. ${translateFocusName(pt.focus)}`,
                                        needs: pt.needs,
                                        coverage: pt.coverage,
                                        category: pt.category,
                                        info: pt.action,
                                        icon: pt.category.toLowerCase() === 'digital' || pt.category.toLowerCase() === 'technology' ? <Settings className="w-4 h-4" /> : <Compass className="w-4 h-4" />
                                      };
                                      handleSetSelectedTrendComp(mappedItem);
                                      if (idx === 0 && pIdx === 0) {
                                        window.dispatchEvent(new CustomEvent('onboarding-devplan-matrix-program-clicked'));
                                      }
                                    }}
                                    title={lang === 'VI' ? 'Bấm để xem Giáo lý & Giáo trình năng lực này 🔍' : 'Click to see Syllabus & Curriculum for this competency 🔍'}
                                    className="flex items-center justify-between gap-2.5 bg-gradient-to-r from-slate-50 to-indigo-50/10 hover:from-white hover:to-indigo-50/30 px-3 py-2 border border-slate-200/70 hover:border-indigo-400 rounded-xl transition-all shadow-4xs cursor-pointer group/item hover:scale-[1.01] hover:-translate-y-[0.5px]"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-550 shrink-0 shadow-[0_0_2px_rgba(99,102,241,0.5)] animate-pulse" />
                                      <span className="font-extrabold text-slate-900 text-xs sm:text-[12px] leading-snug tracking-tight group-hover/item:text-indigo-805 transition-colors">
                                        {progItem}
                                      </span>
                                    </div>
                                    {pIdx === 0 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingProgramPriorityId(pt.priority);
                                          setEditingProgramValue(originalProg);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-1 bg-white hover:bg-indigo-50 text-slate-550 hover:text-indigo-650 border border-slate-205 hover:border-indigo-200 rounded-md transition-all cursor-pointer shadow-3xs shrink-0"
                                        title={lang === 'VI' ? 'Chỉnh sửa chương trình này' : 'Edit this program'}
                                      >
                                        <Edit3 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </td>

                    {/* MENTION NEEDS AS PASSIVE ELEGANT PILL CONTAINER */}
                    <td className="px-5 py-4 text-center">
                      <span className="bg-indigo-50/50 text-indigo-850 font-black px-3 py-1.5 rounded-full border border-indigo-150/40 font-mono text-[11px] whitespace-nowrap inline-flex items-center gap-1.5 shadow-4xs select-none">
                        📊 <span className="font-extrabold">{pt.needs}</span>
                      </span>
                    </td>

                    {/* COVERAGE COLUMN: INTERACTIVE WITH TOGGLE ON CLICK AND HOVER DIAGONAL ARROW */}
                    <td className="px-5 py-2.5 text-center min-w-[140px]">
                      <button
                        onClick={() => {
                          setExpandedDeptsPriority(prev => 
                            prev.includes(pt.priority) 
                              ? prev.filter(p => p !== pt.priority) 
                              : [...prev, pt.priority]
                          );
                          if (idx === 0) {
                            window.dispatchEvent(new CustomEvent('onboarding-devplan-matrix-depts-clicked'));
                          }
                        }}
                        id={idx === 0 ? "onboarding-devplan-matrix-depts" : undefined}
                        className={`group/cov cursor-pointer p-2.5 rounded-2xl border transition-all duration-200 active:scale-95 inline-flex flex-col items-center gap-1.5 justify-center w-full shadow-4xs ${
                          expandedDeptsPriority.includes(pt.priority)
                            ? 'bg-indigo-100/70 border-indigo-300'
                            : 'bg-slate-50/50 hover:bg-slate-100/70 border-slate-200/50 hover:border-indigo-300'
                        }`}
                        title={lang === 'VI' ? 'Bấm để hiển thị/ẩn các phòng ban yêu cầu' : 'Click to toggle required departments'}
                      >
                        <div className="flex items-center gap-1 font-extrabold text-indigo-950 font-mono text-[11.5px] tracking-tight bg-white px-2 py-0.5 rounded border border-slate-150 shadow-3xs group-hover/cov:bg-indigo-50 group-hover/cov:text-indigo-900 transition-colors">
                          <span>{pt.coverage}</span>
                          <span className="text-[10px] text-indigo-500 opacity-50 group-hover/cov:opacity-100 group-hover/cov:translate-x-0.5 group-hover/cov:-translate-y-0.5 transition-all duration-200 shrink-0 select-none">
                            ↗
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-205/60 shadow-inner relative">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              parseInt(pt.coverage) >= 75
                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.3)]'
                                : parseInt(pt.coverage) >= 40
                                  ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                  : 'bg-gradient-to-r from-rose-400 to-rose-500'
                            }`}
                            style={{ width: pt.coverage }}
                          />
                        </div>
                      </button>

                      {/* Target Departments, displayed flat under the Coverage button */}
                      {expandedDeptsPriority.includes(pt.priority) && (
                        <div 
                          id={idx === 0 ? "onboarding-devplan-expanded-depts" : undefined}
                          className="w-full pt-1.5 mt-1.5 border-t border-dashed border-slate-200/60 flex flex-col items-center animate-in fade-in duration-200 zoom-in-95"
                        >
                          <div className="text-[8.5px] uppercase font-black text-indigo-600 mb-1 tracking-wider text-center">
                            {lang === 'VI' ? 'Phòng ban yêu cầu:' : 'Required Departments:'}
                          </div>
                          <div className="flex flex-wrap gap-1 justify-center max-w-[130px]">
                            {pt.depts && pt.depts.map((d, dIdx) => (
                              <span 
                                key={dIdx}
                                className="inline-block text-[9.5px] font-bold text-indigo-850 bg-indigo-50 border border-indigo-150/50 hover:bg-indigo-100 hover:text-indigo-900 rounded-lg px-2 py-0.5 tracking-tight transition-all shrink-0 select-none shadow-4xs uppercase"
                              >
                                {translateDept(d)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* PHÊN DUYỆT (STATUS ACTION) WITH INTERACTIVE CORNER CASES */}
                    <td className="px-5 py-4">
                      {isConfirmed ? (
                        <div id={idx === 0 ? "onboarding-devplan-matrix-approval" : undefined} className="flex items-center gap-1.5 select-none text-[#ffffff]">
                          <span className={`text-[10px] px-3 py-1 rounded-full font-black border uppercase tracking-wider whitespace-nowrap inline-flex items-center gap-1 transition-all duration-200 ${badgeClass}`}>
                            <Check className="w-3 h-3 text-white stroke-[3.5]" />
                            {currentActionLabel}
                          </span>
                          {isLdMode && (
                            <button
                              onClick={() => handleResetPriority(pt.priority)}
                              title={lang === 'VI' ? 'Hủy bỏ phê duyệt & Thiết lập lại' : 'Reset status'}
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 bg-white hover:rotate-180 transition-all duration-300 shadow-3xs cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        isLdMode ? (
                          <button
                            onClick={() => handleActionClick(pt)}
                            id={idx === 0 ? "onboarding-devplan-matrix-approval" : undefined}
                            className={`text-[10.5px] px-3 py-1.5 rounded-full font-black text-xs border uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all hover:scale-[1.04] hover:shadow-xs active:scale-95 shadow-3xs ${badgeClass} inline-flex items-center gap-1`}
                          >
                            <PlusCircle className="w-3 h-3 shrink-0" />
                            {currentActionLabel}
                          </button>
                        ) : (
                          <span className="text-[10px] px-3 py-1 rounded-full font-black border uppercase tracking-wider whitespace-nowrap inline-flex items-center gap-1 bg-slate-50/85 border-slate-200 text-slate-450 select-none">
                            {lang === 'VI' ? 'Đề xuất L&D' : 'L&D Suggested'}
                          </span>
                        )
                      )}
                    </td>

                    {/* ACTION OWNER */}
                    <td className="px-5 py-4 text-right font-mono text-[10px] text-slate-600 font-bold whitespace-nowrap select-none">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-105 border border-slate-205 rounded hover:bg-indigo-50 hover:text-indigo-900 transition-colors">
                        👥 {translateOwner(pt.owner)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredProposals.length === 0 && (
                <tr className="bg-slate-50 text-center">
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-slate-400 italic text-xs"
                  >
                    {lang === 'VI' ? 'Không có đề xuất bồi dưỡng chuyên dụng phù hợp bộ lọc.' : 'No filtered training recommendations match this selection.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Program Course Customization Modal Form */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div id="onboarding-devplan-course-modal" className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <span className="font-sans font-black text-[10.5px] uppercase tracking-wider font-mono">
                  {lang === 'VI' ? 'TÙY BIẾN CHƯƠNG TRÌNH ĐÀO TẠO' : 'CUSTOMIZE TRAINING PROGRAM'}
                </span>
              </div>
              <button
                onClick={() => {
                  setEditingCourse(null);
                  window.dispatchEvent(new CustomEvent('onboarding-modal-closed'));
                }}
                id="onboarding-devplan-course-modal-close-btn"
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fields Form */}
            <div className="p-5.5 space-y-4 text-left overflow-y-auto max-h-[420px]">
              {/* Conditionally render info fields based on active language */}
              <div className="space-y-3.5">
                {lang === 'VI' ? (
                  <>
                    <div>
                      <label className="block text-[9.5px] uppercase font-black text-slate-500 tracking-wider mb-1">
                        Tên Tiếng Việt
                      </label>
                      <input
                        type="text"
                        value={editingCourse.viName || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, viName: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] uppercase font-black text-slate-500 tracking-wider mb-1">
                        Năng Lực (Tiếng Việt)
                      </label>
                      <input
                        type="text"
                        value={editingCourse.viCompetency || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, viCompetency: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-bold text-slate-800"
                        placeholder="Ví dụ: Kỹ năng Số & Công nghệ"
                      />
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[9.5px] uppercase font-black text-slate-500 tracking-wider mb-1">
                        English Name
                      </label>
                      <input
                        type="text"
                        value={editingCourse.name || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] uppercase font-black text-slate-500 tracking-wider mb-1">
                        Vietnamese Name
                      </label>
                      <input
                        type="text"
                        value={editingCourse.viName || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, viName: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] uppercase font-black text-slate-500 tracking-wider mb-1">
                        Competency (EN)
                      </label>
                      <input
                        type="text"
                        value={editingCourse.competency || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, competency: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] uppercase font-black text-slate-500 tracking-wider mb-1">
                        Competency (VN)
                      </label>
                      <input
                        type="text"
                        value={editingCourse.viCompetency || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, viCompetency: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-bold text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Read-only needs count and coverage stats */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[9.5px] uppercase font-black text-slate-400 tracking-wider mb-1">
                    {lang === 'VI' ? 'Lượt nhu cầu (Từ dữ liệu)' : 'Needs Count (Data-driven)'}
                  </label>
                  <div className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-500 select-none cursor-not-allowed">
                    {editingCourse.needs || 0}
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] uppercase font-black text-slate-400 tracking-wider mb-1">
                    {lang === 'VI' ? 'Độ phủ (%) (Từ dữ liệu)' : 'Coverage (%) (Data-driven)'}
                  </label>
                  <div className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-500 select-none cursor-not-allowed">
                    {editingCourse.coverage || '0%'}
                  </div>
                </div>
              </div>
              {/* Deployment Time from Month to Month starting from April to December */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[9.5px] uppercase font-black text-slate-500 tracking-wider mb-1">
                    {lang === 'VI' ? 'Từ Tháng' : 'From Month'}
                  </label>
                  <select
                    value={Math.max(3, editingCourse.startMonth)}
                    onChange={(e) => {
                      const newStart = parseInt(e.target.value);
                      const currentEnd = editingCourse.startMonth + editingCourse.duration - 1;
                      const endMonthVal = Math.max(newStart, currentEnd);
                      setEditingCourse({
                        ...editingCourse,
                        startMonth: newStart,
                        duration: endMonthVal - newStart + 1
                      });
                    }}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-black text-slate-800 cursor-pointer"
                  >
                    {[
                      { val: 3, label: lang === 'VI' ? 'Tháng 4 (Apr)' : 'April (Apr)' },
                      { val: 4, label: lang === 'VI' ? 'Tháng 5 (May)' : 'May (May)' },
                      { val: 5, label: lang === 'VI' ? 'Tháng 6 (Jun)' : 'June (Jun)' },
                      { val: 6, label: lang === 'VI' ? 'Tháng 7 (Jul)' : 'July (Jul)' },
                      { val: 7, label: lang === 'VI' ? 'Tháng 8 (Aug)' : 'August (Aug)' },
                      { val: 8, label: lang === 'VI' ? 'Tháng 9 (Sep)' : 'September (Sep)' },
                      { val: 9, label: lang === 'VI' ? 'Tháng 10 (Oct)' : 'October (Oct)' },
                      { val: 10, label: lang === 'VI' ? 'Tháng 11 (Nov)' : 'November (Nov)' },
                      { val: 11, label: lang === 'VI' ? 'Tháng 12 (Dec)' : 'December (Dec)' },
                    ].map((m) => (
                      <option key={m.val} value={m.val}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9.5px] uppercase font-black text-slate-500 tracking-wider mb-1">
                    {lang === 'VI' ? 'Đến Tháng' : 'To Month'}
                  </label>
                  <select
                    value={Math.min(11, Math.max(editingCourse.startMonth, editingCourse.startMonth + editingCourse.duration - 1))}
                    onChange={(e) => {
                      const newEnd = parseInt(e.target.value);
                      setEditingCourse({
                        ...editingCourse,
                        duration: Math.max(1, newEnd - editingCourse.startMonth + 1)
                      });
                    }}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-black text-slate-800 cursor-pointer"
                  >
                    {[
                      { val: 3, label: lang === 'VI' ? 'Tháng 4 (Apr)' : 'April (Apr)' },
                      { val: 4, label: lang === 'VI' ? 'Tháng 5 (May)' : 'May (May)' },
                      { val: 5, label: lang === 'VI' ? 'Tháng 6 (Jun)' : 'June (Jun)' },
                      { val: 6, label: lang === 'VI' ? 'Tháng 7 (Jul)' : 'July (Jul)' },
                      { val: 7, label: lang === 'VI' ? 'Tháng 8 (Aug)' : 'August (Aug)' },
                      { val: 8, label: lang === 'VI' ? 'Tháng 9 (Sep)' : 'September (Sep)' },
                      { val: 9, label: lang === 'VI' ? 'Tháng 10 (Oct)' : 'October (Oct)' },
                      { val: 10, label: lang === 'VI' ? 'Tháng 11 (Nov)' : 'November (Nov)' },
                      { val: 11, label: lang === 'VI' ? 'Tháng 12 (Dec)' : 'December (Dec)' },
                    ]
                      .filter((m) => m.val >= editingCourse.startMonth)
                      .map((m) => (
                        <option key={m.val} value={m.val}>{m.label}</option>
                      ))}
                  </select>
                </div>
              </div>

              {/* AI Syllabus Generator Compartment */}
              <div className="border-t border-slate-150 my-4.5" />

              <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-xl p-4.5 border border-indigo-100 flex flex-col gap-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-600 animate-pulse shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-850 font-sans">
                      {lang === 'VI' ? 'THIẾT KẾ GIÁO TRÌNH BẰNG AI' : 'AI CURRICULUM SYLLABUS DESIGNER'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-md text-[8px] font-black text-amber-700 font-sans uppercase tracking-wider select-none shrink-0">
                      ⚠️ {lang === 'VI' ? 'Đề xuất AI' : 'AI-Assisted'}
                    </span>
                  </div>
                  {editingCourse.syllabus && !isLoadingSyllabus && (
                    <button
                      type="button"
                      onClick={() => fetchSyllabus(editingCourse)}
                      className="text-[9.5px] bg-indigo-100 text-indigo-700 font-extrabold px-2.5 py-1 rounded-md hover:bg-indigo-300 transition-colors flex items-center gap-1 cursor-pointer select-none"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {lang === 'VI' ? 'Tạo lại' : 'Regenerate'}
                    </button>
                  )}
                </div>

                {isLoadingSyllabus ? (
                  <div className="py-6 flex flex-col items-center justify-center space-y-2">
                    <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                    <span className="text-[10.5px] text-slate-500 font-bold animate-pulse">
                      {lang === 'VI' 
                        ? 'Đang kết nối AI thiết lập đề cương và nội dung chi tiết...' 
                        : 'Contacting AI L&D engine for targeted training modules...'}
                    </span>
                  </div>
                ) : syllabusError ? (
                  <div className="p-3.5 bg-red-50 border border-red-150 rounded-lg text-xs text-red-750 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold">{lang === 'VI' ? 'Không thể thiết kế Giáo trình' : 'Unable to design syllabus'}</p>
                      <p className="opacity-90 leading-tight mt-1">{syllabusError}</p>
                    </div>
                  </div>
                ) : editingCourse.syllabus ? (
                  <div className="space-y-3">
                    <div className="bg-white/85 border border-indigo-100/60 rounded-xl p-3.5 text-xs text-slate-750 leading-relaxed font-sans max-h-[260px] overflow-y-auto select-text shadow-3xs">
                      {renderCustomMarkdown(editingCourse.syllabus)}
                    </div>
                    {/* AI Syllabus teaching advisory disclaimer */}
                    <div id="ai-disclaimer-syllabus" className="mt-2 flex items-start gap-2 p-2.5 bg-rose-50/70 border border-rose-200/60 rounded-xl text-[10px] sm:text-[11px] leading-relaxed text-rose-800 shadow-3xs select-none">
                      <BellRing className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
                      <div>
                        <span className="font-extrabold uppercase tracking-wider text-rose-900 mr-1.5 inline-block text-[9.5px] sm:text-[10.5px]">
                          {lang === 'VI' ? '⚠️ ĐỀ XUẤT HỖ TRỢ TỪ AI:' : '⚠️ AI-DRIVEN ASSISTANT SUGGESTION:'}
                        </span>
                        {lang === 'VI'
                          ? 'Đề cương giáo cụ này được soạn thảo tự động bởi AI nhằm mục đích tham khảo. Các quyết định cuối cùng thuộc về các Bộ phận Chức năng/ Chuyên môn hoặc Trưởng bộ phận.'
                          : 'This curriculum blueprint is drafted automatically by AI for reference. Final decisions belong to the Functional/Specialized Departments or Department Heads.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4.5 flex flex-col items-center justify-center text-center space-y-3 bg-white/50 border border-dashed border-slate-205 rounded-xl">
                    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 shadow-3xs">
                      <Sparkles className="w-5.5 h-5.5 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h6 className="text-[11.5px] font-black text-slate-800">
                        {lang === 'VI' ? 'Khởi tạo Đề cương AI' : 'Draft Detailed Syllabus with AI'}
                      </h6>
                      <p className="text-[10.5px] text-slate-500 max-w-sm px-4 leading-relaxed">
                        {lang === 'VI'
                          ? 'Dựa trên nhu cầu đào tạo và mục tiêu năng lực để tự động soạn thảo giáo trình giảng dạy chi tiết.'
                          : 'Draw from target goals and competencies to formulate a week-by-week curriculum blueprint.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchSyllabus(editingCourse)}
                      className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-[10.5px] font-black rounded-lg shadow-sm transition-all active:scale-98 cursor-pointer select-none"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {lang === 'VI' ? 'Bắt Đầu Tạo Giáo Trình' : 'Formulate Course Syllabus'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-slate-50 px-5.5 py-4.5 border-t border-slate-150 flex justify-between items-center gap-2 shrink-0">
              {!isLdMode ? (
                <>
                  <span className="text-[10px] text-slate-550 font-bold bg-slate-200/50 px-2.5 py-1.5 rounded-lg border border-slate-300">
                    🔒 {lang === 'VI' ? 'Chế độ xem phân tích (Chỉ L&D Admin mới được quyền sửa)' : 'Read-only mode (L&D Admin access required for edits)'}
                  </span>
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      window.dispatchEvent(new CustomEvent('onboarding-modal-closed'));
                    }}
                    className="px-4.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-[10.5px] font-black rounded-lg cursor-pointer transition-all"
                  >
                    {lang === 'VI' ? 'ĐÓNG' : 'CLOSE'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      window.dispatchEvent(new CustomEvent('onboarding-modal-closed'));
                    }}
                    className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10.5px] font-extrabold rounded-lg cursor-pointer transition-all ml-auto"
                  >
                    {lang === 'VI' ? 'HỦY BỎ' : 'CANCEL'}
                  </button>
                  <button
                    onClick={() => {
                      setCourses(prev => {
                        const nextCourses = prev.map(c => c.id === editingCourse.id ? editingCourse : c);
                        try {
                          localStorage.setItem('development_plan_millennium_courses', JSON.stringify(nextCourses));
                        } catch (e) {}
                        return nextCourses;
                      });
                      setEditingCourse(null);
                      window.dispatchEvent(new CustomEvent('onboarding-modal-closed'));
                    }}
                    className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10.5px] font-black rounded-lg cursor-pointer transition-all shadow-3xs"
                  >
                    {lang === 'VI' ? 'CẬP NHẬT' : 'SAVE CHANGES'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Competency Details Dialog Modal */}
      {selectedTrendComp && (() => {
        const key = selectedTrendComp.label;
        const rawLabel = selectedTrendComp.label;
        // For WNK/ASH: build details dynamically from activeProposals
        const matchedProposal = activeProposals.find(pt => {
          const focusLabel = lang === 'VI' ? translateFocusName(pt.focus) : pt.focus;
          return rawLabel.includes(focusLabel) || rawLabel.includes(pt.focus) || (selectedTrendComp.depts && selectedTrendComp.depts === pt.depts);
        });
        const dynamicDetails = matchedProposal ? {
          mappedNeedVi: translateFocusName(matchedProposal.focus),
          mappedNeedEn: matchedProposal.focus,
          totalNeeds: matchedProposal.needs,
          employees: matchedProposal.needs,
          departments: matchedProposal.depts.length,
          r1: 0,
          r2: 0,
          lowReadinessCount: 0,
          lowReadinessPct: '0%',
          priorityCount: 0,
          priorityPct: '0%',
          actionVi: 'Đưa vào Kế hoạch Đào tạo',
          actionEn: matchedProposal.action,
          depts: matchedProposal.depts,
        } : null;
        // Use selectedTrendComp.depts if available (from dynamic trendingCompetencies)
        const trendDepts = selectedTrendComp.depts || [];
        const details: any = COMP_DETAILS[rawLabel] || COMP_DETAILS[rawLabel.replace(/^\d+\.\s*/, '')] || dynamicDetails || {
          mappedNeedVi: selectedTrendComp.info,
          mappedNeedEn: selectedTrendComp.info,
          totalNeeds: selectedTrendComp.needs,
          employees: selectedTrendComp.needs || 10,
          departments: trendDepts.length || 5,
          r1: 0,
          r2: 0,
          lowReadinessCount: 0,
          lowReadinessPct: '0%',
          priorityCount: 0,
          priorityPct: '0%',
          actionVi: 'Đưa vào Kế hoạch Đào tạo',
          actionEn: 'Add to Training Plan',
          depts: trendDepts
        };
        // Override depts with trendDepts if COMP_DETAILS has empty depts
        if (details.depts && details.depts.length === 0 && trendDepts.length > 0) {
          details.depts = trendDepts;
        }

        const isVi = lang === 'VI';

        return (
          <div 
            onClick={() => handleSetSelectedTrendComp(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-100"
          >
            <div 
              id="onboarding-devplan-competency-details-modal"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl border border-slate-200 max-w-xl md:max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="bg-slate-900 text-white px-5 py-4.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-slate-800 rounded-lg text-indigo-400 shrink-0">
                    {selectedTrendComp.icon || <Compass className="w-5 h-5" />}
                  </span>
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-widest text-indigo-300 block font-mono">
                      {isVi ? 'THÔNG TIN CHI TIẾT NĂNG LỰC' : 'COMPETENCY DETAIL METRICS'}
                    </span>
                    <h3 className="font-sans font-black text-xs md:text-[14.5px] text-white leading-normal mt-0.5">
                      {rawLabel}
                    </h3>
                  </div>
                </div>
                <button
                  id="onboarding-devplan-competency-details-close-btn"
                  onClick={() => handleSetSelectedTrendComp(null)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isVi ? 'Đóng' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body (Scrollable) */}
              <div className="p-5 md:p-6 space-y-5 overflow-y-auto text-left text-slate-800 font-sans leading-relaxed text-xs">
                
                {/* Visual Metadata Highlight Category & Suggested Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono">
                      {isVi ? 'Danh mục đào tạo' : 'Training Category'}
                    </span>
                    <p className="mt-1 font-extrabold text-[#312e81] text-[11.5px] uppercase tracking-wide">
                      {translateCategory(selectedTrendComp.category)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono">
                      {isVi ? 'Đề xuất đề án đào tạo' : 'Proposed L&D Action'}
                    </span>
                    <p className="mt-1 flex items-center">
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 font-black text-[9.5px] rounded-md uppercase tracking-wider">
                        {isVi ? details.actionVi : details.actionEn}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Info Text detail summary */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono">
                    {isVi ? 'Yêu cầu bồi dưỡng & Phổ cập năng lực' : 'Core Requirement & Scope'}
                  </span>
                  <p className="text-slate-650 leading-relaxed font-sans text-[11px] bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">
                    {selectedTrendComp.info}
                  </p>
                </div>

                {/* Bento Grid layout stats */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black text-indigo-900 tracking-widest font-mono mb-1.5 block">
                    {isVi ? 'Các Chỉ Số Thống Kê Chi Tiết' : 'Specific Diagnostic Metrics'}
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Stat Item 1: Demand */}
                    <div className="border border-slate-200/80 bg-white rounded-xl p-3 shadow-3xs hover:border-indigo-300 transition-colors">
                      <span className="block text-[8.5px] uppercase font-extrabold text-slate-400 font-mono tracking-wider">
                        {isVi ? 'Tổng Nhu Cầu' : 'Total Demands'}
                      </span>
                      <span className="block mt-1 text-base font-black text-slate-900 leading-none font-sans">
                        {details.totalNeeds} <span className="text-[10px] font-bold text-slate-400 font-sans uppercase">Needs</span>
                      </span>
                    </div>

                    {/* Stat Item 2: Employees */}
                    <div className="border border-slate-200/80 bg-white rounded-xl p-3 shadow-3xs flex flex-col justify-center">
                      <span className="block text-[8.5px] uppercase font-extrabold text-slate-400 font-mono tracking-wider">
                        {isVi ? 'Tổng Số Nhân Sự' : 'Employees Affected'}
                      </span>
                      <span className="block mt-1 text-base font-black text-slate-900 leading-none font-sans">
                        {details.employees} <span className="text-[10px] font-bold text-slate-400 font-sans uppercase">Staffs</span>
                      </span>
                    </div>

                    {/* Stat Item 3: Count of Departments */}
                    <div className="border border-slate-200/80 bg-white rounded-xl p-3 shadow-3xs flex flex-col justify-center">
                      <span className="block text-[8.5px] uppercase font-extrabold text-slate-400 font-mono tracking-wider">
                        {isVi ? 'Khối Phòng Ban' : 'Departments Count'}
                      </span>
                      <span className="block mt-1 text-base font-black text-slate-900 leading-none font-sans">
                        {details.departments} <span className="text-[10.5px] font-bold text-indigo-500 font-sans uppercase">/{allDepartments.length - 1}</span>
                      </span>
                    </div>

                    {/* Stat Item 4: Low Readiness */}
                    <div className="border border-rose-100 bg-rose-50/20 rounded-xl p-3 shadow-3xs">
                      <span className="block text-[8.5px] uppercase font-extrabold text-rose-500 font-mono tracking-wider">
                        {isVi ? 'Sẵn Sàng Thấp' : 'Low Readiness %'}
                      </span>
                      <span className="block mt-1 text-base font-black text-rose-700 leading-none font-sans">
                        {details.lowReadinessCount} <span className="text-[10px] font-bold text-rose-450 font-sans">({details.lowReadinessPct})</span>
                      </span>
                    </div>

                    {/* Stat Item 5: Priorities */}
                    <div className="border border-indigo-100 bg-indigo-50/25 rounded-xl p-3 shadow-3xs">
                      <span className="block text-[8.5px] uppercase font-extrabold text-indigo-500 font-mono tracking-wider">
                        {isVi ? 'Lượt Lập Kế Hoạch' : 'Priority Targets'}
                      </span>
                      <span className="block mt-1 text-base font-black text-indigo-700 leading-none font-sans">
                        {details.priorityCount} <span className="text-[10px] font-bold text-indigo-400 font-sans">({details.priorityPct})</span>
                      </span>
                    </div>

                    {/* Stat Item 6: R1 / R2 assessment */}
                    <div className="border border-slate-200/80 bg-white rounded-xl p-3 shadow-3xs flex flex-col justify-center">
                      <span className="block text-[8.5px] uppercase font-extrabold text-slate-400 font-mono tracking-wider">
                        {isVi ? 'Chỉ Số R1 - R2' : 'Risk R1 / R2'}
                      </span>
                      <div className="mt-1 flex gap-2.5 text-[10.5px] font-extrabold text-slate-700">
                        <span>R1: <b className="text-rose-500">{details.r1}</b></span>
                        <span>R2: <b className="text-amber-500">{details.r2}</b></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub row tables if AI & Automation */}
                {details.subNeeds && details.subNeeds.length > 0 && (
                  <div className="border border-indigo-100 bg-indigo-50/15 rounded-xl p-4 space-y-3.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-indigo-100/60">
                      <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-black text-indigo-950 font-sans tracking-wide uppercase text-[10px] font-mono">
                        {isVi ? 'PHÂN TÍCH NHU CẦU TIỂU TIÊU ĐIỂM (SUB-CATEGORIES BREAKDOWN)' : 'DETAILED SUB-COMPETENCY BREAKDOWN'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {details.subNeeds.map((sub, subIdx) => (
                        <div key={subIdx} className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-3xs">
                          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 mb-2.5">
                            <span className="font-extrabold text-indigo-950">
                              {subIdx + 1}. {isVi ? sub.mappedNeedVi : sub.mappedNeedEn}
                            </span>
                            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9.5px] font-black rounded-md font-mono shrink-0">
                              {sub.totalNeeds} {isVi ? 'Yêu cầu' : 'Demands'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
                            <div>
                              <b className="text-slate-400 font-bold block">{isVi ? 'Nhân sự:' : 'Staffs:'}</b>
                              <span className="text-slate-800 font-extrabold">{sub.employees} người</span>
                            </div>
                            <div>
                              <b className="text-slate-400 font-bold block">{isVi ? 'Số bộ phận:' : 'Departments:'}</b>
                              <span className="text-slate-800 font-extrabold">{sub.departments} bộ phận</span>
                            </div>
                            <div>
                              <b className="text-rose-500 font-bold block">{isVi ? 'Mức sẵn sàng thấp:' : 'Low Readiness:'}</b>
                              <span className="text-rose-700 font-extrabold">{sub.lowReadinessCount} ({sub.lowReadinessPct})</span>
                            </div>
                            <div>
                              <b className="text-indigo-600 font-bold block">{isVi ? 'Nhãn ưu tiên:' : 'Priority targets:'}</b>
                              <span className="text-indigo-800 font-extrabold">{sub.priorityCount} ({sub.priorityPct})</span>
                            </div>
                          </div>

                          <div className="mt-2 text-[10px] text-slate-500 font-medium">
                            <strong className="font-extrabold">{isVi ? 'Bộ phận ghi nhận:' : 'Impacted units:'}</strong> {sub.depts.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* List of Affected functional departments checkmarks */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black text-indigo-900 tracking-widest font-mono block">
                    {isVi ? 'Phạm Vi Đào Tạo / Bộ Phận Đăng Ký' : 'Recipient Departments & Scope Area'}
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {details.depts.map((d, dIdx) => (
                      <div 
                        key={dIdx} 
                        className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-150 text-[10.5px] font-extrabold text-slate-700 shadow-3xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                    {details.depts.length === 0 && (
                      <p className="p-2 text-slate-400 italic text-[11px] col-span-full">
                        {isVi ? 'Chưa cấu hình phòng ban' : 'No direct recipient departments configure.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Helpful explanatory footnotes for client compliance layout */}
                <div className="flex gap-2 p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/50 text-[10px] text-slate-500">
                  <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="leading-normal">
                    {isVi 
                      ? 'Dữ liệu phân tích phía trên được đồng bộ trực tiếp từ báo cáo khảo sát khảo thí nhu cầu năng suất năm hành chính phục vụ định hướng L&D. Hãy tham mưu đề xuất này cho Hội đồng Đào tạo.'
                      : 'These quantitative variables are derived from administrative year-end L&D competency profiles. Keep these indicators updated for executive-level reporting reviews.'}
                  </p>
                </div>

              </div>

              {/* Footer closing button container */}
              <div className="bg-slate-50 px-5.5 py-4.5 border-t border-slate-150 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => handleSetSelectedTrendComp(null)}
                  className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10.5px] font-black rounded-lg cursor-pointer transition-all shadow-3xs"
                >
                  {isVi ? 'ĐÃ ĐỌC & ĐÓNG' : 'DISMISS & RETURN'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
