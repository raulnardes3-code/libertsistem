import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, CreditCard, Info } from 'lucide-react';
import type { ClientData, CreditCardInput, CreditCardResult, EntryPercentage } from '../types';
import { ALLOWED_ENTRY_PERCENTAGES, ADMIN_FEE_RATE, MIN_TERM_MONTHS, MAX_TERM_MONTHS } from '../constants/financial';
import { calculateCreditCard } from '../utils/financial';
import { formatCurrency, formatCurrencyInput, currencyInputToNumber, numberToCurrencyInput, formatMonths, formatPercent } from '../utils/formatters';
import { partialMaskCpf } from '../utils/cpf';

interface CreditConfigScreenProps {
  client: ClientData;
  initialInput: CreditCardInput;
  onBack: () => void;
  onNext: (input: CreditCardInput, result: CreditCardResult) => void;
  onEditClient: () => void;
}

export function CreditConfigScreen({ client, initialInput, onBack, onNext, onEditClient }: CreditConfigScreenProps) {
  const [nominalDisplay, setNominalDisplay] = useState(
    initialInput.nominalValue > 0 ? numberToCurrencyInput(initialInput.nominalValue) : ''
  );
  const [installmentDisplay, setInstallmentDisplay] = useState(
    initialInput.desiredInstallment > 0 ? numberToCurrencyInput(initialInput.desiredInstallment) : ''
  );
  const [entryPercentage, setEntryPercentage] = useState<EntryPercentage>(initialInput.entryPercentage);

  const nominalValue = currencyInputToNumber(nominalDisplay);
  const desiredInstallment = currencyInputToNumber(installmentDisplay);

  const result = useMemo(() => {
    if (nominalValue > 0 && desiredInstallment > 0) {
      return calculateCreditCard(nominalValue, desiredInstallment, entryPercentage);
    }
    return null;
  }, [nominalValue, desiredInstallment, entryPercentage]);

  const entryValue = useMemo(() => {
    if (nominalValue > 0) {
      return Math.round(nominalValue * entryPercentage * 100) / 100;
    }
    return 0;
  }, [nominalValue, entryPercentage]);

  const [errors, setErrors] = useState<{ nominal?: string; installment?: string }>({});

  function handleSubmit() {
    const errs: { nominal?: string; installment?: string } = {};
    if (nominalValue <= 0) errs.nominal = 'Informe o valor da carta de crédito.';
    if (desiredInstallment <= 0) errs.installment = 'Informe o valor da parcela desejada.';
    if (result && !result.isViable) {
      errs.installment = `Parcela fora da faixa possível. Valores possíveis: ${formatCurrency(result.minPossibleInstallment)} a ${formatCurrency(result.maxPossibleInstallment)} (para prazos de ${MAX_TERM_MONTHS} a ${MIN_TERM_MONTHS} meses).`;
    }
    setErrors(errs);
    if (Object.keys(errs).length === 0 && result) {
      onNext(
        { nominalValue, desiredInstallment, entryPercentage },
        result
      );
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Resumo do cliente */}
      <div className="card-premium p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-900/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-green-800" />
          </div>
          <div>
            <p className="font-semibold text-text-primary">{client.fullName}</p>
            <p className="text-sm text-text-muted">CPF: {partialMaskCpf(client.cpf)} · {client.state}</p>
          </div>
        </div>
        <button onClick={onEditClient} className="btn-ghost text-sm">
          Editar dados do cliente
        </button>
      </div>

      <h2 className="text-2xl font-bold text-green-900 mb-2">Configure a carta de crédito</h2>
      <p className="text-text-secondary mb-8">Defina os valores para gerar a simulação personalizada.</p>

      <div className="space-y-6">
        {/* Valor nominal da carta */}
        <div className="card-premium p-6">
          <label htmlFor="nominalValue" className="label-field text-sm font-semibold text-gray-800 mb-2 block">
            Valor da carta de crédito
          </label>
          <div className={`flex items-stretch rounded-xl border bg-white shadow-xs overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-[#0D4E33] focus-within:border-[#0D4E33] ${
            errors.nominal ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
          }`}>
            <span className="flex items-center px-4 bg-gray-100 text-gray-700 font-bold text-base border-r border-gray-200 select-none">
              R$
            </span>
            <input
              id="nominalValue"
              type="text"
              className="w-full px-4 py-3.5 bg-transparent text-gray-900 text-xl font-bold focus:outline-none placeholder-gray-400"
              value={nominalDisplay}
              onChange={(e) => setNominalDisplay(formatCurrencyInput(e.target.value))}
              placeholder="0,00"
              inputMode="numeric"
            />
          </div>
          {errors.nominal && <p className="error-text mt-1.5">{errors.nominal}</p>}
        </div>

        {/* Valor de parcela desejada */}
        <div className="card-premium p-6">
          <label htmlFor="installment" className="label-field text-sm font-semibold text-gray-800 mb-2 block">
            Valor de parcela desejado
          </label>
          <div className={`flex items-stretch rounded-xl border bg-white shadow-xs overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-[#0D4E33] focus-within:border-[#0D4E33] ${
            errors.installment ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
          }`}>
            <span className="flex items-center px-4 bg-gray-100 text-gray-700 font-bold text-base border-r border-gray-200 select-none">
              R$
            </span>
            <input
              id="installment"
              type="text"
              className="w-full px-4 py-3.5 bg-transparent text-gray-900 text-xl font-bold focus:outline-none placeholder-gray-400"
              value={installmentDisplay}
              onChange={(e) => setInstallmentDisplay(formatCurrencyInput(e.target.value))}
              placeholder="0,00"
              inputMode="numeric"
            />
          </div>
          {errors.installment && <p className="error-text mt-1.5">{errors.installment}</p>}
        </div>

        {/* Seletor de entrada */}
        <div className="card-premium p-6">
          <label className="label-field mb-3">Percentual de entrada</label>
          <div className="grid grid-cols-3 gap-3">
            {ALLOWED_ENTRY_PERCENTAGES.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setEntryPercentage(pct as EntryPercentage)}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                  entryPercentage === pct
                    ? 'border-gold-500 bg-gold-500/10 text-green-900'
                    : 'border-divider bg-white text-text-secondary hover:border-green-700/30'
                }`}
              >
                <span className="text-xl font-bold">{Math.round(pct * 100)}%</span>
                <span className="block text-sm mt-1">
                  {nominalValue > 0 ? formatCurrency(Math.round(nominalValue * pct * 100) / 100) : 'R$ 0,00'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Composição do valor */}
        {nominalValue > 0 && (
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-green-800" />
              <h3 className="font-semibold text-green-900">Composição do valor</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-divider">
                <span className="text-text-secondary">Valor nominal da carta</span>
                <span className="font-semibold">{formatCurrency(nominalValue)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-divider">
                <span className="text-text-secondary">Taxa administrativa ({formatPercent(ADMIN_FEE_RATE)})</span>
                <span className="font-semibold">{formatCurrency(Math.round(nominalValue * ADMIN_FEE_RATE * 100) / 100)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-divider">
                <span className="text-text-secondary">Total com taxa administrativa</span>
                <span className="font-bold text-green-900">{formatCurrency(Math.round(nominalValue * 1.27 * 100) / 100)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-divider">
                <span className="text-text-secondary">Entrada selecionada ({Math.round(entryPercentage * 100)}%)</span>
                <span className="font-semibold text-gold-500">{formatCurrency(entryValue)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-secondary font-medium">Saldo para parcelamento</span>
                <span className="font-bold text-green-900">
                  {formatCurrency(Math.round((nominalValue * 1.27 - entryValue) * 100) / 100)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Resultado prévio */}
        {result && result.isViable && (
          <div className="card-premium p-6 border-l-4 border-l-gold-500">
            <h3 className="font-semibold text-green-900 mb-4">Resumo da simulação</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-surface-alt rounded-lg">
                <span className="text-text-muted block text-xs">Parcela desejada</span>
                <span className="font-bold text-lg">{formatCurrency(result.desiredInstallment)}</span>
              </div>
              <div className="p-3 bg-surface-alt rounded-lg">
                <span className="text-text-muted block text-xs">Parcela calculada</span>
                <span className="font-bold text-lg text-green-900">{formatCurrency(result.calculatedInstallment)}</span>
              </div>
              <div className="p-3 bg-surface-alt rounded-lg">
                <span className="text-text-muted block text-xs">Prazo encontrado</span>
                <span className="font-bold text-lg">{formatMonths(result.termMonths)}</span>
              </div>
              <div className="p-3 bg-surface-alt rounded-lg">
                <span className="text-text-muted block text-xs">Saldo devedor</span>
                <span className="font-bold text-lg">{formatCurrency(result.debtBalance)}</span>
              </div>
            </div>
            {Math.abs(result.calculatedInstallment - result.desiredInstallment) > 0.01 && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  O valor de parcela calculado difere do desejado porque o prazo foi ajustado
                  para o inteiro mais próximo entre {MIN_TERM_MONTHS} e {MAX_TERM_MONTHS} meses.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Aviso de inviabilidade */}
        {result && !result.isViable && nominalValue > 0 && desiredInstallment > 0 && (
          <div className="card-premium p-6 border-l-4 border-l-red-500">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Parcela fora da faixa permitida</h3>
                <p className="text-sm text-red-800 mb-2">
                  O valor de parcela informado não é compatível com os limites de prazo ({MIN_TERM_MONTHS} a {MAX_TERM_MONTHS} meses).
                </p>
                <p className="text-sm text-red-700">
                  <strong>Faixa de parcelas possíveis:</strong><br />
                  Mínima ({MAX_TERM_MONTHS} meses): {formatCurrency(result.minPossibleInstallment)}<br />
                  Máxima ({MIN_TERM_MONTHS} meses): {formatCurrency(result.maxPossibleInstallment)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary"
          disabled={!result || !result.isViable}
        >
          Gerar comparação
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
