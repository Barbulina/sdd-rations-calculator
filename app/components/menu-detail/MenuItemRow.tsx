"use client";

import type { MenuItem } from "@/specs/004-menu-builder/contracts/types";

interface MenuItemRowProps {
  item: MenuItem;
  onRemove: (itemId: string) => void;
  isLast: boolean;
}

export function MenuItemRow({ item, onRemove, isLast }: MenuItemRowProps) {
  const alimentName =
    "name" in item.aliment ? (item.aliment as any).name : "Unknown";

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex-1 min-w-0">
        <span className="font-medium text-gray-900 dark:text-gray-100 truncate block">
          {alimentName}
        </span>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {item.weightGrams}g
      </span>
      <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap w-16 text-right">
        {item.rations.toFixed(2)} R
      </span>
      <button
        onClick={() => onRemove(item.id)}
        disabled={isLast}
        aria-label="Remove item"
        title={isLast ? "Cannot remove the last item" : "Remove item"}
        className="flex-shrink-0 p-1 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ✕
      </button>
    </div>
  );
}
