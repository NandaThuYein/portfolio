import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectService, SeoService } from '../../core/services';
import { Project, ProjectCategory } from '../../core/models';

import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

type LoadState = 'loading' | 'ok' | 'error';

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All',
  'Enterprise',
  'Application System',
  'Management System',
  'Migration',
  'Integration',
  'AI'
];

/**
 * Projects list page — featured projects first, then a filterable,
 * searchable grid of all projects.
 */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SectionTitleComponent,
    ProjectCardComponent,
    LoadingComponent,
    ErrorComponent,
    EmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <app-section-title
          eyebrow="// Projects"
          title="Work &amp; case studies"
          subtitle="Enterprise platforms, integrations, modernization and AI work I've shipped."
        />

        <!-- Featured -->
        <ng-container *ngIf="state() === 'ok' && featured.length">
          <h2 class="block-title">Featured projects</h2>
          <div class="grid">
            <app-project-card *ngFor="let p of featured" [project]="p" />
          </div>
        </ng-container>

        <h2 class="block-title" *ngIf="state() === 'ok'">All projects</h2>

        <!-- Filters -->
        <div class="filters" *ngIf="state() === 'ok'">
          <div class="search">
            <label for="search" class="sr-only">Search projects</label>
            <input
              id="search"
              type="search"
              class="form-control"
              placeholder="Search by name, technology or description..."
              [ngModel]="query()"
              (ngModelChange)="query.set($event)"
            />
          </div>
          <div class="cats" role="group" aria-label="Filter by category">
            <button
              type="button"
              *ngFor="let c of categories"
              class="chip"
              [class.active]="active() === c"
              (click)="active.set(c)"
            >{{ c }}</button>
          </div>
        </div>

        <!-- States -->
        <ng-container *ngIf="state() === 'loading'">
          <app-loading [block]="true" message="Loading projects..." />
        </ng-container>

        <ng-container *ngIf="state() === 'error'">
          <app-error
            [block]="true"
            title="Unable to load projects."
            message="Please try again later."
          />
        </ng-container>

        <ng-container *ngIf="state() === 'ok'">
          <ng-container *ngIf="filtered().length; else empty">
            <div class="grid">
              <app-project-card *ngFor="let p of filtered()" [project]="p" />
            </div>
          </ng-container>
          <ng-template #empty>
            <app-empty-state
              [block]="true"
              icon="∅"
              title="No projects match your filters."
              message="Try clearing the search or choosing a different category."
            />
          </ng-template>
        </ng-container>
      </div>
    </section>
  `,
  styles: [`
    .block-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: var(--space-6) 0 var(--space-4);
      padding-top: var(--space-5);
      border-top: 1px solid var(--border);
      color: var(--text);
    }
    .block-title:first-of-type {
      border-top: none;
      padding-top: 0;
      margin-top: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-4);
      align-items: stretch;
    }
    .filters {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-bottom: var(--space-5);
    }
    .search input {
      width: 100%;
    }
    .cats {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }
    .chip {
      padding: 0.45rem 0.875rem;
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.825rem;
      font-weight: 500;
      font-family: var(--font-sans);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .chip:hover {
      border-color: var(--border-strong);
      color: var(--text);
    }
    .chip.active {
      background-color: var(--accent-dim);
      border-color: var(--accent);
      color: var(--accent-light);
    }
  `]
})
export class ProjectsComponent implements OnInit {
  private readonly projectSvc = inject(ProjectService);
  private readonly seo = inject(SeoService);

  readonly categories = CATEGORIES;

  projects: Project[] = [];
  featured: Project[] = [];

  query = signal('');
  active = signal<ProjectCategory | 'All'>('All');
  state = signal<LoadState>('loading');

  filtered = computed<Project[]>(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.active();
    return this.projects.filter((p) => {
      const matchesCat = cat === 'All' || p.category === cat;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    });
  });

  ngOnInit(): void {
    this.seo.set({
      title: 'Projects',
      description:
        'Projects by Nanda — enterprise billing, examination systems, payment integration and AI chatbot.'
    });
    this.projectSvc.getProjects().subscribe({
      next: (p) => {
        this.projects = p;
        this.featured = p.filter((x) => x.featured);
        this.state.set('ok');
      },
      error: () => this.state.set('error')
    });
  }
}
