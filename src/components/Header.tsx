import React, { useEffect, useState } from 'react';
import { Shield, Clock, Database, User, Lightbulb, Lock, X, Key } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
  lang?: 'VI' | 'EN';
  onLangChange?: (lang: 'VI' | 'EN') => void;
  onStartOnboarding?: () => void;
  isLdMode?: boolean;
  onLdModeChange?: (isLdMode: boolean) => void;
  site?: 'MLN' | 'WNK' | 'ASH';
  onSiteChange?: (site: 'MLN' | 'WNK' | 'ASH') => void;
}

export default function Header({ 
  userEmail = "Justin Nguyen",
  lang = 'VI',
  onLangChange,
  onStartOnboarding,
  isLdMode = false,
  onLdModeChange,
  site = 'MLN',
  onSiteChange
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState("2026-06-02 03:15:15 UTC");
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === '123456') {
      onLdModeChange?.(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setErrorMsg('');
    } else {
      setErrorMsg(lang === 'VI' ? 'Mật mã chưa chính xác. Vui lòng kiểm tra lại!' : 'Incorrect password. Please verify and try again!');
    }
  };

  useEffect(() => {
    // Keep a running clock starting from current simulated time from metadata
    const startTime = new Date("2026-06-02T03:15:15Z");
    const interval = setInterval(() => {
      startTime.setSeconds(startTime.getSeconds() + 1);
      const year = startTime.getUTCFullYear();
      const month = String(startTime.getUTCMonth() + 1).padStart(2, '0');
      const day = String(startTime.getUTCDate()).padStart(2, '0');
      const hours = String(startTime.getUTCHours()).padStart(2, '0');
      const minutes = String(startTime.getUTCMinutes()).padStart(2, '0');
      const seconds = String(startTime.getUTCSeconds()).padStart(2, '0');
      setTimeStr(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`relative overflow-hidden bg-slate-900 text-slate-100 border-b-2 transition-all duration-500 px-6 py-6 md:px-12 md:py-8 shadow-sm ${
      site === 'MLN' ? 'border-b-emerald-500/45 shadow-[0_4px_20px_rgba(16,185,129,0.04)]'
      : site === 'WNK' ? 'border-b-indigo-500/45 shadow-[0_4px_20px_rgba(99,102,241,0.04)]'
      : 'border-b-amber-500/45 shadow-[0_4px_20px_rgba(245,158,11,0.04)]'
    }`}>
      {/* Decorative subtle ambient glowing orbs */}
      {site === 'MLN' ? (
        <>
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : site === 'WNK' ? (
        <>
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="text-left space-y-2.5 max-w-4xl">
          <div className="flex flex-wrap items-center justify-start gap-2.5">
            {site === 'MLN' ? (
              <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] md:text-xs font-bold px-3 py-1 rounded-lg tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all duration-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Site Millennium (MLN)</span>
              </span>
            ) : site === 'WNK' ? (
              <span className="bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[10px] md:text-xs font-bold px-3 py-1 rounded-lg tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all duration-300">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Site Wanek (WNK)</span>
              </span>
            ) : (
              <span className="bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] md:text-xs font-bold px-3 py-1 rounded-lg tracking-wider uppercase flex items-center gap-1.5 shadow-sm transition-all duration-300">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Site Ashton (ASH)</span>
              </span>
            )}
            <span className="bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] md:text-xs font-bold px-3 py-1 rounded-lg tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
              <Database className="w-3.5 h-3.5" /> Live Master Data
            </span>
          </div>
          <h1 style={{ fontFamily: 'system-ui' }} className="font-sans font-black text-2xl md:text-3xl lg:text-4xl xl:text-4.5xl tracking-tight leading-tight text-white uppercase">
            {lang === 'VI' ? 'ĐÁNH GIÁ NHÂN TÀI & QUY HOẠCH KẾ THỪA' : 'TALENT REVIEW & SUCCESSION PLANNING'}
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-sans max-w-2xl font-normal leading-relaxed font-semibold">
            {lang === 'VI' 
              ? `Hệ thống Quản lý và Hoạch định Nhân sự Kế thừa — ${site === 'MLN' ? 'Nhà máy Millennium (MLN)' : site === 'WNK' ? 'Nhà máy Wanek (WNK)' : 'Ashton Site (ASH)'}`
              : `Interactive Succession & Talent Planning System — ${site === 'MLN' ? 'Millennium Site (MLN)' : site === 'WNK' ? 'Wanek Site (WNK)' : 'Ashton Site (ASH)'}`}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto shrink-0">
          {/* TOP ROW: User Section (Dual-role Switcher for HOD/HRBP and L&D Admin) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-800/40 border border-slate-700/60 rounded-2xl p-1.5 shadow-md">
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400 select-none">
              <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300">
                {lang === 'VI' ? 'VAI TRÒ:' : 'ROLE:'}
              </span>
            </div>
            
            <div className="flex bg-slate-900/80 p-0.5 rounded-xl border border-slate-800 shadow-inner shrink-0 leading-none">
              <button
                onClick={() => onLdModeChange?.(false)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-tight transition-all uppercase flex items-center gap-1.5 cursor-pointer select-none ${
                  !isLdMode
                    ? 'bg-indigo-650 text-white shadow-xs border border-indigo-500/20 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={lang === 'VI' ? 'Giao diện thuần hiển thị phân tích cho HRBP & Trưởng bộ phận' : 'Pure analytical view tailored for HRBPs and Department Heads'}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>HRBP & HOD</span>
              </button>
              
              <button
                onClick={() => {
                  if (!isLdMode) {
                    setShowPasswordModal(true);
                    setPasswordInput('');
                    setErrorMsg('');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-tight transition-all uppercase flex items-center gap-1.5 cursor-pointer select-none ${
                  isLdMode
                    ? 'bg-purple-650 text-white shadow-xs border border-purple-500/20 font-black'
                    : 'text-slate-400 hover:text-slate-250'
                }`}
                title={lang === 'VI' ? 'Giao diện quản trị, cho phép L&D điều chỉnh dữ liệu & cấu hình' : 'Administrator workspace for L&D to customize data & configs'}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0 animate-pulse" />
                <span>🛠 L&D ADMIN</span>
              </button>
            </div>
          </div>

          {/* BOTTOM ROW: Language Switch, Site Select and Interactive Tour Button */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            {/* Site Switch Toggle Pill */}
            {onSiteChange && (
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 shadow-inner shrink-0 leading-none items-center gap-1">
                <div className="pl-2 pr-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline-block">
                  {lang === 'VI' ? 'Nhà máy:' : 'Factory:'}
                </div>
                <button
                  onClick={() => onSiteChange('MLN')}
                  className={`px-3 py-2 rounded-xl text-[11px] font-extrabold tracking-tight transition-all duration-300 uppercase flex items-center gap-1.5 cursor-pointer select-none border ${
                    site === 'MLN'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
                      : 'text-slate-400 border-transparent hover:text-emerald-400 hover:bg-slate-900'
                  }`}
                  title="Millennium Site"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${site === 'MLN' ? 'bg-slate-950 animate-ping' : 'bg-slate-500'}`} />
                  <span>🏭 MLN</span>
                </button>
                <button
                  onClick={() => onSiteChange('WNK')}
                  className={`px-3 py-2 rounded-xl text-[11px] font-extrabold tracking-tight transition-all duration-300 uppercase flex items-center gap-1.5 cursor-pointer select-none border ${
                    site === 'WNK'
                      ? 'bg-indigo-500 text-white border-indigo-300 font-black shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-105'
                      : 'text-slate-400 border-transparent hover:text-indigo-400 hover:bg-slate-900'
                  }`}
                  title="Wanek Site"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${site === 'WNK' ? 'bg-white animate-ping' : 'bg-slate-500'}`} />
                  <span>🏭 WNK</span>
                </button>
                <button
                  onClick={() => onSiteChange('ASH')}
                  className={`px-3 py-2 rounded-xl text-[11px] font-extrabold tracking-tight transition-all duration-300 uppercase flex items-center gap-1.5 cursor-pointer select-none border ${
                    site === 'ASH'
                      ? 'bg-amber-500 text-white border-amber-300 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105'
                      : 'text-slate-400 border-transparent hover:text-amber-400 hover:bg-slate-900'
                  }`}
                  title="Ashton Site"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${site === 'ASH' ? 'bg-white animate-ping' : 'bg-slate-500'}`} />
                  <span>🏢 ASH</span>
                </button>
              </div>
            )}

            {/* Language Switch Toggle Pill */}
            {onLangChange && (
              <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700/60 shadow-inner shrink-0 leading-none">
                <button
                  id="toggle-lang-vi"
                  onClick={() => onLangChange('VI')}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-extrabold tracking-tight transition-all uppercase flex items-center gap-1 cursor-pointer select-none ${
                    lang === 'VI'
                      ? 'bg-indigo-650 text-white shadow-xs border border-indigo-500/20 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🇻🇳 VI
                </button>
                <button
                  id="toggle-lang-en"
                  onClick={() => onLangChange('EN')}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-extrabold tracking-tight transition-all uppercase flex items-center gap-1 cursor-pointer select-none ${
                    lang === 'EN'
                      ? 'bg-indigo-650 text-white shadow-xs border border-indigo-500/20 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🇬🇧 EN
                </button>
              </div>
            )}

            {/* Onboarding Lightbulb Trigger Button */}
            {onStartOnboarding && (
              <button
                onClick={onStartOnboarding}
                className="flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 border border-amber-300/40 rounded-xl leading-none transition-all duration-300 cursor-pointer font-extrabold text-[12px] uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.7)] hover:scale-[1.04] active:scale-[0.96] shrink-0 select-none group relative overflow-hidden"
                title={lang === 'VI' ? 'Xem hướng dẫn sử dụng nhanh' : 'View quick onboarding guide'}
              >
                <Lightbulb className="w-4 h-4 text-slate-950 shrink-0 filter drop-shadow-xs" />
                <span>
                  {lang === 'VI' ? 'Hướng dẫn' : 'Guide'}
                </span>
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-500/30 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-100">
            {/* Ambient decorative light glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setErrorMsg(''); }}
              className="absolute top-4 right-4 p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black tracking-tight text-white uppercase font-sans">
                  {lang === 'VI' ? 'XÁC THỰC QUẢN TRỊ L&D' : 'L&D ADMIN VERIFICATION'}
                </h3>
                <p className="text-xs text-slate-450 leading-relaxed max-w-sm">
                  {lang === 'VI' 
                    ? 'Vui lòng nhập mật mã quản trị để kích hoạt quyền năng tùy biến dữ liệu, quy hoạch kế thừa và thiết kế IDP.'
                    : 'Enter the admin password to enable data adjustments, succession planning, and individual IDP design.'}
                </p>
              </div>

              <form onSubmit={handleVerifyPassword} className="w-full space-y-4 pt-2">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1">
                    <Key className="w-3 h-3 text-purple-400" />
                    <span>{lang === 'VI' ? 'Mật mã bảo mật' : 'Security Password'}</span>
                  </label>
                  <input
                    type="password"
                    autoFocus
                    placeholder={lang === 'VI' ? 'Nhập mật mã...' : 'Enter password...'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all shadow-inner font-mono tracking-widest text-center"
                  />
                  {errorMsg && (
                    <p className="text-[11px] text-rose-400 font-semibold mt-1 bg-rose-500/10 border border-rose-500/20 rounded-lg py-1.5 px-3 text-center">
                      ⚠️ {errorMsg}
                    </p>
                  )}
                </div>

                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/20 text-[10.5px] text-slate-500 leading-relaxed text-center">
                  {lang === 'VI' ? (
                    <span>Hệ thống bảo mật AES-256. Ban quản trị sử dụng mã số định danh dự án được cấp riêng để đăng nhập.</span>
                  ) : (
                    <span>Secured with AES-256. Authorized administrators must use their issued project security keys.</span>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setErrorMsg(''); }}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wide border border-slate-700/60"
                  >
                    {lang === 'VI' ? 'Hủy bỏ' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/10 cursor-pointer text-xs uppercase tracking-wide border border-purple-500/30"
                  >
                    {lang === 'VI' ? 'Xác nhận' : 'Verify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
