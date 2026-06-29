import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Download,
  Check,
  Edit2,
  ListFilter,
  RefreshCw,
  PlusCircle,
  HelpCircle,
  Eye,
  X,
  Calendar,
  User,
  Clock,
  Sparkles,
  BookOpen,
  Briefcase,
  ArrowUpDown,
  BellRing
} from 'lucide-react';
import { dbIndividualIDPs } from '../individualDevPlansData';
import { dbTalentPool } from '../data';
import { IndividualIDP } from '../types';

// Pre-cache and pre-compute normalized talent pool words to speed up string matching and avoid rendering lags
const precomputedTalents = dbTalentPool.map(t => {
  const nameNorm = (t.name || '').toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  return {
    ...t,
    normWordsList: nameNorm
  };
});

const canonicalCache = new Map<string, { key: string; canonicalName: string; canonicalCode: string }>();

export const getCanonicalRecordKey = (p: IndividualIDP) => {
  if (p.id && canonicalCache.has(p.id)) {
    return canonicalCache.get(p.id)!;
  }

  const normWords = (s: string) => (s || '').toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const cleanCode = (p.empCode || '').trim();
  const cleanVi = (p.viName || '').trim();
  const cleanEng = (p.engName || '').trim();

  const eWords = normWords(cleanEng);
  const vWords = normWords(cleanVi);

  let matchedTalent: any = null;
  if (eWords.length > 0 || vWords.length > 0) {
    matchedTalent = precomputedTalents.find(t => {
      const tWords = t.normWordsList;
      if (tWords.length === 0) return false;

      // Match English - precise order-insensitive check
      if (eWords.length > 0 && eWords.length === tWords.length) {
        if (eWords.every(w => tWords.includes(w))) {
          return true;
        }
      }

      // Match Vietnamese - precise order-insensitive check
      if (vWords.length > 0 && vWords.length === tWords.length) {
        if (vWords.every(w => tWords.includes(w))) {
          return true;
        }
      }

      return false;
    });
  }

  let siteNorm = p.site ? p.site.toUpperCase().trim() : 'MLN';
  if (siteNorm === 'MILLENNIUM') siteNorm = 'MLN';
  const siteSuffix = siteNorm ? `-${siteNorm}` : '';

  const isValidCode = cleanCode && cleanCode !== '(blank)' && cleanCode !== '—' && cleanCode !== '-';

  let result;
  if (matchedTalent) {
    result = {
      key: `pool-${matchedTalent.name.toUpperCase()}${siteSuffix}`,
      canonicalName: matchedTalent.name,
      canonicalCode: isValidCode ? cleanCode : '',
    };
  } else if (isValidCode) {
    // Group by code if valid
    result = { 
      key: `code-${cleanCode.toUpperCase()}${siteSuffix}`, 
      canonicalName: cleanVi || cleanEng || cleanCode, 
      canonicalCode: cleanCode 
    };
  } else {
    // Group by Name and Site
    const cleanName = cleanVi || cleanEng;
    if (cleanName) {
      const normName = normWords(cleanName).join('_').toUpperCase();
      result = { 
        key: `name-${normName}${siteSuffix}`, 
        canonicalName: cleanName, 
        canonicalCode: isValidCode ? cleanCode : '' 
      };
    } else {
      result = { key: `p-${p.id}`, canonicalName: "Unknown", canonicalCode: "" };
    }
  }

  if (p.id) {
    canonicalCache.set(p.id, result);
  }
  return result;
};

interface IndividualIDPWorkspaceProps {
  selectedDept: string;
  onDeptChange: (dept: string) => void;
  lang: 'VI' | 'EN';
  isLdMode?: boolean;
  selectedSite?: 'MLN' | 'WNK' | 'ASH';
}

export const getRatingTheme = (rRating: string, lang: 'VI' | 'EN' = 'VI') => {
  const r = (rRating || '').toUpperCase().trim();
  if (r.includes('R1')) {
    return {
      badge: 'bg-red-50 border border-red-200 text-red-700 font-extrabold',
      rowBorder: 'border-l-4 border-l-red-500',
      text: 'text-red-650 font-black',
      actionLabel: lang === 'VI' ? 'Chỉ đạo' : 'Directing',
      colorName: 'Đỏ',
      bgSubtle: 'bg-red-50/25',
      ratingLabel: 'R1',
      styleLabel: lang === 'VI' ? 'Chỉ đạo' : 'Directing'
    };
  }
  if (r.includes('R2')) {
    return {
      badge: 'bg-amber-50 border border-amber-200 text-amber-705 font-extrabold',
      rowBorder: 'border-l-4 border-l-amber-500',
      text: 'text-amber-600 font-black',
      actionLabel: lang === 'VI' ? 'Kèm cặp' : 'Coaching',
      colorName: 'Vàng Cam',
      bgSubtle: 'bg-amber-50/25',
      ratingLabel: 'R2',
      styleLabel: lang === 'VI' ? 'Kèm cặp' : 'Coaching'
    };
  }
  if (r.includes('R3')) {
    return {
      badge: 'bg-blue-50 border border-blue-200 text-blue-700 font-extrabold',
      rowBorder: 'border-l-4 border-l-blue-500',
      text: 'text-blue-600 font-black',
      actionLabel: lang === 'VI' ? 'Hỗ trợ' : 'Supporting',
      colorName: 'Xanh Dương',
      bgSubtle: 'bg-blue-50/25',
      ratingLabel: 'R3',
      styleLabel: lang === 'VI' ? 'Hỗ trợ' : 'Supporting'
    };
  }
  if (r.includes('R4')) {
    return {
      badge: 'bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold',
      rowBorder: 'border-l-4 border-l-emerald-500',
      text: 'text-emerald-700 font-black',
      actionLabel: lang === 'VI' ? 'Ủy quyền' : 'Delegating',
      colorName: 'Xanh Lá',
      bgSubtle: 'bg-emerald-50/25',
      ratingLabel: 'R4',
      styleLabel: lang === 'VI' ? 'Ủy quyền' : 'Delegating'
    };
  }
  // N/A rating - has data but no readiness score assigned yet
  if (r === 'N/A' || r === 'NA') {
    return {
      badge: 'bg-purple-50 border border-purple-200 text-purple-700 font-extrabold',
      rowBorder: 'border-l-4 border-l-purple-400',
      text: 'text-purple-600 font-black',
      actionLabel: lang === 'VI' ? 'Đang đánh giá' : 'Pending Review',
      colorName: 'Tím',
      bgSubtle: 'bg-purple-50/20',
      ratingLabel: 'N/A',
      styleLabel: lang === 'VI' ? 'Chờ đánh giá' : 'Pending'
    };
  }
  return {
    badge: 'bg-slate-50 border border-slate-200 text-slate-500 font-medium',
    rowBorder: '',
    text: 'text-slate-400',
    actionLabel: '—',
    colorName: 'Xám',
    bgSubtle: '',
    ratingLabel: '—',
    styleLabel: '—'
  };
};

export const getRecommendationText = (rRating: string, lang: 'VI' | 'EN'): string => {
  const r = (rRating || '').toUpperCase().trim();
  if (r.includes('R1')) return lang === 'VI' ? 'Kèm cặp' : 'Mentoring';
  if (r.includes('R2')) return lang === 'VI' ? 'Chỉ dẫn' : 'Coaching';
  if (r.includes('R3')) return lang === 'VI' ? 'Hỗ trợ' : 'Supporting';
  if (r.includes('R4')) return lang === 'VI' ? 'Ủy quyền' : 'Delegating';
  return '—';
};

export const getSuggestionText = (action: string, lang: 'VI' | 'EN'): string => {
  const act = (action || '').trim();
  if (!act) return '—';
  if (act === 'Add to Training Plan' || act === 'Đưa vào Kế hoạch đào tạo tập trung' || act.toLowerCase().includes('training') || act.toLowerCase().includes('đào tạo')) {
    return lang === 'VI' ? 'Đưa vào Kế hoạch đào tạo tập trung' : 'Add into Training Plan';
  }
  return lang === 'VI' ? 'Bộ phận tự theo dõi & Kèm cặp' : 'Department self follow-up';
};

export default function IndividualIDPWorkspace({ 
  selectedDept, 
  onDeptChange, 
  lang,
  isLdMode = false,
  selectedSite = 'MLN'
}: IndividualIDPWorkspaceProps) {
  const translateCategory = (cat: string) => {
    if (!cat) return '';
    if (lang === 'EN') return cat;
    switch (cat.trim()) {
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

  const translateOwner = (owner: string) => {
    if (!owner) return '—';
    if (lang === 'EN') return owner;
    switch (owner.trim()) {
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
      case 'Executive':
        return 'Ban Giám đốc';
      default: return owner;
    }
  };

  const [plans, setPlans] = useState<IndividualIDP[]>(() => dbIndividualIDPs);
  const [mainSortKey, setMainSortKey] = useState<'empCode' | 'viName' | 'department' | 'title' | 'rRating' | null>(null);
  const [mainSortDir, setMainSortDir] = useState<'asc' | 'desc' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('ALL');
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Create state for a manual inline editing form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<IndividualIDP>>({});

  // Details Modal and checklist mapping states
  const [selectedDetailPlan, setSelectedDetailPlan] = useState<IndividualIDP | null>(null);
  const [selectedEmployeeIDP, setSelectedEmployeeIDP] = useState<any | null>(null);
  const [completedStepsMap, setCompletedStepsMap] = useState<Record<string, string[]>>({});

  // Modal filtering & sorting states
  const [modalSearch, setModalSearch] = useState('');
  const [modalRatingFilter, setModalRatingFilter] = useState('ALL');
  const [modalPriorityFilter, setModalPriorityFilter] = useState('ALL'); // ALL, PRIORITY_ONLY, NORMAL_ONLY
  const [modalSortKey, setModalSortKey] = useState<string | null>(null);
  const [modalSortDir, setModalSortDir] = useState<'asc' | 'desc' | null>(null);

  // Draggable and Persistent columns state
  const [idpColumns, setIdpColumns] = useState<{key: string, labelVi: string, labelEn: string, width: string}[]>(() => {
    try {
      const saved = localStorage.getItem('idp_columns_order_v4');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore security / storage block errors
    }
    return [
      { key: 'jobDuty', labelVi: 'Nhiệm vụ công việc', labelEn: 'Job Duty', width: 'w-[280px]' },
      { key: 'rRating', labelVi: 'Mức sẵn sàng', labelEn: 'R Rating', width: 'w-[125px]' },
      { key: 'topOpportunity', labelVi: 'Ưu tiên hàng đầu', labelEn: 'Top Opportunity', width: 'w-[140px]' },
      { key: 'comments', labelVi: 'Nhận xét', labelEn: 'Comments', width: 'w-[240px]' },
      { key: 'wayForward', labelVi: 'Kế hoạch phát triển', labelEn: 'Development Plan (Way Forward)', width: 'w-[260px]' },
      { key: 'timeline', labelVi: 'Thời hạn / Lộ trình', labelEn: 'Timeline', width: 'w-[130px]' },
      { key: 'proposedProgram', labelVi: 'Chương trình đào tạo đề xuất', labelEn: 'Proposed Program', width: 'w-[240px]' },
      { key: 'trainingCategory', labelVi: 'Loại hình năng lực', labelEn: 'Category', width: 'w-[180px]' },
      { key: 'recommendation', labelVi: 'Khuyến nghị', labelEn: 'Recommendation', width: 'w-[160px]' },
      { key: 'suggestedSetup', labelVi: 'Gợi ý thiết lập', labelEn: 'Suggested Setup', width: 'w-[220px]' },
      { key: 'owner', labelVi: 'Bộ phận theo sát', labelEn: 'Owner', width: 'w-[160px]' },
    ];
  });

  const visibleIdpColumns = useMemo(() => {
    if (isLdMode) {
      return idpColumns;
    }
    return idpColumns.filter(col => 
      col.key !== 'trainingCategory' && 
      col.key !== 'recommendation' && 
      col.key !== 'suggestedSetup' && 
      col.key !== 'owner'
    );
  }, [idpColumns, isLdMode]);

  const [draggedColKey, setDraggedColKey] = useState<string | null>(null);
  const [dragOverColKey, setDragOverColKey] = useState<string | null>(null);

  const handleColumnDragStart = (e: React.DragEvent, key: string) => {
    setDraggedColKey(key);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    if (draggedColKey !== key) {
      setDragOverColKey(key);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    setDragOverColKey(null);
    if (!draggedColKey || draggedColKey === targetKey) return;

    const fromIndex = idpColumns.findIndex(c => c.key === draggedColKey);
    const toIndex = idpColumns.findIndex(c => c.key === targetKey);

    if (fromIndex !== -1 && toIndex !== -1) {
      const newCols = [...idpColumns];
      const [removed] = newCols.splice(fromIndex, 1);
      newCols.splice(toIndex, 0, removed);
      setIdpColumns(newCols);
      try {
        localStorage.setItem('idp_columns_order_v4', JSON.stringify(newCols));
      } catch (e) {
        // Safe fallback when storage blocked
      }
    }
  };

  const handleColumnDragEnd = () => {
    setDraggedColKey(null);
    setDragOverColKey(null);
  };

  const resetColumnOrder = () => {
    const defaults = [
      { key: 'jobDuty', labelVi: 'Nhiệm vụ công việc', labelEn: 'Job Duty', width: 'w-[280px]' },
      { key: 'rRating', labelVi: 'Mức sẵn sàng', labelEn: 'R Rating', width: 'w-[125px]' },
      { key: 'topOpportunity', labelVi: 'Ưu tiên hàng đầu', labelEn: 'Top Opportunity', width: 'w-[140px]' },
      { key: 'comments', labelVi: 'Nhận xét', labelEn: 'Comments', width: 'w-[240px]' },
      { key: 'wayForward', labelVi: 'Giải pháp', labelEn: 'Way Forward', width: 'w-[260px]' },
      { key: 'timeline', labelVi: 'Thời hạn / Lộ trình', labelEn: 'Timeline', width: 'w-[130px]' },
      { key: 'proposedProgram', labelVi: 'Chương trình đào tạo đề xuất', labelEn: 'Proposed Program', width: 'w-[240px]' },
      { key: 'trainingCategory', labelVi: 'Loại hình năng lực', labelEn: 'Category', width: 'w-[180px]' },
      { key: 'recommendation', labelVi: 'Khuyến nghị', labelEn: 'Recommendation', width: 'w-[160px]' },
      { key: 'suggestedSetup', labelVi: 'Gợi ý thiết lập', labelEn: 'Suggested Setup', width: 'w-[220px]' },
      { key: 'owner', labelVi: 'Bộ phận theo sát', labelEn: 'Owner', width: 'w-[160px]' },
    ];
    setIdpColumns(defaults);
    try {
      localStorage.setItem('idp_columns_order_v4', JSON.stringify(defaults));
    } catch (e) {
      // Safe fallback when storage blocked
    }
  };

  // Personalized L&D recommendation states
  const [personalAiAdvice, setPersonalAiAdvice] = useState<any[] | null>(null);
  const [isPersonalAiLoading, setIsPersonalAiLoading] = useState<boolean>(false);
  const [personalAiError, setPersonalAiError] = useState<string | null>(null);

  // Trigger loading the tailored recommendations via server-side Gemini 3.5 API
  const handleLoadPersonalAiAdvice = async (name: string, title: string, dept: string, itemsList: any[]) => {
    setIsPersonalAiLoading(true);
    setPersonalAiError(null);
    try {
      const response = await fetch('/api/gemini/individual-idp-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empName: name,
          title: title || 'Staff',
          department: dept || 'Operational site',
          lang,
          items: itemsList
        })
      });

      if (!response.ok) {
        throw new Error(lang === 'VI' ? 'Lỗi kết nối Trợ lý AI. Vui lòng thử lại.' : 'Failed to query personalization AI service.');
      }
      const data = await response.json();
      setPersonalAiAdvice(data.data || []);
    } catch (err: any) {
      console.error("Personal IDP AI Suggester error:", err);
      setPersonalAiError(err.message || 'AI service connection issue.');
    } finally {
      setIsPersonalAiLoading(false);
    }
  };

  // Modal scrolling and hover states (for auto-hiding filter and aligning details)
  const lastScrollTopRef = useRef<number>(0);
  const [isModalScrolled, setIsModalScrolled] = useState(false);
  const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  useEffect(() => {
    setIsModalScrolled(false);
    setIsDashboardCollapsed(false);
    setIsScrollingUp(true);
    setIsHeaderHovered(false);
    lastScrollTopRef.current = 0;
    // Clear personalized AI advice on switching employee
    setPersonalAiAdvice(null);
    setPersonalAiError(null);
  }, [selectedEmployeeIDP]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter department options from actual active unique plan departments
  const uniqueDepts = useMemo(() => {
    const depts = new Set<string>();
    plans.forEach(p => {
      let pSite = p.site ? p.site.trim().toUpperCase() : 'MLN';
      if (pSite === 'MILLENNIUM') pSite = 'MLN';
      if (pSite === selectedSite) {
        if (p.department && p.department.trim() && p.department !== '(blank)') {
          depts.add(p.department);
        }
      }
    });
    return ['ALL', ...Array.from(depts)];
  }, [plans, selectedSite]);

  // Synchronized toast presentation
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Real CSV / TSV text parsing logic
  const handleFile = (file: File) => {
    const isTxtOrCsv = file.name.endsWith('.csv') || file.name.endsWith('.tsv') || file.name.endsWith('.txt');
    if (!isTxtOrCsv) {
      triggerToast(
        lang === 'VI' 
          ? 'Chỉ chấp nhận file định dạng .csv hoặc .tsv (tab-separated)!' 
          : 'Only .csv or .tsv (tab-separated) text files are supported!'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      // Identify delimiter: Tab or Comma
      const delimiter = text.includes('\t') ? '\t' : ',';
      const lines = text.split(/\r?\n/);
      if (lines.length < 2) {
        triggerToast(lang === 'VI' ? 'File không có dữ liệu hợp lệ!' : 'File does not contain valid data rows!');
        return;
      }

      // Read standard headers, mapping them to types
      const rawHeaders = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
      
      const headerMap: Record<string, keyof IndividualIDP> = {
        'Emp.Code': 'empCode', 
        'Vi Name': 'viName', 
        'Eng Name': 'engName',
        'Site': 'site', 
        'Location': 'location', 
        'Department': 'department',
        'Section': 'section', 
        'Position': 'position', 
        'Title': 'title',
        'Job Duty': 'jobDuty', 
        'R Rating': 'rRating', 
        'Top Opportunity': 'topOpportunity',
        'Comments': 'comments', 
        'Way Forward': 'wayForward', 
        'Timeline': 'timeline',
        'Note': 'note', 
        'Source_File': 'sourceFile', 
        'Mapped Need': 'mappedNeed',
        'Competency Focus': 'competencyFocus', 
        'Training Category': 'trainingCategory',
        'Action': 'action', 
        'Proposed Program': 'proposedProgram', 
        'Owner': 'owner'
      };

      const parsedRecords: IndividualIDP[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Custom split to parse quotes and avoid breaking on internal commas
        let values: string[] = [];
        if (delimiter === ',') {
          // Standard CSV regex splitting on comma while preserving internal quotes
          const regex = /(?:,|\r?\n|^)(?:"([^"\\]*(?:\\.[^"\\]*)*)"|([^,\r\n]*))/gi;
          let match;
          while ((match = regex.exec(line)) !== null) {
            values.push(match[1] !== undefined ? match[1] : match[2] || '');
          }
          // Trim absolute match discrepancies
          if (values.length > rawHeaders.length) {
            values = values.slice(0, rawHeaders.length);
          }
        } else {
          // Plain tab split
          values = line.split('\t').map(v => v.trim().replace(/^"|"$/g, ''));
        }

        const idpObj: Partial<IndividualIDP> = {
          id: `idp-upload-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`
        };

        // Initialize empty strings for all fields to prevent underflow
        Object.values(headerMap).forEach(field => {
          idpObj[field] = '';
        });

        rawHeaders.forEach((h, index) => {
          const field = headerMap[h];
          if (field) {
            let val = values[index] || '';
            if (val === '(blank)' || val === 'blank') {
              val = '';
            }
            idpObj[field] = val;
          }
        });

        parsedRecords.push(idpObj as IndividualIDP);
      }

      if (parsedRecords.length > 0) {
        setPlans(prev => [...parsedRecords, ...prev]);
        triggerToast(
          lang === 'VI' 
            ? `Thành công! Đã tải và khai phá thêm ${parsedRecords.length} kế hoạch cá nhân.` 
            : `Success! Successfully parsed and added ${parsedRecords.length} individual plans.`
        );
      } else {
        triggerToast(
          lang === 'VI' 
            ? 'Không tìm thấy dòng dữ liệu nào phù hợp với mẫu cấu trúc.' 
            : 'No matching records parsed. Please check template column headers.'
        );
      }
    };
    reader.readAsText(file);
  };

  // Export current list to CSV format (UTF-8 with BOM)
  const exportAllToCSV = () => {
    const headers = [
      'Emp.Code', 'Vi Name', 'Eng Name', 'Site', 'Location', 'Department', 
      'Section', 'Position', 'Title', 'Job Duty', 'R Rating', 'Top Opportunity',
      'Comments', 'Way Forward', 'Timeline', 'Note', 'Source_File', 'Mapped Need',
      'Competency Focus', 'Training Category', 'Action', 'Proposed Program', 'Owner'
    ];
    
    const escapeVal = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;

    const rows = filteredPlans.map(p => [
      escapeVal(p.empCode), escapeVal(p.viName), escapeVal(p.engName),
      escapeVal(p.site), escapeVal(p.location), escapeVal(p.department),
      escapeVal(p.section), escapeVal(p.position), escapeVal(p.title),
      escapeVal(p.jobDuty), escapeVal(p.rRating), escapeVal(p.topOpportunity),
      escapeVal(p.comments), escapeVal(p.wayForward), escapeVal(p.timeline),
      escapeVal(p.note), escapeVal(p.sourceFile), escapeVal(p.mappedNeed),
      escapeVal(p.competencyFocus), escapeVal(p.trainingCategory),
      escapeVal(p.action), escapeVal(p.proposedProgram), escapeVal(p.owner)
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MILL_Individual_IDPs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(lang === 'VI' ? 'Đã tải xuống danh dung kế hoạch.' : 'Downloaded filtered plan records.');
  };

  // Download Sample Template for user reference
  const downloadSampleTemplate = () => {
    const headers = [
      'Emp.Code', 'Vi Name', 'Eng Name', 'Site', 'Location', 'Department', 
      'Section', 'Position', 'Title', 'Job Duty', 'R Rating', 'Top Opportunity',
      'Comments', 'Way Forward', 'Timeline', 'Note', 'Source_File', 'Mapped Need',
      'Competency Focus', 'Training Category', 'Action', 'Proposed Program', 'Owner'
    ];
    const sample = [
      '1433', 'LÊ HOÀNG ANH', 'Plant Engineering', 'Millennium', 'MLN', 'Plant Engineering',
      'Maintenance', 'Maintenance Manager', 'Maintenance Manager', 'Personal Development • Learn maintenance technologies',
      'R4', '', 'Good understanding', 'Build roadmaps', 'Ongoing', '', 'Sample_Source_File', 
      'People Development / IDP', 'People Development', 'People Development', 'Add to Training Plan', 
      'People Development & Skill Matrix', 'L&D + HRBP'
    ];
    const csvContent = "\uFEFF" + [headers.join(","), sample.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "MILL_IDP_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter application core logic
  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      // Filter by selected site
      let pSite = p.site ? p.site.trim().toUpperCase() : 'MLN';
      if (pSite === 'MILLENNIUM') pSite = 'MLN';
      if (pSite !== selectedSite) return false;

      // Synchronized Department filter: if "ALL", checks matching with filters, or checks specific
      const cleanDept = p.department ? p.department.trim() : '';
      const matchDept = selectedDept === 'ALL' || cleanDept.toLowerCase() === selectedDept.toLowerCase();

      // Rating filter
      const matchRating = selectedRating === 'ALL' || (p.rRating && p.rRating.trim() === selectedRating);

      // Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        (p.viName || '').toLowerCase().includes(query) ||
        (p.engName || '').toLowerCase().includes(query) ||
        (p.empCode || '').toLowerCase().includes(query) ||
        (p.title || '').toLowerCase().includes(query) ||
        (p.jobDuty || '').toLowerCase().includes(query) ||
        (p.section || '').toLowerCase().includes(query);

      return matchDept && matchRating && matchSearch;
    });
  }, [plans, selectedDept, selectedRating, searchQuery, selectedSite]);

  // Group filtered plans by employee
  const groupedEmployees = useMemo(() => {
    const groups: Record<string, {
      groupKey: string;
      empCode: string;
      viName: string;
      engName: string;
      department: string;
      section: string;
      title: string;
      rRating: string;
      items: IndividualIDP[];
    }> = {};

    filteredPlans.forEach(p => {
      const canonical = getCanonicalRecordKey(p);
      const empKey = canonical.key;
      if (!empKey) return;

      if (!groups[empKey]) {
        groups[empKey] = {
          groupKey: empKey,
          empCode: canonical.canonicalCode || p.empCode || '',
          viName: p.viName || canonical.canonicalName || '',
          engName: p.engName || '',
          department: p.department || '',
          section: p.section || '',
          title: p.title || '',
          rRating: p.rRating || '',
          items: []
        };
      }

      if (!groups[empKey].empCode && p.empCode) {
        groups[empKey].empCode = p.empCode;
      }
      if (!groups[empKey].viName && p.viName) {
        groups[empKey].viName = p.viName;
      }
      if (!groups[empKey].engName && p.engName) {
        groups[empKey].engName = p.engName;
      }
      if (!groups[empKey].rRating && p.rRating) {
        groups[empKey].rRating = p.rRating;
      }
      if (!groups[empKey].title && p.title) {
        groups[empKey].title = p.title;
      }
      if (!groups[empKey].section && p.section) {
        groups[empKey].section = p.section;
      }
      if (!groups[empKey].department && p.department) {
        groups[empKey].department = p.department;
      }

      groups[empKey].items.push(p);
    });

    const list = Object.values(groups);
    if (mainSortKey && mainSortDir) {
      const multiplier = mainSortDir === 'asc' ? 1 : -1;
      return [...list].sort((a, b) => {
        const valA = a[mainSortKey] || '';
        const valB = b[mainSortKey] || '';
        return valA.localeCompare(valB, lang === 'VI' ? 'vi' : 'en') * multiplier;
      });
    }
    // Default sorting puts Eric Nguyen (Nguyễn Thành Phước) at index 0 for the guided tour
    return [...list].sort((a, b) => {
      const aIsEric = (a.viName || '').toLowerCase().includes('phước') || (a.engName || '').toLowerCase().includes('eric');
      const bIsEric = (b.viName || '').toLowerCase().includes('phước') || (b.engName || '').toLowerCase().includes('eric');
      if (aIsEric && !bIsEric) return -1;
      if (!aIsEric && bIsEric) return 1;
      return (a.viName || '').localeCompare(b.viName || '', lang === 'VI' ? 'vi' : 'en');
    });
  }, [filteredPlans, mainSortKey, mainSortDir]);

  // Statistics calculation
  const statistics = useMemo(() => {
    let r1 = 0;
    let r2 = 0;
    let r3 = 0;
    let r4 = 0;

    filteredPlans.forEach(plan => {
      const rating = (plan.rRating || '').toUpperCase().trim();
      if (rating.includes('R1')) r1++;
      else if (rating.includes('R2')) r2++;
      else if (rating.includes('R3')) r3++;
      else if (rating.includes('R4')) r4++;
    });

    return { total: groupedEmployees.length, r1, r2, r3, r4 };
  }, [filteredPlans, groupedEmployees.length]);

  // Synchronized selected employee from the latest plans array to receive live updates in the popup
  const activeModalEmployee = useMemo(() => {
    if (!selectedEmployeeIDP) return null;
    const empKey = selectedEmployeeIDP.groupKey || (selectedEmployeeIDP.empCode ? selectedEmployeeIDP.empCode : selectedEmployeeIDP.viName);
    const found = groupedEmployees.find(emp => (emp.groupKey || (emp.empCode ? emp.empCode : emp.viName)) === empKey);
    return found || null;
  }, [groupedEmployees, selectedEmployeeIDP]);

  // Pre-calculated individual completion rate
  const activeModalProgress = useMemo(() => {
    if (!activeModalEmployee || !activeModalEmployee.items) return 0;
    const total = activeModalEmployee.items.length;
    if (total === 0) return 0;
    const weight = activeModalEmployee.items.reduce((acc, item) => {
      const r = (item.rRating || '').toUpperCase().trim();
      if (r.includes('R4')) return acc + 100;
      if (r.includes('R3')) return acc + 75;
      if (r.includes('R2')) return acc + 50;
      if (r.includes('R1')) return acc + 25;
      return acc + 10;
    }, 0);
    return Math.round(weight / total);
  }, [activeModalEmployee]);

  // Pre-calculated level breakdown counts
  const activeModalLevelCounts = useMemo(() => {
    const counts = { R1: 0, R2: 0, R3: 0, R4: 0 };
    if (!activeModalEmployee || !activeModalEmployee.items) return counts;
    activeModalEmployee.items.forEach(item => {
      const r = (item.rRating || '').toUpperCase().trim();
      if (r.includes('R1')) counts.R1++;
      else if (r.includes('R2')) counts.R2++;
      else if (r.includes('R3')) counts.R3++;
      else if (r.includes('R4')) counts.R4++;
    });
    return counts;
  }, [activeModalEmployee]);

  // Handle single action adjustment (Approve / Reject / Toggle)
  const handleTogglePlanAction = (id: string, currentAct: string) => {
    const nextAct = currentAct === 'Add to Training Plan' ? 'Need Validation' : 'Add to Training Plan';
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, action: nextAct };
      }
      return p;
    }));
    triggerToast(
      lang === 'VI' 
        ? `Đã thay đổi trạng thái sang "${nextAct === 'Add to Training Plan' ? 'Đưa vào KH Đào tạo' : 'Cần thẩm định'}"`
        : `Toggled action status to "${nextAct}"`
    );
  };

  // Delete an individual IDP
  const handleDeletePlan = (id: string, name: string) => {
    if (window.confirm(lang === 'VI' ? `Bạn có chắc chắn muốn xóa kế hoạch của ${name}?` : `Are you sure you want to delete the plan for ${name}?`)) {
      setPlans(prev => prev.filter(p => p.id !== id));
      triggerToast(lang === 'VI' ? `Đã xóa kế hoạch của ${name}` : `Removed plan for ${name}`);
    }
  };

  // Start Inline Editing model
  const startEditing = (p: IndividualIDP) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const saveEditValue = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...editForm } as IndividualIDP : p));
    setEditingId(null);
    triggerToast(lang === 'VI' ? 'Đã cập nhật chỉnh sửa' : 'Updated plan changes successfully');
  };

  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 80) {
      setIsModalScrolled(true);
    } else if (scrollTop < 15) {
      setIsModalScrolled(false);
    }

    if (scrollTop <= 15) {
      setIsScrollingUp(true);
    } else {
      if (scrollTop > lastScrollTopRef.current) {
        setIsScrollingUp(false);
      } else if (scrollTop < lastScrollTopRef.current - 5) {
        setIsScrollingUp(true);
      }
    }
    lastScrollTopRef.current = scrollTop;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-indigo-900 text-white font-extrabold text-xs px-5 py-3.5 rounded-xl border border-indigo-700 shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div id="onboarding-idp-metrics-block" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 - Total People in Department */}
        <div className="bg-gradient-to-br from-slate-50/70 via-white to-white border border-slate-205 p-5 rounded-2xl relative flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-[145px]">
          <div>
            <span className="text-xs lg:text-[12.5px] text-slate-700 font-black uppercase tracking-wider block">
              {lang === 'VI' ? 'NHÂN SỰ BỘ PHẬN' : 'DEPARTMENT PEOPLE'}
            </span>
            <span className="text-slate-500 font-medium text-[10.5px] block mt-1 leading-snug">
              {lang === 'VI' ? 'Tổng số nhân sự theo bộ lọc' : 'Total personnel in department'}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline justify-between select-none">
              <span className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                {statistics.total}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-[9px] font-black text-slate-700 uppercase tracking-widest shadow-3xs border border-slate-200">
                {lang === 'VI' ? 'BỘ PHẬN' : 'DEPT'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {lang === 'VI' ? 'nhân sự' : 'people'}
            </div>
          </div>
        </div>

        {/* Metric 2 - R1 Directing */}
        <div className="bg-gradient-to-br from-red-50/40 via-white to-white border border-red-150 p-5 rounded-2xl relative flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-[145px]">
          <div>
            <span className="text-xs lg:text-[12.5px] text-red-600 font-black uppercase tracking-wider block">
              {lang === 'VI' ? 'XẾP HẠNG R1' : 'R1 RATING'}
            </span>
            <span className="text-slate-500 font-medium text-[10.5px] block mt-1 leading-snug">
              {lang === 'VI' ? (
                <>
                  Kỹ năng <span className="text-red-600 font-black inline-flex items-center">Thấp <span className="text-[11px] ml-0.5">↓</span></span> • Tự tin <span className="text-red-600 font-black inline-flex items-center">Thấp <span className="text-[11px] ml-0.5">↓</span></span>
                </>
              ) : (
                <>
                  Skill <span className="text-red-600 font-black inline-flex items-center">Low <span className="text-[11px] ml-0.5">↓</span></span> • Conf. <span className="text-red-600 font-black inline-flex items-center">Low <span className="text-[11px] ml-0.5">↓</span></span>
                </>
              )}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline justify-between select-none">
              <span className="text-5xl font-black text-red-600 tracking-tight leading-none">
                {statistics.r1}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded bg-red-100/90 text-[9px] font-black text-red-700 uppercase tracking-widest shadow-3xs border border-red-200">
                {lang === 'VI' ? 'CHỈ ĐẠO' : 'DIRECT'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {lang === 'VI' ? 'nhiệm vụ' : 'tasks'}
            </div>
          </div>
        </div>

        {/* Metric 3 - R2 Coaching */}
        <div className="bg-gradient-to-br from-amber-50/40 via-white to-white border border-amber-150 p-5 rounded-2xl relative flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-[145px]">
          <div>
            <span className="text-xs lg:text-[12.5px] text-amber-600 font-black uppercase tracking-wider block">
              {lang === 'VI' ? 'XẾP HẠNG R2' : 'R2 RATING'}
            </span>
            <span className="text-slate-500 font-medium text-[10.5px] block mt-1 leading-snug">
              {lang === 'VI' ? (
                <>
                  Kỹ năng <span className="text-red-600 font-black inline-flex items-center">Thấp <span className="text-[11px] ml-0.5">↓</span></span> • Tự tin <span className="text-emerald-600 font-black inline-flex items-center">Cao <span className="text-[11px] ml-0.5">↑</span></span>
                </>
              ) : (
                <>
                  Skill <span className="text-red-600 font-black inline-flex items-center">Low <span className="text-[11px] ml-0.5">↓</span></span> • Conf. <span className="text-emerald-600 font-black inline-flex items-center">High <span className="text-[11px] ml-0.5">↑</span></span>
                </>
              )}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline justify-between select-none">
              <span className="text-5xl font-black text-amber-500 tracking-tight leading-none">
                {statistics.r2}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-[9px] font-black text-amber-705 uppercase tracking-widest shadow-3xs border border-amber-200">
                {lang === 'VI' ? 'KÈM CẶP' : 'COACH'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {lang === 'VI' ? 'nhiệm vụ' : 'tasks'}
            </div>
          </div>
        </div>

        {/* Metric 4 - R3 Supporting */}
        <div className="bg-gradient-to-br from-blue-50/40 via-white to-white border border-blue-150 p-5 rounded-2xl relative flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-[145px]">
          <div>
            <span className="text-xs lg:text-[12.5px] text-blue-600 font-black uppercase tracking-wider block">
              {lang === 'VI' ? 'XẾP HẠNG R3' : 'R3 RATING'}
            </span>
            <span className="text-slate-500 font-medium text-[10.5px] block mt-1 leading-snug">
              {lang === 'VI' ? (
                <>
                  Kỹ năng <span className="text-emerald-600 font-black inline-flex items-center">Cao <span className="text-[11px] ml-0.5">↑</span></span> • Tự tin <span className="text-red-600 font-black inline-flex items-center">Thấp <span className="text-[11px] ml-0.5">↓</span></span>
                </>
              ) : (
                <>
                  Skill <span className="text-emerald-600 font-black inline-flex items-center">High <span className="text-[11px] ml-0.5">↑</span></span> • Conf. <span className="text-red-600 font-black inline-flex items-center">Low <span className="text-[11px] ml-0.5">↓</span></span>
                </>
              )}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline justify-between select-none">
              <span className="text-5xl font-black text-blue-600 tracking-tight leading-none">
                {statistics.r3}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-[9px] font-black text-blue-700 uppercase tracking-widest shadow-3xs border border-blue-200">
                {lang === 'VI' ? 'HỖ TRỢ' : 'SUPPORT'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {lang === 'VI' ? 'nhiệm vụ' : 'tasks'}
            </div>
          </div>
        </div>

        {/* Metric 5 - R4 Delegating */}
        <div className="bg-gradient-to-br from-emerald-50/40 via-white to-white border border-emerald-150 p-5 rounded-2xl relative flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-[145px]">
          <div>
            <span className="text-xs lg:text-[12.5px] text-emerald-600 font-black uppercase tracking-wider block">
              {lang === 'VI' ? 'XẾP HẠNG R4' : 'R4 RATING'}
            </span>
            <span className="text-slate-500 font-medium text-[10.5px] block mt-1 leading-snug">
              {lang === 'VI' ? (
                <>
                  Kỹ năng <span className="text-emerald-600 font-black inline-flex items-center">Cao <span className="text-[11px] ml-0.5">↑</span></span> • Tự tin <span className="text-emerald-600 font-black inline-flex items-center">Cao <span className="text-[11px] ml-0.5">↑</span></span>
                </>
              ) : (
                <>
                  Skill <span className="text-emerald-600 font-black inline-flex items-center">High <span className="text-[11px] ml-0.5">↑</span></span> • Conf. <span className="text-emerald-600 font-black inline-flex items-center">High <span className="text-[11px] ml-0.5">↑</span></span>
                </>
              )}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-baseline justify-between select-none">
              <span className="text-5xl font-black text-emerald-600 tracking-tight leading-none">
                {statistics.r4}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-[9px] font-black text-emerald-700 uppercase tracking-widest shadow-3xs border border-emerald-205">
                {lang === 'VI' ? 'ỦY QUYỀN' : 'DELEGATE'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {lang === 'VI' ? 'nhiệm vụ' : 'tasks'}
            </div>
          </div>
        </div>
      </div>

      {/* DRAG & DROP REAL FILE UPLOAD ZONE (COMPACT SLIM VERSION) */}
      {isLdMode && (
        <div id="onboarding-idp-upload-zone" className="bg-white border border-slate-200 rounded-2xl p-2.5 px-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 shadow-3xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-xl shrink-0">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 text-left">
              <h3 className="text-[11px] font-extrabold text-slate-800 tracking-tight uppercase">
                {lang === 'VI' ? 'TẢI LÊN KẾ HOẠCH PHÁT TRIỂN (IDP)' : 'SPREADSHEET INGESTION (IDP)'}
              </h3>
              <p className="text-[10px] text-slate-500 leading-tight">
                {lang === 'VI' 
                  ? 'Đọc & đồng bộ trực tiếp: Mã NV, Họ Tên, Nhiệm vụ đào tạo, R-Rating, Định hướng kế hoạch.' 
                  : 'Upload development plan spreadsheets to merge & search employee IDPs.'}
              </p>
            </div>
          </div>
          
          {/* Real Drop Area - Slimmer Line */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-xl px-3 py-1.5 flex items-center gap-2 transition-all duration-200 cursor-pointer select-none text-[10.5px] ${
                dragActive 
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/10 font-bold' 
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-indigo-300'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".csv,.tsv,.txt"
                className="hidden" 
              />
              <UploadCloud className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-extrabold text-[9.5px] text-slate-500 uppercase tracking-wide">
                {lang === 'VI' ? 'Kéo thả file hoặc click chọn' : 'Drag file or click to choose'}
              </span>
            </div>

            <button
              onClick={downloadSampleTemplate}
              className="text-[9.5px] border border-slate-200 hover:border-indigo-200 text-slate-550 hover:text-indigo-600 bg-white font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs shrink-0"
            >
              <Download className="w-3 h-3 text-slate-450" />
              <span>{lang === 'VI' ? 'FILE MẪU (.CSV)' : 'TEMPLATE CSV'}</span>
            </button>
          </div>
        </div>
      )}

      {/* FILTER & ADVANCED SEARCH BAR */}
      <div id="onboarding-idp-search-filter-panel" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'VI' ? "Tìm kiếm mã NV, tên, chức danh, nhiệm vụ, bộ phận..." : "Search employee code, name, title, duties..."}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl outline-none transition-all placeholder-slate-400 font-medium"
            />
          </div>

          {/* Department Filter Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] text-slate-455 font-extrabold uppercase shrink-0">{lang === 'VI' ? 'Bộ phận:' : 'Dept:'}</span>
            <select
              value={selectedDept}
              onChange={(e) => onDeptChange(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer transition-all"
            >
              {uniqueDepts.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'ALL' ? (lang === 'VI' ? 'TẤT CẢ BỘ PHẬN' : 'ALL DEPARTMENTS') : dept}
                </option>
              ))}
            </select>
          </div>

          {/* R Rating Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] text-slate-455 font-extrabold uppercase shrink-0">R-Rating:</span>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer transition-all"
            >
              <option value="ALL">{lang === 'VI' ? 'TẤT CẢ XẾP HẠNG' : 'ALL RATINGS'}</option>
              <option value="R1">{lang === 'VI' ? 'R1 (Kỹ năng Thấp - Tự tin Thấp)' : 'R1 (Low Skill - Low Confidence)'}</option>
              <option value="R2">{lang === 'VI' ? 'R2 (Kỹ năng Thấp - Tự tin Cao)' : 'R2 (Low Skill - High Confidence)'}</option>
              <option value="R3">{lang === 'VI' ? 'R3 (Kỹ năng Cao - Tự tin Thấp)' : 'R3 (High Skill - Low Confidence)'}</option>
              <option value="R4">{lang === 'VI' ? 'R4 (Kỹ năng Cao - Tự tin Cao)' : 'R4 (High Skill - High Confidence)'}</option>
            </select>
          </div>
        </div>

      </div>

      {/* COMPREHENSIVE LIST OR COLLAPSIBLE SYSTEM */}
      <div id="onboarding-idp-table-container" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-3.5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h3 className="text-xs font-black text-slate-750 uppercase tracking-wider font-display flex items-center gap-2 shrink-0">
              <FileSpreadsheet className="w-4 h-4 text-indigo-650 shrink-0" />
              <span>{lang === 'VI' ? 'BẢNG RÀ SOÁT KẾ HOẠCH PHÁT TRIỂN CHI TIẾT TỪNG NHÂN SỰ' : 'DETAILED INDIVIDUAL DEVELOPMENT PLAN LOG'}</span>
            </h3>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <span className="text-[10.5px] text-slate-500 font-extrabold whitespace-nowrap bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              {lang === 'VI' 
                ? `Tổng số: ${groupedEmployees.length} nhân sự` 
                : `Total: ${groupedEmployees.length} personnel`}
            </span>
            <button
              onClick={exportAllToCSV}
              className="px-3.5 py-1.5 bg-indigo-550/10 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-extrabold text-[10px] flex items-center gap-1.5 transition-all shadow-3xs hover:scale-102 cursor-pointer"
              title={lang === 'VI' ? 'Xuất CSV dữ liệu đang hiển thị' : 'Export current filtered records as CSV'}
            >
              <Download className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{lang === 'VI' ? 'XUẤT FILE (.CSV)' : 'EXPORT CSV'}</span>
            </button>
          </div>
        </div>

        <div id="onboarding-idp-outer-table-scroll-container" className="overflow-x-auto">
          {groupedEmployees.length === 0 ? (
            <div className="p-12 text-center text-slate-400 italic text-xs">
              {lang === 'VI' ? 'Không có bản ghi kế hoạch nào phù hợp với bộ lọc.' : 'No plan records match your layout filters.'}
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="bg-[#1e1b4b] border-b border-[#0f172a] text-[#f1f5f9] font-black select-none shadow-xs">
                <tr className="text-[10.5px] font-bold uppercase tracking-widest select-none">
                  <th 
                    onClick={() => {
                      if (mainSortKey === 'empCode') {
                        setMainSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setMainSortKey('empCode');
                        setMainSortDir('asc');
                      }
                    }}
                    className="px-5 py-3.5 cursor-pointer hover:bg-indigo-905/60 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Mã NV' : 'Emp.Code'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${mainSortKey === 'empCode' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    onClick={() => {
                      if (mainSortKey === 'viName') {
                        setMainSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setMainSortKey('viName');
                        setMainSortDir('asc');
                      }
                    }}
                    className="px-5 py-3.5 cursor-pointer hover:bg-indigo-905/60 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Họ & Tên' : 'Personnel Name'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${mainSortKey === 'viName' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    onClick={() => {
                      if (mainSortKey === 'department') {
                        setMainSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setMainSortKey('department');
                        setMainSortDir('asc');
                      }
                    }}
                    className="px-5 py-3.5 cursor-pointer hover:bg-indigo-905/60 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Bộ Phân / Phòng ban' : 'Dept / Section'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${mainSortKey === 'department' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    onClick={() => {
                      if (mainSortKey === 'title') {
                        setMainSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setMainSortKey('title');
                        setMainSortDir('asc');
                      }
                    }}
                    className="px-5 py-3.5 cursor-pointer hover:bg-indigo-905/60 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Chức vụ' : 'Title'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${mainSortKey === 'title' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    onClick={() => {
                      if (mainSortKey === 'rRating') {
                        setMainSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setMainSortKey('rRating');
                        setMainSortDir('asc');
                      }
                    }}
                    className="px-4 py-3.5 cursor-pointer hover:bg-indigo-905/60 select-none transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{lang === 'VI' ? 'Xếp hạng Mức Sẵn sàng' : 'Readiness Rating'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${mainSortKey === 'rRating' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-center text-[#e2e8f0]">{lang === 'VI' ? 'Mức ưu tiên' : 'Priority Level'}</th>
                  <th className="px-5 py-3.5 text-center text-[#e2e8f0]">{lang === 'VI' ? 'Kế hoạch phát triển' : 'Development Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-left">
                {groupedEmployees.map((emp, idx) => {
                  const empKey = emp.groupKey || (emp.empCode ? emp.empCode : emp.viName);
                  const theme = getRatingTheme(emp.rRating, lang);

                  // Calculate allocations for this employee row
                  const r1Count = emp.items.filter(item => (item.rRating || '').toUpperCase().trim() === 'R1').length;
                  const r2Count = emp.items.filter(item => (item.rRating || '').toUpperCase().trim() === 'R2').length;
                  const r3Count = emp.items.filter(item => (item.rRating || '').toUpperCase().trim() === 'R3').length;
                  const r4Count = emp.items.filter(item => (item.rRating || '').toUpperCase().trim() === 'R4').length;
                  const topCount = emp.items.filter(item => (item.topOpportunity || '').toUpperCase().trim() === 'X').length;

                  return (
                    <React.Fragment key={empKey}>
                       <tr 
                        id={idx === 0 ? "onboarding-idp-row-0" : undefined}
                        onClick={() => {
                          setExpandedKey(expandedKey === empKey ? null : empKey);
                        }}
                        className="hover:bg-indigo-50/20 active:bg-slate-105 transition-colors cursor-pointer group border-b border-slate-100 even:bg-slate-50/30"
                        title={lang === 'VI' ? 'Bấm vào bất kỳ đâu trên dòng này để mở rộng danh sách công việc nhiệm vụ cụ thể' : 'Click anywhere on this row to expand detailed job duty list inline'}
                      >
                        {/* Emp Code - No vertical line borders */}
                        <td className="px-5 py-3 font-mono font-bold text-slate-500">
                           {emp.empCode || '—'}
                        </td>

                        {/* Name - No vertical line borders */}
                        <td className="px-5 py-3">
                           <div className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors w-max flex items-center gap-1.5">
                            <span>{emp.viName}</span>
                            {expandedKey === empKey ? (
                              <ChevronUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 shrink-0 transition-colors" />
                            )}
                          </div>
                          {emp.engName && emp.engName !== emp.viName && (
                            <div className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                              {emp.engName}
                            </div>
                          )}
                        </td>

                        {/* Dept/Section - No vertical line borders */}
                        <td className="px-5 py-3 text-slate-500">
                          <span className="font-bold block text-slate-805">{emp.department || 'Executive'}</span>
                          {emp.section && <span className="text-[10px] text-slate-400 block mt-0.5">{emp.section}</span>}
                        </td>

                        {/* Title - No vertical line borders */}
                        <td className="px-5 py-3 font-bold text-slate-705">
                          {emp.title || '—'}
                        </td>

                        {/* R1 - R4 Allocated Count Badges - No vertical line borders, Circles made larger (w-9.5 h-9.5) */}
                        <td 
                          id={idx === 0 ? "onboarding-idp-row-rating" : undefined}
                          onClick={(e) => {
                            if (idx === 0) {
                              e.stopPropagation();
                              setSelectedEmployeeIDP(emp);
                              setModalPriorityFilter('ALL');
                              window.dispatchEvent(new CustomEvent('onboarding-idp-row-rating-clicked'));
                            }
                          }}
                          className="px-4 py-3 text-center"
                        >
                          <div className="flex items-center justify-center gap-2 min-w-[150px]">
                            {/* R1 */}
                            <div className={`w-9.5 h-9.5 rounded-full flex flex-col items-center justify-center hover:scale-105 transition-all cursor-default select-none border font-bold ${
                              r1Count > 0 
                                ? 'bg-red-500 text-white border-red-650 shadow-2xs' 
                                : 'bg-slate-50/70 text-slate-400 border-slate-200'
                            }`} title="R1 (Directing) Count">
                              <span className="text-[11.5px] font-black -mb-0.5">{r1Count}</span>
                              <span className={`text-[7.5px] leading-3 uppercase tracking-tighter block font-black ${
                                r1Count > 0 ? 'text-white/95' : 'text-slate-400'
                              }`}>R1</span>
                            </div>

                            {/* R2 */}
                            <div className={`w-9.5 h-9.5 rounded-full flex flex-col items-center justify-center hover:scale-105 transition-all cursor-default select-none border font-bold ${
                              r2Count > 0 
                                ? 'bg-amber-500 text-white border-amber-600 shadow-2xs' 
                                : 'bg-slate-50/70 text-slate-400 border-slate-200'
                            }`} title="R2 (Coaching) Count">
                              <span className="text-[11.5px] font-black -mb-0.5">{r2Count}</span>
                              <span className={`text-[7.5px] leading-3 uppercase tracking-tighter block font-black ${
                                r2Count > 0 ? 'text-white/95' : 'text-slate-400'
                              }`}>R2</span>
                            </div>

                            {/* R3 */}
                            <div className={`w-9.5 h-9.5 rounded-full flex flex-col items-center justify-center hover:scale-105 transition-all cursor-default select-none border font-bold ${
                              r3Count > 0 
                                ? 'bg-blue-600 text-white border-blue-700 shadow-2xs' 
                                : 'bg-slate-50/70 text-slate-400 border-slate-200'
                            }`} title="R3 (Supporting) Count">
                              <span className="text-[11.5px] font-black -mb-0.5">{r3Count}</span>
                              <span className={`text-[7.5px] leading-3 uppercase tracking-tighter block font-black ${
                                r3Count > 0 ? 'text-white/95' : 'text-slate-400'
                              }`}>R3</span>
                            </div>

                            {/* R4 */}
                            <div className={`w-9.5 h-9.5 rounded-full flex flex-col items-center justify-center hover:scale-105 transition-all cursor-default select-none border font-bold ${
                              r4Count > 0 
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs' 
                                : 'bg-slate-50/70 text-slate-400 border-slate-200'
                            }`} title="R4 (Delegating) Count">
                              <span className="text-[11.5px] font-black -mb-0.5">{r4Count}</span>
                              <span className={`text-[7.5px] leading-3 uppercase tracking-tighter block font-black ${
                                r4Count > 0 ? 'text-white/95' : 'text-slate-400'
                              }`}>R4</span>
                            </div>
                          </div>
                        </td>

                        {/* Mức ưu tiên (Top Priority count column) - Hot Trending style badge */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center items-center">
                            {topCount > 0 ? (
                              <div 
                                id={idx === 0 ? "onboarding-idp-row-priority" : undefined}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEmployeeIDP(emp);
                                  setModalPriorityFilter('PRIORITY_ONLY');
                                  if (idx === 0) {
                                    window.dispatchEvent(new CustomEvent('onboarding-idp-row-priority-clicked'));
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-md hover:shadow-lg hover:scale-105 active:scale-98 transition-all cursor-pointer animate-pulse border-0"
                                title={lang === 'VI' ? 'Bấm để lọc đúng các mục ưu tiên' : 'Click to filter prioritised duties'}
                              >
                                <span className="text-xs">🔥</span>
                                <span className="font-extrabold">{topCount} {lang === 'VI' ? 'ƯU TIÊN' : 'PRIORITY'}</span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-bold">—</span>
                            )}
                          </div>
                        </td>

                        {/* Interactive items view pill */}
                        <td className="px-5 py-3 text-center">
                          <div className="flex justify-center items-center">
                            <div 
                              id={idx === 0 ? "onboarding-idp-row-view-plan" : undefined}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEmployeeIDP(emp);
                                setModalPriorityFilter('ALL');
                                if (idx === 0) {
                                  window.dispatchEvent(new CustomEvent('onboarding-idp-row-view-plan-clicked'));
                                }
                              }}
                              className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-full px-4 py-1.5 shadow-3xs transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                              <span className="w-4.5 h-4.5 rounded-full bg-white text-indigo-700 text-[10px] font-black flex items-center justify-center shrink-0">
                                {emp.items.length}
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-wider select-none pr-1">
                                {lang === 'VI' ? 'Xem lộ trình' : 'View Plan'}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* EXPANDED DETAILED ITEMS PER EMPLOYEE - INNER JOB DUTIES SUB-TABLE */}
                      {expandedKey === empKey && (
                        <tr>
                          <td colSpan={7} className="px-5 py-4 bg-slate-50/50 border-t border-b border-dashed border-slate-200">
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-indigo-600" />
                                  <span>{lang === 'VI' ? `Danh sách lộ trình & công việc cụ thể: ${emp.viName}` : `Job Duties & Development Plan for: ${emp.viName}`}</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {lang === 'VI' ? `Mã NV: ${emp.empCode || '—'}` : `Emp Code: ${emp.empCode || '—'}`} ({emp.items.length} {lang === 'VI' ? 'nhiệm vụ' : 'duties'})
                                </span>
                              </div>

                              <div className="overflow-x-auto rounded-xl border border-slate-150">
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-wider text-left border-b border-slate-200">
                                      <th className="px-4 py-2.5 text-center w-10">#</th>
                                      <th className="px-4 py-2.5 w-1/4">{lang === 'VI' ? 'Nhiệm vụ công việc (Job Duty)' : 'Job Duty'}</th>
                                      <th className="px-4 py-2.5 text-center w-28">{lang === 'VI' ? 'Mức Sẵn sàng' : 'Readiness'}</th>
                                      <th className="px-4 py-2.5 w-1/4">{lang === 'VI' ? 'Định hướng (Way Forward)' : 'Way Forward'}</th>
                                      <th className="px-4 py-2.5 w-1/4">{lang === 'VI' ? 'Chương trình đề xuất' : 'Proposed Program'}</th>
                                      <th className="px-4 py-2.5 text-center w-24">{lang === 'VI' ? 'Thời hạn' : 'Timeline'}</th>
                                      <th className="px-4 py-2.5 w-32">{lang === 'VI' ? 'Người phụ trách' : 'Owner'}</th>
                                      {isLdMode && <th className="px-4 py-2.5 text-center w-24">{lang === 'VI' ? 'Hành động' : 'Actions'}</th>}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-150 text-xs text-left bg-white">
                                    {emp.items.map((item, subIdx) => {
                                      const isItemEditing = editingId === item.id;
                                      const rTheme = getRatingTheme(item.rRating, lang);

                                      return (
                                        <React.Fragment key={item.id}>
                                          <tr className={`hover:bg-slate-50/50 transition-colors ${item.topOpportunity && item.topOpportunity.trim() === 'X' ? 'bg-amber-50/15' : ''}`}>
                                            <td className="px-4 py-3 text-center font-bold text-slate-400">
                                              {subIdx + 1}
                                            </td>
                                            
                                            <td className="px-4 py-3 font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                                              <div>{item.jobDuty || '—'}</div>
                                              {item.topOpportunity && item.topOpportunity.trim() === 'X' && (
                                                <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm mt-1 uppercase tracking-wider animate-pulse">
                                                  🔥 {lang === 'VI' ? 'Trọng tâm' : 'Priority'}
                                                </span>
                                              )}
                                              {item.comments && (
                                                <div className="mt-1.5 bg-amber-50/30 border border-amber-100 px-2 py-1.5 rounded text-[10px] italic text-slate-600">
                                                  <span className="not-italic font-extrabold text-[8px] text-amber-800 uppercase block">
                                                    {lang === 'VI' ? 'Nhận xét từ BGĐ/HRBP:' : 'Leadership note:'}
                                                  </span>
                                                  {item.comments}
                                                </div>
                                              )}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                              {item.rRating ? (
                                                <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[9.5px] font-black uppercase tracking-wider border ${rTheme.badge}`}>
                                                  {item.rRating}
                                                </span>
                                              ) : (
                                                <span className="text-slate-300 font-bold">—</span>
                                              )}
                                            </td>

                                            <td className="px-4 py-3 text-slate-650 leading-relaxed whitespace-pre-line font-medium">
                                              {item.wayForward || '—'}
                                            </td>

                                            <td className="px-4 py-3 text-indigo-950 font-bold leading-relaxed whitespace-pre-line">
                                              {item.proposedProgram || '—'}
                                            </td>

                                            <td className="px-4 py-3 text-center font-semibold text-slate-600">
                                              {item.timeline || '—'}
                                            </td>

                                            <td className="px-4 py-3 font-semibold text-slate-700 leading-tight">
                                              {translateOwner(item.owner || '—')}
                                            </td>

                                            {isLdMode && (
                                              <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                  <button
                                                    onClick={(e) => { e.stopPropagation(); startEditing(item); }}
                                                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors border border-transparent hover:border-indigo-100 cursor-pointer"
                                                    title={lang === 'VI' ? 'Sửa' : 'Edit'}
                                                  >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeletePlan(item.id, emp.viName); }}
                                                    className="p-1 text-slate-400 hover:text-rose-650 hover:bg-slate-100 rounded transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
                                                    title={lang === 'VI' ? 'Xóa' : 'Delete'}
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              </td>
                                            )}
                                          </tr>

                                          {/* Inline Editing Form */}
                                          {isItemEditing && (
                                            <tr>
                                              <td colSpan={isLdMode ? 8 : 7} className="px-4 py-3 bg-indigo-50/15">
                                                <div className="p-4 border border-indigo-100 rounded-xl bg-white space-y-4 animate-in fade-in duration-150 text-left">
                                                  <h5 className="font-black text-indigo-955 uppercase text-[10px] tracking-wider border-b border-indigo-50 pb-1.5 flex items-center gap-1.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                                    <span>{lang === 'VI' ? 'Chỉnh sửa nhanh nội dung' : 'Quick edit content'}</span>
                                                  </h5>
                                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                    <div>
                                                      <label className="block text-[9px] uppercase font-black text-slate-400">{lang === 'VI' ? 'Rating' : 'Rating'}</label>
                                                      <input 
                                                        type="text" 
                                                        value={editForm.rRating || ''} 
                                                        onChange={e => setEditForm({ ...editForm, rRating: e.target.value })}
                                                        className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-semibold outline-indigo-500"
                                                      />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                      <label className="block text-[9px] uppercase font-black text-slate-400">{lang === 'VI' ? 'Nhiệm vụ đào tạo (Job Duty)' : 'Job Duty'}</label>
                                                      <textarea 
                                                        rows={2}
                                                        value={editForm.jobDuty || ''} 
                                                        onChange={e => setEditForm({ ...editForm, jobDuty: e.target.value })}
                                                        className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium outline-indigo-500 text-slate-800"
                                                      />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                      <label className="block text-[9px] uppercase font-black text-slate-400">{lang === 'VI' ? 'Way Forward Steps' : 'Way Forward Steps'}</label>
                                                      <textarea 
                                                        rows={2}
                                                        value={editForm.wayForward || ''} 
                                                        onChange={e => setEditForm({ ...editForm, wayForward: e.target.value })}
                                                        className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium outline-indigo-500 text-indigo-900"
                                                      />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                      <label className="block text-[9px] uppercase font-black text-slate-400">{lang === 'VI' ? 'Chương trình đề xuất' : 'Proposed Program'}</label>
                                                      <textarea 
                                                        rows={2}
                                                        value={editForm.proposedProgram || ''} 
                                                        onChange={e => setEditForm({ ...editForm, proposedProgram: e.target.value })}
                                                        className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium outline-indigo-500 text-emerald-950"
                                                      />
                                                    </div>
                                                    <div>
                                                      <label className="block text-[9px] uppercase font-black text-slate-400">{lang === 'VI' ? 'Thời hạn' : 'Timeline'}</label>
                                                      <input 
                                                        type="text" 
                                                        value={editForm.timeline || ''} 
                                                        onChange={e => setEditForm({ ...editForm, timeline: e.target.value })}
                                                        className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium outline-indigo-500"
                                                      />
                                                    </div>
                                                    <div>
                                                      <label className="block text-[9px] uppercase font-black text-slate-400">{lang === 'VI' ? 'Người phụ trách' : 'Owner'}</label>
                                                      <input 
                                                        type="text" 
                                                        value={editForm.owner || ''} 
                                                        onChange={e => setEditForm({ ...editForm, owner: e.target.value })}
                                                        className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium outline-indigo-500"
                                                      />
                                                    </div>
                                                    <div className="md:col-span-2 flex items-end justify-end gap-2 text-[10px]">
                                                      <button 
                                                        onClick={() => setEditingId(null)}
                                                        className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold rounded-lg cursor-pointer"
                                                      >
                                                        {lang === 'VI' ? 'Hủy' : 'Cancel'}
                                                      </button>
                                                      <button 
                                                        onClick={() => saveEditValue(item.id)}
                                                        className="px-4 py-2 bg-indigo-600 text-white font-extrabold rounded-lg hover:bg-indigo-700 flex items-center gap-1 cursor-pointer shadow-3xs"
                                                      >
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>{lang === 'VI' ? 'Cập nhật' : 'Update'}</span>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* DETAILS MODAL OVERLAY */}
      {selectedDetailPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header banner */}
            <div className="bg-slate-900 text-white p-6 relative shrink-0">
              <button 
                onClick={() => setSelectedDetailPlan(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {lang === 'VI' ? 'KẾ HOẠCH PHÁT TRIỂN NĂNG LỰC CÁ NHÂN' : 'INDIVIDUAL DEVELOPMENT ROADMAP'}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-black px-2 py-1 rounded-md">
                  ID: {selectedDetailPlan.empCode || 'N/A'}
                </span>
              </div>
              
              <h2 className="text-xl font-black font-display text-white mt-2.5 tracking-tight">
                {selectedDetailPlan.viName}
              </h2>
              
              <div className="flex flex-wrap items-center mt-3 gap-y-2 gap-x-5 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  {selectedDetailPlan.title || '—'}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  {selectedDetailPlan.department || 'Executive'}
                </span>
                {selectedDetailPlan.section && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    {selectedDetailPlan.section}
                  </span>
                )}
                <span className="flex items-center gap-1 ml-auto">
                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    {selectedDetailPlan.site || 'Millennium'} ({selectedDetailPlan.location || 'MLN'})
                  </span>
                </span>
              </div>
            </div>

            {/* Scrollable contents */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column Left: Development Roadmap & Course focus (span 2) */}
                <div className="lg:col-span-2 space-y-5">
                  
                  {/* Action Roadmap Card */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs space-y-4">
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>{lang === 'VI' ? 'Định Hướng Phát Triển Năng Lực' : 'Capability Development Path'}</span>
                    </h3>
                    
                    <div className="space-y-4 text-left">
                      {/* Job duty detail */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                          {lang === 'VI' ? 'Nhiệm vụ đào tạo (Job Duty):' : 'Training Responsibility (Job Duty):'}
                        </label>
                        <p className="text-slate-800 text-xs font-semibold whitespace-pre-line bg-slate-50 border border-slate-150 p-3 rounded-xl leading-relaxed">
                          {selectedDetailPlan.jobDuty || '—'}
                        </p>
                      </div>

                      {/* Way forward */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                          {lang === 'VI' ? 'Định hướng đi tiếp (Way Forward):' : 'Way Forward Steps:'}
                        </label>
                        <div className="bg-indigo-50/30 border border-indigo-100 p-3.5 rounded-xl">
                          <p className="text-indigo-950 text-xs font-bold leading-relaxed whitespace-pre-line">
                            {selectedDetailPlan.wayForward || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Target proposed program */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                          {lang === 'VI' ? 'Chương trình đề xuất:' : 'Proposed L&D Program:'}
                        </label>
                        <div className="flex items-center gap-2.5 bg-emerald-50/30 border border-emerald-150 p-3 rounded-xl">
                          <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-extrabold text-xs text-emerald-900">
                            {selectedDetailPlan.proposedProgram || 'People Development / IDP & Skill Matrix'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Mapping and categorization */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs text-left">
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                      <span>{lang === 'VI' ? 'Nhu Cầu Phân Loại Tổ Chức' : 'Needs & Mapping Alignment'}</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pt-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-extrabold block">{lang === 'VI' ? 'Nhu cầu quy chiếu (Mapped Need):' : 'Mapped Need:'}</span>
                        <span className="font-bold text-slate-850 block">{selectedDetailPlan.mappedNeed || '—'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-extrabold block">{lang === 'VI' ? 'Trọng tâm năng lực (Focus Area):' : 'Competency Focus:'}</span>
                        <span className="font-bold text-slate-850 block">{selectedDetailPlan.competencyFocus || '—'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-extrabold block">{lang === 'VI' ? 'Phân loại đào tạo (Category):' : 'Training Category:'}</span>
                        <span className="font-bold text-slate-850 block">{translateCategory(selectedDetailPlan.trainingCategory) || '—'}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-extrabold block">Source Database File:</span>
                        <span className="font-mono text-[9.5px] text-slate-500 bg-slate-50 py-0.5 px-1.5 rounded block whitespace-normal truncate" title={selectedDetailPlan.sourceFile}>
                          {selectedDetailPlan.sourceFile || '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Column Right: Timeline & Pending Action Items (span 1) */}
                <div className="space-y-5 text-left">
                  
                  {/* Timeline block */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs space-y-4">
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-655" />
                      <span>{lang === 'VI' ? 'Lộ Trình Thời Gian' : 'Timeline Milestones'}</span>
                    </h3>

                    {/* Timeline dynamic state steps visualization */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 bg-indigo-50/45 p-2 rounded-xl border border-indigo-100">
                        <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="font-black text-xs text-indigo-950">
                          {selectedDetailPlan.timeline ? selectedDetailPlan.timeline : (lang === 'VI' ? 'Kế hoạch liên tục' : 'Continuous cycle')}
                        </span>
                      </div>

                      {/* Step visual timeline flow */}
                      <div className="border-l-2 border-indigo-105 pl-4 py-1 space-y-4 text-xs">
                        <div className="relative">
                          <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full ring-4 bg-indigo-600 ring-indigo-50"></span>
                          <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider block">Stage 1: Launch</span>
                          <span className="text-slate-650 mt-0.5 block">{lang === 'VI' ? 'Duyệt chỉ mục lộ trình' : 'Establish development targets'}</span>
                        </div>
                        <div className="relative">
                          <span className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full ring-4 ${
                            selectedDetailPlan.timeline && (selectedDetailPlan.timeline.toLowerCase().includes('q2') || selectedDetailPlan.timeline.toLowerCase().includes('q3') || selectedDetailPlan.timeline.toLowerCase().includes('q4') || selectedDetailPlan.timeline.toLowerCase().includes('annual') || selectedDetailPlan.timeline.toLowerCase().includes('cycle'))
                              ? 'bg-indigo-600 ring-indigo-50' 
                              : 'bg-indigo-600 ring-indigo-50'
                          }`}></span>
                          <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider block">Stage 2: Active</span>
                          <span className="text-slate-655 mt-0.5 block">
                            {selectedDetailPlan.timeline ? `${lang === 'VI' ? 'Thực hiện:' : 'Perform:'} ${selectedDetailPlan.timeline}` : (lang === 'VI' ? 'Triển khai thực tế' : 'Active roadmap roll-out')}
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full ring-4 bg-indigo-600 ring-indigo-50"></span>
                          <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider block">Stage 3: Integration</span>
                          <span className="text-slate-655 mt-0.5 block">{lang === 'VI' ? 'Tích hợp vào KH Đào tạo chính' : 'Merge into official training cycle'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments / Owner Memo Block */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">{lang === 'VI' ? 'Người giao việc (Owner):' : 'Owner Assigned:'}</span>
                        <span className="font-bold text-slate-800 text-[11px] block mt-0.5">{translateOwner(selectedDetailPlan.owner) || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">R-Rating:</span>
                        <span className="font-bold text-indigo-700 text-[11px] block mt-0.5">
                          {selectedDetailPlan.rRating || '—'} 
                          <span className="font-normal text-[9px] text-slate-400"> ({
                            selectedDetailPlan.rRating === 'R4' ? (lang === 'VI' ? 'Sẵn sàng' : 'Ready') : 
                            selectedDetailPlan.rRating === 'R3' ? (lang === 'VI' ? 'Kinh nghiệm' : 'Experienced') : 
                            (lang === 'VI' ? 'Cần hỗ trợ' : 'Needs support')
                          })</span>
                        </span>
                      </div>
                    </div>

                    {/* Interactive Comments addition */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-150">
                      <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">{lang === 'VI' ? 'Ghi chú & Chỉ đạo của BGĐ/HRBP:' : 'Leadership Remarks & Notes:'}</span>
                      <textarea
                        value={selectedDetailPlan.comments || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedDetailPlan(prev => prev ? { ...prev, comments: val } : null);
                          setPlans(prev => prev.map(p => p.id === selectedDetailPlan.id ? { ...p, comments: val } : p));
                        }}
                        rows={3}
                        placeholder={lang === 'VI' ? 'Nhập ghi chú ý kiến chỉ đạo...' : 'Add feedback comments...'}
                        className="w-full mt-1 p-2 text-xs bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg outline-none font-medium text-slate-700 transition-colors placeholder:italic"
                      />
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-100 p-5 shrink-0 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedDetailPlan(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-3xs"
              >
                {lang === 'VI' ? 'ĐÓNG SỔ REVIEW' : 'CLOSE SHEET'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMPLOYEE PORTFOLIO MODAL (POPUP SYSTEM FOR ALL INTERNAL ITEMS) */}
      {selectedEmployeeIDP && activeModalEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div id="onboarding-idp-modal" className="bg-white rounded-3xl border border-slate-205 w-full max-w-[96vw] xl:max-w-7xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-205 flex flex-col h-[88vh] max-h-[88vh] sm:h-[90vh] sm:max-h-[90vh]">
            
            {/* Modal Header - Collapses cleanly when scrolled to optimize table viewing space */}
            <div className={`bg-slate-900 text-white relative shrink-0 border-b border-slate-850 transition-all duration-300 ease-in-out ${
              isModalScrolled ? 'py-3 px-6 shadow-sm' : 'p-5.5'
            }`}>
              <button 
                id="onboarding-idp-modal-close-btn"
                onClick={() => {
                  setSelectedEmployeeIDP(null);
                  window.dispatchEvent(new CustomEvent('onboarding-idp-modal-closed'));
                }}
                className={`absolute text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer z-10 transition-all duration-300 ${
                  isModalScrolled ? 'top-2.5 right-4 p-1.5' : 'top-4 right-4 p-2'
                } focus:ring-2 focus:ring-indigo-500`}
              >
                <X className="w-4 h-4 text-white" />
              </button>
              
              <div className="space-y-1.5 transition-all duration-300">
                {/* IDP tag at the top left - collapses when scrolled to pull the header up */}
                <div className={`transition-all duration-300 ease-in-out ${
                  isModalScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'
                }`}>
                  <span className="text-[9px] bg-indigo-505/25 border border-indigo-400/25 text-indigo-305 font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {lang === 'VI' ? 'HỒ SƠ LỘ TRÌNH ĐÀO TẠO CÁ NHÂN (IDP)' : 'INDIVIDUAL DEVELOPMENT PORTFOLIO'}
                  </span>
                </div>
                
                {/* Employee info layout - when scrolled, it wraps compact horizontally with Name */}
                <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 transition-all duration-300 ${
                  isModalScrolled ? 'mt-0' : 'mt-2.5'
                }`}>
                  <h2 className={`font-black font-sans text-white tracking-tight flex items-center gap-1.5 shrink-0 transition-all duration-300 ${
                    isModalScrolled ? 'text-lg' : 'text-xl'
                  }`}>
                    <span>{activeModalEmployee.viName}</span>
                    {activeModalEmployee.engName && activeModalEmployee.engName !== activeModalEmployee.viName && (
                      <span className="text-xs text-slate-405 font-medium font-mono">({activeModalEmployee.engName})</span>
                    )}
                  </h2>
                  
                  <div className="flex items-center gap-2.5 font-semibold flex-wrap text-xs text-slate-350 animate-in fade-in duration-200">
                    <span className="text-slate-800 select-none hidden sm:inline">|</span>
                    
                    <span className="bg-slate-850 text-slate-300 font-mono text-[9px] px-2 py-0.5 rounded-sm flex items-center gap-1 border border-slate-750">
                      <span className="text-slate-450 font-bold">{lang === 'VI' ? 'Mã NV:' : 'ID:'}</span>
                      <span className="font-extrabold text-white">{activeModalEmployee.empCode || 'N/A'}</span>
                    </span>

                    <span className="text-slate-800 select-none hidden sm:inline">|</span>

                    <span className="flex items-center gap-1 text-slate-200">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="font-bold text-slate-150">{activeModalEmployee.title || '—'}</span>
                    </span>

                    <span className="text-slate-800 select-none hidden sm:inline">|</span>

                    <span className="flex items-center gap-1 text-indigo-200">
                      <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="font-bold text-slate-150">{activeModalEmployee.department || 'Executive'}</span>
                      {activeModalEmployee.section && (
                        <span className="text-[10px] text-slate-350 bg-slate-800 px-1.5 py-0.5 rounded ml-1 font-semibold border border-slate-750 transition-all">
                          {activeModalEmployee.section}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statically nested white floating bar under the modal header, but above the scrollable modal body */}
            {activeModalEmployee.items.length > 0 && (
              <div className="bg-white border-b border-slate-200 px-6 py-2.5 shrink-0 select-none z-30">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">
                      {lang === 'VI' ? 'SỐ ĐẾM R:' : 'READINESS COUNTS:'}
                    </span>
                    {['R4', 'R3', 'R2', 'R1'].map((lvl) => {
                      const count = activeModalLevelCounts[lvl as 'R1' | 'R2' | 'R3' | 'R4'] || 0;
                      // Highlight R1 in clean Red tone
                      const chipColor = lvl === 'R1' ? 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100/30' :
                                        lvl === 'R2' ? 'text-amber-700 bg-amber-50 border-amber-150 hover:bg-amber-105/30' :
                                        lvl === 'R3' ? 'text-blue-700 bg-blue-50 border-blue-150 hover:bg-blue-100/30' :
                                        'text-emerald-700 bg-emerald-50 border-emerald-150 hover:bg-emerald-100/30';
                      return (
                        <span key={lvl} className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[11.5px] font-extrabold ${chipColor} transition-colors`}>
                          <span className="font-mono text-[9.5px] uppercase tracking-wide opacity-80">{lvl}</span>
                          <span className="font-sans leading-none font-black">{count}</span>
                        </span>
                      );
                    })}

                    <span className="text-slate-200 text-xs px-1">|</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">
                        {lang === 'VI' ? 'TIẾN ĐỘ:' : 'RATE:'}
                      </span>
                      <span className="text-[11px] font-mono font-black text-emerald-600">
                        {activeModalProgress}%
                      </span>
                      <div className="relative w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${activeModalProgress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsDashboardCollapsed(!isDashboardCollapsed)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-250 text-[10.5px] text-slate-700 font-extrabold rounded-lg transition-all duration-150 cursor-pointer shadow-3xs hover:border-slate-350"
                    >
                      {isDashboardCollapsed ? (
                        <>
                          <span className="text-emerald-500">➕</span>
                          <span>{lang === 'VI' ? 'Xem Tiện Ích AI' : 'Expand AI Panel'}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-rose-500">➖</span>
                          <span>{lang === 'VI' ? 'Thu Gọn Tiện Ích AI' : 'Collapse AI Panel'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal scroll-stabilized Items Portfolio */}
            <div 
              id="onboarding-idp-modal-body"
              className={`bg-slate-50/75 flex flex-col flex-grow overflow-y-auto h-full min-h-0 transition-all duration-300 ${
                isModalScrolled ? 'p-3 gap-2' : 'p-6 gap-4'
              }`}
              onScroll={handleModalScroll}
            >
              {activeModalEmployee.items.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-450 italic text-xs">
                  {lang === 'VI' ? 'Nhân sự này chưa có hạng mục kế hoạch nào.' : 'This personnel does not have any plan entries assigned.'}
                </div>
              ) : (() => {
                const itemsFilteredAndSorted = activeModalEmployee.items.filter(item => {
                  const isPrior = (item.topOpportunity || '').toUpperCase().trim() === 'X';
                  const matchP = modalPriorityFilter === 'ALL' || 
                    (modalPriorityFilter === 'PRIORITY_ONLY' && isPrior) ||
                    (modalPriorityFilter === 'NORMAL_ONLY' && !isPrior);
                  return matchP;
                });

                // Complex sort ordering
                if (modalSortKey && modalSortDir) {
                  const multiplier = modalSortDir === 'asc' ? 1 : -1;
                  itemsFilteredAndSorted.sort((a, b) => {
                    const valA = a[modalSortKey] || '';
                    const valB = b[modalSortKey] || '';
                    return String(valA).localeCompare(String(valB), lang === 'VI' ? 'vi' : 'en') * multiplier;
                  });
                } else {
                  itemsFilteredAndSorted.sort((a, b) => {
                    const aPrior = (a.topOpportunity || '').toUpperCase().trim() === 'X';
                    const bPrior = (b.topOpportunity || '').toUpperCase().trim() === 'X';
                    if (aPrior && !bPrior) return -1;
                    if (!aPrior && bPrior) return 1;
                    return 0;
                  });
                }

                const proposedProgramsList = Array.from(
                  new Set(activeModalEmployee.items.map(item => item.proposedProgram).filter(Boolean))
                );

                return (
                  <div className="flex flex-col gap-3.5 flex-grow min-h-0">

                    {/* Visual Progress & AI assistant panel, hidden when collapsed to maximize table space */}
                    <div id="onboarding-idp-ai-panel" className={`grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 transition-all duration-300 ${
                      isDashboardCollapsed ? 'h-0 opacity-0 overflow-hidden mb-0' : 'mb-1.5'
                    }`}>
                      {/* Progress Bar Column */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                              {lang === 'VI' ? 'Tiến độ Đào tạo & Thiết lập' : 'TRAINING & SETUP PROGRESS'}
                            </span>
                            <span className="text-[11px] font-mono font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-150">
                              {activeModalProgress}%
                            </span>
                          </div>

                          <div className="space-y-4">
                            {/* Linear/Progress Indicator Bar */}
                            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                              <div 
                                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500" 
                                style={{
                                  width: `${activeModalProgress}%`
                                }}
                              />
                            </div>

                            {/* Summary description */}
                            <p className="text-[10.5px] text-slate-500 leading-normal">
                              {lang === 'VI' 
                                ? 'Phần trăm hoàn thành phản ánh mức sẵn sàng phát triển trên tất cả năng lực (R1-Directing = 25%, R2-Coaching = 50%, R3-Supporting = 75%, R4-Delegating = 100%).'
                                : 'Completion rate calculates cumulative developmental progress across competency readiness (R1 = 25%, R2 = 50%, R3 = 75%, R4 = 100%).'}
                            </p>
                          </div>
                        </div>

                        {/* Stats breakdown by readiness level */}
                        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-100 mt-4">
                          {['R1', 'R2', 'R3', 'R4'].map((lvl) => {
                            const count = activeModalLevelCounts[lvl as 'R1' | 'R2' | 'R3' | 'R4'] || 0;
                            const colors = lvl === 'R1' ? 'text-red-650 bg-red-50/50 border-red-100' :
                                           lvl === 'R2' ? 'text-amber-705 bg-amber-50/50 border-amber-100' :
                                           lvl === 'R3' ? 'text-blue-600 bg-blue-50/50 border-blue-100' :
                                           'text-emerald-700 bg-emerald-50/50 border-emerald-100';
                            return (
                              <div key={lvl} className={`text-center border rounded-xl py-1 px-1.5 ${colors}`}>
                                <span className="block text-[8px] font-black">{lvl}</span>
                                <span className="block text-xs font-black mt-0.5">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* AI recommendations Column - Spans 2 */}
                      <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50/45 to-purple-50/45 border border-indigo-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-3.5">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-wrap items-center gap-1.5 text-indigo-950">
                              <Sparkles className="w-4.5 h-4.5 text-indigo-600 animate-pulse shrink-0" />
                              <span className="text-[10px] font-black uppercase tracking-wider pl-0.5 font-sans">
                                {lang === 'VI' ? 'Đề xuất phát triển cá nhân hóa (AI)' : 'INDIVIDUALIZED AI DEVELOPMENT PATHWAY'}
                              </span>
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-md text-[8px] font-black text-amber-700 font-sans uppercase tracking-wider select-none shrink-0">
                                ⚠️ {lang === 'VI' ? 'Hỗ trợ tham khảo' : 'AI-Assisted Reference'}
                              </span>
                            </div>
                            {personalAiAdvice && !isPersonalAiLoading && (
                              <button
                                onClick={() => handleLoadPersonalAiAdvice(activeModalEmployee.viName, activeModalEmployee.title, activeModalEmployee.department, activeModalEmployee.items)}
                                className="text-[9px] bg-indigo-100/80 hover:bg-indigo-200 text-indigo-700 font-bold px-2.5 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer select-none"
                              >
                                <RefreshCw className="w-2.5 h-2.5" />
                                {lang === 'VI' ? 'Tải lại' : 'Refresh'}
                              </button>
                            )}
                          </div>

                          {isPersonalAiLoading ? (
                            <div className="py-12 flex flex-col items-center justify-center space-y-2.5">
                              <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                              <span className="text-[11px] text-indigo-900 font-sans font-black animate-pulse">
                                {lang === 'VI' 
                                  ? `Đang rà soát và cấu trúc lộ trình tối ưu cho ${activeModalEmployee.viName}...` 
                                  : `Scanning ${activeModalEmployee.viName}'s actual IDP gaps & mapping internal courses...`}
                              </span>
                            </div>
                          ) : personalAiError ? (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 flex items-start gap-2.5 select-none font-sans">
                              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <p className="font-bold">{lang === 'VI' ? 'Lỗi Trợ lý AI cá nhân' : 'Personal AI Assistant Connection Error'}</p>
                                <p className="opacity-90 leading-normal">{personalAiError}</p>
                                <button
                                  onClick={() => handleLoadPersonalAiAdvice(activeModalEmployee.viName, activeModalEmployee.title, activeModalEmployee.department, activeModalEmployee.items)}
                                  className="mt-1 pb-0.5 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-black rounded-lg transition"
                                >
                                  {lang === 'VI' ? 'Thử lại' : 'Retry'}
                                </button>
                              </div>
                            </div>
                          ) : personalAiAdvice ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-y-auto max-h-[165px] scrollbar-thin py-0.5">
                              {personalAiAdvice.map((rec, index) => (
                                <div key={rec.id || index} className="bg-white border border-indigo-100/80 hover:border-indigo-200/90 rounded-2xl p-3.5 shadow-3xs flex flex-col justify-between transition-colors text-left">
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between select-none">
                                      <span className="text-[8px] bg-indigo-50 text-indigo-700 border border-indigo-100/70 font-black px-1.5 py-0.5 rounded uppercase max-w-[130px] truncate">
                                        {rec.mappedGaps}
                                      </span>
                                      <span className="text-[8px] text-slate-400 font-mono font-semibold">{rec.timeline}</span>
                                    </div>
                                    <h5 className="text-[11px] font-black text-slate-800 line-clamp-2 leading-snug font-sans">
                                      {rec.internalProgram}
                                    </h5>
                                    <p className="text-[9.5px] text-slate-500 leading-relaxed font-normal font-sans">
                                      {lang === 'VI' ? rec.viAdvice || rec.advice : rec.advice}
                                    </p>
                                  </div>
                                  <div className="pt-2 border-t border-slate-50 mt-2 flex items-center justify-between">
                                    <span className="text-[8.5px] font-sans font-bold text-slate-450 truncate max-w-[100px]" title={rec.targetDuty}>
                                      {rec.targetDuty}
                                    </span>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full select-none ${
                                      (rec.actionType || '').includes('Training') ? 'bg-indigo-50 text-indigo-805 border border-indigo-150' : 'bg-slate-50 text-slate-650 border border-slate-205'
                                    }`}>
                                      {lang === 'VI' 
                                        ? (rec.actionType === 'Add to Training Plan' ? 'Khóa tập trung' : 'Bộ phận OJT') 
                                        : rec.actionType}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-6 px-4 flex flex-col items-center justify-center text-center space-y-3 px-3">
                              <p className="text-[10.5px] text-slate-500 max-w-lg leading-normal font-sans">
                                {lang === 'VI'
                                  ? `Trợ lý AI bám sát dữ liệu Lộ trình đào tạo hiện tại gồm ${activeModalEmployee.items.length} mục để thiết kế đề xuất khóa học nội bộ chuẩn và bộ lộ trình hành động chi tiết dành riêng cho ${activeModalEmployee.viName}.`
                                  : `AI will scan ${activeModalEmployee.viName}'s current development items and context gaps to draft localized courses and a tailored action roadmap.`}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleLoadPersonalAiAdvice(activeModalEmployee.viName, activeModalEmployee.title, activeModalEmployee.department, activeModalEmployee.items)}
                                className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm transition-all active:scale-[0.98] hover:shadow-md cursor-pointer select-none"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                {lang === 'VI' ? 'Tạo đề xuất cá nhân hóa' : 'Generate Tailored Roadmap'}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* AI Personalization Advisory Disclaimer Warning */}
                        <div className="flex items-start gap-2 p-2.5 bg-rose-50/70 border border-rose-200/60 rounded-xl text-[10px] sm:text-[11px] leading-relaxed text-rose-800 shadow-3xs select-none">
                          <BellRing className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
                          <div>
                            <span className="font-extrabold uppercase tracking-wider text-rose-900 mr-1.5 inline-block text-[9.5px] sm:text-[10.5px]">
                              {lang === 'VI' ? '⚠️ ĐỀ XUẤT HỖ TRỢ TỪ AI:' : '⚠️ AI-DRIVEN ASSISTANT SUGGESTION:'}
                            </span>
                            {lang === 'VI'
                              ? 'Đề xuất này được tạo tự động bởi Trợ lý AI để hỗ trợ tham khảo. Các quyết định cuối cùng thuộc về các Bộ phận Chức năng/ Chuyên môn hoặc Trưởng bộ phận.'
                              : 'These development pathways are suggested automatically by AI for reference. Final decisions belong to the Functional/Specialized Departments or Department Heads.'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`text-left flex items-center justify-between shrink-0 transition-all duration-300 ease-in-out ${
                      isDashboardCollapsed ? 'h-5 opacity-105 mb-1' : 'h-5 opacity-100 mb-1'
                    }`}>
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest pl-0.5 flex items-center gap-3 select-none">
                        <span>{lang === 'VI' ? `BẢNG LỘ TRÌNH ĐÀO TẠO CHI TIẾT (${itemsFilteredAndSorted.length} HẠNG MỤC PHÁT TRIỂN)` : `DETAILED TRAINING ACTION PLAN (${itemsFilteredAndSorted.length} GOALS)`}</span>
                        {isLdMode && (
                          <button
                            type="button"
                            onClick={resetColumnOrder}
                            className="px-2.5 py-0.5 text-[9.5px] font-bold text-indigo-700 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded border border-indigo-200 cursor-pointer shadow-3xs transition-all tracking-normal uppercase"
                            title={lang === 'VI' ? 'Đặt lại thứ tự cột ban đầu' : 'Reset columns positions'}
                          >
                            🔄 {lang === 'VI' ? 'Khôi phục cột mặc định' : 'Reset Columns'}
                          </button>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 select-none">
                        {isLdMode ? (
                          <span className="text-[9.5px] text-indigo-750 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100 font-medium animate-pulse">
                            💡 {lang === 'VI' ? 'Kéo thả tiêu đề cột để đổi vị trí' : 'Drag column headers to reorder'}
                          </span>
                        ) : (
                          <span className="text-[9.5px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 font-medium">
                            🔒 {lang === 'VI' ? 'Giao diện xem phân tích (HRBP & HOD)' : 'Analytical View Mode'}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-bold italic">
                          {lang === 'VI' ? '* Cuộn dọc/ngang xem Excel' : '* Scroll vertically/horizontally'}
                        </span>
                      </div>
                    </div>

                    <div id="onboarding-idp-modal-table" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col shrink-0 mb-4 h-auto">
                      <div id="onboarding-idp-modal-table-scroll-container" className="overflow-auto max-h-[380px] xl:max-h-[460px] scrollbar-thin">
                        <table className={`w-full text-left border-collapse ${isLdMode ? 'min-w-[2450px]' : 'min-w-[1450px]'}`}>
                          <thead>
                            <tr className="bg-[#1e1b4b] border-b border-[#0f172a] text-[10.5px] font-black text-indigo-100 uppercase tracking-widest sticky top-0 z-25 select-none">
                              {/* STT sticky header - sticky left & top */}
                              <th className="px-3 py-3.5 w-[50px] text-center border-r border-[#0f172a] sticky left-0 top-0 bg-[#1e1b4b] z-40 shadow-[2px_0_5px_rgba(0,0,0,0.03)] text-indigo-200">STT</th>
                              
                              {/* Draggable and Persistent headers */}
                              {visibleIdpColumns.map((col) => {
                                const isSorting = modalSortKey === col.key;
                                return (
                                  <th
                                    key={col.key}
                                    draggable={isLdMode}
                                    onDragStart={(e) => isLdMode && handleColumnDragStart(e, col.key)}
                                    onDragOver={(e) => isLdMode && handleColumnDragOver(e, col.key)}
                                    onDrop={(e) => isLdMode && handleColumnDrop(e, col.key)}
                                    onDragEnd={isLdMode ? handleColumnDragEnd : undefined}
                                    onClick={() => {
                                      // Sort by column key
                                      if (modalSortKey === col.key) {
                                        setModalSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                                      } else {
                                        setModalSortKey(col.key);
                                        setModalSortDir('asc');
                                      }
                                    }}
                                    className={`px-4 py-3.5 ${col.width} cursor-grab active:cursor-grabbing hover:bg-indigo-905/60 border-r border-[#0f172a] transition-all select-none sticky top-0 bg-[#1e1b4b] z-30 ${
                                      draggedColKey === col.key ? 'opacity-40' : ''
                                    } ${dragOverColKey === col.key ? 'border-l-2 border-l-indigo-400 bg-indigo-905/60' : ''}`}
                                    title={lang === 'VI' ? 'Kéo để đổi vị trí, click để sắp xếp' : 'Drag to reorder, click to sort'}
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="truncate">{lang === 'VI' ? col.labelVi : col.labelEn}</span>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <ArrowUpDown className={`w-3.5 h-3.5 ${isSorting ? 'text-indigo-200 font-bold' : 'text-[#64748b] opacity-70'}`} />
                                        <span className="text-[8px] text-[#64748b] font-normal cursor-grab" title={lang === 'VI' ? 'Kéo thả' : 'Drag handle'}>☰</span>
                                      </div>
                                    </div>
                                  </th>
                                );
                              })}
                              
                              {/* Sticky top-0 for active action container */}
                              <th className="px-3 py-3.5 w-[140px] text-center uppercase sticky top-0 bg-[#1e1b4b] text-indigo-200 z-25 border-r border-[#0f172a]">{lang === 'VI' ? 'Thao tác' : 'Actions'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-150 text-[11.5px] text-slate-700">
                            {itemsFilteredAndSorted.map((item: IndividualIDP, idx: number) => {
                              const isTopPriority = (item.topOpportunity || '').toUpperCase().trim() === 'X';

                              const rRatingVal = (item.rRating || '').toUpperCase().trim();
                              let rowBgClass = "bg-white hover:bg-indigo-50/20";
                              if (rRatingVal.includes('R1')) {
                                rowBgClass = "bg-red-50/15 hover:bg-red-50/30";
                              } else if (rRatingVal.includes('R2')) {
                                rowBgClass = "bg-amber-50/15 hover:bg-amber-50/30";
                              } else if (rRatingVal.includes('R3')) {
                                rowBgClass = "bg-blue-50/15 hover:bg-blue-50/30";
                              } else if (rRatingVal.includes('R4')) {
                                rowBgClass = "bg-emerald-50/15 hover:bg-emerald-50/30";
                              }

                              const isR1 = rRatingVal.includes('R1');
                              const isR2 = rRatingVal.includes('R2');
                              const isR3 = rRatingVal.includes('R3');
                              const isR4 = rRatingVal.includes('R4');

                              let solidBgClass = "bg-white";
                              if (isR1) solidBgClass = "bg-[#FFF5F5]";
                              else if (isR2) solidBgClass = "bg-[#FFFBEB]";
                              else if (isR3) solidBgClass = "bg-[#F0F7FF]";
                              else if (isR4) solidBgClass = "bg-[#ECFDF5]";

                              const cellPy = isModalScrolled ? 'py-2' : 'py-3.5';

                              return (
                                <tr key={item.id} className={`${rowBgClass} border-b border-slate-200 transition-colors`}>
                                  {/* Pinned Column 1: STT */}
                                  <td className={`px-3 ${cellPy} w-[50px] text-center font-mono font-black text-slate-400 border-r border-slate-150 transition-all sticky left-0 ${solidBgClass} z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)]`}>
                                    {idx + 1}
                                  </td>
                                  
                                  {/* Dynamic Cells mapped directly to actual columns position */}
                                  {visibleIdpColumns.map((col) => {
                                    if (col.key === 'jobDuty') {
                                      return (
                                        <td key="jobDuty" className={`px-4 ${cellPy} w-[280px] font-semibold text-slate-900 leading-relaxed text-[11.5px] whitespace-pre-line break-words border-r border-slate-150 transition-all`}>
                                          {item.jobDuty || '—'}
                                        </td>
                                      );
                                    }

                                    if (col.key === 'rRating') {
                                      return (
                                        <td key="rRating" className={`px-4 ${cellPy} w-[125px] text-center border-r border-slate-150 transition-all`}>
                                          {item.rRating ? (() => {
                                            const itemTheme = getRatingTheme(item.rRating, lang);
                                            let rBadgeStyle = "";
                                            if (itemTheme.ratingLabel === 'R1') {
                                              rBadgeStyle = "bg-rose-100 text-rose-750 border-rose-300";
                                            } else if (itemTheme.ratingLabel === 'R2') {
                                              rBadgeStyle = "bg-amber-100 text-amber-800 border-amber-300";
                                            } else if (itemTheme.ratingLabel === 'R3') {
                                              rBadgeStyle = "bg-sky-100 text-sky-700 border-sky-300";
                                            } else if (itemTheme.ratingLabel === 'R4') {
                                              rBadgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-300";
                                            } else {
                                              rBadgeStyle = "bg-slate-100 text-slate-700 border-slate-300";
                                            }
                                            return (
                                              <div className="flex flex-col items-center justify-center select-none animate-fade-in">
                                                <span className={`px-2.5 py-1 rounded text-[11px] uppercase font-black border tracking-wider shadow-2xs ${rBadgeStyle}`}>
                                                  {itemTheme.ratingLabel}
                                                </span>
                                              </div>
                                            );
                                          })() : <span className="text-slate-300 font-semibold">—</span>}
                                        </td>
                                      );
                                    }

                                    if (col.key === 'topOpportunity') {
                                      return (
                                        <td key="topOpportunity" className={`px-3 ${cellPy} w-[110px] text-center border-r border-slate-150 transition-all`}>
                                          {isTopPriority ? (
                                            <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-extrabold text-[9.5px] uppercase shadow-sm">
                                              🔥 {lang === 'VI' ? 'ƯU TIÊN' : 'PRIORITY'}
                                            </span>
                                          ) : (
                                            <span className="text-slate-300 font-bold">—</span>
                                          )}
                                        </td>
                                      );
                                    }

                                    if (col.key === 'comments') {
                                      return (
                                        <td key="comments" className={`px-4 ${cellPy} w-[240px] border-r border-slate-150 transition-all`}>
                                          <textarea
                                            value={item.comments || ''}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setPlans(prev => prev.map(p => p.id === item.id ? { ...p, comments: val } : p));
                                            }}
                                            rows={2}
                                            placeholder={lang === 'VI' ? 'Nhập nhận xét công việc...' : 'Add commentary remarks...'}
                                            className="w-full text-[11px] font-semibold leading-relaxed p-1.5 bg-white border border-slate-205 hover:border-slate-350 focus:border-indigo-500 hover:bg-slate-50/55 focus:bg-white rounded-lg outline-none text-slate-800 transition placeholder:italic placeholder:font-normal"
                                          />
                                        </td>
                                      );
                                    }

                                    if (col.key === 'wayForward') {
                                      return (
                                        <td key="wayForward" className={`px-4 ${cellPy} w-[260px] border-r border-slate-150 text-slate-800 font-semibold text-[11px] leading-relaxed whitespace-pre-line transition-all`}>
                                          {item.wayForward ? (
                                            <div className="bg-emerald-50/45 border border-emerald-200 p-2 rounded-xl text-slate-800 font-bold">
                                              🚀 {item.wayForward}
                                            </div>
                                          ) : (
                                            <span className="text-slate-355 italic text-[10.5px]">{lang === 'VI' ? 'Chưa lập Cách thực hiện' : 'No Way Forward'}</span>
                                          )}
                                        </td>
                                      );
                                    }

                                    if (col.key === 'timeline') {
                                      return (
                                        <td key="timeline" className={`px-3 ${cellPy} w-[130px] text-center border-r border-slate-150 transition-all`}>
                                          {item.timeline ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 bg-slate-100 text-slate-705 border border-slate-250 text-[10px] font-black rounded-lg py-1 shadow-3xs leading-none">
                                              ⏱ {item.timeline}
                                            </span>
                                          ) : (
                                            <span className="text-slate-300 font-semibold">—</span>
                                          )}
                                        </td>
                                      );
                                    }

                                    if (col.key === 'proposedProgram') {
                                      return (
                                        <td key="proposedProgram" className={`px-4 ${cellPy} w-[240px] border-r border-slate-150 text-left font-bold text-slate-800 transition-all`}>
                                          {item.proposedProgram ? (
                                            <div className="bg-indigo-50 border border-indigo-200 p-2 rounded-lg text-slate-900 leading-normal text-[11px]">
                                              🎓 {item.proposedProgram}
                                            </div>
                                          ) : (
                                            <p className="text-slate-355 text-[10.5px] italic font-medium pl-1">{lang === 'VI' ? 'Chưa chỉ định đề xuất' : 'None proposed'}</p>
                                          )}
                                        </td>
                                      );
                                    }

                                    if (col.key === 'trainingCategory') {
                                      return (
                                        <td key="trainingCategory" className={`px-4 ${cellPy} w-[180px] font-bold text-slate-850 break-words border-r border-slate-150 text-[11px] transition-all`}>
                                          {translateCategory(item.trainingCategory) || '—'}
                                        </td>
                                      );
                                    }

                                    if (col.key === 'recommendation') {
                                      return (
                                        <td key="recommendation" className={`px-4 ${cellPy} w-[160px] border-r border-slate-150 text-center font-bold text-slate-805 bg-indigo-50/5 transition-all`}>
                                          {item.rRating ? (() => {
                                            const rVal = (item.rRating || '').toUpperCase().trim();
                                            let recommendationStyle = "bg-slate-50 text-slate-705 border-slate-205";
                                            if (rVal === 'R1') {
                                              recommendationStyle = "bg-rose-50 text-rose-800 border-rose-200";
                                            } else if (rVal === 'R2') {
                                              recommendationStyle = "bg-amber-50 text-amber-850 border-amber-250";
                                            } else if (rVal === 'R3') {
                                              recommendationStyle = "bg-sky-50 text-sky-800 border-sky-200";
                                            } else if (rVal === 'R4') {
                                              recommendationStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
                                            }
                                            return (
                                              <span className={`inline-block px-2.5 py-1 rounded-lg border text-[10.5px] font-extrabold shadow-3xs ${recommendationStyle}`}>
                                                👉 {getRecommendationText(item.rRating, lang)}
                                              </span>
                                            );
                                          })() : (
                                            <span className="text-slate-350 italic">—</span>
                                          )}
                                        </td>
                                      );
                                    }

                                    if (col.key === 'suggestedSetup') {
                                      return (
                                        <td key="suggestedSetup" className={`px-4 ${cellPy} w-[220px] border-r border-slate-150 text-center font-bold text-slate-805 bg-indigo-50/5 transition-all`}>
                                          {item.action ? (() => {
                                            const isPlan = item.action === 'Add to Training Plan' || 
                                              item.action === 'Đưa vào Kế hoạch đào tạo tập trung' || 
                                              item.action.toLowerCase().includes('training') || 
                                              item.action.toLowerCase().includes('đào tạo');
                                            
                                            const actionStyle = isPlan
                                              ? 'bg-emerald-100 text-emerald-850 border-emerald-250'
                                              : 'bg-amber-100 text-amber-850 border-amber-305';
                                              
                                            return (
                                              <span className={`inline-block px-2.5 py-1 rounded-lg border text-[10.5px] font-black shadow-3xs ${actionStyle}`}>
                                                💡 {getSuggestionText(item.action, lang)}
                                              </span>
                                            );
                                          })() : (
                                            <span className="text-slate-355 italic">—</span>
                                          )}
                                        </td>
                                      );
                                    }

                                    if (col.key === 'owner') {
                                      return (
                                        <td key="owner" className={`px-4 ${cellPy} w-[160px] border-r border-slate-150 text-slate-805 font-bold text-[11px] bg-indigo-50/5 transition-all`}>
                                          {item.owner ? (
                                            <div className="flex items-center gap-1.5 text-slate-705">
                                              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-indigo-100/55 text-indigo-700 border border-indigo-200 shadow-3xs">👤</span>
                                              <span>{translateOwner(item.owner)}</span>
                                            </div>
                                          ) : (
                                            <span className="text-slate-355 italic">—</span>
                                          )}
                                        </td>
                                      );
                                    }

                                    return null;
                                  })}

                                  {/* ACTIONS BUTTONS */}
                                  <td className={`px-3 ${cellPy} w-[140px] text-center transition-all`}>
                                    <div className="flex items-center justify-center gap-1.5 select-none animate-fade-in">
                                      <button
                                        id={idx === 0 ? "onboarding-idp-edit-btn" : undefined}
                                        onClick={() => startEditing(item)}
                                        className="p-1 px-[9px] bg-indigo-50 border border-indigo-200 text-indigo-750 hover:bg-indigo-650 hover:text-white rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1 text-[10.5px]"
                                        title={lang === 'VI' ? 'Sửa thông tin dòng này' : 'Direct edit row'}
                                      >
                                        <Edit2 className="w-3 h-3 stroke-[2.5]" />
                                        <span>{lang === 'VI' ? 'Sửa' : 'Edit'}</span>
                                      </button>
                                      <button
                                        onClick={() => handleDeletePlan(item.id, activeModalEmployee.viName)}
                                        className="p-1 px-[9px] bg-rose-50 border border-rose-220 text-rose-750 hover:bg-rose-600 hover:text-white rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1 text-[10.5px]"
                                        title={lang === 'VI' ? 'Xóa hạng mục' : 'Delete item'}
                                      >
                                        <Trash2 className="w-3 h-3 stroke-[2.5]" />
                                        <span>{lang === 'VI' ? 'Xóa' : 'Delete'}</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Bottom Sticky Footer - Removed to maximize table viewing space as requested */}

          </div>
        </div>
      )}

      {/* FLOATING DIALOG EDIT MODAL OVERLAY */}
      {editingId && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div 
            id="onboarding-idp-edit-modal-body"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-[850px] overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider pl-0.5 font-display">
                  {lang === 'VI' ? 'CHỈNH SỬA CHI TIẾT LỘ TRÌNH ĐÀO TẠO' : 'EDIT INDIVIDUAL TRAINING ROADMAP'}
                </h3>
              </div>
              <button 
                id="onboarding-idp-edit-modal-close-btn"
                onClick={() => setEditingId(null)}
                className="text-slate-400 hover:text-white transition cursor-pointer p-1.5 rounded-lg hover:bg-slate-850"
              >
                <span className="text-md font-bold">✕</span>
              </button>
            </div>

            {/* Content Field Scrollable Body */}
            <div className="overflow-y-auto p-6 space-y-5 text-left text-xs text-slate-800 scrollbar-thin">
              {/* Core Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10.5px] uppercase font-black text-rose-700 select-none">
                    🔥 {lang === 'VI' ? 'Mức ưu tiên' : 'Priority'}
                  </label>
                  <select 
                    value={editForm.topOpportunity || ''} 
                    onChange={e => setEditForm({ ...editForm, topOpportunity: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-slate-250 rounded-lg bg-white font-bold outline-indigo-500 text-xs text-slate-900 shadow-3xs"
                  >
                    <option value="">{lang === 'VI' ? 'Bình thường' : 'Normal Opportunity'}</option>
                    <option value="X">X — {lang === 'VI' ? 'Ưu tiên hàng đầu' : 'Yes (Top Priority)'}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10.5px] uppercase font-black text-slate-500 select-none">
                    📋 {lang === 'VI' ? 'Loại hình năng lực' : 'Category'}
                  </label>
                  <input 
                    type="text" 
                    value={editForm.trainingCategory || ''} 
                    onChange={e => setEditForm({ ...editForm, trainingCategory: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-slate-205 rounded-lg bg-white outline-indigo-500 text-xs font-bold text-slate-900 shadow-3xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10.5px] uppercase font-black text-indigo-700 select-none">
                    ⚡ {lang === 'VI' ? 'Mức Sẵn sàng / R-Rating' : 'Readiness Rating'}
                  </label>
                  <select 
                    value={editForm.rRating || ''} 
                    onChange={e => {
                      const rVal = e.target.value;
                      let recommendedMethod = editForm.action || '';
                      if (rVal === 'R1') recommendedMethod = lang === 'VI' ? 'Kèm cặp' : 'Mentoring';
                      else if (rVal === 'R2') recommendedMethod = lang === 'VI' ? 'Chỉ dẫn' : 'Coaching';
                      else if (rVal === 'R3') recommendedMethod = lang === 'VI' ? 'Hỗ trợ' : 'Supporting';
                      else if (rVal === 'R4') recommendedMethod = lang === 'VI' ? 'Ủy quyền' : 'Delegating';
                      setEditForm({ ...editForm, rRating: rVal });
                    }}
                    className="w-full mt-1.5 px-3 py-2 border border-slate-250 rounded-lg bg-white font-bold outline-indigo-500 text-xs text-slate-905 shadow-3xs"
                  >
                    <option value="">—</option>
                    <option value="R1">R1 (Directing - Chỉ đạo)</option>
                    <option value="R2">R2 (Coaching - Chỉ dẫn)</option>
                    <option value="R3">R3 (Supporting - Hỗ trợ)</option>
                    <option value="R4">R4 (Delegating - Ủy quyền)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase font-black text-slate-500 select-none">
                    ⏱ {lang === 'VI' ? 'Thời hạn' : 'Timeline'}
                  </label>
                  <input 
                    type="text" 
                    value={editForm.timeline || ''} 
                    onChange={e => setEditForm({ ...editForm, timeline: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-slate-205 rounded-lg bg-white outline-indigo-500 text-xs font-bold text-slate-900 shadow-3xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] uppercase font-black text-slate-600 select-none">
                  🎯 {lang === 'VI' ? 'Nhiệm vụ công việc' : 'Job Duty / Performance Need'}
                </label>
                <textarea 
                  rows={2}
                  value={editForm.jobDuty || ''} 
                  onChange={e => setEditForm({ ...editForm, jobDuty: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 border border-slate-205 rounded-lg bg-white font-semibold outline-indigo-500 text-xs text-slate-900 leading-normal"
                />
              </div>

              <div>
                <label className="block text-[10.5px] uppercase font-black text-slate-500 select-none">
                  💬 {lang === 'VI' ? 'Nhận xét công việc' : 'Comments'}
                </label>
                <textarea 
                  rows={2}
                  value={editForm.comments || ''} 
                  onChange={e => setEditForm({ ...editForm, comments: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 border border-slate-205 rounded-lg bg-white font-semibold outline-indigo-500 text-xs text-slate-900 leading-normal"
                />
              </div>

              <div>
                <label className="block text-[10.5px] uppercase font-black text-emerald-800 select-none font-extrabold">
                  🚀 {lang === 'VI' ? 'Kế hoạch phát triển (Cách thực hiện)' : 'Development Plan (Way Forward Steps):'}
                </label>
                <textarea 
                  rows={2}
                  value={editForm.wayForward || ''} 
                  onChange={e => setEditForm({ ...editForm, wayForward: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 border border-slate-205 rounded-lg bg-white font-semibold outline-indigo-500 text-xs text-slate-900 leading-normal"
                />
              </div>

              {/* Suggestions Panel */}
              <div className="bg-indigo-50/45 border border-indigo-100 rounded-xl p-4.5 space-y-4">
                <div className="border-b border-indigo-100 pb-2 select-none">
                  <span className="text-[11px] uppercase font-extrabold text-indigo-700 block tracking-wider">
                    🎓 {lang === 'VI' ? 'Đề xuất đào tạo & Phân bổ' : 'RECOMMENDED TRAINING ACTION'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-indigo-900 select-none">
                      📚 {lang === 'VI' ? 'Chương trình đào tạo đề xuất (Bạn tự sửa đào tạo)' : 'Proposed Program'}
                    </label>
                    <input 
                      type="text" 
                      value={editForm.proposedProgram || ''} 
                      onChange={e => setEditForm({ ...editForm, proposedProgram: e.target.value })}
                      className="w-full mt-1.5 px-3 py-2 border border-indigo-200 rounded-lg bg-white outline-indigo-500 text-xs font-bold text-indigo-950 placeholder:italic"
                      placeholder={lang === 'VI' ? 'Ví dụ: Khóa Kỹ năng mềm, Tư duy dịch vụ...' : 'Recommended course or study module'}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-indigo-900 select-none">
                      👤 {lang === 'VI' ? 'Bộ phận theo sát' : 'Milestone Evaluator'}
                    </label>
                    <input 
                      type="text" 
                      value={editForm.owner || ''} 
                      onChange={e => setEditForm({ ...editForm, owner: e.target.value })}
                      className="w-full mt-1.5 px-3 py-2 border border-indigo-200 rounded-lg bg-white outline-indigo-500 text-xs font-semibold text-indigo-950"
                      placeholder={lang === 'VI' ? 'Ví dụ: L&D, Trưởng bộ phận, HRBP...' : 'Who will support/track?'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-black text-indigo-905 select-none font-bold">
                    💡 {lang === 'VI' ? 'Gợi ý thiết lập' : 'Suggested Setup'}
                  </label>
                  <select
                    value={editForm.action || ''} 
                    onChange={e => setEditForm({ ...editForm, action: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-indigo-200 rounded-lg bg-white outline-indigo-500 text-xs font-bold text-indigo-950 shadow-3xs"
                  >
                    <option value="">{lang === 'VI' ? '— Chưa thiết lập hình thức —' : '— Select Suggested Action —'}</option>
                    <option value="Department self follow-up">{lang === 'VI' ? 'Bộ phận tự theo dõi & Kèm cặp' : 'Department self follow-up'}</option>
                    <option value="Add to Training Plan">{lang === 'VI' ? 'Đưa vào Kế hoạch đào tạo tập trung' : 'Add into Training Plan'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="shrink-0 bg-slate-50 border-t border-slate-150 px-6 py-4 flex justify-end gap-2.5 select-none">
              <button 
                id="onboarding-idp-edit-modal-cancel-btn"
                onClick={() => setEditingId(null)}
                className="px-4.5 py-2 border border-slate-205 hover:bg-slate-100 text-slate-655 font-bold rounded-lg cursor-pointer transition-all text-[11.5px]"
              >
                {lang === 'VI' ? 'Hủy' : 'Cancel'}
              </button>
              <button 
                onClick={() => {
                  if (editingId) {
                    saveEditValue(editingId);
                  }
                }}
                className="px-6 py-2 bg-indigo-700 hover:bg-indigo-800 border border-indigo-850 text-white font-extrabold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-[1.01]"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{lang === 'VI' ? 'LƯU THAY ĐỔI' : 'SAVE CHANGES'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
