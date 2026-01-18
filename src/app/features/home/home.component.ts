import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SeoService } from '@core/services/seo/seo.service';
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
    DecimalPipe,
    TranslocoDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardStore],
})
export class HomeComponent implements OnInit {
  readonly store = inject(DashboardStore);
  private readonly translocoService = inject(TranslocoService);
  private readonly seoService = inject(SeoService);

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

  metrics = this.store.metrics;

  ngOnInit(): void {
    this.store.loadMetrics();
    this.store.loadExtendedMetrics();

    this.seoService.updatePageSeo({
      title: 'Dashboard',
      meta: {
        description:
          'Angular Enterprise Blueprint Dashboard - Monitor system status, project health, and real-time visitor metrics.',
      },
    });
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
