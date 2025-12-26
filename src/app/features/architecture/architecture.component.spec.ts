// @vitest-environment jsdom
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { ICON_NAMES } from '@shared/constants';

import { ArchitectureComponent } from './architecture.component';

describe('ArchitectureComponent', () => {
  let component: ArchitectureComponent;
  let fixture: ComponentFixture<ArchitectureComponent>;

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
    },
  };

  beforeEach(async () => {
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
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
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
});
