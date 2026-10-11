import React, { useId } from 'react';
import { DHParameters } from '../types/crypto';
import { isPrime, isPrimitiveRoot, findPrimitiveRoots } from '../utils/cryptoMath';
import { Settings2, AlertTriangle, CheckCircle2, ArrowRight, User, Globe2, RefreshCw } from 'lucide-react';

interface ParameterInputProps {
  params: DHParameters;
  onChange: (params: DHParameters) => void;
  onProceedToCalculation: () => void;
  onRandomize: () => void;
}

export const ParameterInput: React.FC<ParameterInputProps> = ({
  params,
  onChange,
  onProceedToCalculation,
  onRandomize,
}) => {
  const pId = useId();
  const gId = useId();
  const aId = useId();
  const bId = useId();

  const isPPrime = params.p >= 2 && isPrime(params.p);
  const isGPrimitive = params.p >= 2 && params.g >= 2 && isPrimitiveRoot(params.g, params.p);
  const suggestedRoots = isPPrime ? findPrimitiveRoots(params.p, 4) : [];

  const handleInputChange = (field: keyof DHParameters, value: string) => {
    if (value.trim() === '') {
      onChange({
        ...params,
        [field]: 0,
      });
      return;
    }
    const num = parseInt(value, 10);
    const safeNum = isNaN(num) ? 0 : Math.max(0, num);
    onChange({
      ...params,
      [field]: safeNum,
    });
  };

  const isFormValid = params.p >= 3 && params.g >= 2 && params.a >= 1 && params.b >= 1;

  return (
    <div className="rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-4 sm:space-y-6 text-left">
      {/* Header and Randomize Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 sm:pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 sm:h-5 w-4 sm:w-5 text-cyan-400 shrink-0" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight">
              Bước 1: Thiết lập tham số trao đổi khóa
            </h2>
          </div>
        </div>

        {/* Randomize button - exclusively in Input Screen */}
        <button
          onClick={onRandomize}
          className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 rounded-lg sm:rounded-xl hover:bg-cyan-900/60 hover:border-cyan-400 transition-all cursor-pointer whitespace-nowrap shadow-sm active:scale-95 self-start sm:self-auto shrink-0"
          title="Sinh ngẫu nhiên bộ tham số p, g, a, b an toàn"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Tạo số ngẫu nhiên</span>
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Modulo p (Public) */}
        <div className="flex flex-col gap-2 rounded-xl border border-amber-500/30 bg-amber-950/15 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <label htmlFor={pId} className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <Globe2 className="h-4 w-4" />
              <span>Modulo công khai (p)</span>
            </label>
            <span className="text-[10px] sm:text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
              Số nguyên tố
            </span>
          </div>
          <div className="relative">
            <input
              id={pId}
              type="number"
              min="3"
              max="9999"
              value={params.p === 0 ? '' : params.p}
              onChange={(e) => handleInputChange('p', e.target.value)}
              className="w-full rounded-lg border border-amber-500/40 bg-slate-950 px-3 py-2 sm:px-3.5 sm:py-2.5 text-lg sm:text-xl font-mono font-bold text-amber-200 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all tabular-nums"
              placeholder="e.g. 23"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {!params.p || params.p === 0 ? (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <AlertTriangle className="h-3.5 w-3.5" /> Hãy nhập modulo p (≥ 3)
              </span>
            ) : isPPrime ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> p là số nguyên tố
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400 font-medium">
                <AlertTriangle className="h-3.5 w-3.5" /> p nên là số nguyên tố
              </span>
            )}
          </div>
        </div>

        {/* Base g (Public Generator) */}
        <div className="flex flex-col gap-2 rounded-xl border border-amber-500/30 bg-amber-950/15 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <label htmlFor={gId} className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <Globe2 className="h-4 w-4" />
              <span>Cơ số công khai (g)</span>
            </label>
            <span className="text-[10px] sm:text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
              Căn nguyên thủy
            </span>
          </div>
          <div className="relative">
            <input
              id={gId}
              type="number"
              min="2"
              max={params.p > 2 ? params.p - 1 : 9999}
              value={params.g === 0 ? '' : params.g}
              onChange={(e) => handleInputChange('g', e.target.value)}
              className="w-full rounded-lg border border-amber-500/40 bg-slate-950 px-3 py-2 sm:px-3.5 sm:py-2.5 text-lg sm:text-xl font-mono font-bold text-amber-200 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all tabular-nums"
              placeholder="e.g. 5"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 flex-wrap">
            {isGPrimitive ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> g là căn nguyên thủy
              </span>
            ) : suggestedRoots.length > 0 ? (
              <div className="flex items-center gap-1 text-amber-400">
                <span>Gợi ý g:</span>
                {suggestedRoots.slice(0, 3).map((root) => (
                  <button
                    key={root}
                    onClick={() => handleInputChange('g', root.toString())}
                    className="font-mono underline text-amber-300 hover:text-white cursor-pointer px-1 py-0.5 rounded bg-amber-950/40"
                  >
                    {root}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-slate-400">Chọn 2 ≤ g &lt; p</span>
            )}
          </div>
        </div>

        {/* Secret Exponent of A (Private) */}
        <div className="flex flex-col gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <label htmlFor={aId} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <User className="h-4 w-4 text-emerald-400" />
              <span>Số mũ Bên A (a)</span>
            </label>
            <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Bí mật A
            </span>
          </div>
          <div className="relative">
            <input
              id={aId}
              type="number"
              min="2"
              max={params.p > 0 ? params.p * 2 : 9999}
              value={params.a === 0 ? '' : params.a}
              onChange={(e) => handleInputChange('a', e.target.value)}
              className="w-full rounded-lg border border-emerald-500/40 bg-slate-950 px-3 py-2 sm:px-3.5 sm:py-2.5 text-lg sm:text-xl font-mono font-bold text-emerald-200 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all tabular-nums"
              placeholder="e.g. 6"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-400/80">
            <span>Không gửi qua mạng</span>
            <span className="font-mono text-slate-400">Khóa riêng của A</span>
          </div>
        </div>

        {/* Secret Exponent of B (Private) */}
        <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/20 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <label htmlFor={bId} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
              <User className="h-4 w-4 text-indigo-400" />
              <span>Số mũ Bên B (b)</span>
            </label>
            <span className="text-[10px] sm:text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
              Bí mật B
            </span>
          </div>
          <div className="relative">
            <input
              id={bId}
              type="number"
              min="2"
              max={params.p > 0 ? params.p * 2 : 9999}
              value={params.b === 0 ? '' : params.b}
              onChange={(e) => handleInputChange('b', e.target.value)}
              className="w-full rounded-lg border border-indigo-500/40 bg-slate-950 px-3 py-2 sm:px-3.5 sm:py-2.5 text-lg sm:text-xl font-mono font-bold text-indigo-200 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all tabular-nums"
              placeholder="e.g. 15"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-indigo-400/80">
            <span>Không gửi qua mạng</span>
            <span className="font-mono text-slate-400">Khóa riêng của B</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button to Proceed to Step 2 */}
      <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 text-left w-full sm:w-auto">
          Sau khi nhập xong, bấm bắt đầu để quan sát mô phỏng và công thức chuyển đổi.
        </div>

        <button
          onClick={onProceedToCalculation}
          disabled={!isFormValid}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/25 active:scale-98 transition-all cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <span>Bắt đầu chuyển hóa & Tính toán</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
