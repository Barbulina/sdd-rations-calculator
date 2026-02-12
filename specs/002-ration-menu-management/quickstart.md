# Quickstart Guide: Ration Menu Management

**Feature**: 002-ration-menu-management  
**Target Audience**: Developers implementing this feature  
**Estimated Time**: 15 minutes to understand, 3-5 hours to implement MVP

## Overview

This guide provides step-by-step instructions for implementing the ration menu management system with:

- Create ration form page with navigation
- localStorage persistence via repository pattern  
- Home page ration list with infinite scroll
- Integration with design token system for category colors

## Prerequisites

- Next.js 15.1.6 app already initialized (from 001-design-token-system)
- Design token system implemented and working
- TypeScript 5 configured with strict mode
- TailwindCSS 3.4.17 configured with design tokens

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Home Page    │  │ Create Form  │  │ Ration Card  │  │
│  │ (List View)  │  │ Page         │  │ Component    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│              Application Layer (React Hooks)             │
│  useRationRepository() • useInfiniteScroll()             │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Domain Layer (Interfaces)                   │
│  RationRepository Interface • Ration Type • Validation   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│         Infrastructure Layer (Implementation)            │
│  LocalStorageRationRepository • localStorage Adapter     │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  localStorage  │
              │  (Browser API) │
              └───────────────┘
```

## Step-by-Step Implementation

### Phase 1: Domain Layer (30 minutes)

Create type definitions and repository interface.

#### 1.1 Create Ration Types

**File**: `src/domain/models/Ration.ts`

```typescript
export enum RationsType {
  lacteal = 'lácteos',
  cereals_flours_pulses_legumes_tubers = 'cereales, harinas, legumbres y tuberculos',
  fruits = 'frutas',
  vegetables = 'hortalizas',
  oily_and_dry_fruit = 'frutas secas y grasa',
  drinks = 'bebidas',
  others = 'otros'
}

export interface Ration {
  id: string;
  type: RationsType;
  name: string;
  gramsToCarbohydrate: number;
  bloodGlucoseIndex?: number;
  weight: number;
  rations: number;
  createdAt: Date;
}

export type CreateRationDTO = Omit<Ration, 'id' | 'createdAt'>;
```

**Verify**: TypeScript compiles without errors

---

#### 1.2 Create Repository Interface

**File**: `src/domain/repositories/RationRepository.ts`

```typescript
import { Ration, CreateRationDTO } from '../models/Ration';

export interface RationRepository {
  save(data: CreateRationDTO): Promise<Ration>;
  findAll(): Promise<Ration[]>;
  findById(id: string): Promise<Ration | null>;
  delete(id: string): Promise<boolean>;
}
```

**Verify**: Interface compiles, no implementation yet

---

### Phase 2: Infrastructure Layer (45 minutes)

Implement localStorage repository adapter.

#### 2.1 Create localStorage Adapter

**File**: `src/infrastructure/storage/LocalStorageAdapter.ts`

```typescript
export class LocalStorageAdapter {
  private readonly prefix = 'sdd-rations-calculator:';

  isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('localStorage getItem error:', error);
      return null;
    }
  }

  setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('localStorage setItem error:', error);
      return false;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }
}
```

**Test**: Open browser console, verify storage works:
```javascript
const adapter = new LocalStorageAdapter();
adapter.setItem('test', { foo: 'bar' });
console.log(adapter.getItem('test')); // { foo: 'bar' }
```

---

#### 2.2 Create Repository Implementation

**File**: `src/infrastructure/repositories/LocalStorageRationRepository.ts`

```typescript
import { RationRepository } from '@/src/domain/repositories/RationRepository';
import { Ration, CreateRationDTO } from '@/src/domain/models/Ration';
import { LocalStorageAdapter } from '../storage/LocalStorageAdapter';

export class LocalStorageRationRepository implements RationRepository {
  private readonly storageKey = 'rations';
  private adapter: LocalStorageAdapter;

  constructor() {
    this.adapter = new LocalStorageAdapter();
  }

  async save(data: CreateRationDTO): Promise<Ration> {
    const ration: Ration = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    const rations = await this.findAll();
    rations.push(ration);
    
    this.adapter.setItem(this.storageKey, this.serializeRations(rations));
    return ration;
  }

  async findAll(): Promise<Ration[]> {
    const data = this.adapter.getItem<any[]>(this.storageKey);
    if (!data) return [];
    
    return this.deserializeRations(data).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findById(id: string): Promise<Ration | null> {
    const rations = await this.findAll();
    return rations.find(r => r.id === id) ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const rations = await this.findAll();
    const filtered = rations.filter(r => r.id !== id);
    
    if (filtered.length === rations.length) return false;
    
    this.adapter.setItem(this.storageKey, this.serializeRations(filtered));
    return true;
  }

  private serializeRations(rations: Ration[]): any[] {
    return rations.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString()
    }));
  }

  private deserializeRations(data: any[]): Ration[] {
    return data.map(r => ({
      ...r,
      createdAt: new Date(r.createdAt)
    }));
  }
}
```

**Verify**: TypeScript compiles, implements RationRepository interface correctly

---

### Phase 3: Application Layer (30 minutes)

Create React hooks and context for dependency injection.

#### 3.1 Create Repository Context

**File**: `src/application/contexts/RationRepositoryContext.tsx`

```typescript
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { RationRepository } from '@/src/domain/repositories/RationRepository';
import { LocalStorageRationRepository } from '@/src/infrastructure/repositories/LocalStorageRationRepository';

const RationRepositoryContext = createContext<RationRepository | null>(null);

export function RationRepositoryProvider({ children }: { children: ReactNode }) {
  const repository = new LocalStorageRationRepository();
  
  return (
    <RationRepositoryContext.Provider value={repository}>
      {children}
    </RationRepositoryContext.Provider>
  );
}

export function useRationRepository(): RationRepository {
  const context = useContext(RationRepositoryContext);
  if (!context) {
    throw new Error('useRationRepository must be used within RationRepositoryProvider');
  }
  return context;
}
```

**Verify**: No compile errors

---

#### 3.2 Create Infinite Scroll Hook

**File**: `src/application/hooks/useInfiniteScroll.ts`

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';

export function useInfiniteScroll<T>(
  items: T[],
  batchSize: number = 10
) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial batch
    loadMore();
  }, [items]);

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
    
    setDisplayedItems(prev => [...prev, ...nextBatch]);
  };

  return { displayedItems, hasMore, loadMoreRef };
}
```

**Verify**: Hook compiles correctly

---

### Phase 4: UI Components (90 minutes)

Create React components for form and list display.

#### 4.1 Create Ration Card Component

**File**: `app/components/RationCard.tsx`

```typescript
'use client';

import { Ration, RationsType } from '@/src/domain/models/Ration';

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

export function RationCard({ ration }: { ration: Ration }) {
  return (
    <div className={`p-4 rounded-lg ${getCategoryColorClass(ration.type)} mb-4`}>
      <h3 className="text-lg font-semibold">{ration.name}</h3>
      <p className="text-sm opacity-80">{ration.type}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div>Peso: {ration.weight}g</div>
        <div>Raciones: {ration.rations}</div>
        <div>HC (10g): {ration.gramsToCarbohydrate}g</div>
        {ration.bloodGlucoseIndex && (
          <div>IG: {ration.bloodGlucoseIndex}</div>
        )}
      </div>
    </div>
  );
}
```

**Test**: Create sample ration and verify card renders

---

#### 4.2 Create Home Page with List

**File**: `app/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRationRepository } from '@/src/application/contexts/RationRepositoryContext';
import { useInfiniteScroll } from '@/src/application/hooks/useInfiniteScroll';
import { RationCard } from './components/RationCard';
import { Ration } from '@/src/domain/models/Ration';

export default function HomePage() {
  const repository = useRationRepository();
  const [rations, setRations] = useState<Ration[]>([]);
  const { displayedItems, hasMore, loadMoreRef } = useInfiniteScroll(rations, 10);

  useEffect(() => {
    loadRations();
  }, []);

  const loadRations = async () => {
    const data = await repository.findAll();
    setRations(data);
  };

  if (rations.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl mb-4">No rations yet</h1>
        <Link href="/create-ration">
          <button className="px-6 py-3 bg-blue-500 text-white rounded">
            Create First Ration
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Rations</h1>
        <Link href="/create-ration">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            + Create
          </button>
        </Link>
      </div>

      <div>
        {displayedItems.map(ration => (
          <RationCard key={ration.id} ration={ration} />
        ))}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className="text-center py-4">
          Loading more...
        </div>
      )}
    </div>
  );
}
```

**Test**: Visit `/` and verify empty state or list displays

---

#### 4.3 Create Ration Form Page

**File**: `app/create-ration/page.tsx`

```typescript
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useRationRepository } from '@/src/application/contexts/RationRepositoryContext';
import { RationsType, CreateRationDTO } from '@/src/domain/models/Ration';

export default function CreateRationPage() {
  const router = useRouter();
  const repository = useRationRepository();
  
  const [formData, setFormData] = useState<CreateRationDTO>({
    type: RationsType.lacteal,
    name: '',
    gramsToCarbohydrate: 0,
    bloodGlucoseIndex: undefined,
    weight: 0,
    rations: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.gramsToCarbohydrate <= 0) newErrors.gramsToCarbohydrate = 'Must be > 0';
    if (formData.weight <= 0) newErrors.weight = 'Must be > 0';
    if (formData.rations <= 0) newErrors.rations = 'Must be > 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    await repository.save(formData);
    router.push('/');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Ration</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Type</label>
          <select
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as RationsType })}
            className="w-full p-2 border rounded"
          >
            {Object.entries(RationsType).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block mb-2">Grams to Carbohydrate (10g HC)</label>
          <input
            type="number"
            value={formData.gramsToCarbohydrate}
            onChange={e => setFormData({ ...formData, gramsToCarbohydrate: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
          {errors.gramsToCarbohydrate && <p className="text-red-500 text-sm">{errors.gramsToCarbohydrate}</p>}
        </div>

        <div>
          <label className="block mb-2">Weight (grams)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
          {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
        </div>

        <div>
          <label className="block mb-2">Rations</label>
          <input
            type="number"
            step="0.01"
            value={formData.rations}
            onChange={e => setFormData({ ...formData, rations: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
          {errors.rations && <p className="text-red-500 text-sm">{errors.rations}</p>}
        </div>

        <div>
          <label className="block mb-2">Blood Glucose Index (optional)</label>
          <input
            type="number"
            value={formData.bloodGlucoseIndex ?? ''}
            onChange={e => setFormData({ 
              ...formData, 
              bloodGlucoseIndex: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded"
          >
            Save Ration
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
```

**Test**: 
1. Visit `/create-ration`
2. Fill form
3. Submit
4. Verify redirect to `/` and ration appears in list

---

### Phase 5: Integration (15 minutes)

Wire up repository provider in root layout.

**File**: `app/layout.tsx` (update existing)

```typescript
import { RationRepositoryProvider } from '@/src/application/contexts/RationRepositoryContext';
// ... existing imports

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <RationRepositoryProvider>
          {/* existing providers */}
          {children}
        </RationRepositoryProvider>
      </body>
    </html>
  );
}
```

---

## Verification Checklist

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] Can navigate to home page (`/`)
- [ ] Can click "Create Ration" button → navigates to `/create-ration`
- [ ] Can fill form and submit → saves to localStorage
- [ ] After submit → redirects to home page
- [ ] Ration appears in list with correct category color
- [ ] Dark mode toggle → category colors adapt
- [ ] Create 20+ rations → infinite scroll loads in batches
- [ ] Refresh browser → rations persist
- [ ] Open devtools → localStorage contains rations array
- [ ] Change repository to MockRepository in tests → components work

## Common Issues

### Issue: "useRationRepository must be used within RationRepositoryProvider"
**Solution**: Verify RationRepositoryProvider wraps app in layout.tsx

### Issue: Colors not applying
**Solution**: Ensure design token system is built (`npm run tokens:build`)

### Issue: Infinite scroll not working
**Solution**: Create 15+ rations to exceed initial batch size (10)

### Issue: Dark mode colors wrong
**Solution**: Verify next-themes ThemeProvider is active

## Next Steps

After completing MVP:

1. Add edit/delete functionality
2. Add search/filter by ration type
3. Add export/import (JSON download/upload)
4. Add analytics (total rations, average by type)
5. Migrate to backend API (swap repository implementation)

## Time Estimate

- Phase 1 (Domain): 30 min
- Phase 2 (Infrastructure): 45 min
- Phase 3 (Application): 30 min
- Phase 4 (UI): 90 min
- Phase 5 (Integration): 15 min

**Total**: ~3.5 hours for MVP
