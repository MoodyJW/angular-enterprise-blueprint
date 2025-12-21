# Debounce and Throttle Utilities

Provides debouncing and throttling for standalone functions with full type safety. For RxJS streams, use `debounceTime` and `throttleTime` operators directly from `rxjs/operators`.

## Features

- **Debounce**: Delay function execution until after a wait period
- **Throttle**: Limit function execution to once per time period
- **Type Safety**: Full TypeScript support with generics
- **Zero Dependencies**: Pure TypeScript implementation
- **Cancel/Flush Support**: Control pending executions

## Quick Start

```typescript
import { debounce, throttle } from '@shared/utilities/debounce-throttle/debounce-throttle.utils';

// Debounce search input
const debouncedSearch = debounce((query: string) => {
  this.search(query);
}, 300);

// Throttle scroll handler
const throttledScroll = throttle(() => {
  this.handleScroll();
}, 100);
```

## API Reference

### Debounce

#### `debounce<T>(func: T, wait: number, options?: DebounceOptions): DebouncedFunction<T>`

Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time it was invoked.

**Options:**

- `leading?: boolean` - Execute on the leading edge (default: false)
- `trailing?: boolean` - Execute on the trailing edge (default: true)
- `maxWait?: number` - Maximum time func is allowed to be delayed before forced execution

**Methods:**

- `cancel()` - Cancel pending execution
- `flush()` - Immediately execute pending invocation
- `pending()` - Check if execution is pending

**Examples:**

```typescript
// Basic debounce (trailing edge)
const debouncedSave = debounce((data: unknown) => {
  this.saveData(data);
}, 500);

// Type in form...
input.addEventListener('input', (e) => debouncedSave(e.target.value));
// saveData called 500ms after last keystroke

// Leading edge execution
const debouncedSubmit = debounce(handleSubmit, 1000, {
  leading: true,
  trailing: false,
});
// Executes immediately on first call, ignores subsequent calls for 1s

// With maxWait
const debouncedScroll = debounce(handleScroll, 100, {
  maxWait: 500,
});
// Executes at least once every 500ms, even if continuously called

// Cancel pending execution
debouncedSave.cancel();

// Flush immediately
debouncedSave.flush();

// Check if pending
if (debouncedSave.pending()) {
  console.log('Execution is pending');
}
```

**Angular Component Example:**

```typescript
@Component({
  selector: 'app-search',
  template: ` <input (input)="onSearch($event.target.value)" /> `,
})
export class SearchComponent {
  private debouncedSearch = debounce((query: string) => {
    this.searchService.search(query).subscribe((results) => {
      this.results = results;
    });
  }, 300);

  onSearch(query: string) {
    this.debouncedSearch(query);
  }

  ngOnDestroy() {
    this.debouncedSearch.cancel();
  }
}
```

### Throttle

#### `throttle<T>(func: T, wait: number, options?: ThrottleOptions): DebouncedFunction<T>`

Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.

**Options:**

- `leading?: boolean` - Execute on the leading edge (default: true)
- `trailing?: boolean` - Execute on the trailing edge (default: false)

**Methods:**

- `cancel()` - Cancel pending execution
- `flush()` - Immediately execute pending invocation
- `pending()` - Check if execution is pending

**Examples:**

```typescript
// Basic throttle (leading edge)
const throttledResize = throttle(() => {
  this.handleResize();
}, 200);

window.addEventListener('resize', throttledResize);
// handleResize executes immediately, then at most once per 200ms

// Trailing edge execution
const throttledScroll = throttle(handleScroll, 100, {
  leading: false,
  trailing: true,
});
// Executes after scrolling stops for 100ms

// Both edges
const throttledInput = throttle(handleInput, 300, {
  leading: true,
  trailing: true,
});
// Executes immediately, then again after 300ms if still being called
```

**Angular Component Example:**

```typescript
@Component({
  selector: 'app-infinite-scroll',
  template: `<div (scroll)="onScroll()">...</div>`,
})
export class InfiniteScrollComponent {
  private throttledScroll = throttle(() => {
    this.loadMore();
  }, 200);

  onScroll() {
    this.throttledScroll();
  }

  ngOnDestroy() {
    this.throttledScroll.cancel();
  }
}
```

## RxJS Streams

For Observable streams, use the built-in RxJS operators directly:

```typescript
import { debounceTime, throttleTime } from 'rxjs/operators';

// Debounce form control
this.searchControl.valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((query) => this.searchService.search(query)),
  )
  .subscribe((results) => {
    this.results = results;
  });

// Throttle scroll events
fromEvent(window, 'scroll')
  .pipe(
    throttleTime(100),
    map(() => window.scrollY),
  )
  .subscribe((scrollY) => {
    this.handleScroll(scrollY);
  });
```

## Best Practices

### 1. Choose the Right Tool

```typescript
// Use debounce for user input (search, forms)
const debouncedSearch = debounce(search, 300);

// Use throttle for events that fire continuously (scroll, resize, mousemove)
const throttledScroll = throttle(handleScroll, 100);

// Use RxJS operators for Observable streams
searchControl.valueChanges.pipe(debounceTime(300));
```

### 2. Clean Up Resources

```typescript
@Component({...})
export class MyComponent implements OnDestroy {
  private debouncedSave = debounce(this.save, 500);

  ngOnDestroy() {
    // Cancel pending executions
    this.debouncedSave.cancel();
  }
}
```

### 3. Set Appropriate Wait Times

```typescript
// User input: 200-500ms
const debouncedInput = debounce(handleInput, 300);

// Scroll/resize: 50-200ms
const throttledScroll = throttle(handleScroll, 100);

// API calls: 500-2000ms
const debouncedApi = debounce(apiCall, 1000);

// Autocomplete: 150-300ms
const debouncedAutocomplete = debounce(autocomplete, 250);
```

### 4. Use Leading Edge Appropriately

```typescript
// Leading edge for immediate feedback
const debouncedSubmit = debounce(submit, 1000, {
  leading: true,
  trailing: false,
});

// Trailing edge for batch operations
const debouncedSave = debounce(save, 500, {
  leading: false,
  trailing: true,
});

// Both edges for comprehensive handling
const throttledUpdate = throttle(update, 200, {
  leading: true,
  trailing: true,
});
```

## Performance Notes

- `debounce`: O(1) for each invocation
- `throttle`: O(1) for each invocation

Memory usage:

- Debounced/throttled functions keep one timer reference
- Timer is automatically cleaned up after execution
