import type { MenuItem } from "@/specs/004-menu-builder/contracts/types";
import { MenuItemCard } from "./MenuItemCard";

interface MenuItemsListProps {
  items: MenuItem[];
  onUpdateWeight: (itemId: string, weight: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function MenuItemsList({
  items,
  onUpdateWeight,
  onRemoveItem,
}: MenuItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="max-w-sm mx-auto">
          <svg
            className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            No aliments added yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Search for an aliment above to add it to your menu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="menu-items-list" className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <MenuItemCard
            item={item}
            onUpdateWeight={onUpdateWeight}
            onRemove={onRemoveItem}
          />
        </div>
      ))}
    </div>
  );
}
