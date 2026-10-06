/**
 * useProjects Hook
 * React hook for accessing and filtering project data
 * References: REQ-07 (Portfolio Grid)
 */

import { useState, useMemo, useCallback } from 'react';
import { projectService } from '../services/projectService';
import type { Project, ProjectFilters, CaseStudy } from '../types';

/**
 * Hook to get all projects
 */
export function useAllProjects(): Project[] {
  return useMemo(() => projectService.getAllProjects(), []);
}

/**
 * Hook to get featured projects
 */
export function useFeaturedProjects(): Project[] {
  return useMemo(() => projectService.getFeaturedProjects(), []);
}

/**
 * Hook to get a single project by slug
 * @param slug Project slug
 */
export function useProject(slug: string): Project | undefined {
  return useMemo(() => projectService.getProjectBySlug(slug), [slug]);
}

/**
 * Hook to manage filtered projects
 * @param initialFilters Initial filter state
 */
export function useFilteredProjects(initialFilters?: ProjectFilters) {
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters || {});

  const filteredProjects = useMemo(() => {
    return projectService.filterProjects(filters);
  }, [filters]);

  const updateFilter = useCallback((key: keyof ProjectFilters, value: ProjectFilters[keyof ProjectFilters]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const resetFilter = useCallback((key: keyof ProjectFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  return {
    projects: filteredProjects,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    resetFilter
  };
}

/**
 * Hook to get available filter options
 */
export function useFilterOptions() {
  return useMemo(() => ({
    categories: ['All', ...projectService.getCategories()],
    technologies: ['All', ...projectService.getTechnologies()],
    industries: ['All', ...projectService.getIndustries()],
    platforms: ['All', ...projectService.getPlatforms()]
  }), []);
}

/**
 * Hook to search projects
 * @param query Search query
 */
export function useProjectSearch(query: string): Project[] {
  return useMemo(() => {
    return projectService.searchProjects(query);
  }, [query]);
}

/**
 * Hook to get project statistics
 */
export function useProjectStats() {
  return useMemo(() => ({
    total: projectService.getProjectCount(),
    featured: projectService.getFeaturedProjectCount(),
    categories: projectService.getCategories().length,
    technologies: projectService.getTechnologies().length
  }), []);
}

/**
 * Hook to get case study by slug
 * @param slug Case study slug
 */
export function useCaseStudy(slug: string): CaseStudy | undefined {
  return useMemo(() => projectService.getCaseStudyBySlug(slug), [slug]);
}

/**
 * Hook to get all case studies
 */
export function useAllCaseStudies(): CaseStudy[] {
  return useMemo(() => projectService.getAllCaseStudies(), []);
}

/**
 * Hook to check if project has case study
 * @param projectSlug Project slug
 */
export function useHasCaseStudy(projectSlug: string): boolean {
  return useMemo(() => projectService.hasCaseStudy(projectSlug), [projectSlug]);
}
