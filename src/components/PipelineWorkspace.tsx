import React, { useState, useMemo } from 'react';
import { PipelinePosition } from '../types';
import { ShieldAlert, UserCheck, AlertTriangle, Eye, Edit2, Search, Filter, CheckCircle2, X, Zap, Sliders, UserX, ChevronRight, HelpCircle, Download, TrendingUp, FolderOpen, ArrowUpDown, Sparkles, BellRing } from 'lucide-react';
import { allDepartments } from '../data';
import { SearchableDeptDropdown } from './SearchableDeptDropdown';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface PipelineWorkspaceProps {
  pipelineData: PipelinePosition[];
  selectedDept: string;
  onUpdatePosition: (updated: PipelinePosition) => void;
  onDeptChange?: (dept: string) => void;
  lang?: 'VI' | 'EN';
  isLdMode?: boolean;
}

const getProposedAction = (p: PipelinePosition, lang: 'VI' | 'EN' = 'VI'): string => {
  if (lang === 'VI') {
    // 1. High Risk position with no Successor
    if (p.risk === 'High' && (p.successor === 'None' || !p.successor)) {
      return '🚨 Khẩn cấp: Áp dụng gói phúc lợi giữ chân đặc quyền & Kích hoạt định vị nhân tài ngoài doanh nghiệp.';
    }
    // 2. High Risk position with successor
    if (p.risk === 'High') {
      return '🔥 Đẩy mạnh lộ trình Huấn luyện (Mentorship) & IDP để người kế thừa sẵn sàng thay thế trong 3-6 tháng.';
    }
    // 3. Open Position or No successor
    if (p.incumbent === 'Open' || p.successor === 'None' || !p.successor) {
      return '🔍 Tổ chức Talent Review chéo khối phát triển nguồn nhân lực & Mở luồng tìm kiếm ứng viên bên ngoài.';
    }
    // 4. Critical role but succession readiness is Long-Term/None
    if (p.pipeline === 'Critical' && (p.readiness === '1-2 Years' || p.readiness === 'None' || p.readiness === '< 1 Year')) {
      return '⚡ Xây dựng lộ trình luân chuyển vị trí để rút ngắn thời gian sẵn sàng kế thừa của ứng viên tiềm năng.';
    }
    // 5. Interim coverage only
    if (p.status === 'Interim Coverage Only') {
      return '🎯 Đăng ký đánh giá nâng nhân sự tạm quyền lên chính thức hoặc bổ khuyết nguồn hỗ trợ chéo.';
    }
    // 6. Ready now successor
    if (p.readiness === 'Ready Now') {
      return '✅ Giao thêm dự án thử thách (Shadowing) & Chuẩn bị sẵn phương án bàn giao công việc thực tế.';
    }
    // Default
    return '📈 Tiếp tục cập nhật IDP, tối ưu hóa kèm cặp công việc (OJT) định kỳ theo mục tiêu.';
  } else {
    // English versions
    if (p.risk === 'High' && (p.successor === 'None' || !p.successor)) {
      return '🚨 Urgent: Apply key retention rewards package & unlock external executive talent pooling.';
    }
    if (p.risk === 'High') {
      return '🔥 Accelerate Mentorship & IDP tracks to secure successor handover within 3-6 months.';
    }
    if (p.incumbent === 'Open' || p.successor === 'None' || !p.successor) {
      return '🔍 Initiate inter-departmental Talent Review & publish external critical hiring campaigns.';
    }
    if (p.pipeline === 'Critical' && (p.readiness === '1-2 Years' || p.readiness === 'None' || p.readiness === '< 1 Year')) {
      return '⚡ Build rotating-role programs to shorten the developmental gaps of high-potential candidates.';
    }
    if (p.status === 'Interim Coverage Only') {
      return '🎯 Register evaluation for elevating current interim head to official status or deploy cross-skills backup.';
    }
    if (p.readiness === 'Ready Now') {
      return '✅ Assign challenging projects (Shadowing) & begin concrete transitional knowledge transfer.';
    }
    return '📈 Periodically revise IDP & target-focused On-the-Job training progress.';
  }
};

export default function PipelineWorkspace({
  pipelineData,
  selectedDept,
  onUpdatePosition,
  onDeptChange,
  lang = 'VI',
  isLdMode = false,
}: PipelineWorkspaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<'ALL' | 'GAP'>('ALL'); // GAP lists High Risk / Critical / No Successor / Interim
  const [pipelineFilter, setPipelineFilter] = useState<'ALL' | 'HIGH_RISK' | 'AT_RISK' | 'CRITICAL'>('ALL');
  const [editingPos, setEditingPos] = useState<PipelinePosition | null>(null);
  const [hotspotTab, setHotspotTab] = useState<'HIGH_RISK' | 'CRITICAL' | 'FAILED_PIPELINE'>('CRITICAL');

  // Sorting states
  const [sortMainKey, setSortMainKey] = useState<keyof PipelinePosition | null>(null);
  const [sortMainDir, setSortMainDir] = useState<'asc' | 'desc' | null>(null);

  const [sortHrKey, setSortHrKey] = useState<keyof PipelinePosition | null>(null);
  const [sortHrDir, setSortHrDir] = useState<'asc' | 'desc' | null>(null);

  const [sortCritKey, setSortCritKey] = useState<keyof PipelinePosition | null>(null);
  const [sortCritDir, setSortCritDir] = useState<'asc' | 'desc' | null>(null);

  const [sortFailKey, setSortFailKey] = useState<keyof PipelinePosition | null>(null);
  const [sortFailDir, setSortFailDir] = useState<'asc' | 'desc' | null>(null);

  // Edit form states
  const [successorName, setSuccessorName] = useState('');
  const [interimName, setInterimName] = useState('');
  const [riskLevel, setRiskLevel] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [readiness, setReadiness] = useState<'Ready Now' | '< 1 Year' | '1-2 Years' | 'None'>('None');
  const [status, setStatus] = useState('No Successor Identified');

  // Export pipeline positions to CSV
  const exportPipelineCSV = () => {
    const headers = [
      'Nhan su hien tai (Current Incumbent)',
      'Bo phan (Department)',
      'Vi tri (Critical Position Role)',
      'Muc Rui Ro (Risk of Leaving)',
      'Nguoi tam quyen (Interim Covering)',
      'Nguoi ke thua (Successor Candidate)',
      'Muc do san sang (Succession Readiness)',
      'Tinh trang ke thua (Succession Status)'
    ];
    
    const escape = (text: string) => `"${text.replace(/"/g, '""')}"`;
    const rows = filteredPositions.map(p => [
      escape(p.incumbent),
      escape(p.dept),
      escape(p.role),
      escape(p.risk),
      escape(p.interim),
      escape(p.successor),
      escape(p.readiness),
      escape(p.status)
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MILL_Pipeline_${selectedDept}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export current active hotspot tab to CSV
  const exportActiveHotspotCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';
    const escape = (text: string) => `"${text.replace(/"/g, '""')}"`;

    if (hotspotTab === 'HIGH_RISK') {
      headers = [
        'Nhan su hien tai (Current Incumbent)',
        'Bo phan (Department)',
        'Vi tri trong yeu (Role)',
        'Muc rui ro (Risk Level)',
        'Ke thua tiem nang (Potential Successor)',
        'San sang (Readiness)'
      ];
      rows = hotspotHighRisk.map((p) => [
        escape(p.incumbent),
        escape(p.dept),
        escape(p.role),
        escape(p.risk),
        escape(p.successor === 'None' ? 'Chua co' : p.successor),
        escape(p.readiness)
      ]);
      filename = `MILL_Hotspot_HighRisk_${selectedDept}.csv`;
    } else if (hotspotTab === 'CRITICAL') {
      headers = [
        'Nhan su hien tai (Current Incumbent)',
        'Bo phan (Department)',
        'Vi tri Critical (Critical Role)',
        'Muc rui ro (Risk Level)',
        'Tam quyen (Interim Covering)',
        'Ke thua (Successor)'
      ];
      rows = hotspotCritical.map((p) => [
        escape(p.incumbent),
        escape(p.dept),
        escape(p.role),
        escape(p.risk),
        escape(p.interim === 'None' ? 'In empty' : p.interim),
        escape(p.successor === 'None' ? 'Chua xac dinh' : p.successor)
      ]);
      filename = `MILL_Hotspot_Critical_${selectedDept}.csv`;
    } else {
      headers = [
        'Nhan su hien tai (Current Incumbent)',
        'Bo phan (Department)',
        'Vi tri (Position Role)',
        'Rui ro (Risk Level)',
        'Nhan su tam quyen (Interim Covering)',
        'Tinh trang ke thua (Succession Status)'
      ];
      rows = hotspotFailed.map((p) => [
        escape(p.incumbent),
        escape(p.dept),
        escape(p.role),
        escape(p.risk),
        escape(p.interim === 'None' || p.interim === '' ? 'Trong' : p.interim),
        escape(p.status)
      ]);
      filename = `MILL_Hotspot_FailedPipeline_${selectedDept}.csv`;
    }

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Department Filtered positions baseline for counts & general charts
  const deptPositions = useMemo(() => {
    return pipelineData.filter((p) => selectedDept === 'ALL' || p.dept === selectedDept);
  }, [pipelineData, selectedDept]);

  // 2. Filter positions for the actual table tracker view
  const filteredPositions = useMemo(() => {
    const list = deptPositions.filter((p) => {
      const matchesSearch =
        p.incumbent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.successor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.interim.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesGap = true;
      if (currentFilter === 'GAP') {
        const isHotSpot =
          p.risk === 'High' ||
          p.pipeline === 'Critical' ||
          p.pipeline === 'At Risk' ||
          p.status.includes('Interim') ||
          p.status.includes('No Successor') ||
          p.successor === 'None';
        matchesGap = isHotSpot;
      }

      let matchesKPI = true;
      if (pipelineFilter === 'HIGH_RISK') {
        matchesKPI = p.risk === 'High';
      } else if (pipelineFilter === 'AT_RISK') {
        matchesKPI =
          p.status.includes('No Successor') ||
          p.status.includes('Interim') ||
          p.pipeline === 'At Risk' ||
          p.successor === 'None';
      } else if (pipelineFilter === 'CRITICAL') {
        matchesKPI = p.pipeline === 'Critical';
      }

      return matchesSearch && matchesGap && matchesKPI;
    });

    if (sortMainKey && sortMainDir) {
      const multiplier = sortMainDir === 'asc' ? 1 : -1;
      return [...list].sort((a, b) => {
        const valA = a[sortMainKey] ?? '';
        const valB = b[sortMainKey] ?? '';
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * multiplier;
        }
        return String(valA).localeCompare(String(valB), lang === 'VI' ? 'vi' : 'en') * multiplier;
      });
    }
    return list;
  }, [deptPositions, searchQuery, currentFilter, pipelineFilter, sortMainKey, sortMainDir, lang]);

  // Stable counts based on selected department (keeps KPIs steady as you toggle filters)
  const totalReviewed = deptPositions.length;
  const highRiskCount = deptPositions.filter((p) => p.risk === 'High').length;
  const atRiskCount = deptPositions.filter(
    (p) =>
      p.status.includes('No Successor') ||
      p.status.includes('Interim') ||
      p.pipeline === 'At Risk' ||
      p.successor === 'None'
  ).length;
  const criticalGapsCount = deptPositions.filter((p) => p.pipeline === 'Critical').length;

  // Chart dataset 1: Succession Readiness Distribution (Doughnut Chart)
  const statusPieChartData = useMemo(() => {
    let ready = 0;
    let developing = 0;
    let noSuccessor = 0;
    let interim = 0;
    let open = 0;

    deptPositions.forEach((p) => {
      if (p.incumbent === 'Open') {
        open++;
      } else if (p.status === 'Ready Successor Identified') {
        ready++;
      } else if (p.status === 'Interim Coverage Only') {
        interim++;
      } else if (p.status === 'No Successor Identified') {
        noSuccessor++;
      } else {
        developing++;
      }
    });

    return [
      { name: lang === 'VI' ? 'Đã xác định người Kế thừa' : 'Ready Successor Identified', value: ready, color: '#10b981' }, // green-500
      { name: lang === 'VI' ? 'Đang đào tạo' : 'Under Development', value: developing, color: '#3b82f6' }, // blue-500
      { name: lang === 'VI' ? 'Chưa xác định người Kế thừa' : 'No Successor Identified', value: noSuccessor, color: '#ef4444' }, // red-500
      { name: lang === 'VI' ? 'Chỉ có người tạm quyền' : 'Interim Coverage Only', value: interim, color: '#f59e0b' }, // orange-500
      { name: lang === 'VI' ? 'Vị trí trống' : 'Open Position', value: open, color: '#64748b' }, // slate-500
    ].filter(item => item.value > 0);
  }, [deptPositions, lang]);

  // Chart dataset 2: Top challenges & gaps count by Department (Grouped Bar Chart)
  const deptBarChartData = useMemo(() => {
    const rawDepts = Array.from(new Set(pipelineData.map(p => p.dept)));
    return rawDepts.map(dept => {
      const pInDept = pipelineData.filter(p => p.dept === dept);
      const highRisk = pInDept.filter(p => p.risk === 'High').length;
      const critical = pInDept.filter(p => p.pipeline === 'Critical').length;
      const noSuccessor = pInDept.filter(p => p.status === 'No Successor Identified').length;

      return {
        name: dept === 'PIC' ? 'PIC' : dept,
        highRiskCount: highRisk,
        criticalCount: critical,
        noSuccessorCount: noSuccessor,
      };
    }).filter(item => (item.highRiskCount > 0 || item.criticalCount > 0 || item.noSuccessorCount > 0));
  }, [pipelineData]);

  const handleStartEdit = (pos: PipelinePosition) => {
    if (!isLdMode) return;
    setEditingPos(pos);
    setSuccessorName(pos.successor === 'None' ? '' : pos.successor);
    setInterimName(pos.interim === 'None' ? '' : pos.interim);
    setRiskLevel(pos.risk);
    setReadiness(pos.readiness);
    setStatus(pos.status);
  };

  const handleSavePosition = () => {
    if (!editingPos) return;

    const updatedSuccessor = successorName.trim() === '' ? 'None' : successorName.trim();
    const updatedInterim = interimName.trim() === '' ? 'None' : interimName.trim();

    let autoPipeline: 'At Risk' | 'Critical' | 'Covered' | 'Developing' = 'Covered';
    let autoStatus = status;

    // Define business logic to align states nicely:
    if (updatedSuccessor === 'None') {
      if (updatedInterim !== 'None') {
        autoStatus = 'Interim Coverage Only';
        autoPipeline = 'At Risk';
      } else {
        autoStatus = 'No Successor Identified';
        autoPipeline = editingPos.incumbent.includes('(NS)') || editingPos.incumbent === 'Open' ? 'Critical' : 'At Risk';
      }
    } else {
      if (readiness === 'Ready Now') {
        autoStatus = 'Ready Successor Identified';
        autoPipeline = 'Covered';
      } else if (readiness === '1-2 Years' || readiness === '< 1 Year') {
        autoStatus = 'Successor in Development';
        autoPipeline = 'Developing';
      } else {
        autoStatus = 'Successor Identified';
        autoPipeline = 'Developing';
      }
    }

    onUpdatePosition({
      ...editingPos,
      successor: updatedSuccessor,
      interim: updatedInterim,
      risk: riskLevel,
      readiness,
      status: autoStatus,
      pipeline: autoPipeline,
    });

    setEditingPos(null);
  };

  // Filter specialized hotspot lists
  const hotspotHighRisk = useMemo(() => {
    const list = pipelineData.filter(p => {
      const matchesDept = selectedDept === 'ALL' || p.dept === selectedDept;
      return matchesDept && p.risk === 'High';
    });
    if (sortHrKey && sortHrDir) {
      const multiplier = sortHrDir === 'asc' ? 1 : -1;
      return [...list].sort((a, b) => {
        const valA = a[sortHrKey] ?? '';
        const valB = b[sortHrKey] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * multiplier;
        }
        return String(valA).localeCompare(String(valB), lang === 'VI' ? 'vi' : 'en') * multiplier;
      });
    }
    return list;
  }, [pipelineData, selectedDept, sortHrKey, sortHrDir, lang]);

  const hotspotCritical = useMemo(() => {
    const list = pipelineData.filter(p => {
      const matchesDept = selectedDept === 'ALL' || p.dept === selectedDept;
      const isCritical = p.pipeline === 'Critical' || p.role.includes('(NS)') || p.incumbent === 'Open';
      return matchesDept && isCritical;
    });
    if (sortCritKey && sortCritDir) {
      const multiplier = sortCritDir === 'asc' ? 1 : -1;
      return [...list].sort((a, b) => {
        const valA = a[sortCritKey] ?? '';
        const valB = b[sortCritKey] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * multiplier;
        }
        return String(valA).localeCompare(String(valB), lang === 'VI' ? 'vi' : 'en') * multiplier;
      });
    }
    return list;
  }, [pipelineData, selectedDept, sortCritKey, sortCritDir, lang]);

  const hotspotFailed = useMemo(() => {
    const list = pipelineData.filter(p => {
      const matchesDept = selectedDept === 'ALL' || p.dept === selectedDept;
      const isFailed = p.successor === 'None' || p.status === 'No Successor Identified' || p.status === 'Interim Coverage Only';
      return matchesDept && isFailed;
    });
    if (sortFailKey && sortFailDir) {
      const multiplier = sortFailDir === 'asc' ? 1 : -1;
      return [...list].sort((a, b) => {
        const valA = a[sortFailKey] ?? '';
        const valB = b[sortFailKey] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * multiplier;
        }
        return String(valA).localeCompare(String(valB), lang === 'VI' ? 'vi' : 'en') * multiplier;
      });
    }
    return list;
  }, [pipelineData, selectedDept, sortFailKey, sortFailDir, lang]);

  return (
    <div className="space-y-6">
      {/* 4 Cards Grid - KPIs */}
      <div id="onboarding-pipeline-kpis" className="grid grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        {/* Card 1: Total */}
        <button
          onClick={() => {
            setPipelineFilter('ALL');
            setCurrentFilter('ALL');
          }}
          className={`text-left bg-white p-6 rounded-2xl border shadow-sm border-t-4 border-t-slate-900 flex flex-col justify-between min-h-[115px] cursor-pointer transition-all duration-300 ${
            pipelineFilter === 'ALL'
              ? 'ring-2 ring-slate-800 bg-slate-50/10 scale-[1.01] shadow-md'
              : 'hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {lang === 'VI' ? 'TỔNG NHÂN SỰ ĐƯỢC ĐÁNH GIÁ' : 'Total Key Roles'}
          </span>
          <div className="flex items-baseline justify-between w-full">
            <span className="text-3xl md:text-4.5xl font-black font-display text-slate-900 mt-1">
              {totalReviewed}
            </span>
            {pipelineFilter === 'ALL' && (
              <span className="text-[10px] bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>
            )}
          </div>
        </button>

        {/* Card 2: High Risk */}
        <button
          onClick={() => {
            setPipelineFilter('HIGH_RISK');
            setCurrentFilter('ALL');
          }}
          className={`text-left bg-white p-6 rounded-2xl border shadow-sm border-t-4 border-t-amber-500 flex flex-col justify-between min-h-[115px] cursor-pointer transition-all duration-300 ${
            pipelineFilter === 'HIGH_RISK'
              ? 'ring-2 ring-amber-500 bg-amber-50/10 scale-[1.01] shadow-md'
              : 'hover:border-amber-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> {lang === 'VI' ? 'Rủi Ro Cao' : 'High Risk'}
            </span>
            <span className="text-[10px] text-amber-600/90 font-medium normal-case mt-1 ml-5">
              {lang === 'VI' ? 'Đương nhiệm rủi ro tuyển dụng' : 'Incumbents with high departure risk'}
            </span>
          </div>
          <div className="flex items-baseline justify-between w-full">
            <span className="text-3xl md:text-4.5xl font-black font-display text-amber-600 mt-1">
              {highRiskCount}
            </span>
            {pipelineFilter === 'HIGH_RISK' && (
              <span className="text-[10px] bg-amber-500 text-white font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>
            )}
          </div>
        </button>

        {/* Card 3: At Risk */}
        <button
          onClick={() => {
            setPipelineFilter('AT_RISK');
            setCurrentFilter('ALL');
          }}
          className={`text-left bg-white p-6 rounded-2xl border shadow-sm border-t-4 border-t-indigo-500 flex flex-col justify-between min-h-[115px] cursor-pointer transition-all duration-300 ${
            pipelineFilter === 'AT_RISK'
              ? 'ring-2 ring-indigo-500 bg-indigo-50/10 scale-[1.01] shadow-md'
              : 'hover:border-indigo-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <UserX className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> {lang === 'VI' ? 'THIẾU HỤT KẾ THỪA' : 'Successor Gaps'}
            </span>
            <span className="text-[10px] text-indigo-500/90 font-medium normal-case mt-1 ml-5">
              {lang === 'VI' ? 'Chỉ có tạm quyền / Chưa có kế thừa' : 'Interim Coverage Only or Unmapped'}
            </span>
          </div>
          <div className="flex items-baseline justify-between w-full">
            <span className="text-3xl md:text-4.5xl font-black font-display text-indigo-600 mt-1">
              {atRiskCount}
            </span>
            {pipelineFilter === 'AT_RISK' && (
              <span className="text-[10px] bg-indigo-500 text-white font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>
            )}
          </div>
        </button>

        {/* Card 4: Critical Gap */}
        <button
          onClick={() => {
            setPipelineFilter('CRITICAL');
            setCurrentFilter('ALL');
          }}
          className={`text-left bg-white p-6 rounded-2xl border shadow-sm border-t-4 border-t-rose-600 flex flex-col justify-between min-h-[115px] cursor-pointer transition-all duration-300 ${
            pipelineFilter === 'CRITICAL'
              ? 'ring-2 ring-rose-500 bg-rose-50/10 scale-[1.01] shadow-md'
              : 'hover:border-rose-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {lang === 'VI' ? 'VỊ TRÍ TRỌNG YẾU' : 'Critical Gaps'}
            </span>
            <span className="text-[10px] text-rose-500/90 font-medium normal-case mt-1 ml-5">
              {lang === 'VI' ? 'Rủi ro Cao + Thiếu hụt kế thừa' : 'High Risk + Successor Gaps'}
            </span>
          </div>
          <div className="flex items-baseline justify-between w-full">
            <span className="text-3xl md:text-4.5xl font-black font-display text-rose-600 mt-1">
              {criticalGapsCount}
            </span>
            {pipelineFilter === 'CRITICAL' && (
              <span className="text-[10px] bg-rose-600 text-white font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>
            )}
          </div>
        </button>
      </div>

      {/* Dynamic Visual Analytics Charts Section */}
      <div id="onboarding-pipeline-charts" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Pie Chart for Succession Map */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between min-h-[310px] transition-all hover:shadow-md">
          <div>
            <h4 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-display">
              🟢 {lang === 'VI' ? 'Cơ cấu Tỷ lệ Trạng thái Kế thừa' : 'Succession Map Status Balance'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {lang === 'VI'
                ? `Tỷ lệ phân bổ mức độ phủ kế thừa cho các vị trí chủ chốt (${selectedDept === 'ALL' ? 'Toàn Site' : selectedDept})`
                : `Current succession pipeline coverage ratios for critical roles (${selectedDept === 'ALL' ? 'Entire Site' : selectedDept})`}
            </p>
          </div>
          <div className="h-48 w-full relative mt-4 text-[10px]">
            {statusPieChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                {lang === 'VI' ? '(Không có dữ liệu hiển thị)' : '(No data to display)'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieChartData}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: '9px', marginTop: '10px' }} layout="horizontal" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Bar Chart for Dept Gap Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between min-h-[310px] transition-all hover:shadow-md">
          <div>
            <h4 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-display">
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{lang === 'VI' ? 'Chỉ số Thách thức & Rủi ro theo Bộ phận' : 'Talent Challenges & Risks by Department'}</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              {lang === 'VI'
                ? 'Tổng hợp số lượng vị trí gặp lỗ hổng (Critical), rủi ro cao hoặc chưa có người thay thế của từng bộ phận'
                : 'Aggregated count of critical positional gaps, high risks, or unmapped successors across business units'}
            </p>
          </div>
          <div className="h-48 w-full mt-4 text-[9px]">
            {deptBarChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                {lang === 'VI' ? '(Không có dữ liệu hiển thị)' : '(No data to display)'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptBarChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: '9px' }} verticalAlign="top" height={28} />
                  <Bar name={lang === 'VI' ? "Rủi ro" : "High Risk"} dataKey="highRiskCount" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  <Bar name={lang === 'VI' ? "TRỌNG YẾU (Rủi ro Cao + Thiếu hụt kế thừa)" : "Critical Gaps"} dataKey="criticalCount" fill="#7f1d1d" radius={[2, 2, 0, 0]} />
                  <Bar name={lang === 'VI' ? "Chưa xác định người Kế thừa" : "No Successor"} dataKey="noSuccessorCount" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Workspace Panel */}
      <div id="onboarding-pipeline-table-container" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Subheader and Controls */}
        <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-5 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center lg:text-left">
            <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center justify-center lg:justify-start gap-2 flex-wrap">
              <FolderOpen className="w-5 h-5 text-indigo-500 shrink-0" />
              <span className="whitespace-nowrap inline-block">
                {lang === 'VI' ? 'QUẢN LÝ MẠNG LƯỚI KẾ THỪA CHUẨN' : 'STANDARD SUCCESSION NETWORK MANAGEMENT'}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'VI'
                ? selectedDept === 'ALL'
                  ? 'Đang xem danh sách tất cả bộ phận (Toàn Site)'
                  : `Lọc bộ phận: ${selectedDept}`
                : selectedDept === 'ALL'
                  ? 'Viewing all departments roster (Entire Site)'
                  : `Filtered BU: ${selectedDept}`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-3 w-full lg:w-auto lg:justify-end">
            {onDeptChange && (
              <SearchableDeptDropdown
                selectedDept={selectedDept}
                onDeptChange={onDeptChange}
                lang={lang}
                allDepartments={allDepartments}
                widthClass="w-full sm:w-48 shrink-0"
                isTableFilter={true}
              />
            )}

            {/* Export CSV Button */}
            <button
              onClick={exportPipelineCSV}
              className="flex items-center justify-center gap-1.5 text-xs font-bold px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-250 hover:bg-emerald-100/70 hover:border-emerald-350 active:bg-emerald-200/50 rounded-lg transition-all duration-200 cursor-pointer shadow-3xs w-full sm:w-auto shrink-0 animate-fade-in whitespace-nowrap"
              title={lang === 'VI' ? 'Xuất đường ống kế thừa đang lọc ra tệp CSV để gửi email quản lý' : 'Export current filtered succession pipeline data to CSV file'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'VI' ? 'Xuất CSV' : 'Export CSV'}</span>
            </button>

            {/* Search Input */}
            <div className="relative w-full sm:w-56 shrink-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder={lang === 'VI' ? 'Tìm nhân sự, vị trí, người kế thừa...' : 'Search incumbent, role, successor...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 bg-white rounded-lg border border-slate-200 text-slate-800 outline-hidden hover:border-slate-300 focus:border-brand-cyan transition-all"
              />
            </div>

            {/* Matches Counter Pill added to satisfy criteria */}
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 font-sans font-black text-[10.5px] px-3 py-1.5 rounded-lg select-none shadow-3xs shrink-0">
              <span className="text-xs">📊</span>
              <span>{lang === 'VI' ? 'HIỂN THỊ:' : 'SHOWING:'}</span>
              <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded-md font-mono font-black text-xs">
                {filteredPositions.length}
              </span>
            </div>

            {/* Selector Action Buttons */}
            <div className="flex gap-1 p-1 bg-slate-200/60 rounded-lg w-full sm:w-auto shrink-0">
              <button
                onClick={() => setCurrentFilter('ALL')}
                className={`flex-grow sm:flex-none text-xs px-3.5 py-1.5 rounded-md font-bold transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1 ${
                  currentFilter === 'ALL'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{lang === 'VI' ? 'Tất cả' : 'All'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${currentFilter === 'ALL' ? 'bg-slate-100 text-slate-700 font-extrabold' : 'bg-slate-300/40 text-slate-600'}`}>
                  {deptPositions.length}
                </span>
              </button>
              <button
                onClick={() => setCurrentFilter('GAP')}
                className={`flex-grow sm:flex-none text-xs px-3.5 py-1.5 rounded-md font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                  currentFilter === 'GAP'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${currentFilter === 'GAP' ? 'text-white' : 'text-rose-500'}`} />
                <span>{lang === 'VI' ? 'Điểm nóng rủi ro (Hot Spots)' : 'High Risk Hot Spots'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${currentFilter === 'GAP' ? 'bg-white/20 text-white font-extrabold' : 'bg-rose-100 text-rose-700 font-semibold'}`}>
                  {deptPositions.filter(p => 
                    p.risk === 'High' || 
                    p.pipeline === 'Critical' || 
                    p.pipeline === 'At Risk' || 
                    p.status.includes('Interim') || 
                    p.status.includes('No Successor') || 
                    p.successor === 'None'
                  ).length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Canvas */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-[#1e1b4b] text-white select-none border-b border-[#0f172a] shadow-xs">
              <tr className="border-b border-indigo-950 font-sans">
                <th 
                  id="onboarding-pipeline-th-incumbent"
                  onClick={() => {
                    if (sortMainKey === 'incumbent') {
                      setSortMainDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setSortMainKey('incumbent');
                      setSortMainDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 uppercase tracking-wider font-bold text-white cursor-pointer hover:bg-indigo-950 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{lang === 'VI' ? 'Nhân sự hiện tại' : 'Current Incumbent'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${sortMainKey === 'incumbent' ? 'text-indigo-200' : 'text-slate-300 opacity-60'}`} />
                  </div>
                </th>
                <th 
                  id="onboarding-pipeline-th-dept"
                  onClick={() => {
                    if (sortMainKey === 'dept') {
                      setSortMainDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setSortMainKey('dept');
                      setSortMainDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 uppercase tracking-wider font-bold text-white cursor-pointer hover:bg-indigo-950 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{lang === 'VI' ? 'Bộ phận (Bp)' : 'Department (BU)'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${sortMainKey === 'dept' ? 'text-indigo-200' : 'text-slate-300 opacity-60'}`} />
                  </div>
                </th>
                <th 
                  id="onboarding-pipeline-th-role"
                  onClick={() => {
                    if (sortMainKey === 'role') {
                      setSortMainDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setSortMainKey('role');
                      setSortMainDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 uppercase tracking-wider font-bold text-white cursor-pointer hover:bg-indigo-950 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{lang === 'VI' ? 'Vị trí trọng yếu' : 'Key Role'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${sortMainKey === 'role' ? 'text-indigo-200' : 'text-slate-300 opacity-60'}`} />
                  </div>
                </th>
                <th 
                  id="onboarding-pipeline-th-risk"
                  onClick={() => {
                    if (sortMainKey === 'risk') {
                      setSortMainDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setSortMainKey('risk');
                      setSortMainDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 uppercase tracking-wider font-bold text-white cursor-pointer hover:bg-indigo-950 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{lang === 'VI' ? 'Mức Rủi Ro' : 'Risk Level'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${sortMainKey === 'risk' ? 'text-indigo-200' : 'text-slate-300 opacity-60'}`} />
                  </div>
                </th>
                <th 
                  id="onboarding-pipeline-th-status"
                  onClick={() => {
                    if (sortMainKey === 'status') {
                      setSortMainDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setSortMainKey('status');
                      setSortMainDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 uppercase tracking-wider font-bold text-white cursor-pointer hover:bg-indigo-950 transition-colors select-none text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{lang === 'VI' ? 'Bản đồ Tình Trạng' : 'Succession Map'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${sortMainKey === 'status' ? 'text-indigo-200' : 'text-slate-300 opacity-60'}`} />
                  </div>
                </th>
                <th 
                  id="onboarding-pipeline-th-interim"
                  onClick={() => {
                    if (sortMainKey === 'interim') {
                      setSortMainDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setSortMainKey('interim');
                      setSortMainDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 uppercase tracking-wider font-bold text-white cursor-pointer hover:bg-indigo-950 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{lang === 'VI' ? 'Tạm quyền' : 'Interim Head'} (Interim)</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${sortMainKey === 'interim' ? 'text-indigo-200' : 'text-slate-300 opacity-60'}`} />
                  </div>
                </th>
                <th 
                  id="onboarding-pipeline-th-successor"
                  onClick={() => {
                    if (sortMainKey === 'successor') {
                      setSortMainDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setSortMainKey('successor');
                      setSortMainDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 uppercase tracking-wider font-bold text-white cursor-pointer hover:bg-indigo-950 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{lang === 'VI' ? 'Người kế thừa' : 'Mapped Successor'} (Successor)</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${sortMainKey === 'successor' ? 'text-indigo-200' : 'text-slate-300 opacity-60'}`} />
                  </div>
                </th>
                <th 
                  id="onboarding-pipeline-th-readiness"
                  onClick={() => {
                    if (sortMainKey === 'readiness') {
                      setSortMainDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                    } else {
                      setSortMainKey('readiness');
                      setSortMainDir('asc');
                    }
                  }}
                  className="px-5 py-3.5 uppercase tracking-wider font-bold text-white cursor-pointer hover:bg-indigo-950 transition-colors select-none text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{lang === 'VI' ? 'Mức độ sẵn sàng' : 'Readiness'}</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 ${sortMainKey === 'readiness' ? 'text-indigo-200' : 'text-slate-300 opacity-60'}`} />
                  </div>
                </th>
                <th className="px-5 py-3.5 uppercase tracking-wider font-bold text-slate-600 text-right">
                  {lang === 'VI' ? 'Thay đổi' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredPositions.map((p, idx) => {
                let riskBadge = 'bg-slate-50 text-slate-600 border border-slate-200';
                if (p.risk === 'High') {
                  riskBadge = 'bg-rose-50 text-rose-800 border border-rose-200';
                } else if (p.risk === 'Medium') {
                  riskBadge = 'bg-amber-50 text-amber-800 border border-amber-200';
                }

                let readyBadge = 'bg-slate-50 text-slate-500';
                if (p.readiness === 'Ready Now') {
                  readyBadge = 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold';
                } else if (p.readiness === '< 1 Year') {
                  readyBadge = 'bg-sky-100 text-sky-800 border border-sky-200';
                } else if (p.readiness === '1-2 Years') {
                  readyBadge = 'bg-amber-100 text-amber-800 border border-amber-200';
                }

                let pipelineStyle = 'bg-slate-100 text-slate-700 border border-slate-200';
                if (p.status === 'No Successor Identified') {
                  pipelineStyle = 'bg-rose-50 text-rose-800 border border-rose-200 font-bold';
                } else if (p.status === 'Interim Coverage Only') {
                  pipelineStyle = 'bg-amber-50 text-amber-800 border border-amber-200 font-bold';
                } else if (p.status === 'Ready Successor Identified') {
                  pipelineStyle = 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold';
                } else if (p.status.includes('Development')) {
                  pipelineStyle = 'bg-sky-50 text-sky-700 border border-sky-100 font-bold';
                }

                // Bilingual display strings
                const displayRisk = lang === 'VI' 
                  ? p.risk === 'High' ? 'Cao' : p.risk === 'Medium' ? 'Trung bình' : 'Thấp'
                  : p.risk;

                const displayStatus = lang === 'VI'
                  ? p.status === 'No Successor Identified' ? 'Chưa xác định người Kế thừa'
                    : p.status === 'Interim Coverage Only' ? 'Chỉ có người tạm quyền'
                    : p.status === 'Ready Successor Identified' ? 'Đã xác định người Kế thừa'
                    : 'Đang đào tạo'
                  : p.status;

                const displayReadiness = lang === 'VI'
                  ? p.readiness === 'Ready Now' ? 'Nhận chức ngay'
                    : p.readiness === '< 1 Year' ? 'Dưới 1 năm'
                    : p.readiness === '1-2 Years' ? 'Từ 1-2 năm'
                    : 'Chưa có'
                  : p.readiness;

                return (
                  <tr
                    key={p.id}
                    id={idx === 0 ? "onboarding-pipeline-row-0" : undefined}
                    onClick={isLdMode ? () => handleStartEdit(p) : undefined}
                    className={`transition-colors group ${
                      isLdMode 
                        ? 'hover:bg-indigo-50/20 active:bg-slate-100 cursor-pointer' 
                        : 'hover:bg-slate-50'
                    }`}
                    title={isLdMode 
                      ? (lang === 'VI' ? 'Bấm vào bất kỳ đâu trên dòng này để quy hoạch kế thừa' : 'Click anywhere on this row to plan succession')
                      : undefined
                    }
                  >
                    <td className="px-5 py-3.5 text-slate-700 font-semibold whitespace-nowrap">
                      {p.incumbent === 'Open' ? (
                        <span className="bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                          {lang === 'VI' ? 'VỊ TRÍ TRỐNG' : 'OPEN POSITION'}
                        </span>
                      ) : (
                        p.incumbent
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-[10px] uppercase whitespace-nowrap">
                      {p.dept}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800 font-sans">
                        {p.role}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap inline-block ${riskBadge}`}>
                        {displayRisk}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap inline-block ${pipelineStyle}`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">
                      {p.interim === 'None' ? (
                        <span className="text-slate-350 italic">{lang === 'VI' ? 'Trống' : 'None'}</span>
                      ) : (
                        p.interim
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {p.successor === 'None' ? (
                        <span className="text-slate-400 italic font-light">{lang === 'VI' ? 'Chưa thiết lập' : 'Unmapped'}</span>
                      ) : (
                        <span className="font-semibold text-slate-800">{p.successor}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap inline-block ${readyBadge}`}>
                        {displayReadiness}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {isLdMode && (
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1 px-2.2 bg-slate-100 group-hover:bg-brand-blue group-hover:text-white text-slate-600 hover:text-white rounded transition-colors text-[10px] font-semibold flex items-center gap-1 inline-flex cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" /> {lang === 'VI' ? 'Quy hoạch' : 'Plan'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredPositions.length === 0 && (
                <tr className="bg-slate-50 text-center">
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-slate-400 italic text-xs"
                  >
                    {lang === 'VI' 
                      ? 'Không tìm thấy vị trí trọng yếu nào khớp với tiêu chí lựa chọn.' 
                      : 'No critical role found matching selected criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== BẢNG CHI TIẾT NHÂN SỰ THEO ĐIỂM NÓNG RỦI RO ==================== */}
      <div id="onboarding-pipeline-hotspots" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-6 p-6 mt-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-505 shrink-0" />
            <span>{lang === 'VI' ? 'CHI TIẾT NHÂN SỰ THEO CÁC ĐIỂM NÓNG RỦI RO' : 'COMPREHENSIVE HIGH RISK HOTSPOTS DETAIL PANELS'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'VI'
              ? 'Danh sách nhân sự và vị trí trọng yếu được phân loại sâu theo 3 nhóm cảnh báo đỏ cần hành động ngay lập tức.'
              : 'Direct deep-dive roster categorized into 3 urgent alert categories requiring immediately action.'}
          </p>
        </div>

        {/* Dynamic Selector Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3 font-sans">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="onboarding-pipeline-hotspots-tab-critical"
              onClick={() => setHotspotTab('CRITICAL')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all border ${
                hotspotTab === 'CRITICAL'
                  ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-xs'
                  : 'text-slate-500 border-transparent hover:text-slate-850 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>{lang === 'VI' ? 'Vị trí trọng yếu' : 'Critical Roles'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                hotspotTab === 'CRITICAL' ? 'bg-rose-700 text-white animate-pulse' : 'bg-rose-100/70 text-rose-800'
              }`}>
                {hotspotCritical.length}
              </span>
            </button>

            <button
              id="onboarding-pipeline-hotspots-tab-highrisk"
              onClick={() => setHotspotTab('HIGH_RISK')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all border ${
                hotspotTab === 'HIGH_RISK'
                  ? 'bg-amber-50 text-amber-800 border-amber-350 shadow-xs'
                  : 'text-slate-500 border-transparent hover:text-slate-850 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-600" />
              <span>{lang === 'VI' ? 'Nhóm Rủi Ro Cao' : 'High Risks'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                hotspotTab === 'HIGH_RISK' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-950 border border-amber-300'
              }`}>
                {hotspotHighRisk.length}
              </span>
            </button>

            <button
              id="onboarding-pipeline-hotspots-tab-failed"
              onClick={() => setHotspotTab('FAILED_PIPELINE')}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all border ${
                hotspotTab === 'FAILED_PIPELINE'
                  ? 'bg-indigo-50 text-indigo-805 border-indigo-250 shadow-xs'
                  : 'text-slate-500 border-transparent hover:text-slate-855 hover:bg-slate-50'
              }`}
            >
              <UserX className="w-4 h-4 text-indigo-500" />
              <span>{lang === 'VI' ? 'Thiếu hụt Kế thừa' : 'Successor Gaps'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                hotspotTab === 'FAILED_PIPELINE' ? 'bg-indigo-700 text-white' : 'bg-indigo-100/70 text-indigo-800'
              }`}>
                {hotspotFailed.length}
              </span>
            </button>
          </div>

          {/* Export Hotspot as CSV button */}
          <button
            onClick={exportActiveHotspotCSV}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-250 hover:bg-emerald-100/70 hover:border-emerald-350 active:bg-emerald-200/50 rounded-lg transition-all duration-200 cursor-pointer shadow-3xs shrink-0"
            title={lang === 'VI' ? 'Xuất bảng điểm nóng hiện tại ra tệp CSV để gửi email quản lý' : 'Export current hotspot data to CSV'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'VI' ? 'Xuất CSV Thống kê Hotspot' : 'Export Hotspots CSV'}</span>
          </button>
        </div>

        {/* Tab content Tables */}
        <div className="overflow-x-auto max-h-[380px] overflow-y-auto scrollbar-thin border border-slate-150 rounded-xl bg-slate-50/20">
          
          {/* HIGH_RISK Table */}
          {hotspotTab === 'HIGH_RISK' && (
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="sticky top-0 bg-[#1e1b4b] text-[#f1f5f9] font-bold border-b border-[#0f172a] z-10 select-none">
                <tr className="font-sans text-xs font-semibold text-[#f1f5f9]">
                  <th 
                    id="onboarding-pipeline-hr-th-incumbent"
                    onClick={() => {
                      if (sortHrKey === 'incumbent') {
                        setSortHrDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortHrKey('incumbent');
                        setSortHrDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Nhân sự hiện tại' : 'Incumbent'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortHrKey === 'incumbent' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    id="onboarding-pipeline-hr-th-dept"
                    onClick={() => {
                      if (sortHrKey === 'dept') {
                        setSortHrDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortHrKey('dept');
                        setSortHrDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Bộ phận' : 'Department'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortHrKey === 'dept' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    id="onboarding-pipeline-hr-th-role"
                    onClick={() => {
                      if (sortHrKey === 'role') {
                        setSortHrDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortHrKey('role');
                        setSortHrDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Vị trí trọng yếu' : 'Critical Role'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortHrKey === 'role' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    id="onboarding-pipeline-hr-th-risk"
                    onClick={() => {
                      if (sortHrKey === 'risk') {
                        setSortHrDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortHrKey('risk');
                        setSortHrDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{lang === 'VI' ? 'Mức Rủi Ro' : 'Risk Level'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortHrKey === 'risk' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    id="onboarding-pipeline-hr-th-successor"
                    onClick={() => {
                      if (sortHrKey === 'successor') {
                        setSortHrDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortHrKey('successor');
                        setSortHrDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Kế thừa tiềm năng (Successor)' : 'Mapped Successor'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortHrKey === 'successor' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    id="onboarding-pipeline-hr-th-readiness"
                    onClick={() => {
                      if (sortHrKey === 'readiness') {
                        setSortHrDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortHrKey('readiness');
                        setSortHrDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{lang === 'VI' ? 'Sẵn sàng' : 'Readiness'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortHrKey === 'readiness' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">{lang === 'VI' ? 'Thao tác' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {hotspotHighRisk.map((p) => {
                  const displayRisk = lang === 'VI' 
                    ? p.risk === 'High' ? 'Cao' : p.risk === 'Medium' ? 'Trung bình' : 'Thấp'
                    : p.risk;

                  const displayReadiness = lang === 'VI'
                    ? p.readiness === 'Ready Now' ? 'Nhận chức ngay'
                      : p.readiness === '< 1 Year' ? 'Dưới 1 năm'
                      : p.readiness === '1-2 Years' ? '1-2 năm'
                      : 'Chưa có'
                    : p.readiness;

                  return (
                    <tr 
                      key={`hr-${p.id}`} 
                      onClick={isLdMode ? () => handleStartEdit(p) : undefined}
                      className={`transition-colors ${
                        isLdMode ? 'hover:bg-amber-50/30 cursor-pointer' : 'hover:bg-slate-50'
                      }`}
                      title={isLdMode 
                        ? (lang === 'VI' ? 'Bấm vào bất kỳ đâu trên dòng này để quy hoạch kế thừa' : 'Click anywhere on this row to plan succession')
                        : undefined
                      }
                    >
                      <td className="px-4 py-3 text-slate-800 font-semibold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shrink-0"></span>
                          {p.incumbent === 'Open' ? (
                            <span className="bg-amber-100 text-amber-800 font-extrabold px-1 py-0.5 rounded text-[9px]">
                              {lang === 'VI' ? 'VỊ TRÍ TRỐNG' : 'OPEN POSITION'}
                            </span>
                          ) : (
                            p.incumbent
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[10px] uppercase whitespace-nowrap">{p.dept}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{p.role}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-0.5 border rounded-full font-bold text-[10px] whitespace-nowrap inline-flex items-center ${
                          p.risk === 'High' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                          p.risk === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                          'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          {displayRisk}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-semibold whitespace-nowrap">{p.successor === 'None' ? <span className="text-slate-350 italic font-normal">{lang === 'VI' ? 'Chưa có' : 'None'}</span> : p.successor}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border inline-flex items-center ${
                          p.readiness === 'Ready Now' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold' :
                          p.readiness === 'None' ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-amber-50 text-amber-800 border-amber-200 font-extrabold'
                        }`}>
                          {displayReadiness}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isLdMode && (
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="px-2.5 py-1 text-[10px] font-bold text-amber-700 hover:text-white hover:bg-amber-600 border border-amber-250 hover:border-amber-600 rounded transition-colors cursor-pointer whitespace-nowrap"
                          >
                            {lang === 'VI' ? 'Quy hoạch' : 'Plan'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {hotspotHighRisk.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                      {lang === 'VI' ? 'Không có nhân sự rủi ro cao trong bộ phận này.' : 'No high risk personnel found in this unit.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* CRITICAL Table */}
          {hotspotTab === 'CRITICAL' && (
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="sticky top-0 bg-[#1e1b4b] text-[#f1f5f9] font-bold border-b border-[#0f172a] z-10 select-none">
                <tr className="font-sans text-xs font-semibold text-[#f1f5f9]">
                  <th 
                    onClick={() => {
                      if (sortCritKey === 'incumbent') {
                        setSortCritDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortCritKey('incumbent');
                        setSortCritDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Nhân sự hiện tại' : 'Incumbent'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortCritKey === 'incumbent' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    onClick={() => {
                      if (sortCritKey === 'dept') {
                        setSortCritDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortCritKey('dept');
                        setSortCritDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Bộ phận' : 'Department'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortCritKey === 'dept' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    onClick={() => {
                      if (sortCritKey === 'role') {
                        setSortCritDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortCritKey('role');
                        setSortCritDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Vị trí trọng yếu' : 'Critical Role'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortCritKey === 'role' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    onClick={() => {
                      if (sortCritKey === 'risk') {
                        setSortCritDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortCritKey('risk');
                        setSortCritDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{lang === 'VI' ? 'Mức rủi ro' : 'Risk Level'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortCritKey === 'risk' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    onClick={() => {
                      if (sortCritKey === 'interim') {
                        setSortCritDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortCritKey('interim');
                        setSortCritDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Tạm quyền (Interim)' : 'Interim Coverage'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortCritKey === 'interim' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    onClick={() => {
                      if (sortCritKey === 'successor') {
                        setSortCritDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortCritKey('successor');
                        setSortCritDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Kế thừa (Successor)' : 'Successor'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortCritKey === 'successor' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">{lang === 'VI' ? 'Thao tác' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {hotspotCritical.map((p) => {
                  const displayRisk = lang === 'VI' 
                    ? p.risk === 'High' ? 'Cao' : p.risk === 'Medium' ? 'Trung bình' : 'Thấp'
                    : p.risk;

                  return (
                    <tr 
                      key={`crit-${p.id}`} 
                      onClick={isLdMode ? () => handleStartEdit(p) : undefined}
                      className={`transition-colors border-l-2 border-l-rose-500 ${
                        isLdMode ? 'hover:bg-rose-50/50 bg-rose-500/[0.015] cursor-pointer' : 'hover:bg-slate-50'
                      }`}
                      title={isLdMode 
                        ? (lang === 'VI' ? 'Bấm vào bất kỳ đâu trên dòng này để quy hoạch kế thừa' : 'Click anywhere on this row to plan succession')
                        : undefined
                      }
                    >
                      <td className="px-4 py-3 text-slate-800 font-extrabold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block shrink-0"></span>
                          <span className="w-2 h-2 rounded-full bg-rose-600 inline-block shrink-0 -ml-3.5 relative z-10"></span>
                          {p.incumbent === 'Open' ? (
                            <span className="bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                              {lang === 'VI' ? 'VỊ TRÍ TRỐNG' : 'OPEN POSITION'}
                            </span>
                          ) : (
                            p.incumbent
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[10px] uppercase whitespace-nowrap">{p.dept}</td>
                      <td className="px-4 py-3 font-semibold text-rose-950">
                        <div className="flex items-center gap-1.5 bg-rose-50/40 px-2 py-1 rounded border border-rose-100/50 inline-flex">
                          <Zap className="w-3.5 h-3.5 text-rose-600 animate-pulse shrink-0" />
                          <span>{p.role}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold whitespace-nowrap inline-flex items-center ${
                          p.risk === 'High' ? 'bg-rose-100 border-rose-350 text-rose-800 shadow-3xs' :
                          p.risk === 'Medium' ? 'bg-amber-100 border-amber-300 text-amber-900' :
                          'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          {displayRisk}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono whitespace-nowrap">
                        {p.interim === 'None' ? (
                          <span className="text-slate-350 italic font-sans text-xs">{lang === 'VI' ? 'Trống' : 'None'}</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] whitespace-nowrap inline-flex items-center font-sans font-medium">
                            📋 {p.interim}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-805 font-bold whitespace-nowrap">
                        {p.successor === 'None' ? (
                          <span className="text-rose-600 bg-rose-50/50 border border-rose-205/60 px-2 py-0.5 rounded font-bold text-[10px] animate-pulse inline-block">
                            🚨 {lang === 'VI' ? 'Chưa xác định' : 'Unmapped'}
                          </span>
                        ) : (
                          p.successor
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isLdMode && (
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="px-2.5 py-1 text-[10px] font-bold text-rose-800 hover:text-white hover:bg-rose-700 border border-rose-250 hover:border-rose-700 rounded transition-colors cursor-pointer whitespace-nowrap"
                          >
                            {lang === 'VI' ? 'Quy hoạch' : 'Plan'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {hotspotCritical.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                      {lang === 'VI' ? 'Không có vị trí critical nào trong bộ phận được chọn.' : 'No critical position found in this department.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* FAILED_PIPELINE Table */}
          {hotspotTab === 'FAILED_PIPELINE' && (
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="sticky top-0 bg-[#1e1b4b] text-[#f1f5f9] font-bold border-b border-[#0f172a] z-10 select-none">
                <tr className="font-sans text-xs font-semibold text-[#f1f5f9]">
                  <th 
                    id="onboarding-pipeline-fail-th-incumbent"
                    onClick={() => {
                      if (sortFailKey === 'incumbent') {
                        setSortFailDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortFailKey('incumbent');
                        setSortFailDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Nhân sự hiện tại' : 'Incumbent'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortFailKey === 'incumbent' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    id="onboarding-pipeline-fail-th-dept"
                    onClick={() => {
                      if (sortFailKey === 'dept') {
                        setSortFailDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortFailKey('dept');
                        setSortFailDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Bộ phận' : 'BU'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortFailKey === 'dept' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    id="onboarding-pipeline-fail-th-role"
                    onClick={() => {
                      if (sortFailKey === 'role') {
                        setSortFailDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortFailKey('role');
                        setSortFailDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Vị trí trọng yếu' : 'Key Role'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortFailKey === 'role' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    id="onboarding-pipeline-fail-th-risk"
                    onClick={() => {
                      if (sortFailKey === 'risk') {
                        setSortFailDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortFailKey('risk');
                        setSortFailDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{lang === 'VI' ? 'Mức rủi ro' : 'Risk Level'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortFailKey === 'risk' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    id="onboarding-pipeline-fail-th-interim"
                    onClick={() => {
                      if (sortFailKey === 'interim') {
                        setSortFailDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortFailKey('interim');
                        setSortFailDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Nhân sự tạm quyền (Interim)' : 'Interim Head'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortFailKey === 'interim' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th 
                    id="onboarding-pipeline-fail-th-status"
                    onClick={() => {
                      if (sortFailKey === 'status') {
                        setSortFailDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
                      } else {
                        setSortFailKey('status');
                        setSortFailDir('asc');
                      }
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-indigo-905/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{lang === 'VI' ? 'Tình trạng kế thừa' : 'Status Map'}</span>
                      <ArrowUpDown className={`w-3.5 h-3.5 ${sortFailKey === 'status' ? 'text-indigo-200' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">{lang === 'VI' ? 'Thao tác' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {hotspotFailed.map((p) => {
                  const displayRisk = lang === 'VI' 
                    ? p.risk === 'High' ? 'Cao' : p.risk === 'Medium' ? 'Trung bình' : 'Thấp'
                    : p.risk;

                  const displayStatus = lang === 'VI'
                    ? p.status === 'No Successor Identified' ? 'Chưa xác định người Kế thừa'
                      : p.status === 'Interim Coverage Only' ? 'Chỉ có người tạm quyền'
                      : p.status === 'Ready Successor Identified' ? 'Đã xác định người Kế thừa'
                      : 'Đang đào tạo'
                    : p.status;

                  return (
                    <tr 
                      key={`fail-${p.id}`} 
                      onClick={isLdMode ? () => handleStartEdit(p) : undefined}
                      className={`transition-colors ${
                        isLdMode ? 'hover:bg-amber-50/20 cursor-pointer' : 'hover:bg-slate-50'
                      }`}
                      title={isLdMode 
                        ? (lang === 'VI' ? 'Bấm vào bất kỳ đâu trên dòng này để quy hoạch kế thừa' : 'Click anywhere on this row to plan succession')
                        : undefined
                      }
                    >
                      <td className="px-4 py-3 text-slate-800 font-semibold whitespace-nowrap">{p.incumbent}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[10px] uppercase whitespace-nowrap">{p.dept}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{p.role}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold whitespace-nowrap inline-flex items-center ${
                          p.risk === 'High' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                          p.risk === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                          'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          {displayRisk}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        {p.interim === 'None' ? (
                          <span className="text-slate-350 italic font-sans">{lang === 'VI' ? 'Trống' : 'None'}</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] whitespace-nowrap inline-flex items-center">
                            📋 {p.interim}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 border rounded text-[10px] font-extrabold whitespace-nowrap inline-flex items-center ${
                          p.status === 'No Successor Identified' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                          p.status === 'Interim Coverage Only' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                          p.status === 'Ready Successor Identified' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                          p.status.includes('Development') ? 'bg-sky-50 border-sky-100 text-sky-700' :
                          'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isLdMode && (
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="px-2.5 py-1 text-[10px] font-bold text-amber-800 hover:text-white hover:bg-amber-600 border border-amber-205 hover:border-amber-600 rounded transition-colors cursor-pointer whitespace-nowrap"
                          >
                            {lang === 'VI' ? 'Quy hoạch' : 'Plan'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {hotspotFailed.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                      {lang === 'VI' ? 'Tuyệt vời! Không có vị trí nào hỏng kế thừa ở bộ phận này.' : 'Excellent! No succession failures identified in this BU.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Dynamic succession analysis panel similar to the 9-box style */}
        <div id="onboarding-pipeline-deep-analysis" className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-indigo-900 shadow-md animate-in slide-in-from-bottom duration-250 relative overflow-hidden mt-4">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-300 shrink-0 animate-pulse" />
              <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-indigo-200 font-display">
                {lang === 'VI' ? 'ĐÁNH GIÁ CHUYÊN SÂU PIPELINE & KHUYẾN NGHỊ QUY HOẠCH CHIẾN LƯỢC 2026' : 'SUCCESSION PIPELINE DEEP ANALYSIS & RECOMMENDATIONS'}
              </h4>
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              {lang === 'VI' ? 'Hỗ trợ Quyết định' : 'AI Strategic Decision'}
            </span>
          </div>

          <div className="space-y-5 text-left mt-2">
            {(() => {
              const tabDetails = {
                CRITICAL: {
                  accentBorder: 'border-l-4 border-l-rose-500',
                  badgeTextVi: 'CẢNH BÁO ĐỎ - CẤP BÁCH',
                  badgeTextEn: 'RED ALERT - CRITICAL',
                  badgeStyle: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
                  headerTextVi: 'Vị Trí Trọng Yếu (Rủi Ro Cao & Thiếu Kế Thừa)',
                  headerTextEn: 'Critical Threat Exposure (High Risk + Successor Gaps)',
                  introTextVi: 'CẢNH BÁO ĐỎ: Vị trí trọng yếu kép có nhân sự đương nhiệm rủi ro ra đi cao đồng thời thiếu hụt kế thừa hoàn toàn (chỉ có nhân sự tạm quyền Interim lo liệu ngắn hạn). Biến động tại đây ảnh hưởng nghiêm trọng đến vận hành.',
                  introTextEn: 'RED ALERT: These critical roles have double exposure—no designated successor is ready, and the incumbent is evaluated as High Risk. A sudden vacancy would immediately threaten operations.',
                  actionTitleVi: 'Chiến Lược Phòng Thủ Khẩn Cấp:',
                  actionTitleEn: 'Immediate Emergency Action Playbook:',
                  solidBg: 'bg-rose-950/35 border-rose-500/35 backdrop-blur-md',
                  solidBorder: 'border-l-4 border-l-rose-500',
                  itemStyle: 'bg-rose-950/40 hover:bg-rose-900/35 border-rose-500/30 hover:border-rose-400 text-rose-100 hover:shadow-[0_4px_14px_rgba(239,68,68,0.2)] shadow-xs',
                  numStyle: 'bg-rose-500 text-white font-mono shadow-[0_0_12px_rgba(239,68,68,0.45)]',
                  actionsVi: [
                    'Thiết lập gấp lộ trình Kèm cặp trực tiếp 1-kèm-1 (Shadowing & Mentoring) 3 tháng gần nhất cho lớp tạm quyền Interim.',
                    'Thành lập Hội đồng thẩm định khẩn cấp (HRBP và Trưởng phòng) đánh giá khả năng nâng chuẩn nhân sự Interim hiện tại.',
                    'Xin phê duyệt chính sách thưởng giữ chân đặc quyền (Special Retention Bonus) cho các đương nhiệm thuộc diện rủi ro cao.',
                    'Yêu cầu đương nhiệm hoàn thành bàn giao hồ sơ công việc cốt lõi và số hóa tài liệu nghiệp vụ khẩn cấp trong tháng này.'
                  ],
                  actionsEn: [
                    'Establish urgent internal Coaching & Mentoring paths to accelerate mapped interim coverage personnel.',
                    'Immediately draft high-potential internal successor list from adjacent departments for immediate rotation pipelines.',
                    'Implement deep-retention review policies and customized motivational incentives for current key incumbents.',
                    'Standardize standard operating procedures and request emergency knowledge transfer protocols from current leads.'
                  ]
                },
                HIGH_RISK: {
                  accentBorder: 'border-l-4 border-l-amber-500',
                  badgeTextVi: 'CẢNH BÁO RỦI RO CAO',
                  badgeTextEn: 'HIGH RISK EXPOSURE',
                  badgeStyle: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                  headerTextVi: 'Nhóm Rủi Ro Biến Động (Đương Nhiệm)',
                  headerTextEn: 'High Risk Personnel Cohort',
                  introTextVi: 'ĐÁNH GIÁ CHỈ SỐ RỦI RO BIẾN ĐỘNG: Nhân sự đương nhiệm rủi ro cao (High Risk) trong khảo sát nguồn lực. Cho dù đã có nhân sự kế thừa tạm quyền, các can thiệp bồi dưỡng thúc đẩy lộ trình sẵn sàng là bắt buộc để ngăn chặn đứt gãy năng lực.',
                  introTextEn: 'HIGH RISK ROLE EXPOSURE: Roles where the incumbent is marked as High Risk in the risk assessment. Even if they have successors or interim, proactive development interventions must be deployed to speed up readiness plans.',
                  actionTitleVi: 'Kế Hoạch Bồi Dưỡng Tốc Lực:',
                  actionTitleEn: 'Accelerated Development Playbook:',
                  solidBg: 'bg-amber-950/35 border-amber-500/35 backdrop-blur-md',
                  solidBorder: 'border-l-4 border-l-amber-500',
                  itemStyle: 'bg-amber-950/40 hover:bg-amber-900/35 border-amber-500/35 hover:border-amber-400 text-amber-100 hover:shadow-[0_4px_14px_rgba(245,158,11,0.2)] shadow-xs',
                  numStyle: 'bg-amber-500 text-white font-mono shadow-[0_0_12px_rgba(245,158,11,0.45)]',
                  actionsVi: [
                    'Giao phó luân chuyển dự án chéo thời gian ngắn (Cross-department rotation) bồi dưỡng thực tế về năng lực quản lý.',
                    'Cử nhân sự tham gia tọa đàm chuyên đề Lãnh đạo Phục vụ (Servant Leadership) do chính Ban Giám đốc làm điều phối viên.',
                    'Kiểm tra chéo năng lực hàng quý bằng bài sát hạch mô phỏng các tình huống xử lý sự cố phức tạp (Simulation Case).',
                    'Đồng bộ hóa đánh giá KPI bồi bồi dưỡng tài năng trực tiếp cho quản lý đương nhiệm gắn với kết quả trưởng thành lớp cận kề.'
                  ],
                  actionsEn: [
                    'Assign projects, cross-department rotations, and mock deputy duties to test critical on-the-job execution.',
                    'Enroll targets in internal strategic discussions or peer mentor modules led directly by Board of Directors.',
                    'Implement interactive quarterly challenge assessments focused on system handling and mock crisis exercises.',
                    'Formally link direct executive performance scores with successor readiness index levels at year-end evaluation.'
                  ]
                },
                FAILED_PIPELINE: {
                  accentBorder: 'border-l-4 border-l-indigo-500',
                  badgeTextVi: 'THIẾU HỤT KẾ THỪA',
                  badgeTextEn: 'SUCCESSOR GAP FOCUS',
                  badgeStyle: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
                  headerTextVi: 'Lỗ Hổng Thiếu Hụt Kế Thừa (Không Có Successor)',
                  headerTextEn: 'Successor Gaps (No Mapped Successor)',
                  introTextVi: 'PHÂN TÍCH LỖ HỔNG & THIẾU HỤT KẾ THỪA: Vị trí lâu dài chưa có người thừa kế được định biên rõ ràng (mới chỉ có tạm quyền). Cần ưu tiên các kế hoạch khai phá nhân tài nội bộ và áp dụng đào tạo ma trận kỹ năng tự bồi dưỡng.',
                  introTextEn: 'SUCCESSOR GAP ANALYSIS: Positional roles lacking designated high-headroom long-term successors, relying on interim fill-ins only. These gaps require systematic internal training to secure leadership pools.',
                  actionTitleVi: 'Lấp Đầy Khoảng Trống:',
                  actionTitleEn: 'Capacity Gap Refill Playbook:',
                  solidBg: 'bg-indigo-950/35 border-indigo-500/35 backdrop-blur-md',
                  solidBorder: 'border-l-4 border-l-indigo-500',
                  itemStyle: 'bg-indigo-950/40 hover:bg-indigo-900/35 border-indigo-500/35 hover:border-indigo-400 text-indigo-100 hover:shadow-[0_4px_14px_rgba(99,102,241,0.2)] shadow-xs',
                  numStyle: 'bg-indigo-500 text-white font-mono shadow-[0_0_12px_rgba(99,102,241,0.45)]',
                  actionsVi: [
                    'Sử dụng bảng 9-box quét toàn bộ nhân sự nhóm "Ngôi sao đang lên" toàn công ty để bồi dưỡng quy hoạch dài hạn.',
                    'Tổ chức Chiến dịch Đăng tuyển Cơ hội Nội bộ (Internal Job Posting Campaign) định kỳ 6 tháng hỗ trợ nhân viên xin thử sức.',
                    'Xây dựng Ngân hàng tài liệu Kỹ năng số ứng dụng nội bộ (Internal SME Tutorial Wiki) gồm các video hướng dẫn tự phục vụ.',
                    'Chuẩn hóa bộ Khung năng lực kỹ năng chuyên môn tự đào tạo chuẩn tại các bộ phận trọng yếu.'
                  ],
                  actionsEn: [
                    'Scan 9-box datasets for high-potential "Rising Stars" to nominate into strategic succession gaps.',
                    'Roll out systematic internal career path listings and development program applications every 6 months.',
                    'Create an in-house wiki and tutorial guide repository managed and produced by functional SMEs.',
                    'Standardize the complete local competency matrix framework to enable self-guided learning roadmaps.'
                  ]
                }
              };

              const config = tabDetails[hotspotTab] || tabDetails.HIGH_RISK;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* Left Column: Assessment Insights with high contrast border */}
                  <div className={`lg:col-span-5 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-inner border ${config.solidBg}`}>
                    {/* Visual glowing layout backdrops */}
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-500/5 rounded-full pointer-events-none blur-xl" />
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] sm:text-[11px] font-black tracking-wider px-2.5 py-1 rounded-lg uppercase ${config.badgeStyle}`}>
                          {lang === 'VI' ? config.badgeTextVi : config.badgeTextEn}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      </div>
                      
                      <h5 className="font-display font-semibold text-sm text-indigo-200">
                        {lang === 'VI' ? config.headerTextVi : config.headerTextEn}
                      </h5>
                      
                      <p className={`text-[11px] sm:text-[11.5px] text-slate-200 leading-relaxed font-sans pl-4 ${config.solidBorder}`}>
                        {lang === 'VI' ? config.introTextVi : config.introTextEn}
                      </p>
                    </div>

                    <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[10px] text-indigo-300/80 font-mono">
                      <span>MONITORING PRIORITY</span>
                      <span className="font-bold">MILLENNIUM L&D 2026</span>
                    </div>
                  </div>

                  {/* Right Column: Key Action Recommendations with styled grid items */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider font-mono font-extrabold text-indigo-300/90">
                        {lang === 'VI' ? config.actionTitleVi : config.actionTitleEn}
                      </span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {config.actionsVi.map((actVi, idx) => {
                          const actEn = config.actionsEn[idx];
                          return (
                            <div 
                              key={idx}
                              className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-200 cursor-default hover:translate-y-[-1.5px] ${config.itemStyle}`}
                            >
                              <span className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center text-xs font-mono font-black shrink-0 ${config.numStyle}`}>
                                {idx + 1}
                              </span>
                              <span className="text-[11px] sm:text-[11.5px] leading-relaxed font-medium">
                                {lang === 'VI' ? actVi : actEn}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* AI pipeline advisory disclaimer warning */}
            <div id="ai-disclaimer-pipeline" className="mt-5 flex items-start gap-2 p-2.5 bg-rose-950/45 border border-rose-500/25 rounded-xl text-[10px] sm:text-[11px] leading-relaxed text-rose-200/90 select-none shadow-3xs">
              <BellRing className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <span className="font-extrabold uppercase tracking-wider text-rose-300 mr-1.5 inline-block text-[9.5px] sm:text-[10.5px]">
                  {lang === 'VI' ? '⚠️ ĐỀ XUẤT HỖ TRỢ TỪ AI:' : '⚠️ AI-DRIVEN ASSISTANT SUGGESTION:'}
                </span>
                {lang === 'VI'
                  ? 'Ý kiến chẩn đoán rủi ro và khuyến nghị lược đồ kế thừa trên được sinh tự động nhằm mục đích tham khảo. Các quyết định cuối cùng thuộc về các Bộ phận Chức năng/ Chuyên môn hoặc Trưởng bộ phận.'
                  : 'Exposure warnings and pipeline guidelines act strictly as diagnostic templates. Final decisions belong to the Functional/Specialized Departments or Department Heads.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded edit modal overlay */}
      {editingPos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-3xs p-4">
          <div id="onboarding-pipeline-modal" className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden transform transition-all">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <span className="font-display font-semibold text-sm flex items-center gap-2">
                ✒️ {lang === 'VI' ? `Quy hoạch kế thừa cho ${editingPos.role}` : `Succession planning for ${editingPos.role}`}
              </span>
              <button
                id="onboarding-pipeline-modal-close-btn"
                onClick={() => {
                  setEditingPos(null);
                  window.dispatchEvent(new CustomEvent('onboarding-pipeline-modal-closed'));
                }}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded cursor-pointer animate-pulse"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{lang === 'VI' ? 'Nhân sự hiện tại:' : 'Current incumbent:'}</span>
                  <span className="font-bold text-slate-800">
                    {editingPos.incumbent === 'Open' ? (lang === 'VI' ? 'VỊ TRÍ TRỐNG' : 'OPEN POSITION') : editingPos.incumbent}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{lang === 'VI' ? 'Phòng ban:' : 'Department/BU:'}</span>
                  <span className="font-bold text-slate-800 font-mono text-[10px]">{editingPos.dept}</span>
                </div>
              </div>

              {/* Rủi ro */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                  {lang === 'VI' ? 'Mức Rủi Ro Vị Trí' : 'Position Risk Level (Risk Level)'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['High', 'Medium', 'Low'] as const).map((rl) => {
                    const isActive = riskLevel === rl;
                    const style = isActive
                      ? rl === 'High'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 font-semibold shadow-xs'
                        : rl === 'Medium'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 font-semibold shadow-xs'
                        : 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50';

                    const displayLabel = lang === 'VI'
                      ? rl === 'High' ? 'Cao (High)' : rl === 'Medium' ? 'Trung bình' : 'Thấp (Low)'
                      : rl;

                    return (
                      <button
                        type="button"
                        key={rl}
                        onClick={() => setRiskLevel(rl)}
                        className={`py-1.5 rounded-lg border text-center font-medium transition-all cursor-pointer ${style}`}
                      >
                        {displayLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interim */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                  {lang === 'VI' ? 'Nhân Sự Tạm Quyền (Interim Coverage)' : 'Interim Backup Coverage'}
                </label>
                <input
                  type="text"
                  value={interimName}
                  onChange={(e) => setInterimName(e.target.value)}
                  placeholder={lang === 'VI' ? 'Ví dụ: LINDSAY / AKINA, hoặc để trống' : 'E.g., LINDSAY / AKINA, or blank'}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-800 outline-hidden hover:border-slate-300 focus:border-brand-cyan transition-all"
                />
              </div>

              {/* Successor Candidate */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                  {lang === 'VI' ? 'Ứng Viên Kế Thừa (Successor Name)' : 'Mapped Successor Candidate'}
                </label>
                <input
                  type="text"
                  value={successorName}
                  onChange={(e) => setSuccessorName(e.target.value)}
                  placeholder={lang === 'VI' ? 'Tên ứng viên kế thừa chính, ví dụ: NGUYỄN NHẬT DUY' : 'Primary successor name, e.g., LINDSAY TAO'}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-800 outline-hidden hover:border-slate-300 focus:border-brand-cyan transition-all"
                />
              </div>

              {/* Readiness Target */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                  {lang === 'VI' ? 'Mức Độ Sẵn Sàng Kế Thừa (Readiness)' : 'Succession Readiness Level'}
                </label>
                <select
                  value={readiness}
                  onChange={(e: any) => setReadiness(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 text-slate-800 outline-hidden hover:border-slate-300 focus:border-brand-cyan transition-all cursor-pointer"
                >
                  <option value="None">{lang === 'VI' ? 'Chưa Sẵn Sàng (None)' : 'Under Development (None)'}</option>
                  <option value="Ready Now">{lang === 'VI' ? 'Có Thể Nhậm Chức Ngay (Ready Now)' : 'Ready Now'}</option>
                  <option value="< 1 Year">{lang === 'VI' ? 'Dưới 1 Năm (< 1 Year)' : 'Within 1 Year (< 1 Year)'}</option>
                  <option value="1-2 Years">{lang === 'VI' ? 'Từ 1 Đến 2 Năm (1-2 Years)' : '1 to 2 Years (1-2 Years)'}</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setEditingPos(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {lang === 'VI' ? 'Hủy bỏ' : 'Cancel'}
                </button>
                <button
                  onClick={handleSavePosition}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {lang === 'VI' ? 'Xác nhận Quy hoạch' : 'Save Succession Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
