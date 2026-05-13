# Feature Specification: Test Infrastructure & Quality Fixes

**Feature ID**: 007-test-infrastructure
**Branch**: `007-test-infrastructure`
**Created**: 2026-05-13
**Status**: Planning

## Overview

Rehabilitar la infraestructura de tests del proyecto: arreglar los 4 tests de design tokens que están rotos, hacer que `npm test` pase sin errores, y refactorizar tests frágiles que están acoplados a implementación.

## Problem Statement

El proyecto tiene 24 archivos de test pero:

1. **4 tests de design tokens están rotos**: usan un custom test runner casero con `process.exit(1)`, `require()` (CJS), y tienen API mismatches con el código real (`validateTokenSchema` devuelve `true`/throw no `{valid, errors}`, `SpacingToken.value` es string no `{px}`, etc.)
2. **`npm test` no puede ejecutarlos**: al usar `process.exit(1)` y no estar integrados en Vitest, rompen cualquier suite que intente correrlos
3. **Tests de componentes con aserciones frágiles**: `MenuSummary`, `SaveMenuForm`, `MenuItemsList` usan `getByTestId`, `toHaveClass(/regex/)`, `container.querySelector`, y tests de layout que se rompen con cambios de implementación
4. **Builders importan tipos de `specs/`**: `MenuBuilder` y `MenuItemBuilder` dependen del contrato en `specs/004-menu-builder/contracts/types` en lugar de `src/domain/models/`
5. **Duplicación de builders**: existen copias similares en `menu-builder/`, `menu-list/`, `menu-detail/`
6. **Mocking de localStorage frágil**: los tests de `QuotaExceededError` sobrescriben `localStorage.setItem` global y requieren restauración manual

## User Stories

### US-1: Design Token Tests Reparados (Priority: HIGH)

**As a** developer
**I want to** ejecutar todos los tests con `npm test` sin errores
**So that** puedo verificar que el sistema de tokens funciona correctamente

**Why this priority**: Sin esto, `npm test` no es fiable. Los tests de tokens son la puerta de entrada a cualquier cambio en el sistema de diseño.

**Independent Test**: `npm test` ejecuta los 4 tests migrados y todos pasan como parte de la suite Vitest.

**Acceptance Scenarios**:

1. **Given** los 4 tests de design tokens (token-schema, contrast-validation, spacing-grid, transformation)
   **When** ejecuto `npm test`
   **Then** los 4 tests se ejecutan como parte de Vitest y pasan correctamente
2. **Given** los tests migrados
   **When** se ejecutan
   **Then** no usan `process.exit()` ni `require()` (CJS)
   **Then** usan `describe`/`it`/`expect` de Vitest
3. **Given** `token-schema.test.ts`
   **When** valida el schema
   **Then** usa correctamente `validateTokenSchema()` que es un type guard (devuelve `true` o lanza error)
4. **Given** `spacing-grid.test.ts`
   **When** accede a valores de espaciado
   **Then** usa `token.$extensions.pixelValue` en lugar de `token.value.px`

---

### US-2: Tests Frágiles Refactorizados (Priority: MEDIUM)

**As a** developer
**I want to** tests de componentes que prueben comportamiento, no implementación
**So that** refactors de UI no rompan tests innecesariamente

**Why this priority**: Tests frágiles dan falsos positivos y reducen la confianza en la suite. Refactorizarlos ahora evita deuda técnica creciente.

**Independent Test**: Los tests refactorizados siguen validando el mismo comportamiento pero sin acoplarse a clases CSS, test IDs, o estructura del DOM.

**Acceptance Scenarios**:

1. **Given** `MenuSummary.test.tsx`
   **When** se refactoriza
   **Then** no usa `getByTestId`
   **Then** no usa `toHaveClass(/bg-|border-/)`
   **Then** no asume layout específico (side by side)
   **Then** los tests ARIA verifican presencia de atributos accesibles sin asumir valores exactos
2. **Given** `SaveMenuForm.test.tsx`
   **When** se refactoriza
   **Then** no usa `container.querySelector("form")`
   **Then** no asume clases CSS específicas (`text-red`, `error`)
   **Then** usa `userEvent` en lugar de `fireEvent` para interacciones de usuario
3. **Given** `MenuItemsList.test.tsx`
   **When** se refactoriza
   **Then** no usa `getAllByTestId(/menu-item-card/)`
   **Then** no verifica espaciado entre items
   **Then** usa queries semánticas (`role`, `text`, `labelText`)

---

### US-3: Builders Centralizados (Priority: MEDIUM)

**As a** developer
**I want to** builders de test que importen tipos del dominio
**So that** no haya dependencia frágil del contrato en specs/

**Why this priority**: La duplicación y la dependencia de `specs/` crean riesgo de incoherencia. Centralizar ahora evita multiplicar el problema con nuevas features.

**Independent Test**: Todos los tests existentes siguen pasando después de migrar a shared builders, y los builders importan únicamente de `@/src/domain/models/`.

**Acceptance Scenarios**:

1. **Given** `MenuBuilder` y `MenuItemBuilder`
   **When** importan tipos
   **Then** lo hacen desde `@/src/domain/models/` no desde `specs/`
2. **Given** builders duplicados en `menu-builder/`, `menu-list/`, `menu-detail/`
   **When** se consolidan
   **Then** existe `tests/shared/` con builders comunes
   **Then** los duplicados se eliminan
3. **Given** el mocking de `localStorage.setItem` para `QuotaExceededError`
   **When** se refactoriza
   **Then** existe un helper reutilizable en `tests/shared/`
   **Then** los tests no modifican prototipos globales directamente

---

### Edge Cases

- ¿Qué pasa si `tokens.json` cambia de estructura? Los tests de schema deben fallar con mensajes claros indicando qué token falta o es inválido.
- ¿Qué pasa si se añade un nuevo test de componente con `data-testid`? El lint o code review debe detectarlo. (No blocker para este spec.)
- ¿Qué pasa si los builders compartidos necesitan campos que el dominio no expone? El builder debe usar el constructor/reconstitute del modelo, no duplicar la lógica.

## Requirements

### Functional Requirements

- **FR-001**: `token-schema.test.ts` DEBE usar Vitest (`describe`/`it`/`expect`) y llamar a `validateTokenSchema()` correctamente
- **FR-002**: `contrast-validation.test.ts` DEBE migrarse a Vitest manteniendo todas las validaciones WCAG AA
- **FR-003**: `spacing-grid.test.ts` DEBE migrarse a Vitest y acceder a valores px via `$extensions.pixelValue`
- **FR-004**: `transformation.test.ts` DEBE migrarse a Vitest usando `readFileSync` en lugar de `require()`
- **FR-005**: `MenuSummary.test.tsx` DEBE eliminar aserciones de `data-testid`, clases CSS, y layout
- **FR-006**: `SaveMenuForm.test.tsx` DEBE eliminar `container.querySelector` y aserciones de clases CSS
- **FR-007**: `MenuItemsList.test.tsx` DEBE eliminar `getByTestId` y aserciones de espaciado
- **FR-008**: `tests/shared/MenuBuilder.ts` DEBE importar tipos de `@/src/domain/models/`
- **FR-009**: `tests/shared/MenuItemBuilder.ts` DEBE importar tipos de `@/src/domain/models/`
- **FR-010**: Todos los imports de builders en tests DEBEN actualizarse a `tests/shared/`
- **FR-011**: Los builders duplicados DEBEN eliminarse
- **FR-012**: `npm test` DEBE ejecutar todos los tests (incluyendo design tokens) sin errores

### Non-functional Requirements

- **NFR-001**: Los tests migrados deben mantener la misma cobertura que los originales
- **NFR-002**: Los tests refactorizados deben seguir validando el mismo comportamiento
- **NFR-003**: `npm test` debe completarse en menos de 30 segundos

## Success Criteria

### Measurable Outcomes

- **SC-001**: `npm test` ejecuta todos los tests (408 tests) y todos pasan
- **SC-002**: Tests de design tokens migrados a Vitest sin custom runner
- **SC-003**: Tests de componentes no usan `data-testid`, clases CSS, ni asunciones de layout
- **SC-004**: Builders importan tipos de `@/src/domain/models/` exclusivamente
- **SC-005**: Existe `tests/shared/` con builders comunes y sin duplicación
- **SC-006**: `npm run build` y `npm run lint` pasan sin errores tras todos los cambios

## Out of Scope

- Escribir nuevos tests para funcionalidad no cubierta
- Refactorizar los modelos de dominio (`Menu.ts`, `MenuItem.ts`)
- Cambiar la arquitectura hexagonal
- Añadir tests E2E con Playwright
- Migrar de localStorage a IndexedDB
- Cambiar el sistema de design tokens
