/**
 * Integration Test: Token Schema Validation
 *
 * Validates tokens.json against the expected JSON schema.
 *
 * Run: tsx tests/integration/design-tokens/token-schema.test.ts
 */

import { readFileSync } from "fs";
import { join } from "path";
import { validateTokenSchema } from "../../../src/infrastructure/design-tokens/validate-schema";

const TOKENS_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/tokens.json",
);

interface TestResult {
  passed: number;
  failed: number;
  errors: string[];
}

const result: TestResult = {
  passed: 0,
  failed: 0,
  errors: [],
};

function test(name: string, fn: () => void) {
  try {
    fn();
    result.passed++;
    console.log(`✓ ${name}`);
  } catch (error) {
    result.failed++;
    const message = error instanceof Error ? error.message : String(error);
    result.errors.push(`${name}: ${message}`);
    console.error(`✗ ${name}`);
    console.error(`  ${message}`);
  }
}

function assertEquals(actual: unknown, expected: unknown, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

console.log("\n🧪 Token Schema Validation Tests\n");

// Test 1: tokens.json file exists and is valid JSON
test("tokens.json exists and is valid JSON", () => {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  const tokens = JSON.parse(content);
  assertTrue(typeof tokens === "object", "tokens.json should be an object");
  assertTrue(tokens !== null, "tokens.json should not be null");
});

// Test 2: Schema validation passes
test("tokens.json passes schema validation", () => {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  const tokens = JSON.parse(content);
  const validation = validateTokenSchema(tokens);
  assertTrue(
    validation.valid,
    `Schema validation failed: ${validation.errors.join(", ")}`,
  );
});

// Test 3: All required token categories exist
test("All required token categories exist", () => {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  const tokens = JSON.parse(content);

  const requiredCategories = [
    "category-colors",
    "state-colors",
    "feedback-colors",
    "typography",
    "spacing",
  ];

  for (const category of requiredCategories) {
    assertTrue(category in tokens, `Missing required category: ${category}`);
  }
});

// Test 4: Category colors have correct structure
test("Category colors have correct structure", () => {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  const tokens = JSON.parse(content);
  const categoryColors = tokens["category-colors"];

  const requiredTokens = [
    "category-lacteal",
    "category-cereals-flours-pulses-legumes-tubers",
    "category-fruits",
    "category-vegetables",
    "category-oily-dry-fruits",
    "category-drinks",
    "category-others",
  ];

  for (const tokenName of requiredTokens) {
    assertTrue(
      tokenName in categoryColors,
      `Missing category color token: ${tokenName}`,
    );

    const token = categoryColors[tokenName];
    assertEquals(token.type, "color", `${tokenName} should have type 'color'`);
    assertTrue(
      /^#[0-9A-Fa-f]{6}$/.test(token.value),
      `${tokenName} value should be a hex color`,
    );
  }
});

// Test 5: State colors have correct structure
test("State colors have correct structure", () => {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  const tokens = JSON.parse(content);
  const stateColors = tokens["state-colors"];

  const requiredTokens = [
    "state-offline",
    "state-syncing",
    "state-sync-error",
    "state-online",
  ];

  for (const tokenName of requiredTokens) {
    assertTrue(
      tokenName in stateColors,
      `Missing state color token: ${tokenName}`,
    );

    const token = stateColors[tokenName];
    assertEquals(token.type, "color", `${tokenName} should have type 'color'`);
    assertTrue(
      /^#[0-9A-Fa-f]{6}$/.test(token.value),
      `${tokenName} value should be a hex color`,
    );
  }
});

// Test 6: Feedback colors have correct structure
test("Feedback colors have correct structure", () => {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  const tokens = JSON.parse(content);
  const feedbackColors = tokens["feedback-colors"];

  const requiredTokens = [
    "feedback-success",
    "feedback-warning",
    "feedback-error",
    "feedback-info",
  ];

  for (const tokenName of requiredTokens) {
    assertTrue(
      tokenName in feedbackColors,
      `Missing feedback color token: ${tokenName}`,
    );

    const token = feedbackColors[tokenName];
    assertEquals(token.type, "color", `${tokenName} should have type 'color'`);
    assertTrue(
      /^#[0-9A-Fa-f]{6}$/.test(token.value),
      `${tokenName} value should be a hex color`,
    );
  }
});

// Test 7: Typography tokens have correct structure
test("Typography tokens have correct structure", () => {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  const tokens = JSON.parse(content);
  const typography = tokens["typography"];

  const requiredTokens = [
    "heading-1",
    "heading-2",
    "heading-3",
    "heading-4",
    "heading-5",
    "heading-6",
    "body-large",
    "body-medium",
    "body-small",
    "label-large",
    "label-medium",
    "label-small",
  ];

  for (const tokenName of requiredTokens) {
    assertTrue(
      tokenName in typography,
      `Missing typography token: ${tokenName}`,
    );

    const token = typography[tokenName];
    assertEquals(
      token.type,
      "typography",
      `${tokenName} should have type 'typography'`,
    );
    assertTrue("fontSize" in token.value, `${tokenName} should have fontSize`);
    assertTrue(
      "lineHeight" in token.value,
      `${tokenName} should have lineHeight`,
    );
    assertTrue(
      "fontWeight" in token.value,
      `${tokenName} should have fontWeight`,
    );
  }
});

// Test 8: Spacing tokens have correct structure
test("Spacing tokens have correct structure", () => {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  const tokens = JSON.parse(content);
  const spacing = tokens["spacing"];

  const requiredTokens = [
    "space-0",
    "space-1",
    "space-2",
    "space-3",
    "space-4",
    "space-5",
    "space-6",
    "space-8",
    "space-10",
    "space-12",
  ];

  for (const tokenName of requiredTokens) {
    assertTrue(tokenName in spacing, `Missing spacing token: ${tokenName}`);

    const token = spacing[tokenName];
    assertEquals(
      token.type,
      "spacing",
      `${tokenName} should have type 'spacing'`,
    );
    assertTrue("px" in token.value, `${tokenName} should have px value`);
    assertTrue("rem" in token.value, `${tokenName} should have rem value`);
  }
});

// Test 9: All color tokens have theme specified
test("All color tokens have theme specified", () => {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  const tokens = JSON.parse(content);

  const colorCategories = [
    "category-colors",
    "state-colors",
    "feedback-colors",
  ];

  for (const category of colorCategories) {
    const colorTokens = tokens[category];
    for (const [tokenName, token] of Object.entries(colorTokens)) {
      assertTrue(
        "theme" in (token as any),
        `${tokenName} should have theme property`,
      );
      assertTrue(
        (token as any).theme === "light" || (token as any).theme === "dark",
        `${tokenName} theme should be 'light' or 'dark'`,
      );
    }
  }
});

// Test 10: All tokens have descriptions
test("All tokens have descriptions", () => {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  const tokens = JSON.parse(content);

  const allCategories = Object.values(tokens);

  for (const category of allCategories) {
    if (typeof category === "object" && category !== null) {
      for (const [tokenName, token] of Object.entries(category)) {
        assertTrue(
          "description" in (token as any),
          `${tokenName} should have description`,
        );
        assertTrue(
          typeof (token as any).description === "string",
          `${tokenName} description should be a string`,
        );
        assertTrue(
          (token as any).description.length > 0,
          `${tokenName} description should not be empty`,
        );
      }
    }
  }
});

// Print results
console.log(`\n${"=".repeat(50)}`);
console.log(`Tests passed: ${result.passed}`);
console.log(`Tests failed: ${result.failed}`);
console.log(`${"=".repeat(50)}\n`);

if (result.failed > 0) {
  console.error("❌ FAILED\n");
  process.exit(1);
} else {
  console.log("✅ ALL TESTS PASSED\n");
  process.exit(0);
}
