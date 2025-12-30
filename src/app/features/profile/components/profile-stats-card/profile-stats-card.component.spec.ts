import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { GitHubStats } from '@features/profile/models/github-stats.interface';
import { ProfileStatsCardComponent } from './profile-stats-card.component';

describe('ProfileStatsCardComponent', () => {
  let component: ProfileStatsCardComponent;
  let fixture: ComponentFixture<ProfileStatsCardComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileStatsCardComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileStatsCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('stats', null);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Loading State', () => {
    it('should show loading skeletons when loading is true', () => {
      fixture.componentRef.setInput('isLoading', true);
      fixture.detectChanges();

      const skeleton = fixture.debugElement.query(By.css('eb-skeleton'));
      expect(skeleton).toBeTruthy();

      const dateRangeSkeleton = fixture.debugElement.query(
        By.css('.stats-card__range eb-skeleton'),
      );
      expect(dateRangeSkeleton).toBeTruthy();

      const companySkeleton = fixture.debugElement.query(
        By.css('.stats-card__info-right eb-skeleton[ariaLabel="Loading company"]'),
      );
      expect(companySkeleton).toBeTruthy();

      const locationSkeleton = fixture.debugElement.query(
        By.css('.stats-card__info-right eb-skeleton[ariaLabel="Loading location"]'),
      );
      expect(locationSkeleton).toBeTruthy();

      const errorMsg = fixture.debugElement.query(By.css('.stats-card__error'));
      expect(errorMsg).toBeFalsy();
    });
  });

  describe('Error State', () => {
    it('should show error message and retry button when error is present', () => {
      fixture.componentRef.setInput('error', 'Network error');
      fixture.detectChanges();

      const errorMsg = fixture.debugElement.query(By.css('.stats-card__error'));
      expect(errorMsg).toBeTruthy();
      expect((errorMsg.nativeElement as HTMLElement).textContent).toContain('Network error');

      const retryButton = fixture.debugElement.query(By.css('eb-button'));
      expect(retryButton).toBeTruthy();
    });

    it('should emit retry event when retry button is clicked', () => {
      let emitted = false;
      component.retry.subscribe(() => (emitted = true));

      fixture.componentRef.setInput('error', 'Network error');
      fixture.detectChanges();

      const retryButton = fixture.debugElement.query(By.css('eb-button'));
      retryButton.triggerEventHandler('clicked', null);

      expect(emitted).toBe(true);
    });
  });

  describe('Success State', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('stats', mockStats);
      fixture.detectChanges();
    });

    it('should display user profile information', () => {
      const name = fixture.debugElement.query(By.css('.stats-card__name'));
      const username = fixture.debugElement.query(By.css('.stats-card__username-link'));
      const email = fixture.debugElement.query(By.css('.stats-card__email-link'));
      const company = fixture.debugElement.query(
        By.css('.stats-card__company .stats-card__company-link'),
      );
      const location = fixture.debugElement.query(By.css('.stats-card__location'));

      expect((name.nativeElement as HTMLElement).textContent).toContain('Test User');
      expect((username.nativeElement as HTMLElement).textContent).toContain('@testuser');
      expect((email.nativeElement as HTMLElement).textContent).toContain('test@example.com');
      expect((company.nativeElement as HTMLElement).textContent).toContain('Test Company');
      expect((location.nativeElement as HTMLElement).textContent).toContain('Test Location');
    });

    it('should display GitHub stats with correct values', () => {
      const statsValues = fixture.debugElement.queryAll(By.css('.stats-card__stat-value'));

      // Repos
      expect((statsValues[0].nativeElement as HTMLElement).textContent).toContain('10');
      // Commits (formatted with number pipe)
      expect((statsValues[1].nativeElement as HTMLElement).textContent).toContain('100');
      // Pull Requests
      expect((statsValues[2].nativeElement as HTMLElement).textContent).toContain('5');
      // Lines Added
      expect((statsValues[3].nativeElement as HTMLElement).textContent).toContain('+150');
      // Lines Removed
      expect((statsValues[4].nativeElement as HTMLElement).textContent).toContain('-50');
    });

    it('should have correct links', () => {
      const usernameLink = fixture.debugElement.query(By.css('.stats-card__username-link'));
      expect(usernameLink.attributes['href']).toBe('https://github.com/testuser');

      const companyLink = fixture.debugElement.query(By.css('.stats-card__company-link'));
      expect(companyLink.attributes['href']).toBe('https://www.nov.com/');
    });
  });
});
