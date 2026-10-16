/**
 * Motor de cálculos financeiros do sistema Libert Simula.
 * Funções puras, independentes dos componentes visuais.
 * Todos os cálculos usam precisão decimal com arredondamento para 2 casas ao final.
 */

import {
  ADMIN_FEE_RATE,
  MIN_TERM_MONTHS,
  MAX_TERM_MONTHS,
  FINANCING_ENTRY_RATE,
  FINANCING_ANNUAL_RATE,
  FINANCING_TERM_MONTHS,
} from '../constants/financial';

import type {
  CreditCardResult,
  FinancingResult,
  ComparisonMetrics,
  EntryPercentage,
} from '../types';

/** Arredonda para 2 casas decimais */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calcula a simulação da carta de crédito.
 *
 * @param nominalValue - Valor nominal da carta (C)
 * @param desiredInstallment - Valor de parcela desejado (P)
 * @param entryPercentage - Percentual de entrada (p): 0.08, 0.09 ou 0.10
 * @returns Resultado completo da simulação
 */
export function calculateCreditCard(
  nominalValue: number,
  desiredInstallment: number,
  entryPercentage: EntryPercentage
): CreditCardResult {
  const adminFeeRate = ADMIN_FEE_RATE;
  
  // CT = C × 1,27
  const totalWithFee = round2(nominalValue * (1 + adminFeeRate));
  
  // E = C × p
  const entryValue = round2(nominalValue * entryPercentage);
  
  // SD = CT − E
  const debtBalance = round2(totalWithFee - entryValue);
  
  // Limites de parcelas possíveis
  const minPossibleInstallment = round2(debtBalance / MAX_TERM_MONTHS);
  const maxPossibleInstallment = round2(debtBalance / MIN_TERM_MONTHS);
  
  // Verificar viabilidade
  if (nominalValue <= 0 || desiredInstallment <= 0 || debtBalance <= 0) {
    return {
      nominalValue,
      adminFeeRate,
      totalWithFee,
      entryPercentage,
      entryValue,
      debtBalance,
      desiredInstallment,
      calculatedInstallment: 0,
      termMonths: 0,
      totalInstallments: 0,
      totalDisbursed: 0,
      isViable: false,
      minPossibleInstallment,
      maxPossibleInstallment,
    };
  }
  
  // N teórico = SD ÷ P
  const theoreticalTerm = debtBalance / desiredInstallment;
  
  // Verificar se existe prazo válido
  if (theoreticalTerm < MIN_TERM_MONTHS - 0.5 && desiredInstallment > maxPossibleInstallment) {
    // Parcela muito alta para qualquer prazo dentro do intervalo
    return {
      nominalValue,
      adminFeeRate,
      totalWithFee,
      entryPercentage,
      entryValue,
      debtBalance,
      desiredInstallment,
      calculatedInstallment: maxPossibleInstallment,
      termMonths: MIN_TERM_MONTHS,
      totalInstallments: debtBalance,
      totalDisbursed: round2(entryValue + debtBalance),
      isViable: false,
      minPossibleInstallment,
      maxPossibleInstallment,
    };
  }
  
  if (theoreticalTerm > MAX_TERM_MONTHS + 0.5 && desiredInstallment < minPossibleInstallment) {
    // Parcela muito baixa para qualquer prazo dentro do intervalo
    return {
      nominalValue,
      adminFeeRate,
      totalWithFee,
      entryPercentage,
      entryValue,
      debtBalance,
      desiredInstallment,
      calculatedInstallment: minPossibleInstallment,
      termMonths: MAX_TERM_MONTHS,
      totalInstallments: debtBalance,
      totalDisbursed: round2(entryValue + debtBalance),
      isViable: false,
      minPossibleInstallment,
      maxPossibleInstallment,
    };
  }
  
  // Encontrar o melhor prazo inteiro entre 190 e 380
  let bestTerm = MIN_TERM_MONTHS;
  let bestDiff = Infinity;
  
  for (let n = MIN_TERM_MONTHS; n <= MAX_TERM_MONTHS; n++) {
    const installmentForN = debtBalance / n;
    const diff = Math.abs(installmentForN - desiredInstallment);
    
    if (diff < bestDiff) {
      bestDiff = diff;
      bestTerm = n;
    }
    // Em caso de empate, o menor prazo já foi selecionado primeiro
  }
  
  const calculatedInstallment = round2(debtBalance / bestTerm);
  const totalInstallments = round2(calculatedInstallment * bestTerm);
  const totalDisbursed = round2(entryValue + totalInstallments);
  
  return {
    nominalValue,
    adminFeeRate,
    totalWithFee,
    entryPercentage,
    entryValue,
    debtBalance,
    desiredInstallment,
    calculatedInstallment,
    termMonths: bestTerm,
    totalInstallments,
    totalDisbursed,
    isViable: true,
    minPossibleInstallment,
    maxPossibleInstallment,
  };
}

/**
 * Recalcula a parcela para um prazo alternativo.
 * Mantém o saldo devedor e a entrada inalterados.
 */
export function calculateAlternativeInstallment(
  debtBalance: number,
  alternativeTerm: number
): { installment: number; totalInstallments: number; totalDisbursed: number; entryValue: number } {
  const installment = round2(debtBalance / alternativeTerm);
  const totalInstallments = round2(installment * alternativeTerm);
  return { installment, totalInstallments, totalDisbursed: 0, entryValue: 0 };
}

/**
 * Calcula a taxa mensal equivalente composta a partir da taxa anual.
 * i_mensal = (1 + i_anual)^(1/12) - 1
 */
export function calculateMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

/**
 * Calcula a simulação do financiamento tradicional (Price).
 * 
 * @param nominalValue - Valor nominal da carta de crédito (C)
 * @returns Resultado completo da simulação de financiamento
 */
export function calculateFinancing(nominalValue: number): FinancingResult {
  const entryRate = FINANCING_ENTRY_RATE;
  const entryValue = round2(nominalValue * entryRate);
  const financedValue = round2(nominalValue - entryValue);
  const annualRate = FINANCING_ANNUAL_RATE;
  const monthlyRate = calculateMonthlyRate(annualRate);
  const termMonths = FINANCING_TERM_MONTHS;
  
  let installment = 0;
  if (financedValue > 0 && monthlyRate > 0) {
    // PMT = VF × i / [1 − (1 + i)^(−n)]
    const numerator = financedValue * monthlyRate;
    const denominator = 1 - Math.pow(1 + monthlyRate, -termMonths);
    installment = round2(numerator / denominator);
  }
  
  const totalInstallments = round2(installment * termMonths);
  const totalDisbursed = round2(entryValue + totalInstallments);
  
  return {
    nominalValue,
    entryRate,
    entryValue,
    financedValue,
    annualRate,
    monthlyRate,
    termMonths,
    installment,
    totalInstallments,
    totalDisbursed,
  };
}

/**
 * Calcula os indicadores comparativos entre carta de crédito e financiamento.
 */
export function calculateComparison(
  credit: CreditCardResult,
  financing: FinancingResult,
  currentInstallment?: number,
  currentTotalInstallments?: number
): ComparisonMetrics {
  const creditInstallment = currentInstallment ?? credit.calculatedInstallment;
  const creditTotalInstallments = currentTotalInstallments ?? credit.totalInstallments;
  const creditTotal = round2(credit.entryValue + creditTotalInstallments);
  const financingTotal = financing.totalDisbursed;
  
  return {
    entryDifference: round2(financing.entryValue - credit.entryValue),
    installmentDifference: round2(financing.installment - creditInstallment),
    totalDisbursedDifference: round2(financingTotal - creditTotal),
    termDifference: financing.termMonths - (currentInstallment ? Math.round(creditTotalInstallments / creditInstallment) : credit.termMonths),
    creditCardTotal: creditTotal,
    financingTotal,
  };
}
