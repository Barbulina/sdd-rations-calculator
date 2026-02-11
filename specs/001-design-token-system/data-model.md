# Data Model: Design Token System

**Feature**: Design Token System for Rations Calculator  
**Date**: 2026-02-11  
**Purpose**: Define entities, validation rules, and relationships for design tokens

## Core Entities

### DesignToken (Base)

**Purpose**: Abstract base representing any design decision encoded as a reusable value

**Properties**:
- `name` (string, required): Semantic identifier in kebab-case (e.g., `"category-lacteal"`, `"space-3"`)
- `value` (string, required): Actual CSS-compatible value (e.g., `"#6750A4"`, `"24px"`, `"1.5rem"`)
- `type` (enum, required): Token classification - `"color"`, `"dimension"`, `"typography"`, `"fontFamily"`, `"fontWeight"`, `"lineHeight"`, `"letterSpacing"`
- `category` (enum, required): High-level grouping - `"category-color"`, `"state-color"`, `"feedback-color"`, `"spacing"`, `"type-scale"`
- `theme` (enum, optional): Theme variant - `"light"`, `"dark"`, or `null` for theme-independent tokens
- `description` (string, optional): Human-readable explanation of token purpose and usage context

**Validation Rules**:
- `name` must match pattern: `^[a-z]+(-[a-z0-9]+)*$` (lowercase kebab-case)
- `value` must be non-empty string
- `type` must be one of supported W3C Design Token types
- If `theme` is provided, must be `"light"` or `"dark"`

**Relationships**:
- **Extended by**: ColorToken, TypographyToken, SpacingToken (specializations with additional properties)
- **Grouped in**: TokenCollection (aggregates related tokens)

---

### ColorToken (extends DesignToken)

**Purpose**: Represents color values with Material Design 3 mapping and accessibility validation

**Additional Properties** (beyond DesignToken):
- `hexValue` (string, required): Hex color code including # (e.g., `"#6750A4"`)
- `rgbValue` (object, required): RGB representation
  - `r` (number, 0-255): Red channel
  - `g` (number, 0-255): Green channel
  - `b` (number, 0-255): Blue channel
- `hslValue` (object, required): HSL representation for color manipulation
  - `h` (number, 0-360): Hue in degrees
  - `s` (number, 0-100): Saturation percentage
  - `l` (number, 0-100): Lightness percentage
- `m3Role` (enum, required): Material Design 3 color role mapping
  - Values: `"primary"`, `"secondary"`, `"tertiary"`, `"error"`, `"surface"`, `"surface-variant"`, `"outline"`, `"custom-extended-1"`, `"custom-extended-2"`, `"custom-extended-3"`
- `m3Tone` (number, required): M3 tonal value (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100)
- `contrastValidation` (object, computed): WCAG contrast ratio test results
  - `onLight` (number): Contrast ratio against light surface (#FFFBFE)
  - `onDark` (number): Contrast ratio against dark surface (#1C1B1F)
  - `passesAA` (boolean): Whether token meets WCAG AA (4.5:1 normal text)
  - `passesAALarge` (boolean): Whether token meets WCAG AA large text (3:1)

**Inherited from DesignToken**:
- `type` is always `"color"`
- `category` is one of: `"category-color"`, `"state-color"`, `"feedback-color"`

**Validation Rules** (in addition to base):
- `hexValue` must match pattern: `^#[0-9A-Fa-f]{6}$` (6-digit hex)
- `rgbValue.r`, `rgbValue.g`, `rgbValue.b` must be integers 0-255
- `hslValue.h` must be 0-360, `hslValue.s` and `hslValue.l` must be 0-100
- `m3Tone` must be one of the 13 standard M3 tones
- `contrastValidation.passesAA` must be `true` for all tokens (constitutional requirement)

**Example**:
```json
{
  "name": "category-lacteal",
  "value": "#6750A4",
  "type": "color",
  "category": "category-color",
  "theme": "light",
  "description": "Primary purple for lacteal products category",
  "hexValue": "#6750A4",
  "rgbValue": { "r": 103, "g": 80, "b": 164 },
  "hslValue": { "h": 256, "s": 34, "l": 48 },
  "m3Role": "primary",
  "m3Tone": 40,
  "contrastValidation": {
    "onLight": 8.2,
    "onDark": 2.1,
    "passesAA": true,
    "passesAALarge": true
  }
}
```

---

### TypographyToken (extends DesignToken)

**Purpose**: Represents typography scale values following Material Design 3 type system

**Additional Properties**:
- `fontSize` (string, required): Font size with unit (e.g., `"24px"`, `"1.5rem"`)
- `lineHeight` (string, required): Line height (e.g., `"32px"`, `"1.33"`, `"2rem"`)
- `letterSpacing` (string, required): Letter spacing (e.g., `"0"`, `"0.15px"`, `"0.01em"`)
- `fontWeight` (number, required): Font weight (100-900, typically 400, 500, 700)
- `fontFamily` (string, required): Font family stack (e.g., `"'Roboto', sans-serif"`)
- `textTransform` (enum, optional): Text transformation - `"none"`, `"uppercase"`, `"lowercase"`, `"capitalize"`
- `m3TypeScale` (enum, required): M3 type scale classification
  - Values: `"display-large"`, `"display-medium"`, `"display-small"`, `"headline-large"`, `"headline-medium"`, `"headline-small"`, `"title-large"`, `"title-medium"`, `"title-small"`, `"body-large"`, `"body-medium"`, `"body-small"`, `"label-large"`, `"label-medium"`, `"label-small"`

**Inherited from DesignToken**:
- `type` is always `"typography"`
- `category` is always `"type-scale"`
- `theme` is `null` (typography doesn't change between light/dark themes)

**Validation Rules**:
- `fontSize` must match pattern: `^\d+(\.\d+)?(px|rem|em)$`
- `fontWeight` must be 100-900 (multiples of 100 preferred)
- `lineHeight` can be unitless number, px, rem, or em
- `letterSpacing` can be 0, px, rem, or em
- Font size for body text must be ≥ 14px (mobile) or 16px (desktop) per accessibility requirements

**Example**:
```json
{
  "name": "heading-1",
  "value": "composite", // Typography tokens are composite
  "type": "typography",
  "category": "type-scale",
  "theme": null,
  "description": "Largest heading for page titles",
  "fontSize": "57px",
  "lineHeight": "64px",
  "letterSpacing": "-0.25px",
  "fontWeight": 400,
  "fontFamily": "'Roboto', sans-serif",
  "textTransform": "none",
  "m3TypeScale": "display-large"
}
```

---

### SpacingToken (extends DesignToken)

**Purpose**: Represents spacing values adhering to 8px grid system

**Additional Properties**:
- `pixelValue` (number, required): Spacing in pixels (e.g., `24` for 24px)
- `remValue` (number, required): Spacing in rem units (e.g., `1.5` for 1.5rem assuming 16px root)
- `gridFactor` (number, required): Multiple of 8px base unit (e.g., `3` for 24px = 8px × 3)
- `isTouchTarget` (boolean, computed): Whether value meets 44px minimum touch target (>= 44px)

**Inherited from DesignToken**:
- `type` is always `"dimension"`
- `category` is always `"spacing"`
- `theme` is `null` (spacing doesn't change between themes)
- `value` contains the rem representation (e.g., `"1.5rem"`)

**Validation Rules**:
- `pixelValue` must be non-negative integer
- `pixelValue` must be multiple of 8 (divisible by 8 without remainder) - EXCEPT space-0 which is 0
- `remValue` must equal `pixelValue / 16` (assuming 16px root font size)
- `gridFactor` must equal `pixelValue / 8`
- For interactive elements, `pixelValue` should be >= 40 to allow 44px with padding (noted in description)

**Example**:
```json
{
  "name": "space-3",
  "value": "1.5rem",
  "type": "dimension",
  "category": "spacing",
  "theme": null,
  "description": "24px spacing - 3× base grid unit",
  "pixelValue": 24,
  "remValue": 1.5,
  "gridFactor": 3,
  "isTouchTarget": false
}
```

---

### TokenCollection

**Purpose**: Groups related tokens for organizational and semantic purposes

**Properties**:
- `id` (string, required): Unique identifier for collection (e.g., `"category-colors"`, `"spacing-scale"`)
- `name` (string, required): Human-readable collection name (e.g., `"Aliment Category Colors"`)
- `description` (string, required): Purpose and usage guidelines for the collection
- `tokens` (array of DesignToken, required): Array of token objects belonging to this collection
- `metadata` (object, optional): Additional collection-level information
  - `version` (string): Semantic version of token collection
  - `lastUpdated` (ISO 8601 date string): Last modification timestamp
  - `owner` (string): Designer/team responsible for collection

**Validation Rules**:
- `tokens` array must contain at least 1 token
- All tokens in `tokens` array must share the same `category`
- `id` must be unique across all collections

**Example**:
```json
{
  "id": "category-colors",
  "name": "Aliment Category Colors",
  "description": "Semantic colors for seven aliment categories, mapped to M3 color roles",
  "tokens": [
    { /* category-lacteal ColorToken */ },
    { /* category-cereals-flours-pulses-legumes-tubers ColorToken */ },
    { /* ... 5 more category ColorTokens */ }
  ],
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2026-02-11T00:00:00Z",
    "owner": "Design Team"
  }
}
```

## Token Categories & Naming Conventions

### Category Colors (7 tokens × 2 themes = 14 ColorTokens)

**Naming Pattern**: `category-<category-name>`

- `category-lacteal` - Lacteal products (dairy, milk)
- `category-cereals-flours-pulses-legumes-tubers` - Grains, beans, starches
- `category-fruits` - Fruits
- `category-vegetables` - Vegetables
- `category-oily-dry-fruits` - Nuts, seeds
- `category-drinks` - Beverages
- `category-others` - Miscellaneous

**M3 Role Mapping** (from research):
- Lacteal: `primary` (Purple)
- Cereals/etc: `secondary` (Teal)
- Fruits: `tertiary` (Orange)
- Vegetables: `custom-extended-1` (Green)
- Oily/dry fruits: `custom-extended-2` (Brown)
- Drinks: `custom-extended-3` (Blue)
- Others: `surface-variant` (Gray)

### State Colors (4 tokens × 2 themes = 8 ColorTokens)

**Naming Pattern**: `state-<state-name>`

- `state-offline` - No network connection (warning amber)
- `state-syncing` - Data synchronization in progress (info blue)
- `state-sync-error` - Synchronization failed (error red)
- `state-online` - Connected and synchronized (success green)

### Feedback Colors (4 tokens × 2 themes = 8 ColorTokens)

**Naming Pattern**: `feedback-<feedback-type>`

- `feedback-success` - Successful action confirmation
- `feedback-warning` - Warning condition
- `feedback-error` - Error state
- `feedback-info` - Informational message

### Typography Scale (10 TypographyTokens, theme-independent)

**Naming Pattern**: `heading-<level>`, `body-<size>`, `label-<size>`

- `heading-1` through `heading-6` - Six heading levels (H1-H6)
- `body-large`, `body-medium`, `body-small` - Body text variations
- `label-large`, `label-medium`, `label-small` - Label/caption text (forms, buttons)

### Spacing Scale (10 SpacingTokens, theme-independent)

**Naming Pattern**: `space-<grid-factor>`

- `space-0` = 0px (0rem)
- `space-1` = 8px (0.5rem) - 1× base unit
- `space-2` = 16px (1rem) - 2× base unit
- `space-3` = 24px (1.5rem) - 3× base unit
- `space-4` = 32px (2rem) - 4× base unit
- `space-5` = 40px (2.5rem) - 5× base unit (minimum for 44px touch target with border)
- `space-6` = 48px (3rem) - 6× base unit
- `space-8` = 64px (4rem) - 8× base unit
- `space-10` = 80px (5rem) - 10× base unit
- `space-12` = 96px (6rem) - 12× base unit

## State Transitions & Relationships

### Color Token Themes

Each ColorToken has two instances: one for light theme, one for dark theme. They share the same `name` but differ in:
- `theme` property value
- `hexValue` (different M3 tone)
- `m3Tone` (light uses 40-50, dark uses 80-90)

**Relationship**: Paired by name for theme switching. Example:
- Light: `{ name: "category-lacteal", theme: "light", hexValue: "#6750A4", m3Tone: 40 }`
- Dark: `{ name: "category-lacteal", theme: "dark", hexValue: "#D0BCFF", m3Tone: 80 }`

### Typography + Spacing Interaction

Typography tokens define text size; spacing tokens provide layout dimensions. **Touch target rule**:

For any interactive text element:
- Minimum height = `fontSize` + `space-3` (padding-top) + `space-3` (padding-bottom)
- Example: `body-large` (16px) + 24px padding = 40px height + 4px for border/focus ring = 44px ✅

## Validation Rules Summary

### Global Constraints

1. **Uniqueness**: No two tokens can have identical `name` + `theme` combination
2. **Contrast**: All ColorTokens must pass WCAG AA (`contrastValidation.passesAA === true`)
3. **Grid Alignment**: All SpacingTokens (except space-0) must be multiples of 8px
4. **M3 Compliance**: All ColorTokens must map to valid M3 roles and tones
5. **Touch Targets**: Interactive elements using spacing must meet 44px minimum (validated in integration tests, not token schema)
6. **Readability**: Typography body text `fontSize` >= 14px mobile, 16px desktop (validated at usage site, not token schema)

### Cross-Entity Validation

- **Token Collection Consistency**: All tokens in a collection must share the same `category`
- **Theme Pairing**: For every ColorToken with `theme: "light"`, there must be a corresponding `theme: "dark"` token with the same `name`
- **Type System Integrity**: `type` property must match entity subtype (ColorToken → `type: "color"`)

## Usage in Tailwind CSS

Tokens are transformed into Tailwind utility classes following these patterns:

| Token Category | Tailwind Class Pattern | Example |
|----------------|------------------------|---------|
| Category Colors | `bg-category-<name>`, `text-category-<name>` | `bg-category-lacteal`, `text-category-fruits` |
| State Colors | `bg-state-<name>`, `text-state-<name>` | `bg-state-offline`, `border-state-syncing` |
| Feedback Colors | `bg-feedback-<type>`, `text-feedback-<type>` | `bg-feedback-error`, `text-feedback-success` |
| Typography | `text-heading-<level>`, `text-body-<size>`, `text-label-<size>` | `text-heading-1`, `text-body-medium` |
| Spacing | `p-space-<factor>`, `m-space-<factor>`, `gap-space-<factor>` | `p-space-3`, `m-space-2`, `gap-space-4` |

All classes automatically respect theme (light/dark) via CSS custom properties—no manual theme switching required in components.
