import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, shareReplay, catchError, throwError } from 'rxjs';
import { SocialLinks } from '../models';

/**
 * Loads the static social links JSON (cached for the lifetime of the app).
 */
@Injectable({ providedIn: 'root' })
export class SocialService {
  private readonly http = inject(HttpClient);
  private readonly url = 'assets/data/social.json';

  private cache$?: Observable<SocialLinks>;

  getSocialLinks(): Observable<SocialLinks> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<SocialLinks>(this.url)
        .pipe(
          shareReplay({ bufferSize: 1, refCount: false }),
          catchError((err: HttpErrorResponse) =>
            throwError(() => new Error('Unable to load social links.'))
          )
        );
    }
    return this.cache$;
  }
}
