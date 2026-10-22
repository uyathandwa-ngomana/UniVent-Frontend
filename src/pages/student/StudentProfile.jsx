import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  updateCurrentUser,
  updateNotificationPreferences,
} from "../../api/users";
import { useAuth } from "../../hooks/useAuth";

const FACULTIES = [
  "Applied Sciences",
  "Business and Management Sciences",
  "Education",
  "Engineering and the Built Environment",
  "Health and Wellness Sciences",
  "Informatics and Design",
];

const inputClass =
  "mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100";

function Field({ label, error, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      {children}
      {error && <span className="mt-1 block text-sm font-normal text-red-600">{error}</span>}
    </label>
  );
}

export default function StudentProfile() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCurrentUser();
      setProfile(data);
      setForm({
        firstName: data.firstName || "",
        surname: data.surname || "",
        phoneNumber: data.phoneNumber || "",
        residence: data.residence || "",
        faculty: data.faculty || "",
        yearOfStudy: data.yearOfStudy || 1,
        emailReminders: data.preferences?.emailReminders ?? true,
        eventUpdates: data.preferences?.eventUpdates ?? true,
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We could not load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Loading remote profile data is the synchronization performed by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, [loadProfile]);

  const initials = useMemo(() => {
    const name = profile?.name || user?.name || "Student";
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }, [profile?.name, user?.name]);

  const setValue = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setStatus("");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.surname.trim()) nextErrors.surname = "Surname is required";
    if (!/^\d{10}$/.test(form.phoneNumber)) {
      nextErrors.phoneNumber = "Enter a 10-digit mobile number";
    }
    if (!form.faculty) nextErrors.faculty = "Select a faculty";
    if (form.yearOfStudy < 1 || form.yearOfStudy > 6) {
      nextErrors.yearOfStudy = "Choose a year from 1 to 6";
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const updated = await updateCurrentUser({
        firstName: form.firstName.trim(),
        surname: form.surname.trim(),
        phoneNumber: form.phoneNumber,
        residence: form.residence.trim(),
        faculty: form.faculty,
        yearOfStudy: Number(form.yearOfStudy),
      });
      setProfile(updated);
      setStatus("Profile saved successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Your profile could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = async () => {
    setSavingPreferences(true);
    setError("");
    setStatus("");
    try {
      const updated = await updateNotificationPreferences({
        emailReminders: form.emailReminders,
        eventUpdates: form.eventUpdates,
      });
      setProfile(updated);
      setStatus("Notification preferences saved.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Preferences could not be saved.");
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-12">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-10 w-52 rounded bg-slate-200" />
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="h-96 rounded-2xl bg-white" />
            <div className="h-[32rem] rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
        <section className="max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Profile unavailable</h1>
          <p className="mt-3 text-red-700">{error}</p>
          <button onClick={loadProfile} className="mt-6 rounded-lg bg-sky-700 px-5 py-3 font-semibold text-white">
            Try again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
            <p className="mt-2 text-slate-600">Manage your personal details and preferences.</p>
          </div>
          <button onClick={handleLogout} className="rounded-lg border border-red-200 bg-white px-5 py-3 font-semibold text-red-700 hover:bg-red-50">
            Log out
          </button>
        </div>

        {(error || status) && (
          <div role="status" className={`mb-6 rounded-lg border px-4 py-3 ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
            {error || status}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-slate-950 text-3xl font-bold text-white">
              {initials}
            </div>
            <h2 className="mt-6 text-2xl font-bold">{profile.name}</h2>
            <p className="mt-2 text-slate-600">{profile.studentNumber}</p>
            <p className="mt-1 text-slate-600">{profile.department}</p>
            <div className="mt-8 border-t border-slate-200 pt-6 text-left text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Faculty:</span> {profile.faculty}</p>
              <p className="mt-3"><span className="font-semibold text-slate-900">Year:</span> {profile.yearOfStudy}</p>
            </div>
          </aside>

          <div className="space-y-8">
            <form onSubmit={saveProfile} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-bold">Personal details</h2>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <Field label="First name" error={fieldErrors.firstName}>
                  <input className={inputClass} value={form.firstName} onChange={(event) => setValue("firstName", event.target.value)} />
                </Field>
                <Field label="Surname" error={fieldErrors.surname}>
                  <input className={inputClass} value={form.surname} onChange={(event) => setValue("surname", event.target.value)} />
                </Field>
                <Field label="University email">
                  <input className={inputClass} value={profile.email} disabled />
                </Field>
                <Field label="Student number">
                  <input className={inputClass} value={profile.studentNumber} disabled />
                </Field>
                <Field label="Mobile number" error={fieldErrors.phoneNumber}>
                  <input className={inputClass} value={form.phoneNumber} onChange={(event) => setValue("phoneNumber", event.target.value.replace(/\D/g, "").slice(0, 10))} />
                </Field>
                <Field label="Residence">
                  <input className={inputClass} value={form.residence} onChange={(event) => setValue("residence", event.target.value)} />
                </Field>
                <Field label="Faculty" error={fieldErrors.faculty}>
                  <select className={inputClass} value={form.faculty} onChange={(event) => setValue("faculty", event.target.value)}>
                    <option value="">Select faculty</option>
                    {FACULTIES.map((faculty) => <option key={faculty}>{faculty}</option>)}
                  </select>
                </Field>
                <Field label="Year of study" error={fieldErrors.yearOfStudy}>
                  <select className={inputClass} value={form.yearOfStudy} onChange={(event) => setValue("yearOfStudy", Number(event.target.value))}>
                    {[1, 2, 3, 4, 5, 6].map((year) => <option key={year} value={year}>Year {year}</option>)}
                  </select>
                </Field>
              </div>
              <button type="submit" disabled={saving} className="mt-7 rounded-lg bg-sky-700 px-6 py-3 font-semibold text-white hover:bg-sky-800 disabled:opacity-60">
                {saving ? "Saving..." : "Save personal details"}
              </button>
            </form>

            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-bold">Notification preferences</h2>
              <div className="mt-6 space-y-5">
                <label className="flex items-start justify-between gap-5">
                  <span><span className="block font-semibold">Email reminders</span><span className="text-sm text-slate-600">Receive a reminder before each event.</span></span>
                  <input type="checkbox" className="mt-1 h-5 w-5 accent-sky-700" checked={form.emailReminders} onChange={(event) => setValue("emailReminders", event.target.checked)} />
                </label>
                <label className="flex items-start justify-between gap-5 border-t border-slate-200 pt-5">
                  <span><span className="block font-semibold">Event updates</span><span className="text-sm text-slate-600">Receive venue, cancellation and waitlist updates.</span></span>
                  <input type="checkbox" className="mt-1 h-5 w-5 accent-sky-700" checked={form.eventUpdates} onChange={(event) => setValue("eventUpdates", event.target.checked)} />
                </label>
              </div>
              <button type="button" disabled={savingPreferences} onClick={savePreferences} className="mt-7 rounded-lg border border-sky-700 px-6 py-3 font-semibold text-sky-700 hover:bg-sky-50 disabled:opacity-60">
                {savingPreferences ? "Saving..." : "Save preferences"}
              </button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
