/**
 * MenuItemRow Integration Tests — T012
 * Renders aliment name, weight, rations. Has remove button.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuItemRow } from "@/app/components/menu-detail/MenuItemRow";
import { createMenuItem } from "../../shared/MenuItemBuilder";

const DEFAULT_ITEM_1 = createMenuItem({
  id: "item-1",
  aliment: {
    name: "Arroz blanco",
    type: "cereales",
    gramsToCarbohydrate: 25,
    bloodGlucoseIndex: 72,
  },
  weightGrams: 80,
  rations: 3.2,
});

describe("MenuItemRow — rendering (T012)", () => {
  it("shows the aliment name", () => {
    render(<MenuItemRow item={DEFAULT_ITEM_1} onRemove={vi.fn()} isLast={false} />);
    expect(screen.getByText("Arroz blanco")).toBeInTheDocument();
  });

  it("shows the weight in grams", () => {
    render(<MenuItemRow item={DEFAULT_ITEM_1} onRemove={vi.fn()} isLast={false} />);
    expect(screen.getByText(/80\s*g/)).toBeInTheDocument();
  });

  it("shows the rations with 2 decimal places", () => {
    render(<MenuItemRow item={DEFAULT_ITEM_1} onRemove={vi.fn()} isLast={false} />);
    expect(screen.getByText(/3\.20/)).toBeInTheDocument();
  });

  it("renders a remove button", () => {
    render(<MenuItemRow item={DEFAULT_ITEM_1} onRemove={vi.fn()} isLast={false} />);
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });

  it("calls onRemove with item id when button clicked", async () => {
    const onRemove = vi.fn();
    render(<MenuItemRow item={DEFAULT_ITEM_1} onRemove={onRemove} isLast={false} />);
    await userEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledWith(DEFAULT_ITEM_1.id);
  });

  it("disables remove button when isLast is true", () => {
    render(<MenuItemRow item={DEFAULT_ITEM_1} onRemove={vi.fn()} isLast={true} />);
    expect(screen.getByRole("button", { name: /remove/i })).toBeDisabled();
  });

  it("does not call onRemove when disabled (last item)", async () => {
    const onRemove = vi.fn();
    render(<MenuItemRow item={DEFAULT_ITEM_1} onRemove={onRemove} isLast={true} />);
    await userEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("shows rations as 0.00 when rations is 0", () => {
    const item = createMenuItem({ rations: 0 });
    render(<MenuItemRow item={item} onRemove={vi.fn()} isLast={false} />);
    expect(screen.getByText(/0\.00/)).toBeInTheDocument();
  });
});
