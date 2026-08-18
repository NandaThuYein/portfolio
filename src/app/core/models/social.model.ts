/**
 * Social links model.
 * Only populate fields you actually have. Empty strings render as omitted links.
 */
export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  twitter?: string;
  website?: string;
}
