import { CommonModule } from '@angular/common';
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
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BlogStore } from '../blog.store';

@Component({
  selector: 'eb-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoDirective, MarkdownModule, ButtonComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailComponent implements OnInit {
  readonly slug = input.required<string>(); // From route param
  readonly store = inject(BlogStore);

  readonly article = computed(() => this.store.articles().find((a) => a.slug === this.slug()));

  readonly content = signal<string>('');
  readonly contentLoading = signal<boolean>(false);

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
    }
  }

  private loadContent(contentPath: string): void {
    this.contentLoading.set(true);
    this.store.getArticleContent(contentPath).subscribe({
      next: (markdown) => {
        this.content.set(markdown);
        this.contentLoading.set(false);
      },
      error: () => {
        this.content.set('Failed to load article content.');
        this.contentLoading.set(false);
      },
    });
  }
}
