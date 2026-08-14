import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Github, Award } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-6">Project not found</p>
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
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
    <div className="min-h-screen bg-white flex flex-col">
      <div
        ref={heroRef}
        className="relative h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden flex-1 group cursor-grab active:cursor-grabbing"
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

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 transition-opacity duration-500" />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-10">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-2 tracking-tight">
              {project.title}
            </h1>
            <p className="text-white/70 text-lg drop-shadow-md hidden sm:block">{project.industry}</p>
          </div>

          <div className="flex items-center gap-4">
            {images.length > 1 && (
              <div className="px-4 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-white text-sm font-semibold border border-white/20 shadow-2xl">
                <span className="font-bold text-white">{currentImageIndex + 1}</span>
                <span className="text-white/60"> / {images.length}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent cursor-pointer border border-white/20 shadow-2xl group/close"
              aria-label="Close portfolio detail"
            >
              <X className="w-6 h-6 transition-transform group-hover/close:rotate-90" />
            </button>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-full shadow-2xl transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 cursor-pointer text-white border border-white/20 group/prev z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7 transition-transform group-hover/prev:-translate-x-1" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-full shadow-2xl transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 cursor-pointer text-white border border-white/20 group/next z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7 transition-transform group-hover/next:translate-x-1" />
            </button>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all duration-500 rounded-full focus:outline-none focus:ring-2 focus:ring-white cursor-pointer ${
                    index === currentImageIndex
                      ? 'w-10 h-2.5 bg-white shadow-lg scale-110'
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
        <div className="bg-gray-900 px-6 sm:px-8 lg:px-12 py-6">
          <div className="max-w-5xl mx-auto flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((imgId, index) => {
              const thumbUrl = useImageUrl(imgId);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                    index === currentImageIndex
                      ? 'border-blue-500 opacity-100 scale-105'
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

      <div className="bg-white overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
          <div className="space-y-16">
            <div className="space-y-8 animate-fadeIn">
              {project.featured && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-full shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  Featured Project
                </div>
              )}
              <p className="text-2xl text-gray-700 leading-relaxed max-w-3xl font-light">
                {project.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div className="group">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 transition-colors group-hover:text-gray-600">Industry</p>
                <p className="text-2xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{project.industry}</p>
              </div>
              <div className="group">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 transition-colors group-hover:text-gray-600">Timeline</p>
                <p className="text-2xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{project.timeline}</p>
              </div>
              <div className="group">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 transition-colors group-hover:text-gray-600">Platform</p>
                <p className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{project.platform.join(', ')}</p>
              </div>
              <div className="group">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 transition-colors group-hover:text-gray-600">Role</p>
                <p className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{project.role.join(', ')}</p>
              </div>
            </div>

            {project.kpis.length > 0 && (
              <div className="space-y-6 pt-12 border-t border-gray-200">
                <h3 className="text-3xl font-bold text-gray-900">Key Results</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.kpis.map((kpi, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-all duration-300 hover:shadow-md border border-gray-200 group cursor-default">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                        <span className="text-sm font-bold text-white">{idx + 1}</span>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed mt-1">{kpi}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6 pt-12 border-t border-gray-200">
              <h3 className="text-3xl font-bold text-gray-900">Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-5 py-2.5 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 text-gray-800 text-sm font-semibold rounded-full hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:shadow-md hover:scale-105 cursor-default shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {(project.liveUrl || project.codeUrl) && (
              <div className="flex flex-wrap gap-4 pt-12 border-t border-gray-200">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 shadow-lg group"
                  >
                    <span>View Live Project</span>
                    <ExternalLink className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </a>
                )}
                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 shadow-md group"
                  >
                    <Github className="mr-3 w-5 h-5" />
                    <span>View on GitHub</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedProjects.length > 0 && (
        <div className="bg-gradient-to-b from-white to-gray-50 px-6 sm:px-8 lg:px-12 py-20 border-t border-gray-200">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-12 tracking-tight">Related Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProjects.map((rp) => {
                const rpCover = useImageUrl(rp.cover);
                return (
                  <button
                    key={rp.id}
                    type="button"
                    onClick={() => onNavigate('portfolio-detail', rp.slug)}
                    className="group text-left bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={rpCover}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{rp.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{rp.summary}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-b from-white via-white to-gray-50 border-t border-gray-200 px-6 sm:px-8 lg:px-12 py-8 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevProject}
            className="group flex items-center gap-3 px-5 sm:px-6 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer flex-1 sm:flex-none border border-gray-300 shadow-md"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prev</div>
              <div className="text-sm font-bold text-gray-900 truncate max-w-xs">
                {allProjects[currentIndex === 0 ? allProjects.length - 1 : currentIndex - 1]?.title}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer border border-gray-300 shadow-md"
            aria-label="Close portfolio"
          >
            <X className="w-5 h-5 transition-transform hover:rotate-90" />
          </button>

          <button
            type="button"
            onClick={handleNextProject}
            className="group flex items-center gap-3 px-5 sm:px-6 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer flex-1 sm:flex-none justify-end border border-gray-300 shadow-md"
            aria-label="Next project"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Next</div>
              <div className="text-sm font-bold text-gray-900 truncate max-w-xs">
                {allProjects[currentIndex === allProjects.length - 1 ? 0 : currentIndex + 1]?.title}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
