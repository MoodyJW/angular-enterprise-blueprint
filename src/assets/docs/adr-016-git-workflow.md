# ADR-016: Git Workflow & Commit Standards

## Status

Accepted

## Date

2025-12-26

## Context

A messy commit history makes it impossible to generate changelogs, debug regressions with `git bisect`, or understand the evolution of a file. Without standardized commit messages, teams waste time deciphering vague messages like "fix stuff" or "WIP" when investigating issues or preparing releases.

We need a commit convention that enables automation and improves developer experience.

### Options Considered

1. **Free-for-all**: Developers commit whatever they want.
   - _Pros_: Fast.
   - _Cons_: Chaos.
2. **Squash Merging**: Only the PR title matters.
   - _Pros_: Clean main history.
   - _Cons_: Loses intermediate context.
3. **Conventional Commits**: Strict format enforcement.
   - _Pros_: Automatable (Semantic Release), readable, structured.

## Decision

We chose **Conventional Commits** enforced by **Husky** and **Commitlint**.

### Rationale

1. **Automation**: We can auto-generate changelogs based on `feat:` vs `fix:` types.
2. **Discipline**: Forces developers to think about the scope of their change.

### The Standard

Format: `<type>(<scope>): <subject>`

Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

## Implementation

We use **Husky** to intercept the `commit-msg` git hook and run **Commitlint**. If the message doesn't match the regex, the commit is rejected.

```bash
# Example error
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

## Consequences

### Positive

- **Changelog**: Release notes are practically free.
- **Readability**: `git log` is a pleasure to read.

### Negative

- **Friction**: "I just fixed a typo" requires `fix(docs): typo`. Some devs find this annoying.

### Neutral

- **Industry Adoption**: Conventional Commits is widely adopted in open-source projects and enterprise teams, making it familiar to most experienced developers.
- **Tooling Ecosystem**: Strong integration with automated release tools (semantic-release, standard-version) and CI/CD systems.

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky](https://typicode.github.io/husky/)
