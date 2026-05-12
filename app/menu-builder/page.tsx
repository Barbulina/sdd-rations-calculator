"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AutocompleteSearch } from "@/app/components/menu-builder/AutocompleteSearch";
import { WeightInputDialog } from "@/app/components/menu-builder/WeightInputDialog";
import { MenuItemsList } from "@/app/components/menu-builder/MenuItemsList";
import { MenuSummary } from "@/app/components/menu-builder/MenuSummary";
import { SaveMenuForm } from "@/app/components/menu-builder/SaveMenuForm";
import { useMenuBuilder } from "@/src/application/hooks/useMenuBuilder";
import { useMenuRepository } from "@/src/application/contexts/MenuRepositoryContext";
import { AlimentInfo } from "@/src/domain/models/AlimentInfo";

export default function MenuBuilderPage() {
  const router = useRouter();
  const repository = useMenuRepository();
  const [selectedAliment, setSelectedAliment] = useState<AlimentInfo | null>(
    null
  );
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

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

  const handleSaveMenu = async (name: string, type: string) => {
    const menu = await saveMenu(name, type);
    if (menu) {
      router.push("/");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Create Menu
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search for aliments, add weights, and save your menu
        </p>
      </div>

      {/* Aliment Search */}
      <div className="mb-6">
        <AutocompleteSearch
          onSelectAliment={handleAlimentSelect}
        />
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
          <MenuSummary
            totalWeight={totalWeight}
            totalRations={totalRations}
          />
        </div>
      )}

      {/* Save Menu Form */}
      <div className="mt-8">
        <SaveMenuForm
          hasItems={items.length > 0}
          onSave={handleSaveMenu}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
