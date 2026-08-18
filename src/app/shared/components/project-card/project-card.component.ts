import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../../core/models';

/**
 * Compact card used to render a single project on grids.
 * Links to `/projects/:slug`.
 */
@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [routerLink]="['/projects', project.slug]"
      class="card card-hover project-card"
      [attr.aria-label]="'View project: ' + project.title"
    >
      <div class="project-card__top">
        <span class="badge badge-accent">{{ project.category }}</span>
        <span class="project-card__featured" *ngIf="project.featured">★ Featured</span>
      </div>

      <h3 class="project-card__title">{{ project.title }}</h3>
      <p class="project-card__desc">{{ project.description }}</p>

      <div class="project-card__tech" *ngIf="project.technologies.length">
        <span class="badge" *ngFor="let t of project.technologies.slice(0, 4)">{{ t }}</span>
        <span class="badge" *ngIf="project.technologies.length > 4">+{{ project.technologies.length - 4 }}</span>
      </div>

      <span class="project-card__link">View details →</span>
    </a>
  `,
  styles: [`
    .project-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      text-decoration: none;
      height: 100%;
    }
    .project-card__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
    }
    .project-card__featured {
      font-size: 0.7rem;
      color: var(--warning);
      font-family: var(--font-mono);
    }
    .project-card__title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text);
    }
    .project-card__desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.6;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .project-card__tech {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .project-card__link {
      font-size: 0.85rem;
      color: var(--accent);
      font-weight: 500;
      margin-top: auto;
    }
    .project-card:hover .project-card__link { color: var(--accent-light); }
  `]
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
}
