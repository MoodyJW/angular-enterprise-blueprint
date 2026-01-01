import { provideRouter } from '@angular/router';

import type { Meta, StoryObj } from '@storybook/angular';

import type { BreadcrumbItem } from './breadcrumb.component';
import { BreadcrumbComponent } from './breadcrumb.component';

const meta: Meta<BreadcrumbComponent> = {
  title: 'Shared/Breadcrumb',
  component: BreadcrumbComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      applicationConfig: {
        providers: [provideRouter([])],
      },
    }),
  ],
  argTypes: {
    items: {
      description: 'Array of breadcrumb items to display',
      control: 'object',
    },
    variant: {
      description: 'Visual variant of the breadcrumb separators',
      control: 'select',
      options: ['default', 'slash', 'chevron', 'arrow'],
    },
    size: {
      description: 'Size of the breadcrumb text and icons',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showIcons: {
      description: 'Whether to show icons for items that have them',
      control: 'boolean',
    },
    maxItems: {
      description: 'Maximum number of items to show before collapsing (0 = no limit)',
      control: 'number',
    },
    ariaLabel: {
      description: 'ARIA label for the breadcrumb navigation',
      control: 'text',
    },
    itemClicked: {
      description: 'Emitted when a breadcrumb item is clicked',
      action: 'itemClicked',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
The Breadcrumb component provides accessible navigation showing the user's current location in the site hierarchy.

## Features
- **Accessible**: Follows WAI-ARIA breadcrumb pattern with proper semantic HTML
- **Keyboard Navigation**: Full keyboard support with focus management
- **Responsive**: Works on all screen sizes with mobile-optimized spacing
- **Themeable**: Integrates with the design system's color and spacing tokens
- **Variants**: Multiple separator styles (default, slash, chevron, arrow)
- **Icons**: Optional icons for each breadcrumb item
- **Collapsing**: Automatic ellipsis for long breadcrumb trails
- **Routing**: Full Angular Router integration with query params and fragments

## Accessibility
- Uses semantic \`<nav>\` and \`<ol>\` elements
- Proper ARIA labels (\`aria-label\`, \`aria-current\`)
- Separators marked with \`aria-hidden\` so screen readers don't announce them
- Current page properly marked with \`aria-current="page"\`
- Focus indicators meet WCAG AAA contrast requirements
- Keyboard navigable links with visible focus states

## Best Practices
1. Always provide an \`ariaLabel\` that describes the navigation
2. Mark the current page with \`current: true\` (no route needed)
3. Use icons sparingly - only when they add clarity
4. Consider using \`maxItems\` for very deep navigation hierarchies
5. Test with keyboard navigation and screen readers
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<BreadcrumbComponent>;

// Sample breadcrumb items
const basicItems: BreadcrumbItem[] = [
  { label: 'Home', route: '/' },
  { label: 'Projects', route: '/projects' },
  { label: 'Project Detail', current: true },
];

const itemsWithIcons: BreadcrumbItem[] = [
  { label: 'Home', route: '/', icon: 'heroHome' },
  { label: 'Projects', route: '/projects', icon: 'heroFolder' },
  { label: 'Angular', route: '/projects/angular', icon: 'heroCodeBracket' },
  { label: 'Portfolio', current: true, icon: 'heroDocument' },
];

const deepHierarchy: BreadcrumbItem[] = [
  { label: 'Home', route: '/' },
  { label: 'Documentation', route: '/docs' },
  { label: 'Components', route: '/docs/components' },
  { label: 'Navigation', route: '/docs/components/navigation' },
  { label: 'Breadcrumb', route: '/docs/components/navigation/breadcrumb' },
  { label: 'Examples', current: true },
];

const itemsWithQueryParams: BreadcrumbItem[] = [
  { label: 'Home', route: '/' },
  { label: 'Search', route: '/search', queryParams: { q: 'angular' } },
  { label: 'Results', current: true },
];

/**
 * Default breadcrumb with basic navigation trail
 */
export const Default: Story = {
  args: {
    items: basicItems,
    variant: 'default',
    size: 'md',
    showIcons: true,
    maxItems: 0,
    ariaLabel: 'Breadcrumb',
  },
};

/**
 * Breadcrumb with icons for each item
 */
export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    variant: 'default',
    size: 'md',
    showIcons: true,
    ariaLabel: 'Page navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icons help users quickly identify different sections of the navigation hierarchy.',
      },
    },
  },
};

/**
 * Breadcrumb without icons
 */
export const WithoutIcons: Story = {
  args: {
    items: itemsWithIcons,
    variant: 'default',
    size: 'md',
    showIcons: false,
    ariaLabel: 'Breadcrumb',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icons can be hidden even when items have icon properties defined.',
      },
    },
  },
};

/**
 * Slash separator variant (/)
 */
export const SlashVariant: Story = {
  args: {
    items: basicItems,
    variant: 'slash',
    size: 'md',
    showIcons: true,
    ariaLabel: 'Breadcrumb',
  },
  parameters: {
    docs: {
      description: {
        story: 'Classic slash separator style, familiar from Unix file paths.',
      },
    },
  },
};

/**
 * Chevron separator variant with icons
 */
export const ChevronVariant: Story = {
  args: {
    items: basicItems,
    variant: 'chevron',
    size: 'md',
    showIcons: true,
    ariaLabel: 'Breadcrumb',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modern chevron icon separators provide clear visual hierarchy.',
      },
    },
  },
};

/**
 * Arrow separator variant
 */
export const ArrowVariant: Story = {
  args: {
    items: basicItems,
    variant: 'arrow',
    size: 'md',
    showIcons: true,
    ariaLabel: 'Breadcrumb',
  },
  parameters: {
    docs: {
      description: {
        story: 'Arrow separators emphasize forward navigation flow.',
      },
    },
  },
};

/**
 * Small size variant
 */
export const SmallSize: Story = {
  args: {
    items: itemsWithIcons,
    variant: 'chevron',
    size: 'sm',
    showIcons: true,
    ariaLabel: 'Breadcrumb',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact breadcrumb suitable for tight layouts or secondary navigation.',
      },
    },
  },
};

/**
 * Large size variant
 */
export const LargeSize: Story = {
  args: {
    items: itemsWithIcons,
    variant: 'chevron',
    size: 'lg',
    showIcons: true,
    ariaLabel: 'Breadcrumb',
  },
  parameters: {
    docs: {
      description: {
        story: 'Larger breadcrumb for improved readability and touch targets.',
      },
    },
  },
};

/**
 * Deep navigation hierarchy
 */
export const DeepHierarchy: Story = {
  args: {
    items: deepHierarchy,
    variant: 'chevron',
    size: 'md',
    showIcons: false,
    ariaLabel: 'Documentation navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumb handles deep navigation hierarchies with multiple levels.',
      },
    },
  },
};

/**
 * Collapsed breadcrumb with ellipsis (maxItems)
 */
export const CollapsedWithEllipsis: Story = {
  args: {
    items: deepHierarchy,
    variant: 'chevron',
    size: 'md',
    showIcons: false,
    maxItems: 4,
    ariaLabel: 'Documentation navigation',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Long breadcrumb trails can be collapsed using `maxItems`. First and last items are always shown, with middle items replaced by an ellipsis.',
      },
    },
  },
};

/**
 * Single item breadcrumb
 */
export const SingleItem: Story = {
  args: {
    items: [{ label: 'Home', current: true, icon: 'heroHome' }],
    variant: 'default',
    size: 'md',
    showIcons: true,
    ariaLabel: 'Breadcrumb',
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumb gracefully handles a single item (typically the home page).',
      },
    },
  },
};

/**
 * Two items breadcrumb
 */
export const TwoItems: Story = {
  args: {
    items: [
      { label: 'Home', route: '/', icon: 'heroHome' },
      { label: 'About', current: true },
    ],
    variant: 'chevron',
    size: 'md',
    showIcons: true,
    ariaLabel: 'Breadcrumb',
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple two-level navigation.',
      },
    },
  },
};

/**
 * With query parameters
 */
export const WithQueryParams: Story = {
  args: {
    items: itemsWithQueryParams,
    variant: 'slash',
    size: 'md',
    showIcons: false,
    ariaLabel: 'Search navigation',
  },
  parameters: {
    docs: {
      description: {
        story: 'Breadcrumb items can include query parameters and fragments for complex routing.',
      },
    },
  },
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => ({
    props: {
      items: basicItems,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3 style="margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600;">Default</h3>
          <eb-breadcrumb [items]="items" variant="default" ariaLabel="Default variant" />
        </div>
        <div>
          <h3 style="margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600;">Slash</h3>
          <eb-breadcrumb [items]="items" variant="slash" ariaLabel="Slash variant" />
        </div>
        <div>
          <h3 style="margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600;">Chevron</h3>
          <eb-breadcrumb [items]="items" variant="chevron" ariaLabel="Chevron variant" />
        </div>
        <div>
          <h3 style="margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600;">Arrow</h3>
          <eb-breadcrumb [items]="items" variant="arrow" ariaLabel="Arrow variant" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of all available separator variants.',
      },
    },
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => ({
    props: {
      items: itemsWithIcons,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3 style="margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #4d4d4d;">Small</h3>
          <eb-breadcrumb [items]="items" variant="chevron" size="sm" ariaLabel="Small size" />
        </div>
        <div>
          <h3 style="margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #4d4d4d;">Medium (Default)</h3>
          <eb-breadcrumb [items]="items" variant="chevron" size="md" ariaLabel="Medium size" />
        </div>
        <div>
          <h3 style="margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #4d4d4d;">Large</h3>
          <eb-breadcrumb [items]="items" variant="chevron" size="lg" ariaLabel="Large size" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of all available sizes.',
      },
    },
  },
};

/**
 * Responsive behavior demonstration
 */
export const ResponsiveBehavior: Story = {
  args: {
    items: deepHierarchy,
    variant: 'chevron',
    size: 'md',
    showIcons: false,
    maxItems: 0,
    ariaLabel: 'Responsive breadcrumb',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Breadcrumb wraps to multiple lines on smaller screens. Try resizing your browser or view on mobile.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Keyboard navigation demo
 */
export const KeyboardNavigation: Story = {
  args: {
    items: itemsWithIcons,
    variant: 'chevron',
    size: 'md',
    showIcons: true,
    ariaLabel: 'Keyboard navigation demo',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Breadcrumb links are fully keyboard accessible. Use Tab to navigate between links, and Enter to activate. Focus indicators meet WCAG AAA contrast requirements.',
      },
    },
  },
};
