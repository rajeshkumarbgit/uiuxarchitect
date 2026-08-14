/**
 * Type Definitions for Rajesh Kumar Portfolio
 * References: REQ-08 (Data Model), REQ-06 (Case Study), REQ-07 (Portfolio)
 */

// ============================================================================
// Project Types (REQ-07)
// ============================================================================

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string[];
  tags: string[];
  role: string[];
  team: string;
  timeline: string;
  kpis: string[];
  summary: string;
  cover: string;
  gallery?: string[];
  prototype?: string;
  liveUrl?: string;
  codeUrl?: string;
  featured: boolean;
  industry: string;
  platform: string[];
  status?: 'live' | 'prototype' | 'archived';
}

export interface ProjectFilters {
  category?: string;
  technology?: string;
  industry?: string;
  platform?: string;
  search?: string;
  featured?: boolean;
}

// ============================================================================
// Case Study Types (REQ-06 - STAR Methodology)
// ============================================================================

export interface CaseStudy {
  slug: string;
  title: string;
  hero: HeroSection;
  metadata: ProjectMetadata;
  sections: CaseStudySections;
}

export interface HeroSection {
  image: string;
  tagline: string;
  metrics: Metric[];
}

export interface Metric {
  label: string;
  value: string;
  context?: string;
}

export interface ProjectMetadata {
  role: string[];
  timeline: string;
  team: string;
  platform: string[];
  tools: string[];
  industry?: string;
}

export interface CaseStudySections {
  problem: string;
  research: ResearchSection;
  solution: SolutionSection;
  design: DesignSection;
  results: ResultsSection;
  learnings: string[];
}

export interface ResearchSection {
  methods: string[];
  insights: string[];
}

export interface SolutionSection {
  approach: string;
  keyFeatures: string[];
}

export interface DesignSection {
  wireframes?: string;
  system?: string;
  process?: string;
}

export interface ResultsSection {
  metrics: Metric[];
  testimonial?: Testimonial;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

// ============================================================================
// Skills & Timeline Types (REQ-05, REQ-08)
// ============================================================================

export interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  years: string; // e.g., "10+"
}

export interface TimelineEntry {
  year: string;
  role: string;
  company: string;
  description: string;
  achievements?: string[];
}

export interface Principle {
  icon: string;
  title: string;
  description: string;
}

// ============================================================================
// Content Types (REQ-04, REQ-10)
// ============================================================================

export interface Content {
  hero: HeroContent;
  about: AboutContent;
  portfolio: PortfolioContent;
  contact: ContactContent;
  labels: Labels;
  metadata: PageMetadata;
}

export interface HeroContent {
  tagline: string;
  subtext: string;
  description: string;
  ctas: CTA[];
  stats: Stat[];
  capabilities: Capability[];
  trustBar: TrustBar;
}

export interface CTA {
  label: string;
  action: string;
  variant: 'primary' | 'secondary' | 'tertiary';
}

export interface Stat {
  label: string;
  value: string;
}

export interface Capability {
  icon: string;
  title: string;
  description: string;
}

export interface TrustBar {
  title: string;
  clients: string[];
}

export interface AboutContent {
  title: string;
  introduction: string[];
  principlesTitle: string;
  principles: Principle[];
  skillsTitle: string;
  timelineTitle: string;
}

export interface PortfolioContent {
  title: string;
  description: string;
  filterLabel: string;
  categoryLabel: string;
  technologyLabel: string;
  searchPlaceholder: string;
  showingLabel: string;
  ofLabel: string;
  projectsLabel: string;
  clearFiltersLabel: string;
  nothingFoundTitle: string;
  nothingFoundAction: string;
  viewCaseStudyLabel: string;
  viewPrototypeLabel: string;
  featuredBadge: string;
}

export interface ContactContent {
  title: string;
  description: string;
  formTitle: string;
  formDescription: string;
  quickActionsTitle: string;
  socialTitle: string;
  availabilityTitle: string;
  availabilityStatus: string;
  availabilityMessage: string;
  ctaTitle: string;
  ctaDescription: string;
  bookCallLabel: string;
  downloadResumeLabel: string;
  viewPortfolioLabel: string;
  bookCallSubtext: string;
  resumeSubtext: string;
  portfolioSubtext: string;
}

export interface Labels {
  common: Record<string, string>;
  nav: Record<string, string>;
  form: Record<string, string>;
  buttons: Record<string, string>;
}

export interface PageMetadata {
  [key: string]: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// ============================================================================
// Image Types (REQ-10)
// ============================================================================

export interface ImageData {
  id: string;
  url: string;
  alt: string;
  attribution: Attribution;
  category: string;
  tags?: string[];
}

export interface Attribution {
  author: string;
  source: 'dribbble' | 'behance' | 'unsplash' | 'pexels';
  url: string;
}

// ============================================================================
// Configuration Types (REQ-03, REQ-16)
// ============================================================================

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  author: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  social: SocialLink[];
  navigation: NavItem[];
  theme: ThemeConfig;
}

export interface SocialLink {
  platform: string;
  icon: string;
  url: string;
  username: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    accent: string;
  };
  fonts: {
    sans: string;
  };
  spacing: {
    grid: number;
  };
}

// ============================================================================
// Form Types (REQ-09)
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// Service Response Types
// ============================================================================

export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

export type ProjectCategory =
  | 'Apps'
  | 'Design Systems'
  | 'Campaigns'
  | 'Websites'
  | 'Wireframes'
  | 'UX Flows'
  | 'Branding'
  | 'Use Cases';

export type Technology =
  | 'React'
  | 'Angular'
  | 'Vue.js'
  | 'Next.js'
  | 'React Native'
  | 'TypeScript'
  | 'Figma'
  | 'Design Systems';

export type Platform = 'Web' | 'iOS' | 'Android' | 'Mobile Web' | 'Desktop';

export type Role =
  | 'UX Designer'
  | 'UI Designer'
  | 'Product Designer'
  | 'Frontend Developer'
  | 'Full Stack Developer'
  | 'Design System Lead'
  | 'Lead Designer';
