/**
 * CompositeAlimentRepository
 *
 * Combines catalog aliments (AlimentInfo) with custom aliments into a unified interface.
 * This allows the UI to treat both types of aliments uniformly.
 *
 * @see Constitution Principle I: Architectural Integrity
 */

import type { AlimentInfoRepository } from "./AlimentInfoRepository";
import type { CustomAlimentRepository } from "./CustomAlimentRepository";
import type { AlimentInfo } from "../models/AlimentInfo";
import type { CustomAliment } from "../models/CustomAliment";

/**
 * UnifiedAliment
 *
 * Union type representing either a catalog or custom aliment.
 */
export type UnifiedAliment = AlimentInfo | CustomAliment;

/**
 * CompositeAlimentRepository
 *
 * Repository that merges catalog and custom aliments.
 */
export class CompositeAlimentRepository {
  constructor(
    private readonly catalogRepository: AlimentInfoRepository,
    private readonly customRepository: CustomAlimentRepository,
  ) {}

  /**
   * Find all aliments (catalog + custom)
   *
   * @returns Array of all aliments sorted: custom first (by date DESC), then catalog (alphabetically)
   */
  async findAll(): Promise<UnifiedAliment[]> {
    const catalog = await this.catalogRepository.findAll();
    const custom = await this.customRepository.findAll();

    // Custom aliments are already sorted by createdAt DESC
    // Catalog aliments should be sorted alphabetically
    const sortedCatalog = [...catalog].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return [...custom, ...sortedCatalog];
  }

  /**
   * Search aliments by query
   *
   * @param query - Search term (case-insensitive)
   * @returns Matching aliments from both sources
   */
  async search(query: string): Promise<UnifiedAliment[]> {
    const catalogResults = await this.catalogRepository.search(query);
    const customResults = await this.customRepository.search(query);

    return [...customResults, ...catalogResults];
  }

  /**
   * Find an aliment by ID
   *
   * Only searches custom aliments (which have UUIDs).
   * Catalog aliments don't have IDs.
   *
   * @param id - Aliment ID (UUID)
   * @returns CustomAliment or undefined if not found
   */
  async findById(id: string): Promise<CustomAliment | undefined> {
    return this.customRepository.findById(id);
  }

  /**
   * Get total count of all aliments
   *
   * @returns Total count (catalog + custom)
   */
  async count(): Promise<number> {
    const [catalogCount, customCount] = await Promise.all([
      this.catalogRepository.count(),
      this.customRepository.count(),
    ]);

    return catalogCount + customCount;
  }

  /**
   * Check if an aliment is custom
   *
   * @param aliment - Aliment to check
   * @returns true if custom, false if catalog
   */
  isCustom(aliment: UnifiedAliment): aliment is CustomAliment {
    return "isCustom" in aliment && aliment.isCustom === true;
  }
}
