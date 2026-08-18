# Nanda — Angular Portfolio

A premium dark engineering portfolio for **Nanda**, Java & Backend Developer.
Built with **Angular 17** (standalone APIs), TypeScript, SCSS, RxJS and Angular
Signals. Content is driven by JSON files; GitHub data is fetched live from the
public GitHub API. Deployed to GitHub Pages via GitHub Actions.

> All personal information (name, email, social links, experience) is loaded
> from `src/assets/data/*.json`. Replace the placeholders with real values and
> redeploy.

---

## Features

- Standalone Angular 17 components, lazy-loaded routes
- Premium dark engineering/developer design system
- Inter + JetBrains Mono typography
- Mobile-first responsive layout (320 → 1920 px)
- Home, About, Skills, Projects (+ detail), Experience, GitHub, Resume, Contact, 404
- JSON-driven content (edit `src/assets/data/*.json` — no code changes required)
- Public GitHub integration (profile + repositories) with RxJS caching
- Reactive contact form with validation; `mailto:` fallback or external form endpoint
- Loading / error / empty states for every async block
- SEO: page titles, meta tags, Open Graph, canonical, `robots.txt`, `sitemap.xml`
- Accessible: semantic HTML, keyboard nav, focus states, ARIA where needed
- `prefers-reduced-motion` respected
- GitHub Actions workflow for automatic GitHub Pages deployment

---

## Tech stack

| Area        | Choice                                                  |
| ----------- | ------------------------------------------------------- |
| Framework   | Angular 17 (standalone, signals, OnPush)                |
| Language    | TypeScript 5.4 (strict)                                |
| Styling     | SCSS, design tokens via CSS custom properties          |
| Routing     | Angular Router (lazy routes) + wildcard 404 fallback  |
| HTTP        | `provideHttpClient(withFetch())`                       |
| State       | RxJS + Angular Signals (no NgRx)                       |
| Forms       | Reactive Forms                                          |
| Content     | JSON files under `src/assets/data/`                     |
| External    | GitHub public REST API                                  |
| Deployment  | GitHub Pages via GitHub Actions                        |

---

## Architecture

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # strict-typed domain models
│   │   └── services/        # ProfileService, ProjectService, ... GithubService, SeoService
│   ├── shared/components/   # Navbar, Footer, ProjectCard, SectionTitle, Loading, Error,
│   │                        # EmptyState, SocialLinks, BackToTop, TechnologyBadge
│   ├── layouts/main-layout/ # Navbar + RouterOutlet + Footer + BackToTop
│   ├── features/            # home, about, skills, projects (+ detail), experience,
│   │                        # github, resume, contact, not-found
│   ├── app.component.ts
│   ├── app.config.ts        # providers (router, http)
│   └── app.routes.ts        # lazy routes + wildcard 404
├── assets/
│   ├── data/                # profile, projects, skills, experience, social
│   ├── images/              # local project / profile images
│   └── resume/NandaThuYein-Resume.pdf  # bundled PDF resume
├── environments/            # environment.ts / environment.prod.ts (PUBLIC values only)
├── styles.scss              # global design system
└── main.ts                  # bootstrapApplication
public/
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── 404.html                 # GitHub Pages SPA fallback
.github/workflows/deploy.yml # build & deploy on push to main
```

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
cd YOUR_USERNAME.github.io
npm install
```

Requires Node 18 or 20.

---

## Local development

```bash
npm start
# opens http://localhost:4200
```

The dev server picks up `src/environments/environment.ts`.

---

## Build

```bash
npm run build            # production build (default)
npm run build:prod      # explicit production build
```

Output: `dist/nanda-portfolio/browser/`.

The build copies `index.html` to `404.html` automatically as part of the
GitHub Actions workflow (see `.github/workflows/deploy.yml`).

---

## Testing

```bash
npm test                # runs unit tests headless
```

Tests cover: `ProjectService`, `GithubService`, `ProjectCardComponent`,
`ProjectsComponent`, `ContactComponent`, navigation, routing, forms, and 404
behavior.

---

## Linting

The project uses Angular's strict TypeScript settings. Run type-checks with:

```bash
npm run build
```

(No ESLint is bundled by default; add `angular-eslint` if you want lint
rules beyond strict TypeScript.)

---

## GitHub API configuration

1. Open `src/environments/environment.ts` and `environment.prod.ts`.
2. Replace `githubUsername: 'YOUR_USERNAME'` with your real GitHub username.
3. (Optional) Set `contactFormUrl` to a Formspree / Getform endpoint if you
   want form submissions to post to a backend. Leave empty for the `mailto:`
   fallback.
4. (Optional) Update `siteUrl` and `repoName` to match your deployment URL.

> ⚠️ The public GitHub API is rate-limited to 60 requests/hour per IP when
> unauthenticated. Results are cached client-side via `shareReplay`.

> ⚠️ Never put tokens, secrets or passwords in `environment.ts` — everything
> shipped to the browser is public.

---

## JSON content management

All editable content lives in `src/assets/data/`:

| File             | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `profile.json`   | Name, role, bio, focus areas, terminal snippet           |
| `social.json`    | GitHub / LinkedIn / Email / website links                |
| `skills.json`    | Skill list grouped by canonical category                 |
| `experience.json`| Work-history entries (use placeholders if not ready)    |
| `projects.json`  | All portfolio projects with slug, technologies, etc.    |

Update the JSON, commit, push — the site rebuilds automatically.

### Adding a new project

1. Add an entry to `src/assets/data/projects.json` with a unique `slug`.
2. (Optional) Add `assets/images/<slug>.webp`.
3. Commit and push.

### Updating your CV

Replace `src/assets/resume/NandaThuYein-Resume.pdf` with the new PDF, commit and push.

---

## GitHub Pages setup

1. Create a repository named `YOUR_USERNAME.github.io` (user/org pages) **or**
   any other repo (project pages).
2. Push your code to `main`.
3. In the repo settings → **Pages** → **Build and deployment** → **Source**,
   select **GitHub Actions**.
4. Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds
   the app and uploads the artifact to GitHub Pages automatically.

The workflow also generates a `404.html` (copy of `index.html`) so deep links
to `/projects/some-slug` work on GitHub Pages without hash routing.

### Custom domain

1. In repo settings → **Pages** → **Custom domain**, enter your domain.
2. Add a `CNAME` record pointing to `YOUR_USERNAME.github.io`.
3. Update `siteUrl` in `src/environments/environment.prod.ts` to your domain.
4. Update `https://YOUR_USERNAME.github.io/` in `public/robots.txt` and
   `public/sitemap.xml`.
5. Commit and push.

---

## Customizing the design

The design system is defined as CSS custom properties in `src/styles.scss`.
Tweak colors, spacing, radii and shadows in the `:root` selector — every
component will pick up the changes automatically.

```scss
:root {
  --bg: #07090d;
  --accent: #4da3ff;
  --font-sans: 'Inter', ...;
  /* ... */
}
```

---

## Troubleshooting

| Symptom                                          | Fix                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| Deep links return GitHub's 404 page              | Make sure the `404.html` fallback exists in the build output. The workflow copies `index.html` to `404.html` automatically. |
| GitHub section shows "Unable to load"            | Public API rate limit (60/h). Wait, or set up a personal token proxy on a backend. **Never** ship tokens to the browser. |
| GitHub section shows "username not configured"   | Replace `YOUR_USERNAME` in `src/environments/environment.prod.ts`. |
| Fonts not loading                                | The app loads fonts via Google Fonts CDN. If your network blocks it, vendor the fonts locally. |
| Project images broken                            | `src/assets/images/*.webp` are placeholder SVGs with `.webp` extension. Replace with real `.webp` images. |
| Build budget errors                              | Increase `budgets` in `angular.json` if you add large dependencies. |
| Contact form does not submit                     | If `contactFormUrl` is empty, the form falls back to `mailto:`. Set `contactFormUrl` to a form backend to enable direct submissions. |

---

## Future improvements

- Lighthouse audit + image optimization pass (real `.webp` screenshots)
- Local font vendoring for full offline support
- Light/dark theme switcher persisted to `localStorage`
- Unit & e2e test coverage thresholds in CI
- Personal-access-token proxy for higher GitHub API rate limits
- Sitemap generation script that reads `projects.json`
- Structured data (JSON-LD) for `Person` and `ProfilePage`

---

## License

MIT — © Nanda Thu Yein. See [`LICENSE`](./LICENSE) (or just keep this README).
