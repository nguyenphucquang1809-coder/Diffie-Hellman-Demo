import React, { useState, useEffect } from 'react';
import { DHParameters, DHCalculationResult, StepInfo } from '../types/crypto';
import { getStepInfo } from '../utils/cryptoMath';
import {
  Lock,
  Eye,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultScreenProps {
  params: DHParameters;
  result: DHCalculationResult;
  onResetToInput: () => void;
  onReplayCalculation: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  params,
  result,
  onResetToInput,
  onReplayCalculation,
}) => {
  const { p, g, a, b } = params;
  const { A, B, sA } = result;

  // Active slide index for the 5-step explanation carousel (1 to 5)
  const [activeSlide, setActiveSlide] = useState<number>(1);

  // Trigger celebration confetti upon arriving on Result Screen
  useEffect(() => {
    try {
      confetti({
        particleCount: 65,
        spread: 65,
        origin: { y: 0.5 },
        colors: ['#06b6d4', '#10b981', '#8b5cf6', '#eab308'],
      });
    } catch {
      // Safe fallback
    }
  }, []);

  const currentStepInfo: StepInfo = getStepInfo(activeSlide, params, result);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* ================= HERO KEY RESULT ================= */}
      <div className="relative rounded-xl sm:rounded-2xl border border-amber-400/60 bg-gradient-to-r from-emerald-950/40 via-amber-950/30 to-indigo-950/40 p-4 sm:p-6 md:p-8 text-center shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-1/4 -z-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-3.5">
          {/* Lock Icon */}
          <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-xl shadow-amber-400/30 shrink-0">
            <Lock className="h-5 w-5 sm:h-7 sm:w-7 stroke-[2.5]" />
          </div>

          {/* Verification Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-mono font-bold border border-emerald-500/40">
            <CheckCircle2 className="h-3 sm:h-3.5 w-3 sm:w-3.5 shrink-0" />
            <span>KIỂM TRA HOÀN TẤT: KHÓA TRÙNG KHỚP 100%</span>
          </div>

          {/* Clean Mobile-Optimized Result: Label on Top, Number s = {sA} Prominently Centered Below */}
          <div className="text-center space-y-1">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-300 tracking-wide uppercase">
              Khóa bí mật chung đối xứng
            </h2>

            <div className="flex items-baseline justify-center gap-2 font-mono">
              <span className="text-amber-400/80 text-lg sm:text-2xl font-bold">s =</span>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-amber-300 tracking-tight drop-shadow-[0_0_24px_rgba(251,191,36,0.45)]">
                {sA}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EAVESDROPPER DISCLOSURE COMPARISON ================= */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-5 md:p-7 backdrop-blur-md shadow-xl text-left">
        <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-800">
          <Eye className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Thông tin Kẻ nghe lén nhìn được trên đường truyền
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Đối chiếu minh bạch những gì kẻ nghe lén bắt được so với dữ liệu an toàn được bảo vệ.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: What Eavesdropper SEES */}
          <div className="rounded-xl border border-amber-500/40 bg-amber-950/15 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-900/40">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  Kẻ nghe lén NHÌN ĐƯỢC (Công khai)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40 font-semibold">
                  Bắt qua mạng
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-sans">Modulo công khai (p):</span>
                  <span className="text-amber-300 font-bold shrink-0 ml-2">{p}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-sans">Cơ số công khai (g):</span>
                  <span className="text-amber-300 font-bold shrink-0 ml-2">{g}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-emerald-900/40">
                  <span className="text-slate-300 font-sans">Khóa công khai Bên A gửi (A):</span>
                  <span className="text-cyan-300 font-bold shrink-0 ml-2">{A}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-indigo-900/40">
                  <span className="text-slate-300 font-sans">Khóa công khai Bên B gửi (B):</span>
                  <span className="text-purple-300 font-bold shrink-0 ml-2">{B}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-sans">
              ℹ️ Toàn bộ 4 tham số trên đều truyền qua đường truyền mạng công cộng, bất kỳ ai bắt gói tin đều đọc được.
            </div>
          </div>

          {/* Card 2: What Eavesdropper CANNOT ACCESS */}
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/15 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-900/40">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Kẻ nghe lén KHÔNG THỂ BIẾT (Tuyệt mật)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-semibold">
                  An toàn 100%
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-emerald-500/40">
                  <div className="min-w-0 pr-2">
                    <span className="text-slate-300 font-sans block">Khóa riêng của Bên A (a):</span>
                  </div>
                  <span className="text-emerald-300 font-bold shrink-0 ml-2 text-sm">{a}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-indigo-500/40">
                  <div className="min-w-0 pr-2">
                    <span className="text-slate-300 font-sans block">Khóa riêng của Bên B (b):</span>
                  </div>
                  <span className="text-indigo-300 font-bold shrink-0 ml-2 text-sm">{b}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/50 border border-amber-400">
                  <div className="min-w-0 pr-2">
                    <span className="text-amber-200 font-sans font-bold block">Khóa bí mật chung cuối cùng (s):</span>
                    <span className="text-[10px] text-amber-300/80 font-sans">Không bao giờ gửi qua mạng</span>
                  </div>
                  <span className="text-amber-300 font-bold text-base shrink-0 ml-2 font-mono">{sA}</span>
                </div>
              </div>
            </div>

            {/* Why Eavesdropper fails */}
            <div className="mt-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong className="text-amber-300">Tại sao Kẻ nghe lén bất lực?</strong> Để bẻ khóa, kẻ nghe lén phải giải bài toán lôgarit rời rạc: <code className="text-amber-300 font-mono">{g}^? ≡ {A} (mod {p})</code>. Đây là hàm một chiều không thể giải ngược trong thời gian thực thi của siêu máy tính!
            </div>
          </div>
        </div>
      </div>

      {/* ================= 5-SLIDE STEP-BY-STEP EXPLANATION ================= */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-5 md:p-7 backdrop-blur-md shadow-xl space-y-4 sm:space-y-5 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 sm:h-5 w-4 sm:w-5 text-cyan-400 shrink-0" />
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight">
              Giải thích chi tiết 5 bước giải thuật
            </h3>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveSlide((prev) => Math.max(1, prev - 1))}
              disabled={activeSlide === 1}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Slide trước</span>
            </button>

            {/* Subtle Step Dots */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-1 sm:px-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSlide(s)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                    activeSlide === s
                      ? 'w-5 sm:w-6 bg-cyan-400'
                      : 'w-1.5 sm:w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Bước ${s}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveSlide((prev) => Math.min(5, prev + 1))}
              disabled={activeSlide === 5}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Slide sau</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
        </div>

        {/* Active Slide Content Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              <span>{currentStepInfo.subtitle}</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              {currentStepInfo.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {currentStepInfo.description}
            </p>
          </div>

          {/* Formulas side by side for Bên A & Bên B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Box A */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2 pb-2 border-b border-emerald-900/30">
                <Calculator className="h-3.5 w-3.5" />
                Tại máy trạm Bên A
              </span>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-[11px] text-slate-400 block font-sans">Công thức:</span>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-emerald-300">
                    {currentStepInfo.mathFormulaA}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-sans">Thế số thực tế:</span>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-200">
                    {currentStepInfo.mathCalculationA}
                  </div>
                </div>
              </div>
            </div>

            {/* Box B */}
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/15 p-4">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 mb-2 pb-2 border-b border-indigo-900/30">
                <Calculator className="h-3.5 w-3.5" />
                Tại máy trạm Bên B
              </span>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-[11px] text-slate-400 block font-sans">Công thức:</span>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-indigo-300">
                    {currentStepInfo.mathFormulaB}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-sans">Thế số thực tế:</span>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-200">
                    {currentStepInfo.mathCalculationB}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security insight */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Ghi chú an ninh: </span>
              <span>{currentStepInfo.securityNote}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PRIMARY ACTION BUTTONS ================= */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        {/* Main prominent Return to Input button requested by user */}
        <button
          onClick={onResetToInput}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-xl shadow-cyan-500/25 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="h-4 sm:h-5 w-4 sm:w-5 shrink-0" />
          <span>Quay lại giao diện nhập ban đầu</span>
        </button>

        {/* Secondary review button */}
        <button
          onClick={onReplayCalculation}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="h-3.5 sm:h-4 w-3.5 sm:w-4 shrink-0" />
          <span>Xem lại hoạt ảnh tính toán</span>
        </button>
      </div>
    </div>
  );
};
