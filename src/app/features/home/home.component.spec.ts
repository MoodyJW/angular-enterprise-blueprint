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
});
