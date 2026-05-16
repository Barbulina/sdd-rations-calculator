import { RationsType } from "@/src/domain/models/RationsType";

const CATEGORY_VAR_MAP: Record<string, string> = {
  [RationsType.lacteal]: "lacteal",
  [RationsType.cereals_flours_pulses_legumes_tubers]:
    "cereals-flours-pulses-legumes-tubers",
  [RationsType.fruits]: "fruits",
  [RationsType.vegetables]: "vegetables",
  [RationsType.oily_and_dry_fruit]: "oily-dry-fruits",
  [RationsType.drinks]: "drinks",
  [RationsType.others]: "others",
};

export function getCategoryColorVar(type: RationsType | string): string {
  const key = CATEGORY_VAR_MAP[type] ?? "others";
  return `var(--category-colors-category-${key})`;
}

export function getCategoryLabel(type: RationsType | string): string {
  return type
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
