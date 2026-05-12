# Menu Builder Quick Start Guide

**Feature ID**: 004-menu-builder  
**Date**: 2026-02-12

## Overview

This guide helps developers understand and work with the Menu Builder feature, which redesigns the ration creation flow with autocomplete search and automatic calculations.

## Prerequisites

- Feature 003 (Aliment Catalog) must be implemented
- Design Tokens system configured
- Vitest + Playwright test environment set up

## Core Concepts

### MenuItem

A single aliment with weight and calculated rations:

```typescript
const menuItem: MenuItem = {
  id: crypto.randomUUID(),
  aliment: {
    name: "manzana",
    type: "frutas",
    gramsToCarbohydrate: 110,
    bloodGlucoseIndex: 38,
  },
  weightGrams: 150,
  rations: 150 / 110, // = 1.36
};
```

### Menu

A collection of MenuItems with totals:

```typescript
const menu: Menu = {
  id: crypto.randomUUID(),
  name: "Afternoon Snack",
  type: "frutas",
  items: [menuItem1, menuItem2],
  totalWeight: 300,      // sum of item weights
  totalRations: 2.86,    // sum of item rations
  createdAt: new Date(),
};
```

### Rations Calculation

```typescript
const rations = weightGrams / gramsToCarbohydrate;
```

**Example**: 150g manzana ÷ 110g per ration = 1.36 rations

## Project Structure

```
/app
  /create-ration
    page.tsx                    # Main menu builder page
  /components
    AutocompleteSearch.tsx      # Aliment search with full data display
    WeightInputDialog.tsx       # Modal for weight entry
    MenuItemsList.tsx           # List of selected aliments
    MenuItemCard.tsx            # Individual item card (full aliment data)
    MenuSummary.tsx             # Total weight + rations
    SaveMenuForm.tsx            # Name + type + save

/src/domain/models
  MenuItem.ts                   # MenuItem entity
  Menu.ts                       # Menu entity

/src/domain/repositories
  MenuRepository.ts             # Repository interface

/src/infrastructure/repositories
  LocalStorageMenuRepository.ts # localStorage implementation

/src/application/hooks
  useMenuBuilder.ts             # Menu state management

/src/application/contexts
  MenuRepositoryContext.tsx     # DI for repository

/tests
  /unit/menu-builder
    MenuItem.test.ts
    Menu.test.ts
    useMenuBuilder.test.ts
  /integration/menu-builder
    LocalStorageMenuRepository.test.ts
    AutocompleteSearch.test.ts
  /e2e
    menu-builder.spec.ts
```

## Quick Start: Running the Feature

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Navigate to: `http://localhost:3000/create-ration`

### 3. Run Tests

**Unit + Integration**:
```bash
npm test
```

**E2E**:
```bash
npm run test:e2e
```

**Coverage**:
```bash
npm run test:coverage
```

## Development Workflow

### Creating a New Menu (User Flow)

1. **Search for aliment**: Type in autocomplete input
2. **View suggestions**: See all aliment data (name, category, grams, GI, custom badge)
3. **Select aliment**: Click or press Enter
4. **Enter weight**: Modal opens, type weight in grams
5. **Add to menu**: Item appears with calculated rations
6. **Repeat**: Add more aliments
7. **Review totals**: See total weight and rations
8. **Save menu**: Enter name and type, click Save
9. **Navigate home**: See new menu card

### TDD Development Workflow

For each component/model:

1. **RED**: Write failing test
   ```typescript
   it('should calculate rations correctly', () => {
     const item = new MenuItem(aliment, 150);
     expect(item.rations).toBe(1.36);
   });
   ```

2. **GREEN**: Implement to pass test
   ```typescript
   class MenuItem {
     constructor(aliment, weightGrams) {
       this.weightGrams = weightGrams;
       this.rations = weightGrams / aliment.gramsToCarbohydrate;
     }
   }
   ```

3. **REFACTOR**: Improve code quality
   ```typescript
   class MenuItem {
     constructor(aliment, weightGrams) {
       this.validateWeight(weightGrams);
       this.weightGrams = weightGrams;
       this.rations = this.calculateRations(aliment.gramsToCarbohydrate);
     }
   }
   ```

## Key APIs

### useMenuBuilder Hook

```typescript
import { useMenuBuilder } from '@/application/hooks/useMenuBuilder';

function CreateRationPage() {
  const {
    items,           // Current menu items
    totalWeight,     // Sum of weights
    totalRations,    // Sum of rations
    addItem,         // (aliment, weight) => void
    removeItem,      // (id) => void
    updateItemWeight, // (id, weight) => void
    clearItems,      // () => void
    saveMenu,        // (name, type) => Promise<void>
  } = useMenuBuilder();

  // Example: Add item
  const handleSelectAliment = (aliment: AlimentInfo) => {
    const weight = prompt('Enter weight in grams:');
    addItem(aliment, Number(weight));
  };

  return (/* JSX */);
}
```

### MenuRepository Interface

```typescript
interface MenuRepository {
  getAll(): Promise<Menu[]>;
  getById(id: string): Promise<Menu | null>;
  save(menu: Menu): Promise<Menu>;
  delete(id: string): Promise<void>;
}
```

### Using the Repository

```typescript
import { useMenuRepository } from '@/application/contexts/MenuRepositoryContext';

function MyComponent() {
  const repository = useMenuRepository();

  const saveMenu = async (menu: Menu) => {
    try {
      const saved = await repository.save(menu);
      console.log('Saved:', saved);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };
}
```

## Common Tasks

### Add New Validation Rule

**File**: `src/domain/models/MenuItem.ts`

```typescript
export class MenuItem {
  validate(): string[] {
    const errors: string[] = [];
    
    // Add new rule
    if (this.weightGrams > 10000) {
      errors.push('Weight cannot exceed 10kg');
    }
    
    return errors;
  }
}
```

**Test**: `tests/unit/menu-builder/MenuItem.test.ts`

```typescript
it('should reject weight > 10kg', () => {
  expect(() => {
    new MenuItem(aliment, 15000);
  }).toThrow('Weight cannot exceed 10kg');
});
```

### Change Rations Precision

**File**: `src/domain/models/MenuItem.ts`

```typescript
export class MenuItem {
  get rations(): number {
    const raw = this.weightGrams / this.aliment.gramsToCarbohydrate;
    return Number(raw.toFixed(3)); // Change from 2 to 3 decimals
  }
}
```

### Add localStorage Error Handling

**File**: `src/infrastructure/repositories/LocalStorageMenuRepository.ts`

```typescript
async save(menu: Menu): Promise<Menu> {
  try {
    const menus = await this.getAll();
    menus.push(menu);
    localStorage.setItem(this.key, JSON.stringify(menus));
    return menu;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage full. Please delete old menus.');
    }
    throw error;
  }
}
```

## Testing Patterns

### Unit Test: Domain Model

```typescript
import { describe, it, expect } from 'vitest';
import { MenuItem } from '@/domain/models/MenuItem';

describe('MenuItem', () => {
  const aliment = {
    name: 'manzana',
    type: 'frutas',
    gramsToCarbohydrate: 110,
    bloodGlucoseIndex: 38,
  };

  it('should calculate rations correctly', () => {
    const item = new MenuItem(aliment, 150);
    expect(item.rations).toBe(1.36);
  });

  it('should reject zero weight', () => {
    expect(() => new MenuItem(aliment, 0)).toThrow();
  });
});
```

### Integration Test: Repository

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageMenuRepository } from '@/infrastructure/repositories/LocalStorageMenuRepository';

describe('LocalStorageMenuRepository', () => {
  let repository: LocalStorageMenuRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageMenuRepository();
  });

  it('should save and retrieve menu', async () => {
    const menu = createTestMenu();
    await repository.save(menu);
    
    const retrieved = await repository.getById(menu.id);
    expect(retrieved).toEqual(menu);
  });
});
```

### E2E Test: Full Flow

```typescript
import { test, expect } from '@playwright/test';

test('should create menu with multiple aliments', async ({ page }) => {
  await page.goto('/create-ration');
  
  // Search for aliment
  await page.fill('[data-testid="search-input"]', 'manzana');
  await page.click('[data-testid="suggestion-0"]');
  
  // Enter weight
  await page.fill('[data-testid="weight-input"]', '150');
  await page.click('[data-testid="add-button"]');
  
  // Verify item added
  await expect(page.locator('[data-testid="menu-item-0"]')).toBeVisible();
  await expect(page.locator('[data-testid="item-rations"]')).toHaveText('1.36');
  
  // Save menu
  await page.fill('[data-testid="menu-name"]', 'Test Menu');
  await page.selectOption('[data-testid="menu-type"]', 'frutas');
  await page.click('[data-testid="save-button"]');
  
  // Verify navigation
  await expect(page).toHaveURL('/');
});
```

## Debugging Tips

### Problem: Rations not calculating

**Check**:
1. `gramsToCarbohydrate` is not zero
2. Weight is valid number
3. Calculation in `MenuItem` class

**Debug**:
```typescript
console.log('Weight:', this.weightGrams);
console.log('GramsToCH:', this.aliment.gramsToCarbohydrate);
console.log('Rations:', this.rations);
```

### Problem: localStorage not persisting

**Check**:
1. Browser localStorage enabled
2. Quota not exceeded
3. Correct key used (`sdd-rations-calculator:menus`)

**Debug**:
```typescript
console.log('Storage available:', isLocalStorageAvailable());
console.log('Current data:', localStorage.getItem('sdd-rations-calculator:menus'));
```

### Problem: Autocomplete not filtering

**Check**:
1. `useCompositeAliments` hook working
2. Search term trimmed and lowercased
3. Filter logic correct

**Debug**:
```typescript
console.log('Search term:', searchTerm);
console.log('Aliments:', aliments.length);
console.log('Filtered:', filteredAliments.length);
```

### Problem: Tests failing

**Common Issues**:
1. **Async timing**: Use `waitFor` or `findBy` queries
2. **localStorage not mocked**: Add `beforeEach(() => localStorage.clear())`
3. **React context missing**: Wrap component in provider

**Example Fix**:
```typescript
// Before
const { getByText } = render(<MyComponent />);

// After
const { getByText } = render(
  <MenuRepositoryContext.Provider value={mockRepository}>
    <MyComponent />
  </MenuRepositoryContext.Provider>
);
```

## Performance Optimization

### Debounce Search Input

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const [searchTerm, setSearchTerm] = useState('');
const debouncedTerm = useDebounce(searchTerm, 300);
```

### Memoize Calculations

```typescript
import { useMemo } from 'react';

const totalRations = useMemo(
  () => items.reduce((sum, item) => sum + item.rations, 0),
  [items]
);
```

### Virtual Scrolling (if needed)

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: aliments.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60,
});
```

## Data Flow Diagram

```
┌──────────────┐
│ User Input   │
│ (search)     │
└──────┬───────┘
       │
       ▼
┌─────────────────────┐
│ useCompositeAliments│
│ (Feature 003)       │
└──────┬──────────────┘
       │
       ▼
┌──────────────────┐
│ Filter aliments  │
│ (client-side)    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Show suggestions │
│ (with all data)  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ User selects     │
│ (click/Enter)    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Weight dialog    │
│ opens            │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ User enters weight   │
│ (number input)       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ useMenuBuilder       │
│ addItem()            │
│ - Create MenuItem    │
│ - Calculate rations  │
│ - Add to items[]     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ MenuItemsList        │
│ renders              │
│ (with all data)      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ MenuSummary          │
│ - Total weight       │
│ - Total rations      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ User clicks Save     │
│ (enter name + type)  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────┐
│ useMenuBuilder.saveMenu()│
│ - Create Menu            │
│ - Validate               │
│ - Call repository.save() │
└──────┬───────────────────┘
       │
       ▼
┌────────────────────────────┐
│ LocalStorageMenuRepository │
│ - Serialize to JSON        │
│ - Save to localStorage     │
└──────┬─────────────────────┘
       │
       ▼
┌──────────────────┐
│ Navigate to home │
│ (success)        │
└──────────────────┘
```

## localStorage Schema

**Key**: `sdd-rations-calculator:menus`

**Value**: JSON array of Menu objects

```json
[
  {
    "id": "uuid-1234",
    "name": "Afternoon Snack",
    "type": "frutas",
    "items": [
      {
        "id": "uuid-5678",
        "aliment": {
          "name": "manzana",
          "type": "frutas",
          "gramsToCarbohydrate": 110,
          "bloodGlucoseIndex": 38
        },
        "weightGrams": 150,
        "rations": 1.36
      }
    ],
    "totalWeight": 150,
    "totalRations": 1.36,
    "createdAt": "2026-02-12T10:30:00.000Z"
  }
]
```

## Useful Commands

### Reset localStorage (in browser console)

```javascript
localStorage.removeItem('sdd-rations-calculator:menus');
```

### View all menus (in browser console)

```javascript
JSON.parse(localStorage.getItem('sdd-rations-calculator:menus'));
```

### Clear all app data

```javascript
Object.keys(localStorage)
  .filter(k => k.startsWith('sdd-rations-calculator:'))
  .forEach(k => localStorage.removeItem(k));
```

## Next Steps

1. **Read the spec**: `specs/004-menu-builder/spec.md`
2. **Review data model**: `specs/004-menu-builder/data-model.md`
3. **Check plan**: `specs/004-menu-builder/plan.md`
4. **Follow tasks**: `specs/004-menu-builder/tasks.md`
5. **Run tests**: `npm test`

## Resources

- **Feature 003 Docs**: `specs/003-aliment-catalog/`
- **Design Tokens**: `src/infrastructure/design-tokens/`
- **Test Utils**: `tests/utils/`
- **ARIA Patterns**: https://www.w3.org/WAI/ARIA/apg/

## FAQ

**Q: Why separate Menu from Ration?**  
A: Backward compatibility. Existing rations continue to work while we introduce the new menu builder.

**Q: Why modal for weight input?**  
A: Better UX (clear focus, validation), accessibility, keyboard-friendly.

**Q: Why 2 decimal places for rations?**  
A: Standard precision in nutrition calculations. Balances accuracy and readability.

**Q: Why client-side filtering?**  
A: Dataset small enough (< 500 items). Instant results, works offline, simpler architecture.

**Q: How to display all aliment data in suggestions?**  
A: Two-line layout: Name + custom badge on line 1, category + grams + GI on line 2.

**Q: Can I edit saved menus?**  
A: Not in MVP. Deferred to future release.

**Q: What if localStorage is full?**  
A: Error message prompts user to delete old menus. Future: export/import functionality.

---

**Last Updated**: 2026-02-12  
**Maintainer**: Development Team  
**Status**: Ready for Implementation
