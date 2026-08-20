import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProfileService, ProjectService, SkillService, ExperienceService, SocialService, GithubService, SeoService } from '../../core/services';
import { Profile, Project, SkillCategoryGroup, Experience, SocialLinks } from '../../core/models';

import { SectionTitleComponent } from '../../shared/components/section-title/section-title.component';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { TechnologyBadgeComponent } from '../../shared/components/technology-badge/technology-badge.component';
import { SocialLinksComponent } from '../../shared/components/social-links/social-links.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

/**
 * Home page — assembles hero, tech highlights, about preview, featured
 * projects, skills, experience preview, GitHub preview, CV, contact CTA.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SectionTitleComponent,
    ProjectCardComponent,
    TechnologyBadgeComponent,
    SocialLinksComponent,
    LoadingComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly profileSvc = inject(ProfileService);
  private readonly projectSvc = inject(ProjectService);
  private readonly skillSvc = inject(SkillService);
  private readonly experienceSvc = inject(ExperienceService);
  private readonly socialSvc = inject(SocialService);
  private readonly githubSvc = inject(GithubService);
  private readonly seo = inject(SeoService);

  profile?: Profile;
  featured: Project[] = [];
  skillGroups: SkillCategoryGroup[] = [];
  experiences = signal<Experience[]>([]);
  social?: SocialLinks;
  loading = signal(true);

  ngOnInit(): void {
    this.seo.set({
      title: '',
      description:
        'Nanda — Java & Backend Developer. Reliable, secure and scalable backend systems, REST APIs and enterprise applications.'
    });

    this.profileSvc.getProfile().subscribe((p) => (this.profile = p));
    this.socialSvc.getSocialLinks().subscribe({
      next: (s) => (this.social = s),
      error: () => (this.social = undefined)
    });

    this.projectSvc.getFeaturedProjects().subscribe({
      next: (p) => {
        this.featured = p;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.skillSvc.getGroupedSkills().subscribe((g) => (this.skillGroups = g));
    this.experienceSvc.getExperience().subscribe({
      next: (e) => {
        this.experiences.set(e.slice(0, 2));
      },
      error: (err) => {
        console.error('Experience error:', err);
      }
    });
  }

  get cvPath(): string {
    return 'assets/resume/NandaThuYein-Resume.pdf';
  }

  get githubUsername(): string {
    return this.githubSvc.isConfigured()
      ? (this.profile?.name ?? 'GitHub')
      : 'YOUR_USERNAME';
  }
}
