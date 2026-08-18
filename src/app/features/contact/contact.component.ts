import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  ProfileService,
  SocialService,
  SeoService
} from '../../core/services';
import { Profile, SocialLinks } from '../../core/models';
import { environment } from '../../../environments/environment';

import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { SocialLinksComponent } from '../../shared/components/social-links/social-links.component';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

/** Minimum length for free-text fields. */
const MIN_LEN = 10;
const MAX_MESSAGE = 2000;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    SectionTitleComponent,
    SocialLinksComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <app-section-title
          eyebrow="// Contact"
          title="Get in touch"
          subtitle="Available for backend / Java / Spring Boot opportunities. Reach out via the form or any of the channels below."
        />

        <div class="grid">
          <!-- Info -->
          <aside class="info">
            <div class="card">
              <h3 class="info__title">Channels</h3>
              <ul class="info__list">
                <li *ngIf="profile?.email">
                  <span class="info__label">Email</span>
                  <a [href]="'mailto:' + profile?.email" class="info__value">{{ profile?.email }}</a>
                </li>
                <li *ngIf="social?.github">
                  <span class="info__label">GitHub</span>
                  <a [href]="social?.github" target="_blank" rel="noopener" class="info__value">{{ social?.github }}</a>
                </li>
                <li *ngIf="social?.linkedin">
                  <span class="info__label">LinkedIn</span>
                  <a [href]="social?.linkedin" target="_blank" rel="noopener" class="info__value">{{ social?.linkedin }}</a>
                </li>
                <li *ngIf="profile?.location">
                  <span class="info__label">Location</span>
                  <span class="info__value">{{ profile?.location }}</span>
                </li>
              </ul>
            </div>

            <div class="card" *ngIf="social">
              <h3 class="info__title">Social</h3>
              <app-social-links [links]="social" />
            </div>
          </aside>

          <!-- Form -->
          <div class="form-wrap card">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
              <div class="form-row">
                <div class="form-group">
                  <label for="name" class="form-label">Name</label>
                  <input
                    id="name"
                    type="text"
                    class="form-control"
                    [class.invalid]="invalid('name')"
                    formControlName="name"
                    autocomplete="name"
                  />
                  <span class="form-error" *ngIf="invalid('name')">
                    {{ errorFor('name') }}
                  </span>
                </div>

                <div class="form-group">
                  <label for="email" class="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    [class.invalid]="invalid('email')"
                    formControlName="email"
                    autocomplete="email"
                  />
                  <span class="form-error" *ngIf="invalid('email')">
                    {{ errorFor('email') }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label for="subject" class="form-label">Subject</label>
                <input
                  id="subject"
                  type="text"
                  class="form-control"
                  [class.invalid]="invalid('subject')"
                  formControlName="subject"
                />
                <span class="form-error" *ngIf="invalid('subject')">
                  {{ errorFor('subject') }}
                </span>
              </div>

              <div class="form-group">
                <label for="message" class="form-label">Message</label>
                <textarea
                  id="message"
                  class="form-textarea"
                  [class.invalid]="invalid('message')"
                  formControlName="message"
                  [attr.maxlength]="maxMessage"
                ></textarea>
                <span class="form-error" *ngIf="invalid('message')">
                  {{ errorFor('message') }}
                </span>
                <span class="char-count" *ngIf="!invalid('message')">
                  {{ messageLength() }} / {{ maxMessage }}
                </span>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="submitState() === 'submitting'"
                >
                  {{ submitState() === 'submitting' ? 'Sending…' : 'Send message' }}
                </button>
                <span class="form-status" *ngIf="submitState() === 'success'">
                  ✓ Message ready — opening your email client…
                </span>
                <span class="form-status form-status--error" *ngIf="submitState() === 'error'">
                  ✗ Unable to send. Please email me directly.
                </span>
              </div>

              <p class="form-note" *ngIf="!contactFormUrl">
                Submissions open your email client with the message pre-filled.
                To use a form backend, set <code>contactFormUrl</code> in
                <code>environment.ts</code>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: var(--space-5);
      align-items: start;
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    .info__title {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      margin-bottom: var(--space-4);
      font-family: var(--font-mono);
    }
    .info__list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .info__list li {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    .info__label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: var(--font-mono);
    }
    .info__value {
      color: var(--text);
      font-size: 0.925rem;
      word-break: break-word;
    }
    .info__value:hover { color: var(--accent-light); }

    .form-wrap {
      padding: var(--space-6);
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }
    .form-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-top: var(--space-4);
      flex-wrap: wrap;
    }
    .form-status {
      font-size: 0.875rem;
      color: var(--success);
    }
    .form-status--error { color: var(--danger); }
    .form-note {
      margin-top: var(--space-4);
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .form-note code {
      background-color: var(--bg-secondary);
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-sm);
    }
    .char-count {
      display: block;
      text-align: right;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: var(--space-1);
      font-family: var(--font-mono);
    }

    @media (max-width: 768px) {
      .grid { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly profileSvc = inject(ProfileService);
  private readonly socialSvc = inject(SocialService);
  private readonly seo = inject(SeoService);

  readonly maxMessage = MAX_MESSAGE;
  readonly contactFormUrl = environment.contactFormUrl;

  profile?: Profile;
  social?: SocialLinks;
  submitState = signal<SubmitState>('idle');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(MIN_LEN)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(MIN_LEN)]],
    message: ['', [Validators.required, Validators.minLength(MIN_LEN), Validators.maxLength(MAX_MESSAGE)]]
  });

  ngOnInit(): void {
    this.seo.set({
      title: 'Contact',
      description:
        'Contact — Nanda, Java & Backend Developer. Reach out for backend / Spring Boot opportunities.'
    });
    this.profileSvc.getProfile().subscribe((p) => (this.profile = p));
    this.socialSvc.getSocialLinks().subscribe({
      next: (s) => (this.social = s),
      error: () => (this.social = undefined)
    });
  }

  invalid(field: 'name' | 'email' | 'subject' | 'message'): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  messageLength(): number {
    return this.form.controls.message.value?.length ?? 0;
  }

  errorFor(field: 'name' | 'email' | 'subject' | 'message'): string {
    const c = this.form.get(field);
    if (!c || !c.errors) return '';
    if (c.errors['required']) return 'This field is required.';
    if (c.errors['email']) return 'Please enter a valid email address.';
    if (c.errors['minlength']) {
      return `Please enter at least ${c.errors['minlength'].requiredLength} characters.`;
    }
    if (c.errors['maxlength']) {
      return `Maximum ${c.errors['maxlength'].requiredLength} characters.`;
    }
    return 'Invalid value.';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitState.set('submitting');

    const value = this.form.getRawValue();
    const payload = {
      name: value.name,
      email: value.email,
      subject: value.subject,
      message: value.message
    };

    if (this.contactFormUrl) {
      // Submit to external form service (Formspree / Getform / etc.)
      fetch(this.contactFormUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (res.ok) {
            this.submitState.set('success');
            this.form.reset();
          } else {
            this.submitState.set('error');
          }
        })
        .catch(() => this.submitState.set('error'));
    } else {
      // Fallback to mailto — opens user's email client with prefilled body.
      // Uses a programmatically-created anchor element instead of
      // `window.location.href` so it does not cause a navigation reload
      // in test environments.
      const subject = encodeURIComponent(payload.subject);
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`
      );
      const mailto = `mailto:${this.profile?.email || ''}?subject=${subject}&body=${body}`;
      this.openMailto(mailto);
      this.submitState.set('success');
    }
  }

  /**
   * Opens a mailto: URL by creating and clicking an anchor element.
   * In headless test environments, this is a no-op (does not navigate).
   */
  private openMailto(href: string): void {
    try {
      const a = document.createElement('a');
      a.href = href;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Best-effort; if DOM is unavailable, fall back to window.location.
      // (e.g. SSR or non-browser environments.)
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = href;
      }
    }
  }
}
