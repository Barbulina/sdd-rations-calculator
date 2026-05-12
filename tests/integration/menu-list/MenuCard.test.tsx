/**
 * MenuCard Integration Tests
 * T009: renders name, type label, date, rations, weight
 * T013: delete button triggers onDelete with correct id
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuCard } from "@/app/components/MenuCard";
import { MenuType } from "@/src/domain/models/MenuType";
import { MenuBuilder } from "../../unit/menu-list/MenuBuilder";

const baseMenu = new MenuBuilder()
  .withId("menu-123")
  .withName("My Breakfast")
  .withType(MenuType.BREAKFAST)
  .withCreatedAt(new Date("2026-05-12T08:00:00.000Z"))
  .withItems([
    {
      id: "i1",
      aliment: {
        name: "apple",
        type: "frutas",
        gramsToCarbohydrate: 110,
        bloodGlucoseIndex: 38,
      },
      weightGrams: 150,
      rations: 1.36,
    },
    {
      id: "i2",
      aliment: {
        name: "bread",
        type: "cereales",
        gramsToCarbohydrate: 20,
        bloodGlucoseIndex: 70,
      },
      weightGrams: 60,
      rations: 3.0,
    },
  ])
  .build();

// totalWeight = 210, totalRations = 4.36

describe("MenuCard — rendering (T009)", () => {
  it("displays the menu name", () => {
    render(<MenuCard menu={baseMenu} onDelete={vi.fn()} />);
    expect(screen.getByText("My Breakfast")).toBeInTheDocument();
  });

  it("displays the meal type as human-readable label", () => {
    render(<MenuCard menu={baseMenu} onDelete={vi.fn()} />);
    expect(screen.getByText("Breakfast")).toBeInTheDocument();
  });

  it("displays the creation date in readable format", () => {
    render(<MenuCard menu={baseMenu} onDelete={vi.fn()} />);
    // Date: May 12, 2026
    expect(screen.getByText(/May 12, 2026/i)).toBeInTheDocument();
  });

  it("displays total rations with 2 decimal places", () => {
    render(<MenuCard menu={baseMenu} onDelete={vi.fn()} />);
    expect(screen.getByText(/4\.36/)).toBeInTheDocument();
  });

  it("displays total weight in grams", () => {
    render(<MenuCard menu={baseMenu} onDelete={vi.fn()} />);
    expect(screen.getByText(/210/)).toBeInTheDocument();
  });

  it("renders Lunch type label correctly", () => {
    const lunchMenu = new MenuBuilder()
      .withId("m2")
      .withType(MenuType.LUNCH)
      .build();
    render(<MenuCard menu={lunchMenu} onDelete={vi.fn()} />);
    expect(screen.getByText("Lunch")).toBeInTheDocument();
  });

  it("renders Dinner type label correctly", () => {
    const dinnerMenu = new MenuBuilder()
      .withId("m3")
      .withType(MenuType.DINNER)
      .build();
    render(<MenuCard menu={dinnerMenu} onDelete={vi.fn()} />);
    expect(screen.getByText("Dinner")).toBeInTheDocument();
  });

  it("renders Snack type label correctly", () => {
    const snackMenu = new MenuBuilder()
      .withId("m4")
      .withType(MenuType.SNACK)
      .build();
    render(<MenuCard menu={snackMenu} onDelete={vi.fn()} />);
    expect(screen.getByText("Snack")).toBeInTheDocument();
  });
});

describe("MenuCard — delete action (T013)", () => {
  it("has a delete button", () => {
    render(<MenuCard menu={baseMenu} onDelete={vi.fn()} />);
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("calls onDelete with the menu id when delete button clicked", async () => {
    const onDelete = vi.fn();
    render(<MenuCard menu={baseMenu} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("menu-123");
  });

  it("calls onDelete exactly once per click", async () => {
    const onDelete = vi.fn();
    render(<MenuCard menu={baseMenu} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

describe("MenuCard — navigation link (T010)", () => {
  it("has a link to the menu detail page", () => {
    render(<MenuCard menu={baseMenu} onDelete={vi.fn()} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/menu/menu-123");
  });

  it("delete button does NOT navigate (stops propagation)", async () => {
    const onDelete = vi.fn();
    render(<MenuCard menu={baseMenu} onDelete={onDelete} />);
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    // delete button must not be inside the <a> link element
    const link = screen.getByRole("link");
    expect(link).not.toContainElement(deleteBtn);
  });
});
