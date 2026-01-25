/**
 * Navigation item interface for data-driven navigation.
 */
export interface NavItem {
  /** Translation key for the navigation link label */
  labelKey: string;
  /** Router path (optional for dropdown parents) */
  route?: string;
  /** Optional icon name (for icon components) */
  icon?: string;
  /** Whether this route requires authentication */
  requiresAuth?: boolean;
  /** Whether this is an external link (opens in new tab) */
  external?: boolean;
  /** Child navigation items for dropdown menus */
  children?: NavItem[];
}

/**
 * Primary navigation items for the application header.
 *
 * These items are rendered in the main navigation bar and
 * drive the routing behavior across the app.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: 'nav.home', route: '/' },
  { labelKey: 'nav.blog', route: '/blog' },
  { labelKey: 'nav.profile', route: '/profile' },
  { labelKey: 'nav.contact', route: '/contact' },
  {
    labelKey: 'nav.resources',
    children: [
      { labelKey: 'nav.modules', route: '/modules' },
      { labelKey: 'nav.architecture', route: '/architecture' },
      {
        labelKey: 'nav.storybook',
        route: 'angular-enterprise-blueprint/storybook',
        external: true,
      },
      { labelKey: 'nav.docs', route: 'angular-enterprise-blueprint/docs', external: true },
    ],
  },
] as const;

/**
 * Footer navigation items (if needed for secondary navigation).
 */
export const FOOTER_NAV_ITEMS: readonly NavItem[] = [
  { labelKey: 'nav.contact', route: '/contact' },
] as const;
