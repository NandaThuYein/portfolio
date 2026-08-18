import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface SeoOptions {
  title: string;
  description?: string;
  /** Absolute or path-relative URL used for canonical link. */
  path?: string;
  /** Optional Open Graph image (absolute URL). */
  image?: string;
  /** `noindex` for non-canonical pages (404 etc.). */
  noindex?: boolean;
}

/**
 * Centralized SEO helper. Updates document title, meta description,
 * Open Graph / Twitter tags and the canonical link.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleSvc = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);

  private readonly baseTitle = 'Nanda | Java & Backend Developer';
  private readonly defaultDescription =
    'Nanda — Java & Backend Developer. I build reliable, secure and scalable backend systems, REST APIs and enterprise applications with Java, Spring Boot and PostgreSQL.';
  private readonly defaultImage = `${environment.siteUrl}/assets/images/profile.webp`;

  /**
   * Sets the page title (postfixed with the base title) and meta tags.
   */
  set(options: SeoOptions): void {
    const title = options.title
      ? `${options.title} | Nanda`
      : this.baseTitle;
    this.titleSvc.setTitle(title);

    const description = options.description ?? this.defaultDescription;
    this.meta.updateTag({ name: 'description', content: description });

    const path = options.path ?? this.router.url;
    const url = this.absoluteUrl(path);

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({
      property: 'og:image',
      content: options.image ?? this.defaultImage
    });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    if (options.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    }

    this.setCanonical(url);
  }

  private absoluteUrl(path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${environment.siteUrl}${cleanPath}`;
  }

  private setCanonical(url: string): void {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }
}
