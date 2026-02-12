# Contracts: Ration Menu Management

This directory contains the contract definitions (interfaces, types, API schemas) for the ration menu management feature.

## Files

### Core Type Definitions

- **`types.ts`**: TypeScript type definitions for Ration entity and RationsType enum
- **`repository-interface.ts`**: Repository pattern interface for data persistence abstraction

### Purpose

Contracts define the **shape** of data and operations without implementation details. They serve as:

1. **Documentation**: Clear specification of data structures
2. **Type Safety**: TypeScript interfaces enforced at compile time
3. **Contracts**: Agreements between layers (domain ↔ infrastructure)
4. **Testing**: Basis for contract tests and mocks

## Usage

### Import Types

```typescript
import { Ration, RationsType } from '@/specs/002-ration-menu-management/contracts/types';
import { RationRepository } from '@/specs/002-ration-menu-management/contracts/repository-interface';
```

### Implement Repository

```typescript
class LocalStorageRationRepository implements RationRepository {
  async save(ration: Ration): Promise<void> {
    // Implementation
  }
  
  async findAll(): Promise<Ration[]> {
    // Implementation
  }
  
  // ... other methods
}
```

### Use in Components

```typescript
const repository: RationRepository = useRationRepository();
const rations = await repository.findAll();
```

## Contract Testing

Verify implementations conform to interfaces:

```typescript
describe('LocalStorageRationRepository', () => {
  it('should conform to RationRepository interface', () => {
    const repo: RationRepository = new LocalStorageRationRepository();
    expect(repo).toHaveProperty('save');
    expect(repo).toHaveProperty('findAll');
    // ... assert all methods exist
  });
});
```

## Version

**Contract Version**: 1.0.0  
**Last Updated**: 2026-02-12  
**Breaking Changes**: None (initial version)
