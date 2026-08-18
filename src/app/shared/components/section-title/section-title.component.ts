import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Standardized section header used across pages.
 * Renders an optional eyebrow (mono accent), title and subtitle.
 */
@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="section-head" [class.center]="center">
      <span class="section-eyebrow" *ngIf="eyebrow">{{ eyebrow }}</span>
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
    </header>
  `,
  styles: [`
    .section-head {
      margin-bottom: var(--space-6);
    }
    .section-head.center {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .section-head.center .section-subtitle { margin-left: auto; margin-right: auto; }
  `]
})
export class SectionTitleComponent {
  @Input() eyebrow?: string;
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() center = false;
}
