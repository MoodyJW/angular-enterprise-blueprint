import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import { GridComponent } from './grid.component';

const meta: Meta<GridComponent> = {
  title: 'Shared/Grid',
  component: GridComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    cols: {
      control: 'select',
      options: [1, 2, 3, 4, 6, 12, 'auto'],
      description: 'Number of columns (mobile-first)',
      table: {
        type: { summary: 'GridColumns' },
        defaultValue: { summary: '1' },
      },
    },
    colsMd: {
      control: 'select',
      options: [undefined, 1, 2, 3, 4, 6, 12, 'auto'],
      description: 'Number of columns at tablet breakpoint (≥768px)',
      table: {
        type: { summary: 'GridColumns | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    colsLg: {
      control: 'select',
      options: [undefined, 1, 2, 3, 4, 6, 12, 'auto'],
      description: 'Number of columns at desktop breakpoint (≥1024px)',
      table: {
        type: { summary: 'GridColumns | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    colsXl: {
      control: 'select',
      options: [undefined, 1, 2, 3, 4, 6, 12, 'auto'],
      description: 'Number of columns at large desktop breakpoint (≥1280px)',
      table: {
        type: { summary: 'GridColumns | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Gap spacing between grid items',
      table: {
        type: { summary: 'GridGap' },
        defaultValue: { summary: 'md' },
      },
    },
    gapX: {
      control: 'select',
      options: [undefined, 'none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Horizontal gap spacing (overrides gap)',
      table: {
        type: { summary: 'GridGap | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    gapY: {
      control: 'select',
      options: [undefined, 'none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Vertical gap spacing (overrides gap)',
      table: {
        type: { summary: 'GridGap | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    minColWidth: {
      control: 'text',
      description: 'Minimum column width for auto-fit columns',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '200px' },
      },
    },
    alignItems: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Vertical alignment of items',
      table: {
        type: { summary: 'GridAlign' },
        defaultValue: { summary: 'stretch' },
      },
    },
    justifyItems: {
      control: 'select',
      options: [
        undefined,
        'start',
        'center',
        'end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
      description: 'Horizontal distribution of items',
      table: {
        type: { summary: 'GridJustify | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether grid takes full width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    role: {
      control: 'text',
      description: 'ARIA role for the grid',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the grid',
    },
    ariaLabelledBy: {
      control: 'text',
      description: 'ID of element that labels the grid',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Responsive grid component for creating flexible layouts. Supports responsive column configurations, gap spacing, alignment options, and a 12-column system for precise control.',
      },
    },
    a11y: {
      config: {
        rules: [
          // Disabled: Grid is a layout utility component, not a page-level
          // landmark. Stories are isolated components without page context.
          { id: 'region', enabled: false },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj<GridComponent>;

// Helper function to create grid items
const createGridItem = (index: number, height = '80px'): string => `
  <div style="
    padding: 1rem;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    min-height: ${height};
  ">
    Item ${String(index)}
  </div>
`;

// Default Grid
export const Default: Story = {
  render: () => ({
    template: `
      <eb-grid [cols]="3" gap="md">
        ${Array.from({ length: 6 }, (_, i) => createGridItem(i + 1)).join('')}
      </eb-grid>
    `,
  }),
};

// Responsive Grid
export const ResponsiveGrid: Story = {
  render: () => ({
    template: `
      <div style="margin-bottom: 1rem;">
        <h3 style="margin: 0 0 0.5rem 0;">Responsive: 1 col → 2 cols → 3 cols → 4 cols</h3>
        <p style="margin: 0; font-size: 14px; color: var(--color-text-secondary);">
          Resize your browser to see the grid adapt: Mobile (1), Tablet (2), Desktop (3), Large (4)
        </p>
      </div>
      <eb-grid [cols]="1" [colsMd]="2" [colsLg]="3" [colsXl]="4" gap="lg">
        ${Array.from({ length: 8 }, (_, i) => createGridItem(i + 1)).join('')}
      </eb-grid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Grid that adapts to different screen sizes using responsive column configurations.',
      },
    },
  },
};

// All Column Variants
export const AllColumnVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">2 Columns</h4>
          <eb-grid [cols]="2" gap="md">
            ${Array.from({ length: 4 }, (_, i) => createGridItem(i + 1)).join('')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">3 Columns</h4>
          <eb-grid [cols]="3" gap="md">
            ${Array.from({ length: 6 }, (_, i) => createGridItem(i + 1)).join('')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">4 Columns</h4>
          <eb-grid [cols]="4" gap="md">
            ${Array.from({ length: 8 }, (_, i) => createGridItem(i + 1)).join('')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">6 Columns</h4>
          <eb-grid [cols]="6" gap="md">
            ${Array.from({ length: 6 }, (_, i) => createGridItem(i + 1, '60px')).join('')}
          </eb-grid>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different fixed column configurations: 2, 3, 4, and 6 columns.',
      },
    },
  },
};

// Auto-Fit Grid
export const AutoFitGrid: Story = {
  render: () => ({
    template: `
      <div style="margin-bottom: 1rem;">
        <h3 style="margin: 0 0 0.5rem 0;">Auto-Fit with 250px Minimum</h3>
        <p style="margin: 0; font-size: 14px; color: var(--color-text-secondary);">
          Grid automatically fits as many columns as possible while maintaining 250px minimum width
        </p>
      </div>
      <eb-grid cols="auto" [minColWidth]="'250px'" gap="lg">
        ${Array.from({ length: 9 }, (_, i) => createGridItem(i + 1)).join('')}
      </eb-grid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Auto-fit grid that automatically calculates columns based on available space and minimum width.',
      },
    },
  },
};

// Gap Spacing Variants
export const GapSpacingVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">No Gap</h4>
          <eb-grid [cols]="3" gap="none">
            ${Array.from({ length: 3 }, (_, i) => createGridItem(i + 1, '60px')).join('')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Small Gap (8px)</h4>
          <eb-grid [cols]="3" gap="sm">
            ${Array.from({ length: 3 }, (_, i) => createGridItem(i + 1, '60px')).join('')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Medium Gap (16px) - Default</h4>
          <eb-grid [cols]="3" gap="md">
            ${Array.from({ length: 3 }, (_, i) => createGridItem(i + 1, '60px')).join('')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Large Gap (24px)</h4>
          <eb-grid [cols]="3" gap="lg">
            ${Array.from({ length: 3 }, (_, i) => createGridItem(i + 1, '60px')).join('')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Extra Large Gap (32px)</h4>
          <eb-grid [cols]="3" gap="xl">
            ${Array.from({ length: 3 }, (_, i) => createGridItem(i + 1, '60px')).join('')}
          </eb-grid>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different gap spacing options from none to extra large.',
      },
    },
  },
};

// Directional Gaps
export const DirectionalGaps: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Large Horizontal Gap, Small Vertical Gap</h4>
          <eb-grid [cols]="3" [gapX]="'xl'" [gapY]="'sm'">
            ${Array.from({ length: 6 }, (_, i) => createGridItem(i + 1, '60px')).join('')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Small Horizontal Gap, Large Vertical Gap</h4>
          <eb-grid [cols]="3" [gapX]="'sm'" [gapY]="'xl'">
            ${Array.from({ length: 6 }, (_, i) => createGridItem(i + 1, '60px')).join('')}
          </eb-grid>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Independent control of horizontal (gapX) and vertical (gapY) spacing.',
      },
    },
  },
};

// Alignment Options
export const AlignmentOptions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align Start (Top)</h4>
          <eb-grid [cols]="3" gap="md" alignItems="start">
            ${createGridItem(1, '60px')}
            ${createGridItem(2, '100px')}
            ${createGridItem(3, '80px')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align Center (Vertical Center)</h4>
          <eb-grid [cols]="3" gap="md" alignItems="center">
            ${createGridItem(1, '60px')}
            ${createGridItem(2, '100px')}
            ${createGridItem(3, '80px')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align End (Bottom)</h4>
          <eb-grid [cols]="3" gap="md" alignItems="end">
            ${createGridItem(1, '60px')}
            ${createGridItem(2, '100px')}
            ${createGridItem(3, '80px')}
          </eb-grid>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align Stretch (Fill Height) - Default</h4>
          <eb-grid [cols]="3" gap="md" alignItems="stretch">
            ${createGridItem(1, '60px')}
            ${createGridItem(2, '100px')}
            ${createGridItem(3, '80px')}
          </eb-grid>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Vertical alignment options for items with varying heights.',
      },
    },
  },
};

// 12-Column System
export const TwelveColumnSystem: Story = {
  render: () => ({
    template: `
      <div style="margin-bottom: 1rem;">
        <h3 style="margin: 0 0 0.5rem 0;">12-Column Grid System</h3>
        <p style="margin: 0; font-size: 14px; color: var(--color-text-secondary);">
          Use .col-span-* classes for precise column control
        </p>
      </div>
      <eb-grid [cols]="12" gap="md">
        <div class="col-span-12" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          12 columns (full width)
        </div>
        <div class="col-span-6" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          6 columns (half)
        </div>
        <div class="col-span-6" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          6 columns (half)
        </div>
        <div class="col-span-4" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          4 columns
        </div>
        <div class="col-span-4" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          4 columns
        </div>
        <div class="col-span-4" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          4 columns
        </div>
        <div class="col-span-3" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          3 cols
        </div>
        <div class="col-span-3" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          3 cols
        </div>
        <div class="col-span-3" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          3 cols
        </div>
        <div class="col-span-3" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          3 cols
        </div>
        <div class="col-span-8" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          8 columns (main content)
        </div>
        <div class="col-span-4" style="padding: 1rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--border-radius-md); text-align: center;">
          4 columns (sidebar)
        </div>
      </eb-grid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Traditional 12-column grid system with .col-span-* utility classes for precise control.',
      },
    },
  },
};

// Card Grid Example
export const CardGridExample: Story = {
  render: () => ({
    template: `
      <eb-grid [cols]="1" [colsMd]="2" [colsLg]="3" gap="lg">
        <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
          <h3 style="margin: 0 0 0.5rem 0;">Project Alpha</h3>
          <p style="margin: 0 0 1rem 0; color: var(--color-text-secondary); font-size: 14px;">
            A modern web application built with Angular and TypeScript.
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">Angular</span>
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">TypeScript</span>
          </div>
        </div>

        <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
          <h3 style="margin: 0 0 0.5rem 0;">Project Beta</h3>
          <p style="margin: 0 0 1rem 0; color: var(--color-text-secondary); font-size: 14px;">
            Data visualization dashboard with real-time analytics.
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">React</span>
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">D3.js</span>
          </div>
        </div>

        <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
          <h3 style="margin: 0 0 0.5rem 0;">Project Gamma</h3>
          <p style="margin: 0 0 1rem 0; color: var(--color-text-secondary); font-size: 14px;">
            E-commerce platform with integrated payment processing.
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">Vue</span>
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">Node.js</span>
          </div>
        </div>

        <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
          <h3 style="margin: 0 0 0.5rem 0;">Project Delta</h3>
          <p style="margin: 0 0 1rem 0; color: var(--color-text-secondary); font-size: 14px;">
            Mobile-first progressive web application for productivity.
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">PWA</span>
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">Svelte</span>
          </div>
        </div>

        <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
          <h3 style="margin: 0 0 0.5rem 0;">Project Epsilon</h3>
          <p style="margin: 0 0 1rem 0; color: var(--color-text-secondary); font-size: 14px;">
            AI-powered chatbot with natural language processing.
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">Python</span>
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">ML</span>
          </div>
        </div>

        <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm);">
          <h3 style="margin: 0 0 0.5rem 0;">Project Zeta</h3>
          <p style="margin: 0 0 1rem 0; color: var(--color-text-secondary); font-size: 14px;">
            Real-time collaboration tool for distributed teams.
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">WebRTC</span>
            <span style="padding: 0.25rem 0.75rem; background: var(--color-background); color: var(--color-text-primary); border-radius: 9999px; font-size: 12px;">Socket.io</span>
          </div>
        </div>
      </eb-grid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: Project cards in a responsive grid layout.',
      },
    },
  },
};

// Dashboard Layout Example
export const DashboardLayoutExample: Story = {
  render: () => ({
    template: `
      <eb-grid [cols]="12" gap="lg">
        <!-- Header spanning full width -->
        <div class="col-span-12" style="padding: 1.5rem; background: var(--color-surface); color: var(--color-text-primary); border-radius: var(--border-radius-md);">
          <h2 style="margin: 0;">Dashboard Header</h2>
        </div>

        <!-- Stat cards -->
        <div class="col-span-12 col-span-md-6 col-span-lg-3" style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
          <h3 style="margin: 0; font-size: 2rem; color: var(--color-primary);">1,234</h3>
          <p style="margin: 0.5rem 0 0; color: var(--color-text-secondary); font-size: 14px;">Total Users</p>
        </div>
        <div class="col-span-12 col-span-md-6 col-span-lg-3" style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
          <h3 style="margin: 0; font-size: 2rem; color: var(--color-primary);">567</h3>
          <p style="margin: 0.5rem 0 0; color: var(--color-text-secondary); font-size: 14px;">Active Projects</p>
        </div>
        <div class="col-span-12 col-span-md-6 col-span-lg-3" style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
          <h3 style="margin: 0; font-size: 2rem; color: var(--color-primary);">89%</h3>
          <p style="margin: 0.5rem 0 0; color: var(--color-text-secondary); font-size: 14px;">Success Rate</p>
        </div>
        <div class="col-span-12 col-span-md-6 col-span-lg-3" style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md); text-align: center;">
          <h3 style="margin: 0; font-size: 2rem; color: var(--color-primary);">$45K</h3>
          <p style="margin: 0.5rem 0 0; color: var(--color-text-secondary); font-size: 14px;">Revenue</p>
        </div>

        <!-- Main content area -->
        <div class="col-span-12 col-span-lg-8" style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
          <h3 style="margin: 0 0 1rem 0;">Recent Activity</h3>
          <p style="color: var(--color-text-secondary);">Main dashboard content goes here...</p>
        </div>

        <!-- Sidebar -->
        <div class="col-span-12 col-span-lg-4" style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius-md);">
          <h3 style="margin: 0 0 1rem 0;">Quick Actions</h3>
          <p style="color: var(--color-text-secondary);">Sidebar content...</p>
        </div>
      </eb-grid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world example: Dashboard layout with header, stat cards, main content, and sidebar.',
      },
    },
  },
};

// Interactive Demo
export const Interactive: Story = {
  args: {
    cols: 3,
    colsMd: undefined,
    colsLg: undefined,
    colsXl: undefined,
    gap: 'md',
    gapX: undefined,
    gapY: undefined,
    minColWidth: '200px',
    alignItems: 'stretch',
    justifyItems: undefined,
    fullWidth: true,
    ariaLabel: 'Interactive grid demo',
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-grid ${argsToTemplate(args)}>
        ${Array.from({ length: 6 }, (_, i) => createGridItem(i + 1)).join('')}
      </eb-grid>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive grid - use the controls below to customize all properties.',
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
          <li>Uses CSS Grid for layout (display: grid)</li>
          <li>No role by default (layout utility)</li>
          <li>Can be customized to <code>role="grid"</code> for data tables</li>
          <li>Supports custom ARIA roles for different contexts</li>
        </ul>

        <h4>ARIA Support</h4>
        <ul style="font-size: 14px;">
          <li>No role by default (pure layout component)</li>
          <li>Set <code>role="list"</code> when children have <code>role="listitem"</code></li>
          <li><code>aria-label</code> for identifying grid regions</li>
          <li><code>aria-labelledby</code> to link to section headings</li>
          <li>Custom role support (grid, list, region, etc.)</li>
        </ul>

        <h4>Responsive Design</h4>
        <ul style="font-size: 14px;">
          <li>Mobile-first approach with responsive breakpoints</li>
          <li>Breakpoints: 768px (tablet), 1024px (desktop), 1280px (large)</li>
          <li>Auto-fit option for fluid layouts</li>
          <li>Flexible gap spacing that adapts to content</li>
        </ul>

        <h4>Layout Features</h4>
        <ul style="font-size: 14px;">
          <li>1-12 column layouts with responsive variants</li>
          <li>Auto-fit columns with configurable minimum width</li>
          <li>7 gap spacing options (none to 2xl)</li>
          <li>Independent horizontal and vertical gap control</li>
          <li>4 alignment options (start, center, end, stretch)</li>
          <li>6 justify options for horizontal distribution</li>
        </ul>

        <h4>12-Column System</h4>
        <ul style="font-size: 14px;">
          <li>Traditional 12-column grid with .col-span-* utilities</li>
          <li>Responsive column spans: .col-span-md-*, .col-span-lg-*</li>
          <li>Precise control over item placement</li>
          <li>Compatible with CSS Grid standards</li>
        </ul>

        <h4>Best Practices</h4>
        <ul style="font-size: 14px;">
          <li>Use responsive columns for content that adapts to screen size</li>
          <li>Use auto-fit for galleries and card grids</li>
          <li>Use 12-column system for precise layouts (dashboards, forms)</li>
          <li>Provide appropriate ARIA labels for grids representing regions</li>
          <li>Maintain sufficient gap spacing for touch targets (≥8px)</li>
        </ul>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive accessibility features and best practices for using the grid component.',
      },
    },
  },
};
