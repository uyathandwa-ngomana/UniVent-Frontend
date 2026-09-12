import { Link } from "react-router-dom";
import { formatEventDate } from "../../lib/formatDate";
import { getCategoryBadgeClass } from "../../lib/eventHelpers";

/**
 * Reusable event card for the student feed.
 * Booking is delegated to the parent via onBook(eventId).
 */
export default function EventCard({
  event,
  onBook,
  isBooked = false,
  isBooking = false,
}) {
  if (!event) return null;

  const spots =
    typeof event.spotsRemaining === "number" ? event.spotsRemaining : null;
  const isFull = spots !== null && spots <= 0;
  const bookDisabled = isBooked || isFull || isBooking;

  let bookLabel = "Book";
  if (isBooking) bookLabel = "Booking...";
  else if (isBooked) bookLabel = "Booked ✓";
  else if (isFull) bookLabel = "Full";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#dedede] bg-white p-5 shadow-[0_2px_5px_rgba(0,0,0,0.04)] transition hover:border-[#087dbb]/40 hover:shadow-[0_4px_14px_rgba(8,125,187,0.08)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getCategoryBadgeClass(event.category)}`}
        >
          {event.category}
        </span>
      </div>

      <h3 className="text-lg font-bold leading-snug tracking-tight text-[#161616]">
        <Link
          to={`/student/events/${event.id}`}
          className="hover:text-[#087dbb] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#087dbb]/20"
        >
          {event.name}
        </Link>
      </h3>

      <dl className="mt-3 space-y-1.5 text-sm text-gray-600">
        <div>
          <dt className="sr-only">Date</dt>
          <dd>{formatEventDate(event.dateTime)}</dd>
        </div>
        <div>
          <dt className="sr-only">Venue</dt>
          <dd>
            {event.venue}
            {event.campus ? ` · ${event.campus}` : ""}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Organizer</dt>
          <dd>{event.organizer}</dd>
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <p className="text-sm text-gray-500">
          {spots === null
            ? "Spots info soon"
            : spots <= 0
              ? "No spots left"
              : `${spots} spot${spots === 1 ? "" : "s"} left`}
        </p>

        <button
          type="button"
          onClick={() => onBook?.(event.id)}
          disabled={bookDisabled}
          className="min-h-11 rounded-lg bg-[#087dbb] px-4 text-sm font-bold text-white transition hover:bg-[#066a9f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#087dbb]/20 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
        >
          {bookLabel}
        </button>
      </div>
    </article>
  );
}
