import type { UnifiedAliment } from "@/src/domain/repositories/CompositeAlimentRepository";
import {
  getCategoryColorVar,
  getCategoryLabel,
} from "@/app/lib/categoryColors";

interface AlimentSuggestionItemProps {
  aliment: UnifiedAliment;
  isHighlighted: boolean;
  onClick: () => void;
  id: string;
  style?: React.CSSProperties;
}

export function AlimentSuggestionItem({
  aliment,
  isHighlighted,
  onClick,
  id,
  style,
}: AlimentSuggestionItemProps) {
  const isCustom = "isCustom" in aliment && aliment.isCustom;
  const categoryColor = getCategoryColorVar(aliment.type);
  const categoryLabel = getCategoryLabel(aliment.type);

  return (
    <li
      id={id}
      role="option"
      aria-selected={isHighlighted}
      onClick={onClick}
      style={style}
      className={`px-4 py-3 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-all duration-150 ${
        isHighlighted
          ? "bg-blue-50 dark:bg-blue-900/30"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: categoryColor }}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {aliment.name}
            </span>
            {isCustom && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 flex-shrink-0">
                Custom
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            <span>{aliment.gramsToCarbohydrate}g / ration</span>
            {aliment.bloodGlucoseIndex !== undefined && (
              <span>GI: {aliment.bloodGlucoseIndex}</span>
            )}
          </div>
        </div>
        <span
          className="shrink-0 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap"
          style={{
            backgroundColor: `${categoryColor}18`,
            color: categoryColor,
          }}
        >
          {categoryLabel}
        </span>
      </div>
    </li>
  );
}
