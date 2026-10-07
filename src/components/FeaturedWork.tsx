import Carousel from './Carousel';
import { useFeaturedProjects } from '../hooks/useProjects';
import { imageService } from '../services/imageService';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedWorkProps {
  onNavigate?: (page: string, slug?: string) => void;
}

export default function FeaturedWork({ onNavigate }: FeaturedWorkProps) {
  const featuredProjects = useFeaturedProjects();

  const carouselItems = featuredProjects.slice(0, 4).map((project) => ({
    image: imageService.getImageUrl(project.cover),
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-white tracking-tight">
              Featured Work
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink-500 dark:text-ink-400 max-w-md leading-[1.7]">
            Design systems, field-operations mobile, low-code with human-in-the-loop AI, and enterprise portals — recreated to keep product details confidential.
          </p>
        </div>

        <Carousel items={carouselItems} autoPlay={true} interval={6000} />

        {onNavigate && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-brand-600 dark:text-brand-300 border border-ink-300 dark:border-ink-700 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-ink-950 rounded-full"
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
