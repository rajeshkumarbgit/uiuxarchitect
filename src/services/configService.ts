/**
 * Configuration Service
 * Manages site-wide configuration and settings
 * References: REQ-03 (Navigation & IA), REQ-16 (Visual Design)
 */

import type { SiteConfig, NavItem, SocialLink } from '../types';
import configData from '../data/config.json';

class ConfigService {
  private config: SiteConfig;

  constructor() {
    this.config = configData as SiteConfig;
  }

  /**
   * Get complete site configuration
   * @returns Site configuration object
   */
  getSiteConfig(): SiteConfig {
    return this.config;
  }

  /**
   * Get site metadata
   * @returns Basic site info
   */
  getSiteInfo() {
    return {
      name: this.config.name,
      title: this.config.title,
      description: this.config.description,
      url: this.config.url
    };
  }

  /**
   * Get author information
   * @returns Author details
   */
  getAuthorInfo() {
    return this.config.author;
  }

  /**
   * Get navigation menu items
   * @returns Array of navigation items
   */
  getNavigationItems(): NavItem[] {
    return this.config.navigation;
  }

  /**
   * Get social media links
   * @returns Array of social links
   */
  getSocialLinks(): SocialLink[] {
    return this.config.social.filter((link) => link.visible !== false);
  }

  /**
   * Get theme configuration
   * @returns Theme settings
   */
  getThemeConfig() {
    return this.config.theme;
  }

  /**
   * Get primary color
   * @returns Primary color hex code
   */
  getPrimaryColor(): string {
    return this.config.theme.colors.primary;
  }

  /**
   * Get accent color
   * @returns Accent color hex code
   */
  getAccentColor(): string {
    return this.config.theme.colors.accent;
  }

  /**
   * Get contact information
   * @returns Contact details
   */
  getContactInfo() {
    return {
      email: this.config.author.email,
      phone: this.config.author.phone,
      location: this.config.author.location
    };
  }

  /**
   * Get navigation item by ID
   * @param id Navigation item ID
   * @returns Navigation item or undefined
   */
  getNavItem(id: string): NavItem | undefined {
    return this.config.navigation.find(item => item.id === id);
  }

  /**
   * Get social link by platform
   * @param platform Platform name (e.g., 'LinkedIn')
   * @returns Social link or undefined
   */
  getSocialLink(platform: string): SocialLink | undefined {
    return this.config.social.find(link => link.platform === platform);
  }
}

// Export singleton instance
export const configService = new ConfigService();
export default configService;
