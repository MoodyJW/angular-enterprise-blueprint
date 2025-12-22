import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonComponent } from './shared/components/button';
import { CardComponent } from './shared/components/card';
import { CheckboxComponent } from './shared/components/checkbox';

@Component({
  selector: 'eb-root',
  imports: [RouterOutlet, TranslocoDirective, CardComponent, ButtonComponent, CheckboxComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
