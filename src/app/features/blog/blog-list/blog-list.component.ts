import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { heroChevronRight } from '@ng-icons/heroicons/outline';

import {
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  ContainerComponent,
  DividerComponent,
  GridComponent,
  IconComponent,
  InputComponent,
  StackComponent,
} from '@shared/components';
import { ICON_NAMES } from '@shared/constants/icons.constants';

import { PUBLISHED_SLUGS } from '../blog.constants';
import { BlogStore } from '../blog.store';
import { BlogCategory } from '../blog.types';

/**
 * Component to display a list of blog articles.
 * Includes features for filtering by category (via URL) and searching.
 * Utilizes BlogStore for state management.
 */

@Component({
  selector: 'eb-blog-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TranslocoDirective,
    CardComponent,
    ButtonComponent,
    InputComponent,
    BadgeComponent,
    GridComponent,
    ContainerComponent,
    StackComponent,
    IconComponent,
    DividerComponent,
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroChevronRight })],
})
export class BlogListComponent implements OnInit {
  protected readonly ICONS = ICON_NAMES;
  readonly store = inject(BlogStore);

  ngOnInit(): void {
    this.store.loadArticles();
  }

  onSearch(query: string): void {
    this.store.setFilter({ query });
  }

  onCategorySelect(category: BlogCategory): void {
    this.store.setFilter({ category });
  }

  clearFilters(): void {
    this.store.clearFilters();
  }

  /**
   * Articles after Part 3 (Phase 2) are still in progress
   * Parts 1-3 are published, Parts 4-8 are in progress
   */
  isArticleInProgress(slug: string): boolean {
    return !PUBLISHED_SLUGS.includes(slug);
  }
}
