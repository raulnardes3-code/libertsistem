import { useState, useMemo } from 'react';
import {
  Printer,
  Edit3,
  Settings,
  PlusCircle,
  RefreshCw,
  TrendingDown,
  Info,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRightLeft
} from 'lucide-react';
import type { ClientData, CreditCardResult } from '../types';
import { calculateFinancing } from '../utils/financial';
import { formatCurrency, formatPercent, formatMonthsToYears, formatDateFull } from '../utils/formatters';
import { MIN_TERM_MONTHS, MAX_TERM_MONTHS, FINANCING_ANNUAL_RATE, FINANCING_TERM_MONTHS, FINANCING_ENTRY_RATE, ADMIN_FEE_RATE } from '../constants/financial';
import { ModalConfirmation } from './ModalConfirmation';
import { BankLogo } from './BankLogo';
import logoLibertClean from '../assets/logo-libert-clean.png';

interface SimulationResultScreenProps {
  client: ClientData;
  creditResult: CreditCardResult;
  simulationDate: Date;
  onNewSimulation: () => void;
  onEditClient: () => void;
  onEditCredit: () => void;
  onApproval: () => void;
}

const INSTITUTIONS = [
  'Santander',
  'Itaú',
  'Caixa Econômica Federal',
  'Banco do Brasil',
  'Nubank',
  'Bradesco',
  'Banco Inter',
];

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function SimulationResultScreen({
  client,
  creditResult,
  simulationDate,
  onNewSimulation,
  onEditClient,
  onEditCredit,
  onApproval,
}: SimulationResultScreenProps) {
  const [alternativeTerm, setAlternativeTerm] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<'new' | 'finish' | null>(null);

  const originalTerm = creditResult.termMonths;
  const currentTerm = alternativeTerm ?? originalTerm;
  const isAlternative = alternativeTerm !== null && alternativeTerm !== originalTerm;

  // Parcela e totais para o prazo atual (original ou cenário alternativo)
  const currentInstallment = round2(creditResult.debtBalance / currentTerm);
  const currentTotalInstallments = round2(currentInstallment * currentTerm);
  const currentTotalDisbursed = round2(creditResult.entryValue + currentTotalInstallments);

  // Financiamento tradicional calculado automaticamente com premissas fixas (420 meses)
  const financingResult = useMemo(
    () => calculateFinancing(creditResult.nominalValue),
    [creditResult.nominalValue]
  );

  // Comparativos diretos
  const comparison = useMemo(
    () => ({
      entryDifference: round2(financingResult.entryValue - creditResult.entryValue),
      installmentDifference: round2(financingResult.installment - currentInstallment),
      totalDisbursedDifference: round2(financingResult.totalDisbursed - currentTotalDisbursed),
      termDifference: financingResult.termMonths - currentTerm,
      creditCardTotal: currentTotalDisbursed,
      financingTotal: financingResult.totalDisbursed,
    }),
    [financingResult, creditResult, currentInstallment, currentTotalDisbursed, currentTerm]
  );

  function handlePrint() {
    window.print();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Cabeçalho da Impressão (Apenas no print) */}
      <div className="print-only mb-8 pb-4 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoLibertClean} alt="Libert Investimentos" className="h-16 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-bold text-[#0D4E33] font-serif">LIBERT INVESTIMENTOS</h1>
              <p className="text-xs text-gray-600 font-medium tracking-wide uppercase">Ambiente Interno | Simulação de Crédito</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p className="font-semibold text-gray-800">Simulação preparada para: {client.fullName}</p>
            <p>Data: {formatDateFull(simulationDate)}</p>
          </div>
        </div>
      </div>

      {/* Cabeçalho Institucional Integrado da Simulação */}
      <div className="mb-10 no-print">
        <div className="relative bg-gradient-to-r from-[#06291A] via-[#0D4E33] to-[#06291A] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#C5A15A]/30 overflow-hidden text-center">
          {/* Ambient glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C5A15A]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Integrated Logo */}
          <div className="relative z-10 mb-4 inline-flex flex-col items-center">
            <img
              src={logoLibertClean}
              alt="Libert Investimentos"
              className="h-20 sm:h-24 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(197,161,90,0.35)]"
            />
          </div>

          <h1 className="relative z-10 text-2xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Simulação personalizada de crédito
          </h1>
          <p className="relative z-10 text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto mb-6 font-light">
            Preparamos uma visão comparativa para ajudar você a avaliar as possibilidades disponíveis.
          </p>

          <div className="relative z-10 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-6 py-2.5 bg-[#062417]/80 border border-[#C5A15A]/40 rounded-full shadow-inner">
            <p className="text-sm font-semibold text-white">
              Simulação preparada para: <span className="font-bold text-[#C5A15A]">{client.fullName}</span>
            </p>
            <span className="hidden sm:inline text-[#C5A15A]/50">•</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#C5A15A]" />
              <span>Pronta para entrar em análise</span>
            </div>
          </div>

          <p className="relative z-10 text-[11px] text-emerald-200/60 max-w-2xl mx-auto mt-4">
            Os valores apresentados são estimativas preliminares e dependem da validação das condições
            comerciais e da análise da instituição responsável. Data: {formatDateFull(simulationDate)}.
          </p>
        </div>
      </div>

      {/* Layout Lado a Lado dos Dois Cards Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* CARD A — CARTA DE CRÉDITO LIBERT */}
        <div className="bg-white rounded-2xl border-2 border-[#0D4E33] shadow-md overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-[#06291A] to-[#0D4E33] text-white p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#C5A15A] text-[#123B2A]">
                  Libert Investimentos
                </span>
                <span className="text-xs text-emerald-200/80 font-medium">Modalidade Programada</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Carta de crédito</h2>
              <p className="text-emerald-100/80 text-xs">Simulação personalizada sob medida</p>
            </div>

            <div className="p-6 space-y-3">
              {/* LINHA 1: VALOR NOMINAL */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 min-h-[42px]">
                <span className="text-gray-600 text-sm">Valor nominal da carta</span>
                <span className="font-bold text-gray-900 text-base">{formatCurrency(creditResult.nominalValue)}</span>
              </div>
              
              {/* LINHA 2: VALOR DA ENTRADA (ALINHADA PERFEITAMENTE LADO A LADO COM O FINANCIAMENTO) */}
              <div className="flex justify-between items-center py-2.5 px-3 bg-[#C5A15A]/15 border border-[#C5A15A]/40 rounded-xl min-h-[48px] shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C5A15A]"></span>
                  <span className="text-gray-900 text-sm font-bold">
                    Entrada ({Math.round(creditResult.entryPercentage * 100)}%)
                  </span>
                </div>
                <span className="font-black text-[#123B2A] text-lg">{formatCurrency(creditResult.entryValue)}</span>
              </div>

              {/* LINHA 3: TAXA / CUSTO */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 min-h-[42px]">
                <span className="text-gray-600 text-sm">Taxa administrativa total ({formatPercent(ADMIN_FEE_RATE)})</span>
                <span className="font-semibold text-gray-800">{formatCurrency(round2(creditResult.nominalValue * ADMIN_FEE_RATE))}</span>
              </div>

              {/* LINHA 4: BASE / SALDO PARA PARCELAMENTO */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 min-h-[42px]">
                <span className="text-gray-600 text-sm">Saldo devedor para parcelas</span>
                <span className="font-bold text-gray-900 text-base">{formatCurrency(creditResult.debtBalance)}</span>
              </div>

              {/* LINHA 5: PRAZO TOTAL */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 min-h-[42px]">
                <span className="text-gray-600 text-sm">
                  Quantidade de parcelas
                  {isAlternative && (
                    <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                      Cenário alternativo
                    </span>
                  )}
                </span>
                <span className="font-bold text-gray-900 text-sm sm:text-base">
                  {currentTerm} parcelas mensais ({formatMonthsToYears(currentTerm)})
                </span>
              </div>

              {/* LINHA 6: DESTAQUE DA PARCELA MENSAL (ALTURA IDÊNTICA AO FINANCIAMENTO) */}
              <div className="bg-[#0D4E33]/5 border-2 border-[#0D4E33]/25 rounded-xl p-4 my-2 min-h-[96px] flex flex-col justify-center">
                <span className="text-xs uppercase tracking-wider font-bold text-[#0D4E33] block mb-0.5">
                  Valor da parcela calculada
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-[#0D4E33] tracking-tight">
                    {formatCurrency(currentInstallment)}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">/ mês</span>
                </div>
                {isAlternative && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Prazo original: {originalTerm}x de {formatCurrency(creditResult.calculatedInstallment)}
                  </p>
                )}
              </div>

              {/* LINHA 7: TOTAL PARCELADO */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 min-h-[42px]">
                <span className="text-gray-600 text-sm">Total de pagamentos parcelados</span>
                <span className="font-semibold text-gray-800">{formatCurrency(currentTotalInstallments)}</span>
              </div>

              {/* LINHA 8: TOTAL DESEMBOLSADO (ALTURA IDÊNTICA AO FINANCIAMENTO) */}
              <div className="flex justify-between items-center py-3 px-4 bg-[#0D4E33]/10 border border-[#0D4E33]/20 rounded-xl min-h-[56px]">
                <span className="text-gray-900 font-bold text-sm">Total desembolsado (Entrada + Parcelas)</span>
                <span className="text-2xl font-black text-[#0D4E33]">{formatCurrency(currentTotalDisbursed)}</span>
              </div>
            </div>
          </div>

          {/* Seletor Discreto de Cenários Alternativos */}
          <div className="no-print p-6 bg-gray-50/90 border-t border-gray-200 mt-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="altTerm" className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0D4E33]" />
                Simular outro prazo ({MIN_TERM_MONTHS} a {MAX_TERM_MONTHS} parcelas)
              </label>
              <span className="text-sm font-bold text-[#0D4E33] bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-xs">
                {currentTerm} meses
              </span>
            </div>
            <input
              id="altTerm"
              type="range"
              min={MIN_TERM_MONTHS}
              max={MAX_TERM_MONTHS}
              value={currentTerm}
              onChange={(e) => setAlternativeTerm(parseInt(e.target.value))}
              className="w-full accent-[#0D4E33] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>{MIN_TERM_MONTHS} meses</span>
              <span>{MAX_TERM_MONTHS} meses</span>
            </div>
            {isAlternative && (
              <button
                type="button"
                onClick={() => setAlternativeTerm(null)}
                className="mt-3 text-xs font-semibold text-[#0D4E33] hover:text-[#1D513B] inline-flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restaurar prazo original ({originalTerm} parcelas)
              </button>
            )}
          </div>
        </div>

        {/* CARD B — FINANCIAMENTO TRADICIONAL (420 PARCELAS) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-gray-800 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-gray-700 text-gray-300">
                  Mercado Imobiliário
                </span>
                <span className="text-xs text-gray-400 font-medium">Tabela Price Fixa</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Financiamento tradicional</h2>
              <p className="text-gray-300 text-xs">Referência comparativa calculada automaticamente</p>
            </div>

            <div className="p-6 space-y-3">
              {/* LINHA 1: VALOR NOMINAL */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 min-h-[42px]">
                <span className="text-gray-600 text-sm">Valor nominal de referência</span>
                <span className="font-bold text-gray-900 text-base">{formatCurrency(financingResult.nominalValue)}</span>
              </div>

              {/* LINHA 2: VALOR DA ENTRADA (ALINHADA PERFEITAMENTE LADO A LADO COM A CARTA) */}
              <div className="flex justify-between items-center py-2.5 px-3 bg-gray-100 border border-gray-300 rounded-xl min-h-[48px] shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                  <span className="text-gray-900 text-sm font-bold">
                    Entrada ({Math.round(FINANCING_ENTRY_RATE * 100)}%)
                  </span>
                </div>
                <span className="font-black text-gray-900 text-lg">{formatCurrency(financingResult.entryValue)}</span>
              </div>

              {/* LINHA 3: TAXA / CUSTO */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 min-h-[42px]">
                <span className="text-gray-600 text-sm">Taxa anual de juros</span>
                <span className="font-semibold text-gray-800">{formatPercent(FINANCING_ANNUAL_RATE)} a.a. (equiv. 1,08% a.m.)</span>
              </div>

              {/* LINHA 4: BASE / VALOR FINANCIADO */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 min-h-[42px]">
                <span className="text-gray-600 text-sm">Valor financiado no banco (75%)</span>
                <span className="font-bold text-gray-900 text-base">{formatCurrency(financingResult.financedValue)}</span>
              </div>

              {/* LINHA 5: PRAZO TOTAL */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 min-h-[42px]">
                <span className="text-gray-600 text-sm">Prazo fixo contratual</span>
                <span className="font-bold text-gray-900 text-sm sm:text-base">
                  {FINANCING_TERM_MONTHS} parcelas mensais ({formatMonthsToYears(FINANCING_TERM_MONTHS)})
                </span>
              </div>

              {/* LINHA 6: DESTAQUE DA PARCELA MENSAL (ALTURA IDÊNTICA À CARTA) */}
              <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 my-2 min-h-[96px] flex flex-col justify-center">
                <span className="text-xs uppercase tracking-wider font-bold text-gray-600 block mb-0.5">
                  Valor estimado da parcela
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-gray-900 tracking-tight">
                    {formatCurrency(financingResult.installment)}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">/ mês</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Amortização Price (parcelas fixas)
                </p>
              </div>

              {/* LINHA 7: TOTAL PARCELADO */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100 min-h-[42px]">
                <span className="text-gray-600 text-sm">Total estimado das {FINANCING_TERM_MONTHS} parcelas</span>
                <span className="font-semibold text-gray-800">{formatCurrency(financingResult.totalInstallments)}</span>
              </div>

              {/* LINHA 8: TOTAL DESEMBOLSADO (ALTURA IDÊNTICA À CARTA) */}
              <div className="flex justify-between items-center py-3 px-4 bg-gray-100 border border-gray-200 rounded-xl min-h-[56px]">
                <span className="text-gray-900 font-bold text-sm">Total desembolsado (Entrada + Parcelas)</span>
                <span className="text-2xl font-black text-gray-900">{formatCurrency(financingResult.totalDisbursed)}</span>
              </div>
            </div>
          </div>

          {/* Premissas Fixas */}
          <div className="p-6 bg-gray-50/90 border-t border-gray-200 mt-2">
            <div className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
              <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Premissas fixas de mercado:</strong> Entrada de 25%, financiamento de 75%, juros de 13,74% a.a. convertidos para taxa equivalente mensal e prazo de {FINANCING_TERM_MONTHS} meses no sistema Price. Valores não editáveis.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Observação de Transparência da Comparação */}
      <div className="text-center text-xs text-gray-500 px-4 mb-10 max-w-3xl mx-auto leading-relaxed">
        Comparação estimativa elaborada com premissas fixas de cálculo. As modalidades possuem
        condições, regras de contratação, riscos e características diferentes. Os valores não
        representam uma proposta bancária vinculante.
      </div>

      {/* SEÇÃO COMPARATIVA: VALORES EQUIVALENTES LADO A LADO */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 mb-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D4E33]/10 text-[#0D4E33] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Visão Comparativa Direta
          </div>
          <h3 className="text-2xl font-bold text-[#0D4E33]">Comparativo financeiro lado a lado</h3>
          <p className="text-sm text-gray-500 max-w-xl mx-auto mt-1">
            Compare cada condição equivalente entre a Carta de Crédito Libert e o Financiamento Tradicional.
          </p>
        </div>

        {/* 4 Blocos Comparativos Lado a Lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1. ENTRADA */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 hover:border-[#0D4E33]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Valor da Entrada</span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#C5A15A]/20 text-[#123B2A]">
                {comparison.entryDifference > 0 ? `Economia de entrada: ${formatCurrency(comparison.entryDifference)}` : 'Entrada'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#0D4E33] block">Carta de Crédito ({Math.round(creditResult.entryPercentage * 100)}%)</span>
                <span className="text-lg font-black text-[#0D4E33]">{formatCurrency(creditResult.entryValue)}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 block">Financiamento (25%)</span>
                <span className="text-lg font-black text-gray-800">{formatCurrency(financingResult.entryValue)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                {comparison.entryDifference > 0 ? (
                  <>Você inicia com <strong>{formatCurrency(comparison.entryDifference)} a menos</strong> de desembolso imediato.</>
                ) : (
                  <>Entradas equivalentes para ambas as opções.</>
                )}
              </span>
            </p>
          </div>

          {/* 2. PARCELA MENSAL */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 hover:border-[#0D4E33]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Parcela Mensal</span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-[#0D4E33]">
                {comparison.installmentDifference > 0 ? `Diferença: ${formatCurrency(comparison.installmentDifference)} / mês` : 'Parcelas'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#0D4E33] block">Carta de Crédito</span>
                <span className="text-lg font-black text-[#0D4E33]">{formatCurrency(currentInstallment)}</span>
                <span className="text-[10px] text-gray-400 block">/ mês</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 block">Financiamento Price</span>
                <span className="text-lg font-black text-gray-800">{formatCurrency(financingResult.installment)}</span>
                <span className="text-[10px] text-gray-400 block">/ mês (estimado)</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                {comparison.installmentDifference > 0 ? (
                  <>Parcela mensal <strong>{formatCurrency(comparison.installmentDifference)} menor</strong> na Carta de Crédito.</>
                ) : (
                  <>Parcela mensal ajustada para o prazo selecionado.</>
                )}
              </span>
            </p>
          </div>

          {/* 3. PRAZO DE PAGAMENTO */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 hover:border-[#0D4E33]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Prazo de Pagamento</span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                {comparison.termDifference > 0 ? `${comparison.termDifference} meses a menos` : 'Prazos'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#0D4E33] block">Carta de Crédito</span>
                <span className="text-lg font-black text-[#0D4E33]">{currentTerm} meses</span>
                <span className="text-[10px] text-gray-400 block">{formatMonthsToYears(currentTerm)}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 block">Financiamento</span>
                <span className="text-lg font-black text-gray-800">{FINANCING_TERM_MONTHS} meses</span>
                <span className="text-[10px] text-gray-400 block">{formatMonthsToYears(FINANCING_TERM_MONTHS)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-100 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                {comparison.termDifference > 0 ? (
                  <>Você quita sua conquista <strong>{Math.round((comparison.termDifference / 12) * 10) / 10} anos antes</strong> do que no financiamento.</>
                ) : (
                  <>Prazos calculados para cada perfil.</>
                )}
              </span>
            </p>
          </div>

          {/* 4. TOTAL DE REFERÊNCIA DESEMBOLSADO */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 hover:border-[#0D4E33]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Desembolsado (Entrada + Parcelas)</span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0D4E33]/15 text-[#0D4E33]">
                {comparison.totalDisbursedDifference > 0 ? `Diferença: ${formatCurrency(comparison.totalDisbursedDifference)}` : 'Totais'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-[#0D4E33] block">Carta de Crédito</span>
                <span className="text-lg font-black text-[#0D4E33]">{formatCurrency(currentTotalDisbursed)}</span>
                <span className="text-[10px] text-gray-400 block">Entrada + Parcelas</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 block">Financiamento (420m)</span>
                <span className="text-lg font-black text-gray-800">{formatCurrency(financingResult.totalDisbursed)}</span>
                <span className="text-[10px] text-gray-400 block">Entrada + 420x Price</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-100 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                {comparison.totalDisbursedDifference > 0 ? (
                  <>Diferença estimada de <strong>{formatCurrency(comparison.totalDisbursedDifference)}</strong> a favor da modalidade programada.</>
                ) : (
                  <>Valores estimados de referência.</>
                )}
              </span>
            </p>
          </div>

        </div>

        {/* Tabela Resumo Lado a Lado (Ideal para o cliente ler na tela durante a reunião) */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Item de Comparação</th>
                <th className="py-3 px-4 text-[#0D4E33]">Carta de Crédito Libert</th>
                <th className="py-3 px-4 text-gray-700">Financiamento Tradicional</th>
                <th className="py-3 px-4 text-[#C5A15A]">Diferença / Comparativo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-700">Entrada Inicial</td>
                <td className="py-3 px-4 font-bold text-[#0D4E33]">{formatCurrency(creditResult.entryValue)} ({Math.round(creditResult.entryPercentage * 100)}%)</td>
                <td className="py-3 px-4 font-bold text-gray-800">{formatCurrency(financingResult.entryValue)} (25%)</td>
                <td className="py-3 px-4 font-semibold text-emerald-700">Carta requer {formatCurrency(comparison.entryDifference)} a menos</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-700">Parcela Mensal</td>
                <td className="py-3 px-4 font-bold text-[#0D4E33]">{formatCurrency(currentInstallment)}</td>
                <td className="py-3 px-4 font-bold text-gray-800">{formatCurrency(financingResult.installment)}</td>
                <td className="py-3 px-4 font-semibold text-emerald-700">Parcela {formatCurrency(comparison.installmentDifference)} menor na Carta</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-700">Prazo de Pagamento</td>
                <td className="py-3 px-4 font-bold text-[#0D4E33]">{currentTerm} parcelas ({formatMonthsToYears(currentTerm)})</td>
                <td className="py-3 px-4 font-bold text-gray-800">{FINANCING_TERM_MONTHS} parcelas ({formatMonthsToYears(FINANCING_TERM_MONTHS)})</td>
                <td className="py-3 px-4 font-semibold text-amber-700">{comparison.termDifference} meses a menos para quitar</td>
              </tr>
              <tr className="bg-[#0D4E33]/5">
                <td className="py-3 px-4 font-bold text-gray-900">Total Desembolsado</td>
                <td className="py-3 px-4 font-black text-[#0D4E33]">{formatCurrency(currentTotalDisbursed)}</td>
                <td className="py-3 px-4 font-black text-gray-900">{formatCurrency(financingResult.totalDisbursed)}</td>
                <td className="py-3 px-4 font-black text-[#0D4E33]">Diferença de {formatCurrency(comparison.totalDisbursedDifference)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ÁREA INSTITUCIONAL — INSTITUIÇÕES FINANCEIRAS */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 mb-10 shadow-xs">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Building2 className="w-5 h-5 text-[#0D4E33]" />
            <h3 className="text-xl font-bold text-[#0D4E33]">Instituições financeiras</h3>
          </div>
          <p className="text-sm text-gray-500">
            Conheça algumas das instituições do mercado financeiro.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {INSTITUTIONS.map((inst) => (
            <div
              key={inst}
              className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl h-20 shadow-xs hover:border-gray-300 transition-colors"
            >
              <BankLogo name={inst} />
            </div>
          ))}
        </div>
      </div>

      {/* BOTÕES E AÇÕES DA TELA FINAL */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3 mb-10">
        <button
          type="button"
          onClick={() => setShowModal('new')}
          className="btn-secondary"
        >
          <PlusCircle className="w-4 h-4" />
          Nova simulação
        </button>

        <button
          type="button"
          onClick={onEditClient}
          className="btn-secondary"
        >
          <Edit3 className="w-4 h-4" />
          Editar dados do cliente
        </button>

        <button
          type="button"
          onClick={onEditCredit}
          className="btn-secondary"
        >
          <Settings className="w-4 h-4" />
          Alterar simulação
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="btn-primary"
        >
          <Printer className="w-4 h-4" />
          Imprimir simulação
        </button>

        <button
          type="button"
          onClick={onApproval}
          className="btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700"
        >
<CheckCircle2 className="w-4 h-4" />
                  Solicitar aprovação
        </button>
      </div>

      {/* Modais de Confirmação */}
      <ModalConfirmation
        isOpen={showModal === 'new'}
        title="Iniciar nova simulação"
        message="Os dados do cliente e da simulação atual serão descartados com segurança da memória. Deseja prosseguir?"
        confirmText="Sim, nova simulação"
        cancelText="Voltar"
        onConfirm={() => {
          setShowModal(null);
          onNewSimulation();
        }}
        onCancel={() => setShowModal(null)}
      />


    </div>
  );
}
