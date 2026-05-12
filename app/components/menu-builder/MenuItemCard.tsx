'use client';

import type { MenuItem } from '@/specs/004-menu-builder/contracts/types';

interface MenuItemCardProps {
  item: MenuItem;
  onUpdateWeight: (itemId: string, weight: number) => void;
  onRemove: (itemId: string) => void;
}

export function MenuItemCard({
  item,
  onUpdateWeight,
  onRemove,
}: MenuItemCardProps) {
  const isCustom = 'isCustom' in item.aliment && item.aliment.isCustom;

  // Format category name
  const categoryName = item.aliment.type
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10000) {
      onUpdateWeight(item.id, value);
    }
  };

  return (
    <div
      data-testid={`menu-item-card-${item.id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {item.aliment.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
              {categoryName}
            </span>
            {isCustom && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                Custom
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.aliment.name}`}
          className="ml-2 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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

      {/* Aliment Data */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div>
          <span className="text-gray-600 dark:text-gray-400">1 ration = </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {item.aliment.gramsToCarbohydrate}g
          </span>
        </div>
        {item.aliment.bloodGlucoseIndex !== undefined && (
          <div>
            <span className="text-gray-600 dark:text-gray-400">GI: </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {item.aliment.bloodGlucoseIndex}
            </span>
          </div>
        )}
      </div>

      {/* Weight Input and Rations */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`weight-${item.id}`}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Weight (g)
          </label>
          <input
            id={`weight-${item.id}`}
            type="number"
            min="1"
            max="10000"
            value={item.weightGrams}
            onChange={handleWeightChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rations
          </span>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {item.rations.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              rations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
