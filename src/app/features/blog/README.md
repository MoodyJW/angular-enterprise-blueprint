# Blog Feature

The Blog feature is a standalone module designed to display engineering articles and architectural decisions. It leverages modern Angular features like **Signals** and **SignalStore** for state management and **Markdown** for content rendering.

## Architecture

### State Management (`BlogStore`)

The feature uses `ngrx/signals` to manage state. The `BlogStore` handles:

- **Loading**: Fetching articles from `assets/data/blog-articles.json`.
- **Filtering**: Managing search queries and category filters.
- **Selection**: Retrieving individual articles by slug.
- **Computed State**: Automatically updating filtered results based on current search/filter criteria.

### Components

- **`BlogListComponent`**:
  - Displays a grid of article cards.
  - Includes search functionality and category filtering.
  - Uses shared `feature-card-layout` styles for consistency with other lists.
- **`BlogDetailComponent`**:
  - Renders the full article content using `ngx-markdown`.
  - Supporting standard typography and code highlighting.
  - Encapsulated within a "paper-like" card view.

### Routing

configured in `blog.routes.ts`:

- `/`: Displays the `BlogListComponent`.
- `/:slug`: Displays the `BlogDetailComponent` for the matching article.

## Data Source

Articles are defined in `src/assets/data/blog-articles.json`. This static file acts as a lightweight CMS.
Each article entry includes:

- `id`, `slug`, `title`, `subtitle`
- `publishedAt`: ISO date string.
- `content`: Path to the markdown file or raw markdown content (currently using raw content in some contexts or separate MD files).
- `tags`: Array of related topics.
- `readingTimeMinutes`: Estimated read time.

## Key Features

- **Markdown Rendering**: Securely renders markdown content with syntax highlighting support.
- **Performance**: Uses `OnPush` change detection and Signals for fine-grained reactivity.
- **Accessibility**:
  - Semantic HTML structure (`article`, `header`, `main`).
  - Keyboard navigable cards.
  - Proper ARIA labels on interactive elements.
- **Internationalization**: Fully integrated with `Transloco` for multi-language support (en/es).
