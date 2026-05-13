# Research: Menu Detail

**Feature**: 006-menu-detail
**Date**: 2026-05-12

## Decision Log

### R-001: Routing — Dynamic route `/menu/[id]`

**Decision**: Use Next.js App Router dynamic segment `app/menu/[id]/page.tsx`
**Rationale**: Standard Next.js pattern; `params.id` is passed as a prop by the framework
**Alternative considered**: Query param `/?menuId=x` — rejected, URLs are not shareable and bookmarkable
**Status**: RESOLVED ✅

### R-002: Data loading — `useEffect` + `repository.getById()`

**Decision**: Client component (`'use client'`) with `useEffect` calling `repository.getById(id)` on mount
**Rationale**: Consistent with how `useMenuList` works; localStorage is browser-only, cannot use server components
**Status**: RESOLVED ✅

### R-003: Edit mode — Always editable (no toggle)

**Decision**: Name input and type select are always visible and editable; user clicks "Save changes" to persist
**Rationale**: Simpler UX for a single-user app; avoids an extra "Edit" toggle button
**Alternative considered**: Edit/View mode toggle — adds unnecessary complexity for this scope
**Status**: RESOLVED ✅

### R-004: Save strategy — Explicit "Save changes" button

**Decision**: Name + type changes require explicit "Save changes" button click. Adding/removing aliments saves automatically.
**Rationale**: Name/type are intentional edits needing confirmation; item changes are immediate actions
**Status**: RESOLVED ✅

### R-005: Aliment addition — Reuse `AutocompleteSearch` + `WeightInputDialog`

**Decision**: Import and reuse existing components from `app/components/menu-builder/`
**Rationale**: DRY principle; components are already tested and working
**Status**: RESOLVED ✅

### R-006: Menu update — reconstruct Menu domain object vs. plain object

**Decision**: `repository.update()` accepts the `Menu` interface (plain object), NOT the `Menu` class.
**Rationale**: `LocalStorageMenuRepository.update()` takes `Menu` from `specs/004-menu-builder/contracts/types.ts`, which is a plain interface.
The update function in LocalStorageMenuRepository replaces the stored object. We must preserve `id`, `createdAt` and update `updatedAt`.
**Status**: RESOLVED ✅

### R-007: Back navigation — Link to `/`

**Decision**: Show a `<Link href="/">← My Menus</Link>` in the page header
**Rationale**: Simple and explicit; no need for router.back() which could go to unexpected pages
**Status**: RESOLVED ✅

### R-008: MenuCard clickable — wrap with Next.js `<Link>`

**Decision**: Wrap `MenuCard` content in a `<Link href={/menu/${menu.id}}>` inside the card
**Rationale**: The delete button must NOT be inside the link to avoid nested interactive elements; the card title/stats area becomes the clickable zone
**Implementation note**: MenuCard needs `onDelete` prop AND href for the detail link. The card gets a wrapping link on the non-delete area, OR the whole card is wrapped and the delete button uses `e.stopPropagation()`.
**Status**: RESOLVED ✅

### R-009: `useMenuDetail` hook

**Decision**: Create a dedicated `src/application/hooks/useMenuDetail.ts` hook
**Responsibilities**: load menu by id, manage editName/editType state, save name+type, remove item, add item
**Rationale**: Follows the same pattern as `useMenuList` and `useMenuBuilder`; keeps page component thin
**Status**: RESOLVED ✅

### R-010: Recalculation after item changes

**Decision**: When adding/removing items, compute new `totalWeight` and `totalRations` client-side, then call `repository.update()` with the full updated menu object (including new totals and `updatedAt: new Date()`)
**Rationale**: Repository stores the plain object; we are responsible for keeping totals consistent
**Status**: RESOLVED ✅
