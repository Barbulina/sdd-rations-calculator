import { describe, it, expect } from "vitest";
import { searchByName } from "@/src/application/utils/search";

interface TestItem {
  name: string;
  id: number;
}

const items: TestItem[] = [
  { name: "Manzana", id: 1 },
  { name: "Plátano", id: 2 },
  { name: "Pan integral", id: 3 },
  { name: "cuscús", id: 4 },
  { name: "helado sin azúcar añadido", id: 5 },
  { name: "col ácido", id: 6 },
  { name: "chirimoya", id: 7 },
  { name: "cebolla frita en aros", id: 8 },
];

describe("searchByName", () => {
  it("returns all items when query is empty", () => {
    expect(searchByName(items, "")).toHaveLength(8);
    expect(searchByName(items, "   ")).toHaveLength(8);
  });

  it("finds exact match (case-insensitive)", () => {
    const result = searchByName(items, "manzana");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("finds items by partial match", () => {
    const result = searchByName(items, "pan");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it("finds items without accents when query lacks accents", () => {
    const result = searchByName(items, "platano");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("finds items without accents when query has accents", () => {
    const result = searchByName(items, "plátano");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("finds items with special characters (cuscús)", () => {
    const result = searchByName(items, "cuscus");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(4);
  });

  it("finds items with ú character (azúcar)", () => {
    const result = searchByName(items, "azucar");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(5);
  });

  it("finds items with ó character (col ácido)", () => {
    const result = searchByName(items, "acido");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(6);
  });

  it("finds items with á character (cebolla frita)", () => {
    const result = searchByName(items, "aros");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(8);
  });

  it("returns empty array when no match", () => {
    const result = searchByName(items, "xyz");
    expect(result).toHaveLength(0);
  });

  it("sorts results: exact match first", () => {
    const result = searchByName(items, "manzana");
    expect(result[0].id).toBe(1);
  });

  it("sorts results: starts-with before contains", () => {
    const result = searchByName(items, "chiri");
    expect(result[0].id).toBe(7);
  });

  it("is case-insensitive with accents", () => {
    const result = searchByName(items, "PLATANO");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("does not mutate the original array", () => {
    const original = [...items];
    searchByName(items, "manzana");
    expect(items).toEqual(original);
  });
});
