/**
 * MenuRepository interface
 * Contract for menu persistence operations
 */

import type { Menu } from '../../../specs/004-menu-builder/contracts/types';

export interface MenuRepository {
  /**
   * Get all menus
   */
  getAll(): Promise<Menu[]>;

  /**
   * Get menu by ID
   */
  getById(id: string): Promise<Menu | null>;

  /**
   * Save a new menu
   */
  save(menu: Menu): Promise<Menu>;

  /**
   * Update existing menu
   */
  update(menu: Menu): Promise<Menu>;

  /**
   * Delete menu by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Delete all menus
   */
  deleteAll(): Promise<void>;

  /**
   * Check if storage is available
   */
  isAvailable(): Promise<boolean>;
}
