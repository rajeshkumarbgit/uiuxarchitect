import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Github, Award, ArrowLeft, Calendar, Clock, Monitor, User } from 'lucide-react';
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
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
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

  const handleDragStart = (clientX: number) => {
    dragStartX.current = clientX;
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    setDragOffset(clientX - dragStartX.current);
  };

  const handleDragEnd = () => {
    if (dragStartX.current === null) return;
    const containerWidth = heroRef.current?.offsetWidth || 1;
    const progress = dragOffset / containerWidth;

    if (Math.abs(progress) > 0.15 || Math.abs(dragOffset) > 60) {
      if (dragOffset > 0) {
        handlePrevImage();
      } else {
        handleNextImage();
      }
    }

    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX.current === null) return;
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (dragStartX.current !== null) {
      handleDragEnd();
    }
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

  const metaItems = [
    { icon: Calendar, label: 'Industry', value: project.industry },
    { icon: Clock, label: 'Timeline', value: project.timeline },
    { icon: Monitor, label: 'Platform', value: project.platform.join(', ') },
    { icon: User, label: 'Role', value: project.role.join(', ') },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950 flex flex-col transition-colors duration-500">
      {/* Fixed-height banner gallery */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div
          ref={heroRef}
          className={`relative h-[300px] sm:h-[420px] lg:h-[520px] mt-4 rounded-2xl overflow-hidden bg-ink-900 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={currentImage}
            alt={`${project.title} - Image ${currentImageIndex + 1}`}
            className={`w-full h-full object-cover ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
            style={{
              transform: `translateX(${dragOffset}px) scale(${1 + Math.abs(dragOffset) * 0.0003})`,
            }}
            draggable={false}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-ink-950/30" />

          {/* Top bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-10">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent border border-white/20 shadow-card"
              aria-label="Back to portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>

            {images.length > 1 && (
              <div className="px-3.5 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/20 shadow-card">
                <span className="font-bold text-white">{currentImageIndex + 1}</span>
                <span className="text-white/60"> / {images.length}</span>
              </div>
            )}
          </div>

          {/* Bottom title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-brand-500/90 text-white backdrop-blur-sm">
                <Award className="w-3 h-3" />
                Featured Project
              </span>
            )}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg mb-1 tracking-tight">
              {project.title}
            </h1>
            <p className="text-white/70 text-xs sm:text-sm drop-shadow-md">{project.industry}</p>
          </div>

          {/* Gallery nav arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full shadow-card transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white text-white border border-white/20 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full shadow-card transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white text-white border border-white/20 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-card z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`transition-all duration-500 rounded-full focus:outline-none focus:ring-2 focus:ring-white cursor-pointer ${
                      index === currentImageIndex
                        ? 'w-6 h-2 bg-white shadow-lg'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((imgId, index) => {
              const thumbUrl = useImageUrl(imgId);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
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
        )}
      </div>

      {/* Content section */}
      <div className="flex-1 bg-white dark:bg-ink-950 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
          {/* Summary */}
          <div className="mb-8 animate-fadeIn">
            <p className="text-base sm:text-lg text-ink-700 dark:text-ink-300 leading-relaxed font-light">
              {project.summary}
            </p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {metaItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-4 rounded-xl bg-ink-50/60 dark:bg-ink-900/60 border border-ink-100 dark:border-ink-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider">{item.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-white leading-snug">{item.value}</p>
                </div>
              );
            })}
          </div>

          {/* KPIs */}
          {project.kpis.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-ink-900 dark:text-white mb-4 tracking-tight">Key Results</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.kpis.map((kpi, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-ink-50/60 dark:bg-ink-900/60 border border-ink-100 dark:border-ink-800 hover:shadow-soft transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-soft">
                      <span className="text-xs font-bold text-white">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed mt-1">{kpi}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-ink-900 dark:text-white mb-4 tracking-tight">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-300 text-sm font-medium rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 hover:shadow-soft transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          {(project.liveUrl || project.codeUrl) && (
            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-ink-950 group"
                >
                  <span>View Live Project</span>
                  <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
              {project.codeUrl && (
                <a
                  href={project.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-white dark:bg-ink-900 border-2 border-ink-200 dark:border-ink-700 text-ink-900 dark:text-ink-100 font-semibold rounded-xl hover:border-ink-300 dark:hover:border-ink-600 hover:bg-ink-50 dark:hover:bg-ink-800 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 group"
                >
                  <Github className="mr-2 w-4 h-4" />
                  <span>View on GitHub</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <div className="bg-gradient-to-b from-white to-ink-50/40 dark:from-ink-950 dark:to-ink-900/30 px-6 sm:px-8 lg:px-12 py-14 border-t border-ink-100 dark:border-ink-800 transition-colors duration-500">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-ink-900 dark:text-white mb-5 tracking-tight">Related Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Prev/Next project bar */}
      <div className="bg-white dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800 px-6 sm:px-8 lg:px-12 py-5 transition-colors duration-500">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevProject}
            className="group flex items-center gap-2.5 px-4 py-3 bg-ink-50 dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-900 dark:text-ink-100 rounded-xl transition-all duration-300 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 cursor-pointer flex-1 border border-ink-200 dark:border-ink-700"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5 flex-shrink-0" />
            <div className="text-left min-w-0 hidden sm:block">
              <div className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Prev</div>
              <div className="text-sm font-bold text-ink-900 dark:text-white truncate">
                {allProjects[currentIndex === 0 ? allProjects.length - 1 : currentIndex - 1]?.title}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center w-12 h-12 bg-ink-50 dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-900 dark:text-ink-100 rounded-xl transition-all duration-300 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 cursor-pointer border border-ink-200 dark:border-ink-700 flex-shrink-0"
            aria-label="Close portfolio"
          >
            <X className="w-5 h-5 transition-transform hover:rotate-90" />
          </button>

          <button
            type="button"
            onClick={handleNextProject}
            className="group flex items-center gap-2.5 px-4 py-3 bg-ink-50 dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-900 dark:text-ink-100 rounded-xl transition-all duration-300 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 cursor-pointer flex-1 justify-end border border-ink-200 dark:border-ink-700"
            aria-label="Next project"
          >
            <div className="text-right min-w-0 hidden sm:block">
              <div className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Next</div>
              <div className="text-sm font-bold text-ink-900 dark:text-white truncate">
                {allProjects[currentIndex === allProjects.length - 1 ? 0 : currentIndex + 1]?.title}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
