/** Category chips used on the student event feed. */
export const EVENT_CATEGORIES = ["All", "Tech", "Sports", "Social", "Academic"];

const CATEGORY_STYLES = {
  Tech: "bg-sky-100 text-sky-800",
  Sports: "bg-emerald-100 text-emerald-800",
  Social: "bg-amber-100 text-amber-900",
  Academic: "bg-indigo-100 text-indigo-800",
};

export function getCategoryBadgeClass(category) {
  return CATEGORY_STYLES[category] ?? "bg-gray-100 text-gray-700";
}

/**
 * Normalises backend event payloads so the UI can rely on one shape.
 * Backend Event currently exposes eventId, name, dateTime, venue, organizer, maxAttendees.
 * Category / spots may arrive later — helpers stay defensive.
 */
export function normalizeEvent(raw) {
  if (!raw || typeof raw !== "object") return null;

  const id = raw.eventId ?? raw.id;
  if (id == null) return null;

  const venueName =
    raw.venue?.venueName ??
    raw.venue?.name ??
    raw.venueName ??
    (typeof raw.venue === "string" ? raw.venue : "") ??
    "";

  const campus =
    raw.venue?.campus ??
    raw.venue?.address ??
    raw.campus ??
    "";

  const organizerName =
    raw.organizer?.name ??
    raw.organizerName ??
    (typeof raw.organizer === "string" ? raw.organizer : "") ??
    "Organizer TBA";

  // Prefer real remaining-spot fields. Do not treat maxAttendees as remaining.
  const spotsRemaining =
    raw.spotsRemaining ?? raw.availableSpots ?? null;

  return {
    id,
    name: raw.name ?? raw.eventName ?? "Untitled event",
    dateTime: raw.dateTime ?? raw.date ?? null,
    venue: venueName || "Venue TBA",
    campus: campus || "",
    organizer: organizerName,
    category: raw.category ?? "Social",
    spotsRemaining,
    maxAttendees: raw.maxAttendees ?? null,
    status: raw.status ?? null,
  };
}

export function getEventIdFromBooking(booking) {
  if (!booking) return null;
  return (
    booking.eventId ??
    booking.event?.eventId ??
    booking.event?.id ??
    null
  );
}
