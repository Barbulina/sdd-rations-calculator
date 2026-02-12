# Tasks: Ration Menu Management

**Input**: Design documents from `/specs/002-ration-menu-management/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: NOT requested in feature specification - tasks focus on implementation only (no TDD tasks).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **Checkbox**: All tasks start with `- [ ]` (markdown checkbox)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization - minimal setup needed to start implementing user stories

- [ ] T001 Verify Next.js 15.1.6, TypeScript 5, and design token system from 001-design-token-system are operational
- [ ] T002 Create directory structure: src/domain/models/, src/domain/repositories/, src/infrastructure/repositories/, src/infrastructure/storage/, src/application/contexts/, src/application/hooks/
- [ ] T003 Create directory structure: app/components/, app/create-ration/, tests/integration/rations/, tests/unit/rations/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and contexts that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Create RationsType enum in src/domain/models/RationsType.ts with 7 ration type values (lácteos, cereales..., frutas, hortalizas, frutas secas y grasa, bebidas, otros)
- [ ] T005 [P] Create Ration interface in src/domain/models/Ration.ts with fields: id, type, name, gramsToCarbohydrate, bloodGlucoseIndex (optional), weight, rations, createdAt
- [ ] T006 [P] Create CreateRationDTO type in src/domain/models/Ration.ts as Omit<Ration, 'id' | 'createdAt'>
- [ ] T007 [P] Create RationRepository interface in src/domain/repositories/RationRepository.ts with methods: save(data: CreateRationDTO), findAll(), findById(id: string), delete(id: string)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 3 - Data Persistence with Repository Pattern (Priority: P3)

**Goal**: Implement repository abstraction layer with localStorage adapter, enabling future API migration without changing business logic

**Why implemented first**: Although labeled P3 for business priority, this is technically foundational infrastructure required by US1 (create) and US2 (view). Repository pattern enables all CRUD operations.

**Independent Test**: Create mock repository, use in tests to verify abstraction works. Create rations via localStorage repository, close browser, reopen, verify persistence.

### Implementation for User Story 3

- [ ] T008 [P] [US3] Create LocalStorageAdapter class in src/infrastructure/storage/LocalStorageAdapter.ts with methods: isAvailable(), getItem<T>(key), setItem<T>(key, value), removeItem(key)
- [ ] T009 [P] [US3] Add storage key prefix 'sdd-rations-calculator:' in LocalStorageAdapter to namespace localStorage keys
- [ ] T010 [P] [US3] Implement try-catch error handling in LocalStorageAdapter for QuotaExceededError and disabled localStorage scenarios
- [ ] T011 [US3] Create LocalStorageRationRepository class in src/infrastructure/repositories/LocalStorageRationRepository.ts implementing RationRepository interface
- [ ] T012 [US3] Implement save(data: CreateRationDTO) method in LocalStorageRationRepository: generate UUID with crypto.randomUUID(), add createdAt timestamp, append to array, persist to localStorage
- [ ] T013 [US3] Implement findAll() method in LocalStorageRationRepository: retrieve from localStorage, deserialize JSON, parse createdAt strings to Date objects, sort by createdAt DESC (newest first)
- [ ] T014 [US3] Implement findById(id: string) method in LocalStorageRationRepository: retrieve all rations, find by id, return ration or null
- [ ] T015 [US3] Implement delete(id: string) method in LocalStorageRationRepository: filter out ration by id, persist updated array, return true if deleted or false if not found
- [ ] T016 [US3] Add serialization helper method serializeRations(rations: Ration[]) that converts Date objects to ISO strings for localStorage
- [ ] T017 [US3] Add deserialization helper method deserializeRations(data: any[]) that parses ISO strings back to Date objects
- [ ] T018 [US3] Create RationRepositoryContext in src/application/contexts/RationRepositoryContext.tsx with React Context and Provider component
- [ ] T019 [US3] Implement useRationRepository() custom hook in RationRepositoryContext.tsx that returns repository instance from context
- [ ] T020 [US3] Instantiate LocalStorageRationRepository in RationRepositoryProvider and provide via context
- [ ] T021 [US3] Add RationRepositoryProvider to app/layout.tsx wrapping children to make repository available throughout app
- [ ] T022 [US3] Handle localStorage errors gracefully: if isAvailable() returns false, log warning and return empty array from findAll()

**Checkpoint**: Repository pattern fully implemented - can now save and retrieve rations with localStorage, abstraction allows future API swap

---

## Phase 4: User Story 1 - Create New Ration Entry (Priority: P1) 🎯 MVP

**Goal**: Enable users to create ration entries via form page, validate input, save to localStorage via repository, and navigate back to home page

**Independent Test**: Navigate to /create-ration, fill all required fields (type, name, gramsToCarbohydrate, weight, rations) and optional bloodGlucoseIndex, submit form, verify ration persisted to localStorage and appears on home page

### Implementation for User Story 1

- [ ] T023 [P] [US1] Create create-ration page route in app/create-ration/page.tsx with 'use client' directive
- [ ] T024 [P] [US1] Add form state management with useState hook in create-ration page: formData (CreateRationDTO) and errors (Record<string, string>)
- [ ] T025 [US1] Implement form JSX in create-ration page: dropdown for type (all 7 RationsType values with Spanish labels), text input for name, number inputs for gramsToCarbohydrate, weight, rations, optional number input for bloodGlucoseIndex
- [ ] T026 [US1] Add onChange handlers for each form field to update formData state
- [ ] T027 [US1] Implement validate() function in create-ration page: check name is non-empty (trimmed), gramsToCarbohydrate > 0, weight > 0, rations > 0, bloodGlucoseIndex (if provided) is 0-100
- [ ] T028 [US1] Add field-level error message display below each input field (red text showing errors[fieldName])
- [ ] T029 [US1] Implement handleSubmit(e: FormEvent) in create-ration page: preventDefault, call validate(), if valid call repository.save(formData), use router.push('/') to navigate home
- [ ] T030 [US1] Add router import from 'next/navigation' and useRouter hook in create-ration page
- [ ] T031 [US1] Add useRationRepository hook in create-ration page to get repository instance
- [ ] T032 [US1] Add Cancel button in form that calls router.push('/') to return to home without saving
- [ ] T033 [US1] Style form with TailwindCSS: max-w-2xl container, space-y-4 between fields, proper labels, padding, responsive design
- [ ] T034 [US1] Add form title "Create Ration" with text-2xl font-bold mb-6
- [ ] T035 [US1] Add "Save Ration" submit button with bg-blue-500 text-white px-6 py-3 rounded styling
- [ ] T036 [US1] Implement loading state: disable submit button while saving (use useState for isSubmitting flag)
- [ ] T037 [US1] Add error handling: if repository.save() throws error, display user-friendly message (e.g., "Storage full - please delete some rations")

**Checkpoint**: Create flow complete - users can now add rations via form, data persists to localStorage

---

## Phase 5: User Story 2 - View Rations List with Infinite Scroll (Priority: P2)

**Goal**: Display all rations on home page in card format with infinite scroll loading, show empty state when no rations exist

**Independent Test**: Create 50+ rations, scroll home page and verify cards load in batches of 10. With 0 rations, verify empty state displays with "Create First Ration" button.

### Implementation for User Story 2

- [ ] T038 [P] [US2] Create useInfiniteScroll custom hook in src/application/hooks/useInfiniteScroll.ts with generic type parameter <T>
- [ ] T039 [US2] Implement useInfiniteScroll logic: useState for displayedItems and hasMore, useRef for loadMoreRef, Intersection Observer setup in useEffect
- [ ] T040 [US2] Configure Intersection Observer in useInfiniteScroll with threshold: 0.1, observe loadMoreRef, disconnect on cleanup
- [ ] T041 [US2] Implement loadMore() function in useInfiniteScroll: slice next batchSize items from source array, append to displayedItems, set hasMore to false when no more items
- [ ] T042 [US2] Return { displayedItems, hasMore, loadMoreRef } from useInfiniteScroll hook
- [ ] T043 [P] [US2] Create RationCard component in app/components/RationCard.tsx accepting ration: Ration prop
- [ ] T044 [US2] Implement RationCard JSX: display name (text-lg font-semibold), type (text-sm opacity-80), weight, rations, gramsToCarbohydrate in 2-column grid
- [ ] T045 [US2] Add conditional rendering in RationCard: show bloodGlucoseIndex only if defined (e.g., "IG: {bloodGlucoseIndex}")
- [ ] T046 [US2] Style RationCard with TailwindCSS: p-4 rounded-lg mb-4, semantic category color as background (US4 will add color mapping)
- [ ] T047 [P] [US2] Create EmptyState component in app/components/EmptyState.tsx with message "No rations yet" and call-to-action button
- [ ] T048 [US2] Add Link component in EmptyState linking to /create-ration with button styled bg-blue-500 text-white px-6 py-3 rounded
- [ ] T049 [US2] Update app/page.tsx home page with 'use client' directive
- [ ] T050 [US2] Add useState for rations array in home page, useEffect to load rations on mount
- [ ] T051 [US2] Call repository.findAll() in useEffect and setRations with result
- [ ] T052 [US2] Use useInfiniteScroll hook in home page with rations array and batchSize of 10
- [ ] T053 [US2] Implement conditional rendering in home page: if rations.length === 0 show EmptyState, else show ration list
- [ ] T054 [US2] Render displayedItems.map(ration => <RationCard key={ration.id} ration={ration} />) in home page
- [ ] T055 [US2] Add loading indicator div with ref={loadMoreRef} at bottom of list: "Loading more..." with text-center py-4, only show if hasMore is true
- [ ] T056 [US2] Add page header in home page: flex justify-between with h1 "My Rations" (text-2xl font-bold) and Link to /create-ration with "+ Create" button
- [ ] T057 [US2] Style home page container with p-4 padding
- [ ] T058 [US2] Add useRationRepository hook in home page to get repository instance
- [ ] T059 [US2] Implement reload mechanism: expose loadRations function, call after navigation from create page (or use router events)

**Checkpoint**: View and infinite scroll complete - users can now see all their rations with smooth scrolling performance

---

## Phase 6: User Story 4 - Ration Type Color Coding (Priority: P4)

**Goal**: Apply category-specific colors from design token system to ration cards, supporting light and dark themes

**Independent Test**: Create one ration of each type (lácteos, cereales, frutas, hortalizas, frutas secas, bebidas, otros), verify each displays with distinct color. Toggle dark mode, verify colors adapt.

### Implementation for User Story 4

- [ ] T060 [P] [US4] Create getCategoryColorClass utility function in app/components/RationCard.tsx that maps RationsType to Tailwind bg-category-* classes
- [ ] T061 [US4] Implement color mapping in getCategoryColorClass: RationsType.lacteal → 'bg-category-lacteal', cereals_flours_pulses_legumes_tubers → 'bg-category-cereals-flours-pulses-legumes-tubers', fruits → 'bg-category-fruits', vegetables → 'bg-category-vegetables', oily_and_dry_fruit → 'bg-category-oily-dry-fruits', drinks → 'bg-category-drinks', others → 'bg-category-others'
- [ ] T062 [US4] Apply getCategoryColorClass(ration.type) to RationCard container div className (replace placeholder background)
- [ ] T063 [US4] Verify design token Tailwind classes are available: check that category-lacteal, category-fruits, etc. are generated by design token build from 001-design-token-system
- [ ] T064 [US4] Test color contrast: verify all 7 category colors meet WCAG AA (4.5:1 contrast ratio) in both light and dark themes (already validated in 001-design-token-system)
- [ ] T065 [US4] Add visual distinction: ensure each category color is perceptually different from others for easy identification
- [ ] T066 [US4] Update RationCard styling: adjust text color if needed for contrast on colored backgrounds (e.g., text-white for dark category colors)

**Checkpoint**: Color coding complete - ration cards now display with semantic category colors from design system, enhancing visual organization

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, error handling, and documentation

- [ ] T067 [P] Add form field validation messages for create form: "Name is required", "Must be greater than 0", "Blood glucose index must be between 0-100"
- [ ] T068 [P] Implement localStorage quota error handling: show toast/notification when QuotaExceededError occurs with message "Storage full - please delete some rations"
- [ ] T069 [P] Add loading skeleton in home page: show placeholder cards while rations are loading from localStorage
- [ ] T070 [P] Implement max name length validation: limit to 200 characters with error message and character counter
- [ ] T071 [P] Add TypeScript strict type checking: verify all files compile with no type errors
- [ ] T072 [P] Add responsive design improvements: ensure forms and cards work well on mobile (320px width) and tablet (768px width)
- [ ] T073 Add accessibility improvements: proper ARIA labels on form inputs, keyboard navigation support, focus states
- [ ] T074 Add success feedback: show brief confirmation message after creating ration (e.g., toast "Ration saved successfully")
- [ ] T075 [P] Update README.md with quickstart instructions: how to run app, create rations, view list
- [ ] T076 Add error boundary: wrap app in ErrorBoundary component to catch and display React errors gracefully
- [ ] T077 Run quickstart.md validation: follow developer workflow guide, verify all steps work correctly and timing estimates are accurate
- [ ] T078 Final validation: create 100+ rations, test infinite scroll performance, verify localStorage persistence across browser sessions, test all 7 ration types with colors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 3 (Phase 3)**: Depends on Foundational phase completion - BLOCKS US1 and US2 (provides repository)
- **User Story 1 (Phase 4)**: Depends on US3 completion (needs repository to save) - MVP milestone
- **User Story 2 (Phase 5)**: Depends on US3 completion (needs repository to read) and ideally US1 (needs data to display)
- **User Story 4 (Phase 6)**: Depends on US2 completion (needs cards to color)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

**Note**: Business priorities (P1, P2, P3, P4) differ from technical implementation order due to infrastructure dependencies.

- **User Story 3 (P3 priority)**: Technically foundational - must implement first even though labeled P3 for business value
  - No dependencies on other stories
  - Provides repository abstraction needed by US1 and US2
  - Can be tested independently with mock data

- **User Story 1 (P1 priority)**: MVP - Create functionality
  - **Depends on**: US3 (repository) to save rations
  - Can be tested independently: fill form, submit, verify localStorage contains data
  - Delivers value on its own (can create and persist data)

- **User Story 2 (P2 priority)**: View and scroll
  - **Depends on**: US3 (repository) to load rations
  - **Benefits from**: US1 (create) to have data to display, but can test with manually seeded localStorage
  - Can be tested independently: seed localStorage with JSON, verify list displays with infinite scroll

- **User Story 4 (P4 priority)**: Visual enhancement
  - **Depends on**: US2 (cards must exist to color them)
  - **Requires**: Design token system from feature 001 must be built (Tailwind classes generated)
  - Can be tested independently: verify color mapping function and Tailwind classes apply correctly

### Within Each User Story

**User Story 3 (Repository - Phase 3)**:
- T008-T010 (LocalStorageAdapter) can run in parallel
- T011-T017 (LocalStorageRationRepository) sequential, depend on T008
- T018-T021 (Context and Provider) can run in parallel after T011
- T022 is final polish

**User Story 1 (Create - Phase 4)**:
- T023-T024 (page setup and state) can run in parallel
- T025-T028 (form fields and validation) sequential after T024
- T029-T032 (submit logic and routing) sequential after T027
- T033-T037 (styling and UX) can run in parallel after core functionality

**User Story 2 (View - Phase 5)**:
- T038-T042 (useInfiniteScroll hook) sequential
- T043-T046 (RationCard component) can run in parallel with hook
- T047-T048 (EmptyState component) can run in parallel
- T049-T059 (home page integration) sequential after components and hook

**User Story 4 (Colors - Phase 6)**:
- T060-T062 (color mapping) sequential
- T063-T066 (verification and polish) can run in parallel after T062

**Polish (Phase 7)**:
- T067-T072 (parallel improvements) can all run in parallel
- T073-T076 sequential polish tasks
- T077-T078 final validation sequential

### Parallel Opportunities

**Phase 2 (Foundational)**: All 4 tasks (T004-T007) can run in parallel - different files, pure type definitions

**Phase 3 (US3 - Repository)**:
- Batch 1 (parallel): T008, T009, T010 - LocalStorageAdapter methods
- Batch 2 (sequential): T011-T017 - Repository implementation
- Batch 3 (parallel): T018, T019, T020 - Context setup
- Batch 4 (sequential): T021, T022 - Integration and error handling

**Phase 4 (US1 - Create)**:
- Batch 1 (parallel): T023, T024 - Page setup
- Batch 2 (parallel after validation): T033, T034, T035, T036 - Styling tasks
- Core form logic (T025-T032) mostly sequential

**Phase 5 (US2 - View)**:
- Parallel track 1: T038-T042 (infinite scroll hook)
- Parallel track 2: T043-T046 (RationCard component)
- Parallel track 3: T047-T048 (EmptyState component)
- Then merge: T049-T059 (integration)

**Phase 6 (US4 - Colors)**:
- Sequential implementation, but T063-T066 can be parallel verification

**Phase 7 (Polish)**:
- T067-T072: All parallel (different concerns)
- T073-T076: Sequential polish
- T077-T078: Sequential validation

---

## Parallel Example: User Story 3 (Repository Pattern)

```bash
# Batch 1: LocalStorageAdapter methods (parallel)
Developer A: T008 - Create LocalStorageAdapter class with isAvailable()
Developer B: T009 - Add storage key prefix
Developer C: T010 - Implement error handling try-catch

# Batch 2: Repository implementation (sequential, wait for Batch 1)
Developer A: T011 - Create LocalStorageRationRepository class
Developer A: T012 - Implement save() method
Developer A: T013 - Implement findAll() method
[... continue sequentially]

# Batch 3: Context (parallel, after T011-T017)
Developer B: T018 - Create RationRepositoryContext
Developer C: T019 - Implement useRationRepository hook
Developer B: T020 - Instantiate repository in provider

# Integration (sequential)
Developer A: T021 - Add provider to layout.tsx
Developer A: T022 - Handle localStorage errors
```

---

## Parallel Example: All User Stories After Foundational

```bash
# After Phase 2 (Foundational) and Phase 3 (US3 Repository) are complete:

# Different developers can work on different stories in parallel:
Developer Team A: Phase 4 - User Story 1 (Create) - T023 through T037
Developer Team B: Phase 5 - User Story 2 (View) - T038 through T059
  # Team B can seed localStorage manually to test view without create being done

# After both US1 and US2 complete:
Developer C: Phase 6 - User Story 4 (Colors) - T060 through T066

# Note: US4 (Colors) requires US2 (View) to be complete since it styles the cards
```

---

## Implementation Strategy

### MVP First (User Stories 3 + 1 Only)

1. Complete Phase 1: Setup (T001-T003) → ~15 minutes
2. Complete Phase 2: Foundational (T004-T007) → ~30 minutes  
3. Complete Phase 3: User Story 3 Repository (T008-T022) → ~1.5 hours
4. Complete Phase 4: User Story 1 Create (T023-T037) → ~1.5 hours
5. **STOP and VALIDATE**: Can create rations, save to localStorage, data persists
6. **Deploy/Demo MVP**: Basic create and save functionality works

**MVP Scope**: Repository pattern + Create form = Core data entry capability

---

### Incremental Delivery

1. **Foundation** (Phases 1+2+3): Setup + Types + Repository → ~2 hours
2. **Iteration 1** (Phase 4): Add US1 (Create) → Test independently → Deploy (MVP! - Can create and save rations)
3. **Iteration 2** (Phase 5): Add US2 (View + Scroll) → Test independently → Deploy (Can create AND view rations)
4. **Iteration 3** (Phase 6): Add US4 (Colors) → Test independently → Deploy (Full visual design with colors)
5. **Iteration 4** (Phase 7): Polish + Final validation → Production-ready

**Each iteration adds value without breaking previous functionality**

---

### Parallel Team Strategy

With 3 developers available:

1. **Week 1, Days 1-2**: Team completes Setup + Foundational + Repository together (Phases 1+2+3)
2. **Week 1, Day 3 onwards** (once Repository is done):
   - Developer A: User Story 1 (Create) - Phase 4
   - Developer B: User Story 2 (View) - Phase 5 (can seed localStorage manually)
   - Developer C: Helps with testing and polish
3. **Week 2**: 
   - Developer A or B: User Story 4 (Colors) - Phase 6
   - Team: Polish together - Phase 7

**Timeline Estimate**:
- Setup + Foundational: 0.5 day
- Repository (US3): 1 day
- Create (US1): 1 day (parallel with View)
- View (US2): 1 day (parallel with Create)
- Colors (US4): 0.5 day
- Polish: 0.5 day
- **Total**: ~4 days (with some parallelization) or ~5 days (sequential)

---

## Task Count Summary

- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 4 tasks (BLOCKING)
- **Phase 3 (User Story 3 - Repository Pattern)**: 15 tasks
- **Phase 4 (User Story 1 - Create Ration)**: 15 tasks
- **Phase 5 (User Story 2 - View & Infinite Scroll)**: 22 tasks
- **Phase 6 (User Story 4 - Color Coding)**: 7 tasks
- **Phase 7 (Polish)**: 12 tasks

**Total**: 78 tasks

**Parallel Tasks**: 35 tasks can run in parallel (marked [P])
**Sequential Tasks**: 43 tasks must run sequentially or have dependencies
**Blocking Tasks**: 4 foundational tasks + 15 repository tasks block user story work

---

## Success Criteria Validation (from spec.md)

Tasks map to success criteria:

- **SC-001** (create in <30s): T023-T037 create form implementation + T029 navigation
- **SC-002** (scroll <200ms): T038-T042 infinite scroll with Intersection Observer
- **SC-003** (repository swap ≤5 lines): T018-T021 context pattern enables DI swap
- **SC-004** (localStorage errors graceful): T010, T022, T068 error handling
- **SC-005** (7 distinct colors >4.5:1): T060-T065 design token integration (already validated in 001)
- **SC-006** (95% create success): T027-T029 validation prevents errors
- **SC-007** (100% persistence): T012-T013 localStorage save/load + T016-T017 serialization
- **SC-008** (initial load <500ms): T042, T051-T052 batch loading with infinite scroll
- **SC-009** (validation prevents invalid data): T027 validate() function + T028, T067 error messages
- **SC-010** (empty state CTA): T047-T048 EmptyState component with link

All success criteria have corresponding implementation tasks.

---

## Notes

- **[P] tasks**: Different files, can run in parallel to save time
- **[Story] label**: Maps task to specific user story (US1, US2, US3, US4) for traceability
- **Checkboxes**: Mark tasks complete as you progress through implementation
- **Priority vs Implementation Order**: US3 (P3 business priority) implemented first due to technical dependencies
- **Independent stories**: Each user story delivers value on its own and can be tested without others
- **No tests**: Feature specification did not request TDD approach, so no test tasks included
- **Design token dependency**: US4 requires design token system from 001-design-token-system to be built first
- **File paths**: All paths relative to repository root (/Users/emilio.fernandez/Projects/sdd/sdd-rations-calculator/)
- **Commit strategy**: Commit after completing each user story phase for clean history

**Ready to implement!** Start with Phase 1 (Setup) and proceed through phases in order.
