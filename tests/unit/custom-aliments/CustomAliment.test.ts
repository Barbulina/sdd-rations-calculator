/**
 * CustomAliment Domain Model Tests
 *
 * Unit tests for CustomAliment validation logic.
 * Following TDD: Write tests first (RED), then implement (GREEN), then refactor.
 *
 * @see specs/003-aliment-catalog/data-model.md for validation rules
 */

import { describe, it, expect } from "vitest";
import { RationsType } from "@/src/domain/models/RationsType";
import {
  validateCustomAliment,
  type CreateCustomAlimentDTO,
} from "@/src/domain/models/CustomAliment";

describe("CustomAliment Validation", () => {
  describe("Name validation", () => {
    it("should reject empty name", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      };

      const result = validateCustomAliment(dto);

      expect(result.valid).toBe(false);
      expect(result.errors.name).toBe("Name is required");
    });

    it("should reject whitespace-only name", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "   ",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      };

      const result = validateCustomAliment(dto);

      expect(result.valid).toBe(false);
      expect(result.errors.name).toBe("Name is required");
    });

    it("should reject name longer than 200 characters", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "a".repeat(201),
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      };

      const result = validateCustomAliment(dto);

      expect(result.valid).toBe(false);
      expect(result.errors.name).toBe("Name must be 200 characters or less");
    });

    it("should accept valid name", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Manzana ecológica",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      };

      const result = validateCustomAliment(dto);

      expect(result.errors.name).toBeUndefined();
    });

    it("should trim whitespace from name", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "  Manzana  ",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      };

      const result = validateCustomAliment(dto);

      expect(result.errors.name).toBeUndefined();
    });
  });

  describe("GramsToCarbohydrate validation", () => {
    it("should reject zero value", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 0,
      };

      const result = validateCustomAliment(dto);

      expect(result.valid).toBe(false);
      expect(result.errors.gramsToCarbohydrate).toBe("Must be greater than 0");
    });

    it("should reject negative value", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: -10,
      };

      const result = validateCustomAliment(dto);

      expect(result.valid).toBe(false);
      expect(result.errors.gramsToCarbohydrate).toBe("Must be greater than 0");
    });

    it("should accept positive value", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 110,
      };

      const result = validateCustomAliment(dto);

      expect(result.errors.gramsToCarbohydrate).toBeUndefined();
    });

    it("should accept decimal value", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 110.5,
      };

      const result = validateCustomAliment(dto);

      expect(result.errors.gramsToCarbohydrate).toBeUndefined();
    });
  });

  describe("BloodGlucoseIndex validation", () => {
    it("should accept undefined (optional field)", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
        bloodGlucoseIndex: undefined,
      };

      const result = validateCustomAliment(dto);

      expect(result.errors.bloodGlucoseIndex).toBeUndefined();
    });

    it("should reject value below 0", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
        bloodGlucoseIndex: -1,
      };

      const result = validateCustomAliment(dto);

      expect(result.valid).toBe(false);
      expect(result.errors.bloodGlucoseIndex).toBe(
        "Blood glucose index must be between 0-100",
      );
    });

    it("should reject value above 100", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
        bloodGlucoseIndex: 101,
      };

      const result = validateCustomAliment(dto);

      expect(result.valid).toBe(false);
      expect(result.errors.bloodGlucoseIndex).toBe(
        "Blood glucose index must be between 0-100",
      );
    });

    it("should accept value of 0", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
        bloodGlucoseIndex: 0,
      };

      const result = validateCustomAliment(dto);

      expect(result.errors.bloodGlucoseIndex).toBeUndefined();
    });

    it("should accept value of 100", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
        bloodGlucoseIndex: 100,
      };

      const result = validateCustomAliment(dto);

      expect(result.errors.bloodGlucoseIndex).toBeUndefined();
    });

    it("should accept value in range", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
        bloodGlucoseIndex: 50,
      };

      const result = validateCustomAliment(dto);

      expect(result.errors.bloodGlucoseIndex).toBeUndefined();
    });
  });

  describe("Type validation", () => {
    it("should accept all valid RationsType values", () => {
      const types = [
        RationsType.lacteal,
        RationsType.cereals_flours_pulses_legumes_tubers,
        RationsType.fruits,
        RationsType.vegetables,
        RationsType.oily_and_dry_fruit,
        RationsType.drinks,
        RationsType.others,
      ];

      types.forEach((type) => {
        const dto: CreateCustomAlimentDTO = {
          name: "Test",
          type,
          gramsToCarbohydrate: 100,
        };

        const result = validateCustomAliment(dto);

        expect(result.errors.type).toBeUndefined();
      });
    });
  });

  describe("Overall validation", () => {
    it("should return valid:true when all fields are valid", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Manzana ecológica",
        type: RationsType.fruits,
        gramsToCarbohydrate: 110,
        bloodGlucoseIndex: 38,
      };

      const result = validateCustomAliment(dto);

      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it("should return valid:false when multiple fields invalid", () => {
      const dto: CreateCustomAlimentDTO = {
        name: "",
        type: RationsType.fruits,
        gramsToCarbohydrate: -10,
        bloodGlucoseIndex: 150,
      };

      const result = validateCustomAliment(dto);

      expect(result.valid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.gramsToCarbohydrate).toBeDefined();
      expect(result.errors.bloodGlucoseIndex).toBeDefined();
    });
  });
});
