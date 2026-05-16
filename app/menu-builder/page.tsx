"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AutocompleteSearch } from "@/app/components/menu-builder/AutocompleteSearch";
import { WeightInputDialog } from "@/app/components/menu-builder/WeightInputDialog";
import { MenuItemsList } from "@/app/components/menu-builder/MenuItemsList";
import { MenuSummary } from "@/app/components/menu-builder/MenuSummary";
import { useMenuBuilder } from "@/src/application/hooks/useMenuBuilder";
import { useMenuRepository } from "@/src/application/contexts/MenuRepositoryContext";
import { AlimentInfo } from "@/src/domain/models/AlimentInfo";
import { MenuType } from "@/src/domain/models/MenuType";
import { PageHeader } from "@/app/components/PageHeader";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";
import {
  getCategoryColorVar,
  getCategoryLabel,
} from "@/app/lib/categoryColors";

export default function MenuBuilderPage() {
  const router = useRouter();
  const repository = useMenuRepository();
  const [selectedAliment, setSelectedAliment] = useState<AlimentInfo | null>(
    null,
  );
  const [menuName, setMenuName] = useState("");
  const [menuType, setMenuType] = useState<MenuType | "">("");

  const {
    items,
    totalWeight,
    totalRations,
    addItem,
    removeItem,
    updateItemWeight,
    saveMenu,
    isLoading,
    error,
  } = useMenuBuilder(repository);

  const rationsByCategory = useMemo(() => {
    const map = new Map<
      string,
      { value: number; label: string; color: string }
    >();
    for (const item of items) {
      const key = item.aliment.type;
      const existing = map.get(key);
      if (existing) {
        existing.value += item.rations;
      } else {
        map.set(key, {
          value: item.rations,
          label: getCategoryLabel(key),
          color: getCategoryColorVar(key),
        });
      }
    }
    return Array.from(map.values());
  }, [items]);

  const handleAlimentSelect = (aliment: AlimentInfo) => {
    setSelectedAliment(aliment);
  };

  const handleWeightConfirm = (weight: number) => {
    if (selectedAliment) {
      addItem(selectedAliment, weight);
      setSelectedAliment(null);
    }
  };

  const handleWeightCancel = () => {
    setSelectedAliment(null);
  };

  const handleSaveMenu = async () => {
    if (menuName.trim() && menuType && items.length > 0) {
      await saveMenu(menuName, menuType as MenuType);
      router.push("/");
    }
  };

  const isFormValid =
    menuName.trim() !== "" && menuType !== "" && items.length > 0;

  return (
    <div className="min-h-screen">
      <PageHeader title="Create Menu" backHref="/" />

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-8">
        {/* Menu Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Menu Info
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="menu-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Menu Name
              </label>
              <Input
                type="text"
                id="menu-name"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                placeholder="e.g. Monday Breakfast"
                disabled={isLoading}
                maxLength={200}
              />
            </div>
            <div>
              <label
                htmlFor="menu-type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Menu Type
              </label>
              <Select
                id="menu-type"
                value={menuType}
                onChange={(e) => setMenuType(e.target.value as MenuType | "")}
                disabled={isLoading}
              >
                <option value="">Select a type...</option>
                <option value={MenuType.BREAKFAST}>Breakfast</option>
                <option value={MenuType.LUNCH}>Lunch</option>
                <option value={MenuType.DINNER}>Dinner</option>
                <option value={MenuType.SNACK}>Snack</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Add Foods Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Foods
          </h2>
          <AutocompleteSearch onSelectAliment={handleAlimentSelect} />
        </div>

        {/* Weight Input Dialog */}
        {selectedAliment && (
          <WeightInputDialog
            alimentName={selectedAliment.name}
            gramsToCarbohydrate={selectedAliment.gramsToCarbohydrate}
            isOpen={true}
            onAdd={handleWeightConfirm}
            onCancel={handleWeightCancel}
          />
        )}

        {/* Menu Items */}
        {items.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Foods ({items.length})
            </h2>
            <MenuItemsList
              items={items}
              onRemoveItem={removeItem}
              onUpdateWeight={updateItemWeight}
            />
          </div>
        )}

        {/* Menu Summary */}
        {items.length > 0 && (
          <div className="mb-6">
            <MenuSummary
              totalWeight={totalWeight}
              totalRations={totalRations}
              rationsByCategory={rationsByCategory}
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveMenu} disabled={!isFormValid || isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Menu"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
