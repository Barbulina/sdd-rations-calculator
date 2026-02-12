import type { Ration, CreateRationDTO } from "../../domain/models/Ration";
import type { RationRepository } from "../../domain/repositories/RationRepository";
import { LocalStorageAdapter } from "../storage/LocalStorageAdapter";

/**
 * LocalStorageRationRepository
 *
 * Concrete implementation of RationRepository using browser localStorage.
 * Provides CRUD operations for Ration entities with:
 * - UUID generation for new rations
 * - Automatic timestamp management
 * - Date serialization/deserialization
 * - Sorted results (newest first)
 *
 * @see ../../../specs/002-ration-menu-management/contracts/repository-interface.ts for interface specification
 */
export class LocalStorageRationRepository implements RationRepository {
  private readonly storage: LocalStorageAdapter;
  private readonly storageKey = "rations";

  constructor(storage?: LocalStorageAdapter) {
    this.storage = storage || new LocalStorageAdapter();
  }

  /**
   * Save a new ration to localStorage
   *
   * Generates UUID and createdAt timestamp automatically.
   *
   * @param data - Ration data without id and createdAt
   * @returns Promise resolving to the created ration
   * @throws {Error} If localStorage is unavailable or quota exceeded
   */
  async save(data: CreateRationDTO): Promise<Ration> {
    if (!this.storage.isAvailable()) {
      throw new Error("localStorage is not available");
    }

    // Generate UUID and timestamp
    const id = crypto.randomUUID();
    const createdAt = new Date();

    const newRation: Ration = {
      id,
      ...data,
      createdAt,
    };

    // Get existing rations
    const existingRations = await this.findAll();

    // Append new ration
    const updatedRations = [...existingRations, newRation];

    // Serialize and persist
    const serialized = this.serializeRations(updatedRations);
    const success = this.storage.setItem(this.storageKey, serialized);

    if (!success) {
      throw new Error("Failed to save ration - storage quota may be exceeded");
    }

    return newRation;
  }

  /**
   * Find all rations from localStorage
   *
   * Returns rations sorted by createdAt DESC (newest first).
   * Returns empty array if localStorage is unavailable.
   *
   * @returns Promise resolving to array of all rations
   */
  async findAll(): Promise<Ration[]> {
    if (!this.storage.isAvailable()) {
      console.warn("localStorage is not available, returning empty array");
      return [];
    }

    const data = this.storage.getItem<any[]>(this.storageKey);

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Deserialize dates and sort
    const rations = this.deserializeRations(data);
    return rations.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  /**
   * Find a ration by ID
   *
   * @param id - Unique identifier of the ration
   * @returns Promise resolving to the ration if found, null otherwise
   */
  async findById(id: string): Promise<Ration | null> {
    const allRations = await this.findAll();
    return allRations.find((ration) => ration.id === id) || null;
  }

  /**
   * Delete a ration by ID
   *
   * @param id - Unique identifier of the ration to delete
   * @returns Promise resolving to true if deleted, false if not found
   * @throws {Error} If localStorage is unavailable or save fails
   */
  async delete(id: string): Promise<boolean> {
    if (!this.storage.isAvailable()) {
      throw new Error("localStorage is not available");
    }

    const allRations = await this.findAll();
    const initialLength = allRations.length;

    // Filter out the ration with the given id
    const updatedRations = allRations.filter((ration) => ration.id !== id);

    // Check if a ration was actually removed
    if (updatedRations.length === initialLength) {
      return false; // Ration not found
    }

    // Persist updated list
    const serialized = this.serializeRations(updatedRations);
    const success = this.storage.setItem(this.storageKey, serialized);

    if (!success) {
      throw new Error("Failed to delete ration - storage error");
    }

    return true;
  }

  /**
   * Serialize rations for localStorage
   *
   * Converts Date objects to ISO strings for JSON serialization.
   *
   * @param rations - Array of rations
   * @returns Serialized rations
   */
  private serializeRations(rations: Ration[]): any[] {
    return rations.map((ration) => ({
      ...ration,
      createdAt: ration.createdAt.toISOString(),
    }));
  }

  /**
   * Deserialize rations from localStorage
   *
   * Parses ISO string timestamps back to Date objects.
   *
   * @param data - Raw data from localStorage
   * @returns Array of rations with Date objects
   */
  private deserializeRations(data: any[]): Ration[] {
    return data.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  }
}
