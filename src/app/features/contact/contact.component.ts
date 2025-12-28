import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { heroBriefcase, heroEnvelope, heroMapPin } from '@ng-icons/heroicons/outline';
import { ionLogoGithub, ionLogoLinkedin } from '@ng-icons/ionicons';
import { finalize } from 'rxjs';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { GridComponent } from '../../shared/components/grid/grid.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { StackComponent } from '../../shared/components/stack/stack.component';
import { TextareaComponent } from '../../shared/components/textarea/textarea.component';
import { ICON_NAMES } from '../../shared/constants/icon-names.constants';
import { ToastService } from '../../shared/services/toast/toast.service';
import { ContactService } from './services/contact.service';

/**
 * Contact page component.
 *
 * Displays "Hire Me" lead generation form with real email submission.
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
  ],
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
export class ContactComponent {
  private readonly contactService = inject(ContactService);
  private readonly toastService = inject(ToastService);
  private readonly translocoService = inject(TranslocoService);
  private readonly formBuilder = inject(FormBuilder);
  readonly ICONS = ICON_NAMES;

  readonly isLoading = signal(false);
  readonly cooldownSeconds = signal(0);

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
        (control: AbstractControl) => Validators.email(control),
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
  });

  // Form state management
  private readonly _formStateEffect = effect(() => {
    const shouldDisable = this.isLoading() || this.cooldownSeconds() > 0;
    if (shouldDisable) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  });

  constructor() {
    // Update cooldown every second
    setInterval(() => {
      this.updateCooldown();
    }, 1000);
  }

  private updateCooldown(): void {
    const remaining = this.contactService.getRemainingCooldown();
    this.cooldownSeconds.set(remaining);

    if (remaining > 0 && this.form.enabled) {
      this.form.disable({ emitEvent: false });
    } else if (remaining === 0 && this.form.disabled && !this.isLoading()) {
      this.form.enable({ emitEvent: false });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading() || this.cooldownSeconds() > 0) {
      return;
    }

    this.isLoading.set(true);
    this.form.disable();

    const data = this.form.getRawValue();
    // Ensure form data matches ContactFormData interface (no nulls)
    const formData = {
      name: data.name ?? '',
      email: data.email ?? '',
      company: data.company ?? '',
      message: data.message ?? '',
    };

    this.contactService
      .sendContactMessage(formData)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.success(this.translocoService.translate('contact.messages.success'));
          this.contactService.startCooldown();
          this.form.reset();
          this.form.disable();
        },
        error: (err: unknown) => {
          const error = err as Error;
          const errorMessage =
            error.message !== ''
              ? error.message
              : this.translocoService.translate('contact.messages.error');
          this.toastService.error(errorMessage);
          this.isLoading.set(false);
        },
      });
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
