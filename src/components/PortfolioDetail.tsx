import { ExternalLink, Github, Calendar, Clock, Monitor, User, BookOpen, ArrowRight } from 'lucide-react';
import { useAllProjects, useHasCaseStudy } from '../hooks/useProjects';
import { imageService } from '../services/imageService';
import { ImageGallery, DetailHeader, PlainTerms, MetaGrid, DetailSection, NumberedCards, TagList, PrevNextBar } from './DetailLayout';

interface PortfolioDetailProps {
  projectSlug: string;
  onNavigate: (page: string, slug?: string) => void;
}

export default function PortfolioDetail({ projectSlug, onNavigate }: PortfolioDetailProps) {
  const allProjects = useAllProjects();
  const currentIndex = allProjects.findIndex(p => p.slug === projectSlug);
  const project = allProjects[currentIndex];
  const hasCaseStudy = useHasCaseStudy(projectSlug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-ink-950">
        <div className="text-center">
          <p className="text-lg text-ink-600 dark:text-ink-400 mb-6">Project not found</p>
          <button type="button" onClick={() => onNavigate('portfolio')} className="btn-primary">
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const prevProject = allProjects[currentIndex === 0 ? allProjects.length - 1 : currentIndex - 1];
  const nextProject = allProjects[currentIndex === allProjects.length - 1 ? 0 : currentIndex + 1];
  const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.cover];

  const relatedProjects = allProjects
    .filter(p => p.slug !== project.slug && p.category.some(c => project.category.includes(c)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950 flex flex-col transition-colors duration-500">
      <ImageGallery
        key={project.slug}
        images={images}
        title={project.title}
        backLabel="Back to portfolio"
        onBack={() => onNavigate('portfolio')}
      />

      <div className="flex-1 bg-white dark:bg-ink-950 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
          <DetailHeader
            title={project.title}
            eyebrow={project.industry}
            featured={project.featured}
            lead={project.summary}
            badge={project.kind === 'concept' ? 'Concept' : project.kind === 'personal' ? 'Personal project' : undefined}
            note={
              project.kind === 'concept'
                ? 'Self-initiated concept study to explore an idea — not a client project. Names and data are fictional.'
                : project.kind === 'personal'
                  ? 'Screens are real screenshots of this website.'
                  : undefined
            }
          />

          <PlainTerms text={project.plainTerms} />

          <MetaGrid
            items={[
              { icon: Calendar, label: 'Industry', value: project.industry },
              { icon: Clock, label: 'Timeline', value: project.timeline },
              { icon: Monitor, label: 'Platform', value: project.platform.join(', ') },
              { icon: User, label: 'Role', value: project.role.join(', ') },
            ]}
          />

          {project.kpis.length > 0 && (
            <DetailSection title="Key Results">
              <NumberedCards items={project.kpis} />
            </DetailSection>
          )}

          <DetailSection title="Technologies">
            <TagList tags={project.tags} />
          </DetailSection>

          {(hasCaseStudy || project.liveUrl || project.codeUrl) && (
            <div className="flex flex-wrap gap-3">
              {hasCaseStudy && (
                <button type="button" onClick={() => onNavigate('case-study-detail', project.slug)} className="btn-primary group">
                  <BookOpen className="mr-2 w-4 h-4" />
                  Read the case study
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary group">
                  View Live Project
                  <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
              {project.codeUrl && (
                <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <Github className="mr-2 w-4 h-4" />
                  View on GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {relatedProjects.length > 0 && (
        <div className="bg-gradient-to-b from-white to-ink-50/40 dark:from-ink-950 dark:to-ink-900/30 px-6 sm:px-8 lg:px-12 py-14 border-t border-ink-100 dark:border-ink-800 transition-colors duration-500">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white mb-5 tracking-tight">Related Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProjects.map((rp) => (
                <button
                  key={rp.id}
                  type="button"
                  onClick={() => onNavigate('portfolio-detail', rp.slug)}
                  className="group text-left card-base card-hover cursor-pointer overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-100 dark:bg-ink-800">
                    <img
                      src={imageService.getImageUrl(rp.cover)}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-base font-semibold text-ink-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">{rp.title}</h4>
                    <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 line-clamp-2">{rp.summary}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <PrevNextBar
        noun="project"
        prevTitle={prevProject?.title}
        nextTitle={nextProject?.title}
        onPrev={() => onNavigate('portfolio-detail', prevProject.slug)}
        onNext={() => onNavigate('portfolio-detail', nextProject.slug)}
        onClose={() => onNavigate('portfolio')}
      />
    </div>
  );
}
