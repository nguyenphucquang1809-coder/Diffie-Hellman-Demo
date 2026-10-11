/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { DHParameters, SimulationStep, AppStage } from './types/crypto';
import { computeDH, findPrimitiveRoots } from './utils/cryptoMath';
import { Header } from './components/Header';
import { ParameterInput } from './components/ParameterInput';
import { SimulationControls } from './components/SimulationControls';
import { NetworkChannelAnimation } from './components/NetworkChannelAnimation';
import { ResultScreen } from './components/ResultScreen';
import { KeyRound, Globe2, ShieldCheck } from 'lucide-react';

const CANDIDATE_PRIMES = [17, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

export default function App() {
  // App flow stage: 'input' -> 'calculating' -> 'result'
  const [currentStage, setCurrentStage] = useState<AppStage>('input');

  // Parameters: p, g, a, b (default Khan Academy Classic)
  const [params, setParams] = useState<DHParameters>({
    p: 23,
    g: 5,
    a: 6,
    b: 15,
  });

  const [currentStep, setCurrentStep] = useState<SimulationStep>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth scroll to top whenever changing stage
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStage]);

  // Compute Diffie-Hellman mathematical result
  const result = computeDH(params);

  const canGoToSimulation = params.p >= 3 && params.g >= 2 && params.a >= 1 && params.b >= 1;

  // Auto-play interval runner in calculating stage:
  // Step 1 -> Step 2 -> Step 3 -> Step 4 -> Automatically moves to Stage 3 (Result)!
  useEffect(() => {
    if (isPlaying && currentStage === 'calculating') {
      const stepDuration = 2500; // Fixed default speed
      timerRef.current = setTimeout(() => {
        setCurrentStep((prev) => {
          if (prev < 4) {
            return (prev + 1) as SimulationStep;
          } else {
            // Once step 4 finishes data transmission, automatically transition to Result!
            setIsPlaying(false);
            setTimeout(() => {
              setCurrentStage('result');
            }, 1200);
            return 4;
          }
        });
      }, stepDuration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, currentStage]);

  // Handler to move from Input stage to Calculation stage
  const handleProceedToCalculation = () => {
    if (!canGoToSimulation) return;
    setCurrentStage('calculating');
    setCurrentStep(1);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to return to Input screen
  const handleResetToInput = () => {
    setIsPlaying(false);
    setCurrentStage('input');
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePlay = () => {
    if (!canGoToSimulation) return;
    if (!isPlaying && currentStep === 4) {
      setCurrentStep(1);
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetSimulation = () => {
    setIsPlaying(true);
    setCurrentStep(1);
  };

  // Generate safe random parameters (only available in Input Stage)
  const handleRandomize = () => {
    setIsPlaying(false);
    const randomPrime = CANDIDATE_PRIMES[Math.floor(Math.random() * CANDIDATE_PRIMES.length)];
    const primitiveRoots = findPrimitiveRoots(randomPrime, 3);
    const randomG = primitiveRoots.length > 0 ? primitiveRoots[Math.floor(Math.random() * primitiveRoots.length)] : 2;

    const randomA = Math.floor(Math.random() * (randomPrime - 4)) + 3;
    let randomB = Math.floor(Math.random() * (randomPrime - 4)) + 3;
    if (randomB === randomA) randomB = randomA + 1;

    setParams({
      p: randomPrime,
      g: randomG,
      a: randomA,
      b: randomB,
    });
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Header */}
      <Header onResetToInput={handleResetToInput} />

      {/* Main Content Layout */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-5 space-y-4 sm:space-y-6">
        {/* ================= STAGE 1: INPUT SCREEN ================= */}
        {currentStage === 'input' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
            {/* Stage 1 Hero Intro: Compact on mobile to prioritize input form */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-800/90 bg-gradient-to-br from-slate-900/95 via-slate-950 to-[#070b14] p-3.5 sm:p-6 lg:p-7 shadow-xl">
              <div className="absolute -top-24 -left-16 -z-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -top-24 -right-16 -z-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

              <div className="flex flex-col gap-2.5 sm:gap-3 text-left">
                {/* Protocol Badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 text-[10px] sm:text-xs font-mono font-medium tracking-wide shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Mật mã học Diffie-Hellman
                  </span>
                </div>

                {/* Primary Headline */}
                <h1 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  Mô phỏng Chuyển hóa & Trao đổi Khóa giữa{' '}
                  <span className="inline-block whitespace-nowrap">
                    <span className="text-emerald-400">Bên A</span> và{' '}
                    <span className="text-indigo-400">Bên B</span>
                  </span>
                </h1>

                {/* Conceptual Subtitle */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Quan sát trực quan cách thức hai bên thống nhất một khóa bí mật chung qua kênh truyền công khai không an toàn mà <strong className="text-amber-300 font-semibold">Kẻ nghe lén</strong> hoàn toàn không thể giải mã được.
                </p>

                {/* Protocol Sequence Overview: Bên A -> Bên B -> Kênh công khai -> Khóa chung (No arrows, clean layout) */}
                <div className="pt-1 grid grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] sm:text-xs font-mono">
                  {/* 1. Bên A */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/20 font-bold text-[10px] text-emerald-300">
                      A
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-emerald-200 truncate">Bên A</div>
                      <div className="text-[10px] text-emerald-400/80 font-sans truncate">Khóa riêng a</div>
                    </div>
                  </div>

                  {/* 2. Bên B */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-500/20 font-bold text-[10px] text-indigo-300">
                      B
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-indigo-200 truncate">Bên B</div>
                      <div className="text-[10px] text-indigo-400/80 font-sans truncate">Khóa riêng b</div>
                    </div>
                  </div>

                  {/* 3. Kênh công khai */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300">
                    <Globe2 className="h-4 w-4 shrink-0 text-amber-400" />
                    <div className="min-w-0">
                      <div className="font-semibold text-amber-200 truncate">Kênh công khai</div>
                      <div className="text-[10px] text-amber-400/80 font-sans truncate">p, g & khóa A, B</div>
                    </div>
                  </div>

                  {/* 4. Khóa chung s */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-950/40 border border-cyan-400/40 text-cyan-200">
                    <KeyRound className="h-4 w-4 shrink-0 text-cyan-400" />
                    <div className="min-w-0">
                      <div className="font-semibold text-cyan-200 truncate">Khóa chung s</div>
                      <div className="text-[10px] text-cyan-300/80 font-sans truncate">Bí mật chung</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parameter Input Component with Randomize Button */}
            <ParameterInput
              params={params}
              onChange={(newParams) => {
                setParams(newParams);
                setCurrentStep(1);
                setIsPlaying(false);
              }}
              onProceedToCalculation={handleProceedToCalculation}
              onRandomize={handleRandomize}
            />
          </div>
        )}

        {/* ================= STAGE 2: CALCULATION & ANIMATION SCREEN ================= */}
        {currentStage === 'calculating' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Step Controls (Rewind, Pause/Resume, Skip Forward, Replay, Back to Input) */}
            <SimulationControls
              currentStep={currentStep}
              onStepChange={(step) => {
                setCurrentStep(step);
                setIsPlaying(false);
              }}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onReset={handleResetSimulation}
              onBackToInput={handleResetToInput}
            />

            {/* Network Channel Packet Flow Animation (Without shared key, optimized for mobile & tablet) */}
            <NetworkChannelAnimation
              params={params}
              result={result}
              step={currentStep}
              isSimulating={isPlaying}
            />
          </div>
        )}

        {/* ================= STAGE 3: RESULTS & EAVESDROPPER SCREEN ================= */}
        {currentStage === 'result' && (
          <div className="animate-in fade-in duration-300">
            {/* Result Screen with Key Parity Verification, Eavesdropper disclosure, 5-Slide explanation, and Reset to Input */}
            <ResultScreen
              params={params}
              result={result}
              onResetToInput={handleResetToInput}
              onReplayCalculation={() => {
                setCurrentStage('calculating');
                setCurrentStep(1);
                setIsPlaying(true);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
