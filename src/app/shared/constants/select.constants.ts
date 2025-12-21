/**
 * Debounce delays for user input (milliseconds)
 */
export const DEBOUNCE_DELAYS = {
  /** Search input debounce */
  SEARCH: 300,
  /** Filter selection debounce */
  FILTER: 200,
  /** Blur event debounce */
  BLUR: 200,
  /** Window resize events */
  RESIZE: 150,
  /** Scroll events */
  SCROLL: 100,
} as const;

/**
 * Focus management delays (milliseconds)
 */
export const FOCUS_DELAYS = {
  /** Delay before restoring focus */
  RESTORE: 0,
  /** Delay before setting focus after dropdown opens */
  DROPDOWN: 0,
} as const;
