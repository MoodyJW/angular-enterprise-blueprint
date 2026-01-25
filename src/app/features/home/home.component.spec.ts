import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { Adr } from '@core/services/architecture/architecture.service';
import { ArchitectureStore } from '@core/services/architecture/architecture.store';
import { SeoService } from '@core/services/seo/seo.service';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { BadgeComponent } from '@shared/components/badge';
import { ContainerComponent } from '@shared/components/container';
import { MockInstance } from 'vitest';
import { HomeComponent } from './home.component';
import { DashboardMetrics, ExtendedMetrics } from './services/dashboard.service';
import { DashboardStore } from './state/dashboard.store';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockStore: {
    metrics: WritableSignal<DashboardMetrics | null>;
    extendedMetrics: WritableSignal<ExtendedMetrics | null>;
    isLoading: WritableSignal<boolean>;
    error: WritableSignal<string | null>;
    loadMetrics: ReturnType<typeof vi.fn>;
    loadExtendedMetrics: ReturnType<typeof vi.fn>;
  };
  let mockArchitectureStore: {
    entities: WritableSignal<Adr[]>;
    isLoading: WritableSignal<boolean>;
    loadAdrs: ReturnType<typeof vi.fn>;
  };
  let mockSeoService: {
    updatePageSeo: ReturnType<typeof vi.fn>;
  };

  const mockMetrics: DashboardMetrics = {
    generatedAt: '2024-01-01T00:00:00.000Z',
    buildStatus: 'passing',
    deployStatus: 'success',
    systemStatus: 'operational',
    activeModules: 4,
    extended: {
      testCoverage: {
        available: true,
        value: 96,
        trend: 'up',
        lastUpdated: '2024-01-01',
        details: {
          statements: { pct: 95, covered: 100, total: 105 },
          branches: { pct: 90, covered: 50, total: 55 },
          functions: { pct: 100, covered: 20, total: 20 },
          lines: { pct: 96, covered: 100, total: 104 },
        },
      },
      lighthouse: {
        available: true,
        performance: 98,
        accessibility: 100,
        bestPractices: 100,
        seo: 100,
      },
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

    mockArchitectureStore = {
      entities: signal<Adr[]>([]),
      isLoading: signal(false),
      loadAdrs: vi.fn(),
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
                  average: 'Average',
                  statements: 'Statements',
                  branches: 'Branches',
                  viewRepository: 'View Repository',
                  functions: 'Functions',
                  lines: 'Lines',
                  perf: 'Perf',
                  a11y: 'Accessibility',
                  best: 'Best Practices',
                  seo: 'SEO',
                  viewLighthouse: 'View Report',
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
                  viewStorybook: 'View Storybook',
                },
                linting: {
                  title: 'Linting Status',
                  errors: 'Errors',
                  warnings: 'Warnings',
                  viewConfig: 'View Config',
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
                  viewRepository: 'View Repository',
                },
                architecture: {
                  title: 'Latest Decisions',
                  viewAll: 'View All',
                  viewAllAria: 'View all architecture decisions',
                  loading: 'Loading updates...',
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
          providers: [
            { provide: DashboardStore, useValue: mockStore },
            { provide: ArchitectureStore, useValue: mockArchitectureStore },
          ],
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

  it('should load critical metrics on init', () => {
    expect(mockStore.loadMetrics).toHaveBeenCalled();
    expect(mockSeoService.updatePageSeo).toHaveBeenCalledWith({
      title: 'Dashboard',
      meta: {
        description:
          'Angular Enterprise Blueprint Dashboard - Monitor system status, project health, and real-time visitor metrics.',
      },
    });
  });

  it('should defer non-critical data loading until after render', async () => {
    // Wait for afterNextRender and requestIdleCallback
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockStore.loadExtendedMetrics).toHaveBeenCalled();
    expect(mockArchitectureStore.loadAdrs).toHaveBeenCalled();
  });

  it('should fallback to setTimeout if requestIdleCallback is unavailable', async () => {
    // Preserve original
    const win = window as unknown as {
      requestIdleCallback: unknown;
    };
    const originalRIC = win.requestIdleCallback;
    win.requestIdleCallback = undefined;

    // Create new component instance to trigger constructor
    const fixtureHelper = TestBed.createComponent(HomeComponent);
    // Trigger render
    fixtureHelper.detectChanges();

    // Wait for setTimeout(..., 1)
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(mockStore.loadExtendedMetrics).toHaveBeenCalled();
    expect(mockArchitectureStore.loadAdrs).toHaveBeenCalled();

    // Restore
    win.requestIdleCallback = originalRIC;
  });

  it('should render hero section branding', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Jason Walker Moody');
    expect(compiled.textContent).toContain('Lead Frontend Engineer');
    expect(compiled.textContent).toContain('Meet The Architect');
  });

  it('should render layout hierarchy', () => {
    fixture.detectChanges();

    // Check for Unified Grid
    const grid = fixture.debugElement.query(By.css('eb-grid.home__layout'));
    expect(grid).toBeTruthy();

    // Hero Name is h1
    const h1 = fixture.debugElement.queryAll(By.css('h1'));
    expect(h1.length).toBe(1);
    expect((h1[0].nativeElement as HTMLElement).textContent).toContain('Jason Walker Moody');

    const h2 = fixture.debugElement.queryAll(By.css('h2'));
    // Hero Title and Dashboard Title
    expect(h2.length).toBe(2);
    expect((h2[0].nativeElement as HTMLElement).textContent).toContain('Lead Frontend Engineer');
    expect((h2[1].nativeElement as HTMLElement).textContent).toContain('System Status');

    const h3 = fixture.debugElement.queryAll(By.css('h3'));
    // Dashboard Cards: Operational, Test Coverage, Performance, Architecture (4 visible by default)
    expect(h3.length).toBeGreaterThanOrEqual(4);
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
      const button = fixture.debugElement.query(
        By.css('.home__hero-actions eb-button[variant="primary"]'),
      );
      expect(button).toBeTruthy();
      expect((button.nativeElement as HTMLElement).textContent).toContain('Meet The Architect');
      const routerLink = button.injector.get(RouterLink);
      expect(routerLink.urlTree?.toString()).toContain('profile');
    });
  });

  describe('Dashboard Section', () => {
    it('should render modules CTA button with correct link', () => {
      const buttons = fixture.debugElement.queryAll(By.css('eb-button'));
      const moduleBtn = buttons.find((b) => {
        const text = (b.nativeElement as HTMLElement).textContent;
        return text.includes('View Modules');
      });
      expect(moduleBtn).toBeTruthy();
      if (!moduleBtn) return;
      const routerLink = moduleBtn.injector.get(RouterLink);
      expect(routerLink.urlTree?.toString()).toContain('modules');
    });

    it('should render architecture CTA button', () => {
      const buttons = fixture.debugElement.queryAll(By.css('eb-button'));
      const archBtn = buttons.find((b) => {
        const text = (b.nativeElement as HTMLElement).textContent;
        return text.includes('View All');
      });
      expect(archBtn).toBeTruthy();
      if (!archBtn) return;
      const routerLink = archBtn.injector.get(RouterLink);
      expect(routerLink.urlTree?.toString()).toContain('architecture');
    });
  });

  it('should render system status badge', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Operational');
  });

  it('should render test coverage', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('96');
    expect(compiled.textContent).toContain('Average'); // Check for the new label
    expect(compiled.textContent).toContain('Statements');
    expect(compiled.textContent).not.toContain('Branches');
    expect(compiled.textContent).toContain('Functions');
    expect(compiled.textContent).toContain('Lines');
  });

  describe('getScoreVariant', () => {
    it('should return success for scores >= 90', () => {
      expect(component.getScoreVariant(90)).toBe('success');
      expect(component.getScoreVariant(100)).toBe('success');
    });

    it('should return warning for scores >= 50 and < 90', () => {
      expect(component.getScoreVariant(50)).toBe('warning');
      expect(component.getScoreVariant(89)).toBe('warning');
    });

    it('should return error for scores < 50', () => {
      expect(component.getScoreVariant(49)).toBe('error');
      expect(component.getScoreVariant(0)).toBe('error');
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

    // Trend icon removed in favor of Donut Chart visualization
    // it('should render trend icon in template', () => {
    //   fixture.detectChanges();
    //   const compiled = fixture.nativeElement as HTMLElement;
    //   expect(compiled.textContent).toContain('↑');
    // });

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

    // Trend icons removed
    it('should show down trend calculation logically', () => {
      // Keeping logic test if needed, or remove visual check
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

  describe('External Links', () => {
    let windowOpenSpy: MockInstance<typeof window.open>;

    beforeEach(() => {
      windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    });

    afterEach(() => {
      windowOpenSpy.mockRestore();
    });

    describe('openCoverageReport', () => {
      it('should open coverage report in new tab', () => {
        component.openCoverageReport();
        expect(windowOpenSpy).toHaveBeenCalledWith(
          expect.stringContaining('coverage/index.html'),
          '_blank',
        );
      });

      it('should use document.baseURI for URL resolution', () => {
        component.openCoverageReport();
        expect(windowOpenSpy).toHaveBeenCalled();
        const calls = windowOpenSpy.mock.calls;
        const calledUrl = calls[0]?.[0] ?? '';
        expect(calledUrl).toMatch(/^https?:\/\//);
      });
    });

    describe('openLighthouseReport', () => {
      it('should open lighthouse report in new tab', () => {
        component.openLighthouseReport();
        expect(windowOpenSpy).toHaveBeenCalledWith(
          expect.stringContaining('lighthouse/index.html'),
          '_blank',
        );
      });

      it('should use document.baseURI for URL resolution', () => {
        component.openLighthouseReport();
        const calledUrl = windowOpenSpy.mock.calls[0][0] as string;
        expect(calledUrl).toMatch(/^https?:\/\//);
      });
    });

    describe('openEslintConfig', () => {
      it('should open ESLint config on GitHub in new tab', () => {
        component.openEslintConfig();
        expect(windowOpenSpy).toHaveBeenCalledWith(
          'https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/eslint.config.mjs',
          '_blank',
        );
      });
    });

    describe('openStorybook', () => {
      it('should open storybook in new tab', () => {
        component.openStorybook();
        expect(windowOpenSpy).toHaveBeenCalledWith(
          expect.stringContaining('storybook/index.html'),
          '_blank',
        );
      });

      it('should use document.baseURI for URL resolution', () => {
        component.openStorybook();
        const calledUrl = windowOpenSpy.mock.calls[0][0] as string;
        expect(calledUrl).toMatch(/^https?:\/\//);
      });
    });

    describe('openRepository', () => {
      it('should open GitHub repository in new tab', () => {
        component.openRepository();
        expect(windowOpenSpy).toHaveBeenCalledWith(
          'https://github.com/MoodyJW/angular-enterprise-blueprint',
          '_blank',
        );
      });
    });
  });
});
