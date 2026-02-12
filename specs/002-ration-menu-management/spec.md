# Feature Specification: Ration Menu Management

**Feature Branch**: `002-ration-menu-management`  
**Created**: 2026-02-12  
**Status**: Draft  
**Input**: Create menu page with ration form, localStorage persistence using repository pattern, home page list with infinite scroll, and navigation between pages

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create New Ration Entry (Priority: P1) 🎯 MVP

Users can create new ration entries through a dedicated form page, capturing all nutritional details required for meal planning and blood glucose management.

**Why this priority**: This is the core data entry feature - without the ability to create rations, there is no data to display. This represents the minimum viable product.

**Independent Test**: Navigate to create form, fill all fields (name, type, weight, grams to carbohydrate, blood glucose index, calculated rations), submit form, and verify ration is persisted to localStorage and user returns to home page.

**Acceptance Scenarios**:

1. **Given** user is on home page, **When** user clicks "Create Ration" button, **Then** user is navigated to create ration form page
2. **Given** user is on create form page, **When** user fills in all required fields (type, name, gramsToCarbohydrate, weight, rations) and submits, **Then** ration is saved to localStorage and user is redirected to home page
3. **Given** user is on create form page, **When** user provides bloodGlucoseIndex, **Then** optional field is saved with the ration
4. **Given** user submits create form, **When** ration is saved, **Then** ration appears in home page list immediately
5. **Given** user is on create form page, **When** user clicks cancel/back, **Then** user returns to home page without saving

---

### User Story 2 - View Rations List with Infinite Scroll (Priority: P2)

Users can view all their created rations on the home page in a scrollable card list that loads more items as they scroll, providing smooth performance even with large datasets.

**Why this priority**: After creating rations (P1), users need to view their data. Infinite scroll ensures scalability and good UX for growing datasets.

**Independent Test**: Create 50+ ration entries, scroll through home page list, and verify cards load progressively in batches (e.g., 10 at a time) without loading all items at once.

**Acceptance Scenarios**:

1. **Given** user has created rations, **When** user navigates to home page, **Then** initial batch of ration cards is displayed (e.g., first 10 items)
2. **Given** user is viewing ration list, **When** user scrolls to bottom of visible cards, **Then** next batch of cards loads automatically
3. **Given** user has fewer rations than batch size, **When** user views home page, **Then** all rations display without infinite scroll trigger
4. **Given** user is viewing ration cards, **When** card is displayed, **Then** card shows: ration name, type category (with semantic color), weight, grams to carbohydrate, calculated rations, and optional blood glucose index
5. **Given** user has no rations, **When** user views home page, **Then** empty state message displays with prompt to create first ration

---

### User Story 3 - Data Persistence with Repository Pattern (Priority: P3)

Ration data is persisted to browser localStorage through a repository abstraction, enabling future migration to backend API without changing business logic.

**Why this priority**: Repository pattern provides architectural flexibility and testability, setting foundation for future backend integration while delivering immediate offline-first capability.

**Independent Test**: Create rations, close browser, reopen application, and verify all rations persist and display correctly. Verify repository implementation can be swapped (e.g., mock repository for tests).

**Acceptance Scenarios**:

1. **Given** user creates rations, **When** browser is refreshed or closed and reopened, **Then** all rations persist and display on home page
2. **Given** repository saves ration, **When** localStorage is cleared externally, **Then** application handles gracefully (empty state)
3. **Given** repository is implemented, **When** business logic requests rations, **Then** repository abstraction is used (not direct localStorage calls)
4. **Given** repository needs testing, **When** running tests, **Then** repository can be mocked/replaced without changing component code

---

### User Story 4 - Ration Type Color Coding (Priority: P4)

Ration cards display category-specific colors from the design token system (001-design-token-system), providing visual categorization aligned with aliment categories.

**Why this priority**: Enhances UX by leveraging existing design system. Dependent on design token implementation being complete.

**Independent Test**: Create rations of each type (lácteos, cereales, frutas, hortalizas, frutas secas, bebidas, otros) and verify each card displays with corresponding category color from design tokens in both light and dark modes.

**Acceptance Scenarios**:

1. **Given** user creates ration with type "lácteos", **When** card displays on home page, **Then** card uses `category-lacteal` color token (M3 Primary tones)
2. **Given** user creates ration with type "cereales, harinas, legumbres y tuberculos", **When** card displays, **Then** card uses `category-cereals-flours-pulses-legumes-tubers` token (M3 Secondary tones)
3. **Given** user creates ration with type "frutas", **When** card displays, **Then** card uses `category-fruits` token (M3 Tertiary tones)
4. **Given** user creates ration with type "hortalizas", **When** card displays, **Then** card uses `category-vegetables` token (M3 custom-extended-1 green)
5. **Given** user creates ration with type "frutas secas y grasa", **When** card displays, **Then** card uses `category-oily-dry-fruits` token (M3 custom-extended-2 brown)
6. **Given** user creates ration with type "bebidas", **When** card displays, **Then** card uses `category-drinks` token (M3 custom-extended-3 blue)
7. **Given** user creates ration with type "otros", **When** card displays, **Then** card uses `category-others` token (M3 surface-variant gray)
8. **Given** user toggles dark mode, **When** viewing ration cards, **Then** category colors adapt to dark theme variants

---

### Edge Cases

- What happens when localStorage quota is exceeded (typically 5-10MB)?
- How does system handle malformed JSON data in localStorage?
- What happens if user tries to create ration with invalid/negative numbers?
- How does infinite scroll behave when user rapidly scrolls to bottom multiple times?
- What happens when repository fails to save (localStorage disabled in browser settings)?
- How does form handle very long ration names (>100 characters)?
- What happens when rations array is empty vs undefined vs null in localStorage?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a "Create Ration" button on home page that navigates to create form page
- **FR-002**: System MUST provide create form with fields: type (dropdown), name (text), gramsToCarbohydrate (number), bloodGlucoseIndex (optional number), weight (number), rations (number)
- **FR-003**: System MUST validate all required fields before allowing form submission (type, name, gramsToCarbohydrate, weight, rations)
- **FR-004**: System MUST persist rations to browser localStorage via repository abstraction
- **FR-005**: System MUST display all persisted rations on home page in card format
- **FR-006**: System MUST implement infinite scroll on home page ration list (load data in batches)
- **FR-007**: System MUST navigate user back to home page after successful ration creation
- **FR-008**: System MUST display ration cards with: name, type (with category color), weight, gramsToCarbohydrate, calculated rations, and optional bloodGlucoseIndex
- **FR-009**: System MUST map ration types to design token category colors (from 001-design-token-system)
- **FR-010**: System MUST provide repository interface with methods: save(ration), findAll(), [future: findById, delete, update]
- **FR-011**: System MUST implement localStorage repository adapter conforming to repository interface
- **FR-012**: System MUST handle localStorage errors gracefully (quota exceeded, disabled, etc.)
- **FR-013**: System MUST preserve ration data across browser sessions (persistence)
- **FR-014**: System MUST display empty state when no rations exist with call-to-action to create first ration
- **FR-015**: System MUST support all seven ration types: lacteal, cereals_flours_pulses_legumes_tubers, fruits, vegetables, oily_and_dry_fruit, drinks, others

### Ration Type Enum

```typescript
enum RationsType {
  lacteal = 'lácteos',
  cereals_flours_pulses_legumes_tubers = 'cereales, harinas, legumbres y tuberculos',
  fruits = 'frutas',
  vegetables = 'hortalizas',
  oily_and_dry_fruit = 'frutas secas y grasa',
  drinks = 'bebidas',
  others = 'otros'
}
```

### Key Entities

- **Ration**: Represents a food item with nutritional information for meal planning
  - `type: RationsType` - Category of food aliment (lácteos, frutas, etc.)
  - `name: string` - Human-readable name of the food item
  - `gramsToCarbohydrate: number` - Grams of food containing 10g of carbohydrates (HC)
  - `bloodGlucoseIndex: number | undefined` - Optional glycemic index value
  - `weight: number` - Weight of food portion in grams
  - `rations: number` - Calculated ration value (derived from weight and gramsToCarbohydrate)
  - Relationships: Standalone entity (no foreign keys in MVP)

- **RationRepository** (interface): Abstraction for data persistence
  - `save(ration: Ration): Promise<void>` - Persist new ration
  - `findAll(): Promise<Ration[]>` - Retrieve all rations
  - Future methods: `findById(id: string)`, `update(ration: Ration)`, `delete(id: string)`

- **LocalStorageRationRepository**: Concrete implementation of RationRepository
  - Stores rations array in localStorage under key `"rations"`
  - Serializes/deserializes JSON
  - Handles localStorage errors

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new ration and see it appear on home page in under 30 seconds (from clicking "Create" to viewing card)
- **SC-002**: Infinite scroll loads next batch of rations within 200ms of reaching scroll threshold
- **SC-003**: Repository pattern allows swapping localStorage implementation with mock/API implementation by changing single dependency injection (≤ 5 lines of code change)
- **SC-004**: Application handles localStorage quota errors gracefully with user-friendly error message (no crashes)
- **SC-005**: All seven ration types display with visually distinct category colors (>4.5:1 contrast ratio from design tokens)
- **SC-006**: 95% of users successfully create their first ration without errors (measured by form submission success rate)
- **SC-007**: Ration data persists across 100% of browser refresh/close/reopen scenarios (when localStorage is enabled)
- **SC-008**: Initial home page load displays first batch of rations in under 500ms (for dataset of 100 rations)
- **SC-009**: Form validation prevents submission of invalid data (empty required fields, negative numbers) with clear error messages
- **SC-010**: Empty state on home page displays call-to-action that navigates to create form with single click
