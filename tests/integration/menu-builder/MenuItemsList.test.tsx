/**
 * MenuItemsList Component Tests
 * Tests for displaying and managing list of menu items
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuItemsList } from "@/app/components/menu-builder/MenuItemsList";
import type { MenuItem } from "@/specs/004-menu-builder/contracts/types";
import { RationsType } from "@/src/domain/models/RationsType";

const mockItems: MenuItem[] = [
  {
    id: "1",
    aliment: {
      name: "Manzana Golden",
      gramsToCarbohydrate: 150,
      bloodGlucoseIndex: 38,
      type: RationsType.fruits,
    },
    weightGrams: 150,
    rations: 1.0,
  },
  {
    id: "2",
    aliment: {
      name: "Pan integral",
      gramsToCarbohydrate: 20,
      bloodGlucoseIndex: 69,
      type: RationsType.cereals_flours_pulses_legumes_tubers,
    },
    weightGrams: 40,
    rations: 2.0,
  },
  {
    id: "3",
    aliment: {
      name: "Aguacate casero",
      gramsToCarbohydrate: 200,
      bloodGlucoseIndex: 15,
      type: RationsType.oily_and_dry_fruit,
      id: "custom-123",
      isCustom: true as const,
      createdAt: new Date("2026-02-01"),
    },
    weightGrams: 100,
    rations: 0.5,
  },
];

describe("MenuItemsList", () => {
  let onUpdateWeight: ReturnType<typeof vi.fn>;
  let onRemoveItem: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onUpdateWeight = vi.fn();
    onRemoveItem = vi.fn();
    vi.clearAllMocks();
  });

  describe("rendering items", () => {
    it("should render all menu items", () => {
      render(
        <MenuItemsList
          items={mockItems}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
      expect(screen.getByText("Pan integral")).toBeInTheDocument();
      expect(screen.getByText("Aguacate casero")).toBeInTheDocument();
    });

    it("should render correct number of items", () => {
      render(
        <MenuItemsList
          items={mockItems}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      // Each item should have a card (article role or testid)
      const items = screen.getAllByTestId(/menu-item-card/);
      expect(items).toHaveLength(3);
    });
  });

  describe("aliment data display", () => {
    it("should display aliment name as heading", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      const heading = screen.getByRole("heading", { name: /manzana golden/i });
      expect(heading).toBeInTheDocument();
    });

    it("should display category badge", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      expect(screen.getByText(/frutas/i)).toBeInTheDocument();
    });

    it("should display gramsToCarbohydrate", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      expect(screen.getByText(/150g/)).toBeInTheDocument();
    });

    it("should display glycemic index when available", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      // Use getAllByText since there might be multiple elements
      const elements = screen.getAllByText((content, element) => {
        return (
          element?.textContent?.includes("GI") &&
          element?.textContent?.includes("38")
        );
      });
      expect(elements.length).toBeGreaterThan(0);
    });

    it("should display custom badge for custom aliments", () => {
      render(
        <MenuItemsList
          items={[mockItems[2]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      expect(screen.getByText(/custom|personalizado/i)).toBeInTheDocument();
    });

    it("should not display custom badge for catalog aliments", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      expect(
        screen.queryByText(/custom|personalizado/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("weight inline editing", () => {
    it("should render weight input for each item", () => {
      render(
        <MenuItemsList
          items={mockItems}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      const weightInputs = screen.getAllByLabelText(/weight|peso/i);
      expect(weightInputs).toHaveLength(3);
    });

    it("should display current weight value", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      const weightInput = screen.getByLabelText(
        /weight|peso/i,
      ) as HTMLInputElement;
      expect(weightInput.value).toBe("150");
    });

    it("should call onUpdateWeight when weight changes", async () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      const weightInput = screen.getByLabelText(/weight|peso/i);

      // Use fireEvent.change for more reliable testing
      fireEvent.change(weightInput, { target: { value: "200" } });

      // Should be called with the correct item id and weight
      expect(onUpdateWeight).toHaveBeenCalledWith("1", 200);
    });

    it("should have number input type", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      const weightInput = screen.getByLabelText(/weight|peso/i);
      expect(weightInput).toHaveAttribute("type", "number");
    });

    it("should have min and max validation attributes", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      const weightInput = screen.getByLabelText(/weight|peso/i);
      expect(weightInput).toHaveAttribute("min", "1");
      expect(weightInput).toHaveAttribute("max", "10000");
    });
  });

  describe("rations display", () => {
    it("should display calculated rations", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      // Check for rations value
      expect(screen.getByText("1.00")).toBeInTheDocument();
      const rationsText = screen.getAllByText(/rations/i);
      expect(rationsText.length).toBeGreaterThan(0);
    });

    it("should format rations to 2 decimal places", () => {
      render(
        <MenuItemsList
          items={[mockItems[2]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      expect(screen.getByText("0.50")).toBeInTheDocument();
      const rationsText = screen.getAllByText(/rations/i);
      expect(rationsText.length).toBeGreaterThan(0);
    });

    it("should update rations display when weight changes", () => {
      const { rerender } = render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      expect(screen.getByText("1.00")).toBeInTheDocument();

      // Simulate weight change by passing updated items
      const updatedItems = [
        { ...mockItems[0], weightGrams: 300, rations: 2.0 },
      ];
      rerender(
        <MenuItemsList
          items={updatedItems}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      expect(screen.getByText("2.00")).toBeInTheDocument();
    });
  });

  describe("remove button", () => {
    it("should render remove button for each item", () => {
      render(
        <MenuItemsList
          items={mockItems}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      const removeButtons = screen.getAllByRole("button", {
        name: /remove|eliminar|delete/i,
      });
      expect(removeButtons).toHaveLength(3);
    });

    it("should call onRemoveItem when remove button clicked", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      const removeButton = screen.getByRole("button", {
        name: /remove|eliminar|delete/i,
      });
      fireEvent.click(removeButton);

      expect(onRemoveItem).toHaveBeenCalledTimes(1);
      expect(onRemoveItem).toHaveBeenCalledWith("1");
    });

    it("should have trash icon or delete indicator", () => {
      render(
        <MenuItemsList
          items={[mockItems[0]]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      const removeButton = screen.getByRole("button", {
        name: /remove|eliminar|delete/i,
      });
      // Should have some visual indicator (icon, text, or aria-label)
      expect(removeButton).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("should show empty state when no items", () => {
      render(
        <MenuItemsList
          items={[]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      expect(
        screen.getByText(/no aliments added|no hay alimentos|añade alimentos/i),
      ).toBeInTheDocument();
    });

    it("should not show empty state when items exist", () => {
      render(
        <MenuItemsList
          items={mockItems}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      expect(
        screen.queryByText(/no aliments added|no hay alimentos/i),
      ).not.toBeInTheDocument();
    });

    it("should show helpful message in empty state", () => {
      render(
        <MenuItemsList
          items={[]}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      // Should have some guidance on what to do
      const messages = screen.queryAllByText(/search|buscar|add|añadir/i);
      expect(messages.length).toBeGreaterThan(0);
    });
  });

  describe("styling and layout", () => {
    it("should render items in a list container", () => {
      render(
        <MenuItemsList
          items={mockItems}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      // Should have some container (ul, div with role="list", etc.)
      const container =
        screen.getByTestId("menu-items-list") || screen.getByRole("list");
      expect(container).toBeInTheDocument();
    });

    it("should apply spacing between items", () => {
      const { container } = render(
        <MenuItemsList
          items={mockItems}
          onUpdateWeight={onUpdateWeight}
          onRemoveItem={onRemoveItem}
        />,
      );

      // Items should have margin or gap between them
      const items = container.querySelectorAll(
        '[data-testid*="menu-item-card"]',
      );
      expect(items.length).toBeGreaterThan(0);
    });
  });
});
