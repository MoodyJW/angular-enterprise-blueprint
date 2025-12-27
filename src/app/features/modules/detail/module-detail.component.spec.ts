// @vitest-environment jsdom
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { of } from 'rxjs';

import { ICON_NAMES } from '@shared/constants';

import { ModulesService, type Module } from '../services/modules.service';
import { ModuleDetailComponent } from './module-detail.component';

describe('ModuleDetailComponent', () => {
  let component: ModuleDetailComponent;
  let fixture: ComponentFixture<ModuleDetailComponent>;
  let modulesService: ModulesService;

  const mockModule: Module = {
    id: 'test-module',
    title: 'Test Module',
    description: 'A test module description',
    category: 'ui',
    status: 'production',
    tags: ['angular', 'testing'],
    repoUrl: 'https://github.com/test/repo',
    demoUrl: 'https://demo.example.com',
    features: ['Feature 1', 'Feature 2'],
    techStack: ['Angular', 'TypeScript'],
  };

  const mockModules: Module[] = [
    mockModule,
    {
      id: 'another-module',
      title: 'Another Module',
      description: 'Another description',
      category: 'state-management',
      status: 'beta',
      tags: ['signals'],
      repoUrl: null,
      demoUrl: null,
      features: ['Feature A'],
      techStack: ['Angular'],
    },
  ];

  const translationsEn = {
    common: { loading: 'Loading...' },
    modules: {
      detail: {
        backToList: 'Back to Modules',
        notFound: 'Module Not Found',
        notFoundMessage: 'The requested module could not be found.',
        features: 'Key Features',
        techStack: 'Technology Stack',
        tags: 'Tags',
        launchDemo: 'Launch Demo',
        viewSource: 'View Source',
        noDemo: 'Demo not available',
        noSource: 'Source not available',
        statusLabel: 'Status: {{ status }}',
        categoryLabel: 'Category: {{ category }}',
        technologyLabel: 'Technology: {{ technology }}',
      },
      data: {
        'test-module': {
          title: 'Test Module',
          description: 'A test module description',
          features: ['Feature 1', 'Feature 2'],
        },
        'another-module': {
          title: 'Another Module',
          description: 'Another description',
          features: ['Feature A'],
        },
      },
      categories: {
        ui: 'UI Components',
        'state-management': 'State Management',
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
        ModuleDetailComponent,
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

    fixture = TestBed.createComponent(ModuleDetailComponent);
    component = fixture.componentInstance;
    modulesService = TestBed.inject(ModulesService);
  });

  describe('Component Creation', () => {
    it('should create with required id input', () => {
      // Set the required input
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should have ICONS constant defined', () => {
      fixture.componentRef.setInput('id', 'test-module');
      expect(component['ICONS']).toBeDefined();
      expect(component['ICONS']).toBe(ICON_NAMES);
    });
  });

  describe('Store Integration', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('id', 'test-module');
    });

    it('should have store injected', () => {
      expect(component['store']).toBeDefined();
    });

    it('should load modules on init', () => {
      const loadModulesSpy = vi.spyOn(component['store'], 'loadModules');
      component.ngOnInit();
      expect(loadModulesSpy).toHaveBeenCalled();
    });
  });

  describe('Module Computed Signal', () => {
    beforeEach(() => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));
    });

    it('should return undefined when module not found', () => {
      fixture.componentRef.setInput('id', 'non-existent');
      fixture.detectChanges();
      component.ngOnInit();

      expect(component['module']()).toBeUndefined();
    });

    it('should return correct module when found', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      component.ngOnInit();

      const module = component['module']();
      expect(module?.id).toBe('test-module');
      expect(module?.title).toBe('Test Module');
    });
  });

  describe('Status Variant Helper', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('id', 'test-module');
    });

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
    beforeEach(() => {
      fixture.componentRef.setInput('id', 'test-module');
    });

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
    beforeEach(() => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));
    });

    it('should render the component', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });

    it('should show module title when module is found', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const html = (fixture.nativeElement as HTMLElement).innerHTML;
      expect(html).toContain('Test Module');
    });

    it('should show back button', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();

      const html = (fixture.nativeElement as HTMLElement).innerHTML;
      expect(html).toContain('Back to Modules');
    });
  });
});
