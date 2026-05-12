# Menu Builder Contracts

This directory contains TypeScript interface definitions and contracts for the Menu Builder feature.

## Files

- **types.ts**: Core type definitions (MenuItem, Menu, DTOs)
- **MenuRepository.ts**: Repository interface contract
- **MenuBuilderHook.ts**: useMenuBuilder hook return type contract

## Usage

These contracts define the expected structure and behavior of the Menu Builder components. Use them as reference when implementing:

- Domain models
- Repository implementations
- React hooks
- UI components

## Test Requirements

All implementations of these contracts must:

1. Pass type checking (`tsc --noEmit`)
2. Have corresponding unit/integration tests
3. Handle all specified edge cases
4. Follow TDD (RED-GREEN-REFACTOR)

## Validation Rules

See [data-model.md](../data-model.md) for detailed validation rules.
