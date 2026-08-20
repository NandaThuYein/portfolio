/**
 * A professional experience / work-history entry.
 *
 * Use placeholder strings (`YOUR_COMPANY`, `YOUR_POSITION`, `YOUR_START_DATE`,
 * `YOUR_END_DATE`) for entries that should be filled in later.
 */
export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string | 'Present';
  location: string;
  descriptions: string[];
  responsibilities: string[];
  technologies: string[];
}
