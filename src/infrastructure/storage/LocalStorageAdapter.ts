/**
 * LocalStorageAdapter
 *
 * Provides a safe wrapper around the browser's localStorage API with:
 * - Availability checking (handles disabled localStorage)
 * - Namespaced keys to avoid conflicts
 * - Error handling for QuotaExceededError
 * - Type-safe get/set operations
 *
 * @see ../../../specs/002-ration-menu-management/research.md for localStorage best practices
 */
export class LocalStorageAdapter {
  /**
   * Storage key prefix to namespace all keys
   * Prevents conflicts with other applications
   */
  private readonly prefix = "sdd-rations-calculator:";

  /**
   * Check if localStorage is available
   *
   * @returns true if localStorage is available and writable, false otherwise
   *
   * @example
   * ```typescript
   * const adapter = new LocalStorageAdapter();
   * if (!adapter.isAvailable()) {
   *   console.warn("localStorage is disabled");
   * }
   * ```
   */
  isAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get an item from localStorage
   *
   * @param key - Storage key (without prefix)
   * @returns Parsed value or null if not found or parse fails
   *
   * @example
   * ```typescript
   * const data = adapter.getItem<Ration[]>("rations");
   * ```
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`localStorage getItem error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set an item in localStorage
   *
   * @param key - Storage key (without prefix)
   * @param value - Value to store (will be JSON.stringify'd)
   * @returns true if successful, false if quota exceeded or other error
   *
   * @example
   * ```typescript
   * const success = adapter.setItem("rations", allRations);
   * if (!success) {
   *   alert("Storage full - please delete some rations");
   * }
   * ```
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === "QuotaExceededError") {
        console.error("localStorage quota exceeded");
      } else {
        console.error(`localStorage setItem error for key "${key}":`, error);
      }
      return false;
    }
  }

  /**
   * Remove an item from localStorage
   *
   * @param key - Storage key (without prefix)
   *
   * @example
   * ```typescript
   * adapter.removeItem("rations");
   * ```
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error(`localStorage removeItem error for key "${key}":`, error);
    }
  }
}
