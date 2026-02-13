'use client';

import type { UnifiedAliment } from '@/src/domain/repositories/CompositeAlimentRepository';

interface AlimentSuggestionItemProps {
  aliment: UnifiedAliment;
  isHighlighted: boolean;
  onClick: () => void;
  id: string;
}

export function AlimentSuggestionItem({
  aliment,
  isHighlighted,
  onClick,
  id,
}: AlimentSuggestionItemProps) {
  // Check if it's a custom aliment
  const isCustom = 'isCustom' in aliment && aliment.isCustom;

  // Format category name (remove underscores and capitalize)
  const categoryName = aliment.type
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <li
      id={id}
      role="option"
      aria-selected={isHighlighted}
      onClick={onClick}
      className={`px-4 py-3 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
        isHighlighted
          ? 'bg-blue-50 dark:bg-blue-900/30'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
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
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <span>{aliment.gramsToCarbohydrate}g</span>
            {aliment.bloodGlucoseIndex !== undefined && (
              <span>GI: {aliment.bloodGlucoseIndex}</span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 whitespace-nowrap">
            {categoryName}
          </span>
        </div>
      </div>
    </li>
  );
}
