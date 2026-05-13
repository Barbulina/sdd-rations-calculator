# Quickstart: Menu List - Home Page

**Feature**: 005-menu-list  
**Branch**: `005-menu-list`  
**Date**: 2026-05-12

## What gets built

| Deliverable                         | Path                                                   | Change                                       |
| ----------------------------------- | ------------------------------------------------------ | -------------------------------------------- |
| `useMenuList` hook                  | `src/application/hooks/useMenuList.ts`                 | NEW                                          |
| `MenuCard` component                | `app/components/MenuCard.tsx`                          | NEW                                          |
| `MenuListFilters` component         | `app/components/MenuListFilters.tsx`                   | NEW                                          |
| Home page                           | `app/page.tsx`                                         | REPLACE (remove rations list, add menu list) |
| `useMenuList` unit tests            | `tests/unit/menu-list/useMenuList.test.ts`             | NEW                                          |
| `MenuCard` integration tests        | `tests/integration/menu-list/MenuCard.test.tsx`        | NEW                                          |
| `MenuListFilters` integration tests | `tests/integration/menu-list/MenuListFilters.test.tsx` | NEW                                          |

**Nothing changes in the domain or infrastructure layer.**

---

## Implementation order (TDD — Red-Green-Refactor)

### Step 1 — useMenuList hook (unit tests first)

**Write the test file** `tests/unit/menu-list/useMenuList.test.ts`:

```typescript
import { renderHook, act } from "@testing-library/react";
import { useMenuList } from "@/src/application/hooks/useMenuList";
import { MenuBuilder } from "../menu-builder/MenuBuilder";
import { MenuType } from "@/src/domain/models/MenuType";

// Mock MenuRepository
const mockRepository = {
  getAll: vi.fn(),
  delete: vi.fn(),
};

// Wrap hook with MenuRepositoryContext
const wrapper = ({ children }) => (
  <MenuRepositoryProvider repository={mockRepository}>
    {children}
  </MenuRepositoryProvider>
);

describe("useMenuList", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads menus sorted by createdAt descending on mount", async () => { ... });
  it("shows loading state while fetching", async () => { ... });
  it("sets error when getAll fails", async () => { ... });
  it("hasMenus is false when repository is empty", async () => { ... });
  it("hasMenus is true when menus exist", async () => { ... });
  it("filters by name (case-insensitive, partial match)", async () => { ... });
  it("filters by type", async () => { ... });
  it("applies name AND type filters together", async () => { ... });
  it("filteredMenus is empty when no match", async () => { ... });
  it("deleteMenu calls window.confirm and repository.delete on confirm", async () => { ... });
  it("deleteMenu does NOT call repository.delete when user cancels confirm", async () => { ... });
  it("deleteMenu removes menu from local state after successful deletion", async () => { ... });
  it("deleteMenu sets error when deletion fails", async () => { ... });
  it("setNameFilter updates nameFilter state", async () => { ... });
  it("setTypeFilter updates typeFilter state", async () => { ... });
  it("setTypeFilter to null shows all types", async () => { ... });
});
```

**Implement** `src/application/hooks/useMenuList.ts`:

```typescript
"use client";

import { useState, useEffect, useMemo } from "react";
import { useMenuRepository } from "@/src/application/contexts/MenuRepositoryContext";
import type { Menu } from "@/specs/004-menu-builder/contracts/types";
import { MenuType } from "@/src/domain/models/MenuType";

export function useMenuList() {
  const repository = useMenuRepository();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<MenuType | null>(null);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const all = await repository.getAll();
      const sorted = [...all].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setMenus(sorted);
    } catch {
      setError("Failed to load menus. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMenus = useMemo(() => {
    return menus
      .filter(
        (m) =>
          nameFilter === "" ||
          m.name.toLowerCase().includes(nameFilter.toLowerCase()),
      )
      .filter((m) => typeFilter === null || m.type === typeFilter);
  }, [menus, nameFilter, typeFilter]);

  const deleteMenu = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu? This action cannot be undone.",
    );
    if (!confirmed) return;
    try {
      await repository.delete(id);
      setMenus((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setError("Failed to delete menu. Please try again.");
    }
  };

  return {
    menus,
    filteredMenus,
    isLoading,
    error,
    hasMenus: menus.length > 0,
    nameFilter,
    typeFilter,
    setNameFilter,
    setTypeFilter,
    deleteMenu,
  };
}
```

---

### Step 2 — MenuCard component (integration tests first)

**Write the test file** `tests/integration/menu-list/MenuCard.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuCard } from "@/app/components/MenuCard";
import { MenuBuilder } from "../../unit/menu-builder/MenuBuilder";
import { MenuType } from "@/src/domain/models/MenuType";

describe("MenuCard", () => {
  it("displays the menu name", () => { ... });
  it("displays the meal type as human-readable label", () => { ... });
  it("displays the creation date in a readable format", () => { ... });
  it("displays total rations with 2 decimal places", () => { ... });
  it("displays total weight in grams", () => { ... });
  it("calls onDelete with menu id when delete button clicked", async () => { ... });
  it("renders for all four MenuTypes", () => { ... });
});
```

**Implement** `app/components/MenuCard.tsx`:

```tsx
"use client";

import { MENU_TYPE_LABELS } from "@/specs/005-menu-list/contracts/types";
import type { MenuCardProps } from "@/specs/005-menu-list/contracts/types";

export function MenuCard({ menu, onDelete }: MenuCardProps) {
  const formattedDate = new Date(menu.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="...">
      <div>
        <h2>{menu.name}</h2>
        <span>{MENU_TYPE_LABELS[menu.type]}</span>
        <span>{formattedDate}</span>
      </div>
      <div>
        <span>{menu.totalRations.toFixed(2)} rations</span>
        <span>{Math.round(menu.totalWeight)}g</span>
      </div>
      <button onClick={() => onDelete(menu.id)}>Delete</button>
    </div>
  );
}
```

---

### Step 3 — MenuListFilters component (integration tests first)

**Write the test file** `tests/integration/menu-list/MenuListFilters.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuListFilters } from "@/app/components/MenuListFilters";
import { MenuType } from "@/src/domain/models/MenuType";

describe("MenuListFilters", () => {
  it("renders a name search input", () => { ... });
  it("calls onNameFilterChange when user types", async () => { ... });
  it("renders a type filter dropdown with all options", () => { ... });
  it("dropdown includes 'All types' option", () => { ... });
  it("calls onTypeFilterChange with MenuType when type selected", async () => { ... });
  it("calls onTypeFilterChange with null when 'All types' selected", async () => { ... });
  it("reflects current nameFilter value in the input", () => { ... });
  it("reflects current typeFilter selection in the dropdown", () => { ... });
});
```

**Implement** `app/components/MenuListFilters.tsx`:

```tsx
"use client";

import {
  MENU_TYPE_LABELS,
  MENU_TYPE_ORDER,
} from "@/specs/005-menu-list/contracts/types";
import type { MenuListFiltersProps } from "@/specs/005-menu-list/contracts/types";
import { MenuType } from "@/src/domain/models/MenuType";

export function MenuListFilters({
  nameFilter,
  onNameFilterChange,
  typeFilter,
  onTypeFilterChange,
}: MenuListFiltersProps) {
  return (
    <div className="...">
      <input
        type="text"
        placeholder="Search by name..."
        value={nameFilter}
        onChange={(e) => onNameFilterChange(e.target.value)}
        maxLength={200}
      />
      <select
        value={typeFilter ?? ""}
        onChange={(e) =>
          onTypeFilterChange(
            e.target.value === "" ? null : (e.target.value as MenuType),
          )
        }
      >
        <option value="">All types</option>
        {MENU_TYPE_ORDER.map((type) => (
          <option key={type} value={type}>
            {MENU_TYPE_LABELS[type]}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

### Step 4 — Replace app/page.tsx

Replace the current rations-based home page with the menu list:

```tsx
"use client";

import { useMenuList } from "@/src/application/hooks/useMenuList";
import { MenuCard } from "./components/MenuCard";
import { MenuListFilters } from "./components/MenuListFilters";
import { EmptyState } from "./components/EmptyState";
import Link from "next/link";

export default function HomePage() {
  const {
    filteredMenus,
    isLoading,
    error,
    hasMenus,
    nameFilter,
    setNameFilter,
    typeFilter,
    setTypeFilter,
    deleteMenu,
  } = useMenuList();

  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Menus</h1>
          <Link href="/menu-builder" className="...">
            + Create
          </Link>
        </div>

        {/* Loading */}
        {isLoading && <p>Loading menus...</p>}

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Empty state (no menus in repository) */}
        {!isLoading && !hasMenus && <EmptyState />}

        {/* List (menus exist) */}
        {!isLoading && hasMenus && (
          <>
            <MenuListFilters
              nameFilter={nameFilter}
              onNameFilterChange={setNameFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
            />

            {/* No results after filtering */}
            {filteredMenus.length === 0 && (
              <p>
                No menus match your filters. Try clearing the search or type
                selector.
              </p>
            )}

            {/* Menu cards */}
            {filteredMenus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} onDelete={deleteMenu} />
            ))}
          </>
        )}
      </div>
    </main>
  );
}
```

---

## Running tests

```bash
# All feature 005 tests
npm test -- menu-list --run

# Individual suites
npm test -- useMenuList --run
npm test -- MenuCard --run
npm test -- MenuListFilters --run

# Full suite
npm test --run
```

## Key constraints (from research)

| Topic               | Decision                                                                           |
| ------------------- | ---------------------------------------------------------------------------------- |
| Sort order          | Client-side sort by `createdAt` desc in hook                                       |
| Delete confirmation | `window.confirm()` — no custom modal                                               |
| Filter logic        | `useMemo` in hook, AND logic                                                       |
| Type labels         | `MENU_TYPE_LABELS` from `contracts/types.ts`                                       |
| Date format         | `toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })` |
| EmptyState          | No changes needed — already correct from Feature 004                               |
| Pagination          | None — all menus loaded at once                                                    |
