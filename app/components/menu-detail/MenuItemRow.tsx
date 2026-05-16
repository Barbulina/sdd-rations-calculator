import type { MenuItem } from "@/specs/004-menu-builder/contracts/types";
import {
  getCategoryColorVar,
  getCategoryLabel,
} from "@/app/lib/categoryColors";

interface MenuItemRowProps {
  item: MenuItem;
  onRemove: (itemId: string) => void;
  isLast: boolean;
}

export function MenuItemRow({ item, onRemove, isLast }: MenuItemRowProps) {
  const alimentName =
    "name" in item.aliment ? (item.aliment as any).name : "Unknown";
  const categoryColor = getCategoryColorVar(item.aliment.type);
  const categoryLabel = getCategoryLabel(item.aliment.type);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 group">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: categoryColor }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <span className="font-medium text-gray-900 dark:text-gray-100 truncate block">
          {alimentName}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {categoryLabel} &middot; 1 ration = {item.aliment.gramsToCarbohydrate}
          g
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm text-gray-600 dark:text-gray-400 tabular-nums">
          {item.weightGrams}g
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums w-16 text-right">
          {item.rations.toFixed(2)} R
        </span>
        <button
          onClick={() => onRemove(item.id)}
          disabled={isLast}
          aria-label="Remove item"
          title={isLast ? "Cannot remove the last item" : "Remove item"}
          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
