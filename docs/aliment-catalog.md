# Aliment Catalog Repository

This directory contains the aliment catalog feature, which provides a pre-defined database of 365+ food items with nutritional information.

## Architecture

The aliment catalog follows the repository pattern with three layers:

### Domain Layer
- **AlimentInfo** (`src/domain/models/AlimentInfo.ts`): Interface defining food aliment structure
- **AlimentCatalog** (`src/domain/models/AlimentCatalog.ts`): Constant array with 365+ pre-defined aliments
- **AlimentInfoRepository** (`src/domain/repositories/AlimentInfoRepository.ts`): Interface for repository operations

### Infrastructure Layer
- **InMemoryAlimentInfoRepository** (`src/infrastructure/repositories/InMemoryAlimentInfoRepository.ts`): In-memory implementation providing read-only access to the catalog

### Application Layer
- **AlimentInfoRepositoryContext** (`src/application/contexts/AlimentInfoRepositoryContext.tsx`): React Context for dependency injection

## Data Structure

Each `AlimentInfo` entry contains:

```typescript
interface AlimentInfo {
  name: string;                    // e.g., "manzana"
  gramsToCarbohydrate: number;     // Grams containing 10g of carbs
  bloodGlucoseIndex?: number;      // Glycemic index (0-100)
  type: RationsType;               // Category (lacteal, fruits, etc.)
}
```

## Categories

The catalog includes 7 food categories:

1. **Lácteos** (Dairy) - 22 items
2. **Cereales, Harinas, Legumbres y Tubérculos** - 87 items
3. **Frutas** (Fruits) - 47 items
4. **Hortalizas** (Vegetables) - 44 items
5. **Frutas Secas y Grasa** (Nuts & Dried Fruits) - 15 items
6. **Bebidas** (Drinks) - 24 items
7. **Otros** (Others) - 126 items

**Total: 365+ aliments**

## Usage

### 1. Basic Access

```typescript
'use client';

import { useAlimentInfoRepository } from '@/src/application/contexts/AlimentInfoRepositoryContext';

export function AlimentList() {
  const repository = useAlimentInfoRepository();
  const [aliments, setAliments] = useState<AlimentInfo[]>([]);

  useEffect(() => {
    repository.findAll().then(setAliments);
  }, [repository]);

  return (
    <ul>
      {aliments.map((aliment, index) => (
        <li key={index}>{aliment.name}</li>
      ))}
    </ul>
  );
}
```

### 2. Filter by Category

```typescript
import { RationsType } from '@/src/domain/models/RationsType';

// Get only fruits
const fruits = await repository.findByType(RationsType.fruits);
```

### 3. Search by Name

```typescript
// Search for "manzana" (partial, case-insensitive)
const results = await repository.search('manzana');
// Returns: manzana, manzana asada
```

### 4. Find Exact Match

```typescript
// Get specific aliment by exact name
const apple = await repository.findByName('manzana');
```

## Repository Interface

```typescript
interface AlimentInfoRepository {
  findAll(): Promise<AlimentInfo[]>;
  findByType(type: RationsType): Promise<AlimentInfo[]>;
  search(query: string): Promise<AlimentInfo[]>;
  findByName(name: string): Promise<AlimentInfo | undefined>;
}
```

## Integration with Ration Creation

The aliment catalog is designed to be used when creating new rations:

1. User searches for a food item in the catalog
2. Selected aliment provides default values (name, category, glycemic index, grams to carbohydrate)
3. User adds specific weight and calculates rations
4. New ration is saved to RationRepository

## Example: Autocomplete Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAlimentInfoRepository } from '@/src/application/contexts/AlimentInfoRepositoryContext';

export function AlimentAutocomplete() {
  const repository = useAlimentInfoRepository();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AlimentInfo[]>([]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    repository.search(query).then((results) => {
      setSuggestions(results.slice(0, 10)); // Limit to 10 results
    });
  }, [query, repository]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search aliments..."
      />
      <ul>
        {suggestions.map((aliment, index) => (
          <li key={index}>
            {aliment.name} - {aliment.gramsToCarbohydrate}g
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Future Enhancements

- Add pagination for `findAll()` and `search()` methods
- Add sorting options (by name, glycemic index, etc.)
- Replace in-memory repository with API/database for dynamic updates
- Add unit conversion helpers (grams ↔ rations)
- Add favorites/recent aliments tracking
- Export catalog as JSON/CSV

## Testing

```typescript
import { InMemoryAlimentInfoRepository } from '@/src/infrastructure/repositories/InMemoryAlimentInfoRepository';

describe('AlimentInfoRepository', () => {
  const repository = new InMemoryAlimentInfoRepository();

  it('should find all aliments', async () => {
    const all = await repository.findAll();
    expect(all.length).toBeGreaterThan(300);
  });

  it('should search case-insensitively', async () => {
    const results = await repository.search('MANZANA');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('manzana');
  });
});
```
