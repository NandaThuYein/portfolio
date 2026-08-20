import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/services';
import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';

/**
 * Resume page — links to the bundled PDF (view + download).
 * The PDF lives at src/assets/resume/NandaThuYein-Resume.pdf and is included in
 * the Angular build via the assets glob in angular.json.
 */
@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <app-section-title
          eyebrow="// Resume"
          title="Download my CV"
          subtitle="A one-page PDF summary of my background, skills and project history."
        />

        <div class="resume-card card">
          <div class="resume-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="56" height="56" fill="currentColor">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              <path d="M8 12h8v2H8zm0 4h8v2H8z"/>
            </svg>
          </div>
          <div class="resume-card__body">
            <h3 class="resume-card__title">NandaThuYein-Resume.pdf</h3>
            <p class="resume-card__desc">
              Latest version of my CV. Updated whenever my experience or
              project history meaningfully changes.
            </p>
            <div class="resume-card__actions">
              <a [href]="cvPath" target="_blank" rel="noopener" class="btn btn-primary">View CV</a>
              <a [href]="cvPath" download class="btn btn-outline">Download CV</a>
            </div>
          </div>
        </div>

        <div class="update-note">
          <a routerLink="/contact" class="btn btn-ghost">Looking for something specific? Contact me →</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .resume-card {
      display: flex;
      gap: var(--space-5);
      align-items: flex-start;
      padding: var(--space-6);
      max-width: 640px;
    }
    .resume-card__icon {
      color: var(--accent);
      flex-shrink: 0;
      padding: var(--space-3);
      background-color: var(--accent-dim);
      border-radius: var(--radius-md);
      border: 1px solid rgba(77, 163, 255, 0.25);
    }
    .resume-card__title {
      font-size: 1.1rem;
      font-weight: 700;
      font-family: var(--font-mono);
      margin-bottom: var(--space-2);
    }
    .resume-card__desc {
      color: var(--text-secondary);
      font-size: 0.925rem;
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    .resume-card__actions {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }
    .update-note {
      margin-top: var(--space-6);
      padding: var(--space-4) var(--space-5);
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    .update-note p { margin: 0 0 var(--space-3) 0; }
    .update-note code {
      background-color: var(--bg-secondary);
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
    }

    @media (max-width: 640px) {
      .resume-card {
        flex-direction: column;
      }
    }
  `]
})
export class ResumeComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly cvPath = 'assets/resume/NandaThuYein-Resume.pdf';

  ngOnInit(): void {
    this.seo.set({
      title: 'Resume',
      description:
        'Resume / CV — Nanda, Java & Backend Developer. Downloadable PDF version of my CV.'
    });
  }
}
