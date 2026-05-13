# Tasks: Menu Detail

**Input**: Design documents from `/specs/006-menu-detail/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Organization**: Tasks grouped by user story, TDD approach (tests before code).

---

## Phase 1: Setup

- [x] T001 Create test directories `tests/unit/menu-detail/` and `tests/integration/menu-detail/`
- [x] T002 Create `tests/unit/menu-detail/MenuBuilder.ts` — test fixture builder reusing Feature 005 pattern (uses `MenuType`, builds `Menu` plain objects with items)

---

## Phase 2: Foundational — `useMenuDetail` hook

**⚠️ CRITICAL**: All UI phases depend on this hook being complete.

- [x] T003 Write failing unit tests for `useMenuDetail` — load menu by id (success, not-found, error, loading state) in `tests/unit/menu-detail/useMenuDetail.test.tsx`
- [x] T004 Write failing unit tests for `useMenuDetail` — editName/editType state, setEditName, setEditType in `tests/unit/menu-detail/useMenuDetail.test.tsx`
- [x] T005 Write failing unit tests for `useMenuDetail` — saveChanges (success, empty name validation, repository error) in `tests/unit/menu-detail/useMenuDetail.test.tsx`
- [x] T006 Write failing unit tests for `useMenuDetail` — removeItem (success, last item guard, repository error) in `tests/unit/menu-detail/useMenuDetail.test.tsx`
- [x] T007 Write failing unit tests for `useMenuDetail` — addItem (success, recalculates totals, repository error) in `tests/unit/menu-detail/useMenuDetail.test.tsx`
- [x] T008 Implement `useMenuDetail(id: string)` hook in `src/application/hooks/useMenuDetail.ts` — load, editName/editType state, saveChanges, removeItem, addItem
- [x] T009 Verify all `useMenuDetail` unit tests pass

**Checkpoint**: All useMenuDetail unit tests green ✅

---

## Phase 3: User Story 1 — View Menu Detail (Priority: P1) 🎯 MVP

**Goal**: Clicking a MenuCard navigates to `/menu/[id]`. The page shows the full menu detail in read + edit-capable layout.

### Tests for US1

- [x] T010 [P] [US1] Write failing integration tests for `MenuCard` — clicking the card navigates to `/menu/[id]`, delete button does not navigate in `tests/integration/menu-list/MenuCard.test.tsx`
- [x] T011 [P] [US1] Write failing integration tests for `MenuDetailPage` — loading state, not-found state, name in `<h1>`, type label, formatted date, items list, totals, back link in `tests/integration/menu-detail/MenuDetailPage.test.tsx`
- [x] T012 [P] [US1] Write failing integration tests for `MenuItemRow` — shows aliment name, weight, rations; remove button present in `tests/integration/menu-detail/MenuItemRow.test.tsx`

### Implementation for US1

- [x] T013 [US1] Modify `app/components/MenuCard.tsx` — wrap non-delete area in `<Link href={/menu/${menu.id}}>` with `e.stopPropagation()` on delete button
- [x] T014 [US1] Create `app/components/menu-detail/MenuItemRow.tsx` — shows aliment name, `weightGrams`g, `rations.toFixed(2)` rations; delete button with `aria-label`
- [x] T015 [US1] Create `app/components/menu-detail/MenuDetailSummary.tsx` — shows total rations (`toFixed(2)`) and total weight (`Math.round`g)
- [x] T016 [US1] Create `app/menu/[id]/page.tsx` — `'use client'`, uses `useMenuDetail(params.id)`, shows loading / not-found / detail view with `MenuItemRow` list + `MenuDetailSummary` + back link

**Checkpoint**: US1 independently testable — click card → navigate → see detail ✅

---

## Phase 4: User Story 2 — Edit Name and Type (Priority: P2)

**Goal**: Name input and type select on the detail page. "Save changes" persists to repository.

### Tests for US2

- [x] T017 [US2] Write failing integration tests for `MenuDetailPage` — name input present with current value, type select with correct option selected, save button; empty name shows error; save calls update() in `tests/integration/menu-detail/MenuDetailPage.test.tsx`

### Implementation for US2

- [x] T018 [US2] Add name `<input>` and type `<select>` to `app/menu/[id]/page.tsx` connected to `useMenuDetail.editName`, `editType`, `nameError`, `isSaving`, `saveChanges`
- [x] T019 [US2] Add "Save changes" button to page that calls `saveChanges()` and shows `saveError` if present

**Checkpoint**: US2 independently testable — edit name + type → save → persisted ✅

---

## Phase 5: User Story 3 — Remove an Aliment (Priority: P3)

**Goal**: Each item row has a remove button. Removing recalculates totals and saves. Last item is protected.

### Tests for US3

- [x] T020 [US3] Write failing integration tests for `MenuDetailPage` — remove button on each item; clicking remove updates list and totals; last item remove is disabled/blocked in `tests/integration/menu-detail/MenuDetailPage.test.tsx`

### Implementation for US3

- [x] T021 [US3] Connect `onRemove` prop on `MenuItemRow` to `useMenuDetail.removeItem` in `app/menu/[id]/page.tsx`
- [x] T022 [US3] Disable remove button in `MenuItemRow` when `isLast` prop is true; add `title` tooltip explaining why

**Checkpoint**: US3 independently testable — remove item → list updates → totals recalculate ✅

---

## Phase 6: User Story 4 — Add an Aliment (Priority: P4)

**Goal**: AutocompleteSearch + WeightInputDialog on detail page. Adding recalculates totals and saves.

### Tests for US4

- [x] T023 [US4] Write failing integration tests for `MenuDetailPage` — AutocompleteSearch is present; mock: selecting aliment + confirming weight adds item to the list in `tests/integration/menu-detail/MenuDetailPage.test.tsx`

### Implementation for US4

- [x] T024 [US4] Add `AutocompleteSearch` and `WeightInputDialog` to `app/menu/[id]/page.tsx` — connect selection flow to `useMenuDetail.addItem`

**Checkpoint**: US4 independently testable — search aliment → add → appears in list ✅

---

## Phase 7: Polish & Validation

- [x] T025 [P] Run full menu-detail test suite: `npm test -- menu-detail --run`
- [x] T026 [P] Run full test suite and confirm no regressions: `npm test -- --run` (excluding known pre-existing failures)
- [x] T027 Mark all tasks complete [X] in this file and commit

---

## Dependencies

| Phase                | Depends On                |
| -------------------- | ------------------------- |
| Phase 2 (hook)       | Phase 1 (setup)           |
| Phase 3 (US1 view)   | Phase 2 (hook complete)   |
| Phase 4 (US2 edit)   | Phase 3 (page exists)     |
| Phase 5 (US3 remove) | Phase 4 (page has items)  |
| Phase 6 (US4 add)    | Phase 5 (item row exists) |
| Phase 7 (polish)     | All phases                |

### Within phases — parallel opportunities [P]

- Phase 3: T010 + T011 + T012 can be written in parallel (different files)
- Phase 7: T025 + T026 can run in parallel
