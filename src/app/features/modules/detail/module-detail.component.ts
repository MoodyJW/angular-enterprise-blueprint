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
  heroCheck,
  heroCodeBracket,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';

import { SeoService } from '@core/services/seo/seo.service';
import {
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  ContainerComponent,
  IconComponent,
  StackComponent,
} from '@shared/components';
import { ICON_NAMES } from '@shared/constants';

import { Module } from '@features/modules/services/modules.service';
import { ModulesStore } from '@features/modules/state/modules.store';

/**
 * Module detail page component.
 *
 * Displays detailed information about a single module including
 * features and tech stack.
 */
@Component({
  selector: 'eb-module-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslocoDirective,
    ContainerComponent,
    StackComponent,
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    IconComponent,
  ],
  providers: [ModulesStore],
  viewProviders: [
    provideIcons({
      heroArrowLeft,
      heroArrowRight,
      heroCodeBracket,
      heroCheck,
      heroMagnifyingGlass,
    }),
  ],
  templateUrl: './module-detail.component.html',
  styleUrl: './module-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleDetailComponent implements OnInit {
  /** Route parameter for module ID */
  readonly id = input.required<string>();

  protected readonly store = inject(ModulesStore);
  private readonly _seoService = inject(SeoService);

  /** Icon name constants */
  protected readonly ICONS = ICON_NAMES;

  /** The currently selected module */
  protected readonly module = computed<Module | undefined>(() => {
    const getter = this.store.getModuleById();
    return getter(this.id());
  });

  /** Adjacent modules for navigation */
  protected readonly adjacentModules = computed(() => {
    const allModules = this.store.entities();
    const currentId = this.id();
    const currentIndex = allModules.findIndex((m) => m.id === currentId);

    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    return {
      prev: currentIndex > 0 ? allModules[currentIndex - 1] : null,
      next: currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null,
    };
  });

  constructor() {
    effect(() => {
      const module = this.module();
      if (module) {
        this._seoService.updatePageSeo({
          title: module.title,
          meta: {
            description: module.description,
          },
        });
      }
    });
  }

  ngOnInit(): void {
    this.store.loadModules();
  }

  /**
   * Get the badge variant based on module status.
   */
  protected getStatusVariant(status: string): 'success' | 'warning' | 'secondary' {
    switch (status) {
      case 'production':
        return 'success';
      case 'beta':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  /**
   * Get the badge variant based on module category.
   */
  protected getCategoryVariant(
    category: string,
  ): 'primary' | 'secondary' | 'success' | 'warning' | 'error' {
    switch (category) {
      case 'ui':
        return 'primary';
      case 'security':
        return 'warning';
      case 'state-management':
        return 'success';
      case 'infrastructure':
      default:
        return 'secondary';
    }
  }
}
