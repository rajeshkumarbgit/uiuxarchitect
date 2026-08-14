import Carousel from './Carousel';
import { useImageUrl } from '../hooks/useImages';
import { useFeaturedProjects } from '../hooks/useProjects';

export default function FeaturedWork() {
  const featuredProjects = useFeaturedProjects();

  const carouselItems = featuredProjects.slice(0, 4).map((project) => ({
    image: useImageUrl(project.cover),
    title: project.title,
    description: project.summary,
    alt: project.title
  }));

  if (carouselItems.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Featured Work</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            A selection of recent projects showcasing design systems, mobile experiences, and enterprise platforms
          </p>
        </div>

        <Carousel items={carouselItems} autoPlay={true} interval={6000} />
      </div>
    </section>
  );
}
