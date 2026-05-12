# Feature Specification: Menu Builder with Aliment Search

**Feature ID**: 004-menu-builder  
**Created**: 2026-02-12  
**Status**: Planning

## Overview

Redesign the ration creation flow to use an aliment search and selection interface. Users will search for aliments from the catalog, add them to a list with specific weights, and the system will automatically calculate rations for each item and provide a summary.

## Problem Statement

The current `/create-ration` page requires users to manually enter all nutritional data (name, type, gramsToCarbohydrate, bloodGlucoseIndex). This is inefficient because:
- Users must remember or look up nutritional values
- Prone to data entry errors
- Doesn't leverage the existing 365+ aliment catalog
- No autocomplete or search assistance

## User Stories

### US-1: Search and Select Aliments (Priority: HIGH)

**As a** nutrition tracker  
**I want to** search for aliments using autocomplete  
**So that** I can quickly find and add items to my menu

**Acceptance Criteria**:
- Autocomplete input searches both catalog and custom aliments
- Search is case-insensitive with partial matching
- Results show aliment name and category
- Custom aliments have a "Custom" badge
- Selecting an aliment adds it to the menu list below
- Minimum 2 characters required to trigger search
- Maximum 10 suggestions shown

### US-2: Add Weight to Aliments (Priority: HIGH)

**As a** nutrition tracker  
**I want to** specify the weight in grams for each aliment  
**So that** rations are calculated based on actual consumption

**Acceptance Criteria**:
- Each aliment in the list displays complete information:
  - Aliment name
  - Category/Type
  - Grams to Carbohydrate (10g carbs)
  - Blood Glucose Index (if available)
  - "Custom" badge (if custom aliment)
- Each aliment has a weight input field (grams)
- Weight must be a positive number
- Rations auto-calculate: `weight / gramsToCarbohydrate`
- Rations display with 2 decimal places
- Can edit weight and rations recalculate instantly
- Can remove aliments from the list

### US-3: Menu Summary (Priority: HIGH)

**As a** nutrition tracker  
**I want to** see a summary of total rations  
**So that** I can track my carbohydrate intake for the meal

**Acceptance Criteria**:
- Summary shows total rations (sum of all aliment rations)
- Summary updates automatically when weights change
- Summary visible at bottom of aliment list
- Shows total weight and total rations

### US-4: Save Menu (Priority: HIGH)

**As a** nutrition tracker  
**I want to** save the complete menu  
**So that** I can track it as a meal

**Acceptance Criteria**:
- "Save Menu" button at bottom
- Menu requires at least 1 aliment to save
- Must provide menu name and menu type (breakfast, lunch, etc.)
- Saves to localStorage
- Redirects to home page after successful save
- Shows success confirmation

### US-5: Empty State and Cancel (Priority: MEDIUM)

**As a** nutrition tracker  
**I want to** see helpful guidance when the list is empty  
**So that** I know what to do next

**Acceptance Criteria**:
- Empty state shows message: "Search and add aliments to build your menu"
- Cancel button returns to home page
- Confirmation dialog if unsaved changes exist

## Technical Requirements

### Data Model

**MenuItem** (new entity):
```typescript
interface MenuItem {
  aliment: AlimentInfo | CustomAliment;  // The selected aliment
  weightGrams: number;                    // Weight in grams
  rations: number;                        // Calculated: weight / gramsToCarbohydrate
}
```

**Menu** (replaces Ration):
```typescript
interface Menu {
  id: string;                            // UUID
  name: string;                          // Menu name
  type: RationsType;                     // Menu type (breakfast, lunch, etc.)
  items: MenuItem[];                     // List of aliments with weights
  totalWeight: number;                   // Sum of all weights
  totalRations: number;                  // Sum of all rations
  createdAt: Date;                       // Creation timestamp
  updatedAt?: Date;                      // Last modification
}
```

### UI Components

**Page**: `/create-ration` (redesigned)
- **AlimentSearchInput**: Autocomplete search component
- **MenuItemsList**: List of selected aliments with weight inputs
- **MenuSummary**: Total weight and rations display
- **MenuMetadataForm**: Menu name and type inputs
- **ActionButtons**: Cancel and Save buttons

### Calculations

```typescript
// Calculate rations for a single item
const itemRations = weightGrams / aliment.gramsToCarbohydrate;

// Calculate total rations
const totalRations = menuItems.reduce(
  (sum, item) => sum + item.rations, 
  0
);

// Calculate total weight
const totalWeight = menuItems.reduce(
  (sum, item) => sum + item.weightGrams, 
  0
);
```

### Repository Changes

**Option 1**: Keep RationRepository, adapt Menu model  
**Option 2**: Create new MenuRepository with MenuItem support

Recommended: **Option 2** - Create MenuRepository for cleaner separation.

### Dependencies

- `useCompositeAliments` hook (already exists for merged catalog)
- Autocomplete component (new - can use existing pattern or library)
- Form validation (reuse existing patterns)

## Non-Functional Requirements

### Performance
- Autocomplete search responds in <100ms
- Rations recalculate in <50ms on weight change
- Page renders <200ms

### Usability
- Clear visual feedback during search
- Inline validation errors
- Autofocus on search input
- Keyboard navigation support (arrow keys for autocomplete)

### Accessibility
- ARIA labels for all inputs
- Screen reader announcements for rations updates
- Keyboard-only navigation support
- Focus management

### Data Validation
- Weight must be > 0 and < 10000 grams
- Menu name required, max 200 characters
- At least 1 aliment required to save
- Type selection required

## User Flow

```
1. User navigates to /create-ration (or clicks "Create" from home)
2. Sees empty state with autocomplete search
3. Types aliment name (e.g., "manza")
4. Autocomplete shows suggestions:
   - manzana (catalog)
   - manzana asada (catalog)
   - Manzana ecológica (custom)
5. Selects "manzana"
6. Aliment added to list with weight input field
7. User enters weight: 150g
8. Rations auto-calculate: 150g / 110g = 1.36 rations
9. User searches and adds more aliments
10. Summary updates: Total 3.45 rations, 425g
11. User fills menu name: "Afternoon Snack"
12. Selects type: "AFTERNOON_SNACK"
13. Clicks "Save Menu"
14. Menu saved to localStorage
15. Redirects to home page
```

## Migration Strategy

### Phase 1: Build New UI (No Breaking Changes)
- Create new components alongside existing form
- Use feature flag or new route `/create-menu`
- Test with users

### Phase 2: Data Migration
- Migrate existing Ration entries to Menu format
- Add MenuItem structure to stored data
- Maintain backward compatibility

### Phase 3: Replace Old Flow
- Replace `/create-ration` with new menu builder
- Archive old form code
- Update documentation

## Success Metrics

- Time to create menu: <2 minutes (vs 5+ minutes manual entry)
- Data entry errors: <5% (vs ~20% estimated)
- User satisfaction: 4+ / 5 stars
- Autocomplete usage: >80% of menu creations
- Menu completion rate: >90%

## Out of Scope (v1)

- Duplicate entire menus
- Edit saved menus (only delete)
- Meal templates / favorites
- Nutritional analysis beyond rations
- Multi-day menu planning
- Export/import menus

## Dependencies

- Feature 003-aliment-catalog must be complete ✅ (already merged)
- CompositeAlimentRepository available ✅
- localStorage working ✅

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Autocomplete too slow with 365+ items | High | Implement debouncing, limit results to 10 |
| Users confused by rations calculation | Medium | Show formula tooltip, add help text |
| localStorage quota exceeded | Low | Limit menus to 100, show storage warning |
| Breaking existing ration data | High | Careful migration, maintain compatibility |

## Design Considerations

### Empty State
```
╔══════════════════════════════════════╗
║   🔍 Search for aliments...           ║
╠══════════════════════════════════════╣
║                                      ║
║   📝 No aliments added yet           ║
║   Search and add aliments to         ║
║   build your menu                    ║
║                                      ║
╚══════════════════════════════════════╝
```
[X]  ║
║     Category: Frutas                 ║
║     Grams to Carb: 110g              ║
║     Glycemic Index: 38               ║
║     Weight: [150]g → 1.36 rations    ║
║                                      ║
║   ✓ Pan integral (Custom)       [X]  ║
║     Category: Cereales               ║
║     Grams to Carb: 20g               ║
║     Glycemic Index: 55               ║
║     Weight: [50]g → 2.50 rations      ║
╠══════════════════════════════════════╣
║   ✓ Manzana                          ║
║     150g → 1.36 rations         [X]  ║
║                                      ║
║   ✓ Pan integral (Custom)            ║
║     50g → 2.50 rations          [X]  ║
╠══════════════════════════════════════╣
║   📊 Summary                          ║
║   Total Weight: 200g                 ║
║   Total Rations: 3.86                ║
╠══════════════════════════════════════╣
║   Menu Name: [____________]          ║
║   Type: [Lunch ▼]                   ║
║                                      ║
║   [Cancel]          [Save Menu]      ║
╚══════════════════════════════════════╝
```

## Next Steps

1. Review and approve specification
2. Create data model documentation
3. Create implementation plan with TDD tasks
4. Design UI mockups
5. Begin Phase 1 implementation
