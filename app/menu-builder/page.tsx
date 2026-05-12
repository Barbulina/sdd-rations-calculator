"use client";

import { useState } from "react";
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

export default function MenuBuilderPage() {
  const router = useRouter();
  const repository = useMenuRepository();
  const [selectedAliment, setSelectedAliment] = useState<AlimentInfo | null>(
    null,
  );
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
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

  const handleAlimentSelect = (aliment: AlimentInfo) => {
    setSelectedAliment(aliment);
  };

  const handleWeightConfirm = (weight: number) => {
    if (selectedAliment) {
      if (editingItemId) {
        updateItemWeight(editingItemId, weight);
        setEditingItemId(null);
      } else {
        addItem(selectedAliment, weight);
      }
      setSelectedAliment(null);
    }
  };

  const handleWeightCancel = () => {
    setSelectedAliment(null);
    setEditingItemId(null);
  };

  const handleEditWeight = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      setEditingItemId(itemId);
      setSelectedAliment(item.aliment);
    }
  };

  const handleSaveMenu = async () => {
    if (menuName.trim() && menuType && items.length > 0) {
      const menu = await saveMenu(menuName, menuType as MenuType);
      if (menu) {
        router.push("/");
      }
    }
  };

  const isFormValid =
    menuName.trim() !== "" && menuType !== "" && items.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader title="Create Menu" backHref="/" />

      {/* Menu Name Input */}
      <div className="mb-6">
        <label
          htmlFor="menu-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Menu Name
        </label>
        <input
          type="text"
          id="menu-name"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          placeholder="Enter menu name"
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          maxLength={200}
        />
      </div>

      {/* Menu Type Select */}
      <div className="mb-6">
        <label
          htmlFor="menu-type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Menu Type
        </label>
        <select
          id="menu-type"
          value={menuType}
          onChange={(e) => setMenuType(e.target.value as MenuType | "")}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select a type...</option>
          <option value={MenuType.BREAKFAST}>Breakfast</option>
          <option value={MenuType.LUNCH}>Lunch</option>
          <option value={MenuType.DINNER}>Dinner</option>
          <option value={MenuType.SNACK}>Snack</option>
        </select>
      </div>

      {/* Aliment Search */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          Add Aliments
        </h2>
        <AutocompleteSearch onSelectAliment={handleAlimentSelect} />
      </div>

      {/* Weight Input Dialog */}
      {selectedAliment && (
        <WeightInputDialog
          alimentName={selectedAliment.name}
          isOpen={true}
          onAdd={handleWeightConfirm}
          onCancel={handleWeightCancel}
        />
      )}

      {/* Menu Items List */}
      {items.length > 0 && (
        <div className="mb-6">
          <MenuItemsList
            items={items}
            onRemove={removeItem}
            onEditWeight={handleEditWeight}
          />
        </div>
      )}

      {/* Menu Summary */}
      {items.length > 0 && (
        <div className="mb-6">
          <MenuSummary totalWeight={totalWeight} totalRations={totalRations} />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        </div>
      )}

      {/* Save Buttons - AT BOTTOM */}
      <div className="mt-8 flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveMenu}
          disabled={!isFormValid || isLoading}
          className={`px-6 py-2 rounded-md font-medium transition ${
            isFormValid && !isLoading
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Saving..." : "Save Menu"}
        </button>
      </div>
    </div>
  );
}
