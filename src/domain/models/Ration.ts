import { RationsType } from "./RationsType";

/**
 * Ration Entity
 *
 * Represents a food item with nutritional information for meal planning
 * and blood glucose management.
 *
 * @see ../../../specs/002-ration-menu-management/data-model.md for detailed specification
 */
export interface Ration {
  /**
   * Unique identifier for the ration
   * Format: UUID v4
   * Generated using crypto.randomUUID()
   */
  id: string;

  /**
   * Category of food aliment
   * Must be one of the RationsType enum values
   */
  type: RationsType;

  /**
   * Human-readable name of the food item
   * Constraints:
   * - Non-empty (trimmed)
   * - Maximum 200 characters
   */
  name: string;

  /**
   * Grams of food containing 10g of carbohydrates (HC)
   * Must be > 0
   */
  gramsToCarbohydrate: number;

  /**
   * Optional glycemic index value
   * Range: 0-100 (if provided)
   */
  bloodGlucoseIndex?: number;

  /**
   * Weight of food portion in grams
   * Must be > 0
   */
  weight: number;

  /**
   * Calculated ration value
   * Must be > 0
   * Formula: rations = (weight / gramsToCarbohydrate) * 10
   */
  rations: number;

  /**
   * Timestamp of creation
   * Used for sorting (newest first)
   */
  createdAt: Date;
}

/**
 * CreateRationDTO
 *
 * Data Transfer Object for creating a new ration.
 * Omits auto-generated fields (id, createdAt) which are added by the repository.
 *
 * @see ../repositories/RationRepository.ts for usage
 */
export type CreateRationDTO = Omit<Ration, "id" | "createdAt">;
