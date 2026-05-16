"use client";

import Link from "next/link";
import { useMenuList } from "@/src/application/hooks/useMenuList";
import { MenuCard } from "./components/MenuCard";
import { MenuListFilters } from "./components/MenuListFilters";
import { EmptyState } from "./components/EmptyState";
import { PageHeader } from "./components/PageHeader";

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
    <div className="min-h-screen">
      <PageHeader title="My Menus" />

      <main className="max-w-4xl mx-auto px-4 pt-6 pb-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading menus...
          </div>
        )}

        {!isLoading && !hasMenus && <EmptyState />}

        {!isLoading && hasMenus && (
          <>
            <MenuListFilters
              nameFilter={nameFilter}
              onNameFilterChange={setNameFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
            />

            {filteredMenus.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No menus match your filters. Try clearing the search or type
                selector.
              </div>
            )}

            {filteredMenus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} onDelete={deleteMenu} />
            ))}
          </>
        )}
      </main>

      {hasMenus && (
        <Link
          href="/menu-builder"
          aria-label="Create menu"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Link>
      )}
    </div>
  );
}
