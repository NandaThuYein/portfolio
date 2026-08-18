import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Generic loading indicator. Inline by default; pass `block` for a centered
 * full-section spinner.
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loading" [class.loading--block]="block">
      <span class="loading__spinner" aria-hidden="true"></span>
      <span class="sr-only">Loading</span>
      <span class="loading__label" *ngIf="message">{{ message }}</span>
    </div>
  `,
  styles: [`
    .loading {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    .loading--block {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--space-7) var(--space-4);
      flex-direction: column;
      gap: var(--space-3);
    }
    .loading__spinner {
      width: 18px;
      height: 18px;
      border: 2px solid var(--border-strong);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 700ms linear infinite;
    }
    .loading--block .loading__spinner {
      width: 32px;
      height: 32px;
    }
    .loading__label {
      font-family: var(--font-mono);
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) {
      .loading__spinner { animation: none; }
    }
  `]
})
export class LoadingComponent {
  @Input() message?: string;
  @Input() block = false;
}
