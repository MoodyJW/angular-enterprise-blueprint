import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ThemeService } from '@core/services/theme/theme.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { BadgeComponent } from '@shared/components/badge';
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { ContainerComponent } from '@shared/components/container';
import { GridComponent } from '@shared/components/grid';
import { StackComponent } from '@shared/components/stack';
import { DashboardStore } from './state/dashboard.store';

@Component({
  selector: 'eb-home',
  standalone: true,
  imports: [
    CardComponent,
    GridComponent,
    StackComponent,
    BadgeComponent,
    ButtonComponent,
    ContainerComponent,
    RouterLink,
    TitleCasePipe,
    TranslocoDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardStore],
})
export class HomeComponent implements OnInit {
  readonly store = inject(DashboardStore);
  readonly themeService = inject(ThemeService);
  private readonly translocoService = inject(TranslocoService);

  // Optimistic UI: Initialize with default English text for immediate LCP
  readonly title = toSignal(this.translocoService.selectTranslate('home.systemStatus.title'), {
    initialValue: 'System Status',
  });
  readonly subtitle = toSignal(
    this.translocoService.selectTranslate('home.systemStatus.subtitle'),
    {
      initialValue: 'Enterprise Dashboard & Application Health',
    },
  );

  ngOnInit(): void {
    this.store.loadMetrics();
    this.store.loadVisitors();
  }

  getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '−';
    }
  }

  getTrendColor(trend: 'up' | 'down' | 'stable'): 'success' | 'error' | 'neutral' {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      default:
        return 'neutral';
    }
  }
}
