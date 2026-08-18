import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectCardComponent } from './project-card.component';
import { Project } from '../../../core/models';

describe('ProjectCardComponent', () => {
  const mockProject: Project = {
    id: 'p1',
    title: 'Test Project',
    slug: 'test-project',
    description: 'A short test description',
    longDescription: '',
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kafka'],
    category: 'Enterprise',
    featured: true,
    responsibilities: [],
    highlights: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('renders the project title and category', () => {
    const fixture = TestBed.createComponent(ProjectCardComponent);
    const comp = fixture.componentInstance;
    comp.project = mockProject;
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Test Project');
    expect(el.textContent).toContain('Enterprise');
  });

  it('renders the featured badge when featured', () => {
    const fixture = TestBed.createComponent(ProjectCardComponent);
    const comp = fixture.componentInstance;
    comp.project = { ...mockProject, featured: true };
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Featured');
  });

  it('hides the featured badge when not featured', () => {
    const fixture = TestBed.createComponent(ProjectCardComponent);
    const comp = fixture.componentInstance;
    comp.project = { ...mockProject, featured: false };
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Featured');
  });

  it('limits technology badges to 4 with +N overflow', () => {
    const fixture = TestBed.createComponent(ProjectCardComponent);
    const comp = fixture.componentInstance;
    comp.project = mockProject;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('+1'); // 5 technologies -> shows 4 + "+1"
  });

  it('links to /projects/:slug', () => {
    const fixture = TestBed.createComponent(ProjectCardComponent);
    const comp = fixture.componentInstance;
    comp.project = mockProject;
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toContain('/projects/test-project');
  });
});
