// @vitest-environment jsdom
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Adr, ArchitectureService } from './architecture.service';

describe('ArchitectureService', () => {
  let service: ArchitectureService;
  let httpMock: HttpTestingController;

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
      status: 'deprecated',
      date: '2024-01-20',
      summary: 'Create an in-house design system with custom components.',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ArchitectureService],
    });

    service = TestBed.inject(ArchitectureService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAdrs', () => {
    it('should fetch all ADRs', () => {
      service.getAdrs().subscribe((adrs) => {
        expect(adrs).toEqual(mockAdrs);
        expect(adrs.length).toBe(2);
      });

      const req = httpMock.expectOne('assets/data/architecture.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockAdrs);
    });

    it('should return empty array when no ADRs exist', () => {
      service.getAdrs().subscribe((adrs) => {
        expect(adrs).toEqual([]);
        expect(adrs.length).toBe(0);
      });

      const req = httpMock.expectOne('assets/data/architecture.json');
      req.flush([]);
    });
  });

  describe('getAdrContent', () => {
    it('should fetch ADR content as text', () => {
      const mockContent = '# ADR-001\n\n## Context\n\nWe need state management.';

      service.getAdrContent('adr-001-angular-signals').subscribe((content) => {
        expect(content).toBe(mockContent);
      });

      const req = httpMock.expectOne('assets/docs/adr-001-angular-signals.md');
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('text');
      req.flush(mockContent);
    });

    it('should fetch content for different ADR ids', () => {
      const mockContent = '# ADR-002\n\n## Component Library';

      service.getAdrContent('adr-002-component-library').subscribe((content) => {
        expect(content).toBe(mockContent);
      });

      const req = httpMock.expectOne('assets/docs/adr-002-component-library.md');
      expect(req.request.method).toBe('GET');
      req.flush(mockContent);
    });

    it('should handle empty content', () => {
      service.getAdrContent('empty-adr').subscribe((content) => {
        expect(content).toBe('');
      });

      const req = httpMock.expectOne('assets/docs/empty-adr.md');
      req.flush('');
    });
  });
});
