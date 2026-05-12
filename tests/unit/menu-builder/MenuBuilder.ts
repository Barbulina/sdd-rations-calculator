/**
 * Test builder for Menu
 * Follows the builder pattern for test fixtures
 */

import { MenuType } from "@/src/domain/models/MenuType";
import type { Menu } from "../../../specs/004-menu-builder/contracts/types";
import { MenuItemBuilder, createMenuItem } from "./MenuItemBuilder";

/**
 * MenuBuilder - fluent interface for creating test Menu fixtures
 */
export class MenuBuilder {
  private id: string = "test-menu-uuid-1234";
  private name: string = "Test Menu";
  private type: MenuType = MenuType.LUNCH;
  private items: any[] = [createMenuItem()];
  private createdAt: Date = new Date("2026-02-12T10:00:00.000Z");
  private updatedAt?: Date;

  /**
   * Set custom ID
   */
  withId(id: string): this {
    this.id = id;
    return this;
  }

  /**
   * Set custom name
   */
  withName(name: string): this {
    this.name = name;
    return this;
  }

  /**
   * Set custom type
   */
  withType(type: MenuType): this {
    this.type = type;
    return this;
  }

  /**
   * Set custom items
   */
  withItems(items: any[]): this {
    this.items = items;
    return this;
  }

  /**
   * Add a single item
   */
  addItem(item: any): this {
    this.items.push(item);
    return this;
  }

  /**
   * Clear items (for testing validation)
   */
  withNoItems(): this {
    this.items = [];
    return this;
  }

  /**
   * Set created timestamp
   */
  withCreatedAt(date: Date): this {
    this.createdAt = date;
    return this;
  }

  /**
   * Set updated timestamp
   */
  withUpdatedAt(date: Date): this {
    this.updatedAt = date;
    return this;
  }

  /**
   * Build totals: Calculate from items
   */
  private calculateTotalWeight(): number {
    return this.items.reduce((sum, item) => sum + item.weightGrams, 0);
  }

  private calculateTotalRations(): number {
    const raw = this.items.reduce((sum, item) => sum + item.rations, 0);
    return Number(raw.toFixed(2));
  }

  /**
   * Build the Menu
   */
  build(): Menu {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      items: this.items,
      totalWeight: this.calculateTotalWeight(),
      totalRations: this.calculateTotalRations(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Build with empty name (for testing validation)
   */
  buildWithEmptyName(): Menu {
    return {
      ...this.build(),
      name: "",
    };
  }

  /**
   * Build with very long name (for testing validation)
   */
  buildWithLongName(): Menu {
    return {
      ...this.build(),
      name: "a".repeat(201),
    };
  }

  /**
   * Build with no items (for testing validation)
   */
  buildWithNoItems(): Menu {
    return {
      ...this.build(),
      items: [],
      totalWeight: 0,
      totalRations: 0,
    };
  }
}

/**
 * Helper function to create a default Menu
 */
export function createMenu(overrides?: Partial<Menu>): Menu {
  return new MenuBuilder().build();
}
