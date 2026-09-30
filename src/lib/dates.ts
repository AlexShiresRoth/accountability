import type { DatePrecision } from "./enums";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Formats a YYYY-MM-DD date at the precision the source supports.
 * Never shows more precision than was recorded (a year-only date is never rendered as January 1).
 * Parsed as plain text, so time zones can't shift the day.
 */
export function formatDate(value: string, precision: DatePrecision = "day"): string {
  const [y, m, d] = value.split("-").map(Number);
  switch (precision) {
    case "year":
      return String(y);
    case "approximate":
      return `circa ${y}`;
    case "month":
      return `${MONTHS[m - 1]} ${y}`;
    case "day":
      return `${MONTHS[m - 1]} ${d}, ${y}`;
  }
}
