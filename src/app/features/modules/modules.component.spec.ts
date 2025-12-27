// @vitest-environment jsdom
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { ICON_NAMES } from '@shared/constants';

import { ModulesComponent } from './modules.component';

describe('ModulesComponent', () => {
  let component: ModulesComponent;
  let fixture: ComponentFixture<ModulesComponent>;

  const translationsEn = {
    common: { loading: 'Loading...' },
    modules: {
      title: 'Reference Modules',
      subtitle: 'Explore patterns',
      searchPlaceholder: 'Search...',
      searchLabel: 'Search modules',
      resultsCount: '{{ count }} found',
      viewDetails: 'View Details',
      noResults: 'No Results',
      noResultsHint: 'Try different search',
      clearSearch: 'Clear',
      detail: {
        statusLabel: 'Status: {{ status }}',
        categoryLabel: 'Category: {{ category }}',
      },
      data: {
        'test-module': {
          title: 'Test Module',
          description: 'A test module description',
          features: ['Feature 1', 'Feature 2'],
        },
      },
      categories: {
        ui: 'UI Components',
        infrastructure: 'Infrastructure',
      },
      statuses: {
        production: 'Production',
        beta: 'Beta',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModulesComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translationsEn },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        }),
      ],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ModulesComponent);
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
      component['onSearchChange']('angular');
      expect(nextSpy).toHaveBeenCalledWith('angular');
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

    it('should have store filteredModules computed', () => {
      expect(component['store'].filteredModules).toBeDefined();
    });

    it('should have store filter signal', () => {
      expect(component['store'].filter).toBeDefined();
    });

    it('should load modules on init', () => {
      const loadModulesSpy = vi.spyOn(component['store'], 'loadModules');
      component.ngOnInit();
      expect(loadModulesSpy).toHaveBeenCalled();
    });
  });

  describe('Status Variant Helper', () => {
    it('should return success for production status', () => {
      expect(component['getStatusVariant']('production')).toBe('success');
    });

    it('should return warning for beta status', () => {
      expect(component['getStatusVariant']('beta')).toBe('warning');
    });

    it('should return secondary for experimental status', () => {
      expect(component['getStatusVariant']('experimental')).toBe('secondary');
    });

    it('should return secondary for unknown status', () => {
      expect(component['getStatusVariant']('unknown')).toBe('secondary');
    });

    it('should return secondary for empty string', () => {
      expect(component['getStatusVariant']('')).toBe('secondary');
    });
  });

  describe('Category Variant Helper', () => {
    it('should return primary for ui category', () => {
      expect(component['getCategoryVariant']('ui')).toBe('primary');
    });

    it('should return warning for security category', () => {
      expect(component['getCategoryVariant']('security')).toBe('warning');
    });

    it('should return success for state-management category', () => {
      expect(component['getCategoryVariant']('state-management')).toBe('success');
    });

    it('should return secondary for infrastructure category', () => {
      expect(component['getCategoryVariant']('infrastructure')).toBe('secondary');
    });

    it('should return secondary for unknown category', () => {
      expect(component['getCategoryVariant']('unknown')).toBe('secondary');
    });

    it('should return secondary for empty string', () => {
      expect(component['getCategoryVariant']('')).toBe('secondary');
    });
  });

  describe('Template Rendering', () => {
    it('should render the component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });

    it('should contain the modules container', () => {
      fixture.detectChanges();
      const container = (fixture.nativeElement as HTMLElement).querySelector('eb-container');
      expect(container).toBeTruthy();
    });

    it('should render the title', () => {
      fixture.detectChanges();
      const html = (fixture.nativeElement as HTMLElement).innerHTML;
      expect(html).toContain('Reference Modules');
    });

    it('should render the search input', () => {
      fixture.detectChanges();
      const input = (fixture.nativeElement as HTMLElement).querySelector('eb-input');
      expect(input).toBeTruthy();
    });
  });

  describe('Template State Rendering', () => {
    it('should display loading state when isLoading is true', () => {
      // Directly set the store state via its internal methods
      // The store uses patchState internally, so we spy on the signal
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(true);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Loading...');
    });

    it('should display error message when error is set', () => {
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue('Failed to load modules');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Failed to load modules');
    });

    it('should display empty state when no modules match filter', () => {
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filteredModules').mockReturnValue([]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('No Results');
      expect(compiled.textContent).toContain('Try different search');
    });

    it('should show clear button in empty state when filter is set', () => {
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filteredModules').mockReturnValue([]);
      vi.spyOn(component['store'], 'filter').mockReturnValue('some filter');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Clear');
    });

    it('should render module cards when modules are available', () => {
      const mockModules = [
        {
          id: 'test-module',
          title: 'Test Module',
          description: 'A test module description',
          category: 'ui' as const,
          status: 'production' as const,
          tags: ['tag1', 'tag2'],
          repoUrl: null,
          demoUrl: null,
          features: [],
          techStack: [],
        },
      ];
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filteredModules').mockReturnValue(mockModules);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Test Module');
      expect(compiled.textContent).toContain('A test module description');
    });

    it('should render tags on module cards', () => {
      const mockModules = [
        {
          id: 'test-module',
          title: 'Test Module',
          description: 'Description',
          category: 'ui' as const,
          status: 'production' as const,
          tags: ['angular', 'signals', 'ngrx'],
          repoUrl: null,
          demoUrl: null,
          features: [],
          techStack: [],
        },
      ];
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filteredModules').mockReturnValue(mockModules);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('angular');
      expect(compiled.textContent).toContain('signals');
    });

    it('should render all tags with wrapping', () => {
      const mockModules = [
        {
          id: 'test-module',
          title: 'Test Module',
          description: 'Description',
          category: 'ui' as const,
          status: 'production' as const,
          tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
          repoUrl: null,
          demoUrl: null,
          features: [],
          techStack: [],
        },
      ];
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filteredModules').mockReturnValue(mockModules);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('tag1');
      expect(compiled.textContent).toContain('tag5');
    });

    it('should display results count when filter is set', () => {
      const mockModules = [
        {
          id: 'test-module',
          title: 'Test Module',
          description: 'Description',
          category: 'ui' as const,
          status: 'production' as const,
          tags: [],
          repoUrl: null,
          demoUrl: null,
          features: [],
          techStack: [],
        },
      ];
      vi.spyOn(component['store'], 'isLoading').mockReturnValue(false);
      vi.spyOn(component['store'], 'error').mockReturnValue(null);
      vi.spyOn(component['store'], 'filter').mockReturnValue('test');
      vi.spyOn(component['store'], 'filteredModules').mockReturnValue(mockModules);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('1 found');
    });
  });
});
