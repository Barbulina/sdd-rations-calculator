/**
 * CustomAlimentRepository
 *
 * Repository interface for CRUD operations on user-created custom aliments.
 * Follows the Repository Pattern for hexagonal architecture.
 *
 * @see Constitution Principle I: Architectural Integrity
 * @see specs/003-aliment-catalog/contracts/CustomAlimentRepository.ts for full contract
 */

import type {
  CustomAliment,
  CreateCustomAlimentDTO,
  UpdateCustomAlimentDTO,
} from "../models/CustomAliment";
import type { RationsType } from "../models/RationsType";

export interface CustomAlimentRepository {
  /**
   * Save a new custom aliment
   *
   * @param dto - Aliment data without auto-generated fields
   * @returns Promise resolving to saved aliment with id and createdAt
   * @throws Error if validation fails or storage quota exceeded
   */
  save(dto: CreateCustomAlimentDTO): Promise<CustomAliment>;

  /**
   * Find all custom aliments
   *
   * @returns Promise resolving to array of all custom aliments, sorted by createdAt DESC
   */
  findAll(): Promise<CustomAliment[]>;

  /**
   * Find custom aliment by ID
   *
   * @param id - UUID of custom aliment
   * @returns Promise resolving to aliment if found, undefined otherwise
   */
  findById(id: string): Promise<CustomAliment | undefined>;

  /**
   * Find custom aliments by type/category
   *
   * @param type - Category to filter by
   * @returns Promise resolving to array of matching aliments, sorted by createdAt DESC
   */
  findByType(type: RationsType): Promise<CustomAliment[]>;

  /**
   * Search custom aliments by name
   *
   * @param query - Search string (case-insensitive, partial match)
   * @returns Promise resolving to array of matching aliments, sorted by createdAt DESC
   */
  search(query: string): Promise<CustomAliment[]>;

  /**
   * Update an existing custom aliment
   *
   * @param dto - Update data with id and at least one field to update
   * @returns Promise resolving to updated aliment
   * @throws Error if validation fails or aliment not found
   */
  update(dto: UpdateCustomAlimentDTO): Promise<CustomAliment>;

  /**
   * Delete a custom aliment by ID
   *
   * @param id - UUID of custom aliment to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Count total custom aliments
   *
   * @returns Promise resolving to total count
   */
  count(): Promise<number>;
}
