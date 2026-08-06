# Contributing to Payload CMS 3 + Next.js 16 + Turso + Cloudflare R2

Thank you for your interest in contributing! This document summarizes the process.
For the full Spanish guide, see [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## Quick Summary

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## Development Setup

```bash
pnpm install
cp .env.example .env
# Configure your .env with real credentials
pnpm dev
```

## Commit Format

Uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix a bug
docs: update documentation
chore: maintenance tasks
```

## Testing

```bash
pnpm test       # Run all tests
pnpm test:int   # Integration tests (Vitest)
pnpm test:e2e   # E2E tests (Playwright)
```

Ensure all tests pass before opening a PR.

## Pull Request Process

1. Wait for CI checks to pass (lint, build, security)
2. Ensure code is formatted: `pnpm format`
3. Ensure no lint errors: `pnpm lint`
4. Add tests for new functionality
5. Update documentation if needed

## Reporting Issues

- **Bugs**: Use the "Bug Report" issue template
- **Features**: Use the "Feature Request" issue template
- **Questions**: Use the "Question" issue template or GitHub Discussions

## Security Vulnerabilities

Please read [SECURITY.md](./SECURITY.md) for instructions on reporting security issues.
