/**
 * contracts/types.ts
 * Feature 005 - Menu List
 *
 * View-layer types and constants used by useMenuList, MenuCard, and MenuListFilters.
 * Domain types (Menu, MenuType) are imported from Feature 004.
 */

import type { Menu } from "../../../specs/004-menu-builder/contracts/types";
import { MenuType } from "../../../src/domain/models/MenuType";

// Re-export for convenience
export type { Menu };
export { MenuType };

// ---------------------------------------------------------------------------
// Display label mapping
// ---------------------------------------------------------------------------

/**
 * Human-readable labels for each MenuType value.
 * Used by MenuCard (to display the type) and MenuListFilters (to populate the dropdown).
 */
export const MENU_TYPE_LABELS: Record<MenuType, string> = {
  [MenuType.BREAKFAST]: "Breakfast",
  [MenuType.LUNCH]: "Lunch",
  [MenuType.DINNER]: "Dinner",
  [MenuType.SNACK]: "Snack",
};

/**
 * Ordered list of MenuType values for rendering the filter dropdown.
 * Preserves a natural meal-order sequence.
 */
export const MENU_TYPE_ORDER: MenuType[] = [
  MenuType.BREAKFAST,
  MenuType.LUNCH,
  MenuType.DINNER,
  MenuType.SNACK,
];

// ---------------------------------------------------------------------------
// Filter state
// ---------------------------------------------------------------------------

/**
 * Client-side filter state managed inside useMenuList.
 * Not persisted — resets on navigation.
 */
export interface MenuFilter {
  /** Partial case-insensitive match against menu.name. Empty string = no filter. */
  nameFilter: string;
  /** Exact match against menu.type. null = All types. */
  typeFilter: MenuType | null;
}

// ---------------------------------------------------------------------------
// Props contracts
// ---------------------------------------------------------------------------

/**
 * Props for the MenuCard component.
 */
export interface MenuCardProps {
  /** The menu to display. All display-ready data is derived inside the component. */
  menu: Menu;
  /** Called when the user confirms deletion of this menu. */
  onDelete: (id: string) => void;
}

/**
 * Props for the MenuListFilters component.
 */
export interface MenuListFiltersProps {
  /** Current name filter value. */
  nameFilter: string;
  /** Called when the user changes the name search input. */
  onNameFilterChange: (value: string) => void;
  /** Current type filter value. null = "All types". */
  typeFilter: MenuType | null;
  /** Called when the user selects a type from the dropdown. */
  onTypeFilterChange: (type: MenuType | null) => void;
}
