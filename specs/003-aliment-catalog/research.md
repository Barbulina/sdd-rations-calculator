# Phase 0: Research - Custom Aliment Creation

**Feature**: 003-aliment-catalog  
**Phase**: Research  
**Date**: 2026-02-12

## Research Questions

### 0. Testing Infrastructure Setup (TDD Prerequisite)

**Question**: Constitution requires Vitest (unit/integration) and Playwright (E2E), but they're not installed in package.json. What's needed?

**Decision**: Install and configure both testing frameworks before implementation

**Rationale**:
- Constitution Principle III mandates TDD (test-first methodology)
- Cannot write tests before implementation without testing tools
- Vitest is modern, fast, and TypeScript-native (better than Jest for Next.js)
- Playwright provides reliable cross-browser E2E testing
- Both are Next.js ecosystem standards

**Installation**:
```bash
# Vitest for unit and integration tests
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom

# Playwright for E2E tests
npm install -D @playwright/test
npx playwright install
```

**Configuration Files Needed**:

1. **vitest.config.ts**:
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

3. **playwright.config.ts**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

4. **package.json scripts**:
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

**TDD Workflow with These Tools**:

**Unit Tests (Domain Layer)**:
1. Write `tests/unit/custom-aliments/CustomAliment.test.ts`
2. Run `npm test` → RED (module doesn't exist)
3. Implement `src/domain/models/CustomAliment.ts`
4. Run `npm test` → GREEN
5. Refactor

**Integration Tests (Repository Layer)**:
1. Write `tests/integration/custom-aliments/LocalStorageCustomAlimentRepository.test.ts`
2. Run `npm test` → RED
3. Implement `src/infrastructure/repositories/LocalStorageCustomAlimentRepository.ts`
4. Run `npm test` → GREEN
5. Refactor

**E2E Tests (UI Layer)**:
1. Write `tests/e2e/custom-aliments/create-custom-aliment.spec.ts`
2. Run `npm run test:e2e` → RED
3. Implement `app/aliment-browser/create/page.tsx`
4. Run `npm run test:e2e` → GREEN
5. Refactor

**Alternatives Considered**:
- Jest: Heavier, slower with TypeScript, more configuration needed
- Cypress: Good but Playwright has better TypeScript support
- Continue without tests: **REJECTED** - violates constitution
- Tests after implementation: **REJECTED** - violates TDD principle

**Sources**:
- Vitest documentation: https://vitest.dev/
- Playwright documentation: https://playwright.dev/
- Next.js testing guides
- Constitution Principle III & VI

---

### 1. localStorage Quota Management

**Question**: How to handle localStorage quota exceeded errors gracefully?

**Decision**: Implement quota detection and user-friendly error messages

**Rationale**:
- localStorage quota varies by browser (5-10MB typically)
- QuotaExceededError can occur during save operations
- Users need clear guidance on resolution

**Implementation**:
```typescript
// Already implemented in LocalStorageAdapter
try {
  localStorage.setItem(key, value);
} catch (error) {
  if (error instanceof DOMException && error.name === 'QuotaExceededError') {
    throw new Error('Storage full - please delete some items');
  }
  throw error;
}
```

**Alternatives Considered**:
- IndexedDB: More complex, overkill for <100 custom aliments
- Compression: Adds complexity, minimal benefit for JSON data

**Sources**:
- MDN Web Docs: Storage quotas and eviction criteria
- Existing `LocalStorageAdapter.ts` implementation

---

### 2. Form Validation Best Practices

**Question**: What's the best approach for real-time form validation in React 19?

**Decision**: Field-level validation with immediate feedback

**Rationale**:
- React 19 supports concurrent rendering for smooth UX
- Immediate validation prevents form submission errors
- Consistent with existing `create-ration` form pattern

**Implementation**:
```typescript
// Pattern from existing CreateRationPage
const [errors, setErrors] = useState<Record<string, string>>({});

const validateField = (field: string, value: any): string | undefined => {
  if (field === 'name' && !value.trim()) {
    return 'Name is required';
  }
  // ... other validations
};

const updateField = (field: keyof CustomAliment, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  const error = validateField(field, value);
  setErrors(prev => error ? { ...prev, [field]: error } : omit(prev, field));
};
```

**Alternatives Considered**:
- React Hook Form: Extra dependency, current pattern works well
- Zod schema validation: Overkill for simple form
- Submit-time only validation: Poor UX

**Sources**:
- React 19 documentation on concurrent features
- Existing `app/create-ration/page.tsx` implementation

---

### 3. Composite Repository Pattern

**Question**: How to merge catalog and custom aliments efficiently?

**Decision**: Implement CompositeAlimentRepository that delegates to both sources

**Rationale**:
- Keeps concerns separated (catalog immutable, custom mutable)
- Repository pattern allows swapping implementations
- Single interface for UI layer

**Implementation**:
```typescript
class CompositeAlimentRepository implements AlimentInfoRepository {
  constructor(
    private catalogRepo: InMemoryAlimentInfoRepository,
    private customRepo: CustomAlimentRepository
  ) {}

  async findAll(): Promise<AlimentInfo[]> {
    const [catalog, custom] = await Promise.all([
      this.catalogRepo.findAll(),
      this.customRepo.findAll()
    ]);
    return [...catalog, ...custom];
  }

  async search(query: string): Promise<AlimentInfo[]> {
    const [catalog, custom] = await Promise.all([
      this.catalogRepo.search(query),
      this.customRepo.search(query)
    ]);
    return [...catalog, ...custom];
  }
}
```

**Alternatives Considered**:
- Single repository: Violates SRP, mixes concerns
- Hook-level merge: Duplicates logic across components
- Server-side merge: Requires backend, breaks offline-first

**Sources**:
- Gang of Four: Composite Pattern
- Existing repository pattern in feature 002

---

### 4. URL State for Form Pre-fill

**Question**: How to pass search query to create form?

**Decision**: Use Next.js searchParams for pre-filling

**Rationale**:
- Native Next.js App Router feature
- Preserves user context when navigating
- Enables deep linking and bookmarking

**Implementation**:
```typescript
// In aliment-browser/page.tsx
const handleCreateFromSearch = () => {
  router.push(`/aliment-browser/create?name=${encodeURIComponent(searchQuery)}`);
};

// In aliment-browser/create/page.tsx
export default function CreateAlimentPage({
  searchParams,
}: {
  searchParams: { name?: string };
}) {
  const [formData, setFormData] = useState({
    name: searchParams.name || '',
    // ... other fields
  });
}
```

**Alternatives Considered**:
- localStorage: Temporary state, clutters storage
- React Context: Lost on page refresh
- Cookies: Overkill for simple form state

**Sources**:
- Next.js 15 App Router documentation on searchParams
- MDN: URLSearchParams API

---

### 5. Custom Aliment Badge UI

**Question**: How to visually distinguish custom vs catalog aliments?

**Decision**: Add "Custom" badge using existing design tokens

**Rationale**:
- Clear visual differentiation
- Existing badge/chip styles in Material Design 3
- Accessible with proper color contrast

**Implementation**:
```typescript
// In AlimentCard component
{aliment.isCustom && (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
    Custom
  </span>
)}
```

**Alternatives Considered**:
- Icon only: Less clear without label
- Different card background: Too subtle
- Border color: Not sufficient for accessibility

**Sources**:
- Material Design 3: Chips and badges
- WCAG 2.1: Color contrast requirements (AA level)
- Existing design tokens in `tokens.json`

---

## Summary

All research questions resolved with implementations that:
1. ✅ Set up testing infrastructure (Vitest + Playwright) for TDD workflow
2. ✅ Maintain hexagonal architecture
3. ✅ Use existing design tokens
4. ✅ Follow established patterns from features 001-002
5. ✅ Support offline-first requirements
6. ✅ Ensure accessibility compliance

**Testing Infrastructure Ready**: Vitest and Playwright configurations created, enabling test-first development

**Next Steps**: Proceed to Phase 1 (data-model.md, contracts/, quickstart.md)
