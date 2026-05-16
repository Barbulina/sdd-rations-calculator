interface MenuSummaryProps {
  totalWeight: number;
  totalRations: number;
  rationsByCategory?: Array<{ label: string; value: number; color: string }>;
}

export function MenuSummary({
  totalWeight,
  totalRations,
  rationsByCategory,
}: MenuSummaryProps) {
  return (
    <div
      data-testid="menu-summary"
      aria-live="polite"
      aria-label="Menu totals summary"
      className="bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5"
    >
      <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
        Total
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium mb-0.5">
            Total Weight
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalWeight}
            <span className="text-base font-normal text-gray-500 dark:text-gray-400 ml-1">
              g
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium mb-0.5">
            Total Rations
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalRations.toFixed(2)}
          </p>
        </div>
      </div>

      {rationsByCategory && rationsByCategory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-blue-200/60 dark:border-blue-800/60">
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
