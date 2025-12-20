/**
 * Toast notification durations (milliseconds)
 */
export const TOAST_DURATIONS = {
  /** Default duration for toast messages */
  DEFAULT: 5000,
  /** Short duration for simple messages */
  SHORT: 3000,
  /** Normal duration for standard messages */
  NORMAL: 5000,
  /** Long duration for important messages */
  LONG: 8000,
  /** Persistent (manual dismiss only) */
  PERSISTENT: 0,
} as const;
