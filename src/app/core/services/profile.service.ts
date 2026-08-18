import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, catchError, of } from 'rxjs';
import { Profile } from '../models';

/**
 * Loads the static profile JSON (cached for the lifetime of the app).
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly url = 'assets/data/profile.json';

  private cache$?: Observable<Profile>;

  getProfile(): Observable<Profile> {
    if (!this.cache$) {
      this.cache$ = this.http.get<Profile>(this.url).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError(() => of(DEFAULT_PROFILE))
      );
    }
    return this.cache$;
  }
}

const DEFAULT_PROFILE: Profile = {
  name: 'Nanda',
  title: 'Java & Backend Developer',
  tagline: '',
  description:
    'Java & Backend Developer focused on reliable, secure and scalable backend systems, REST APIs and enterprise applications.',
  longDescription: '',
  location: '',
  email: '',
  availability: '',
  focusAreas: ['Java', 'Spring Boot', 'REST APIs', 'PostgreSQL'],
  terminal: {
    whoami: 'nanda',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'REST API', 'Docker'],
    status: 'Building reliable software.'
  }
};
