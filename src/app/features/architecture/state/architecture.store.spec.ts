// @vitest-environment jsdom
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Adr, ArchitectureService } from '../services/architecture.service';
import { ArchitectureStore } from './architecture.store';

describe('ArchitectureStore', () => {
  let store: InstanceType<typeof ArchitectureStore>;
  let architectureService: ArchitectureService;

  const mockAdrs: Adr[] = [
    {
      id: 'adr-001-angular-signals',
      number: 'ADR-001',
      title: 'Use Angular Signals for State Management',
      status: 'accepted',
      date: '2024-01-15',
      summary: 'Adopt Angular Signals as the primary reactive primitive.',
    },
    {
      id: 'adr-002-component-library',
      number: 'ADR-002',
      title: 'Build Custom Component Library',
      status: 'accepted',
      date: '2024-01-20',
      summary: 'Create an in-house design system with custom components.',
    },
    {
      id: 'adr-003-legacy-patterns',
      number: 'ADR-003',
      title: 'Deprecate RxJS-only Patterns',
      status: 'deprecated',
      date: '2024-02-01',
      summary: 'Phase out pure RxJS patterns in favor of signals.',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ArchitectureStore,
        ArchitectureService,
      ],
    });

    store = TestBed.inject(ArchitectureStore);
    architectureService = TestBed.inject(ArchitectureService);
  });

  describe('initial state', () => {
    it('should have empty entities', () => {
      expect(store.entities()).toEqual([]);
    });

    it('should have null selectedId', () => {
      expect(store.selectedId()).toBeNull();
    });

    it('should have empty content', () => {
      expect(store.content()).toBe('');
    });

    it('should have empty filter', () => {
      expect(store.filter()).toBe('');
    });

    it('should not be loading', () => {
      expect(store.isLoading()).toBe(false);
    });

    it('should not be loading content', () => {
      expect(store.isLoadingContent()).toBe(false);
    });

    it('should have no error', () => {
      expect(store.error()).toBeNull();
    });
  });

  describe('loadAdrs', () => {
    it('should load ADRs successfully', () => {
      vi.spyOn(architectureService, 'getAdrs').mockReturnValue(of(mockAdrs));

      store.loadAdrs();

      expect(store.entities()).toEqual(mockAdrs);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle errors with message', () => {
      const errorMessage = 'Network error';
      vi.spyOn(architectureService, 'getAdrs').mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      store.loadAdrs();

      expect(store.entities()).toEqual([]);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe(errorMessage);
    });

    it('should handle errors without message', () => {
      vi.spyOn(architectureService, 'getAdrs').mockReturnValue(throwError(() => new Error('')));

      store.loadAdrs();

      expect(store.error()).toBe('Failed to load ADRs');
    });
  });

  describe('loadContent', () => {
    it('should load content successfully', () => {
      const mockContent = '# ADR-001\n\nThis is the content.';
      vi.spyOn(architectureService, 'getAdrContent').mockReturnValue(of(mockContent));

      store.loadContent('adr-001-angular-signals');

      expect(store.content()).toBe(mockContent);
      expect(store.selectedId()).toBe('adr-001-angular-signals');
      expect(store.isLoadingContent()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle errors with message', () => {
      const errorMessage = 'Content not found';
      vi.spyOn(architectureService, 'getAdrContent').mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      store.loadContent('non-existent');

      expect(store.content()).toBe('');
      expect(store.isLoadingContent()).toBe(false);
      expect(store.error()).toBe(errorMessage);
    });

    it('should handle errors without message', () => {
      vi.spyOn(architectureService, 'getAdrContent').mockReturnValue(
        throwError(() => new Error('')),
      );

      store.loadContent('non-existent');

      expect(store.error()).toBe('Failed to load ADR content');
    });
  });

  describe('setFilter', () => {
    beforeEach(() => {
      vi.spyOn(architectureService, 'getAdrs').mockReturnValue(of(mockAdrs));
      store.loadAdrs();
    });

    it('should update the filter value', () => {
      store.setFilter('signals');
      expect(store.filter()).toBe('signals');
    });
  });

  describe('clearFilter', () => {
    it('should clear the filter', () => {
      store.setFilter('test');
      expect(store.filter()).toBe('test');

      store.clearFilter();
      expect(store.filter()).toBe('');
    });
  });

  describe('selectAdr', () => {
    it('should set the selectedId', () => {
      store.selectAdr('adr-001-angular-signals');
      expect(store.selectedId()).toBe('adr-001-angular-signals');
    });

    it('should allow setting null', () => {
      store.selectAdr('adr-001-angular-signals');
      store.selectAdr(null);
      expect(store.selectedId()).toBeNull();
    });
  });

  describe('clearSelection', () => {
    it('should clear selectedId and content', () => {
      const mockContent = '# ADR Content';
      vi.spyOn(architectureService, 'getAdrContent').mockReturnValue(of(mockContent));

      store.loadContent('adr-001-angular-signals');
      expect(store.selectedId()).toBe('adr-001-angular-signals');
      expect(store.content()).toBe(mockContent);

      store.clearSelection();
      expect(store.selectedId()).toBeNull();
      expect(store.content()).toBe('');
    });
  });

  describe('computed: selectedAdr', () => {
    beforeEach(() => {
      vi.spyOn(architectureService, 'getAdrs').mockReturnValue(of(mockAdrs));
      store.loadAdrs();
    });

    it('should return null when no ADR is selected', () => {
      expect(store.selectedAdr()).toBeNull();
    });

    it('should return the selected ADR', () => {
      store.selectAdr('adr-001-angular-signals');
      const selected = store.selectedAdr();
      expect(selected?.id).toBe('adr-001-angular-signals');
      expect(selected?.title).toBe('Use Angular Signals for State Management');
    });

    it('should return null for non-existent id', () => {
      store.selectAdr('non-existent');
      expect(store.selectedAdr()).toBeNull();
    });
  });

  describe('computed: getAdrById', () => {
    beforeEach(() => {
      vi.spyOn(architectureService, 'getAdrs').mockReturnValue(of(mockAdrs));
      store.loadAdrs();
    });

    it('should return the correct ADR', () => {
      const adr = store.getAdrById()('adr-002-component-library');
      expect(adr?.id).toBe('adr-002-component-library');
      expect(adr?.title).toBe('Build Custom Component Library');
    });

    it('should return undefined for non-existent id', () => {
      const adr = store.getAdrById()('non-existent');
      expect(adr).toBeUndefined();
    });
  });

  describe('computed: filteredAdrs', () => {
    beforeEach(() => {
      vi.spyOn(architectureService, 'getAdrs').mockReturnValue(of(mockAdrs));
      store.loadAdrs();
    });

    it('should return all ADRs when filter is empty', () => {
      store.setFilter('');
      expect(store.filteredAdrs().length).toBe(3);
    });

    it('should return all ADRs when filter has only whitespace', () => {
      store.setFilter('   ');
      expect(store.filteredAdrs().length).toBe(3);
    });
  });
});
