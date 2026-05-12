/**
 * useMenuList Hook Tests
 * T002 - T004: load/sort/error, filter logic, deleteMenu action
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { useMenuList } from "@/src/application/hooks/useMenuList";
import {
  MenuRepositoryProvider,
} from "@/src/application/contexts/MenuRepositoryContext";
import type { MenuRepository } from "@/src/domain/repositories/MenuRepository";
import { MenuType } from "@/src/domain/models/MenuType";
import { MenuBuilder } from "./MenuBuilder";

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

// ─── Helpers ───────────────────────────────────────────────────────────────

const breakfast = new MenuBuilder()
  .withId("id-breakfast")
  .withName("Breakfast Menu")
  .withType(MenuType.BREAKFAST)
  .withCreatedAt(new Date("2026-05-10T08:00:00.000Z"))
  .build();

const lunch = new MenuBuilder()
  .withId("id-lunch")
  .withName("Lunch Menu")
  .withType(MenuType.LUNCH)
  .withCreatedAt(new Date("2026-05-11T12:00:00.000Z"))
  .build();

const dinner = new MenuBuilder()
  .withId("id-dinner")
  .withName("Dinner Menu")
  .withType(MenuType.DINNER)
  .withCreatedAt(new Date("2026-05-12T20:00:00.000Z"))
  .build();

// ─── T002: load / sort / error ─────────────────────────────────────────────

describe("useMenuList — load, sort, error (T002)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with isLoading=true and empty menus", () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([]);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.menus).toEqual([]);
  });

  it("sets isLoading=false after menus load", async () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([breakfast]);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it("returns all menus from repository", async () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([breakfast, lunch]);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.menus).toHaveLength(2);
  });

  it("sorts menus by createdAt descending (most recent first)", async () => {
    // Provide in ascending order to verify sorting
    vi.mocked(mockRepository.getAll).mockResolvedValue([
      breakfast,
      lunch,
      dinner,
    ]);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.menus[0].id).toBe("id-dinner");
    expect(result.current.menus[1].id).toBe("id-lunch");
    expect(result.current.menus[2].id).toBe("id-breakfast");
  });

  it("sets error when getAll throws", async () => {
    vi.mocked(mockRepository.getAll).mockRejectedValue(
      new Error("Storage unavailable"),
    );
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeTruthy();
    expect(result.current.menus).toEqual([]);
  });

  it("hasMenus is false when repository is empty", async () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([]);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasMenus).toBe(false);
  });

  it("hasMenus is true when menus exist", async () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([breakfast]);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasMenus).toBe(true);
  });

  it("error is null on successful load", async () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([breakfast]);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeNull();
  });
});

// ─── T003: filter logic ────────────────────────────────────────────────────

describe("useMenuList — filter logic (T003)", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.mocked(mockRepository.getAll).mockResolvedValue([
      breakfast,
      lunch,
      dinner,
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("filteredMenus equals all menus when no filters active", async () => {
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.filteredMenus).toHaveLength(3);
  });

  it("nameFilter filters by partial case-insensitive name match", async () => {
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setNameFilter("break"));
    expect(result.current.filteredMenus).toHaveLength(1);
    expect(result.current.filteredMenus[0].id).toBe("id-breakfast");
  });

  it("nameFilter is case-insensitive", async () => {
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setNameFilter("LUNCH"));
    expect(result.current.filteredMenus).toHaveLength(1);
    expect(result.current.filteredMenus[0].id).toBe("id-lunch");
  });

  it("nameFilter empty string shows all menus", async () => {
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setNameFilter("break"));
    act(() => result.current.setNameFilter(""));
    expect(result.current.filteredMenus).toHaveLength(3);
  });

  it("typeFilter filters by exact MenuType", async () => {
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setTypeFilter(MenuType.DINNER));
    expect(result.current.filteredMenus).toHaveLength(1);
    expect(result.current.filteredMenus[0].id).toBe("id-dinner");
  });

  it("typeFilter null shows all menus", async () => {
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setTypeFilter(MenuType.LUNCH));
    act(() => result.current.setTypeFilter(null));
    expect(result.current.filteredMenus).toHaveLength(3);
  });

  it("nameFilter AND typeFilter work together", async () => {
    // Add two breakfast menus to check AND logic
    const breakfast2 = new MenuBuilder()
      .withId("id-breakfast-2")
      .withName("Breakfast Extra")
      .withType(MenuType.BREAKFAST)
      .withCreatedAt(new Date("2026-05-09T08:00:00.000Z"))
      .build();
    vi.mocked(mockRepository.getAll).mockResolvedValue([
      breakfast,
      breakfast2,
      lunch,
    ]);

    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setNameFilter("Breakfast Menu");
      result.current.setTypeFilter(MenuType.BREAKFAST);
    });

    expect(result.current.filteredMenus).toHaveLength(1);
    expect(result.current.filteredMenus[0].id).toBe("id-breakfast");
  });

  it("filteredMenus is empty when nothing matches", async () => {
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setNameFilter("zzz-no-match"));
    expect(result.current.filteredMenus).toHaveLength(0);
  });

  it("setNameFilter updates nameFilter state", async () => {
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setNameFilter("hello"));
    expect(result.current.nameFilter).toBe("hello");
  });

  it("setTypeFilter updates typeFilter state", async () => {
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.setTypeFilter(MenuType.SNACK));
    expect(result.current.typeFilter).toBe(MenuType.SNACK);
  });
});

// ─── T004: deleteMenu action ────────────────────────────────────────────────

describe("useMenuList — deleteMenu action (T004)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockRepository.getAll).mockResolvedValue([breakfast, lunch]);
    vi.mocked(mockRepository.delete).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls repository.delete with correct id when user confirms", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.deleteMenu("id-breakfast");
    });

    expect(mockRepository.delete).toHaveBeenCalledWith("id-breakfast");
  });

  it("does NOT call repository.delete when user cancels confirm", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.deleteMenu("id-breakfast");
    });

    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it("removes deleted menu from local state after confirmed deletion", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.menus).toHaveLength(2);

    await act(async () => {
      await result.current.deleteMenu("id-breakfast");
    });

    expect(result.current.menus).toHaveLength(1);
    expect(result.current.menus[0].id).toBe("id-lunch");
  });

  it("sets error when deletion fails", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(mockRepository.delete).mockRejectedValue(
      new Error("Delete failed"),
    );
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.deleteMenu("id-breakfast");
    });

    expect(result.current.error).toBeTruthy();
  });

  it("does not change menus state when user cancels", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.deleteMenu("id-breakfast");
    });

    expect(result.current.menus).toHaveLength(2);
  });

  it("shows confirm dialog with a message", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const { result } = renderHook(() => useMenuList(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.deleteMenu("id-breakfast");
    });

    expect(confirmSpy).toHaveBeenCalledWith(expect.any(String));
  });
});
