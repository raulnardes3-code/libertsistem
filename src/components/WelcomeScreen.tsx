import { ArrowRight, TrendingUp, ShieldCheck, Calculator } from 'lucide-react';
import logoLibertClean from '../assets/logo-libert-clean.png';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-between py-8 px-4 sm:px-6 bg-gradient-to-br from-[#06281A] via-[#0D4E33] to-[#051C12]">
      <div className="max-w-4xl mx-auto w-full my-auto">
        {/* Main Hero Card with seamless branding */}
        <div className="relative bg-gradient-to-br from-[#06281A] via-[#0D4E33] to-[#051C12] text-white rounded-3xl p-8 sm:p-16 shadow-2xl border border-[#C5A15A]/30 overflow-hidden text-center">
          {/* Ambient Gold Radial Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C5A15A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-10 w-72 h-72 bg-[#1D513B]/40 rounded-full blur-2xl pointer-events-none" />

          {/* Native Logo Lockup */}
          <div className="relative z-10 mb-8 inline-flex flex-col items-center">
            <img
              src={logoLibertClean}
              alt="Libert Investimentos"
              className="h-28 sm:h-36 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(197,161,90,0.35)]"
            />
            <div className="mt-2 text-xs font-semibold tracking-widest text-[#C5A15A] uppercase border-t border-[#C5A15A]/40 pt-2 px-6">
              Investimentos & Soluções Financeiras
            </div>
            <div className="mt-7 grid grid-cols-3 sm:grid-cols-6 items-center justify-items-center gap-3 sm:gap-5 w-full max-w-3xl px-2">
              {[
                ['Santander', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-10-17%20at%2020.50.32-sIlhe6IryD3JK987jKO8A34AAyOYbw.jpeg'],
                ['Caixa', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-10-17%20at%2020.50.33%20%282%29-B3X8Eojtpc5vDdQ99vVctVVNvKUIdu.jpeg'],
                ['Sicredi', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-10-17%20at%2020.50.33%20%281%29-NcpwGNAhK0XQPaRZrMYb125Lnn4xqW.jpeg'],
                ['Inter', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-10-17%20at%2020.50.32%20%284%29-yyj2Zp9rPXQgaNBc6SN72ZHOMqeb3Y.jpeg'],
                ['Banco do Brasil', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-10-17%20at%2020.50.32%20%283%29-ySlfobYcj5yiNqj04SXf95x0MPksT1.jpeg'],
                ['Itaú', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-10-17%20at%2020.50.32%20%282%29-eJAlsaFRSq7zqCjEGzwxzGCdiySLWX.jpeg'],
              ].map(([name, src]) => (
                <div key={name} className="h-14 sm:h-16 w-full rounded-xl bg-white/95 p-2 flex items-center justify-center shadow-lg">
                  <img src={src} alt={`Logo ${name}`} className="block h-full w-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          <h1 className="relative z-10 text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Planeje sua próxima conquista.
          </h1>
          <p className="relative z-10 text-base sm:text-lg text-emerald-100/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Simule possibilidades de crédito e visualize as condições financeiras de forma clara e personalizada em seus atendimentos presenciais.
          </p>

          <div className="relative z-10 flex justify-center">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#C5A15A] via-[#D4AF37] to-[#C5A15A] text-[#123B2A] font-bold text-lg rounded-xl shadow-[0_4px_20px_rgba(197,161,90,0.4)] hover:shadow-[0_6px_25px_rgba(197,161,90,0.55)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 cursor-pointer"
            >
              <span>Começar simulação</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Feature Highlights beneath */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/15 shadow-xs backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#0D4E33]/10 flex items-center justify-center flex-shrink-0">
              <Calculator className="w-5 h-5 text-[#0D4E33]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Simulação Personalizada</p>
              <p className="text-[11px] text-emerald-100/75">Prazos e parcelas sob medida</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/15 shadow-xs backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#0D4E33]/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-[#0D4E33]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Comparação Financeira</p>
              <p className="text-[11px] text-emerald-100/75">Carta vs Financiamento Price</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/15 shadow-xs backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#0D4E33]/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#0D4E33]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Privacidade Garantida</p>
              <p className="text-[11px] text-emerald-100/75">Dados seguros em memória (LGPD)</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center pt-8 px-4 text-xs text-emerald-100/70 max-w-2xl mx-auto leading-relaxed">
        Ferramenta de apoio comercial para simulações preliminares. Condições sujeitas à análise e confirmação da instituição responsável.
      </footer>
    </div>
  );
}
