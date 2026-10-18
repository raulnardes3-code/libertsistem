export type MaritalStatus = 'solteiro' | 'casado' | 'uniao_estavel' | 'divorciado' | 'viuvo';

export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  solteiro: 'Solteiro(a)',
  casado: 'Casado(a)',
  uniao_estavel: 'União estável',
  divorciado: 'Divorciado(a)',
  viuvo: 'Viúvo(a)',
};

export interface SpouseData {
  fullName: string;
  cpf: string;
}

export interface ClientData {
  fullName: string;
  cpf: string;
  birthDate: string;
  monthlyIncome: number;
  state: string;
  maritalStatus: MaritalStatus | '';
  spouse?: SpouseData;
}

export type EntryPercentage = number;

export interface CreditCardInput {
  nominalValue: number;
  desiredInstallment: number;
  entryPercentage: EntryPercentage;
}

export interface CreditCardResult {
  nominalValue: number;
  adminFeeRate: number;
  totalWithFee: number;
  entryPercentage: number;
  entryValue: number;
  debtBalance: number;
  desiredInstallment: number;
  calculatedInstallment: number;
  termMonths: number;
  totalInstallments: number;
  totalDisbursed: number;
  isViable: boolean;
  minPossibleInstallment: number;
  maxPossibleInstallment: number;
}

export interface FinancingResult {
  nominalValue: number;
  entryRate: number;
  entryValue: number;
  financedValue: number;
  annualRate: number;
  monthlyRate: number;
  termMonths: number;
  installment: number;
  totalInstallments: number;
  totalDisbursed: number;
}

export interface ComparisonMetrics {
  entryDifference: number;
  installmentDifference: number;
  totalDisbursedDifference: number;
  termDifference: number;
  creditCardTotal: number;
  financingTotal: number;
}

export type SimulationStep = 1 | 2 | 3 | 4 | 5;

export interface SimulationState {
  currentStep: SimulationStep;
  client: ClientData;
  creditInput: CreditCardInput;
  creditResult: CreditCardResult | null;
  financingResult: FinancingResult | null;
  alternativeTerm: number | null;
  simulationDate: Date | null;
}
