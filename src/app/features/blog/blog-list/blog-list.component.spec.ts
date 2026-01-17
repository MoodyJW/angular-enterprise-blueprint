import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { heroArrowPath } from '@ng-icons/heroicons/outline';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PUBLISHED_SLUGS } from '../blog.constants';
import { BlogStore } from '../blog.store';
import { BlogArticle } from '../blog.types';
import { BlogListComponent } from './blog-list.component';

const translationsEn = {
  blog: {
    title: 'Engineering Blog',
    subtitle: 'Insights into the architecture and development of this blueprint.',
    searchPlaceholder: 'Search articles...',
    searchLabel: 'Search blog articles',
    loading: 'Loading articles...',
    noResults: 'No articles found matching your criteria.',
    clearSearch: 'Clear Search',
    minRead: '{{ minutes }} min read',
    ariaLabels: {
      clearSearch: 'Clear search',
    },
  },
};

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;

  const mockArticles: BlogArticle[] = [
    {
      id: '1',
      slug: 'article-1',
      title: 'Article 1',
      excerpt: 'Excerpt 1',
      contentPath: 'assets/blogs/article-1.md',
      author: { name: 'Author 1', title: 'Title 1' },
      publishedAt: '2024-01-01',
      readingTimeMinutes: 5,
      category: 'architecture',
      tags: ['tag1'],
      status: 'published',
    },
  ];

  const mockStore = {
    loading: signal(false),
    filter: signal({ query: '', category: null, tag: null }),
    filteredArticles: signal(mockArticles),
    allCategories: signal(['architecture']),
    loadArticles: vi.fn(),
    setFilter: vi.fn(),
    clearFilters: vi.fn(),
  };

  beforeEach(async () => {
    // Reset signals and spies
    mockStore.loading.set(false);
    mockStore.filter.set({ query: '', category: null, tag: null });
    mockStore.filteredArticles.set(mockArticles);
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [
        BlogListComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: translationsEn },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        }),
      ],
      providers: [
        provideRouter([]),
        provideIcons({ heroArrowPath }),
        { provide: BlogStore, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles on init', () => {
    expect(mockStore.loadArticles).toHaveBeenCalled();
  });

  it('should render articles', () => {
    const nativeEl = fixture.nativeElement as HTMLElement;
    const cards = nativeEl.querySelectorAll('eb-card');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Article 1');
  });

  it('should call setFilter on search', () => {
    component.onSearch('test');
    expect(mockStore.setFilter).toHaveBeenCalledWith({ query: 'test' });
  });

  it('should call setFilter on category select', () => {
    component.onCategorySelect('architecture');
    expect(mockStore.setFilter).toHaveBeenCalledWith({ category: 'architecture' });
  });

  it('should call clearFilters', () => {
    component.clearFilters();
    expect(mockStore.clearFilters).toHaveBeenCalled();
  });

  it('should display loading state', () => {
    mockStore.loading.set(true);
    fixture.detectChanges();

    const nativeEl = fixture.nativeElement as HTMLElement;
    const loadingDiv = nativeEl.querySelector('.blog-list__loading');
    expect(loadingDiv).toBeTruthy();
    expect(loadingDiv?.textContent).toContain('Loading');
  });

  it('should display empty state when no articles found', () => {
    mockStore.filteredArticles.set([]);
    fixture.detectChanges();

    const nativeEl = fixture.nativeElement as HTMLElement;
    const emptyState = nativeEl.querySelector('.blog-list__empty');
    expect(emptyState).toBeTruthy();
    expect(emptyState?.textContent).toContain('No articles found');
  });

  it('should correctly identify in-progress articles', () => {
    // Current published slugs are known from constants
    const publishedSlug = PUBLISHED_SLUGS[0] !== '' ? PUBLISHED_SLUGS[0] : 'part-1-introduction';
    const draftSlug = 'future-article-slug';

    expect(component.isArticleInProgress(publishedSlug)).toBe(false);
    expect(component.isArticleInProgress(draftSlug)).toBe(true);
  });

  it('should bind disabled state to card for in-progress articles', () => {
    const draftArticle: BlogArticle = {
      ...mockArticles[0],
      id: '99',
      slug: 'future-article',
      title: 'Future Article',
    };
    mockStore.filteredArticles.set([draftArticle]);
    fixture.detectChanges();

    // Check component instance to verify binding
    const cardDe = fixture.debugElement.query(By.css('eb-card'));
    const cardInstance = cardDe.componentInstance as CardComponent;

    expect(cardInstance.disabled()).toBe(true);
  });
});
