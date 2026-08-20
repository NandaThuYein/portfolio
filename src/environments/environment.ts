/**
 * Development environment configuration.
 *
 * NOTE: All values here are PUBLIC and shipped to the browser.
 * NEVER put secrets, tokens, or passwords in this file.
 */
export const environment = {
  production: false,
  /** Replace with your real GitHub username (public data only). */
  githubUsername: 'NandaThuYein',
  /**
   * Optional contact form endpoint (e.g. Formspree, Getform).
   * Leave empty to fall back to a `mailto:` link.
   */
  contactFormUrl: 'https://formspree.io/f/xjyblgvw',
  /** Site URL used for canonical / Open Graph tags in dev. */
  siteUrl: 'http://localhost:4200',
  /** Repository name — used as the GitHub Pages base href. */
  repoName: 'portfolio'
};
