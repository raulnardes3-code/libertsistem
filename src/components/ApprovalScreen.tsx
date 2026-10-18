import { useEffect, useState } from 'react';
import { CheckCircle2, FileCheck2, ShieldCheck, Clock3, Printer } from 'lucide-react';
import type { ClientData, CreditCardResult } from '../types';
import { formatCurrency, formatDateFull, formatMonthsToYears } from '../utils/formatters';

interface ApprovalScreenProps {
  client: ClientData;
  creditResult: CreditCardResult;
  simulationDate: Date;
  onNewSimulation: () => void;
}

export function ApprovalScreen({ client, creditResult, simulationDate, onNewSimulation }: ApprovalScreenProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsAnalyzing(false), 10000);
    return () => window.clearTimeout(timer);
  }, []);

  if (isAnalyzing) {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10">
        <section className="card-premium w-full max-w-xl p-8 sm:p-12 text-center">
          <div className="mx-auto mb-6 size-16 rounded-full bg-[#0D4E33]/10 flex items-center justify-center">
            <Clock3 className="size-8 text-[#0D4E33] animate-spin" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0D4E33]">Etapa segura de validação</p>
          <h1 className="mt-3 text-3xl font-black text-gray-900">Sua proposta está em análise</h1>
          <p className="mt-4 text-gray-600 leading-relaxed">Estamos conferindo os dados informados e organizando as melhores condições para o seu perfil. Aguarde alguns instantes.</p>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full w-2/3 rounded-full bg-[#0D4E33] animate-pulse" /></div>
          <p className="mt-3 text-xs text-gray-500">Não feche esta página durante a análise.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="approval-page max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <section className="rounded-3xl bg-gradient-to-br from-[#06281A] via-[#0D4E33] to-[#051C12] p-8 sm:p-12 text-center text-white shadow-2xl">
        <CheckCircle2 className="mx-auto size-16 text-[#D4AF37]" />
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#D4AF37]">Análise concluída</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">Análise preliminar concluída</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-emerald-50">Sua proposta foi registrada e está pronta para conferência e eventual contratação.</p>
        <p className="mt-5 text-xs text-emerald-100/70">A aprovação final está condicionada à conferência documental e às regras da instituição responsável.</p>
      </section>

      <section className="mt-6 rounded-2xl border border-[#0D4E33]/20 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5"><FileCheck2 className="size-6 text-[#0D4E33]" /><div><h2 className="text-xl font-bold text-gray-900">Termo de simulação e proposta preliminar</h2><p className="text-sm text-gray-500">Documento informativo — emitido em {formatDateFull(simulationDate)}</p></div></div>
        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <p><span className="text-gray-500">Cliente:</span> <strong>{client.fullName}</strong></p>
          <p><span className="text-gray-500">CPF:</span> <strong>{client.cpf}</strong></p>
          <p><span className="text-gray-500">Nascimento:</span> <strong>{client.birthDate.split('-').reverse().join('/')}</strong></p>
          <p><span className="text-gray-500">Estado:</span> <strong>{client.state}</strong></p>
          <p><span className="text-gray-500">Estado civil:</span> <strong>{client.maritalStatus || 'Não informado'}</strong></p>
          <p><span className="text-gray-500">Renda mensal:</span> <strong>{formatCurrency(client.monthlyIncome)}</strong></p>
          {client.spouse && <><p><span className="text-gray-500">Cônjuge:</span> <strong>{client.spouse.fullName}</strong></p><p><span className="text-gray-500">CPF do cônjuge:</span> <strong>{client.spouse.cpf}</strong></p></>}
        </div>
        <div className="mt-6 rounded-xl border border-gray-200 p-5 text-sm leading-relaxed text-gray-700">
          <p><strong>1. Identificação e finalidade.</strong> Este termo registra os dados fornecidos pelo interessado e as condições estimadas apresentadas na simulação realizada nesta data. Ele serve exclusivamente como proposta preliminar para avaliação, não substituindo contrato, cédula de crédito, autorização de débito ou qualquer instrumento jurídico definitivo.</p>
          <p className="mt-3"><strong>2. Dados cadastrais informados.</strong> O interessado declara que as informações abaixo foram preenchidas por ele e deverão ser conferidas antes de qualquer contratação. A instituição responsável poderá solicitar documentos complementares, consultar bases permitidas e corrigir condições após a análise cadastral, de crédito e de capacidade de pagamento.</p>
          <p className="mt-3"><strong>3. Condições econômicas estimadas.</strong> Os valores descritos neste termo são calculados com base nos parâmetros selecionados durante a simulação. Taxas, encargos, disponibilidade, prazo e aprovação definitiva dependem da instituição responsável, de suas políticas vigentes e da assinatura do instrumento contratual aplicável.</p>
          <p className="mt-3"><strong>4. Ciência do interessado.</strong> Ao prosseguir, o interessado declara estar ciente de que esta página não representa garantia de liberação de crédito nem obrigação de contratação. A efetivação somente ocorrerá após validação documental, aceite expresso, formalização e cumprimento das condições legais e comerciais aplicáveis.</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#0D4E33]/5 p-4"><p className="text-xs text-gray-500">Valor da carta</p><p className="mt-1 text-xl font-black text-[#0D4E33]">{formatCurrency(creditResult.nominalValue)}</p></div>
          <div className="rounded-xl bg-[#0D4E33]/5 p-4"><p className="text-xs text-gray-500">Entrada ({(creditResult.entryPercentage * 100).toFixed(2).replace('.', ',')}%)</p><p className="mt-1 text-xl font-black text-[#0D4E33]">{formatCurrency(creditResult.entryValue)}</p></div>
          <div className="rounded-xl bg-[#0D4E33]/5 p-4"><p className="text-xs text-gray-500">Parcela estimada</p><p className="mt-1 text-xl font-black text-[#0D4E33]">{formatCurrency(creditResult.calculatedInstallment)} / mês</p></div>
          <div className="rounded-xl bg-[#0D4E33]/5 p-4"><p className="text-xs text-gray-500">Prazo</p><p className="mt-1 text-xl font-black text-[#0D4E33]">{creditResult.termMonths} parcelas</p><p className="text-xs text-gray-500">{formatMonthsToYears(creditResult.termMonths)}</p></div>
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"><ShieldCheck className="mt-0.5 size-5 shrink-0" /><p>Este documento registra o resultado da simulação e da análise preliminar. A contratação depende da validação cadastral e documental.</p></div>
      </section>
      <div className="no-print mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => window.print()} className="btn-secondary flex items-center gap-2"><Printer className="size-4" /> Imprimir aprovação</button>
        <button type="button" onClick={onNewSimulation} className="btn-primary flex">Iniciar nova simulação</button>
      </div>
    </main>
  );
}
