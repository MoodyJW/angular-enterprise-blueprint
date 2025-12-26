# Architecture Feature

The Architecture feature displays Architecture Decision Records (ADRs) documenting key technical decisions in the blueprint.

## Purpose

This feature serves as a documentation viewer for ADRs written in Markdown format. It demonstrates:

- Signal-based state management with NgRx SignalStore
- Lazy-loaded routes with sidebar navigation
- Markdown content fetching and display
- Two-column layout with list/detail pattern

## State

**Store:** `ArchitectureStore` (`@ngrx/signals`)

- `entities: Adr[]` - All loaded ADR metadata
- `selectedId: string | null` - Currently selected ADR
- `content: string` - Markdown content of selected ADR
- `isLoading: boolean` - Loading state for list
- `isLoadingContent: boolean` - Loading state for content
- `error: string | null` - Error message if loading fails
- `selectedAdr()` - Computed: currently selected ADR object
- `getAdrById()` - Computed: function to get ADR by ID

## Routes

| Path                | Component               | Description           |
| ------------------- | ----------------------- | --------------------- |
| `/architecture`     | `ArchitectureComponent` | ADR list with sidebar |
| `/architecture/:id` | `AdrViewerComponent`    | ADR content viewer    |

## Key Components

### ArchitectureComponent

The main page featuring:

- Two-column layout (sidebar + content)
- List of ADR cards with status badges
- Loading and error states

### AdrViewerComponent

The detail viewer featuring:

- ADR header with number, status, and date
- Markdown content rendered in `<pre>` tag
- Back navigation to list

## Data Sources

- **Metadata:** `src/assets/data/architecture.json`
- **Content:** `src/assets/docs/{adr-id}.md`

### Adr Interface

```typescript
interface Adr {
  id: string;
  number: string;
  title: string;
  status: 'accepted' | 'deprecated' | 'superseded';
  date: string;
  summary: string;
}
```
