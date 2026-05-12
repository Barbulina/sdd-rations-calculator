"use client";

import Link from "next/link";
import { useMenuList } from "@/src/application/hooks/useMenuList";
import { MenuCard } from "./components/MenuCard";
import { MenuListFilters } from "./components/MenuListFilters";
import { EmptyState } from "./components/EmptyState";

/**
 * Home Page — Menu List
 *
 * Displays the user's saved menus with name/type filters and delete support.
 *
 * @see specs/005-menu-list/spec.md for user stories
 */
export default function HomePage() {
  const {
    filteredMenus,
    isLoading,
    error,
    hasMenus,
    nameFilter,
    setNameFilter,
    typeFilter,
    setTypeFilter,
    deleteMenu,
  } = useMenuList();

  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Menus</h1>
          <Link
            href="/menu-builder"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition font-medium"
          >
            + Create
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading menus...
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !hasMenus && <EmptyState />}

        {/* Menus exist */}
        {!isLoading && hasMenus && (
          <>
            {/* Filters */}
            <MenuListFilters
              nameFilter={nameFilter}
              onNameFilterChange={setNameFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
            />

            {/* No results after filtering */}
            {filteredMenus.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No menus match your filters. Try clearing the search or type
                selector.
              </div>
            )}

            {/* Menu cards */}
            {filteredMenus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} onDelete={deleteMenu} />
            ))}
          </>
        )}
      </div>
    </main>
  );
}
