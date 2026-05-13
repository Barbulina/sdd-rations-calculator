# Tasks: Menu Builder

**Feature**: 004-menu-builder  
**Branch**: `004-menu-builder`  
**Date**: 2026-02-12  
**Dependencies**: Feature 003 (Aliment Catalog)

## Task Format

`- [ ] [ID] [P?] [Story] Description`

- **Checkbox**: All tasks start with `- [ ]` (markdown checkbox)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## User Stories Reference

- **US1**: Autocomplete search with all aliment data
- **US2**: Add aliments with weight, auto-calculate rations
- **US3**: View summary (total weight, total rations)
- **US4**: Save menu with name and type
- **US5**: Empty states and cancel

---

## Phase 1: Setup (Prerequisites Check)

**Purpose**: Verify testing infrastructure exists from Feature 003

- [x] T001 Verify Vitest installed: Check `node_modules/@vitest`
- [x] T002 Verify Playwright installed: Check `node_modules/@playwright`
- [x] T003 Verify `vitest.config.ts` exists in project root
- [x] T004 Verify `playwright.config.ts` exists in project root
- [x] T005 Run `npm test` to confirm test environment works
- [x] T006 Create `.gitignore` entries if missing: `coverage/`, `test-results/`, `playwright-report/`

---

## Phase 2: Domain Layer - MenuItem - TDD (US2: Weight & Rations Calculation)

**Purpose**: Implement MenuItem entity with weight validation and rations calculation

### Tests First (RED)

- [x] T007 [US2] Create `tests/unit/menu-builder/MenuItemBuilder.ts` test builder for MenuItem fixtures
- [x] T008 [US2] Write `tests/unit/menu-builder/MenuItem.test.ts` - test MenuItem creation with valid data
- [x] T009 [P] [US2] Write tests for weight validation (must be > 0)
- [x] T010 [P] [US2] Write tests for weight validation (must be <= 10000)
- [x] T011 [P] [US2] Write tests for rations calculation (weightGrams / gramsToCarbohydrate)
- [x] T012 [P] [US2] Write tests for rations precision (2 decimal places)
- [x] T013 [P] [US2] Write tests for UUID generation
- [x] T014 [US2] Run `npm test` → verify all MenuItem tests fail (RED phase)

### Implementation (GREEN)

- [x] T015 [US2] Create `src/domain/models/MenuItem.ts` with MenuItem class/interface
- [x] T016 [US2] Implement constructor with aliment, weightGrams parameters
- [x] T017 [US2] Implement weight validation function
- [x] T018 [US2] Implement rations calculation getter/property
- [x] T019 [US2] Implement UUID generation using crypto.randomUUID()
- [x] T020 [US2] Implement toFixed(2) for rations precision
- [x] T021 [US2] Run `npm test` → verify all MenuItem tests pass (GREEN phase) - ✓ 20/20 tests passing

### Refactor

- [x] T022 [US2] Refactor validation logic if needed for clarity - no refactoring needed
- [x] T023 [US2] Run `npm test` → ensure tests still pass after refactoring

---

## Phase 3: Domain Layer - Menu - TDD (US3, US4: Totals & Validation)

**Purpose**: Implement Menu entity with totals calculation and validation

### Tests First (RED)

- [x] T024 [US4] Create `tests/unit/menu-builder/MenuBuilder.ts` test builder for Menu fixtures
- [x] T025 [US4] Write `tests/unit/menu-builder/Menu.test.ts` - test Menu creation with valid data
- [x] T026 [P] [US4] Write tests for name validation (required, trimmed, max 200 chars)
- [x] T027 [P] [US4] Write tests for type validation (required, valid RationsType)
- [x] T028 [P] [US4] Write tests for items validation (min 1 item)
- [x] T029 [P] [US3] Write tests for totalWeight calculation (sum of item weights)
- [x] T030 [P] [US3] Write tests for totalRations calculation (sum of item rations)
- [x] T031 [P] [US4] Write tests for createdAt timestamp auto-generation
- [x] T032 [P] [US4] Write tests for updatedAt on updates
- [x] T033 [US4] Run `npm test` → verify all Menu tests fail (RED phase)

### Implementation (GREEN)

- [x] T034 [US4] Create `src/domain/models/Menu.ts` with Menu class/interface
- [x] T035 [US4] Implement constructor with name, type, items parameters
- [x] T036 [US4] Implement name validation function
- [x] T037 [US4] Implement type validation function
- [x] T038 [US4] Implement items validation function (min 1 item)
- [x] T039 [US3] Implement totalWeight getter/property (reduce items)
- [x] T040 [US3] Implement totalRations getter/property (reduce items, toFixed(2))
- [x] T041 [US4] Implement createdAt auto-generation (new Date())
- [x] T042 [US4] Implement updatedAt handling for updates
- [x] T043 [US4] Implement UUID generation
- [x] T044 [US4] Run `npm test` → verify all Menu tests pass (GREEN phase) - ✓ 29/29 tests passing

### Refactor

- [x] T045 [US4] Refactor totals calculation for performance (memoization if needed) - no refactoring needed
- [x] T046 [US4] Run `npm test` → ensure tests still pass after refactoring
- [ ] T044 [US4] Run `npm test` → verify all Menu tests pass (GREEN phase)

### Refactor

- [ ] T045 [US4] Refactor totals calculation for performance (memoization if needed)
- [ ] T046 [US4] Run `npm test` → ensure tests still pass after refactoring

---

## Phase 4: Repository Layer - TDD (US4: Persistence)

**Purpose**: Implement MenuRepository with localStorage persistence

### Tests First (RED)

- [x] T047 [US4] Write `tests/integration/menu-builder/LocalStorageMenuRepository.test.ts` - test save() method
- [x] T048 [P] [US4] Write tests for getAll() - returns all menus
- [x] T049 [P] [US4] Write tests for getById() - returns menu or null
- [x] T050 [P] [US4] Write tests for update() - updates and sets updatedAt
- [x] T051 [P] [US4] Write tests for delete() - removes menu by ID
- [x] T052 [P] [US4] Write tests for deleteAll() - clears all menus
- [x] T053 [P] [US4] Write tests for Date serialization (ISO 8601 format)
- [x] T054 [P] [US4] Write tests for Date deserialization (string → Date object)
- [x] T055 [P] [US4] Write tests for storage quota exceeded error
- [x] T056 [P] [US4] Write tests for corrupt data handling
- [x] T057 [US4] Run `npm test` → verify all repository tests fail (RED phase)

### Implementation (GREEN)

- [x] T058 [US4] Create `src/domain/repositories/MenuRepository.ts` interface matching contracts/MenuRepository.ts
- [x] T059 [US4] Create `src/infrastructure/repositories/LocalStorageMenuRepository.ts` implementing interface
- [x] T060 [US4] Implement save() with UUID generation, timestamps, totals calculation
- [x] T061 [US4] Implement getAll() with JSON parsing and Date deserialization
- [x] T062 [P] [US4] Implement getById() with array.find
- [x] T063 [P] [US4] Implement update() with updatedAt timestamp
- [x] T064 [P] [US4] Implement delete() with array.filter
- [x] T065 [P] [US4] Implement deleteAll() clearing storage key
- [x] T066 [P] [US4] Implement isAvailable() checking localStorage access
- [x] T067 [P] [US4] Implement getStorageStats() if possible - not implemented (not needed)
- [x] T068 [US4] Add error handling for QuotaExceededError
- [x] T069 [US4] Add error handling for corrupt JSON data
- [x] T070 [US4] Use localStorage key: `sdd-rations-calculator:menus`
- [x] T071 [US4] Run `npm test` → verify all repository tests pass (GREEN phase)

### Refactor

- [x] T072 [US4] Refactor duplicate serialization/deserialization into private methods
- [x] T073 [US4] Run `npm test` → ensure tests still pass after refactoring

---

## Phase 5: Application Layer - Hook - TDD (US2, US3, US4: State Management)

**Purpose**: Implement useMenuBuilder hook for menu state management

### Tests First (RED)

- [x] T074 [US2] Write `tests/unit/menu-builder/useMenuBuilder.test.ts` - test initial state
- [x] T075 [P] [US2] Write tests for addItem() - creates MenuItem with UUID and rations
- [x] T076 [P] [US2] Write tests for addItem() with invalid weight (should throw or reject)
- [x] T077 [P] [US2] Write tests for removeItem() by ID
- [x] T078 [P] [US2] Write tests for updateItemWeight() - recalculates rations
- [x] T079 [P] [US3] Write tests for totalWeight auto-calculation
- [x] T080 [P] [US3] Write tests for totalRations auto-calculation
- [x] T081 [P] [US4] Write tests for clearItems()
- [x] T082 [P] [US4] Write tests for saveMenu() - calls repository.save()
- [x] T083 [P] [US4] Write tests for saveMenu() validation errors
- [x] T084 [US2] Run `npm test` → verify all hook tests fail (RED phase) - confirmed module not found

### Implementation (GREEN)

- [x] T085 [US2] Create `src/application/hooks/useMenuBuilder.ts` with hook scaffold
- [x] T086 [US2] Implement items state: useState<MenuItem[]>([])
- [x] T087 [US2] Implement addItem() function - validate weight, create MenuItem, append to array
- [x] T088 [US2] Implement removeItem() function - filter by ID
- [x] T089 [US2] Implement updateItemWeight() - map over items, find by ID, recalculate rations
- [x] T090 [US3] Implement totalWeight with useMemo - sum of item.weightGrams
- [x] T091 [US3] Implement totalRations with useMemo - sum of item.rations, toFixed(2)
- [x] T092 [US4] Implement clearItems() - setItems([])
- [x] T093 [US4] Implement saveMenu() - validate, create Menu, call repository.save()
- [x] T094 [US4] Implement isLoading state for async operations
- [x] T095 [US4] Implement error state for error messages
- [x] T096 [US4] Implement clearError() function
- [x] T097 [US2] Run `npm test` → verify all hook tests pass (GREEN phase)

### Refactor

- [x] T098 [US2] Refactor validation logic if needed - no refactoring needed
- [x] T099 [US2] Run `npm test` → ensure tests still pass after refactoring

---

## Phase 6: Application Layer - Context (US4: Dependency Injection)

**Purpose**: Wire up MenuRepository context for DI

### Tests First (RED)

- [x] T100 [US4] Write `tests/integration/menu-builder/MenuRepositoryContext.test.tsx` - test context provider
- [x] T101 [P] [US4] Write tests for useMenuRepository() hook throws if no provider
- [x] T102 [US4] Run `npm test` → verify context tests fail (RED phase) - confirmed module not found

### Implementation (GREEN)

- [x] T103 [US4] Create `src/application/contexts/MenuRepositoryContext.tsx` with provider and hook
- [x] T104 [US4] Implement MenuRepositoryProvider component wrapping children
- [x] T105 [US4] Implement useMenuRepository() hook with useContext
- [x] T106 [US4] Add error throw if hook used outside provider
- [x] T107 [US4] Update `app/providers.tsx` to include MenuRepositoryProvider with LocalStorageMenuRepository
- [x] T108 [US4] Run `npm test` → verify context tests pass (GREEN phase)

### Refactor

- [x] T109 [US4] No refactoring needed - context is simple
- [x] T110 [US4] Run `npm test` → ensure tests still pass - 122/122 menu-builder tests passing

---

## Phase 7: UI Components - Autocomplete Search - TDD (US1: Search with Full Data)

**Purpose**: Implement autocomplete search showing all aliment properties

### Tests First (RED)

- [x] T111 [US1] Write `tests/integration/menu-builder/AutocompleteSearch.test.ts` - test search input renders
- [x] T112 [P] [US1] Write tests for debounced search (300ms delay)
- [x] T113 [P] [US1] Write tests for filtering aliments by name (case-insensitive)
- [x] T114 [P] [US1] Write tests for keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
- [x] T115 [P] [US1] Write tests for suggestion item displays all aliment data (name, category, grams, GI, custom badge)
- [x] T116 [P] [US1] Write tests for click to select aliment
- [x] T117 [P] [US5] Write tests for empty state ("No aliments found")
- [x] T118 [US1] Run `npm test` → verify all autocomplete tests fail (RED phase)

### Implementation (GREEN)

- [x] T119 [US1] Create `app/components/AutocompleteSearch.tsx` component
- [x] T120 [US1] Implement search input with controlled value
- [x] T121 [US1] Implement debounce logic (300ms using useEffect + setTimeout)
- [x] T122 [US1] Use `useCompositeAliments` hook to get aliments
- [x] T123 [US1] Implement filtering logic (lowercased name includes search term)
- [x] T124 [US1] Implement suggestions dropdown with conditional rendering
- [x] T125 [US1] Create `app/components/AlimentSuggestionItem.tsx` component
- [x] T126 [US1] Implement suggestion item layout - display name, category badge, gramsToCarbohydrate, bloodGlucoseIndex, custom badge
- [x] T127 [US1] Add category badge color coding using design tokens
- [x] T128 [US1] Implement keyboard navigation (selectedIndex state, handleKeyDown)
- [x] T129 [US1] Implement click handler calling onSelectAliment prop
- [x] T130 [US1] Implement Enter key selection
- [x] T131 [US1] Implement Escape key to close dropdown
- [x] T132 [US5] Implement empty state component
- [x] T133 [US1] Add ARIA attributes (role="combobox", aria-autocomplete, aria-expanded, aria-activedescendant)
- [ ] T134 [US1] Run `npm test` → verify all autocomplete tests pass (GREEN phase) - NOTE: Tests created, may need async/act() debugging

### Refactor

- [ ] T135 [US1] Extract debounce logic into custom hook `useDebounce` if reusable
- [ ] T136 [US1] Extract suggestion item component if not already done - DONE: Already extracted as AlimentSuggestionItem.tsx
- [ ] T137 [US1] Run `npm test` → ensure tests still pass after refactoring

---

## Phase 8: UI Components - Weight Input Dialog - TDD (US2: Weight Entry)

**Purpose**: Implement modal dialog for weight input

### Tests First (RED)

- [x] T138 [US2] Write `tests/integration/menu-builder/WeightInputDialog.test.ts` - test dialog renders
- [x] T139 [P] [US2] Write tests for weight validation (must be > 0 and <= 10000)
- [x] T140 [P] [US2] Write tests for "Add" button disabled when weight invalid
- [x] T141 [P] [US2] Write tests for "Cancel" button closes dialog
- [x] T142 [P] [US2] Write tests for Escape key closes dialog
- [x] T143 [P] [US2] Write tests for successful submission calls onAdd with weight
- [x] T144 [P] [US2] Write tests for auto-focus on weight input
- [x] T145 [US2] Run `npm test` → verify all dialog tests fail (RED phase)

### Implementation (GREEN)

- [x] T146 [US2] Create `app/components/WeightInputDialog.tsx` component
- [x] T147 [US2] Implement modal overlay with backdrop
- [x] T148 [US2] Implement weight input (type="number", min=1, max=10000)
- [x] T149 [US2] Implement validation state (valid/invalid)
- [x] T150 [US2] Implement real-time validation onChange
- [x] T151 [US2] Implement "Add" button (disabled when invalid)
- [x] T152 [US2] Implement "Cancel" button calling onCancel prop
- [x] T153 [US2] Implement Escape key handler
- [x] T154 [US2] Implement auto-focus using useEffect + inputRef
- [x] T155 [US2] Add ARIA attributes (role="dialog", aria-labelledby, aria-describedby)
- [x] T156 [US2] Run `npm test` → verify all dialog tests pass (GREEN phase) - 24/24 tests passing

### Refactor

- [ ] T157 [US2] Extract modal wrapper into reusable `Dialog` component if useful - SKIP: Component is simple enough
- [ ] T158 [US2] Run `npm test` → ensure tests still pass after refactoring - SKIP: No refactoring needed

---

## Phase 9: UI Components - Menu Items List - TDD (US2, US3: Display Items with Full Data)

**Purpose**: Implement list of selected menu items with inline weight editing

### Tests First (RED)

- [x] T159 [US2] Write `tests/integration/menu-builder/MenuItemsList.test.ts` - test list renders items
- [x] T160 [P] [US2] Write tests for each item displays all aliment data (name, category, grams, GI, custom badge)
- [x] T161 [P] [US2] Write tests for weight inline editing
- [x] T162 [P] [US2] Write tests for rations auto-update when weight changes
- [x] T163 [P] [US2] Write tests for remove button deletes item
- [x] T164 [P] [US5] Write tests for empty state ("No aliments added")
- [x] T165 [US2] Run `npm test` → verify all list tests fail (RED phase)

### Implementation (GREEN)

- [x] T166 [US2] Create `app/components/MenuItemsList.tsx` component
- [x] T167 [US2] Create `app/components/MenuItemCard.tsx` component for each item
- [x] T168 [US2] Implement card layout displaying:
  - Aliment name (heading)
  - Category badge (colored)
  - gramsToCarbohydrate (e.g., "1 ration = 110g")
  - bloodGlucoseIndex (e.g., "IG: 38")
  - Custom badge (if isCustom)
- [x] T169 [US2] Implement weight input (type="number", inline editable)
- [x] T170 [US2] Implement onChange handler calling updateItemWeight
- [x] T171 [US2] Implement calculated rations display (item.rations.toFixed(2))
- [x] T172 [US2] Implement remove button (trash icon) calling removeItem
- [x] T173 [US5] Implement empty state with EmptyState component
- [x] T174 [US2] Add styling with design tokens (card, spacing, typography)
- [x] T175 [US2] Run `npm test` → verify all list tests pass (GREEN phase) - 24/24 tests passing

### Refactor

- [x] T176 [US2] Ensure MenuItemCard is properly extracted - DONE
- [x] T177 [US2] Run `npm test` → ensure tests still pass after refactoring - DONE

---

## Phase 10: UI Components - Menu Summary - TDD (US3: Totals Display)

**Purpose**: Implement summary showing total weight and rations

### Tests First (RED)

- [x] T178 [US3] Write `tests/unit/menu-builder/MenuSummary.test.ts` - test summary renders totals
- [x] T179 [P] [US3] Write tests for totalWeight display (formatted with "g")
- [x] T180 [P] [US3] Write tests for totalRations display (2 decimals + "rations")
- [x] T181 [P] [US3] Write tests for auto-update when items change
- [x] T182 [US3] Run `npm test` → verify all summary tests fail (RED phase)

### Implementation (GREEN)

- [x] T183 [US3] Create `app/components/MenuSummary.tsx` component
- [x] T184 [US3] Implement totalWeight display: `{totalWeight}g`
- [x] T185 [US3] Implement totalRations display: `{totalRations.toFixed(2)} rations`
- [x] T186 [US3] Add highlighted styling with design tokens (background, border)
- [x] T187 [US3] Add ARIA live region for dynamic updates
- [x] T188 [US3] Run `npm test` → verify all summary tests pass (GREEN phase)

### Refactor

- [x] T189 [US3] No refactoring needed - component is simple
- [x] T190 [US3] Run `npm test` → ensure tests still pass

---

## Phase 11: UI Components - Save Menu Form - TDD (US4: Save Functionality)

**Purpose**: Implement form for menu name, type, and save button

### Tests First (RED)

- [x] T191 [US4] Write `tests/integration/menu-builder/SaveMenuForm.test.ts` - test form renders
- [x] T192 [P] [US4] Write tests for name validation (required, max 200 chars)
- [x] T193 [P] [US4] Write tests for type selection (required, valid MenuType)
- [x] T194 [P] [US4] Write tests for "Save" button disabled when invalid or no items
- [x] T195 [P] [US4] Write tests for successful save navigates to home
- [x] T196 [P] [US4] Write tests for error display on save failure
- [x] T197 [P] [US5] Write tests for "Cancel" button navigates back
- [x] T198 [US4] Run `npm test` → verify all form tests fail (RED phase)

### Implementation (GREEN)

- [x] T199 [US4] Create `app/components/SaveMenuForm.tsx` component
- [x] T200 [US4] Implement name input with controlled value
- [x] T201 [US4] Implement type select (dropdown with MenuType options)
- [x] T202 [US4] Implement name validation (required, max 200)
- [x] T203 [US4] Implement type validation (required)
- [x] T204 [US4] Implement "Save" button disabled logic (invalid || items.length === 0)
- [x] T205 [US4] Implement handleSubmit calling saveMenu()
- [x] T206 [US4] Implement loading state during save (button shows spinner)
- [x] T207 [US4] Implement error display (red text below form)
- [x] T208 [US5] Implement "Cancel" button - useRouter().back() or navigate to '/'
- [x] T209 [US4] Add ARIA attributes for form fields
- [x] T210 [US4] Run `npm test` → verify all form tests pass (GREEN phase)

### Refactor

- [x] T211 [US4] Extract form validation into custom hook if complex
- [x] T212 [US4] Run `npm test` → ensure tests still pass after refactoring

---

## Phase 12: Page Integration - TDD (US1-US5: Complete Flow)

**Purpose**: Integrate all components into create-ration page

### Tests First (RED)

- [ ] T213 [US1-5] Write `tests/e2e/menu-builder.spec.ts` - test full menu creation flow
- [ ] T214 [P] [US1] Write E2E test for aliment search and selection
- [ ] T215 [P] [US2] Write E2E test for weight entry and item addition
- [ ] T216 [P] [US2] Write E2E test for multiple items
- [ ] T217 [P] [US2] Write E2E test for weight editing
- [ ] T218 [P] [US2] Write E2E test for item removal
- [ ] T219 [P] [US3] Write E2E test for totals calculation
- [ ] T220 [P] [US4] Write E2E test for menu save
- [ ] T221 [P] [US5] Write E2E test for cancel navigation
- [ ] T222 [US1-5] Run `npm run test:e2e` → verify all E2E tests fail (RED phase)

### Implementation (GREEN)

- [ ] T223 [US1-5] Redesign `app/create-ration/page.tsx` - remove old manual ration form
- [ ] T224 [US1] Add AutocompleteSearch component
- [ ] T225 [US2] Add WeightInputDialog component (conditional rendering)
- [ ] T226 [US2] Add MenuItemsList component
- [ ] T227 [US3] Add MenuSummary component
- [ ] T228 [US4] Add SaveMenuForm component
- [ ] T229 [US1-5] Wire up useMenuBuilder hook
- [ ] T230 [US2] Implement aliment selection flow (search → select → dialog → add)
- [ ] T231 [US4] Implement save success navigation (router.push('/'))
- [ ] T232 [US4] Wrap page in MenuRepositoryProvider (or verify in app/providers.tsx)
- [ ] T233 [US1-5] Add page layout with design tokens (spacing, typography)
- [ ] T234 [US1-5] Add page title and description
- [ ] T235 [US1-5] Run `npm run test:e2e` → verify all E2E tests pass (GREEN phase)

### Refactor

- [ ] T236 [US1-5] Optimize component re-renders if needed (React.memo)
- [ ] T237 [US1-5] Run `npm run test:e2e` → ensure tests still pass after refactoring

---

## Phase 13: Home Page Integration (Display Menus)

**Purpose**: Show saved menus on home page (optional - may defer to future feature)

### Option A: Display menus on home page (in this feature)

- [ ] T238 Create `app/components/MenuCard.tsx` to display saved menu
- [ ] T239 Update `app/page.tsx` to fetch menus from repository
- [ ] T240 Add menus section to home page layout
- [ ] T241 Implement expand/collapse for menu items
- [ ] T242 Add options menu (edit, delete) - may defer to v2

### Option B: Defer to future feature (recommended for MVP)

- [ ] T238 Document home page integration as future enhancement
- [ ] T239 Focus on menu creation flow only for this feature
- [ ] T240 Plan Feature 005 for menu display and management

**Recommendation**: Option B - keep scope focused on menu builder creation flow

---

## Phase 14: Ignore Files Setup

**Purpose**: Create/verify ignore files for tools and technologies

- [ ] T243 Check if `.gitignore` exists, create if missing or verify it contains: `node_modules/`, `dist/`, `build/`, `.next/`, `coverage/`, `test-results/`, `playwright-report/`, `.env*`, `*.log`, `.DS_Store`
- [ ] T244 Check if `.eslintignore` or `eslint.config.*` exists, ensure patterns: `node_modules/`, `dist/`, `build/`, `.next/`, `coverage/`, `test-results/`, `playwright-report/`
- [ ] T245 Check if `.prettierignore` exists (if .prettierrc\* found), ensure patterns: `node_modules/`, `dist/`, `build/`, `.next/`, `coverage/`, `package-lock.json`, `pnpm-lock.yaml`
- [ ] T246 Check if `.dockerignore` needed (if Dockerfile* exists), create with patterns: `node_modules/`, `.git/`, `.env*`, `coverage/`, `test-results/`, `\*.log`
- [ ] T247 Verify `.gitignore` contains `.vscode/`, `.idea/` if not already present

---

## Phase 15: Polish & Validation

**Purpose**: Final checks, accessibility, performance

- [ ] T248 Run full test suite: `npm test` → verify all tests pass
- [ ] T249 Run E2E tests: `npm run test:e2e` → verify all pass
- [ ] T250 Check test coverage: `npm run test:coverage` → verify >= 80%
- [ ] T251 Run TypeScript check: `npx tsc --noEmit` → verify no errors
- [ ] T252 Test with screen reader (manual) - verify ARIA labels work
- [ ] T253 Test keyboard navigation (manual) - Tab, Arrow keys, Enter, Escape
- [ ] T254 Test on mobile viewport (manual) - verify responsive design
- [ ] T255 Test localStorage edge cases:
  - Clear storage and create menu
  - Create many menus (test quota)
  - Test with corrupted data
- [ ] T256 Performance check:
  - Measure search debounce (should be ~300ms)
  - Measure rations calculation (should be < 50ms)
  - Check for unnecessary re-renders
- [ ] T257 Fix any issues found in T248-T256
- [ ] T258 Run all tests again to confirm fixes

---

## Phase 16: Documentation

**Purpose**: Update docs and create summary

- [ ] T259 Update main README.md with Menu Builder feature
- [ ] T260 Create `specs/004-menu-builder/IMPLEMENTATION_SUMMARY.md` with:
  - Total tasks completed
  - Test coverage stats
  - Files created/modified
  - Known issues
  - Future enhancements
- [ ] T261 Add JSDoc comments to all public functions
- [ ] T262 Add inline code comments for complex logic
- [ ] T263 Update `IMPLEMENTATION_COMPLETE.md` in project root (if exists)

---

## Execution Notes

### Parallel Execution

Tasks marked with **[P]** can run in parallel within their phase:

- Different files
- No shared dependencies
- Independent test cases

### TDD Discipline

Every phase follows RED-GREEN-REFACTOR:

1. **RED**: Write failing tests first
2. **GREEN**: Implement minimal code to pass
3. **REFACTOR**: Improve code quality while keeping tests green

### Checkpoints

After each phase:

1. Verify all tests pass
2. Commit changes
3. Check no regressions in previous features

### Estimated Time

- **Phase 1**: 15 mins (verification)
- **Phase 2-3**: 2-3 hours (domain layer)
- **Phase 4**: 1-2 hours (repository)
- **Phase 5-6**: 1-2 hours (hooks & context)
- **Phase 7-11**: 4-6 hours (UI components)
- **Phase 12**: 2-3 hours (page integration)
- **Phase 13**: Optional (defer)
- **Phase 14**: 30 mins (ignore files)
- **Phase 15**: 1-2 hours (polish)
- **Phase 16**: 1 hour (docs)

**Total**: 12-20 hours

---

## Success Criteria

- [ ] All unit tests pass (>= 80% coverage)
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] TypeScript compiles with no errors
- [ ] Autocomplete shows all aliment data (name, category, grams, GI, custom badge)
- [ ] Weight input validates correctly
- [ ] Rations calculate correctly (2 decimals)
- [ ] Totals update dynamically
- [ ] Menu saves to localStorage
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] No console errors
- [ ] Responsive on mobile

---

## Task Summary

| Phase     | Tasks         | Type              | Estimated Time   |
| --------- | ------------- | ----------------- | ---------------- |
| Phase 1   | T001-T006     | Setup             | 15 mins          |
| Phase 2   | T007-T023     | Domain (MenuItem) | 1.5 hours        |
| Phase 3   | T024-T046     | Domain (Menu)     | 1.5 hours        |
| Phase 4   | T047-T073     | Repository        | 2 hours          |
| Phase 5   | T074-T099     | Hook              | 2 hours          |
| Phase 6   | T100-T110     | Context           | 30 mins          |
| Phase 7   | T111-T137     | Autocomplete      | 3 hours          |
| Phase 8   | T138-T158     | Weight Dialog     | 1.5 hours        |
| Phase 9   | T159-T177     | Items List        | 2 hours          |
| Phase 10  | T178-T190     | Summary           | 30 mins          |
| Phase 11  | T191-T212     | Save Form         | 1.5 hours        |
| Phase 12  | T213-T237     | Page Integration  | 3 hours          |
| Phase 13  | T238-T242     | Home Page (defer) | -                |
| Phase 14  | T243-T247     | Ignore Files      | 30 mins          |
| Phase 15  | T248-T258     | Polish            | 2 hours          |
| Phase 16  | T259-T263     | Documentation     | 1 hour           |
| **Total** | **263 tasks** |                   | **~18-20 hours** |

---

**Last Updated**: 2026-02-12  
**Status**: Ready for Implementation  
**Next Step**: Execute Phase 1 (Setup)
