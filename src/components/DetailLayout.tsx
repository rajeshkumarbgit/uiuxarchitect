import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowLeft, Award, MessageCircle, type LucideIcon } from 'lucide-react';
import { imageService } from '../services/imageService';

/**
 * Shared building blocks for the project and case-study detail pages,
 * so both pages look and behave the same.
 */

interface ImageGalleryProps {
  images: string[];
  title: string;
  backLabel: string;
  onBack: () => void;
}

export function ImageGallery({ images, title, backLabel, onBack }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  const prev = useCallback(() => setCurrent((i) => (i === 0 ? count - 1 : i - 1)), [count]);
  const next = useCallback(() => setCurrent((i) => (i === count - 1 ? 0 : i + 1)), [count]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next]);

  const dragStart = (clientX: number) => {
    dragStartX.current = clientX;
    setIsDragging(true);
  };

  const dragMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    setDragOffset(clientX - dragStartX.current);
  };

  const dragEnd = () => {
    if (dragStartX.current === null) return;
    const width = heroRef.current?.offsetWidth || 1;
    if (Math.abs(dragOffset / width) > 0.15 || Math.abs(dragOffset) > 60) {
      if (dragOffset > 0) prev();
      else next();
    }
    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const control = 'bg-white/95 dark:bg-ink-900/90 backdrop-blur-md text-ink-900 dark:text-white border border-ink-200 dark:border-ink-700 shadow-card';

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8">
      <div
        ref={heroRef}
        className={`relative aspect-[16/10] max-h-[78vh] max-w-6xl mx-auto mt-4 rounded-[2rem] overflow-hidden bg-ink-100 dark:bg-ink-900 ring-1 ring-ink-900/5 dark:ring-white/10 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onTouchStart={(e) => dragStart(e.touches[0].clientX)}
        onTouchMove={(e) => dragMove(e.touches[0].clientX)}
        onTouchEnd={dragEnd}
        onMouseDown={(e) => {
          e.preventDefault();
          dragStart(e.clientX);
        }}
        onMouseMove={(e) => dragMove(e.clientX)}
        onMouseUp={dragEnd}
        onMouseLeave={() => dragStartX.current !== null && dragEnd()}
      >
        <img
          src={imageService.getImageUrl(images[current] ?? images[0])}
          alt={imageService.getImage(images[current])?.alt ?? `${title} - image ${current + 1}`}
          className={`w-full h-full object-cover ${isDragging ? '' : 'transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'}`}
          style={{ transform: `translateX(${dragOffset}px) scale(${1 + Math.abs(dragOffset) * 0.0003})` }}
          draggable={false}
        />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-10">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-2 px-4 h-10 rounded-full hover:bg-white dark:hover:bg-ink-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 ${control}`}
            aria-label={backLabel}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </button>

          {count > 1 && (
            <div className={`px-3.5 py-2 rounded-full text-sm font-semibold ${control}`}>
              <span className="font-bold">{current + 1}</span>
              <span className="text-ink-500 dark:text-ink-400"> / {count}</span>
            </div>
          )}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-white dark:hover:bg-ink-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 z-10 ${control}`}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-white dark:hover:bg-ink-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 z-10 ${control}`}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full z-10 ${control}`}>
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={`transition-all duration-500 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    index === current ? 'w-6 h-2 bg-brand-500' : 'w-2 h-2 bg-ink-300 dark:bg-ink-600 hover:bg-ink-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((imgId, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === current ? 'border-brand-500 opacity-100 scale-105' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img src={imageService.getImageUrl(imgId)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface DetailHeaderProps {
  title: string;
  eyebrow: string;
  featured?: boolean;
  badge?: string;
  lead: string;
  note?: string;
}

const RECREATION_NOTE =
  'Visuals are recreations that show the patterns and flows of the real work; product names, data and screens are changed to keep client details confidential.';

export function DetailHeader({ title, eyebrow, featured, badge, lead, note = RECREATION_NOTE }: DetailHeaderProps) {
  return (
    <>
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {badge && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-50 dark:bg-accent-500/15 text-accent-700 dark:text-accent-300">
              {badge}
            </span>
          )}
          {featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300">
              <Award className="w-3 h-3" />
              Featured project
            </span>
          )}
          <span className="text-sm text-ink-500 dark:text-ink-400">{eyebrow}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-ink-900 dark:text-white tracking-tight">{title}</h1>
      </header>

      <p className="mb-4 text-base sm:text-lg text-ink-700 dark:text-ink-300 leading-[1.7] font-light">{lead}</p>

      <p className="mb-8 text-xs text-ink-500 dark:text-ink-400">{note}</p>
    </>
  );
}

export function PlainTerms({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="mb-8 p-5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/50">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        <span className="text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">In simple terms</span>
      </div>
      <p className="text-sm text-ink-700 dark:text-ink-300 leading-[1.7]">{text}</p>
    </div>
  );
}

export interface MetaItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function MetaGrid({ items }: { items: MetaItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="p-4 rounded-xl bg-ink-50/60 dark:bg-ink-900/60 border border-ink-100 dark:border-ink-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider">{label}</span>
          </div>
          <p className="text-sm font-semibold text-ink-900 dark:text-white leading-snug">{value}</p>
        </div>
      ))}
    </div>
  );
}

interface DetailSectionProps {
  title: string;
  step?: string;
  children: ReactNode;
}

export function DetailSection({ title, step, children }: DetailSectionProps) {
  return (
    <section className="mb-10">
      {step && <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">{step}</div>}
      <h2 className="text-lg font-semibold text-ink-900 dark:text-white mb-4 tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function NumberedCards({ items, columns = 2 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <div className={`grid gap-3 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {items.map((text, idx) => (
        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-ink-50/60 dark:bg-ink-900/60 border border-ink-100 dark:border-ink-800 hover:shadow-soft transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-soft">
            <span className="text-xs font-bold text-white">{idx + 1}</span>
          </div>
          <p className="text-sm text-ink-700 dark:text-ink-300 leading-[1.7] mt-1">{text}</p>
        </div>
      ))}
    </div>
  );
}

export function MetricCards({ metrics }: { metrics: { label: string; value: string; context?: string }[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="p-4 rounded-xl bg-ink-50/60 dark:bg-ink-900/60 border border-ink-100 dark:border-ink-800">
          <div className="text-xl font-semibold text-ink-900 dark:text-white tracking-tight">{m.value}</div>
          <div className="text-xs text-ink-500 dark:text-ink-400 mt-1">{m.label}</div>
          {m.context && <div className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">{m.context}</div>}
        </div>
      ))}
    </div>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3.5 py-1.5 bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-300 text-sm font-medium rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

interface PrevNextBarProps {
  prevTitle?: string;
  nextTitle?: string;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  noun: string;
}

export function PrevNextBar({ prevTitle, nextTitle, onPrev, onNext, onClose, noun }: PrevNextBarProps) {
  const btn = 'group flex items-center gap-2.5 px-4 py-3 bg-ink-50 dark:bg-ink-900 hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-900 dark:text-ink-100 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 border border-ink-200 dark:border-ink-700';
  return (
    <div className="bg-white dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800 px-6 sm:px-8 lg:px-12 py-5 transition-colors duration-500">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <button type="button" onClick={onPrev} className={`${btn} flex-1`} aria-label={`Previous ${noun}`}>
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5 flex-shrink-0" />
          <div className="text-left min-w-0 hidden sm:block">
            <div className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Prev</div>
            <div className="text-sm font-semibold text-ink-900 dark:text-white truncate">{prevTitle}</div>
          </div>
        </button>

        <button type="button" onClick={onClose} className={`${btn} justify-center w-12 h-12 px-0 py-0 flex-shrink-0`} aria-label={`Close ${noun}`}>
          <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
        </button>

        <button type="button" onClick={onNext} className={`${btn} flex-1 justify-end`} aria-label={`Next ${noun}`}>
          <div className="text-right min-w-0 hidden sm:block">
            <div className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Next</div>
            <div className="text-sm font-semibold text-ink-900 dark:text-white truncate">{nextTitle}</div>
          </div>
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}
