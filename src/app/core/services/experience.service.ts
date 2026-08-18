import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, shareReplay, catchError, throwError, map } from 'rxjs';
import { Experience } from '../models';

interface ExperienceFile {
  experience: Experience[];
}

/**
 * Loads the static experience JSON (cached for the lifetime of the app).
 */
@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private readonly http = inject(HttpClient);
  private readonly url = 'assets/data/experience.json';

  private cache$?: Observable<Experience[]>;

  getExperience(): Observable<Experience[]> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<ExperienceFile>(this.url)
        .pipe(
          shareReplay({ bufferSize: 1, refCount: false }),
          map((f) => f.experience),
          catchError((err: HttpErrorResponse) =>
            throwError(() => new Error('Unable to load experience data.'))
          )
        );
    }
    return this.cache$;
  }
}
