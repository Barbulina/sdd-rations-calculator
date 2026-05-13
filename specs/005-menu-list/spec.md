# Feature Specification: Menu List - Home Page

**Feature Branch**: `005-menu-list`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "Como usuario quiero ver la lista de menús que he creado en la página principal, con tarjeta que muestre nombre, tipo, fecha, total de raciones y peso. También quiero poder eliminar un menú de la lista. Y quiero un filtro para poder buscar por nombre de menu y un selector para filtrar por tipo de menú"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Saved Menus List (Priority: P1)

As a user, when I open the home page I want to see all the menus I have previously created, displayed as cards with key information, so I can quickly review my dietary history.

**Why this priority**: Without the list, users have no way to see what menus they have saved. This is the core value of the feature and the foundation for all other stories.

**Independent Test**: Can be tested by saving a menu via /menu-builder, navigating to the home page, and verifying the menu card appears with all required information.

**Acceptance Scenarios**:

1. **Given** I have saved one or more menus, **When** I visit the home page, **Then** I see a list of menu cards, each showing the menu name, meal type (e.g. Breakfast), creation date, total rations, and total weight
2. **Given** I have no saved menus, **When** I visit the home page, **Then** I see an empty state message inviting me to create my first menu, with a link to the menu builder
3. **Given** I have many saved menus, **When** I visit the home page, **Then** menus are ordered by creation date (most recent first)

---

### User Story 2 - Delete a Menu (Priority: P2)

As a user, I want to delete a menu from the list so I can remove menus I no longer need and keep my list clean.

**Why this priority**: Deletion is a critical management action. Without it, users are stuck with menus they can't remove.

**Independent Test**: Can be tested independently by saving a menu, returning to the home page, triggering delete on the menu card, confirming, and verifying the menu disappears from the list.

**Acceptance Scenarios**:

1. **Given** a menu card is visible in the list, **When** I click the delete button on that card and confirm, **Then** the menu is removed from the list immediately without a page reload
2. **Given** I trigger the delete action, **When** a confirmation prompt appears and I cancel, **Then** the menu remains in the list unchanged
3. **Given** I delete the last remaining menu, **When** the deletion completes, **Then** the empty state is shown

---

### User Story 3 - Filter Menus by Name (Priority: P3)

As a user, I want to search menus by name so I can quickly find a specific menu when I have many saved.

**Why this priority**: Filtering by name is a convenience feature that becomes essential as the list grows. It does not block core functionality.

**Independent Test**: Can be tested independently by saving multiple menus with different names, typing a search term in the search box, and verifying only matching menus are shown.

**Acceptance Scenarios**:

1. **Given** multiple menus exist, **When** I type a name in the search input, **Then** only menus whose name contains the typed text (case-insensitive, partial match) are shown
2. **Given** a search term is active, **When** I clear the search input, **Then** all menus are shown again
3. **Given** a search term matches no menus, **When** I type it, **Then** an informative "no results found" message is shown

---

### User Story 4 - Filter Menus by Type (Priority: P4)

As a user, I want to filter menus by meal type so I can quickly see all menus of a specific category (e.g., all my breakfasts).

**Why this priority**: Type filtering complements name search and helps users navigate by meal occasion. Lower priority than name search since type is already visible on each card.

**Independent Test**: Can be tested independently by saving menus of different types, selecting a type in the filter dropdown, and verifying only matching menus are shown.

**Acceptance Scenarios**:

1. **Given** menus of multiple types exist, **When** I select "Breakfast" from the type filter dropdown, **Then** only breakfast menus are displayed
2. **Given** a type filter is active, **When** I select "All types" from the dropdown, **Then** all menus are shown again
3. **Given** both a name search and a type filter are active, **When** I apply both, **Then** only menus matching both criteria simultaneously are shown

---

### Edge Cases

- What happens when the menu list fails to load (e.g., storage is unavailable)? A user-friendly error message is shown.
- What happens if the user types very long text in the search box? Input is limited to 200 characters.
- What happens when both name filter and type filter yield no results? A single "no menus found" message is shown.
- What happens when a menu was created with incomplete data? The card degrades gracefully, showing all available data.
- What happens when the user clicks delete very quickly multiple times? Only one deletion is processed.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The home page MUST display all saved menus as individual cards, ordered by creation date descending (most recent first)
- **FR-002**: Each menu card MUST display: menu name, meal type, creation date (human-readable format), total rations (2 decimal places), and total weight in grams
- **FR-003**: Each menu card MUST include a delete action that permanently removes the menu after user confirmation
- **FR-004**: A confirmation step MUST be required before permanently deleting a menu
- **FR-005**: The home page MUST show an empty state when no menus exist, with a call-to-action linking to the menu builder
- **FR-006**: The home page MUST provide a text input to filter the menu list by name (case-insensitive, partial match)
- **FR-007**: The home page MUST provide a dropdown selector to filter the menu list by type, with options: All, Breakfast, Lunch, Dinner, Snack
- **FR-008**: Name and type filters MUST operate together using AND logic (a menu must match both active filters to appear)
- **FR-009**: When active filters produce no matches, the system MUST show a "no results found" message distinct from the empty state
- **FR-010**: The home page MUST show a loading indicator while the menu list is being fetched
- **FR-011**: The "+ Create" (or equivalent) action button MUST navigate to the menu builder page
- **FR-012**: Filter inputs MUST reset to their default state when the user navigates away and returns to the home page

### Key Entities

- **Menu**: A saved meal plan with name, meal type (Breakfast, Lunch, Dinner, Snack), creation date, total weight in grams, total rations, and a list of aliment items
- **MenuCard**: The read-only visual representation of a Menu shown in the list; includes all summary data and a delete action
- **MenuFilter**: The combined filter state of name search text and selected meal type; applied client-side to the full loaded menu list

## Assumptions

- Menus are stored in browser localStorage via the existing `MenuRepository` (implemented in Feature 004)
- `MenuRepository.findAll()` returns all menus; sorting by creation date descending is handled in the UI if not provided by the repository
- The delete confirmation is handled by a simple inline confirm interaction (not a full modal) to keep scope minimal
- No pagination is required initially; all menus are loaded and filtered client-side
- The existing `EmptyState` component on the home page is updated to reflect menu context (already done in Feature 004)
- Meal type labels are displayed in English: Breakfast, Lunch, Dinner, Snack
- Filter state is not persisted between page visits (resets on navigation)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All saved menus are visible on the home page within 1 second of page load
- **SC-002**: Users can delete a menu in 2 interactions or fewer (click delete → confirm)
- **SC-003**: The name filter narrows visible results instantly as the user types, with no perceptible delay
- **SC-004**: The type filter updates the visible list instantly upon selection, with no perceptible delay
- **SC-005**: When both filters are active, the combined result is displayed without a page reload
- **SC-006**: The empty state appears immediately after the last menu is deleted, with no stale content shown
- **SC-007**: A user with no saved menus sees the empty state and a clear path to create their first menu
