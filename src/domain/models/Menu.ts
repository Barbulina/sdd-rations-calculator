/**
 * Menu domain model
 * Represents a complete meal with multiple aliments
 */

import type { RationsType } from "./RationsType";
import type { MenuItem } from "../../../specs/004-menu-builder/contracts/types";

const VALID_RATION_TYPES: RationsType[] = [
  "carnes",
  "pescados",
  "verduras y hortalizas",
  "frutas",
  "cereales, harinas, legumbres y tuberculos",
  "leche y derivados",
  "grasas",
];

export class Menu {
  readonly id: string;
  readonly name: string;
  readonly type: RationsType;
  readonly items: MenuItem[];
  readonly totalWeight: number;
  readonly totalRations: number;
  readonly createdAt: Date;
  readonly updatedAt?: Date;

  /**
   * Create a new Menu
   *
   * @param name - Menu name (trimmed, 1-200 chars)
   * @param type - Menu type (valid RationsType)
   * @param items - Array of MenuItems (min 1 item)
   * @throws Error if validation fails
   */
  constructor(name: string, type: RationsType, items: MenuItem[]) {
    // Trim and validate name
    const trimmedName = name.trim();
    this.validateName(trimmedName);
    this.name = trimmedName;

    // Validate type
    this.validateType(type);
    this.type = type;

    // Validate items
    this.validateItems(items);
    // Store items as snapshot (shallow copy to prevent mutations)
    this.items = [...items];

    // Generate UUID
    this.id = crypto.randomUUID();

    // Calculate totals
    this.totalWeight = this.calculateTotalWeight(this.items);
    this.totalRations = this.calculateTotalRations(this.items);

    // Set timestamp
    this.createdAt = new Date();

    // Make properties immutable
    Object.freeze(this);
  }

  /**
   * Reconstitute a Menu from stored data (deserialization/updates)
   *
   * @param data - Complete menu data including id, timestamps, etc.
   * @returns Reconstituted Menu instance
   * @throws Error if validation fails
   */
  static reconstitute(data: {
    id: string;
    name: string;
    type: RationsType;
    items: MenuItem[];
    createdAt: Date;
    updatedAt?: Date;
  }): Menu {
    const instance = Object.create(Menu.prototype);

    // Validate and assign properties
    const trimmedName = data.name.trim();
    instance.validateName(trimmedName);
    instance.name = trimmedName;

    instance.validateType(data.type);
    instance.type = data.type;

    instance.validateItems(data.items);
    instance.items = [...data.items];

    instance.id = data.id;
    instance.createdAt = data.createdAt;
    instance.updatedAt = data.updatedAt;

    // Calculate totals
    instance.totalWeight = instance.calculateTotalWeight(instance.items);
    instance.totalRations = instance.calculateTotalRations(instance.items);

    // Make immutable
    Object.freeze(instance);

    return instance;
  }

  /**
   * Validate menu name
   */
  private validateName(name: string): void {
    if (name.length === 0) {
      throw new Error("Menu name is required");
    }

    if (name.length > 200) {
      throw new Error("Menu name must not exceed 200 characters");
    }
  }

  /**
   * Validate menu type
   */
  private validateType(type: RationsType): void {
    if (!type || !VALID_RATION_TYPES.includes(type)) {
      throw new Error("Invalid menu type");
    }
  }

  /**
   * Validate items array
   */
  private validateItems(items: MenuItem[]): void {
    if (!items || items.length === 0) {
      throw new Error("Menu must contain at least one aliment");
    }
  }

  /**
   * Calculate total weight from items
   */
  private calculateTotalWeight(items: MenuItem[]): number {
    return items.reduce((sum, item) => sum + item.weightGrams, 0);
  }

  /**
   * Calculate total rations from items (2 decimal precision)
   */
  private calculateTotalRations(items: MenuItem[]): number {
    const raw = items.reduce((sum, item) => sum + item.rations, 0);
    return Number(raw.toFixed(2));
  }
}
