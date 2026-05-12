"use client";

/**
 * MenuListFilters Component
 * Name search input + type dropdown for filtering the menu list.
 *
 * @see specs/005-menu-list/contracts/types.ts for props contract
 */

import { MenuType } from "@/src/domain/models/MenuType";

const MENU_TYPE_LABELS: Record<string, string> = {
  [MenuType.BREAKFAST]: "Breakfast",
  [MenuType.LUNCH]: "Lunch",
  [MenuType.DINNER]: "Dinner",
  [MenuType.SNACK]: "Snack",
};

const MENU_TYPE_ORDER: MenuType[] = [
  MenuType.BREAKFAST,
  MenuType.LUNCH,
  MenuType.DINNER,
  MenuType.SNACK,
];

interface MenuListFiltersProps {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  typeFilter: MenuType | null;
  onTypeFilterChange: (type: MenuType | null) => void;
}

export function MenuListFilters({
  nameFilter,
  onNameFilterChange,
  typeFilter,
  onTypeFilterChange,
}: MenuListFiltersProps) {
  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    onTypeFilterChange(value === "" ? null : (value as MenuType));
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {/* Name search */}
      <input
        type="text"
        placeholder="Search by name..."
        value={nameFilter}
        onChange={(e) => onNameFilterChange(e.target.value)}
        maxLength={200}
        className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search menus by name"
      />

      {/* Type selector */}
      <select
        value={typeFilter ?? ""}
        onChange={handleTypeChange}
        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Filter by meal type"
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
