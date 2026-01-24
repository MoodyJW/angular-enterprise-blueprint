// @vitest-environment jsdom
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SeoService } from '@core/services/seo/seo.service';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { of } from 'rxjs';

import { ICON_NAMES } from '@shared/constants';

import { ModulesService, type Module } from '@features/modules/services/modules.service';
import { ModuleDetailComponent } from './module-detail.component';

describe('ModuleDetailComponent', () => {
  let component: ModuleDetailComponent;
  let fixture: ComponentFixture<ModuleDetailComponent>;
  let modulesService: ModulesService;
  let mockSeoService: {
    updatePageSeo: ReturnType<typeof vi.fn>;
  };

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
    {
      ...mockModule,
      id: 'first-module',
      title: 'First Module',
    },
    {
      ...mockModule,
      id: 'test-module',
      title: 'Test Module',
    },
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
        viewSource: 'View Source',
        noSource: 'Source not available',
        statusLabel: 'Status: {{ status }}',
        categoryLabel: 'Category: {{ category }}',
        technologyLabel: 'Technology: {{ technology }}',
        previousModule: 'Previous',
        nextModule: 'Next',
      },
      data: {
        'first-module': {
          title: 'First Module',
          description: 'First module description',
        },
        'test-module': {
          title: 'Test Module',
          description: 'A test module description',
        },
        'another-module': {
          title: 'Another Module',
          description: 'Another description',
        },
      },
      categories: {
        ui: 'UI Components',
        'state-management': 'State Management',
        infrastructure: 'Infrastructure',
        security: 'Security',
      },
      statuses: {
        production: 'Production',
        beta: 'Beta',
        experimental: 'Experimental',
      },
    },
  };

  beforeEach(async () => {
    mockSeoService = {
      updatePageSeo: vi.fn(),
    };

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
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SeoService, useValue: mockSeoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleDetailComponent);
    component = fixture.componentInstance;
    modulesService = TestBed.inject(ModulesService);
  });

  describe('Component Creation', () => {
    it('should create with required id input', () => {
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

      // Verify SEO update
      expect(mockSeoService.updatePageSeo).toHaveBeenCalledWith({
        title: 'Test Module',
        meta: {
          description: 'A test module description',
        },
      });
    });
  });

  describe('Adjacent Modules Computed', () => {
    beforeEach(() => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));
    });

    it('should compute previous and next modules correctly for middle item', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      component.ngOnInit();

      const adjacent = component['adjacentModules']();
      expect(adjacent.prev).toBeTruthy();
      expect(adjacent.prev?.id).toBe('first-module');
      expect(adjacent.next).toBeTruthy();
      expect(adjacent.next?.id).toBe('another-module');
    });

    it('should have no prev for first item', () => {
      fixture.componentRef.setInput('id', 'first-module');
      fixture.detectChanges();
      component.ngOnInit();

      const adjacent = component['adjacentModules']();
      expect(adjacent.prev).toBeNull();
      expect(adjacent.next).toBeTruthy();
      expect(adjacent.next?.id).toBe('test-module');
    });

    it('should have no next for last item', () => {
      fixture.componentRef.setInput('id', 'another-module');
      fixture.detectChanges();
      component.ngOnInit();

      const adjacent = component['adjacentModules']();
      expect(adjacent.prev).toBeTruthy();
      expect(adjacent.prev?.id).toBe('test-module');
      expect(adjacent.next).toBeNull();
    });

    it('should return null for both when ID not found', () => {
      fixture.componentRef.setInput('id', 'non-existent');
      fixture.detectChanges();
      component.ngOnInit();

      const adjacent = component['adjacentModules']();
      expect(adjacent.prev).toBeNull();
      expect(adjacent.next).toBeNull();
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

    it('should show view source button when repoUrl exists', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('View Source');
    });

    it('should render badges for status and category', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const badges = compiled.querySelectorAll('eb-badge');
      expect(badges.length).toBeGreaterThanOrEqual(2);
    });

    it('should render features list', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Feature 1');
      expect(compiled.textContent).toContain('Feature 2');
    });

    it('should render tech stack badges', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Angular');
      expect(compiled.textContent).toContain('TypeScript');
    });
  });

  describe('Navigation Template', () => {
    beforeEach(() => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));
    });

    it('should render prev button when prev module exists', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const prevButton = compiled.querySelector('.module-detail__nav-prev');
      expect(prevButton).toBeTruthy();
    });

    it('should render next button when next module exists', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const nextButton = compiled.querySelector('.module-detail__nav-next');
      expect(nextButton).toBeTruthy();
    });

    it('should not render prev button for first module', () => {
      fixture.componentRef.setInput('id', 'first-module');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const prevButton = compiled.querySelector('.module-detail__nav-prev');
      expect(prevButton).toBeFalsy();
    });

    it('should not render next button for last module', () => {
      fixture.componentRef.setInput('id', 'another-module');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const nextButton = compiled.querySelector('.module-detail__nav-next');
      expect(nextButton).toBeFalsy();
    });
  });

  describe('Loading State', () => {
    it('should show loading state when store is loading', () => {
      fixture.componentRef.setInput('id', 'test-module');
      fixture.detectChanges();

      // Store starts in loading state before modules are loaded
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.module-detail__loading')).toBeTruthy();
    });
  });

  describe('Not Found State', () => {
    beforeEach(() => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));
    });

    it('should show not found state when module does not exist', () => {
      fixture.componentRef.setInput('id', 'non-existent');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.module-detail__not-found')).toBeTruthy();
    });

    it('should show back button in not found state', () => {
      fixture.componentRef.setInput('id', 'non-existent');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const notFound = compiled.querySelector('.module-detail__not-found');
      expect(notFound?.textContent).toContain('Back to Modules');
    });
  });

  describe('Module Without Repo URL', () => {
    beforeEach(() => {
      vi.spyOn(modulesService, 'getModules').mockReturnValue(of(mockModules));
    });

    it('should not render view source button when repoUrl is null', () => {
      fixture.componentRef.setInput('id', 'another-module');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const sourceLink = compiled.querySelector('.module-detail__source-link');
      expect(sourceLink).toBeFalsy();
    });
  });
});
