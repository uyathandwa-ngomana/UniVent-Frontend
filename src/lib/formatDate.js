/**
 * Formats an ISO / LocalDateTime-style string for display.
 * Falls back to the original string if parsing fails.
 */
export function formatEventDate(dateTime) {
  if (!dateTime) return "Date TBA";

  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return String(dateTime);

  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
