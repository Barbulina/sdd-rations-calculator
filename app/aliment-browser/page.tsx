"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { AlimentInfo } from "@/src/domain/models/AlimentInfo";
import { RationsType } from "@/src/domain/models/RationsType";
import { useCompositeAliments } from "@/src/application/hooks/useCompositeAliments";
import type { UnifiedAliment } from "@/src/domain/repositories/CompositeAlimentRepository";
import { PageHeader } from "@/app/components/PageHeader";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";

const CATEGORY_LABELS: Record<RationsType, string> = {
  [RationsType.lacteal]: "Lácteos",
  [RationsType.cereals_flours_pulses_legumes_tubers]: "Cereales y Legumbres",
  [RationsType.fruits]: "Frutas",
  [RationsType.vegetables]: "Hortalizas",
  [RationsType.oily_and_dry_fruit]: "Frutos Secos",
  [RationsType.drinks]: "Bebidas",
  [RationsType.others]: "Otros",
};

export default function AlimentBrowserPage() {
  const compositeRepository = useCompositeAliments();
  const [aliments, setAliments] = useState<UnifiedAliment[]>([]);
  const [filteredAliments, setFilteredAliments] = useState<UnifiedAliment[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RationsType | "all">(
    "all",
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load all aliments on mount
  useEffect(() => {
    compositeRepository.findAll().then((data) => {
      setAliments(data);
      setFilteredAliments(data);
      setIsLoading(false);
    });
  }, [compositeRepository]);

  // Filter aliments when search or category changes
  useEffect(() => {
    let results = aliments;

    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter((a) => a.type === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((a) => a.name.toLowerCase().includes(query));
    }

    setFilteredAliments(results);
  }, [searchQuery, selectedCategory, aliments]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando catálogo...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Catálogo de Alimentos"
        backHref="/"
        action={
          <Link
            href="/aliment-browser/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
          >
            + Crear Alimento
          </Link>
        }
      />

      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar alimento
          </label>
          <Input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej: manzana, arroz, yogurt..."
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoría
          </label>
          <Select
            id="category"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as RationsType | "all")
            }
          >
            <option value="all">Todas las categorías</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {filteredAliments.length} de {aliments.length} alimentos
        </div>
      </div>

      {/* Results Grid */}
      {filteredAliments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No se encontraron alimentos que coincidan con los criterios de
          búsqueda.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAliments.map((aliment, index) => {
            const isCustom = "isCustom" in aliment && aliment.isCustom === true;

            return (
              <div
                key={isCustom ? aliment.id : index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-base capitalize text-gray-900 dark:text-gray-100">
                    {aliment.name}
                  </h3>
                  {isCustom && (
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded">
                      Custom
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Categoría:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {CATEGORY_LABELS[aliment.type]}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Gramos (10g HC):</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {aliment.gramsToCarbohydrate}g
                    </span>
                  </div>

                  {aliment.bloodGlucoseIndex !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Índice Glucémico:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {aliment.bloodGlucoseIndex}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
