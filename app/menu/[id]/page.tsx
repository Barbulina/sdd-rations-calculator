"use client";

import { useState } from "react";
import Link from "next/link";
import { useMenuDetail } from "@/src/application/hooks/useMenuDetail";
import { MenuItemRow } from "@/app/components/menu-detail/MenuItemRow";
import { MenuDetailSummary } from "@/app/components/menu-detail/MenuDetailSummary";
import { AutocompleteSearch } from "@/app/components/menu-builder/AutocompleteSearch";
import { WeightInputDialog } from "@/app/components/menu-builder/WeightInputDialog";
import { MenuType } from "@/src/domain/models/MenuType";
import type { UnifiedAliment } from "@/src/domain/repositories/CompositeAlimentRepository";
import type { MenuItem } from "@/specs/004-menu-builder/contracts/types";
import { PageHeader } from "@/app/components/PageHeader";

const MENU_TYPE_LABELS: Record<string, string> = {
  [MenuType.BREAKFAST]: "Breakfast",
  [MenuType.LUNCH]: "Lunch",
  [MenuType.DINNER]: "Dinner",
  [MenuType.SNACK]: "Snack",
};

const MENU_TYPE_ORDER: MenuType[] = [
  MenuType.BREAKFAST,
  MenuType.LUNCH,
  MenuType.DINNER,
  MenuType.SNACK,
];

interface MenuDetailPageProps {
  params: { id: string };
}

export default function MenuDetailPage({ params }: MenuDetailPageProps) {
  const {
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
  } = useMenuDetail(params.id);

  const [pendingAliment, setPendingAliment] = useState<UnifiedAliment | null>(
    null,
  );

  // ── Loading ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="min-h-screen p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            Loading menu...
          </div>
        </div>
      </main>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────
  if (notFound || !menu) {
    return (
      <main className="min-h-screen p-4">
        <div className="container mx-auto max-w-2xl text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Menu not found.
          </p>
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to My Menus
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(menu.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto max-w-2xl">
        <PageHeader title="Menu Detail" backHref="/" />

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Edit: Name + Type */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Created: {formattedDate}
          </p>

          {/* Name */}
          <div className="mb-3">
            <label
              htmlFor="menu-name"
              className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
            >
              Menu Name
            </label>
            <input
              id="menu-name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              maxLength={200}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {nameError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {nameError}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="mb-4">
            <label
              htmlFor="menu-type"
              className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
            >
              Meal Type
            </label>
            <select
              id="menu-type"
              value={editType ?? ""}
              onChange={(e) => setEditType(e.target.value as MenuType)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MENU_TYPE_ORDER.map((t) => (
                <option key={t} value={t}>
                  {MENU_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={saveChanges}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 text-sm font-medium"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </section>

        {/* Aliments list */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
            Aliments
          </h2>
          {menu.items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              onRemove={removeItem}
              isLast={menu.items.length === 1}
            />
          ))}
        </section>

        {/* Summary */}
        <MenuDetailSummary
          totalRations={menu.totalRations}
          totalWeight={menu.totalWeight}
        />

        {/* Add aliment */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
            Add Aliment
          </h2>
          <AutocompleteSearch
            onSelectAliment={(aliment: UnifiedAliment) =>
              setPendingAliment(aliment)
            }
          />
        </section>

        <WeightInputDialog
          isOpen={!!pendingAliment}
          alimentName={
            pendingAliment
              ? "name" in pendingAliment
                ? (pendingAliment as { name: string }).name
                : ""
              : ""
          }
          onAdd={(weightGrams: number) => {
            if (!pendingAliment) return;
            const item: MenuItem = {
              id: crypto.randomUUID(),
              aliment: pendingAliment as MenuItem["aliment"],
              weightGrams,
              rations: 0,
            };
            addItem(item);
            setPendingAliment(null);
          }}
          onCancel={() => setPendingAliment(null)}
        />
      </div>
    </main>
  );
}
