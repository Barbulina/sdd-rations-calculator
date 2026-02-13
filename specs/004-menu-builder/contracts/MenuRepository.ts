/**
 * Menu Repository Interface
 *
 * Defines the contract for menu persistence.
 * Implementations must handle serialization, validation, and error handling.
 */

import type { Menu, CreateMenuDTO, UpdateMenuDTO } from "./types";

/**
 * Repository interface for menu persistence operations.
 *
 * Implementations:
 * - LocalStorageMenuRepository: Stores menus in browser localStorage
 * - (Future) ServerMenuRepository: Stores menus on remote server
 */
export interface MenuRepository {
  /**
   * Retrieve all menus.
   *
   * @returns Promise resolving to array of menus (empty array if none)
   * @throws Error if storage is corrupted or unavailable
   *
   * @example
   * const menus = await repository.getAll();
   * console.log(`Found ${menus.length} menus`);
   */
  getAll(): Promise<Menu[]>;

  /**
   * Retrieve a single menu by ID.
   *
   * @param id - Menu UUID
   * @returns Promise resolving to menu or null if not found
   * @throws Error if storage is corrupted or unavailable
   *
   * @example
   * const menu = await repository.getById('uuid-1234');
   * if (menu) {
   *   console.log(`Found menu: ${menu.name}`);
   * }
   */
  getById(id: string): Promise<Menu | null>;

  /**
   * Save a new menu or update an existing one.
   *
   * For new menus:
   * - Generates UUID if not provided
   * - Sets createdAt timestamp
   * - Calculates totals
   *
   * For updates:
   * - Sets updatedAt timestamp
   * - Recalculates totals
   * - Preserves createdAt
   *
   * @param menuData - Menu creation DTO
   * @returns Promise resolving to saved menu with generated fields
   * @throws ValidationError if menu data is invalid
   * @throws QuotaExceededError if storage is full
   * @throws Error if storage is unavailable
   *
   * @example
   * const menu = await repository.save({
   *   name: 'Breakfast',
   *   type: 'frutas',
   *   items: [menuItem1, menuItem2]
   * });
   * console.log(`Saved menu with ID: ${menu.id}`);
   */
  save(menuData: CreateMenuDTO): Promise<Menu>;

  /**
   * Update an existing menu.
   *
   * @param menuData - Update DTO with menu ID and fields to update
   * @returns Promise resolving to updated menu
   * @throws Error if menu not found
   * @throws ValidationError if update data is invalid
   * @throws QuotaExceededError if storage is full
   * @throws Error if storage is unavailable
   *
   * @example
   * const updated = await repository.update({
   *   id: 'uuid-1234',
   *   name: 'Updated Breakfast'
   * });
   */
  update(menuData: UpdateMenuDTO): Promise<Menu>;

  /**
   * Delete a menu by ID.
   *
   * @param id - Menu UUID
   * @returns Promise resolving when deletion is complete
   * @throws Error if menu not found (should be non-fatal)
   * @throws Error if storage is unavailable
   *
   * @example
   * await repository.delete('uuid-1234');
   * console.log('Menu deleted');
   */
  delete(id: string): Promise<void>;

  /**
   * Delete all menus.
   *
   * WARNING: Destructive operation. Should prompt for confirmation in UI.
   *
   * @returns Promise resolving when all menus are deleted
   * @throws Error if storage is unavailable
   *
   * @example
   * if (confirm('Delete all menus?')) {
   *   await repository.deleteAll();
   * }
   */
  deleteAll(): Promise<void>;

  /**
   * Check if storage is available and writable.
   *
   * @returns Promise resolving to true if storage is available
   *
   * @example
   * const available = await repository.isAvailable();
   * if (!available) {
   *   alert('Storage unavailable');
   * }
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get storage usage information (if supported).
   *
   * @returns Promise resolving to storage stats or null if unsupported
   *
   * @example
   * const stats = await repository.getStorageStats();
   * if (stats) {
   *   console.log(`Using ${stats.used} of ${stats.total} bytes`);
   * }
   */
  getStorageStats(): Promise<StorageStats | null>;
}

/**
 * Storage usage statistics
 */
export interface StorageStats {
  /**
   * Total storage capacity in bytes
   */
  total: number;

  /**
   * Used storage in bytes
   */
  used: number;

  /**
   * Available storage in bytes
   */
  available: number;

  /**
   * Usage percentage (0-100)
   */
  percentage: number;
}

/**
 * Error thrown when menu validation fails
 */
export class MenuValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public errors?: string[],
  ) {
    super(message);
    this.name = "MenuValidationError";
  }
}

/**
 * Error thrown when storage quota is exceeded
 */
export class StorageQuotaExceededError extends Error {
  constructor(message: string = "Storage quota exceeded") {
    super(message);
    this.name = "StorageQuotaExceededError";
  }
}

/**
 * Error thrown when storage is unavailable
 */
export class StorageUnavailableError extends Error {
  constructor(message: string = "Storage is unavailable") {
    super(message);
    this.name = "StorageUnavailableError";
  }
}
