/**
 * Integration Test: Contrast Validation
 *
 * Validates all color tokens meet WCAG AA contrast requirements.
 *
 * Run: tsx tests/integration/design-tokens/contrast-validation.test.ts
 */

import { readFileSync } from "fs";
import { join } from "path";
import { validateTokenContrast } from "../../../src/infrastructure/design-tokens/validate-contrast";

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

function assertTrue(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

console.log("\n🎨 Contrast Validation Tests\n");

// Load tokens
const content = readFileSync(TOKENS_PATH, "utf-8");
const tokens = JSON.parse(content);

// Test 1: All category colors meet WCAG AA (light theme)
test("All category colors meet WCAG AA (light theme)", () => {
  const categoryColors = tokens["category-colors"];

  for (const [tokenName, token] of Object.entries(categoryColors)) {
    const tokenData = token as any;
    if (tokenData.theme === "light") {
      const validation = validateTokenContrast(tokenData.value, "light");
      assertTrue(
        validation.passes,
        `${tokenName} fails WCAG AA: ${validation.ratio.toFixed(1)}:1 < ${validation.required}:1`,
      );
    }
  }
});

// Test 2: All state colors meet WCAG AA (light theme)
test("All state colors meet WCAG AA (light theme)", () => {
  const stateColors = tokens["state-colors"];

  for (const [tokenName, token] of Object.entries(stateColors)) {
    const tokenData = token as any;
    if (tokenData.theme === "light") {
      const validation = validateTokenContrast(tokenData.value, "light");
      assertTrue(
        validation.passes,
        `${tokenName} fails WCAG AA: ${validation.ratio.toFixed(1)}:1 < ${validation.required}:1`,
      );
    }
  }
});

// Test 3: All feedback colors meet WCAG AA (light theme)
test("All feedback colors meet WCAG AA (light theme)", () => {
  const feedbackColors = tokens["feedback-colors"];

  for (const [tokenName, token] of Object.entries(feedbackColors)) {
    const tokenData = token as any;
    if (tokenData.theme === "light") {
      const validation = validateTokenContrast(tokenData.value, "light");
      assertTrue(
        validation.passes,
        `${tokenName} fails WCAG AA: ${validation.ratio.toFixed(1)}:1 < ${validation.required}:1`,
      );
    }
  }
});

// Test 4: Minimum contrast ratio is 4.5:1 for normal text
test("All color tokens meet 4.5:1 minimum for normal text", () => {
  const colorCategories = [
    "category-colors",
    "state-colors",
    "feedback-colors",
  ];

  for (const category of colorCategories) {
    const colorTokens = tokens[category];
    for (const [tokenName, token] of Object.entries(colorTokens)) {
      const tokenData = token as any;
      if (tokenData.theme === "light") {
        const validation = validateTokenContrast(
          tokenData.value,
          "light",
          "normal",
        );
        assertTrue(
          validation.ratio >= 4.5,
          `${tokenName} has insufficient contrast: ${validation.ratio.toFixed(1)}:1 < 4.5:1`,
        );
      }
    }
  }
});

// Test 5: state-offline has sufficient contrast (regression test)
test("state-offline has sufficient contrast (regression)", () => {
  const stateOffline = tokens["state-colors"]["state-offline"];
  const validation = validateTokenContrast(stateOffline.value, "light");
  assertTrue(
    validation.ratio >= 4.5,
    `state-offline fails: ${validation.ratio.toFixed(1)}:1 < 4.5:1 (Expected #BF360C)`,
  );
  assertTrue(
    stateOffline.value === "#BF360C",
    `state-offline should be #BF360C (got ${stateOffline.value})`,
  );
});

// Test 6: feedback-warning has sufficient contrast (regression test)
test("feedback-warning has sufficient contrast (regression)", () => {
  const feedbackWarning = tokens["feedback-colors"]["feedback-warning"];
  const validation = validateTokenContrast(feedbackWarning.value, "light");
  assertTrue(
    validation.ratio >= 4.5,
    `feedback-warning fails: ${validation.ratio.toFixed(1)}:1 < 4.5:1 (Expected #BF360C)`,
  );
  assertTrue(
    feedbackWarning.value === "#BF360C",
    `feedback-warning should be #BF360C (got ${feedbackWarning.value})`,
  );
});

// Test 7: At least 3 tokens achieve AAA (7:1+) for extra accessibility
test("At least 3 tokens achieve AAA contrast (7:1+)", () => {
  const colorCategories = [
    "category-colors",
    "state-colors",
    "feedback-colors",
  ];
  let aaaCount = 0;

  for (const category of colorCategories) {
    const colorTokens = tokens[category];
    for (const [, token] of Object.entries(colorTokens)) {
      const tokenData = token as any;
      if (tokenData.theme === "light") {
        const validation = validateTokenContrast(tokenData.value, "light");
        if (validation.ratio >= 7.0) {
          aaaCount++;
        }
      }
    }
  }

  assertTrue(
    aaaCount >= 3,
    `Only ${aaaCount} tokens achieve AAA contrast (expected at least 3)`,
  );
});

// Test 8: No color token has contrast below 4.5:1
test("No color token has contrast below 4.5:1", () => {
  const colorCategories = [
    "category-colors",
    "state-colors",
    "feedback-colors",
  ];
  const failures: string[] = [];

  for (const category of colorCategories) {
    const colorTokens = tokens[category];
    for (const [tokenName, token] of Object.entries(colorTokens)) {
      const tokenData = token as any;
      if (tokenData.theme === "light") {
        const validation = validateTokenContrast(tokenData.value, "light");
        if (validation.ratio < 4.5) {
          failures.push(`${tokenName}: ${validation.ratio.toFixed(1)}:1`);
        }
      }
    }
  }

  assertTrue(
    failures.length === 0,
    `Tokens failing WCAG AA: ${failures.join(", ")}`,
  );
});

// Test 9: category-others achieves highest contrast (>= 9:1)
test("category-others achieves highest contrast (>= 9:1)", () => {
  const categoryOthers = tokens["category-colors"]["category-others"];
  const validation = validateTokenContrast(categoryOthers.value, "light");
  assertTrue(
    validation.ratio >= 9.0,
    `category-others has ${validation.ratio.toFixed(1)}:1 contrast (expected >= 9:1)`,
  );
});

// Test 10: All validation results include WCAG level
test("All validation results include WCAG level", () => {
  const colorCategories = [
    "category-colors",
    "state-colors",
    "feedback-colors",
  ];

  for (const category of colorCategories) {
    const colorTokens = tokens[category];
    for (const [tokenName, token] of Object.entries(colorTokens)) {
      const tokenData = token as any;
      if (tokenData.theme === "light") {
        const validation = validateTokenContrast(tokenData.value, "light");
        assertTrue(
          validation.level === "AA" || validation.level === "AAA",
          `${tokenName} should have level 'AA' or 'AAA' (got ${validation.level})`,
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
