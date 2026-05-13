import { readFileSync } from "fs";
import { join } from "path";
import { describe, it, expect } from "vitest";
import { validateTokenSchema } from "../../../src/infrastructure/design-tokens/validate-schema";

const TOKENS_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/tokens.json",
);

function loadTokens(): unknown {
  const content = readFileSync(TOKENS_PATH, "utf-8");
  return JSON.parse(content);
}

describe("Token Schema Validation", () => {
  it("tokens.json exists and is valid JSON", () => {
    const content = readFileSync(TOKENS_PATH, "utf-8");
    const tokens = JSON.parse(content);
    expect(typeof tokens).toBe("object");
    expect(tokens).not.toBeNull();
  });

  it("tokens.json passes schema validation", () => {
    const tokens = loadTokens();
    expect(() => validateTokenSchema(tokens)).not.toThrow();
  });

  it("All required token categories exist", () => {
    const tokens = loadTokens() as Record<string, unknown>;
    const requiredCategories = [
      "category-colors",
      "state-colors",
      "feedback-colors",
      "typography",
      "spacing",
    ];
    for (const category of requiredCategories) {
      expect(category in tokens).toBe(true);
    }
  });

  it("Category colors have correct structure", () => {
    const tokens = loadTokens() as Record<string, any>;
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
      expect(tokenName in categoryColors).toBe(true);
      const token = categoryColors[tokenName];
      expect(token.type).toBe("color");
      expect(/^#[0-9A-Fa-f]{6}$/.test(token.value)).toBe(true);
    }
  });

  it("State colors have correct structure", () => {
    const tokens = loadTokens() as Record<string, any>;
    const stateColors = tokens["state-colors"];

    const requiredTokens = [
      "state-offline",
      "state-syncing",
      "state-sync-error",
      "state-online",
    ];

    for (const tokenName of requiredTokens) {
      expect(tokenName in stateColors).toBe(true);
      const token = stateColors[tokenName];
      expect(token.type).toBe("color");
      expect(/^#[0-9A-Fa-f]{6}$/.test(token.value)).toBe(true);
    }
  });

  it("Feedback colors have correct structure", () => {
    const tokens = loadTokens() as Record<string, any>;
    const feedbackColors = tokens["feedback-colors"];

    const requiredTokens = [
      "feedback-success",
      "feedback-warning",
      "feedback-error",
      "feedback-info",
    ];

    for (const tokenName of requiredTokens) {
      expect(tokenName in feedbackColors).toBe(true);
      const token = feedbackColors[tokenName];
      expect(token.type).toBe("color");
      expect(/^#[0-9A-Fa-f]{6}$/.test(token.value)).toBe(true);
    }
  });

  it("Typography tokens have correct structure", () => {
    const tokens = loadTokens() as Record<string, any>;
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
      expect(tokenName in typography).toBe(true);
      const token = typography[tokenName];
      expect(token.type).toBe("typography");
      expect("fontSize" in token.value).toBe(true);
      expect("lineHeight" in token.value).toBe(true);
      expect("fontWeight" in token.value).toBe(true);
    }
  });

  it("Spacing tokens have correct structure", () => {
    const tokens = loadTokens() as Record<string, any>;
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
      expect(tokenName in spacing).toBe(true);
      const token = spacing[tokenName];
      expect(token.type).toBe("dimension");
      expect(typeof token.value).toBe("string");
      expect(token.$extensions).toBeDefined();
      expect(typeof token.$extensions.pixelValue).toBe("number");
      expect(typeof token.$extensions.gridFactor).toBe("number");
    }
  });

  it("All color tokens have theme specified", () => {
    const tokens = loadTokens() as Record<string, any>;
    const colorCategories = [
      "category-colors",
      "state-colors",
      "feedback-colors",
    ];

    for (const category of colorCategories) {
      const colorTokens = tokens[category];
      for (const [tokenName, token] of Object.entries(colorTokens)) {
        expect(token).toHaveProperty("theme");
        expect(["light", "dark"]).toContain((token as any).theme);
      }
    }
  });

  it("All tokens have descriptions", () => {
    const tokens = loadTokens() as Record<string, any>;
    const allCategories = Object.values(tokens);

    for (const category of allCategories) {
      if (typeof category === "object" && category !== null) {
        for (const [tokenName, token] of Object.entries(category)) {
          expect(token).toHaveProperty("description");
          expect(typeof (token as any).description).toBe("string");
          expect((token as any).description.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
