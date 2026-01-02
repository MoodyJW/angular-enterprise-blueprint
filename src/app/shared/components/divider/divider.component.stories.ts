import type { Meta, StoryObj } from '@storybook/angular';

import { DividerComponent } from './divider.component';

const meta: Meta<DividerComponent> = {
  title: 'Shared/Divider',
  component: DividerComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A visual divider component that separates content sections. Supports horizontal and vertical orientations, multiple visual styles, configurable spacing, and optional label text.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the divider',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Visual variant of the divider line',
      table: {
        defaultValue: { summary: 'solid' },
      },
    },
    spacing: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Spacing around the divider (margin)',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    thickness: {
      control: 'select',
      options: ['thin', 'medium', 'thick'],
      description: 'Thickness of the divider line',
      table: {
        defaultValue: { summary: 'thin' },
      },
    },
    label: {
      control: 'text',
      description: 'Optional label text to display in the center (horizontal only)',
    },
    inset: {
      control: 'boolean',
      description: 'Whether the divider should be inset from the edges',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    ariaRole: {
      control: 'text',
      description: 'ARIA role for the divider',
      table: {
        defaultValue: { summary: 'separator' },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility',
    },
  },
};

export default meta;
type Story = StoryObj<DividerComponent>;

/**
 * Default horizontal divider with solid line.
 */
export const Default: Story = {
  args: {},
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 2rem;">
        <p>Content above the divider</p>
        <eb-divider
          [orientation]="orientation"
          [variant]="variant"
          [spacing]="spacing"
          [thickness]="thickness"
          [label]="label"
          [inset]="inset"
          [ariaRole]="ariaRole"
          [ariaLabel]="ariaLabel"
        />
        <p>Content below the divider</p>
      </div>
    `,
  }),
};

/**
 * Horizontal divider with label in the center.
 */
export const WithLabel: Story = {
  args: {
    label: 'Or continue with',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 2rem;">
        <button style="width: 100%; padding: 0.75rem; margin-bottom: 1rem;">Sign in with email</button>
        <eb-divider
          [label]="label"
          [variant]="variant"
          [spacing]="spacing"
          [thickness]="thickness"
        />
        <button style="width: 100%; padding: 0.75rem; margin-top: 1rem;">Sign in with Google</button>
      </div>
    `,
  }),
};

/**
 * Vertical divider separating content horizontally.
 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; align-items: center; padding: 2rem; height: 150px;">
        <div style="flex: 1; text-align: center;">
          <h3>Section 1</h3>
          <p>Content on the left</p>
        </div>
        <eb-divider
          [orientation]="orientation"
          [variant]="variant"
          [spacing]="spacing"
          [thickness]="thickness"
          [inset]="inset"
        />
        <div style="flex: 1; text-align: center;">
          <h3>Section 2</h3>
          <p>Content on the right</p>
        </div>
      </div>
    `,
  }),
};

/**
 * Dashed style divider.
 */
export const Dashed: Story = {
  args: {
    variant: 'dashed',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 2rem;">
        <p>Content above the dashed divider</p>
        <eb-divider
          [variant]="variant"
          [spacing]="spacing"
          [thickness]="thickness"
        />
        <p>Content below the dashed divider</p>
      </div>
    `,
  }),
};

/**
 * Dotted style divider.
 */
export const Dotted: Story = {
  args: {
    variant: 'dotted',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 2rem;">
        <p>Content above the dotted divider</p>
        <eb-divider
          [variant]="variant"
          [spacing]="spacing"
          [thickness]="thickness"
        />
        <p>Content below the dotted divider</p>
      </div>
    `,
  }),
};

/**
 * Different thickness options.
 */
export const ThicknessVariants: Story = {
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <h4>Thin (1px)</h4>
        <eb-divider thickness="thin" />

        <h4 style="margin-top: 2rem;">Medium (2px)</h4>
        <eb-divider thickness="medium" />

        <h4 style="margin-top: 2rem;">Thick (4px)</h4>
        <eb-divider thickness="thick" />
      </div>
    `,
  }),
};

/**
 * Different spacing options for vertical margins.
 */
export const SpacingVariants: Story = {
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <p>Content before</p>
        <p>Spacing: none</p>
        <eb-divider spacing="none" />
        <p>Content after</p>

        <p style="margin-top: 2rem;">Content before</p>
        <p>Spacing: xs (4px)</p>
        <eb-divider spacing="xs" />
        <p>Content after</p>

        <p style="margin-top: 2rem;">Content before</p>
        <p>Spacing: sm (8px)</p>
        <eb-divider spacing="sm" />
        <p>Content after</p>

        <p style="margin-top: 2rem;">Content before</p>
        <p>Spacing: md (16px)</p>
        <eb-divider spacing="md" />
        <p>Content after</p>

        <p style="margin-top: 2rem;">Content before</p>
        <p>Spacing: lg (24px)</p>
        <eb-divider spacing="lg" />
        <p>Content after</p>

        <p style="margin-top: 2rem;">Content before</p>
        <p>Spacing: xl (32px)</p>
        <eb-divider spacing="xl" />
        <p>Content after</p>
      </div>
    `,
  }),
};

/**
 * Inset divider with padding from edges.
 */
export const Inset: Story = {
  args: {
    inset: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 2rem; border: 1px dashed var(--color-border);">
        <p>Regular divider (full width):</p>
        <eb-divider spacing="sm" />
        <p>Inset divider (with padding):</p>
        <eb-divider [inset]="inset" spacing="sm" />
        <p>Content after</p>
      </div>
    `,
  }),
};

/**
 * Label with different visual variants.
 */
export const LabelWithVariants: Story = {
  render: () => ({
    template: `
      <div style="padding: 2rem;">
        <h4>Solid with label</h4>
        <eb-divider label="Or" variant="solid" />

        <h4 style="margin-top: 2rem;">Dashed with label</h4>
        <eb-divider label="Or" variant="dashed" />

        <h4 style="margin-top: 2rem;">Dotted with label</h4>
        <eb-divider label="Or" variant="dotted" />
      </div>
    `,
  }),
};

/**
 * Section dividers in a content layout.
 */
export const ContentSections: Story = {
  render: () => ({
    template: `
      <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
        <article>
          <h2>Article Title</h2>
          <p>Introduction paragraph with some initial content about the topic.</p>

          <eb-divider spacing="lg" />

          <h3>First Section</h3>
          <p>Content for the first section goes here. This demonstrates how dividers can separate major sections.</p>

          <eb-divider spacing="lg" />

          <h3>Second Section</h3>
          <p>Content for the second section. Dividers provide clear visual separation between topics.</p>

          <eb-divider spacing="lg" />

          <h3>Conclusion</h3>
          <p>Final thoughts and summary of the article.</p>
        </article>
      </div>
    `,
  }),
};

/**
 * Login form with divider and social login options.
 */
export const LoginForm: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px; padding: 2rem; margin: 0 auto; border: 1px solid var(--color-border); border-radius: 8px;">
        <h2 style="margin-top: 0;">Sign In</h2>

        <div style="margin-bottom: 1rem;">
          <label for="divider-login-email" style="display: block; margin-bottom: 0.5rem;">Email</label>
          <input id="divider-login-email" type="email" style="width: 100%; padding: 0.5rem; box-sizing: border-box;" />
        </div>

        <div style="margin-bottom: 1rem;">
          <label for="divider-login-password" style="display: block; margin-bottom: 0.5rem;">Password</label>
          <input id="divider-login-password" type="password" style="width: 100%; padding: 0.5rem; box-sizing: border-box;" />
        </div>

        <button style="width: 100%; padding: 0.75rem; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 4px; cursor: pointer;">
          Sign In
        </button>

        <eb-divider label="Or continue with" spacing="lg" />

        <button style="width: 100%; padding: 0.75rem; margin-bottom: 0.5rem; border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); border-radius: 4px; cursor: pointer;">
          Google
        </button>

        <button style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); border-radius: 4px; cursor: pointer;">
          GitHub
        </button>
      </div>
    `,
  }),
};

/**
 * Vertical dividers in a toolbar or navigation.
 */
export const VerticalToolbar: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; padding: 1rem; background: var(--color-surface-active); gap: 1rem;">
        <button style="padding: 0.5rem 1rem; border: none; background: var(--color-surface); color: var(--color-text); border-radius: 4px; cursor: pointer;">New</button>
        <eb-divider orientation="vertical" spacing="none" style="height: 24px;" />
        <button style="padding: 0.5rem 1rem; border: none; background: var(--color-surface); color: var(--color-text); border-radius: 4px; cursor: pointer;">Edit</button>
        <eb-divider orientation="vertical" spacing="none" style="height: 24px;" />
        <button style="padding: 0.5rem 1rem; border: none; background: var(--color-surface); color: var(--color-text); border-radius: 4px; cursor: pointer;">Delete</button>
        <eb-divider orientation="vertical" spacing="none" style="height: 24px;" />
        <button style="padding: 0.5rem 1rem; border: none; background: var(--color-surface); color: var(--color-text); border-radius: 4px; cursor: pointer;">Share</button>
      </div>
    `,
  }),
};
