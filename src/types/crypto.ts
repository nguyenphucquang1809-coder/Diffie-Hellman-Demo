export interface DHParameters {
  p: number; // Modulo (Prime)
  g: number; // Base / Generator
  a: number; // Secret exponent of A
  b: number; // Secret exponent of B
}

export interface DHCalculationResult {
  p: number;
  g: number;
  a: number;
  b: number;
  A: number; // Public key of A: g^a mod p
  B: number; // Public key of B: g^b mod p
  sA: number; // Shared secret computed by A: B^a mod p
  sB: number; // Shared secret computed by B: A^b mod p
  isSuccess: boolean;
  intermediateSteps: {
    aPublicPower: bigint;
    bPublicPower: bigint;
    aSharedPower: bigint;
    bSharedPower: bigint;
  };
}

export type SimulationStep = 1 | 2 | 3 | 4 | 5;

export type AppStage = 'input' | 'calculating' | 'result';

export interface StepInfo {
  step: SimulationStep;
  title: string;
  subtitle: string;
  description: string;
  mathFormulaA: string;
  mathFormulaB: string;
  mathCalculationA: string;
  mathCalculationB: string;
  securityNote: string;
  activeEntity: 'both' | 'A' | 'B' | 'channel' | 'shared';
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  p: number;
  g: number;
  a: number;
  b: number;
}
