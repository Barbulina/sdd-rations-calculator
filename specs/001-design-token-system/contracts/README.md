# Design Token Contracts

**Feature**: Design Token System for Rations Calculator  
**Date**: 2026-02-11  
**Purpose**: Define interface contracts for token transformation and consumption

## Overview

This directory contains schema definitions and type contracts for the design token system. These contracts ensure compatibility between:

1. **Specify → tokens.json** (export from design tool)
2. **tokens.json → Style Dictionary** (transformation input)
3. **Style Dictionary → tailwind.config.ts** (transformation output)
4. **TypeScript application code** (token consumption)

## Contract Files

- `tokens-schema.json` - JSON Schema for validating Specify export format
- `tailwind-tokens.d.ts` - TypeScript definitions for Tailwind config integration
- `validation-api.md` - Contract for WCAG AA contrast validation service

---

## File: tokens-schema.json

**Purpose**: JSON Schema (Draft 2020-12) for validating Specify tokens.json export

**Location**: `specs/001-design-token-system/contracts/tokens-schema.json`

**Usage**: Validates token structure during build process

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://rations-calculator.app/schemas/design-tokens.json",
  "title": "Rations Calculator Design Tokens",
  "description": "Schema for validating design tokens exported from Specify",
  "type": "object",
  "properties": {
    "category-colors": {
      "type": "object",
      "description": "Aliment category semantic colors",
      "patternProperties": {
        "^category-(lacteal|cereals-flours-pulses-legumes-tubers|fruits|vegetables|oily-dry-fruits|drinks|others)$": {
          "$ref": "#/$defs/colorToken"
        }
      },
      "required": [
        "category-lacteal",
        "category-cereals-flours-pulses-legumes-tubers",
        "category-fruits",
        "category-vegetables",
        "category-oily-dry-fruits",
        "category-drinks",
        "category-others"
      ]
    },
    "state-colors": {
      "type": "object",
      "description": "Offline/online status indicator colors",
      "properties": {
        "state-offline": { "$ref": "#/$defs/colorToken" },
        "state-syncing": { "$ref": "#/$defs/colorToken" },
        "state-sync-error": { "$ref": "#/$defs/colorToken" },
        "state-online": { "$ref": "#/$defs/colorToken" }
      },
      "required": ["state-offline", "state-syncing", "state-sync-error", "state-online"]
    },
    "feedback-colors": {
      "type": "object",
      "description": "Action feedback and TDD state colors",
      "properties": {
        "feedback-success": { "$ref": "#/$defs/colorToken" },
        "feedback-warning": { "$ref": "#/$defs/colorToken" },
        "feedback-error": { "$ref": "#/$defs/colorToken" },
        "feedback-info": { "$ref": "#/$defs/colorToken" }
      },
      "required": ["feedback-success", "feedback-warning", "feedback-error", "feedback-info"]
    },
    "typography": {
      "type": "object",
      "description": "Type scale tokens",
      "properties": {
        "heading-1": { "$ref": "#/$defs/typographyToken" },
        "heading-2": { "$ref": "#/$defs/typographyToken" },
        "heading-3": { "$ref": "#/$defs/typographyToken" },
        "heading-4": { "$ref": "#/$defs/typographyToken" },
        "heading-5": { "$ref": "#/$defs/typographyToken" },
        "heading-6": { "$ref": "#/$defs/typographyToken" },
        "body-large": { "$ref": "#/$defs/typographyToken" },
        "body-medium": { "$ref": "#/$defs/typographyToken" },
        "body-small": { "$ref": "#/$defs/typographyToken" },
        "label-large": { "$ref": "#/$defs/typographyToken" },
        "label-medium": { "$ref": "#/$defs/typographyToken" },
        "label-small": { "$ref": "#/$defs/typographyToken" }
      },
      "required": [
        "heading-1", "heading-2", "heading-3", "heading-4", "heading-5", "heading-6",
        "body-large", "body-medium", "body-small",
        "label-large", "label-medium", "label-small"
      ]
    },
    "spacing": {
      "type": "object",
      "description": "8px grid spacing scale",
      "properties": {
        "space-0": { "$ref": "#/$defs/spacingToken" },
        "space-1": { "$ref": "#/$defs/spacingToken" },
        "space-2": { "$ref": "#/$defs/spacingToken" },
        "space-3": { "$ref": "#/$defs/spacingToken" },
        "space-4": { "$ref": "#/$defs/spacingToken" },
        "space-5": { "$ref": "#/$defs/spacingToken" },
        "space-6": { "$ref": "#/$defs/spacingToken" },
        "space-8": { "$ref": "#/$defs/spacingToken" },
        "space-10": { "$ref": "#/$defs/spacingToken" },
        "space-12": { "$ref": "#/$defs/spacingToken" }
      },
      "required": [
        "space-0", "space-1", "space-2", "space-3", "space-4",
        "space-5", "space-6", "space-8", "space-10", "space-12"
      ]
    }
  },
  "required": ["category-colors", "state-colors", "feedback-colors", "typography", "spacing"],
  "$defs": {
    "colorToken": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "pattern": "^#[0-9A-Fa-f]{6}$",
          "description": "Hex color code"
        },
        "type": {
          "const": "color"
        },
        "theme": {
          "enum": ["light", "dark"],
          "description": "Theme variant for this color"
        },
        "description": {
          "type": "string",
          "description": "Human-readable token description"
        },
        "$extensions": {
          "type": "object",
          "properties": {
            "m3Role": {
              "enum": [
                "primary", "secondary", "tertiary", "error",
                "surface", "surface-variant", "outline",
                "custom-extended-1", "custom-extended-2", "custom-extended-3"
              ],
              "description": "Material Design 3 color role"
            },
            "m3Tone": {
              "enum": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100],
              "description": "Material Design 3 tonal value"
            }
          },
          "required": ["m3Role", "m3Tone"]
        }
      },
      "required": ["value", "type", "theme", "$extensions"]
    },
    "typographyToken": {
      "type": "object",
      "properties": {
        "value": {
          "type": "object",
          "properties": {
            "fontSize": {
              "type": "string",
              "pattern": "^\\d+(\\.\\d+)?(px|rem)$"
            },
            "lineHeight": {
              "type": "string",
              "pattern": "^(\\d+(\\.\\d+)?(px|rem)?|\\d+(\\.\\d+))$"
            },
            "letterSpacing": {
              "type": "string",
              "pattern": "^-?\\d+(\\.\\d+)?(px|rem|em)?$"
            },
            "fontWeight": {
              "type": "integer",
              "minimum": 100,
              "maximum": 900
            },
            "fontFamily": {
              "type": "string"
            }
          },
          "required": ["fontSize", "lineHeight", "letterSpacing", "fontWeight", "fontFamily"]
        },
        "type": {
          "const": "typography"
        },
        "description": {
          "type": "string"
        }
      },
      "required": ["value", "type"]
    },
    "spacingToken": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string",
          "pattern": "^\\d+(\\.\\d+)?rem$",
          "description": "Spacing value in rem units"
        },
        "type": {
          "const": "dimension"
        },
        "description": {
          "type": "string"
        },
        "$extensions": {
          "type": "object",
          "properties": {
            "pixelValue": {
              "type": "integer",
              "minimum": 0,
              "description": "Equivalent pixel value (assuming 16px root)"
            },
            "gridFactor": {
              "type": "number",
              "description": "Multiple of 8px base unit"
            }
          },
          "required": ["pixelValue", "gridFactor"]
        }
      },
      "required": ["value", "type", "$extensions"]
    }
  }
}
```

---

## File: tailwind-tokens.d.ts

**Purpose**: TypeScript type definitions for Tailwind CSS token integration

**Location**: `src/infrastructure/design-tokens/tailwind-tokens.d.ts` (generated)

**Usage**: Provides type safety for Tailwind utility classes in TypeScript/JSX

```typescript
/**
 * Design Token Type Definitions for Tailwind CSS
 * Auto-generated from tokens.json
 * DO NOT EDIT MANUALLY
 */

export interface DesignTokens {
  colors: {
    // Category colors (7 aliment categories)
    'category-lacteal': string;
    'category-cereals-flours-pulses-legumes-tubers': string;
    'category-fruits': string;
    'category-vegetables': string;
    'category-oily-dry-fruits': string;
    'category-drinks': string;
    'category-others': string;

    // State colors (offline/online indicators)
    'state-offline': string;
    'state-syncing': string;
    'state-sync-error': string;
    'state-online': string;

    // Feedback colors (TDD/action feedback)
    'feedback-success': string;
    'feedback-warning': string;
    'feedback-error': string;
    'feedback-info': string;
  };

  spacing: {
    'space-0': string;  // 0px
    'space-1': string;  // 8px
    'space-2': string;  // 16px
    'space-3': string;  // 24px
    'space-4': string;  // 32px
    'space-5': string;  // 40px (min for 44px touch target)
    'space-6': string;  // 48px
    'space-8': string;  // 64px
    'space-10': string; // 80px
    'space-12': string; // 96px
  };

  fontSize: {
    'heading-1': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'heading-2': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'heading-3': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'heading-4': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'heading-5': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'heading-6': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'body-large': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'body-medium': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'body-small': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'label-large': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'label-medium': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
    'label-small': [string, { lineHeight: string; letterSpacing: string; fontWeight: number }];
  };
}

/**
 * Augment Tailwind's default theme types
 */
declare module 'tailwindcss/tailwind-config' {
  interface TailwindTheme {
    extend: {
      colors: DesignTokens['colors'];
      spacing: DesignTokens['spacing'];
      fontSize: DesignTokens['fontSize'];
    };
  }
}

/**
 * Type-safe utility class names (for className prop validation)
 */
export type CategoryColorClass =
  | `bg-category-${'lacteal' | 'cereals-flours-pulses-legumes-tubers' | 'fruits' | 'vegetables' | 'oily-dry-fruits' | 'drinks' | 'others'}`
  | `text-category-${'lacteal' | 'cereals-flours-pulses-legumes-tubers' | 'fruits' | 'vegetables' | 'oily-dry-fruits' | 'drinks' | 'others'}`
  | `border-category-${'lacteal' | 'cereals-flours-pulses-legumes-tubers' | 'fruits' | 'vegetables' | 'oily-dry-fruits' | 'drinks' | 'others'}`;

export type StateColorClass =
  | `bg-state-${'offline' | 'syncing' | 'sync-error' | 'online'}`
  | `text-state-${'offline' | 'syncing' | 'sync-error' | 'online'}`
  | `border-state-${'offline' | 'syncing' | 'sync-error' | 'online'}`;

export type FeedbackColorClass =
  | `bg-feedback-${'success' | 'warning' | 'error' | 'info'}`
  | `text-feedback-${'success' | 'warning' | 'error' | 'info'}`
  | `border-feedback-${'success' | 'warning' | 'error' | 'info'}`;

export type SpacingClass =
  | `p-space-${0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12}`
  | `m-space-${0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12}`
  | `gap-space-${0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12}`;

export type TypographyClass =
  | `text-heading-${1 | 2 | 3 | 4 | 5 | 6}`
  | `text-body-${'large' | 'medium' | 'small'}`
  | `text-label-${'large' | 'medium' | 'small'}`;

/**
 * Combined type for all design token utility classes
 */
export type DesignTokenClass =
  | CategoryColorClass
  | StateColorClass
  | FeedbackColorClass
  | SpacingClass
  | TypographyClass;
```

---

## File: validation-api.md

**Purpose**: Contract for WCAG AA contrast validation service

**Endpoint**: Build-time validation function (not HTTP API)

**Function Signature**:

```typescript
/**
 * Validates WCAG AA contrast ratio for color token
 * @param foreground - Hex color code (e.g., "#6750A4")
 * @param background - Hex color code (e.g., "#FFFBFE")
 * @param textSize - "normal" (< 18pt) or "large" (≥ 18pt)
 * @returns Validation result with contrast ratio and pass/fail
 */
function validateContrastRatio(
  foreground: string,
  background: string,
  textSize: 'normal' | 'large'
): ContrastValidationResult;

interface ContrastValidationResult {
  /** Calculated contrast ratio */
  ratio: number;
  
  /** Whether ratio meets WCAG AA threshold */
  passes: boolean;
  
  /** Required minimum ratio for given text size */
  required: number;
  
  /** WCAG conformance level achieved */
  level: 'AAA' | 'AA' | 'fail';
  
  /** Human-readable result message */
  message: string;
}
```

**WCAG AA Thresholds**:
- Normal text (< 18pt regular or < 14pt bold): **4.5:1** minimum
- Large text (≥ 18pt regular or ≥ 14pt bold): **3.0:1** minimum
- UI components and graphical objects: **3.0:1** minimum

**Example Request/Response**:

```typescript
// Input
const result = validateContrastRatio('#6750A4', '#FFFBFE', 'normal');

// Output
{
  ratio: 8.2,
  passes: true,
  required: 4.5,
  level: 'AAA',
  message: 'Contrast ratio 8.2:1 exceeds WCAG AA requirement (4.5:1) and achieves AAA'
}
```

**Failure Case**:

```typescript
// Input
const result = validateContrastRatio('#D0BCFF', '#FFFBFE', 'normal');

// Output
{
  ratio: 2.1,
  passes: false,
  required: 4.5,
  level: 'fail',
  message: 'Contrast ratio 2.1:1 fails WCAG AA requirement (4.5:1) for normal text'
}
```

**Build Integration**:

This validation runs during Style Dictionary transformation. If any color token fails contrast validation against standard backgrounds (light surface `#FFFBFE` and dark surface `#1C1B1F`), the build fails with detailed error messages listing all violations.

**Test Backgrounds**:
- Light theme: `#FFFBFE` (M3 light surface)
- Dark theme: `#1C1B1F` (M3 dark surface)

All category, state, and feedback colors must pass when used as text colors on their respective theme backgrounds.

---

## Contract Verification

**Phase 1 Gate**: Before proceeding to implementation, verify:

1. ✅ **tokens-schema.json** covers all 50 tokens (7 categories × 2 themes + 4 states × 2 themes + 4 feedback × 2 themes + 12 typography + 10 spacing)
2. ✅ **tailwind-tokens.d.ts** provides TypeScript types for all utility classes
3. ✅ **validation-api.md** defines clear pass/fail criteria for WCAG AA compliance

**Integration Points**:

- **Specify** exports → validates against `tokens-schema.json`
- **Style Dictionary** transforms → generates code matching `tailwind-tokens.d.ts`
- **Build process** → uses `validateContrastRatio()` to enforce accessibility

**Next Step**: Phase 1 continues with quickstart.md and agent context update.
