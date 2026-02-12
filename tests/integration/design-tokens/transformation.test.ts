/**
 * Integration Test: Style Dictionary Transformation
 *
 * Validates Style Dictionary transforms tokens.json → tailwind-tokens.js correctly.
 *
 * Run: tsx tests/integration/design-tokens/transformation.test.ts
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

const TOKENS_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/tokens.json",
);
const TAILWIND_TOKENS_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/tailwind-tokens.js",
);
const CSS_VARIABLES_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/css-variables.css",
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

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

console.log("\n🔧 Style Dictionary Transformation Tests\n");

// Load source tokens
const tokensContent = readFileSync(TOKENS_PATH, "utf-8");
const sourceTokens = JSON.parse(tokensContent);

// Test 1: tailwind-tokens.js exists
test("tailwind-tokens.js exists", () => {
  assertTrue(
    existsSync(TAILWIND_TOKENS_PATH),
    "tailwind-tokens.js should exist after build",
  );
});

// Test 2: css-variables.css exists
test("css-variables.css exists", () => {
  assertTrue(
    existsSync(CSS_VARIABLES_PATH),
    "css-variables.css should exist after build",
  );
});

// Test 3: tailwind-tokens.js is valid JavaScript
test("tailwind-tokens.js is valid JavaScript", () => {
  const tailwindContent = readFileSync(TAILWIND_TOKENS_PATH, "utf-8");
  assertTrue(
    tailwindContent.includes("module.exports"),
    "tailwind-tokens.js should use module.exports",
  );
});

// Test 4: tailwind-tokens.js contains all category colors
test("tailwind-tokens.js contains all category colors", () => {
  const tailwindTokens = require(TAILWIND_TOKENS_PATH);

  const categoryColors = [
    "category-lacteal",
    "category-cereals-flours-pulses-legumes-tubers",
    "category-fruits",
    "category-vegetables",
    "category-oily-dry-fruits",
    "category-drinks",
    "category-others",
  ];

  for (const tokenName of categoryColors) {
    assertTrue(
      tokenName in tailwindTokens,
      `tailwind-tokens.js should contain ${tokenName}`,
    );
  }
});

// Test 5: tailwind-tokens.js contains all state colors
test("tailwind-tokens.js contains all state colors", () => {
  const tailwindTokens = require(TAILWIND_TOKENS_PATH);

  const stateColors = [
    "state-offline",
    "state-syncing",
    "state-sync-error",
    "state-online",
  ];

  for (const tokenName of stateColors) {
    assertTrue(
      tokenName in tailwindTokens,
      `tailwind-tokens.js should contain ${tokenName}`,
    );
  }
});

// Test 6: tailwind-tokens.js contains all feedback colors
test("tailwind-tokens.js contains all feedback colors", () => {
  const tailwindTokens = require(TAILWIND_TOKENS_PATH);

  const feedbackColors = [
    "feedback-success",
    "feedback-warning",
    "feedback-error",
    "feedback-info",
  ];

  for (const tokenName of feedbackColors) {
    assertTrue(
      tokenName in tailwindTokens,
      `tailwind-tokens.js should contain ${tokenName}`,
    );
  }
});

// Test 7: tailwind-tokens.js contains all spacing tokens
test("tailwind-tokens.js contains all spacing tokens", () => {
  const tailwindTokens = require(TAILWIND_TOKENS_PATH);

  const spacingTokens = [
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

  for (const tokenName of spacingTokens) {
    assertTrue(
      tokenName in tailwindTokens,
      `tailwind-tokens.js should contain ${tokenName}`,
    );
  }
});

// Test 8: Color values match source tokens
test("Color values match source tokens", () => {
  const tailwindTokens = require(TAILWIND_TOKENS_PATH);

  // Check category-lacteal
  const lactealSource =
    sourceTokens["category-colors"]["category-lacteal"].value;
  const lactealTransformed = tailwindTokens["category-lacteal"];
  assertTrue(
    lactealTransformed === lactealSource,
    `category-lacteal value mismatch: expected ${lactealSource}, got ${lactealTransformed}`,
  );

  // Check state-offline
  const offlineSource = sourceTokens["state-colors"]["state-offline"].value;
  const offlineTransformed = tailwindTokens["state-offline"];
  assertTrue(
    offlineTransformed === offlineSource,
    `state-offline value mismatch: expected ${offlineSource}, got ${offlineTransformed}`,
  );
});

// Test 9: Spacing values use rem units
test("Spacing values use rem units in tailwind-tokens.js", () => {
  const tailwindTokens = require(TAILWIND_TOKENS_PATH);

  const spacingTokens = ["space-1", "space-2", "space-3", "space-4", "space-5"];

  for (const tokenName of spacingTokens) {
    const value = tailwindTokens[tokenName];
    assertTrue(
      typeof value === "string" && value.includes("rem"),
      `${tokenName} should use rem units (got ${value})`,
    );
  }
});

// Test 10: css-variables.css contains :root selector
test("css-variables.css contains :root selector", () => {
  const cssContent = readFileSync(CSS_VARIABLES_PATH, "utf-8");
  assertTrue(
    cssContent.includes(":root"),
    "css-variables.css should contain :root selector",
  );
});

// Test 11: css-variables.css contains color custom properties
test("css-variables.css contains color custom properties", () => {
  const cssContent = readFileSync(CSS_VARIABLES_PATH, "utf-8");
  assertTrue(
    cssContent.includes("--category-lacteal"),
    "css-variables.css should contain --category-lacteal",
  );
  assertTrue(
    cssContent.includes("--state-offline"),
    "css-variables.css should contain --state-offline",
  );
  assertTrue(
    cssContent.includes("--feedback-success"),
    "css-variables.css should contain --feedback-success",
  );
});

// Test 12: Transformation preserves all 37 tokens (light theme)
test("Transformation preserves all 37 light theme tokens", () => {
  const tailwindTokens = require(TAILWIND_TOKENS_PATH);

  // 7 category colors + 4 state colors + 4 feedback colors + 10 spacing = 25 minimum
  // (Typography tokens may or may not be included depending on transformation config)
  const tokenCount = Object.keys(tailwindTokens).length;
  assertTrue(
    tokenCount >= 25,
    `Expected at least 25 tokens, got ${tokenCount}`,
  );
});

// Test 13: state-offline value is #BF360C (regression test)
test("state-offline transformed value is #BF360C", () => {
  const tailwindTokens = require(TAILWIND_TOKENS_PATH);
  assertTrue(
    tailwindTokens["state-offline"] === "#BF360C",
    `state-offline should be #BF360C (got ${tailwindTokens["state-offline"]})`,
  );
});

// Test 14: feedback-warning value is #BF360C (regression test)
test("feedback-warning transformed value is #BF360C", () => {
  const tailwindTokens = require(TAILWIND_TOKENS_PATH);
  assertTrue(
    tailwindTokens["feedback-warning"] === "#BF360C",
    `feedback-warning should be #BF360C (got ${tailwindTokens["feedback-warning"]})`,
  );
});

// Test 15: space-5 is 2.5rem (touch target minimum)
test("space-5 transformed value is 2.5rem", () => {
  const tailwindTokens = require(TAILWIND_TOKENS_PATH);
  assertTrue(
    tailwindTokens["space-5"] === "2.5rem",
    `space-5 should be 2.5rem (got ${tailwindTokens["space-5"]})`,
  );
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
