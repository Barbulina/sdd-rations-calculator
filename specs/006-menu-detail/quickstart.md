# Quickstart: Menu Detail (TDD Guide)

**Feature**: 006-menu-detail

## Prerequisites

- Feature 004 (Menu Builder) merged ✅
- Feature 005 (Menu List) merged ✅
- `MenuRepository.getById()` and `.update()` exist ✅
- `AutocompleteSearch` + `WeightInputDialog` exist ✅

## Step-by-Step TDD Implementation

### Phase 1 — MenuCard gets a link (US1 prerequisite)

```
RED:   Write test: clicking MenuCard navigates to /menu/[id]
GREEN: Wrap non-delete area of MenuCard in <Link href={`/menu/${menu.id}`}>
```

### Phase 2 — useMenuDetail hook

```
RED:   Write unit tests:
       - loadMenu: calls getById(id), sets menu/isLoading/notFound
       - editName: setEditName updates state; saveChanges calls update()
       - editType: setEditType updates state; saveChanges calls update()
       - validation: saveChanges with empty name sets nameError, no update call
       - removeItem: calls update() with item removed, recalculated totals
       - addItem: calls update() with item added, recalculated totals
       - last item: removeItem on last item returns error, no update call

GREEN: Implement src/application/hooks/useMenuDetail.ts
```

### Phase 3 — Detail page (US1: View)

```
RED:   Write integration tests for app/menu/[id]/page.tsx:
       - shows loading state
       - shows "Menu not found" for unknown id
       - shows menu name in <h1>
       - shows type label
       - shows formatted date
       - shows each item (name, weight, rations)
       - shows total rations and weight
       - has "← My Menus" link to /

GREEN: Implement app/menu/[id]/page.tsx (read-only part)
       Implement app/components/menu-detail/MenuItemRow.tsx
       Implement app/components/menu-detail/MenuDetailSummary.tsx
```

### Phase 4 — Edit name and type (US2)

```
RED:   Write integration tests:
       - name input is present with current menu name as value
       - type select is present with current type selected
       - changing name + clicking "Save changes" calls update()
       - empty name shows validation error, no update
       - save error from repository shows error message

GREEN: Add name input, type select, and "Save changes" button to page
```

### Phase 5 — Remove aliment (US3)

```
RED:   Write integration tests:
       - each item has a remove button
       - clicking remove (with only 1 item) shows error, no update
       - clicking remove on an item removes it from the list, calls update()

GREEN: Add remove button to MenuItemRow; connect to useMenuDetail.removeItem
```

### Phase 6 — Add aliment (US4)

```
RED:   Write integration tests:
       - AutocompleteSearch is present on the page
       - selecting aliment + entering weight adds item to list, calls update()

GREEN: Add AutocompleteSearch + WeightInputDialog; connect to useMenuDetail.addItem
```

## Verification

```bash
npm test -- menu-detail --run   # all Feature 006 tests
npm test -- --run               # full suite (no new regressions)
```

## Manual Verification

1. Go to `/` — click on a menu card → navigates to `/menu/[id]`
2. Verify name, type, date, items list, totals are shown
3. Edit name → "Save changes" → name updates
4. Remove an item → list updates, totals recalculate
5. Add an aliment via search → item appears, totals recalculate
6. Click "← My Menus" → back to home
