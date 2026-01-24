import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowRight,
  heroExclamationTriangle,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';
import { MarkdownComponent } from 'ngx-markdown';

import { SeoService } from '@core/services/seo/seo.service';
import {
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  ContainerComponent,
  DividerComponent,
  IconComponent,
} from '@shared/components';
import { ICON_NAMES } from '@shared/constants';

import { Adr } from '@core/services/architecture/architecture.service';
import { ArchitectureStore } from '@core/services/architecture/architecture.store';

/**
 * ADR Viewer component.
 *
 * Displays the markdown content of an Architecture Decision Record.
 */
@Component({
  selector: 'eb-adr-viewer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslocoDirective,
    MarkdownComponent,
    ContainerComponent,
    ButtonComponent,
    BadgeComponent,
    IconComponent,
    CardComponent,
    DividerComponent,
  ],
  providers: [ArchitectureStore],
  viewProviders: [
    provideIcons({ heroArrowLeft, heroArrowRight, heroExclamationTriangle, heroMagnifyingGlass }),
  ],
  templateUrl: './adr-viewer.component.html',
  styleUrls: ['./adr-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdrViewerComponent implements OnInit {
  /** Route parameter for ADR ID */
  readonly id = input.required<string>();

  protected readonly store = inject(ArchitectureStore);
  private readonly _seoService = inject(SeoService);
  protected readonly ICONS = ICON_NAMES;

  /** The currently selected ADR metadata */
  protected readonly adr = computed<Adr | undefined>(() => {
    const getter = this.store.getAdrById();
    return getter(this.id());
  });

  /** Adjacent ADRs for navigation */
  protected readonly adjacentAdrs = computed(() => {
    const allAdrs = this.store.entities();
    const currentId = this.id();
    const currentIndex = allAdrs.findIndex((a) => a.id === currentId);

    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    return {
      prev: currentIndex > 0 ? allAdrs[currentIndex - 1] : null,
      next: currentIndex < allAdrs.length - 1 ? allAdrs[currentIndex + 1] : null,
    };
  });

  constructor() {
    // Effect to update SEO when ADR changes
    effect(() => {
      const adr = this.adr();
      if (adr) {
        this._seoService.updatePageSeo({
          title: adr.title,
          meta: {
            description: adr.summary,
          },
        });
      }
    });

    // Effect to load content when ID changes
    effect(() => {
      const id = this.id();
      this.store.loadContent(id);
    });
  }

  ngOnInit(): void {
    // Load ADRs if not already loaded (for the list context)
    if (this.store.entities().length === 0) {
      this.store.loadAdrs();
    }
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
