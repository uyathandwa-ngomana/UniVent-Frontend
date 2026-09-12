/**
 * Loading placeholder that matches EventCard layout.
 */
export default function EventCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl border border-[#dedede] bg-white p-5 shadow-[0_2px_5px_rgba(0,0,0,0.04)]"
      aria-hidden="true"
    >
      <div className="mb-4 h-6 w-24 rounded-full bg-gray-200" />
      <div className="mb-3 h-7 w-3/4 rounded bg-gray-200" />
      <div className="mb-2 h-4 w-1/2 rounded bg-gray-200" />
      <div className="mb-2 h-4 w-2/3 rounded bg-gray-200" />
      <div className="mb-6 h-4 w-1/3 rounded bg-gray-200" />
      <div className="flex items-center justify-between gap-3">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="h-11 w-28 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
