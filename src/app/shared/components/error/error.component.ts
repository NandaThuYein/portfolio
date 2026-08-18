import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Friendly error block used when a data fetch fails.
 * Shows a friendly message and an optional retry button.
 */
@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error" [class.error--block]="block">
      <div class="error__icon" aria-hidden="true">⚠</div>
      <div class="error__body">
        <p class="error__title">{{ title }}</p>
        <p class="error__message" *ngIf="message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .error {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex-wrap: wrap;
      padding: var(--space-4) var(--space-5);
      background-color: var(--bg-secondary);
      border: 1px solid var(--border);
      border-left: 3px solid var(--danger);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
    }
    .error--block {
      flex-direction: column;
      text-align: center;
      max-width: 480px;
      margin: var(--space-7) auto;
    }
    .error__icon {
      font-size: 1.5rem;
      color: var(--danger);
    }
    .error__title {
      color: var(--text);
      font-weight: 600;
      margin: 0;
    }
    .error__message {
      font-size: 0.875rem;
      margin: 0;
    }
    .btn-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }
  `]
})
export class ErrorComponent {
  @Input() title = 'Something went wrong';
  @Input() message?: string;
  @Input() block = false;
}
