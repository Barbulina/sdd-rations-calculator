/**
 * LocalStorageCustomAlimentRepository
 *
 * Implementation of CustomAlimentRepository using browser localStorage.
 * Follows the Repository Pattern for hexagonal architecture.
 *
 * @see Constitution Principle I: Architectural Integrity (infrastructure layer)
 * @see specs/003-aliment-catalog/contracts/CustomAlimentRepository.ts
 */

import type { CustomAlimentRepository } from "@/src/domain/repositories/CustomAlimentRepository";
import type {
  CustomAliment,
  CreateCustomAlimentDTO,
  UpdateCustomAlimentDTO,
} from "@/src/domain/models/CustomAliment";
import {
  validateCustomAliment,
  validateCustomAlimentUpdate,
} from "@/src/domain/models/CustomAliment";
import type { RationsType } from "@/src/domain/models/RationsType";
import { LocalStorageAdapter } from "@/src/infrastructure/storage/LocalStorageAdapter";

export class LocalStorageCustomAlimentRepository implements CustomAlimentRepository {
  private readonly storageKey = "custom-aliments";
  private readonly adapter: LocalStorageAdapter;

  constructor(adapter?: LocalStorageAdapter) {
    this.adapter = adapter || new LocalStorageAdapter();
  }

  /**
   * Save a new custom aliment
   */
  async save(dto: CreateCustomAlimentDTO): Promise<CustomAliment> {
    // Validate DTO
    const validation = validateCustomAliment(dto);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(`Validation failed: ${firstError}`);
    }

    // Generate UUID using crypto API
    const id = crypto.randomUUID();

    // Create custom aliment with auto-generated fields
    const customAliment: CustomAliment = {
      ...dto,
      name: dto.name.trim(), // Trim whitespace
      id,
      createdAt: new Date(),
      isCustom: true,
    };

    // Get existing aliments
    const all = await this.findAll();

    // Add new aliment
    all.push(customAliment);

    // Save to localStorage
    const success = this.adapter.setItem(this.storageKey, all);
    if (!success) {
      throw new Error("Storage full - please delete some custom aliments");
    }

    return customAliment;
  }

  /**
   * Find all custom aliments
   */
  async findAll(): Promise<CustomAliment[]> {
    const stored = this.adapter.getItem<any[]>(this.storageKey);
    if (!stored || !Array.isArray(stored)) {
      return [];
    }

    // Deserialize dates
    const aliments = stored.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
    }));

    // Sort by createdAt DESC (newest first)
    return aliments.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  /**
   * Find custom aliment by ID
   */
  async findById(id: string): Promise<CustomAliment | undefined> {
    const all = await this.findAll();
    return all.find((aliment) => aliment.id === id);
  }

  /**
   * Find custom aliments by type/category
   */
  async findByType(type: RationsType): Promise<CustomAliment[]> {
    const all = await this.findAll();
    return all.filter((aliment) => aliment.type === type);
  }

  /**
   * Search custom aliments by name
   */
  async search(query: string): Promise<CustomAliment[]> {
    const all = await this.findAll();

    if (!query.trim()) {
      return all;
    }

    const lowerQuery = query.toLowerCase();
    return all.filter((aliment) =>
      aliment.name.toLowerCase().includes(lowerQuery),
    );
  }

  /**
   * Update an existing custom aliment
   */
  async update(dto: UpdateCustomAlimentDTO): Promise<CustomAliment> {
    // Validate update DTO
    const validation = validateCustomAlimentUpdate(dto);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(`Validation failed: ${firstError}`);
    }

    // Find existing aliment
    const all = await this.findAll();
    const index = all.findIndex((aliment) => aliment.id === dto.id);

    if (index === -1) {
      throw new Error("Custom aliment not found");
    }

    // Update aliment
    const updated: CustomAliment = {
      ...all[index],
      ...(dto.name !== undefined && { name: dto.name.trim() }),
      ...(dto.type !== undefined && { type: dto.type }),
      ...(dto.gramsToCarbohydrate !== undefined && {
        gramsToCarbohydrate: dto.gramsToCarbohydrate,
      }),
      ...(dto.bloodGlucoseIndex !== undefined && {
        bloodGlucoseIndex: dto.bloodGlucoseIndex,
      }),
      updatedAt: new Date(),
    };

    all[index] = updated;

    // Save to localStorage
    const success = this.adapter.setItem(this.storageKey, all);
    if (!success) {
      throw new Error("Storage full - please delete some custom aliments");
    }

    return updated;
  }

  /**
   * Delete a custom aliment by ID
   */
  async delete(id: string): Promise<boolean> {
    const all = await this.findAll();
    const filtered = all.filter((aliment) => aliment.id !== id);

    // If lengths are the same, nothing was deleted
    if (filtered.length === all.length) {
      return false;
    }

    // Save to localStorage
    this.adapter.setItem(this.storageKey, filtered);
    return true;
  }

  /**
   * Count total custom aliments
   */
  async count(): Promise<number> {
    const all = await this.findAll();
    return all.length;
  }
}
