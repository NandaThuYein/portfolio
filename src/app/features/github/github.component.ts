import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GithubService, SeoService } from '../../core/services';
import { GithubProfile, GithubRepository, GithubRepoSort } from '../../core/models';

import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

type State = 'loading' | 'ok' | 'error' | 'not-configured';

/**
 * GitHub page — pulls public GitHub profile + repos via the public API.
 * Cached by `GithubService` via `shareReplay`. Sort changes are applied
 * client-side via a computed signal.
 */
@Component({
  selector: 'app-github',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SectionTitleComponent,
    LoadingComponent,
    ErrorComponent,
    EmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <app-section-title
          eyebrow="// GitHub"
          title="Public repositories"
          subtitle="Live from the GitHub public API. Only public data is shown — no tokens, no secrets."
        />

        <!-- Not configured -->
        <ng-container *ngIf="state() === 'not-configured'">
          <div class="card hint">
            <h3>GitHub username not configured</h3>
            <p>
              Replace <code>githubUsername</code> in
              <code>src/environments/environment.ts</code> and
              <code>environment.prod.ts</code> with your real GitHub username,
              then rebuild.
            </p>
          </div>
        </ng-container>

        <!-- Loading -->
        <ng-container *ngIf="state() === 'loading'">
          <app-loading [block]="true" message="Loading GitHub data..." />
        </ng-container>

        <!-- Error -->
        <ng-container *ngIf="state() === 'error'">
          <app-error
            [block]="true"
            title="Unable to load GitHub data."
            message="The public GitHub API may be rate-limited (60 requests/hour per IP). Please try again later."
          />
        </ng-container>

        <!-- OK -->
        <ng-container *ngIf="state() === 'ok' &amp;&amp; profile">
          <div class="profile card">
            <img [src]="profile.avatarUrl" [alt]="profile.login + ' avatar'" class="profile__avatar" />
            <div class="profile__info">
              <h3 class="profile__name">{{ profile.name || profile.login }}</h3>
              <p class="profile__login">&#64;{{ profile.login }}</p>
              <p class="profile__bio" *ngIf="profile.bio">{{ profile.bio }}</p>
              <div class="profile__stats">
                <div class="stat">
                  <span class="stat__value">{{ profile.publicRepos }}</span>
                  <span class="stat__label">Repos</span>
                </div>
                <div class="stat">
                  <span class="stat__value">{{ profile.followers }}</span>
                  <span class="stat__label">Followers</span>
                </div>
                <div class="stat">
                  <span class="stat__value">{{ profile.following }}</span>
                  <span class="stat__label">Following</span>
                </div>
              </div>
            </div>
            <a [href]="profile.htmlUrl" target="_blank" rel="noopener" class="btn btn-outline btn-sm">View on GitHub →</a>
          </div>

          <div class="repos-head" *ngIf="repos().length">
            <h2 class="repos-title">Repositories</h2>
            <div class="sort">
              <label for="sort" class="form-label">Sort by</label>
              <select id="sort" class="form-control" [ngModel]="sort()" (ngModelChange)="sort.set($event)">
                <option value="updated">Recently updated</option>
                <option value="stars">Most stars</option>
                <option value="forks">Most forked</option>
              </select>
            </div>
          </div>

          <div class="repos" *ngIf="repos().length">
            <article class="card repo" *ngFor="let r of repos()">
              <header class="repo__head">
                <h3 class="repo__name">
                  <a [href]="r.htmlUrl" target="_blank" rel="noopener">{{ r.name }}</a>
                </h3>
                <div class="repo__meta">
                  <span class="repo__lang" *ngIf="r.language">
                    <span class="repo__lang-dot"></span>{{ r.language }}
                  </span>
                  <span class="repo__star" *ngIf="r.stargazersCount">★ {{ r.stargazersCount }}</span>
                  <span class="repo__fork" *ngIf="r.forksCount">⑂ {{ r.forksCount }}</span>
                </div>
              </header>
              <p class="repo__desc">{{ r.description || 'No description provided.' }}</p>
              <footer class="repo__foot">
                <span class="repo__updated">Updated {{ r.updatedAt | date: 'mediumDate' }}</span>
                <a [href]="r.htmlUrl" target="_blank" rel="noopener" class="repo__link">View →</a>
              </footer>
            </article>
          </div>

          <ng-container *ngIf="!repos().length">
            <app-empty-state
              [block]="true"
              icon="∅"
              title="No public repositories."
              message="Once you publish repositories on GitHub, they will appear here."
            />
          </ng-container>
        </ng-container>
      </div>
    </section>
  `,
  styles: [`
    .hint {
      max-width: 60ch;
      margin: var(--space-6) auto;
    }
    .hint code {
      background-color: var(--bg-secondary);
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
    }
    .profile {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: var(--space-5);
      align-items: center;
      margin-bottom: var(--space-6);
    }
    .profile__avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      border: 2px solid var(--border);
    }
    .profile__name {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
    }
    .profile__login {
      color: var(--accent-light);
      font-family: var(--font-mono);
      font-size: 0.9rem;
      margin: var(--space-1) 0;
    }
    .profile__bio {
      color: var(--text-secondary);
      font-size: 0.925rem;
      margin: var(--space-2) 0;
    }
    .profile__stats {
      display: flex;
      gap: var(--space-5);
      margin-top: var(--space-3);
    }
    .stat {
      display: flex;
      flex-direction: column;
    }
    .stat__value {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text);
      font-family: var(--font-mono);
    }
    .stat__label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .repos-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
    }
    .repos-title {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .sort {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .sort .form-label {
      margin: 0;
      font-size: 0.825rem;
    }
    .sort .form-control {
      width: auto;
      min-width: 180px;
    }

    .repos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: var(--space-4);
    }
    .repo {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .repo__head {
      display: flex;
      justify-content: space-between;
      gap: var(--space-2);
      align-items: flex-start;
    }
    .repo__name {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
    }
    .repo__name a {
      color: var(--accent-light);
      text-decoration: none;
    }
    .repo__meta {
      display: flex;
      gap: var(--space-3);
      align-items: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      font-family: var(--font-mono);
      flex-shrink: 0;
    }
    .repo__lang-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--accent);
      margin-right: 4px;
    }
    .repo__desc {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.55;
      flex: 1;
      margin: 0;
    }
    .repo__foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--space-3);
      border-top: 1px solid var(--border);
    }
    .repo__updated {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }
    .repo__link {
      font-size: 0.825rem;
      color: var(--accent);
      text-decoration: none;
    }
    .btn-sm {
      padding: 0.45rem 0.875rem;
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      .profile {
        grid-template-columns: 1fr;
        text-align: center;
        justify-items: center;
      }
      .repos-head {
        flex-direction: column;
        align-items: stretch;
      }
      .sort .form-control { width: 100%; }
    }
  `]
})
export class GithubComponent implements OnInit {
  private readonly githubSvc = inject(GithubService);
  private readonly seo = inject(SeoService);

  state = signal<State>('loading');
  profile?: GithubProfile;
  private reposCache: GithubRepository[] = [];
  sort = signal<GithubRepoSort>('updated');

  /** Repositories sorted by the currently selected sort option. */
  repos = computed<GithubRepository[]>(() => {
    const r = [...this.reposCache];
    const s = this.sort();
    if (s === 'stars') {
      r.sort((a, b) => b.stargazersCount - a.stargazersCount);
    } else if (s === 'forks') {
      r.sort((a, b) => b.forksCount - a.forksCount);
    } else {
      r.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
    return r;
  });

  ngOnInit(): void {
    this.seo.set({
      title: 'GitHub',
      description:
        'GitHub — Nanda. Public repositories, profile and open-source work.'
    });

    if (!this.githubSvc.isConfigured()) {
      this.state.set('not-configured');
      return;
    }

    this.githubSvc.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.loadRepos();
      },
      error: () => this.state.set('error')
    });
  }

  private loadRepos(): void {
    this.githubSvc.getRepositories(this.sort()).subscribe({
      next: (r) => {
        this.reposCache = r;
        this.state.set('ok');
      },
      error: () => this.state.set('error')
    });
  }
}
