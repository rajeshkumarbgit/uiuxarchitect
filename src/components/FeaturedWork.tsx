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
    <section className="section-padding px-6 sm:px-8 lg:px-12 bg-ink-950">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-dark rounded-full text-sm font-medium text-ink-300 mb-4">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Selected Work
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Featured Work
            </h2>
          </div>
          <p className="text-base sm:text-lg text-ink-400 max-w-md leading-relaxed">
            A selection of recent projects showcasing design systems, mobile experiences, and enterprise platforms
          </p>
        </div>

        <Carousel items={carouselItems} autoPlay={true} interval={6000} />

        {onNavigate && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-ink-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-ink-950 rounded-lg"
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
