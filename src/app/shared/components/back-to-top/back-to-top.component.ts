import {
  Component,
  ChangeDetectionStrategy,
  signal,
  HostListener,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Floating "back to top" button that appears after scrolling.
 * Respects reduced-motion via CSS.
 */
@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="back-to-top"
      *ngIf="visible()"
      (click)="scrollTop()"
      aria-label="Back to top"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
        <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
      </svg>
    </button>
  `,
  styles: [`
    .back-to-top {
      position: fixed;
      right: var(--space-4);
      bottom: var(--space-4);
      width: 44px;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-card);
      color: var(--accent-light);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition);
      box-shadow: var(--shadow-md);
      z-index: 100;
    }
    .back-to-top:hover {
      border-color: var(--accent);
      background-color: var(--accent-dim);
      transform: translateY(-2px);
    }
    @media (prefers-reduced-motion: reduce) {
      .back-to-top { transition: none; }
    }
  `]
})
export class BackToTopComponent {
  visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 600);
  }

  scrollTop(): void {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }
}
