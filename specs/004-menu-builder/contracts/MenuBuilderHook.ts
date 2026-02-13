/**
 * useMenuBuilder Hook Contract
 *
 * Defines the return type and behavior of the useMenuBuilder React hook.
 * This hook manages the state for building a menu with multiple aliments.
 */

import type { MenuItem, Menu } from "./types";
import type { AlimentInfo } from "@/domain/models/AlimentInfo";
import type { CustomAliment } from "@/domain/models/CustomAliment";
import type { RationsType } from "@/domain/models/RationsType";

/**
 * Return type for the useMenuBuilder hook.
 *
 * @example
 * const {
 *   items,
 *   totalWeight,
 *   totalRations,
 *   addItem,
 *   removeItem,
 *   updateItemWeight,
 *   clearItems,
 *   saveMenu,
 *   isLoading,
 *   error,
 * } = useMenuBuilder();
 */
export interface UseMenuBuilderReturn {
  /**
   * Current menu items
   */
  items: MenuItem[];

  /**
   * Total weight of all items (sum of weightGrams)
   */
  totalWeight: number;

  /**
   * Total rations of all items (sum of rations)
   * Fixed to 2 decimal places
   */
  totalRations: number;

  /**
   * Add an aliment to the menu with specified weight.
   *
   * Creates a MenuItem with:
   * - Generated UUID
   * - Provided aliment and weight
   * - Calculated rations (weightGrams / gramsToCarbohydrate)
   *
   * @param aliment - Aliment from catalog or custom aliments
   * @param weightGrams - Weight in grams (must be > 0 and <= 10000)
   * @throws Error if weight is invalid
   *
   * @example
   * addItem(manzana, 150);
   * // Adds MenuItem { id: "uuid", aliment: manzana, weightGrams: 150, rations: 1.36 }
   */
  addItem(aliment: AlimentInfo | CustomAliment, weightGrams: number): void;

  /**
   * Remove a menu item by ID.
   *
   * @param id - MenuItem UUID
   *
   * @example
   * removeItem('uuid-1234');
   */
  removeItem(id: string): void;

  /**
   * Update the weight of a menu item.
   * Recalculates rations automatically.
   *
   * @param id - MenuItem UUID
   * @param weightGrams - New weight in grams (must be > 0 and <= 10000)
   * @throws Error if item not found or weight is invalid
   *
   * @example
   * updateItemWeight('uuid-1234', 200);
   * // Updates item weight and recalculates rations to 200 / gramsToCarbohydrate
   */
  updateItemWeight(id: string, weightGrams: number): void;

  /**
   * Remove all items from the menu.
   *
   * @example
   * clearItems();
   */
  clearItems(): void;

  /**
   * Save the current menu to repository.
   *
   * Validation:
   * - Name must be non-empty (after trim) and <= 200 chars
   * - Type must be valid RationsType
   * - Items must have at least 1 item
   *
   * On success:
   * - Clears current items
   * - Navigates to home page
   *
   * @param name - Menu name
   * @param type - Menu type
   * @returns Promise resolving to saved menu
   * @throws MenuValidationError if validation fails
   * @throws StorageQuotaExceededError if storage is full
   * @throws Error if save operation fails
   *
   * @example
   * await saveMenu('Afternoon Snack', 'frutas');
   */
  saveMenu(name: string, type: RationsType): Promise<Menu>;

  /**
   * Whether a save operation is in progress
   */
  isLoading: boolean;

  /**
   * Error message from last operation (null if no error)
   */
  error: string | null;

  /**
   * Clear the error message
   */
  clearError(): void;
}

/**
 * Options for useMenuBuilder hook (future extension)
 */
export interface UseMenuBuilderOptions {
  /**
   * Auto-save draft to localStorage
   * @default false
   */
  autoSaveDraft?: boolean;

  /**
   * Callback when menu is successfully saved
   */
  onSaveSuccess?: (menu: Menu) => void;

  /**
   * Callback when save operation fails
   */
  onSaveError?: (error: Error) => void;
}
