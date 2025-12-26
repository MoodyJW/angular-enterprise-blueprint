// @vitest-environment jsdom
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Module, ModulesService } from './modules.service';

describe('ModulesService', () => {
  let service: ModulesService;
  let httpMock: HttpTestingController;

  const mockModules: Module[] = [
    {
      id: 'test-1',
      title: 'Test Module 1',
      description: 'Description for test module 1',
      category: 'state-management',
      status: 'production',
      tags: ['angular', 'signals'],
      repoUrl: 'https://github.com/test/test-1',
      demoUrl: null,
      features: ['Feature 1', 'Feature 2'],
      techStack: ['Angular', 'TypeScript'],
    },
    {
      id: 'test-2',
      title: 'Test Module 2',
      description: 'Description for test module 2',
      category: 'ui',
      status: 'beta',
      tags: ['components', 'theming'],
      repoUrl: 'https://github.com/test/test-2',
      demoUrl: 'https://demo.example.com',
      features: ['Feature A', 'Feature B'],
      techStack: ['Angular', 'SCSS'],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ModulesService],
    });

    service = TestBed.inject(ModulesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getModules', () => {
    it('should fetch all modules', () => {
      service.getModules().subscribe((modules) => {
        expect(modules).toEqual(mockModules);
        expect(modules.length).toBe(2);
      });

      const req = httpMock.expectOne('assets/data/modules.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockModules);
    });

    it('should return empty array when no modules exist', () => {
      service.getModules().subscribe((modules) => {
        expect(modules).toEqual([]);
        expect(modules.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/modules.json');
      req.flush([]);
    });
  });

  describe('getModuleById', () => {
    it('should return the correct module when found', () => {
      service.getModuleById('test-1').subscribe((module) => {
        expect(module).toEqual(mockModules[0]);
        expect(module?.title).toBe('Test Module 1');
      });

      const req = httpMock.expectOne('assets/data/modules.json');
      req.flush(mockModules);
    });

    it('should return undefined when module not found', () => {
      service.getModuleById('non-existent').subscribe((module) => {
        expect(module).toBeUndefined();
      });

      const req = httpMock.expectOne('assets/data/modules.json');
      req.flush(mockModules);
    });

    it('should return undefined when modules array is empty', () => {
      service.getModuleById('test-1').subscribe((module) => {
        expect(module).toBeUndefined();
      });

      const req = httpMock.expectOne('assets/data/modules.json');
      req.flush([]);
    });
  });
});
