import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { MarkdownModule } from 'ngx-markdown';
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
    },
  },
};

describe('BlogDetailComponent', () => {
  let component: BlogDetailComponent;
  let fixture: ComponentFixture<BlogDetailComponent>;

  const mockArticle: BlogArticle = {
    id: '1',
    slug: 'test-article',
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

  const mockStore = {
    loading: signal(false),
    articles: signal([mockArticle]),
    loadArticles: vi.fn(),
    getArticleContent: vi.fn().mockReturnValue({
      subscribe: vi.fn((callbacks: { next?: (v: string) => void }) =>
        callbacks.next?.('# Test Content'),
      ),
    }),
  };

  beforeEach(async () => {
    mockStore.loading.set(false);
    mockStore.articles.set([mockArticle]);
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
      providers: [provideRouter([]), { provide: BlogStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetailComponent);
    component = fixture.componentInstance;

    // Set input 'slug'
    fixture.componentRef.setInput('slug', 'test-article');
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
    fixture.componentRef.setInput('slug', 'test-article');
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
});
