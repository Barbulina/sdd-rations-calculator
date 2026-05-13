import { readFileSync } from "fs";
import { join } from "path";
import { describe, it, expect } from "vitest";
import { validateTokenContrast } from "../../../src/infrastructure/design-tokens/validate-contrast";

const TOKENS_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/tokens.json",
);

const content = readFileSync(TOKENS_PATH, "utf-8");
const tokens = JSON.parse(content);

describe("Contrast Validation", () => {
  it("All category colors meet WCAG AA (light theme)", () => {
    const categoryColors = (tokens as any)["category-colors"];
    for (const [tokenName, token] of Object.entries(categoryColors)) {
      const tokenData = token as any;
      if (tokenData.theme === "light") {
        const validation = validateTokenContrast(tokenData.value, "light");
        expect(validation.passes).toBe(true);
      }
    }
  });

  it("All state colors meet WCAG AA (light theme)", () => {
    const stateColors = (tokens as any)["state-colors"];
    for (const [tokenName, token] of Object.entries(stateColors)) {
      const tokenData = token as any;
      if (tokenData.theme === "light") {
        const validation = validateTokenContrast(tokenData.value, "light");
        expect(validation.passes).toBe(true);
      }
    }
  });

  it("All feedback colors meet WCAG AA (light theme)", () => {
    const feedbackColors = (tokens as any)["feedback-colors"];
    for (const [tokenName, token] of Object.entries(feedbackColors)) {
      const tokenData = token as any;
      if (tokenData.theme === "light") {
        const validation = validateTokenContrast(tokenData.value, "light");
        expect(validation.passes).toBe(true);
      }
    }
  });

  it("All color tokens meet 4.5:1 minimum for normal text", () => {
    const colorCategories = [
      "category-colors",
      "state-colors",
      "feedback-colors",
    ];

    for (const category of colorCategories) {
      const colorTokens = (tokens as any)[category];
      for (const [tokenName, token] of Object.entries(colorTokens)) {
        const tokenData = token as any;
        if (tokenData.theme === "light") {
          const validation = validateTokenContrast(
            tokenData.value,
            "light",
            "normal",
          );
          expect(validation.ratio).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it("state-offline has sufficient contrast (regression)", () => {
    const stateOffline = (tokens as any)["state-colors"]["state-offline"];
    const validation = validateTokenContrast(stateOffline.value, "light");
    expect(validation.ratio).toBeGreaterThanOrEqual(4.5);
    expect(stateOffline.value).toBe("#BF360C");
  });

  it("feedback-warning has sufficient contrast (regression)", () => {
    const feedbackWarning =
      (tokens as any)["feedback-colors"]["feedback-warning"];
    const validation = validateTokenContrast(feedbackWarning.value, "light");
    expect(validation.ratio).toBeGreaterThanOrEqual(4.5);
    expect(feedbackWarning.value).toBe("#BF360C");
  });

  it("At least 3 tokens achieve AAA contrast (7:1+)", () => {
    const colorCategories = [
      "category-colors",
      "state-colors",
      "feedback-colors",
    ];
    let aaaCount = 0;

    for (const category of colorCategories) {
      const colorTokens = (tokens as any)[category];
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

    expect(aaaCount).toBeGreaterThanOrEqual(3);
  });

  it("No color token has contrast below 4.5:1", () => {
    const colorCategories = [
      "category-colors",
      "state-colors",
      "feedback-colors",
    ];
    const failures: string[] = [];

    for (const category of colorCategories) {
      const colorTokens = (tokens as any)[category];
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

    expect(failures.length).toBe(0);
  });

  it("category-others achieves highest contrast (>= 9:1)", () => {
    const categoryOthers =
      (tokens as any)["category-colors"]["category-others"];
    const validation = validateTokenContrast(categoryOthers.value, "light");
    expect(validation.ratio).toBeGreaterThanOrEqual(9.0);
  });

  it("All validation results include WCAG level", () => {
    const colorCategories = [
      "category-colors",
      "state-colors",
      "feedback-colors",
    ];

    for (const category of colorCategories) {
      const colorTokens = (tokens as any)[category];
      for (const [tokenName, token] of Object.entries(colorTokens)) {
        const tokenData = token as any;
        if (tokenData.theme === "light") {
          const validation = validateTokenContrast(tokenData.value, "light");
          expect(["AA", "AAA"]).toContain(validation.level);
        }
      }
    }
  });
});
