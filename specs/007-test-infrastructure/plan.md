# Implementation Plan: Test Infrastructure & Quality Fixes

**Branch**: `007-test-infrastructure`
**Date**: 2026-05-13
**Spec**: [spec.md](spec.md)
**Input**: Análisis de tests del proyecto - tests rotos, frágiles y duplicación de builders

## Summary

Arreglar los 4 tests standalone de design tokens que están rotos (API mismatches, custom runner, CJS/ESM), refactorizar tests frágiles de componentes (MenuSummary, SaveMenuForm, MenuItemsList) que están acoplados a implementación, centralizar builders en `tests/shared/` con tipos del dominio, y unificar el mocking de localStorage. El objetivo es que `npm test` pase limpio con 400+ tests y los tests sean robustos frente a cambios de implementación.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 15.1.6, React 19, Vitest 4.x, @testing-library/react 16.x
**Testing**: Vitest (unit/integration) - migrar 4 tests de custom runner a Vitest
**Target Platform**: Node.js 18+ (entorno de tests)
**Constraints**: No romper tests existentes, mantener cobertura, no cambiar comportamiento de producción

## Constitution Check

*GATE: Must pass before Phase 0. Re-check after each phase.*

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **I. Architectural Integrity** | ✅ PASS | No se modifica la arquitectura hexagonal. Todos los cambios son en tests y configuración. |
| **II. Testing Strategy** | ✅ PASS | Se refuerza: builders centralizados (shared/), tests desacoplados de implementación. |
| **III. Test-First Methodology** | ✅ PASS | No se altera el flujo TDD. Se reparan y refactorizan tests existentes. |
| **IV. Design & Implementation** | ✅ PASS | Sin cambios en UI, design tokens, o Tailwind. |
| **V. Availability & Resilience** | ✅ PASS | Sin cambios en persistencia offline. |
| **VI. Quality Assurance** | ✅ PASS | El objetivo principal es mejorar QA: tests que pasan y son mantenibles. |

**GATE STATUS**: ✅ ALL PASS - Ready to proceed

## Project Structure

### Documentation (this feature)

```text
specs/007-test-infrastructure/
├── spec.md              # This file
├── plan.md              # This file
├── tasks.md             # Task breakdown
└── contracts/           # (empty)
```

### Source Code Changes

```text
package.json                            # MODIFIED: añadir "type": "module"
postcss.config.js → postcss.config.cjs  # RENAMED: CJS bajo type: module
vitest.config.ts                        # MODIFIED: incluir design-token tests

tests/
├── shared/                             # NEW: builders centralizados
│   ├── MenuBuilder.ts                  # Consolidado de unit/menu-builder/
│   ├── MenuItemBuilder.ts              # Consolidado de unit/menu-builder/
│   └── localStorageMock.ts             # NEW: helper para QuotaExceededError
├── integration/design-tokens/
│   ├── token-schema.test.ts            # MODIFIED: migrado a Vitest
│   ├── contrast-validation.test.ts     # MODIFIED: migrado a Vitest
│   ├── spacing-grid.test.ts            # MODIFIED: migrado a Vitest
│   └── transformation.test.ts          # MODIFIED: migrado a Vitest
├── unit/menu-builder/
│   ├── MenuBuilder.ts                  # REMOVED (→ tests/shared/)
│   ├── MenuItemBuilder.ts              # REMOVED (→ tests/shared/)
│   ├── Menu.test.ts                    # UPDATED: import shared builders
│   ├── MenuItem.test.ts                # UPDATED: import shared builders
│   ├── useMenuBuilder.test.ts          # UPDATED: import shared builders
│   ├── MenuSummary.test.tsx            # MODIFIED: refactor aserciones frágiles
├── integration/menu-builder/
│   ├── LocalStorageMenuRepository.test.ts   # MODIFIED: refactor localStorage mock
│   ├── AutocompleteSearch.test.tsx          # UPDATED: import shared builders (si aplica)
│   ├── SaveMenuForm.test.tsx                # MODIFIED: refactor aserciones frágiles
│   ├── MenuItemsList.test.tsx               # MODIFIED: refactor aserciones frágiles
│   └── MenuRepositoryContext.test.tsx       # UPDATED: import shared builders (si aplica)
├── integration/custom-aliments/
│   └── LocalStorageCustomAlimentRepository.test.ts  # MODIFIED: refactor localStorage mock
└── unit/menu-list/
    └── useMenuList.test.tsx            # UPDATED: import shared builders
```

**Structure Decision**: Se centralizan los builders en `tests/shared/` siguiendo el patrón estándar de proyectos con múltiples suites de test. Los 4 token tests se migran a Vitest manteniendo su estructura de validación pero usando el framework estándar del proyecto.

## Complexity Tracking

No aplica. Todos los cambios son correcciones dentro de la arquitectura existente. No se introducen nuevas dependencias ni patrones.

## Execution Phases

### Phase 0: Setup (ESM/CJS + Vitest Config)
Preparar el proyecto para ESM y configurar Vitest para incluir los token tests.

### Phase 1: Migrar Token Tests a Vitest (US-1)
Reescribir los 4 tests standalone para que usen Vitest, corrigiendo API mismatches.

### Phase 2: Refactor Tests Frágiles (US-2)
Desacoplar tests de componentes de implementación específica.

### Phase 3: Centralizar Builders y Mocking (US-3)
Consolidar builders en `tests/shared/` con tipos del dominio y crear helpers de mocking.

### Phase 4: Verificación Final
Ejecutar suite completa, build y lint para verificar que no hay regresiones.
