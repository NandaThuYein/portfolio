import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Renders a single technology badge. Small, reusable.
 */
@Component({
  selector: 'app-technology-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class.badge-accent]="accent">{{ name }}</span>`,
  styles: [``]
})
export class TechnologyBadgeComponent {
  @Input({ required: true }) name!: string;
  @Input() accent = false;
}
