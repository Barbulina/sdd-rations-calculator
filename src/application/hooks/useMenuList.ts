"use client";

/**
 * useMenuList Hook
 * Loads, sorts, filters, and deletes menus from the MenuRepository.
 *
 * @see specs/005-menu-list/contracts/MenuListHook.ts for the full interface contract
 */

import { useState, useEffect, useMemo } from "react";
import { useMenuRepository } from "@/src/application/contexts/MenuRepositoryContext";
import { searchByName } from "@/src/application/utils/search";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMenus() {
    setIsLoading(true);
    setError(null);
    try {
      const all = await repository.getAll();
      // Sort by createdAt descending (most recent first)
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
  }

  // T006: client-side filtered list (AND logic)
  const filteredMenus = useMemo(() => {
    const byName = nameFilter.trim() ? searchByName(menus, nameFilter) : menus;
    return byName.filter(
      (m) => typeFilter === null || (m.type as unknown) === typeFilter,
    );
  }, [menus, nameFilter, typeFilter]);

  // T007: delete with confirmation guard
  async function deleteMenu(id: string) {
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
  }

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
