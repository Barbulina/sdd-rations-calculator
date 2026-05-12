/**
 * useMenuBuilder Hook
 * Manages menu builder state and operations
 */

import { useState, useMemo, useCallback } from "react";
import type { MenuRepository } from "@/src/domain/repositories/MenuRepository";
import type { MenuItem } from "@/specs/004-menu-builder/contracts/types";
import type { AlimentInfo } from "@/src/domain/models/AlimentInfo";
import { MenuType } from "@/src/domain/models/MenuType";
import { Menu } from "@/src/domain/models/Menu";

/**
 * Menu builder hook for state management
 *
 * @param repository - Menu repository for persistence
 * @returns Menu builder state and operations
 */
export function useMenuBuilder(repository: MenuRepository) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Add item to menu
   *
   * @param aliment - Aliment information
   * @param weightGrams - Weight in grams (1-10000)
   * @throws Error if weight is invalid
   */
  const addItem = useCallback((aliment: AlimentInfo, weightGrams: number) => {
    // Validate weight
    if (weightGrams < 1 || weightGrams > 10000) {
      throw new Error("Weight must be between 1 and 10000 grams");
    }

    // Calculate rations (2 decimal precision)
    const rations = Number((weightGrams / aliment.gramsToCarbohydrate).toFixed(2));

    // Create new menu item with UUID
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      aliment: aliment,
      weightGrams,
      rations,
    };

    setItems((prev) => [...prev, newItem]);
  }, []);

  /**
   * Remove item from menu by ID
   *
   * @param id - Item ID to remove
   */
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /**
   * Update item weight and recalculate rations
   *
   * @param id - Item ID to update
   * @param weightGrams - New weight in grams (1-10000)
   * @throws Error if weight is invalid
   */
  const updateItemWeight = useCallback((id: string, weightGrams: number) => {
    // Validate weight
    if (weightGrams < 1 || weightGrams > 10000) {
      throw new Error("Weight must be between 1 and 10000 grams");
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Recalculate rations (2 decimal precision)
          const rations = Number(
            (weightGrams / item.aliment.gramsToCarbohydrate).toFixed(2),
          );
          return {
            ...item,
            weightGrams,
            rations,
          };
        }
        return item;
      }),
    );
  }, []);

  /**
   * Calculate totalWeight from all items (memoized)
   */
  const totalWeight = useMemo(() => {
    return items.reduce((sum, item) => sum + item.weightGrams, 0);
  }, [items]);

  /**
   * Calculate totalRations from all items (memoized, 2 decimal precision)
   */
  const totalRations = useMemo(() => {
    const raw = items.reduce((sum, item) => sum + item.rations, 0);
    return Number(raw.toFixed(2));
  }, [items]);

  /**
   * Clear all items from menu
   */
  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  /**
   * Save menu to repository
   *
   * @param name - Menu name (1-200 chars)
   * @param type - Menu type (MenuType)
   * @throws Error if validation fails or save fails
   */
  const saveMenu = useCallback(
    async (name: string, type: MenuType) => {
      try {
        // Validate name
        const trimmedName = name.trim();
        if (trimmedName.length === 0) {
          throw new Error("Menu name is required");
        }
        if (trimmedName.length > 200) {
          throw new Error("Menu name must not exceed 200 characters");
        }

        // Validate items
        if (items.length === 0) {
          throw new Error("Menu must contain at least one aliment");
        }

        setIsLoading(true);
        setError(null);

        // Create menu and save
        const menu = new Menu(trimmedName, type, items);
        await repository.save(menu);

        // Clear items on success
        setItems([]);
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [items, repository],
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    items,
    totalWeight,
    totalRations,
    isLoading,
    error,
    addItem,
    removeItem,
    updateItemWeight,
    clearItems,
    saveMenu,
    clearError,
  };
}
