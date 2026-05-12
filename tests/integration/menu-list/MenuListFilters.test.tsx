/**
 * MenuListFilters Integration Tests
 * T017: name input renders and calls onNameFilterChange
 * T022: type dropdown renders all options, calls onTypeFilterChange
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuListFilters } from "@/app/components/MenuListFilters";
import { MenuType } from "@/src/domain/models/MenuType";

const defaultProps = {
  nameFilter: "",
  onNameFilterChange: vi.fn(),
  typeFilter: null as MenuType | null,
  onTypeFilterChange: vi.fn(),
};

// ─── T017: name input ──────────────────────────────────────────────────────

describe("MenuListFilters — name input (T017)", () => {
  it("renders a name search input", () => {
    render(<MenuListFilters {...defaultProps} />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("calls onNameFilterChange with typed value", async () => {
    const onNameFilterChange = vi.fn();
    render(
      <MenuListFilters
        {...defaultProps}
        onNameFilterChange={onNameFilterChange}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText(/search/i), "abc");
    expect(onNameFilterChange).toHaveBeenCalled();
  });

  it("reflects the current nameFilter value", () => {
    render(<MenuListFilters {...defaultProps} nameFilter="pasta" />);
    expect(screen.getByDisplayValue("pasta")).toBeInTheDocument();
  });

  it("input has maxLength of 200", () => {
    render(<MenuListFilters {...defaultProps} />);
    expect(screen.getByPlaceholderText(/search/i)).toHaveAttribute(
      "maxLength",
      "200",
    );
  });
});

// ─── T022: type dropdown ───────────────────────────────────────────────────

describe("MenuListFilters — type dropdown (T022)", () => {
  it("renders a type filter dropdown", () => {
    render(<MenuListFilters {...defaultProps} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("includes 'All types' option", () => {
    render(<MenuListFilters {...defaultProps} />);
    expect(
      screen.getByRole("option", { name: "All types" }),
    ).toBeInTheDocument();
  });

  it("includes Breakfast option", () => {
    render(<MenuListFilters {...defaultProps} />);
    expect(
      screen.getByRole("option", { name: "Breakfast" }),
    ).toBeInTheDocument();
  });

  it("includes Lunch option", () => {
    render(<MenuListFilters {...defaultProps} />);
    expect(screen.getByRole("option", { name: "Lunch" })).toBeInTheDocument();
  });

  it("includes Dinner option", () => {
    render(<MenuListFilters {...defaultProps} />);
    expect(screen.getByRole("option", { name: "Dinner" })).toBeInTheDocument();
  });

  it("includes Snack option", () => {
    render(<MenuListFilters {...defaultProps} />);
    expect(screen.getByRole("option", { name: "Snack" })).toBeInTheDocument();
  });

  it("calls onTypeFilterChange with MenuType when a type is selected", async () => {
    const onTypeFilterChange = vi.fn();
    render(
      <MenuListFilters
        {...defaultProps}
        onTypeFilterChange={onTypeFilterChange}
      />,
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "BREAKFAST");
    expect(onTypeFilterChange).toHaveBeenCalledWith(MenuType.BREAKFAST);
  });

  it("calls onTypeFilterChange with null when 'All types' is selected", async () => {
    const onTypeFilterChange = vi.fn();
    render(
      <MenuListFilters
        {...defaultProps}
        typeFilter={MenuType.LUNCH}
        onTypeFilterChange={onTypeFilterChange}
      />,
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "");
    expect(onTypeFilterChange).toHaveBeenCalledWith(null);
  });

  it("reflects current typeFilter in the dropdown", () => {
    render(<MenuListFilters {...defaultProps} typeFilter={MenuType.DINNER} />);
    expect(screen.getByRole("combobox")).toHaveValue("DINNER");
  });

  it("shows empty value when typeFilter is null", () => {
    render(<MenuListFilters {...defaultProps} typeFilter={null} />);
    expect(screen.getByRole("combobox")).toHaveValue("");
  });
});
