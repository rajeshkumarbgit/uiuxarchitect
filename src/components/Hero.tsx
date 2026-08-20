import { ArrowRight, Sparkles, ArrowDown } from 'lucide-react';
import { useHeroContent } from '../hooks/useContent';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const content = useHeroContent();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`relative min-h-screen flex items-center px-6 sm:px-8 lg:px-12 overflow-hidden pt-20 transition-colors duration-500 ${isDark ? 'bg-ink-950' : 'bg-ink-50'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full blur-3xl animate-float ${isDark ? 'bg-brand-500/10' : 'bg-brand-500/8'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[36rem] h-[36rem] rounded-full blur-3xl animate-float ${isDark ? 'bg-accent-500/10' : 'bg-accent-500/8'}`} style={{ animationDelay: '2.5s' }} />
        <div className={`absolute inset-0 bg-grid-pattern ${isDark ? 'opacity-[0.03]' : 'opacity-[0.04]'}`} />
        <div className="absolute inset-0 bg-noise" />
      </div>

      <div className="relative section-container w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium animate-slide-up ${isDark ? 'glass-dark text-ink-300' : 'bg-white/80 backdrop-blur-xl border border-ink-200 text-ink-600 shadow-soft'}`}>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-500/20">
                <Sparkles className="w-3 h-3 text-brand-500" />
              </span>
              <span>{content.subtext.split('—')[0].trim()}</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.12] tracking-tight animate-slide-up ${isDark ? 'text-white' : 'text-ink-900'}`} style={{ animationDelay: '0.08s' }}>
              <span className="block mb-2">Designing Systems.</span>
              <span className="block gradient-text">
                Shipping Experiences.
              </span>
            </h1>

            <p className={`text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-[1.7] animate-slide-up ${isDark ? 'text-ink-400' : 'text-ink-500'}`} style={{ animationDelay: '0.16s' }}>
              {content.description}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 animate-slide-up" style={{ animationDelay: '0.24s' }}>
              {content.ctas.map((cta, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onNavigate(cta.action)}
                  className={`group inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-ink-950' : 'focus:ring-offset-ink-50'} ${
                    cta.variant === 'primary'
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-soft hover:shadow-glow hover:-translate-y-0.5 focus:ring-brand-500'
                      : cta.variant === 'secondary'
                      ? isDark
                        ? 'bg-white/5 text-white border-2 border-white/10 hover:border-white/20 hover:bg-white/10 focus:ring-white/20'
                        : 'bg-white text-ink-900 border-2 border-ink-200 hover:border-ink-300 hover:bg-ink-50 focus:ring-ink-300'
                      : isDark
                      ? 'text-ink-400 hover:text-white focus:ring-white/10'
                      : 'text-ink-500 hover:text-ink-900 focus:ring-ink-300'
                  }`}
                >
                  {cta.label}
                  {cta.variant === 'primary' && (
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-10 max-w-4xl animate-slide-up" style={{ animationDelay: '0.32s' }}>
              {content.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-500 hover:-translate-y-0.5 ${isDark ? 'glass-dark hover:border-white/20' : 'bg-white/80 backdrop-blur-xl border border-ink-200 shadow-soft hover:shadow-card-hover hover:border-ink-300'}`}
                >
                  <div className={`text-2xl sm:text-3xl font-bold mb-1 tracking-tight ${isDark ? 'text-white' : 'text-ink-900'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs sm:text-sm font-medium ${isDark ? 'text-ink-500' : 'text-ink-500'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none rounded-3xl overflow-hidden shadow-elevated">
              <img
                src="https://images.pexels.com/photos/6614755/pexels-photo-6614755.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Rajesh Kumar — UI/UX Architect & Senior Product Designer at work"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-ink-950/60 via-transparent to-transparent' : 'bg-gradient-to-t from-ink-950/40 via-transparent to-transparent'}`} />
              <div className={`absolute bottom-6 left-6 right-6 rounded-2xl p-4 ${isDark ? 'glass-dark' : 'bg-white/90 backdrop-blur-xl border border-white/40 shadow-card'}`}>
                <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-ink-900'}`}>Rajesh Kumar</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-ink-400' : 'text-ink-500'}`}>UI/UX Architect · Senior Product Designer</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p className={`text-xs mb-5 font-medium uppercase tracking-wider ${isDark ? 'text-ink-600' : 'text-ink-400'}`}>{content.trustBar.title}</p>
          <div className="flex flex-wrap items-center gap-8 sm:gap-10">
            {content.trustBar.clients.map((client, idx) => (
              <div
                key={idx}
                className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${isDark ? 'text-ink-600 hover:text-ink-400' : 'text-ink-400 hover:text-ink-700'}`}
              >
                {client}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <div className="flex flex-col items-center gap-2">
          <div className={`w-5 h-9 border-2 rounded-full p-1 flex justify-center ${isDark ? 'border-ink-700' : 'border-ink-300'}`}>
            <div className={`w-1 h-2 rounded-full animate-pulse ${isDark ? 'bg-ink-600' : 'bg-ink-400'}`} />
          </div>
          <ArrowDown className={`w-3 h-3 ${isDark ? 'text-ink-600' : 'text-ink-400'}`} />
        </div>
      </div>
    </section>
  );
}
