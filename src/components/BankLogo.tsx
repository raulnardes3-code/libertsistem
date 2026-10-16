interface BankLogoProps {
  name: string;
}

export function BankLogo({ name }: BankLogoProps) {
  switch (name) {
    case 'Santander':
      return (
        <div className="flex items-center gap-1.5" title="Santander">
          {/* Santander Flame Icon */}
          <svg viewBox="0 0 40 40" className="w-7 h-7 flex-shrink-0" fill="none">
            <rect width="40" height="40" rx="8" fill="#EC0000" />
            <path d="M20 9C17 14 13 17 13 22C13 26 16 29 20 29C24 29 27 26 27 22C27 17 23 14 20 9Z" fill="white" />
            <path d="M17 19C15 22 15 25 17 27C16 25 16 23 17 19Z" fill="#EC0000" opacity="0.3" />
            <path d="M23 19C25 22 25 25 23 27C24 25 24 23 23 19Z" fill="#EC0000" opacity="0.3" />
          </svg>
          <span className="font-bold text-sm tracking-tight text-[#EC0000] uppercase font-sans">Santander</span>
        </div>
      );

    case 'Itaú':
      return (
        <div className="flex items-center" title="Itaú">
          <div className="bg-[#EC7000] text-white px-2.5 py-1 rounded-lg flex items-center shadow-xs">
            <span className="font-black text-base italic tracking-tighter text-[#003399] font-sans">itau</span>
          </div>
        </div>
      );

    case 'Caixa Econômica Federal':
    case 'Caixa':
      return (
        <div className="flex items-center gap-1" title="Caixa Econômica Federal">
          <svg viewBox="0 0 100 28" className="h-6 w-auto" fill="none">
            {/* Blue background & stylized CAIXA X */}
            <text x="0" y="22" fill="#005CA9" fontFamily="sans-serif" fontWeight="900" fontSize="22" letterSpacing="0.5">CAI</text>
            <path d="M46 5 L55 24" stroke="#F28500" strokeWidth="6" strokeLinecap="round" />
            <path d="M55 5 L46 24" stroke="#005CA9" strokeWidth="6" strokeLinecap="round" />
            <text x="59" y="22" fill="#005CA9" fontFamily="sans-serif" fontWeight="900" fontSize="22" letterSpacing="0.5">A</text>
          </svg>
        </div>
      );

    case 'Banco do Brasil':
      return (
        <div className="flex items-center gap-1.5" title="Banco do Brasil">
          <div className="bg-[#FFEF38] px-2 py-0.5 rounded border border-[#003882]/20 shadow-xs flex items-center">
            <svg viewBox="0 0 32 32" className="w-5 h-5 mr-1" fill="#003882">
              <path d="M6 10 L16 4 L26 10 L26 22 L16 28 L6 22 Z" fill="none" stroke="#003882" strokeWidth="3" />
              <path d="M12 13 L20 19 M20 13 L12 19" stroke="#003882" strokeWidth="2.5" />
            </svg>
            <span className="font-black text-xs text-[#003882] tracking-tighter uppercase font-sans">BANCO DO BRASIL</span>
          </div>
        </div>
      );

    case 'Nubank':
      return (
        <div className="flex items-center gap-1.5" title="Nubank">
          <div className="bg-[#820AD1] text-white px-2.5 py-1 rounded-xl shadow-xs flex items-center">
            <span className="font-extrabold text-sm tracking-tight font-sans">nu</span>
          </div>
          <span className="font-bold text-sm text-[#820AD1] tracking-tight font-sans">nubank</span>
        </div>
      );

    case 'Bradesco':
      return (
        <div className="flex items-center gap-1.5" title="Bradesco">
          <svg viewBox="0 0 32 32" className="w-6 h-6 flex-shrink-0" fill="none">
            <circle cx="16" cy="16" r="15" fill="#CC092F" />
            <path d="M10 23 V15 C10 11.5 13 9 16 9 C19 9 22 11.5 22 15 V23" stroke="white" strokeWidth="2.5" fill="none" />
            <circle cx="16" cy="17" r="3" fill="white" />
          </svg>
          <span className="font-black text-sm text-[#CC092F] tracking-tighter font-sans lowercase text-base">bradesco</span>
        </div>
      );

    case 'Banco Inter':
    case 'Inter':
      return (
        <div className="flex items-center gap-1" title="Banco Inter">
          <div className="bg-[#FF7A00] text-white px-2.5 py-0.5 rounded-lg shadow-xs flex items-center">
            <span className="font-black text-sm tracking-tighter uppercase font-sans">inter</span>
          </div>
        </div>
      );

    default:
      return <span className="font-semibold text-xs text-text-secondary">{name}</span>;
  }
}
