/**
 * Reusable empty-state block for lists and feeds.
 */
export default function EmptyState({
  icon = "📭",
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dedede] bg-white px-6 py-16 text-center">
      <div className="mb-4 text-4xl" aria-hidden="true">
        {icon}
      </div>
      <h2 className="text-xl font-bold tracking-tight text-[#161616]">{title}</h2>
      {message && (
        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">{message}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-lg bg-[#087dbb] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#066a9f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#087dbb]/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
