# ADR-010: CI/CD Pipeline Architecture

## Status

Accepted

## Date

2025-12-22

## Context

Automated Continuous Integration (CI) and Continuous Deployment (CD) are non-negotiable for maintaining code quality and deployment velocity. We need a pipeline that:

1. Verifies code quality (Linting, Formatting).
2. Ensures correctness (Unit & E2E Tests).
3. Checks performance (Lighthouse).
4. Scans for security vulnerabilities.
5. Deploys successful builds automatically.

### Options Considered

1. **Jenkins**: Self-hosted, powerful. (**Cons**: Operational overhead, maintenance burden).
2. **GitLab CI**: Integrated, robust. (**Cons**: We are hosting on GitHub).
3. **GitHub Actions**: Integrated with our repo, zero setup cost, massive marketplace.

## Decision

We chose **GitHub Actions**.

It puts the CI configuration right next to the code (`.github/workflows`) and integrates seamlessly with Pull Request checks.

### Rationale

1. **Parallelization**: We can run Lint, Unit Tests, and Build jobs in parallel containers to speed up feedback.
2. **Security**: Integrated CodeQL scanning provided by GitHub.
3. **Ecosystem**: Easy access to actions like `cypress-io/github-action` or `actions/setup-node`.
4. **Cost**: Free tier is sufficient for our current scale.

## Implementation

### Workflow Structure

We defined multiple specialized workflows:

1. **`ci.yml`**: The main gatekeeper. Triggers on pushes to `main` and all PRs.
   - Job 1: **Lint** (ESLint, Prettier)
   - Job 2: **Test** (Vitest coverage > 85%)
   - Job 3: **Build** (Angular production build)
2. **`e2e.yml`**: Runs Playwright tests against the build artifact.
3. **`codeql.yml`**: Performs semantic code analysis to find security vulnerabilities.

4. **`lighthouse.yml`**: Deploys a preview and audits Performance, A11y, and SEO scores.

5. **`deploy.yml`**: Runs only on `main` branch success. Deploys the `dist/` folder to GitHub Pages.

### Branch Protection

We configured `main` to:

- Require pull request reviews.
- Require status checks (`ci/full_pass`) before merging.
- Prevent direct pushes.

## Consequences

### Positive

- **Confidence**: No broken code reaches `main`.
- **Visibility**: Build status is visible directly on the PR UI.
- **Automation**: Deployments happen automatically, removing "it works on my machine" issues.

### Negative

- **Wait Time**: Developers must wait for CI to pass before merging (typical overhead 3-5 mins).
- **Flakiness**: E2E tests in CI can sometimes be flaky due to container resource constraints (though Playwright mitigates this well).

### Neutral

- **Industry Standard for GitHub Projects**: GitHub Actions is the default choice for projects hosted on GitHub.
- **Vendor Lock-in**: While configuration is GitHub-specific, migrating to GitLab CI or other platforms would require rewriting workflow files but not application code.

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Angular Deployment Guide](https://angular.dev/tools/cli/deployment)
