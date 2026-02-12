/**
 * Test builder for MenuItem
 * Follows the builder pattern for test fixtures
 */

import type { AlimentInfo } from '@/src/domain/models/AlimentInfo';
import type { MenuItem } from '../../../specs/004-menu-builder/contracts/types';

/**
 * Default aliment for testing
 */
const defaultAliment: AlimentInfo = {
  name: 'manzana',
  type: 'frutas',
  gramsToCarbohydrate: 110,
  bloodGlucoseIndex: 38,
};

/**
 * MenuItemBuilder - fluent interface for creating test MenuItem fixtures
 */
export class MenuItemBuilder {
  private id: string = 'test-uuid-1234';
  private aliment: AlimentInfo = defaultAliment;
  private weightGrams: number = 150;
  private rations: number = 1.36;

  /**
   * Set custom ID
   */
  withId(id: string): this {
    this.id = id;
    return this;
  }

  /**
   * Set custom aliment
   */
  withAliment(aliment: AlimentInfo): this {
    this.aliment = aliment;
    // Recalculate rations based on weight and new aliment
    this.rations = Number((this.weightGrams / aliment.gramsToCarbohydrate).toFixed(2));
    return this;
  }

  /**
   * Set custom weight
   */
  withWeight(weightGrams: number): this {
    this.weightGrams = weightGrams;
    // Recalculate rations based on new weight
    this.rations = Number((weightGrams / this.aliment.gramsToCarbohydrate).toFixed(2));
    return this;
  }

  /**
   * Set rations directly (for testing edge cases)
   */
  withRations(rations: number): this {
    this.rations = rations;
    return this;
  }

  /**
   * Build the MenuItem
   */
  build(): MenuItem {
    return {
      id: this.id,
      aliment: this.aliment,
      weightGrams: this.weightGrams,
      rations: this.rations,
    };
  }

  /**
   * Build with invalid weight (for testing validation)
   */
  buildWithInvalidWeight(): MenuItem {
    return {
      ...this.build(),
      weightGrams: -10,
    };
  }

  /**
   * Build with zero weight
   */
  buildWithZeroWeight(): MenuItem {
    return {
      ...this.build(),
      weightGrams: 0,
    };
  }

  /**
   * Build with excessive weight
   */
  buildWithExcessiveWeight(): MenuItem {
    return {
      ...this.build(),
      weightGrams: 15000,
    };
  }
}

/**
 * Helper function to create a default MenuItem
 */
export function createMenuItem(overrides?: Partial<MenuItem>): MenuItem {
  return {
    id: 'test-uuid-1234',
    aliment: defaultAliment,
    weightGrams: 150,
    rations: 1.36,
    ...overrides,
  };
}

/**
 * Helper function to create a default aliment
 */
export function createTestAliment(overrides?: Partial<AlimentInfo>): AlimentInfo {
  return {
    name: 'manzana',
    type: 'frutas',
    gramsToCarbohydrate: 110,
    bloodGlucoseIndex: 38,
    ...overrides,
  };
}
