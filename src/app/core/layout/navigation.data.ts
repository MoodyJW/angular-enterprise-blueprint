/**
 * Navigation item interface for data-driven navigation.
 */
export interface NavItem {
  /** Display label for the navigation link */
  label: string;
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
  { label: 'Dashboard', route: '/' },
  { label: 'Modules', route: '/modules' },
  { label: 'Architecture', route: '/architecture' },
  { label: 'The Architect', route: '/profile' },
] as const;

/**
 * Footer navigation items (if needed for secondary navigation).
 */
export const FOOTER_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Contact', route: '/contact' },
] as const;
