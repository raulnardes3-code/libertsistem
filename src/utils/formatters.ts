/**
 * Formatadores para moeda brasileira, datas e valores numéricos.
 */

/** Formata número como moeda brasileira: R$ 1.234,56 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Formata percentual: 27,00% */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Formata data em formato brasileiro: 13/10/2026 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/** Formata data completa: 13 de outubro de 2026 */
export function formatDateFull(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Extrai valor numérico de uma string monetária.
 * Aceita formatos como: "1.234,56", "1234,56", "1234.56", "R$ 1.234,56"
 */
export function parseCurrencyInput(value: string): number {
  if (!value || value.trim() === '') return 0;
  
  // Remove R$, espaços e pontos de milhar
  let cleaned = value.replace(/R\$\s?/g, '').trim();
  
  // Detectar formato brasileiro (vírgula como decimal)
  // Se tem vírgula e ela está nas últimas 3 posições, é decimal
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  
  if (lastComma > lastDot) {
    // Formato brasileiro: 1.234,56
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma && lastComma !== -1) {
    // Formato americano ou ambíguo com ponto decimal: 1,234.56
    cleaned = cleaned.replace(/,/g, '');
  } else if (lastComma !== -1 && lastDot === -1) {
    // Só vírgula, provavelmente decimal brasileiro: 1234,56
    cleaned = cleaned.replace(',', '.');
  }
  // Se só tem ponto, tratar como decimal se está nas últimas 3 posições
  
  const result = parseFloat(cleaned);
  return isNaN(result) ? 0 : Math.round(result * 100) / 100;
}

/**
 * Formata input monetário em tempo real.
 * Mantém apenas dígitos e formata como moeda brasileira.
 */
export function formatCurrencyInput(value: string): string {
  // Remove tudo exceto dígitos
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  
  // Converter centavos para reais
  const numericValue = parseInt(digits, 10) / 100;
  
  // Formatar
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

/** Converte string formatada como input monetário para número */
export function currencyInputToNumber(formatted: string): number {
  if (!formatted) return 0;
  const digits = formatted.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

/** Converte número para string formatada para input monetário */
export function numberToCurrencyInput(value: number): string {
  if (value === 0) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Formata número de meses para exibição */
export function formatMonths(months: number): string {
  return `${months} ${months === 1 ? 'mês' : 'meses'}`;
}

/** Formata número de meses para anos e meses */
export function formatMonthsToYears(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) return formatMonths(remainingMonths);
  if (remainingMonths === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
}
