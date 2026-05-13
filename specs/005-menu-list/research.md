# Research: Menu List - Home Page

**Feature**: 005-menu-list  
**Date**: 2026-05-12  
**Status**: Complete — all unknowns resolved

## Summary

Feature 005 is a UI-layer feature built entirely on top of Feature 004's infrastructure. No new domain entities, repository methods, or storage mechanisms are needed. All research questions were resolved by examining the existing codebase.

---

## R-001: Should the home page replace or extend the rations list?

**Question**: The current `app/page.tsx` shows a rations list. Should Feature 005 replace it or coexist with it?

**Decision**: Replace the home page content entirely. The home page becomes the Menu List.

**Rationale**:

- The spec says explicitly "en la página principal" (on the main page)
- Feature 004 already updated `EmptyState` and the "+ Create" button to point to `/menu-builder`
- The app's primary entity is now a `Menu` (not a `Ration`). The rations list was a scaffolded placeholder from Feature 002
- Keeping both lists on the same page would be confusing and outside the spec scope

**Alternatives considered**:

- Add a separate `/menus` page and keep the home page as-is — rejected because the spec explicitly targets the home page
- Show both rations and menus — rejected as out of scope

---

## R-002: Does MenuRepository.getAll() return menus in a defined order?

**Question**: Can we rely on `getAll()` to return menus sorted by creation date descending?

**Decision**: No. Client-side sort by `createdAt` descending is applied in `useMenuList`.

**Rationale**:

- `LocalStorageMenuRepository.getAll()` returns menus in insertion order (the raw array from localStorage)
- No sort guarantee is documented in the `MenuRepository` interface
- Sorting in the hook keeps the sorting concern at the UI layer, which is appropriate; the repository stays simple

**Implementation**: `menus.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())`

---

## R-003: How should delete confirmation be handled?

**Question**: The spec requires a confirmation step before deletion. What mechanism to use?

**Decision**: `window.confirm()` — native browser confirmation dialog.

**Rationale**:

- The spec assumption explicitly states "a simple inline confirm interaction (not a full modal) to keep scope minimal"
- `window.confirm()` is zero-cost to implement, natively accessible, and well understood by users
- Feature 004 established no `ConfirmDialog` component; building one now would be out of scope

**Alternatives considered**:

- Inline toggle "click to confirm" — more complex, requires extra state per card
- Custom modal — out of scope for this feature, adds component complexity
- No confirmation — rejected because FR-004 mandates it

---

## R-004: How should client-side filtering work?

**Question**: Should filtering be done in the hook or in the component?

**Decision**: Filtering is done in `useMenuList` as derived state (computed from raw menus + filter state).

**Rationale**:

- Keeps components pure/presentational (they receive filtered data, not filter logic)
- Matches the pattern established by `useMenuBuilder` in Feature 004
- Enables straightforward unit testing of filter logic in isolation

**Implementation pattern**:

```typescript
// In useMenuList:
const filteredMenus = useMemo(() => {
  return menus
    .filter(
      (m) =>
        nameFilter === "" ||
        m.name.toLowerCase().includes(nameFilter.toLowerCase()),
    )
    .filter((m) => typeFilter === null || m.type === typeFilter);
}, [menus, nameFilter, typeFilter]);
```

---

## R-005: Does MenuRepository have a delete method?

**Question**: Is there an existing `delete(id)` method on the `MenuRepository` interface?

**Decision**: Yes — `delete(id: string): Promise<void>` exists.

**Rationale**: Confirmed by examining `src/domain/repositories/MenuRepository.ts`. `LocalStorageMenuRepository` implements it fully.

---

## R-006: Can we reuse MenuBuilder from Feature 004 in tests?

**Question**: Do test builders already exist for Menu entities?

**Decision**: Yes — `MenuBuilder` and `MenuItemBuilder` exist in `tests/unit/menu-builder/`.

**Rationale**: Confirmed by examining the file tree. Both builders are available and will be imported directly in Feature 005 tests. No new builders needed.

---

## R-007: How to display MenuType as human-readable labels?

**Question**: `MenuType` enum values are `BREAKFAST`, `LUNCH`, etc. What label mapping to use?

**Decision**: Simple constant map defined once in `useMenuList` or a shared utility.

**Rationale**: The spec uses English labels (Breakfast, Lunch, Dinner, Snack). A direct lookup map is the simplest approach.

```typescript
export const MENU_TYPE_LABELS: Record<MenuType, string> = {
  [MenuType.BREAKFAST]: "Breakfast",
  [MenuType.LUNCH]: "Lunch",
  [MenuType.DINNER]: "Dinner",
  [MenuType.SNACK]: "Snack",
};
```

This will be defined in the contracts and referenced by both `MenuCard` and `MenuListFilters`.

---

## R-008: How to format the creation date?

**Question**: What format should `createdAt` be displayed in?

**Decision**: Use `toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })`.

**Rationale**:

- Human-readable (e.g., "May 12, 2026")
- No additional date library needed
- Matches the locale of the app (English labels throughout)

---

## R-009: Does the existing EmptyState component need updating?

**Question**: Does `EmptyState` need to be modified for Feature 005?

**Decision**: No changes needed.

**Rationale**: Feature 004 already updated `EmptyState` to show "No menus yet", link to `/menu-builder`, and include a "Create First Menu" CTA. The component is already correct for Feature 005's empty state scenario.

---

## All NEEDS CLARIFICATION items resolved

| Item                                 | Status                                                    |
| ------------------------------------ | --------------------------------------------------------- |
| Home page: replace or extend?        | ✅ Replace                                                |
| Repository sort order                | ✅ Sort client-side in hook                               |
| Delete confirmation mechanism        | ✅ `window.confirm()`                                     |
| Filter placement (hook vs component) | ✅ Hook, as derived `useMemo` state                       |
| Delete method availability           | ✅ Exists: `delete(id: string): Promise<void>`            |
| Test builders availability           | ✅ MenuBuilder + MenuItemBuilder from Feature 004         |
| MenuType display labels              | ✅ Simple record map `MENU_TYPE_LABELS`                   |
| Date format                          | ✅ `toLocaleDateString('en-US', { month: 'short', ... })` |
| EmptyState component                 | ✅ No changes needed                                      |
