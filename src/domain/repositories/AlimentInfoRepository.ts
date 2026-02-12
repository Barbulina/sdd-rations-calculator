import type { AlimentInfo } from "../models/AlimentInfo";
import type { RationsType } from "../models/RationsType";

/**
 * AlimentInfoRepository
 *
 * Repository interface for accessing the aliment catalog.
 * Provides read-only access to pre-defined food aliments.
 */
export interface AlimentInfoRepository {
  /**
   * Get all aliments from the catalog
   * @returns Array of all aliment entries
   */
  findAll(): Promise<AlimentInfo[]>;

  /**
   * Get aliments filtered by type/category
   * @param type - The ration type to filter by
   * @returns Array of aliments matching the type
   */
  findByType(type: RationsType): Promise<AlimentInfo[]>;

  /**
   * Search aliments by name (case-insensitive partial match)
   * @param query - Search string to match against aliment names
   * @returns Array of aliments matching the search query
   */
  search(query: string): Promise<AlimentInfo[]>;

  /**
   * Get a single aliment by exact name match
   * @param name - Exact name of the aliment
   * @returns The matching aliment or undefined if not found
   */
  findByName(name: string): Promise<AlimentInfo | undefined>;

  /**
   * Get the total count of aliments in the catalog
   * @returns Total number of aliments
   */
  count(): Promise<number>;
}
