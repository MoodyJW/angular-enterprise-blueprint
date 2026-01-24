import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ContainerComponent } from '../../../shared/components/container/container.component';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { StackComponent } from '../../../shared/components/stack/stack.component';
import { PUBLISHED_SLUGS } from '../blog.constants';
import { BlogStore } from '../blog.store';
import { BlogCategory } from '../blog.types';

/**
 * Component to display a list of blog articles.
 * Includes features for filtering by category (via URL) and searching.
 * Utilizes BlogStore for state management.
 */
import { ICON_NAMES } from '../../../shared/constants/icons.constants';

import { provideIcons } from '@ng-icons/core';
import { heroChevronRight } from '@ng-icons/heroicons/outline';

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
