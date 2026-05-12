"use client";

import type { MenuItem } from "@/specs/004-menu-builder/contracts/types";
import { MenuItemCard } from "./MenuItemCard";

interface MenuItemsListProps {
  items: MenuItem[];
  onUpdateWeight: (itemId: string, weight: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function MenuItemsList({
  items,
  onUpdateWeight,
  onRemoveItem,
}: MenuItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="max-w-sm mx-auto">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No aliments added
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Search for an aliment to add to your menu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="menu-items-list" className="space-y-3">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onUpdateWeight={onUpdateWeight}
          onRemove={onRemoveItem}
        />
      ))}
    </div>
  );
}
