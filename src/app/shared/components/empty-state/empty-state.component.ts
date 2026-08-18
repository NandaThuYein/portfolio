import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Empty-state placeholder shown when a list / API returns no items.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty" [class.empty--block]="block">
      <div class="empty__icon" aria-hidden="true">{{ icon }}</div>
      <p class="empty__title">{{ title }}</p>
      <p class="empty__message" *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      text-align: center;
      padding: var(--space-7) var(--space-4);
      color: var(--text-secondary);
    }
    .empty__icon {
      font-size: 2rem;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }
    .empty__title {
      color: var(--text);
      font-weight: 600;
      margin: 0;
    }
    .empty__message {
      font-size: 0.875rem;
      margin: 0;
      max-width: 36ch;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = '∅';
  @Input() title = 'Nothing here yet';
  @Input() message?: string;
  @Input() block = false;
}
