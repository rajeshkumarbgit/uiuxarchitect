import { useState, useEffect } from 'react';
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

export default function Carousel({ items, autoPlay = false, interval = 5000, className = '' }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval, items.length]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-ink-100 dark:bg-ink-800 shadow-card touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative h-full w-full">
          {items.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                index === currentIndex
                  ? 'opacity-100 translate-x-0'
                  : index < currentIndex
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-950/90 via-ink-900/50 to-transparent p-8 sm:p-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">{item.title}</h3>
                <p className="text-ink-100 text-sm sm:text-base leading-relaxed max-w-3xl line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isTransitioning}
              aria-label="Previous slide"
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-white/90 dark:bg-ink-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-ink-800 rounded-full shadow-card transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-ink-900 dark:text-white" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isTransitioning}
              aria-label="Next slide"
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-white/90 dark:bg-ink-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-ink-800 rounded-full shadow-card transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-ink-900 dark:text-white" />
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
