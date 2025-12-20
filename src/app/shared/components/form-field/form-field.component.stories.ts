/* eslint-disable @typescript-eslint/unbound-method */
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { UniqueIdService } from '../../services/unique-id/unique-id/unique-id.service';

import { InputFooterComponent } from '../input-footer';
import { InputLabelComponent } from '../input-label';

import { FormFieldComponent } from './form-field.component';

const meta: Meta<FormFieldComponent> = {
  title: 'Shared/Form/FormField',
  component: FormFieldComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormFieldComponent,
        InputLabelComponent,
        InputFooterComponent,
      ],
      providers: [UniqueIdService],
    }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 500px; padding: 2rem;">${story}</div>`,
    ),
  ],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the form field',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the form field',
    },
    errors: {
      control: 'object',
      description: 'Manual error messages (string or array of strings)',
    },
    validationState: {
      control: 'select',
      options: [null, 'default', 'success', 'warning', 'error'],
      description: 'Manual validation state override',
    },
    showErrorsOnTouched: {
      control: 'boolean',
      description: 'Whether to show errors only after the field is touched',
    },
    wrapperClass: {
      control: 'text',
      description: 'Additional CSS classes for the wrapper',
    },
  },
};

export default meta;
type Story = StoryObj<FormFieldComponent>;

/**
 * Basic usage with label and helper text
 */
export const Default: Story = {
  args: {
    label: 'Email Address',
    helperText: 'We will never share your email with anyone else.',
    required: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-form-field ${argsToTemplate(args)}>
        <input
          type="email"
          placeholder="Enter your email"
          style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"
        />
      </eb-form-field>
    `,
  }),
};

/**
 * Required field with asterisk indicator
 */
export const Required: Story = {
  args: {
    label: 'Password',
    required: true,
    helperText: 'Must be at least 8 characters',
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-form-field ${argsToTemplate(args)}>
        <input
          type="password"
          placeholder="Enter your password"
          style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"
        />
      </eb-form-field>
    `,
  }),
};

/**
 * Field with manual error message
 */
export const WithError: Story = {
  args: {
    label: 'Username',
    required: true,
    errors: 'Username is required',
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-form-field ${argsToTemplate(args)}>
        <input
          type="text"
          placeholder="Enter your username"
          style="width: 100%; padding: 0.5rem; border: 1px solid #dc2626; border-radius: 0.375rem;"
        />
      </eb-form-field>
    `,
  }),
};

/**
 * Field with multiple error messages
 */
export const WithMultipleErrors: Story = {
  args: {
    label: 'Password',
    required: true,
    errors: ['Password is required', 'Must be at least 8 characters', 'Must contain a number'],
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-form-field ${argsToTemplate(args)}>
        <input
          type="password"
          placeholder="Enter your password"
          style="width: 100%; padding: 0.5rem; border: 1px solid #dc2626; border-radius: 0.375rem;"
        />
      </eb-form-field>
    `,
  }),
};

/**
 * Field with success validation state
 */
export const WithSuccess: Story = {
  args: {
    label: 'Email Address',
    validationState: 'success',
    helperText: 'Email is valid',
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-form-field ${argsToTemplate(args)}>
        <input
          type="email"
          value="user@example.com"
          style="width: 100%; padding: 0.5rem; border: 1px solid #10b981; border-radius: 0.375rem;"
        />
      </eb-form-field>
    `,
  }),
};

/**
 * Field with warning validation state
 */
export const WithWarning: Story = {
  args: {
    label: 'Username',
    validationState: 'warning',
    helperText: 'This username may already be taken',
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-form-field ${argsToTemplate(args)}>
        <input
          type="text"
          value="john_doe"
          style="width: 100%; padding: 0.5rem; border: 1px solid #f59e0b; border-radius: 0.375rem;"
        />
      </eb-form-field>
    `,
  }),
};

/**
 * Field with textarea element
 */
export const WithTextarea: Story = {
  args: {
    label: 'Message',
    required: true,
    helperText: 'Maximum 500 characters',
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-form-field ${argsToTemplate(args)}>
        <textarea
          rows="4"
          placeholder="Enter your message"
          style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; resize: vertical;"
        ></textarea>
      </eb-form-field>
    `,
  }),
};

/**
 * Field with select element
 */
export const WithSelect: Story = {
  args: {
    label: 'Country',
    required: true,
    helperText: 'Select your country of residence',
  },
  render: (args) => ({
    props: args,
    template: `
      <eb-form-field ${argsToTemplate(args)}>
        <select style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
          <option value="au">Australia</option>
        </select>
      </eb-form-field>
    `,
  }),
};

/**
 * Integration with Angular Reactive Forms - Valid State
 */
export const WithReactiveFormsValid: Story = {
  render: () => {
    const emailControl = new FormControl('user@example.com', [
      Validators.required,
      Validators.email,
    ]);
    emailControl.markAsTouched();

    return {
      props: {
        emailControl,
      },
      template: `
        <eb-form-field
          label="Email Address"
          [required]="true"
          [control]="emailControl"
          helperText="Enter a valid email address"
        >
          <input
            type="email"
            [formControl]="emailControl"
            placeholder="Enter your email"
            style="width: 100%; padding: 0.5rem; border: 1px solid #10b981; border-radius: 0.375rem;"
          />
        </eb-form-field>
      `,
    };
  },
};

/**
 * Integration with Angular Reactive Forms - Invalid State
 */
export const WithReactiveFormsInvalid: Story = {
  render: () => {
    const emailControl = new FormControl('', [Validators.required, Validators.email]);
    emailControl.markAsTouched();

    return {
      props: {
        emailControl,
      },
      template: `
        <eb-form-field
          label="Email Address"
          [required]="true"
          [control]="emailControl"
        >
          <input
            type="email"
            [formControl]="emailControl"
            placeholder="Enter your email"
            style="width: 100%; padding: 0.5rem; border: 1px solid #dc2626; border-radius: 0.375rem;"
          />
        </eb-form-field>
      `,
    };
  },
};

/**
 * Custom error messages with placeholders
 */
export const WithCustomErrorMessages: Story = {
  render: () => {
    const passwordControl = new FormControl('abc', [Validators.required, Validators.minLength(8)]);
    passwordControl.markAsTouched();

    return {
      props: {
        passwordControl,
        customErrors: {
          required: 'Please enter a password',
          minlength: 'Password must be at least {requiredLength} characters long',
        },
      },
      template: `
        <eb-form-field
          label="Password"
          [required]="true"
          [control]="passwordControl"
          [errorMessages]="customErrors"
        >
          <input
            type="password"
            [formControl]="passwordControl"
            placeholder="Enter your password"
            style="width: 100%; padding: 0.5rem; border: 1px solid #dc2626; border-radius: 0.375rem;"
          />
        </eb-form-field>
      `,
    };
  },
};

/**
 * Show errors only after field is touched
 */
export const ShowErrorsOnTouched: Story = {
  render: () => {
    const usernameControl = new FormControl('', Validators.required);
    // Not marking as touched, so errors won't show

    return {
      props: {
        usernameControl,
      },
      template: `
        <div>
          <p style="margin-bottom: 1rem; color: #6b7280;">
            Try clicking into the field and then clicking out to see errors appear.
          </p>
          <eb-form-field
            label="Username"
            [required]="true"
            [control]="usernameControl"
            [showErrorsOnTouched]="true"
          >
            <input
              type="text"
              [formControl]="usernameControl"
              placeholder="Enter your username"
              style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"
            />
          </eb-form-field>
        </div>
      `,
    };
  },
};

/**
 * Show errors immediately without touch requirement
 */
export const ShowErrorsImmediately: Story = {
  render: () => {
    const usernameControl = new FormControl('', Validators.required);
    // Not marking as touched, but errors will show immediately

    return {
      props: {
        usernameControl,
      },
      template: `
        <div>
          <p style="margin-bottom: 1rem; color: #6b7280;">
            Errors are displayed immediately without requiring the field to be touched.
          </p>
          <eb-form-field
            label="Username"
            [required]="true"
            [control]="usernameControl"
            [showErrorsOnTouched]="false"
          >
            <input
              type="text"
              [formControl]="usernameControl"
              placeholder="Enter your username"
              style="width: 100%; padding: 0.5rem; border: 1px solid #dc2626; border-radius: 0.375rem;"
            />
          </eb-form-field>
        </div>
      `,
    };
  },
};

/**
 * Complete form example with multiple fields
 */
export const CompleteFormExample: Story = {
  render: () => {
    const nameControl = new FormControl('', Validators.required);
    const emailControl = new FormControl('', [Validators.required, Validators.email]);
    const passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    const bioControl = new FormControl('');

    return {
      props: {
        nameControl,
        emailControl,
        passwordControl,
        bioControl,
      },
      template: `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0;">Create Account</h3>

          <eb-form-field
            label="Full Name"
            [required]="true"
            [control]="nameControl"
            helperText="Enter your first and last name"
          >
            <input
              type="text"
              [formControl]="nameControl"
              placeholder="John Doe"
              style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"
            />
          </eb-form-field>

          <eb-form-field
            label="Email Address"
            [required]="true"
            [control]="emailControl"
            helperText="We'll never share your email"
          >
            <input
              type="email"
              [formControl]="emailControl"
              placeholder="john@example.com"
              style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"
            />
          </eb-form-field>

          <eb-form-field
            label="Password"
            [required]="true"
            [control]="passwordControl"
            helperText="Must be at least 8 characters"
          >
            <input
              type="password"
              [formControl]="passwordControl"
              placeholder="Enter your password"
              style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"
            />
          </eb-form-field>

          <eb-form-field
            label="Bio (Optional)"
            [control]="bioControl"
            helperText="Tell us a bit about yourself"
          >
            <textarea
              [formControl]="bioControl"
              rows="4"
              placeholder="I am a..."
              style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; resize: vertical;"
            ></textarea>
          </eb-form-field>

          <button
            type="submit"
            style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;"
          >
            Create Account
          </button>
        </div>
      `,
    };
  },
};

/**
 * Accessibility demonstration with proper ARIA attributes
 */
export const AccessibilityDemo: Story = {
  render: () => {
    const emailControl = new FormControl('', [Validators.required, Validators.email]);

    return {
      props: {
        emailControl,
      },
      template: `
        <div>
          <h3 style="margin: 0 0 1rem 0;">Accessibility Features</h3>
          <p style="margin-bottom: 1rem; color: #6b7280; font-size: 0.875rem;">
            This component includes:
          </p>
          <ul style="margin-bottom: 1.5rem; color: #6b7280; font-size: 0.875rem; padding-left: 1.5rem;">
            <li>Proper label-to-input association</li>
            <li>ARIA describedby for helper text</li>
            <li>Required field indicator</li>
            <li>Error message announcement</li>
            <li>Keyboard navigation support</li>
          </ul>

          <eb-form-field
            label="Email Address"
            [required]="true"
            [control]="emailControl"
            helperText="Enter a valid email address"
          >
            <input
              type="email"
              [formControl]="emailControl"
              placeholder="user@example.com"
              [id]="'email-input'"
              style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"
            />
          </eb-form-field>
        </div>
      `,
    };
  },
};
