# Implementation Plan: Menu Detail

**Feature**: 006-menu-detail
**Branch**: `006-menu-detail`
**Base**: `main` (Features 001–005 merged)

## Tech Stack

- **Language**: TypeScript 5.x (strict mode)
- **Framework**: React 19 + Next.js 15.1.6 (App Router)
- **Styling**: Tailwind CSS
- **Testing**: Vitest 4 + @testing-library/react + @testing-library/user-event
- **Storage**: Browser localStorage via `LocalStorageMenuRepository`

## Architecture

**Pattern**: Clean Architecture — Page → Hook → Repository → Domain

```
app/menu/[id]/page.tsx          (UI layer — 'use client')
  └── useMenuDetail(id)         (Application layer — hook)
        └── useMenuRepository() (Infrastructure — context)
              └── LocalStorageMenuRepository
```

## File Structure

### New Files

```
src/application/hooks/useMenuDetail.ts
app/menu/[id]/page.tsx
app/components/menu-detail/MenuItemRow.tsx
app/components/menu-detail/MenuDetailSummary.tsx
tests/unit/menu-detail/useMenuDetail.test.tsx
tests/integration/menu-detail/MenuDetailPage.test.tsx
tests/integration/menu-detail/MenuItemRow.test.tsx
tests/unit/menu-detail/MenuBuilder.ts          (reuse pattern from 005)
```

### Modified Files

```
app/components/MenuCard.tsx     (add link to /menu/[id])
```

## Constitution Check

| Check                                           | Status                |
| ----------------------------------------------- | --------------------- |
| No new domain entities — reuses Menu + MenuItem | ✅ PASS               |
| Repository interface unchanged                  | ✅ PASS               |
| `update()` already exists in MenuRepository     | ✅ PASS               |
| Reuses AutocompleteSearch + WeightInputDialog   | ✅ PASS               |
| TDD approach maintained                         | ✅ PASS               |
| 'use client' on all interactive components      | ✅ PASS               |
| MenuCard link doesn't break existing tests      | requires verification |

## Key Implementation Notes

1. **Dynamic route params**: In Next.js 15 App Router, `params` is a Promise in server components but direct in client components. Since this is `'use client'`, `params` arrives as a direct object: `{ id: string }`.

2. **MenuCard modification**: The non-delete area becomes a Next.js `<Link>`. The delete button uses `e.stopPropagation()` to prevent navigation. Existing MenuCard tests must still pass.

3. **`update()` signature**: `LocalStorageMenuRepository.update(menu)` replaces the stored object by `id`. We construct the updated plain object: `{ ...menu, name, type, items, totalWeight, totalRations, updatedAt: new Date() }`.

4. **MenuItem creation when adding**: Compute `rations = weightGrams / aliment.gramsToCarbohydrate`, generate `id = crypto.randomUUID()`.

5. **Test file extension**: Use `.tsx` for all test files (even pure hook tests) to avoid esbuild JSX errors when using provider wrappers.
