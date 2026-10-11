import React, { useEffect, useState } from 'react';
import { DHParameters, DHCalculationResult, SimulationStep } from '../types/crypto';
import {
  Lock,
  Radio,
  Eye,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Wifi,
} from 'lucide-react';

interface NetworkChannelAnimationProps {
  params: DHParameters;
  result: DHCalculationResult;
  step: SimulationStep;
  isSimulating: boolean;
}

export const NetworkChannelAnimation: React.FC<NetworkChannelAnimationProps> = ({
  params,
  result,
  step,
}) => {
  const [packetProgress, setPacketProgress] = useState(0);

  // Smooth packet looping animation during transmission
  useEffect(() => {
    let animFrame: number;
    let startTime: number | null = null;
    const duration = 2600; // 2.6s per transmission loop

    const loop = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      setPacketProgress(progress);
      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className="relative rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-950 p-2.5 sm:p-5 md:p-6 shadow-2xl overflow-hidden">
      {/* Subtle network grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 pb-2.5 sm:pb-4 mb-2.5 sm:mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Radio className="h-3.5 sm:h-5 w-3.5 sm:w-5 text-cyan-400 animate-pulse shrink-0" />
          <h3 className="text-xs sm:text-base font-bold text-white tracking-tight truncate">
            Luồng truyền thông tin bảo mật giữa hai điểm kết nối
          </h3>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs shrink-0">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-200 font-semibold">Bên A</span>
          </div>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-indigo-400"></span>
            <span className="text-slate-200 font-semibold">Bên B</span>
          </div>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-200 font-semibold">Kẻ nghe lén</span>
          </div>
        </div>
      </div>

      {/* Main Architecture Stage: Mobile: Bên A & Bên B side-by-side, Channel below; Desktop: 3 Columns */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-12 gap-2 sm:gap-4 items-stretch">
        {/* ================= BÊN A NODE ================= */}
        <div
          className={`col-span-1 md:col-span-4 order-1 md:order-1 flex flex-col justify-between rounded-xl border p-2 sm:p-4 md:p-5 transition-all duration-300 ${
            step === 2 || step === 3
              ? 'border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
              : 'border-emerald-900/40 bg-slate-900/60'
          }`}
        >
          <div>
            {/* Node Header */}
            <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-emerald-900/40">
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold font-mono text-sm sm:text-base leading-none select-none shrink-0">
                  A
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-300 leading-tight truncate">Bên A</h4>
                  <p className="text-[10px] text-slate-400 hidden xs:block sm:block truncate">Điểm an toàn 01</p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[11px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 shrink-0">
                <Wifi className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">ONLINE</span>
                <span className="sm:hidden">ON</span>
              </div>
            </div>

            {/* Internal Vault of A */}
            <div className="mt-2.5 sm:mt-4 flex flex-col gap-2 sm:gap-3">
              {/* Private Key a */}
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-2 sm:p-3">
                <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold truncate">
                    <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                    <span className="truncate">Khóa riêng (a)</span>
                  </span>
                  <span className="text-[8px] sm:text-[10px] uppercase font-mono px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold shrink-0">
                    Bí mật
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-base sm:text-2xl font-mono font-bold text-emerald-200 tabular-nums">
                    a = {params.a}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-slate-400 truncate hidden xs:inline sm:inline">Không gửi</span>
                </div>
              </div>

              {/* Computed Public Key A */}
              <div
                className={`rounded-lg border p-2 sm:p-3 transition-all ${
                  step >= 3
                    ? 'border-cyan-500/40 bg-cyan-950/20'
                    : 'border-slate-800 bg-slate-900/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                  <span className="flex items-center gap-1 text-cyan-400 font-semibold truncate">
                    <Cpu className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                    <span className="truncate">Khóa chung (A)</span>
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-mono px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-cyan-900/40 text-cyan-300 shrink-0">
                    gᵃ mod p
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-1">
                  <span className="text-base sm:text-2xl font-mono font-bold text-cyan-200 tabular-nums">
                    {step >= 3 ? `A = ${result.A}` : 'Chờ tính...'}
                  </span>
                  {step >= 3 && (
                    <span className="text-[9px] sm:text-[11px] text-cyan-400 font-mono truncate">
                      {params.g}^{params.a} mod {params.p || '?'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Network Transmission Status Badge for A */}
          <div className="mt-2 pt-2 sm:mt-3 sm:pt-2.5 border-t border-emerald-900/40 text-[10px] sm:text-[11px] flex items-center justify-between text-slate-400">
            <span className="hidden sm:inline">Trạng thái:</span>
            <span className="text-emerald-400 font-mono font-medium truncate">
              {step >= 4 ? 'Đã trao đổi' : step === 3 ? 'Đang tính A' : 'Chuẩn bị'}
            </span>
          </div>
        </div>

        {/* ================= BÊN B NODE ================= */}
        {/* On mobile: placed next to Bên A at the top */}
        <div
          className={`col-span-1 md:col-span-4 order-2 md:order-3 flex flex-col justify-between rounded-xl border p-2 sm:p-4 md:p-5 transition-all duration-300 ${
            step === 2 || step === 3
              ? 'border-indigo-500/60 bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
              : 'border-indigo-900/40 bg-slate-900/60'
          }`}
        >
          <div>
            {/* Node Header */}
            <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-indigo-900/40">
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold font-mono text-sm sm:text-base leading-none select-none shrink-0">
                  B
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-indigo-300 leading-tight truncate">Bên B</h4>
                  <p className="text-[10px] text-slate-400 hidden xs:block sm:block truncate">Điểm an toàn 02</p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[11px] font-mono bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 shrink-0">
                <Wifi className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">ONLINE</span>
                <span className="sm:hidden">ON</span>
              </div>
            </div>

            {/* Internal Vault of B */}
            <div className="mt-2.5 sm:mt-4 flex flex-col gap-2 sm:gap-3">
              {/* Private Key b */}
              <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/30 p-2 sm:p-3">
                <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                  <span className="flex items-center gap-1 text-indigo-400 font-semibold truncate">
                    <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                    <span className="truncate">Khóa riêng (b)</span>
                  </span>
                  <span className="text-[8px] sm:text-[10px] uppercase font-mono px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-bold shrink-0">
                    Bí mật
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-base sm:text-2xl font-mono font-bold text-indigo-200 tabular-nums">
                    b = {params.b}
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-slate-400 truncate hidden xs:inline sm:inline">Không gửi</span>
                </div>
              </div>

              {/* Computed Public Key B */}
              <div
                className={`rounded-lg border p-2 sm:p-3 transition-all ${
                  step >= 3
                    ? 'border-purple-500/40 bg-purple-950/20'
                    : 'border-slate-800 bg-slate-900/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                  <span className="flex items-center gap-1 text-purple-400 font-semibold truncate">
                    <Cpu className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                    <span className="truncate">Khóa chung (B)</span>
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-mono px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-purple-900/40 text-purple-300 shrink-0">
                    gᵇ mod p
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-1">
                  <span className="text-base sm:text-2xl font-mono font-bold text-purple-200 tabular-nums">
                    {step >= 3 ? `B = ${result.B}` : 'Chờ tính...'}
                  </span>
                  {step >= 3 && (
                    <span className="text-[9px] sm:text-[11px] text-purple-400 font-mono truncate">
                      {params.g}^{params.b} mod {params.p || '?'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Network Transmission Status Badge for B */}
          <div className="mt-2 pt-2 sm:mt-3 sm:pt-2.5 border-t border-indigo-900/40 text-[10px] sm:text-[11px] flex items-center justify-between text-slate-400">
            <span className="hidden sm:inline">Trạng thái:</span>
            <span className="text-indigo-400 font-mono font-medium truncate">
              {step >= 4 ? 'Đã trao đổi' : step === 3 ? 'Đang tính B' : 'Chuẩn bị'}
            </span>
          </div>
        </div>

        {/* ================= MIDDLE INSECURE NETWORK CHANNEL ================= */}
        {/* On mobile: spans 2 columns directly underneath Bên A & Bên B. On desktop: sits in column 5-8 */}
        <div className="col-span-2 md:col-span-4 order-3 md:order-2 flex flex-col justify-between rounded-xl border border-amber-900/40 bg-slate-900/80 p-2.5 sm:p-4 relative overflow-hidden">
          <div>
            {/* Channel Header - Fully displays KHÔNG BẢO MẬT on all mobile screens */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 min-w-0">
                <Radio className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-amber-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wide truncate">
                  Kênh truyền công khai
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono hidden sm:inline">
                  (Internet)
                </span>
              </div>
              <span className="shrink-0 text-[10px] font-mono font-bold text-rose-300 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-700/60 shadow-sm whitespace-nowrap">
                ⚠ KHÔNG BẢO MẬT
              </span>
            </div>

            {/* Physical Cable Visualization with Flying Data Packets */}
            <div className="my-2 sm:my-3.5 relative flex flex-col gap-2 sm:gap-3 py-2 px-2 bg-slate-950/90 rounded-xl border border-slate-800">
              {/* Packet Wire 1: A -> B (Transferring A) */}
              <div className="relative">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 mb-0.5 sm:mb-1">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    Bên A ➔ Bên B
                  </span>
                  <span className="font-mono text-[10px] text-cyan-400 font-semibold truncate">
                    {step >= 4 ? `Khóa A = ${result.A}` : 'Chờ gửi'}
                  </span>
                </div>
                <div className="relative h-7 sm:h-8 w-full rounded-md bg-slate-900 border border-slate-800 overflow-hidden flex items-center">
                  {/* Dotted Wire Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-emerald-500/30 via-cyan-500/40 to-indigo-500/30" />

                  {/* Animated Flying Packet A -> B */}
                  {step >= 4 && (
                    <div
                      className="absolute z-10 flex items-center gap-1 rounded bg-cyan-500 text-slate-950 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold shadow-md shadow-cyan-500/50 pointer-events-none"
                      style={{
                        left: `calc(${packetProgress * 100}% - 32px)`,
                        maxWidth: '75px',
                      }}
                    >
                      <span>A={result.A}</span>
                      <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                    </div>
                  )}

                  {step < 4 && (
                    <div className="w-full text-center text-[9px] sm:text-[10px] text-slate-400 font-mono">
                      Cáp mạng sẵn sàng
                    </div>
                  )}
                </div>
              </div>

              {/* Packet Wire 2: B -> A (Transferring B) */}
              <div className="relative">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 mb-0.5 sm:mb-1">
                  <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                    Bên B ➔ Bên A
                  </span>
                  <span className="font-mono text-[10px] text-indigo-300 font-semibold truncate">
                    {step >= 4 ? `Khóa B = ${result.B}` : 'Chờ gửi'}
                  </span>
                </div>
                <div className="relative h-7 sm:h-8 w-full rounded-md bg-slate-900 border border-slate-800 overflow-hidden flex items-center">
                  {/* Dotted Wire Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-l from-indigo-500/30 via-purple-500/40 to-emerald-500/30" />

                  {/* Animated Flying Packet B -> A */}
                  {step >= 4 && (
                    <div
                      className="absolute z-10 flex items-center gap-1 rounded bg-indigo-500 text-white px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-mono font-bold shadow-md shadow-indigo-500/50 pointer-events-none"
                      style={{
                        right: `calc(${packetProgress * 100}% - 32px)`,
                        maxWidth: '75px',
                      }}
                    >
                      <ArrowLeft className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                      <span>B={result.B}</span>
                    </div>
                  )}

                  {step < 4 && (
                    <div className="w-full text-center text-[9px] sm:text-[10px] text-slate-400 font-mono">
                      Cáp mạng sẵn sàng
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ================= KẺ NGHE LÉN (EAVESDROPPER) STATION ================= */}
            <div className="rounded-lg sm:rounded-xl border border-amber-500/30 bg-amber-950/20 p-2 sm:p-3">
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 text-[11px] sm:text-xs font-bold">
                  <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span>Kẻ nghe lén (Trên mạng)</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded font-semibold">
                  Bắt gói tin
                </span>
              </div>

              <div className="space-y-1 text-[10px] sm:text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">Tham số lộ:</span>
                  <span className="text-amber-200 font-semibold">
                    p={params.p || '?'}, g={params.g || '?'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">Gói tin bắt được:</span>
                  <span className="text-amber-200 font-semibold truncate">
                    {step >= 4 ? `A=${result.A}, B=${result.B}` : 'Chờ gói tin'}
                  </span>
                </div>
                <div className="pt-1 border-t border-amber-800/40 flex items-center justify-between text-[10px] font-sans text-rose-300 font-medium">
                  <span>Trạng thái giải mã:</span>
                  <span className="font-semibold text-rose-400">Bất lực (Thiếu số mũ a, b)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1.5 sm:mt-2 text-center text-[9px] sm:text-[10px] text-slate-400 italic">
            * Khóa bí mật chung sẽ được tính toán và kiểm tra độc lập tại mỗi bên
          </div>
        </div>
      </div>
    </div>
  );
};
