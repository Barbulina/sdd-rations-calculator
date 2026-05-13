/**
 * Tests for MenuItem domain model
 * Following TDD - RED phase (tests first, then implementation)
 */

import { describe, it, expect } from "vitest";
import { MenuItem } from "@/src/domain/models/MenuItem";
import {
  MenuItemBuilder,
  createTestAliment,
} from "../../shared/MenuItemBuilder";

describe("MenuItem", () => {
  describe("creation", () => {
    it("should create MenuItem with valid data", () => {
      const aliment = createTestAliment();
      const menuItem = new MenuItem(aliment, 150);

      expect(menuItem.id).toBeDefined();
      expect(menuItem.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(menuItem.aliment).toEqual(aliment);
      expect(menuItem.weightGrams).toBe(150);
      expect(menuItem.rations).toBe(1.36);
    });

    it("should generate unique UUIDs for different instances", () => {
      const aliment = createTestAliment();
      const menuItem1 = new MenuItem(aliment, 150);
      const menuItem2 = new MenuItem(aliment, 150);

      expect(menuItem1.id).not.toBe(menuItem2.id);
    });
  });

  describe("weight validation", () => {
    it("should reject zero weight", () => {
      const aliment = createTestAliment();

      expect(() => new MenuItem(aliment, 0)).toThrow(
        "Weight must be greater than 0",
      );
    });

    it("should reject negative weight", () => {
      const aliment = createTestAliment();

      expect(() => new MenuItem(aliment, -10)).toThrow(
        "Weight must be greater than 0",
      );
    });

    it("should reject weight exceeding 10kg (10000g)", () => {
      const aliment = createTestAliment();

      expect(() => new MenuItem(aliment, 10001)).toThrow(
        "Weight cannot exceed 10000g",
      );
    });

    it("should accept weight at 10kg boundary", () => {
      const aliment = createTestAliment();
      const menuItem = new MenuItem(aliment, 10000);

      expect(menuItem.weightGrams).toBe(10000);
    });

    it("should accept minimum valid weight (1g)", () => {
      const aliment = createTestAliment();
      const menuItem = new MenuItem(aliment, 1);

      expect(menuItem.weightGrams).toBe(1);
      expect(menuItem.rations).toBe(0.01); // 1 / 110 = 0.009... → 0.01 (2 decimals)
    });
  });

  describe("rations calculation", () => {
    it("should calculate rations correctly", () => {
      const aliment = createTestAliment({ gramsToCarbohydrate: 110 });
      const menuItem = new MenuItem(aliment, 150);

      expect(menuItem.rations).toBe(1.36); // 150 / 110 = 1.363636... → 1.36
    });

    it("should calculate rations with different aliment", () => {
      const aliment = createTestAliment({
        name: "pan integral",
        gramsToCarbohydrate: 20,
      });
      const menuItem = new MenuItem(aliment, 50);

      expect(menuItem.rations).toBe(2.5); // 50 / 20 = 2.5
    });

    it("should calculate rations for very small weight", () => {
      const aliment = createTestAliment({ gramsToCarbohydrate: 110 });
      const menuItem = new MenuItem(aliment, 5);

      expect(menuItem.rations).toBe(0.05); // 5 / 110 = 0.045... → 0.05
    });

    it("should calculate rations for very large weight", () => {
      const aliment = createTestAliment({ gramsToCarbohydrate: 50 });
      const menuItem = new MenuItem(aliment, 5000);

      expect(menuItem.rations).toBe(100); // 5000 / 50 = 100
    });
  });

  describe("rations precision", () => {
    it("should round rations to 2 decimal places", () => {
      const aliment = createTestAliment({ gramsToCarbohydrate: 110 });
      const menuItem = new MenuItem(aliment, 150);

      // 150 / 110 = 1.363636363636...
      expect(menuItem.rations).toBe(1.36);
      expect(menuItem.rations.toString()).toMatch(/^\d+\.\d{1,2}$/);
    });

    it("should preserve trailing zeros in decimals", () => {
      const aliment = createTestAliment({ gramsToCarbohydrate: 100 });
      const menuItem = new MenuItem(aliment, 250);

      // 250 / 100 = 2.5
      expect(menuItem.rations).toBe(2.5);
    });

    it("should handle integer results correctly", () => {
      const aliment = createTestAliment({ gramsToCarbohydrate: 50 });
      const menuItem = new MenuItem(aliment, 100);

      // 100 / 50 = 2
      expect(menuItem.rations).toBe(2);
    });
  });

  describe("aliment reference", () => {
    it("should store complete aliment data", () => {
      const aliment = createTestAliment({
        name: "test aliment",
        type: "carnes",
        gramsToCarbohydrate: 100,
        bloodGlucoseIndex: 50,
      });
      const menuItem = new MenuItem(aliment, 200);

      expect(menuItem.aliment.name).toBe("test aliment");
      expect(menuItem.aliment.type).toBe("carnes");
      expect(menuItem.aliment.gramsToCarbohydrate).toBe(100);
      expect(menuItem.aliment.bloodGlucoseIndex).toBe(50);
    });

    it("should store aliment as snapshot (not reference)", () => {
      const aliment = createTestAliment();
      const menuItem = new MenuItem(aliment, 150);

      // Modify original aliment
      aliment.name = "modified";
      aliment.gramsToCarbohydrate = 200;

      // MenuItem should preserve original values
      expect(menuItem.aliment.name).toBe("manzana");
      expect(menuItem.aliment.gramsToCarbohydrate).toBe(110);
    });
  });

  describe("UUID generation", () => {
    it("should use crypto.randomUUID for ID generation", () => {
      const aliment = createTestAliment();
      const menuItem = new MenuItem(aliment, 150);

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // where y is one of [8, 9, a, b]
      expect(menuItem.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("should create different IDs for each instance", () => {
      const aliment = createTestAliment();
      const ids = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const menuItem = new MenuItem(aliment, 150);
        ids.add(menuItem.id);
      }

      expect(ids.size).toBe(100); // All unique
    });
  });

  describe("immutability", () => {
    it("should not allow modification of weightGrams after creation", () => {
      const aliment = createTestAliment();
      const menuItem = new MenuItem(aliment, 150);

      // TypeScript should prevent this, but test runtime behavior
      expect(() => {
        // @ts-expect-error Testing immutability
        menuItem.weightGrams = 200;
      }).toThrow();
    });

    it("should not allow modification of rations after creation", () => {
      const aliment = createTestAliment();
      const menuItem = new MenuItem(aliment, 150);

      // TypeScript should prevent this, but test runtime behavior
      expect(() => {
        // @ts-expect-error Testing immutability
        menuItem.rations = 5;
      }).toThrow();
    });
  });
});
