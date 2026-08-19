import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Github, Award, ArrowLeft } from 'lucide-react';
import { useAllProjects } from '../hooks/useProjects';
import { useImageUrl } from '../hooks/useImages';

interface PortfolioDetailProps {
  projectSlug: string;
  onNavigate: (page: string, slug?: string) => void;
}

export default function PortfolioDetail({ projectSlug, onNavigate }: PortfolioDetailProps) {
  const allProjects = useAllProjects();
  const currentIndex = allProjects.findIndex(p => p.slug === projectSlug);
  const project = allProjects[currentIndex];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [dragProgress, setDragProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [projectSlug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.touches[0].clientX;
    const progress = ((currentTouch - touchStart) / (heroRef.current?.offsetWidth || 1)) * 100;
    setDragProgress(progress);
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragProgress) > 20) {
      if (dragProgress > 0) {
        handlePrevImage();
      } else {
        handleNextImage();
      }
    }
    setTouchStart(null);
    setDragProgress(0);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-ink-950">
        <div className="text-center">
          <p className="text-lg text-ink-600 dark:text-ink-400 mb-6">Project not found</p>
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="btn-primary"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.cover];
  const currentImage = useImageUrl(images[currentImageIndex]);

  const handlePrevProject = () => {
    const prevIndex = currentIndex === 0 ? allProjects.length - 1 : currentIndex - 1;
    onNavigate('portfolio-detail', allProjects[prevIndex].slug);
  };

  const handleNextProject = () => {
    const nextIndex = currentIndex === allProjects.length - 1 ? 0 : currentIndex + 1;
    onNavigate('portfolio-detail', allProjects[nextIndex].slug);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  const handleClose = () => {
    onNavigate('portfolio');
  };

  const relatedProjects = allProjects
    .filter(p => p.slug !== project.slug && p.category.some(c => project.category.includes(c)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950 flex flex-col transition-colors duration-500">
      <div
        ref={heroRef}
        className="relative h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 overflow-hidden flex-1 group cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={currentImage}
          alt={`${project.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300 ease-out"
          style={{
            transform: `scale(${1 + Math.abs(dragProgress) * 0.002})`,
          }}
          draggable={false}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950/30 transition-opacity duration-500" />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-brand-500/10 rounded-full blur-3xl" />
        </div>

        <div className="absolute top-24 left-6 right-6 flex items-start justify-between gap-4 z-10">
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-1 tracking-tight">
              {project.title}
            </h1>
            <p className="text-white/70 text-sm sm:text-base drop-shadow-md hidden sm:block">{project.industry}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {images.length > 1 && (
              <div className="px-3.5 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/20 shadow-card">
                <span className="font-bold text-white">{currentImageIndex + 1}</span>
                <span className="text-white/60"> / {images.length}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-4 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent border border-white/20 shadow-card group/close"
              aria-label="Back to portfolio"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover/close:-translate-x-0.5" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent border border-white/20 shadow-card group/close"
              aria-label="Close portfolio detail"
            >
              <X className="w-5 h-5 transition-transform group-hover/close:rotate-90" />
            </button>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full shadow-card transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-white border border-white/20 group/prev z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 transition-transform group-hover/prev:-translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full shadow-card transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-white border border-white/20 group/next z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 transition-transform group-hover/next:translate-x-0.5" />
            </button>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-card z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all duration-500 rounded-full focus:outline-none focus:ring-2 focus:ring-white cursor-pointer ${
                    index === currentImageIndex
                      ? 'w-8 h-2 bg-white shadow-lg scale-110'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="bg-ink-950 px-6 sm:px-8 lg:px-12 py-5">
          <div className="max-w-5xl mx-auto flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide">
            {images.map((imgId, index) => {
              const thumbUrl = useImageUrl(imgId);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                    index === currentImageIndex
                      ? 'border-brand-500 opacity-100 scale-105'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={thumbUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-ink-950 overflow-y-auto transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
          <div className="space-y-14">
            <div className="space-y-6 animate-fadeIn">
              {project.featured && (
                <span className="badge bg-warning-50 text-warning-800 dark:bg-warning-950 dark:text-warning-400 border border-warning-200 dark:border-warning-900">
                  <Award className="w-3.5 h-3.5" />
                  Featured Project
                </span>
              )}
              <p className="text-xl text-ink-700 dark:text-ink-300 leading-relaxed max-w-3xl font-light">
                {project.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-2">Industry</p>
                <p className="text-lg font-semibold text-ink-900 dark:text-white">{project.industry}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-2">Timeline</p>
                <p className="text-lg font-semibold text-ink-900 dark:text-white">{project.timeline}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-2">Platform</p>
                <p className="text-sm font-semibold text-ink-900 dark:text-white">{project.platform.join(', ')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-2">Role</p>
                <p className="text-sm font-semibold text-ink-900 dark:text-white">{project.role.join(', ')}</p>
              </div>
            </div>

            {project.kpis.length > 0 && (
              <div className="space-y-5 pt-10 border-t border-ink-100 dark:border-ink-800">
                <h3 className="text-2xl font-bold text-ink-900 dark:text-white">Key Results</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {project.kpis.map((kpi, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-5 rounded-xl bg-ink-50/60 dark:bg-ink-900/60 border border-ink-100 dark:border-ink-800 hover:shadow-soft transition-all duration-300">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-soft">
                        <span className="text-xs font-bold text-white">{idx + 1}</span>
                      </div>
                      <p className="text-base text-ink-700 dark:text-ink-300 leading-relaxed mt-1">{kpi}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-5 pt-10 border-t border-ink-100 dark:border-ink-800">
              <h3 className="text-2xl font-bold text-ink-900 dark:text-white">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-300 text-sm font-medium rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 hover:shadow-soft transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {(project.liveUrl || project.codeUrl) && (
              <div className="flex flex-wrap gap-3 pt-10 border-t border-ink-100 dark:border-ink-800">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-7 py-3.5 bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-semibold rounded-xl hover:bg-ink-800 dark:hover:bg-ink-100 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ink-900 dark:focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-ink-950 group"
                  >
                    <span>View Live Project</span>
                    <ExternalLink className="ml-2.5 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                )}
                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-7 py-3.5 bg-white dark:bg-ink-900 border-2 border-ink-200 dark:border-ink-700 text-ink-900 dark:text-ink-100 font-semibold rounded-xl hover:border-ink-300 dark:hover:border-ink-600 hover:bg-ink-50 dark:hover:bg-ink-800 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 group"
                  >
                    <Github className="mr-2.5 w-4 h-4" />
                    <span>View on GitHub</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedProjects.length > 0 && (
        <div className="bg-gradient-to-b from-white to-ink-50/40 dark:from-ink-950 dark:to-ink-900/30 px-6 sm:px-8 lg:px-12 py-16 border-t border-ink-100 dark:border-ink-800 transition-colors duration-500">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-ink-900 dark:text-white mb-8 tracking-tight">Related Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedProjects.map((rp) => {
                const rpCover = useImageUrl(rp.cover);
                return (
                  <button
                    key={rp.id}
                    type="button"
                    onClick={() => onNavigate('portfolio-detail', rp.slug)}
                    className="group text-left card-base card-hover cursor-pointer overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink-100 dark:bg-ink-800">
                      <img
                        src={rpCover}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-base font-bold text-ink-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">{rp.title}</h4>
                      <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 line-clamp-2">{rp.summary}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800 px-6 sm:px-8 lg:px-12 py-6 shadow-soft transition-colors duration-500">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevProject}
            className="group flex items-center gap-2.5 px-4 sm:px-5 py-3 bg-ink-50 dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-900 dark:text-ink-100 rounded-xl transition-all duration-300 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 cursor-pointer flex-1 sm:flex-none border border-ink-200 dark:border-ink-700"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Prev</div>
              <div className="text-sm font-bold text-ink-900 dark:text-white truncate max-w-[180px]">
                {allProjects[currentIndex === 0 ? allProjects.length - 1 : currentIndex - 1]?.title}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center px-5 py-3 bg-ink-50 dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-900 dark:text-ink-100 font-semibold rounded-xl transition-all duration-300 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 cursor-pointer border border-ink-200 dark:border-ink-700"
            aria-label="Close portfolio"
          >
            <X className="w-5 h-5 transition-transform hover:rotate-90" />
          </button>

          <button
            type="button"
            onClick={handleNextProject}
            className="group flex items-center gap-2.5 px-4 sm:px-5 py-3 bg-ink-50 dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-900 dark:text-ink-100 rounded-xl transition-all duration-300 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 cursor-pointer flex-1 sm:flex-none justify-end border border-ink-200 dark:border-ink-700"
            aria-label="Next project"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Next</div>
              <div className="text-sm font-bold text-ink-900 dark:text-white truncate max-w-[180px]">
                {allProjects[currentIndex === allProjects.length - 1 ? 0 : currentIndex + 1]?.title}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
