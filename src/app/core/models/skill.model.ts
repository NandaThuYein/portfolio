/**
 * A skill / technology item, grouped by category.
 */
export interface Skill {
  name: string;
  category: SkillCategory;
  description: string;
  /** Optional experience level — purely qualitative, not a fake percentage. */
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

/**
 * Canonical skill categories shown on the Skills page.
 */
export type SkillCategory =
  | 'Backend'
  | 'Database'
  | 'Integration'
  | 'Frontend'
  | 'DevOps'
  | 'Tools';

/**
 * Aggregated skill category used by SkillService to group skills.
 */
export interface SkillCategoryGroup {
  category: SkillCategory;
  skills: Skill[];
}
