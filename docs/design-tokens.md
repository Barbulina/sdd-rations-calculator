# Design Token System Documentation

**Version**: 1.0.0  
**Last Updated**: 2026-02-11  
**Status**: Production Ready

## Overview

This design token system provides a single source of truth for all visual design decisions in the Rations Calculator PWA. All tokens follow Material Design 3 guidelines and maintain WCAG AA accessibility compliance.

## Token Categories

### 1. Category Colors (7 tokens)

Semantic colors for aliment categories, providing visual distinction and quick identification.

| Token Name | Light Value | M3 Role | M3 Tone | Usage |
|------------|-------------|---------|---------|-------|
| `category-lacteal` | #6750A4 | Primary | 40 | Lacteal products (milk, cheese, yogurt) |
| `category-cereals-flours-pulses-legumes-tubers` | #625B71 | Secondary | 40 | Grains, flours, pulses, legumes, tubers |
| `category-fruits` | #7D5260 | Tertiary | 40 | All fruits |
| `category-vegetables` | #386A20 | Custom Extended 1 | 40 | All vegetables |
| `category-oily-dry-fruits` | #6C5D3D | Custom Extended 2 | 40 | Nuts and oily fruits |
| `category-drinks` | #0061A4 | Custom Extended 3 | 40 | Beverages |
| `category-others` | #49454F | Surface Variant | 30 | Miscellaneous items |

**Tailwind Classes**: 
- `bg-category-lacteal`, `text-category-lacteal`, `border-category-lacteal`
- (Same pattern for all other categories)

**WCAG AA Compliance**: All category colors achieve 4.7:1 to 9.1:1 contrast ratios on light backgrounds.

---

### 2. State Indicators (4 tokens)

Colors for offline/online status and synchronization state.

| Token Name | Light Value | M3 Role | M3 Tone | Contrast Ratio | Usage |
|------------|-------------|---------|---------|----------------|-------|
| `state-offline` | #BF360C | Error | 40 | 5.5:1 (AA) | Device offline |
| `state-syncing` | #01579B | Primary | 40 | 7.2:1 (AAA) | Sync in progress |
| `state-sync-error` | #D32F2F | Error | 40 | 4.9:1 (AA) | Sync failed |
| `state-online` | #1B5E20 | Success | 40 | 7.7:1 (AAA) | Device online, synced |

**Tailwind Classes**: 
- `bg-state-offline`, `text-state-offline`, `border-state-offline`
- (Same pattern for all states)

**Use Case**: Display connectivity status in header, sync status badges, offline mode indicators.

---

### 3. Feedback States (4 tokens)

Semantic colors for user action feedback (success, warning, error, info).

| Token Name | Light Value | M3 Role | M3 Tone | Contrast Ratio | Usage |
|------------|-------------|---------|---------|----------------|-------|
| `feedback-success` | #2E7D32 | Success | 40 | 5.0:1 (AA) | Successful operations |
| `feedback-warning` | #BF360C | Warning | 40 | 5.5:1 (AA) | Warnings and cautions |
| `feedback-error` | #C62828 | Error | 40 | 5.5:1 (AA) | Errors and failures |
| `feedback-info` | #1565C0 | Info | 40 | 4.7:1 (AA) | Informational messages |

**Tailwind Classes**: 
- `bg-feedback-success`, `text-feedback-success`, `border-feedback-success`
- (Same pattern for all feedback states)

**Use Case**: Toast notifications, form validation, alert banners, confirmation messages.

---

### 4. Typography Scale (12 tokens)

Mobile-first typography system based on Material Design 3 type scale.

| Token Name | Font Size | Line Height | Letter Spacing | Font Weight | Usage |
|------------|-----------|-------------|----------------|-------------|-------|
| `heading-1` | 57px | 64px | -0.25px | 400 | Display Large - Page titles |
| `heading-2` | 45px | 52px | 0px | 400 | Display Medium - Section headers |
| `heading-3` | 36px | 44px | 0px | 400 | Display Small - Subsection headers |
| `heading-4` | 32px | 40px | 0px | 400 | Headline Large - Card titles |
| `heading-5` | 28px | 36px | 0px | 400 | Headline Medium - List headers |
| `heading-6` | 24px | 32px | 0px | 400 | Headline Small - Minor headings |
| `body-large` | 16px | 24px | 0.5px | 400 | Body Large - Emphasized text |
| `body-medium` | 14px | 20px | 0.25px | 400 | Body Medium - Default body text |
| `body-small` | 12px | 16px | 0.4px | 400 | Body Small - Captions, footnotes |
| `label-large` | 14px | 20px | 0.1px | 500 | Label Large - Primary buttons |
| `label-medium` | 12px | 16px | 0.5px | 500 | Label Medium - Secondary buttons |
| `label-small` | 11px | 16px | 0.5px | 500 | Label Small - Tertiary buttons |

**Font Family**: Roboto (weights: 300, 400, 500, 700)

**Accessibility Notes**:
- Minimum body text: 14px (body-medium)
- Mobile-first: All sizes optimized for small screens
- Line heights ensure readability (1.4-1.6 ratio)

**Note**: Typography tokens do not generate Tailwind utility classes automatically. Use Style Dictionary CSS custom properties or manually configure in `tailwind.config.ts`.

---

### 5. Spacing Scale (10 tokens)

8px grid system for consistent spacing and layout alignment.

| Token Name | Pixel Value | Rem Value | Grid Factor | Touch Target | Usage |
|------------|-------------|-----------|-------------|--------------|-------|
| `space-0` | 0px | 0rem | 0 | - | No spacing |
| `space-1` | 8px | 0.5rem | 1 | ❌ | Tiny gaps |
| `space-2` | 16px | 1rem | 2 | ❌ | Small spacing |
| `space-3` | 24px | 1.5rem | 3 | ❌ | Medium spacing |
| `space-4` | 32px | 2rem | 4 | ❌ | Large spacing |
| `space-5` | 40px | 2.5rem | 5 | ✅ 44px with padding | Minimum touch target |
| `space-6` | 48px | 3rem | 6 | ✅ | Comfortable touch |
| `space-8` | 64px | 4rem | 8 | ✅ | Extra large spacing |
| `space-10` | 80px | 5rem | 10 | ✅ | Section gaps |
| `space-12` | 96px | 6rem | 12 | ✅ | Major layout divisions |

**Tailwind Classes**: 
- Padding: `p-space-3`, `px-space-4`, `py-space-2`
- Margin: `m-space-5`, `mx-space-6`, `my-space-1`
- Gap: `gap-space-4`, `gap-x-space-3`, `gap-y-space-2`

**Touch Target Compliance**: Use `space-5` (40px) or larger for interactive elements to meet 44px × 44px minimum.

---

## Token Count Summary

- **Category Colors**: 7 tokens (light theme only)
- **State Colors**: 4 tokens (light theme only)
- **Feedback Colors**: 4 tokens (light theme only)
- **Typography**: 12 tokens (theme-independent)
- **Spacing**: 10 tokens (theme-independent)

**Total**: 37 tokens (light theme) + 22 theme-independent = **59 token values**

**Note**: Dark theme variants for colors are not yet implemented. Current implementation uses only light theme tokens.

---

## Usage Guidelines

### Importing Tokens in Code

**Tailwind Utility Classes** (Recommended):
```tsx
// Category colors
<div className="bg-category-lacteal text-white">Lacteal Products</div>

// State indicators
<span className="text-state-offline">Offline</span>

// Feedback states
<div className="border-2 border-feedback-error">Error Message</div>

// Spacing
<button className="px-space-4 py-space-3">Click Me</button>
```

**CSS Custom Properties**:
```css
/* Available in :root for light theme */
.custom-element {
  background-color: var(--category-lacteal);
  padding: var(--space-4);
  font-size: var(--body-medium-font-size);
}
```

**JavaScript/TypeScript**:
```typescript
import tokens from '@/infrastructure/design-tokens/tailwind-tokens.js';

// Access token values programmatically
const lactealColor = tokens['category-lacteal']; // "#6750A4"
const mediumSpacing = tokens['space-3']; // "1.5rem"
```

---

## Building Tokens

### Command

```bash
npm run tokens:build
```

### What Happens

1. **Schema Validation**: Validates `tokens.json` against JSON schema
2. **Contrast Validation**: Checks all color tokens meet WCAG AA (4.5:1 for normal text)
3. **Style Dictionary Transformation**: Generates:
   - `tailwind-tokens.js` - JavaScript module for Tailwind config
   - `css-variables.css` - CSS custom properties for theme switching

### Validation Output

```
🎨 Building design tokens...
✅ tokens.json loaded
✅ Schema validation passed
✅ All 15 color tokens pass WCAG AA contrast requirements
✅ Style Dictionary transformation complete
```

**Build fails if**:
- Any required token is missing
- Color tokens fail WCAG AA contrast (< 4.5:1)
- Spacing tokens violate 8px grid (except space-0)

---

## Accessibility Compliance

### WCAG AA Contrast Requirements

- **Normal text** (< 18pt): 4.5:1 minimum
- **Large text** (≥ 18pt or 14pt bold): 3.0:1 minimum

### Current Compliance Status

✅ **All color tokens pass WCAG AA**:
- **Category colors**: 4.7:1 to 9.1:1
- **State colors**: 4.9:1 to 7.7:1 (3 achieve AAA at 7.0:1+)
- **Feedback colors**: 4.7:1 to 5.5:1

### Touch Target Compliance

✅ **Minimum 44px × 44px** for interactive elements (WCAG 2.1 Level AAA)
- Use `space-5` (40px) + 2px padding = 44px
- Or `space-6` (48px) for comfortable touch

---

## Theme Switching

### Implementation

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

// Add to layout
<ThemeToggle />
```

### How It Works

1. **next-themes** manages theme state (light/dark/system)
2. CSS custom properties switch via `.dark` class
3. Theme preference persists to localStorage
4. System preference detection automatic

**Current Status**: Theme toggle functional, but dark theme color variants not yet defined in tokens.json.

---

## Extending the Token System

### Adding New Tokens

1. **Edit** `src/infrastructure/design-tokens/tokens.json`
2. **Run** `npm run tokens:build` to validate and transform
3. **Verify** generated files updated:
   - `tailwind-tokens.js`
   - `css-variables.css`
4. **Use** new Tailwind classes or CSS variables

### Adding Dark Theme Variants

```json
{
  "category-lacteal-dark": {
    "value": "#D0BCFF",
    "type": "color",
    "theme": "dark",
    "description": "Primary purple for lacteal products (M3 Primary 80)",
    "$extensions": {
      "m3Role": "primary",
      "m3Tone": 80
    }
  }
}
```

**Pattern**: Light theme uses M3 tone 40, dark theme uses M3 tone 80.

---

## Troubleshooting

### Build Fails: Contrast Validation

**Error**: `❌ Token 'category-example' fails WCAG AA (3.2:1 < 4.5:1)`

**Fix**: Choose a darker M3 tone (30, 20, or 10 for light theme) to increase contrast.

### Build Fails: Schema Validation

**Error**: `❌ Token 'space-7' violates 8px grid (gridFactor must be integer)`

**Fix**: Ensure spacing values are multiples of 8px (except `space-0`).

### Tailwind Classes Not Working

**Issue**: `bg-category-lacteal` has no effect

**Check**:
1. Run `npm run tokens:build` to regenerate
2. Verify `tailwind.config.ts` imports `tailwind-tokens.js`
3. Restart dev server to reload Tailwind config

---

## References

- **Material Design 3**: https://m3.material.io/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Style Dictionary**: https://amzn.github.io/style-dictionary/
- **next-themes**: https://github.com/pacocoursey/next-themes
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Questions?** Refer to [quickstart.md](../specs/001-design-token-system/quickstart.md) for designer and developer workflows.
