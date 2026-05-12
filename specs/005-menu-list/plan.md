# Implementation Plan: Menu List - Home Page

**Branch**: `005-menu-list` | **Date**: 2026-05-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-menu-list/spec.md`

## Summary

Replace the home page (`app/page.tsx`) to display the user's saved menus as cards, with client-side filtering by name and type, and the ability to delete a menu. All data comes from the existing `LocalStorageMenuRepository` via `MenuRepositoryContext`. No new domain entities or repository methods are required—the feature is purely a UI + hook layer built on top of Feature 004's infrastructure.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), React 19, Next.js 15.1.6  
**Primary Dependencies**: React, Next.js App Router, Tailwind CSS, Material Design 3 tokens  
**Storage**: Browser localStorage via existing `LocalStorageMenuRepository` (Feature 004)  
**Testing**: Vitest 4.0.18 + React Testing Library + Builder Pattern (MenuBuilder from Feature 004)  
**Target Platform**: Web browser, offline-capable (localStorage)  
**Project Type**: Web (Next.js App Router, single project)  
**Performance Goals**: List renders < 100ms client-side; filter debounce not needed (client-side, synchronous)  
**Constraints**: Offline-first (all data from localStorage); no pagination required; filter state not persisted  
**Scale/Scope**: Single page replacement; 2 new components; 1 new hook; ~3 test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Architectural Integrity** — Domain layer isolated | ✅ PASS | No new domain entities. `Menu` model and `MenuRepository` interface already exist. New code is confined to application layer (hook) and UI layer (components/page). |
| **II. Testing Strategy** — Builder Pattern in tests | ✅ PASS | `MenuBuilder` and `MenuItemBuilder` already created in Feature 004 (`tests/unit/menu-builder/`). Will reuse. |
| **III. Methodology** — TDD mandatory | ✅ PASS | Tests will be written before implementation per Red-Green-Refactor cycle. |
| **IV. Design & Implementation** — Design tokens, no hardcoded values | ✅ PASS | Will use existing Tailwind design tokens. No hardcoded hex or pixel values. |
| **V. Availability & Resilience** — Offline First | ✅ PASS | `LocalStorageMenuRepository` already offline-capable. No new network calls. |
| **VI. Quality Assurance** — Integration + E2E tests | ✅ PASS | Unit tests for hook, integration tests for components, Playwright for critical flows. |

**Gate result**: ✅ ALL PASS — proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/005-menu-list/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── README.md
│   ├── types.ts
│   └── MenuListHook.ts
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── page.tsx                         # REPLACE: menus list (was rations list)
└── components/
    ├── MenuCard.tsx                  # NEW: individual menu card
    ├── MenuListFilters.tsx           # NEW: name search + type filter controls
    └── EmptyState.tsx               # EXISTING: already correct for menus

src/
└── application/
    └── hooks/
        └── useMenuList.ts           # NEW: load, sort, filter, delete

tests/
├── unit/
│   └── menu-list/
│       └── useMenuList.test.ts      # NEW: hook logic tests
└── integration/
    └── menu-list/
        ├── MenuCard.test.tsx        # NEW: component rendering + delete
        └── MenuListFilters.test.tsx # NEW: filter UI tests
```

**Structure Decision**: Single project (Next.js App Router). Feature 005 is a UI-layer feature — no new domain or infrastructure files. Follows the same `app/components/` + `src/application/hooks/` pattern established in previous features.

## Complexity Tracking

No constitution violations — complexity tracking not required.
