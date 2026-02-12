/**
 * JSON Schema validation for design tokens
 * Based on contracts/tokens-schema.json
 */

export interface DesignTokenSchema {
  'category-colors': Record<string, ColorToken>;
  'state-colors': Record<string, ColorToken>;
  'feedback-colors': Record<string, ColorToken>;
  typography: Record<string, TypographyToken>;
  spacing: Record<string, SpacingToken>;
}

export interface ColorToken {
  value: string; // Hex color code
  type: 'color';
  theme: 'light' | 'dark';
  description?: string;
  $extensions?: {
    m3Role: 'primary' | 'secondary' | 'tertiary' | 'error' | 'surface' | 'surface-variant' | 'outline' | 'custom-extended-1' | 'custom-extended-2' | 'custom-extended-3';
    m3Tone: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 99 | 100;
  };
}

export interface TypographyToken {
  value: {
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    fontWeight: number;
    fontFamily: string;
  };
  type: 'typography';
  description?: string;
}

export interface SpacingToken {
  value: string; // rem units
  type: 'dimension';
  description?: string;
  $extensions?: {
    pixelValue: number;
    gridFactor: number;
  };
}

/**
 * Validates design token structure
 */
export function validateTokenSchema(tokens: unknown): tokens is DesignTokenSchema {
  if (!tokens || typeof tokens !== 'object') {
    throw new Error('Tokens must be an object');
  }

  const schema = tokens as Partial<DesignTokenSchema>;

  // Required top-level categories
  const requiredCategories = ['category-colors', 'state-colors', 'feedback-colors', 'typography', 'spacing'];
  for (const category of requiredCategories) {
    if (!(category in schema)) {
      throw new Error(`Missing required category: ${category}`);
    }
  }

  // Validate category colors
  const categoryColorNames = [
    'category-lacteal',
    'category-cereals-flours-pulses-legumes-tubers',
    'category-fruits',
    'category-vegetables',
    'category-oily-dry-fruits',
    'category-drinks',
    'category-others'
  ];

  for (const name of categoryColorNames) {
    if (!schema['category-colors']?.[name]) {
      throw new Error(`Missing required category color: ${name}`);
    }
    validateColorToken(schema['category-colors'][name], name);
  }

  // Validate state colors
  const stateColorNames = ['state-offline', 'state-syncing', 'state-sync-error', 'state-online'];
  for (const name of stateColorNames) {
    if (!schema['state-colors']?.[name]) {
      throw new Error(`Missing required state color: ${name}`);
    }
    validateColorToken(schema['state-colors'][name], name);
  }

  // Validate feedback colors
  const feedbackColorNames = ['feedback-success', 'feedback-warning', 'feedback-error', 'feedback-info'];
  for (const name of feedbackColorNames) {
    if (!schema['feedback-colors']?.[name]) {
      throw new Error(`Missing required feedback color: ${name}`);
    }
    validateColorToken(schema['feedback-colors'][name], name);
  }

  // Validate typography
  const typographyNames = [
    'heading-1', 'heading-2', 'heading-3', 'heading-4', 'heading-5', 'heading-6',
    'body-large', 'body-medium', 'body-small',
    'label-large', 'label-medium', 'label-small'
  ];
  for (const name of typographyNames) {
    if (!schema.typography?.[name]) {
      throw new Error(`Missing required typography token: ${name}`);
    }
    validateTypographyToken(schema.typography[name], name);
  }

  // Validate spacing
  const spacingNames = ['space-0', 'space-1', 'space-2', 'space-3', 'space-4', 'space-5', 'space-6', 'space-8', 'space-10', 'space-12'];
  for (const name of spacingNames) {
    if (!schema.spacing?.[name]) {
      throw new Error(`Missing required spacing token: ${name}`);
    }
    validateSpacingToken(schema.spacing[name], name);
  }

  return true;
}

function validateColorToken(token: unknown, name: string): asserts token is ColorToken {
  if (!token || typeof token !== 'object') {
    throw new Error(`Invalid color token ${name}: must be an object`);
  }

  const t = token as Partial<ColorToken>;

  if (typeof t.value !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(t.value)) {
    throw new Error(`Invalid color token ${name}: value must be a 6-digit hex code`);
  }

  if (t.type !== 'color') {
    throw new Error(`Invalid color token ${name}: type must be 'color'`);
  }

  if (t.theme !== 'light' && t.theme !== 'dark') {
    throw new Error(`Invalid color token ${name}: theme must be 'light' or 'dark'`);
  }

  if (t.$extensions) {
    if (!t.$extensions.m3Role || !t.$extensions.m3Tone) {
      throw new Error(`Invalid color token ${name}: $extensions must include m3Role and m3Tone`);
    }
  }
}

function validateTypographyToken(token: unknown, name: string): asserts token is TypographyToken {
  if (!token || typeof token !== 'object') {
    throw new Error(`Invalid typography token ${name}: must be an object`);
  }

  const t = token as Partial<TypographyToken>;

  if (t.type !== 'typography') {
    throw new Error(`Invalid typography token ${name}: type must be 'typography'`);
  }

  if (!t.value || typeof t.value !== 'object') {
    throw new Error(`Invalid typography token ${name}: value must be an object`);
  }

  const requiredProps = ['fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'fontFamily'];
  for (const prop of requiredProps) {
    if (!(prop in t.value)) {
      throw new Error(`Invalid typography token ${name}: value missing required property ${prop}`);
    }
  }
}

function validateSpacingToken(token: unknown, name: string): asserts token is SpacingToken {
  if (!token || typeof token !== 'object') {
    throw new Error(`Invalid spacing token ${name}: must be an object`);
  }

  const t = token as Partial<SpacingToken>;

  if (typeof t.value !== 'string' || !/^\d+(\.\d+)?rem$/.test(t.value)) {
    throw new Error(`Invalid spacing token ${name}: value must be in rem units`);
  }

  if (t.type !== 'dimension') {
    throw new Error(`Invalid spacing token ${name}: type must be 'dimension'`);
  }

  if (t.$extensions) {
    if (typeof t.$extensions.pixelValue !== 'number' || typeof t.$extensions.gridFactor !== 'number') {
      throw new Error(`Invalid spacing token ${name}: $extensions must include pixelValue and gridFactor`);
    }

    // Validate 8px grid alignment (except space-0)
    if (name !== 'space-0' && t.$extensions.pixelValue % 8 !== 0) {
      throw new Error(`Invalid spacing token ${name}: pixelValue must be a multiple of 8 (got ${t.$extensions.pixelValue})`);
    }
  }
}
