import type { AlimentInfo } from "@/src/domain/models/AlimentInfo";
import type { RationsType } from "@/src/domain/models/RationsType";
import type { AlimentInfoRepository } from "@/src/domain/repositories/AlimentInfoRepository";
import { RATIONS_INFO_LIST } from "@/src/domain/models/AlimentCatalog";

/**
 * InMemoryAlimentInfoRepository
 *
 * In-memory implementation of AlimentInfoRepository.
 * Provides read-only access to the static aliment catalog.
 *
 * This is a simple implementation that works directly with
 * the constant array. In a real application, this could be
 * replaced with an API-based or database-backed repository.
 */
export class InMemoryAlimentInfoRepository implements AlimentInfoRepository {
  private readonly catalog: AlimentInfo[] = RATIONS_INFO_LIST;

  async findAll(): Promise<AlimentInfo[]> {
    // Return a copy to prevent external mutations
    return [...this.catalog];
  }

  async findByType(type: RationsType): Promise<AlimentInfo[]> {
    return this.catalog.filter((aliment) => aliment.type === type);
  }

  async search(query: string): Promise<AlimentInfo[]> {
    if (!query.trim()) {
      return this.findAll();
    }

    const normalizedQuery = query.toLowerCase().trim();
    return this.catalog.filter((aliment) =>
      aliment.name.toLowerCase().includes(normalizedQuery),
    );
  }

  async findByName(name: string): Promise<AlimentInfo | undefined> {
    return this.catalog.find((aliment) => aliment.name === name);
  }

  async count(): Promise<number> {
    return this.catalog.length;
  }
}
