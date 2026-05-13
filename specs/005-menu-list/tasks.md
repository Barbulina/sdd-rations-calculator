# Tasks: Menu List - Home Page

**Input**: Design documents from `/specs/005-menu-list/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Exact file paths included in every task description

---

## Phase 1: Setup

**Purpose**: Create directory structure and test infrastructure for Feature 005

- [x] T001 Create test directories `tests/unit/menu-list/` and `tests/integration/menu-list/`

---

## Phase 2: Foundational (Blocking Prerequisite)

**Purpose**: The `useMenuList` hook powers ALL four user stories. It must be complete before any UI component or page task can begin.

**⚠️ CRITICAL**: No user story UI work can begin until this phase is complete.

- [x] T002 Write failing unit tests for `useMenuList` hook (load, sort, error) in `tests/unit/menu-list/useMenuList.test.ts`
- [x] T003 Write failing unit tests for filter logic (nameFilter, typeFilter, AND logic) in `tests/unit/menu-list/useMenuList.test.ts`
- [x] T004 Write failing unit tests for `deleteMenu` action (confirm, cancel, error) in `tests/unit/menu-list/useMenuList.test.ts`
- [x] T005 Implement `useMenuList` hook — load all menus from `MenuRepository`, sort by `createdAt` desc in `src/application/hooks/useMenuList.ts`
- [x] T006 Add `nameFilter` / `typeFilter` state + `filteredMenus` useMemo to `useMenuList` in `src/application/hooks/useMenuList.ts`
- [x] T007 Add `deleteMenu(id)` action with `window.confirm()` guard to `useMenuList` in `src/application/hooks/useMenuList.ts`
- [x] T008 Add `MENU_TYPE_LABELS` and `MENU_TYPE_ORDER` constants to `specs/005-menu-list/contracts/types.ts` (if not already present — verify and export from a shared location usable by app components)

**Checkpoint**: All `useMenuList` unit tests pass — hook is complete and independently tested

---

## Phase 3: User Story 1 — View Saved Menus List (Priority: P1) 🎯 MVP

**Goal**: Replace the home page with a working menu list. Users can see all saved menus as cards with name, type, date, total rations, and total weight.

**Independent Test**: Save a menu via `/menu-builder`, navigate to `/`, verify the menu card displays all five data fields correctly. With no saved menus, the empty state appears.

### Tests for User Story 1

- [x] T009 [P] [US1] Write failing integration tests for `MenuCard` — renders name, type label, date, rations, weight in `tests/integration/menu-list/MenuCard.test.tsx`
- [x] T010 [P] [US1] Write failing integration tests for home page — loading state, empty state, list of cards in `tests/integration/menu-list/HomePage.test.tsx`

### Implementation for User Story 1

- [x] T011 [P] [US1] Implement `MenuCard` component — displays name, `MENU_TYPE_LABELS[type]`, formatted `createdAt`, `totalRations.toFixed(2)`, `Math.round(totalWeight)`g in `app/components/MenuCard.tsx`
- [x] T012 [US1] Replace `app/page.tsx` — remove rations list, use `useMenuList`, show loading state, show `EmptyState` when `!hasMenus`, render `MenuCard` per menu in `filteredMenus`

**Checkpoint**: US1 independently testable — save a menu, go to `/`, see the card. Empty state works. ✅

---

## Phase 4: User Story 2 — Delete a Menu (Priority: P2)

**Goal**: Each menu card has a delete button. Clicking it prompts for confirmation; on confirm, the menu is removed from the list immediately.

**Independent Test**: Save a menu, open the home page, click Delete on the card, confirm in the dialog → card disappears. Click Delete, cancel → card remains.

### Tests for User Story 2

- [x] T013 [US2] Write failing integration tests for `MenuCard` delete — button triggers `onDelete` with correct id, confirm/cancel behavior in `tests/integration/menu-list/MenuCard.test.tsx`

### Implementation for User Story 2

- [x] T014 [US2] Add Delete button to `MenuCard` that calls `onDelete(menu.id)` in `app/components/MenuCard.tsx`
- [x] T015 [US2] Pass `deleteMenu` from `useMenuList` as `onDelete` prop to each `MenuCard` in `app/page.tsx`
- [x] T016 [US2] Show `error` message from `useMenuList` below the header when deletion fails in `app/page.tsx`

**Checkpoint**: US2 independently testable — delete works, confirmation required, error shown on failure. ✅

---

## Phase 5: User Story 3 — Filter Menus by Name (Priority: P3)

**Goal**: A text input above the menu list lets users search menus by name (case-insensitive, partial match). Clearing the input restores the full list. When no menus match, a "no results" message is shown.

**Independent Test**: Save 3 menus with different names, type part of one name → only matching cards shown. Clear input → all cards shown. Type a name that matches nothing → "no results" message shown.

### Tests for User Story 3

- [x] T017 [P] [US3] Write failing integration tests for `MenuListFilters` — name input renders, `onNameFilterChange` called on type, reflects `nameFilter` value in `tests/integration/menu-list/MenuListFilters.test.tsx`
- [x] T018 [P] [US3] Write failing integration tests for home page name filter — cards filtered on input, "no results" message shown when no match in `tests/integration/menu-list/HomePage.test.tsx`

### Implementation for User Story 3

- [x] T019 [US3] Implement `MenuListFilters` component — name `<input>` with `maxLength={200}`, calls `onNameFilterChange` on change in `app/components/MenuListFilters.tsx`
- [x] T020 [US3] Add `<MenuListFilters>` above the cards in `app/page.tsx` (only when `hasMenus`), pass `nameFilter` and `setNameFilter`
- [x] T021 [US3] Add "no results" message in `app/page.tsx` when `hasMenus && filteredMenus.length === 0`

**Checkpoint**: US3 independently testable — name filter narrows cards in real time; "no results" shown. ✅

---

## Phase 6: User Story 4 — Filter Menus by Type (Priority: P4)

**Goal**: A dropdown selector next to the name filter lets users show only menus of a specific type (Breakfast / Lunch / Dinner / Snack). "All types" restores the full list. Both filters work together (AND logic).

**Independent Test**: Save menus of different types, select "Breakfast" → only breakfast cards shown. Select "All types" → all shown. With both name text and type active, only menus matching both appear.

### Tests for User Story 4

- [x] T022 [P] [US4] Write failing integration tests for `MenuListFilters` — type dropdown renders all options including "All types", `onTypeFilterChange` called with `MenuType` or `null` in `tests/integration/menu-list/MenuListFilters.test.tsx`
- [x] T023 [P] [US4] Write failing integration tests for home page combined filter — AND logic, both filters active, only matching cards shown in `tests/integration/menu-list/HomePage.test.tsx`

### Implementation for User Story 4

- [x] T024 [US4] Add type `<select>` to `MenuListFilters` component — "All types" option (value `""`), one option per `MENU_TYPE_ORDER` entry using `MENU_TYPE_LABELS`, calls `onTypeFilterChange` in `app/components/MenuListFilters.tsx`
- [x] T025 [US4] Pass `typeFilter` and `setTypeFilter` from `useMenuList` to `<MenuListFilters>` in `app/page.tsx`

**Checkpoint**: US4 independently testable — type filter works, combined AND logic works. All 4 user stories functional. ✅

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T026 [P] Run full test suite and confirm all tests pass: `npm test --run`
- [x] T027 [P] Validate quickstart.md scenarios manually in the browser — all 4 user stories
- [x] T028 Mark all implemented tasks complete in this file and commit `tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational — useMenuList)**: Depends on Phase 1. **BLOCKS all UI phases.**
- **Phase 3 (US1 — View list)**: Depends on Phase 2 (hook complete)
- **Phase 4 (US2 — Delete)**: Depends on Phase 3 (MenuCard exists to add delete button to)
- **Phase 5 (US3 — Name filter)**: Depends on Phase 2 (hook has nameFilter). Can overlap with Phase 4.
- **Phase 6 (US4 — Type filter)**: Depends on Phase 5 (MenuListFilters component exists). Extends it.
- **Phase 7 (Polish)**: Depends on all user story phases.

### User Story Dependencies

| Story             | Depends On | Why                                                    |
| ----------------- | ---------- | ------------------------------------------------------ |
| US1 (View list)   | Phase 2    | Needs `useMenuList` (menus, isLoading, hasMenus)       |
| US2 (Delete)      | US1        | `MenuCard` component must exist to add delete button   |
| US3 (Name filter) | Phase 2    | Needs `nameFilter`/`setNameFilter` from hook           |
| US4 (Type filter) | US3        | Extends `MenuListFilters` component with a new control |

### Within Each Phase — Parallel Opportunities

- **Phase 3**: T009 (MenuCard tests) + T010 (HomePage tests) can run in parallel [P]
- **Phase 5**: T017 (Filters tests) + T018 (HomePage filter tests) can run in parallel [P]
- **Phase 6**: T022 (type dropdown tests) + T023 (combined filter tests) can run in parallel [P]

---

## Parallel Execution Examples

### Phase 3 — User Story 1

```
In parallel:
  Task T009: Write MenuCard integration tests in tests/integration/menu-list/MenuCard.test.tsx
  Task T010: Write HomePage integration tests in tests/integration/menu-list/HomePage.test.tsx

Then sequentially:
  Task T011: Implement MenuCard in app/components/MenuCard.tsx
  Task T012: Replace app/page.tsx with menu list
```

### Phase 5 — User Story 3

```
In parallel:
  Task T017: Write MenuListFilters tests (name input) in tests/integration/menu-list/MenuListFilters.test.tsx
  Task T018: Write HomePage name filter tests in tests/integration/menu-list/HomePage.test.tsx

Then sequentially:
  Task T019: Implement MenuListFilters in app/components/MenuListFilters.tsx
  Task T020: Wire filters into app/page.tsx
  Task T021: Add "no results" message to app/page.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only — ~5 tasks)

1. Complete Phase 1 (T001) — 5 minutes
2. Complete Phase 2 (T002–T008) — `useMenuList` hook with all state
3. Complete Phase 3 (T009–T012) — `MenuCard` + home page replacement
4. **STOP and VALIDATE**: Open browser, check menu list renders, empty state works
5. Commit: `feat(menu-list): US1 - View saved menus list`

### Incremental Delivery

| After Phase   | What the user can do                      |
| ------------- | ----------------------------------------- |
| Phase 3 (US1) | See all saved menus on the home page      |
| Phase 4 (US2) | Also delete menus                         |
| Phase 5 (US3) | Also search menus by name                 |
| Phase 6 (US4) | Also filter by type + combined AND filter |

---

## Task Count Summary

| Phase                      | Tasks  | User Story     |
| -------------------------- | ------ | -------------- |
| Phase 1: Setup             | 1      | —              |
| Phase 2: Foundational      | 7      | — (blocks all) |
| Phase 3: US1 – View list   | 4      | US1 (P1)       |
| Phase 4: US2 – Delete      | 4      | US2 (P2)       |
| Phase 5: US3 – Name filter | 5      | US3 (P3)       |
| Phase 6: US4 – Type filter | 4      | US4 (P4)       |
| Phase 7: Polish            | 3      | —              |
| **Total**                  | **28** |                |

**Parallel tasks**: T009+T010, T017+T018, T022+T023, T026+T027 (8 tasks have [P] opportunities)

**MVP scope** (US1 only): T001–T012 = 12 tasks
