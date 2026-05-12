/**
 * MenuBuilder for Feature 006 (menu-detail) tests.
 *
 * Produces plain Menu objects (interface) with multiple items support.
 * Uses MenuType (BREAKFAST/LUNCH/DINNER/SNACK) cast to satisfy RationsType interface.
 */

import type { Menu, MenuItem } from "../../../specs/004-menu-builder/contracts/types";
import { MenuType } from "@/src/domain/models/MenuType";

// ─── MenuItem factory ──────────────────────────────────────────────────────

export function createMenuItem(overrides?: Partial<MenuItem>): MenuItem {
  return {
    id: `item-${Math.random().toString(36).slice(2, 9)}`,
    aliment: {
      name: "Manzana",
      type: "frutas",
      gramsToCarbohydrate: 110,
      bloodGlucoseIndex: 38,
    },
    weightGrams: 150,
    rations: 1.36,
    ...overrides,
  } as unknown as MenuItem;
}

export const DEFAULT_ITEM_1: MenuItem = createMenuItem({
  id: "item-1",
  aliment: {
    name: "Arroz blanco",
    type: "cereales",
    gramsToCarbohydrate: 25,
    bloodGlucoseIndex: 72,
  } as any,
  weightGrams: 80,
  rations: 3.2,
});

export const DEFAULT_ITEM_2: MenuItem = createMenuItem({
  id: "item-2",
  aliment: {
    name: "Pechuga de pollo",
    type: "proteinas",
    gramsToCarbohydrate: 0,
    bloodGlucoseIndex: 0,
  } as any,
  weightGrams: 120,
  rations: 0,
});

// ─── MenuBuilder ───────────────────────────────────────────────────────────

export class MenuBuilder {
  private _id: string = "menu-uuid-006";
  private _name: string = "Test Lunch";
  private _type: MenuType = MenuType.LUNCH;
  private _items: MenuItem[] = [DEFAULT_ITEM_1, DEFAULT_ITEM_2];
  private _createdAt: Date = new Date("2026-05-12T12:00:00.000Z");
  private _updatedAt?: Date;

  withId(id: string): this {
    this._id = id;
    return this;
  }
  withName(name: string): this {
    this._name = name;
    return this;
  }
  withType(type: MenuType): this {
    this._type = type;
    return this;
  }
  withItems(items: MenuItem[]): this {
    this._items = items;
    return this;
  }
  withCreatedAt(date: Date): this {
    this._createdAt = date;
    return this;
  }
  withUpdatedAt(date: Date): this {
    this._updatedAt = date;
    return this;
  }

  build(): Menu {
    const totalWeight = this._items.reduce((sum, item) => sum + item.weightGrams, 0);
    const totalRations = Number(
      this._items.reduce((sum, item) => sum + item.rations, 0).toFixed(2),
    );
    return {
      id: this._id,
      name: this._name,
      type: this._type as any,
      items: this._items,
      totalWeight,
      totalRations,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
