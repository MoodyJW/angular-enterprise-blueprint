import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroExclamationTriangle,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';
import { MarkdownModule } from 'ngx-markdown';
import { vi } from 'vitest';
import { ArchitectureStore } from '../state/architecture.store';
import { AdrViewerComponent } from './adr-viewer.component';

describe('AdrViewerComponent', () => {
  let component: AdrViewerComponent;
  let fixture: ComponentFixture<AdrViewerComponent>;

  const mockStore = {
    entities: signal([]),
    getAdrById: () => () => ({
      id: '001',
      number: '001',
      title: 'Test ADR',
      status: 'accepted',
      date: '2025-01-01',
      summary: 'Test summary',
      filename: '001-test.md',
    }),
    isLoading: signal(false),
    isLoadingContent: signal(false),
    error: signal(null),
    content: signal('# Test Content'),
    loadAdrs: vi.fn(),
    loadContent: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdrViewerComponent,
        TranslocoTestingModule.forRoot({
          langs: {},
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
        MarkdownModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        provideIcons({ heroArrowLeft, heroExclamationTriangle, heroMagnifyingGlass }),
      ],
    })
      .overrideProvider(ArchitectureStore, { useValue: mockStore })
      .compileComponents();

    fixture = TestBed.createComponent(AdrViewerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '001');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ADR title and content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.adr-viewer__title')).toBeTruthy();
    expect(compiled.querySelector('markdown')).toBeTruthy();
  });

  it('should call loadAdrs if store is empty', () => {
    mockStore.entities.set([]);
    component.ngOnInit();
    expect(mockStore.loadAdrs).toHaveBeenCalled();
  });

  it('should call loadContent with correct ID', () => {
    expect(mockStore.loadContent).toHaveBeenCalledWith('001');
  });
});
