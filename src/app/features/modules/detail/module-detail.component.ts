import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroCheck,
  heroCodeBracket,
  heroMagnifyingGlass,
  heroRocketLaunch,
} from '@ng-icons/heroicons/outline';

import { BadgeComponent } from '@shared/components/badge';
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { ContainerComponent } from '@shared/components/container';
import { IconComponent } from '@shared/components/icon';
import { StackComponent } from '@shared/components/stack';
import { ICON_NAMES } from '@shared/constants/icon-names.constants';

import { Module } from '../services/modules.service';
import { ModulesStore } from '../state/modules.store';

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
    RouterLink,
    TranslocoDirective,
    TitleCasePipe,
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
      heroRocketLaunch,
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

  /** Icon name constants */
  protected readonly ICONS = ICON_NAMES;

  /** The currently selected module */
  protected readonly module = computed<Module | undefined>(() => {
    const getter = this.store.getModuleById();
    return getter(this.id());
  });

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
      case 'state-management':
        return 'primary';
      case 'ui':
        return 'success';
      case 'security':
        return 'warning';
      case 'infrastructure':
        return 'secondary';
      default:
        return 'secondary';
    }
  }
}
