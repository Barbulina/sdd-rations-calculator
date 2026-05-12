/**
 * MenuItem domain model
 * Represents a single aliment in a menu with its weight and calculated rations.
 */

import type { AlimentInfo } from "./AlimentInfo";
import type { CustomAliment } from "./CustomAliment";

export class MenuItem {
  readonly id: string;
  readonly aliment: AlimentInfo | CustomAliment;
  readonly weightGrams: number;
  readonly rations: number;

  /**
   * Create a new MenuItem
   *
   * @param aliment - Aliment from catalog or custom aliments
   * @param weight Grams - Weight in grams (must be > 0 and <= 10000)
   * @throws Error if weight is invalid
   */
  constructor(aliment: AlimentInfo | CustomAliment, weightGrams: number) {
    // Validate weight
    this.validateWeight(weightGrams);

    // Generate UUID
    this.id = crypto.randomUUID();

    // Store aliment as snapshot (deep copy to prevent mutations)
    this.aliment = { ...aliment };

    // Store weight
    this.weightGrams = weightGrams;

    // Calculate rations
    this.rations = this.calculateRations(
      weightGrams,
      aliment.gramsToCarbohydrate,
    );

    // Make properties immutable
    Object.freeze(this);
  }

  /**
   * Validate weight is within acceptable range
   */
  private validateWeight(weightGrams: number): void {
    if (weightGrams <= 0) {
      throw new Error("Weight must be greater than 0");
    }

    if (weightGrams > 10000) {
      throw new Error("Weight cannot exceed 10000g");
    }
  }

  /**
   * Calculate rations with 2 decimal precision
   */
  private calculateRations(
    weightGrams: number,
    gramsToCarbohydrate: number,
  ): number {
    const raw = weightGrams / gramsToCarbohydrate;
    return Number(raw.toFixed(2));
  }
}
