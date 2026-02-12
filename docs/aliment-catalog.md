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

## Custom Aliments

Users can now create custom aliments that supplement the pre-defined catalog.

### Domain Layer
- **CustomAliment** (`src/domain/models/CustomAliment.ts`): Custom aliment entity with validation
- **CustomAlimentRepository** (`src/domain/repositories/CustomAlimentRepository.ts`): Repository interface for custom aliments
- **CompositeAlimentRepository** (`src/domain/repositories/CompositeAlimentRepository.ts`): Merges catalog and custom aliments

### Infrastructure Layer
- **LocalStorageCustomAlimentRepository** (`src/infrastructure/repositories/LocalStorageCustomAlimentRepository.ts`): localStorage-based persistence

### Application Layer
- **CustomAlimentRepositoryContext** (`src/application/contexts/CustomAlimentRepositoryContext.tsx`): Dependency injection for custom repository
- **useCompositeAliments** (`src/application/hooks/useCompositeAliments.ts`): Hook for accessing merged catalog

### UI Components
- `/aliment-browser/create` - Create custom aliment page
- `/aliment-browser` - Browse merged catalog with "Custom" badges

### Creating Custom Aliments

```typescript
'use client';

import { useCustomAlimentRepository } from '@/src/application/contexts/CustomAlimentRepositoryContext';
import { RationsType } from '@/src/domain/models/RationsType';

export function CreateCustomAliment() {
  const repository = useCustomAlimentRepository();

  const handleSubmit = async () => {
    const newAliment = await repository.save({
      name: 'Homemade Granola',
      type: RationsType.cereals_flours_pulses_legumes_tubers,
      gramsToCarbohydrate: 15,
      bloodGlucoseIndex: 55,
    });
    
    // Aliment is automatically assigned:
    // - id (UUID)
    // - createdAt (timestamp)
    // - isCustom: true
  };
}
```

### Using Composite Catalog

```typescript
'use client';

import { useCompositeAliments } from '@/src/application/hooks/useCompositeAliments';

export function AlimentBrowser() {
  const compositeRepository = useCompositeAliments();
  const [aliments, setAliments] = useState<UnifiedAliment[]>([]);

  useEffect(() => {
    // Returns catalog aliments + custom aliments
    // Custom aliments appear first, sorted by createdAt DESC
    compositeRepository.findAll().then(setAliments);
  }, [compositeRepository]);

  return (
    <ul>
      {aliments.map((aliment, index) => {
        const isCustom = compositeRepository.isCustom(aliment);
        return (
          <li key={isCustom ? aliment.id : index}>
            {aliment.name}
            {isCustom && <span className="badge">Custom</span>}
          </li>
        );
      })}
    </ul>
  );
}
```

### Custom Aliment CRUD Operations

```typescript
const repository = useCustomAlimentRepository();

// Create
const aliment = await repository.save({
  name: 'Custom Food',
  type: RationsType.others,
  gramsToCarbohydrate: 20,
});

// Read
const all = await repository.findAll(); // Sorted by createdAt DESC
const found = await repository.findById(aliment.id);
const search = await repository.search('custom');

// Update
const updated = await repository.update({
  id: aliment.id,
  name: 'Updated Name',
  gramsToCarbohydrate: 25,
});

// Delete
const deleted = await repository.delete(aliment.id); // returns boolean

// Count
const count = await repository.count();
```

### Data Persistence

Custom aliments are stored in localStorage:
- **Key**: `sdd-rations-calculator:custom-aliments`
- **Format**: JSON array of CustomAliment objects
- **Quota**: ~5-10MB (sufficient for hundreds of custom aliments)
- **Offline**: Works completely offline, no backend required

### Testing

```typescript
import { LocalStorageCustomAlimentRepository } from '@/src/infrastructure/repositories/LocalStorageCustomAlimentRepository';

describe('CustomAlimentRepository', () => {
  let repository: LocalStorageCustomAlimentRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageCustomAlimentRepository();
  });

  it('should save custom aliment with generated ID', async () => {
    const saved = await repository.save({
      name: 'Test',
      type: RationsType.fruits,
      gramsToCarbohydrate: 100,
    });

    expect(saved.id).toBeDefined();
    expect(saved.id).toMatch(/^[a-f0-9-]{36}$/); // UUID
    expect(saved.isCustom).toBe(true);
    expect(saved.createdAt).toBeInstanceOf(Date);
  });
});
```

## Future Enhancements

- Add pagination for `findAll()` and `search()` methods
- Add sorting options (by name, glycemic index, etc.)
- Replace in-memory repository with API/database for dynamic updates
- Add unit conversion helpers (grams ↔ rations)
- Add favorites/recent aliments tracking
- Export catalog as JSON/CSV
- Cloud sync for custom aliments across devices
- Import/export custom aliments (CSV/JSON)
- Aliment templates for common custom foods

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
