import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

/**
 * Top-level routes. All feature routes are lazy-loaded for a small initial
 * bundle. The wildcard route is the 404 fallback.
 *
 * For GitHub Pages we rely on the SPA fallback: the deploy workflow uploads
 * a single `index.html` 404 fallback via `actions/upload-pages-artifact`.
 * Hash routing is intentionally NOT used to keep URLs clean.
 */
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
        title: 'Nanda | Senior Software Developer'
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/about.component').then(
            (m) => m.AboutComponent
          ),
        title: 'Nanda | About'
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/skills/skills.component').then(
            (m) => m.SkillsComponent
          ),
        title: 'Nanda | Skills'
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects.component').then(
            (m) => m.ProjectsComponent
          ),
        title: 'Nanda | Projects'
      },
      {
        path: 'projects/:slug',
        loadComponent: () =>
          import(
            './features/projects/project-detail/project-detail.component'
          ).then((m) => m.ProjectDetailComponent),
        title: 'Nanda | Project'
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./features/experience/experience.component').then(
            (m) => m.ExperienceComponent
          ),
        title: 'Nanda | Experience'
      },
      {
        path: 'github',
        loadComponent: () =>
          import('./features/github/github.component').then(
            (m) => m.GithubComponent
          ),
        title: 'Nanda | GitHub'
      },
      {
        path: 'resume',
        loadComponent: () =>
          import('./features/resume/resume.component').then(
            (m) => m.ResumeComponent
          ),
        title: 'Nanda | Resume'
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
        title: 'Nanda | Contact'
      },
      { path: '404', loadComponent: () =>
        import('./features/not-found/not-found.component').then(
          (m) => m.NotFoundComponent
        ),
        title: 'Nanda | Page Not Found'
      },
      { path: '**', redirectTo: '404' }
    ]
  }
];
