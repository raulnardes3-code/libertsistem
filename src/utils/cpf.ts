/**
 * Validação de CPF com algoritmo oficial dos dígitos verificadores.
 * Não registra dados pessoais em logs.
 */

/** Remove caracteres não numéricos do CPF */
export function cleanCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

/** Aplica máscara de CPF: 000.000.000-00 */
export function maskCpf(value: string): string {
  const digits = cleanCpf(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/** Mascara parcialmente o CPF para exibição: ***.123.456-** */
export function partialMaskCpf(cpf: string): string {
  const digits = cleanCpf(cpf);
  if (digits.length !== 11) return '***.***.***-**';
  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
}

/** Valida CPF com o algoritmo oficial dos dígitos verificadores */
export function validateCpf(cpf: string): boolean {
  const digits = cleanCpf(cpf);
  
  if (digits.length !== 11) return false;
  
  // Rejeitar sequências repetidas (000.000.000-00, 111.111.111-11, etc.)
  if (/^(\d)\1{10}$/.test(digits)) return false;
  
  // Validar primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  
  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;
  
  return true;
}
