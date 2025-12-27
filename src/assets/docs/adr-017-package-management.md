# ADR-017: Package Management & Dependencies

## Status

Accepted

## Date

2025-12-26

## Context

Dependency management is a critical security and stability vector. We need a reliable way to install, update, and lock dependencies.

### Options Considered

1. **npm**: The default.
   - _Pros_: Default in Node, massive improvements in v7/v8/v10.
2. **yarn**:
   - _Pros_: Historically faster.
   - _Cons_: v1 vs v2+ fragmentation.
3. **pnpm**:
   - _Pros_: Disk space efficient (symlinks).
   - _Cons_: Sometimes conflicts with tooling that expects flat node_modules.

## Decision

We chose **npm**.

### Rationale

1. **Simplicity**: No external tool required to install (it comes with Node).
2. **Performance**: npm CI is comparable to yarn in modern versions.
3. **Compatibility**: Angular CLI defaults to npm and works perfectly with it.

### Dependency Management

- **Lock File**: `package-lock.json` MUST be committed. This ensures every developer (and CI) gets the exact same tree.
- **Vetting**: New dependencies go through a manual review process (size cost, license check, maintainance status) via PR.
- **Dependabot**: Used to automate security patches.

## Implementation

- `.npmrc` is used to enforce engine strictness.
- CI pipeline runs `npm ci` (Clean Install) instead of `npm install` to ensure integrity.

## Consequences

### Positive

- **Stability**: "Works on my machine" issues related to dependency drift are eliminated by the lock file.
- **Security**: `npm audit` is integrated into our workflow.

### Negative

- **Bloat**: `node_modules` is famously heavy, but npm is the "safe" standard choice for Angular Enterprise apps.

### Neutral

- **Ecosystem Standard**: npm remains the default package manager for the Node.js ecosystem and is recommended by the Angular team.
- **Alternative Trade-offs**: While pnpm offers disk savings and yarn offers workspace features, npm's compatibility and simplicity make it the pragmatic choice for most teams.

## References

- [npm Documentation](https://docs.npmjs.com/)
