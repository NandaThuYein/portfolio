import {
  Component,
  ChangeDetectionStrategy,
  signal,
  HostListener,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  path: string;
  label: string;
}

/**
 * Sticky top navigation. Desktop links collapse into a mobile menu below 768px.
 * Active link is highlighted via `routerLinkActive`.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="navbar" [class.navbar--scrolled]="scrolled()">
      <div class="container navbar__inner">
        <a routerLink="/" class="navbar__brand" aria-label="Nanda — home">
          <span class="navbar__brand-mark">&lt;/&gt;</span>
          <span class="navbar__brand-name">Nanda Thu Yein</span>
        </a>

        <button
          type="button"
          class="navbar__toggle"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          aria-label="Toggle navigation menu"
        >
          <span class="navbar__bar" [class.open]="menuOpen()"></span>
          <span class="navbar__bar" [class.open]="menuOpen()"></span>
          <span class="navbar__bar" [class.open]="menuOpen()"></span>
        </button>

        <nav class="navbar__menu" [class.open]="menuOpen()" aria-label="Main navigation">
          <a
            *ngFor="let link of links"
            [routerLink]="link.path"
            routerLinkActive="active"
            class="navbar__link"
            (click)="closeMenu()"
            [attr.aria-current]="'page'"
          >{{ link.label }}</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background-color: rgba(7, 9, 13, 0.7);
      backdrop-filter: saturate(160%) blur(8px);
      border-bottom: 1px solid transparent;
      transition: border-color var(--transition), background-color var(--transition);
    }
    .navbar--scrolled {
      border-bottom-color: var(--border);
      background-color: rgba(7, 9, 13, 0.92);
    }
    .navbar__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--navbar-height);
      gap: var(--space-4);
    }
    .navbar__brand {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text);
      font-weight: 700;
      text-decoration: none;
    }
    .navbar__brand-mark {
      font-family: var(--font-mono);
      color: var(--accent);
      background-color: var(--accent-dim);
      border: 1px solid rgba(77, 163, 255, 0.25);
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
    }
    .navbar__brand-name { letter-spacing: -0.02em; }

    .navbar__menu {
      display: flex;
      gap: var(--space-1);
      align-items: center;
    }
    .navbar__link {
      padding: 0.5rem 0.875rem;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      transition: color var(--transition-fast), background-color var(--transition-fast);
    }
    .navbar__link:hover {
      color: var(--text);
      background-color: var(--bg-secondary);
    }
    .navbar__link.active {
      color: var(--accent-light);
      background-color: var(--accent-dim);
    }

    .navbar__toggle {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 40px;
      height: 40px;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      align-items: center;
      padding: 0 8px;
    }
    .navbar__bar {
      width: 100%;
      height: 2px;
      background-color: var(--text);
      transition: transform var(--transition), opacity var(--transition);
    }
    .navbar__bar.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .navbar__bar.open:nth-child(2) { opacity: 0; }
    .navbar__bar.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    @media (max-width: 768px) {
      .navbar__toggle { display: flex; }
      .navbar__menu {
        position: absolute;
        top: var(--navbar-height);
        left: 0;
        right: 0;
        flex-direction: column;
        align-items: stretch;
        padding: var(--space-3);
        gap: var(--space-2);
        background-color: var(--bg-secondary);
        border-bottom: 1px solid var(--border);
        transform: translateY(-8px);
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--transition), transform var(--transition);
      }
      .navbar__menu.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      .navbar__link {
        padding: 0.75rem 1rem;
        border-radius: var(--radius-md);
      }
    }
  `]
})
export class NavbarComponent {
  menuOpen = signal(false);
  scrolled = signal(false);

  readonly links: NavLink[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/skills', label: 'Skills' },
    { path: '/projects', label: 'Projects' },
    { path: '/experience', label: 'Experience' },
    { path: '/github', label: 'GitHub' },
    { path: '/resume', label: 'Resume' },
    { path: '/contact', label: 'Contact' }
  ];

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }
  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }
}
