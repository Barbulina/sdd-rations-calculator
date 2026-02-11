# Tasks: Design Token System

**Input**: Design documents from `/specs/001-design-token-system/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: NOT requested in feature specification - tasks focus on implementation only (no TDD tasks).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **Checkbox**: All tasks start with `- [ ]` (markdown checkbox)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and design token infrastructure setup

- [X] T001 Install design token dependencies in package.json: style-dictionary, colorjs.io, next-themes
- [X] T002 Create directory structure: src/infrastructure/design-tokens/ and tests/integration/design-tokens/
- [X] T003 [P] Configure TypeScript strict mode in tsconfig.json for token validation
- [X] T004 [P] Configure Tailwind dark mode in tailwind.config.ts with darkMode: 'class'

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core token transformation infrastructure that MUST be complete before ANY user story tokens can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create tokens.json schema validation in src/infrastructure/design-tokens/validate-schema.ts based on contracts/tokens-schema.json
- [X] T006 Implement WCAG AA contrast validation function in src/infrastructure/design-tokens/validate-contrast.ts using colorjs.io (per contracts/validation-api.md)
- [X] T007 Create Style Dictionary configuration in src/infrastructure/design-tokens/style-dictionary.config.js for tokens.json → Tailwind transformation
- [X] T008 Implement build script in src/infrastructure/design-tokens/build-tokens.ts that runs schema validation, contrast validation, and Style Dictionary transformation
- [X] T009 Configure next-themes ThemeProvider wrapper in src/app/providers.tsx for light/dark mode support
- [X] T010 Update tailwind.config.ts to import generated tokens from src/infrastructure/design-tokens/tailwind-tokens.js
- [X] T011 Add npm script in package.json: "tokens:build" that runs build-tokens.ts
- [X] T012 Create CSS custom properties template in src/infrastructure/design-tokens/css-variables.css for theme switching

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Aliment Category Color System (Priority: P1) 🎯 MVP

**Goal**: Define seven distinct semantic color tokens for aliment categories mapped to M3 color roles with WCAG AA compliance

**Independent Test**: Render all seven category colors in a palette specimen page and verify WCAG AA contrast ratios against light (#FFFBFE) and dark (#1C1B1F) backgrounds

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create category-lacteal color token (light: #6750A4 M3 Primary 40, dark: #D0BCFF M3 Primary 80) in tokens.json
- [ ] T014 [P] [US1] Create category-cereals-flours-pulses-legumes-tubers color token (light/dark M3 Secondary tones) in tokens.json
- [ ] T015 [P] [US1] Create category-fruits color token (light/dark M3 Tertiary tones) in tokens.json
- [ ] T016 [P] [US1] Create category-vegetables color token (light/dark M3 custom-extended-1 green tones) in tokens.json
- [ ] T017 [P] [US1] Create category-oily-dry-fruits color token (light/dark M3 custom-extended-2 brown tones) in tokens.json
- [ ] T018 [P] [US1] Create category-drinks color token (light/dark M3 custom-extended-3 blue tones) in tokens.json
- [ ] T019 [P] [US1] Create category-others color token (light/dark M3 surface-variant gray tones) in tokens.json
- [ ] T020 [US1] Run tokens:build script to transform category colors into Tailwind utility classes (bg-category-lacteal, text-category-fruits, etc.)
- [ ] T021 [US1] Create token specimen page in src/app/design-tokens/page.tsx showing all category colors with hex values and M3 role labels
- [ ] T022 [US1] Verify contrast validation passes for all 7 categories × 2 themes = 14 color tokens (4.5:1 minimum for normal text)

**Checkpoint**: At this point, User Story 1 should be fully functional - all category colors display with distinct hues and pass WCAG AA

---

## Phase 4: User Story 2 - Offline Status Indicators (Priority: P2)

**Goal**: Provide semantic color tokens for offline/online status and synchronization state with clear visual feedback

**Independent Test**: Toggle network status and verify status indicator colors change appropriately (offline → amber, syncing → blue, error → red, online → green)

### Implementation for User Story 2

- [ ] T023 [P] [US2] Create state-offline color token (light/dark M3 warning amber tones) in tokens.json
- [ ] T024 [P] [US2] Create state-syncing color token (light/dark M3 info blue tones) in tokens.json
- [ ] T025 [P] [US2] Create state-sync-error color token (light/dark M3 error red tones) in tokens.json
- [ ] T026 [P] [US2] Create state-online color token (light/dark M3 success green tones) in tokens.json
- [ ] T027 [US2] Run tokens:build script to transform state colors into Tailwind utility classes (bg-state-offline, text-state-syncing, etc.)
- [ ] T028 [US2] Add state indicator examples to token specimen page in src/app/design-tokens/page.tsx showing offline/syncing/error/online badges
- [ ] T029 [US2] Verify contrast validation passes for all 4 state colors × 2 themes = 8 color tokens

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - category colors and state indicators are fully functional

---

## Phase 5: User Story 3 - Typography & Spacing Scale (Priority: P3)

**Goal**: Establish consistent mobile-first typography and spacing system based on M3 type scale and 8px grid

**Independent Test**: Render specimen page showing all type scales and spacing values, verify 8px grid alignment and minimum 44px touch target sizes

### Implementation for User Story 3

- [ ] T030 [P] [US3] Create heading-1 typography token (57px M3 Display Large) in tokens.json with fontSize, lineHeight, letterSpacing, fontWeight, fontFamily
- [ ] T031 [P] [US3] Create heading-2 typography token (45px M3 Display Medium) in tokens.json
- [ ] T032 [P] [US3] Create heading-3 typography token (36px M3 Display Small) in tokens.json
- [ ] T033 [P] [US3] Create heading-4 typography token (32px M3 Headline Large) in tokens.json
- [ ] T034 [P] [US3] Create heading-5 typography token (28px M3 Headline Medium) in tokens.json
- [ ] T035 [P] [US3] Create heading-6 typography token (24px M3 Headline Small) in tokens.json
- [ ] T036 [P] [US3] Create body-large typography token (16px M3 Body Large) in tokens.json
- [ ] T037 [P] [US3] Create body-medium typography token (14px M3 Body Medium) in tokens.json
- [ ] T038 [P] [US3] Create body-small typography token (12px M3 Body Small) in tokens.json
- [ ] T039 [P] [US3] Create label-large typography token (14px M3 Label Large) in tokens.json
- [ ] T040 [P] [US3] Create label-medium typography token (12px M3 Label Medium) in tokens.json
- [ ] T041 [P] [US3] Create label-small typography token (11px M3 Label Small) in tokens.json
- [ ] T042 [P] [US3] Create space-0 spacing token (0px / 0rem, gridFactor: 0) in tokens.json
- [ ] T043 [P] [US3] Create space-1 spacing token (8px / 0.5rem, gridFactor: 1) in tokens.json
- [ ] T044 [P] [US3] Create space-2 spacing token (16px / 1rem, gridFactor: 2) in tokens.json
- [ ] T045 [P] [US3] Create space-3 spacing token (24px / 1.5rem, gridFactor: 3) in tokens.json
- [ ] T046 [P] [US3] Create space-4 spacing token (32px / 2rem, gridFactor: 4) in tokens.json
- [ ] T047 [P] [US3] Create space-5 spacing token (40px / 2.5rem, gridFactor: 5, min for 44px touch target) in tokens.json
- [ ] T048 [P] [US3] Create space-6 spacing token (48px / 3rem, gridFactor: 6) in tokens.json
- [ ] T049 [P] [US3] Create space-8 spacing token (64px / 4rem, gridFactor: 8) in tokens.json
- [ ] T050 [P] [US3] Create space-10 spacing token (80px / 5rem, gridFactor: 10) in tokens.json
- [ ] T051 [P] [US3] Create space-12 spacing token (96px / 6rem, gridFactor: 12) in tokens.json
- [ ] T052 [US3] Run tokens:build script to transform typography and spacing tokens into Tailwind utility classes (text-heading-1, p-space-3, etc.)
- [ ] T053 [US3] Add typography specimen to token page in src/app/design-tokens/page.tsx showing all 12 type scales with sample text
- [ ] T054 [US3] Add spacing specimen to token page showing all 10 spacing values with visual grid alignment
- [ ] T055 [US3] Verify 8px grid alignment validation passes for all spacing tokens (except space-0)
- [ ] T056 [US3] Verify body text minimum font size ≥ 14px for mobile accessibility (body-medium and above)

**Checkpoint**: All core design tokens now functional - category colors, state indicators, typography, and spacing scales complete

---

## Phase 6: User Story 4 - TDD/Action Feedback States (Priority: P4)

**Goal**: Define semantic color tokens for success/warning/error/info feedback states with WCAG AA compliance

**Independent Test**: Render all four feedback state colors in toast/alert components and verify contrast ratios meet WCAG AA requirements

### Implementation for User Story 4

- [ ] T057 [P] [US4] Create feedback-success color token (light/dark M3 tertiary or success green tones) in tokens.json
- [ ] T058 [P] [US4] Create feedback-warning color token (light/dark M3 warning amber tones) in tokens.json
- [ ] T059 [P] [US4] Create feedback-error color token (light/dark M3 error red tones) in tokens.json
- [ ] T060 [P] [US4] Create feedback-info color token (light/dark M3 info blue tones) in tokens.json
- [ ] T061 [US4] Run tokens:build script to transform feedback colors into Tailwind utility classes (bg-feedback-success, text-feedback-error, etc.)
- [ ] T062 [US4] Add feedback state examples to token specimen page in src/app/design-tokens/page.tsx showing success/warning/error/info alerts
- [ ] T063 [US4] Verify contrast validation passes for all 4 feedback colors × 2 themes = 8 color tokens

**Checkpoint**: All user stories complete - full design token system implemented with 50 tokens total

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and final quality checks affecting all user stories

- [ ] T064 [P] Generate design token documentation in docs/design-tokens.md using Style Dictionary formatter showing all token values and usage guidelines
- [ ] T065 [P] Add TypeScript type definitions file in src/infrastructure/design-tokens/tailwind-tokens.d.ts for utility class type safety (per contracts/tailwind-tokens.d.ts)
- [ ] T066 [P] Create theme toggle component in src/components/ThemeToggle.tsx using next-themes useTheme() hook
- [ ] T067 Create integration test in tests/integration/design-tokens/token-schema.test.ts validating tokens.json against JSON schema
- [ ] T068 Create integration test in tests/integration/design-tokens/contrast-validation.test.ts validating all color tokens meet WCAG AA (4.5:1 normal text, 3:1 large text)
- [ ] T069 Create integration test in tests/integration/design-tokens/spacing-grid.test.ts validating all spacing tokens are multiples of 8px (except space-0)
- [ ] T070 Create integration test in tests/integration/design-tokens/transformation.test.ts validating Style Dictionary transforms tokens.json → tailwind-tokens.js correctly
- [ ] T071 Update README.md with design token system overview and link to quickstart.md
- [ ] T072 Run quickstart.md validation: verify designer export workflow and developer import workflow both complete in < 5 minutes
- [ ] T073 Final validation: confirm all 50 tokens generated (7 categories × 2 themes + 4 states × 2 themes + 4 feedback × 2 themes + 12 typography + 10 spacing)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel if team capacity allows
  - OR sequentially in priority order: US1 → US2 → US3 → US4
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Category Colors**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2) - Offline Status**: Can start after Foundational (Phase 2) - Independent from US1 (different token category)
- **User Story 3 (P3) - Typography/Spacing**: Can start after Foundational (Phase 2) - Independent from US1 and US2 (different token types)
- **User Story 4 (P4) - Feedback States**: Can start after Foundational (Phase 2) - Independent from all other stories (different token category)

**Key Insight**: Once Foundational phase completes, ALL four user stories are independent and can be implemented in parallel by different team members.

### Within Each User Story

- Token creation tasks marked [P] can run in parallel (different tokens in tokens.json)
- tokens:build script MUST run after all tokens for that story are created
- Specimen page updates can happen after tokens:build
- Validation checks are final step for each story

### Parallel Opportunities

**Phase 1 - Setup**: All 4 tasks can run in parallel (T001-T004)

**Phase 2 - Foundational**: Tasks can be parallelized:
- Group 1 (parallel): T005 (schema validation), T006 (contrast validation) - different files
- Group 2 (sequential): T007, T008 (Style Dictionary config depends on validation functions)
- Group 3 (parallel): T009 (providers.tsx), T010 (tailwind.config.ts), T011 (package.json), T012 (css-variables.css)

**Phase 3 - User Story 1**: 
- T013-T019 (all 7 category color tokens) can run in parallel - different tokens in tokens.json
- T020-T022 sequential - build, specimen page, validation

**Phase 4 - User Story 2**:
- T023-T026 (all 4 state color tokens) can run in parallel
- T027-T029 sequential - build, specimen page, validation

**Phase 5 - User Story 3**:
- T030-T041 (all 12 typography tokens) can run in parallel
- T042-T051 (all 10 spacing tokens) can run in parallel
- All 22 token creation tasks (T030-T051) can run simultaneously
- T052-T056 sequential - build, specimen pages, validation

**Phase 6 - User Story 4**:
- T057-T060 (all 4 feedback color tokens) can run in parallel
- T061-T063 sequential - build, specimen page, validation

**Phase 7 - Polish**:
- T064, T065, T066 can run in parallel (different files)
- T067-T070 (all 4 integration tests) can run in parallel
- T071-T073 sequential - final documentation and validation

---

## Parallel Example: User Story 1 (Category Colors)

```bash
# Launch all 7 category color token creation tasks together:
Task: "Create category-lacteal color token in tokens.json" (T013)
Task: "Create category-cereals-flours-pulses-legumes-tubers color token in tokens.json" (T014)
Task: "Create category-fruits color token in tokens.json" (T015)
Task: "Create category-vegetables color token in tokens.json" (T016)
Task: "Create category-oily-dry-fruits color token in tokens.json" (T017)
Task: "Create category-drinks color token in tokens.json" (T018)
Task: "Create category-others color token in tokens.json" (T019)

# Then sequentially:
Task: "Run tokens:build script" (T020)
Task: "Create token specimen page" (T021)
Task: "Verify contrast validation" (T022)
```

---

## Parallel Example: All User Stories After Foundational

```bash
# Once Phase 2 (Foundational) is complete, launch all 4 user stories in parallel:

Developer A: Phase 3 - User Story 1 (Category Colors) - T013 through T022
Developer B: Phase 4 - User Story 2 (Offline Status) - T023 through T029
Developer C: Phase 5 - User Story 3 (Typography/Spacing) - T030 through T056
Developer D: Phase 6 - User Story 4 (Feedback States) - T057 through T063

# All four developers can work simultaneously without conflicts
# Each story is independently testable
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004) → ~30 minutes
2. Complete Phase 2: Foundational (T005-T012) → ~2 hours (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (T013-T022) → ~1 hour
4. **STOP and VALIDATE**: Test category colors independently
   - Verify all 7 categories display distinct hues
   - Verify WCAG AA contrast compliance (4.5:1+)
   - Test light/dark theme switching
5. **Deploy/Demo MVP**: Category color system is production-ready

**MVP Scope**: 14 color tokens (7 categories × 2 themes) + transformation infrastructure

---

### Incremental Delivery

1. **Foundation** (Phases 1+2): Setup + Foundational → Token transformation pipeline ready (~2.5 hours)
2. **Iteration 1** (Phase 3): Add User Story 1 → Test independently → Deploy (MVP! - Category colors work)
3. **Iteration 2** (Phase 4): Add User Story 2 → Test independently → Deploy (Category colors + Offline status indicators work)
4. **Iteration 3** (Phase 5): Add User Story 3 → Test independently → Deploy (Colors + Status + Typography/Spacing work)
5. **Iteration 4** (Phase 6): Add User Story 4 → Test independently → Deploy (Full token system - all 50 tokens work)
6. **Iteration 5** (Phase 7): Polish + Integration tests → Production-ready

**Each iteration adds value without breaking previous stories**

---

### Parallel Team Strategy

With 4 developers available:

1. **Week 1, Days 1-2**: Team completes Setup + Foundational together (Phases 1+2)
2. **Week 1, Day 3 onwards** (once Foundational is done):
   - Developer A: User Story 1 (Category Colors) - Priority P1
   - Developer B: User Story 2 (Offline Status) - Priority P2
   - Developer C: User Story 3 (Typography/Spacing) - Priority P3
   - Developer D: User Story 4 (Feedback States) - Priority P4
3. **Week 2**: Stories complete and merge independently, then team works on Polish together

**Timeline Estimate**:
- Setup: 0.5 day
- Foundational: 1.5 days (critical path)
- User Stories 1-4: 3 days (parallel) or 6 days (sequential)
- Polish: 1 day
- **Total**: ~6 days (parallel) or ~9 days (sequential)

---

## Task Count Summary

- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 8 tasks (BLOCKING)
- **Phase 3 (User Story 1 - Category Colors)**: 10 tasks
- **Phase 4 (User Story 2 - Offline Status)**: 7 tasks
- **Phase 5 (User Story 3 - Typography/Spacing)**: 27 tasks
- **Phase 6 (User Story 4 - Feedback States)**: 7 tasks
- **Phase 7 (Polish)**: 10 tasks

**Total**: 73 tasks

**Parallel Tasks**: 54 tasks can run in parallel (marked [P])
**Sequential Tasks**: 19 tasks must run sequentially
**Blocking Tasks**: 8 foundational tasks block all user story work

---

## Success Criteria Validation (from spec.md)

Tasks map to success criteria:

- **SC-001** (95% user identification): T021 specimen page + T022 contrast validation (US1)
- **SC-002** (100% WCAG AA compliance): T006 contrast validation function + T022, T029, T063, T068 validation checks
- **SC-003** (< 5min designer workflow): T072 quickstart validation
- **SC-004** (90% utility class coverage): T020, T027, T052, T061 tokens:build transformations
- **SC-005** (light/dark theme support): T009 next-themes setup + T012 CSS custom properties
- **SC-006** (44px touch targets): T047 space-5 token (40px + padding) + T056 validation
- **SC-007** (readable typography): T037 body-medium (14px) + T056 minimum size validation
- **SC-008** (zero manual intervention): T008 build-tokens.ts automation
- **SC-009** (documentation clarity): T064 auto-generated docs + T071 README update

All success criteria have corresponding implementation tasks.

---

## Notes

- **[P] tasks**: Different files, can run in parallel to save time
- **[Story] label**: Maps task to specific user story (US1, US2, US3, US4) for traceability
- **Checkboxes**: Mark tasks complete as you progress through implementation
- **Independent stories**: Each user story delivers value on its own and can be tested without others
- **No tests**: Feature specification did not request TDD approach, so no test tasks included (can be added later if needed)
- **Constitutional compliance**: All tasks follow Principle IV (design tokens requirement) and Principle III (implementation after approval)
- **File paths**: All paths shown relative to repository root (/Users/emilio.fernandez/Projects/sdd/sdd-rations-calculator/)

**Ready to implement!** Start with Phase 1 (Setup) and proceed through phases in order.
