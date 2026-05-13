# Contracts: Menu List - Home Page

**Feature**: 005-menu-list  
**Date**: 2026-05-12

## Files

| File              | Purpose                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `types.ts`        | View-layer types: `MenuFilter`, `MenuCardProps`, `MenuListFiltersProps`, `MENU_TYPE_LABELS`, `MENU_TYPE_ORDER` |
| `MenuListHook.ts` | TypeScript interface for the `useMenuList` hook: `UseMenuListResult` + `UseMenuList`                           |

## Dependency Graph

```
Domain (Feature 004)
  └── Menu, MenuType, MenuItem
        │
        ▼
Application Hook (Feature 005 - NEW)
  └── useMenuList: UseMenuListResult
        │
        ├── reads:  MenuRepository (via useMenuRepository context hook)
        ├── state:  menus, isLoading, error
        ├── derived: filteredMenus, hasMenus
        ├── filter: nameFilter, typeFilter
        └── action: deleteMenu, setNameFilter, setTypeFilter
              │
              ▼
UI Components (Feature 005 - NEW)
  ├── app/page.tsx       — orchestrator (uses useMenuList)
  ├── MenuCard.tsx       — receives: menu, onDelete
  └── MenuListFilters.tsx — receives: nameFilter, onNameFilterChange, typeFilter, onTypeFilterChange

Existing (unchanged)
  └── EmptyState.tsx    — no changes needed
```

## Key Decisions

1. **No new domain entities** — `Menu` and `MenuType` from Feature 004 are sufficient
2. **Filter logic in hook** — `filteredMenus` is a `useMemo` inside `useMenuList`, keeping components pure
3. **Delete confirmation** — `window.confirm()` in `deleteMenu()` action; no custom modal needed
4. **Sorting** — client-side `sort()` by `createdAt` desc applied to raw `getAll()` result
5. **Type labels** — `MENU_TYPE_LABELS` record defined once in `types.ts`, imported by both components

## Interface Quick Reference

```typescript
// useMenuList() returns:
{
  menus: Menu[];             // all, sorted
  filteredMenus: Menu[];     // after nameFilter + typeFilter
  isLoading: boolean;
  error: string | null;
  hasMenus: boolean;         // menus.length > 0
  nameFilter: string;
  typeFilter: MenuType | null;
  setNameFilter(value: string): void;
  setTypeFilter(type: MenuType | null): void;
  deleteMenu(id: string): Promise<void>;
}

// MenuCard props:
{ menu: Menu; onDelete: (id: string) => void }

// MenuListFilters props:
{
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  typeFilter: MenuType | null;
  onTypeFilterChange: (type: MenuType | null) => void;
}
```
