# Tasks: Test Infrastructure & Quality Fixes

**Feature**: 007-test-infrastructure
**Branch**: `007-test-infrastructure`
**Date**: 2026-05-13

## Task Format

`- [ ] [ID] [P?] [Story] Description`

- **Checkbox**: All tasks start with `- [ ]` (markdown checkbox)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 0: Setup (ESM/CJS + Vitest Config)

**Purpose**: Preparar el proyecto para ESM y configurar Vitest para incluir los token tests

- [ ] T001 [P] [US1] Añadir `"type": "module"` a `package.json`
- [ ] T002 [P] [US1] Renombrar `postcss.config.js` → `postcss.config.cjs` y cambiar `export default` a `module.exports`
- [ ] T003 [US1] Actualizar `vitest.config.ts`: añadir `tests/integration/design-tokens/**` a los test files, excluir si es necesario
- [ ] T004 [US1] Ejecutar `npm test` y verificar que Vitest arranca correctamente (aunque los tests fallen por API mismatches)

---

## Phase 1: Migrar Token Tests a Vitest (US-1)

**Purpose**: Reescribir los 4 tests standalone para que usen Vitest, corrigiendo API mismatches

### token-schema.test.ts

- [ ] T005 [US1] Reescribir `tests/integration/design-tokens/token-schema.test.ts`: migrar de custom runner a `describe`/`it`/`expect` de Vitest
- [ ] T006 [US1] Corregir llamada a `validateTokenSchema()`: la función es un type guard que devuelve `true` o lanza `Error`, no devuelve `{valid, errors}`
- [ ] T007 [US1] Sustituir `require()` por `import` ESM y eliminar `process.exit(1)`

### contrast-validation.test.ts

- [ ] T008 [US1] Reescribir `tests/integration/design-tokens/contrast-validation.test.ts`: migrar a `describe`/`it`/`expect` de Vitest
- [ ] T009 [US1] Sustituir `require()` por `import` ESM y eliminar `process.exit(1)`

### spacing-grid.test.ts

- [ ] T010 [US1] Reescribir `tests/integration/design-tokens/spacing-grid.test.ts`: migrar a `describe`/`it`/`expect` de Vitest
- [ ] T011 [US1] Corregir acceso a valor en píxeles: usar `token.$extensions.pixelValue` en lugar de `token.value.px`
- [ ] T012 [US1] Corregir verificación de tipo: `SpacingToken.type` es `"dimension"` no `"spacing"`

### transformation.test.ts

- [ ] T013 [US1] Reescribir `tests/integration/design-tokens/transformation.test.ts`: migrar a `describe`/`it`/`expect` de Vitest
- [ ] T014 [US1] Sustituir `require(TAILWIND_TOKENS_PATH)` por `readFileSync` + validación de estructura
- [ ] T015 [US1] Eliminar `process.exit(1)`

### Verificación

- [ ] T016 [US1] Ejecutar `npm test` → verificar que los 4 token tests pasan dentro de Vitest

---

## Phase 2: Refactor Tests Frágiles (US-2)

**Purpose**: Desacoplar tests de componentes de implementación específica (clases CSS, test IDs, layout)

### MenuSummary.test.tsx

- [ ] T017 [US2] Reemplazar `screen.getByTestId("menu-summary")` por queries semánticas (`role`, `text`, `labelText`)
- [ ] T018 [US2] Reemplazar `toHaveClass(/bg-|border-/)` por verificación de que el componente renderiza y muestra valores correctos
- [ ] T019 [US2] Reemplazar test "weight and rations side by side" por verificación de que ambos valores están presentes en el documento
- [ ] T020 [US2] Reemplazar tests ARIA acoplados (valor exacto `aria-live="polite"`) por verificación genérica de atributos accesibles

### SaveMenuForm.test.tsx

- [ ] T021 [US2] Reemplazar `container.querySelector("form") + fireEvent.submit()` por `userEvent.click(botón guardar)`
- [ ] T022 [US2] Reemplazar `toHaveClass(/text-red|error/)` por verificación de que el mensaje de error existe en el DOM
- [ ] T023 [US2] Simplificar tests ARIA: verificar presencia de mensaje de error accesible sin asumir estructura exacta de atributos

### MenuItemsList.test.tsx

- [ ] T024 [US2] Reemplazar `getAllByTestId(/menu-item-card/)` por `screen.getAllByRole("article")` o similar semántico
- [ ] T025 [US2] Eliminar tests de espaciado entre items (comportamiento de CSS, no de componente)
- [ ] T026 [US2] Eliminar `container.querySelector` con selectores de espaciado (`margin`, `gap`)

---

## Phase 3: Centralizar Builders y Mocking (US-3)

**Purpose**: Consolidar builders en `tests/shared/` con tipos del dominio y crear helpers de mocking

### Shared Builders

- [ ] T027 [P] [US3] Crear `tests/shared/MenuBuilder.ts` importando tipos de `@/src/domain/models/Menu`
- [ ] T028 [P] [US3] Crear `tests/shared/MenuItemBuilder.ts` importando tipos de `@/src/domain/models/MenuItem`
- [ ] T029 [US3] Actualizar imports en `tests/unit/menu-builder/` (Menu.test.ts, MenuItem.test.ts, useMenuBuilder.test.ts, MenuSummary.test.tsx)
- [ ] T030 [US3] Actualizar imports en `tests/unit/menu-list/` (useMenuList.test.tsx)
- [ ] T031 [US3] Actualizar imports en `tests/unit/menu-detail/` (useMenuDetail.test.tsx)
- [ ] T032 [US3] Actualizar imports en `tests/integration/menu-builder/` (LocalStorageMenuRepository.test.ts, AutocompleteSearch.test.tsx, MenuItemsList.test.tsx, MenuRepositoryContext.test.tsx)
- [ ] T033 [US3] Eliminar builders duplicados: `tests/unit/menu-builder/MenuBuilder.ts`, `tests/unit/menu-builder/MenuItemBuilder.ts`, `tests/unit/menu-list/MenuBuilder.ts`, `tests/unit/menu-detail/MenuBuilder.ts`

### LocalStorage Mock Helper

- [ ] T034 [P] [US3] Crear `tests/shared/localStorageMock.ts` con función `createQuotaExceededMock()` que devuelve `{ restore: () => void }`
- [ ] T035 [US3] Actualizar `tests/integration/menu-builder/LocalStorageMenuRepository.test.ts` para usar el helper
- [ ] T036 [US3] Actualizar `tests/integration/custom-aliments/LocalStorageCustomAlimentRepository.test.ts` para usar el helper

---

## Phase 4: Verificación Final

**Purpose**: Ejecutar suite completa, build y lint para verificar que no hay regresiones

- [ ] T037 Ejecutar `npm test` → todos los tests pasan (400+)
- [ ] T038 Ejecutar `npm run build` → build correcto sin errores
- [ ] T039 Ejecutar `npm run lint` → sin errores de linting
- [ ] T040 Si se añadió `"type": "module"`, verificar que `next.config.ts` y otros archivos ESM funcionan correctamente

---

## Execution Strategy

### TDD Workflow

No aplica TDD estricto (son tests existentes). Para cada fase:

1. Hacer cambios → 2. Ejecutar `npm test` → 3. Verificar que pasan → 4. Pasar a siguiente

### Parallel Execution

Tasks marked **[P]** can run in parallel:

- T001-T002: Cambios independientes en package.json y postcss.config
- T005-T015: Los 4 token tests son independientes entre sí
- T017-T026: Los 3 componentes frágiles son independientes
- T027-T028: Ambos builders compartidos pueden crearse en paralelo
- T034: Helper de mock independiente

### Dependency Chain

**Must complete in order**:

1. Phase 0 → unlocks Phase 1 (sin ESM config no arrancan tests migrados correctamente)
2. T016 (token tests pasan) → verifica Phase 1 completa
3. T029 → depende de T027-T028 (shared builders creados)
4. T037 → verifica todo el Phase 1-3 completo

### Progress Tracking

Mark tasks complete with `[X]` in tasks.md as you finish them. After each phase, verify:

- ✅ `npm test` passes
- ✅ No linting errors (`npm run lint`)
- ✅ Build succeeds (`npm run build`)
- ✅ No regressions in existing functionality
