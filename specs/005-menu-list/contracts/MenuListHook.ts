/**
 * contracts/MenuListHook.ts
 * Feature 005 - Menu List
 *
 * TypeScript interface contract for the useMenuList hook.
 * This file is the authoritative definition of the hook's public API.
 * Implementation lives at: src/application/hooks/useMenuList.ts
 */

import type { Menu } from "../../../specs/004-menu-builder/contracts/types";
import type { MenuType } from "../../../src/domain/models/MenuType";

// ---------------------------------------------------------------------------
// useMenuList return type
// ---------------------------------------------------------------------------

/**
 * Return type of the useMenuList hook.
 *
 * The hook encapsulates:
 * - Loading all menus from the repository on mount
 * - Sorting menus by creation date (most recent first)
 * - Client-side filtering by name and type
 * - Deleting a menu (with window.confirm guard)
 *
 * @example
 * ```tsx
 * function HomePage() {
 *   const {
 *     filteredMenus, isLoading, error, hasMenus,
 *     nameFilter, setNameFilter,
 *     typeFilter, setTypeFilter,
 *     deleteMenu,
 *   } = useMenuList();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!hasMenus) return <EmptyState />;
 *   return (
 *     <>
 *       <MenuListFilters
 *         nameFilter={nameFilter}
 *         onNameFilterChange={setNameFilter}
 *         typeFilter={typeFilter}
 *         onTypeFilterChange={setTypeFilter}
 *       />
 *       {filteredMenus.map(m => <MenuCard key={m.id} menu={m} onDelete={deleteMenu} />)}
 *     </>
 *   );
 * }
 * ```
 */
export interface UseMenuListResult {
  // -------------------------------------------------------------------------
  // Data
  // -------------------------------------------------------------------------

  /**
   * All menus from the repository, sorted by createdAt descending.
   * Does NOT reflect active filters — use filteredMenus for rendering.
   */
  menus: Menu[];

  /**
   * Subset of menus that pass the active nameFilter + typeFilter.
   * This is what should be rendered in the list.
   */
  filteredMenus: Menu[];

  // -------------------------------------------------------------------------
  // Loading / error
  // -------------------------------------------------------------------------

  /** True while the initial getAll() call is in-flight. */
  isLoading: boolean;

  /**
   * Error message if loading or deletion fails.
   * null when there is no error.
   */
  error: string | null;

  // -------------------------------------------------------------------------
  // Derived booleans
  // -------------------------------------------------------------------------

  /**
   * True when the repository contains at least one menu (regardless of filters).
   * Used to distinguish EmptyState (no menus at all) from NoResults (filters active, no match).
   */
  hasMenus: boolean;

  // -------------------------------------------------------------------------
  // Filter state
  // -------------------------------------------------------------------------

  /** Current name search text. Empty string means "no name filter". */
  nameFilter: string;

  /** Current type selection. null means "All types". */
  typeFilter: MenuType | null;

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  /**
   * Update the name filter.
   * @param value - New filter string (empty string clears the filter)
   */
  setNameFilter: (value: string) => void;

  /**
   * Update the type filter.
   * @param type - MenuType to filter by, or null for "All types"
   */
  setTypeFilter: (type: MenuType | null) => void;

  /**
   * Delete a menu by id after requesting user confirmation.
   *
   * If the user cancels the confirmation, the menu is NOT deleted.
   * If the deletion succeeds, the menu is immediately removed from local state.
   * If the deletion fails, `error` is set with a descriptive message.
   *
   * @param id - The id of the menu to delete
   */
  deleteMenu: (id: string) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook signature
// ---------------------------------------------------------------------------

/**
 * useMenuList hook signature.
 * Takes no parameters — reads MenuRepository from context.
 */
export type UseMenuList = () => UseMenuListResult;
