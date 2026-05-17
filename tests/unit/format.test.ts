import { describe, expect, it } from "vitest";
import {
  formatCurrencyFromCents,
  formatDate,
  formatRelative,
} from "../../lib/format";

describe("formatCurrencyFromCents", () => {
  it("formats whole dollars", () => {
    expect(formatCurrencyFromCents(0)).toBe("$0.00");
    expect(formatCurrencyFromCents(100)).toBe("$1.00");
  });

  it("formats partial dollars", () => {
    expect(formatCurrencyFromCents(1299)).toBe("$12.99");
    expect(formatCurrencyFromCents(4499)).toBe("$44.99");
  });
});

describe("formatDate", () => {
  it("returns em dash for null", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
  });

  it("formats a date", () => {
    // Use a fixed UTC date; Intl output is locale-dependent so we just check
    // it contains the year.
    expect(formatDate(new Date("2026-05-17T12:00:00Z"))).toMatch(/2026/);
  });
});

describe("formatRelative", () => {
  const now = new Date("2026-05-17T12:00:00Z");

  it("describes today, tomorrow, and yesterday", () => {
    expect(formatRelative(now, now)).toBe("Due today");
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(formatRelative(tomorrow, now)).toBe("Due tomorrow");
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatRelative(yesterday, now)).toBe("1 day overdue");
  });

  it("falls back for missing dates", () => {
    expect(formatRelative(null, now)).toBe("No due date");
  });

  it("counts multi-day offsets", () => {
    const inThreeDays = new Date(now);
    inThreeDays.setDate(inThreeDays.getDate() + 3);
    expect(formatRelative(inThreeDays, now)).toBe("Due in 3 days");
    const overdueFive = new Date(now);
    overdueFive.setDate(overdueFive.getDate() - 5);
    expect(formatRelative(overdueFive, now)).toBe("5 days overdue");
  });
});
