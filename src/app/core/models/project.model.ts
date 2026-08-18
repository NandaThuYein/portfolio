/**
 * Canonical project categories used for filtering.
 */
export type ProjectCategory =
  | 'Enterprise'
  | 'Application System'
  | 'Management System'
  | 'Migration'
  | 'Integration'
  | 'AI';

/**
 * A portfolio project entry.
 */
export interface Project {
  id: string;
  title: string;
  /** URL-safe identifier used by the /projects/:slug route. */
  slug: string;
  /** One-line summary used on project cards. */
  description: string;
  /** Long-form overview shown on the project detail page. */
  longDescription: string;
  technologies: string[];
  category: ProjectCategory;
  /** Whether to show the project on the home page / featured section. */
  featured: boolean;
  /** Local image under src/assets/images/. */
  image?: string;
  /** Optional GitHub repository URL. */
  githubUrl?: string;
  /** Optional live demo URL. */
  liveUrl?: string;
  /** Optional production website URL (distinct from a demo). */
  website?: string;
  /** Bulleted list of "what I built / what I owned". */
  responsibilities: string[];
  /** Bulleted list of notable outcomes / highlights. */
  highlights: string[];
}
