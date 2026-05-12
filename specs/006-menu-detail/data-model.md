# Data Model: Menu Detail

**Feature**: 006-menu-detail

## Existing Domain Entities (no changes)

### `Menu` (from `specs/004-menu-builder/contracts/types.ts`)
```typescript
interface Menu {
  id: string;
  name: string;          // 1-200 chars
  type: RationsType;     // runtime: MenuType string
  items: MenuItem[];     // min 1
  totalWeight: number;   // sum of item.weightGrams
  totalRations: number;  // sum of item.rations
  createdAt: Date;
  updatedAt?: Date;
}
```

### `MenuItem` (from `specs/004-menu-builder/contracts/types.ts`)
```typescript
interface MenuItem {
  id: string;
  aliment: AlimentInfo | CustomAliment;
  weightGrams: number;   // 1–10000
  rations: number;       // weightGrams / aliment.gramsToCarbohydrate
}
```

## View Concepts (no new domain entities)

### `MenuDetailState` (hook-managed, not persisted)
```typescript
interface MenuDetailState {
  menu: Menu | null;          // loaded from repository
  isLoading: boolean;
  error: string | null;
  editName: string;           // controlled input value
  editType: MenuType | null;  // controlled select value
  isSaving: boolean;          // true while update() in flight
  saveError: string | null;
}
```

## Repository Operations Used
| Operation | Method | When |
|-----------|--------|------|
| Load menu | `getById(id)` | On page mount |
| Save name/type | `update(menu)` | On "Save changes" click |
| Remove item | `update(menu)` | Immediately after removal |
| Add item | `update(menu)` | Immediately after WeightInputDialog confirms |

## Recalculation Formula
```typescript
// After adding/removing items:
const newTotalWeight = items.reduce((sum, item) => sum + item.weightGrams, 0);
const newTotalRations = items.reduce((sum, item) => sum + item.rations, 0);
const updatedMenu = { ...menu, items, totalWeight: newTotalWeight, totalRations: newTotalRations, updatedAt: new Date() };
```
