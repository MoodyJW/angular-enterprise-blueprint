import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BlogStore } from './blog.store';
import { BlogArticle } from './blog.types';

describe('BlogStore', () => {
  let store: InstanceType<typeof BlogStore>;
  let httpMock: HttpTestingController;

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
      tags: ['tag1', 'tag2'],
      status: 'published',
    },
    {
      id: '2',
      slug: 'article-2',
      title: 'Article 2',
      excerpt: 'Excerpt 2',
      contentPath: 'assets/blogs/article-2.md',
      author: { name: 'Author 2', title: 'Title 2' },
      publishedAt: '2024-01-02',
      readingTimeMinutes: 10,
      category: 'angular',
      tags: ['tag2', 'tag3'],
      status: 'published',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlogStore, provideHttpClient(), provideHttpClientTesting()],
    });

    store = TestBed.inject(BlogStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should initialize with default state', () => {
    expect(store.articles()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.filter()).toEqual({ query: '', category: null, tag: null });
  });

  describe('loadArticles', () => {
    it('should load articles successfully', () => {
      store.loadArticles();
      expect(store.loading()).toBe(true);
      expect(store.error()).toBeNull();

      const req = httpMock.expectOne('assets/data/blog-articles.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockArticles);

      expect(store.articles()).toEqual(mockArticles);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle error when loading articles fails', () => {
      store.loadArticles();
      const req = httpMock.expectOne('assets/data/blog-articles.json');
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(store.articles()).toEqual([]);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBe('Failed to load articles');
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      // Load data first
      store.loadArticles();
      const req = httpMock.expectOne('assets/data/blog-articles.json');
      req.flush(mockArticles);
    });

    it('should filter by query (title)', () => {
      store.setFilter({ query: 'Article 1' });
      expect(store.filteredArticles()).toHaveLength(1);
      expect(store.filteredArticles()[0].id).toBe('1');
    });

    it('should filter by category', () => {
      store.setFilter({ category: 'angular' });
      expect(store.filteredArticles()).toHaveLength(1);
      expect(store.filteredArticles()[0].id).toBe('2');
    });

    it('should filter by tag', () => {
      store.setFilter({ tag: 'tag1' });
      expect(store.filteredArticles()).toHaveLength(1);
      expect(store.filteredArticles()[0].id).toBe('1');
    });

    it('should clear filters', () => {
      store.setFilter({ query: 'test', category: 'architecture' });
      store.clearFilters();
      expect(store.filter()).toEqual({ query: '', category: null, tag: null });
      expect(store.filteredArticles()).toHaveLength(2);
    });

    it('should combine filters (Query + Tag)', () => {
      // "Article 1" has "tag1", "Article 2" does not.
      store.setFilter({ query: 'Article', tag: 'tag1' });
      expect(store.filteredArticles()).toHaveLength(1);
      expect(store.filteredArticles()[0].id).toBe('1');
    });

    it('should return empty list when filters match nothing', () => {
      store.setFilter({ query: 'Article 1', category: 'angular' }); // Article 1 is 'architecture'
      expect(store.filteredArticles()).toHaveLength(0);
    });
  });

  describe('computed signals', () => {
    beforeEach(() => {
      store.loadArticles();
      const req = httpMock.expectOne('assets/data/blog-articles.json');
      req.flush(mockArticles);
    });

    it('should compute allCategories', () => {
      expect(store.allCategories()).toEqual(['architecture', 'angular']);
    });

    it('should compute allTags', () => {
      // Tags: ['tag1', 'tag2'] + ['tag2', 'tag3'] -> unique: ['tag1', 'tag2', 'tag3']
      expect(store.allTags()).toEqual(['tag1', 'tag2', 'tag3']);
    });
  });

  describe('getArticleContent', () => {
    it('should fetch content via HTTP', () => {
      const path = 'assets/blogs/test.md';
      store.getArticleContent(path).subscribe();

      const req = httpMock.expectOne(path);
      expect(req.request.method).toBe('GET');
      req.flush('# Markdown');
    });
  });
});
