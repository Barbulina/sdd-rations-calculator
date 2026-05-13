import { MenuType } from "@/src/domain/models/MenuType";
import { createMenuItem } from "./MenuItemBuilder";
import type { RationsType } from "@/src/domain/models/RationsType";

export class MenuBuilder {
  private id: string = "test-menu-uuid-1234";
  private name: string = "Test Menu";
  private type: MenuType = MenuType.LUNCH;
  private items: any[] = [createMenuItem()];
  private createdAt: Date = new Date("2026-02-12T10:00:00.000Z");
  private updatedAt?: Date;

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withType(type: MenuType): this {
    this.type = type;
    return this;
  }

  withItems(items: any[]): this {
    this.items = items;
    return this;
  }

  addItem(item: any): this {
    this.items.push(item);
    return this;
  }

  withNoItems(): this {
    this.items = [];
    return this;
  }

  withCreatedAt(date: Date): this {
    this.createdAt = date;
    return this;
  }

  withUpdatedAt(date: Date): this {
    this.updatedAt = date;
    return this;
  }

  private calculateTotalWeight(): number {
    return this.items.reduce((sum, item) => sum + item.weightGrams, 0);
  }

  private calculateTotalRations(): number {
    const raw = this.items.reduce((sum, item) => sum + item.rations, 0);
    return Number(raw.toFixed(2));
  }

  build() {
    return {
      id: this.id,
      name: this.name,
      type: this.type as unknown as RationsType,
      items: this.items,
      totalWeight: this.calculateTotalWeight(),
      totalRations: this.calculateTotalRations(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  buildWithEmptyName() {
    return { ...this.build(), name: "" };
  }

  buildWithLongName() {
    return { ...this.build(), name: "a".repeat(201) };
  }

  buildWithNoItems() {
    return { ...this.build(), items: [], totalWeight: 0, totalRations: 0 };
  }
}

export function createMenu() {
  return new MenuBuilder().build();
}
