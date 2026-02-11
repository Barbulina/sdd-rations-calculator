# Quickstart: Design Token System

**Feature**: Design Token System for Rations Calculator  
**Audience**: Designers and developers  
**Last Updated**: 2026-02-11

## Overview

The design token system provides a single source of truth for all visual design decisions in the Rations Calculator PWA. Designers manage tokens in Specify, developers consume them via Tailwind CSS utility classes. No hardcoded colors, spacing, or typography allowed.

**Key Principle**: Design tokens are the constitutional mandate. All UI values must come from `tokens.json`.

## For Designers: Managing Tokens in Specify

### Initial Setup

1. **Access Specify workspace** for Rations Calculator project
2. **Verify M3 foundation**: Ensure Material Design 3 color palettes are imported as base
3. **Check token categories** exist:
   - Category Colors (7 tokens)
   - State Colors (4 tokens)
   - Feedback Colors (4 tokens)
   - Typography Scale (12 tokens)
   - Spacing Scale (10 tokens)

### Creating/Editing Color Tokens

**Example: Update lacteal category color**

1. Navigate to **Category Colors** collection in Specify
2. Select `category-lacteal` token
3. Edit properties:
   - **Light theme value**: `#6750A4` (M3 Primary 40)
   - **Dark theme value**: `#D0BCFF` (M3 Primary 80)
   - **M3 Role** (in metadata): `primary`
   - **M3 Tone** (in metadata): 40 (light), 80 (dark)
   - **Description**: "Primary purple for lacteal products category"
4. **Save token**
5. **Run contrast validation**: Specify should show WCAG AA compliance status
   - Light: `#6750A4` on `#FFFBFE` (light surface) → must show ✅ pass (4.5:1+)
   - Dark: `#D0BCFF` on `#1C1B1F` (dark surface) → must show ✅ pass (4.5:1+)

**If contrast fails**: Adjust tone up/down until validation passes. Do not ship tokens that fail WCAG AA.

### Creating Typography Tokens

**Example: Define heading-1**

1. Navigate to **Typography** collection
2. Create or edit `heading-1` token
3. Set composite properties:
   - **Font size**: `57px` (M3 Display Large)
   - **Line height**: `64px`
   - **Letter spacing**: `-0.25px`
   - **Font weight**: `400`
   - **Font family**: `Roboto, sans-serif`
4. **Description**: "Largest heading for page titles (M3 Display Large)"
5. **Save token**

### Creating Spacing Tokens

**Example: Define space-3**

1. Navigate to **Spacing** collection
2. Create or edit `space-3` token
3. Set properties:
   - **Value**: `1.5rem` (24px assuming 16px root)
   - **Pixel equivalent** (metadata): `24`
   - **Grid factor** (metadata): `3` (24px ÷ 8px)
   - **Description**: "24px spacing - 3× base grid unit"
4. **Validation**: Confirm pixel value is multiple of 8 (except space-0)
5. **Save token**

### Exporting Tokens

**When to export**: After any token change, before developers need updates

1. In Specify, select **Export** → **Rations Calculator - JSON**
2. Choose export destination: Download `tokens.json` file
3. **Verify JSON structure** (should match schema in `contracts/tokens-schema.json`)
4. **Share with development team**: 
   - Slack notification: "Design tokens updated - exported tokens.json"
   - Attach `tokens.json` file or commit to design repo

**Export frequency**: After batch changes, not individual edits (to avoid noise)

**Automated sync** (future): Specify webhook → auto-commit to Git → trigger rebuild

---

## For Developers: Using Tokens in Code

### Setup: Install Dependencies

```bash
# Install design token dependencies
pnpm add -D style-dictionary colorjs.io next-themes

# Install Tailwind CSS (if not already installed)
pnpm add -D tailwindcss postcss autoprefixer
```

### Import Tokens

**Step 1**: Place `tokens.json` from designers in project

```bash
# Expected location
src/infrastructure/design-tokens/tokens.json
```

**Step 2**: Run Style Dictionary transformation

```bash
# Transform tokens → Tailwind config
pnpm run tokens:build

# This generates:
# - src/infrastructure/design-tokens/tailwind-tokens.js
# - src/infrastructure/design-tokens/css-variables.css
```

**Step 3**: Import in `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';
import { tokens } from './src/infrastructure/design-tokens/tailwind-tokens';

const config: Config = {
  darkMode: 'class', // Enable dark mode via .dark class
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: tokens.colors,       // Category, state, feedback colors
      spacing: tokens.spacing,     // 8px grid scale
      fontSize: tokens.fontSize,   // Typography scale (includes lineHeight, letterSpacing)
    },
  },
  plugins: [],
};

export default config;
```

### Using Color Tokens

**Category colors** (aliment categories):

```tsx
// Component example
export function AlimentCard({ category }: { category: string }) {
  return (
    <div className="bg-category-lacteal text-white p-space-4">
      {/* Background: lacteal category color */}
      {/* Text: automatic contrast color (white on dark bg) */}
      {/* Padding: 32px (space-4) */}
      Lacteal Products
    </div>
  );
}
```

**Available category color classes**:
- `bg-category-lacteal`, `text-category-lacteal`, `border-category-lacteal`
- `bg-category-cereals-flours-pulses-legumes-tubers`, etc.
- `bg-category-fruits`, `bg-category-vegetables`
- `bg-category-oily-dry-fruits`, `bg-category-drinks`
- `bg-category-others`

**State colors** (offline/online indicators):

```tsx
// Offline indicator component
export function OfflineIndicator({ isOnline }: { isOnline: boolean }) {
  return (
    <div className={`
      px-space-2 py-space-1
      ${isOnline ? 'bg-state-online' : 'bg-state-offline'}
      text-white rounded
    `}>
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );
}
```

**Available state color classes**:
- `bg-state-offline`, `text-state-offline` (warning amber)
- `bg-state-syncing`, `text-state-syncing` (info blue)
- `bg-state-sync-error`, `text-state-sync-error` (error red)
- `bg-state-online`, `text-state-online` (success green)

**Feedback colors** (action confirmations):

```tsx
// Toast notification component
export function Toast({ type, message }: { type: 'success' | 'error' | 'warning' | 'info', message: string }) {
  return (
    <div className={`
      p-space-3
      bg-feedback-${type}
      text-white
      rounded-md
    `}>
      {message}
    </div>
  );
}
```

### Using Typography Tokens

**Headings**:

```tsx
export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-heading-1">
      {/* Font: 57px, line-height: 64px, letter-spacing: -0.25px, weight: 400 */}
      {children}
    </h1>
  );
}
```

**Body text**:

```tsx
export function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-body-medium">
      {/* Font: 14px, line-height: 20px, letter-spacing: 0.25px, weight: 400 */}
      {children}
    </p>
  );
}
```

**Available typography classes**:
- `text-heading-1` through `text-heading-6`
- `text-body-large`, `text-body-medium`, `text-body-small`
- `text-label-large`, `text-label-medium`, `text-label-small`

### Using Spacing Tokens

**Padding/Margin**:

```tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-space-4 m-space-2">
      {/* Padding: 32px (space-4) */}
      {/* Margin: 16px (space-2) */}
      {children}
    </div>
  );
}
```

**Touch targets** (44px minimum):

```tsx
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-space-4 py-space-3">
      {/* Horizontal padding: 32px */}
      {/* Vertical padding: 24px */}
      {/* Total height: text + 24px + 24px = 48px minimum (✅ exceeds 44px) */}
      {children}
    </button>
  );
}
```

**Available spacing classes**:
- `p-space-{0|1|2|3|4|5|6|8|10|12}` (padding)
- `m-space-{0|1|2|3|4|5|6|8|10|12}` (margin)
- `gap-space-{0|1|2|3|4|5|6|8|10|12}` (flexbox/grid gap)

### Theme Switching (Light/Dark Mode)

**Setup next-themes**:

```tsx
// app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
```

**Use theme toggle**:

```tsx
'use client';

import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  );
}
```

**How it works**:
- `next-themes` adds/removes `.dark` class on `<html>` element
- CSS custom properties automatically switch values:
  ```css
  :root {
    --color-category-lacteal: #6750A4; /* Light */
  }
  .dark {
    --color-category-lacteal: #D0BCFF; /* Dark */
  }
  ```
- Tailwind classes reference custom properties → automatic theme switching

---

## Validation & Testing

### Build-Time Validation

**Automatic checks during `pnpm run tokens:build`**:

1. **Schema validation**: `tokens.json` must match `contracts/tokens-schema.json`
   - Error if tokens missing or malformed
2. **Contrast validation**: All color tokens tested against WCAG AA
   - Error if any token fails 4.5:1 ratio for normal text
3. **Grid alignment**: All spacing tokens verified as multiples of 8px
   - Error if spacing breaks grid discipline (except space-0)

**Build fails if any validation fails** → designers must fix tokens before merge

### Visual Regression Testing

**Playwright E2E tests** (run in CI/CD):

```typescript
// tests/e2e/design-tokens.spec.ts
test('category colors display distinct hues', async ({ page }) => {
  await page.goto('/token-specimen');
  
  // Take screenshot of all category colors
  await expect(page.locator('.category-colors')).toHaveScreenshot('category-colors.png');
});

test('dark mode switches theme correctly', async ({ page }) => {
  await page.goto('/');
  
  // Toggle dark mode
  await page.click('[data-testid="theme-toggle"]');
  
  // Verify dark theme colors applied
  const bgColor = await page.locator('body').evaluate(el => 
    window.getComputedStyle(el).backgroundColor
  );
  
  expect(bgColor).toBe('rgb(28, 27, 31)'); // M3 dark surface
});
```

### Manual QA Checklist

Before releasing token changes:

- [ ] All 7 category colors visually distinct in both light and dark modes
- [ ] State indicators (offline/online) clearly communicate status
- [ ] Typography scales maintain readability at mobile and desktop sizes
- [ ] Touch targets meet 44px × 44px minimum on mobile devices
- [ ] Theme switching has no flicker or layout shift (FOUC)
- [ ] Color vision deficiency simulation shows adequate distinction (protanopia, deuteranopia, tritanopia)

---

## Troubleshooting

### "Token not found" error in Tailwind

**Symptom**: Class like `bg-category-lacteal` not applying styles

**Fix**:
1. Verify `tokens.json` contains the token
2. Run `pnpm run tokens:build` to regenerate Tailwind config
3. Restart dev server (`pnpm run dev`)
4. Check browser DevTools → Elements → Computed Styles for CSS custom property value

### Contrast ratio failing in build

**Symptom**: Build error: `Color token 'category-fruits' fails WCAG AA (ratio: 3.2:1, required: 4.5:1)`

**Fix**:
1. Notify designer of failing token
2. Designer adjusts M3 tone: darker for light theme, lighter for dark theme
3. Re-export `tokens.json`
4. Re-run build

### Spacing not aligning to 8px grid

**Symptom**: Build error: `Spacing token 'space-7' value 28px is not a multiple of 8`

**Fix**:
1. Remove invalid spacing token (7 × 4px = 28px breaks grid)
2. Use existing token: `space-4` (32px) or `space-3` (24px)
3. If 28px truly needed, add to exception list with justification (rare)

### Theme switching causes flicker

**Symptom**: White flash when toggling dark mode

**Fix**:
1. Ensure `next-themes` script runs before page renders:
   ```tsx
   // app/layout.tsx
   <html suppressHydrationWarning>
   ```
2. Add `suppressHydrationWarning` to avoid React mismatch warnings
3. Verify CSS custom properties defined in `:root` before component styles load

---

## Best Practices

### For Designers

- ✅ Always validate contrast before exporting tokens (use Specify's built-in checker)
- ✅ Keep M3 tone consistency: light themes use 40-50, dark themes use 80-90
- ✅ Document token purpose in description field (helps developers understand usage)
- ✅ Export in batches, not individual changes (reduces developer interruption)
- ❌ Never create custom spacing outside 8px grid without approval
- ❌ Never ship tokens that fail WCAG AA contrast

### For Developers

- ✅ Use semantic token classes (`bg-category-lacteal`) not hardcoded values (`bg-[#6750A4]`)
- ✅ Combine spacing tokens for touch targets: `py-space-3` + 2px border = 44px+ height
- ✅ Test theme switching in every new component
- ✅ Run visual regression tests before merging token updates
- ❌ Never hardcode colors, spacing, or font sizes in components
- ❌ Never override token values with inline styles or custom CSS

### Cross-Discipline Collaboration

**Designer makes token change** → **Developer workflow**:

1. Designer posts in `#design-tokens` Slack channel: "Updated category colors, see attached tokens.json"
2. Developer downloads `tokens.json`, places in `src/infrastructure/design-tokens/`
3. Developer runs `pnpm run tokens:build`
4. Developer commits: `git add . && git commit -m "chore: update design tokens (category colors)"`
5. Developer tests locally, runs E2E tests, creates PR
6. Designer reviews PR screenshots in CI/CD
7. Merge to main → tokens deployed

**Typical turnaround**: < 5 minutes from export to dev environment (SC-003 success criterion)

---

## Next Steps

After setting up design tokens:

1. **Create token specimen page** (`/design-tokens`) showing all tokens for QA
2. **Implement first feature** (Home page menu list) using tokens
3. **Run accessibility audit** (axe-core, Lighthouse) to verify WCAG compliance
4. **Document custom token additions** (if new categories/states needed)

**Questions?** See [data-model.md](./data-model.md) for entity definitions, [contracts/](./contracts/) for schemas.
