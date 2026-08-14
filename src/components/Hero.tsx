import { ArrowRight, Sparkles, ArrowDown } from 'lucide-react';
import { useHeroContent } from '../hooks/useContent';

interface HeroProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const content = useHeroContent();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 overflow-hidden bg-gradient-to-b from-ink-50/40 via-white to-white pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-[28rem] h-[28rem] bg-brand-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-5 w-[32rem] h-[32rem] bg-accent-200/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2.5s' }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      </div>

      <div className="relative section-container w-full">
        <div className="text-center space-y-7 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-ink-200 rounded-full text-sm font-medium text-ink-600 shadow-soft animate-slide-up">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-100">
              <Sparkles className="w-3 h-3 text-brand-600" />
            </span>
            <span>{content.subtext.split('—')[0].trim()}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-ink-900 leading-[1.05] tracking-tight animate-slide-up" style={{ animationDelay: '0.08s' }}>
            <span className="block mb-2">Designing Systems.</span>
            <span className="block text-gradient-brand">
              Shipping Experiences.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-ink-500 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.16s' }}>
            {content.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 animate-slide-up" style={{ animationDelay: '0.24s' }}>
            {content.ctas.map((cta, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onNavigate(cta.action)}
                className={`group inline-flex items-center px-7 py-3.5 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  cta.variant === 'primary'
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-soft hover:shadow-glow hover:-translate-y-0.5 focus:ring-brand-500'
                    : cta.variant === 'secondary'
                    ? 'bg-white text-ink-900 border-2 border-ink-200 hover:border-ink-300 hover:bg-ink-50 focus:ring-ink-300'
                    : 'text-ink-600 hover:text-brand-600 focus:ring-brand-200'
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
                className="group relative p-5 sm:p-6 bg-white/80 backdrop-blur-sm border border-ink-100 rounded-2xl hover:border-ink-200 hover:shadow-card transition-all duration-500"
              >
                <div className="text-3xl sm:text-4xl font-bold text-ink-900 mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-ink-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="pt-14 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-xs text-ink-400 mb-5 font-medium uppercase tracking-wider">{content.trustBar.title}</p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10">
              {content.trustBar.clients.map((client, idx) => (
                <div
                  key={idx}
                  className="text-base sm:text-lg font-semibold text-ink-300 hover:text-ink-500 transition-colors duration-300"
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
          <div className="w-5 h-9 border-2 border-ink-200 rounded-full p-1 flex justify-center">
            <div className="w-1 h-2 bg-ink-300 rounded-full animate-pulse" />
          </div>
          <ArrowDown className="w-3 h-3 text-ink-300" />
        </div>
      </div>
    </section>
  );
}
