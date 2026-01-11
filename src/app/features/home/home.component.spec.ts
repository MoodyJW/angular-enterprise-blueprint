import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { SeoService } from '@core/services/seo/seo.service';
import { ThemeService } from '@core/services/theme/theme.service';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { HomeComponent } from './home.component';
import { DashboardMetrics } from './services/dashboard.service';
import { DashboardStore } from './state/dashboard.store';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockStore: {
    metrics: ReturnType<typeof signal<DashboardMetrics | null>>;
    activeVisitors: ReturnType<typeof signal<number>>;
    isLoading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    loadMetrics: ReturnType<typeof vi.fn>;
    loadVisitors: ReturnType<typeof vi.fn>;
  };
  let mockThemeService: {
    currentTheme: ReturnType<typeof signal<{ name: string }>>;
    systemPrefersDark: ReturnType<typeof signal<boolean>>;
  };
  let mockSeoService: {
    updatePageSeo: ReturnType<typeof vi.fn>;
  };

  const mockMetrics: DashboardMetrics = {
    testCoverage: { value: 96, trend: 'up', lastUpdated: '2024-01-01' },
    lighthouse: { performance: 98, accessibility: 100, bestPractices: 100, seo: 100 },
    buildStatus: 'passing',
    deployStatus: 'success',
    systemStatus: 'operational',
    activeModules: 4,
  };

  beforeEach(async () => {
    mockStore = {
      metrics: signal(mockMetrics),
      activeVisitors: signal(42),
      isLoading: signal(false),
      error: signal(null),
      loadMetrics: vi.fn(),
      loadVisitors: vi.fn(),
    };

    mockThemeService = {
      currentTheme: signal({ name: 'Daylight' }),
      systemPrefersDark: signal(false),
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
        { provide: ThemeService, useValue: mockThemeService },
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

  it('should load metrics and visitors on init', () => {
    expect(mockStore.loadMetrics).toHaveBeenCalled();
    expect(mockStore.loadVisitors).toHaveBeenCalled();
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
    // Dashboard Cards: Operational, Project Health, Visitors, Theme, CTA
    expect(h3.length).toBe(5);
    expect((h3[4].nativeElement as HTMLElement).textContent).toContain('Ready to Start?');
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

  it('should render active visitors from store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('42');

    // Update store signal
    mockStore.activeVisitors.set(99);
    fixture.detectChanges();
    expect(compiled.textContent).toContain('99');
  });

  it('should display active theme from service', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Daylight');

    // Update theme signal
    mockThemeService.currentTheme.set({ name: 'Midnight' });
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Midnight');
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

    it('should display system preference as Dark Mode when systemPrefersDark is true', () => {
      mockThemeService.systemPrefersDark.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Dark Mode');
    });

    it('should display system preference as Light Mode when systemPrefersDark is false', () => {
      mockThemeService.systemPrefersDark.set(false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Light Mode');
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
});
