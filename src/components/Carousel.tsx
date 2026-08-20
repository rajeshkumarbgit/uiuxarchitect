import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  image: string;
  title: string;
  description: string;
  alt: string;
  slug?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const SWIPE_THRESHOLD = 60;

export default function Carousel({ items, autoPlay = false, interval = 5000, className = '' }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentIndex]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, items.length]);

  const handlePrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, items.length]);

  useEffect(() => {
    if (!autoPlay || items.length <= 1 || isDragging) return;

    autoplayTimer.current = setInterval(() => {
      handleNext();
    }, interval);

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [currentIndex, autoPlay, interval, items.length, isDragging, handleNext]);

  const handleDragStart = (clientX: number) => {
    if (isTransitioning) return;
    dragStartX.current = clientX;
    setIsDragging(true);
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
  };

  const handleDragMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    const offset = clientX - dragStartX.current;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (dragStartX.current === null) return;
    const containerWidth = containerRef.current?.offsetWidth || 1;
    const progress = dragOffset / containerWidth;

    if (Math.abs(progress) > 0.15 || Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      if (dragOffset > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }

    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragStartX.current === null) return;
    handleDragMove(e.clientX);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onMouseLeave = () => {
    if (dragStartX.current !== null) {
      handleDragEnd();
    }
  };

  if (items.length === 0) {
    return null;
  }

  const containerWidth = containerRef.current?.offsetWidth || 1;
  const dragPercent = (dragOffset / containerWidth) * 100;

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={containerRef}
        className={`relative h-[380px] sm:h-[480px] lg:h-[560px] overflow-hidden rounded-3xl bg-ink-100 dark:bg-ink-800 shadow-card select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div className="relative h-full w-full">
          {items.map((item, index) => {
            let offset = 0;
            if (index === currentIndex) {
              offset = dragPercent;
            } else if (index === currentIndex - 1 || (currentIndex === 0 && index === items.length - 1)) {
              offset = -100 + dragPercent;
            } else if (index === currentIndex + 1 || (currentIndex === items.length - 1 && index === 0)) {
              offset = 100 + dragPercent;
            } else {
              offset = index < currentIndex ? -100 : 100;
            }

            const isVisible = Math.abs(offset) < 110;

            return (
              <div
                key={index}
                className={`absolute inset-0 ${isDragging ? '' : 'transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'} ${isVisible ? '' : 'pointer-events-none'}`}
                style={{
                  transform: `translateX(${offset}%)`,
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-950/90 via-ink-900/50 to-transparent p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight">{item.title}</h3>
                  <p className="text-ink-100 text-xs sm:text-sm leading-[1.7] max-w-3xl line-clamp-2">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isTransitioning}
              aria-label="Previous slide"
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-white/90 dark:bg-ink-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-ink-800 rounded-full shadow-card transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed z-20"
            >
              <ChevronLeft className="w-5 h-5 text-ink-900 dark:text-white" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isTransitioning}
              aria-label="Next slide"
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-white/90 dark:bg-ink-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-ink-800 rounded-full shadow-card transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed z-20"
            >
              <ChevronRight className="w-5 h-5 text-white dark:text-white" />
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-500 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                index === currentIndex
                  ? 'w-8 h-2.5 bg-brand-500'
                  : 'w-2.5 h-2.5 bg-ink-300 dark:bg-ink-600 hover:bg-ink-400 dark:hover:bg-ink-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
