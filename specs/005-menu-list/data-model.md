# Data Model: Menu List - Home Page

**Feature**: 005-menu-list  
**Date**: 2026-05-12  
**Status**: Complete

## Overview

Feature 005 is entirely read/delete — it does not introduce new domain entities. The domain model is inherited from Feature 004. This document describes how existing entities are composed and extended at the application and view layers.

---

## Existing Domain Entities (from Feature 004)

### Menu

The core entity. Stored in localStorage, loaded and displayed on the home page.

| Field          | Type                | Description                                 |
| -------------- | ------------------- | ------------------------------------------- |
| `id`           | `string` (UUID)     | Unique identifier                           |
| `name`         | `string`            | Menu name (1–200 chars, trimmed)            |
| `type`         | `MenuType`          | Meal type (BREAKFAST, LUNCH, DINNER, SNACK) |
| `items`        | `MenuItem[]`        | Aliment items with weight and rations       |
| `totalWeight`  | `number`            | Sum of all item weights in grams            |
| `totalRations` | `number`            | Sum of all item ration counts               |
| `createdAt`    | `Date`              | Creation timestamp                          |
| `updatedAt`    | `Date \| undefined` | Last update timestamp (optional)            |

**Source**: `src/domain/models/Menu.ts`

### MenuType

Enum used for the type filter selector.

```
BREAKFAST | LUNCH | DINNER | SNACK
```

**Source**: `src/domain/models/MenuType.ts`

### MenuItem

Not displayed directly on the list cards. Used only for total calculations already computed in `Menu.totalWeight` and `Menu.totalRations`.

---

## View-Layer Concepts (Feature 005 additions)

### MenuFilter (application layer state)

Not a domain entity — pure client-side filter state managed inside `useMenuList`.

| Field        | Type               | Default | Description                                             |
| ------------ | ------------------ | ------- | ------------------------------------------------------- |
| `nameFilter` | `string`           | `""`    | Partial case-insensitive match against `menu.name`      |
| `typeFilter` | `MenuType \| null` | `null`  | Exact match against `menu.type`; null means "All types" |

**Filter logic** (AND): A menu appears in the filtered list if and only if:

- `nameFilter === ""` OR `menu.name.toLowerCase().includes(nameFilter.toLowerCase())`
- `typeFilter === null` OR `menu.type === typeFilter`

### MenuCardDisplayData (derived view data)

What each `MenuCard` component receives as props. Derived from `Menu` in the hook; no transformation object is needed — props are passed directly.

| Displayed Field | Derived From                       | Format                                                                             |
| --------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| Name            | `menu.name`                        | As-is                                                                              |
| Type label      | `menu.type` via `MENU_TYPE_LABELS` | "Breakfast", "Lunch", "Dinner", "Snack"                                            |
| Creation date   | `menu.createdAt`                   | `toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })` |
| Total rations   | `menu.totalRations`                | Fixed 2 decimal places (`.toFixed(2)`)                                             |
| Total weight    | `menu.totalWeight`                 | Integer grams (`Math.round()`)                                                     |

---

## Application Layer: useMenuList Hook

The new hook `useMenuList` encapsulates all list state. It is the only place where `MenuRepository` is accessed.

### State

| State        | Type               | Description                                           |
| ------------ | ------------------ | ----------------------------------------------------- |
| `menus`      | `Menu[]`           | All menus from repository, sorted by `createdAt` desc |
| `isLoading`  | `boolean`          | True while `getAll()` is in-flight                    |
| `error`      | `string \| null`   | Error message if `getAll()` or `delete()` fails       |
| `nameFilter` | `string`           | Current name search text                              |
| `typeFilter` | `MenuType \| null` | Current type selection; null = All                    |

### Derived State

| Derived         | Type      | Description                                                         |
| --------------- | --------- | ------------------------------------------------------------------- |
| `filteredMenus` | `Menu[]`  | Result of applying nameFilter + typeFilter to `menus`               |
| `hasMenus`      | `boolean` | `menus.length > 0` (used for empty state vs no-results distinction) |

### Actions

| Action          | Signature                          | Description                                                                       |
| --------------- | ---------------------------------- | --------------------------------------------------------------------------------- |
| `deleteMenu`    | `(id: string) => Promise<void>`    | Shows `window.confirm()`, calls `repository.delete(id)`, removes from local state |
| `setNameFilter` | `(name: string) => void`           | Updates nameFilter                                                                |
| `setTypeFilter` | `(type: MenuType \| null) => void` | Updates typeFilter                                                                |

---

## State Transitions

```
INITIAL
  └─► isLoading=true
        └─► getAll() resolves
              ├─► menus=[], isLoading=false → EmptyState shown
              └─► menus=[...], isLoading=false → MenuCard list shown
                    └─► User applies filter
                          ├─► filteredMenus has results → filtered cards shown
                          └─► filteredMenus empty → NoResults message shown
                                └─► User clears filter → all menus shown again
                    └─► User clicks delete → confirm
                          ├─► confirmed → repository.delete() → menu removed from state
                          └─► cancelled → no change
```

---

## No new domain entities

All domain-level data structures (`Menu`, `MenuType`, `MenuItem`) are fully defined in Feature 004. Feature 005 adds no new persistence, no new validation rules, and no new domain logic.
