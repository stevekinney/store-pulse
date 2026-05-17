import { describe, expect, it } from "vitest";
import { isLowStock, lowStockSeverity } from "../../lib/inventory";

describe("isLowStock", () => {
  it.each([
    { onHand: 0, onOrder: 0, threshold: 5, expected: true },
    { onHand: 4, onOrder: 0, threshold: 5, expected: true },
    { onHand: 5, onOrder: 0, threshold: 5, expected: true }, // boundary
    { onHand: 6, onOrder: 0, threshold: 5, expected: false },
    { onHand: 2, onOrder: 3, threshold: 5, expected: true }, // sum equals threshold
    { onHand: 2, onOrder: 4, threshold: 5, expected: false },
    { onHand: 100, onOrder: 0, threshold: 1, expected: false },
  ])(
    "onHand=$onHand onOrder=$onOrder threshold=$threshold => $expected",
    ({ onHand, onOrder, threshold, expected }) => {
      expect(
        isLowStock({ quantityOnHand: onHand, quantityOnOrder: onOrder }, threshold),
      ).toBe(expected);
    },
  );
});

describe("lowStockSeverity", () => {
  it("divides total stock by threshold", () => {
    expect(
      lowStockSeverity({ quantityOnHand: 5, quantityOnOrder: 0 }, 10),
    ).toBe(0.5);
  });

  it("uses min denominator of 1 when threshold is 1", () => {
    expect(
      lowStockSeverity({ quantityOnHand: 0, quantityOnOrder: 0 }, 1),
    ).toBe(0);
    expect(
      lowStockSeverity({ quantityOnHand: 2, quantityOnOrder: 0 }, 1),
    ).toBe(2);
  });
});
