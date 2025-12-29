import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { heroBriefcase, heroEnvelope, heroMapPin } from '@ng-icons/heroicons/outline';
import { ionLogoGithub, ionLogoLinkedin } from '@ng-icons/ionicons';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { GridComponent } from '../../shared/components/grid/grid.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { StackComponent } from '../../shared/components/stack/stack.component';
import { TextareaComponent } from '../../shared/components/textarea/textarea.component';
import { TooltipDirective } from '../../shared/components/tooltip/tooltip.directive';
import { ICON_NAMES } from '../../shared/constants/icon-names.constants';
import { ToastService } from '../../shared/services/toast/toast.service';
import type { ContactFormData } from './models';
import { ContactService } from './services/contact.service';
import { ContactStore } from './state';

/**
 * Stricter email pattern that requires a valid TLD (at least 2 characters after the dot).
 * This catches emails like `test@test` which Angular's built-in validator allows.
 */
const STRICT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact page component.
 *
 * Displays "Hire Me" lead generation form with real email submission.
 * Uses ContactStore for state management and displays server-side validation errors.
 */
@Component({
  selector: 'eb-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    ButtonComponent,
    CardComponent,
    FormFieldComponent,
    GridComponent,
    IconComponent,
    InputComponent,
    StackComponent,
    TextareaComponent,
    TooltipDirective,
  ],
  providers: [ContactStore],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      heroBriefcase,
      heroEnvelope,
      heroMapPin,
      ionLogoGithub,
      ionLogoLinkedin,
    }),
  ],
})
export class ContactComponent implements OnDestroy {
  private readonly contactService = inject(ContactService);
  private readonly contactStore = inject(ContactStore);
  private readonly toastService = inject(ToastService);
  private readonly translocoService = inject(TranslocoService);
  private readonly formBuilder = inject(FormBuilder);
  private cooldownTimer: ReturnType<typeof setInterval> | null = null;

  readonly ICONS = ICON_NAMES;

  // Expose store signals to template
  readonly isSubmitting = this.contactStore.isSubmitting;
  readonly isSuccess = this.contactStore.isSuccess;
  readonly serverErrors = this.contactStore.serverErrors;
  readonly hasServerErrors = this.contactStore.hasServerErrors;
  readonly generalError = this.contactStore.generalError;
  readonly cooldownSeconds = this.contactStore.cooldownSeconds;
  readonly isDisabled = this.contactStore.isDisabled;

  readonly form = this.formBuilder.group({
    name: [
      '',
      [
        (control: AbstractControl) => Validators.required(control),
        (control: AbstractControl) => Validators.minLength(2)(control),
      ],
    ],
    email: [
      '',
      [
        (control: AbstractControl) => Validators.required(control),
        (control: AbstractControl) => Validators.pattern(STRICT_EMAIL_PATTERN)(control),
      ],
    ],
    company: [''],
    message: [
      '',
      [
        (control: AbstractControl) => Validators.required(control),
        (control: AbstractControl) => Validators.minLength(25)(control),
      ],
    ],
    // Honeypot field - should remain empty
    _gotcha: [''],
  });

  // Form state management - disable when submitting or in cooldown
  private readonly _formStateEffect = effect(() => {
    const shouldDisable = this.isDisabled();
    if (shouldDisable) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  });

  // Show success toast when submission succeeds
  private readonly _successEffect = effect(() => {
    if (this.isSuccess()) {
      this.toastService.success(this.translocoService.translate('contact.messages.success'));
      this.contactService.startCooldown();
      this.form.reset();
    }
  });

  constructor() {
    // Update cooldown every second
    this.cooldownTimer = setInterval(() => {
      this.updateCooldown();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.cooldownTimer !== null) {
      clearInterval(this.cooldownTimer);
    }
  }

  private updateCooldown(): void {
    const remaining = this.contactService.getRemainingCooldown();
    this.contactStore.setCooldown(remaining);
  }

  onSubmit(): void {
    const rawData = this.form.getRawValue();

    // Honeypot check: If _gotcha is filled, silent return (bot detected)
    if ((rawData._gotcha?.length ?? 0) > 0) {
      return;
    }

    if (this.form.invalid || this.isDisabled()) {
      return;
    }

    this.contactStore.clearErrors();

    const data = this.form.getRawValue();
    const formData: ContactFormData = {
      name: data.name ?? '',
      email: data.email ?? '',
      company: data.company ?? '',
      message: data.message ?? '',
      _gotcha: data._gotcha ?? '',
    };

    this.contactStore.submitForm(formData);
  }

  /**
   * Get server-side error for a specific field.
   */
  getServerError(field: string): string | null {
    const errors = this.serverErrors();
    const error = errors.find((e) => e.field === field);
    return error?.message ?? null;
  }

  isRateLimited(): boolean {
    return this.contactService.isRateLimited();
  }

  getRemainingCooldown(): string {
    return this.translocoService.translate('contact.messages.cooldown', {
      seconds: this.cooldownSeconds(),
    });
  }
}
