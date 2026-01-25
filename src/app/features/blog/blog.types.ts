export type BlogCategory =
  | 'architecture'
  | 'design-system'
  | 'performance'
  | 'testing'
  | 'deployment'
  | 'security'
  | 'angular';

/**
 * Represents a blog article with metadata and content information.
 */
export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string; // Path to markdown file
  featuredImage?: string;
  author: {
    name: string;
    title: string;
  };
  publishedAt: string; // ISO Date string
  updatedAt?: string;
  readingTimeMinutes: number;
  tags: string[];
  category: BlogCategory;
  status: 'draft' | 'published';
}
