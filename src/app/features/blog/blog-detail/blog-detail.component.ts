import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { MarkdownModule } from 'ngx-markdown';
import { Observable } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BlogStore } from '../blog.store';

import { provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroArrowRight } from '@ng-icons/heroicons/outline';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ICON_NAMES } from '../../../shared/constants/icon-names.constants';
import { PUBLISHED_SLUGS } from '../blog.constants';

@Component({
  selector: 'eb-blog-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslocoDirective,
    MarkdownModule,
    ButtonComponent,
    CardComponent,
    IconComponent,
  ],
  viewProviders: [provideIcons({ heroArrowLeft, heroArrowRight })],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailComponent implements OnInit {
  readonly slug = input.required<string>(); // From route param
  readonly store = inject(BlogStore);
  readonly ICONS = ICON_NAMES;
  readonly PUBLISHED_SLUGS = PUBLISHED_SLUGS;

  readonly article = computed(() => this.store.articles().find((a) => a.slug === this.slug()));

  readonly adjacentArticles = computed(() => {
    const articles = this.store.articles();
    const currentIdx = articles.findIndex((a) => a.slug === this.slug());
    if (currentIdx === -1) return { prev: null, next: null };

    const prev = currentIdx > 0 ? articles[currentIdx - 1] : null;
    const next = currentIdx < articles.length - 1 ? articles[currentIdx + 1] : null;

    return {
      prev,
      next,
    };
  });

  readonly content = signal<string>('');
  readonly contentLoading = signal<boolean>(false);
  private readonly http = inject(HttpClient);
  private prefetch$: Observable<string> | null = null;

  constructor() {
    // Effect to load content when article changes
    effect(() => {
      const art = this.article();
      if (art !== undefined && art.contentPath !== '') {
        this.loadContent(art.contentPath);
      }
    });
  }

  ngOnInit(): void {
    // If arriving directly, store might be empty
    if (this.store.articles().length === 0) {
      this.store.loadArticles();

      // Speculative prefetch of markdown content to avoid waterfall
      // (Wait for articles -> Wait for content)
      // We assume the path based on slug convention
      const estimatedPath = `assets/blogs/${this.slug()}.md`;
      this.prefetch$ = this.http.get(estimatedPath, { responseType: 'text' }).pipe(shareReplay(1));
      // Trigger the request immediately
      this.prefetch$.pipe(take(1)).subscribe({
        error: () => {
          /* Ignore errors here, handled in loadContent */
        },
      });
    }
  }

  private loadContent(contentPath: string): void {
    this.contentLoading.set(true);

    // Use prefetch if available and paths match (or likely match)
    // We trust prefetch if it exists, assuming slug didn't change mid-init
    const request$ =
      this.prefetch$ && contentPath.includes(this.slug())
        ? this.prefetch$
        : this.store.getArticleContent(contentPath);

    request$.subscribe({
      next: (markdown: string) => {
        this.content.set(markdown);
        this.contentLoading.set(false);
        this.prefetch$ = null; // Clear usage
      },
      error: () => {
        // If prefetch failed (e.g. wrong path guess), fall back to store fetch if it was prefetch
        if (this.prefetch$) {
          this.prefetch$ = null;
          this.store.getArticleContent(contentPath).subscribe({
            next: (md) => {
              this.content.set(md);
              this.contentLoading.set(false);
            },
            error: () => {
              this.content.set('Failed to load article content.');
              this.contentLoading.set(false);
            },
          });
        } else {
          this.content.set('Failed to load article content.');
          this.contentLoading.set(false);
        }
      },
    });
  }
}
