import { DecimalPipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ArchitectureStore } from '@core/services/architecture/architecture.store';
import { SeoService } from '@core/services/seo/seo.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { BadgeComponent } from '@shared/components/badge';
import { ButtonComponent } from '@shared/components/button';
import { CardComponent } from '@shared/components/card';
import { ContainerComponent } from '@shared/components/container';
import { GridComponent } from '@shared/components/grid';
import { StackComponent } from '@shared/components/stack';
import { DashboardStore } from './state/dashboard.store';

/**
 * Landing page component displaying the dashboard.
 * Shows system status, project metrics, and introductory content.
 */
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
    SlicePipe,
    TranslocoDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardStore, ArchitectureStore],
})
export class HomeComponent implements OnInit {
  readonly store = inject(DashboardStore);
  readonly architectureStore = inject(ArchitectureStore);
  private readonly translocoService = inject(TranslocoService);
  private readonly seoService = inject(SeoService);

  // Optimistic UI: Initialize hero content with default English text for immediate LCP
  // These signals render immediately while Transloco loads, preventing blank content
  readonly heroName = toSignal(this.translocoService.selectTranslate('home.hero.name'), {
    initialValue: 'Jason Walker Moody',
  });
  readonly heroTitle = toSignal(this.translocoService.selectTranslate('home.hero.title'), {
    initialValue: 'Lead Frontend Engineer',
  });
  readonly heroTagline = toSignal(this.translocoService.selectTranslate('home.hero.tagline'), {
    initialValue: 'Building Enterprise-Grade Applications with Modern Angular',
  });
  readonly heroBio = toSignal(this.translocoService.selectTranslate('home.hero.bio'), {
    initialValue:
      'Welcome to my Angular Enterprise Blueprint - a production-ready reference architecture demonstrating modern Angular best practices, enterprise patterns, and scalable design.',
  });
  readonly heroCtaProfile = toSignal(
    this.translocoService.selectTranslate('home.hero.cta.profile'),
    {
      initialValue: 'Meet The Architect',
    },
  );
  readonly ctaButton = toSignal(this.translocoService.selectTranslate('home.cta.button'), {
    initialValue: 'Explore Modules',
  });

  // System status header signals
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

  constructor() {
    // Defer non-critical data loading until after initial render
    // This improves FCP and LCP by reducing main thread work during initial paint
    afterNextRender(() => {
      // Use requestIdleCallback to load extended metrics during browser idle time
      // Fallback to setTimeout for browsers without requestIdleCallback support
      const scheduleLoad =
        typeof requestIdleCallback !== 'undefined'
          ? requestIdleCallback
          : (cb: () => void) => setTimeout(cb, 1);

      scheduleLoad(() => {
        this.store.loadExtendedMetrics();
        this.architectureStore.loadAdrs();
      });
    });
  }

  ngOnInit(): void {
    // Load only critical metrics needed for above-the-fold content
    this.store.loadMetrics();

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
