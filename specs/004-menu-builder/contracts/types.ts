/**
 * Menu Builder Type Definitions
 *
 * Core types for the Menu Builder feature.
 * These types define the structure of menus and menu items.
 */

import type { RationsType } from "@/domain/models/RationsType";
import type { AlimentInfo } from "@/domain/models/AlimentInfo";
import type { CustomAliment } from "@/domain/models/CustomAliment";

/**
 * MenuItem represents a single aliment in a menu with its weight and calculated rations.
 */
export interface MenuItem {
  /**
   * Unique identifier for the menu item (UUID v4)
   */
  id: string;

  /**
   * The aliment from catalog or custom aliments
   */
  aliment: AlimentInfo | CustomAliment;

  /**
   * Weight in grams
   * @min 1
   * @max 10000
   */
  weightGrams: number;

  /**
   * Calculated rations (weightGrams / aliment.gramsToCarbohydrate)
   * Fixed to 2 decimal places for display
   */
  rations: number;
}

/**
 * Menu represents a complete meal with multiple aliments.
 */
export interface Menu {
  /**
   * Unique identifier for the menu (UUID v4)
   */
  id: string;

  /**
   * Menu name (e.g., "Afternoon Snack")
   * @minLength 1
   * @maxLength 200
   */
  name: string;

  /**
   * Menu type (matches RationsType enum)
   */
  type: RationsType;

  /**
   * List of menu items
   * @minItems 1
   */
  items: MenuItem[];

  /**
   * Sum of all item weights (auto-calculated)
   */
  totalWeight: number;

  /**
   * Sum of all item rations (auto-calculated)
   */
  totalRations: number;

  /**
   * Creation timestamp
   */
  createdAt: Date;

  /**
   * Last modification timestamp (optional)
   */
  updatedAt?: Date;
}

/**
 * DTO for creating a new menu.
 * Auto-generated fields (id, totals, timestamps) are not included.
 */
export interface CreateMenuDTO {
  /**
   * Menu name
   * @minLength 1
   * @maxLength 200
   */
  name: string;

  /**
   * Menu type
   */
  type: RationsType;

  /**
   * Menu items
   * @minItems 1
   */
  items: MenuItem[];
}

/**
 * DTO for updating an existing menu.
 * All fields are optional except id.
 */
export interface UpdateMenuDTO {
  /**
   * ID of the menu to update
   */
  id: string;

  /**
   * New menu name (optional)
   */
  name?: string;

  /**
   * New menu type (optional)
   */
  type?: RationsType;

  /**
   * New items list (optional)
   */
  items?: MenuItem[];
}

/**
 * Validation error for a specific field
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Options for displaying rations
 */
export interface RationsDisplayOptions {
  /**
   * Number of decimal places (default: 2)
   */
  precision?: number;

  /**
   * Whether to include unit label (default: true)
   * e.g., "1.36 rations" vs "1.36"
   */
  includeUnit?: boolean;
}

/**
 * Options for displaying weight
 */
export interface WeightDisplayOptions {
  /**
   * Whether to include unit label (default: true)
   * e.g., "150g" vs "150"
   */
  includeUnit?: boolean;
}
