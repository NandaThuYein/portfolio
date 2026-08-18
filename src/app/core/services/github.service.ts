import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import {
  Observable,
  shareReplay,
  catchError,
  throwError,
  map
} from 'rxjs';
import { GithubProfile, GithubRepository, GithubRepoSort } from '../models';
import { environment } from '../../../environments/environment';

interface RawGithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface RawGithubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
}

/**
 * Reads **public** GitHub data only via the public REST API.
 *
 * NOTE: The public unauthenticated API is rate-limited to 60 requests/hour
 * per IP. Results are cached via `shareReplay` to avoid repeated calls.
 *
 * NEVER put tokens, secrets or private credentials in this service —
 * everything shipped to the browser is public.
 */
@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);

  private profileCache$?: Observable<GithubProfile>;
  private reposCache$?: Observable<GithubRepository[]>;

  /** Caches the username once resolved. */
  private get username(): string {
    return environment.githubUsername;
  }

  private get baseUrl(): string {
    return `https://api.github.com/users/${this.username}`;
  }

  /**
   * Whether the GitHub username has been configured.
   * Used by components to show a configuration hint instead of an error.
   */
  isConfigured(): boolean {
    return !!this.username && this.username !== 'YOUR_USERNAME';
  }

  /**
   * Fetches the public GitHub user profile.
   */
  getProfile(): Observable<GithubProfile> {
    if (!this.isConfigured()) {
      return throwError(
        () => new Error('GitHub username not configured.')
      );
    }
    if (!this.profileCache$) {
      this.profileCache$ = this.http
        .get<RawGithubProfile>(this.baseUrl)
        .pipe(
          map(this.mapProfile),
          shareReplay({ bufferSize: 1, refCount: false }),
          catchError((err: HttpErrorResponse) =>
            throwError(
              () =>
                new Error(
                  err.status === 404
                    ? 'GitHub user not found.'
                    : 'Unable to load GitHub profile.'
                )
            )
          )
        );
    }
    return this.profileCache$;
  }

  /**
   * Fetches the user's public repositories, optionally sorted.
   * Results are cached; sorting is applied per-subscriber.
   */
  getRepositories(sort: GithubRepoSort = 'updated'): Observable<GithubRepository[]> {
    if (!this.isConfigured()) {
      return throwError(
        () => new Error('GitHub username not configured.')
      );
    }
    if (!this.reposCache$) {
      const params = new HttpParams()
        .set('per_page', '100')
        .set('sort', 'updated');

      this.reposCache$ = this.http
        .get<RawGithubRepository[]>(`${this.baseUrl}/repos`, { params })
        .pipe(
          map((arr) => arr.map(this.mapRepository)),
          shareReplay({ bufferSize: 1, refCount: false }),
          catchError((err: HttpErrorResponse) =>
            throwError(
              () =>
                new Error(
                  err.status === 404
                    ? 'GitHub user not found.'
                    : 'Unable to load repositories.'
                )
            )
          )
        );
    }

    return this.reposCache$.pipe(
      map((repos) => [...repos].sort((a, b) => this.compare(a, b, sort)))
    );
  }

  private compare(
    a: GithubRepository,
    b: GithubRepository,
    sort: GithubRepoSort
  ): number {
    if (sort === 'stars') return b.stargazersCount - a.stargazersCount;
    if (sort === 'forks') return b.forksCount - a.forksCount;
    // default: recently updated
    return (
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  private mapProfile(r: RawGithubProfile): GithubProfile {
    return {
      login: r.login,
      name: r.name,
      avatarUrl: r.avatar_url,
      bio: r.bio,
      location: r.location,
      company: r.company,
      blog: r.blog,
      publicRepos: r.public_repos,
      followers: r.followers,
      following: r.following,
      htmlUrl: r.html_url
    };
  }

  private mapRepository(r: RawGithubRepository): GithubRepository {
    return {
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      htmlUrl: r.html_url,
      description: r.description,
      language: r.language,
      stargazersCount: r.stargazers_count,
      forksCount: r.forks_count,
      updatedAt: r.updated_at,
      homepage: r.homepage,
      topics: r.topics ?? [],
      fork: r.fork,
      archived: r.archived
    };
  }
}
