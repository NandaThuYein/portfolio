import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExperienceService, SeoService } from '../../core/services';
import { Experience } from '../../core/models';

import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

/**
 * Experience page — renders a responsive vertical timeline of roles.
 * Placeholders are shown until real experience data is filled in.
 */
@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    CommonModule,
    SectionTitleComponent,
    LoadingComponent,
    ErrorComponent,
    EmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <app-section-title
          eyebrow="// Experience"
          title="Professional timeline"
          subtitle="A summary of roles and responsibilities. Replace placeholders in src/assets/data/experience.json with real entries."
        />

        <ng-container *ngIf="state() === 'loading'">
          <app-loading [block]="true" message="Loading experience..." />
        </ng-container>

        <ng-container *ngIf="state() === 'error'">
          <app-error
            [block]="true"
            title="Unable to load experience."
            message="Please try again later."
          />
        </ng-container>

        <ng-container *ngIf="state() === 'ok'">
          <ng-container *ngIf="items.length; else empty">
            <ol class="timeline">
              <li class="entry" *ngFor="let e of items">
                <div class="entry__marker" aria-hidden="true">
                  <span class="entry__dot"></span>
                </div>
                <div class="entry__body card">
                  <header class="entry__head">
                    <div>
                      <h3 class="entry__role">{{ e.position }}</h3>
                      <p class="entry__company">
                        {{ e.company }} <span *ngIf="e.location">· {{ e.location }}</span>
                      </p>
                    </div>
                    <span class="badge">{{ e.startDate }} – {{ e.endDate }}</span>
                  </header>

                  <p class="entry__desc">{{ e.description }}</p>

                  <div class="entry__sub" *ngIf="e.responsibilities.length">
                    <h4 class="entry__sub-title">Responsibilities</h4>
                    <ul class="entry__list">
                      <li *ngFor="let r of e.responsibilities">{{ r }}</li>
                    </ul>
                  </div>

                  <div class="entry__sub" *ngIf="e.technologies.length">
                    <h4 class="entry__sub-title">Technologies</h4>
                    <div class="entry__chips">
                      <span class="badge" *ngFor="let t of e.technologies">{{ t }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ol>
          </ng-container>

          <ng-template #empty>
            <app-empty-state
              [block]="true"
              icon="∅"
              title="No experience entries yet."
              message="Add entries to src/assets/data/experience.json to populate this timeline."
            />
          </ng-template>
        </ng-container>
      </div>
    </section>
  `,
  styles: [`
    .timeline {
      list-style: none;
      padding: 0;
      margin: 0;
      position: relative;
    }
    .entry {
      position: relative;
      padding-left: var(--space-7);
      padding-bottom: var(--space-5);
    }
    .entry:last-child { padding-bottom: 0; }

    .entry__marker {
      position: absolute;
      left: 7px;
      top: 6px;
      bottom: -6px;
      width: 2px;
      background-color: var(--border);
    }
    .entry:last-child .entry__marker { display: none; }
    .entry__dot {
      position: absolute;
      left: -6px;
      top: 0;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: var(--accent);
      border: 3px solid var(--bg);
      box-shadow: 0 0 0 2px var(--accent);
    }
    .entry__body { padding: var(--space-5); }
    .entry__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-3);
      flex-wrap: wrap;
      margin-bottom: var(--space-3);
    }
    .entry__role {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
    }
    .entry__company {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-family: var(--font-mono);
      margin: var(--space-1) 0 0 0;
    }
    .entry__desc {
      color: var(--text-secondary);
      line-height: 1.65;
      margin: 0 0 var(--space-3) 0;
    }
    .entry__sub {
      margin-top: var(--space-3);
      padding-top: var(--space-3);
      border-top: 1px solid var(--border);
    }
    .entry__sub-title {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin: 0 0 var(--space-2) 0;
      font-family: var(--font-mono);
    }
    .entry__list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .entry__list li {
      position: relative;
      padding-left: var(--space-5);
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 0.925rem;
    }
    .entry__list li::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: var(--accent);
    }
    .entry__chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    @media (max-width: 640px) {
      .entry { padding-left: var(--space-6); }
      .entry__marker { left: 6px; }
    }
  `]
})
export class ExperienceComponent implements OnInit {
  private readonly experienceSvc = inject(ExperienceService);
  private readonly seo = inject(SeoService);

  items: Experience[] = [];
  state = signal<'loading' | 'ok' | 'error'>('loading');

  ngOnInit(): void {
    this.seo.set({
      title: 'Experience',
      description:
        'Experience — Nanda, Java & Backend Developer. Professional timeline of roles and responsibilities.'
    });
    this.experienceSvc.getExperience().subscribe({
      next: (e) => {
        this.items = e;
        this.state.set('ok');
      },
      error: () => this.state.set('error')
    });
  }
}
