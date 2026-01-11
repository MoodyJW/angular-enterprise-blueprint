import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SeoService } from '@core/services/seo/seo.service';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';

import { LoggerService } from '@core/services/logger';
import {
  heroArrowDownTray,
  heroBuildingOffice2,
  heroDocument,
  heroEnvelope,
  heroMapPin,
  heroUser,
} from '@ng-icons/heroicons/outline';
import { ionLogoGithub } from '@ng-icons/ionicons';
import { BadgeComponent } from '@shared/components/badge';
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { GridComponent } from '@shared/components/grid';
import { IconComponent } from '@shared/components/icon';
import { ModalComponent } from '@shared/components/modal';
import { ProfileStore } from './state/profile.store';

import { ProfileStatsCardComponent } from './components/profile-stats-card/profile-stats-card.component';

/**
 * Profile page component.
 *
 * Displays "The Architect" bio, GitHub stats, tech stack,
 * and resume download/preview options.
 */
@Component({
  selector: 'eb-profile',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterLink,
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    GridComponent,
    IconComponent,
    ModalComponent,
    ProfileStatsCardComponent,
  ],
  providers: [],
  viewProviders: [
    provideIcons({
      heroArrowDownTray,
      heroBuildingOffice2,
      heroDocument,
      heroEnvelope,
      heroMapPin,
      heroUser,
      ionLogoGithub,
    }),
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _logger = inject(LoggerService);
  private readonly _seoService = inject(SeoService);
  readonly store = inject(ProfileStore);

  /** Controls resume preview modal visibility */
  readonly showResumeModal = signal(false);

  /** Primary tech stack */
  readonly primaryTech = ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Node.js'];

  /** Secondary tech stack */
  readonly secondaryTech = ['Vitest', 'Playwright', 'Storybook', 'SCSS', 'GitHub Actions'];

  /** Resume file path */
  readonly resumePath = signal('/assets/resume/resume.pdf');

  /** Sanitized resume URL for embedding in object/iframe */
  /**
   * Safe resume URL for binding to iframe/object.
   *
   * SECURITY NOTE: Validates URL against whitelist before bypassing sanitization.
   */
  readonly safeResumeUrl = computed(() => {
    const url = this.resumePath();
    if (this._isValidResumeUrl(url)) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    this._logger.error('ProfileComponent: Invalid resume URL blocked by security check', { url });
    return null;
  });

  /**
   * Validate resume URL against allowed pattern.
   *
   * Only allows local assets in the assets/resume directory.
   */
  private _isValidResumeUrl(url: string): boolean {
    // Only allow local PDF assets (with or without leading slash)
    return /^\/?assets\/resume\/.*\.pdf$/.test(url);
  }

  /** Date range for stats (last 365 days) */
  readonly statsDateRange = computed(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 365);
    return { start, end };
  });

  ngOnInit(): void {
    this.store.loadGitHubStats();

    this._seoService.updatePageSeo({
      title: 'The Architect',
      meta: {
        description: 'Profile and technical skills of the system architect.',
      },
    });
  }

  /** Opens the resume preview modal */
  openResumeModal(): void {
    this.showResumeModal.set(true);
  }

  /** Closes the resume preview modal */
  closeResumeModal(): void {
    this.showResumeModal.set(false);
  }
}
