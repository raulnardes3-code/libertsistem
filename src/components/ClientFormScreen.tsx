import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, User, Users } from 'lucide-react';
import type { ClientData, MaritalStatus } from '../types';
import { MARITAL_STATUS_LABELS } from '../types';
import { BRAZILIAN_STATES } from '../constants/states';
import { maskCpf, validateCpf, cleanCpf } from '../utils/cpf';
import { formatCurrencyInput, currencyInputToNumber, numberToCurrencyInput } from '../utils/formatters';

interface ClientFormScreenProps {
  initialData: ClientData;
  onBack: () => void;
  onNext: (data: ClientData) => void;
}

interface FormErrors {
  fullName?: string;
  cpf?: string;
  monthlyIncome?: string;
  state?: string;
  maritalStatus?: string;
  spouseFullName?: string;
  spouseCpf?: string;
}

export function ClientFormScreen({ initialData, onBack, onNext }: ClientFormScreenProps) {
  const [formData, setFormData] = useState<ClientData>(initialData);
  const [cpfDisplay, setCpfDisplay] = useState(initialData.cpf ? maskCpf(initialData.cpf) : '');
  const [incomeDisplay, setIncomeDisplay] = useState(initialData.monthlyIncome > 0 ? numberToCurrencyInput(initialData.monthlyIncome) : '');
  const [spouseCpfDisplay, setSpouseCpfDisplay] = useState(initialData.spouse?.cpf ? maskCpf(initialData.spouse.cpf) : '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isMarried = formData.maritalStatus === 'casado';

  useEffect(() => {
    if (!isMarried) {
      setFormData((prev) => ({ ...prev, spouse: undefined }));
      setSpouseCpfDisplay('');
    } else if (!formData.spouse) {
      setFormData((prev) => ({ ...prev, spouse: { fullName: '', cpf: '' } }));
    }
  }, [isMarried]);

  function validate(data: ClientData): FormErrors {
    const errs: FormErrors = {};
    if (!data.fullName.trim()) errs.fullName = 'Nome completo é obrigatório.';
    const cpfClean = cleanCpf(data.cpf);
    if (!cpfClean) errs.cpf = 'CPF é obrigatório.';
    else if (!validateCpf(cpfClean)) errs.cpf = 'CPF inválido. Verifique os dígitos.';
    if (data.monthlyIncome <= 0) errs.monthlyIncome = 'Renda mensal deve ser maior que zero.';
    if (!data.state) errs.state = 'Selecione o estado de residência.';
    if (!data.maritalStatus) errs.maritalStatus = 'Selecione o estado civil.';
    if (data.maritalStatus === 'casado' && data.spouse) {
      if (!data.spouse.fullName.trim()) errs.spouseFullName = 'Nome do cônjuge é obrigatório.';
      const spCpf = cleanCpf(data.spouse.cpf);
      if (!spCpf) errs.spouseCpf = 'CPF do cônjuge é obrigatório.';
      else if (!validateCpf(spCpf)) errs.spouseCpf = 'CPF do cônjuge é inválido.';
    }
    return errs;
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {
      fullName: true, cpf: true, monthlyIncome: true, state: true, maritalStatus: true,
    };
    if (isMarried) {
      allTouched.spouseFullName = true;
      allTouched.spouseCpf = true;
    }
    setTouched(allTouched);
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onNext(formData);
    }
  }

  function handleCpfChange(value: string) {
    const masked = maskCpf(value);
    setCpfDisplay(masked);
    setFormData((prev) => ({ ...prev, cpf: cleanCpf(masked) }));
  }

  function handleIncomeChange(value: string) {
    const formatted = formatCurrencyInput(value);
    setIncomeDisplay(formatted);
    setFormData((prev) => ({ ...prev, monthlyIncome: currencyInputToNumber(formatted) }));
  }

  function handleSpouseCpfChange(value: string) {
    const masked = maskCpf(value);
    setSpouseCpfDisplay(masked);
    setFormData((prev) => ({
      ...prev,
      spouse: { ...prev.spouse!, cpf: cleanCpf(masked) },
    }));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-900 mb-2">Vamos conhecer o cliente.</h2>
        <p className="text-text-secondary">Preencha os dados para personalizar a simulação.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card-premium p-6 space-y-6">
          <div className="flex items-center gap-2 text-green-800 mb-2">
            <User className="w-5 h-5" />
            <h3 className="font-semibold">Dados pessoais</h3>
          </div>

          {/* Nome Completo */}
          <div>
            <label htmlFor="fullName" className="label-field">Nome completo</label>
            <input
              id="fullName"
              type="text"
              className={`input-field ${touched.fullName && errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              onBlur={() => handleBlur('fullName')}
              placeholder="Nome completo do cliente"
            />
            {touched.fullName && errors.fullName && <p className="error-text">{errors.fullName}</p>}
          </div>

          {/* CPF */}
          <div>
            <label htmlFor="cpf" className="label-field">CPF</label>
            <input
              id="cpf"
              type="text"
              className={`input-field ${touched.cpf && errors.cpf ? 'border-red-500 focus:ring-red-500' : ''}`}
              value={cpfDisplay}
              onChange={(e) => handleCpfChange(e.target.value)}
              onBlur={() => handleBlur('cpf')}
              placeholder="000.000.000-00"
              maxLength={14}
              inputMode="numeric"
            />
            {touched.cpf && errors.cpf && <p className="error-text">{errors.cpf}</p>}
          </div>

          {/* Renda Mensal */}
          <div>
            <label htmlFor="income" className="label-field">Renda mensal bruta</label>
            <div className={`flex items-stretch rounded-xl border bg-white shadow-xs overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-[#0D4E33] focus-within:border-[#0D4E33] ${
              touched.monthlyIncome && errors.monthlyIncome ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
            }`}>
              <span className="flex items-center px-4 bg-gray-100 text-gray-700 font-bold text-sm border-r border-gray-200 select-none">
                R$
              </span>
              <input
                id="income"
                type="text"
                className="w-full px-4 py-3 bg-transparent text-gray-900 text-base font-semibold focus:outline-none placeholder-gray-400"
                value={incomeDisplay}
                onChange={(e) => handleIncomeChange(e.target.value)}
                onBlur={() => handleBlur('monthlyIncome')}
                placeholder="0,00"
                inputMode="numeric"
              />
            </div>
            {touched.monthlyIncome && errors.monthlyIncome && <p className="error-text">{errors.monthlyIncome}</p>}
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="state" className="label-field">Estado de residência</label>
            <div className="relative">
              <select
                id="state"
                className={`select-field pr-10 ${touched.state && errors.state ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                onBlur={() => handleBlur('state')}
              >
                <option value="">Selecione o estado</option>
                {BRAZILIAN_STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {touched.state && errors.state && <p className="error-text">{errors.state}</p>}
          </div>

          {/* Estado Civil */}
          <div>
            <label htmlFor="maritalStatus" className="label-field">Estado civil</label>
            <div className="relative">
              <select
                id="maritalStatus"
                className={`select-field pr-10 ${touched.maritalStatus && errors.maritalStatus ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={formData.maritalStatus}
                onChange={(e) => setFormData((prev) => ({ ...prev, maritalStatus: e.target.value as MaritalStatus }))}
                onBlur={() => handleBlur('maritalStatus')}
              >
                <option value="">Selecione o estado civil</option>
                {(Object.entries(MARITAL_STATUS_LABELS) as [MaritalStatus, string][]).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {touched.maritalStatus && errors.maritalStatus && <p className="error-text">{errors.maritalStatus}</p>}
          </div>
        </div>

        {/* Seção do Cônjuge */}
        {isMarried && (
          <div className="card-premium p-6 space-y-6 mt-6 animate-in">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold">Dados do cônjuge</h3>
            </div>

            <div>
              <label htmlFor="spouseFullName" className="label-field">Nome completo do cônjuge</label>
              <input
                id="spouseFullName"
                type="text"
                className={`input-field ${touched.spouseFullName && errors.spouseFullName ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={formData.spouse?.fullName || ''}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  spouse: { ...prev.spouse!, fullName: e.target.value },
                }))}
                onBlur={() => handleBlur('spouseFullName')}
                placeholder="Nome completo do cônjuge"
              />
              {touched.spouseFullName && errors.spouseFullName && <p className="error-text">{errors.spouseFullName}</p>}
            </div>

            <div>
              <label htmlFor="spouseCpf" className="label-field">CPF do cônjuge</label>
              <input
                id="spouseCpf"
                type="text"
                className={`input-field ${touched.spouseCpf && errors.spouseCpf ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={spouseCpfDisplay}
                onChange={(e) => handleSpouseCpfChange(e.target.value)}
                onBlur={() => handleBlur('spouseCpf')}
                placeholder="000.000.000-00"
                maxLength={14}
                inputMode="numeric"
              />
              {touched.spouseCpf && errors.spouseCpf && <p className="error-text">{errors.spouseCpf}</p>}
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-between mt-8">
          <button type="button" onClick={onBack} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <button type="submit" className="btn-primary">
            Continuar para simulação
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
