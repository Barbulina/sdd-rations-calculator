# Implementation Plan: Menu Builder

**Feature ID**: 004-menu-builder  
**Date**: 2026-02-12  
**Dependencies**: Feature 003 (Aliment Catalog)

## Overview

Transform the ration creation flow from manual entry to autocomplete-based menu builder with automatic rations calculation.

## Tech Stack

### Core

- **Framework**: Next.js 15.1.6 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.7.3 (strict mode)
- **Styling**: Tailwind CSS 3.4.1 + Design Tokens

### Data Layer

- **State**: React Context API
- **Storage**: localStorage via Repository Pattern
- **Validation**: Runtime type checking

### Testing

- **Unit**: Vitest 4.0.18 + @testing-library/react
- **E2E**: Playwright 1.49.1
- **Coverage**: @vitest/coverage-v8

### Dependencies (Existing)

- `useCompositeAliments` hook (Feature 003)
- `AlimentInfo`, `CustomAliment` models
- `RationsType` enum
- Design tokens system

## Architecture

### Layers

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer                     │
│  /app/create-ration/page.tsx (redesigned)       │
│  - AutocompleteSearch component                  │
│  - MenuItemsList component                       │
│  - MenuSummary component                         │
│  - SaveMenuForm component                        │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│           Application Layer                      │
│  - useMenuBuilder hook (state management)        │
│  - MenuRepositoryContext (DI)                    │
│  - Form validation logic                         │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│              Domain Layer                        │
│  src/domain/models/                              │
│  - MenuItem.ts (weight + rations calculation)    │
│  - Menu.ts (totals + validation)                 │
│                                                   │
│  src/domain/repositories/                        │
│  - MenuRepository.ts (interface)                 │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│          Infrastructure Layer                    │
│  src/infrastructure/repositories/                │
│  - LocalStorageMenuRepository.ts                 │
│                                                   │
│  src/infrastructure/storage/                     │
│  - LocalStorageAdapter.ts (reuse existing)       │
└─────────────────────────────────────────────────┘
```

### Component Tree

```
CreateRationPage
├── AutocompleteSearch
│   ├── SearchInput (with debounce)
│   └── AlimentSuggestions
│       └── AlimentSuggestionItem
│           ├── AlimentName
│           ├── AlimentCategory (badge)
│           ├── GramsToCarbohydrate
│           ├── BloodGlucoseIndex
│           └── CustomBadge (if custom)
│
├── WeightInputDialog
│   ├── NumericInput
│   └── ActionButtons (Add / Cancel)
│
├── MenuItemsList
│   └── MenuItemCard
│       ├── AlimentDetails (all properties)
│       ├── WeightInput (inline edit)
│       ├── CalculatedRations (auto-update)
│       └── RemoveButton
│
├── MenuSummary
│   ├── TotalWeight
│   └── TotalRations
│
└── SaveMenuForm
    ├── MenuNameInput
    ├── MenuTypeSelect
    └── SaveButton (+ Cancel)
```

## Implementation Phases

### Phase 1: Domain Layer (TDD)

**Files**:

- `src/domain/models/MenuItem.ts`
- `src/domain/models/Menu.ts`
- `tests/unit/menu-builder/MenuItem.test.ts`
- `tests/unit/menu-builder/Menu.test.ts`

**Tasks**:

1. RED: Write MenuItem tests (weight validation, rations calc)
2. GREEN: Implement MenuItem model
3. REFACTOR: Extract calculation logic if needed
4. RED: Write Menu tests (totals, validation)
5. GREEN: Implement Menu model
6. REFACTOR: Optimize totals calculation

**Test Coverage**:

- MenuItem creation with valid/invalid weights
- Rations calculation formula
- Menu creation with multiple items
- Total calculations
- Validation rules enforcement

---

### Phase 2: Repository Layer (TDD)

**Files**:

- `src/domain/repositories/MenuRepository.ts`
- `src/infrastructure/repositories/LocalStorageMenuRepository.ts`
- `tests/integration/menu-builder/LocalStorageMenuRepository.test.ts`

**Tasks**:

1. RED: Write repository interface contract tests
2. GREEN: Implement MenuRepository interface
3. RED: Write LocalStorage implementation tests
4. GREEN: Implement LocalStorageMenuRepository
5. REFACTOR: Handle serialization edge cases

**Test Coverage**:

- CRUD operations
- localStorage key isolation (`sdd-rations-calculator:menus`)
- Date serialization/deserialization
- Error handling (quota exceeded, invalid JSON)
- Concurrent access scenarios

---

### Phase 3: Application Layer (TDD)

**Files**:

- `src/application/hooks/useMenuBuilder.ts`
- `src/application/contexts/MenuRepositoryContext.tsx`
- `tests/unit/menu-builder/useMenuBuilder.test.ts`

**Tasks**:

1. RED: Write hook tests (add/remove items, calculate totals)
2. GREEN: Implement useMenuBuilder hook
3. REFACTOR: Extract reusable logic
4. RED: Write context tests
5. GREEN: Implement MenuRepositoryContext

**Hook API**:

```typescript
interface UseMenuBuilderReturn {
  items: MenuItem[];
  totalWeight: number;
  totalRations: number;
  addItem: (aliment: AlimentInfo | CustomAliment, weight: number) => void;
  removeItem: (id: string) => void;
  updateItemWeight: (id: string, weight: number) => void;
  clearItems: () => void;
  saveMenu: (name: string, type: RationsType) => Promise<void>;
}
```

**Test Coverage**:

- Add item with auto-calculation
- Remove item updates totals
- Update weight recalculates rations
- Clear all items
- Save menu validation

---

### Phase 4: Autocomplete Component (TDD)

**Files**:

- `app/components/AutocompleteSearch.tsx`
- `app/components/AlimentSuggestionItem.tsx`
- `tests/integration/menu-builder/AutocompleteSearch.test.ts`

**Tasks**:

1. RED: Write autocomplete interaction tests
2. GREEN: Implement search input with debounce
3. RED: Write suggestions list tests
4. GREEN: Implement suggestions dropdown
5. RED: Write suggestion item display tests
6. GREEN: Implement complete aliment data display
7. REFACTOR: Extract suggestion item component

**Features**:

- Debounced search (300ms)
- Keyboard navigation (Arrow Up/Down, Enter, Escape)
- Display all aliment properties:
  - Name
  - Category (badge with color)
  - gramsToCarbohydrate (e.g., "110g")
  - bloodGlucoseIndex (e.g., "IG: 38")
  - Custom badge (if isCustom)
- Click to select → open weight dialog
- Empty state ("No aliments found")

**Test Coverage**:

- Search filters catalog + custom aliments
- Debounce prevents excessive renders
- Keyboard navigation works
- All aliment data renders correctly
- Custom badge shows only for custom aliments

---

### Phase 5: Weight Input Dialog (TDD)

**Files**:

- `app/components/WeightInputDialog.tsx`
- `tests/integration/menu-builder/WeightInputDialog.test.ts`

**Tasks**:

1. RED: Write dialog interaction tests
2. GREEN: Implement modal dialog
3. RED: Write numeric input validation tests
4. GREEN: Implement weight input with validation
5. REFACTOR: Extract reusable dialog component

**Features**:

- Modal overlay with focus trap
- Numeric input (positive integers only)
- Min: 1g, Max: 10000g
- Real-time validation
- "Add" button (disabled if invalid)
- "Cancel" button
- Escape key to close

**Test Coverage**:

- Dialog opens on aliment selection
- Invalid weights block submission
- Valid submission adds item with calculated rations
- Cancel closes without adding
- Escape key closes dialog

---

### Phase 6: Menu Items List (TDD)

**Files**:

- `app/components/MenuItemsList.tsx`
- `app/components/MenuItemCard.tsx`
- `tests/integration/menu-builder/MenuItemsList.test.ts`

**Tasks**:

1. RED: Write list rendering tests
2. GREEN: Implement items list
3. RED: Write item card tests (all aliment data)
4. GREEN: Implement card with complete aliment info
5. RED: Write inline weight edit tests
6. GREEN: Implement weight editing
7. REFACTOR: Extract card component

**Features**:

- List of MenuItemCard components
- Each card displays:
  - Aliment name (heading)
  - Category badge (with color coding)
  - gramsToCarbohydrate (e.g., "1 ration = 110g")
  - bloodGlucoseIndex (e.g., "IG: 38")
  - Custom badge (if applicable)
  - Weight input (inline editable)
  - Calculated rations (auto-update)
  - Remove button (trash icon)
- Empty state ("Add aliments to build your menu")

**Test Coverage**:

- All aliment properties render
- Weight changes recalculate rations
- Remove button deletes item
- Rations display with 2 decimals
- Custom badge shows correctly

---

### Phase 7: Summary Component (TDD)

**Files**:

- `app/components/MenuSummary.tsx`
- `tests/unit/menu-builder/MenuSummary.test.ts`

**Tasks**:

1. RED: Write summary display tests
2. GREEN: Implement totals display
3. REFACTOR: Add formatting helpers

**Features**:

- Total Weight: `{totalWeight}g`
- Total Rations: `{totalRations.toFixed(2)} rations`
- Highlighted box (design token colors)
- Auto-update on item changes

**Test Coverage**:

- Totals calculate correctly
- Updates when items added/removed/edited
- Formatting displays correctly

---

### Phase 8: Save Menu Form (TDD)

**Files**:

- `app/components/SaveMenuForm.tsx`
- `tests/integration/menu-builder/SaveMenuForm.test.ts`

**Tasks**:

1. RED: Write form validation tests
2. GREEN: Implement menu name input
3. RED: Write type selection tests
4. GREEN: Implement RationsType select
5. RED: Write save flow tests
6. GREEN: Implement save with repository
7. REFACTOR: Extract form validation

**Features**:

- Menu name input (required, max 200 chars)
- Menu type select (RationsType dropdown)
- Save button (disabled if invalid or no items)
- Cancel button (navigate back)
- Success: Navigate to home with success message
- Error: Display validation errors

**Test Coverage**:

- Name validation (required, length)
- Type selection required
- Disabled if no items
- Successful save navigates home
- Validation errors display

---

### Phase 9: Page Integration (E2E)

**Files**:

- `app/create-ration/page.tsx` (complete redesign)
- `tests/e2e/menu-builder.spec.ts`

**Tasks**:

1. RED: Write full flow E2E tests
2. GREEN: Integrate all components
3. REFACTOR: Optimize rendering

**User Flow**:

```
1. Navigate to /create-ration
2. Search for aliment (autocomplete)
3. Select aliment from dropdown
4. Enter weight in dialog
5. See item added to list with:
   - Name, category, gramsToCarbohydrate, glycemic index
   - Weight, calculated rations
   - Custom badge if applicable
6. Add more items (repeat 2-5)
7. View summary (total weight + rations)
8. Enter menu name
9. Select menu type
10. Click "Save Menu"
11. Navigate to home page
12. See new menu card
```

**E2E Test Coverage**:

- Complete flow from search to save
- Multiple items in menu
- Edit weight inline
- Remove item
- Cancel without saving
- Save successfully
- Validation prevents invalid save

---

### Phase 10: Home Page Integration

**Files**:

- `app/page.tsx` (update to show menus)
- `app/components/MenuCard.tsx` (new component)

**Tasks**:

1. Create MenuCard component to display saved menus
2. Update home page to fetch and render menus
3. Add expand/collapse for menu items
4. Add options menu (edit, delete)

**Note**: This may be deferred to separate feature if needed.

---

## File Structure

```
app/
  create-ration/
    page.tsx              [REDESIGN] Main menu builder page
  components/
    AutocompleteSearch.tsx         [NEW] Aliment search
    AlimentSuggestionItem.tsx      [NEW] Suggestion display (full data)
    WeightInputDialog.tsx          [NEW] Weight entry modal
    MenuItemsList.tsx              [NEW] List of selected items
    MenuItemCard.tsx               [NEW] Item card (full aliment data)
    MenuSummary.tsx                [NEW] Totals display
    SaveMenuForm.tsx               [NEW] Name + type + save

src/
  domain/
    models/
      MenuItem.ts         [NEW] MenuItem entity
      Menu.ts             [NEW] Menu entity
    repositories/
      MenuRepository.ts   [NEW] Repository interface

  infrastructure/
    repositories/
      LocalStorageMenuRepository.ts  [NEW] localStorage impl

  application/
    hooks/
      useMenuBuilder.ts   [NEW] Menu state management
    contexts/
      MenuRepositoryContext.tsx  [NEW] DI context

tests/
  unit/
    menu-builder/
      MenuItem.test.ts              [NEW]
      Menu.test.ts                  [NEW]
      useMenuBuilder.test.ts        [NEW]
      MenuSummary.test.ts           [NEW]

  integration/
    menu-builder/
      LocalStorageMenuRepository.test.ts  [NEW]
      AutocompleteSearch.test.ts          [NEW]
      WeightInputDialog.test.ts           [NEW]
      MenuItemsList.test.ts               [NEW]
      SaveMenuForm.test.ts                [NEW]

  e2e/
    menu-builder.spec.ts            [NEW] Full flow tests
```

## Design Token Usage

### Colors

- **Primary**: Autocomplete focus, Save button
- **Success**: Menu saved confirmation
- **Neutral**: Card backgrounds, borders
- **Semantic (category badges)**:
  - Red: Carnes
  - Green: Verduras
  - Yellow: Frutas
  - Purple: Lácteos
  - Orange: Cereales

### Typography

- **Heading**: Aliment names
- **Body**: Descriptions, labels
- **Caption**: Helper text, subtext

### Spacing

- **Card padding**: `var(--spacing-4)`
- **List gaps**: `var(--spacing-3)`
- **Form inputs**: `var(--spacing-3)`

### Shadows

- **Card**: `var(--elevation-1)`
- **Dialog**: `var(--elevation-3)`

---

## State Management

### useMenuBuilder Hook

```typescript
const {
  items, // Current menu items
  totalWeight, // Sum of weights
  totalRations, // Sum of rations
  addItem, // (aliment, weight) => void
  removeItem, // (id) => void
  updateItemWeight, // (id, weight) => void
  clearItems, // () => void
  saveMenu, // (name, type) => Promise<void>
} = useMenuBuilder();
```

**Implementation**:

- `items`: `useState<MenuItem[]>([])`
- `addItem`: Create MenuItem with UUID, calculate rations, append to array
- `removeItem`: Filter out item by ID
- `updateItemWeight`: Map over items, recalculate rations for matching ID
- Totals: `useMemo` to calculate from items array
- `saveMenu`: Validate, create Menu, call repository.save(), navigate

---

## Autocomplete Implementation

### Search Strategy

Use existing `useCompositeAliments` hook:

```typescript
const { aliments } = useCompositeAliments();
const [searchTerm, setSearchTerm] = useState("");

const filteredAliments = useMemo(() => {
  if (!searchTerm) return aliments.slice(0, 10); // Show first 10

  const term = searchTerm.toLowerCase();
  return aliments
    .filter((a) => a.name.toLowerCase().includes(term))
    .slice(0, 20); // Limit to 20 results
}, [searchTerm, aliments]);
```

### Debounce

```typescript
const [searchTerm, setSearchTerm] = useState("");
const [debouncedTerm, setDebouncedTerm] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm);
  }, 300);

  return () => clearTimeout(timer);
}, [searchTerm]);

// Use debouncedTerm for filtering
```

### Keyboard Navigation

```typescript
const [selectedIndex, setSelectedIndex] = useState(-1);

const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
      break;
    case "ArrowUp":
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
      break;
    case "Enter":
      e.preventDefault();
      if (selectedIndex >= 0) {
        selectAliment(suggestions[selectedIndex]);
      }
      break;
    case "Escape":
      setShowSuggestions(false);
      break;
  }
};
```

---

## Validation Strategy

### Client-Side Validation

**Weight Input**:

```typescript
function validateWeight(weight: string): string | null {
  const num = Number(weight);
  if (isNaN(num) || num <= 0) {
    return "Weight must be a positive number";
  }
  if (num > 10000) {
    return "Weight cannot exceed 10,000g";
  }
  return null; // Valid
}
```

**Menu Name**:

```typescript
function validateMenuName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return "Menu name is required";
  }
  if (trimmed.length > 200) {
    return "Menu name must be 200 characters or less";
  }
  return null;
}
```

**Menu Validation**:

```typescript
function validateMenu(menu: CreateMenuDTO): string[] {
  const errors: string[] = [];

  const nameError = validateMenuName(menu.name);
  if (nameError) errors.push(nameError);

  if (!menu.type) {
    errors.push("Menu type is required");
  }

  if (menu.items.length === 0) {
    errors.push("Menu must contain at least one aliment");
  }

  return errors;
}
```

---

## Error Handling

### localStorage Errors

```typescript
try {
  repository.save(menu);
} catch (error) {
  if (error instanceof QuotaExceededError) {
    showError("Storage full. Please delete some menus.");
  } else {
    showError("Failed to save menu. Please try again.");
  }
}
```

### Network/Async Errors

```typescript
const saveMenu = async (name: string, type: RationsType) => {
  try {
    setLoading(true);
    await repository.save({ name, type, items });
    router.push("/?success=menu-created");
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## Testing Strategy

### Unit Tests

- Domain models (MenuItem, Menu)
- Calculation functions
- Validation functions
- Hooks (useMenuBuilder)

### Integration Tests

- Repository with localStorage
- Component interactions
- Form submissions

### E2E Tests

- Full user flow
- Error scenarios
- Edge cases

### Coverage Target

- **Overall**: 80%+
- **Domain layer**: 100%
- **Repository layer**: 100%
- **UI components**: 70%+

---

## Performance Considerations

### Debounce Search

- 300ms delay prevents excessive filtering
- Cancel previous timer on new input

### Memoization

```typescript
const totalWeight = useMemo(
  () => items.reduce((sum, item) => sum + item.weightGrams, 0),
  [items],
);
```

### Virtual Scrolling (Future)

If aliment list grows large (100+), consider react-window for suggestions dropdown.

---

## Accessibility

### Keyboard Support

- Tab navigation through form
- Arrow keys for autocomplete
- Escape to close dialogs
- Enter to submit

### Screen Readers

- ARIA labels on inputs
- ARIA live regions for totals
- Descriptive button labels

### Focus Management

- Auto-focus weight input in dialog
- Return focus to trigger after dialog close
- Visible focus indicators

---

## Migration Path

### Backward Compatibility

**Option A**: Keep separate Ration and Menu models

- `sdd-rations-calculator:rations` → old model
- `sdd-rations-calculator:menus` → new model
- Display both on home page

**Option B**: Migrate Rations to Menus

- Detect old rations on load
- Convert to Menu format
- Prompt user: "Migrate old rations to new menu format?"

**Recommendation**: Option A for initial release, add migration tool later.

---

## Rollout Plan

### Phase 1: Parallel Release

- Deploy menu builder to `/create-ration`
- Keep old ration list working on home page
- Add "New Menu Builder" badge

### Phase 2: User Feedback

- Collect usage analytics
- Fix bugs
- Improve UX based on feedback

### Phase 3: Migration (Future)

- Add migration prompt on home page
- Convert old rations to menus
- Deprecate old Ration model

---

## Future Enhancements

1. **Meal Templates**
   - Save favorite combinations
   - Quick add from templates

2. **Meal Timing**
   - Record actual consumption time
   - Track meal patterns

3. **Portion Sizes**
   - Servings instead of weight
   - Common portions (1 cup, 1 slice)

4. **Nutritional Breakdown**
   - Total calories
   - Protein, fat, fiber

5. **Export/Import**
   - JSON export
   - Share menus with others

6. **Meal History**
   - Calendar view
   - Frequency analysis

---

## Dependencies

### Existing Features Required

- Feature 003: Aliment Catalog (CustomAliment, CompositeRepository)
- Design Tokens system
- RationsType enum
- LocalStorageAdapter

### External Libraries

- None (all based on existing dependencies)

---

## Risk Mitigation

### Risk: localStorage quota exceeded

**Mitigation**:

- Show storage usage indicator
- Allow menu deletion
- Limit menu history to 100 items

### Risk: Performance with large menu

**Mitigation**:

- Limit items per menu to 50
- Use memoization for calculations
- Debounce weight inputs

### Risk: Data loss on localStorage clear

**Mitigation**:

- Add export functionality
- Periodic backup prompt
- Warn before destructive actions

---

## Success Metrics

- Menu creation time < 30 seconds
- No errors in production logs
- 80%+ test coverage
- Positive user feedback
- Zero data loss incidents
