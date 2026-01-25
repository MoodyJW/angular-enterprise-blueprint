/**
 * Type definitions for Google Analytics 4 (gtag.js).
 *
 * These types provide strict typing for gtag function calls
 * and ensure type safety when interacting with GA4.
 */

/**
 * GA4 event parameters that can be sent with any event.
 */
export interface GtagEventParams {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * GA4 configuration options.
 */
export interface GtagConfigParams {
  /** Page path for page_view events */
  page_path?: string;
  /** Page title */
  page_title?: string;
  /** Send page view on config */
  send_page_view?: boolean;
  /** Enable debug mode */
  debug_mode?: boolean;
  /** Custom dimensions and metrics */
  [key: string]: string | number | boolean | undefined;
}

/**
 * gtag.js command types.
 */
export type GtagCommand = 'config' | 'event' | 'set' | 'js';

/**
 * The gtag function signature.
 */
export type GtagFunction = {
  (command: 'js', date: Date): void;
  (command: 'config', targetId: string, config?: GtagConfigParams): void;
  (command: 'event', eventName: string, eventParams?: GtagEventParams): void;
  (command: 'set', params: GtagEventParams): void;
};

/**
 * Extended Window interface with Google Analytics properties.
 */
declare global {
  /**
   * Extended Window interface with Google Analytics properties.
   */
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: unknown[];
  }
}
