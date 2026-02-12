# Research: Design Token System

**Feature**: Design Token System for Rations Calculator  
**Date**: 2026-02-11  
**Purpose**: Resolve technical unknowns and establish implementation patterns for design tokens

## Research Areas

### 1. Specify Token Export Format

**Decision**: Use Specify's native JSON export format with Style Dictionary transformation

**Rationale**:
- Specify exports design tokens in a structured JSON format following the W3C Design Tokens Community Group specification
- Format includes metadata: token name, value, type (color/dimension/typography), and optional descriptions
- Standard export structure: `{ "tokenName": { "value": "<value>", "type": "<type>", "description": "<optional>" } }`
- Example: `{ "color-category-lacteal": { "value": "#6750A4", "type": "color", "description": "Primary color for lacteal category" } }`

**Alternatives Considered**:
- **Custom JSON format**: Would require maintaining custom Specify export configuration. Rejected because standard format is well-documented and supported by transformation tools.
- **CSS Custom Properties directly**: Would bypass structured token system. Rejected because we need typed tokens with validation and cannot ensure M3 compliance without schema.
- **SASS/LESS variables**: Would require additional build tooling and doesn't support runtime theme switching. Rejected for PWA offline-first requirements.

### 2. Material Design 3 Color System Mapping

**Decision**: Map aliment categories to M3 extended color roles using semantic naming

**Rationale**:
- M3 provides **5 core tonal palettes**: Primary, Secondary, Tertiary, Error, Neutral
- Each palette has 13 tones (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100)
- For 7 aliment categories, use extended color scheme:
  - **Primary** (Purple #6750A4): Lacteal products
  - **Secondary** (Teal #625B71): Cereals/flours/pulses/legumes/tubers
  - **Tertiary** (Orange #7D5260): Fruits
  - **Custom Extended 1** (Green): Vegetables
  - **Custom Extended 2** (Brown): Oily/dry fruits (nuts)
  - **Custom Extended 3** (Blue): Drinks
  - **Neutral variant** (Gray): Others/miscellaneous
- Each category color must have corresponding `on-<color>` variants for text contrast
- Light/dark theme handled via M3 tone selection: light theme uses tones 40-50, dark theme uses tones 80-90

**Alternatives Considered**:
- **Pure M3 without extensions**: Only 3 color roles insufficient for 7 categories. Rejected.
- **Completely custom color palette**: Would violate M3 guidelines and require manual accessibility testing. Rejected per constitution mandate.
- **HSL procedural generation**: Would create colors but lose semantic M3 role benefits (elevation, state layers). Rejected.

### 3. Tailwind CSS Custom Configuration Patterns

**Decision**: Use Style Dictionary to transform Specify JSON into Tailwind `theme.extend` configuration

**Rationale**:
- **Style Dictionary** is industry-standard tool for design token transformation (by Amazon)
- Supports input format: Specify JSON → Output format: JavaScript/TypeScript config objects
- Transformation pipeline: `tokens.json` → Style Dictionary → `tailwind.tokens.js` → imported by `tailwind.config.ts`
- Custom Tailwind config pattern:
  ```typescript
  // tailwind.config.ts
  import { tokens } from './tailwind.tokens';
  
  export default {
    theme: {
      extend: {
        colors: tokens.colors,       // Category, state, feedback colors
        spacing: tokens.spacing,     // 8px grid scale
        fontSize: tokens.fontSize,   // Typography scale
        lineHeight: tokens.lineHeight,
        letterSpacing: tokens.letterSpacing,
      }
    }
  }
  ```
- Utility classes auto-generated: `bg-category-lacteal`, `text-state-offline`, `p-space-3`

**Alternatives Considered**:
- **Manual copy-paste from Specify**: Error-prone, no validation, violates single source of truth. Rejected.
- **CSS Custom Properties only**: Doesn't integrate with Tailwind's utility class system. Rejected for developer ergonomics (90% use case requirement).
- **Tailwind plugin approach**: More complex than `theme.extend`, unnecessary for token mapping. Rejected for simplicity.

### 4. WCAG AA Contrast Ratio Validation

**Decision**: Use `colorjs.io` library for programmatic contrast ratio calculations with automated testing

**Rationale**:
- **Color.js** (colorjs.io) is W3C-standard JavaScript library for color manipulation and contrast calculation
- Implements WCAG 2.1 contrast ratio algorithm: `(L1 + 0.05) / (L2 + 0.05)` where L is relative luminance
- WCAG AA requirements:
  - **Normal text** (< 18pt or < 14pt bold): minimum 4.5:1 contrast
  - **Large text** (≥ 18pt or ≥ 14pt bold): minimum 3:1 contrast
  - **UI components**: minimum 3:1 contrast
- Integration pattern:
  ```typescript
  import Color from 'colorjs.io';
  
  function validateContrast(foreground: string, background: string): boolean {
    const fg = new Color(foreground);
    const bg = new Color(background);
    const ratio = Math.abs(fg.contrast(bg, 'WCAG21'));
    return ratio >= 4.5; // For normal text
  }
  ```
- Automated tests run during token transformation build step, failing build if any violations

**Alternatives Considered**:
- **Manual testing with browser DevTools**: Not automated, doesn't scale. Rejected.
- **Figma/Specify built-in contrast checkers**: Only validates at design time, not in CI/CD. Rejected for lack of automated enforcement.
- **Polypane or axe-core**: Requires full page render, overkill for token-level validation. Rejected for build-time checks (E2E tests will still use axe-core).

### 5. 8px Grid System Implementation

**Decision**: Define spacing scale as multiples of 8px (0.5rem base) with Tailwind custom spacing

**Rationale**:
- **Base unit**: 8px (0.5rem assuming 16px root font size)
- **Spacing scale**:
  - `space-0`: 0px (0rem)
  - `space-1`: 8px (0.5rem)
  - `space-2`: 16px (1rem)
  - `space-3`: 24px (1.5rem)
  - `space-4`: 32px (2rem)
  - `space-5`: 40px (2.5rem) - minimum for 44px touch target with 2px border
  - `space-6`: 48px (3rem)
  - `space-8`: 64px (4rem)
  - `space-10`: 80px (5rem)
  - `space-12`: 96px (6rem)
- **Touch target enforcement**: Use `space-5` (40px) + 4px padding = 44px minimum
- **Half-steps for micro-adjustments**: If needed, add `space-0.5` (4px) for icon padding, but discouraged to maintain grid discipline
- Tailwind config maps to utility classes: `p-space-3`, `m-space-2`, `gap-space-4`

**Alternatives Considered**:
- **4px grid**: More granular but leads to inconsistent spacing decisions and visual noise. Rejected for simplicity.
- **Tailwind default spacing scale**: Uses arbitrary px values (1=4px, 2=8px, etc.) which don't align with 8px grid semantically. Rejected for clarity (our `space-1` = 8px is more explicit).
- **CSS Grid `gap` only**: Doesn't handle padding/margin. Rejected for incomplete solution.

### 6. Design Token Documentation Strategy

**Decision**: Auto-generate token documentation from Specify descriptions using Style Dictionary formatters

**Rationale**:
- Style Dictionary supports custom formatters to generate Markdown documentation
- Pattern: Each token in Specify includes `description` field → transformed into doc table
- Documentation structure:
  ```markdown
  ## Category Colors
  | Token Name | Value (Light) | Value (Dark) | M3 Role | Usage |
  |------------|---------------|--------------|---------|-------|
  | category-lacteal | #6750A4 | #D0BCFF | Primary | Lacteal products background |
  ```
- Benefits:
  - Single source of truth (Specify descriptions)
  - Always in sync with actual token values
  - No manual doc maintenance
- Output: `design-tokens.md` in project docs folder, auto-updated on token export

**Alternatives Considered**:
- **Manual documentation**: Gets out of sync immediately. Rejected.
- **Storybook**: Overkill for design tokens alone (useful for components later). Rejected for scope.
- **Inline comments in tailwind.config.ts**: Not discoverable for designers. Rejected for cross-discipline collaboration.

### 7. Theme Switching Implementation

**Decision**: Use Next.js `next-themes` library with CSS custom properties for runtime theme switching

**Rationale**:
- **next-themes** provides:
  - `useTheme()` hook for theme state management
  - Automatic theme persistence to localStorage
  - No flash of unstyled content (FOUC) on page load
  - System preference detection (`prefers-color-scheme`)
- Integration with Tailwind dark mode strategy:
  ```typescript
  // tailwind.config.ts
  module.exports = {
    darkMode: 'class', // Uses .dark class on <html>
    // ... token configuration
  }
  ```
- Tokens exported as CSS custom properties with dark mode overrides:
  ```css
  :root {
    --color-category-lacteal: #6750A4; /* Light mode */
  }
  .dark {
    --color-category-lacteal: #D0BCFF; /* Dark mode */
  }
  ```
- Tailwind classes reference custom properties: `bg-category-lacteal` → `background: var(--color-category-lacteal)`

**Alternatives Considered**:
- **Duplicate Tailwind classes** (`bg-category-lacteal-light`, `bg-category-lacteal-dark`): Requires manual class switching in components. Rejected for developer ergonomics.
- **CSS media query only** (`@media (prefers-color-scheme: dark)`): No manual toggle, poor UX. Rejected.
- **Context API manual implementation**: Reinventing the wheel, error-prone. Rejected.

## Summary: Technical Decisions Ready for Phase 1

All research complete with zero NEEDS CLARIFICATION markers. Key technical stack:

- **Design token platform**: Specify
- **Export format**: Specify JSON (W3C Design Tokens spec)
- **Transformation tool**: Style Dictionary
- **Color system**: Material Design 3 extended tonal palettes
- **Contrast validation**: colorjs.io with WCAG AA enforcement
- **Spacing system**: 8px grid (rem-based for accessibility)
- **Tailwind integration**: `theme.extend` with custom config
- **Theme switching**: next-themes library with CSS custom properties
- **Documentation**: Auto-generated from Style Dictionary formatters

**Ready for Phase 1**: Data model design, contracts generation, and quickstart documentation.
