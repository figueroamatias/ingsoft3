import { describe, expect, it } from "vitest";
import { formatPercentage } from "../src/utils/format-percentage.js";

describe("formatPercentage", () => {
  it.each([
    [25.126, "25,13%"],
    ["10", "10%"],
  ])("formatea %j como %s", (value, expected) => {
    expect(formatPercentage(value)).toBe(expected);
  });

  it("rechaza valores no numericos", () => {
    expect(() => formatPercentage("abc")).toThrow(
      "El porcentaje debe ser numérico.",
    );
  });
});
