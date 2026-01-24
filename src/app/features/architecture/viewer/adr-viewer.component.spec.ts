// @vitest-environment jsdom
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ArchitectureStore } from '@core/services/architecture/architecture.store';
import { SeoService } from '@core/services/seo/seo.service';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowRight,
  heroExclamationTriangle,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';
import { MarkdownModule } from 'ngx-markdown';
import { vi } from 'vitest';
import { AdrViewerComponent } from './adr-viewer.component';

describe('AdrViewerComponent', () => {
  let component: AdrViewerComponent;
  let fixture: ComponentFixture<AdrViewerComponent>;
  let mockSeoService: { updatePageSeo: ReturnType<typeof vi.fn> };
  let mockStore: {
    entities: WritableSignal<typeof mockAdrList>;
    getAdrById: () => (id: string) => (typeof mockAdrList)[0] | undefined;
    isLoading: WritableSignal<boolean>;
    isLoadingContent: WritableSignal<boolean>;
    error: WritableSignal<string | null>;
    content: WritableSignal<string>;
    loadAdrs: ReturnType<typeof vi.fn>;
    loadContent: ReturnType<typeof vi.fn>;
  };

  const mockAdr = {
    id: 'adr-001',
    number: 'ADR-001',
    title: 'Test ADR',
    status: 'accepted',
    date: '2025-01-01',
    summary: 'Test summary',
    filename: '001-test.md',
  };

  const mockAdrList = [
    { ...mockAdr, id: 'adr-001', number: 'ADR-001', title: 'First ADR' },
    { ...mockAdr, id: 'adr-002', number: 'ADR-002', title: 'Second ADR' },
    { ...mockAdr, id: 'adr-003', number: 'ADR-003', title: 'Third ADR' },
  ];

  const translationsEn = {
    common: { loading: 'Loading...' },
    architecture: {
      backToList: 'Back to List',
      previousAdr: 'Previous',
      nextAdr: 'Next',
      notFound: 'Not Found',
      notFoundMessage: 'ADR not found',
      statuses: {
        accepted: 'accepted',
        deprecated: 'deprecated',
        superseded: 'superseded',
      },
      statusLabel: 'Status: {{ status }}',
      data: {
        'adr-001': { title: 'First ADR' },
        'adr-002': { title: 'Second ADR' },
        'adr-003': { title: 'Third ADR' },
      },
    },
  };

  beforeEach(async () => {
    mockSeoService = { updatePageSeo: vi.fn() };
    mockStore = {
      entities: signal(mockAdrList),
      getAdrById: () => (id: string) => mockAdrList.find((a) => a.id === id),
      isLoading: signal(false),
      isLoadingContent: signal(false),
      error: signal(null),
      content: signal('# Test Content'),
      loadAdrs: vi.fn(),
      loadContent: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        AdrViewerComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translationsEn },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
        MarkdownModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        provideIcons({
          heroArrowLeft,
          heroArrowRight,
          heroExclamationTriangle,
          heroMagnifyingGlass,
        }),
        { provide: SeoService, useValue: mockSeoService },
      ],
    })
      .overrideProvider(ArchitectureStore, { useValue: mockStore })
      .compileComponents();

    fixture = TestBed.createComponent(AdrViewerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'adr-002');
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have ICONS constant defined', () => {
      expect(component['ICONS']).toBeDefined();
    });
  });

  describe('Template Rendering', () => {
    it('should render ADR title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.adr-viewer__title')).toBeTruthy();
    });

    it('should render markdown content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('markdown')).toBeTruthy();
    });

    it('should render meta section with date and number', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.adr-viewer__meta')).toBeTruthy();
    });

    it('should render badge with status', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('eb-badge')).toBeTruthy();
    });

    it('should render dividers in meta section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelectorAll('eb-divider').length).toBeGreaterThan(0);
    });
  });

  describe('Store Integration', () => {
    it('should call loadAdrs if store is empty', () => {
      mockStore.entities.set([]);
      component.ngOnInit();
      expect(mockStore.loadAdrs).toHaveBeenCalled();
    });

    it('should not call loadAdrs if store has entities', () => {
      mockStore.loadAdrs.mockClear();
      mockStore.entities.set(mockAdrList);
      component.ngOnInit();
      expect(mockStore.loadAdrs).not.toHaveBeenCalled();
    });

    it('should call loadContent with correct ID', () => {
      expect(mockStore.loadContent).toHaveBeenCalledWith('adr-002');
    });
  });

  describe('getStatusVariant', () => {
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

  describe('adjacentAdrs Computed', () => {
    it('should compute previous and next ADRs correctly for middle item', () => {
      const adjacent = component['adjacentAdrs']();
      expect(adjacent.prev).toBeTruthy();
      expect(adjacent.prev?.id).toBe('adr-001');
      expect(adjacent.next).toBeTruthy();
      expect(adjacent.next?.id).toBe('adr-003');
    });

    it('should have no prev for first item', () => {
      fixture.componentRef.setInput('id', 'adr-001');
      fixture.detectChanges();

      const adjacent = component['adjacentAdrs']();
      expect(adjacent.prev).toBeNull();
      expect(adjacent.next).toBeTruthy();
      expect(adjacent.next?.id).toBe('adr-002');
    });

    it('should have no next for last item', () => {
      fixture.componentRef.setInput('id', 'adr-003');
      fixture.detectChanges();

      const adjacent = component['adjacentAdrs']();
      expect(adjacent.prev).toBeTruthy();
      expect(adjacent.prev?.id).toBe('adr-002');
      expect(adjacent.next).toBeNull();
    });

    it('should return null for both when ID not found', () => {
      fixture.componentRef.setInput('id', 'non-existent');
      fixture.detectChanges();

      const adjacent = component['adjacentAdrs']();
      expect(adjacent.prev).toBeNull();
      expect(adjacent.next).toBeNull();
    });
  });

  describe('Loading State', () => {
    it('should display loading state when isLoading is true', () => {
      mockStore.isLoading.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.adr-viewer__loading')).toBeTruthy();
    });

    it('should display loading state when isLoadingContent is true', () => {
      mockStore.isLoadingContent.set(true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.adr-viewer__loading')).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('should display error message when error is set', () => {
      mockStore.error.set('Failed to load ADR');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.adr-viewer__error')).toBeTruthy();
      expect(compiled.textContent).toContain('Failed to load ADR');
    });
  });

  describe('Not Found State', () => {
    it('should display not found state when ADR does not exist', () => {
      fixture.componentRef.setInput('id', 'non-existent');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.adr-viewer__not-found')).toBeTruthy();
    });
  });

  describe('Navigation Template', () => {
    it('should render prev button when prev ADR exists', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const prevButton = compiled.querySelector('.adr-viewer__nav-prev');
      expect(prevButton).toBeTruthy();
    });

    it('should render next button when next ADR exists', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nextButton = compiled.querySelector('.adr-viewer__nav-next');
      expect(nextButton).toBeTruthy();
    });

    it('should not render prev button for first ADR', () => {
      fixture.componentRef.setInput('id', 'adr-001');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const prevButton = compiled.querySelector('.adr-viewer__nav-prev');
      expect(prevButton).toBeFalsy();
    });

    it('should not render next button for last ADR', () => {
      fixture.componentRef.setInput('id', 'adr-003');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const nextButton = compiled.querySelector('.adr-viewer__nav-next');
      expect(nextButton).toBeFalsy();
    });
  });

  describe('adr Computed', () => {
    it('should return the correct ADR based on ID', () => {
      const adr = component['adr']();
      expect(adr).toBeTruthy();
      expect(adr?.id).toBe('adr-002');
      expect(adr?.title).toBe('Second ADR');
    });

    it('should return undefined for non-existent ID', () => {
      fixture.componentRef.setInput('id', 'non-existent');
      fixture.detectChanges();

      const adr = component['adr']();
      expect(adr).toBeUndefined();
    });
  });
});
