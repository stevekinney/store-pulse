import { describe, expect, it } from "vitest";
import {
  parseProductCategory,
  parseStoreStatus,
  parseTaskPriority,
  parseTaskStatus,
} from "../../lib/types";

describe("parsers", () => {
  it("accept valid values", () => {
    expect(parseStoreStatus("OPEN")).toBe("OPEN");
    expect(parseProductCategory("FOOD")).toBe("FOOD");
    expect(parseTaskPriority("URGENT")).toBe("URGENT");
    expect(parseTaskStatus("IN_PROGRESS")).toBe("IN_PROGRESS");
  });

  it("reject invalid, empty, and non-string values", () => {
    expect(parseStoreStatus("open")).toBeNull(); // case-sensitive
    expect(parseProductCategory("")).toBeNull();
    expect(parseTaskPriority(undefined)).toBeNull();
    expect(parseTaskStatus(null)).toBeNull();
    expect(parseStoreStatus(["OPEN"])).toBeNull(); // arrays are rejected
    expect(parseProductCategory(123)).toBeNull();
  });
});
