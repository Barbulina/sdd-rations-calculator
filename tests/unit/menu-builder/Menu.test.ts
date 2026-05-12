/**
 * Tests for Menu domain model
 * Following TDD - RED phase (tests first, then implementation)
 */

import { describe, it, expect } from "vitest";
import { Menu } from "@/src/domain/models/Menu";
import { MenuItem } from "@/src/domain/models/MenuItem";
import { MenuBuilder, createMenu } from "./MenuBuilder";
import {
  MenuItemBuilder,
  createMenuItem,
  createTestAliment,
} from "./MenuItemBuilder";
import { MenuType } from "@/src/domain/models/MenuType";

describe("Menu", () => {
  describe("creation", () => {
    it("should create Menu with valid data", () => {
      const item1 = createMenuItem({ weightGrams: 150, rations: 1.36 });
      const item2 = createMenuItem({ weightGrams: 100, rations: 0.91 });

      const menu = new Menu("Afternoon Snack", MenuType.LUNCH, [item1, item2]);

      expect(menu.id).toBeDefined();
      expect(menu.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(menu.name).toBe("Afternoon Snack");
      expect(menu.type).toBe(MenuType.LUNCH);
      expect(menu.items).toHaveLength(2);
      expect(menu.createdAt).toBeInstanceOf(Date);
    });

    it("should generate unique UUIDs for different menus", () => {
      const items = [createMenuItem()];
      const menu1 = new Menu("Menu 1", MenuType.LUNCH, items);
      const menu2 = new Menu("Menu 2", MenuType.LUNCH, items);

      expect(menu1.id).not.toBe(menu2.id);
    });

    it("should trim menu name", () => {
      const items = [createMenuItem()];
      const menu = new Menu("  Trimmed Name  ", MenuType.LUNCH, items);

      expect(menu.name).toBe("Trimmed Name");
    });
  });

  describe("name validation", () => {
    it("should reject empty name after trimming", () => {
      const items = [createMenuItem()];

      expect(() => new Menu("", MenuType.LUNCH, items)).toThrow(
        "Menu name is required",
      );
    });

    it("should reject whitespace-only name", () => {
      const items = [createMenuItem()];

      expect(() => new Menu("   ", MenuType.LUNCH, items)).toThrow(
        "Menu name is required",
      );
    });

    it("should reject name exceeding 200 characters", () => {
      const items = [createMenuItem()];
      const longName = "a".repeat(201);

      expect(() => new Menu(longName, MenuType.LUNCH, items)).toThrow(
        "Menu name must not exceed 200 characters",
      );
    });

    it("should accept name at 200 character boundary", () => {
      const items = [createMenuItem()];
      const maxName = "a".repeat(200);
      const menu = new Menu(maxName, MenuType.LUNCH, items);

      expect(menu.name).toBe(maxName);
      expect(menu.name.length).toBe(200);
    });
  });

  describe("type validation", () => {
    it("should accept valid MenuType", () => {
      const items = [createMenuItem()];
      const validTypes: MenuType[] = [
        MenuType.BREAKFAST,
        MenuType.LUNCH,
        MenuType.DINNER,
        MenuType.SNACK,
      ];

      validTypes.forEach((type) => {
        const menu = new Menu("Test Menu", type, items);
        expect(menu.type).toBe(type);
      });
    });

    it("should reject invalid type", () => {
      const items = [createMenuItem()];

      // @ts-expect-error Testing runtime validation
      expect(() => new Menu("Test", "invalid-type", items)).toThrow(
        "Invalid menu type",
      );
    });

    it("should reject empty type", () => {
      const items = [createMenuItem()];

      // @ts-expect-error Testing runtime validation
      expect(() => new Menu("Test", "", items)).toThrow("Invalid menu type");
    });
  });

  describe("items validation", () => {
    it("should reject empty items array", () => {
      expect(() => new Menu("Test Menu", MenuType.LUNCH, [])).toThrow(
        "Menu must contain at least one aliment",
      );
    });

    it("should accept single item", () => {
      const item = createMenuItem();
      const menu = new Menu("Test Menu", MenuType.LUNCH, [item]);

      expect(menu.items).toHaveLength(1);
      expect(menu.items[0]).toEqual(item);
    });

    it("should accept multiple items", () => {
      const items = [
        createMenuItem({ id: "id-1" }),
        createMenuItem({ id: "id-2" }),
        createMenuItem({ id: "id-3" }),
      ];
      const menu = new Menu("Test Menu", MenuType.LUNCH, items);

      expect(menu.items).toHaveLength(3);
    });
  });

  describe("totalWeight calculation", () => {
    it("should calculate total weight from single item", () => {
      const item = createMenuItem({ weightGrams: 150 });
      const menu = new Menu("Test", MenuType.LUNCH, [item]);

      expect(menu.totalWeight).toBe(150);
    });

    it("should calculate total weight from multiple items", () => {
      const items = [
        createMenuItem({ weightGrams: 150 }),
        createMenuItem({ weightGrams: 100 }),
        createMenuItem({ weightGrams: 50 }),
      ];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      expect(menu.totalWeight).toBe(300); // 150 + 100 + 50
    });

    it("should handle large weights", () => {
      const items = [
        createMenuItem({ weightGrams: 5000 }),
        createMenuItem({ weightGrams: 4999 }),
      ];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      expect(menu.totalWeight).toBe(9999);
    });
  });

  describe("totalRations calculation", () => {
    it("should calculate total rations from single item", () => {
      const item = createMenuItem({ rations: 1.36 });
      const menu = new Menu("Test", MenuType.LUNCH, [item]);

      expect(menu.totalRations).toBe(1.36);
    });

    it("should calculate total rations from multiple items", () => {
      const items = [
        createMenuItem({ rations: 1.36 }),
        createMenuItem({ rations: 2.5 }),
        createMenuItem({ rations: 0.91 }),
      ];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      expect(menu.totalRations).toBe(4.77); // 1.36 + 2.5 + 0.91
    });

    it("should round total rations to 2 decimal places", () => {
      const items = [
        createMenuItem({ rations: 1.111 }),
        createMenuItem({ rations: 2.222 }),
        createMenuItem({ rations: 3.333 }),
      ];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      // 1.111 + 2.222 + 3.333 = 6.666 → 6.67
      expect(menu.totalRations).toBe(6.67);
      expect(menu.totalRations.toString()).toMatch(/^\d+\.\d{1,2}$/);
    });

    it("should handle integer rations sum", () => {
      const items = [
        createMenuItem({ rations: 2 }),
        createMenuItem({ rations: 3 }),
      ];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      expect(menu.totalRations).toBe(5);
    });
  });

  describe("createdAt timestamp", () => {
    it("should auto-generate createdAt on creation", () => {
      const items = [createMenuItem()];
      const before = new Date();
      const menu = new Menu("Test", MenuType.LUNCH, items);
      const after = new Date();

      expect(menu.createdAt).toBeInstanceOf(Date);
      expect(menu.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(menu.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("should set createdAt to current time", () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", MenuType.LUNCH, items);
      const now = new Date();

      // Within 1 second tolerance
      const diff = Math.abs(now.getTime() - menu.createdAt.getTime());
      expect(diff).toBeLessThan(1000);
    });
  });

  describe("updatedAt timestamp", () => {
    it("should not have updatedAt on initial creation", () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      expect(menu.updatedAt).toBeUndefined();
    });

    // Note: updatedAt will be set by repository on updates
    // Testing in repository layer
  });

  describe("immutability", () => {
    it("should not allow modification of name after creation", () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      expect(() => {
        // @ts-expect-error Testing immutability
        menu.name = "Modified";
      }).toThrow();
    });

    it("should not allow modification of items after creation", () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      expect(() => {
        // @ts-expect-error Testing immutability
        menu.items = [];
      }).toThrow();
    });

    it("should not allow modification of totalWeight after creation", () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      expect(() => {
        // @ts-expect-error Testing immutability
        menu.totalWeight = 999;
      }).toThrow();
    });
  });

  describe("items as snapshot", () => {
    it("should store items as snapshot (prevent external mutations)", () => {
      const items = [createMenuItem({ weightGrams: 150 })];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      // Modify original array
      items.push(createMenuItem({ weightGrams: 200 }));
      items[0] = createMenuItem({ weightGrams: 999 });

      // Menu should preserve original items
      expect(menu.items).toHaveLength(1);
      expect(menu.items[0].weightGrams).toBe(150);
      expect(menu.totalWeight).toBe(150);
    });
  });

  describe("UUID generation", () => {
    it("should use crypto.randomUUID for ID generation", () => {
      const items = [createMenuItem()];
      const menu = new Menu("Test", MenuType.LUNCH, items);

      expect(menu.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("should create different IDs for each instance", () => {
      const items = [createMenuItem()];
      const ids = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const menu = new Menu("Test", MenuType.LUNCH, items);
        ids.add(menu.id);
      }

      expect(ids.size).toBe(100); // All unique
    });
  });
});
