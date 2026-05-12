/**
 * MenuBuilder for Feature 005 tests
 *
 * Uses MenuType (BREAKFAST/LUNCH/DINNER/SNACK) instead of RationsType.
 * Produces plain Menu objects (interface), not Menu class instances.
 */

import type { Menu } from "../../../specs/004-menu-builder/contracts/types";
import { MenuType } from "@/src/domain/models/MenuType";

const defaultItem = {
  id: "item-uuid-1234",
  aliment: {
    name: "manzana",
    type: "frutas",
    gramsToCarbohydrate: 110,
    bloodGlucoseIndex: 38,
  },
  weightGrams: 150,
  rations: 1.36,
};

export class MenuBuilder {
  private _id: string = "test-menu-uuid-1234";
  private _name: string = "Test Menu";
  private _type: MenuType = MenuType.BREAKFAST;
  private _items: any[] = [{ ...defaultItem }];
  private _createdAt: Date = new Date("2026-05-12T10:00:00.000Z");
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

  withItems(items: any[]): this {
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
    const totalWeight = this._items.reduce(
      (sum: number, item: any) => sum + item.weightGrams,
      0,
    );
    const totalRations = Number(
      this._items
        .reduce((sum: number, item: any) => sum + item.rations, 0)
        .toFixed(2),
    );

    return {
      id: this._id,
      name: this._name,
      type: this._type as any, // cast: Menu interface uses RationsType but runtime stores MenuType
      items: this._items,
      totalWeight,
      totalRations,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

export function createMenu(overrides?: Partial<Menu>): Menu {
  return { ...new MenuBuilder().build(), ...overrides };
}
