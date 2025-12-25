import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Architecture decisions page component.
 *
 * Displays ADR documentation viewer.
 * This is a placeholder that will be fully implemented in Phase 5.
 */
@Component({
  selector: 'eb-architecture',
  standalone: true,
  imports: [],
  templateUrl: './architecture.component.html',
  styleUrl: './architecture.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchitectureComponent {}
