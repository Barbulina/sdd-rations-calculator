# Contracts: Menu Detail

**Feature**: 006-menu-detail

## Dependency Graph

```
app/menu/[id]/page.tsx
  └── useMenuDetail (hook)
        └── MenuRepository (getById, update)
        └── edit state (editName, editType)
        └── item state (add, remove + recalculate)

app/menu/[id]/page.tsx
  ├── MenuItemRow (per item: name, weight, rations, remove button)
  ├── MenuDetailSummary (total rations + weight)
  ├── AutocompleteSearch (reused from menu-builder)
  └── WeightInputDialog (reused from menu-builder)

app/components/MenuCard.tsx (MODIFIED)
  └── Wraps clickable area in <Link href="/menu/[id]">
```

## New Files

| File                                               | Purpose                                           |
| -------------------------------------------------- | ------------------------------------------------- |
| `src/application/hooks/useMenuDetail.ts`           | Core hook: load, edit name/type, add/remove items |
| `app/menu/[id]/page.tsx`                           | Detail page — renders all sub-components          |
| `app/components/menu-detail/MenuItemRow.tsx`       | Single aliment row with remove button             |
| `app/components/menu-detail/MenuDetailSummary.tsx` | Totals display                                    |

## Modified Files

| File                          | Change                                  |
| ----------------------------- | --------------------------------------- |
| `app/components/MenuCard.tsx` | Add clickable link area to `/menu/[id]` |

## Key Decisions (see research.md)

- R-001: Dynamic route `/menu/[id]` (Next.js App Router)
- R-003: Always-editable name/type fields
- R-004: Explicit save for name/type; auto-save for item changes
- R-005: Reuse `AutocompleteSearch` + `WeightInputDialog`
- R-009: `useMenuDetail` hook owns all state
- R-010: Client-side recalculation of totals after item changes
