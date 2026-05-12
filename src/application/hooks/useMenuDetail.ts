"use client";

import { useState, useEffect } from "react";
import { useMenuRepository } from "@/src/application/contexts/MenuRepositoryContext";
import type { Menu, MenuItem } from "@/specs/004-menu-builder/contracts/types";
import { MenuType } from "@/src/domain/models/MenuType";

export function useMenuDetail(id: string) {
  const repository = useMenuRepository();

  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Edit controls
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<MenuType | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const found = await repository.getById(id);
        if (!mounted) return;
        if (!found) {
          setNotFound(true);
        } else {
          setMenu(found);
          setEditName(found.name);
          setEditType(found.type as unknown as MenuType);
        }
      } catch {
        if (mounted) setError("Failed to load menu. Please refresh the page.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id, repository]);

  // ── Save name + type ────────────────────────────────────────────────────

  async function saveChanges() {
    if (!menu) return;
    const trimmed = editName.trim();
    if (!trimmed) {
      setNameError("Name is required");
      return;
    }
    setNameError(null);
    setIsSaving(true);
    setError(null);
    try {
      const updated: Menu = {
        ...menu,
        name: trimmed,
        type: (editType ?? menu.type as unknown as MenuType) as any,
        updatedAt: new Date(),
      };
      const saved = await repository.update(updated);
      setMenu(saved ?? updated);
      setEditName(trimmed);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // ── Remove item ─────────────────────────────────────────────────────────

  async function removeItem(itemId: string) {
    if (!menu) return;
    if (menu.items.length <= 1) return; // guard: keep at least 1
    const newItems = menu.items.filter((i) => i.id !== itemId);
    const updatedMenu = rebuildMenu(menu, newItems);
    setMenu(updatedMenu);
    setError(null);
    try {
      await repository.update(updatedMenu);
    } catch {
      setMenu(menu); // rollback
      setError("Failed to remove item. Please try again.");
    }
  }

  // ── Add item ────────────────────────────────────────────────────────────

  async function addItem(item: MenuItem) {
    if (!menu) return;
    const newItems = [...menu.items, item];
    const updatedMenu = rebuildMenu(menu, newItems);
    setMenu(updatedMenu);
    setError(null);
    try {
      await repository.update(updatedMenu);
    } catch {
      setMenu(menu); // rollback
      setError("Failed to add item. Please try again.");
    }
  }

  return {
    menu,
    isLoading,
    error,
    notFound,
    editName,
    setEditName,
    editType,
    setEditType,
    nameError,
    isSaving,
    saveChanges,
    removeItem,
    addItem,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function rebuildMenu(menu: Menu, newItems: MenuItem[]): Menu {
  const totalWeight = newItems.reduce((s, i) => s + i.weightGrams, 0);
  const totalRations = Number(
    newItems.reduce((s, i) => s + i.rations, 0).toFixed(2),
  );
  return {
    ...menu,
    items: newItems,
    totalWeight,
    totalRations,
    updatedAt: new Date(),
  };
}
