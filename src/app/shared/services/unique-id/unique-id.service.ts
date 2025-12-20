import { Injectable } from '@angular/core';

/**
 * Service for generating unique IDs for form components
 * Ensures unique IDs across the application for accessibility
 */
@Injectable({
  providedIn: 'root',
})
export class UniqueIdService {
  private counters = new Map<string, number>();

  /**
   * Generate a unique ID with an optional prefix
   * @param prefix - Optional prefix for the ID (e.g., 'checkbox', 'input')
   * @returns A unique ID string
   */
  generateId(prefix = 'component'): string {
    const current = this.getCounter(prefix);
    const next = current + 1;
    this.counters.set(prefix, next);
    return prefix + '-' + String(next);
  }

  /**
   * Reset a specific counter (useful for testing)
   * @param prefix - The prefix to reset
   */
  resetCounter(prefix: string): void {
    this.counters.delete(prefix);
  }

  /**
   * Reset all counters (useful for testing)
   */
  resetAllCounters(): void {
    this.counters.clear();
  }

  private getCounter(prefix: string): number {
    const current = this.counters.get(prefix);
    if (current === undefined || isNaN(current)) {
      return 0;
    }
    return current;
  }
}
