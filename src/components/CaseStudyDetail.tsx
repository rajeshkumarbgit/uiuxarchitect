import { Calendar, Users, Monitor, User, MessageSquare, Lightbulb, LayoutGrid, ArrowRight } from 'lucide-react';
import { useAllCaseStudies, useProject } from '../hooks/useProjects';
import { ImageGallery, DetailHeader, PlainTerms, MetaGrid, DetailSection, NumberedCards, MetricCards, TagList, PrevNextBar } from './DetailLayout';

interface CaseStudyDetailProps {
  caseStudySlug: string;
  onNavigate: (page: string, slug?: string) => void;
}

export default function CaseStudyDetail({ caseStudySlug, onNavigate }: CaseStudyDetailProps) {
  const allCaseStudies = useAllCaseStudies();
  const currentIndex = allCaseStudies.findIndex(cs => cs.slug === caseStudySlug);
  const caseStudy = allCaseStudies[currentIndex];
  const project = useProject(caseStudySlug);

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-ink-950">
        <div className="text-center">
          <p className="text-lg text-ink-600 dark:text-ink-400 mb-6">Case study not found</p>
          <button type="button" onClick={() => onNavigate('case-studies')} className="btn-primary">
            Back to Case Studies
          </button>
        </div>
      </div>
    );
  }

  const prevCase = allCaseStudies[currentIndex === 0 ? allCaseStudies.length - 1 : currentIndex - 1];
  const nextCase = allCaseStudies[currentIndex === allCaseStudies.length - 1 ? 0 : currentIndex + 1];
  const images = project?.gallery && project.gallery.length > 0 ? project.gallery : [caseStudy.hero.image];
  const { metadata, sections } = caseStudy;
  const testimonial = sections.results.testimonial;

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950 flex flex-col transition-colors duration-500">
      <ImageGallery
        key={caseStudy.slug}
        images={images}
        title={caseStudy.title}
        backLabel="Back to case studies"
        onBack={() => onNavigate('case-studies')}
      />

      <div className="flex-1 bg-white dark:bg-ink-950 transition-colors duration-500">
        <article className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
          <DetailHeader
            title={caseStudy.title}
            eyebrow={metadata.industry ?? ''}
            badge="Case study"
            lead={caseStudy.hero.tagline}
          />

          <PlainTerms text={sections.plainTerms} />

          <MetaGrid
            items={[
              { icon: User, label: 'Role', value: metadata.role.join(', ') },
              { icon: Calendar, label: 'Timeline', value: metadata.timeline },
              { icon: Monitor, label: 'Platform', value: metadata.platform.join(', ') },
              { icon: Users, label: 'Team', value: metadata.team },
            ]}
          />

          <DetailSection title="At a glance">
            <MetricCards metrics={caseStudy.hero.metrics} />
          </DetailSection>

          <DetailSection step="01 · Problem" title="The Challenge">
            <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 leading-[1.75] whitespace-pre-line">{sections.problem}</p>
          </DetailSection>

          <DetailSection step="02 · Research" title="Discovery & Insights">
            <h3 className="text-sm font-semibold text-ink-500 dark:text-ink-400 mb-3">How we learned</h3>
            <NumberedCards items={sections.research.methods} />
            <h3 className="text-sm font-semibold text-ink-500 dark:text-ink-400 mt-6 mb-3">What we found</h3>
            <div className="space-y-3">
              {sections.research.insights.map((insight) => (
                <div key={insight} className="flex items-start gap-3 p-4 rounded-xl bg-ink-50/60 dark:bg-ink-900/60 border border-ink-100 dark:border-ink-800">
                  <Lightbulb className="w-4 h-4 text-brand-500 dark:text-brand-300 flex-shrink-0 mt-1" />
                  <p className="text-sm text-ink-700 dark:text-ink-300 leading-[1.7]">{insight}</p>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection step="03 · Solution" title="Design Approach">
            <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 leading-[1.75] whitespace-pre-line mb-6">{sections.solution.approach}</p>
            <h3 className="text-sm font-semibold text-ink-500 dark:text-ink-400 mb-3">Key features</h3>
            <NumberedCards items={sections.solution.keyFeatures} />
          </DetailSection>

          <DetailSection step="04 · Impact" title="Results & Outcomes">
            <MetricCards metrics={sections.results.metrics} />
            {testimonial && (
              <blockquote className="mt-4 p-5 rounded-xl bg-ink-50/60 dark:bg-ink-900/60 border border-ink-100 dark:border-ink-800">
                <p className="text-sm text-ink-700 dark:text-ink-300 italic leading-[1.7] mb-3">“{testimonial.quote}”</p>
                <footer className="text-sm">
                  <span className="font-semibold text-ink-900 dark:text-white">{testimonial.author}</span>
                  <span className="text-ink-500 dark:text-ink-400"> · {testimonial.role}{testimonial.company && `, ${testimonial.company}`}</span>
                </footer>
              </blockquote>
            )}
          </DetailSection>

          <DetailSection step="05 · Learnings" title="Key Takeaways">
            <NumberedCards items={sections.learnings} columns={1} />
          </DetailSection>

          <DetailSection title="Tools">
            <TagList tags={metadata.tools} />
          </DetailSection>

          <div className="flex flex-wrap gap-3">
            {project && (
              <button type="button" onClick={() => onNavigate('portfolio-detail', project.slug)} className="btn-secondary group">
                <LayoutGrid className="mr-2 w-4 h-4" />
                Project overview
              </button>
            )}
            <button type="button" onClick={() => onNavigate('contact')} className="btn-primary group">
              <MessageSquare className="mr-2 w-4 h-4" />
              Discuss a similar project
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </article>
      </div>

      <PrevNextBar
        noun="case study"
        prevTitle={prevCase?.title}
        nextTitle={nextCase?.title}
        onPrev={() => onNavigate('case-study-detail', prevCase.slug)}
        onNext={() => onNavigate('case-study-detail', nextCase.slug)}
        onClose={() => onNavigate('case-studies')}
      />
    </div>
  );
}
