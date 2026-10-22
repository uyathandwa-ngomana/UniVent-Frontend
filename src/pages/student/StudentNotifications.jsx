import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarCheck,
  CircleAlert,
  CircleCheck,
  Info,
  MapPin,
  Star,
} from "lucide-react";
import {
  dismissNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../api/notifications";

const TYPE_DETAILS = {
  REGISTRATION_CONFIRMED: { Icon: CircleCheck, className: "bg-emerald-50 text-emerald-700" },
  VENUE_CHANGED: { Icon: MapPin, className: "bg-amber-50 text-amber-700" },
  REMINDER: { Icon: Bell, className: "bg-sky-50 text-sky-700" },
  WAITLIST_UPDATE: { Icon: Info, className: "bg-violet-50 text-violet-700" },
  FEEDBACK_REQUEST: { Icon: Star, className: "bg-fuchsia-50 text-fuchsia-700" },
};

function relativeTime(dateValue) {
  const timestamp = new Date(dateValue).getTime();
  if (Number.isNaN(timestamp)) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(new Date(timestamp));
}

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setNotifications(await getNotifications());
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We could not load your notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Loading remote notifications is the synchronization performed by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const markAllRead = async () => {
    setWorking(true);
    setError("");
    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Notifications could not be marked as read.");
    } finally {
      setWorking(false);
    }
  };

  const markRead = async (notification) => {
    if (notification.read) return;
    try {
      const updated = await markNotificationRead(notification.id);
      setNotifications((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The notification could not be updated.");
    }
  };

  const dismiss = async (notificationId) => {
    setError("");
    try {
      await dismissNotification(notificationId);
      setNotifications((current) => current.filter((item) => item.id !== notificationId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The notification could not be dismissed.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-5">
          <div className="h-10 w-60 rounded bg-slate-200" />
          {[1, 2, 3].map((item) => <div key={item} className="h-28 rounded-xl bg-white" />)}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Notifications</h1>
            <p className="mt-2 text-slate-600">
              {unreadCount === 0 ? "No unread messages" : `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            disabled={working || unreadCount === 0}
            onClick={markAllRead}
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {working ? "Updating..." : "Mark all as read"}
          </button>
        </header>

        {error && (
          <div role="alert" className="mb-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <CircleAlert size={20} /> {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <CalendarCheck className="mx-auto text-slate-400" size={44} />
            <h2 className="mt-5 text-xl font-bold">You are all caught up</h2>
            <p className="mt-2 text-slate-600">Registration confirmations and event updates will appear here.</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {notifications.map((notification) => {
              const details = TYPE_DETAILS[notification.type] || { Icon: Info, className: "bg-slate-100 text-slate-700" };
              const Icon = details.Icon;
              return (
                <article
                  key={notification.id}
                  onClick={() => markRead(notification)}
                  className={`flex gap-5 border-b border-slate-200 p-6 last:border-b-0 ${notification.read ? "bg-white" : "bg-sky-50/60"}`}
                >
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${details.className}`}>
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h2 className="font-bold">
                        {notification.title}
                        {!notification.read && <span aria-label="Unread" className="ml-3 inline-block h-2 w-2 rounded-full bg-sky-600" />}
                      </h2>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          dismiss(notification.id);
                        }}
                        className="text-sm font-medium text-slate-500 hover:text-red-700"
                      >
                        Dismiss
                      </button>
                    </div>
                    <p className="mt-1 text-slate-700">{notification.message}</p>
                    <p className="mt-2 text-sm text-slate-500">{relativeTime(notification.createdAt)}</p>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
