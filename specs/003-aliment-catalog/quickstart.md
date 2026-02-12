# Quickstart Guide: Custom Aliment Creation

**Feature**: 003-aliment-catalog  
**Version**: 1.0.0  
**Last Updated**: 2026-02-12

## Overview

This guide helps developers set up and work with the custom aliment creation feature. Users can create, edit, and delete custom food aliments that supplement the 365+ pre-defined catalog.

## Prerequisites

- Feature 001 (Design Token System) implemented
- Feature 002 (Ration Management) implemented
- Node.js 18+
- npm or yarn

## Quick Start

### 1. Development Setup

```bash
# Navigate to project root
cd /path/to/sdd-rations-calculator

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000/aliment-browser
```

### 2. Access Custom Aliment Features

**Browse Aliments**:
- Navigate to `/aliment-browser`
- See pre-defined catalog (365+ items)
- Custom aliments (if any) appear with "Custom" badge

**Create Custom Aliment**:
- Click "Create Custom Aliment" button in browser
- Fill out form at `/aliment-browser/create`
- Required fields: Name, Category, Grams to Carbohydrate
- Optional: Blood Glucose Index (0-100)

**Create from Search**:
- Search for non-existent aliment (e.g., "my special food")
- Click "Create 'my special food'" button in empty state
- Form pre-fills with search term

## Usage Examples

### Creating a Custom Aliment

```typescript
// Via UI form at /aliment-browser/create
// Or programmatically:

import { useCustomAlimentRepository } from '@/src/application/contexts/CustomAlimentRepositoryContext';
import { RationsType } from '@/src/domain/models/RationsType';

export function MyComponent() {
  const repository = useCustomAlimentRepository();

  const createAliment = async () => {
    const dto: CreateCustomAlimentDTO = {
      name: 'Manzana ecológica',
      type: RationsType.fruits,
      gramsToCarbohydrate: 110,
      bloodGlucoseIndex: 38
    };

    const saved = await repository.save(dto);
    console.log('Created:', saved);
    // {
    //   id: '550e8400-e29b-41d4-a716-446655440000',
    //   name: 'Manzana ecológica',
    //   type: 'fruits',
    //   gramsToCarbohydrate: 110,
    //   bloodGlucoseIndex: 38,
    //   createdAt: Date('2026-02-12T10:30:00Z'),
    //   isCustom: true
    // }
  };
}
```

### Searching Custom Aliments

```typescript
import { useCompositeAliments } from '@/src/application/hooks/useCompositeAliments';

export function AlimentSearch() {
  const { search } = useCompositeAliments();
  const [results, setResults] = useState<AlimentInfo[]>([]);

  const handleSearch = async (query: string) => {
    const found = await search(query);
    setResults(found); // Includes both catalog and custom aliments
  };

  return (
    <input
      type="text"
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search aliments..."
    />
  );
}
```

### Updating a Custom Aliment

```typescript
const updateAliment = async (id: string) => {
  const updated = await repository.update({
    id,
    gramsToCarbohydrate: 115 // Update just one field
  });
  console.log('Updated:', updated.updatedAt);
};
```

### Deleting a Custom Aliment

```typescript
const deleteAliment = async (id: string) => {
  const deleted = await repository.delete(id);
  if (deleted) {
    console.log('Deleted successfully');
  }
};
```

## File Structure

```
app/
├── aliment-browser/
│   ├── page.tsx                              # Browser with Create button
│   └── create/
│       └── page.tsx                          # Create form

src/
├── domain/
│   ├── models/
│   │   └── CustomAliment.ts                  # Entity definition
│   └── repositories/
│       └── CustomAlimentRepository.ts        # Repository interface
├── infrastructure/
│   └── repositories/
│       ├── LocalStorageCustomAlimentRepository.ts  # Implementation
│       └── CompositeAlimentRepository.ts           # Merges catalog + custom
└── application/
    ├── contexts/
    │   └── CustomAlimentRepositoryContext.tsx      # DI context
    └── hooks/
        └── useCompositeAliments.ts                 # UI hook
```

## Common Tasks

### Add Custom Aliment Repository to New Component

```typescript
'use client';

import { useCustomAlimentRepository } from '@/src/application/contexts/CustomAlimentRepositoryContext';

export function MyComponent() {
  const repository = useCustomAlimentRepository();
  
  // Use repository methods
  const loadAliments = async () => {
    const aliments = await repository.findAll();
    console.log(aliments);
  };
}
```

### Filter Custom Aliments by Category

```typescript
import { RationsType } from '@/src/domain/models/RationsType';

const fruits = await repository.findByType(RationsType.fruits);
console.log(`Found ${fruits.length} custom fruit aliments`);
```

### Check if Aliment is Custom

```typescript
import { isCustomAliment } from '@/specs/003-aliment-catalog/contracts/types';

const aliment: AlimentInfo = /* ... */;

if (isCustomAliment(aliment)) {
  console.log('Custom aliment created at:', aliment.createdAt);
  console.log('ID:', aliment.id);
}
```

## Testing

### Setup Testing Infrastructure (First Time Only)

Before implementing any features, install testing frameworks per Constitution Principle III (TDD):

```bash
# Install Vitest for unit and integration tests
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom

# Install Playwright for E2E tests
npm install -D @playwright/test
npx playwright install
```

**Create test configuration files**:

1. **vitest.config.ts** (project root):
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

2. **tests/setup.ts**:
```typescript
import '@testing-library/jest-dom';
```

3. **playwright.config.ts** (project root):
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Update package.json scripts**:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### TDD Workflow (Red-Green-Refactor)

**Constitution mandates test-first development**. Follow this workflow strictly:

**Phase 1: Domain Layer (Unit Tests)**
```bash
# 1. Write failing test
cat > tests/unit/custom-aliments/CustomAliment.test.ts
# Test validation rules

# 2. Run test → RED
npm test

# 3. Implement minimal code
cat > src/domain/models/CustomAliment.ts

# 4. Run test → GREEN
npm test

# 5. Refactor
# Improve code quality while keeping tests green
```

**Phase 2: Repository Layer (Integration Tests)**
```bash
# 1. Write failing integration test
cat > tests/integration/custom-aliments/LocalStorageCustomAlimentRepository.test.ts

# 2. Run test → RED
npm test

# 3. Implement repository
cat > src/infrastructure/repositories/LocalStorageCustomAlimentRepository.ts

# 4. Run test → GREEN
npm test

# 5. Refactor
```

**Phase 3: UI Layer (E2E Tests)**
```bash
# 1. Write failing E2E test
cat > tests/e2e/custom-aliments/create-custom-aliment.spec.ts

# 2. Run test → RED
npm run test:e2e

# 3. Implement UI
cat > app/aliment-browser/create/page.tsx

# 4. Run test → GREEN
npm run test:e2e

# 5. Refactor
```

### Run Unit Tests

```bash
# Run all tests
npm test

# Run custom aliment tests only
npm test -- CustomAliment

# Watch mode
npm test -- --watch
```

### Run Integration Tests

```bash
# Test localStorage repository
npm test -- LocalStorageCustomAlimentRepository

# Test composite repository
npm test -- CompositeAlimentRepository
```

### Run E2E Tests

```bash
# Run Playwright tests
npm run test:e2e

# Run specific E2E test
npm run test:e2e -- custom-aliment-creation
```

## Troubleshooting

### localStorage Quota Exceeded

**Problem**: Error creating custom aliment: "Storage quota exceeded"

**Solution**:
```typescript
// Clear  older custom aliments
const aliments = await repository.findAll();
const toDelete = aliments.slice(50); // Keep newest 50
for (const aliment of toDelete) {
  await repository.delete(aliment.id);
}
```

### Form Validation Errors

**Problem**: Form shows "Name is required" even after typing

**Solution**: Check that `updateField` is called on change:
```typescript
<input
  value={formData.name}
  onChange={(e) => updateField('name', e.target.value)}
/>
```

### Custom Aliments Not Appearing

**Problem**: Created aliment doesn't show in browser

**Solution**: Verify CompositeAlimentRepository is used:
```typescript
// In aliment-browser/page.tsx
const { aliments } = useCompositeAliments(); // NOT useAlimentInfoRepository()
```

## API Reference

### Repository Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `save` | `CreateCustomAlimentDTO` | `Promise<CustomAliment>` | Create new custom aliment |
| `findAll` | None | `Promise<CustomAliment[]>` | Get all custom aliments |
| `findById` | `string` | `Promise<CustomAliment \| undefined>` | Find by ID |
| `findByType` | `RationsType` | `Promise<CustomAliment[]>` | Filter by category |
| `search` | `string` | `Promise<CustomAliment[]>` | Search by name |
| `update` | `UpdateCustomAlimentDTO` | `Promise<CustomAliment>` | Update existing |
| `delete` | `string` | `Promise<boolean>` | Delete by ID |
| `count` | None | `Promise<number>` | Count total |

### DTOs

**CreateCustomAlimentDTO**:
```typescript
{
  name: string;                    // Required, 1-200 chars
  type: RationsType;              // Required, one of 7 categories
  gramsToCarbohydrate: number;    // Required, > 0
  bloodGlucoseIndex?: number;     // Optional, 0-100
}
```

**UpdateCustomAlimentDTO**:
```typescript
{
  id: string;                     // Required, UUID
  name?: string;                  // Optional
  type?: RationsType;             // Optional
  gramsToCarbohydrate?: number;   // Optional
  bloodGlucoseIndex?: number;     // Optional
}
```

## Next Steps

1. **Create custom aliment form** (`/aliment-browser/create`)
2. **Implement repository** (`LocalStorageCustomAlimentRepository`)
3. **Create composite repository** (merge catalog + custom)
4. **Add edit/delete UI** (`/aliment-browser/[id]/edit`)
5. **Write tests** (unit, integration, E2E)

## Resources

- [Feature Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Data Model](./data-model.md)
- [Repository Contracts](./contracts/)
- [Constitution](./.specify/memory/constitution.md)

## Support

For issues or questions:
1. Check existing tests for usage examples
2. Review contracts in `specs/003-aliment-catalog/contracts/`
3. See data model in `specs/003-aliment-catalog/data-model.md`
