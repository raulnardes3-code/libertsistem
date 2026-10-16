import { Shield } from 'lucide-react';
import logoLibertClean from '../assets/logo-libert-clean.png';

interface HeaderProps {
  showBadge?: boolean;
}

export function Header({ showBadge = true }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-[#062417] via-[#093A24] to-[#062417] text-white border-b border-[#C5A15A]/30 shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3.5">
            {/* Integrated brand emblem without any square boundary */}
            <div className="relative flex items-center justify-center py-1">
              <img
                src={logoLibertClean}
                alt="Libert Investimentos"
                className="h-14 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(197,161,90,0.25)]"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-serif">LIBERT</span>
                <span className="text-xl font-light tracking-widest text-[#C5A15A] uppercase text-xs sm:text-sm pl-1 border-l border-[#C5A15A]/40">
                  INVESTIMENTOS
                </span>
              </div>
              <span className="text-[11px] text-emerald-200/70 font-medium tracking-wider uppercase mt-0.5">
                Libert Simula
              </span>
            </div>
          </div>

          {showBadge && (
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-[#062417]/80 border border-[#C5A15A]/40 rounded-full text-xs text-[#C5A15A] font-semibold tracking-wide uppercase shadow-inner">
              <Shield className="w-3.5 h-3.5 text-[#C5A15A]" />
              <span>Ambiente Interno | Simulação de Crédito</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
