/**
 * Production environment configuration.
 *
 * NOTE: All values here are PUBLIC and shipped to the browser.
 * NEVER put secrets, tokens, or passwords in this file.
 */
export const environment = {
  production: true,
  /** Replace with your real GitHub username (public data only). */
  githubUsername: 'NandaThuYein',
  /**
   * Optional contact form endpoint (e.g. Formspree, Getform).
   * Leave empty to fall back to a `mailto:` link.
   */
  contactFormUrl: 'https://formspree.io/f/xjyblgvw',
  /**
   * Production site URL (your GitHub Pages URL or custom domain).
   * For a project repo: https://YOUR_USERNAME.github.io/nanda-portfolio
   * For YOUR_USERNAME.github.io repo: https://YOUR_USERNAME.github.io
   */
  siteUrl: 'https://nandathuyein.github.io/portfolio',
  /** Repository name — used as the GitHub Pages base href. */
  repoName: 'portfolio'
};
