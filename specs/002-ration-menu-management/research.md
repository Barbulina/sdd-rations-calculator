# Research: Ration Menu Management

**Feature**: 002-ration-menu-management  
**Date**: 2026-02-12  
**Status**: Complete

## Overview

This document consolidates research findings for implementing the ration menu management system with repository pattern, localStorage persistence, and infinite scroll functionality in Next.js.

## Research Areas

### 1. Repository Pattern in TypeScript/React

**Decision**: Use interface-based repository pattern with dependency injection via React Context

**Rationale**:
- Provides abstraction over data access layer (localStorage now, API later)
- Enables easy testing with mock repositories (no localStorage dependency in tests)
- Follows SOLID principles (Dependency Inversion - depend on abstractions)
- TypeScript interfaces ensure type safety across implementations
- React Context allows provider pattern for dependency injection

**Implementation Pattern**:

```typescript
// Domain layer - pure interface
interface RationRepository {
  save(ration: Ration): Promise<void>;
  findAll(): Promise<Ration[]>;
  findById(id: string): Promise<Ration | null>;
  delete(id: string): Promise<void>;
}

// Infrastructure layer - concrete implementation
class LocalStorageRationRepository implements RationRepository {
  private readonly storageKey = 'rations';
  
  async save(ration: Ration): Promise<void> {
    const rations = await this.findAll();
    rations.push(ration);
    localStorage.setItem(this.storageKey, JSON.stringify(rations));
  }
  
  async findAll(): Promise<Ration[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
}

// Application layer - React Context for DI
const RationRepositoryContext = createContext<RationRepository>(
  new LocalStorageRationRepository()
);

export const useRationRepository = () => useContext(RationRepositoryContext);
```

**Alternatives considered**:
- Direct localStorage calls in components: Rejected - tight coupling, hard to test, no flexibility
- Service class without interface: Rejected - still coupled to localStorage, can't swap implementations
- Redux/Zustand with persistence: Rejected - adds unnecessary state management complexity for simple CRUD

**Best practices**:
- Keep repository methods async (even if localStorage is sync) to prepare for API migration
- Use TypeScript strict mode to catch type mismatches
- Repository returns domain models, not DTOs (localStorage JSON is infrastructure concern)
- Handle errors at repository boundary (quota exceeded, disabled localStorage)

---

### 2. Infinite Scroll Implementation in React

**Decision**: Use Intersection Observer API with custom React hook

**Rationale**:
- Intersection Observer is performant (no scroll event listeners)
- Browser-native API (no external dependencies needed)
- Custom hook promotes reusability
- Works well with React concurrent rendering
- Batched loading improves perceived performance

**Implementation Pattern**:

```typescript
function useInfiniteScroll<T>(
  items: T[],
  batchSize: number = 10
) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, displayedItems]);

  const loadMore = () => {
    const nextBatch = items.slice(
      displayedItems.length,
      displayedItems.length + batchSize
    );
    
    if (nextBatch.length === 0) {
      setHasMore(false);
      return;
    }
    
    setDisplayedItems([...displayedItems, ...nextBatch]);
  };

  return { displayedItems, hasMore, loadMoreRef };
}
```

**Usage**:
```tsx
const RationList = ({ rations }) => {
  const { displayedItems, hasMore, loadMoreRef } = useInfiniteScroll(rations, 10);
  
  return (
    <>
      {displayedItems.map(ration => <RationCard key={ration.id} {...ration} />)}
      {hasMore && <div ref={loadMoreRef}>Loading more...</div>}
    </>
  );
};
```

**Alternatives considered**:
- `react-infinite-scroll-component` library: Rejected - adds dependency for simple use case
- Scroll event listener: Rejected - performance issues, doesn't work well with React 19
- `window.onscroll`: Rejected - not component-scoped, memory leaks
- Pagination with "Load More" button: Considered for fallback if Intersection Observer unsupported

**Best practices**:
- Use `threshold: 0.1` to trigger slightly before reaching bottom
- Disconnect observer on cleanup to prevent memory leaks
- Handle empty states and loading states explicitly
- Consider virtualization for very large lists (>1000 items), but not needed for MVP

---

### 3. localStorage Best Practices

**Decision**: Wrap localStorage in try-catch with quota and availability handling

**Rationale**:
- localStorage can throw `QuotaExceededError` when full (5-10MB limit)
- localStorage can be disabled in private browsing or browser settings
- localStorage is synchronous but can block main thread with large data
- JSON serialization can fail with circular references or special types

**Implementation Pattern**:

```typescript
class LocalStorageAdapter {
  isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('localStorage getItem error:', error);
      return null;
    }
  }

  setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Handle quota exceeded - could show UI message
        console.error('localStorage quota exceeded');
      }
      return false;
    }
  }
}
```

**Error handling strategy**:
- Check availability on app initialization
- Show user-friendly message if localStorage disabled
- Gracefully degrade (in-memory fallback or read-only mode)
- Don't crash app on quota exceeded - show notification

**Alternatives considered**:
- IndexedDB: Rejected - overcomplicated for simple key-value storage, async complexity
- SessionStorage: Rejected - data lost on tab close, doesn't meet persistence requirement
- Cookies: Rejected - 4KB limit too small, sent with every HTTP request

**Best practices**:
- Keep localStorage keys namespaced (e.g., `rations-calculator:rations`)
- Store minimal data (don't cache what can be derived)
- Consider data migration strategy for schema changes
- Validate data on read (could be corrupted or from old schema)
- Use TypeScript types to enforce structure

**Data size estimation**:
- Single ration: ~200 bytes JSON
- 1000 rations: ~200KB (well under 5MB limit)
- Safe for MVP scope (100-1000 rations)

---

### 4. Next.js App Router Navigation & Routing

**Decision**: Use App Router file-based routing with `useRouter` hook and `<Link>` component

**Rationale**:
- Next.js 15 uses App Router by default (replacing Pages Router)
- File-based routing is intuitive (`app/create-ration/page.tsx` → `/create-ration`)
- `useRouter` provides programmatic navigation (redirect after form submit)
- `<Link>` component enables client-side navigation with prefetching
- Server Components by default, Client Components opt-in with `'use client'`

**Routing structure**:

```text
app/
├── page.tsx                    # "/" - Home page with ration list
└── create-ration/
    └── page.tsx                # "/create-ration" - Create form
```

**Navigation patterns**:

```typescript
// Link component for user-initiated navigation
import Link from 'next/link';

<Link href="/create-ration">
  <button>Create Ration</button>
</Link>

// useRouter for programmatic navigation (after form submit)
'use client';
import { useRouter } from 'next/navigation';

const router = useRouter();
const handleSubmit = async (data) => {
  await repository.save(data);
  router.push('/'); // Redirect to home
};
```

**Client vs Server Components**:
- Home page list: Server Component (default) - can fetch data on server
- But localStorage requires client-side, so must use `'use client'`
- Create form: Client Component (`'use client'` directive) - needs form state and browser APIs
- Ration card: Client Component - uses design tokens (Tailwind classes) and may have interactions

**Alternatives considered**:
- React Router: Rejected - Next.js App Router is framework standard
- Pages Router: Rejected - deprecated, App Router is current best practice
- Manual routing: Rejected - loses prefetching, code splitting benefits

**Best practices**:
- Use `<Link>` for navigation links (accessibility, prefetching)
- Use `router.push()` for post-action redirects
- Keep minimal client components (prefer Server Components when possible)
- But if using localStorage, entire data flow must be client-side
- Use `next/navigation` imports, not `next/router` (App Router vs Pages Router)

---

### 5. Form Handling in React

**Decision**: Use React Server Actions with `useActionState` or controlled components with local state

**Rationale**:
- React 19 introduces Server Actions for form handling
- But localStorage is client-side, so can't use pure Server Actions
- Controlled components give immediate validation feedback
- `useActionState` hook provides pending state management
- TypeScript ensures type safety for form data

**Implementation Pattern**:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateRationForm = () => {
  const router = useRouter();
  const repository = useRationRepository();
  
  const [formData, setFormData] = useState<Partial<Ration>>({
    type: undefined,
    name: '',
    gramsToCarbohydrate: 0,
    bloodGlucoseIndex: undefined,
    weight: 0,
    rations: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Ration type is required';
    }
    
    if (formData.gramsToCarbohydrate <= 0) {
      newErrors.gramsToCarbohydrate = 'Must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    await repository.save(formData as Ration);
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

**Validation strategy**:
- Client-side validation for immediate feedback
- Required fields: type, name, gramsToCarbohydrate, weight, rations
- Number validation: must be positive (> 0)
- Optional field: bloodGlucoseIndex (can be undefined)

**Alternatives considered**:
- React Hook Form: Considered but adds dependency for simple form
- Formik: Rejected - overkill for single form
- Uncontrolled components with refs: Rejected - harder to validate in real-time
- Zod validation: Could add later for robust schema validation

**Best practices**:
- Validate on submit, optionally on blur
- Show field-level error messages
- Disable submit button while saving
- Clear form after successful submit
- Handle repository errors gracefully

---

### 6. TypeScript Type Definitions

**Decision**: Define domain types in separate files with strict type safety

**Rationale**:
- Separation of concerns (type definitions separate from implementation)
- Reusable across components and tests
- TypeScript strict mode catches errors at compile time
- Union types for enums provide autocomplete

**Type definitions**:

```typescript
// src/domain/models/RationsType.ts
export enum RationsType {
  lacteal = 'lácteos',
  cereals_flours_pulses_legumes_tubers = 'cereales, harinas, legumbres y tuberculos',
  fruits = 'frutas',
  vegetables = 'hortalizas',
  oily_and_dry_fruit = 'frutas secas y grasa',
  drinks = 'bebidas',
  others = 'otros'
}

// src/domain/models/Ration.ts
export interface Ration {
  id: string; // Added for uniqueness (not in original spec, but needed for React keys and CRUD)
  type: RationsType;
  name: string;
  gramsToCarbohydrate: number;
  bloodGlucoseIndex?: number; // Optional
  weight: number;
  rations: number;
  createdAt: Date; // Added for sorting (newest first)
}
```

**Note**: Added `id` and `createdAt` fields not in original spec but essential for:
- React list keys (id)
- Sorting (createdAt)
- Future CRUD operations (id)

**Best practices**:
- Use `interface` for object shapes, `type` for unions
- Use `enum` for fixed string values with autocomplete
- Mark optional fields with `?`
- Use `Date` type, serialize to ISO string in localStorage
- Generate IDs with `crypto.randomUUID()` or timestamp-based

---

### 7. Design Token Integration

**Decision**: Import category color tokens from existing design token system

**Rationale**:
- Design token system already implemented in 001-design-token-system
- Provides category-specific colors with WCAG AA compliance
- Supports light/dark theme switching
- TailwindCSS utility classes already generated

**Available tokens** (from specs/001-design-token-system):
- `bg-category-lacteal`, `text-category-lacteal` - M3 Primary purple
- `bg-category-cereals-flours-pulses-legumes-tubers` - M3 Secondary
- `bg-category-fruits` - M3 Tertiary orange
- `bg-category-vegetables` - M3 custom green
- `bg-category-oily-dry-fruits` - M3 custom brown
- `bg-category-drinks` - M3 custom blue
- `bg-category-others` - M3 surface-variant gray

**Mapping strategy**:

```typescript
const getCategoryColorClass = (type: RationsType): string => {
  const colorMap: Record<RationsType, string> = {
    [RationsType.lacteal]: 'bg-category-lacteal',
    [RationsType.cereals_flours_pulses_legumes_tubers]: 'bg-category-cereals-flours-pulses-legumes-tubers',
    [RationsType.fruits]: 'bg-category-fruits',
    [RationsType.vegetables]: 'bg-category-vegetables',
    [RationsType.oily_and_dry_fruit]: 'bg-category-oily-dry-fruits',
    [RationsType.drinks]: 'bg-category-drinks',
    [RationsType.others]: 'bg-category-others',
  };
  
  return colorMap[type];
};
```

**Best practices**:
- Use semantic token names, not hex colors
- Tokens automatically support dark mode
- Ensure contrast ratio validation already done by design token system
- Use Tailwind classes, not inline styles

---

## Conclusions

### Technical Approach Summary

1. **Architecture**: Hexagonal/Clean Architecture
   - Domain layer: Ration entity, RationRepository interface
   - Infrastructure layer: LocalStorageRationRepository implementation
   - Application layer: React components, hooks, contexts

2. **Data Flow**:
   - User → Form Component → Repository Interface → localStorage Adapter → Browser Storage
   - Browser Storage → Repository → React State → List Component → Card Components

3. **Key Technologies**:
   - Next.js App Router for routing and page structure
   - TypeScript for type safety
   - Repository pattern for abstraction
   - Intersection Observer for infinite scroll
   - localStorage for persistence
   - Design tokens for theming

4. **Testing Strategy**:
   - Repository contract tests (mock localStorage)
   - Component tests (mock repository)
   - Integration tests (infinite scroll behavior)
   - Manual testing (localStorage quota, disabled storage)

### Risk Mitigation

- **localStorage quota**: Handle gracefully with user notification
- **Browser compatibility**: Intersection Observer supported in all modern browsers
- **Performance**: Infinite scroll ensures good performance even with 1000+ items
- **Maintainability**: Repository pattern enables easy migration to API later

### Next Steps

Proceed to Phase 1:
- Create data-model.md with Ration entity schema
- Create contracts/ with TypeScript interfaces and repository contract
- Create quickstart.md with developer workflow
- Update agent context with new technical decisions
