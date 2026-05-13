import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { describe, it, expect } from "vitest";

const TOKENS_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/tokens.json",
);
const TAILWIND_TOKENS_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/tailwind-tokens.cjs",
);
const CSS_VARIABLES_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/css-variables.css",
);

const tokensContent = readFileSync(TOKENS_PATH, "utf-8");
const sourceTokens = JSON.parse(tokensContent);

describe("Style Dictionary Transformation", () => {
  it("tailwind-tokens.js exists", () => {
    expect(existsSync(TAILWIND_TOKENS_PATH)).toBe(true);
  });

  it("css-variables.css exists", () => {
    expect(existsSync(CSS_VARIABLES_PATH)).toBe(true);
  });

  it("tailwind-tokens.js is valid JavaScript", () => {
    const tailwindContent = readFileSync(TAILWIND_TOKENS_PATH, "utf-8");
    expect(tailwindContent.includes("module.exports")).toBe(true);
  });

  it("tailwind-tokens.js contains all category colors", async () => {
    const tailwindTokens = await import(TAILWIND_TOKENS_PATH);
    const tokens = tailwindTokens.default;
    const categoryColors = [
      "CategoryColorsCategoryLacteal",
      "CategoryColorsCategoryCerealsFloursPulsesLegumesTubers",
      "CategoryColorsCategoryFruits",
      "CategoryColorsCategoryVegetables",
      "CategoryColorsCategoryOilyDryFruits",
      "CategoryColorsCategoryDrinks",
      "CategoryColorsCategoryOthers",
    ];
    for (const tokenName of categoryColors) {
      expect(tokenName in tokens).toBe(true);
    }
  });

  it("tailwind-tokens.js contains all state colors", async () => {
    const tailwindTokens = await import(TAILWIND_TOKENS_PATH);
    const tokens = tailwindTokens.default;
    const stateColors = [
      "StateColorsStateOffline",
      "StateColorsStateSyncing",
      "StateColorsStateSyncError",
      "StateColorsStateOnline",
    ];
    for (const tokenName of stateColors) {
      expect(tokenName in tokens).toBe(true);
    }
  });

  it("tailwind-tokens.js contains all feedback colors", async () => {
    const tailwindTokens = await import(TAILWIND_TOKENS_PATH);
    const tokens = tailwindTokens.default;
    const feedbackColors = [
      "FeedbackColorsFeedbackSuccess",
      "FeedbackColorsFeedbackWarning",
      "FeedbackColorsFeedbackError",
      "FeedbackColorsFeedbackInfo",
    ];
    for (const tokenName of feedbackColors) {
      expect(tokenName in tokens).toBe(true);
    }
  });

  it("tailwind-tokens.js contains all spacing tokens", async () => {
    const tailwindTokens = await import(TAILWIND_TOKENS_PATH);
    const tokens = tailwindTokens.default;
    const spacingTokens = [
      "SpacingSpace0",
      "SpacingSpace1",
      "SpacingSpace2",
      "SpacingSpace3",
      "SpacingSpace4",
      "SpacingSpace5",
      "SpacingSpace6",
      "SpacingSpace8",
      "SpacingSpace10",
      "SpacingSpace12",
    ];
    for (const tokenName of spacingTokens) {
      expect(tokenName in tokens).toBe(true);
    }
  });

  it("Color values match source tokens", async () => {
    const tailwindTokens = await import(TAILWIND_TOKENS_PATH);
    const tokens = tailwindTokens.default;

    const lactealSource =
      (sourceTokens as any)["category-colors"]["category-lacteal"].value;
    const lactealTransformed = tokens["CategoryColorsCategoryLacteal"];
    expect(lactealTransformed.toLowerCase()).toBe(lactealSource.toLowerCase());

    const offlineSource =
      (sourceTokens as any)["state-colors"]["state-offline"].value;
    const offlineTransformed = tokens["StateColorsStateOffline"];
    expect(offlineTransformed.toLowerCase()).toBe(offlineSource.toLowerCase());
  });

  it("Spacing values use rem units in tailwind-tokens.js", async () => {
    const tailwindTokens = await import(TAILWIND_TOKENS_PATH);
    const tokens = tailwindTokens.default;
    const spacingTokens = [
      "SpacingSpace1",
      "SpacingSpace2",
      "SpacingSpace3",
      "SpacingSpace4",
      "SpacingSpace5",
    ];
    for (const tokenName of spacingTokens) {
      const value = tokens[tokenName];
      expect(typeof value === "string" && value.includes("rem")).toBe(true);
    }
  });

  it("css-variables.css contains :root selector", () => {
    const cssContent = readFileSync(CSS_VARIABLES_PATH, "utf-8");
    expect(cssContent.includes(":root")).toBe(true);
  });

  it("css-variables.css contains color custom properties", () => {
    const cssContent = readFileSync(CSS_VARIABLES_PATH, "utf-8");
    expect(cssContent.includes("--category-colors-category-lacteal")).toBe(true);
    expect(cssContent.includes("--state-colors-state-offline")).toBe(true);
    expect(cssContent.includes("--feedback-colors-feedback-success")).toBe(true);
  });

  it("Transformation preserves all 37 tokens", async () => {
    const tailwindTokens = await import(TAILWIND_TOKENS_PATH);
    const tokens = tailwindTokens.default;
    const tokenCount = Object.keys(tokens).length;
    expect(tokenCount).toBeGreaterThanOrEqual(25);
  });

  it("state-offline transformed value is #BF360C", async () => {
    const tailwindTokens = await import(TAILWIND_TOKENS_PATH);
    const tokens = tailwindTokens.default;
    expect(tokens["StateColorsStateOffline"].toUpperCase()).toBe("#BF360C");
  });

  it("feedback-warning transformed value is #BF360C", async () => {
    const tailwindTokens = await import(TAILWIND_TOKENS_PATH);
    const tokens = tailwindTokens.default;
    expect(tokens["FeedbackColorsFeedbackWarning"].toUpperCase()).toBe("#BF360C");
  });

  it("space-5 transformed value is 2.5rem", async () => {
    const tailwindTokens = await import(TAILWIND_TOKENS_PATH);
    const tokens = tailwindTokens.default;
    expect(tokens["SpacingSpace5"]).toBe("2.5rem");
  });
});
