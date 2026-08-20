import { ArrowLeft, ChevronLeft, ChevronRight, Target, Lightbulb, Palette, TrendingUp, BookOpen, ExternalLink } from 'lucide-react';
import { useAllCaseStudies } from '../hooks/useProjects';
import { useImageUrl } from '../hooks/useImages';

interface CaseStudyDetailProps {
  caseStudySlug: string;
  onNavigate: (page: string, slug?: string) => void;
}

export default function CaseStudyDetail({ caseStudySlug, onNavigate }: CaseStudyDetailProps) {
  const allCaseStudies = useAllCaseStudies();
  const currentIndex = allCaseStudies.findIndex(cs => cs.slug === caseStudySlug);
  const caseStudy = allCaseStudies[currentIndex];

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-ink-950">
        <div className="text-center">
          <p className="text-lg text-ink-600 dark:text-ink-400 mb-4">Case study not found</p>
          <button
            onClick={() => onNavigate('case-studies')}
            className="text-ink-900 dark:text-white underline"
          >
            Back to Case Studies
          </button>
        </div>
      </div>
    );
  }

  const heroImageUrl = useImageUrl(caseStudy.hero.image);

  const handlePrevCaseStudy = () => {
    const prevIndex = currentIndex === 0 ? allCaseStudies.length - 1 : currentIndex - 1;
    onNavigate('case-study-detail', allCaseStudies[prevIndex].slug);
  };

  const handleNextCaseStudy = () => {
    const nextIndex = currentIndex === allCaseStudies.length - 1 ? 0 : currentIndex + 1;
    onNavigate('case-study-detail', allCaseStudies[nextIndex].slug);
  };

  return (
    <article className="min-h-screen bg-gradient-to-b from-white via-ink-50/30 to-white dark:from-ink-950 dark:via-ink-900/30 dark:to-ink-950 transition-colors duration-500">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600">
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt={caseStudy.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-700/90 via-brand-700/40 to-brand-600/20" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-white pt-24 pb-12">
          <button
            type="button"
            onClick={() => onNavigate('case-studies')}
            className="inline-flex items-center text-white/80 hover:text-white mb-5 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-3 py-1.5 text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Case Studies
          </button>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 animate-slide-up tracking-tight">
            {caseStudy.title}
          </h1>
          <p className="text-sm sm:text-base text-white/85 mb-6 max-w-2xl mx-auto animate-slide-up leading-[1.7]" style={{ animationDelay: '0.1s' }}>
            {caseStudy.hero.tagline}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {caseStudy.hero.metrics.map((metric, idx) => (
              <div key={idx} className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5">
                <div className="text-xl font-bold mb-0.5">{metric.value}</div>
                <div className="text-xs text-white/75">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 -mt-8 relative z-10">
          <div className="p-4 bg-white dark:bg-ink-900 rounded-xl shadow-card border border-ink-100 dark:border-ink-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
            <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide mb-1">Role</p>
            <p className="text-sm text-ink-900 dark:text-ink-100 font-medium">{caseStudy.metadata.role.join(', ')}</p>
          </div>
          <div className="p-4 bg-white dark:bg-ink-900 rounded-xl shadow-card border border-ink-100 dark:border-ink-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
            <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide mb-1">Timeline</p>
            <p className="text-sm text-ink-900 dark:text-ink-100 font-medium">{caseStudy.metadata.timeline}</p>
          </div>
          <div className="p-4 bg-white dark:bg-ink-900 rounded-xl shadow-card border border-ink-100 dark:border-ink-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
            <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide mb-1">Platform</p>
            <p className="text-sm text-ink-900 dark:text-ink-100 font-medium">{caseStudy.metadata.platform.join(', ')}</p>
          </div>
          <div className="p-4 bg-white dark:bg-ink-900 rounded-xl shadow-card border border-ink-100 dark:border-ink-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
            <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide mb-1">Tools</p>
            <p className="text-sm text-ink-900 dark:text-ink-100 font-medium">{caseStudy.metadata.tools.slice(0, 3).join(', ')}</p>
          </div>
        </div>

        <div className="space-y-12 mt-10">
          <section className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-br from-danger-500 to-danger-600 rounded-lg">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-danger-600 dark:text-danger-400 uppercase tracking-wide">01 / Problem</span>
                <h2 className="text-lg font-bold text-ink-900 dark:text-white">The Challenge</h2>
              </div>
            </div>
            <div className="pl-11">
              <p className="text-sm text-ink-700 dark:text-ink-300 leading-[1.7] whitespace-pre-line">
                {caseStudy.sections.problem}
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-warning-600 dark:text-warning-400 uppercase tracking-wide">02 / Research</span>
                <h2 className="text-lg font-bold text-ink-900 dark:text-white">Discovery & Insights</h2>
              </div>
            </div>
            <div className="pl-11 space-y-5">
              <div>
                <h3 className="text-base font-bold text-ink-900 dark:text-white mb-3">Research Methods</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {caseStudy.sections.research.methods.map((method, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3.5 bg-warning-50/60 dark:bg-warning-950/40 rounded-xl border border-warning-100 dark:border-warning-900/50">
                      <div className="w-5 h-5 rounded-full bg-warning-200 dark:bg-warning-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-warning-700 dark:text-warning-400">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-ink-700 dark:text-ink-300">{method}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-900 dark:text-white mb-3">Key Insights</h3>
                <div className="space-y-2.5">
                  {caseStudy.sections.research.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-ink-900 rounded-xl border-l-4 border-warning-500 shadow-soft transition-colors duration-500">
                      <Lightbulb className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-ink-700 dark:text-ink-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide">03 / Solution</span>
                <h2 className="text-lg font-bold text-ink-900 dark:text-white">Design Approach</h2>
              </div>
            </div>
            <div className="pl-11 space-y-4">
              <p className="text-sm text-ink-700 dark:text-ink-300 leading-[1.7]">{caseStudy.sections.solution.approach}</p>
              <div>
                <h3 className="text-base font-bold text-ink-900 dark:text-white mb-3">Key Features</h3>
                <div className="grid gap-2.5">
                  {caseStudy.sections.solution.keyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 bg-brand-50/60 dark:bg-brand-950/40 rounded-xl border border-brand-100 dark:border-brand-900/50">
                      <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0"></div>
                      <p className="text-sm font-medium text-ink-900 dark:text-ink-100">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-br from-success-500 to-success-600 rounded-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-success-600 dark:text-success-400 uppercase tracking-wide">04 / Impact</span>
                <h2 className="text-lg font-bold text-ink-900 dark:text-white">Results & Outcomes</h2>
              </div>
            </div>
            <div className="pl-11 space-y-5">
              <div className="grid md:grid-cols-3 gap-3">
                {caseStudy.sections.results.metrics.map((metric, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-success-50 to-success-100/60 dark:from-success-950/40 dark:to-success-900/20 rounded-xl border border-success-200 dark:border-success-900/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft">
                    <div className="text-xl font-bold text-success-700 dark:text-success-400 mb-0.5">{metric.value}</div>
                    <div className="text-sm font-medium text-ink-900 dark:text-ink-100 mb-0.5">{metric.label}</div>
                    {metric.context && (
                      <div className="text-xs text-ink-500 dark:text-ink-400">{metric.context}</div>
                    )}
                  </div>
                ))}
              </div>

              {caseStudy.sections.results.testimonial && (
                <div className="relative p-5 bg-white dark:bg-ink-900 rounded-xl border border-ink-100 dark:border-ink-800 shadow-card transition-colors duration-500">
                  <div className="text-4xl text-brand-200 dark:text-brand-900 font-serif absolute top-2 left-4 leading-none">"</div>
                  <blockquote className="relative z-10 pl-7">
                    <p className="text-sm text-ink-700 dark:text-ink-300 italic mb-3 leading-[1.7]">
                      {caseStudy.sections.results.testimonial.quote}
                    </p>
                    <footer>
                      <p className="text-sm font-bold text-ink-900 dark:text-white">
                        {caseStudy.sections.results.testimonial.author}
                      </p>
                      <p className="text-sm text-ink-500 dark:text-ink-400">
                        {caseStudy.sections.results.testimonial.role}
                        {caseStudy.sections.results.testimonial.company && ` • ${caseStudy.sections.results.testimonial.company}`}
                      </p>
                    </footer>
                  </blockquote>
                </div>
              )}
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-accent-600 dark:text-accent-400 uppercase tracking-wide">05 / Learnings</span>
                <h2 className="text-lg font-bold text-ink-900 dark:text-white">Key Takeaways</h2>
              </div>
            </div>
            <div className="pl-11">
              <div className="space-y-3">
                {caseStudy.sections.learnings.map((learning, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-accent-50/60 dark:bg-accent-950/40 rounded-xl border border-accent-100 dark:border-accent-900/50">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-600 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-ink-700 dark:text-ink-300 leading-[1.7]">{learning}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between py-8 mt-8 border-t border-ink-100 dark:border-ink-800">
          <button
            type="button"
            onClick={handlePrevCaseStudy}
            className="group flex items-center gap-2.5 px-4 py-3 bg-ink-50 dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 cursor-pointer border border-ink-200 dark:border-ink-700 hover:-translate-y-0.5"
          >
            <ChevronLeft className="w-4 h-4 text-ink-600 dark:text-ink-400 group-hover:text-ink-900 dark:group-hover:text-white" />
            <div className="text-left">
              <div className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide">Previous</div>
              <div className="text-sm font-bold text-ink-900 dark:text-white">
                {allCaseStudies[currentIndex === 0 ? allCaseStudies.length - 1 : currentIndex - 1]?.title}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleNextCaseStudy}
            className="group flex items-center gap-2.5 px-4 py-3 bg-ink-50 dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 cursor-pointer border border-ink-200 dark:border-ink-700 hover:-translate-y-0.5"
          >
            <div className="text-right">
              <div className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide">Next</div>
              <div className="text-sm font-bold text-ink-900 dark:text-white">
                {allCaseStudies[currentIndex === allCaseStudies.length - 1 ? 0 : currentIndex + 1]?.title}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-600 dark:text-ink-400 group-hover:text-ink-900 dark:group-hover:text-white" />
          </button>
        </div>

        <div className="mt-8 p-6 sm:p-7 bg-gradient-to-br from-brand-600 to-accent-500 rounded-2xl text-white text-center">
          <h3 className="text-lg font-bold mb-2">Want results like this?</h3>
          <p className="text-sm text-white/90 mb-4 max-w-xl mx-auto leading-[1.7]">
            Let's discuss how I can help transform your product with strategic design and technical expertise.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center px-5 py-2.5 text-sm bg-white text-brand-600 font-semibold rounded-xl hover:shadow-card transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-600"
          >
            Get in Touch
            <ExternalLink className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
