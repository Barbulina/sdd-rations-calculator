/**
 * CustomAlimentRepository
 *
 * Repository interface for CRUD operations on user-created custom aliments.
 * Implementations must handle localStorage persistence, validation, and error handling.
 */

import type {
  CustomAliment,
  CreateCustomAlimentDTO,
  UpdateCustomAlimentDTO,
} from "./types";
import type { RationsType } from "@/src/domain/models/RationsType";

export interface CustomAlimentRepository {
  /**
   * Save a new custom aliment
   *
   * @param dto - Aliment data without auto-generated fields
   * @returns Promise resolving to saved aliment with id and createdAt
   * @throws ValidationError if dto is invalid
   * @throws StorageQuotaError if localStorage quota exceeded
   *
   * @example
   * const dto: CreateCustomAlimentDTO = {
   *   name: 'Manzana ecológica',
   *   type: RationsType.fruits,
   *   gramsToCarbohydrate: 110,
   *   bloodGlucoseIndex: 38
   * };
   * const saved = await repository.save(dto);
   * console.log(saved.id); // UUID generated
   * console.log(saved.createdAt); // Current timestamp
   */
  save(dto: CreateCustomAlimentDTO): Promise<CustomAliment>;

  /**
   * Find all custom aliments
   *
   * @returns Promise resolving to array of all custom aliments, sorted by createdAt DESC
   *
   * @example
   * const aliments = await repository.findAll();
   * console.log(aliments.length); // e.g., 15
   */
  findAll(): Promise<CustomAliment[]>;

  /**
   * Find custom aliment by ID
   *
   * @param id - UUID of custom aliment
   * @returns Promise resolving to aliment if found, undefined otherwise
   *
   * @example
   * const aliment = await repository.findById('550e8400-e29b-41d4-a716-446655440000');
   * if (aliment) {
   *   console.log(aliment.name);
   * }
   */
  findById(id: string): Promise<CustomAliment | undefined>;

  /**
   * Find custom aliments by type/category
   *
   * @param type - Category to filter by
   * @returns Promise resolving to array of matching aliments, sorted by createdAt DESC
   *
   * @example
   * const fruits = await repository.findByType(RationsType.fruits);
   * console.log(fruits.length); // e.g., 5 custom fruit aliments
   */
  findByType(type: RationsType): Promise<CustomAliment[]>;

  /**
   * Search custom aliments by name
   *
   * @param query - Search string (case-insensitive, partial match)
   * @returns Promise resolving to array of matching aliments, sorted by createdAt DESC
   *
   * @example
   * const results = await repository.search('manzana');
   * // Returns all custom aliments with 'manzana' in name
   */
  search(query: string): Promise<CustomAliment[]>;

  /**
   * Update an existing custom aliment
   *
   * @param dto - Update data with id and at least one field to update
   * @returns Promise resolving to updated aliment
   * @throws ValidationError if dto is invalid or no fields to update
   * @throws Error if aliment with id not found
   *
   * @example
   * const updated = await repository.update({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   gramsToCarbohydrate: 115
   * });
   * console.log(updated.updatedAt); // Current timestamp
   */
  update(dto: UpdateCustomAlimentDTO): Promise<CustomAliment>;

  /**
   * Delete a custom aliment by ID
   *
   * @param id - UUID of aliment to delete
   * @returns Promise resolving to true if deleted, false if not found
   *
   * @example
   * const deleted = await repository.delete('550e8400-e29b-41d4-a716-446655440000');
   * if (deleted) {
   *   console.log('Aliment deleted successfully');
   * }
   */
  delete(id: string): Promise<boolean>;

  /**
   * Count total custom aliments
   *
   * @returns Promise resolving to count of all custom aliments
   *
   * @example
   * const count = await repository.count();
   * console.log(`You have ${count} custom aliments`);
   */
  count(): Promise<number>;
}
