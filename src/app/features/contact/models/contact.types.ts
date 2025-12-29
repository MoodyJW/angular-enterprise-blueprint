/**
 * Formspree validation error for a single field.
 */
export interface FormspreeFieldError {
  code: string;
  field: string;
  message: string;
}

/**
 * Formspree 422 error response structure.
 */
export interface FormspreeErrorResponse {
  error: string;
  errors: FormspreeFieldError[];
}

/**
 * Contact form data submitted to Formspree.
 */
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  _gotcha?: string;
}
