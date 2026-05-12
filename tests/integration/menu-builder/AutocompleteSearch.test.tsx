/**
 * AutocompleteSearch Component Tests
 * Tests for aliment search with autocomplete functionality
 */

import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AutocompleteSearch } from "@/app/components/menu-builder/AutocompleteSearch";
import type { UnifiedAliment } from "@/src/domain/repositories/CompositeAlimentRepository";
import { RationsType } from "@/src/domain/models/RationsType";

// Use vi.hoisted to create a stable mock repository object (avoids infinite loop caused by
// new object reference on every render triggering useEffect re-runs in the component)
const { mockRepository, mockFindAll } = vi.hoisted(() => {
  const findAll = vi.fn();
  return { mockRepository: { findAll }, mockFindAll: findAll };
});

vi.mock("@/src/application/hooks/useCompositeAliments", () => ({
  useCompositeAliments: () => mockRepository,
}));

const mockAliments: UnifiedAliment[] = [
  {
    name: "Manzana Golden",
    gramsToCarbohydrate: 150,
    bloodGlucoseIndex: 38,
    type: RationsType.fruits,
  },
  {
    name: "Plátano",
    gramsToCarbohydrate: 50,
    bloodGlucoseIndex: 51,
    type: RationsType.fruits,
  },
  {
    name: "Pan integral",
    gramsToCarbohydrate: 20,
    bloodGlucoseIndex: 69,
    type: RationsType.cereals_flours_pulses_legumes_tubers,
  },
];

describe("AutocompleteSearch", () => {
  let onSelectAliment: ReturnType<
    typeof vi.fn<[(aliment: UnifiedAliment) => void]>
  >;

  beforeEach(() => {
    onSelectAliment = vi.fn<[(aliment: UnifiedAliment) => void]>();
    vi.clearAllMocks();
    mockFindAll.mockResolvedValue(mockAliments);
  });

  afterEach(() => {
    // Always restore real timers to prevent leakage between tests
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("should render search input", () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      expect(searchInput).toBeInTheDocument();
    });

    it("should render search input with correct type", () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      expect(searchInput).toHaveAttribute("type", "text");
    });

    it("should not show suggestions initially", () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const suggestions = screen.queryByRole("listbox");
      expect(suggestions).not.toBeInTheDocument();
    });
  });

  describe("debounced search", () => {
    it("should debounce search input by 300ms", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      // Wait for aliments to load
      await act(async () => {
        await Promise.resolve();
      });

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);

      // Type quickly
      fireEvent.change(searchInput, { target: { value: "man" } });

      // Suggestions should not appear immediately
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

      // Fast-forward 300ms and flush React state
      await act(async () => {
        vi.advanceTimersByTime(300);
        await Promise.resolve();
      });

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("should reset debounce timer on new input", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      // Wait for aliments to load
      await act(async () => {
        await Promise.resolve();
      });

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);

      // Type first letter
      fireEvent.change(searchInput, { target: { value: "m" } });
      await act(async () => {
        vi.advanceTimersByTime(200);
        await Promise.resolve();
      });

      // Type second letter before debounce completes
      fireEvent.change(searchInput, { target: { value: "ma" } });
      await act(async () => {
        vi.advanceTimersByTime(200);
        await Promise.resolve();
      });

      // Should not show results yet (timer was reset)
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

      // Complete the debounce
      await act(async () => {
        vi.advanceTimersByTime(100);
        await Promise.resolve();
      });

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  describe("filtering aliments", () => {
    it("should filter aliments by name (case-insensitive)", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
      });

      expect(screen.queryByText("Plátano")).not.toBeInTheDocument();
      expect(screen.queryByText("Pan integral")).not.toBeInTheDocument();
    });

    it("should filter by partial name match", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "man");

      await waitFor(() => {
        expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
      });
    });

    it("should be case-insensitive", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "MANZANA");

      await waitFor(() => {
        expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
      });
    });

    it("should show multiple matching results", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "a"); // All aliments contain 'a'

      await waitFor(() => {
        expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
        expect(screen.getByText("Plátano")).toBeInTheDocument();
        expect(screen.getByText("Pan integral")).toBeInTheDocument();
      });
    });
  });

  describe("keyboard navigation", () => {
    it("should highlight first item on ArrowDown", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "a");

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      fireEvent.keyDown(searchInput, { key: "ArrowDown" });

      const firstOption = screen
        .getByText("Manzana Golden")
        .closest('[role="option"]');
      expect(firstOption).toHaveAttribute("aria-selected", "true");
    });

    it("should move down on multiple ArrowDown presses", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "a");

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });

      const secondOption = screen
        .getByText("Plátano")
        .closest('[role="option"]');
      expect(secondOption).toHaveAttribute("aria-selected", "true");
    });

    it("should move up on ArrowUp", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "a");

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      // Move down twice, then up once
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });

      const firstOption = screen
        .getByText("Manzana Golden")
        .closest('[role="option"]');
      expect(firstOption).toHaveAttribute("aria-selected", "true");
    });

    it("should wrap to last item on ArrowUp from first", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "a");

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      fireEvent.keyDown(searchInput, { key: "ArrowDown" }); // Select first
      fireEvent.keyDown(searchInput, { key: "ArrowUp" }); // Wrap to last

      const lastOption = screen
        .getByText("Pan integral")
        .closest('[role="option"]');
      expect(lastOption).toHaveAttribute("aria-selected", "true");
    });

    it("should wrap to first item on ArrowDown from last", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "a");

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      // Move to last item
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      // Wrap to first
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });

      const firstOption = screen
        .getByText("Manzana Golden")
        .closest('[role="option"]');
      expect(firstOption).toHaveAttribute("aria-selected", "true");
    });

    it("should select highlighted item on Enter", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
      });

      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "Enter" });

      expect(onSelectAliment).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Manzana Golden",
        }),
      );
    });

    it("should close dropdown on Escape", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      fireEvent.keyDown(searchInput, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
    });
  });

  describe("suggestion item display", () => {
    it("should display aliment name", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
      });
    });

    it("should display grams to carbohydrate", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByText(/150g/)).toBeInTheDocument();
      });
    });

    it("should display glycemic index", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByText(/GI: 38/i)).toBeInTheDocument();
      });
    });

    it("should display category badge", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByText(/frutas/i)).toBeInTheDocument();
      });
    });

    it("should display different category for different aliment", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "pan");

      await waitFor(() => {
        expect(screen.getByText(/cereales/i)).toBeInTheDocument();
      });
    });
  });

  describe("click to select", () => {
    it("should call onSelectAliment when suggestion is clicked", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
      });

      const suggestion = screen.getByText("Manzana Golden");
      fireEvent.click(suggestion);

      expect(onSelectAliment).toHaveBeenCalledTimes(1);
      expect(onSelectAliment).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Manzana Golden",
          gramsToCarbohydrate: 150,
        }),
      );
    });

    it("should close dropdown after selection", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
      });

      const suggestion = screen.getByText("Manzana Golden");
      fireEvent.click(suggestion);

      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
    });

    it("should clear search input after selection", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(
        /buscar alimento/i,
      ) as HTMLInputElement;
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
      });

      const suggestion = screen.getByText("Manzana Golden");
      fireEvent.click(suggestion);

      await waitFor(() => {
        expect(searchInput.value).toBe("");
      });
    });
  });

  describe("empty state", () => {
    it('should show "No aliments found" when no results', async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "xyz123notfound");

      await waitFor(() => {
        expect(
          screen.getByText(/no se encontraron alimentos/i),
        ).toBeInTheDocument();
      });
    });

    it("should not show empty state when results exist", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByText("Manzana Golden")).toBeInTheDocument();
      });

      expect(
        screen.queryByText(/no se encontraron alimentos/i),
      ).not.toBeInTheDocument();
    });

    it("should not show empty state when search is empty", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      expect(searchInput).toHaveValue("");

      expect(
        screen.queryByText(/no se encontraron alimentos/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("ARIA attributes", () => {
    it("should have combobox role on input", () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      expect(searchInput).toHaveAttribute("role", "combobox");
    });

    it("should have aria-autocomplete attribute", () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      expect(searchInput).toHaveAttribute("aria-autocomplete", "list");
    });

    it("should have aria-expanded=false when closed", () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      expect(searchInput).toHaveAttribute("aria-expanded", "false");
    });

    it("should have aria-expanded=true when open", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(searchInput).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("should have aria-activedescendant when item is highlighted", async () => {
      render(<AutocompleteSearch onSelectAliment={onSelectAliment} />);

      const searchInput = screen.getByPlaceholderText(/buscar alimento/i);
      await userEvent.type(searchInput, "manzana");

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      fireEvent.keyDown(searchInput, { key: "ArrowDown" });

      expect(searchInput).toHaveAttribute("aria-activedescendant");
      const activeId = searchInput.getAttribute("aria-activedescendant");
      expect(activeId).toBeTruthy();
    });
  });
});
