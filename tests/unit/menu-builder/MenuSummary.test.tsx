/**
 * MenuSummary Component Tests
 * Tests for displaying total weight and rations
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MenuSummary } from "@/app/components/menu-builder/MenuSummary";

describe("MenuSummary", () => {
  describe("rendering totals", () => {
    it("should render summary component", () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      // Should have some container or visible content
      const summary = screen.getByTestId("menu-summary");
      expect(summary).toBeInTheDocument();
    });

    it('should display "Total" or "Totals" heading', () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      expect(screen.getByText(/total/i)).toBeInTheDocument();
    });
  });

  describe("total weight display", () => {
    it('should display total weight with "g" unit', () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      expect(screen.getByText("150")).toBeInTheDocument();
      expect(screen.getByText("g")).toBeInTheDocument();
    });

    it("should display zero weight", () => {
      render(<MenuSummary totalWeight={0} totalRations={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("g")).toBeInTheDocument();
    });

    it("should display large weight values", () => {
      render(<MenuSummary totalWeight={5432} totalRations={10.5} />);

      expect(screen.getByText("5432")).toBeInTheDocument();
      expect(screen.getByText("g")).toBeInTheDocument();
    });

    it("should have label for weight", () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      expect(screen.getByText(/weight|peso/i)).toBeInTheDocument();
    });
  });

  describe("total rations display", () => {
    it("should display total rations with 2 decimals", () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      expect(screen.getByText(/1\.00/)).toBeInTheDocument();
    });

    it("should format rations to 2 decimal places", () => {
      render(<MenuSummary totalWeight={75} totalRations={0.5} />);

      expect(screen.getByText(/0\.50/)).toBeInTheDocument();
    });

    it('should display rations with "rations" label', () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      const rationsText = screen.getAllByText(/rations?/i);
      expect(rationsText.length).toBeGreaterThan(0);
    });

    it("should handle decimal rations correctly", () => {
      render(<MenuSummary totalWeight={225} totalRations={1.53} />);

      expect(screen.getByText(/1\.53/)).toBeInTheDocument();
    });

    it("should round to 2 decimals", () => {
      render(<MenuSummary totalWeight={333} totalRations={2.333333} />);

      expect(screen.getByText(/2\.33/)).toBeInTheDocument();
    });

    it("should have label for rations", () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      const rationsLabel = screen.getAllByText(/rations?/i);
      expect(rationsLabel.length).toBeGreaterThan(0);
    });
  });

  describe("auto-update when values change", () => {
    it("should update weight display when prop changes", () => {
      const { rerender } = render(
        <MenuSummary totalWeight={150} totalRations={1.0} />,
      );

      expect(screen.getByText("150")).toBeInTheDocument();

      rerender(<MenuSummary totalWeight={300} totalRations={2.0} />);

      expect(screen.getByText("300")).toBeInTheDocument();
    });

    it("should update rations display when prop changes", () => {
      const { rerender } = render(
        <MenuSummary totalWeight={150} totalRations={1.0} />,
      );

      expect(screen.getByText(/1\.00/)).toBeInTheDocument();

      rerender(<MenuSummary totalWeight={300} totalRations={2.0} />);

      expect(screen.getByText(/2\.00/)).toBeInTheDocument();
    });
  });

  describe("styling and layout", () => {
    it("should have highlighted styling", () => {
      const { container } = render(
        <MenuSummary totalWeight={150} totalRations={1.0} />,
      );

      const summary = container.querySelector('[data-testid="menu-summary"]');
      expect(summary).toHaveClass(/bg-|border-/); // Should have background or border classes
    });

    it("should display weight and rations side by side", () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      // Both values should be visible at the same time
      expect(screen.getByText("150")).toBeInTheDocument();
      expect(screen.getByText("1.00")).toBeInTheDocument();
    });
  });

  describe("ARIA attributes", () => {
    it("should have aria-live region for dynamic updates", () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      const summary = screen.getByTestId("menu-summary");
      expect(summary).toHaveAttribute("aria-live");
    });

    it("should have polite aria-live value", () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      const summary = screen.getByTestId("menu-summary");
      expect(summary).toHaveAttribute("aria-live", "polite");
    });

    it("should have aria-label or accessible name", () => {
      render(<MenuSummary totalWeight={150} totalRations={1.0} />);

      const summary = screen.getByTestId("menu-summary");
      // Should have aria-label or aria-labelledby
      const hasAccessibleName =
        summary.hasAttribute("aria-label") ||
        summary.hasAttribute("aria-labelledby");
      expect(hasAccessibleName).toBe(true);
    });
  });
});
