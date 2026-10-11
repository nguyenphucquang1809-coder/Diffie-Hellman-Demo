import React from 'react';
import { Lock } from 'lucide-react';

interface HeaderProps {
  onResetToInput?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetToInput }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-6 sm:py-3 lg:px-8">
        {/* Brand wordmark */}
        <button
          onClick={onResetToInput}
          className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer text-left focus:outline-none"
          title="Về màn hình nhập số ban đầu"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm group-hover:border-cyan-400 group-hover:bg-cyan-500/20 transition-all shrink-0">
            <Lock className="h-4 w-4 sm:h-4.5 sm:w-4.5 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Diffie-Hellman
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold">
                1976
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors leading-tight truncate">
              Mô phỏng trao đổi khóa
            </p>
          </div>
        </button>

        {/* Minimalist Security Badge on Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] sm:text-xs font-mono shrink-0">
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 hidden md:inline">Mật mã học:</span>
          <span className="text-emerald-400 font-medium">Bảo mật</span>
        </div>
      </div>
    </header>
  );
};
