/**
 * Image Service
 * Manages image URLs from Dribbble/Behance with proper attribution
 * References: REQ-10 (Content Management)
 */

import type { ImageData } from '../types';
import imagesData from '../data/images.json';

class ImageService {
  private images: ImageData[];

  constructor() {
    this.images = imagesData.images as ImageData[];
  }

  /**
   * Get image by ID
   * @param id Image identifier
   * @returns Image data with URL and attribution
   */
  getImage(id: string): ImageData | undefined {
    return this.images.find(img => img.id === id);
  }

  /**
   * Get image URL by ID
   * @param id Image identifier
   * @returns Image URL or fallback
   */
  getImageUrl(id: string): string {
    const image = this.getImage(id);
    return image?.url || this.getFallbackImage();
  }

  /**
   * Get images by category
   * @param category Category name (e.g., 'hero', 'project-cover', 'case-study')
   * @returns Array of images in category
   */
  getImagesByCategory(category: string): ImageData[] {
    return this.images.filter(img => img.category === category);
  }

  /**
   * Get hero images
   * @returns Array of hero images
   */
  getHeroImages(): ImageData[] {
    return this.getImagesByCategory('hero');
  }

  /**
   * Get project cover images
   * @returns Array of project cover images
   */
  getProjectCovers(): ImageData[] {
    return this.getImagesByCategory('project-cover');
  }

  /**
   * Get attribution for an image
   * @param imageId Image identifier
   * @returns Attribution object or null
   */
  getAttribution(imageId: string) {
    const image = this.getImage(imageId);
    return image?.attribution || null;
  }

  /**
   * Get all images
   * @returns All images
   */
  getAllImages(): ImageData[] {
    return this.images;
  }

  /**
   * Get fallback image URL
   * @returns Fallback image URL
   */
  private getFallbackImage(): string {
    return '/images/work/ds-cover.webp';
  }

  /**
   * Search images by tags
   * @param tags Array of tags to search
   * @returns Matching images
   */
  searchByTags(tags: string[]): ImageData[] {
    return this.images.filter(img =>
      img.tags?.some(tag => tags.includes(tag))
    );
  }
}

// Export singleton instance
export const imageService = new ImageService();
export default imageService;
