/**
 * Integration Test: Spacing Grid Validation
 *
 * Validates all spacing tokens are multiples of 8px (except space-0).
 *
 * Run: tsx tests/integration/design-tokens/spacing-grid.test.ts
 */

import { readFileSync } from "fs";
import { join } from "path";

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

console.log("\n📐 Spacing Grid Validation Tests\n");

// Load tokens
const content = readFileSync(TOKENS_PATH, "utf-8");
const tokens = JSON.parse(content);
const spacing = tokens["spacing"];

// Test 1: space-0 is exactly 0px
test("space-0 is exactly 0px", () => {
  const space0 = spacing["space-0"];
  assertEquals(space0.value.px, 0, "space-0 should be 0px");
  assertEquals(space0.value.rem, 0, "space-0 should be 0rem");
  assertEquals(space0.value.gridFactor, 0, "space-0 gridFactor should be 0");
});

// Test 2: space-1 is 8px (1 grid unit)
test("space-1 is 8px (1 grid unit)", () => {
  const space1 = spacing["space-1"];
  assertEquals(space1.value.px, 8, "space-1 should be 8px");
  assertEquals(space1.value.rem, 0.5, "space-1 should be 0.5rem");
  assertEquals(space1.value.gridFactor, 1, "space-1 gridFactor should be 1");
});

// Test 3: space-2 is 16px (2 grid units)
test("space-2 is 16px (2 grid units)", () => {
  const space2 = spacing["space-2"];
  assertEquals(space2.value.px, 16, "space-2 should be 16px");
  assertEquals(space2.value.rem, 1, "space-2 should be 1rem");
  assertEquals(space2.value.gridFactor, 2, "space-2 gridFactor should be 2");
});

// Test 4: space-5 is 40px (minimum for touch targets)
test("space-5 is 40px (minimum for touch targets)", () => {
  const space5 = spacing["space-5"];
  assertEquals(space5.value.px, 40, "space-5 should be 40px");
  assertEquals(space5.value.rem, 2.5, "space-5 should be 2.5rem");
  assertEquals(space5.value.gridFactor, 5, "space-5 gridFactor should be 5");
  assertTrue(
    space5.value.px >= 40,
    "space-5 should be at least 40px for 44px touch targets (with padding)",
  );
});

// Test 5: All spacing tokens (except space-0) are multiples of 8px
test("All spacing tokens (except space-0) are multiples of 8px", () => {
  const spacingTokens = Object.entries(spacing);

  for (const [tokenName, token] of spacingTokens) {
    const tokenData = token as any;
    if (tokenName !== "space-0") {
      assertTrue(
        tokenData.value.px % 8 === 0,
        `${tokenName} (${tokenData.value.px}px) is not a multiple of 8px`,
      );
    }
  }
});

// Test 6: All spacing tokens have correct gridFactor
test("All spacing tokens have correct gridFactor", () => {
  const spacingTokens = Object.entries(spacing);

  for (const [tokenName, token] of spacingTokens) {
    const tokenData = token as any;
    const expectedGridFactor = tokenData.value.px / 8;
    assertEquals(
      tokenData.value.gridFactor,
      expectedGridFactor,
      `${tokenName} gridFactor should be ${expectedGridFactor} (px / 8)`,
    );
  }
});

// Test 7: All spacing tokens have correct rem conversion (1rem = 16px)
test("All spacing tokens have correct rem conversion", () => {
  const spacingTokens = Object.entries(spacing);

  for (const [tokenName, token] of spacingTokens) {
    const tokenData = token as any;
    const expectedRem = tokenData.value.px / 16;
    assertEquals(
      tokenData.value.rem,
      expectedRem,
      `${tokenName} rem should be ${expectedRem} (px / 16)`,
    );
  }
});

// Test 8: Spacing scale increases monotonically
test("Spacing scale increases monotonically", () => {
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

  for (let i = 1; i < spacingTokens.length; i++) {
    const prevToken = spacing[spacingTokens[i - 1]];
    const currToken = spacing[spacingTokens[i]];
    assertTrue(
      currToken.value.px > prevToken.value.px,
      `${spacingTokens[i]} (${currToken.value.px}px) should be > ${spacingTokens[i - 1]} (${prevToken.value.px}px)`,
    );
  }
});

// Test 9: space-12 is maximum spacing (96px)
test("space-12 is maximum spacing (96px)", () => {
  const space12 = spacing["space-12"];
  assertEquals(space12.value.px, 96, "space-12 should be 96px");
  assertEquals(space12.value.rem, 6, "space-12 should be 6rem");
  assertEquals(
    space12.value.gridFactor,
    12,
    "space-12 gridFactor should be 12",
  );
});

// Test 10: Exactly 10 spacing tokens exist
test("Exactly 10 spacing tokens exist", () => {
  const spacingTokens = Object.keys(spacing);
  assertEquals(
    spacingTokens.length,
    10,
    `Expected 10 spacing tokens, got ${spacingTokens.length}`,
  );
});

// Test 11: All spacing tokens have type 'spacing'
test('All spacing tokens have type "spacing"', () => {
  const spacingTokens = Object.entries(spacing);

  for (const [tokenName, token] of spacingTokens) {
    const tokenData = token as any;
    assertEquals(
      tokenData.type,
      "spacing",
      `${tokenName} should have type 'spacing'`,
    );
  }
});

// Test 12: space-6 is 48px (touch target comfortable)
test("space-6 is 48px (comfortable touch target)", () => {
  const space6 = spacing["space-6"];
  assertEquals(space6.value.px, 48, "space-6 should be 48px");
  assertTrue(
    space6.value.px >= 44,
    "space-6 should meet 44px touch target minimum",
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
