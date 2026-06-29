import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Building, X } from 'lucide-react';

interface SearchableDeptDropdownProps {
  selectedDept: string;
  onDeptChange: (dept: string) => void;
  lang: 'VI' | 'EN';
  allDepartments: string[];
  widthClass?: string;
  isTableFilter?: boolean;
}

export const SearchableDeptDropdown: React.FC<SearchableDeptDropdownProps> = ({
  selectedDept,
  onDeptChange,
  lang,
  allDepartments,
  widthClass = 'w-full sm:w-80',
  isTableFilter = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const getLabel = (dept: string) => {
    if (dept === 'ALL') {
      return lang === 'VI' ? 'TẤT CẢ BỘ PHẬN' : 'ALL SITE MILLENNIUM DEPARTMENTS';
    }
    return dept;
  };

  const getShortLabel = (dept: string) => {
    if (dept === 'ALL') {
      return lang === 'VI' ? 'Tất cả bộ phận' : 'All Departments';
    }
    return dept;
  };

  // Filtered departments based on search query
  const filteredDepts = allDepartments.filter((dept) => {
    const label = getLabel(dept).toLowerCase();
    const query = searchQuery.toLowerCase();
    return label.includes(query) || dept.toLowerCase().includes(query);
  });

  return (
    <div ref={dropdownRef} className={`relative ${widthClass} font-sans`}>
      {/* Target button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left cursor-pointer transition-all border outline-hidden ${
          isTableFilter
            ? 'px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200/60 text-slate-705 border-slate-200 rounded-lg'
            : 'px-4 py-3 text-xs font-bold text-slate-805 bg-slate-50 hover:bg-slate-100 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-505 shadow-3xs'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-1">
          {selectedDept === 'ALL' ? (
            <Building className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
          )}
          <span className="truncate">{getShortLabel(selectedDept)}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Overlay Grid */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[280px] origin-top animate-fuzzy-fade">
          {/* Header search bar */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'VI' ? 'Tìm bộ phận...' : 'Search BUs / Depts...'}
              className="w-full text-xs bg-transparent border-0 outline-hidden py-1 px-1 text-slate-800 placeholder-slate-400 focus:ring-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* List items */}
          <div className="max-h-60 overflow-y-auto scrollbar-thin divide-y divide-slate-50">
            {filteredDepts.length > 0 ? (
              filteredDepts.map((dept) => {
                const isSelected = dept === selectedDept;
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => {
                      onDeptChange(dept);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 text-indigo-700'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{getLabel(dept)}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-650 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 italic">
                {lang === 'VI' ? 'Không tìm thấy bộ phận' : 'No departments found'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
