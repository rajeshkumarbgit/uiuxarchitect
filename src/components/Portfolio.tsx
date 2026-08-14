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
    <section className="min-h-screen py-32 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Explore My Work</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            {content.title}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">{content.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-16">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all text-gray-900 placeholder-gray-400 shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer hover:scale-105 active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
                aria-pressed={selectedCategory === cat}
                aria-label={`Filter by ${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>
              <span className="font-semibold text-gray-900">{projects.length}</span> {projects.length === 1 ? 'project' : 'projects'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="text-gray-700 hover:text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-lg px-3 py-1 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Clear all filters"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const coverUrl = useImageUrl(project.cover);

            return (
              <article
                key={project.id}
                onClick={() => onNavigate('portfolio-detail', project.slug)}
                className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-700 border border-gray-200 hover:border-gray-300 cursor-pointer"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both`
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={coverUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {project.featured && (
                    <div className="absolute top-5 left-5 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xl">
                      <Award className="w-3.5 h-3.5" />
                      Featured
                    </div>
                  )}

                  {(project.codeUrl || project.liveUrl) && (
                    <div className="absolute top-5 right-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {project.codeUrl && (
                        <a
                          href={project.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                          aria-label="View code on GitHub"
                        >
                          <Github className="w-4 h-4 text-gray-900" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
                          aria-label="View live project"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-900" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="absolute bottom-5 left-5 right-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-semibold rounded-lg shadow-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-base text-gray-500 leading-relaxed line-clamp-2">{project.summary}</p>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                      {project.industry}
                    </span>
                    <span>•</span>
                    <span>{project.timeline}</span>
                  </div>

                  <div className="mt-5 text-sm font-semibold text-gray-500 group-hover:text-gray-900 transition-colors flex items-center gap-2">
                    Click to view details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">{content.nothingFoundTitle}</p>
            <button
              type="button"
              onClick={clearAll}
              className="text-gray-900 hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded cursor-pointer"
            >
              {content.nothingFoundAction}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
