import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, NavigationEnd } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { filter } from 'rxjs';

describe('Routing', () => {
  let router: Router;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  it('navigates to / (home)', async () => {
    await harness.navigateByUrl('/');
    expect(router.url).toBe('/');
  });

  it('navigates to /projects', async () => {
    await harness.navigateByUrl('/projects');
    expect(router.url).toBe('/projects');
  });

  it('navigates to /projects/:slug and the slug is parsed', async () => {
    await harness.navigateByUrl('/projects/ftth-billing-system');
    expect(router.url).toBe('/projects/ftth-billing-system');
  });

  it('navigates to /contact, /resume, /github, /experience, /skills, /about', async () => {
    for (const path of [
      '/about',
      '/skills',
      '/projects',
      '/experience',
      '/github',
      '/resume',
      '/contact'
    ]) {
      await harness.navigateByUrl(path);
      expect(router.url).toBe(path);
    }
  });

  it('redirects unknown routes to /404', async () => {
    await harness.navigateByUrl('/some/unknown/route');
    expect(router.url).toBe('/404');
  });

  it('updates the document title after navigation', async () => {
    await harness.navigateByUrl('/about');
    expect(document.title).toContain('About');
  });
});
