# Data Model: Ration Menu Management

**Feature**: 002-ration-menu-management  
**Date**: 2026-02-12  
**Status**: Complete

## Overview

This document defines the data entities, relationships, validation rules, and state transitions for the ration menu management system.

## Core Entities

### Ration

Represents a food item with nutritional information for meal planning and blood glucose management.

**Purpose**: Enable users to track food portions and carbohydrate content for dietary planning.

#### Attributes

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | Yes | UUID format | Unique identifier for the ration |
| `type` | RationsType | Yes | Must be valid enum value | Category of food aliment |
| `name` | string | Yes | Non-empty, max 200 chars | Human-readable name of food item |
| `gramsToCarbohydrate` | number | Yes | > 0 | Grams of food containing 10g HC |
| `bloodGlucoseIndex` | number \| undefined | No | 0-100 if provided | Optional glycemic index value |
| `weight` | number | Yes | > 0 | Weight of food portion in grams |
| `rations` | number | Yes | > 0 | Calculated ration value |
| `createdAt` | Date | Yes | Valid ISO date | Timestamp of creation (for sorting) |

#### Type Definition

```typescript
interface Ration {
  id: string;
  type: RationsType;
  name: string;
  gramsToCarbohydrate: number;
  bloodGlucoseIndex?: number;
  weight: number;
  rations: number;
  createdAt: Date;
}
```

#### Example

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "lacteal",
  "name": "Leche desnatada",
  "gramsToCarbohydrate": 200,
  "bloodGlucoseIndex": 32,
  "weight": 250,
  "rations": 1.25,
  "createdAt": "2026-02-12T14:30:00.000Z"
}
```

---

### RationsType (Enum)

Represents the seven categories of food aliments with Spanish display labels.

#### Values

| Enum Key | Display Value (Spanish) | Design Token Color |
|----------|------------------------|-------------------|
| `lacteal` | lácteos | `category-lacteal` (M3 Primary purple) |
| `cereals_flours_pulses_legumes_tubers` | cereales, harinas, legumbres y tuberculos | `category-cereals...` (M3 Secondary) |
| `fruits` | frutas | `category-fruits` (M3 Tertiary orange) |
| `vegetables` | hortalizas | `category-vegetables` (M3 custom green) |
| `oily_and_dry_fruit` | frutas secas y grasa | `category-oily-dry-fruits` (M3 custom brown) |
| `drinks` | bebidas | `category-drinks` (M3 custom blue) |
| `others` | otros | `category-others` (M3 surface-variant gray) |

#### Type Definition

```typescript
enum RationsType {
  lacteal = 'lácteos',
  cereals_flours_pulses_legumes_tubers = 'cereales, harinas, legumbres y tuberculos',
  fruits = 'frutas',
  vegetables = 'hortalizas',
  oily_and_dry_fruit = 'frutas secas y grasa',
  drinks = 'bebidas',
  others = 'otros'
}
```

---

## Relationships

### Entity Relationship Diagram

```text
┌─────────────────┐
│   RationsType   │ (Enum)
│   (7 values)    │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│     Ration      │
│─────────────────│
│ id (PK)         │
│ type (FK)       │──────► References RationsType enum
│ name            │
│ gramsTo...      │
│ bloodGlucose... │
│ weight          │
│ rations         │
│ createdAt       │
└─────────────────┘
```

**Relationships**:
- **RationsType ↔ Ration**: One-to-Many (one type can have many rations)
- No foreign keys in MVP (standalone entities)
- Future: User entity (one user has many rations)

---

## Validation Rules

### Ration Validation

#### Required Fields
- `id`: Must be present, non-empty UUID
- `type`: Must be valid RationsType enum value
- `name`: Must be non-empty string, trimmed, max 200 characters
- `gramsToCarbohydrate`: Must be number > 0
- `weight`: Must be number > 0
- `rations`: Must be number > 0
- `createdAt`: Must be valid Date object

#### Optional Fields
- `bloodGlucoseIndex`: If provided, must be number between 0-100

#### Business Rules
1. **Name uniqueness**: Not enforced (users can have duplicate names for different portions)
2. **Ration calculation**: Should match formula `rations = weight / gramsToCarbohydrate * 10` (verify in tests)
3. **Type consistency**: Type must map to valid design token color class

#### Validation Implementation

```typescript
interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

function validateRation(ration: Partial<Ration>): ValidationResult {
  const errors: Record<string, string> = {};

  // Required fields
  if (!ration.id?.trim()) {
    errors.id = 'ID is required';
  }

  if (!ration.type || !Object.values(RationsType).includes(ration.type)) {
    errors.type = 'Valid ration type is required';
  }

  if (!ration.name?.trim()) {
    errors.name = 'Name is required';
  } else if (ration.name.length > 200) {
    errors.name = 'Name must be 200 characters or less';
  }

  if (typeof ration.gramsToCarbohydrate !== 'number' || ration.gramsToCarbohydrate <= 0) {
    errors.gramsToCarbohydrate = 'Grams to carbohydrate must be greater than 0';
  }

  if (typeof ration.weight !== 'number' || ration.weight <= 0) {
    errors.weight = 'Weight must be greater than 0';
  }

  if (typeof ration.rations !== 'number' || ration.rations <= 0) {
    errors.rations = 'Rations must be greater than 0';
  }

  if (!ration.createdAt || !(ration.createdAt instanceof Date)) {
    errors.createdAt = 'Created date is required';
  }

  // Optional fields
  if (ration.bloodGlucoseIndex !== undefined) {
    if (typeof ration.bloodGlucoseIndex !== 'number' || 
        ration.bloodGlucoseIndex < 0 || 
        ration.bloodGlucoseIndex > 100) {
      errors.bloodGlucoseIndex = 'Blood glucose index must be between 0 and 100';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
```

---

## State Transitions

### Ration Lifecycle

```text
┌─────────────┐
│   CREATE    │ User fills form
│   FORM      │
└──────┬──────┘
       │
       │ Submit (valid data)
       ▼
┌─────────────┐
│  VALIDATE   │ Client-side validation
└──────┬──────┘
       │
       │ Valid
       ▼
┌─────────────┐
│    SAVE     │ Repository.save()
│ (localStorage)
└──────┬──────┘
       │
       │ Success
       ▼
┌─────────────┐
│  PERSISTED  │ In localStorage
│   STATE     │
└──────┬──────┘
       │
       │ Navigate to home
       ▼
┌─────────────┐
│  DISPLAYED  │ In ration list
│   IN LIST   │
└─────────────┘
```

**States**:
1. **Draft** (Form): User is filling form, data in component state only
2. **Validating**: Form submission triggered, validation running
3. **Saving**: Valid data being persisted to localStorage
4. **Persisted**: Data successfully saved in localStorage
5. **Displayed**: Rendered in home page list

**Error States**:
- **Validation Error**: Form data invalid, show field errors, stay on form
- **Save Error**: localStorage quota exceeded or disabled, show notification, stay on form
- **Load Error**: localStorage corrupt or unavailable, show empty state with message

---

## Data Storage Schema

### localStorage Structure

**Key**: `sdd-rations-calculator:rations`

**Value**: JSON array of Ration objects

#### Schema

```typescript
interface LocalStorageSchema {
  [key: string]: Ration[];
}

// Actual storage
localStorage.setItem('sdd-rations-calculator:rations', JSON.stringify([
  {
    id: "uuid-1",
    type: "lacteal",
    name: "Leche",
    gramsToCarbohydrate: 200,
    bloodGlucoseIndex: 32,
    weight: 250,
    rations: 1.25,
    createdAt: "2026-02-12T14:30:00.000Z"
  },
  // ... more rations
]));
```

#### Serialization Rules

- **Date → String**: `createdAt` Date object serialized to ISO 8601 string
- **Enum → String**: `type` enum value serialized to string literal
- **Optional fields**: `bloodGlucoseIndex` omitted if undefined (not null)

#### Deserialization Rules

```typescript
function deserializeRation(data: any): Ration {
  return {
    ...data,
    createdAt: new Date(data.createdAt), // Parse ISO string to Date
    bloodGlucoseIndex: data.bloodGlucoseIndex ?? undefined, // null → undefined
  };
}
```

---

## Indexing & Sorting

### Default Sort Order

Rations displayed in **reverse chronological order** (newest first):

```typescript
rations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
```

### Future Indexes

For future optimization (when using Database instead of localStorage):

- **Primary Index**: `id` (UUID)
- **Secondary Index**: `createdAt` (for sorting)
- **Optional Index**: `type` (for filtering by category)
- **Full-text Index**: `name` (for search)

---

## Data Constraints

### Size Limits

- **Single Ration**: ~250 bytes JSON (estimated)
- **1000 Rations**: ~250 KB
- **localStorage Quota**: 5-10 MB (browser-dependent)
- **Safe Limit**: ~10,000 rations before approaching quota

### Performance Targets

- **Load All**: < 50ms for 1000 rations from localStorage
- **Save One**: < 10ms to append to array
- **Serialize**: < 100ms for 1000 rations to JSON
- **Infinite Scroll Batch**: 10 items per batch, < 5ms to slice array

---

## Migration Strategy

### Schema Versioning

```typescript
interface LocalStorageData {
  version: number; // Schema version
  rations: Ration[];
}
```

**Current version**: 1

**Future migrations**:
- V1 → V2: Add `updatedAt` field
- V2 → V3: Add `userId` for multi-user support
- V3 → V4: Migrate to backend API (export/import)

### Backward Compatibility

When reading from localStorage:

```typescript
function migrateData(data: any): Ration[] {
  // Handle old schema (plain array without version)
  if (Array.isArray(data)) {
    return data.map(addDefaults);
  }
  
  // Handle versioned schema
  if (data.version === 1) {
    return data.rations;
  }
  
  // Future versions...
  return [];
}
```

---

## Summary

- **Core Entity**: Ration (8 fields, 7 required)
- **Enum**: RationsType (7 values mapped to design tokens)
- **Storage**: localStorage with JSON serialization
- **Validation**: Client-side, required + optional fields, business rules
- **Sorting**: Newest first (createdAt DESC)
- **Limits**: ~10,000 rations max (localStorage quota)
- **Lifecycle**: Create → Validate → Save → Persist → Display

**Next Steps**: Define contracts (repository interface, API contracts) in Phase 1.
