/**
 * MenuRepositoryContext Tests
 * Tests for MenuRepository dependency injection context
 */

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import {
  MenuRepositoryProvider,
  useMenuRepository,
} from "@/src/application/contexts/MenuRepositoryContext";
import { LocalStorageMenuRepository } from "@/src/infrastructure/repositories/LocalStorageMenuRepository";

describe("MenuRepositoryContext", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("MenuRepositoryProvider", () => {
    it("should provide repository to children", () => {
      const repository = new LocalStorageMenuRepository();

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MenuRepositoryProvider repository={repository}>
          {children}
        </MenuRepositoryProvider>
      );

      const { result } = renderHook(() => useMenuRepository(), { wrapper });

      expect(result.current).toBe(repository);
    });

    it("should allow different repository implementations", () => {
      const customRepo = new LocalStorageMenuRepository();

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MenuRepositoryProvider repository={customRepo}>
          {children}
        </MenuRepositoryProvider>
      );

      const { result } = renderHook(() => useMenuRepository(), { wrapper });

      expect(result.current).toBe(customRepo);
    });
  });

  describe("useMenuRepository()", () => {
    it("should throw error when used outside provider", () => {
      expect(() => {
        renderHook(() => useMenuRepository());
      }).toThrow(
        "useMenuRepository must be used within MenuRepositoryProvider",
      );
    });

    it("should throw meaningful error message", () => {
      try {
        renderHook(() => useMenuRepository());
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toContain("MenuRepositoryProvider");
        expect(error.message).toContain("useMenuRepository");
      }
    });

    it("should not throw when inside provider", () => {
      const repository = new LocalStorageMenuRepository();

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MenuRepositoryProvider repository={repository}>
          {children}
        </MenuRepositoryProvider>
      );

      expect(() => {
        renderHook(() => useMenuRepository(), { wrapper });
      }).not.toThrow();
    });
  });
});
