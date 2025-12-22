import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import { CardComponent } from './card.component';

const meta: Meta<CardComponent> = {
  title: 'Shared/Card',
  component: CardComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'filled'],
      description: 'Visual variant of the card',
      table: {
        type: { summary: 'CardVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding size for card sections',
      table: {
        type: { summary: 'CardPadding' },
        defaultValue: { summary: 'md' },
      },
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the entire card is clickable',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hoverable: {
      control: 'boolean',
      description: 'Whether the card shows hover effects',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the card takes full width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the card (recommended for clickable cards)',
    },
    ariaLabelledBy: {
      control: 'text',
      description: 'ID of element that labels the card',
    },
    ariaDescribedBy: {
      control: 'text',
      description: 'ID of element that describes the card',
    },
    role: {
      control: 'text',
      description: 'ARIA role override',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Flexible card component with content projection slots for header, media, body, and footer. Follows WCAG 2.1 AAA guidelines and integrates with the theme system.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'region',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<CardComponent>;

// Default Card
export const Default: Story = {
  render: () => ({
    template: `
      <eb-card variant="default" padding="md">
        <div card-header>
          <h3 class="card__header-title">Card Title</h3>
          <p class="card__header-subtitle">Card subtitle</p>
        </div>
        <div card-body>
          <p>This is the main content of the card. It can contain any HTML content including text, images, and other components.</p>
        </div>
        <div card-footer>
          <div class="card__footer-actions">
            <eb-button variant="secondary" ariaLabel="Cancel action">Cancel</eb-button>
            <eb-button variant="primary" ariaLabel="Confirm action">Confirm</eb-button>
          </div>
        </div>
      </eb-card>
    `,
  }),
};

// All Variants
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
        <eb-card variant="default">
          <div card-header>
            <h4 class="card__header-title">Default</h4>
          </div>
          <div card-body>
            <p>Standard card with subtle elevation</p>
          </div>
        </eb-card>

        <eb-card variant="elevated">
          <div card-header>
            <h4 class="card__header-title">Elevated</h4>
          </div>
          <div card-body>
            <p>Prominent card with stronger shadow</p>
          </div>
        </eb-card>

        <eb-card variant="outlined">
          <div card-header>
            <h4 class="card__header-title">Outlined</h4>
          </div>
          <div card-body>
            <p>Flat card with defined border</p>
          </div>
        </eb-card>

        <eb-card variant="filled">
          <div card-header>
            <h4 class="card__header-title">Filled</h4>
          </div>
          <div card-body>
            <p>Card with colored background</p>
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All card variants displayed together: default, elevated, outlined, and filled.',
      },
    },
  },
};

// Padding Options
export const PaddingOptions: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem;">
        <eb-card variant="outlined" padding="none">
          <div card-body style="padding: 1rem; background: var(--color-surface-hover);">
            <strong>None</strong><br>
            No padding (0)
          </div>
        </eb-card>

        <eb-card variant="outlined" padding="sm">
          <div card-body>
            <strong>Small</strong><br>
            12px padding
          </div>
        </eb-card>

        <eb-card variant="outlined" padding="md">
          <div card-body>
            <strong>Medium (Default)</strong><br>
            24px body padding
          </div>
        </eb-card>

        <eb-card variant="outlined" padding="lg">
          <div card-body>
            <strong>Large</strong><br>
            32px body padding
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different padding sizes: none, sm (12px), md (24px body, default), lg (32px body).',
      },
    },
  },
};

// Clickable Card
export const ClickableCard: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <eb-card
          variant="elevated"
          [clickable]="true"
          ariaLabel="View project details"
        >
          <div card-header>
            <h3 class="card__header-title">Clickable Card</h3>
            <p class="card__header-subtitle">Click anywhere to activate</p>
          </div>
          <div card-body>
            <p>This entire card is clickable and keyboard accessible. Try clicking it or navigating with Tab and pressing Enter.</p>
          </div>
          <div card-footer>
            <span style="font-size: 14px; color: var(--color-text-secondary);">Click to view details →</span>
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Clickable card that emits click events. The entire card is interactive and keyboard accessible.',
      },
    },
  },
};

// With Media
export const WithMedia: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <eb-card variant="default" padding="md">
          <div card-media class="card__media--aspect-16-9">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop"
              alt="Laptop with code"
              class="card__media-img"
            >
          </div>
          <div card-header>
            <h3 class="card__header-title">Project Title</h3>
            <p class="card__header-subtitle">Web Development</p>
          </div>
          <div card-body>
            <p>A modern web application built with Angular and TypeScript.</p>
          </div>
          <div card-footer>
            <div class="card__tags">
              <span class="card__tag">Angular</span>
              <span class="card__tag">TypeScript</span>
              <span class="card__tag">SCSS</span>
            </div>
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Card with media section showing an image. Uses aspect ratio helper class for consistent sizing.',
      },
    },
  },
};

// Without Header
export const WithoutHeader: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <eb-card variant="outlined">
          <div card-body>
            <p>This card has no header section, just body and footer content.</p>
          </div>
          <div card-footer>
            <div class="card__footer-actions">
              <eb-button variant="primary" ariaLabel="Take action">Action</eb-button>
            </div>
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Card without header - demonstrates flexible slot usage.',
      },
    },
  },
};

// Without Footer
export const WithoutFooter: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <eb-card variant="elevated">
          <div card-header>
            <h3 class="card__header-title">No Footer Card</h3>
          </div>
          <div card-body>
            <p>This card demonstrates content without a footer section. The card automatically adjusts its layout.</p>
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Card without footer section.',
      },
    },
  },
};

// Minimal (Body Only)
export const Minimal: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <eb-card variant="filled" padding="lg">
          <div card-body>
            <h4 style="margin-top: 0;">Minimal Card</h4>
            <p>This card only has body content, showing the most minimal card configuration.</p>
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Minimal card with only body content.',
      },
    },
  },
};

// Project Card Example
export const ProjectCardExample: Story = {
  render: () => ({
    template: `
      <div style="max-width: 380px;">
        <eb-card
          variant="elevated"
          [clickable]="true"
          ariaLabel="View Portfolio Website project"
        >
          <div card-media class="card__media--aspect-16-9">
            <img
              src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=450&fit=crop"
              alt="Portfolio website preview"
              class="card__media-img"
            >
          </div>
          <div card-header>
            <h3 class="card__header-title">Portfolio Website</h3>
            <p class="card__header-subtitle">Personal Project • 2025</p>
          </div>
          <div card-body>
            <p>A modern portfolio website showcasing projects and case studies with a custom design system.</p>
          </div>
          <div card-footer>
            <div class="card__tags">
              <span class="card__tag">Angular</span>
              <span class="card__tag">TypeScript</span>
              <span class="card__tag">SCSS</span>
              <span class="card__tag">Vitest</span>
            </div>
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: Project card for portfolio/case studies section.',
      },
    },
  },
};

// Blog Post Card Example
export const BlogPostCardExample: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px;">
        <eb-card
          variant="outlined"
          [clickable]="true"
          ariaLabel="Read article about Angular signals"
        >
          <div card-header>
            <h3 class="card__header-title">Understanding Angular Signals</h3>
            <p class="card__header-subtitle">
              <time datetime="2025-11-25">November 25, 2025</time> • 8 min read
            </p>
          </div>
          <div card-body>
            <p>Learn how Angular Signals provide fine-grained reactivity and improve application performance with automatic dependency tracking.</p>
          </div>
          <div card-footer style="display: flex; justify-content: space-between; align-items: center;">
            <div class="card__tags">
              <span class="card__tag">Angular</span>
              <span class="card__tag">Signals</span>
            </div>
            <span style="font-size: 14px; color: var(--color-text-secondary);">Read more →</span>
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: Blog post card with metadata and tags.',
      },
    },
  },
};

// Stat Card Example
export const StatCardExample: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
        <eb-card variant="filled" padding="lg">
          <div card-body style="text-align: center;">
            <h4 style="margin: 0; font-size: 2rem; font-weight: bold; color: var(--color-primary);">1,234</h4>
            <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: var(--color-text-secondary);">Total Views</p>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--color-success);">+12.5%</p>
          </div>
        </eb-card>

        <eb-card variant="filled" padding="lg">
          <div card-body style="text-align: center;">
            <h4 style="margin: 0; font-size: 2rem; font-weight: bold; color: var(--color-primary);">42</h4>
            <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: var(--color-text-secondary);">Projects</p>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--color-success);">+3 this month</p>
          </div>
        </eb-card>

        <eb-card variant="filled" padding="lg">
          <div card-body style="text-align: center;">
            <h4 style="margin: 0; font-size: 2rem; font-weight: bold; color: var(--color-primary);">98%</h4>
            <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: var(--color-text-secondary);">Test Coverage</p>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--color-success);">+2%</p>
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: Dashboard stat cards displaying metrics.',
      },
    },
  },
};

// Interactive Demo
export const Interactive: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    clickable: false,
    hoverable: true,
    fullWidth: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-card ${argsToTemplate(args)}>
        <div card-header>
          <h3 class="card__header-title">Interactive Card</h3>
          <p class="card__header-subtitle">Customize using controls below</p>
        </div>
        <div card-body>
          <p>Use the controls panel below to customize this card's appearance and behavior.</p>
        </div>
        <div card-footer>
          <div class="card__footer-actions">
            <eb-button variant="secondary" ariaLabel="Secondary action">Secondary</eb-button>
            <eb-button variant="primary" ariaLabel="Primary action">Primary</eb-button>
          </div>
        </div>
      </eb-card>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive card - use the controls below to customize all properties.',
      },
    },
  },
};

// Keyboard Navigation
export const KeyboardNavigation: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 600px;">
        <p style="font-size: 14px; color: var(--color-text-secondary);">
          <strong>Keyboard Navigation:</strong><br>
          • Press Tab to focus on clickable cards<br>
          • Press Enter or Space to activate<br>
          • Focus ring visible on keyboard navigation
        </p>

        <eb-card variant="outlined" [clickable]="true" ariaLabel="First card">
          <div card-body>
            <strong>First Clickable Card</strong><br>
            Tab to focus, Enter/Space to activate
          </div>
        </eb-card>

        <eb-card variant="outlined" [clickable]="true" ariaLabel="Second card">
          <div card-body>
            <strong>Second Clickable Card</strong><br>
            Fully keyboard accessible
          </div>
        </eb-card>

        <eb-card variant="outlined" [clickable]="true" ariaLabel="Third card">
          <div card-body>
            <strong>Third Clickable Card</strong><br>
            WCAG 2.1 AAA compliant
          </div>
        </eb-card>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation support for clickable cards.',
      },
    },
  },
};

// Accessibility Notes
export const AccessibilityNotes: Story = {
  render: () => ({
    template: `
      <div style="max-width: 700px; padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
        <h3 style="margin-top: 0;">WCAG 2.1 AAA Compliance</h3>

        <h4>Semantic HTML</h4>
        <ul style="font-size: 14px;">
          <li>Uses <code>&lt;article&gt;</code> element for card container</li>
          <li><code>&lt;header&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;footer&gt;</code> for sections</li>
          <li>Proper heading hierarchy in content</li>
        </ul>

        <h4>ARIA Support</h4>
        <ul style="font-size: 14px;">
          <li><code>role="article"</code> for non-clickable cards</li>
          <li><code>role="button"</code> for clickable cards</li>
          <li><code>aria-label</code> for clickable cards without visible text</li>
          <li><code>aria-labelledby</code> to link card title</li>
          <li><code>aria-describedby</code> for additional description</li>
          <li><code>tabindex="0"</code> for clickable cards</li>
        </ul>

        <h4>Keyboard Navigation</h4>
        <ul style="font-size: 14px;">
          <li>Tab: Focus on clickable cards</li>
          <li>Enter/Space: Activate clickable cards</li>
          <li>Visible focus indicator (2px outline)</li>
          <li>Focus only shown on keyboard navigation, not mouse clicks</li>
        </ul>

        <h4>Content Projection</h4>
        <ul style="font-size: 14px;">
          <li>Flexible slot-based architecture</li>
          <li>Empty slots automatically hidden</li>
          <li>Header, media, body, footer sections</li>
        </ul>

        <h4>Color Contrast</h4>
        <p style="font-size: 14px;">All variants meet WCAG AAA (7:1 for text, 3:1 for UI components)</p>

        <h4>Reduced Motion</h4>
        <p style="font-size: 14px;">Respects <code>prefers-reduced-motion</code> - disables transitions and transforms</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive accessibility features built into the card component.',
      },
    },
  },
};
