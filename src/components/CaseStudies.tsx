import { Sparkles, ArrowRight } from 'lucide-react';
import { useAllCaseStudies } from '../hooks/useProjects';
import { useImageUrl } from '../hooks/useImages';

interface CaseStudiesProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function CaseStudies({ onNavigate }: CaseStudiesProps) {
  const caseStudies = useAllCaseStudies();

  return (
    <section className="min-h-screen pt-28 sm:pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-ink-50/40 via-white to-white dark:from-ink-900/30 dark:via-ink-950 dark:to-ink-950 transition-colors duration-500">
      <div className="section-container">
        <div className="max-w-2xl mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-full text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            In-Depth Stories
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-white mb-4 tracking-tight">
            Case Studies
          </h1>
          <p className="text-base text-ink-500 dark:text-ink-400 leading-relaxed">
            Deep dives into complex product challenges and the strategic solutions that delivered measurable impact
          </p>
        </div>

        {caseStudies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-ink-600 dark:text-ink-400">No case studies available yet.</p>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {caseStudies.map((caseStudy, index) => {
              const heroImageUrl = useImageUrl(caseStudy.hero.image);
              const isReversed = index % 2 === 1;

              return (
                <article
                  key={caseStudy.slug}
                  onClick={() => onNavigate('case-study-detail', caseStudy.slug)}
                  className="group cursor-pointer"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className={`grid lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:[direction:rtl]' : ''}`}>
                    <div className="lg:col-span-5 lg:[direction:ltr]">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-100 dark:bg-ink-800 shadow-soft">
                        <img
                          src={heroImageUrl}
                          alt={caseStudy.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-ink-900/90 backdrop-blur-sm text-ink-900 dark:text-white shadow-soft">
                          {caseStudy.metadata.industry}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7 lg:[direction:ltr] space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="w-8 h-px bg-ink-300 dark:bg-ink-700" />
                          <span className="text-ink-500 dark:text-ink-400 font-medium uppercase tracking-wider text-xs">
                            Case Study
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ink-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight">
                          {caseStudy.title}
                        </h2>
                        <p className="text-sm sm:text-base text-ink-500 dark:text-ink-400 leading-relaxed max-w-xl">
                          {caseStudy.hero.tagline}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        {caseStudy.hero.metrics.slice(0, 3).map((metric, idx) => (
                          <div key={idx} className="px-3.5 py-2 bg-ink-50 dark:bg-ink-900 rounded-xl border border-ink-100 dark:border-ink-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft">
                            <div className="text-base font-bold text-ink-900 dark:text-white">{metric.value}</div>
                            <div className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{metric.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {caseStudy.metadata.tools.slice(0, 4).map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-ink-50 dark:bg-ink-800 text-ink-500 dark:text-ink-400 text-xs font-medium rounded-lg"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-3 transition-all">
                          Read case study
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
