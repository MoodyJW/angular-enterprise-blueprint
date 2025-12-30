import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import type { ContactFormData, FormspreeFieldError } from '@features/contact/models';
import { ContactService } from '@features/contact/services/contact.service';

/**
 * State shape for the contact store.
 */
type ContactState = {
  isSubmitting: boolean;
  isSuccess: boolean;
  serverErrors: FormspreeFieldError[];
  generalError: string | null;
  cooldownSeconds: number;
};

const initialState: ContactState = {
  isSubmitting: false,
  isSuccess: false,
  serverErrors: [],
  generalError: null,
  cooldownSeconds: 0,
};

/**
 * Contact store using NgRx SignalStore.
 *
 * Manages contact form submission state, including:
 * - Loading/submitting state
 * - Server-side validation errors from Formspree
 * - Success/failure states
 * - Rate limiting cooldown
 *
 * @example
 * ```typescript
 * const store = inject(ContactStore);
 *
 * // Submit form
 * store.submitForm(formData);
 *
 * // Check state
 * store.isSubmitting();
 * store.serverErrors();
 * store.hasServerErrors();
 * ```
 */
export const ContactStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    /**
     * Whether there are any server-side validation errors.
     */
    hasServerErrors: computed(() => store.serverErrors().length > 0),

    /**
     * Whether the form is currently disabled (submitting or in cooldown).
     */
    isDisabled: computed(() => store.isSubmitting() || store.cooldownSeconds() > 0),

    /**
     * Get server error for a specific field.
     */
    getFieldError: computed(() => (field: string) => {
      const errors = store.serverErrors();
      return errors.find((e) => e.field === field)?.message ?? null;
    }),
  })),
  withMethods((store, contactService = inject(ContactService)) => ({
    /**
     * Submit contact form to Formspree.
     */
    submitForm: rxMethod<ContactFormData>(
      pipe(
        tap(() => {
          patchState(store, {
            isSubmitting: true,
            isSuccess: false,
            serverErrors: [],
            generalError: null,
          });
        }),
        switchMap((formData) =>
          contactService.sendContactMessage(formData).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  isSubmitting: false,
                  isSuccess: true,
                  serverErrors: [],
                  generalError: null,
                });
              },
              error: (error: HttpErrorResponse | Error) => {
                if (error instanceof HttpErrorResponse && error.status === 422) {
                  // Formspree validation errors
                  const body = error.error as { errors?: FormspreeFieldError[] } | undefined;
                  patchState(store, {
                    isSubmitting: false,
                    isSuccess: false,
                    serverErrors: body?.errors ?? [],
                    generalError: 'Validation errors',
                  });
                } else {
                  // Generic error
                  const message = error instanceof Error ? error.message : 'Failed to send message';
                  patchState(store, {
                    isSubmitting: false,
                    isSuccess: false,
                    serverErrors: [],
                    generalError: message,
                  });
                }
              },
            }),
          ),
        ),
      ),
    ),

    /**
     * Clear all errors.
     */
    clearErrors(): void {
      patchState(store, { serverErrors: [], generalError: null });
    },

    /**
     * Reset the store to initial state.
     */
    reset(): void {
      patchState(store, initialState);
    },

    /**
     * Set the cooldown timer.
     */
    setCooldown(seconds: number): void {
      patchState(store, { cooldownSeconds: seconds });
    },

    /**
     * Decrement cooldown by 1 second.
     */
    tickCooldown(): void {
      const current = store.cooldownSeconds();
      if (current > 0) {
        patchState(store, { cooldownSeconds: current - 1 });
      }
    },
  })),
);
