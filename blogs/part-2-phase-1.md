# Phase 1: Building the Enterprise Rig

## Tooling, Governance, and the Foundation That Makes Everything Else Possible

In the [previous article](https://dev.to/moodyjw/building-a-portfolio-that-actually-demonstrates-enterprise-skills-intro-5hlm), I outlined my approach to building a [portfolio that demonstrates enterprise-level skills](https://moodyjw.github.io/angular-enterprise-blueprint/). The core idea is simple: treat a personal project with the same rigor you would apply to production software. That starts with [Phase 1](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/docs/specs/PHASE_1_SETUP.md), which I call the "Enterprise Rig." This is the foundation of tooling, governance, and automation that everything else builds upon.

Before writing a single line of feature code, I spent time establishing the rules of engagement. Linting, formatting, testing, documentation, and [CI/CD pipelines](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/.github/workflows) all needed to be in place. The principle guiding this phase is ["shift left,"](https://en.wikipedia.org/wiki/Shift-left_testing) meaning we catch (most) errors, style violations, and bad commits on the developer's machine before they ever reach the CI server or, worse, production.

This article explains the decisions I made during Phase 1, why I made them, and what I learned along the way.

## Workspace Configuration: Starting Strict

[Angular 21](https://angular.dev/events/v21) ships with sensible defaults, but enterprise projects need stricter constraints. The first decision was enabling every strictness option available.

In [`angular.json`](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/angular.json), strict mode is enabled globally. This turns on strict template type checking, strict property initialization, and other TypeScript strictness flags. These settings catch entire categories of bugs at compile time that would otherwise surface at runtime. The short-term cost is that you write slightly more explicit code. The long-term benefit is that refactoring becomes safer and the codebase stays maintainable as it grows.

I also changed the component selector prefix from the default `app` to `eb` (Enterprise Blueprint). This prevents naming collisions if someone integrates these components into another project, and it makes it immediately clear which components belong to this codebase when reading templates.

For styling, I chose SCSS over plain CSS. The decision was practical: SCSS offers variables, nesting, and mixins that make maintaining a design system significantly easier. When you are building a [component library with multiple themes](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/app/shared/components), plain CSS becomes unwieldy quickly. Not to mention, SCSS is the de facto standard for Angular projects.

Package management uses npm with engine constraints in [`package.json`](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/package.json). The project requires Node 20+ and npm 10+. This prevents developers from accidentally running the build with outdated tooling that might produce subtly different results. Version mismatches across a team are a common source of "works on my machine" problems, and engine constraints eliminate that class of issues entirely. I highly recommend using [Node Version Manager (nvm)](https://www.nvmnode.com/) to manage Node versions if you find yourself working on multiple projects with different Node versions.

## ESLint: The Flat Config and Architectural Boundaries

[ESLint configuration](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/eslint.config.mjs) was one of the more interesting parts of Phase 1. The JavaScript ecosystem recently shifted from the legacy `.eslintrc` format to the new "flat config" format. I decided to use flat config from the start rather than dealing with a migration later. Although I did end up (accidentally) using the deprecated tseslint `config()` as opposed to `defineConfig()`, but this will change in the future.

The flat config format uses `eslint.config.mjs` and exports an array of configuration objects. Each object can target specific file patterns, extend other configs, and define rules. The mental model is cleaner than the legacy format's cascading inheritance, and it plays better with TypeScript tooling.

The configuration extends `typescript-eslint`'s strict type-checked preset along with [Angular ESLint's recommended rules](https://github.com/angular-eslint/angular-eslint). This combination enables rules that require type information, like `no-floating-promises` (catching unhandled promise rejections) and `no-misused-promises` (preventing promises in places that expect synchronous code). These rules have caught real bugs in my professional work.

Beyond the standard rules, I added several strict TypeScript rules that I consider non-negotiable for enterprise code:

- `no-explicit-any` prevents the `any` type entirely. If you need to represent an unknown type, use `unknown` and narrow it properly. I've had nightmares dealing with `any` types in the past.
- `explicit-function-return-type` requires return type annotations on functions. This catches cases where TypeScript infers a broader type than you intended.
- `strict-boolean-expressions` prevents truthy/falsy coercion in conditions. You must explicitly check for null, undefined, empty strings, or zero.
- `no-unnecessary-condition` catches conditions that are always true or always false based on the types.

These rules add friction when writing code, but they eliminate entire categories of subtle bugs. The investment pays off quickly on any project that will be maintained over time.

The most important plugin is [`eslint-plugin-boundaries`](https://www.npmjs.com/package/eslint-plugin-boundaries). This plugin enforces architectural layering at the import level. The configuration defines five element types: entry points, app root files, core modules, features, and shared modules. Then it defines rules about which types can import from which:

- Entry points (like [`main.ts`](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/main.ts)) can only import from app root files
- App root files can import from anywhere
- Core modules can import from other core modules and shared
- Features can import from core, shared, and the same feature, but not from other features
- Shared can only import from other shared modules

![Figure 1: The unidirectional data flow enforced by ESLint. Features (Green) can consume Core and Shared, but never other Features](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h0k50dh9kao2zwwoqbl5.png)

That last rule is critical. Features cannot import from other features. This prevents the spaghetti dependencies that make large codebases unmaintainable. If two features need to share logic, that logic must move to shared or core. The boundaries are enforced automatically on every lint run, which means they cannot be accidentally violated during a rushed PR. Teams often use tools like Nx to enforce these boundaries, but I prefer to keep the configuration simple and focused on code quality.

For HTML templates, the configuration extends Angular ESLint's template accessibility rules. These catch common accessibility issues like missing alt text, improper ARIA usage, and form elements without labels. Accessibility enforcement at the linting level means these issues are caught before code review, not during manual QA. One common mistake I should have included earlier was checking the hierarchy of headings to ensure proper nesting, but I did not consider it until I was optimizing near the end of the project. I ended up adding it to the configuration in the final phase using a custom rule and also including markdown linting with `markdownlint-cli2`.

## Prettier and Import Organization

Formatting is handled by [Prettier](https://prettier.io/) with a simple configuration: single quotes, trailing commas, 2-space indentation, and a 100-character line width. The specific choices matter less than the consistency. Every file in the repository follows the same formatting rules, which eliminates bike-shedding in code reviews and makes diffs cleaner.

The [`prettier-plugin-organize-imports`](https://www.npmjs.com/package/prettier-plugin-organize-imports) plugin automatically sorts and groups imports on every format. This eliminates manual import organization and ensures imports follow a consistent pattern across the codebase. It also removes unused imports automatically, which keeps files clean.

The integration with ESLint is intentionally minimal. Prettier handles formatting, ESLint handles code quality. Mixing the two leads to conflicts and slower lint runs. The configuration runs them separately: ESLint with `--fix` for auto-fixable issues, then Prettier for formatting.

## Git Hooks: Enforcing Quality Before Commit

[Husky](https://www.npmjs.com/package/husky) manages Git hooks with two key hooks configured: `pre-commit` and `commit-msg`.

The `pre-commit` hook runs `lint-staged`, which executes linting and formatting only on staged files. This keeps the hook fast even in large codebases. For TypeScript and HTML files, it runs ESLint with auto-fix followed by Prettier. For SCSS, JSON, Markdown, and JavaScript config files, it runs only Prettier. The staged files are automatically re-staged after fixes, so the commit includes the corrected versions.

![Figure 2: Husky intercepts a bad commit before it leaves my machine. Quality is enforced at the source.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pjpooryn30mvj5tqq5hw.png)

The `commit-msg` hook runs [Commitlint](https://commitlint.js.org/) to enforce conventional commit messages. Every commit must start with a type (`feat`, `fix`, `docs`, `refactor`, etc.) followed by a scope and description. This convention enables automated changelog generation in Phase 6 and makes the Git history readable. When you can scan commit messages and understand what changed without reading diffs, code archaeology becomes much easier. I can't say I followed this standard very well in the early stages, but I did follow it in the later parts of the project.

The combination of these hooks means that by the time code reaches the remote repository, it has already passed linting, formatting, and commit message validation. The CI pipeline rarely fails for style issues because those issues never make it past the developer's machine.

## Testing: Vitest for Units, Playwright for E2E

Angular historically shipped with Karma and Jasmine for unit testing. [Starting with Angular 21, the framework includes Vitest as the default test runner.](https://angular.dev/guide/testing/migrating-to-vitest)

I stuck with Vitest for unit testing. Vitest is fast, has excellent TypeScript support, and provides a better developer experience than Karma. The watch mode is nearly instant, the error messages are clearer, and the configuration is simpler. It uses the same configuration format as Vite, which means less tooling to learn.

The [Vitest configuration](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/vitest.config.ts) is straightforward. It uses `jsdom` for DOM simulation, includes verbose and JUnit reporters (the latter for CI integration), and targets `*.spec.ts` files in the src directory. Coverage uses the `v8` provider with thresholds set at 85% for statements, branches, functions, and lines. The CI pipeline fails if coverage drops below these thresholds, which prevents coverage from slowly eroding over time.

For end-to-end testing, [Playwright](https://playwright.dev/) was the obvious choice. It supports Chromium, Firefox, and WebKit from a single API, runs tests in parallel, and has excellent debugging tools. The Playwright test runner is also significantly faster than alternatives like Cypress because it does not run tests inside a browser's JavaScript context. Being free and open source is another big plus.

The [E2E configuration](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/playwright.config.ts) enables sharding for CI. The dedicated E2E workflow splits tests across four parallel runners using Playwright's built-in sharding support. Each shard runs a quarter of the tests, and the results are uploaded as separate artifacts. This approach scales well as the test suite grows, and it keeps CI times reasonable even with comprehensive E2E coverage.

## CI/CD: GitHub Actions Workflows

The CI/CD setup uses multiple GitHub Actions workflows, each with a specific responsibility.

The [main CI workflow](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/.github/workflows/ci.yml) runs on every push to main and every pull request. It has four jobs that run in parallel where possible: lint, test, build, and E2E. The lint job runs ESLint and checks Prettier formatting. The test job runs Vitest with coverage and uploads results to Codecov. The build job creates a production build and uploads it as an artifact. The E2E job depends on the build job, downloads the artifact, and runs Playwright tests against it.

![Figure 3: The CI Pipeline running parallel jobs. Sharding E2E tests reduces execution time significantly.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k892qvdy4owjf4pzha24.png)

All workflows use npm caching through the `setup-node` action, which significantly speeds up dependency installation. The `concurrency` setting cancels in-progress runs when a new commit is pushed to the same branch, preventing resource waste on outdated commits.

The [dedicated E2E workflow](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/.github/workflows/e2e.yml) runs Playwright with sharding across four parallel machines. Each machine installs dependencies, installs Playwright browsers, runs its shard of tests, and uploads the report. The `fail-fast: false` setting ensures all shards complete even if one fails, which gives complete test results rather than stopping at the first failure.

[Security scanning](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/.github/workflows/codeql.yml) uses GitHub's CodeQL on a weekly schedule and on every PR. CodeQL analyzes TypeScript code for common vulnerabilities like XSS and injection attacks. The dependency review workflow scans `package-lock.json` changes and blocks PRs that introduce dependencies with high-severity common vulnerabilities and exposures (CVEs) or non-compliant licenses.

The [deployment workflow](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/.github/workflows/deploy.yml) triggers on pushes to main, which isn't ideal for a large codebase, but served my purposes well. It builds the Angular application, Storybook, and Compodoc documentation, then merges them into a single artifact and deploys to GitHub Pages. The Storybook build ends up at `/storybook` and the API documentation at `/docs`, making all project documentation accessible from a single deployment. Eventually I will include links directly to the documentation from the main page.

[Lighthouse CI](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/.github/workflows/lighthouse.yml) runs on pull requests to catch performance regressions before they merge. This ensures bundle size stays reasonable and performance metrics do not degrade over time. This is the longest running CI pipeline, but it checks all six themes and all pages of the application. At first, Lighthouse scores below 90 were considered a failure, but later I bumped the thresholds for accessibility, SEO, and best practices to 100 and left performance at 90.

## Documentation: Storybook and Compodoc

Documentation is treated as code in this project. That means it lives in the repository, builds automatically, and deploys alongside the application.

[Storybook](https://storybook.js.org/) serves as the visual catalog for the design system. It targets the `src/app/shared` directory where all reusable UI components live. Each component gets a `.stories.ts` file that demonstrates its variants, states, and props. The Storybook configuration uses Angular's application builder and enables automatic documentation generation.

Storybook's accessibility addon runs axe-core checks on every story, which catches accessibility issues during component development rather than after integration. When you can see accessibility violations in the Storybook UI while building a component, fixing them becomes part of the natural workflow rather than a separate QA step.

[Compodoc](https://compodoc.app/) generates API documentation from TSDoc comments in the code. It targets core services and feature modules, producing documentation that includes dependency graphs, method signatures, and cross-references. The configuration excludes test and story files to keep the documentation focused on production code.

Both tools build as part of the deployment workflow and are accessible from the deployed site (in-app [Storybook](https://moodyjw.github.io/angular-enterprise-blueprint/storybook/) / [Compodoc](https://moodyjw.github.io/angular-enterprise-blueprint/docs/)). This means stakeholders can browse component documentation and API references without running the project locally.

## Internationalization: Why Transloco

For internationalization, I chose [Transloco](https://github.com/jsverse/transloco) over Angular's built-in `@angular/localize`. The decision came down to workflow and flexibility.

Angular's localize requires building separate bundles for each language. This approach offers better runtime performance because translations are compiled into the bundle, but it complicates the build and deployment pipeline. You need separate deployments for each language or a server that routes to the correct bundle.

Transloco uses runtime translation loading. The application builds once, and [translation files](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/assets/i18n) load via HTTP based on the selected language. This means a single deployment supports all languages, and adding a new language is just adding a JSON file. Language switching is instant without a page reload, which provides a better user experience for applications where users might switch languages frequently.

The [Transloco configuration](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/src/app/core/i18n/transloco.config.ts) sets English as the default language with Spanish and eventually French as additional options. Translation files live in [`assets/i18n/`](https://github.com/MoodyJW/angular-enterprise-blueprint/tree/main/src/assets/i18n) as JSON files with dot-notation keys that mirror the component structure. This naming convention makes it easy to find and update translations for specific features.

For this portfolio project, the simpler deployment workflow and instant language switching outweigh the marginal performance benefits of build-time localization. If the application needed to support dozens of languages or had strict performance requirements, the calculus might be different.

## Lessons Learned

Phase 1 took longer than I initially expected, but the investment will likely pay off long-term (it absolutely did).

The boundaries plugin will catch architectural violations during later phases that I probably would have overlooked. Having the tooling enforce architecture rather than relying on discipline and documentation makes a real difference. This matters even more when developing with AI-assisted tools like GitHub Copilot or Claude. LLMs can generate valid-looking code that violates architectural boundaries or uses implicit type coercion. Having automated linting catch these mistakes immediately means you can move fast with AI assistance while maintaining code quality; the tooling acts as a safety net that catches errors whether they come from human developers or AI suggestions.

The strict TypeScript rules caused friction initially, but they caught real bugs. The `strict-boolean-expressions` rule in particular surfaced several places where I was relying on implicit coercion that could have caused issues with falsy values like zero or empty strings.

Setting up Vitest with Angular was smoother than I expected. In previous projects, I struggled with configuration issues and slow test runs. This time, the setup worked on the first try and tests run fast enough that I actually run them frequently during development.

The CI pipeline catches issues before they become problems. I have pushed commits that broke the build or failed linting, and the feedback loop is fast enough that I catch and fix these issues before context-switching to something else.

## What's Next

With Phase 1 complete, the project has a solid foundation of tooling and automation. The next article will cover [Phase 2: Core Architecture](https://github.com/MoodyJW/angular-enterprise-blueprint/blob/main/docs/specs/PHASE_2_CORE.md). That phase builds the invisible infrastructure that powers the application, including environment configuration, core services, error handling, and the mock authentication system.

The patterns established in Phase 1 will guide development throughout the remaining phases. Every new file gets linted and formatted automatically. Every commit follows conventional commit standards. Every PR must pass the quality gates. This consistency compounds over time, making the codebase easier to maintain as it grows.

You can explore the complete Phase 1 implementation on GitHub: [MoodyJW/angular-enterprise-blueprint](https://github.com/MoodyJW/angular-enterprise-blueprint)

---

_Next in series: Phase 2 Deep Dive - Core Architecture, Services, and Authentication_
