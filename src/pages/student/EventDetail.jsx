import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvent } from "../../api/events";
import { createBooking, getMyBookings } from "../../api/bookings";
import { formatEventDate } from "../../lib/formatDate";
import {
  getCategoryBadgeClass,
  getCategoryBannerClass,
  getEventIdFromBooking,
  normalizeEvent,
} from "../../lib/eventHelpers";

/**
 * Student event detail: /student/events/:id
 * Fetches GET /api/events/{id}, shows banner + details, books via POST /api/bookings.
 */
export default function EventDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const {
    data: rawEvent,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id),
    enabled: Boolean(id),
  });

  const { data: rawBookings } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });

  const event = useMemo(() => normalizeEvent(rawEvent), [rawEvent]);

  const isBooked = useMemo(() => {
    if (!event) return false;
    const list = Array.isArray(rawBookings) ? rawBookings : [];
    return list.some(
      (booking) => String(getEventIdFromBooking(booking)) === String(event.id)
    );
  }, [rawBookings, event]);

  const bookingMutation = useMutation({
    mutationFn: () => createBooking(event.id),
    onMutate: () => {
      setActionError("");
      setActionSuccess("");
    },
    onSuccess: () => {
      setActionSuccess("Booked ✓ Your ticket is in My Bookings.");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Could not book this event. Please try again.";
      setActionError(message);
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8f8f7] font-sans text-[#161616]">
        <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-12">
          <div className="mb-6 h-4 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
          <div className="mt-6 space-y-3">
            <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#f8f8f7] font-sans text-[#161616]">
        <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-12">
          <Link
            to="/student"
            className="text-sm font-semibold text-[#087dbb] hover:underline"
          >
            ← Back to events
          </Link>
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <p className="font-semibold">Could not load this event</p>
            <p className="mt-1">
              {error?.response?.data?.message ||
                error?.message ||
                "Check that the UniVent API is running, then try again."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 font-semibold text-[#087dbb] underline"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-[#f8f8f7] font-sans text-[#161616]">
        <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-12">
          <Link
            to="/student"
            className="text-sm font-semibold text-[#087dbb] hover:underline"
          >
            ← Back to events
          </Link>
          <p className="mt-6 text-gray-600">Event not found.</p>
        </div>
      </main>
    );
  }

  const spots =
    typeof event.spotsRemaining === "number" ? event.spotsRemaining : null;
  const capacity =
    typeof event.maxAttendees === "number" && event.maxAttendees > 0
      ? event.maxAttendees
      : null;
  const isFull = spots !== null && spots <= 0;
  const taken =
    capacity !== null && spots !== null ? Math.max(capacity - spots, 0) : null;
  const fillPercent =
    capacity !== null && taken !== null
      ? Math.min(100, Math.round((taken / capacity) * 100))
      : null;

  const alreadyBooked = isBooked || Boolean(actionSuccess);
  const bookDisabled = alreadyBooked || isFull || bookingMutation.isPending;

  let bookLabel = "Book Ticket";
  if (bookingMutation.isPending) bookLabel = "Booking...";
  else if (alreadyBooked) bookLabel = "Booked ✓";
  else if (isFull) bookLabel = "Full";

  return (
    <main className="min-h-screen bg-[#f8f8f7] font-sans text-[#161616]">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-12">
        <Link
          to="/student"
          className="inline-flex text-sm font-semibold text-[#087dbb] hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#087dbb]/20"
        >
          ← Back to events
        </Link>

        <section
          className={`mt-6 rounded-2xl bg-gradient-to-br p-6 text-white shadow-[0_8px_24px_rgba(8,125,187,0.18)] sm:p-8 ${getCategoryBannerClass(event.category)}`}
          aria-labelledby="event-detail-title"
        >
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getCategoryBadgeClass(event.category)}`}
          >
            {event.category}
          </span>
          <h1
            id="event-detail-title"
            className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl"
          >
            {event.name}
          </h1>
          <p className="mt-3 text-base text-white/90">
            {formatEventDate(event.dateTime)}
          </p>
          <p className="mt-1 text-base text-white/90">
            {event.venue}
            {event.campus ? ` · ${event.campus}` : ""}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-[#dedede] bg-white p-5 shadow-[0_2px_5px_rgba(0,0,0,0.04)] sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-gray-500">
            Organizer
          </h2>
          <p className="mt-2 text-base font-semibold text-[#161616]">
            {event.organizer}
          </p>
          {event.organizerEmail ? (
            <a
              href={`mailto:${event.organizerEmail}`}
              className="mt-1 inline-block text-sm text-[#087dbb] hover:underline"
            >
              {event.organizerEmail}
            </a>
          ) : (
            <p className="mt-1 text-sm text-gray-500">No contact email listed</p>
          )}

          <h2 className="mt-6 text-sm font-bold uppercase tracking-[0.08em] text-gray-500">
            About this event
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-gray-700">
            {event.description?.trim()
              ? event.description
              : "No description provided for this event yet."}
          </p>

          <h2 className="mt-6 text-sm font-bold uppercase tracking-[0.08em] text-gray-500">
            Availability
          </h2>
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-[#161616]">
                {spots === null
                  ? "Spots info soon"
                  : spots <= 0
                    ? "No spots left"
                    : `${spots} spot${spots === 1 ? "" : "s"} remaining`}
              </span>
              {capacity !== null && (
                <span className="text-gray-500">Capacity {capacity}</span>
              )}
            </div>
            <div
              className="h-3 overflow-hidden rounded-full bg-gray-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={fillPercent ?? 0}
              aria-label="Event capacity filled"
            >
              <div
                className={`h-full rounded-full transition-all ${
                  isFull ? "bg-gray-400" : "bg-[#087dbb]"
                }`}
                style={{ width: `${fillPercent ?? 0}%` }}
              />
            </div>
          </div>

          {actionError && (
            <div
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {actionError}
            </div>
          )}

          {actionSuccess && (
            <div
              className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              role="status"
            >
              {actionSuccess}
            </div>
          )}

          <button
            type="button"
            onClick={() => bookingMutation.mutate()}
            disabled={bookDisabled}
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-[#087dbb] px-4 text-base font-bold text-white transition hover:bg-[#066a9f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#087dbb]/20 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
          >
            {bookLabel}
          </button>
        </section>
      </div>
    </main>
  );
}
