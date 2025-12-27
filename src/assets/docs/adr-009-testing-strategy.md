# ADR-009: Testing Strategy

## Status

Accepted

## Date

2025-12-21

## Context

A robust enterprise application requires a multi-layered testing strategy to ensure reliability, prevent regressions, and facilitate refactoring. The Angular ecosystem has recently shifted, with the deprecation of Karma/Jasmine in favor of modern, faster web-standard tools.

We need to decide on our testing stack and methodology for:

1. Unit Tests (Component/Service logic)
2. Integration Tests (Component + Template)
3. End-to-End (E2E) Tests (Browser simulation)

### Options Considered

1. **Karma + Jasmine**: The legacy Angular default.
   - _Pros_: Known stable.
   - _Cons_: Slow, browser-based (heavy), complex configuration, being deprecated.
2. **Jest**:
   - _Pros_: Fast (JSDOM), widely used in React.
   - _Cons_: Requires complicated presets for Angular, module mocking issues.
3. **Vitest**:
   - _Pros_: Extremely fast (Vite-based), native ESM support, compatible with Jest API, excellent Angular support via `@angular/build` (experimental) or AnalogJS.
   - _Cons_: Newer ecosystem.

## Decision

We chose **Vitest** for Unit/Integration testing and **Playwright** for E2E testing.

### Rationale

1. **Velocity**: Vitest runs tests significantly faster than Karma, enabling a tighter feedback loop.
2. **Modern Standards**: Vitest uses native ESM, aligning with modern Angular architecture.
3. **Reliability**: Playwright offers auto-waiting mechanisms that reduce "flaky" E2E tests compared to Protractor or Cypress.
4. **Coverage**: We enforce a minimum **85% code coverage** threshold to ensure quality.

## Implementation

### Unit Testing (Vitest)

We test logic in isolation using shallow mounting or direct service instantiation.

```typescript
// Example Service Test
describe('AuthService', () => {
  it('should store token on login', () => {
    const service = new AuthService();
    service.login('token-123');
    expect(localStorage.getItem('token')).toBe('token-123');
  });
});
```

### Integration Testing (Vitest + Angular TestBed)

We use `TestBed` to test component interaction with templates and signals.

```typescript
describe('UserProfileComponent', () => {
  it('should render user name', async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [provideMockUser({ name: 'Alice' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(UserProfileComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Alice');
  });
});
```

### Helper Libraries

- **`ng-mocks`**: Used for easily mocking child components and dependencies to keep unit tests focused.
- **`@testing-library/angular`**: (Optional) For testing behavior rather than implementation details.

### Coverage Reporting

We use **Codecov** for coverage tracking and visualization:

- **CI Integration**: Coverage reports are automatically uploaded after each test run in GitHub Actions.
- **PR Comments**: Codecov provides inline coverage diffs on pull requests, highlighting untested lines.
- **Threshold Enforcement**: The 85% minimum coverage is enforced both locally (Vitest config) and in CI (Codecov checks).

## Consequences

### Positive

- **Speed**: Full test suite runs in seconds, not minutes.
- **Debugging**: Tests run in Node.js (Vitest) or Headless Browser (Playwright), making CI integration smoother.
- **Stability**: Playwright's distinct execution context provides true E2E validation.

### Negative

- **Migration**: Old tutorials often assume Jasmine syntax (e.g., `jasmine.createSpyObj` vs `vi.fn`). We must educate the team on Vitest equivalents.
- **Tooling Maturity**: Official Angular support for Vitest is still evolving, requiring some manual configuration in `vitest.config.ts`.

### Neutral

- **Emerging Angular Standard**: Vitest is rapidly becoming the community-preferred testing framework as Karma is officially deprecated.
- **Cross-Framework Skill**: Vitest knowledge transfers to React, Vue, and other modern frameworks, making it valuable beyond Angular.

## References

- [Vitest Documentation](https://vitest.dev/)
- [Playwright for Angular](https://playwright.dev/docs/intro)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Codecov Documentation](https://docs.codecov.com/)
