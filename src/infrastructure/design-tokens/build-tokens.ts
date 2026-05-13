#!/usr/bin/env tsx
/**
 * Build script for design tokens
 * Runs schema validation, contrast validation, and Style Dictionary transformation
 * Per Phase 2 Task T008
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  validateTokenSchema,
  type DesignTokenSchema,
  type ColorToken,
} from "./validate-schema.js";
import { validateTokenContrast } from "./validate-contrast.js";
import StyleDictionary from "style-dictionary";

const TOKENS_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/tokens.json",
);

async function main() {
  console.log("🎨 Building design tokens...\n");

  // Step 1: Check if tokens.json exists
  if (!existsSync(TOKENS_PATH)) {
    console.error("❌ tokens.json not found at:", TOKENS_PATH);
    console.log(
      "   Create tokens.json with category-colors, state-colors, feedback-colors, typography, and spacing.",
    );
    process.exit(1);
  }

  // Step 2: Load tokens.json
  console.log("📖 Loading tokens.json...");
  let tokens: DesignTokenSchema;
  try {
    const fileContent = readFileSync(TOKENS_PATH, "utf-8");
    tokens = JSON.parse(fileContent) as DesignTokenSchema;
    console.log("✅ tokens.json loaded\n");
  } catch (error) {
    console.error(
      "❌ Failed to parse tokens.json:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }

  // Step 3: Validate schema
  console.log("🔍 Validating token schema...");
  try {
    validateTokenSchema(tokens);
    console.log("✅ Schema validation passed\n");
  } catch (error) {
    console.error(
      "❌ Schema validation failed:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }

  // Step 4: Validate WCAG AA contrast ratios
  console.log("🎯 Validating WCAG AA contrast ratios...");
  const contrastErrors: string[] = [];

  // Validate category colors
  for (const [name, token] of Object.entries(tokens["category-colors"])) {
    const result = validateTokenContrast(token.value, token.theme);
    if (!result.passes) {
      contrastErrors.push(`${name} (${token.theme}): ${result.message}`);
    } else {
      console.log(
        `  ✓ ${name} (${token.theme}): ${result.ratio}:1 (${result.level})`,
      );
    }
  }

  // Validate state colors
  for (const [name, token] of Object.entries(tokens["state-colors"])) {
    const result = validateTokenContrast(token.value, token.theme);
    if (!result.passes) {
      contrastErrors.push(`${name} (${token.theme}): ${result.message}`);
    } else {
      console.log(
        `  ✓ ${name} (${token.theme}): ${result.ratio}:1 (${result.level})`,
      );
    }
  }

  // Validate feedback colors
  for (const [name, token] of Object.entries(tokens["feedback-colors"])) {
    const result = validateTokenContrast(token.value, token.theme);
    if (!result.passes) {
      contrastErrors.push(`${name} (${token.theme}): ${result.message}`);
    } else {
      console.log(
        `  ✓ ${name} (${token.theme}): ${result.ratio}:1 (${result.level})`,
      );
    }
  }

  if (contrastErrors.length > 0) {
    console.error("\n❌ Contrast validation failed:");
    contrastErrors.forEach((error) => console.error(`   - ${error}`));
    process.exit(1);
  }
  console.log("✅ All color tokens pass WCAG AA contrast requirements\n");

  // Step 5: Run Style Dictionary transformation
  console.log("🔧 Running Style Dictionary transformation...");
  try {
    const sd = new StyleDictionary(
      "src/infrastructure/design-tokens/style-dictionary.config.js",
    );
    await sd.buildAllPlatforms();
    console.log("✅ Style Dictionary transformation complete\n");
  } catch (error) {
    console.error(
      "❌ Style Dictionary transformation failed:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }

  console.log("🎉 Design token build complete!");
  console.log("   Generated files:");
  console.log("   - src/infrastructure/design-tokens/tailwind-tokens.cjs");
  console.log("   - src/infrastructure/design-tokens/css-variables.css");
}

main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
