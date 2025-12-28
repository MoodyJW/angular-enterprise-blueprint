/**
 * Navigation item interface for data-driven navigation.
 */
export interface NavItem {
  /** Translation key for the navigation link label */
  labelKey: string;
  /** Router path */
  route: string;
  /** Optional icon name (for icon components) */
  icon?: string;
  /** Whether this route requires authentication */
  requiresAuth?: boolean;
}

/**
 * Primary navigation items for the application header.
 *
 * These items are rendered in the main navigation bar and
 * drive the routing behavior across the app.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: 'nav.home', route: '/' },
  { labelKey: 'nav.modules', route: '/modules' },
  { labelKey: 'nav.architecture', route: '/architecture' },
  { labelKey: 'nav.profile', route: '/profile' },
  { labelKey: 'nav.contact', route: '/contact' },
] as const;

/**
 * Footer navigation items (if needed for secondary navigation).
 */
export const FOOTER_NAV_ITEMS: readonly NavItem[] = [
  { labelKey: 'nav.contact', route: '/contact' },
] as const;
