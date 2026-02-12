import type { Ration } from "@/src/domain/models/Ration";
import { RationsType } from "@/src/domain/models/RationsType";

/**
 * RationCard Component
 *
 * Displays a ration entry in card format with category-specific color coding.
 * Shows nutritional information in a 2-column grid layout.
 *
 * @param props - Component props
 * @param props.ration - Ration data to display
 *
 * @see ../../../specs/002-ration-menu-management/spec.md for design specification
 */
export interface RationCardProps {
  ration: Ration;
}

/**
 * Get TailwindCSS category color class for a ration type
 *
 * Maps each RationsType to its corresponding design token color class.
 *
 * @param type - Ration type
 * @returns Tailwind bg-category-* class name
 */
function getCategoryColorClass(type: RationsType): string {
  const colorMap: Record<RationsType, string> = {
    [RationsType.lacteal]: "bg-category-lacteal",
    [RationsType.cereals_flours_pulses_legumes_tubers]:
      "bg-category-cereals-flours-pulses-legumes-tubers",
    [RationsType.fruits]: "bg-category-fruits",
    [RationsType.vegetables]: "bg-category-vegetables",
    [RationsType.oily_and_dry_fruit]: "bg-category-oily-dry-fruits",
    [RationsType.drinks]: "bg-category-drinks",
    [RationsType.others]: "bg-category-others",
  };

  return colorMap[type] || "bg-category-others";
}

export function RationCard({ ration }: RationCardProps) {
  const bgColorClass = getCategoryColorClass(ration.type);

  return (
    <div
      className={`${bgColorClass} p-4 rounded-lg mb-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Header: Name and Type */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {ration.name}
        </h3>
        <p className="text-sm opacity-80 text-gray-700 dark:text-gray-200">
          {ration.type}
        </p>
      </div>

      {/* Nutritional Information - 2 Column Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-900 dark:text-white">
        <div>
          <span className="opacity-70">Weight:</span>
          <span className="ml-1 font-medium">{ration.weight}g</span>
        </div>
        <div>
          <span className="opacity-70">Rations:</span>
          <span className="ml-1 font-medium">{ration.rations}</span>
        </div>
        <div>
          <span className="opacity-70">Grams to HC:</span>
          <span className="ml-1 font-medium">
            {ration.gramsToCarbohydrate}g
          </span>
        </div>
        {ration.bloodGlucoseIndex !== undefined && (
          <div>
            <span className="opacity-70">IG:</span>
            <span className="ml-1 font-medium">{ration.bloodGlucoseIndex}</span>
          </div>
        )}
      </div>

      {/* Timestamp */}
      <div className="mt-3 text-xs opacity-60 text-gray-700 dark:text-gray-300">
        Created: {new Date(ration.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
