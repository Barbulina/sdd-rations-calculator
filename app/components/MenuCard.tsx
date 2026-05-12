"use client";

import Link from "next/link";
import type { Menu } from "@/specs/004-menu-builder/contracts/types";
import { MenuType } from "@/src/domain/models/MenuType";

const MENU_TYPE_LABELS: Record<string, string> = {
  [MenuType.BREAKFAST]: "Breakfast",
  [MenuType.LUNCH]: "Lunch",
  [MenuType.DINNER]: "Dinner",
  [MenuType.SNACK]: "Snack",
};

interface MenuCardProps {
  menu: Menu;
  onDelete: (id: string) => void;
}

export function MenuCard({ menu, onDelete }: MenuCardProps) {
  const typeLabel = MENU_TYPE_LABELS[menu.type as string] ?? menu.type;
  const formattedDate = new Date(menu.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      data-testid={`menu-card-${menu.id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-3"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Clickable area — links to detail page */}
        <Link href={`/menu/${menu.id}`} className="flex-1 min-w-0 hover:opacity-80 transition">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {menu.name}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
              {typeLabel}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>
        </Link>

        {/* Delete button — outside Link to avoid nested interactive elements */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(menu.id); }}
          aria-label="Delete menu"
          className="flex-shrink-0 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Rations</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{menu.totalRations.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Weight</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{Math.round(menu.totalWeight)}g</p>
        </div>
      </div>
    </div>
  );
}
