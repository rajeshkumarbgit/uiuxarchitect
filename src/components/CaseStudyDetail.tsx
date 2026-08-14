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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-ink-600 mb-4">Case study not found</p>
          <button
            onClick={() => onNavigate('case-studies')}
            className="text-ink-900 underline"
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
    <article className="min-h-screen bg-gradient-to-b from-white via-ink-50/30 to-white">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600">
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt={caseStudy.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-700 via-brand-700/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-white pt-20 pb-20">
          <button
            type="button"
            onClick={() => onNavigate('case-studies')}
            className="inline-flex items-center text-white/80 hover:text-white mb-8 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-4 py-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case Studies
          </button>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 animate-slide-up tracking-tight">
            {caseStudy.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            {caseStudy.hero.tagline}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {caseStudy.hero.metrics.map((metric, idx) => (
              <div key={idx} className="p-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                <div className="text-xs text-white/80">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="w-5 h-9 border-2 border-white/40 rounded-full p-1 flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-3 mb-14 -mt-24 relative z-10">
          <div className="p-5 bg-white rounded-2xl shadow-card border border-ink-100">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Role</p>
            <p className="text-sm text-ink-900 font-medium">{caseStudy.metadata.role.join(', ')}</p>
          </div>
          <div className="p-5 bg-white rounded-2xl shadow-card border border-ink-100">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Timeline</p>
            <p className="text-sm text-ink-900 font-medium">{caseStudy.metadata.timeline}</p>
          </div>
          <div className="p-5 bg-white rounded-2xl shadow-card border border-ink-100">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Platform</p>
            <p className="text-sm text-ink-900 font-medium">{caseStudy.metadata.platform.join(', ')}</p>
          </div>
          <div className="p-5 bg-white rounded-2xl shadow-card border border-ink-100">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Tools</p>
            <p className="text-sm text-ink-900 font-medium">{caseStudy.metadata.tools.slice(0, 3).join(', ')}</p>
          </div>
        </div>

        <div className="space-y-20">
          <section className="relative">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-danger-500 to-danger-600 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-danger-600 uppercase tracking-wide">01 / Problem</span>
                <h2 className="text-2xl font-bold text-ink-900">The Challenge</h2>
              </div>
            </div>
            <div className="pl-14">
              <p className="text-base text-ink-700 leading-relaxed whitespace-pre-line">
                {caseStudy.sections.problem}
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-warning-600 uppercase tracking-wide">02 / Research</span>
                <h2 className="text-2xl font-bold text-ink-900">Discovery & Insights</h2>
              </div>
            </div>
            <div className="pl-14 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-ink-900 mb-3">Research Methods</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {caseStudy.sections.research.methods.map((method, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3.5 bg-warning-50/60 rounded-xl border border-warning-100">
                      <div className="w-5 h-5 rounded-full bg-warning-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-warning-700">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-ink-700">{method}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-900 mb-3">Key Insights</h3>
                <div className="space-y-2.5">
                  {caseStudy.sections.research.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border-l-4 border-warning-500 shadow-soft">
                      <Lightbulb className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-ink-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">03 / Solution</span>
                <h2 className="text-2xl font-bold text-ink-900">Design Approach</h2>
              </div>
            </div>
            <div className="pl-14 space-y-5">
              <p className="text-base text-ink-700 leading-relaxed">{caseStudy.sections.solution.approach}</p>
              <div>
                <h3 className="text-lg font-bold text-ink-900 mb-3">Key Features</h3>
                <div className="grid gap-2.5">
                  {caseStudy.sections.solution.keyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 bg-brand-50/60 rounded-xl border border-brand-100">
                      <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0"></div>
                      <p className="text-sm font-medium text-ink-900">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-success-500 to-success-600 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-success-600 uppercase tracking-wide">04 / Impact</span>
                <h2 className="text-2xl font-bold text-ink-900">Results & Outcomes</h2>
              </div>
            </div>
            <div className="pl-14 space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {caseStudy.sections.results.metrics.map((metric, idx) => (
                  <div key={idx} className="p-5 bg-gradient-to-br from-success-50 to-success-100/60 rounded-2xl border border-success-200">
                    <div className="text-3xl font-bold text-success-700 mb-1">{metric.value}</div>
                    <div className="text-sm font-medium text-ink-900 mb-0.5">{metric.label}</div>
                    {metric.context && (
                      <div className="text-xs text-ink-500">{metric.context}</div>
                    )}
                  </div>
                ))}
              </div>

              {caseStudy.sections.results.testimonial && (
                <div className="relative p-7 bg-white rounded-2xl border border-ink-100 shadow-card">
                  <div className="text-5xl text-brand-200 font-serif absolute top-3 left-5 leading-none">"</div>
                  <blockquote className="relative z-10 pl-8">
                    <p className="text-base text-ink-700 italic mb-4 leading-relaxed">
                      {caseStudy.sections.results.testimonial.quote}
                    </p>
                    <footer>
                      <p className="text-sm font-bold text-ink-900">
                        {caseStudy.sections.results.testimonial.author}
                      </p>
                      <p className="text-sm text-ink-500">
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
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-accent-600 uppercase tracking-wide">05 / Learnings</span>
                <h2 className="text-2xl font-bold text-ink-900">Key Takeaways</h2>
              </div>
            </div>
            <div className="pl-14">
              <div className="space-y-3">
                {caseStudy.sections.learnings.map((learning, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-accent-50/60 rounded-xl border border-accent-100">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-600 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-ink-700 leading-relaxed">{learning}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between py-10 mt-10 border-t border-ink-100">
          <button
            type="button"
            onClick={handlePrevCaseStudy}
            className="group flex items-center gap-3 px-5 py-3.5 bg-ink-50 hover:bg-ink-100 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ink-300 focus:ring-offset-2 cursor-pointer border border-ink-200"
          >
            <ChevronLeft className="w-5 h-5 text-ink-600 group-hover:text-ink-900" />
            <div className="text-left">
              <div className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Previous</div>
              <div className="text-sm font-bold text-ink-900">
                {allCaseStudies[currentIndex === 0 ? allCaseStudies.length - 1 : currentIndex - 1]?.title}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleNextCaseStudy}
            className="group flex items-center gap-3 px-5 py-3.5 bg-ink-50 hover:bg-ink-100 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ink-300 focus:ring-offset-2 cursor-pointer border border-ink-200"
          >
            <div className="text-right">
              <div className="text-xs font-semibold text-ink-400 uppercase tracking-wide">Next</div>
              <div className="text-sm font-bold text-ink-900">
                {allCaseStudies[currentIndex === allCaseStudies.length - 1 ? 0 : currentIndex + 1]?.title}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-ink-600 group-hover:text-ink-900" />
          </button>
        </div>

        <div className="mt-10 p-8 sm:p-10 bg-gradient-to-br from-brand-600 to-accent-500 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Want results like this?</h3>
          <p className="text-base text-white/90 mb-6 max-w-xl mx-auto leading-relaxed">
            Let's discuss how I can help transform your product with strategic design and technical expertise.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center px-7 py-3.5 bg-white text-brand-600 font-semibold rounded-xl hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-600"
          >
            Get in Touch
            <ExternalLink className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
