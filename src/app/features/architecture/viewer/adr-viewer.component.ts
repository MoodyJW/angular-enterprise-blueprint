import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroExclamationTriangle,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';
import { MarkdownComponent } from 'ngx-markdown';

import { BadgeComponent } from '@shared/components/badge';
import { ButtonComponent } from '@shared/components/button';
import { ContainerComponent } from '@shared/components/container';
import { IconComponent } from '@shared/components/icon';
import { ICON_NAMES } from '@shared/constants';

import { Adr } from '../services/architecture.service';
import { ArchitectureStore } from '../state/architecture.store';

/**
 * ADR Viewer component.
 *
 * Displays the markdown content of an Architecture Decision Record.
 */
@Component({
  selector: 'eb-adr-viewer',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoDirective,
    MarkdownComponent,
    ContainerComponent,
    ButtonComponent,
    BadgeComponent,
    IconComponent,
  ],
  providers: [ArchitectureStore],
  viewProviders: [provideIcons({ heroArrowLeft, heroExclamationTriangle, heroMagnifyingGlass })],
  templateUrl: './adr-viewer.component.html',
  styleUrl: './adr-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdrViewerComponent implements OnInit {
  /** Route parameter for ADR ID */
  readonly id = input.required<string>();

  protected readonly store = inject(ArchitectureStore);
  protected readonly ICONS = ICON_NAMES;

  /** The currently selected ADR metadata */
  protected readonly adr = computed<Adr | undefined>(() => {
    const getter = this.store.getAdrById();
    return getter(this.id());
  });

  ngOnInit(): void {
    // Load ADRs if not already loaded
    if (this.store.entities().length === 0) {
      this.store.loadAdrs();
    }
    // Load the content for this ADR
    this.store.loadContent(this.id());
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
