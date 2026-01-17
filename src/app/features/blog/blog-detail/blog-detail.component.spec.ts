import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { MarkdownModule } from 'ngx-markdown';
import { of } from 'rxjs';
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
    getArticleContent: vi.fn().mockReturnValue({
      subscribe: vi.fn((callbacks: { next?: (v: string) => void }) =>
        callbacks.next?.('# Test Content'),
      ),
    }),
  };

  beforeEach(async () => {
    mockStore.loading.set(false);
    mockStore.articles.set([prevArticle, mockArticle, nextArticle]);
    vi.clearAllMocks();

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
    const loading = nativeEl.querySelector('.blog-detail__loading');
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
});
