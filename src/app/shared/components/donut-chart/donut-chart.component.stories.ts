import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { DonutChartComponent } from './donut-chart.component';

const meta: Meta<DonutChartComponent> = {
  title: 'Shared/DonutChart',
  component: DonutChartComponent,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Current value of the chart',
    },
    total: {
      control: 'number',
      description: 'Total value (max)',
      table: {
        defaultValue: { summary: '100' },
      },
    },
    label: {
      control: 'text',
      description: 'Label to display below the chart',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'success', 'warning', 'error'],
      description: 'Visual variant (color)',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the chart',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Reusable donut chart component using pure CSS conic-gradient. Used to visualize percentages or score/total ratios.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<DonutChartComponent>;

export const Default: Story = {
  args: {
    value: 75,
    total: 100,
    label: 'Performance',
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
        <eb-donut-chart [value]="90" label="Primary" variant="primary" />
        <eb-donut-chart [value]="80" label="Secondary" variant="secondary" />
        <eb-donut-chart [value]="70" label="Accent" variant="accent" />
        <eb-donut-chart [value]="100" label="Success" variant="success" />
        <eb-donut-chart [value]="60" label="Warning" variant="warning" />
        <eb-donut-chart [value]="40" label="Error" variant="error" />
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-end;">
        <eb-donut-chart [value]="75" size="sm" label="Small" />
        <eb-donut-chart [value]="75" size="md" label="Medium" />
        <eb-donut-chart [value]="75" size="lg" label="Large" />
      </div>
    `,
  }),
};

export const Interactive: Story = {
  args: {
    value: 45,
    total: 100,
    label: 'Interactive',
    variant: 'accent',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-donut-chart ${argsToTemplate(args)} />
    `,
  }),
};
