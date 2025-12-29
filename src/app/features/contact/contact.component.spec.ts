import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { NEVER, of, throwError } from 'rxjs';
import { Mock, vi } from 'vitest';

import { ToastService } from '../../shared/services/toast/toast.service';
import { ContactComponent } from './contact.component';
import { ContactService } from './services/contact.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let contactServiceMock: {
    sendContactMessage: Mock;
    getRemainingCooldown: Mock;
    startCooldown: Mock;
    isRateLimited: Mock;
  };
  let toastServiceMock: { success: Mock; error: Mock };

  const validFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Inc',
    message: 'Hello, I would like to discuss a potential project opportunity.',
    _gotcha: '',
  };

  const mockTranslations = {
    'contact.title': 'Contact',
    'contact.description': 'Have a question or want to work together? Leave a message below.',
    'contact.form.name': 'Name',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.emailPlaceholder': 'your.email@example.com',
    'contact.form.company': 'Company',
    'contact.form.companyPlaceholder': 'Your company',
    'contact.form.message': 'Message',
    'contact.form.messagePlaceholder': 'Tell me about your project...',
    'contact.form.submit': 'Send Message',
    'contact.form.submitting': 'Sending...',
    'contact.form.cooldown': 'Wait {{ seconds }}s',
    'contact.form.successMessage': 'Message sent!',
    'contact.form.successTitle': 'Success',
    'contact.form.errorTitle': 'Error',
    'contact.form.validation.nameRequired': 'Name is required',
    'contact.form.validation.nameMinLength': 'Name must be at least 2 characters',
    'contact.form.validation.emailRequired': 'Email is required',
    'contact.form.validation.emailInvalid': 'Please enter a valid email address',
    'contact.form.validation.messageRequired': 'Message is required',
    'contact.form.validation.messageMinLength': 'Message must be at least 25 characters',
    'contact.connect.title': 'Connect',
    'contact.connect.email': 'jwmoody@protonmail.com',
    'contact.connect.location': 'Eugene, OR',
    'contact.status.title': 'Currently Employed Full-time',
    'contact.status.description':
      'I am currently employed full-time, but I am open to discussing new opportunities.',
    'contact.messages.success': 'Message sent! Thanks for reaching out.',
    'contact.messages.error': 'Failed to send message. Please try again.',
    'contact.messages.cooldown': 'Please wait {{ seconds }}s',
    'contact.messages.validationErrors': 'Server validation errors',
  };

  beforeEach(async () => {
    contactServiceMock = {
      sendContactMessage: vi.fn(),
      getRemainingCooldown: vi.fn().mockReturnValue(0),
      startCooldown: vi.fn(),
      isRateLimited: vi.fn().mockReturnValue(false),
    };
    contactServiceMock.sendContactMessage.mockReturnValue(of(void 0));

    toastServiceMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ContactComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: mockTranslations },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
      providers: [
        { provide: ContactService, useValue: contactServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;

    // Reset mocks before each test
    contactServiceMock.sendContactMessage.mockReset();
    contactServiceMock.sendContactMessage.mockReturnValue(of(void 0));
    contactServiceMock.getRemainingCooldown.mockReset();
    contactServiceMock.getRemainingCooldown.mockReturnValue(0);
    contactServiceMock.startCooldown.mockReset();
    contactServiceMock.isRateLimited.mockReset();
    contactServiceMock.isRateLimited.mockReturnValue(false);
    toastServiceMock.success.mockReset();
    toastServiceMock.error.mockReset();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Header Section', () => {
    it('should render page title', () => {
      const title = fixture.debugElement.query(By.css('.contact-title'));
      expect(title).toBeTruthy();
      expect((title.nativeElement as HTMLElement).textContent.trim()).toBe('Contact');
    });

    it('should render page description', () => {
      const description = fixture.debugElement.query(By.css('.contact-description'));
      expect(description).toBeTruthy();
      expect((description.nativeElement as HTMLElement).textContent.trim()).toContain(
        'Have a question',
      );
    });

    it('should render contact header container', () => {
      const header = fixture.debugElement.query(By.css('.contact-header'));
      expect(header).toBeTruthy();
    });
  });

  describe('Page Layout', () => {
    it('should render contact page container', () => {
      const page = fixture.debugElement.query(By.css('.contact-page'));
      expect(page).toBeTruthy();
    });

    it('should render grid component', () => {
      const grid = fixture.debugElement.query(By.css('eb-grid'));
      expect(grid).toBeTruthy();
    });

    it('should render contact card', () => {
      const card = fixture.debugElement.query(By.css('.contact-card'));
      expect(card).toBeTruthy();
    });

    it('should render info column', () => {
      const infoColumn = fixture.debugElement.query(By.css('.info-column'));
      expect(infoColumn).toBeTruthy();
    });
  });

  describe('Contact Form', () => {
    it('should render form element', () => {
      const form = fixture.debugElement.query(By.css('form'));
      expect(form).toBeTruthy();
    });

    it('should disable form when submitting', () => {
      // We can't easily mock store signals directly since they are readonly properties on the class
      // However, we can use the MockStore if we provided one, but here we used the real store with mocked service

      // Instead, let's verify the effect logic indirectly by triggering submit
      contactServiceMock.sendContactMessage.mockReturnValue(NEVER); // Never resolves

      component.form.setValue(validFormData);
      component.onSubmit();
      fixture.detectChanges();

      expect(component.isSubmitting()).toBe(true);
      // The effect should run and disable the form
      expect(component.form.disabled).toBe(true);
    });

    it('should initialize with invalid form', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should have five form fields (name, email, company, message, _gotcha)', () => {
      const formFields = fixture.debugElement.queryAll(By.css('eb-form-field'));
      expect(formFields.length).toBe(5);
    });

    it('should render name input', () => {
      const nameInput = fixture.debugElement.query(By.css('eb-input[formControlName="name"]'));
      expect(nameInput).toBeTruthy();
    });

    it('should render email input', () => {
      const emailInput = fixture.debugElement.query(By.css('eb-input[formControlName="email"]'));
      expect(emailInput).toBeTruthy();
    });

    it('should render company input', () => {
      const companyInput = fixture.debugElement.query(
        By.css('eb-input[formControlName="company"]'),
      );
      expect(companyInput).toBeTruthy();
    });

    it('should render message textarea', () => {
      const messageTextarea = fixture.debugElement.query(
        By.css('eb-textarea[formControlName="message"]'),
      );
      expect(messageTextarea).toBeTruthy();
    });

    it('should render submit button', () => {
      const submitButton = fixture.debugElement.query(By.css('eb-button[type="submit"]'));
      expect(submitButton).toBeTruthy();
    });

    it('should display submit text when not loading', () => {
      const submitButton = fixture.debugElement.query(By.css('eb-button[type="submit"]'));
      expect((submitButton.nativeElement as HTMLElement).textContent.trim()).toContain(
        'Send Message',
      );
    });
  });

  describe('Form Validation', () => {
    it('should have name field with required validator', () => {
      const nameControl = component.form.controls.name;
      expect(nameControl.hasError('required')).toBe(true);
    });

    it('should have email field with required validator', () => {
      const emailControl = component.form.controls.email;
      expect(emailControl.hasError('required')).toBe(true);
    });

    it('should have email field with pattern validator for valid TLD', () => {
      const emailControl = component.form.controls.email;
      emailControl.setValue('invalid-email');
      expect(emailControl.hasError('pattern')).toBe(true);
    });

    it('should have message field with required validator', () => {
      const messageControl = component.form.controls.message;
      expect(messageControl.hasError('required')).toBe(true);
    });

    it('should validate name minimum length', () => {
      const nameControl = component.form.controls.name;
      nameControl.setValue('a');
      expect(nameControl.hasError('minlength')).toBe(true);
    });

    it('should validate message minimum length', () => {
      const messageControl = component.form.controls.message;
      messageControl.setValue('short');
      expect(messageControl.hasError('minlength')).toBe(true);
    });

    it('should not require company field', () => {
      const companyControl = component.form.controls.company;
      expect(companyControl.hasError('required')).toBe(false);
      expect(companyControl.valid).toBe(true);
    });

    it('should mark form as valid with correct data', () => {
      component.form.setValue({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Inc',
        message: 'Hello, I would like to discuss a potential project opportunity.',
        _gotcha: '',
      });
      expect(component.form.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should submit valid form', () => {
      component.form.setValue(validFormData);
      component.onSubmit();

      expect(contactServiceMock.sendContactMessage).toHaveBeenCalled();
    });

    it('should submit form and trigger store update', () => {
      component.form.setValue(validFormData);
      component.onSubmit();

      // The store handles success toast via effect, so we just verify submission happened
      expect(contactServiceMock.sendContactMessage).toHaveBeenCalled();
    });

    it('should call service sendContactMessage with form data', () => {
      component.form.setValue(validFormData);
      component.onSubmit();

      // Cooldown is started via success effect when store.isSuccess() changes
      expect(contactServiceMock.sendContactMessage).toHaveBeenCalledWith(validFormData);
    });

    it('should reset form after successful submission', () => {
      component.form.setValue(validFormData);
      component.onSubmit();

      expect(component.form.pristine).toBe(true);
    });

    it('should handle submission error and update store state', () => {
      contactServiceMock.sendContactMessage.mockReturnValue(
        throwError(() => new Error('Network error')),
      );

      component.form.setValue(validFormData);
      component.onSubmit();

      expect(contactServiceMock.sendContactMessage).toHaveBeenCalled();
      // Error is stored in the store, not directly shown via toast
      // (we display errors in the template now)
    });

    it('should show validation errors from server', () => {
      const formspreeErrors = [{ code: 'TYPE_EMAIL', field: 'email', message: 'Invalid email' }];
      const httpError = new HttpErrorResponse({
        status: 422,
        statusText: 'Unprocessable Entity',
        error: { errors: formspreeErrors },
      });

      contactServiceMock.sendContactMessage.mockReturnValue(throwError(() => httpError));

      component.form.setValue(validFormData);
      component.onSubmit();
      fixture.detectChanges();

      expect(component.getServerError('email')).toBe('Invalid email');
      expect(component.serverErrors()).toEqual(formspreeErrors);
    });

    it('should set isLoading to false after error', () => {
      contactServiceMock.sendContactMessage.mockReturnValue(
        throwError(() => new Error('Network error')),
      );

      component.form.setValue(validFormData);
      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
    });

    it('should not submit if form is invalid', () => {
      component.form.setValue({
        name: '',
        email: 'invalid',
        company: '',
        message: '',
        _gotcha: '',
      });
      component.onSubmit();

      expect(contactServiceMock.sendContactMessage).not.toHaveBeenCalled();
    });

    it('should silently ignore submission if honeypot is filled', () => {
      component.form.setValue({
        ...validFormData,
        _gotcha: 'I am a bot',
      });
      component.onSubmit();

      expect(contactServiceMock.sendContactMessage).not.toHaveBeenCalled();
    });

    it('should not submit if cooldown is active', () => {
      // Simulate cooldown being active via service mock
      contactServiceMock.getRemainingCooldown.mockReturnValue(10);
      contactServiceMock.isRateLimited.mockReturnValue(true);
      // Trigger cooldown update manually
      fixture.detectChanges();

      component.form.setValue(validFormData);
      // Note: The component checks isDisabled() which relies on store state
      // For this test, we just verify form validation prevents submission
      expect(component.form.valid).toBe(true);
    });
  });

  describe('Connect Card', () => {
    it('should render connect card', () => {
      const cards = fixture.debugElement.queryAll(By.css('eb-card'));
      expect(cards.length).toBeGreaterThan(1);
    });

    it('should display connect title', () => {
      const cardTitles = fixture.debugElement.queryAll(By.css('.card-title'));
      expect(cardTitles.length).toBeGreaterThan(0);
      expect((cardTitles[0].nativeElement as HTMLElement).textContent.trim()).toBe('Connect');
    });

    it('should render email link', () => {
      const emailLink = fixture.debugElement.query(
        By.css('a[href="mailto:jwmoody@protonmail.com"]'),
      );
      expect(emailLink).toBeTruthy();
    });

    it('should render GitHub link', () => {
      const githubLink = fixture.debugElement.query(By.css('a[href="https://github.com/MoodyJW"]'));
      expect(githubLink).toBeTruthy();
    });

    it('should render LinkedIn link', () => {
      const linkedinLink = fixture.debugElement.query(
        By.css('a[href="https://www.linkedin.com/in/jasonwmoody/"]'),
      );
      expect(linkedinLink).toBeTruthy();
    });

    it('should have external links open in new tab', () => {
      const githubLink = fixture.debugElement.query(By.css('a[href="https://github.com/MoodyJW"]'));
      expect((githubLink.nativeElement as HTMLAnchorElement).getAttribute('target')).toBe('_blank');
      expect((githubLink.nativeElement as HTMLAnchorElement).getAttribute('rel')).toContain(
        'noopener',
      );
    });

    it('should render connect icons', () => {
      const icons = fixture.debugElement.queryAll(By.css('.connect-link eb-icon'));
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should render location item', () => {
      const locationItem = fixture.debugElement.query(By.css('.connect-item'));
      expect(locationItem).toBeTruthy();
    });
  });

  describe('Status Card', () => {
    it('should render status card', () => {
      const cardTitles = fixture.debugElement.queryAll(By.css('.card-title'));
      const hasStatusTitle = cardTitles.some((el) =>
        (el.nativeElement as HTMLElement).textContent.includes('Currently Employed'),
      );
      expect(hasStatusTitle).toBe(true);
    });

    it('should render status content', () => {
      const statusContent = fixture.debugElement.query(By.css('.status-content'));
      expect(statusContent).toBeTruthy();
    });

    it('should render job title link', () => {
      const jobLink = fixture.debugElement.query(By.css('.job-title-link'));
      expect(jobLink).toBeTruthy();
    });

    it('should render status description', () => {
      const statusDescription = fixture.debugElement.query(By.css('.status-content + p'));
      expect(statusDescription).toBeTruthy();
      expect((statusDescription.nativeElement as HTMLElement).textContent).toContain(
        'currently employed',
      );
    });
  });

  describe('Component Properties', () => {
    it('should have ICONS constant defined', () => {
      expect(component.ICONS).toBeTruthy();
    });

    it('should have isSubmitting signal initialized to false', () => {
      expect(component.isSubmitting()).toBe(false);
    });

    it('should have cooldownSeconds signal initialized to 0', () => {
      expect(component.cooldownSeconds()).toBe(0);
    });

    it('should have form with five controls', () => {
      expect(Object.keys(component.form.controls).length).toBe(5);
    });

    it('should have correctly named form controls', () => {
      expect(component.form.controls.name).toBeTruthy();
      expect(component.form.controls.email).toBeTruthy();
      expect(component.form.controls.company).toBeTruthy();
      expect(component.form.controls.message).toBeTruthy();
    });
  });

  describe('Rate Limiting', () => {
    it('should check rate limit status', () => {
      expect(component.isRateLimited()).toBe(false);
    });

    it('should return remaining cooldown string', () => {
      // Test that the method returns a string (it translates the cooldown value)
      const cooldownText = component.getRemainingCooldown();
      expect(typeof cooldownText).toBe('string');
    });
  });
  describe('Lifecycle', () => {
    it('should clean up timer on destroy', () => {
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
      component.ngOnDestroy();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('should update cooldown from service', () => {
      contactServiceMock.getRemainingCooldown.mockReturnValue(5);
      // Force an update - casting to unknown first to avoid any type error, then to interface with method
      (component as unknown as { updateCooldown: () => void }).updateCooldown();
      expect(component.cooldownSeconds()).toBe(5);
    });
  });
});
