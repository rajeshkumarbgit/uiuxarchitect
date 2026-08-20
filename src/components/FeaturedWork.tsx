import Carousel from './Carousel';
import { useImageUrl } from '../hooks/useImages';
import { useFeaturedProjects } from '../hooks/useProjects';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedWorkProps {
  onNavigate?: (page: string, slug?: string) => void;
}

export default function FeaturedWork({ onNavigate }: FeaturedWorkProps) {
  const featuredProjects = useFeaturedProjects();

  const carouselItems = featuredProjects.slice(0, 4).map((project) => ({
    image: useImageUrl(project.cover),
    title: project.title,
    description: project.summary,
    alt: project.title,
    slug: project.slug,
  }));

  if (carouselItems.length === 0) {
    return null;
  }

  return (
    <section className="section-padding px-6 sm:px-8 lg:px-12 bg-ink-50/40 dark:bg-ink-900/30 transition-colors duration-500">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-full text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Selected Work
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-900 dark:text-white tracking-tight">
              Featured Work
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink-500 dark:text-ink-400 max-w-md leading-[1.7]">
            A selection of recent projects showcasing design systems, mobile experiences, and enterprise platforms
          </p>
        </div>

        <Carousel items={carouselItems} autoPlay={true} interval={6000} />

        {onNavigate && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-ink-950 rounded-lg"
            >
              View all projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
