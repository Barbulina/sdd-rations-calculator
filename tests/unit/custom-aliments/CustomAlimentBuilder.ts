/**
 * CustomAlimentBuilder
 *
 * Test builder for CustomAliment entities following the Builder Pattern.
 * Provides default valid values and fluent API for test data construction.
 *
 * @see Constitution Principle II: Testing Strategy
 */

import type { CustomAliment } from "@/src/domain/models/CustomAliment";
import { RationsType } from "@/src/domain/models/RationsType";

export class CustomAlimentBuilder {
  private data: CustomAliment = {
    id: "test-id-123",
    name: "Test Aliment",
    type: RationsType.fruits,
    gramsToCarbohydrate: 100,
    bloodGlucoseIndex: 50,
    isCustom: true,
    createdAt: new Date("2026-02-12T10:00:00Z"),
  };

  /**
   * Set custom aliment ID
   */
  withId(id: string): this {
    this.data.id = id;
    return this;
  }

  /**
   * Set custom aliment name
   */
  withName(name: string): this {
    this.data.name = name;
    return this;
  }

  /**
   * Set custom aliment type/category
   */
  withType(type: RationsType): this {
    this.data.type = type;
    return this;
  }

  /**
   * Set grams to carbohydrate value
   */
  withGramsToCarbohydrate(grams: number): this {
    this.data.gramsToCarbohydrate = grams;
    return this;
  }

  /**
   * Set blood glucose index
   */
  withBloodGlucoseIndex(index: number | undefined): this {
    this.data.bloodGlucoseIndex = index;
    return this;
  }

  /**
   * Set creation timestamp
   */
  withCreatedAt(date: Date): this {
    this.data.createdAt = date;
    return this;
  }

  /**
   * Set update timestamp
   */
  withUpdatedAt(date: Date | undefined): this {
    this.data.updatedAt = date;
    return this;
  }

  /**
   * Build the CustomAliment instance
   */
  build(): CustomAliment {
    return { ...this.data };
  }
}

/**
 * Factory function for creating a builder with default values
 */
export function aCustomAliment(): CustomAlimentBuilder {
  return new CustomAlimentBuilder();
}
