import { RationsType } from "./RationsType";

/**
 * AlimentInfo
 *
 * Represents a pre-defined food aliment with nutritional information.
 * Used as a catalog/template for creating rations.
 *
 * Similar to Ration but without id, weight, rations, and createdAt
 * since these are catalog entries, not user-created instances.
 */
export interface AlimentInfo {
  /** Name of the food aliment */
  name: string;

  /** Grams of food containing 10g of carbohydrates (HC) */
  gramsToCarbohydrate: number;

  /** Optional glycemic index value (0-100) */
  bloodGlucoseIndex?: number;

  /** Category of food aliment */
  type: RationsType;
}
