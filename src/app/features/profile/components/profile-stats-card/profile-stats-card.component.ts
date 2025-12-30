import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  heroBuildingOffice2,
  heroEnvelope,
  heroMapPin,
  heroUser,
} from '@ng-icons/heroicons/outline';
import { ionLogoGithub } from '@ng-icons/ionicons';
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { IconComponent } from '@shared/components/icon';
import { SkeletonComponent } from '@shared/components/skeleton';
import { GitHubStats } from '../../models/github-stats.interface';

@Component({
  selector: 'eb-profile-stats-card',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    TranslocoModule,
    CardComponent,
    ButtonComponent,
    SkeletonComponent,
    IconComponent,
  ],
  providers: [
    provideIcons({
      heroBuildingOffice2,
      heroEnvelope,
      heroMapPin,
      heroUser,
      ionLogoGithub,
    }),
  ],
  templateUrl: './profile-stats-card.component.html',
  styleUrl: './profile-stats-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileStatsCardComponent {
  stats = input<GitHubStats | null>(null);
  isLoading = input<boolean>(false);
  error = input<string | null>(null);

  retry = output();

  statsDateRange = computed(() => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    return { start, end };
  });

  onRetry(): void {
    this.retry.emit();
  }
}
