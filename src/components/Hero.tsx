import { ArrowRight, Sparkles, ArrowDown } from 'lucide-react';
import { useHeroContent } from '../hooks/useContent';

interface HeroProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const content = useHeroContent();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 overflow-hidden bg-ink-950 pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-brand-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[36rem] h-[36rem] bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2.5s' }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute inset-0 bg-noise" />
      </div>

      <div className="relative section-container w-full">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-dark rounded-full text-sm font-medium text-ink-300 animate-slide-up">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-500/20">
              <Sparkles className="w-3 h-3 text-brand-400" />
            </span>
            <span>{content.subtext.split('—')[0].trim()}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-white leading-[1.05] tracking-tight animate-slide-up" style={{ animationDelay: '0.08s' }}>
            <span className="block mb-2">Designing Systems.</span>
            <span className="block gradient-text">
              Shipping Experiences.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-ink-400 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.16s' }}>
            {content.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 animate-slide-up" style={{ animationDelay: '0.24s' }}>
            {content.ctas.map((cta, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onNavigate(cta.action)}
                className={`group inline-flex items-center px-7 py-3.5 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-950 ${
                  cta.variant === 'primary'
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-soft hover:shadow-glow hover:-translate-y-0.5 focus:ring-brand-500'
                    : cta.variant === 'secondary'
                    ? 'bg-white/5 text-white border-2 border-white/10 hover:border-white/20 hover:bg-white/10 focus:ring-white/20'
                    : 'text-ink-400 hover:text-white focus:ring-white/10'
                }`}
              >
                {cta.label}
                {cta.variant === 'primary' && (
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.32s' }}>
            {content.stats.map((stat, idx) => (
              <div
                key={idx}
                className="group relative p-5 sm:p-6 glass-dark rounded-2xl hover:border-white/20 transition-all duration-500"
              >
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-ink-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="pt-14 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-xs text-ink-600 mb-5 font-medium uppercase tracking-wider">{content.trustBar.title}</p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10">
              {content.trustBar.clients.map((client, idx) => (
                <div
                  key={idx}
                  className="text-base sm:text-lg font-semibold text-ink-600 hover:text-ink-400 transition-colors duration-300"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-9 border-2 border-ink-700 rounded-full p-1 flex justify-center">
            <div className="w-1 h-2 bg-ink-600 rounded-full animate-pulse" />
          </div>
          <ArrowDown className="w-3 h-3 text-ink-600" />
        </div>
      </div>
    </section>
  );
}
