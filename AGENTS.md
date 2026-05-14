# AGENTS.md — SDD Rations Calculator

## Quick start

```sh
npm install          # also installs .githooks/ pre-push hook
npm run tokens:build # generate tailwind-tokens.cjs + css-variables.css from tokens.json
npm run dev          # next dev --turbopack, localhost:3000
```

## Architecture

- **Next.js 15 App Router** deployed on **Vercel** (SSR, not static export).
- **Hexagonal architecture**: `src/domain/` (models + repository interfaces) → `src/application/` (hooks + React contexts) → `src/infrastructure/` (repositories, storage, design tokens).
- **Offline-first**: all data persisted in **localStorage** via `LocalStorageAdapter`. No API, no database.
- **Routes**: `app/` — 7 pages in App Router. Dynamic route: `/menu/[id]`.
- **Styling**: Tailwind CSS v3 + generated design tokens + `next-themes` for dark mode.
- **`@/*`** path alias maps to project root (`tsconfig.json`).

## Design tokens

- **Source of truth**: `src/infrastructure/design-tokens/tokens.json` (50 tokens: colors, typography, spacing).
- **Build pipeline**: schema validation → WCAG AA contrast check → Style Dictionary → `tailwind-tokens.cjs` + `css-variables.css`.
- **Must run `npm run tokens:build`** after any change to `tokens.json`. Generated files are committed.
- Tests for tokens: `npm run test:tokens` (run with `tsx`, not vitest — they live outside vitest)

## Tests

- **Vitest** with `jsdom@26.1.0` environment + `@testing-library/react`.
- Test setup polyfills `localStorage` and `crypto.randomUUID` (`tests/setup.ts`).
- `tests/` mirrors app structure: `unit/` + `integration/`.
- **Run**: `npm test` (vitest, excludes design-token tests via `.githooks/pre-push`).
- **Design-token tests run separately**: `npm run test:tokens` (via `tsx`, not vitest — fork worker incompatibility with ESM deps).
- **E2E**: Playwright in `tests/e2e/`.

## Pre-push hook (`.githooks/pre-push`)

Runs in order: `format:check` → `lint:check` → `test`. All must pass. Skip with `git push --no-verify`.

## CI (GitHub Actions — `.github/workflows/ci.yml`)

Runs tests + build on every PR targeting `main`. Node 24. To make checks required: configure branch protection in GitHub Settings → Branches.

## Code quality

- **Prettier**: `.prettierrc` (semi, double quotes, trailing commas, 80 width). `npm run format` to fix.
- **ESLint**: flat config (`eslint.config.js`). `next/core-web-vitals` + `next/typescript`. `no-explicit-any` relaxed for tests, specs, repos.
- `next.config.ts` ignores ESLint + TS errors during build (pre-existing issues in spec contracts).

## Commands

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Dev server (TurboPack)                               |
| `npm run build`        | Production build                                     |
| `npm test`             | Vitest (excludes design-tokens)                      |
| `npm run test:tokens`  | Design-token schema/contrast/spacing/transform tests |
| `npm run test:e2e`     | Playwright (requires dev server)                     |
| `npm run tokens:build` | Rebuild design tokens from `tokens.json`             |
| `npm run lint`         | ESLint                                               |
| `npm run format`       | Prettier — write                                     |
| `npm run format:check` | Prettier — check only                                |

## Coding conventions (aligned with `.specify/memory/constitution.md`)

- **Builder Pattern for tests**: use `.github/agents/speckit.implement.agent.md` for the full TDD workflow.
- **Repository Pattern** mandatory for all data operations (injected via React contexts in `src/application/contexts/`).
- **No hardcoded UI values** — all colors, spacing, typography from `tokens.json` via Tailwind.
- **No business logic in components** — components render and delegate to hooks in `src/application/hooks/`.
- **Domain layer** (`src/domain/`) must have zero framework imports — pure TypeScript only.
- **TDD is mandatory**: test written → approved → fails → implement. No implementation without a prior failing test.

## Known constitution mismatches (`.specify/memory/constitution.md` vs actual code)

| Constitution says          | Actual                                    |
| -------------------------- | ----------------------------------------- |
| `src/core/domain`          | `src/domain/`                             |
| IndexedDB (primary)        | localStorage only (`LocalStorageAdapter`) |
| `src/infrastructure/hooks` | hooks in `src/application/hooks/`         |

## Speckit workflow

Feature development follows these agent commands (defined in `.github/agents/` + `.github/prompts/`):

`specific → plan → tasks → implement → checklist`

Each step generates artifacts in `specs/NNN-feature-name/` (spec, plan, tasks, contracts, quickstart).
