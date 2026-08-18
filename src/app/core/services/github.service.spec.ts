import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { GithubService } from './github.service';
import { environment } from '../../../environments/environment';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;
  const originalUsername = environment.githubUsername;

  beforeEach(() => {
    // Override the environment for tests so the service is "configured".
    (environment as any).githubUsername = 'test-user';
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubService]
    });
    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    (environment as any).githubUsername = originalUsername;
  });

  it('reports configured when username is set', () => {
    expect(service.isConfigured()).toBeTrue();
  });

  it('reports not configured when username is the placeholder', () => {
    (environment as any).githubUsername = 'YOUR_USERNAME';
    expect(service.isConfigured()).toBeFalse();
    // restore for subsequent tests
    (environment as any).githubUsername = 'test-user';
  });

  it('fetches and maps the public GitHub profile', (done) => {
    service.getProfile().subscribe((profile) => {
      expect(profile.login).toBe('test-user');
      expect(profile.name).toBe('Test User');
      expect(profile.avatarUrl).toBe('https://example.com/avatar.png');
      expect(profile.publicRepos).toBe(12);
      done();
    });
    const req = httpMock.expectOne('https://api.github.com/users/test-user');
    expect(req.request.method).toBe('GET');
    req.flush({
      login: 'test-user',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.png',
      bio: 'Just testing',
      location: null,
      company: null,
      blog: null,
      public_repos: 12,
      followers: 5,
      following: 3,
      html_url: 'https://github.com/test-user'
    });
  });

  it('fetches and maps repositories', (done) => {
    service.getRepositories('updated').subscribe((repos) => {
      expect(repos.length).toBe(1);
      expect(repos[0].name).toBe('hello-world');
      expect(repos[0].stargazersCount).toBe(7);
      expect(repos[0].topics).toEqual(['angular', 'spring']);
      done();
    });
    const req = httpMock.expectOne(
      'https://api.github.com/users/test-user/repos?per_page=100&sort=updated'
    );
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        id: 1,
        name: 'hello-world',
        full_name: 'test-user/hello-world',
        html_url: 'https://github.com/test-user/hello-world',
        description: 'A test repo',
        language: 'TypeScript',
        stargazers_count: 7,
        forks_count: 1,
        updated_at: '2024-01-01T00:00:00Z',
        homepage: null,
        topics: ['angular', 'spring'],
        fork: false,
        archived: false
      }
    ]);
  });

  it('caches the profile — only one HTTP request', () => {
    let emissions = 0;
    service.getProfile().subscribe((p) => {
      emissions++;
      expect(p.login).toBe('test-user');
    });
    // First subscriber triggers the HTTP call.
    httpMock.expectOne('https://api.github.com/users/test-user').flush({
      login: 'test-user',
      name: 'Test User',
      avatar_url: '',
      bio: null,
      location: null,
      company: null,
      blog: null,
      public_repos: 0,
      followers: 0,
      following: 0,
      html_url: 'https://github.com/test-user'
    });

    // Second subscriber must reuse the cached value — no extra HTTP call.
    service.getProfile().subscribe((p) => {
      emissions++;
      expect(p.login).toBe('test-user');
    });
    httpMock.expectNone('https://api.github.com/users/test-user');
    expect(emissions).toBe(2);
  });

  it('emits a friendly error on 404', (done) => {
    service.getProfile().subscribe({
      next: () => fail('expected error'),
      error: (err) => {
        expect(err.message).toContain('not found');
        done();
      }
    });
    httpMock
      .expectOne('https://api.github.com/users/test-user')
      .flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
