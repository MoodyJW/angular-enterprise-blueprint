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
          langs: { en: {} },
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

  describe('Child Component Integration', () => {
    it('should render profile-stats-card with correct inputs', () => {
      mockStore.isLoading.set(true);
      mockStore.error.set('Test Error');
      mockStore.stats.set(mockStats);
      fixture.detectChanges();

      const statsCard = fixture.debugElement.query(By.css('eb-profile-stats-card'));
      const component = statsCard.componentInstance as ProfileStatsCardComponent;
      expect(statsCard).toBeTruthy();
      expect(component.isLoading()).toBe(true);
      expect(component.error()).toBe('Test Error');
      expect(component.stats()).toEqual(mockStats);
    });

    it('should call refreshStats when retry is emitted from stats card', () => {
      const statsCard = fixture.debugElement.query(By.css('eb-profile-stats-card'));
      statsCard.triggerEventHandler('retry', null);
      expect(mockStore.loadGitHubStats).toHaveBeenCalled();
    });
  });

  describe('Resume Modal', () => {
    it('should open and close the resume modal', () => {
      // Open
      component.openResumeModal();
      fixture.detectChanges();
      expect(component.showResumeModal()).toBe(true);

      // Close
      component.closeResumeModal();
      fixture.detectChanges();
      expect(component.showResumeModal()).toBe(false);
    });
  });
});
