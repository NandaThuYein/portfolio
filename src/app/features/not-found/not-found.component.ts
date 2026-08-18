import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/services';

/**
 * 404 page — used as wildcard route fallback.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf">
      <div class="container nf__inner">
        <p class="nf__code">404</p>
        <h1 class="nf__title">Page not found</h1>
        <p class="nf__msg">
          The page you're looking for doesn't exist, may have been moved, or
          never existed in the first place.
        </p>
        <div class="nf__actions">
          <a routerLink="/" class="btn btn-primary">← Back to home</a>
          <a routerLink="/projects" class="btn btn-outline">Browse projects</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .nf {
      min-height: 60vh;
      display: flex;
      align-items: center;
      padding: var(--space-7) 0;
    }
    .nf__inner {
      text-align: center;
      max-width: 60ch;
      margin: 0 auto;
    }
    .nf__code {
      font-family: var(--font-mono);
      font-size: clamp(4rem, 12vw, 7rem);
      font-weight: 700;
      color: var(--accent);
      margin: 0;
      line-height: 1;
      letter-spacing: -0.04em;
    }
    .nf__title {
      font-size: clamp(1.5rem, 4vw, 2.25rem);
      font-weight: 700;
      margin: var(--space-4) 0;
    }
    .nf__msg {
      color: var(--text-secondary);
      margin-bottom: var(--space-6);
      line-height: 1.65;
    }
    .nf__actions {
      display: flex;
      gap: var(--space-3);
      justify-content: center;
      flex-wrap: wrap;
    }
  `]
})
export class NotFoundComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Page not found',
      noindex: true
    });
  }
}
