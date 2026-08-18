import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, shareReplay, catchError, throwError, map } from 'rxjs';
import { Project } from '../models';

interface ProjectsFile {
  projects: Project[];
}

/**
 * Loads the static projects JSON (cached for the lifetime of the app).
 * Exposes convenience helpers to fetch featured projects and to resolve
 * a single project by its URL slug.
 */
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly url = 'assets/data/projects.json';

  private cache$?: Observable<ProjectsFile>;

  /**
   * Returns all projects in their declared order.
   */
  getProjects(): Observable<Project[]> {
    return this.getFile().pipe(
      map((f) => f.projects),
      catchError(() => throwError(() => new Error('Unable to load projects.')))
    );
  }

  /**
   * Returns projects flagged as `featured: true`.
   */
  getFeaturedProjects(): Observable<Project[]> {
    return this.getProjects().pipe(map((p) => p.filter((x) => x.featured)));
  }

  /**
   * Resolves a single project by slug, or `undefined` if no match is found.
   */
  getProjectBySlug(slug: string): Observable<Project | undefined> {
    return this.getProjects().pipe(map((p) => p.find((x) => x.slug === slug)));
  }

  private getFile(): Observable<ProjectsFile> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<ProjectsFile>(this.url)
        .pipe(
          shareReplay({ bufferSize: 1, refCount: false }),
          catchError((err: HttpErrorResponse) =>
            throwError(() => new Error('Unable to load projects.'))
          )
        );
    }
    return this.cache$;
  }
}
