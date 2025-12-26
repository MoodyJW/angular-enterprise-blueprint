import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              home: {
                systemStatus: {
                  operationalStatus: 'Operational Status',
                },
                projectHealth: {
                  testCoverage: 'Test Coverage',
                },
                visitors: {
                  title: 'Real-time Visitors',
                },
                theme: {
                  title: 'Active Theme',
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
      // Check for the loading state translation key since not all translations are registered in test module
      expect(compiled.textContent).toContain('loading');
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
      // Metrics with 'up' trend is already set
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

    it('should render lighthouse scores', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('98'); // performance
      expect(compiled.textContent).toContain('100'); // accessibility, bestPractices, seo
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
