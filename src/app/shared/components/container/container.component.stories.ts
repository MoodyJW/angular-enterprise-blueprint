import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import { ContainerComponent } from './container.component';

const meta: Meta<ContainerComponent> = {
  title: 'Shared/Container',
  component: ContainerComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Maximum width constraint for the container',
      table: {
        type: { summary: 'ContainerMaxWidth' },
        defaultValue: { summary: 'lg' },
      },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Horizontal padding size',
      table: {
        type: { summary: 'ContainerPadding' },
        defaultValue: { summary: 'md' },
      },
    },
    centerContent: {
      control: 'boolean',
      description: 'Whether content should be centered horizontally',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    role: {
      control: 'text',
      description: 'ARIA role for the container',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'region' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the container (recommended when using role="region")',
    },
    ariaLabelledBy: {
      control: 'text',
      description: 'ID of element that labels the container',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Container component for consistent content width management and centering. Provides standardized max-width variants and padding options for layout consistency across the application.',
      },
    },
    a11y: {
      config: {
        rules: [
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
type Story = StoryObj<ContainerComponent>;

// Default Container
export const Default: Story = {
  render: () => ({
    template: `
      <eb-container maxWidth="lg" padding="md">
        <div style="padding: 2rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
          <h2 style="margin-top: 0;">Default Container</h2>
          <p>This is the default container with lg max-width (1200px) and md padding (16px). Perfect for standard page content.</p>
        </div>
      </eb-container>
    `,
  }),
};

// All Max-Width Variants
export const AllMaxWidthVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <eb-container maxWidth="sm" padding="md">
          <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
            <h3 style="margin-top: 0;">Small (600px)</h3>
            <p style="font-size: 14px; color: var(--color-text-secondary);">Best for narrow content like forms and login pages</p>
          </div>
        </eb-container>

        <eb-container maxWidth="md" padding="md">
          <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
            <h3 style="margin-top: 0;">Medium (900px)</h3>
            <p style="font-size: 14px; color: var(--color-text-secondary);">Ideal for articles, blog posts, and documentation</p>
          </div>
        </eb-container>

        <eb-container maxWidth="lg" padding="md">
          <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
            <h3 style="margin-top: 0;">Large (1200px) - Default</h3>
            <p style="font-size: 14px; color: var(--color-text-secondary);">Standard page content width matching design system</p>
          </div>
        </eb-container>

        <eb-container maxWidth="xl" padding="md">
          <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
            <h3 style="margin-top: 0;">Extra Large (1400px)</h3>
            <p style="font-size: 14px; color: var(--color-text-secondary);">Wide layouts for dashboards and data tables</p>
          </div>
        </eb-container>

        <eb-container maxWidth="full" padding="md">
          <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
            <h3 style="margin-top: 0;">Full Width (100%)</h3>
            <p style="font-size: 14px; color: var(--color-text-secondary);">No width constraint - spans full viewport</p>
          </div>
        </eb-container>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'All max-width variants: sm (600px), md (900px), lg (1200px), xl (1400px), and full (100%).',
      },
    },
  },
};

// Padding Options
export const PaddingOptions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <eb-container maxWidth="md" padding="none">
          <div style="padding: 1rem; background: var(--color-surface); border: 2px dashed var(--color-border);">
            <strong>None</strong> - No horizontal padding
          </div>
        </eb-container>

        <eb-container maxWidth="md" padding="sm">
          <div style="padding: 1rem; background: var(--color-surface); border: 2px dashed var(--color-border);">
            <strong>Small</strong> - 12px padding (8px on mobile)
          </div>
        </eb-container>

        <eb-container maxWidth="md" padding="md">
          <div style="padding: 1rem; background: var(--color-surface); border: 2px dashed var(--color-border);">
            <strong>Medium (Default)</strong> - 16px padding (12px on mobile)
          </div>
        </eb-container>

        <eb-container maxWidth="md" padding="lg">
          <div style="padding: 1rem; background: var(--color-surface); border: 2px dashed var(--color-border);">
            <strong>Large</strong> - 24px padding (16px on mobile)
          </div>
        </eb-container>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different padding sizes with responsive adjustments for mobile devices.',
      },
    },
  },
};

// Centered vs Non-Centered
export const CenteringOptions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3 style="margin-bottom: 0.5rem;">Centered (Default)</h3>
          <eb-container maxWidth="md" padding="md" [centerContent]="true">
            <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
              <p style="margin: 0;">Container is horizontally centered with margin: 0 auto</p>
            </div>
          </eb-container>
        </div>

        <div>
          <h3 style="margin-bottom: 0.5rem;">Not Centered</h3>
          <eb-container maxWidth="md" padding="md" [centerContent]="false">
            <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
              <p style="margin: 0;">Container aligns to the left without auto margins</p>
            </div>
          </eb-container>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Compare centered vs non-centered container alignment.',
      },
    },
  },
};

// Page Layout Example
export const PageLayoutExample: Story = {
  render: () => ({
    template: `
      <div style="min-height: 100vh; display: flex; flex-direction: column;">
        <!-- Hero Section - Full width -->
        <section style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%); color: white; padding: 4rem 0;">
          <eb-container maxWidth="lg" padding="lg">
            <h1 style="font-size: 3rem; margin: 0 0 1rem 0;">Hero Section</h1>
            <p style="font-size: 1.25rem; margin: 0; opacity: 0.95;">Full-width background with contained content (lg)</p>
          </eb-container>
        </section>

        <!-- Main Content - Standard width -->
        <main style="flex: 1; padding: 3rem 0;">
          <eb-container maxWidth="lg" padding="md">
            <h2>Main Content Area</h2>
            <p>This is the main content area using the standard lg container (1200px). Most page content will use this width for consistency.</p>

            <div style="margin-top: 2rem; padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
              <h3 style="margin-top: 0;">Content Card</h3>
              <p style="margin-bottom: 0;">Standard content width ensures readability and visual hierarchy.</p>
            </div>
          </eb-container>
        </main>

        <!-- Footer - Full width background -->
        <footer style="background: var(--color-surface); padding: 2rem 0; margin-top: auto;">
          <eb-container maxWidth="lg" padding="md">
            <p style="margin: 0; text-align: center; color: var(--color-text-secondary); font-size: 14px;">
              Footer content contained within lg container
            </p>
          </eb-container>
        </footer>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: Full page layout with hero, main content, and footer sections.',
      },
    },
  },
};

// Narrow Content Example
export const NarrowContentExample: Story = {
  render: () => ({
    template: `
      <eb-container maxWidth="sm" padding="lg">
        <div style="padding: 2rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
          <h2 style="margin-top: 0; text-align: center;">Login Form</h2>

          <form style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
              <input type="email" placeholder="you@example.com" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--border-radius-md); font-size: 1rem;" />
            </div>

            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Password</label>
              <input type="password" placeholder="••••••••" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--border-radius-md); font-size: 1rem;" />
            </div>

            <button type="submit" style="margin-top: 0.5rem; padding: 0.75rem; background: var(--color-primary); color: white; border: none; border-radius: var(--border-radius-md); font-size: 1rem; font-weight: 500; cursor: pointer;">
              Sign In
            </button>
          </form>
        </div>
      </eb-container>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world example: Login form using sm container (600px) for narrow, focused content.',
      },
    },
  },
};

// Article Content Example
export const ArticleContentExample: Story = {
  render: () => ({
    template: `
      <eb-container maxWidth="md" padding="md">
        <article style="line-height: 1.7;">
          <header style="margin-bottom: 2rem;">
            <h1 style="font-size: 2.5rem; margin: 0 0 0.5rem 0;">Understanding Angular Signals</h1>
            <p style="color: var(--color-text-secondary); font-size: 0.95rem; margin: 0;">
              <time datetime="2025-11-25">November 25, 2025</time> • 8 min read
            </p>
          </header>

          <div style="padding: 1rem; background: var(--color-surface); border-left: 4px solid var(--color-primary); margin-bottom: 1.5rem;">
            <p style="margin: 0; font-style: italic;">
              This article explores how Angular Signals provide fine-grained reactivity and improve application performance.
            </p>
          </div>

          <p>Angular Signals represent a major shift in how we handle reactivity in Angular applications. Unlike traditional change detection, signals provide a more efficient way to track and propagate changes throughout your application.</p>

          <h2>What are Signals?</h2>
          <p>Signals are reactive primitives that notify consumers when their value changes. This allows Angular to precisely track dependencies and update only what's necessary.</p>

          <h2>Benefits</h2>
          <ul>
            <li>Fine-grained reactivity</li>
            <li>Improved performance</li>
            <li>Simpler mental model</li>
            <li>Better TypeScript integration</li>
          </ul>

          <div style="margin-top: 2rem; padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
            <strong>Pro Tip:</strong> Start using signals in new components to gradually modernize your codebase.
          </div>
        </article>
      </eb-container>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world example: Article/blog post content using md container (900px) for optimal reading width.',
      },
    },
  },
};

// Dashboard Layout Example
export const DashboardLayoutExample: Story = {
  render: () => ({
    template: `
      <eb-container maxWidth="xl" padding="lg">
        <header style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; margin: 0 0 0.5rem 0;">Analytics Dashboard</h1>
          <p style="margin: 0; color: var(--color-text-secondary);">Wide container (xl - 1400px) for data-dense layouts</p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
            <h3 style="margin: 0; font-size: 2rem; color: var(--color-primary);">1,234</h3>
            <p style="margin: 0.5rem 0 0; color: var(--color-text-secondary);">Total Views</p>
          </div>
          <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
            <h3 style="margin: 0; font-size: 2rem; color: var(--color-primary);">42</h3>
            <p style="margin: 0.5rem 0 0; color: var(--color-text-secondary);">Projects</p>
          </div>
          <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
            <h3 style="margin: 0; font-size: 2rem; color: var(--color-primary);">98%</h3>
            <p style="margin: 0.5rem 0 0; color: var(--color-text-secondary);">Coverage</p>
          </div>
          <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
            <h3 style="margin: 0; font-size: 2rem; color: var(--color-primary);">5.2s</h3>
            <p style="margin: 0.5rem 0 0; color: var(--color-text-secondary);">Avg Load Time</p>
          </div>
        </div>

        <div style="padding: 2rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
          <h2 style="margin-top: 0;">Recent Activity</h2>
          <p style="color: var(--color-text-secondary);">Wide layout allows for more complex data visualizations and tables.</p>
        </div>
      </eb-container>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world example: Dashboard layout using xl container (1400px) for data-dense interfaces.',
      },
    },
  },
};

// Nested Containers
export const NestedContainers: Story = {
  render: () => ({
    template: `
      <eb-container maxWidth="xl" padding="lg">
        <div style="padding: 2rem; background: var(--color-surface); border-radius: var(--border-radius-md); margin-bottom: 2rem;">
          <h2 style="margin-top: 0;">Outer Container (XL - 1400px)</h2>
          <p>This is the outer container with a wide layout.</p>

          <eb-container maxWidth="md" padding="md">
            <div style="padding: 1.5rem; background: var(--color-background); border: 2px dashed var(--color-border); border-radius: var(--border-radius-md);">
              <h3 style="margin-top: 0;">Nested Container (MD - 900px)</h3>
              <p style="margin-bottom: 0;">You can nest containers to create focused content areas within wider layouts. The nested container will be centered within the outer container.</p>
            </div>
          </eb-container>
        </div>
      </eb-container>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstration of nested containers for creating focused content areas within wider layouts.',
      },
    },
  },
};

// Interactive Demo
export const Interactive: Story = {
  args: {
    maxWidth: 'lg',
    padding: 'md',
    centerContent: true,
    ariaLabel: 'Interactive container demo',
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-container ${argsToTemplate(args)}>
        <div style="padding: 2rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
          <h2 style="margin-top: 0;">Interactive Container</h2>
          <p>Use the controls below to customize this container's width, padding, and centering behavior.</p>
          <div style="margin-top: 1.5rem; padding: 1rem; background: var(--color-background); border: 2px dashed var(--color-border); border-radius: var(--border-radius-md);">
            <p style="margin: 0; font-size: 14px; color: var(--color-text-secondary);">
              Current: <strong>{{ maxWidth }}</strong> max-width,
              <strong>{{ padding }}</strong> padding,
              <strong>{{ centerContent ? 'centered' : 'not centered' }}</strong>
            </p>
          </div>
        </div>
      </eb-container>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive container - use the controls below to customize all properties.',
      },
    },
  },
};

// Accessibility Notes
export const AccessibilityNotes: Story = {
  render: () => ({
    template: `
      <eb-container maxWidth="md" padding="lg">
        <div style="padding: 2rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
          <h3 style="margin-top: 0;">WCAG 2.1 AAA Compliance</h3>

          <h4>Semantic HTML</h4>
          <ul style="font-size: 14px;">
            <li>Uses semantic <code>&lt;div&gt;</code> element with ARIA roles</li>
            <li>Default <code>role="region"</code> for sectioning content</li>
            <li>Can be customized to <code>role="main"</code>, <code>role="complementary"</code>, etc.</li>
          </ul>

          <h4>ARIA Support</h4>
          <ul style="font-size: 14px;">
            <li><code>role="region"</code> by default for semantic sectioning</li>
            <li><code>aria-label</code> for identifying regions (recommended with role="region")</li>
            <li><code>aria-labelledby</code> to link to section headings</li>
            <li>Custom role support for different semantic contexts</li>
          </ul>

          <h4>Layout Considerations</h4>
          <ul style="font-size: 14px;">
            <li>Responsive padding that reduces on mobile devices</li>
            <li>Flexible width constraints for different content types</li>
            <li>Centering behavior can be disabled for specific layouts</li>
            <li>Works with screen readers by providing semantic structure</li>
          </ul>

          <h4>Best Practices</h4>
          <ul style="font-size: 14px;">
            <li>Use <code>sm</code> for narrow content (forms, focused content)</li>
            <li>Use <code>md</code> for readable text (articles, documentation)</li>
            <li>Use <code>lg</code> for standard pages (default, matches design system)</li>
            <li>Use <code>xl</code> for data-dense layouts (dashboards, tables)</li>
            <li>Use <code>full</code> for full-bleed sections (heroes, images)</li>
          </ul>

          <h4>Responsive Design</h4>
          <p style="font-size: 14px;">Padding automatically adjusts on mobile (≤768px):</p>
          <ul style="font-size: 14px;">
            <li>sm: 12px → 8px</li>
            <li>md: 16px → 12px</li>
            <li>lg: 24px → 16px</li>
          </ul>
        </div>
      </eb-container>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive accessibility features and best practices for using the container component.',
      },
    },
  },
};
