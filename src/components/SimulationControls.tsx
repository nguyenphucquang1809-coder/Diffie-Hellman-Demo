import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ArrowLeft } from 'lucide-react';
import { SimulationStep } from '../types/crypto';

interface SimulationControlsProps {
  currentStep: SimulationStep;
  onStepChange: (step: SimulationStep) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onBackToInput: () => void;
}

const STEPS_DATA = [
  { step: 1, label: '1. Thống nhất p, g', short: '1. p, g' },
  { step: 2, label: '2. Khóa riêng a, b', short: '2. a, b' },
  { step: 3, label: '3. Tính khóa A, B', short: '3. Tính A,B' },
  { step: 4, label: '4. Trao đổi qua mạng', short: '4. Truyền tin' },
];

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
  onReset,
  onBackToInput,
}) => {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/90 p-2.5 sm:p-4 md:p-5 backdrop-blur-md shadow-lg space-y-2.5 sm:space-y-4">
      {/* Top Row: Current Step Indicator Pills */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
          <span className="font-semibold text-slate-200">
            Tiến trình chuyển giao: <span className="text-cyan-400 font-mono font-bold">Bước {currentStep}/4</span>
          </span>
          <span className="text-slate-400 font-mono text-[10px] sm:text-[11px]">
            {isPlaying ? '⚡ Đang thực thi' : '⏸ Đang tạm dừng'}
          </span>
        </div>

        {/* 4 Steps progress bar - Fitted inside container without overflow */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {STEPS_DATA.map((item) => {
            const isCompleted = item.step < currentStep;
            const isCurrent = item.step === currentStep;

            return (
              <button
                key={item.step}
                onClick={() => onStepChange(item.step as SimulationStep)}
                className={`flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg sm:rounded-xl text-xs font-medium transition-all cursor-pointer text-center min-w-0 overflow-hidden ${
                  isCurrent
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-500/10'
                    : isCompleted
                    ? 'bg-slate-800/80 border border-emerald-500/40 text-emerald-300 hover:bg-slate-800'
                    : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold font-mono mb-0.5 sm:mb-1 shrink-0 ${
                    isCurrent
                      ? 'bg-cyan-400 text-slate-950'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.step}
                </div>
                <span className="hidden sm:inline text-[11px] truncate w-full text-center">
                  {item.label}
                </span>
                <span className="sm:hidden text-[9px] truncate w-full text-center leading-tight">
                  {item.short}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Skip, Pause/Resume, Rewind, Replay Controls & Back Button */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pt-2 sm:pt-3 border-t border-slate-800/80">
        <button
          onClick={onBackToInput}
          className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-300 hover:text-white py-1.5 px-2.5 sm:px-3 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-850 transition-all cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>Sửa tham số</span>
        </button>

        {/* Playback Controls: Tua lại, Pause/Play, Tua tới, Replay */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Tua lại (Skip Back) */}
          <button
            onClick={() => onStepChange(Math.max(1, currentStep - 1) as SimulationStep)}
            disabled={currentStep === 1}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Tua lại bước trước"
          >
            <SkipBack className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          {/* Pause / Resume Button */}
          <button
            onClick={onTogglePlay}
            className="flex h-8 px-2.5 sm:h-9 sm:px-3.5 items-center justify-center gap-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer text-[11px] sm:text-xs"
            title={isPlaying ? 'Tạm dừng mô phỏng' : 'Tiếp tục mô phỏng'}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-slate-950" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-slate-950" />
                <span>Tiếp tục</span>
              </>
            )}
          </button>

          {/* Tua tới (Skip Forward) */}
          <button
            onClick={() => onStepChange(Math.min(4, currentStep + 1) as SimulationStep)}
            disabled={currentStep === 4}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Tua tới bước sau"
          >
            <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          {/* Replay (Chạy lại từ đầu) */}
          <button
            onClick={onReset}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            title="Chạy lại từ bước 1"
          >
            <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
