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
        <div className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            In-Depth Stories
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 dark:text-white mb-4 tracking-tight">
            Case Studies
          </h1>
          <p className="text-lg text-ink-500 dark:text-ink-400 max-w-2xl mx-auto leading-relaxed">
            Deep dives into complex product challenges and the strategic solutions that delivered measurable impact
          </p>
        </div>

        {caseStudies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-ink-600 dark:text-ink-400">No case studies available yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {caseStudies.map((caseStudy, index) => {
              const heroImageUrl = useImageUrl(caseStudy.hero.image);

              return (
                <article
                  key={caseStudy.slug}
                  onClick={() => onNavigate('case-study-detail', caseStudy.slug)}
                  className="group card-base card-hover cursor-pointer overflow-hidden"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-ink-100 dark:bg-ink-800">
                      <img
                        src={heroImageUrl}
                        alt={caseStudy.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-ink-900/90 backdrop-blur-sm text-ink-900 dark:text-white">
                        {caseStudy.metadata.industry}
                      </div>
                    </div>

                    <div className="p-8 sm:p-10 flex flex-col justify-center">
                      <div className="mb-5">
                        <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white mb-3 tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {caseStudy.title}
                        </h2>
                        <p className="text-base text-ink-600 dark:text-ink-300 leading-relaxed mb-6">
                          {caseStudy.hero.tagline}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {caseStudy.hero.metrics.map((metric, idx) => (
                          <div key={idx} className="p-3 bg-ink-50/60 dark:bg-ink-800/60 rounded-xl">
                            <div className="text-2xl font-bold text-ink-900 dark:text-white mb-0.5">{metric.value}</div>
                            <div className="text-xs text-ink-500 dark:text-ink-400">{metric.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {caseStudy.metadata.tools.slice(0, 5).map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-xs font-medium rounded-lg"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>

                      <div className="text-sm font-medium text-ink-500 dark:text-ink-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center gap-1.5">
                        Read case study
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
