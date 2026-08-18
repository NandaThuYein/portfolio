import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ContactComponent } from './contact.component';
import { environment } from '../../../environments/environment';

describe('ContactComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('creates the form with all four fields', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/data/profile.json').flush({
      name: 'Nanda',
      title: 'Java & Backend Developer',
      tagline: '',
      description: '',
      longDescription: '',
      location: 'Myanmar',
      email: 'test@example.com',
      availability: '',
      focusAreas: [],
      terminal: { whoami: 'nanda', stack: [], status: '' }
    });
    http.expectOne('assets/data/social.json').flush({
      github: 'https://github.com/x',
      linkedin: '',
      email: ''
    });
    fixture.detectChanges();

    expect(comp.form.get('name')).toBeTruthy();
    expect(comp.form.get('email')).toBeTruthy();
    expect(comp.form.get('subject')).toBeTruthy();
    expect(comp.form.get('message')).toBeTruthy();
  });

  it('validates required fields', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/data/profile.json').flush({
      name: 'Nanda',
      title: '',
      tagline: '',
      description: '',
      longDescription: '',
      location: '',
      email: 'x@y.z',
      availability: '',
      focusAreas: [],
      terminal: { whoami: '', stack: [], status: '' }
    });
    http.expectOne('assets/data/social.json').flush({
      github: '',
      linkedin: '',
      email: ''
    });
    fixture.detectChanges();

    comp.form.setValue({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    expect(comp.form.valid).toBeFalse();
    expect(comp.invalid('name')).toBeFalse(); // not touched yet
    comp.form.markAllAsTouched();
    expect(comp.invalid('name')).toBeTrue();
  });

  it('rejects an invalid email', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/data/profile.json').flush({
      name: 'Nanda',
      title: '',
      tagline: '',
      description: '',
      longDescription: '',
      location: '',
      email: 'x@y.z',
      availability: '',
      focusAreas: [],
      terminal: { whoami: '', stack: [], status: '' }
    });
    http.expectOne('assets/data/social.json').flush({
      github: '',
      linkedin: '',
      email: ''
    });
    fixture.detectChanges();

    comp.form.controls.email.setValue('not-an-email');
    comp.form.controls.email.markAsTouched();
    expect(comp.invalid('email')).toBeTrue();
    expect(comp.errorFor('email')).toContain('valid email');
  });

  it('enforces minimum length on the message field', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/data/profile.json').flush({
      name: 'Nanda',
      title: '',
      tagline: '',
      description: '',
      longDescription: '',
      location: '',
      email: 'x@y.z',
      availability: '',
      focusAreas: [],
      terminal: { whoami: '', stack: [], status: '' }
    });
    http.expectOne('assets/data/social.json').flush({
      github: '',
      linkedin: '',
      email: ''
    });
    fixture.detectChanges();

    comp.form.controls.message.setValue('short');
    comp.form.controls.message.markAsTouched();
    expect(comp.invalid('message')).toBeTrue();
    expect(comp.errorFor('message')).toContain('at least');
  });

  it('does not submit when the form is invalid', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/data/profile.json').flush({
      name: 'Nanda',
      title: '',
      tagline: '',
      description: '',
      longDescription: '',
      location: '',
      email: 'x@y.z',
      availability: '',
      focusAreas: [],
      terminal: { whoami: '', stack: [], status: '' }
    });
    http.expectOne('assets/data/social.json').flush({
      github: '',
      linkedin: '',
      email: ''
    });
    fixture.detectChanges();

    comp.onSubmit();
    expect(comp.submitState()).toBe('idle');
  });

  it('transitions to success state when the form is valid (mailto fallback)', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    const original = environment.contactFormUrl;
    (environment as any).contactFormUrl = '';
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/data/profile.json').flush({
      name: 'Nanda',
      title: '',
      tagline: '',
      description: '',
      longDescription: '',
      location: '',
      email: 'x@y.z',
      availability: '',
      focusAreas: [],
      terminal: { whoami: '', stack: [], status: '' }
    });
    http.expectOne('assets/data/social.json').flush({
      github: '',
      linkedin: '',
      email: ''
    });
    fixture.detectChanges();

    // Stub HTMLAnchorElement.prototype.click so the mailto: anchor the
    // component creates does not trigger a page reload.
    const realClick = HTMLAnchorElement.prototype.click;
    let clickedHrefs: string[] = [];
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      clickedHrefs.push(this.href);
    };

    comp.form.setValue({
      name: 'Sender Name',
      email: 'sender@example.com',
      subject: 'Job opportunity',
      message: 'Hello, I would like to discuss a backend role.'
    });
    comp.onSubmit();

    expect(comp.submitState()).toBe('success');
    expect(clickedHrefs.length).toBe(1);
    expect(clickedHrefs[0]).toContain('mailto:');

    HTMLAnchorElement.prototype.click = realClick;
    (environment as any).contactFormUrl = original;
  });
});
