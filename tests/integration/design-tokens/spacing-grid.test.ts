import { readFileSync } from "fs";
import { join } from "path";
import { describe, it, expect } from "vitest";

const TOKENS_PATH = join(
  process.cwd(),
  "src/infrastructure/design-tokens/tokens.json",
);

const content = readFileSync(TOKENS_PATH, "utf-8");
const tokens = JSON.parse(content);
const spacing: Record<string, any> = (tokens as any)["spacing"];

function parseRem(value: string): number {
  return parseFloat(value);
}

describe("Spacing Grid Validation", () => {
  it("space-0 is exactly 0px", () => {
    const space0 = spacing["space-0"];
    expect(space0.$extensions.pixelValue).toBe(0);
    expect(parseRem(space0.value)).toBe(0);
    expect(space0.$extensions.gridFactor).toBe(0);
  });

  it("space-1 is 8px (1 grid unit)", () => {
    const space1 = spacing["space-1"];
    expect(space1.$extensions.pixelValue).toBe(8);
    expect(parseRem(space1.value)).toBe(0.5);
    expect(space1.$extensions.gridFactor).toBe(1);
  });

  it("space-2 is 16px (2 grid units)", () => {
    const space2 = spacing["space-2"];
    expect(space2.$extensions.pixelValue).toBe(16);
    expect(parseRem(space2.value)).toBe(1);
    expect(space2.$extensions.gridFactor).toBe(2);
  });

  it("space-5 is 40px (minimum for touch targets)", () => {
    const space5 = spacing["space-5"];
    expect(space5.$extensions.pixelValue).toBe(40);
    expect(parseRem(space5.value)).toBe(2.5);
    expect(space5.$extensions.gridFactor).toBe(5);
    expect(space5.$extensions.pixelValue).toBeGreaterThanOrEqual(40);
  });

  it("All spacing tokens (except space-0) are multiples of 8px", () => {
    const spacingTokens = Object.entries(spacing);
    for (const [tokenName, token] of spacingTokens) {
      if (tokenName !== "space-0") {
        expect(token.$extensions.pixelValue % 8).toBe(0);
      }
    }
  });

  it("All spacing tokens have correct gridFactor", () => {
    const spacingTokens = Object.entries(spacing);
    for (const [, token] of spacingTokens) {
      const expectedGridFactor = token.$extensions.pixelValue / 8;
      expect(token.$extensions.gridFactor).toBe(expectedGridFactor);
    }
  });

  it("All spacing tokens have correct rem conversion (1rem = 16px)", () => {
    const spacingTokens = Object.entries(spacing);
    for (const [, token] of spacingTokens) {
      const expectedRem = token.$extensions.pixelValue / 16;
      expect(parseRem(token.value)).toBe(expectedRem);
    }
  });

  it("Spacing scale increases monotonically", () => {
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
      expect(currToken.$extensions.pixelValue).toBeGreaterThan(
        prevToken.$extensions.pixelValue,
      );
    }
  });

  it("space-12 is maximum spacing (96px)", () => {
    const space12 = spacing["space-12"];
    expect(space12.$extensions.pixelValue).toBe(96);
    expect(parseRem(space12.value)).toBe(6);
    expect(space12.$extensions.gridFactor).toBe(12);
  });

  it("Exactly 10 spacing tokens exist", () => {
    const spacingTokens = Object.keys(spacing);
    expect(spacingTokens.length).toBe(10);
  });

  it('All spacing tokens have type "dimension"', () => {
    const spacingTokens = Object.entries(spacing);
    for (const [tokenName, token] of spacingTokens) {
      expect(token.type).toBe("dimension");
    }
  });

  it("space-6 is 48px (comfortable touch target)", () => {
    const space6 = spacing["space-6"];
    expect(space6.$extensions.pixelValue).toBe(48);
    expect(space6.$extensions.pixelValue).toBeGreaterThanOrEqual(44);
  });
});
