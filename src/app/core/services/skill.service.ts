import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, shareReplay, catchError, throwError, map } from 'rxjs';
import { Skill, SkillCategoryGroup } from '../models';

interface SkillsFile {
  skills: Skill[];
}

/**
 * Loads the static skills JSON (cached for the lifetime of the app).
 * Exposes convenience helpers to group skills by category.
 */
@Injectable({ providedIn: 'root' })
export class SkillService {
  private readonly http = inject(HttpClient);
  private readonly url = 'assets/data/skills.json';

  private cache$?: Observable<SkillsFile>;

  getSkills(): Observable<Skill[]> {
    return this.getFile().pipe(
      map((f) => f.skills),
      catchError(() => throwError(() => new Error('Unable to load skills.')))
    );
  }

  /**
   * Returns skills grouped by their canonical category, preserving the
   * canonical category order defined below.
   */
  getGroupedSkills(): Observable<SkillCategoryGroup[]> {
    return this.getFile().pipe(
      map((f) =>
        CATEGORY_ORDER.map((category) => ({
          category,
          skills: f.skills.filter((s) => s.category === category)
        })).filter((g) => g.skills.length > 0)
      ),
      catchError(() => throwError(() => new Error('Unable to load skills.')))
    );
  }

  private getFile(): Observable<SkillsFile> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<SkillsFile>(this.url)
        .pipe(
          shareReplay({ bufferSize: 1, refCount: false }),
          catchError((err: HttpErrorResponse) =>
            throwError(() => new Error('Unable to load skills.'))
          )
        );
    }
    return this.cache$;
  }
}

const CATEGORY_ORDER: Skill['category'][] = [
  'Backend',
  'Database',
  'Integration',
  'Frontend',
  'DevOps',
  'Tools'
];
