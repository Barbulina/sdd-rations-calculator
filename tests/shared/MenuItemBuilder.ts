import type { AlimentInfo } from "@/src/domain/models/AlimentInfo";
import { RationsType } from "@/src/domain/models/RationsType";

const defaultAliment: AlimentInfo = {
  name: "manzana",
  type: RationsType.fruits,
  gramsToCarbohydrate: 110,
  bloodGlucoseIndex: 38,
};

export class MenuItemBuilder {
  private id: string = "test-uuid-1234";
  private aliment: AlimentInfo = defaultAliment;
  private weightGrams: number = 150;
  private rations: number = 1.36;

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withAliment(aliment: AlimentInfo): this {
    this.aliment = aliment;
    this.rations = Number(
      (this.weightGrams / aliment.gramsToCarbohydrate).toFixed(2),
    );
    return this;
  }

  withWeight(weightGrams: number): this {
    this.weightGrams = weightGrams;
    this.rations = Number(
      (weightGrams / this.aliment.gramsToCarbohydrate).toFixed(2),
    );
    return this;
  }

  withRations(rations: number): this {
    this.rations = rations;
    return this;
  }

  build() {
    return {
      id: this.id,
      aliment: this.aliment,
      weightGrams: this.weightGrams,
      rations: this.rations,
    };
  }

  buildWithInvalidWeight() {
    return { ...this.build(), weightGrams: -10 };
  }

  buildWithZeroWeight() {
    return { ...this.build(), weightGrams: 0 };
  }

  buildWithExcessiveWeight() {
    return { ...this.build(), weightGrams: 15000 };
  }
}

export function createMenuItem(overrides?: Record<string, unknown>) {
  return {
    id: "test-uuid-1234",
    aliment: defaultAliment,
    weightGrams: 150,
    rations: 1.36,
    ...overrides,
  };
}

export function createTestAliment(overrides?: Partial<AlimentInfo>): AlimentInfo {
  return { ...defaultAliment, ...overrides };
}
