import type { MenuItem } from "@/specs/004-menu-builder/contracts/types";
import {
  getCategoryColorVar,
  getCategoryLabel,
} from "@/app/lib/categoryColors";
import { useMemo } from "react";

interface MenuDetailSummaryProps {
  totalRations: number;
  totalWeight: number;
  items?: MenuItem[];
}

export function MenuDetailSummary({
  totalRations,
  totalWeight,
  items,
}: MenuDetailSummaryProps) {
  const rationsByCategory = useMemo(() => {
    if (!items) return [];
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

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Summary
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">
            Total Rations
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalRations.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">
            Total Weight
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(totalWeight)}
            <span className="text-base font-normal text-gray-500 dark:text-gray-400 ml-1">
              g
            </span>
          </p>
        </div>
      </div>

      {rationsByCategory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {rationsByCategory.map((cat) => (
              <span
                key={cat.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: `${cat.color}18`,
                  color: cat.color,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden="true"
                />
                {cat.label}: {cat.value.toFixed(1)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
