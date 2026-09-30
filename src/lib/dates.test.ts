import { describe, expect, it } from "vitest";
import { formatDate } from "./dates";

describe("formatDate", () => {
  it("never shows more precision than was recorded", () => {
    expect(formatDate("2022-01-01", "year")).toBe("2022");
    expect(formatDate("2022-01-01", "approximate")).toBe("circa 2022");
    expect(formatDate("2024-03-01", "month")).toBe("March 2024");
    expect(formatDate("2024-03-01", "day")).toBe("March 1, 2024");
  });

  it("is not shifted by time zones", () => {
    expect(formatDate("2024-01-01")).toBe("January 1, 2024");
    expect(formatDate("2024-12-31")).toBe("December 31, 2024");
  });
});
