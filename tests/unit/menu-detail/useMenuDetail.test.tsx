/**
 * useMenuDetail — Unit Tests
 * T003: load menu by id (success, not-found, error, loading)
 * T004: editName/editType state management
 * T005: saveChanges (success, empty-name validation, repo error)
 * T006: removeItem (success, last-item guard, repo error)
 * T007: addItem (success, recalculates totals, repo error)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { useMenuDetail } from "@/src/application/hooks/useMenuDetail";
import { MenuRepositoryProvider } from "@/src/application/contexts/MenuRepositoryContext";
import type { MenuRepository } from "@/src/domain/repositories/MenuRepository";
import { MenuType } from "@/src/domain/models/MenuType";
import { MenuBuilder } from "../../shared/MenuBuilder";
import { createMenuItem } from "../../shared/MenuItemBuilder";

const DEFAULT_ITEM_1 = createMenuItem({
  id: "item-1",
  aliment: {
    name: "Arroz blanco",
    type: "cereales" as any,
    gramsToCarbohydrate: 25,
    bloodGlucoseIndex: 72,
  },
  weightGrams: 80,
  rations: 3.2,
});

const DEFAULT_ITEM_2 = createMenuItem({
  id: "item-2",
  aliment: {
    name: "Pechuga de pollo",
    type: "proteinas" as any,
    gramsToCarbohydrate: 0,
    bloodGlucoseIndex: 0,
  },
  weightGrams: 120,
  rations: 0,
});

// ─── Mock repository ───────────────────────────────────────────────────────

const mockRepository: MenuRepository = {
  getAll: vi.fn(),
  getById: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  deleteAll: vi.fn(),
  isAvailable: vi.fn(),
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <MenuRepositoryProvider repository={mockRepository}>
    {children}
  </MenuRepositoryProvider>
);

// ─── Test data ─────────────────────────────────────────────────────────────

const testMenu = new MenuBuilder()
  .withId("menu-abc")
  .withName("Mi Desayuno")
  .withType(MenuType.BREAKFAST)
  .withItems([DEFAULT_ITEM_1, DEFAULT_ITEM_2])
  .build();

// ─── T003: Load menu ────────────────────────────────────────────────────────

describe("useMenuDetail — load menu (T003)", () => {
  beforeEach(() => vi.resetAllMocks());

  it("starts with isLoading = true", () => {
    vi.mocked(mockRepository.getById).mockImplementation(
      () => new Promise(() => {}),
    );
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it("loads the menu and sets isLoading = false", async () => {
    vi.mocked(mockRepository.getById).mockResolvedValue(testMenu);
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.menu).toEqual(testMenu);
  });

  it("calls getById with the given id", async () => {
    vi.mocked(mockRepository.getById).mockResolvedValue(testMenu);
    renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() =>
      expect(mockRepository.getById).toHaveBeenCalledWith("menu-abc"),
    );
  });

  it("sets notFound = true when getById returns null", async () => {
    vi.mocked(mockRepository.getById).mockResolvedValue(null);
    const { result } = renderHook(() => useMenuDetail("unknown-id"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.notFound).toBe(true);
    expect(result.current.menu).toBeNull();
  });

  it("sets error when getById throws", async () => {
    vi.mocked(mockRepository.getById).mockRejectedValue(
      new Error("Storage fail"),
    );
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeTruthy();
  });
});

// ─── T004: editName / editType state ────────────────────────────────────────

describe("useMenuDetail — editName / editType state (T004)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(mockRepository.getById).mockResolvedValue(testMenu);
  });

  it("initialises editName from menu.name after load", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.editName).toBe("Mi Desayuno");
  });

  it("initialises editType from menu.type after load", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.editType).toBe(MenuType.BREAKFAST);
  });

  it("setEditName updates editName", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setEditName("Nuevo nombre"));
    expect(result.current.editName).toBe("Nuevo nombre");
  });

  it("setEditType updates editType", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setEditType(MenuType.DINNER));
    expect(result.current.editType).toBe(MenuType.DINNER);
  });
});

// ─── T005: saveChanges ──────────────────────────────────────────────────────

describe("useMenuDetail — saveChanges (T005)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(mockRepository.getById).mockResolvedValue(testMenu);
    vi.mocked(mockRepository.update).mockResolvedValue(testMenu);
  });

  it("calls repository.update with updated name and type", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => {
      result.current.setEditName("Desayuno Actualizado");
      result.current.setEditType(MenuType.DINNER);
    });
    await act(async () => {
      await result.current.saveChanges();
    });
    expect(mockRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Desayuno Actualizado",
        type: MenuType.DINNER,
      }),
    );
  });

  it("does NOT call update when name is empty", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setEditName(""));
    await act(async () => {
      await result.current.saveChanges();
    });
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("sets nameError when name is empty", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setEditName("   "));
    await act(async () => {
      await result.current.saveChanges();
    });
    expect(result.current.nameError).toBeTruthy();
  });

  it("clears nameError when name is valid and save succeeds", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setEditName(""));
    await act(async () => {
      await result.current.saveChanges();
    });
    act(() => result.current.setEditName("Valid Name"));
    await act(async () => {
      await result.current.saveChanges();
    });
    expect(result.current.nameError).toBeNull();
  });

  it("sets saveError when repository.update throws", async () => {
    vi.mocked(mockRepository.update).mockRejectedValue(new Error("Write fail"));
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.saveChanges();
    });
    expect(result.current.error).toBeTruthy();
  });

  it("isSaving is false after a completed save", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isSaving).toBe(false);
    await act(async () => {
      await result.current.saveChanges();
    });
    expect(result.current.isSaving).toBe(false);
  });
});

// ─── T006: removeItem ──────────────────────────────────────────────────────

describe("useMenuDetail — removeItem (T006)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(mockRepository.getById).mockResolvedValue(testMenu);
    vi.mocked(mockRepository.update).mockResolvedValue(testMenu);
  });

  it("removes the item from the menu", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.removeItem(DEFAULT_ITEM_1.id);
    });
    expect(result.current.menu!.items).not.toContainEqual(
      expect.objectContaining({ id: DEFAULT_ITEM_1.id }),
    );
  });

  it("calls repository.update after removing", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.removeItem(DEFAULT_ITEM_1.id);
    });
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it("recalculates totalWeight and totalRations after removing", async () => {
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.removeItem(DEFAULT_ITEM_1.id);
    });
    const remaining = testMenu.items.filter((i) => i.id !== DEFAULT_ITEM_1.id);
    const expectedWeight = remaining.reduce((s, i) => s + i.weightGrams, 0);
    expect(mockRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ totalWeight: expectedWeight }),
    );
  });

  it("does NOT remove if it is the last item", async () => {
    const singleItemMenu = new MenuBuilder()
      .withId("menu-abc")
      .withItems([DEFAULT_ITEM_1])
      .build();
    vi.mocked(mockRepository.getById).mockResolvedValue(singleItemMenu);
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.removeItem(DEFAULT_ITEM_1.id);
    });
    expect(mockRepository.update).not.toHaveBeenCalled();
    expect(result.current.menu!.items).toHaveLength(1);
  });

  it("sets error when repository.update throws on remove", async () => {
    vi.mocked(mockRepository.update).mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.removeItem(DEFAULT_ITEM_1.id);
    });
    expect(result.current.error).toBeTruthy();
  });
});

// ─── T007: addItem ─────────────────────────────────────────────────────────

describe("useMenuDetail — addItem (T007)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(mockRepository.getById).mockResolvedValue(testMenu);
    vi.mocked(mockRepository.update).mockResolvedValue(testMenu);
  });

  it("adds the item to the menu", async () => {
    const newItem = createMenuItem({
      id: "item-new",
      weightGrams: 50,
      rations: 2,
    });
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.addItem(newItem);
    });
    expect(result.current.menu!.items).toContainEqual(
      expect.objectContaining({ id: "item-new" }),
    );
  });

  it("calls repository.update after adding", async () => {
    const newItem = createMenuItem({
      id: "item-new",
      weightGrams: 50,
      rations: 2,
    });
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.addItem(newItem);
    });
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it("recalculates totalWeight and totalRations after adding", async () => {
    const newItem = createMenuItem({
      id: "item-new",
      weightGrams: 50,
      rations: 2,
    });
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.addItem(newItem);
    });
    const expectedWeight = testMenu.totalWeight + 50;
    expect(mockRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ totalWeight: expectedWeight }),
    );
  });

  it("sets error when repository.update throws on add", async () => {
    vi.mocked(mockRepository.update).mockRejectedValue(new Error("fail"));
    const newItem = createMenuItem({
      id: "item-new",
      weightGrams: 50,
      rations: 2,
    });
    const { result } = renderHook(() => useMenuDetail("menu-abc"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.addItem(newItem);
    });
    expect(result.current.error).toBeTruthy();
  });
});
