# ADR-012: Form Management Pattern

## Status

Accepted

## Date

2025-12-24

## Context

Forms are the primary interaction point in enterprise apps. We need a consistent way to handle inputs, validation, error messaging, and accessibility across the application.

### Options Considered

1. **Template-Driven Forms**: `[(ngModel)]`.
   - _Pros_: Simple for tiny forms.
   - _Cons_: Hard to test unit-tests, logic leaks into templates, less control over validation timing.
2. **Reactive Forms**: `FormGroup`, `FormControl`.
   - _Pros_: Immutable state snapshot, easy to test, predictable flow, dynamic form manipulation.
   - _Cons_: More boilerplate syntax.
3. **Form Libraries**: external form generators (e.g., Formly).
   - _Pros_: Schema-driven.
   - _Cons_: Loss of layout control, abstraction overhead.

## Decision

We chose **Reactive Forms** combined with **Custom ControlValueAccessor Components**.

### Rationale

1. **Testability**: We can test validation logic without rendering DOM.
2. **Reusability**: We built custom inputs (Checkbox, Select, Input) that implement `ControlValueAccessor`, allowing them to be plugged into any Reactive Form seamlessly.
3. **Scalability**: Complex cross-field validation is trivial in Reactive Forms compared to Template-Driven.

## Implementation

### Custom Input Component

```typescript
@Component({
  selector: 'eb-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  // Implements writeValue, registerOnChange, registerOnTouched
}
```

### Usage

```typescript
this.loginForm = this.fb.nonNullable.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required]],
});
```

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <eb-input formControlName="email" label="Email"></eb-input>
  <eb-input formControlName="password" type="password" label="Password"></eb-input>
</form>
```

## Consequences

### Positive

- **Consistency**: All forms look and behave the same.
- **Quality**: Accessibility (ARIA labels, error connections) is baked into the custom components.

### Negative

- **Learning Curve**: Junior developers often find `ControlValueAccessor` intimidating to implement initially.
- **Boilerplate**: Reactive forms require more setup code compared to template-driven forms for simple use cases.

### Neutral

- **Angular Recommendation**: Reactive forms are Angular's recommended approach for enterprise applications with complex validation requirements.
- **Skillset Transferability**: Reactive form knowledge applies directly to other reactive programming contexts (RxJS, Redux).

## References

- [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [ControlValueAccessor API](https://angular.dev/api/forms/ControlValueAccessor)
