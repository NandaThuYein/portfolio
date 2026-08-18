import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProfileService, SkillService, SeoService } from '../../core/services';
import { Profile, SkillCategoryGroup } from '../../core/models';

import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { TechnologyBadgeComponent } from '../../shared/components/technology-badge/technology-badge.component';

/**
 * About page — focused on backend / enterprise development philosophy.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SectionTitleComponent,
    TechnologyBadgeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <app-section-title
          eyebrow="// About"
          title="{{ profile?.name || 'Nanda' }}"
          [subtitle]="profile?.tagline"
        />

        <div class="about">
          <div class="about__main">
            <p class="about__lead">{{ profile?.longDescription }}</p>

            <h3 class="about__heading">What I do</h3>
            <p class="about__para">
              I design and build backend systems for enterprise contexts —
              REST APIs, billing platforms, allocation systems, form-management
              systems, payment integrations and legacy modernization efforts.
              My focus is on correctness, maintainability and clean
              architecture, rather than chasing the latest library.
            </p>

            <h3 class="about__heading">How I work</h3>
            <ul class="about__list">
              <li>
                <strong>Backend-first.</strong>
                Spring Boot is my default. I prefer explicit REST contracts,
                proper exception handling and audit trails over clever tricks.
              </li>
              <li>
                <strong>Database-aware.</strong>
                I treat the schema as a contract. Migrations (Flyway) are
                versioned and reviewed like application code.
              </li>
              <li>
                <strong>Integration-minded.</strong>
                OAuth2, JWT, payment gateways, webhooks and message brokers
                are part of my day-to-day — with attention to idempotency,
                retries and observability.
              </li>
              <li>
                <strong>Modernization-friendly.</strong>
                I have migrated legacy JSF / PrimeFaces / MyBatis stacks
                toward Spring Boot without breaking years of accumulated
                business logic.
              </li>
            </ul>

            <h3 class="about__heading">Currently</h3>
            <p class="about__para">
              {{ profile?.availability }}. Based in {{ profile?.location }}.
              Reachable at
              <a [href]="'mailto:' + profile?.email">{{ profile?.email }}</a>.
            </p>

            <div class="about__actions">
              <a routerLink="/projects" class="btn btn-primary">View projects</a>
              <a routerLink="/contact" class="btn btn-outline">Contact me</a>
            </div>
          </div>

          <aside class="about__aside">
            <div class="card">
              <h4 class="aside-title">Quick facts</h4>
              <dl class="facts">
                <dt>Name</dt><dd>{{ profile?.name }}</dd>
                <dt>Role</dt><dd>{{ profile?.title }}</dd>
                <dt>Location</dt><dd>{{ profile?.location }}</dd>
                <dt>Focus</dt><dd>Java, Spring Boot, REST APIs</dd>
                <dt>Availability</dt><dd>{{ profile?.availability }}</dd>
              </dl>
            </div>

            <div class="card" *ngFor="let g of skillGroups.slice(0, 3)">
              <h4 class="aside-title">{{ g.category }}</h4>
              <div class="aside-chips">
                <app-technology-badge
                  *ngFor="let s of g.skills.slice(0, 5)"
                  [name]="s.name"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: var(--space-6);
      align-items: start;
    }
    .about__lead {
      font-size: 1.15rem;
      line-height: 1.75;
      color: var(--text);
      margin-bottom: var(--space-6);
    }
    .about__heading {
      font-size: 1.1rem;
      font-weight: 700;
      margin-top: var(--space-6);
      margin-bottom: var(--space-3);
      color: var(--accent-light);
      font-family: var(--font-mono);
      letter-spacing: 0.02em;
    }
    .about__para {
      color: var(--text-secondary);
      line-height: 1.75;
      margin-bottom: var(--space-4);
    }
    .about__list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .about__list li {
      position: relative;
      padding-left: var(--space-5);
      color: var(--text-secondary);
      line-height: 1.7;
    }
    .about__list li::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: var(--accent);
    }
    .about__list strong { color: var(--text); }
    .about__actions {
      display: flex;
      gap: var(--space-3);
      margin-top: var(--space-6);
      flex-wrap: wrap;
    }
    .about__aside {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    .aside-title {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: var(--space-3);
      font-family: var(--font-mono);
    }
    .facts {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--space-2) var(--space-4);
      margin: 0;
    }
    .facts dt {
      color: var(--text-muted);
      font-size: 0.825rem;
      font-family: var(--font-mono);
    }
    .facts dd {
      margin: 0;
      color: var(--text);
      font-size: 0.9rem;
    }
    .aside-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    @media (max-width: 900px) {
      .about { grid-template-columns: 1fr; }
    }
  `]
})
export class AboutComponent implements OnInit {
  private readonly profileSvc = inject(ProfileService);
  private readonly skillSvc = inject(SkillService);
  private readonly seo = inject(SeoService);

  profile?: Profile;
  skillGroups: SkillCategoryGroup[] = [];

  ngOnInit(): void {
    this.seo.set({
      title: 'About',
      description:
        'About Nanda — Java & Backend Developer. Backend systems, REST APIs and enterprise applications.'
    });
    this.profileSvc.getProfile().subscribe((p) => (this.profile = p));
    this.skillSvc.getGroupedSkills().subscribe((g) => (this.skillGroups = g));
  }
}
