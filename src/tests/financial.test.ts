import { describe, it, expect } from 'vitest';
import {
  calculateCreditCard,
  calculateFinancing,
  calculateMonthlyRate,
} from '../utils/financial';
import {
  MIN_TERM_MONTHS,
  MAX_TERM_MONTHS,
  FINANCING_ENTRY_RATE,
  FINANCING_ANNUAL_RATE,
} from '../constants/financial';
import { validateCpf, cleanCpf, maskCpf, partialMaskCpf } from '../utils/cpf';

describe('Motor Financeiro - Carta de Crédito (Libert)', () => {
  const nominalValue = 200000; // R$ 200.000,00

  it('deve aplicar taxa administrativa de 27%', () => {
    const result = calculateCreditCard(nominalValue, 1000, 0.08);
    expect(result.adminFeeRate).toBe(0.27);
    expect(result.totalWithFee).toBe(254000); // 200.000 * 1.27
  });

  it('deve calcular corretamente entrada de 8%', () => {
    const result = calculateCreditCard(nominalValue, 1000, 0.08);
    expect(result.entryValue).toBe(16000); // 200.000 * 0.08
    expect(result.debtBalance).toBe(238000); // 254.000 - 16.000
    expect(result.entryValue + result.debtBalance).toBe(result.totalWithFee);
  });

  it('deve calcular corretamente entrada de 9%', () => {
    const result = calculateCreditCard(nominalValue, 1000, 0.09);
    expect(result.entryValue).toBe(18000); // 200.000 * 0.09
    expect(result.debtBalance).toBe(236000); // 254.000 - 18.000
  });

  it('deve calcular corretamente entrada de 10%', () => {
    const result = calculateCreditCard(nominalValue, 1000, 0.10);
    expect(result.entryValue).toBe(20000); // 200.000 * 0.10
    expect(result.debtBalance).toBe(234000); // 254.000 - 20.000
  });

  it('deve encontrar o prazo inteiro ideal entre 190 e 380 meses mais próximo da parcela desejada', () => {
    // Para C = 200.000, entrada 8%, SD = 238.000.
    // Se P = 1.000, N teórico = 238.000 / 1.000 = 238 meses.
    const result = calculateCreditCard(nominalValue, 1000, 0.08);
    expect(result.termMonths).toBe(238);
    expect(result.isViable).toBe(true);
    expect(result.calculatedInstallment).toBe(1000); // 238.000 / 238 = 1000.00
  });

  it('deve respeitar os limites de prazo (mínimo 190 e máximo 380)', () => {
    const result = calculateCreditCard(nominalValue, 1000, 0.08);
    expect(result.termMonths).toBeGreaterThanOrEqual(MIN_TERM_MONTHS);
    expect(result.termMonths).toBeLessThanOrEqual(MAX_TERM_MONTHS);
  });

  it('deve sinalizar inviabilidade se a parcela desejada for menor que o mínimo possível (380 meses)', () => {
    const result = calculateCreditCard(nominalValue, 400, 0.08);
    expect(result.isViable).toBe(false);
    expect(result.minPossibleInstallment).toBeCloseTo(626.32, 1);
  });

  it('deve sinalizar inviabilidade se a parcela desejada for maior que o máximo possível (190 meses)', () => {
    const result = calculateCreditCard(nominalValue, 2000, 0.08);
    expect(result.isViable).toBe(false);
    expect(result.maxPossibleInstallment).toBeCloseTo(1252.63, 1);
  });

  it('deve tratar valor nominal zero ou negativo', () => {
    const result = calculateCreditCard(0, 1000, 0.08);
    expect(result.isViable).toBe(false);
  });
});

describe('Motor Financeiro - Financiamento Tradicional (Price)', () => {
  const nominalValue = 200000;

  it('deve calcular entrada fixa de 25% e financiamento de 75%', () => {
    const financing = calculateFinancing(nominalValue);
    expect(financing.entryRate).toBe(FINANCING_ENTRY_RATE);
    expect(financing.entryValue).toBe(50000); // 200.000 * 0.25
    expect(financing.financedValue).toBe(150000); // 200.000 * 0.75
  });

  it('deve converter corretamente a taxa anual de 13,74% para mensal equivalente composta', () => {
    const monthlyRate = calculateMonthlyRate(FINANCING_ANNUAL_RATE);
    // (1 + 0.1374)^(1/12) - 1 = 0.0107865...
    expect(monthlyRate).toBeCloseTo(0.0107865, 5);
  });

  it('deve aplicar amortização Price em 420 meses', () => {
    const financing = calculateFinancing(nominalValue);
    expect(financing.termMonths).toBe(420);
    expect(financing.installment).toBeGreaterThan(0);
    // Parcela calculada exata para 420 meses: R$ 1.636,04
    expect(financing.installment).toBeCloseTo(1636.04, 2);
    expect(financing.totalInstallments).toBeCloseTo(financing.installment * 420, 2);
    expect(financing.totalDisbursed).toBeCloseTo(financing.entryValue + financing.totalInstallments, 2);
  });
});

describe('Validação Oficial de CPF', () => {
  it('deve validar CPFs com dígitos verificadores corretos', () => {
    expect(validateCpf('52998224725')).toBe(true);
    expect(validateCpf('11144477735')).toBe(true);
  });

  it('deve rejeitar CPFs com dígitos repetidos', () => {
    expect(validateCpf('00000000000')).toBe(false);
    expect(validateCpf('11111111111')).toBe(false);
    expect(validateCpf('99999999999')).toBe(false);
  });

  it('deve rejeitar CPFs com tamanhos diferentes de 11 dígitos', () => {
    expect(validateCpf('123456789')).toBe(false);
    expect(validateCpf('123456789012')).toBe(false);
  });

  it('deve mascarar e desmascarar CPF corretamente', () => {
    expect(cleanCpf('123.456.789-01')).toBe('12345678901');
    expect(maskCpf('12345678901')).toBe('123.456.789-01');
    expect(partialMaskCpf('12345678901')).toBe('***.456.789-**');
  });
});
