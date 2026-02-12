# Repository Contracts

This directory contains TypeScript interface definitions for repositories used in the Custom Aliment Creation feature.

## Files

- **types.ts**: Core type definitions (CustomAliment, DTOs)
- **CustomAlimentRepository.ts**: CRUD repository interface for custom aliments
- **CompositeAlimentRepository.ts**: Composite repository interface for merging catalog + custom
- **README.md**: This file

## Purpose

These contracts define the interfaces that infrastructure implementations must satisfy. They serve as:

1. **Integration Test Specifications**: Tests verify implementations against these contracts
2. **Domain Boundaries**: Clear separation between domain logic and infrastructure
3. **Type Safety**: TypeScript compiler enforces contract compliance
4. **Documentation**: Self-documenting code through explicit interfaces

##Usage

```typescript
// Infrastructure layer implements the contract
class LocalStorageCustomAlimentRepository implements CustomAlimentRepository {
  async save(dto: CreateCustomAlimentDTO): Promise<CustomAliment> {
    // Implementation details...
  }
  // ... other methods
}

// Application layer depends on the interface
export function useCustomAliments() {
  const repository: CustomAlimentRepository = useContext(CustomAlimentRepositoryContext);
  // ... use repository methods
}
```

## Testing

Integration tests verify implementations against these contracts:

```typescript
describe('CustomAlimentRepository contract', () => {
  let repository: CustomAlimentRepository;

  beforeEach(() => {
    repository = new LocalStorageCustomAlimentRepository(adapter);
  });

  it('should save and retrieve custom aliment', async () => {
    const dto: CreateCustomAlimentDTO = { /* ... */ };
    const saved = await repository.save(dto);
    const retrieved = await repository.findById(saved.id);
    expect(retrieved).toEqual(saved);
  });
});
```
