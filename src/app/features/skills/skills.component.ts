import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillService, SeoService } from '../../core/services';
import { SkillCategoryGroup } from '../../core/models';

import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ErrorComponent } from '../../shared/components/error/error.component';

/**
 * Skills page — renders all skills grouped by canonical category.
 * No fake percentages; uses qualitative experienceLevel where available.
 */
@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    CommonModule,
    SectionTitleComponent,
    LoadingComponent,
    ErrorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <app-section-title
          eyebrow="// Skills"
          title="Technology stack"
          subtitle="Backend, database, integration, frontend, DevOps and tooling — what I use day-to-day."
        />

        <ng-container *ngIf="state() === 'loading'; else ready">
          <app-loading [block]="true" message="Loading skills..." />
        </ng-container>

        <ng-template #ready>
          <ng-container *ngIf="state() === 'error'; else ok">
            <app-error
              [block]="true"
              title="Unable to load skills."
              message="Please try again later."
            />
          </ng-container>

          <ng-template #ok>
            <div class="grid">
              <article class="card group" *ngFor="let g of groups">
                <header class="group__header">
                  <h2 class="group__title">{{ g.category }}</h2>
                  <span class="badge">{{ g.skills.length }}</span>
                </header>

                <ul class="group__list">
                  <li class="skill" *ngFor="let s of g.skills">
                    <div class="skill__head">
                      <span class="skill__name">{{ s.name }}</span>
                      <span class="skill__level" *ngIf="s.experienceLevel">{{ s.experienceLevel }}</span>
                    </div>
                    <p class="skill__desc">{{ s.description }}</p>
                  </li>
                </ul>
              </article>
            </div>
          </ng-template>
        </ng-template>
      </div>
    </section>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: var(--space-4);
      align-items: start;
    }
    .group {
      padding: var(--space-5);
    }
    .group__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--border);
      margin-bottom: var(--space-4);
    }
    .group__title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--accent-light);
      font-family: var(--font-mono);
    }
    .group__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .skill {
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--border);
    }
    .skill:last-child { border-bottom: none; padding-bottom: 0; }
    .skill__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
      margin-bottom: var(--space-1);
    }
    .skill__name {
      font-weight: 600;
      color: var(--text);
    }
    .skill__level {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      background-color: var(--accent-dim);
      color: var(--accent-light);
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .skill__desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.55;
    }
  `]
})
export class SkillsComponent implements OnInit {
  private readonly skillSvc = inject(SkillService);
  private readonly seo = inject(SeoService);

  groups: SkillCategoryGroup[] = [];
  state = signal<'loading' | 'ok' | 'error'>('loading');

  ngOnInit(): void {
    this.seo.set({
      title: 'Skills',
      description:
        'Skills — Nanda, Java & Backend Developer. Backend, database, integration, DevOps and tooling.'
    });
    this.skillSvc.getGroupedSkills().subscribe({
      next: (g) => {
        this.groups = g;
        this.state.set('ok');
      },
      error: () => this.state.set('error')
    });
  }
}
