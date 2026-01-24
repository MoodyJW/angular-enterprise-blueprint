import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { MarkdownModule } from 'ngx-markdown';
import { Observable, of } from 'rxjs';
import { SeoService } from '../../../core/services/seo/seo.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BlogStore } from '../blog.store';
import { BlogArticle } from '../blog.types';
import { BlogDetailComponent } from './blog-detail.component';

const translationsEn = {
  blog: {
    detail: {
      backToList: 'Back to Blog',
      backAriaLabel: 'Back to all articles',
      notFound: 'Article not found',
      notFoundButton: 'Return to Blog',
      notFoundAriaLabel: 'Return to blog list',
      loading: 'Loading article...',
      previousArticle: 'Previous Article',
      nextArticle: 'Next Article',
    },
  },
};

describe('BlogDetailComponent', () => {
  let component: BlogDetailComponent;
  let fixture: ComponentFixture<BlogDetailComponent>;

  const mockArticle: BlogArticle = {
    id: '2',
    slug: 'part-2-phase-1',
    title: 'Test Article',
    excerpt: 'Test Excerpt',
    contentPath: 'assets/blogs/test-article.md',
    author: { name: 'Test Author', title: 'Test Title' },
    publishedAt: '2024-01-01',
    readingTimeMinutes: 5,
    category: 'architecture',
    tags: ['tag1'],
    status: 'published',
  };

  const prevArticle: BlogArticle = {
    ...mockArticle,
    id: '1',
    slug: 'part-1-introduction',
    title: 'Prev',
  };
  const nextArticle: BlogArticle = {
    ...mockArticle,
    id: '3',
    slug: 'part-3-phase-2',
    title: 'Next',
  };

  const mockStore = {
    loading: signal(false),
    articles: signal([prevArticle, mockArticle, nextArticle]),
    loadArticles: vi.fn(),
    getArticleContent: vi.fn(),
  };

  const mockSeoService = {
    updatePageSeo: vi.fn(),
  };

  beforeEach(async () => {
    mockStore.loading.set(false);
    mockStore.articles.set([prevArticle, mockArticle, nextArticle]);
    vi.clearAllMocks();

    // Default success behavior
    mockStore.getArticleContent.mockReturnValue({
      subscribe: vi.fn((callbacks: { next?: (v: string) => void }) =>
        callbacks.next?.('# Test Content'),
      ),
    });

    await TestBed.configureTestingModule({
      imports: [
        BlogDetailComponent,
        MarkdownModule.forRoot(),
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
        { provide: HttpClient, useValue: { get: vi.fn().mockReturnValue(of('markdown')) } },
        { provide: BlogStore, useValue: mockStore },
        { provide: SeoService, useValue: mockSeoService },
        provideIcons({ heroArrowLeft, heroArrowRight: heroArrowLeft }), // Mocking Right as Left for simplicity
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetailComponent);
    component = fixture.componentInstance;

    // Set input 'slug'
    fixture.componentRef.setInput('slug', 'part-2-phase-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find article by slug', () => {
    expect(component.article()).toEqual(mockArticle);
  });

  it('should render article content', () => {
    const nativeEl = fixture.nativeElement as HTMLElement;
    const title = nativeEl.querySelector('.blog-detail__title');
    expect(title?.textContent).toContain('Test Article');

    // Markdown content is rendered async/internally by ngx-markdown.
    // We check if markdown component is present.
    const markdown = nativeEl.querySelector('markdown');
    expect(markdown).toBeTruthy();
  });

  it('should load articles if store is empty', () => {
    mockStore.articles.set([]);
    vi.clearAllMocks();

    // Re-create component to trigger ngOnInit
    fixture = TestBed.createComponent(BlogDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('slug', 'part-2-phase-1');
    fixture.detectChanges();

    expect(mockStore.loadArticles).toHaveBeenCalled();
  });

  it('should show not found state if article matches nothing', () => {
    fixture.componentRef.setInput('slug', 'non-existent');
    fixture.detectChanges();

    const nativeEl = fixture.nativeElement as HTMLElement;
    const notFound = nativeEl.querySelector('.blog-detail__not-found');
    expect(notFound).toBeTruthy();
    expect(notFound?.textContent).toContain('not found');
  });

  it('should show loading state', () => {
    mockStore.loading.set(true);
    fixture.detectChanges();

    const nativeEl = fixture.nativeElement as HTMLElement;
    const loading = nativeEl.querySelector('.blog-detail__loading-skeleton');
    expect(loading).toBeTruthy();
  });

  it('should show adjacent navigation buttons', () => {
    const nativeEl = fixture.nativeElement as HTMLElement;
    const prevBtn = nativeEl.querySelector('.blog-detail__nav-prev');
    const nextBtn = nativeEl.querySelector('.blog-detail__nav-next');

    // Should show both since we have [prev, current, next]
    expect(prevBtn).toBeTruthy();
    expect(nextBtn).toBeTruthy();
  });

  it('should hide navigation buttons if no adjacent articles', () => {
    mockStore.articles.set([mockArticle]); // Only current exists
    fixture.detectChanges();

    const nativeEl = fixture.nativeElement as HTMLElement;
    const prevBtn = nativeEl.querySelector('.blog-detail__nav-prev');
    const nextBtn = nativeEl.querySelector('.blog-detail__nav-next');

    expect(prevBtn).toBeNull();
    expect(nextBtn).toBeNull();
  });

  it('should disable navigation button if article is not published', () => {
    const draftNext: BlogArticle = { ...nextArticle, status: 'draft', slug: 'part-4-phase-3' };
    mockStore.articles.set([prevArticle, mockArticle, draftNext]);
    fixture.detectChanges();

    const nextBtnDe = fixture.debugElement.query(By.css('.blog-detail__nav-next'));
    expect(nextBtnDe).toBeTruthy();

    // Check signal input on component instance
    expect((nextBtnDe.componentInstance as ButtonComponent).disabled()).toBe(true);
  });

  it('should handle content loading error', () => {
    // Mock error response
    mockStore.getArticleContent.mockReturnValue({
      subscribe: vi.fn((callbacks: { error?: (e: Error) => void }) =>
        callbacks.error?.(new Error('Fetch failed')),
      ),
    });

    // Re-init component to trigger effect
    fixture = TestBed.createComponent(BlogDetailComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('slug', 'part-2-phase-1');
    fixture.detectChanges();

    expect(component.content()).toContain('Failed to load article content');
    expect(component.contentLoading()).toBe(false);
  });

  it('should update SEO meta tags', () => {
    // Component already created in beforeEach
    expect(mockSeoService.updatePageSeo).toHaveBeenCalledWith({
      title: 'Test Article',
      meta: {
        description: 'Test Excerpt',
        keywords: ['tag1'],
        author: 'Test Author',
      },
    });
  });

  describe('prefetch behavior', () => {
    it('should use prefetch result when path matches slug', async () => {
      const mockHttp = TestBed.inject(HttpClient);
      const prefetchContent = '# Prefetched Content';
      (mockHttp.get as ReturnType<typeof vi.fn>).mockReturnValue(of(prefetchContent));

      // Use article with contentPath that matches the slug
      const matchingArticle: BlogArticle = {
        ...mockArticle,
        contentPath: 'assets/blogs/part-2-phase-1.md',
      };

      mockStore.articles.set([]);
      vi.clearAllMocks();

      fixture = TestBed.createComponent(BlogDetailComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('slug', 'part-2-phase-1');
      fixture.detectChanges();

      // Simulate articles loading after prefetch started - path now includes slug
      mockStore.articles.set([prevArticle, matchingArticle, nextArticle]);
      fixture.detectChanges();

      // Wait for effect to process
      await fixture.whenStable();

      expect(component.content()).toBe(prefetchContent);
      expect(component.contentLoading()).toBe(false);
    });

    it('should fallback to store when prefetch fails', async () => {
      const mockHttp = TestBed.inject(HttpClient);
      (mockHttp.get as ReturnType<typeof vi.fn>).mockReturnValue(
        new Observable<string>((subscriber) => {
          subscriber.error(new Error('Prefetch failed'));
        }),
      );

      const storeContent = '# Store Content';
      mockStore.getArticleContent.mockReturnValue(of(storeContent));
      mockStore.articles.set([]);
      vi.clearAllMocks();

      fixture = TestBed.createComponent(BlogDetailComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('slug', 'part-2-phase-1');
      fixture.detectChanges();

      // Simulate articles loading after prefetch started
      mockStore.articles.set([prevArticle, mockArticle, nextArticle]);
      fixture.detectChanges();

      await fixture.whenStable();

      expect(mockStore.getArticleContent).toHaveBeenCalledWith('assets/blogs/test-article.md');
      expect(component.content()).toBe(storeContent);
    });

    it('should show error when both prefetch and store fallback fail', async () => {
      const mockHttp = TestBed.inject(HttpClient);
      (mockHttp.get as ReturnType<typeof vi.fn>).mockReturnValue(
        new Observable<string>((subscriber) => {
          subscriber.error(new Error('Prefetch failed'));
        }),
      );

      mockStore.getArticleContent.mockReturnValue(
        new Observable<string>((subscriber) => {
          subscriber.error(new Error('Store failed'));
        }),
      );
      mockStore.articles.set([]);
      vi.clearAllMocks();

      fixture = TestBed.createComponent(BlogDetailComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('slug', 'part-2-phase-1');
      fixture.detectChanges();

      // Simulate articles loading after prefetch started
      mockStore.articles.set([prevArticle, mockArticle, nextArticle]);
      fixture.detectChanges();

      await fixture.whenStable();

      expect(component.content()).toBe('Failed to load article content.');
      expect(component.contentLoading()).toBe(false);
    });
  });

  describe('adjacentArticles computed', () => {
    it('should return null for prev when current is first article', () => {
      fixture.componentRef.setInput('slug', 'part-1-introduction');
      fixture.detectChanges();

      const adjacent = component.adjacentArticles();
      expect(adjacent.prev).toBeNull();
      expect(adjacent.next).toEqual(mockArticle);
    });

    it('should return null for next when current is last article', () => {
      fixture.componentRef.setInput('slug', 'part-3-phase-2');
      fixture.detectChanges();

      const adjacent = component.adjacentArticles();
      expect(adjacent.prev).toEqual(mockArticle);
      expect(adjacent.next).toBeNull();
    });

    it('should return both null when article not found in list', () => {
      fixture.componentRef.setInput('slug', 'non-existent-slug');
      fixture.detectChanges();

      const adjacent = component.adjacentArticles();
      expect(adjacent.prev).toBeNull();
      expect(adjacent.next).toBeNull();
    });
  });

  describe('template rendering', () => {
    it('should render article tags', () => {
      const nativeEl = fixture.nativeElement as HTMLElement;
      const tags = nativeEl.querySelectorAll('.blog-detail__tag');

      expect(tags.length).toBe(1);
      expect(tags[0].textContent).toContain('#tag1');
    });

    it('should render multiple tags when article has multiple', () => {
      const multiTagArticle: BlogArticle = {
        ...mockArticle,
        tags: ['angular', 'typescript', 'testing'],
      };
      mockStore.articles.set([prevArticle, multiTagArticle, nextArticle]);
      fixture.detectChanges();

      const nativeEl = fixture.nativeElement as HTMLElement;
      const tags = nativeEl.querySelectorAll('.blog-detail__tag');

      expect(tags.length).toBe(3);
      expect(tags[0].textContent).toContain('#angular');
      expect(tags[1].textContent).toContain('#typescript');
      expect(tags[2].textContent).toContain('#testing');
    });

    it('should render reading time', () => {
      const nativeEl = fixture.nativeElement as HTMLElement;
      const readTime = nativeEl.querySelector('.blog-detail__read-time');

      expect(readTime).toBeTruthy();
      expect(readTime?.textContent).toBeTruthy();
    });

    it('should render published date', () => {
      const nativeEl = fixture.nativeElement as HTMLElement;
      const date = nativeEl.querySelector('.blog-detail__date');

      expect(date).toBeTruthy();
      expect(date?.textContent).toContain('2024');
    });

    it('should render back button with routerLink', () => {
      const backButton = fixture.debugElement.query(By.css('.blog-detail__back'));

      expect(backButton).toBeTruthy();
      // Check that the RouterLink directive is applied
      const routerLinkDir = backButton.injector.get(RouterLink, null);
      expect(routerLinkDir).toBeTruthy();
    });

    it('should pass content to markdown component', () => {
      const markdownEl = fixture.debugElement.query(By.css('markdown'));

      expect(markdownEl).toBeTruthy();
      // Verify content signal has the expected value
      expect(component.content()).toBe('# Test Content');
    });
  });

  describe('content loading state', () => {
    it('should show content loading text while content is loading', () => {
      component.contentLoading.set(true);
      fixture.detectChanges();

      const nativeEl = fixture.nativeElement as HTMLElement;
      const loadingText = nativeEl.querySelector('.blog-detail__loading');

      expect(loadingText).toBeTruthy();
      expect(loadingText?.textContent).toContain('Loading');
    });

    it('should hide loading text and show markdown when content is loaded', () => {
      component.contentLoading.set(false);
      component.content.set('# Loaded Content');
      fixture.detectChanges();

      const nativeEl = fixture.nativeElement as HTMLElement;
      const loadingText = nativeEl.querySelector('.blog-detail__loading');
      const markdown = nativeEl.querySelector('markdown');

      expect(loadingText).toBeNull();
      expect(markdown).toBeTruthy();
    });
  });

  describe('navigation button routing', () => {
    it('should set routerLink for published prev article', () => {
      const prevBtn = fixture.debugElement.query(By.css('.blog-detail__nav-prev'));

      expect(prevBtn).toBeTruthy();
      // Check that the RouterLink directive is applied with correct route
      const routerLinkDir = prevBtn.injector.get(RouterLink, null);
      expect(routerLinkDir).toBeTruthy();
      expect(routerLinkDir?.urlTree?.toString()).toBe('/blog/part-1-introduction');
    });

    it('should set routerLink for published next article', () => {
      const nextBtn = fixture.debugElement.query(By.css('.blog-detail__nav-next'));

      expect(nextBtn).toBeTruthy();
      const routerLinkDir = nextBtn.injector.get(RouterLink, null);
      expect(routerLinkDir).toBeTruthy();
      expect(routerLinkDir?.urlTree?.toString()).toBe('/blog/part-3-phase-2');
    });

    it('should set routerLink to null for unpublished article', () => {
      const unpublishedPrev: BlogArticle = {
        ...prevArticle,
        slug: 'unpublished-article',
      };
      mockStore.articles.set([unpublishedPrev, mockArticle, nextArticle]);
      fixture.detectChanges();

      const prevBtn = fixture.debugElement.query(By.css('.blog-detail__nav-prev'));

      expect(prevBtn).toBeTruthy();
      // When routerLink is null, the urlTree should be null
      const routerLinkDir = prevBtn.injector.get(RouterLink, null);
      expect(routerLinkDir?.urlTree).toBeNull();
    });
  });
});
