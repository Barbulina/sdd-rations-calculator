/**
 * useMenuBuilder Hook Tests
 * Tests for menu builder state management hook
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useMenuBuilder } from "@/src/application/hooks/useMenuBuilder";
import type { MenuRepository } from "@/src/domain/repositories/MenuRepository";
import type { AlimentInfo } from "@/src/domain/models/AlimentInfo";
import type { Menu } from "@/specs/004-menu-builder/contracts/types";

// Mock repository
const mockRepository: MenuRepository = {
  save: vi.fn(),
  getAll: vi.fn(),
  getById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  deleteAll: vi.fn(),
  isAvailable: vi.fn(),
};

// Sample aliment data for testing
const createSampleAliment = (): AlimentInfo => ({
  id: "test-aliment-1",
  name: "Manzana Golden",
  racionName: "Manzana mediana",
  categoryIndex: 3, // frutas
  racionGrams: 150,
  protein: 0.3,
  lipids: 0.2,
  carbs: 12.0,
  fiber: 2.4,
  kcal: 52,
  vitaminA: 54,
  vitaminC: 4.6,
  vitaminD: 0,
  vitaminE: 0.18,
  calcium: 6,
  iron: 0.12,
  magnesium: 5,
  zinc: 0.04,
  selenium: 0,
  sodium: 1,
  potassium: 107,
  phosphorus: 11,
});

describe("useMenuBuilder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should initialize with empty items array", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));

      expect(result.current.items).toEqual([]);
    });

    it("should initialize with zero totalWeight", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));

      expect(result.current.totalWeight).toBe(0);
    });

    it("should initialize with zero totalRations", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));

      expect(result.current.totalRations).toBe(0);
    });

    it("should not be loading initially", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));

      expect(result.current.isLoading).toBe(false);
    });

    it("should have no error initially", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));

      expect(result.current.error).toBeNull();
    });
  });

  describe("addItem()", () => {
    it("should add item with valid weight", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBeDefined();
      expect(result.current.items[0].alimentInfo).toEqual(aliment);
      expect(result.current.items[0].weightGrams).toBe(150);
      expect(result.current.items[0].rations).toBe(1.0); // 150g / 150g = 1.0
    });

    it("should add item with calculated rations", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 300); // 2 rations
      });

      expect(result.current.items[0].rations).toBe(2.0);
    });

    it("should add item with 2 decimal precision for rations", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 75); // 0.5 rations
      });

      expect(result.current.items[0].rations).toBe(0.5);
    });

    it("should generate unique ID for each item", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
        result.current.addItem(aliment, 200);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].id).not.toBe(result.current.items[1].id);
    });

    it("should append items to existing list", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
        result.current.addItem(aliment, 200);
        result.current.addItem(aliment, 100);
      });

      expect(result.current.items).toHaveLength(3);
      expect(result.current.items[0].weightGrams).toBe(150);
      expect(result.current.items[1].weightGrams).toBe(200);
      expect(result.current.items[2].weightGrams).toBe(100);
    });

    it("should throw error for weight below minimum", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      expect(() => {
        act(() => {
          result.current.addItem(aliment, 0);
        });
      }).toThrow("Weight must be between 1 and 10000 grams");
    });

    it("should throw error for weight above maximum", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      expect(() => {
        act(() => {
          result.current.addItem(aliment, 10001);
        });
      }).toThrow("Weight must be between 1 and 10000 grams");
    });

    it("should accept minimum valid weight (1g)", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 1);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].weightGrams).toBe(1);
    });

    it("should accept maximum valid weight (10000g)", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 10000);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].weightGrams).toBe(10000);
    });
  });

  describe("removeItem()", () => {
    it("should remove item by ID", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
        result.current.addItem(aliment, 200);
      });

      const idToRemove = result.current.items[0].id;

      act(() => {
        result.current.removeItem(idToRemove);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].weightGrams).toBe(200);
    });

    it("should do nothing if ID not found", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      act(() => {
        result.current.removeItem("non-existent-id");
      });

      expect(result.current.items).toHaveLength(1);
    });

    it("should handle removing last item", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      const id = result.current.items[0].id;

      act(() => {
        result.current.removeItem(id);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe("updateItemWeight()", () => {
    it("should update weight and recalculate rations", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150); // 1.0 rations
      });

      const id = result.current.items[0].id;

      act(() => {
        result.current.updateItemWeight(id, 300); // 2.0 rations
      });

      expect(result.current.items[0].weightGrams).toBe(300);
      expect(result.current.items[0].rations).toBe(2.0);
    });

    it("should preserve item ID and aliment data", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      const originalId = result.current.items[0].id;
      const originalAliment = result.current.items[0].alimentInfo;

      act(() => {
        result.current.updateItemWeight(originalId, 200);
      });

      expect(result.current.items[0].id).toBe(originalId);
      expect(result.current.items[0].alimentInfo).toEqual(originalAliment);
    });

    it("should do nothing if ID not found", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      const originalWeight = result.current.items[0].weightGrams;

      act(() => {
        result.current.updateItemWeight("non-existent-id", 200);
      });

      expect(result.current.items[0].weightGrams).toBe(originalWeight);
    });

    it("should throw error for invalid weight", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      const id = result.current.items[0].id;

      expect(() => {
        act(() => {
          result.current.updateItemWeight(id, 0);
        });
      }).toThrow("Weight must be between 1 and 10000 grams");
    });
  });

  describe("totalWeight calculation", () => {
    it("should calculate total weight from all items", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
        result.current.addItem(aliment, 200);
        result.current.addItem(aliment, 100);
      });

      expect(result.current.totalWeight).toBe(450);
    });

    it("should update when items are added", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      expect(result.current.totalWeight).toBe(150);

      act(() => {
        result.current.addItem(aliment, 200);
      });

      expect(result.current.totalWeight).toBe(350);
    });

    it("should update when items are removed", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
        result.current.addItem(aliment, 200);
      });

      const idToRemove = result.current.items[0].id;

      act(() => {
        result.current.removeItem(idToRemove);
      });

      expect(result.current.totalWeight).toBe(200);
    });

    it("should update when weight is changed", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      const id = result.current.items[0].id;

      act(() => {
        result.current.updateItemWeight(id, 300);
      });

      expect(result.current.totalWeight).toBe(300);
    });
  });

  describe("totalRations calculation", () => {
    it("should calculate total rations from all items", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150); // 1.0
        result.current.addItem(aliment, 300); // 2.0
        result.current.addItem(aliment, 75); // 0.5
      });

      expect(result.current.totalRations).toBe(3.5);
    });

    it("should use 2 decimal precision", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 100); // 0.67 rations
        result.current.addItem(aliment, 100);
      });

      // 0.67 + 0.67 = 1.34
      expect(result.current.totalRations).toBe(1.34);
    });

    it("should update when items are added", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150); // 1.0
      });

      expect(result.current.totalRations).toBe(1.0);

      act(() => {
        result.current.addItem(aliment, 150); // 1.0
      });

      expect(result.current.totalRations).toBe(2.0);
    });
  });

  describe("clearItems()", () => {
    it("should clear all items", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
        result.current.addItem(aliment, 200);
      });

      act(() => {
        result.current.clearItems();
      });

      expect(result.current.items).toHaveLength(0);
    });

    it("should reset totalWeight to zero", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      act(() => {
        result.current.clearItems();
      });

      expect(result.current.totalWeight).toBe(0);
    });

    it("should reset totalRations to zero", () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      act(() => {
        result.current.clearItems();
      });

      expect(result.current.totalRations).toBe(0);
    });
  });

  describe("saveMenu()", () => {
    it("should call repository.save() with valid menu", async () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      const mockSave = vi.fn().mockResolvedValue({} as Menu);
      mockRepository.save = mockSave;

      await act(async () => {
        await result.current.saveMenu("Test Menu", "LUNCH");
      });

      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Menu",
          type: "frutas",
          items: expect.arrayContaining([
            expect.objectContaining({
              weightGrams: 150,
            }),
          ]),
        }),
      );
    });

    it("should set isLoading to true while saving", async () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      let resolvePromise: (value: Menu) => void;
      const promise = new Promise<Menu>((resolve) => {
        resolvePromise = resolve;
      });
      mockRepository.save = vi.fn().mockReturnValue(promise);

      // Start save without awaiting
      const saveCall = result.current.saveMenu("Test Menu", "LUNCH");

      // Should be loading now
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Resolve and wait for completion
      resolvePromise!({} as Menu);
      await act(async () => {
        await saveCall;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("should clear items after successful save", async () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      mockRepository.save = vi.fn().mockResolvedValue({} as Menu);

      await act(async () => {
        await result.current.saveMenu("Test Menu", "LUNCH");
      });

      expect(result.current.items).toHaveLength(0);
    });

    it("should throw error if no items", async () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));

      await expect(
        act(async () => {
          try {
            await result.current.saveMenu("Test Menu", "LUNCH");
          } catch (e: any) {
            throw e;
          }
        }),
      ).rejects.toThrow("Menu must contain at least one aliment");
    });

    it("should throw error for empty name", async () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      await expect(
        act(async () => {
          try {
            await result.current.saveMenu("", "frutas");
          } catch (e: any) {
            throw e;
          }
        }),
      ).rejects.toThrow("Menu name is required");
    });

    it("should throw error for name too long", async () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      const longName = "a".repeat(201);

      await expect(
        act(async () => {
          try {
            await result.current.saveMenu(longName, "frutas");
          } catch (e: any) {
            throw e;
          }
        }),
      ).rejects.toThrow("Menu name must not exceed 200 characters");
    });

    it("should set error state on save failure", async () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      mockRepository.save = vi
        .fn()
        .mockRejectedValue(new Error("Storage quota exceeded"));

      await act(async () => {
        try {
          await result.current.saveMenu("Test Menu", "LUNCH");
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe("Storage quota exceeded");
    });

    it("should not clear items on save failure", async () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      mockRepository.save = vi.fn().mockRejectedValue(new Error("Save failed"));

      try {
        await act(async () => {
          await result.current.saveMenu("Test Menu", "LUNCH");
        });
      } catch (e) {
        // Expected to throw
      }

      expect(result.current.items).toHaveLength(1);
    });
  });

  describe("clearError()", () => {
    it("should clear error state", async () => {
      const { result } = renderHook(() => useMenuBuilder(mockRepository));
      const aliment = createSampleAliment();

      act(() => {
        result.current.addItem(aliment, 150);
      });

      mockRepository.save = vi.fn().mockRejectedValue(new Error("Test error"));

      await act(async () => {
        try {
          await result.current.saveMenu("Test Menu", "LUNCH");
        } catch (e) {
          // Expected
        }
      });

      expect(result.current.error).toBe("Test error");

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
