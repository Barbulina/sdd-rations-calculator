/**
 * HomePage Integration Tests
 * T010: loading state, empty state, list of cards
 * T018: name filter narrows cards, no-results message
 * T023: type filter + combined AND logic
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import HomePage from "@/app/page";
import { MenuRepositoryProvider } from "@/src/application/contexts/MenuRepositoryContext";
import type { MenuRepository } from "@/src/domain/repositories/MenuRepository";
import { MenuType } from "@/src/domain/models/MenuType";
import { MenuBuilder } from "../../shared/MenuBuilder";

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

const breakfastMenu = new MenuBuilder()
  .withId("b1")
  .withName("Morning Oats")
  .withType(MenuType.BREAKFAST)
  .withCreatedAt(new Date("2026-05-12T08:00:00.000Z"))
  .build();

const lunchMenu = new MenuBuilder()
  .withId("l1")
  .withName("Pasta Lunch")
  .withType(MenuType.LUNCH)
  .withCreatedAt(new Date("2026-05-11T12:00:00.000Z"))
  .build();

const dinnerMenu = new MenuBuilder()
  .withId("d1")
  .withName("Grilled Dinner")
  .withType(MenuType.DINNER)
  .withCreatedAt(new Date("2026-05-10T20:00:00.000Z"))
  .build();

// ─── T010: loading + empty state + list ────────────────────────────────────

describe("HomePage — loading + empty state + list (T010)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows loading state while fetching", () => {
    vi.mocked(mockRepository.getAll).mockImplementation(
      () => new Promise(() => {}), // never resolves
    );
    render(<HomePage />, { wrapper });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows empty state when no menus exist", async () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([]);
    render(<HomePage />, { wrapper });
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(screen.getByText(/no menus yet/i)).toBeInTheDocument();
  });

  it("renders a MenuCard for each menu", async () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([
      breakfastMenu,
      lunchMenu,
    ]);
    render(<HomePage />, { wrapper });
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Morning Oats")).toBeInTheDocument();
    expect(screen.getByText("Pasta Lunch")).toBeInTheDocument();
  });

  it("shows the page title", async () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([]);
    render(<HomePage />, { wrapper });
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("has a create button linking to /menu-builder", async () => {
    vi.mocked(mockRepository.getAll).mockResolvedValue([]);
    render(<HomePage />, { wrapper });
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    // At least one link points to /menu-builder (header + empty state both do)
    const createLinks = screen.getAllByRole("link");
    const menuBuilderLinks = createLinks.filter(
      (link) => link.getAttribute("href") === "/menu-builder",
    );
    expect(menuBuilderLinks.length).toBeGreaterThan(0);
  });
});

// ─── T018: name filter ──────────────────────────────────────────────────────

describe("HomePage — name filter (T018)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockRepository.getAll).mockResolvedValue([
      breakfastMenu,
      lunchMenu,
      dinnerMenu,
    ]);
  });

  async function renderAndWait() {
    render(<HomePage />, { wrapper });
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
  }

  it("shows a name search input when menus exist", async () => {
    await renderAndWait();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("filters cards as user types a name", async () => {
    await renderAndWait();
    await userEvent.type(screen.getByPlaceholderText(/search/i), "Oats");
    expect(screen.getByText("Morning Oats")).toBeInTheDocument();
    expect(screen.queryByText("Pasta Lunch")).not.toBeInTheDocument();
  });

  it("shows all cards when search is cleared", async () => {
    await renderAndWait();
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, "Oats");
    await userEvent.clear(input);
    expect(screen.getByText("Morning Oats")).toBeInTheDocument();
    expect(screen.getByText("Pasta Lunch")).toBeInTheDocument();
  });

  it("shows no-results message when filter matches nothing", async () => {
    await renderAndWait();
    await userEvent.type(screen.getByPlaceholderText(/search/i), "zzz-nothing");
    expect(screen.getByText(/no menus match/i)).toBeInTheDocument();
  });
});

// ─── T023: type filter + combined AND logic ─────────────────────────────────

describe("HomePage — type filter + combined AND filter (T023)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockRepository.getAll).mockResolvedValue([
      breakfastMenu,
      lunchMenu,
      dinnerMenu,
    ]);
  });

  async function renderAndWait() {
    render(<HomePage />, { wrapper });
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
  }

  it("shows a type filter dropdown when menus exist", async () => {
    await renderAndWait();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("filters by type when a type is selected", async () => {
    await renderAndWait();
    await userEvent.selectOptions(screen.getByRole("combobox"), "BREAKFAST");
    expect(screen.getByText("Morning Oats")).toBeInTheDocument();
    expect(screen.queryByText("Pasta Lunch")).not.toBeInTheDocument();
  });

  it("shows all menus when 'All types' is selected", async () => {
    await renderAndWait();
    await userEvent.selectOptions(screen.getByRole("combobox"), "BREAKFAST");
    await userEvent.selectOptions(screen.getByRole("combobox"), "");
    expect(screen.getByText("Morning Oats")).toBeInTheDocument();
    expect(screen.getByText("Pasta Lunch")).toBeInTheDocument();
    expect(screen.getByText("Grilled Dinner")).toBeInTheDocument();
  });

  it("applies name and type filters together (AND logic)", async () => {
    const breakfast2 = new MenuBuilder()
      .withId("b2")
      .withName("Overnight Oats")
      .withType(MenuType.BREAKFAST)
      .withCreatedAt(new Date("2026-05-09T08:00:00.000Z"))
      .build();
    vi.mocked(mockRepository.getAll).mockResolvedValue([
      breakfastMenu,
      breakfast2,
      lunchMenu,
    ]);
    render(<HomePage />, { wrapper });
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await userEvent.selectOptions(screen.getByRole("combobox"), "BREAKFAST");
    await userEvent.type(screen.getByPlaceholderText(/search/i), "Morning");

    expect(screen.getByText("Morning Oats")).toBeInTheDocument();
    expect(screen.queryByText("Overnight Oats")).not.toBeInTheDocument();
    expect(screen.queryByText("Pasta Lunch")).not.toBeInTheDocument();
  });
});
