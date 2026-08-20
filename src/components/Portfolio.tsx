import { useState, useMemo, useCallback } from 'react';
import { Award, Search, Sparkles, Github, ExternalLink, ArrowRight } from 'lucide-react';
import { useAllProjects } from '../hooks/useProjects';
import { usePortfolioContent } from '../hooks/useContent';
import { useImageUrl } from '../hooks/useImages';
import { projectService } from '../services/projectService';

interface PortfolioProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function Portfolio({ onNavigate }: PortfolioProps) {
  const content = usePortfolioContent();
  const allProjects = useAllProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    return ['All', ...projectService.getCategories()];
  }, []);

  const projects = useMemo(() => {
    let filtered = [...allProjects];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => {
        return Array.isArray(p.category) && p.category.includes(selectedCategory);
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [allProjects, selectedCategory, searchQuery]);

  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery.trim() !== '';

  const clearAll = useCallback(() => {
    setSelectedCategory('All');
    setSearchQuery('');
  }, []);

  return (
    <section className="min-h-screen pt-28 sm:pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-ink-50/40 via-white to-white dark:from-ink-900/30 dark:via-ink-950 dark:to-ink-950 transition-colors duration-500">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-full text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Explore My Work
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-white mb-3 tracking-tight">
            {content.title}
          </h1>
          <p className="text-base text-ink-500 dark:text-ink-400 max-w-2xl mx-auto leading-[1.7]">{content.description}</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 dark:text-ink-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="input-field pl-12"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-ink-950 ${
                  selectedCategory === cat
                    ? 'bg-ink-900 dark:bg-white text-white dark:text-ink-900 shadow-soft'
                    : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-ink-800 border border-ink-200 dark:border-ink-700'
                }`}
                aria-pressed={selectedCategory === cat}
                aria-label={`Filter by ${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-ink-500 dark:text-ink-400">
            <span>
              <span className="font-semibold text-ink-900 dark:text-white">{projects.length}</span> {projects.length === 1 ? 'project' : 'projects'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white font-medium focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 rounded-lg px-3 py-1 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors"
                aria-label="Clear all filters"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const coverUrl = useImageUrl(project.cover);

            return (
              <article
                key={project.id}
                onClick={() => onNavigate('portfolio-detail', project.slug)}
                className="group card-base card-hover cursor-pointer overflow-hidden spotlight-card"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.06}s both`
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-100 dark:bg-ink-800">
                  <img
                    src={coverUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {project.featured && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-ink-900/90 backdrop-blur-sm text-white">
                      <Award className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {(project.codeUrl || project.liveUrl) && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {project.codeUrl && (
                        <a
                          href={project.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft hover:bg-white hover:scale-110 transition-all duration-300"
                          aria-label="View code on GitHub"
                        >
                          <Github className="w-4 h-4 text-ink-900" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft hover:bg-white hover:scale-110 transition-all duration-300"
                          aria-label="View live project"
                        >
                          <ExternalLink className="w-4 h-4 text-ink-900" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1.5 bg-white/90 backdrop-blur-sm text-ink-900 text-xs font-medium rounded-lg shadow-soft">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-ink-900 dark:text-white tracking-tight line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-ink-500 dark:text-ink-400 leading-[1.7] line-clamp-2">{project.summary}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-ink-400 dark:text-ink-500 pt-3 border-t border-ink-100 dark:border-ink-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
                      {project.industry}
                    </span>
                    <span>•</span>
                    <span>{project.timeline}</span>
                  </div>

                  <div className="text-sm font-medium text-ink-500 dark:text-ink-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center gap-1.5">
                    View details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-base text-ink-600 dark:text-ink-400 mb-4">{content.nothingFoundTitle}</p>
            <button
              type="button"
              onClick={clearAll}
              className="text-ink-900 dark:text-white hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-ink-300 dark:focus:ring-ink-600 focus:ring-offset-2 dark:focus:ring-offset-ink-950 rounded"
            >
              {content.nothingFoundAction}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
