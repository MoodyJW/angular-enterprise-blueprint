import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { heroChevronRight, heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

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
import { ICON_NAMES } from '@shared/constants/icon-names.constants';

import { SeoService } from '@core/services/seo/seo.service';

import { DatePipe } from '@angular/common';
import { ArchitectureStore } from '@core/services/architecture/architecture.store';

/**
 * Architecture Decisions page component.
 *
 * Displays a searchable grid of Architecture Decision Records (ADRs).
 * Uses ArchitectureStore for state management.
 */
@Component({
  selector: 'eb-architecture',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoDirective,
    ContainerComponent,
    GridComponent,
    StackComponent,
    StackComponent,
    CardComponent,
    DividerComponent,
    InputComponent,
    ButtonComponent,
    BadgeComponent,
    IconComponent,
    DatePipe,
  ],
  providers: [ArchitectureStore],
  viewProviders: [provideIcons({ heroChevronRight, heroMagnifyingGlass })],
  templateUrl: './architecture.component.html',
  styleUrl: './architecture.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchitectureComponent implements OnInit {
  protected readonly store = inject(ArchitectureStore);
  private readonly _seoService = inject(SeoService);
  private readonly _destroyRef = inject(DestroyRef);

  /** Icon name constants */
  protected readonly ICONS = ICON_NAMES;

  /** Search input value signal */
  protected readonly searchValue = signal('');

  /** Subject for debouncing search input */
  private readonly _searchSubject = new Subject<string>();

  ngOnInit(): void {
    // Load ADRs on init
    this.store.loadAdrs();

    this._seoService.updatePageSeo({
      title: 'Architecture Decisions',
      meta: {
        description: 'Browse Architectural Decision Records (ADRs) and design patterns.',
      },
    });

    // Set up debounced search filter
    this._searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => {
        this.store.setFilter(value);
      });
  }

  /**
   * Handle search input changes.
   */
  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
    this._searchSubject.next(value);
  }

  /**
   * Clear the search.
   */
  protected clearSearch(): void {
    this.searchValue.set('');
    this.store.clearFilter();
  }

  /**
   * Get the badge variant based on ADR status.
   */
  protected getStatusVariant(status: string): 'success' | 'warning' | 'secondary' {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'deprecated':
        return 'warning';
      case 'superseded':
        return 'secondary';
      default:
        return 'secondary';
    }
  }
}
