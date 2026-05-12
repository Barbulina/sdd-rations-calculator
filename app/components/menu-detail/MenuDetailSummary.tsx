"use client";

interface MenuDetailSummaryProps {
  totalRations: number;
  totalWeight: number;
}

export function MenuDetailSummary({ totalRations, totalWeight }: MenuDetailSummaryProps) {
  return (
    <div className="flex gap-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mt-4">
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Total Rations
        </p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {totalRations.toFixed(2)}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Total Weight
        </p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {Math.round(totalWeight)}g
        </p>
      </div>
    </div>
  );
}
