import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { Project } from '../models';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  const mockProjects: Project[] = [
    {
      id: 'p1',
      title: 'Project One',
      slug: 'project-one',
      description: 'First test project',
      longDescription: 'A long description',
      technologies: ['Java', 'Spring Boot'],
      category: 'Enterprise',
      featured: true,
      responsibilities: [],
      highlights: []
    },
    {
      id: 'p2',
      title: 'Project Two',
      slug: 'project-two',
      description: 'Second test project',
      longDescription: 'Another long description',
      technologies: ['Java'],
      category: 'AI',
      featured: false,
      responsibilities: [],
      highlights: []
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads projects from JSON', (done) => {
    service.getProjects().subscribe((projects) => {
      expect(projects.length).toBe(2);
      expect(projects[0].slug).toBe('project-one');
      done();
    });
    const req = httpMock.expectOne('assets/data/projects.json');
    expect(req.request.method).toBe('GET');
    req.flush({ projects: mockProjects });
  });

  it('filters featured projects', (done) => {
    service.getFeaturedProjects().subscribe((featured) => {
      expect(featured.length).toBe(1);
      expect(featured[0].slug).toBe('project-one');
      done();
    });
    httpMock.expectOne('assets/data/projects.json').flush({ projects: mockProjects });
  });

  it('resolves a project by slug', (done) => {
    service.getProjectBySlug('project-two').subscribe((p) => {
      expect(p).toBeDefined();
      expect(p?.title).toBe('Project Two');
      done();
    });
    httpMock.expectOne('assets/data/projects.json').flush({ projects: mockProjects });
  });

  it('returns undefined for an unknown slug', (done) => {
    service.getProjectBySlug('nope').subscribe((p) => {
      expect(p).toBeUndefined();
      done();
    });
    httpMock.expectOne('assets/data/projects.json').flush({ projects: mockProjects });
  });

  it('caches the JSON file — only one HTTP request for multiple calls', (done) => {
    let count = 0;
    service.getProjects().subscribe(() => count++);
    service.getProjects().subscribe(() => count++);
    service.getFeaturedProjects().subscribe(() => {
      expect(count).toBe(2);
      done();
    });
    httpMock.expectOne('assets/data/projects.json').flush({ projects: mockProjects });
  });
});
