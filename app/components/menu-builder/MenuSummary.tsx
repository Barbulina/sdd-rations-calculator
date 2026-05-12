/**
 * MenuSummary Component
 * Displays total weight and total rations for the menu
 */

"use client";

interface MenuSummaryProps {
  totalWeight: number;
  totalRations: number;
}

export function MenuSummary({ totalWeight, totalRations }: MenuSummaryProps) {
  return (
    <div
      data-testid="menu-summary"
      aria-live="polite"
      aria-label="Menu totals summary"
      className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4"
    >
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Total
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Weight */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Weight
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalWeight}
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-1">
              g
            </span>
          </p>
        </div>

        {/* Total Rations */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Rations
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalRations.toFixed(2)}
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-1">
              rations
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
