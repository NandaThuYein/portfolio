import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProjectsComponent } from './projects.component';
import { Project } from '../../core/models';

describe('ProjectsComponent', () => {
  const mockProjects: Project[] = [
    {
      id: 'p1',
      title: 'FTTH Billing',
      slug: 'ftth-billing',
      description: 'Enterprise billing platform',
      longDescription: '',
      technologies: ['Java', 'Spring Boot'],
      category: 'Enterprise',
      featured: true,
      responsibilities: [],
      highlights: []
    },
    {
      id: 'p2',
      title: 'AI Chatbot',
      slug: 'ai-chatbot',
      description: 'Conversational AI app',
      longDescription: '',
      technologies: ['Java', 'LLM'],
      category: 'AI',
      featured: false,
      responsibilities: [],
      highlights: []
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('loads and displays projects', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const http = TestBed.inject(HttpTestingController);
    const req = http.expectOne('assets/data/projects.json');
    req.flush({ projects: mockProjects });
    fixture.detectChanges();

    expect(comp.projects.length).toBe(2);
    expect(comp.featured.length).toBe(1);
    expect(comp.state()).toBe('ok');

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('FTTH Billing');
    expect(el.textContent).toContain('AI Chatbot');
    http.verify();
  });

  it('filters projects by category', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/data/projects.json').flush({ projects: mockProjects });
    fixture.detectChanges();

    comp.active.set('AI');
    fixture.detectChanges();
    expect(comp.filtered().length).toBe(1);
    expect(comp.filtered()[0].slug).toBe('ai-chatbot');
  });

  it('filters projects by search query (matches technology)', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/data/projects.json').flush({ projects: mockProjects });
    fixture.detectChanges();

    comp.query.set('llm');
    fixture.detectChanges();
    expect(comp.filtered().length).toBe(1);
    expect(comp.filtered()[0].slug).toBe('ai-chatbot');
  });

  it('filters projects by search query (matches title)', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('assets/data/projects.json').flush({ projects: mockProjects });
    fixture.detectChanges();

    comp.query.set('FTTH');
    fixture.detectChanges();
    expect(comp.filtered().length).toBe(1);
    expect(comp.filtered()[0].slug).toBe('ftth-billing');
  });

  it('enters error state when the JSON fetch fails', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const http = TestBed.inject(HttpTestingController);
    http
      .expectOne('assets/data/projects.json')
      .flush('error', { status: 500, statusText: 'Server error' });
    fixture.detectChanges();

    expect(comp.state()).toBe('error');
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Unable to load projects');
  });
});
