# Implementation Plan: Design Token System

**Branch**: `001-design-token-system` | **Date**: 2026-02-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-design-token-system/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Create a comprehensive design token system using Specify that establishes the visual foundation for the Rations Calculator PWA. The system provides:

1. **Seven semantic category colors** (lacteal, cereals/flours/pulses/legumes/tubers, fruits, vegetables, oily/dry fruits, drinks, others) mapped to Material Design 3 color roles with WCAG AA contrast compliance
2. **State/feedback indicators** (offline, syncing, sync-error, online, success, warning, error, info) for offline-first PWA status communication
3. **Typography scale** (H1-H6, body-large/medium/small, label-large/medium/small) following M3 type system
4. **Spacing scale** based on 8px grid (0px to 96px) ensuring 44px minimum touch targets for mobile-first design
5. **Tailwind CSS integration** via automated tokens.json → tailwind.config.ts transformation with utility classes

The system enforces the constitutional mandate that all UI values come from design tokens (no hardcoded colors/spacing), supports light/dark themes, and enables designers to update the entire visual system without touching code.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: Next.js 14+ (App Router), Tailwind CSS 3.x, Specify (design token platform), style-dictionary (token transformation)  
**Storage**: File-based (tokens.json exported from Specify, tailwind.config.ts generated)  
**Testing**: Vitest (unit tests for token validation/transformation), Playwright (E2E visual regression)  
**Target Platform**: Web (PWA) - Chrome/Safari/Firefox on mobile/tablet/desktop  
**Project Type**: Web application (Next.js PWA with offline-first capabilities)  
**Performance Goals**: Token transformation build-time only (zero runtime overhead), design token updates reflected in <5min including rebuild  
**Constraints**: WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text), 44px minimum touch targets, 8px grid alignment, no hardcoded CSS values  
**Scale/Scope**: ~50 design tokens (7 category colors × 2 themes + 4 state colors × 2 themes + 4 feedback colors × 2 themes + 10 typography tokens + 10 spacing tokens), 3 screens initially (Home, Create/Edit Menu, Menu Detail)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Architectural Integrity ✅ COMPLIANT
**Principle**: Hexagonal Architecture with domain isolation  
**Assessment**: Design tokens are **infrastructure concerns** (styling/presentation layer), not domain logic. This feature establishes the styling foundation but does not create domain entities or business rules. The token transformation tooling will live in `src/infrastructure/design-tokens/` separate from domain.  
**Compliance**: No domain contamination - purely infrastructure.

### II. Testing Strategy ✅ COMPLIANT
**Principle**: Builder Pattern for entity testing  
**Assessment**: Design tokens are **configuration data**, not entities with constructors. No builders needed for token objects—they are JSON structures validated by schemas. If token validation utilities are created, they will be pure functions (no state).  
**Compliance**: Not applicable - no entities requiring builders in this feature.

### III. Methodology (Test-First) ✅ COMPLIANT
**Principle**: TDD mandatory with Red-Green-Refactor cycle  
**Assessment**: This feature WILL follow TDD:
- **Phase 0**: Write tests for token JSON schema validation (expect failures for missing M3 mappings, contrast violations)
- **Phase 1**: Write tests for Tailwind config transformation (expect failures until transformation script implemented)
- **User approval**: Tests reviewed and approved before implementation
- **Implementation**: Transform tokens.json → tailwind.config.ts only after tests fail correctly  
**Compliance**: Tests written first, implementation follows test approval.

### IV. Design & Implementation ✅ COMPLIANT (CORE FEATURE)
**Principle**: All UI values from Specify tokens.json, M3 guidelines, Tailwind CSS, mobile-first  
**Assessment**: This feature **IS the implementation** of Principle IV. It establishes:
- Specify as single source of truth for design values
- M3 color roles for semantic color mapping
- Tailwind config integration via tokens.json transformation
- Mobile-first 8px grid with 44px touch targets  
**Compliance**: This feature enables constitutional compliance for all future UI work.

### V. Availability & Resilience ✅ COMPLIANT
**Principle**: Offline-first PWA with local persistence  
**Assessment**: Design tokens support offline resilience by including state indicators:
- `state-offline`, `state-syncing`, `state-sync-error`, `state-online` semantic colors
- Visual feedback system for offline functionality (P2 user story)
- Tokens are **build-time assets** bundled in PWA—no runtime network dependencies  
**Compliance**: Tokens enable offline status communication, compiled into offline-capable PWA bundle.

### VI. Quality Assurance ✅ COMPLIANT
**Principle**: Integration tests for contracts, E2E tests for critical flows  
**Assessment**:
- **Integration tests**: Token schema validation, Tailwind config transformation contract, WCAG AA contrast validation
- **E2E tests**: Visual regression tests for category colors, spacing consistency, dark/light theme switching (Playwright)
- **Contract focus**: tokens.json → tailwind.config.ts transformation is a clear contract boundary  
**Compliance**: Integration tests for transformation contracts, E2E for visual validation.

**Summary: ALL PRINCIPLES COMPLIANT ✅

**No violations**. This feature aligns perfectly with constitutional mandates:
- Establishes infrastructure for Principle IV (design tokens requirement)
- Supports Principle V (offline status indicators)
- Follows Principle III (TDD workflow)
- Respects Principle I (no domain contamination)

**Gate Status**: **PASS** - Proceed to Phase 0 research.

---

## POST-DESIGN CONSTITUTION RE-CHECK ✅

**Phase 1 Complete**: research.md, data-model.md, contracts/, quickstart.md generated. Re-evaluating constitutional compliance:

### I. Architectural Integrity ✅ STILL COMPLIANT
**Assessment after design**: Data model confirms tokens are configuration data, not domain entities. Project structure places tokens in `src/infrastructure/design-tokens/` with clear separation from `src/core/domain/`. No domain contamination introduced.

### II. Testing Strategy ✅ STILL COMPLIANT  
**Assessment after design**: Data model defines DesignToken as immutable configuration objects validated by JSON schema, not entity classes requiring builders. Validation functions are pure and stateless. No builder pattern needed.

### III. Methodology (Test-First) ✅ STILL COMPLIANT
**Assessment after design**: Contracts define clear test interfaces (tokens-schema.json for validation, validateContrastRatio for WCAG checks). Quickstart documents TDD workflow: write schema validation tests → write contrast validation tests → implement transformation → all tests pass.

### IV. Design & Implementation ✅ STILL COMPLIANT
**Assessment after design**: This feature **enables** Principle IV compliance for all future work. Design tokens now defined for all 7 categories, state indicators, feedback colors, typography, and spacing. Tailwind integration ensures no hardcoded values possible.

### V. Availability & Resilience ✅ STILL COMPLIANT
**Assessment after design**: State indicator tokens (offline/syncing/sync-error/online) defined in data model. Tokens are build-time assets bundled in PWA—zero network dependency at runtime. Design supports offline-first architecture.

### VI. Quality Assurance ✅ STILL COMPLIANT
**Assessment after design**: Contracts define integration test boundaries (token schema validation, Tailwind transformation contract, WCAG validation API). Quickstart documents E2E visual regression tests and theme switching validation. Test coverage complete.

**Final Gate Status**: **PASS** - All principles remain compliant after Phase 1 design. Ready for `/speckit.tasks` to generate implementation tasks.

## Project Structure

### Documentation (this feature)

```text
specs/001-design-token-system/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Original feature specification
├── research.md          # Phase 0 output - technical research and decisions
├── data-model.md        # Phase 1 output - entity definitions and validation rules
├── quickstart.md        # Phase 1 output - designer and developer workflows
├── contracts/           # Phase 1 output - API/schema contracts
│   └── README.md        # tokens-schema.json, tailwind-tokens.d.ts, validation-api.md
├── checklists/          # Quality assurance
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout with theme provider
│   ├── page.tsx                     # Home page (future)
│   └── providers.tsx                # next-themes ThemeProvider wrapper
├── components/                       # React components (future features)
├── core/                             # Hexagonal architecture domain layer
│   └── domain/                      # Pure TypeScript - no framework imports
│       └── (empty for this feature - design tokens are infrastructure)
└── infrastructure/                   # Infrastructure layer
    └── design-tokens/               # Design token system (THIS FEATURE)
        ├── tokens.json              # Exported from Specify (input)
        ├── style-dictionary.config.js # Transformation configuration
        ├── build-tokens.ts          # Build script (runs Style Dictionary)
        ├── validate-contrast.ts     # WCAG AA contrast validation
        ├── tailwind-tokens.js       # Generated Tailwind config (output)
        ├── tailwind-tokens.d.ts     # Generated TypeScript types (output)
        └── css-variables.css        # Generated CSS custom properties (output)

tests/
├── unit/                             # Domain and use case tests
│   └── infrastructure/
│       └── design-tokens/
│           ├── validate-contrast.test.ts    # Contrast validation unit tests
│           └── token-transformation.test.ts # Style Dictionary transformation tests
├── integration/                      # Repository contract tests
│   └── design-tokens/
│       └── token-schema.test.ts     # JSON schema validation integration test
└── e2e/                              # Playwright E2E tests
    └── design-tokens/
        ├── visual-regression.spec.ts    # Screenshot comparison tests
        └── theme-switching.spec.ts      # Dark/light mode toggle tests

config/
├── tailwind.config.ts               # Tailwind CSS configuration (imports tokens)
├── postcss.config.js                # PostCSS configuration
└── next.config.js                   # Next.js configuration

.github/
└── agents/
    └── copilot-instructions.md      # Updated with design token context (Phase 1)
```

**Structure Decision**: Web application (Next.js PWA). Design tokens live in `src/infrastructure/design-tokens/` as they are infrastructure concerns (styling/presentation layer), not domain logic. Future features will add domain entities to `src/core/domain/` following hexagonal architecture.

## Complexity Tracking

> **No violations** - this section intentionally empty.

All constitutional principles are fully compliant. No complexity justifications required.
