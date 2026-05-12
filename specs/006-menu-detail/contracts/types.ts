/**
 * Menu Detail — Type Contracts
 * Feature 006
 */

import type { Menu, MenuItem } from "@/specs/004-menu-builder/contracts/types";
import type { MenuType } from "@/src/domain/models/MenuType";

// ─── Hook Result ───────────────────────────────────────────────────────────

export interface UseMenuDetailResult {
  /** Loaded menu (null while loading or not found) */
  menu: Menu | null;
  isLoading: boolean;
  /** Load or save error message */
  error: string | null;
  /** True when menu ID was valid but menu doesn't exist */
  notFound: boolean;

  // Edit controls (name + type)
  editName: string;
  setEditName: (name: string) => void;
  editType: MenuType | null;
  setEditType: (type: MenuType | null) => void;
  /** Validation error for name field */
  nameError: string | null;
  isSaving: boolean;
  saveChanges: () => Promise<void>;

  // Item operations
  removeItem: (itemId: string) => Promise<void>;
  addItem: (item: MenuItem) => Promise<void>;
}

// ─── Component Props ────────────────────────────────────────────────────────

export interface MenuDetailPageParams {
  params: { id: string };
}

export interface MenuItemRowProps {
  item: MenuItem;
  onRemove: (itemId: string) => void;
  /** True when this is the only item — disable remove button */
  isLast: boolean;
}

export interface MenuDetailSummaryProps {
  totalRations: number;
  totalWeight: number;
}
