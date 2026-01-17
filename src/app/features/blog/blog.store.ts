import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { BlogArticle, BlogCategory } from './blog.types';

type BlogState = {
  articles: BlogArticle[];
  loading: boolean;
  error: string | null;
  filter: {
    query: string;
    category: BlogCategory | null;
    tag: string | null;
  };
};

const initialState: BlogState = {
  articles: [],
  loading: false,
  error: null,
  filter: {
    query: '',
    category: null,
    tag: null,
  },
};

export const BlogStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ articles, filter }) => ({
    filteredArticles: computed(() => {
      const { query, category, tag } = filter();
      const lowerQuery = query.toLowerCase();

      return articles().filter((article) => {
        const matchesQuery =
          query === '' ||
          article.title.toLowerCase().includes(lowerQuery) ||
          article.excerpt.toLowerCase().includes(lowerQuery);
        const matchesCategory = category === null || article.category === category;
        const matchesTag = tag === null || article.tags.includes(tag);

        return matchesQuery && matchesCategory && matchesTag;
      });
    }),
    allCategories: computed(() => {
      const categories = new Set(articles().map((a) => a.category));
      return Array.from(categories);
    }),
    allTags: computed(() => {
      const tags = new Set(articles().flatMap((a) => a.tags));
      return Array.from(tags);
    }),
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    loadArticles: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { loading: true, error: null });
        }),
        switchMap(() =>
          http.get<BlogArticle[]>('assets/data/blog-articles.json').pipe(
            tapResponse({
              next: (articles) => {
                patchState(store, { articles, loading: false });
              },
              error: (err: unknown) => {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load articles';
                patchState(store, {
                  error: errorMessage,
                  loading: false,
                });
              },
            }),
          ),
        ),
      ),
    ),
    setFilter(filter: Partial<BlogState['filter']>) {
      patchState(store, (state) => ({ filter: { ...state.filter, ...filter } }));
    },
    clearFilters() {
      patchState(store, {
        filter: { query: '', category: null, tag: null },
      });
    },
    getArticleContent(contentPath: string) {
      return http.get(contentPath, { responseType: 'text' });
    },
  })),
);
