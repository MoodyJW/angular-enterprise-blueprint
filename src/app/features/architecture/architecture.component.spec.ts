// @vitest-environment jsdom
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SeoService } from '@core/services/seo/seo.service';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { ICON_NAMES } from '@shared/constants';

import { ArchitectureComponent } from './architecture.component';

describe('ArchitectureComponent', () => {
  let component: ArchitectureComponent;
  let fixture: ComponentFixture<ArchitectureComponent>;
  let mockSeoService: {
    updatePageSeo: ReturnType<typeof vi.fn>;
  };

  const translationsEn = {
    common: { loading: 'Loading...' },
    architecture: {
      title: 'Architecture Decisions',
      subtitle: 'Explore patterns',
      searchPlaceholder: 'Search ADRs...',
      searchLabel: 'Search ADRs',
      resultsCount: '{{ count }} found',
      noResults: 'No Results',
      noResultsHint: 'Try different search',
      clearSearch: 'Clear',
      statusLabel: 'Status: {{ status }}',
      data: {
        'adr-001-test': {
          title: 'Test Architecture Decision',
          summary: 'This is a test ADR summary.',
        },
        'adr-001': {
          title: 'First Decision',
          summary: 'First summary',
        },
        'adr-002': {
          title: 'Second Decision',
          summary: 'Second summary',
        },
        'adr-002-deprecated': {
          title: 'Deprecated Decision',
          summary: 'A deprecated decision.',
        },
      },
      statuses: {
        accepted: 'accepted',
        deprecated: 'deprecated',
        superseded: 'superseded',
      },
    },
  };

  beforeEach(async () => {
    mockSeoService = {
      updatePageSeo: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ArchitectureComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translationsEn },
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
    }).compileComponents();

    fixture = TestBed.createComponent(ArchitectureComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have ICONS constant defined', () => {
      expect(component['ICONS']).toBeDefined();
      expect(component['ICONS']).toBe(ICON_NAMES);
    });
  });

  describe('Search Functionality', () => {
    it('should have a search value signal initialized to empty string', () => {
      expect(component['searchValue']).toBeDefined();
      expect(component['searchValue']()).toBe('');
    });

    it('should update searchValue when onSearchChange is called', () => {
      component['onSearchChange']('test query');
      expect(component['searchValue']()).toBe('test query');
    });

    it('should have searchSubject defined for debouncing', () => {
      expect(component['_searchSubject']).toBeDefined();
    });

    it('should emit to searchSubject when onSearchChange is called', () => {
      const nextSpy = vi.spyOn(component['_searchSubject'], 'next');
      component['onSearchChange']('signal');
      expect(nextSpy).toHaveBeenCalledWith('signal');
    });
  });

  describe('Clear Search', () => {
    it('should clear searchValue when clearSearch is called', () => {
      component['searchValue'].set('some query');
      expect(component['searchValue']()).toBe('some query');

      component['clearSearch']();
      expect(component['searchValue']()).toBe('');
    });

    it('should call store clearFilter when clearSearch is called', () => {
      const clearFilterSpy = vi.spyOn(component['store'], 'clearFilter');
      component['clearSearch']();
      expect(clearFilterSpy).toHaveBeenCalled();
    });

    it('should clear store filter when clearSearch is called', () => {
      // Set a filter first directly on store
      component['store'].setFilter('test');
      expect(component['store'].filter()).toBe('test');

      // Clear
      component['clearSearch']();
      expect(component['store'].filter()).toBe('');
    });
  });

  describe('Store Integration', () => {
    it('should have store injected', () => {
      expect(component['store']).toBeDefined();
    });

    it('should have store entities signal', () => {
      expect(component['store'].entities).toBeDefined();
    });

    it('should have store isLoading signal', () => {
      expect(component['store'].isLoading).toBeDefined();
    });

    it('should have store error signal', () => {
      expect(component['store'].error).toBeDefined();
    });

    it('should have store filteredAdrs computed', () => {
      expect(component['store'].filteredAdrs).toBeDefined();
    });

    it('should have store filter signal', () => {
      expect(component['store'].filter).toBeDefined();
    });

    it('should load ADRs on init', () => {
      const loadAdrsSpy = vi.spyOn(component['store'], 'loadAdrs');
      component.ngOnInit();
      expect(loadAdrsSpy).toHaveBeenCalled();
    });

    it('should update SEO on init', () => {
      component.ngOnInit();
      expect(mockSeoService.updatePageSeo).toHaveBeenCalledWith({
        title: 'Architecture Decisions',
        meta: {
          description: 'Browse Architectural Decision Records (ADRs) and design patterns.',
        },
      });
    });
  });

  describe('Status Variant Helper', () => {
    it('should return success for accepted status', () => {
      expect(component['getStatusVariant']('accepted')).toBe('success');
    });

    it('should return warning for deprecated status', () => {
      expect(component['getStatusVariant']('deprecated')).toBe('warning');
    });

    it('should return secondary for superseded status', () => {
      expect(component['getStatusVariant']('superseded')).toBe('secondary');
    });

    it('should return secondary for unknown status', () => {
      expect(component['getStatusVariant']('unknown')).toBe('secondary');
    });

    it('should return secondary for empty string', () => {
      expect(component['getStatusVariant']('')).toBe('secondary');
    });
  });

  describe('Template Rendering', () => {
    it('should render the component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });

    it('should contain the container', () => {
      fixture.detectChanges();
      const container = (fixture.nativeElement as HTMLElement).querySelector('eb-container');
      expect(container).toBeTruthy();
    });

    it('should render the title', () => {
      fixture.detectChanges();
      const html = (fixture.nativeElement as HTMLElement).innerHTML;
      expect(html).toContain('Architecture Decisions');
    });

    it('should render the search input', () => {
      fixture.detectChanges();
      const input = (fixture.nativeElement as HTMLElement).querySelector('eb-input');
      expect(input).toBeTruthy();
    });
  });

  describe('Template State Rendering', () => {
    it('should display loading state when isLoading is true', () => {
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(true);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Loading...');
    });

    it('should display error message when error is set', () => {
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue('Failed to load ADRs');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Failed to load ADRs');
    });

    it('should display empty state when no ADRs match filter', () => {
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filteredAdrs').mockReturnValue([]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('No Results');
      expect(compiled.textContent).toContain('Try different search');
    });

    it('should show clear button in empty state when filter is set', () => {
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filteredAdrs').mockReturnValue([]);
      vi.spyOn(component['store'], 'filter').mockReturnValue('some query');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Clear');
    });

    it('should render ADR cards when ADRs are available', () => {
      const mockAdrs = [
        {
          id: 'adr-001-test',
          number: 'ADR-001',
          title: 'Test Architecture Decision',
          status: 'accepted' as const,
          date: '2024-01-15',
          summary: 'This is a test ADR summary.',
        },
      ];
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filteredAdrs').mockReturnValue(mockAdrs);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('ADR-001');
      expect(compiled.textContent).toContain('Test Architecture Decision');
      expect(compiled.textContent).toContain('This is a test ADR summary');
    });

    it('should render ADR date and status badge', () => {
      const mockAdrs = [
        {
          id: 'adr-002-deprecated',
          number: 'ADR-002',
          title: 'Deprecated Decision',
          status: 'deprecated' as const,
          date: '2024-02-20',
          summary: 'A deprecated decision.',
        },
      ];
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filteredAdrs').mockReturnValue(mockAdrs);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('2024-02-20');
      expect(compiled.textContent).toContain('deprecated');
    });

    it('should display results count when filter is set', () => {
      const mockAdrs = [
        {
          id: 'adr-001-test',
          number: 'ADR-001',
          title: 'Test Decision',
          status: 'accepted' as const,
          date: '2024-01-15',
          summary: 'Summary',
        },
      ];
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filter').mockReturnValue('test');
      vi.spyOn(component['store'], 'filteredAdrs').mockReturnValue(mockAdrs);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('1 found');
    });

    it('should render multiple ADR cards', () => {
      const mockAdrs = [
        {
          id: 'adr-001',
          number: 'ADR-001',
          title: 'First Decision',
          status: 'accepted' as const,
          date: '2024-01-01',
          summary: 'First summary',
        },
        {
          id: 'adr-002',
          number: 'ADR-002',
          title: 'Second Decision',
          status: 'superseded' as const,
          date: '2024-01-02',
          summary: 'Second summary',
        },
      ];
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filteredAdrs').mockReturnValue(mockAdrs);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('First Decision');
      expect(compiled.textContent).toContain('Second Decision');
      expect(compiled.textContent).toContain('ADR-001');
      expect(compiled.textContent).toContain('ADR-002');
    });
  });
});
