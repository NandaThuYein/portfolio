import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProjectService, SeoService } from '../../../core/services';
import { Project } from '../../../core/models';

import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ErrorComponent } from '../../../shared/components/error/error.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { TechnologyBadgeComponent } from '../../../shared/components/technology-badge/technology-badge.component';

type State = 'loading' | 'ok' | 'error' | 'not-found';

/**
 * Project detail page. Resolves a project by its slug from the route.
 * Shows a friendly "not found" state when the slug does not match any project.
 */
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LoadingComponent,
    ErrorComponent,
    EmptyStateComponent,
    TechnologyBadgeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">

        <ng-container [ngSwitch]="state()">
          <!-- Loading -->
          <ng-container *ngSwitchCase="'loading'">
            <app-loading [block]="true" message="Loading project..." />
          </ng-container>

          <!-- Error -->
          <ng-container *ngSwitchCase="'error'">
            <app-error
              [block]="true"
              title="Unable to load this project."
              message="Please try again later."
            />
          </ng-container>

          <!-- Not found -->
          <ng-container *ngSwitchCase="'not-found'">
            <app-empty-state
              [block]="true"
              icon="∅"
              title="Project not found"
              message="The project you're looking for does not exist or may have been moved."
            />
            <div class="text-center mt-6">
              <a routerLink="/projects" class="btn btn-outline">← Back to all projects</a>
            </div>
          </ng-container>

          <!-- OK -->
          <ng-container *ngSwitchCase="'ok'">
            <a routerLink="/projects" class="back-link">← All projects</a>

            <header class="head" *ngIf="project() as p">
              <div class="head__main">
                <span class="badge badge-accent">{{ p.category }}</span>
                <h1 class="head__title">{{ p.title }}</h1>
                <p class="head__desc">{{ p.description }}</p>
                <div class="head__tech">
                  <app-technology-badge
                    *ngFor="let t of p.technologies"
                    [name]="t"
                    [accent]="true"
                  />
                </div>
              </div>
              <div class="head__img" *ngIf="p.image">
                <img [src]="p.image" [alt]="p.title + ' cover image'" loading="lazy" />
              </div>
            </header>

            <div class="body" *ngIf="project() as p">
              <article class="body__main">
                <h2 class="body__heading">Overview</h2>
                <p class="body__para">{{ p.longDescription }}</p>

                <h2 class="body__heading" *ngIf="p.responsibilities.length">Responsibilities</h2>
                <ul class="body__list" *ngIf="p.responsibilities.length">
                  <li *ngFor="let r of p.responsibilities">{{ r }}</li>
                </ul>

                <h2 class="body__heading" *ngIf="p.highlights.length">Highlights</h2>
                <ul class="body__list" *ngIf="p.highlights.length">
                  <li *ngFor="let h of p.highlights">{{ h }}</li>
                </ul>
              </article>

              <aside class="body__aside">
                <div class="card" *ngIf="p.website">
                  <h3 class="aside-title">Links</h3>
                  <div class="aside-actions">
                    <a *ngIf="p.githubUrl" [href]="p.githubUrl" target="_blank" rel="noopener" class="btn btn-outline btn-sm">GitHub →</a>
                    <a *ngIf="p.liveUrl" [href]="p.liveUrl" target="_blank" rel="noopener" class="btn btn-outline btn-sm">Live demo →</a>
                    <a *ngIf="p.website" [href]="p.website" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Visit website →</a>
                  </div>
                </div>

                <div class="card" *ngIf="p.technologies.length">
                  <h3 class="aside-title">Tech stack</h3>
                  <div class="aside-chips">
                    <app-technology-badge *ngFor="let t of p.technologies" [name]="t" />
                  </div>
                </div>

                <div class="card">
                  <h3 class="aside-title">Category</h3>
                  <p class="aside-text">{{ p.category }}</p>
                </div>
              </aside>
            </div>
          </ng-container>
        </ng-container>

      </div>
    </section>
  `,
  styles: [`
    .back-link {
      display: inline-block;
      margin-bottom: var(--space-4);
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-decoration: none;
      transition: color var(--transition-fast);
    }
    .back-link:hover { color: var(--accent-light); }

    .head {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: var(--space-6);
      align-items: center;
      margin-bottom: var(--space-7);
      padding-bottom: var(--space-6);
      border-bottom: 1px solid var(--border);
    }
    .head__title {
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 800;
      margin: var(--space-3) 0;
      letter-spacing: -0.02em;
    }
    .head__desc {
      color: var(--text-secondary);
      font-size: 1.05rem;
      line-height: 1.65;
      margin-bottom: var(--space-4);
    }
    .head__tech {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .head__img img {
      width: 100%;
      height: auto;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
    }

    .body {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: var(--space-6);
      align-items: start;
    }
    .body__heading {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--accent-light);
      margin: var(--space-5) 0 var(--space-3);
      font-family: var(--font-mono);
      letter-spacing: 0.02em;
    }
    .body__heading:first-child { margin-top: 0; }
    .body__para {
      color: var(--text-secondary);
      line-height: 1.75;
      margin-bottom: var(--space-3);
    }
    .body__list {
      list-style: none;
      padding: 0;
      margin: 0 0 var(--space-3) 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .body__list li {
      position: relative;
      padding-left: var(--space-5);
      color: var(--text-secondary);
      line-height: 1.65;
    }
    .body__list li::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: var(--accent);
    }
    .body__aside {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      position: sticky;
      top: calc(var(--navbar-height) + var(--space-4));
    }
    .aside-title {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: var(--space-3);
      font-family: var(--font-mono);
    }
    .aside-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .aside-actions .btn { width: 100%; }
    .aside-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .aside-text { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }
    .btn-sm {
      padding: 0.5rem 0.875rem;
      font-size: 0.85rem;
    }

    @media (max-width: 900px) {
      .head, .body { grid-template-columns: 1fr; }
      .body__aside { position: static; }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectSvc = inject(ProjectService);
  private readonly seo = inject(SeoService);

  state = signal<State>('loading');
  project = signal<Project | undefined>(undefined);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    this.projectSvc.getProjectBySlug(slug).subscribe({
      next: (p) => {
        if (!p) {
          this.state.set('not-found');
          this.seo.set({
            title: 'Project not found',
            noindex: true
          });
          return;
        }
        this.project.set(p);
        this.state.set('ok');
        this.seo.set({
          title: p.title,
          description: p.description,
          path: `/projects/${p.slug}`
        });
      },
      error: () => {
        this.state.set('error');
        this.seo.set({
          title: 'Project',
          noindex: true
        });
      }
    });
  }
}
