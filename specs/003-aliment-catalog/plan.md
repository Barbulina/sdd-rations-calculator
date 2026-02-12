# Implementation Plan: Custom Aliment Creation

**Branch**: `003-aliment-catalog` | **Date**: 2026-02-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-aliment-catalog/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enable users to create custom aliment entries to supplement the pre-defined catalog of 365+ food items. The feature adds a custom aliment creation form accessible from the aliment browser (`/aliment-browser`) via a "Create" button or from empty search results. Custom aliments are stored locally using the Repository Pattern and merged seamlessly with the existing catalog. The implementation follows TDD methodology with unit tests, integration tests for repository contracts, and Playwright E2E tests for critical user flows.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: Next.js 15.1.6, React 19, next-themes 0.4.4, Tailwind CSS 3.4.17  
**Storage**: Browser localStorage (JSON serialization, repository pattern abstraction)  
**Testing**: Vitest (unit/integration) + Playwright (E2E) - installation/config in research.md Phase 0  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (Next.js App Router with client components)  
**Performance Goals**: <50ms form validation, <100ms catalog merge, <30s complete creation flow  
**Constraints**: Offline-first PWA, ~5-10MB localStorage quota, no hardcoded styles (design tokens only), hexagonal architecture boundaries  
**Scale/Scope**: 365+ catalog aliments + unlimited custom aliments, single-user application, 4 user stories (2 HIGH, 2 MEDIUM priority)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **I. Architectural Integrity** | ✅ PASS | Hexagonal architecture maintained: Domain models (`CustomAliment`) in `src/domain/models/`, repository interface in `src/domain/repositories/CustomAlimentRepository.ts`, infrastructure implementation in `src/infrastructure/repositories/LocalStorageCustomAlimentRepository.ts`, UI in `app/aliment-browser/create/`. Domain remains isolated. |
| **II. Testing Strategy** | ✅ PASS | Builder pattern for `CustomAliment` entities in tests (follow existing `RationBuilder` pattern from 002). Decouples tests from constructor changes. Builder: `tests/unit/custom-aliments/CustomAlimentBuilder.ts`. |
| **III. Test-First Methodology** | ✅ PASS | TDD workflow documented in research.md & quickstart.md. Vitest + Playwright installation/config complete. Red-Green-Refactor cycle enforced. Unit tests (domain), integration tests (repository), E2E tests (form flow). |
| **IV. Design & Implementation** | ✅ PASS | All UI values from existing design tokens (`tokens.json`). Reuse category color tokens, spacing, typography. No hardcoded colors/spacing. Mobile-first responsive form following M3 guidelines. |
| **V. Availability & Resilience** | ✅ PASS | Offline-first: localStorage via Repository Pattern. Form works offline. Custom aliments persist locally. No network dependency. Quota overflow handling implemented. |
| **VI. Quality Assurance** | ✅ PASS | Integration tests for `CustomAlimentRepository` contract verify localStorage operations. E2E tests (Playwright) for create flow, validation, merge with catalog. Test coverage: domain validation, repository CRUD, critical user flows. |

**GATE STATUS**: ✅ ALL PASS - Ready to proceed to Phase 2 (tasks.md)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── domain/
│   ├── models/
│   │   ├── AlimentInfo.ts              # Existing base interface
│   │   └── CustomAliment.ts            # NEW: extends AlimentInfo with isCustom flag
│   └── repositories/
│       └── CustomAlimentRepository.ts  # NEW: interface for CRUD operations
├── infrastructure/
│   └── repositories/
│       └── LocalStorageCustomAlimentRepository.ts  # NEW: localStorage implementation
└── application/
    └── contexts/
        └── CustomAlimentRepositoryContext.tsx      # NEW: React context provider

app/
└── aliment-browser/
    ├── page.tsx                        # UPDATED: add "Create" button + empty state CTA
    └── create/
        └── page.tsx                    # NEW: custom aliment creation form

tests/
├── unit/
│   └── custom-aliments/
│       ├── CustomAliment.test.ts       # NEW: domain model validation tests
│       └── CustomAlimentBuilder.ts     # NEW: test builder pattern
├── integration/
│   └── custom-aliments/
│       └── LocalStorageCustomAlimentRepository.test.ts  # NEW: repository contract tests
└── e2e/
    └── custom-aliments/
        ├── create-custom-aliment.spec.ts           # NEW: Playwright E2E create flow
        └── browse-merged-catalog.spec.ts           # NEW: Playwright E2E browse flow
```

**Structure Decision**: Web application using Next.js App Router. Follows existing hexagonal architecture pattern established in features 001 (design tokens) and 002 (ration management). Domain layer remains isolated, repository pattern for data access, React Context for dependency injection. Tests organized by type (unit/integration/e2e) matching constitution requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
