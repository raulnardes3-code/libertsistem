/**
 * Constantes financeiras centralizadas do sistema Libert Simula.
 * Estes valores são fixos e não editáveis na interface do usuário.
 */

/** Taxa administrativa aplicada sobre o valor nominal da carta de crédito */
export const ADMIN_FEE_RATE = 0.27;

/** Percentuais de entrada permitidos para a carta de crédito */
export const ALLOWED_ENTRY_PERCENTAGES = [0.08, 0.09, 0.10] as const;

/** Percentual de entrada padrão */
export const DEFAULT_ENTRY_PERCENTAGE = 0.08;

/** Prazo mínimo em meses para a carta de crédito */
export const MIN_TERM_MONTHS = 190;

/** Prazo máximo em meses para a carta de crédito */
export const MAX_TERM_MONTHS = 380;

/** Percentual de entrada do financiamento tradicional */
export const FINANCING_ENTRY_RATE = 0.25;

/** Taxa nominal anual de juros do financiamento tradicional */
export const FINANCING_ANNUAL_RATE = 0.1374;

/** Prazo fixo do financiamento tradicional em meses */
export const FINANCING_TERM_MONTHS = 420;

/** Percentual financiado no financiamento tradicional */
export const FINANCING_FUNDED_RATE = 0.75;
