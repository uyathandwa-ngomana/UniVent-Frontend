import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvents } from "../../api/events";
import { createBooking, getMyBookings } from "../../api/bookings";
import { useAuth } from "../../hooks/useAuth";
import EventCard from "../../components/shared/EventCard";
import EventCardSkeleton from "../../components/shared/EventCardSkeleton";
import EmptyState from "../../components/shared/EmptyState";
import {
  EVENT_CATEGORIES,
  getEventIdFromBooking,
  normalizeEvent,
} from "../../lib/eventHelpers";

/**
 * Student home: /student
 * Fetches events with React Query, filters by category + search, books via API.
 */
export default function StudentEventFeed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [bookingEventId, setBookingEventId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const {
    data: rawEvents,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const { data: rawBookings } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });

  const bookedEventIds = useMemo(() => {
    const list = Array.isArray(rawBookings) ? rawBookings : [];
    return new Set(
      list
        .map(getEventIdFromBooking)
        .filter((id) => id != null)
        .map(String)
    );
  }, [rawBookings]);

  const events = useMemo(() => {
    const list = Array.isArray(rawEvents) ? rawEvents : [];
    return list.map(normalizeEvent).filter(Boolean);
  }, [rawEvents]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory =
        category === "All" ||
        event.category?.toLowerCase() === category.toLowerCase();
      const matchesSearch =
        !query || event.name.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [events, category, search]);

  const bookingMutation = useMutation({
    mutationFn: (eventId) => createBooking(eventId),
    onMutate: (eventId) => {
      setBookingEventId(eventId);
      setActionError("");
      setActionSuccess("");
    },
    onSuccess: () => {
      setActionSuccess("Booking confirmed. Check My Bookings for your ticket.");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Could not book this event. Please try again.";
      setActionError(message);
    },
    onSettled: () => {
      setBookingEventId(null);
    },
  });

  const clearFilters = () => {
    setCategory("All");
    setSearch("");
  };

  const filtersActive = Boolean(search.trim()) || category !== "All";

  return (
    <main className="min-h-screen bg-[#f8f8f7] font-sans text-[#161616]">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#087dbb]">
            UniVent
          </p>
          <h1 className="text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
            Campus events
          </h1>
          <p className="mt-2.5 max-w-2xl text-base leading-6 text-gray-500">
            {user?.name
              ? `Hi ${user.name.split(" ")[0]} — discover and book upcoming CPUT events.`
              : "Discover and book upcoming CPUT events."}
          </p>
        </header>

        <section
          className="mb-8 grid gap-4 sm:mb-10"
          aria-label="Search and filter events"
        >
          <label className="grid gap-2.5">
            <span className="font-semibold">Search events</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event name"
              className="h-14 w-full rounded-lg border border-[#dedede] bg-white px-4 text-base text-[#161616] shadow-[0_2px_5px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[#929292] focus:border-[#087dbb] focus:ring-4 focus:ring-[#087dbb]/20"
            />
          </label>

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by category"
          >
            {EVENT_CATEGORIES.map((item) => {
              const selected = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={selected}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#087dbb]/20 ${
                    selected
                      ? "bg-[#087dbb] text-white"
                      : "border border-[#dedede] bg-white text-gray-700 hover:border-[#087dbb]/50"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {actionError && (
          <div
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {actionError}
          </div>
        )}

        {actionSuccess && (
          <div
            className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            role="status"
          >
            {actionSuccess}
          </div>
        )}

        {isError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <p className="font-semibold">Could not load events</p>
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
        )}

        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            aria-busy="true"
            aria-label="Loading events"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon="🔎"
            title="No events found"
            message={
              filtersActive
                ? "Try a different search term or category filter."
                : "There are no published events right now. Check back soon."
            }
            actionLabel={filtersActive ? "Clear filters" : undefined}
            onAction={filtersActive ? clearFilters : undefined}
          />
        ) : (
          <section aria-label="Event results">
            <p className="mb-4 text-sm text-gray-500">
              Showing {filteredEvents.length} event
              {filteredEvents.length === 1 ? "" : "s"}
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isBooked={bookedEventIds.has(String(event.id))}
                  isBooking={bookingEventId === event.id}
                  onBook={(eventId) => bookingMutation.mutate(eventId)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
