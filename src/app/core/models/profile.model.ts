/**
 * Personal profile / identity model.
 */
export interface Profile {
  name: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  location: string;
  email: string;
  availability: string;
  /** Years of professional experience (omit if you don't want to disclose). */
  yearsExperience?: number;
  /** Headline focus areas shown on the home page hero. */
  focusAreas: string[];
  /** Terminal-style snippet shown on the home hero. */
  terminal: {
    whoami: string;
    stack: string[];
    status: string;
  };
}
