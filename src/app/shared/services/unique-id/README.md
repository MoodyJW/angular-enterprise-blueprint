# UniqueIdService

> **Last Updated**: December 6, 2025  
> **Status**: Production Ready  
> **Test Coverage**: 100%

Service for generating unique, accessible IDs for form components and UI elements. Ensures unique IDs across the application, supporting prefix-based counters and reset methods for testing.

## Features

- ✅ **Prefix-Based IDs**: Generate unique IDs with custom prefixes (e.g., `input-1`, `checkbox-2`)
- ✅ **Separate Counters**: Maintains independent counters for each prefix
- ✅ **Reset Methods**: Reset individual or all counters (useful for tests)
- ✅ **Type-safe**: Full TypeScript type safety
- ✅ **Provided in Root**: Available app-wide for all components

## Usage

### Inject and Use the Service

```typescript
import { Component, inject } from '@angular/core';
import { UniqueIdService } from '@shared/services/unique-id/unique-id.service';

@Component({
  selector: 'eb-my-component',
  // ...
})
export class MyComponent {
  private uniqueId = inject(UniqueIdService);

  ngOnInit() {
    const id = this.uniqueId.generateId('input'); // 'input-1'
  }
}
```

### Generate Unique IDs

```typescript
const id1 = uniqueIdService.generateId(); // 'component-1'
const id2 = uniqueIdService.generateId('input'); // 'input-1'
const id3 = uniqueIdService.generateId('input'); // 'input-2'
```

### Reset Counters (Testing)

```typescript
uniqueIdService.resetCounter('input'); // Resets 'input' counter
uniqueIdService.resetAllCounters(); // Resets all counters
```

## API

### `generateId(prefix?: string): string`

Generates a unique ID string with the given prefix (default: `'component'`).

### `resetCounter(prefix: string): void`

Resets the counter for the specified prefix.

### `resetAllCounters(): void`

Resets all counters.

## Accessibility

- Use this service to generate unique IDs for form elements, labels, and ARIA attributes.
- Ensures proper association between labels and controls for screen readers.

## Testing

- See `unique-id.service.spec.ts` for comprehensive unit tests.
- All methods and edge cases are covered.

## License

This project is licensed under the MIT License.
