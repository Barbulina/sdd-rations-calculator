/**
 * MenuDetailPage Integration Tests
 * T011: loading, not-found, view detail (name, type, date, items, totals, back link)
 * T017: edit name + type, save, validation
 * T020: remove item, last-item guard
 * T023: add aliment via AutocompleteSearch
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import MenuDetailPage from "@/app/menu/[id]/MenuDetailClient";
import { MenuRepositoryProvider } from "@/src/application/contexts/MenuRepositoryContext";
import type { MenuRepository } from "@/src/domain/repositories/MenuRepository";
import { MenuType } from "@/src/domain/models/MenuType";
import { MenuBuilder, DEFAULT_ITEM_1, DEFAULT_ITEM_2 } from "../../unit/menu-detail/MenuBuilder";

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

const testMenu = new MenuBuilder()
  .withId("menu-detail-1")
  .withName("My Lunch")
  .withType(MenuType.LUNCH)
  .withCreatedAt(new Date("2026-05-12T12:00:00.000Z"))
  .withItems([DEFAULT_ITEM_1, DEFAULT_ITEM_2])
  .build();

// ─── Shared helper ──────────────────────────────────────────────────────────

async function renderAndWait(id = "menu-detail-1") {
  render(<MenuDetailPage params={{ id }} />, { wrapper });
  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(), { timeout: 3000 });
}

// ─── T011: loading + not-found + view ─────────────────────────────────────

describe("MenuDetailPage — loading state (T011)", () => {
  it("shows loading indicator while fetching", () => {
    vi.mocked(mockRepository.getById).mockImplementation(() => new Promise(() => {}));
    render(<MenuDetailPage params={{ id: "menu-detail-1" }} />, { wrapper });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

describe("MenuDetailPage — not found (T011)", () => {
  beforeEach(() => vi.resetAllMocks());

  it("shows not found message when menu doesn't exist", async () => {
    vi.mocked(mockRepository.getById).mockResolvedValue(null);
    render(<MenuDetailPage params={{ id: "bad-id" }} />, { wrapper });
    await waitFor(() => expect(screen.getByText(/not found/i)).toBeInTheDocument());
  });

  it("has a link back to home when not found", async () => {
    vi.mocked(mockRepository.getById).mockResolvedValue(null);
    render(<MenuDetailPage params={{ id: "bad-id" }} />, { wrapper });
    await waitFor(() => screen.getByText(/not found/i));
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });
});

describe("MenuDetailPage — view detail (T011)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(mockRepository.getById).mockResolvedValue(testMenu);
    vi.mocked(mockRepository.update).mockResolvedValue(testMenu);
  });

  it("shows the menu name in a heading", async () => {
    await renderAndWait();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByDisplayValue("My Lunch")).toBeInTheDocument();
  });

  it("shows the type in a select", async () => {
    await renderAndWait();
    expect(screen.getByRole("combobox", { name: /meal type/i })).toHaveValue("LUNCH");
  });

  it("shows the creation date", async () => {
    await renderAndWait();
    expect(screen.getByText(/May 12, 2026/i)).toBeInTheDocument();
  });

  it("shows each aliment name", async () => {
    await renderAndWait();
    expect(screen.getByText("Arroz blanco")).toBeInTheDocument();
    expect(screen.getByText("Pechuga de pollo")).toBeInTheDocument();
  });

  it("shows total rations in the summary", async () => {
    await renderAndWait();
    // DEFAULT_ITEM_1.rations = 3.2, DEFAULT_ITEM_2.rations = 0 → total = 3.20
    // The summary section shows "Total Rations" label above the value
    expect(screen.getByText("Total Rations")).toBeInTheDocument();
    const allMatches = screen.getAllByText(/3\.20/);
    expect(allMatches.length).toBeGreaterThan(0);
  });

  it("shows total weight", async () => {
    await renderAndWait();
    // 80 + 120 = 200g
    expect(screen.getByText(/200\s*g/)).toBeInTheDocument();
  });

  it("has a back link to home", async () => {
    await renderAndWait();
    const backLink = screen.getByRole("link", { name: /my menus/i });
    expect(backLink).toHaveAttribute("href", "/");
  });
});

// ─── T017: edit name + type + save ─────────────────────────────────────────

describe("MenuDetailPage — edit name and type (T017)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(mockRepository.getById).mockResolvedValue(testMenu);
    vi.mocked(mockRepository.update).mockResolvedValue(testMenu);
  });

  async function renderAndWait() {
    render(<MenuDetailPage params={{ id: "menu-detail-1" }} />, { wrapper });
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  }

  it("has a name input with the current menu name", async () => {
    await renderAndWait();
    expect(screen.getByDisplayValue("My Lunch")).toBeInTheDocument();
  });

  it("has a type selector with all 4 options", async () => {
    await renderAndWait();
    expect(screen.getByRole("option", { name: "Breakfast" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Lunch" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dinner" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Snack" })).toBeInTheDocument();
  });

  it("has a Save changes button", async () => {
    await renderAndWait();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("calls repository.update when saving with valid name", async () => {
    await renderAndWait();
    const nameInput = screen.getByDisplayValue("My Lunch");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Name");
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));
    await waitFor(() =>
      expect(mockRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Updated Name" }),
      ),
    );
  });

  it("shows validation error when name is empty", async () => {
    await renderAndWait();
    const nameInput = screen.getByDisplayValue("My Lunch");
    await userEvent.clear(nameInput);
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});

// ─── T020: remove item ──────────────────────────────────────────────────────

describe("MenuDetailPage — remove item (T020)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(mockRepository.getById).mockResolvedValue(testMenu);
    vi.mocked(mockRepository.update).mockResolvedValue(testMenu);
  });

  async function renderAndWait() {
    render(<MenuDetailPage params={{ id: "menu-detail-1" }} />, { wrapper });
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  }

  it("each item has a remove button", async () => {
    await renderAndWait();
    const removeBtns = screen.getAllByRole("button", { name: /remove/i });
    expect(removeBtns).toHaveLength(2);
  });

  it("clicking remove on an item removes it from the list", async () => {
    await renderAndWait();
    const removeBtns = screen.getAllByRole("button", { name: /remove/i });
    await userEvent.click(removeBtns[0]);
    await waitFor(() =>
      expect(screen.queryByText("Arroz blanco")).not.toBeInTheDocument(),
    );
  });

  it("calls repository.update after removing", async () => {
    await renderAndWait();
    const removeBtns = screen.getAllByRole("button", { name: /remove/i });
    await userEvent.click(removeBtns[0]);
    await waitFor(() => expect(mockRepository.update).toHaveBeenCalled());
  });

  it("disables remove on last item (single-item menu)", async () => {
    const singleMenu = new MenuBuilder()
      .withId("menu-detail-1")
      .withItems([DEFAULT_ITEM_1])
      .build();
    vi.mocked(mockRepository.getById).mockResolvedValue(singleMenu);
    render(<MenuDetailPage params={{ id: "menu-detail-1" }} />, { wrapper });
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    const removeBtn = screen.getByRole("button", { name: /remove/i });
    expect(removeBtn).toBeDisabled();
  });
});

// ─── T023: Add aliment via AutocompleteSearch ─────────────────────────────

vi.mock("@/src/application/hooks/useCompositeAliments", () => ({
  useCompositeAliments: () => ({
    findAll: vi.fn().mockResolvedValue([]),
  }),
}));

describe("MenuDetailPage — add aliment (T023)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(mockRepository.getById).mockResolvedValue(testMenu);
    vi.mocked(mockRepository.update).mockResolvedValue(undefined);
  });

  it("renders the aliment search input", async () => {
    await renderAndWait();
    expect(screen.getByPlaceholderText(/buscar alimento/i)).toBeInTheDocument();
  });
});
