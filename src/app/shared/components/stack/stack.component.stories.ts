import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, argsToTemplate } from '@storybook/angular';

import { StackComponent } from './stack.component';

const meta: Meta<StackComponent> = {
  title: 'Shared/Stack',
  component: StackComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [],
    }),
  ],
  argTypes: {
    spacing: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
      description: 'Spacing between stack items',
      table: {
        type: { summary: 'StackSpacing' },
        defaultValue: { summary: 'md' },
      },
    },
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Stack direction',
      table: {
        type: { summary: 'StackDirection' },
        defaultValue: { summary: 'vertical' },
      },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Alignment perpendicular to stack direction',
      table: {
        type: { summary: 'StackAlign' },
        defaultValue: { summary: 'stretch' },
      },
    },
    justify: {
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
      description: 'Distribution along stack direction',
      table: {
        type: { summary: 'StackJustify | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether stack takes full width/height',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    wrap: {
      control: 'boolean',
      description: 'Whether items wrap when exceeding container (horizontal only)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    inline: {
      control: 'boolean',
      description: 'Whether stack is inline (vertical only)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    divider: {
      control: 'boolean',
      description: 'Add divider between stack items',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    role: {
      control: 'text',
      description: 'ARIA role for the stack',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'list' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for the stack',
    },
    ariaLabelledBy: {
      control: 'text',
      description: 'ID of element that labels the stack',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Stack component for consistent spacing between child elements. Provides vertical or horizontal stacking with flexible spacing, alignment, and distribution options.',
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
type Story = StoryObj<StackComponent>;

// Helper function to create stack items
const createStackItem = (text: string, color = 'var(--color-surface)'): string => `
  <div style="
    padding: 1rem 1.5rem;
    background: ${color};
    border: 2px solid var(--color-border);
    border-radius: var(--border-radius);
    font-weight: 500;
  ">
    ${text}
  </div>
`;

// Default Stack
export const Default: Story = {
  render: () => ({
    template: `
      <eb-stack spacing="md">
        ${createStackItem('Item 1')}
        ${createStackItem('Item 2')}
        ${createStackItem('Item 3')}
      </eb-stack>
    `,
  }),
};

// All Spacing Variants
export const AllSpacingVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 3rem;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">No Spacing (0)</h4>
          <eb-stack spacing="none">
            ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
          </eb-stack>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Extra Small (4px)</h4>
          <eb-stack spacing="xs">
            ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
          </eb-stack>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Small (8px)</h4>
          <eb-stack spacing="sm">
            ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
          </eb-stack>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Medium (16px) - Default</h4>
          <eb-stack spacing="md">
            ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
          </eb-stack>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Large (24px)</h4>
          <eb-stack spacing="lg">
            ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
          </eb-stack>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Extra Large (32px)</h4>
          <eb-stack spacing="xl">
            ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
          </eb-stack>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All spacing variants from none to 4xl (96px).',
      },
    },
  },
};

// Horizontal Stack
export const HorizontalStack: Story = {
  render: () => ({
    template: `
      <eb-stack direction="horizontal" spacing="md">
        ${createStackItem('Button 1')}
        ${createStackItem('Button 2')}
        ${createStackItem('Button 3')}
      </eb-stack>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Horizontal stack for laying out items side by side.',
      },
    },
  },
};

// Alignment Options (Vertical)
export const VerticalAlignment: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align Start (Left)</h4>
          <eb-stack spacing="md" align="start">
            ${createStackItem('Short')}
            ${createStackItem('Medium length text')}
            ${createStackItem('This is a much longer item with more text')}
          </eb-stack>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align Center</h4>
          <eb-stack spacing="md" align="center">
            ${createStackItem('Short')}
            ${createStackItem('Medium length text')}
            ${createStackItem('This is a much longer item with more text')}
          </eb-stack>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align End (Right)</h4>
          <eb-stack spacing="md" align="end">
            ${createStackItem('Short')}
            ${createStackItem('Medium length text')}
            ${createStackItem('This is a much longer item with more text')}
          </eb-stack>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align Stretch (Default)</h4>
          <eb-stack spacing="md" align="stretch">
            ${createStackItem('Short')}
            ${createStackItem('Medium length text')}
            ${createStackItem('This is a much longer item with more text')}
          </eb-stack>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Alignment options for vertical stacks (controls horizontal alignment).',
      },
    },
  },
};

// Alignment Options (Horizontal)
export const HorizontalAlignment: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align Start (Top)</h4>
          <div style="height: 150px; border: 2px dashed var(--color-border); border-radius: var(--border-radius); padding: 1rem;">
            <eb-stack direction="horizontal" spacing="md" align="start">
              ${createStackItem('Short', 'var(--color-primary)')}
              ${createStackItem('Medium<br>height', 'var(--color-primary)')}
              ${createStackItem('Tall<br>item<br>here', 'var(--color-primary)')}
            </eb-stack>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align Center</h4>
          <div style="height: 150px; border: 2px dashed var(--color-border); border-radius: var(--border-radius); padding: 1rem;">
            <eb-stack direction="horizontal" spacing="md" align="center">
              ${createStackItem('Short', 'var(--color-primary)')}
              ${createStackItem('Medium<br>height', 'var(--color-primary)')}
              ${createStackItem('Tall<br>item<br>here', 'var(--color-primary)')}
            </eb-stack>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Align End (Bottom)</h4>
          <div style="height: 150px; border: 2px dashed var(--color-border); border-radius: var(--border-radius); padding: 1rem;">
            <eb-stack direction="horizontal" spacing="md" align="end">
              ${createStackItem('Short', 'var(--color-primary)')}
              ${createStackItem('Medium<br>height', 'var(--color-primary)')}
              ${createStackItem('Tall<br>item<br>here', 'var(--color-primary)')}
            </eb-stack>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Alignment options for horizontal stacks (controls vertical alignment).',
      },
    },
  },
};

// Justify Options
export const JustifyOptions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Justify Start</h4>
          <div style="height: 100px; border: 2px dashed var(--color-border); border-radius: var(--border-radius); padding: 1rem;">
            <eb-stack direction="horizontal" spacing="md" justify="start">
              ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
            </eb-stack>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Justify Center</h4>
          <div style="height: 100px; border: 2px dashed var(--color-border); border-radius: var(--border-radius); padding: 1rem;">
            <eb-stack direction="horizontal" spacing="md" justify="center">
              ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
            </eb-stack>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Justify End</h4>
          <div style="height: 100px; border: 2px dashed var(--color-border); border-radius: var(--border-radius); padding: 1rem;">
            <eb-stack direction="horizontal" spacing="md" justify="end">
              ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
            </eb-stack>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Justify Space Between</h4>
          <div style="height: 100px; border: 2px dashed var(--color-border); border-radius: var(--border-radius); padding: 1rem;">
            <eb-stack direction="horizontal" spacing="none" justify="space-between">
              ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
            </eb-stack>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Justify Space Around</h4>
          <div style="height: 100px; border: 2px dashed var(--color-border); border-radius: var(--border-radius); padding: 1rem;">
            <eb-stack direction="horizontal" spacing="none" justify="space-around">
              ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
            </eb-stack>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Justify Space Evenly</h4>
          <div style="height: 100px; border: 2px dashed var(--color-border); border-radius: var(--border-radius); padding: 1rem;">
            <eb-stack direction="horizontal" spacing="none" justify="space-evenly">
              ${Array.from({ length: 3 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
            </eb-stack>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Justify options for distributing items along the stack direction.',
      },
    },
  },
};

// With Dividers
export const WithDividers: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 3rem;">
        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Vertical Stack with Dividers</h4>
          <eb-stack spacing="lg" [divider]="true">
            ${Array.from({ length: 4 }, (_, i) => createStackItem(`Section ${String(i + 1)}`)).join('')}
          </eb-stack>
        </div>

        <div>
          <h4 style="margin: 0 0 0.5rem 0;">Horizontal Stack with Dividers</h4>
          <eb-stack direction="horizontal" spacing="lg" [divider]="true">
            ${Array.from({ length: 4 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
          </eb-stack>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Stacks with visual dividers between items.',
      },
    },
  },
};

// Wrapping Horizontal Stack
export const WrappingStack: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px; border: 2px dashed var(--color-border); border-radius: var(--border-radius); padding: 1rem;">
        <h4 style="margin: 0 0 1rem 0;">Horizontal Stack with Wrap</h4>
        <eb-stack direction="horizontal" spacing="md" [wrap]="true">
          ${Array.from({ length: 12 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
        </eb-stack>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Horizontal stack that wraps items to the next line when space runs out.',
      },
    },
  },
};

// Form Actions Example
export const FormActionsExample: Story = {
  render: () => ({
    template: `
      <div style="max-width: 500px; padding: 2rem; background: var(--color-surface); border-radius: var(--border-radius);">
        <h3 style="margin: 0 0 1.5rem 0;">Contact Form</h3>
        <eb-stack spacing="lg">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Name</label>
            <input type="text" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--border-radius);">
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
            <input type="email" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--border-radius);">
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Message</label>
            <textarea rows="4" style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--border-radius);"></textarea>
          </div>
            <eb-stack direction="horizontal" spacing="md" justify="end">
            <button style="padding: 0.75rem 1.5rem; background: transparent; color: var(--color-text); border: 1px solid var(--color-border); border-radius: var(--border-radius); cursor: pointer;">Cancel</button>
            <button style="padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; border: none; border-radius: var(--border-radius); cursor: pointer;">Submit</button>
          </eb-stack>
        </eb-stack>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world example: Form with vertical stack for fields and horizontal stack for actions.',
      },
    },
  },
};

// Card List Example
export const CardListExample: Story = {
  render: () => ({
    template: `
      <eb-stack spacing="lg">
      <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
          <h3 style="margin: 0 0 0.5rem 0;">Notification Title 1</h3>
          <p style="margin: 0; color: var(--color-text-secondary); font-size: 14px;">This is a notification message with some details about an event.</p>
        </div>
        <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
          <h3 style="margin: 0 0 0.5rem 0;">Notification Title 2</h3>
          <p style="margin: 0; color: var(--color-text-secondary); font-size: 14px;">Another notification with different content to show consistent spacing.</p>
        </div>
        <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius); box-shadow: var(--shadow-sm);">
          <h3 style="margin: 0 0 0.5rem 0;">Notification Title 3</h3>
          <p style="margin: 0; color: var(--color-text-secondary); font-size: 14px;">A third notification demonstrating the stack component with cards.</p>
        </div>
      </eb-stack>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: List of notification cards with consistent spacing.',
      },
    },
  },
};

// Navigation Example
export const NavigationExample: Story = {
  render: () => ({
    template: `
      <div style="padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius);">
          <eb-stack direction="horizontal" spacing="xl" align="center">
          <div style="font-weight: bold; font-size: 1.25rem;">Logo</div>
          <eb-stack direction="horizontal" spacing="lg">
            <a href="#" style="color: var(--color-text); text-decoration: none;">Home</a>
            <a href="#" style="color: var(--color-text); text-decoration: none;">About</a>
            <a href="#" style="color: var(--color-text); text-decoration: none;">Services</a>
            <a href="#" style="color: var(--color-text); text-decoration: none;">Contact</a>
          </eb-stack>
          <button style="margin-left: auto; padding: 0.5rem 1rem; background: var(--color-primary); color: white; border: none; border-radius: var(--border-radius); cursor: pointer;">Sign In</button>
        </eb-stack>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: Navigation bar with horizontal stacks.',
      },
    },
  },
};

// Interactive Demo
export const Interactive: Story = {
  args: {
    spacing: 'md',
    direction: 'vertical',
    align: 'stretch',
    justify: undefined,
    fullWidth: false,
    wrap: false,
    inline: false,
    divider: false,
    ariaLabel: 'Interactive stack demo',
  },
  render: (args) => ({
    props: args,
    template: `
        <eb-stack ${argsToTemplate(args)}>
        ${Array.from({ length: 4 }, (_, i) => createStackItem(`Item ${String(i + 1)}`)).join('')}
      </eb-stack>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive stack - use the controls below to customize all properties.',
      },
    },
  },
};

// Accessibility Notes
export const AccessibilityNotes: Story = {
  render: () => ({
    template: `
      <div style="max-width: 700px; padding: 1.5rem; background: var(--color-surface); border-radius: var(--border-radius);">
        <h3 style="margin-top: 0;">WCAG 2.1 AAA Compliance</h3>

        <h4>Semantic HTML</h4>
        <ul style="font-size: 14px;">
          <li>Uses flexbox for layout (display: flex)</li>
          <li>Default <code>role="list"</code> for semantic grouping</li>
          <li>Can be customized to other roles (navigation, menu, etc.)</li>
          <li>Clean gap-based spacing for consistency</li>
        </ul>

        <h4>ARIA Support</h4>
        <ul style="font-size: 14px;">
          <li><code>role="list"</code> by default for semantic grouping</li>
          <li><code>aria-label</code> for identifying stack regions</li>
          <li><code>aria-labelledby</code> to link to section headings</li>
          <li>Custom role support for different contexts (navigation, toolbar, etc.)</li>
        </ul>

        <h4>Layout Features</h4>
        <ul style="font-size: 14px;">
          <li>9 spacing options from none (0) to 4xl (96px)</li>
          <li>Vertical and horizontal directions</li>
          <li>4 alignment options (start, center, end, stretch)</li>
          <li>6 justify options for distribution</li>
          <li>Wrap support for horizontal stacks</li>
          <li>Optional dividers between items</li>
          <li>Full width/inline options for sizing</li>
        </ul>

        <h4>Best Practices</h4>
        <ul style="font-size: 14px;">
          <li>Use vertical stacks for form fields, cards, and content sections</li>
          <li>Use horizontal stacks for buttons, navigation, and toolbars</li>
          <li>Use dividers to visually separate distinct sections</li>
          <li>Provide appropriate ARIA labels for navigation stacks</li>
          <li>Consider wrap for responsive horizontal layouts</li>
          <li>Use consistent spacing throughout your application</li>
        </ul>

        <h4>Use Cases</h4>
        <ul style="font-size: 14px;">
          <li><strong>Forms:</strong> Vertical stack for form fields with consistent spacing</li>
          <li><strong>Actions:</strong> Horizontal stack for button groups</li>
          <li><strong>Navigation:</strong> Horizontal stack for nav items</li>
          <li><strong>Cards:</strong> Vertical stack for card lists</li>
          <li><strong>Content:</strong> Vertical stack for page sections</li>
        </ul>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive accessibility features and best practices for using the stack component.',
      },
    },
  },
};
