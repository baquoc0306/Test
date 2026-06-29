import React from 'react';
import { Talent, NineBoxCell, NineBoxGroup } from '../types';
import { motion } from 'motion/react';

interface NineBoxMatrixProps {
  talents: Talent[];
  selectedBox: NineBoxCell | 'ALL';
  onSelectBox: (box: NineBoxCell | 'ALL') => void;
  onSelectTalent: (talent: Talent) => void;
  onReclassifyTalent?: (talentName: string, targetCell: NineBoxCell) => void;
  lang?: 'VI' | 'EN';
  isLdMode?: boolean;
}

interface CellConfig {
  id: string;
  name: NineBoxCell;
  label: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export default function NineBoxMatrix({
  talents,
  selectedBox,
  onSelectBox,
  onSelectTalent,
  onReclassifyTalent,
  lang = 'VI',
  isLdMode = false,
}: NineBoxMatrixProps) {
  const [dragOverCell, setDragOverCell] = React.useState<NineBoxCell | null>(null);
  const [detailedCellModal, setDetailedCellModal] = React.useState<CellConfig | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, cellName: NineBoxCell) => {
    e.preventDefault();
    setDragOverCell(cellName);
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, targetCell: NineBoxCell) => {
    e.preventDefault();
    setDragOverCell(null);
    const talentName = e.dataTransfer.getData("text/plain");
    if (talentName && onReclassifyTalent) {
      onReclassifyTalent(talentName, targetCell);
    }
  };

  // Custom subtle indicators for each 9-Box classification to capture status immediately without clicking popups
  const cellIcons: Record<string, string> = {
    superstar: '👑', // Crown for Super Star
    highprof: '🚀',  // Rocket for High Professional
    seasoned: '🏆',  // Trophy for Seasoned Professional
    solid: '🛡️',     // Shield for Solid Professional
    valued: '🤝',    // Handshake for Valued Contributor
    rising: '✨',    // Sparkle for Rising Star
    learning: '📚',  // Book for Learning Professional
    future: '⏳',    // Hourglass for Future Utility
    diamond: '💎',   // Diamond for Raw Diamond / Diamond in the Rough
  };

  // Configured in 3 row blocks (top to bottom as in original layout) with intensified contrast active on hovers
  const cells: CellConfig[] = [
    // Top Row (Results: High Effective)
    {
      id: 'seasoned',
      name: 'Seasoned Professional',
      label: lang === 'VI' ? 'Nhân sự dày dặn' : 'Seasoned Professional',
      bgClass: 'bg-amber-50/35 border-amber-250 hover:bg-amber-100/60 hover:border-amber-400',
      borderClass: 'border-l-4 border-l-[#d97706] border-amber-200',
      textClass: 'text-amber-900',
    },
    {
      id: 'highprof',
      name: 'High Professional',
      label: lang === 'VI' ? 'Nhân sự xuất sắc' : 'High Professional',
      bgClass: 'bg-emerald-50/35 border-emerald-250 hover:bg-emerald-100/60 hover:border-emerald-400',
      borderClass: 'border-l-4 border-l-[#059669] border-emerald-200',
      textClass: 'text-emerald-900',
    },
    {
      id: 'superstar',
      name: 'Superstar',
      label: lang === 'VI' ? 'Siêu sao' : 'Superstar',
      bgClass: 'bg-emerald-50/45 border-emerald-250 hover:bg-emerald-100/70 hover:border-emerald-500',
      borderClass: 'border-l-4 border-l-[#10b981] border-emerald-300',
      textClass: 'text-emerald-950 font-extrabold',
    },

    // Middle Row (Results: Effective)
    {
      id: 'solid',
      name: 'Solid Professional',
      label: lang === 'VI' ? 'Nhân sự vững vàng' : 'Solid Professional',
      bgClass: 'bg-amber-50/35 border-amber-250 hover:bg-amber-100/60 hover:border-amber-400',
      borderClass: 'border-l-4 border-l-[#d97706] border-amber-200',
      textClass: 'text-amber-900',
    },
    {
      id: 'valued',
      name: 'Valued Contributor',
      label: lang === 'VI' ? 'Người Đóng góp Chủ lực' : 'Valued Contributor',
      bgClass: 'bg-amber-50/35 border-amber-250 hover:bg-amber-100/60 hover:border-amber-400',
      borderClass: 'border-l-4 border-l-[#b45309] border-amber-200',
      textClass: 'text-amber-900',
    },
    {
      id: 'rising',
      name: 'Rising Star',
      label: lang === 'VI' ? 'Ngôi sao đang lên' : 'Rising Star',
      bgClass: 'bg-emerald-50/35 border-emerald-250 hover:bg-emerald-100/60 hover:border-emerald-400',
      borderClass: 'border-l-4 border-l-[#059669] border-emerald-200',
      textClass: 'text-emerald-900',
    },

    // Bottom Row (Results: Less Effective)
    {
      id: 'learning',
      name: 'Learning Professional',
      label: lang === 'VI' ? 'Nhân sự cần hoàn thiện' : 'Learning Professional',
      bgClass: 'bg-rose-50/35 border-rose-250 hover:bg-rose-100/60 hover:border-rose-400',
      borderClass: 'border-l-4 border-l-[#dc2626] border-rose-200',
      textClass: 'text-rose-900',
    },
    {
      id: 'future',
      name: 'Future Utility',
      label: lang === 'VI' ? 'Nhân tố dự phòng tương lai' : 'Future Utility',
      bgClass: 'bg-rose-50/35 border-rose-250 hover:bg-rose-100/60 hover:border-rose-400',
      borderClass: 'border-l-4 border-l-[#b91c1c] border-rose-200',
      textClass: 'text-rose-900',
    },
    {
      id: 'diamond',
      name: 'Diamond in the Rough',
      label: lang === 'VI' ? 'Kim cương thô' : 'Diamond in the Rough',
      bgClass: 'bg-rose-50/35 border-rose-250 hover:bg-rose-100/60 hover:border-rose-400',
      borderClass: 'border-l-4 border-l-[#991b1b] border-rose-200',
      textClass: 'text-rose-900',
    },
  ];

  const handleCellClick = (cellName: NineBoxCell) => {
    if (selectedBox === cellName) {
      onSelectBox('ALL'); // Toggle off
    } else {
      onSelectBox(cellName);
    }
  };

  const renderCellContent = (cell: CellConfig, cellTalents: Talent[]) => {
    const icon = cellIcons[cell.id] || '👤';
    return (
      <>
        <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-1.5 mb-2 select-none text-[9.5px] md:text-[10.5px] uppercase font-bold text-slate-700">
          <span className={`${cell.textClass} flex items-center gap-1`}>
            <span className="text-[13px] filter drop-shadow-xs transform group-hover:scale-125 transition-transform shrink-0" role="img" aria-label={cell.label}>
              {icon}
            </span>
            <span>{cell.label}</span>
          </span>
          <span className="bg-slate-200/70 text-slate-900 px-2.5 py-0.5 rounded-full font-mono font-black text-[9.5px] shadow-3xs border border-slate-100">
            {cellTalents.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1.5 pr-1 max-h-[135px]">
          {cellTalents.map((t) => (
            <div
              key={t.name}
              draggable={isLdMode}
              onDragStart={isLdMode ? (e) => {
                e.dataTransfer.setData("text/plain", t.name);
                e.dataTransfer.effectAllowed = "move";
              } : undefined}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTalent(t);
              }}
              className={`group flex items-center justify-between text-[11px] bg-white/95 hover:bg-white text-slate-800 px-2 py-1.5 rounded-lg border border-slate-200 shadow-3xs hover:border-indigo-300 transition-all cursor-pointer ${
                isLdMode ? 'cursor-grab active:cursor-grabbing hover:scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
            >
              <span className="truncate font-medium">{t.name}</span>
              {isLdMode ? (
                <span className="text-[10px] text-slate-400 group-hover:text-indigo-550 shrink-0 ml-1 font-semibold select-none">
                  ⋮⋮
                </span>
              ) : (
                <span className="text-[9px] text-slate-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-1 font-mono uppercase font-bold select-none">
                  {lang === 'VI' ? 'Xem' : 'View'}
                </span>
              )}
            </div>
          ))}

          {cellTalents.length === 0 && (
            <div className="h-full flex items-center justify-center text-[10px] text-slate-400 italic font-mono py-4">
              {lang === 'VI' ? '(Trống)' : '(Empty)'}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
          {lang === 'VI' ? 'Phân bổ theo Ma trận 9-BOX' : 'Grid Matrix Distribution (9-Box Layout)'}
        </div>
        {selectedBox !== 'ALL' && (
          <button
            onClick={() => onSelectBox('ALL')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
          >
            {lang === 'VI' ? '🔄 Xem toàn bộ ma trận (Tất cả)' : '🔄 View Full Matrix (All)'}
          </button>
        )}
      </div>

      <motion.div 
        key={talents.map(t => `${t.name}-${t.cell}`).join('|')}
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="grid grid-cols-[auto_1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr_auto] gap-3 bg-slate-50/65 p-4 rounded-2xl border border-slate-200"
      >
        {/* --- HIGH EFFECTIVE ROW --- */}
        <div className="flex items-center justify-center font-sans font-black text-[9px] md:text-2xs text-slate-400 uppercase tracking-wider [writing-mode:vertical-lr] rotate-180 select-none text-center">
          {lang === 'VI' ? 'HIỆU SUẤT CAO (HIGH)' : 'HIGH EFFECTIVE'}
        </div>
        {cells.slice(0, 3).map((cell) => {
          const cellTalents = talents.filter((t) => t.cell === cell.name);
          const isSelected = selectedBox === cell.name;
          const isDragOver = isLdMode && dragOverCell === cell.name;
          return (
            <div
              key={cell.id}
              id={`onboarding-cell-${cell.id}`}
              onClick={() => handleCellClick(cell.name)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setDetailedCellModal(cell);
                window.dispatchEvent(new CustomEvent('onboarding-cell-doubleclicked'));
              }}
              onDragOver={isLdMode ? handleDragOver : undefined}
              onDragEnter={isLdMode ? (e) => handleDragEnter(e, cell.name) : undefined}
              onDragLeave={isLdMode ? handleDragLeave : undefined}
              onDrop={isLdMode ? (e) => handleDrop(e, cell.name) : undefined}
              title={lang === 'VI' ? 'Nhấp đúp chuột để xem chi tiết đầy đủ' : 'Double-click to view full list'}
              className={`relative group flex flex-col min-h-[145px] max-h-[185px] rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${cell.bgClass} ${cell.borderClass} interactive-hover-lift ${
                isSelected
                  ? 'ring-2 ring-indigo-600 ring-offset-2 scale-[1.01] shadow-md z-10 bg-white'
                  : isDragOver
                    ? 'ring-2 ring-emerald-500 bg-emerald-55/70 border-emerald-400 scale-[1.02] shadow-md z-20'
                    : 'shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Floating Tooltip showing exact counts on hover */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none invisible group-hover:visible opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 bg-slate-950 text-white text-[10.5px] px-3 py-1.5 rounded-lg font-bold shadow-xl border border-slate-750/90 whitespace-nowrap z-50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-subtle" />
                <span>{cell.label}: <strong className="text-indigo-300 font-mono text-xs">{cellTalents.length}</strong> {lang === 'VI' ? 'Nhân sự' : 'Heads'}</span>
              </div>
              {renderCellContent(cell, cellTalents)}
            </div>
          );
        })}

        {/* --- EFFECTIVE ROW --- */}
        <div className="flex items-center justify-center font-sans font-black text-[9px] md:text-2xs text-slate-400 uppercase tracking-wider [writing-mode:vertical-lr] rotate-180 select-none text-center">
          {lang === 'VI' ? 'HIỆU SUẤT ĐẠT (MID)' : 'EFFECTIVE'}
        </div>
        {cells.slice(3, 6).map((cell) => {
          const cellTalents = talents.filter((t) => t.cell === cell.name);
          const isSelected = selectedBox === cell.name;
          const isDragOver = isLdMode && dragOverCell === cell.name;
          return (
            <div
              key={cell.id}
              id={`onboarding-cell-${cell.id}`}
              onClick={() => handleCellClick(cell.name)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setDetailedCellModal(cell);
                window.dispatchEvent(new CustomEvent('onboarding-cell-doubleclicked'));
              }}
              onDragOver={isLdMode ? handleDragOver : undefined}
              onDragEnter={isLdMode ? (e) => handleDragEnter(e, cell.name) : undefined}
              onDragLeave={isLdMode ? handleDragLeave : undefined}
              onDrop={isLdMode ? (e) => handleDrop(e, cell.name) : undefined}
              title={lang === 'VI' ? 'Nhấp đúp chuột để xem chi tiết đầy đủ' : 'Double-click to view full list'}
              className={`relative group flex flex-col min-h-[145px] max-h-[185px] rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${cell.bgClass} ${cell.borderClass} interactive-hover-lift ${
                isSelected
                  ? 'ring-2 ring-indigo-600 ring-offset-2 scale-[1.01] shadow-md z-10 bg-white'
                  : isDragOver
                    ? 'ring-2 ring-emerald-500 bg-emerald-55/70 border-emerald-400 scale-[1.02] shadow-md z-20'
                    : 'shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Floating Tooltip showing exact counts on hover */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none invisible group-hover:visible opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 bg-slate-950 text-white text-[10.5px] px-3 py-1.5 rounded-lg font-bold shadow-xl border border-slate-750/90 whitespace-nowrap z-50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-subtle" />
                <span>{cell.label}: <strong className="text-indigo-300 font-mono text-xs">{cellTalents.length}</strong> {lang === 'VI' ? 'Nhân sự' : 'Heads'}</span>
              </div>
              {renderCellContent(cell, cellTalents)}
            </div>
          );
        })}

        {/* --- LESS EFFECTIVE ROW --- */}
        <div className="flex items-center justify-center font-sans font-black text-[9px] md:text-2xs text-slate-400 uppercase tracking-wider [writing-mode:vertical-lr] rotate-180 select-none text-center">
          {lang === 'VI' ? 'HIỆU SUẤT THẤP (LOW)' : 'LESS EFFECTIVE'}
        </div>
        {cells.slice(6, 9).map((cell) => {
          const cellTalents = talents.filter((t) => t.cell === cell.name);
          const isSelected = selectedBox === cell.name;
          const isDragOver = isLdMode && dragOverCell === cell.name;
          return (
            <div
              key={cell.id}
              id={`onboarding-cell-${cell.id}`}
              onClick={() => handleCellClick(cell.name)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setDetailedCellModal(cell);
                window.dispatchEvent(new CustomEvent('onboarding-cell-doubleclicked'));
              }}
              onDragOver={isLdMode ? handleDragOver : undefined}
              onDragEnter={isLdMode ? (e) => handleDragEnter(e, cell.name) : undefined}
              onDragLeave={isLdMode ? handleDragLeave : undefined}
              onDrop={isLdMode ? (e) => handleDrop(e, cell.name) : undefined}
              title={lang === 'VI' ? 'Nhấp đúp chuột để xem chi tiết đầy đủ' : 'Double-click to view full list'}
              className={`relative group flex flex-col min-h-[145px] max-h-[185px] rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${cell.bgClass} ${cell.borderClass} interactive-hover-lift ${
                isSelected
                  ? 'ring-2 ring-indigo-600 ring-offset-2 scale-[1.01] shadow-md z-10 bg-white'
                  : isDragOver
                    ? 'ring-2 ring-emerald-500 bg-emerald-55/70 border-emerald-400 scale-[1.02] shadow-md z-20'
                    : 'shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Floating Tooltip showing exact counts on hover */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none invisible group-hover:visible opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 bg-slate-950 text-white text-[10.5px] px-3 py-1.5 rounded-lg font-bold shadow-xl border border-slate-750/90 whitespace-nowrap z-50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-subtle" />
                <span>{cell.label}: <strong className="text-indigo-300 font-mono text-xs">{cellTalents.length}</strong> {lang === 'VI' ? 'Nhân sự' : 'Heads'}</span>
              </div>
              {renderCellContent(cell, cellTalents)}
            </div>
          );
        })}

        {/* --- COLD LABELS (X-axis Potential) --- */}
        <div /> {/* Top left spacer */}
        <div className="text-center font-mono font-bold text-[9px] md:text-2xs text-slate-400 uppercase tracking-widest py-2 select-none">
          {lang === 'VI' ? 'Tiềm năng Thấp (Low)' : 'LOW POTENTIAL'}
        </div>
        <div className="text-center font-mono font-bold text-[9px] md:text-2xs text-slate-400 uppercase tracking-widest py-2 select-none">
          {lang === 'VI' ? 'Tiềm năng Trung bình (Mid)' : 'MID POTENTIAL'}
        </div>
        <div className="text-center font-mono font-bold text-[9px] md:text-2xs text-slate-400 uppercase tracking-widest py-2 select-none">
          {lang === 'VI' ? 'Tiềm năng Cao (High)' : 'HIGH POTENTIAL'}
        </div>
      </motion.div>

      {/* POPUP OVERLAY MODAL TO VIEW ALL NAMES IN A CELL WITHOUT TRUNCATION OR SCROLLING */}
      {detailedCellModal && (() => {
        const modalTalents = talents.filter(t => t.cell === detailedCellModal.name);
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none" style={{ zIndex: 9999 }}>
            <div id="onboarding-cell-detail-modal" className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4.5 flex items-center justify-between">
                <div>
                  <h3 className="line-clamp-1 text-sm font-black tracking-tight text-slate-800 uppercase font-display flex items-center gap-2">
                    <span className="p-1 px-1.5 bg-indigo-100 rounded-lg text-indigo-650">👥</span>
                    <span>
                      {lang === 'VI' ? 'Tất cả nhân sự cốt cán: ' : 'All Segment Members: '} {detailedCellModal.label}
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-slate-500 font-medium mt-1">
                    {lang === 'VI' ? `Tổng cộng ${modalTalents.length} nhân sự có năng lực thuộc phân vùng này` : `Total ${modalTalents.length} high-potential personnel in this strategic cell`}
                  </p>
                </div>
                <button
                  id="onboarding-cell-detail-close-btn"
                  onClick={() => {
                    setDetailedCellModal(null);
                    window.dispatchEvent(new CustomEvent('onboarding-cell-modal-closed'));
                  }}
                  className="w-8 h-8 rounded-full hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 overflow-y-auto scrollbar-thin bg-slate-50/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {modalTalents.map((t) => (
                    <div
                      key={t.name}
                      onClick={() => {
                        onSelectTalent(t);
                        setDetailedCellModal(null);
                        window.dispatchEvent(new CustomEvent('onboarding-cell-modal-closed'));
                      }}
                      className="group flex flex-col justify-between p-4 bg-white hover:bg-indigo-50/45 border border-slate-200 hover:border-indigo-200 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-xs text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-black text-slate-800 group-hover:text-indigo-650 font-display transition-colors">
                            {t.name}
                          </div>
                          <div className="text-[10px] text-slate-450 mt-1 uppercase font-mono font-bold tracking-wider">
                            🏢 {t.dept}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border text-center font-bold shrink-0 self-start uppercase tracking-wider ${
                          t.group === 'Growers' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : t.group === 'Keepers' 
                              ? 'bg-amber-50 border-amber-200 text-amber-800' 
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}>
                          {lang === 'VI'
                            ? t.group === 'Growers' ? 'Nhóm Phát triển' : t.group === 'Keepers' ? 'Nhóm Duy trì' : 'Nhóm Luân chuyển'
                            : t.group}
                        </span>
                      </div>
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-medium">
                          {lang === 'VI' ? 'Hiệu suất / Tiềm năng:' : 'Performance / Potential:'}
                        </span>
                        <span className="font-mono font-extrabold text-slate-700 bg-slate-100 text-[9.5px] px-2 py-0.5 rounded border border-slate-200">
                          {t.results} / {t.potential}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setDetailedCellModal(null)}
                  className="px-4.5 py-2 bg-slate-900 hover:bg-slate-805 text-white border border-slate-900 rounded-xl font-bold transition-all text-xs cursor-pointer shadow-3xs"
                >
                  {lang === 'VI' ? 'Đóng cửa sổ' : 'Close Window'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
