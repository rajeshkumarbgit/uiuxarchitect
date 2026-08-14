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
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Case study not found</p>
          <button
            onClick={() => onNavigate('case-studies')}
            className="text-gray-900 underline"
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
    <article className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pt-20">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600">
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt={caseStudy.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-blue-600/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <button
            type="button"
            onClick={() => onNavigate('case-studies')}
            className="inline-flex items-center text-white/80 hover:text-white mb-8 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-4 py-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case Studies
          </button>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
            {caseStudy.title}
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {caseStudy.hero.tagline}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {caseStudy.hero.metrics.map((metric, idx) => (
              <div key={idx} className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                <div className="text-4xl font-bold mb-2">{metric.value}</div>
                <div className="text-sm text-white/80">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
            <div className="w-1.5 h-3 bg-white rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-4 mb-16 -mt-32 relative z-10">
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Role</p>
            <p className="text-sm text-gray-900 font-medium">{caseStudy.metadata.role.join(', ')}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Timeline</p>
            <p className="text-sm text-gray-900 font-medium">{caseStudy.metadata.timeline}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Platform</p>
            <p className="text-sm text-gray-900 font-medium">{caseStudy.metadata.platform.join(', ')}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tools</p>
            <p className="text-sm text-gray-900 font-medium">{caseStudy.metadata.tools.slice(0, 3).join(', ')}</p>
          </div>
        </div>

        <div className="space-y-24">
          <section className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">01 / Problem</span>
                <h2 className="text-3xl font-bold text-gray-900">The Challenge</h2>
              </div>
            </div>
            <div className="pl-16">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {caseStudy.sections.problem}
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">02 / Research</span>
                <h2 className="text-3xl font-bold text-gray-900">Discovery & Insights</h2>
              </div>
            </div>
            <div className="pl-16 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Research Methods</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {caseStudy.sections.research.methods.map((method, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                      <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-yellow-700">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{method}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h3>
                <div className="space-y-3">
                  {caseStudy.sections.research.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border-l-4 border-yellow-500 shadow-sm">
                      <span className="text-2xl">💡</span>
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">03 / Solution</span>
                <h2 className="text-3xl font-bold text-gray-900">Design Approach</h2>
              </div>
            </div>
            <div className="pl-16 space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">{caseStudy.sections.solution.approach}</p>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                <div className="grid gap-3">
                  {caseStudy.sections.solution.keyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-900">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">04 / Impact</span>
                <h2 className="text-3xl font-bold text-gray-900">Results & Outcomes</h2>
              </div>
            </div>
            <div className="pl-16 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                {caseStudy.sections.results.metrics.map((metric, idx) => (
                  <div key={idx} className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                    <div className="text-4xl font-bold text-green-700 mb-2">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-900 mb-1">{metric.label}</div>
                    {metric.context && (
                      <div className="text-xs text-gray-600">{metric.context}</div>
                    )}
                  </div>
                ))}
              </div>

              {caseStudy.sections.results.testimonial && (
                <div className="relative p-8 bg-white rounded-2xl border-2 border-gray-100 shadow-lg">
                  <div className="text-6xl text-blue-200 font-serif absolute top-4 left-6">"</div>
                  <blockquote className="relative z-10 pl-8">
                    <p className="text-lg text-gray-700 italic mb-4">
                      {caseStudy.sections.results.testimonial.quote}
                    </p>
                    <footer className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {caseStudy.sections.results.testimonial.author}
                        </p>
                        <p className="text-sm text-gray-600">
                          {caseStudy.sections.results.testimonial.role}
                          {caseStudy.sections.results.testimonial.company && ` • ${caseStudy.sections.results.testimonial.company}`}
                        </p>
                      </div>
                    </footer>
                  </blockquote>
                </div>
              )}
            </div>
          </section>

          <section className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">05 / Learnings</span>
                <h2 className="text-3xl font-bold text-gray-900">Key Takeaways</h2>
              </div>
            </div>
            <div className="pl-16">
              <div className="space-y-4">
                {caseStudy.sections.learnings.map((learning, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{learning}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between py-12 mt-12 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={handlePrevCaseStudy}
            className="group flex items-center gap-3 px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            <div className="text-left">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Previous</div>
              <div className="text-sm font-bold text-gray-900">
                {allCaseStudies[currentIndex === 0 ? allCaseStudies.length - 1 : currentIndex - 1]?.title}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleNextCaseStudy}
            className="group flex items-center gap-3 px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer"
          >
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Next</div>
              <div className="text-sm font-bold text-gray-900">
                {allCaseStudies[currentIndex === allCaseStudies.length - 1 ? 0 : currentIndex + 1]?.title}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          </button>
        </div>

        <div className="mt-12 p-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Want results like this?</h3>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how I can help transform your product with strategic design and technical expertise.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 cursor-pointer"
          >
            Get in Touch
            <ExternalLink className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
