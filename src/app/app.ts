import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { BadgeComponent } from './shared/components/badge';
import { DividerComponent } from './shared/components/divider';
import { IconComponent } from './shared/components/icon';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner';
import { SkeletonComponent } from './shared/components/skeleton';

@Component({
  selector: 'eb-root',
  imports: [
    RouterOutlet,
    TranslocoDirective,
    IconComponent,
    LoadingSpinnerComponent,
    DividerComponent,
    BadgeComponent,
    SkeletonComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
