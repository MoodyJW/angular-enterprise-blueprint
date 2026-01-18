import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { SeoService } from '@core/services/seo/seo.service';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { BadgeComponent } from '@shared/components/badge';
import { ContainerComponent } from '@shared/components/container';
import { HomeComponent } from './home.component';
import { DashboardMetrics, ExtendedMetrics } from './services/dashboard.service';
import { DashboardStore } from './state/dashboard.store';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockStore: {
    metrics: ReturnType<typeof signal<DashboardMetrics | null>>;
    extendedMetrics: ReturnType<typeof signal<ExtendedMetrics | null>>;
    isLoading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadMetrics: ReturnType<typeof vi.fn>;
    loadExtendedMetrics: ReturnType<typeof vi.fn>;
  };
  let mockSeoService: {
    updatePageSeo: ReturnType<typeof vi.fn>;
  };

  const mockMetrics: DashboardMetrics = {
    generatedAt: '2024-01-01T00:00:00.000Z',
    testCoverage: { value: 96, trend: 'up', lastUpdated: '2024-01-01' },
    lighthouse: { performance: 98, accessibility: 100, bestPractices: 100, seo: 100 },
    buildStatus: 'passing',
    deployStatus: 'success',
    systemStatus: 'operational',
    activeModules: 4,
    extended: {
      testCoverage: { available: true, value: 96, trend: 'up' },
      documentation: { available: true, percentage: 80 },
      git: { available: true, commits: 100 },
      linting: { available: true, errors: 0, warnings: 0 },
      dependencies: { available: true, total: 50 },
      bundleSize: { available: false },
    },
  };

  beforeEach(async () => {
    mockStore = {
      metrics: signal(mockMetrics),
      extendedMetrics: signal(null),
      isLoading: signal(false),
      error: signal(null),
      loadMetrics: vi.fn(),
      loadExtendedMetrics: vi.fn(),
    };

    mockSeoService = {
      updatePageSeo: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              home: {
                hero: {
                  name: 'Jason Walker Moody',
                  title: 'Lead Frontend Engineer',
                  tagline: 'Building Enterprise-Grade Applications',
                  bio: 'Welcome...',
                  cta: {
                    profile: 'Meet The Architect',
                  },
                },
                systemStatus: {
                  title: 'System Status',
                  subtitle: 'Dashboard',
                  operationalStatus: 'Operational Status',
                  buildStatus: 'Build Status',
                  deployStatus: 'Deploy Status',
                  loading: 'Loading system metrics...',
                },
                projectHealth: {
                  title: 'Project Health',
                  testCoverage: 'Test Coverage',
                  perf: 'Performance',
                  a11y: 'Accessibility',
                  best: 'Best Practices',
                  seo: 'SEO',
                },
                visitors: {
                  title: 'Real-time Visitors',
                  live: 'Live',
                  subtitle: 'Active users',
                },
                theme: {
                  title: 'Active Theme',
                  systemPreference: 'System Preference',
                },
                cta: {
                  title: 'Ready to Start?',
                  description: 'Dive into...',
                  button: 'View Modules',
                },
                documentation: {
                  title: 'Documentation Coverage',
                  components: 'Components',
                  services: 'Services',
                },
                linting: {
                  title: 'Linting Status',
                  errors: 'Errors',
                  warnings: 'Warnings',
                },
                dependencies: {
                  title: 'Dependencies',
                  total: 'Total',
                  outdated: 'Outdated',
                  vulnerabilities: 'Vulnerabilities',
                },
                git: {
                  title: 'Git Statistics',
                  commits: 'Commits',
                  contributors: 'Contributors',
                  branches: 'Branches',
                },
              },
            },
          },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        }),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SeoService, useValue: mockSeoService },
      ],
    })
      .overrideComponent(HomeComponent, {
        set: {
          providers: [{ provide: DashboardStore, useValue: mockStore }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load metrics and extended metrics on init', () => {
    expect(mockStore.loadMetrics).toHaveBeenCalled();
    expect(mockStore.loadExtendedMetrics).toHaveBeenCalled();
    expect(mockSeoService.updatePageSeo).toHaveBeenCalledWith({
      title: 'Dashboard',
      meta: {
        description:
          'Angular Enterprise Blueprint Dashboard - Monitor system status, project health, and real-time visitor metrics.',
      },
    });
  });

  it('should render hero section branding', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Jason Walker Moody');
    expect(compiled.textContent).toContain('Lead Frontend Engineer');
    expect(compiled.textContent).toContain('Meet The Architect');
  });

  it('should render layout hierarchy', () => {
    fixture.detectChanges();
    const h1 = fixture.debugElement.queryAll(By.css('h1'));
    // Hero Name is h1
    expect(h1.length).toBe(1);
    expect((h1[0].nativeElement as HTMLElement).textContent).toContain('Jason Walker Moody');

    const h2 = fixture.debugElement.queryAll(By.css('h2'));
    // Hero Title and Dashboard Title
    expect(h2.length).toBe(2);
    expect((h2[0].nativeElement as HTMLElement).textContent).toContain('Lead Frontend Engineer');
    expect((h2[1].nativeElement as HTMLElement).textContent).toContain('System Status');

    const h3 = fixture.debugElement.queryAll(By.css('h3'));
    // Dashboard Cards: Operational, Project Health (Theme and CTA removed)
    expect(h3.length).toBe(2);
  });

  describe('Hero Section', () => {
    it('should render tagline', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Building Enterprise-Grade Applications');
    });

    it('should render bio', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Welcome...');
    });

    it('should render profile button with correct link', () => {
      const button = fixture.debugElement.query(By.css('.home__hero-actions eb-button'));
      expect(button).toBeTruthy();
      expect((button.nativeElement as HTMLElement).textContent).toContain('Meet The Architect');
      const routerLink = button.injector.get(RouterLink);
      expect(routerLink.urlTree?.toString()).toContain('profile');
    });
  });

  describe('Dashboard Section', () => {
    it('should render modules CTA button with correct link', () => {
      const buttons = fixture.debugElement.queryAll(By.css('eb-button'));
      // Last button should be the modules one
      const moduleBtn = buttons[buttons.length - 1];
      expect((moduleBtn.nativeElement as HTMLElement).textContent).toContain('View Modules');
      const routerLink = moduleBtn.injector.get(RouterLink);
      expect(routerLink.urlTree?.toString()).toContain('modules');
    });
  });

  it('should render system status badge', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Operational');
  });

  it('should render test coverage', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('96%');
  });

  describe('getTrendIcon', () => {
    it('should return up arrow for up trend', () => {
      expect(component.getTrendIcon('up')).toBe('↑');
    });

    it('should return down arrow for down trend', () => {
      expect(component.getTrendIcon('down')).toBe('↓');
    });

    it('should return stable icon for stable trend', () => {
      expect(component.getTrendIcon('stable')).toBe('−');
    });
  });

  describe('getTrendColor', () => {
    it('should return success for up trend', () => {
      expect(component.getTrendColor('up')).toBe('success');
    });

    it('should return error for down trend', () => {
      expect(component.getTrendColor('down')).toBe('error');
    });

    it('should return neutral for stable trend', () => {
      expect(component.getTrendColor('stable')).toBe('neutral');
    });
  });

  describe('Template States', () => {
    it('should display loading state when isLoading is true', () => {
      mockStore.isLoading.set(true);
      mockStore.metrics.set(null);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Loading system metrics...');
    });

    it('should display error message when error is set', () => {
      mockStore.error.set('Failed to load data');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Failed to load data');
    });

    it('should not show metrics when metrics is null', () => {
      mockStore.metrics.set(null);
      mockStore.isLoading.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('96%');
    });

    it('should render trend icon in template', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('↑');
    });

    it('should show deploy status badge', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Success');
    });

    it('should show build status badge', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Passing');
    });

    it('should show down trend icon when trend is down', () => {
      const currentMetrics = mockStore.metrics();
      if (currentMetrics) {
        mockStore.metrics.set({
          ...currentMetrics,
          testCoverage: { value: 80, trend: 'down', lastUpdated: '2024-01-01' },
        });
      }
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('↓');
    });

    it('should show stable trend icon when trend is stable', () => {
      const currentMetrics = mockStore.metrics();
      if (currentMetrics) {
        mockStore.metrics.set({
          ...currentMetrics,
          testCoverage: { value: 90, trend: 'stable', lastUpdated: '2024-01-01' },
        });
      }
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('−');
    });

    it('should show error badge when system status is not operational', () => {
      const currentMetrics = mockStore.metrics();
      if (currentMetrics) {
        mockStore.metrics.set({
          ...currentMetrics,
          systemStatus: 'degraded',
        });
      }
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Degraded');
    });

    it('should show error badge when deploy status is failed', () => {
      const currentMetrics = mockStore.metrics();
      if (currentMetrics) {
        mockStore.metrics.set({
          ...currentMetrics,
          deployStatus: 'failed',
        });
      }
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Failed');
    });
  });

  describe('Extended Metrics', () => {
    const mockFullMetrics: ExtendedMetrics = {
      testCoverage: { available: true, value: 96, trend: 'up' },
      documentation: {
        available: true,
        percentage: 100,
        components: { documented: 10, total: 10 },
        services: { documented: 5, total: 5 },
      },
      git: { available: true, commits: 100 },
      linting: { available: true, errors: 0, warnings: 0 },
      dependencies: { available: true, total: 50 },
      bundleSize: { available: false },
      lighthouse: {
        available: true,
        performance: 100,
        accessibility: 100,
        bestPractices: 100,
        seo: 100,
      },
    };

    it('should show success badge for good documentation coverage', () => {
      mockStore.extendedMetrics.set(mockFullMetrics);
      fixture.detectChanges();
      const badges = fixture.debugElement.queryAll(By.directive(BadgeComponent));
      const docBadge = badges.find((b) => {
        const inst = b.componentInstance as BadgeComponent;
        const content = inst.content();
        return typeof content === 'string' && content.includes('%');
      });
      const inst = docBadge?.componentInstance as BadgeComponent;
      expect(inst.variant()).toBe('success');
    });

    it('should show warning badge for low documentation coverage', () => {
      mockStore.extendedMetrics.set({
        ...mockFullMetrics,
        documentation: {
          available: true,
          percentage: 50,
          components: { documented: 5, total: 10 },
          services: { documented: 0, total: 5 },
        },
      });
      fixture.detectChanges();
      const badges = fixture.debugElement.queryAll(By.directive(BadgeComponent));
      const docBadge = badges.find((b) => {
        const inst = b.componentInstance as BadgeComponent;
        const content = inst.content();
        return typeof content === 'string' && content.includes('%');
      });
      const inst = docBadge?.componentInstance as BadgeComponent;
      expect(inst.variant()).toBe('warning');
    });

    it('should hide documentation card if not available', () => {
      mockStore.extendedMetrics.set({
        ...mockFullMetrics,
        documentation: { available: false, percentage: 0 },
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('Documentation Coverage');
    });

    it('should show clean linting badge', () => {
      mockStore.extendedMetrics.set(mockFullMetrics);
      fixture.detectChanges();
      const badges = fixture.debugElement.queryAll(By.directive(BadgeComponent));
      const lintBadge = badges.find((b) => {
        const inst = b.componentInstance as BadgeComponent;
        const content = inst.content();
        return typeof content === 'string' && content.includes('Clean');
      });
      const inst = lintBadge?.componentInstance as BadgeComponent;
      expect(inst.variant()).toBe('success');
    });

    it('should show error linting badge when errors exist', () => {
      mockStore.extendedMetrics.set({
        ...mockFullMetrics,
        linting: { available: true, errors: 5, warnings: 2 },
      });
      fixture.detectChanges();
      const badges = fixture.debugElement.queryAll(By.directive(BadgeComponent));
      const lintBadge = badges.find((b) => {
        const inst = b.componentInstance as BadgeComponent;
        const content = inst.content();
        return typeof content === 'string' && content.includes('errors');
      });
      const inst = lintBadge?.componentInstance as BadgeComponent;
      expect(inst.variant()).toBe('error');
    });

    it('should hide linting card if not available', () => {
      mockStore.extendedMetrics.set({
        ...mockFullMetrics,
        linting: { available: false },
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('Linting Status');
    });

    it('should show secure dependencies badge', () => {
      mockStore.extendedMetrics.set(mockFullMetrics);
      fixture.detectChanges();
      const badges = fixture.debugElement.queryAll(By.directive(BadgeComponent));
      const depBadge = badges.find((b) => {
        const inst = b.componentInstance as BadgeComponent;
        const content = inst.content();
        return typeof content === 'string' && content.includes('Secure');
      });
      const inst = depBadge?.componentInstance as BadgeComponent;
      expect(inst.variant()).toBe('success');
    });

    it('should show error dependencies badge when high vulnerabilities exist', () => {
      mockStore.extendedMetrics.set({
        ...mockFullMetrics,
        dependencies: { available: true, total: 10, vulnerabilities: { total: 2, high: 1 } },
      });
      fixture.detectChanges();
      const badges = fixture.debugElement.queryAll(By.directive(BadgeComponent));
      const depBadge = badges.find((b) => {
        const inst = b.componentInstance as BadgeComponent;
        const content = inst.content();
        return typeof content === 'string' && content.includes('issues');
      });
      const inst = depBadge?.componentInstance as BadgeComponent;
      expect(inst.variant()).toBe('error');
    });

    it('should hide dependencies card if not available', () => {
      mockStore.extendedMetrics.set({
        ...mockFullMetrics,
        dependencies: { available: false },
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('Dependencies');
    });

    it('should render git stats when available', () => {
      mockStore.extendedMetrics.set({
        ...mockFullMetrics,
        git: { available: true, commits: 123, contributors: 5, branches: 2 },
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('123');
      expect(compiled.textContent).toContain('Git Statistics');
    });

    it('should hide git card if not available', () => {
      mockStore.extendedMetrics.set({
        ...mockFullMetrics,
        git: { available: false },
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('Git Statistics');
    });
  });

  describe('Layout', () => {
    it('should use large padding on container for proper mobile spacing', () => {
      const container = fixture.debugElement.query(By.css('eb-container'));
      expect(container).toBeTruthy();
      // Check signal input value
      const containerInstance = container.componentInstance as ContainerComponent;
      expect(containerInstance.padding()).toBe('lg');
    });

    it('should have hero actions container for button layout', () => {
      const actions = fixture.debugElement.query(By.css('.home__hero-actions'));
      expect(actions).toBeTruthy();
    });
  });
});
