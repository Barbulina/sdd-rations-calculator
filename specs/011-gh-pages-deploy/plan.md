# Implementation Plan: GitHub Pages Automated Deployment

**Branch**: `011-gh-pages-deploy` | **Date**: 2026-05-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-gh-pages-deploy/spec.md`

## Summary

Configure a GitHub Actions CI/CD pipeline that builds the Next.js app as a fully static export and deploys it to GitHub Pages on every push to `main`. Simultaneously, configure branch protection rules on `main` to enforce the PR review flow. Key technical work: add `output: 'export'` to `next.config.ts`, handle the dynamic `/menu/[id]` route via `generateStaticParams`, and author the deployment workflow YAML.

## Technical Context

**Language/Version**: TypeScript 5.x / YAML (GitHub Actions)
**Primary Dependencies**: Next.js 15.1.x, Node.js 20 (CI), GitHub Actions official actions (checkout@v4, setup-node@v4, upload-pages-artifact@v3, deploy-pages@v4)
**Storage**: N/A — no new data storage; localStorage remains the runtime persistence layer
**Testing**: Vitest (existing test suite runs in CI before build; no new tests for YAML files)
**Target Platform**: GitHub Actions (ubuntu-latest runner) → GitHub Pages (static CDN)
**Project Type**: Web application (Next.js, fully client-side `"use client"`)
**Performance Goals**: Build must complete within 10 minutes; deployment within 5 minutes of merge
**Constraints**: GitHub Pages serves static files only — no server-side rendering, no API routes, no Node.js process at runtime
**Scale/Scope**: Single repository, single branch (`main`), single deployment target

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Architectural Integrity (Hexagonal) | ✅ PASS | CI/CD touches no src/ domain code. `next.config.ts` change is infrastructure-only. `generateStaticParams` in page component is framework glue, not domain logic. |
| II. Testing Strategy (Builder Pattern) | ✅ N/A | No new domain entities. Existing test suite runs in CI. |
| III. Methodology (TDD) | ✅ N/A | No new application logic. CI YAML is configuration, not testable code. |
| IV. Design Tokens (M3) | ✅ N/A | No UI changes. |
| V. Offline-First | ✅ PASS | Static export is the correct hosting strategy for an offline-first app — no server dependency. |
| VI. Quality Assurance | ✅ PASS | Tests run in CI before deploy. Failed builds block deployment (SC-003). |

**Gate result**: ✅ No violations. Proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/011-gh-pages-deploy/
├── plan.md              ← this file
├── research.md          ← Phase 0 (complete)
├── data-model.md        ← Phase 1 (complete — no new entities)
├── quickstart.md        ← Phase 1 (complete)
├── contracts/
│   └── deploy.yml       ← Phase 1: GitHub Actions workflow YAML (reference)
└── tasks.md             ← Phase 2 (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── deploy.yml              # NEW — GitHub Actions CI/CD pipeline

next.config.ts                  # MODIFY — add output/basePath/trailingSlash/images

app/
└── menu/
    └── [id]/
        └── page.tsx            # MODIFY — add generateStaticParams + dynamicParams
```

**Structure Decision**: Minimal footprint. All changes are infrastructure/configuration. No new source directories. No changes to `src/` (domain, application, infrastructure layers).

## Complexity Tracking

> No Constitution violations — table not required.
