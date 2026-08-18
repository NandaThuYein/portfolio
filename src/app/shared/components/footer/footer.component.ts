import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SocialLinksComponent } from '../social-links/social-links.component';
import { SocialService } from '../../../core/services/social.service';
import { SocialLinks } from '../../../core/models';

/**
 * Footer rendered on every page. Shows brand, role, social links and copyright.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, SocialLinksComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <a routerLink="/" class="footer__name">Nanda</a>
          <p class="footer__role">Java &amp; Backend Developer</p>
        </div>

        <div class="footer__links">
          <a routerLink="/projects" class="footer__link">Projects</a>
          <a routerLink="/experience" class="footer__link">Experience</a>
          <a routerLink="/github" class="footer__link">GitHub</a>
          <a routerLink="/contact" class="footer__link">Contact</a>
        </div>

        <div class="footer__social">
          <app-social-links [links]="social ?? null" />
        </div>
      </div>
      <div class="container footer__bottom">
        <p class="footer__copy">© {{ year }} Nanda. All rights reserved.</p>
        <p class="footer__built">Built with Angular &amp; Spring.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      border-top: 1px solid var(--border);
      background-color: var(--bg-secondary);
      padding-top: var(--space-7);
      margin-top: var(--space-9);
    }
    .footer__inner {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--space-6);
      padding-bottom: var(--space-6);
    }
    .footer__name {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text);
      text-decoration: none;
      letter-spacing: -0.02em;
    }
    .footer__role {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-top: var(--space-1);
    }
    .footer__links {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .footer__link {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-decoration: none;
      transition: color var(--transition-fast);
    }
    .footer__link:hover { color: var(--accent-light); }
    .footer__bottom {
      border-top: 1px solid var(--border);
      padding: var(--space-4) 0;
      display: flex;
      justify-content: space-between;
      gap: var(--space-3);
      flex-wrap: wrap;
      color: var(--text-muted);
      font-size: 0.825rem;
    }
    .footer__copy, .footer__built { margin: 0; }

    @media (max-width: 640px) {
      .footer__inner {
        grid-template-columns: 1fr;
        text-align: center;
        gap: var(--space-4);
      }
      .footer__links { align-items: center; }
      .footer__bottom { flex-direction: column; text-align: center; }
    }
  `]
})
export class FooterComponent implements OnInit {
  private readonly socialSvc = inject(SocialService);

  social?: SocialLinks;
  year = new Date().getFullYear();

  ngOnInit(): void {
    this.socialSvc.getSocialLinks().subscribe({
      next: (s) => (this.social = s),
      error: () => (this.social = undefined)
    });
  }
}
