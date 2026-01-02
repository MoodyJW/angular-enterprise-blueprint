/* eslint-disable @typescript-eslint/unbound-method */
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { UniqueIdService } from '@shared/services/unique-id';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { ButtonComponent } from '@shared/components/button';
import {
  InputComponent,
  InputFooterComponent,
  InputLabelComponent,
} from '@shared/components/input';
import { SelectComponent } from '@shared/components/select';
import { StackComponent } from '@shared/components/stack';
import { TextareaComponent } from '@shared/components/textarea';

import { FormFieldComponent } from './form-field.component';

const meta: Meta<FormFieldComponent> = {
  title: 'Shared/FormField',
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
        InputComponent,
        TextareaComponent,
        SelectComponent,
        ButtonComponent,
        StackComponent,
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
      <eb-form-field #field ${argsToTemplate(args)}>
        <eb-input
          type="email"
          placeholder="Enter your email"
          ariaLabel="Email Address"
          [validationState]="field.computedValidationState()"
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
  render: (args) => {
    const control = new FormControl('', [Validators.required, Validators.minLength(8)]);
    return {
      props: {
        ...args,
        control,
      },
      template: `
        <eb-form-field #field ${argsToTemplate(args)} [control]="control">
          <eb-input
            type="password"
            placeholder="Enter your password"
            [validationState]="field.computedValidationState()"
            [formControl]="control"
            ariaLabel="Password"
          />
        </eb-form-field>
      `,
    };
  },
};

/**
 * Field with manual error message
 */
export const WithError: Story = {
  args: {
    label: 'Username',
    required: true,
  },
  render: (args) => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    return {
      props: {
        ...args,
        control,
      },
      template: `
      <eb-form-field #field ${argsToTemplate(args)} [control]="control">
        <eb-input
          type="text"
          placeholder="Enter your username"
          ariaLabel="Username"
          [formControl]="control"
          [validationState]="field.computedValidationState()"
        />
      </eb-form-field>
    `,
    };
  },
};

/**
 * Field with multiple error messages
 */
export const WithMultipleErrors: Story = {
  args: {
    label: 'Password',
    required: true,
  },
  render: (args) => {
    const mustContainNumber = (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value);
      const hasNumber = /\d/.test(value);
      return hasNumber ? null : { mustContainNumber: true };
    };

    const control = new FormControl('abc', [
      Validators.required,
      Validators.minLength(8),
      mustContainNumber,
    ]);
    control.markAsTouched();

    return {
      props: {
        ...args,
        control,
        errorMessages: {
          required: 'Password is required',
          minlength: 'Must be at least {requiredLength} characters',
          mustContainNumber: 'Must contain a number',
        },
      },
      template: `
      <eb-form-field
        #field
        ${argsToTemplate(args)}
        [control]="control"
        [errorMessages]="errorMessages"
      >
        <eb-input
          type="password"
          placeholder="Enter your password"
          ariaLabel="Password"
          [formControl]="control"
          [validationState]="field.computedValidationState()"
        />
      </eb-form-field>
    `,
    };
  },
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
      <eb-form-field #field ${argsToTemplate(args)}>
        <eb-input
          type="email"
          value="user@example.com"
          ariaLabel="Email Address"
          [validationState]="field.computedValidationState()"
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
      <eb-form-field #field ${argsToTemplate(args)}>
        <eb-input
          type="text"
          value="john_doe"
          ariaLabel="Username"
          [validationState]="field.computedValidationState()"
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
  parameters: {
    a11y: {
      config: {
        rules: [
          // Disabled for this story specifically as axe-core cannot resolve
          // CSS variables used in the textarea background correcty.
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
  },
  render: (args) => {
    const control = new FormControl('', [Validators.required, Validators.maxLength(500)]);
    return {
      props: {
        ...args,
        control,
      },
      template: `
      <eb-form-field #field ${argsToTemplate(args)} [control]="control">
        <eb-textarea
          rows="4"
          placeholder="Enter your message"
          ariaLabel="Message"
          [formControl]="control"
          [validationState]="field.computedValidationState()"
        />
      </eb-form-field>
    `,
    };
  },
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
  render: (args) => {
    const control = new FormControl('', Validators.required);
    return {
      props: {
        ...args,
        control,
      },
      template: `
      <eb-form-field #field ${argsToTemplate(args)} [control]="control">
        <eb-select
          ariaLabel="Country"
          placeholder="Select a country"
          [options]="[
            { label: 'United States', value: 'us' },
            { label: 'Canada', value: 'ca' },
            { label: 'United Kingdom', value: 'uk' },
            { label: 'Australia', value: 'au' }
          ]"
          [formControl]="control"
          [validationState]="field.computedValidationState()"
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
          #field
          label="Password"
          [required]="true"
          [control]="passwordControl"
          [errorMessages]="customErrors"
        >
          <eb-input
            type="password"
            [formControl]="passwordControl"
            placeholder="Enter your password"
            ariaLabel="Password"
            [validationState]="field.computedValidationState()"
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
          <p style="margin-bottom: 1rem; color: var(--color-text-secondary);">
            Try clicking into the field and then clicking out to see errors appear.
          </p>
          <eb-form-field
            #field
            label="Username"
            [required]="true"
            [control]="usernameControl"
            [showErrorsOnTouched]="true"
          >
            <eb-input
              type="text"
              [formControl]="usernameControl"
              placeholder="Enter your username"
              ariaLabel="Username"
              [validationState]="field.computedValidationState()"
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
          <p style="margin-bottom: 1rem; color: var(--color-text-secondary);">
            Errors are displayed immediately without requiring the field to be touched.
          </p>
          <eb-form-field
            #field
            label="Username"
            [required]="true"
            [control]="usernameControl"
            [showErrorsOnTouched]="false"
          >
            <eb-input
              type="text"
              [formControl]="usernameControl"
              placeholder="Enter your username"
              ariaLabel="Username"
              [validationState]="field.computedValidationState()"
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
  parameters: {
    a11y: {
      config: {
        rules: [
          // Disabled for this story specifically as axe-core cannot resolve
          // CSS variables used in the textarea background correcty.
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
  },
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
            #nameField
            label="Full Name"
            [required]="true"
            [control]="nameControl"
            helperText="Enter your first and last name"
          >
            <eb-input
              [formControl]="nameControl"
              placeholder="John Doe"
              ariaLabel="Full Name"
              [validationState]="nameField.computedValidationState()"
            />
          </eb-form-field>

          <eb-form-field
            #emailField
            label="Email Address"
            [required]="true"
            [control]="emailControl"
            helperText="We'll never share your email"
          >
            <eb-input
              type="email"
              [formControl]="emailControl"
              placeholder="john@example.com"
              ariaLabel="Email Address"
              [validationState]="emailField.computedValidationState()"
            />
          </eb-form-field>

          <eb-form-field
            #passwordField
            label="Password"
            [required]="true"
            [control]="passwordControl"
            helperText="Must be at least 8 characters"
          >
            <eb-input
              type="password"
              [formControl]="passwordControl"
              placeholder="Enter your password"
              ariaLabel="Password"
              [validationState]="passwordField.computedValidationState()"
            />
          </eb-form-field>

          <eb-form-field
            #bioField
            label="Bio (Optional)"
            [control]="bioControl"
            helperText="Tell us a bit about yourself"
          >
            <eb-textarea
              [formControl]="bioControl"
              rows="4"
              placeholder="I am a..."
              ariaLabel="Bio"
              [validationState]="bioField.computedValidationState()"
            />
          </eb-form-field>

          <button
            type="submit"
            style="padding: 0.5rem 1rem; background: var(--color-primary); color: var(--color-on-primary); border: none; border-radius: 0.375rem; cursor: pointer;"
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
          <p style="margin-bottom: 1rem; color: var(--color-text-secondary); font-size: 0.875rem;">
            This component includes:
          </p>
          <ul style="margin-bottom: 1.5rem; color: var(--color-text-secondary); font-size: 0.875rem; padding-left: 1.5rem;">
            <li>Proper label-to-input association</li>
            <li>ARIA describedby for helper text</li>
            <li>Required field indicator</li>
            <li>Error message announcement</li>
            <li>Keyboard navigation support</li>
          </ul>

          <eb-form-field
            #field
            label="Email Address"
            [required]="true"
            [control]="emailControl"
            helperText="Enter a valid email address"
          >
            <eb-input
              type="email"
              [formControl]="emailControl"
              placeholder="user@example.com"
              [id]="'email-input'"
              ariaLabel="Email Address"
              [validationState]="field.computedValidationState()"
            />
          </eb-form-field>
        </div>
      `,
    };
  },
};
