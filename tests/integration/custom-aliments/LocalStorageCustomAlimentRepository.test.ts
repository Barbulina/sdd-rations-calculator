/**
 * LocalStorageCustomAlimentRepository Integration Tests
 *
 * Tests verify repository implementation against CustomAlimentRepository contract.
 * Uses real localStorage (not mocked) for integration testing.
 *
 * Following TDD: Write tests first (RED), then implement (GREEN), then refactor.
 *
 * @see specs/003-aliment-catalog/contracts/CustomAlimentRepository.ts
 */

import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageCustomAlimentRepository } from "@/src/infrastructure/repositories/LocalStorageCustomAlimentRepository";
import { RationsType } from "@/src/domain/models/RationsType";
import type { CreateCustomAlimentDTO } from "@/src/domain/models/CustomAliment";

describe("LocalStorageCustomAlimentRepository", () => {
  let repository: LocalStorageCustomAlimentRepository;
  const STORAGE_KEY = "sdd-rations-calculator:custom-aliments";

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    repository = new LocalStorageCustomAlimentRepository();
  });

  describe("save()", () => {
    it("should save a new custom aliment with generated id and createdAt", async () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Manzana ecológica",
        type: RationsType.fruits,
        gramsToCarbohydrate: 110,
        bloodGlucoseIndex: 38,
      };

      const saved = await repository.save(dto);

      expect(saved.id).toBeDefined();
      expect(saved.id).toMatch(/^[a-f0-9-]{36}$/); // UUID format
      expect(saved.name).toBe("Manzana ecológica");
      expect(saved.type).toBe(RationsType.fruits);
      expect(saved.gramsToCarbohydrate).toBe(110);
      expect(saved.bloodGlucoseIndex).toBe(38);
      expect(saved.isCustom).toBe(true);
      expect(saved.createdAt).toBeInstanceOf(Date);
      expect(saved.updatedAt).toBeUndefined();
    });

    it("should persist custom aliment to localStorage", async () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test Aliment",
        type: RationsType.vegetables,
        gramsToCarbohydrate: 200,
      };

      await repository.save(dto);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
      expect(parsed[0].name).toBe("Test Aliment");
    });

    it("should save multiple custom aliments", async () => {
      const dto1: CreateCustomAlimentDTO = {
        name: "Aliment 1",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      };

      const dto2: CreateCustomAlimentDTO = {
        name: "Aliment 2",
        type: RationsType.vegetables,
        gramsToCarbohydrate: 200,
      };

      await repository.save(dto1);
      await repository.save(dto2);

      const all = await repository.findAll();
      expect(all.length).toBe(2);
    });

    it("should trim whitespace from name", async () => {
      const dto: CreateCustomAlimentDTO = {
        name: "  Manzana  ",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      };

      const saved = await repository.save(dto);

      expect(saved.name).toBe("Manzana");
    });
  });

  describe("findAll()", () => {
    it("should return empty array when no custom aliments exist", async () => {
      const all = await repository.findAll();

      expect(all).toEqual([]);
    });

    it("should return all custom aliments sorted by createdAt DESC", async () => {
      // Save aliments with slight delay to ensure different timestamps
      const dto1: CreateCustomAlimentDTO = {
        name: "First",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      };
      const first = await repository.save(dto1);

      // Small delay
      await new Promise((resolve) => setTimeout(resolve, 10));

      const dto2: CreateCustomAlimentDTO = {
        name: "Second",
        type: RationsType.vegetables,
        gramsToCarbohydrate: 200,
      };
      const second = await repository.save(dto2);

      const all = await repository.findAll();

      expect(all.length).toBe(2);
      expect(all[0].id).toBe(second.id); // Newest first
      expect(all[1].id).toBe(first.id);
    });

    it("should deserialize dates correctly", async () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      };

      await repository.save(dto);
      const all = await repository.findAll();

      expect(all[0].createdAt).toBeInstanceOf(Date);
    });
  });

  describe("findById()", () => {
    it("should return undefined when aliment not found", async () => {
      const result = await repository.findById("non-existent-id");

      expect(result).toBeUndefined();
    });

    it("should find custom aliment by id", async () => {
      const dto: CreateCustomAlimentDTO = {
        name: "Manzana",
        type: RationsType.fruits,
        gramsToCarbohydrate: 110,
      };

      const saved = await repository.save(dto);
      const found = await repository.findById(saved.id);

      expect(found).toBeDefined();
      expect(found!.id).toBe(saved.id);
      expect(found!.name).toBe("Manzana");
    });
  });

  describe("findByType()", () => {
    it("should return empty array when no aliments of type exist", async () => {
      const results = await repository.findByType(RationsType.drinks);

      expect(results).toEqual([]);
    });

    it("should filter custom aliments by type", async () => {
      await repository.save({
        name: "Fruit 1",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      });

      await repository.save({
        name: "Fruit 2",
        type: RationsType.fruits,
        gramsToCarbohydrate: 110,
      });

      await repository.save({
        name: "Vegetable 1",
        type: RationsType.vegetables,
        gramsToCarbohydrate: 200,
      });

      const fruits = await repository.findByType(RationsType.fruits);

      expect(fruits.length).toBe(2);
      expect(fruits.every((a) => a.type === RationsType.fruits)).toBe(true);
    });
  });

  describe("search()", () => {
    beforeEach(async () => {
      await repository.save({
        name: "Manzana roja",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      });

      await repository.save({
        name: "Manzana verde",
        type: RationsType.fruits,
        gramsToCarbohydrate: 110,
      });

      await repository.save({
        name: "Pera",
        type: RationsType.fruits,
        gramsToCarbohydrate: 120,
      });
    });

    it("should return empty array when no matches found", async () => {
      const results = await repository.search("naranja");

      expect(results).toEqual([]);
    });

    it("should search by name case-insensitive", async () => {
      const results = await repository.search("MANZANA");

      expect(results.length).toBe(2);
      expect(
        results.every((a) => a.name.toLowerCase().includes("manzana")),
      ).toBe(true);
    });

    it("should search with partial match", async () => {
      const results = await repository.search("man");

      expect(results.length).toBe(2);
    });

    it("should return all when query is empty", async () => {
      const results = await repository.search("");

      expect(results.length).toBe(3);
    });
  });

  describe("update()", () => {
    it("should throw error when aliment not found", async () => {
      await expect(
        repository.update({
          id: "non-existent",
          name: "Updated",
        }),
      ).rejects.toThrow("Custom aliment not found");
    });

    it("should update name", async () => {
      const saved = await repository.save({
        name: "Original",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      });

      const updated = await repository.update({
        id: saved.id,
        name: "Updated Name",
      });

      expect(updated.name).toBe("Updated Name");
      expect(updated.updatedAt).toBeInstanceOf(Date);
    });

    it("should update gramsToCarbohydrate", async () => {
      const saved = await repository.save({
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      });

      const updated = await repository.update({
        id: saved.id,
        gramsToCarbohydrate: 150,
      });

      expect(updated.gramsToCarbohydrate).toBe(150);
    });

    it("should update multiple fields at once", async () => {
      const saved = await repository.save({
        name: "Original",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      });

      const updated = await repository.update({
        id: saved.id,
        name: "Updated",
        gramsToCarbohydrate: 150,
        bloodGlucoseIndex: 45,
      });

      expect(updated.name).toBe("Updated");
      expect(updated.gramsToCarbohydrate).toBe(150);
      expect(updated.bloodGlucoseIndex).toBe(45);
    });

    it("should persist updates to localStorage", async () => {
      const saved = await repository.save({
        name: "Original",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      });

      await repository.update({
        id: saved.id,
        name: "Updated",
      });

      const found = await repository.findById(saved.id);
      expect(found!.name).toBe("Updated");
    });
  });

  describe("delete()", () => {
    it("should return false when aliment not found", async () => {
      const result = await repository.delete("non-existent");

      expect(result).toBe(false);
    });

    it("should delete custom aliment by id", async () => {
      const saved = await repository.save({
        name: "To Delete",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      });

      const deleted = await repository.delete(saved.id);

      expect(deleted).toBe(true);

      const found = await repository.findById(saved.id);
      expect(found).toBeUndefined();
    });

    it("should persist deletion to localStorage", async () => {
      const saved = await repository.save({
        name: "To Delete",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      });

      await repository.delete(saved.id);

      const all = await repository.findAll();
      expect(all.length).toBe(0);
    });
  });

  describe("count()", () => {
    it("should return 0 when no custom aliments exist", async () => {
      const count = await repository.count();

      expect(count).toBe(0);
    });

    it("should return correct count", async () => {
      await repository.save({
        name: "Aliment 1",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      });

      await repository.save({
        name: "Aliment 2",
        type: RationsType.vegetables,
        gramsToCarbohydrate: 200,
      });

      const count = await repository.count();

      expect(count).toBe(2);
    });
  });

  describe("Error handling", () => {
    it("should handle storage quota exceeded gracefully", async () => {
      // Mock the adapter's setItem to simulate quota exceeded
      const originalSetItem = localStorage.setItem;
      globalThis.localStorage.setItem = function () {
        const error = new Error("QuotaExceededError");
        error.name = "QuotaExceededError";
        throw error;
      };

      const dto: CreateCustomAlimentDTO = {
        name: "Test",
        type: RationsType.fruits,
        gramsToCarbohydrate: 100,
      };

      await expect(repository.save(dto)).rejects.toThrow("Storage full");

      // Restore original
      globalThis.localStorage.setItem = originalSetItem;
    });
  });
});
