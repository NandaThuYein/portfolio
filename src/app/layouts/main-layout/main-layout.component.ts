import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { BackToTopComponent } from '../../shared/components/back-to-top/back-to-top.component';

/**
 * Top-level layout: sticky navbar, routed page content, footer, and a
 * floating back-to-top button. Renders on every route.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    BackToTopComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar />
    <main id="main-content" class="main-content" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <app-back-to-top />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      outline: none;
    }
  `]
})
export class MainLayoutComponent {}
