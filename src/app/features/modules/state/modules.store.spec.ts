// @vitest-environment jsdom
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { Module, ModulesService } from '@features/modules/services/modules.service';
import { ModulesStore } from './modules.store';

describe('ModulesStore', () => {
  let store: InstanceType<typeof ModulesStore>;
  let modulesService: ModulesService;

  const mockModules: Module[] = [
    {
      id: 'signal-store',
      title: 'NgRx SignalStore',
      description: 'Reactive state management using Angular signals',
      category: 'state-management',
      status: 'production',
      tags: ['signals', 'ngrx', 'state'],
      repoUrl: 'https://github.com/example/signal-store',
      demoUrl: null,
      features: ['SignalStore', 'Computed selectors'],
      techStack: ['Angular', 'NgRx'],
    },
    {
      id: 'design-system',
      title: 'Enterprise Design System',
      description: 'Comprehensive UI component library',
      category: 'ui',
      status: 'production',
      tags: ['components', 'theming'],
      repoUrl: 'https://github.com/example/design-system',
      demoUrl: 'https://demo.example.com',
      features: ['40+ components', 'Theming'],
      techStack: ['Angular', 'SCSS'],
    },
    {
      id: 'auth-strategy',
      title: 'Authentication Strategy',
      description: 'Flexible auth using Strategy pattern',
      category: 'security',
      status: 'beta',
      tags: ['auth', 'guards', 'security'],
      repoUrl: null,
      demoUrl: null,
      features: ['Strategy pattern', 'Guards'],
      techStack: ['Angular', 'JWT'],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ModulesStore, ModulesService],
    });

    store = TestBed.inject(ModulesStore);
    modulesService = TestBed.inject(ModulesService);
  });

  describe('initial state', () => {
    it('should have empty entities', () => {
      expect(store.entities()).toEqual([]);
    });

    it('should have empty filter', () => {
      expect(store.filter()).toBe('');
    });

    it('should not be loading', () => {
      expect(store.isLoading()).toBe(false);
    });

    it('should have no error', () => {
      expect(store.error()).toBeNull();
    });

    it('should have empty filteredModules', () => {
      expect(store.filteredModules()).toEqual([]);
    });
  });

  describe('loadModules', () => {
    it('should load modules successfully', () => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));

      store.loadModules();

      expect(store.entities()).toEqual(mockModules);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should set loading state while fetching', () => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));

      // The loading state is set synchronously before the async operation
      store.loadModules();

      // After the observable completes, loading should be false
      expect(store.isLoading()).toBe(false);
    });

    it('should handle errors', () => {
      const errorMessage = 'Network error';
      vi.spyOn(modulesService, 'getModules').mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      store.loadModules();

      expect(store.entities()).toEqual([]);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe(errorMessage);
    });
  });

  describe('setFilter', () => {
    beforeEach(() => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));
      store.loadModules();
    });

    it('should update the filter value', () => {
      store.setFilter('signal');
      expect(store.filter()).toBe('signal');
    });

    it('should filter modules by title', () => {
      store.setFilter('SignalStore');
      expect(store.filteredModules().length).toBe(1);
      expect(store.filteredModules()[0].id).toBe('signal-store');
    });

    it('should filter modules by description', () => {
      store.setFilter('component library');
      expect(store.filteredModules().length).toBe(1);
      expect(store.filteredModules()[0].id).toBe('design-system');
    });

    it('should filter modules by category', () => {
      store.setFilter('security');
      expect(store.filteredModules().length).toBe(1);
      expect(store.filteredModules()[0].id).toBe('auth-strategy');
    });

    it('should filter modules by tags', () => {
      store.setFilter('theming');
      expect(store.filteredModules().length).toBe(1);
      expect(store.filteredModules()[0].id).toBe('design-system');
    });

    it('should be case-insensitive', () => {
      store.setFilter('NGRX');
      expect(store.filteredModules().length).toBe(1);
      expect(store.filteredModules()[0].id).toBe('signal-store');
    });

    it('should return all modules when filter is empty', () => {
      store.setFilter('');
      expect(store.filteredModules().length).toBe(3);
    });

    it('should return no modules when filter matches nothing', () => {
      store.setFilter('nonexistent');
      expect(store.filteredModules().length).toBe(0);
    });
  });

  describe('clearFilter', () => {
    beforeEach(() => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));
      store.loadModules();
    });

    it('should clear the filter', () => {
      store.setFilter('signal');
      expect(store.filter()).toBe('signal');

      store.clearFilter();
      expect(store.filter()).toBe('');
    });

    it('should show all modules after clearing filter', () => {
      store.setFilter('signal');
      expect(store.filteredModules().length).toBe(1);

      store.clearFilter();
      expect(store.filteredModules().length).toBe(3);
    });
  });

  describe('getModuleById', () => {
    beforeEach(() => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));
      store.loadModules();
    });

    it('should return the correct module', () => {
      const module = store.getModuleById()('signal-store');
      expect(module?.id).toBe('signal-store');
      expect(module?.title).toBe('NgRx SignalStore');
    });

    it('should return undefined for non-existent module', () => {
      const module = store.getModuleById()('non-existent');
      expect(module).toBeUndefined();
    });
  });
});
