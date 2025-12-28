import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { vi } from 'vitest';

import { ProfileStatsCardComponent } from './components/profile-stats-card/profile-stats-card.component';
import { GitHubStats } from './models/github-stats.interface';
import { ProfileComponent } from './profile.component';
import { ProfileStore } from './state/profile.store';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockStats: GitHubStats = {
    login: 'testuser',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.png',
    location: 'Test Location',
    company: 'Test Company',
    email: 'test@example.com',
    htmlUrl: 'https://github.com/testuser',
    createdAt: '2023-01-01T00:00:00Z',
    totalRepos: 10,
    totalCommits: 100,
    pullRequests: 5,
    totalLinesAdded: 150,
    totalLinesRemoved: 50,
  };

  const mockTranslations = {
    'profile.title': 'Jason Walker Moody: The Architect',
    'profile.subtitle': 'Building enterprise-grade Angular applications',
    'profile.bio.title': 'About Me',
    'profile.bio.content': 'Full-stack software engineer with a passion...',
    'profile.bio.focus': 'Currently focused on enterprise Angular patterns...',
    'profile.techStack.title': 'Tech Stack',
    'profile.techStack.primary': 'Primary',
    'profile.techStack.secondary': 'Also Experienced With',
    'profile.resume.download': 'Download Resume',
    'profile.resume.view': 'View Resume',
    'profile.resume.modalTitle': 'Resume Preview',
    'profile.stats.title': 'GitHub Activity',
  };

  const mockStore = {
    isLoading: signal(false),
    error: signal<string | null>(null),
    stats: signal<GitHubStats | null>(null),
    loadGitHubStats: vi.fn(),
    refreshStats: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: mockTranslations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    })
      .overrideComponent(ProfileComponent, {
        set: {
          providers: [{ provide: ProfileStore, useValue: mockStore }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;

    // Reset signals before each test
    mockStore.isLoading.set(false);
    mockStore.error.set(null);
    mockStore.stats.set(null);
    mockStore.loadGitHubStats.mockReset();
    mockStore.refreshStats.mockReset();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on initialization', () => {
    expect(mockStore.loadGitHubStats).toHaveBeenCalled();
  });

  describe('Header Section', () => {
    it('should render header with correct title', () => {
      const title = fixture.debugElement.query(By.css('.profile__title'));
      expect(title).toBeTruthy();
      expect((title.nativeElement as HTMLElement).textContent.trim()).toBe(
        'Jason Walker Moody: The Architect',
      );
    });

    it('should render header with correct subtitle', () => {
      const subtitle = fixture.debugElement.query(By.css('.profile__subtitle'));
      expect(subtitle).toBeTruthy();
      expect((subtitle.nativeElement as HTMLElement).textContent.trim()).toBe(
        'Building enterprise-grade Angular applications',
      );
    });

    it('should render header element', () => {
      const header = fixture.debugElement.query(By.css('.profile__header'));
      expect(header).toBeTruthy();
    });
  });

  describe('Grid Layout', () => {
    it('should render grid component with correct configuration', () => {
      const grid = fixture.debugElement.query(By.css('eb-grid'));
      expect(grid).toBeTruthy();
    });

    it('should have left and right columns', () => {
      const leftColumn = fixture.debugElement.query(By.css('.profile__left'));
      const rightColumn = fixture.debugElement.query(By.css('.profile__right'));
      expect(leftColumn).toBeTruthy();
      expect(rightColumn).toBeTruthy();
    });
  });

  describe('Bio Card', () => {
    it('should render bio card', () => {
      const bioCard = fixture.debugElement.query(By.css('.profile__bio-card'));
      expect(bioCard).toBeTruthy();
    });

    it('should display bio title', () => {
      const bioTitle = fixture.debugElement.query(By.css('.profile__bio-title'));
      expect(bioTitle).toBeTruthy();
      expect((bioTitle.nativeElement as HTMLElement).textContent.trim()).toBe('About Me');
    });

    it('should display bio content', () => {
      const bioContent = fixture.debugElement.query(By.css('.profile__bio-content'));
      expect(bioContent).toBeTruthy();
      expect((bioContent.nativeElement as HTMLElement).textContent.trim()).toContain(
        'Full-stack software engineer',
      );
    });

    it('should display bio focus text', () => {
      const bioFocus = fixture.debugElement.query(By.css('.profile__bio-focus'));
      expect(bioFocus).toBeTruthy();
      expect((bioFocus.nativeElement as HTMLElement).textContent.trim()).toContain(
        'Currently focused on',
      );
    });
  });

  describe('Tech Stack Card', () => {
    it('should render tech stack card', () => {
      const techCard = fixture.debugElement.query(By.css('.profile__tech-card'));
      expect(techCard).toBeTruthy();
    });

    it('should display tech stack title', () => {
      const techTitle = fixture.debugElement.query(By.css('.profile__tech-title'));
      expect(techTitle).toBeTruthy();
      expect((techTitle.nativeElement as HTMLElement).textContent.trim()).toBe('Tech Stack');
    });

    it('should have two tech sections (primary and secondary)', () => {
      const techSections = fixture.debugElement.queryAll(By.css('.profile__tech-section'));
      expect(techSections.length).toBe(2);
    });

    it('should display primary tech subtitle', () => {
      const subtitles = fixture.debugElement.queryAll(By.css('.profile__tech-subtitle'));
      expect(subtitles.length).toBeGreaterThan(0);
      expect((subtitles[0].nativeElement as HTMLElement).textContent.trim()).toBe('Primary');
    });

    it('should display secondary tech subtitle', () => {
      const subtitles = fixture.debugElement.queryAll(By.css('.profile__tech-subtitle'));
      expect(subtitles.length).toBe(2);
      expect((subtitles[1].nativeElement as HTMLElement).textContent.trim()).toBe(
        'Also Experienced With',
      );
    });

    it('should render all primary tech badges', () => {
      const primarySection = fixture.debugElement.queryAll(By.css('.profile__tech-section'))[0];
      const badges = primarySection.queryAll(By.css('eb-badge'));
      expect(badges.length).toBe(5);
    });

    it('should render all secondary tech badges', () => {
      const secondarySection = fixture.debugElement.queryAll(By.css('.profile__tech-section'))[1];
      const badges = secondarySection.queryAll(By.css('eb-badge'));
      expect(badges.length).toBe(5);
    });

    it('should have correct primary tech values', () => {
      expect(component.primaryTech).toEqual(['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Node.js']);
    });

    it('should have correct secondary tech values', () => {
      expect(component.secondaryTech).toEqual([
        'Vitest',
        'Playwright',
        'Storybook',
        'SCSS',
        'GitHub Actions',
      ]);
    });
  });

  describe('Resume Actions', () => {
    it('should render resume actions container', () => {
      const actions = fixture.debugElement.query(By.css('.profile__actions'));
      expect(actions).toBeTruthy();
    });

    it('should render download link with correct href', () => {
      const downloadLink = fixture.debugElement.query(By.css('.profile__download-link'));
      expect(downloadLink).toBeTruthy();
      expect((downloadLink.nativeElement as HTMLAnchorElement).getAttribute('href')).toBe(
        'assets/resume/resume.pdf',
      );
    });

    it('should render download link with download attribute', () => {
      const downloadLink = fixture.debugElement.query(By.css('.profile__download-link'));
      expect((downloadLink.nativeElement as HTMLAnchorElement).getAttribute('download')).toBe(
        'resume.pdf',
      );
    });

    it('should render download button with correct text', () => {
      const downloadLink = fixture.debugElement.query(By.css('.profile__download-link'));
      const button = downloadLink.query(By.css('eb-button'));
      expect(button).toBeTruthy();
      expect((downloadLink.nativeElement as HTMLElement).textContent.trim()).toContain(
        'Download Resume',
      );
    });

    it('should render view resume button', () => {
      const actions = fixture.debugElement.query(By.css('.profile__actions'));
      const buttons = actions.queryAll(By.css('eb-button'));
      // Should have download button inside link + view button
      expect(buttons.length).toBe(2);
    });

    it('should render download button icon', () => {
      const downloadLink = fixture.debugElement.query(By.css('.profile__download-link'));
      const icon = downloadLink.query(By.css('eb-icon'));
      expect(icon).toBeTruthy();
    });

    it('should render view button icon', () => {
      const actions = fixture.debugElement.query(By.css('.profile__actions'));
      const viewButton = actions.queryAll(By.css('eb-button'))[1];
      const icon = viewButton.query(By.css('eb-icon'));
      expect(icon).toBeTruthy();
    });

    it('should open modal when view button is clicked', () => {
      const actions = fixture.debugElement.query(By.css('.profile__actions'));
      const viewButton = actions.queryAll(By.css('eb-button'))[1];
      viewButton.triggerEventHandler('clicked', null);
      fixture.detectChanges();

      expect(component.showResumeModal()).toBe(true);
    });
  });

  describe('Component Properties', () => {
    it('should have correct resumePath value', () => {
      expect(component.resumePath).toBe('assets/resume/resume.pdf');
    });

    it('should compute safe resume URL', () => {
      const safeUrl = component.safeResumeUrl();
      expect(safeUrl).toBeTruthy();
    });

    it('should compute stats date range', () => {
      const dateRange = component.statsDateRange();
      expect(dateRange.start).toBeInstanceOf(Date);
      expect(dateRange.end).toBeInstanceOf(Date);
      expect(dateRange.start < dateRange.end).toBe(true);
    });

    it('should have date range spanning approximately 365 days', () => {
      const dateRange = component.statsDateRange();
      const diffMs = dateRange.end.getTime() - dateRange.start.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      expect(diffDays).toBeCloseTo(365, 0);
    });
  });

  describe('Child Component Integration', () => {
    it('should render profile-stats-card with correct inputs', () => {
      mockStore.isLoading.set(true);
      mockStore.error.set('Test Error');
      mockStore.stats.set(mockStats);
      fixture.detectChanges();

      const statsCard = fixture.debugElement.query(By.css('eb-profile-stats-card'));
      const cardComponent = statsCard.componentInstance as ProfileStatsCardComponent;
      expect(statsCard).toBeTruthy();
      expect(cardComponent.isLoading()).toBe(true);
      expect(cardComponent.error()).toBe('Test Error');
      expect(cardComponent.stats()).toEqual(mockStats);
    });

    it('should call loadGitHubStats when retry is emitted from stats card', () => {
      mockStore.loadGitHubStats.mockReset();
      const statsCard = fixture.debugElement.query(By.css('eb-profile-stats-card'));
      statsCard.triggerEventHandler('retry', null);
      expect(mockStore.loadGitHubStats).toHaveBeenCalled();
    });
  });

  describe('Resume Modal', () => {
    it('should initially have modal closed', () => {
      expect(component.showResumeModal()).toBe(false);
    });

    it('should open the resume modal', () => {
      component.openResumeModal();
      fixture.detectChanges();
      expect(component.showResumeModal()).toBe(true);
    });

    it('should close the resume modal', () => {
      component.openResumeModal();
      fixture.detectChanges();
      component.closeResumeModal();
      fixture.detectChanges();
      expect(component.showResumeModal()).toBe(false);
    });

    it('should render modal component', () => {
      const modal = fixture.debugElement.query(By.css('eb-modal'));
      expect(modal).toBeTruthy();
    });

    it('should pass correct open state to modal', () => {
      component.openResumeModal();
      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.css('eb-modal'));
      expect((modal.componentInstance as { open: () => boolean }).open()).toBe(true);
    });

    it('should render modal header with title when open', () => {
      component.openResumeModal();
      fixture.detectChanges();

      const modalHeader = fixture.debugElement.query(By.css('[modal-header] h2'));
      expect(modalHeader).toBeTruthy();
      expect((modalHeader.nativeElement as HTMLElement).textContent.trim()).toBe('Resume Preview');
    });

    it('should render PDF embed object when modal is open', () => {
      component.openResumeModal();
      fixture.detectChanges();

      const pdfObject = fixture.debugElement.query(By.css('.profile__resume-embed'));
      expect(pdfObject).toBeTruthy();
      expect((pdfObject.nativeElement as HTMLObjectElement).type).toBe('application/pdf');
    });

    it('should have fallback download link in modal', () => {
      component.openResumeModal();
      fixture.detectChanges();

      const fallbackLink = fixture.debugElement.query(By.css('.profile__resume-modal-body a'));
      expect(fallbackLink).toBeTruthy();
      expect((fallbackLink.nativeElement as HTMLAnchorElement).getAttribute('href')).toBe(
        'assets/resume/resume.pdf',
      );
    });

    it('should close modal when closed event is triggered', () => {
      component.openResumeModal();
      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.css('eb-modal'));
      modal.triggerEventHandler('closed', null);
      fixture.detectChanges();

      expect(component.showResumeModal()).toBe(false);
    });
  });
});
