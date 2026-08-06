# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- LICENSE file (MIT)
- SECURITY.md with vulnerability reporting policy
- .nvmrc for Node.js 20 version pinning
- .github/PULL_REQUEST_TEMPLATE.md for standardized PR descriptions
- .github/ISSUE_TEMPLATE/ with bug_report, feature_request, and question templates
- CONTRIBUTING.md at root for open source contributions
- CODEOWNERS for automatic PR review assignment
- .github/dependabot.yml with grouped updates for Payload, Next.js, testing, and AWS SDK
- CHANGELOG.md
- CI status badge in README

### Changed

- README rewritten from 771 to 171 lines for clarity and professionalism
- README version badges corrected to match package.json (Payload 3.80.0)
- Docker image tag corrected from `mi-proyecto` to `payload-cms`
- Fixed invalid CSS `rgb(1000, 1000, 1000)` values to valid `rgb(255, 255, 255)`
- Cleaned .gitignore: removed duplicate `node_modules/` and `.vercel` entries
- Removed dead code in `my-route` (unused Payload imports)
- Removed redundant `turso-client.ts` (Payload handles Turso connection internally)

### Fixed

- PAYLOAD_SECRET fallback from empty string to throw error if missing
- docker-compose.yml volume device path changed from `${PWD}` to `./media` for cross-platform compatibility

## [1.0.0] - Initial Release

- Payload CMS 3.80.0 + Next.js 16.2.6 + Turso + Cloudflare R2
- Multi-stage Docker build with standalone output
- CI/CD: lint, build, security audit, format auto-fix
- Docker image auto-publishing to GHCR on main branch
- Vitest integration tests + Playwright E2E tests
