/**
 * Integration tests for LocalStorageMenuRepository
 * Following TDD - RED phase (tests first)
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LocalStorageMenuRepository } from "@/src/infrastructure/repositories/LocalStorageMenuRepository";
import { Menu } from "@/src/domain/models/Menu";
import { createMenuItem } from "../../unit/menu-builder/MenuItemBuilder";

const STORAGE_KEY = "sdd-rations-calculator:menus";

describe("LocalStorageMenuRepository", () => {
  let repository: LocalStorageMenuRepository;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    repository = new LocalStorageMenuRepository();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe("save()", () => {
    it("should save menu to localStorage", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test Menu", "LUNCH", items);

      const saved = await repository.save(menu);

      expect(saved).toEqual(menu);
      expect(localStorage.getItem(STORAGE_KEY)).toBeDefined();
    });

    it("should save menu with all properties", async () => {
      const items = [createMenuItem({ weightGrams: 150, rations: 1.36 })];
      const menu = new Menu("Breakfast", "LUNCH", items);

      await repository.save(menu);

      const data = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject({
        id: menu.id,
        name: "Breakfast",
        type: "LUNCH",
        totalWeight: 150,
        totalRations: 1.36,
      });
    });

    it("should append to existing menus", async () => {
      const items = [createMenuItem()];
      const menu1 = new Menu("Menu 1", "LUNCH", items);
      const menu2 = new Menu("Menu 2", "SNACK", items);

      await repository.save(menu1);
      await repository.save(menu2);

      const all = await repository.getAll();
      expect(all).toHaveLength(2);
    });

    it("should serialize Date objects to ISO strings", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", "LUNCH", items);

      await repository.save(menu);

      const raw = localStorage.getItem(STORAGE_KEY)!;
      const data = JSON.parse(raw);
      expect(typeof data[0].createdAt).toBe("string");
      expect(data[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("should preserve menu items with aliment data", async () => {
      const items = [
        createMenuItem({
          weightGrams: 150,
          rations: 1.36,
          aliment: {
            name: "manzana",
            type: "frutas",
            gramsToCarbohydrate: 110,
            bloodGlucoseIndex: 38,
          },
        }),
      ];
      const menu = new Menu("Snack", "LUNCH", items);

      await repository.save(menu);

      const retrieved = await repository.getById(menu.id);
      expect(retrieved?.items[0].aliment.name).toBe("manzana");
      expect(retrieved?.items[0].weightGrams).toBe(150);
      expect(retrieved?.items[0].rations).toBe(1.36);
    });
  });

  describe("getAll()", () => {
    it("should return empty array when no menus exist", async () => {
      const menus = await repository.getAll();

      expect(menus).toEqual([]);
    });

    it("should return all saved menus", async () => {
      const items = [createMenuItem()];
      const menu1 = new Menu("Menu 1", "LUNCH", items);
      const menu2 = new Menu("Menu 2", "SNACK", items);

      await repository.save(menu1);
      await repository.save(menu2);

      const menus = await repository.getAll();

      expect(menus).toHaveLength(2);
      expect(menus[0].name).toBe("Menu 1");
      expect(menus[1].name).toBe("Menu 2");
    });

    it("should deserialize Date objects", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", "LUNCH", items);

      await repository.save(menu);

      const menus = await repository.getAll();

      expect(menus[0].createdAt).toBeInstanceOf(Date);
    });

    it("should handle corrupt data gracefully", async () => {
      localStorage.setItem(STORAGE_KEY, "invalid json");

      const menus = await repository.getAll();

      expect(menus).toEqual([]);
    });

    it("should filter out invalid menu objects", async () => {
      const items = [createMenuItem()];
      const validMenu = new Menu("Valid", "LUNCH", items);
      await repository.save(validMenu);

      // Manually corrupt data
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      data.push({ invalid: "menu" });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      const menus = await repository.getAll();

      expect(menus).toHaveLength(1);
      expect(menus[0].name).toBe("Valid");
    });
  });

  describe("getById()", () => {
    it("should return null when menu not found", async () => {
      const menu = await repository.getById("non-existent-id");

      expect(menu).toBeNull();
    });

    it("should return menu by ID", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test Menu", "LUNCH", items);

      await repository.save(menu);

      const retrieved = await repository.getById(menu.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(menu.id);
      expect(retrieved?.name).toBe("Test Menu");
    });

    it("should deserialize Date objects", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", "LUNCH", items);

      await repository.save(menu);

      const retrieved = await repository.getById(menu.id);

      expect(retrieved?.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("update()", () => {
    it("should update existing menu", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Original Name", "LUNCH", items);

      await repository.save(menu);

      // Create updated menu using reconstitute to preserve ID
      const updatedMenu = Menu.reconstitute({
        id: menu.id,
        name: "Updated Name",
        type: "SNACK",
        items,
        createdAt: menu.createdAt,
      });

      const result = await repository.update(updatedMenu);

      expect(result.name).toBe("Updated Name");
      expect(result.type).toBe("SNACK");

      const retrieved = await repository.getById(menu.id);
      expect(retrieved?.name).toBe("Updated Name");
    });

    it("should throw error when menu not found", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", "LUNCH", items);

      await expect(repository.update(menu)).rejects.toThrow("Menu not found");
    });

    it("should set updatedAt timestamp", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", "LUNCH", items);

      await repository.save(menu);

      // Wait a bit to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updatedMenu = Menu.reconstitute({
        id: menu.id,
        name: "Updated",
        type: "LUNCH",
        items,
        createdAt: menu.createdAt,
      });

      const result = await repository.update(updatedMenu);

      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.updatedAt!.getTime()).toBeGreaterThan(
        result.createdAt.getTime(),
      );
    });
  });

  describe("delete()", () => {
    it("should delete menu by ID", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", "LUNCH", items);

      await repository.save(menu);
      expect(await repository.getById(menu.id)).not.toBeNull();

      await repository.delete(menu.id);

      expect(await repository.getById(menu.id)).toBeNull();
    });

    it("should not throw when deleting non-existent menu", async () => {
      await expect(repository.delete("non-existent")).resolves.not.toThrow();
    });

    it("should only delete specified menu", async () => {
      const items = [createMenuItem()];
      const menu1 = new Menu("Menu 1", "LUNCH", items);
      const menu2 = new Menu("Menu 2", "SNACK", items);

      await repository.save(menu1);
      await repository.save(menu2);

      await repository.delete(menu1.id);

      expect(await repository.getById(menu1.id)).toBeNull();
      expect(await repository.getById(menu2.id)).not.toBeNull();
    });
  });

  describe("deleteAll()", () => {
    it("should delete all menus", async () => {
      const items = [createMenuItem()];
      const menu1 = new Menu("Menu 1", "LUNCH", items);
      const menu2 = new Menu("Menu 2", "SNACK", items);

      await repository.save(menu1);
      await repository.save(menu2);

      await repository.deleteAll();

      const menus = await repository.getAll();
      expect(menus).toEqual([]);
    });

    it("should not throw when no menus exist", async () => {
      await expect(repository.deleteAll()).resolves.not.toThrow();
    });

    it("should remove localStorage key", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", "LUNCH", items);

      await repository.save(menu);
      expect(localStorage.getItem(STORAGE_KEY)).toBeDefined();

      await repository.deleteAll();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe("isAvailable()", () => {
    it("should return true when localStorage is available", async () => {
      const available = await repository.isAvailable();

      expect(available).toBe(true);
    });

    it("should return true after write operation", async () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", "LUNCH", items);

      await repository.save(menu);

      const available = await repository.isAvailable();
      expect(available).toBe(true);
    });
  });

  describe("storage quota handling", () => {
    it("should handle QuotaExceededError gracefully", async () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        const error: any = new Error("QuotaExceededError");
        error.name = "QuotaExceededError";
        throw error;
      };

      const items = [createMenuItem()];
      const menu = new Menu("Test", "LUNCH", items);

      await expect(repository.save(menu)).rejects.toThrow(
        "Storage quota exceeded",
      );

      // Restore original
      localStorage.setItem = originalSetItem;
    });
  });

  describe("concurrent access", () => {
    it("should handle concurrent saves", async () => {
      const items = [createMenuItem()];
      const menus = Array.from(
        { length: 10 },
        (_, i) => new Menu(`Menu ${i}`, "LUNCH", items),
      );

      await Promise.all(menus.map((menu) => repository.save(menu)));

      const all = await repository.getAll();
      expect(all).toHaveLength(10);
    });
  });

  describe("edge cases", () => {
    it("should handle menu with multiple items", async () => {
      const items = [
        createMenuItem({ weightGrams: 100 }),
        createMenuItem({ weightGrams: 200 }),
        createMenuItem({ weightGrams: 50 }),
      ];
      const menu = new Menu("Complex Menu", "LUNCH", items);

      await repository.save(menu);

      const retrieved = await repository.getById(menu.id);
      expect(retrieved?.items).toHaveLength(3);
      expect(retrieved?.totalWeight).toBe(350);
    });

    it("should handle menu with custom aliment", async () => {
      const customAliment = {
        id: "custom-1",
        name: "Custom Aliment",
        type: "frutas" as const,
        gramsToCarbohydrate: 120,
        bloodGlucoseIndex: 40,
        isCustom: true,
        createdAt: new Date(),
      };
      const items = [createMenuItem({ aliment: customAliment })];
      const menu = new Menu("Custom Menu", "LUNCH", items);

      await repository.save(menu);

      const retrieved = await repository.getById(menu.id);
      expect(retrieved?.items[0].aliment).toMatchObject({
        name: "Custom Aliment",
        isCustom: true,
      });
    });
  });
});
