import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginUser } from "../../api/auth";
import { getHomePathForRole } from "../../context/auth-context";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Safe redirect — runs after render, not during
  useEffect(() => {
    if (user) {
      navigate(getHomePathForRole(user.role), { replace: true });
    }
  }, [navigate, user]);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.ac\.za$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please use your CPUT email address (e.g. 221234567@mycput.ac.za)");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const authResponse = await loginUser({ email, password });
      login(authResponse);
      navigate(getHomePathForRole(authResponse.role), { replace: true });
    } catch (err) {
      const message = err.response?.data?.message;
      setError(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f8f7] px-5 py-12 font-sans text-[#161616] sm:px-6">
      <section
        className="w-full max-w-2xl"
        aria-labelledby="login-title"
      >
        {/* Header */}
        <header className="mb-10 sm:mb-[52px]">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#087dbb]">
            UniVent
          </p>

          <h1
            id="login-title"
            className="text-4xl font-bold leading-tight tracking-[-0.035em] sm:text-[2.5rem]"
          >
            Welcome back
          </h1>

          <p className="mt-2.5 text-base leading-6 text-gray-500 sm:text-lg">
            Sign in with your CPUT email to continue to UniVent.
          </p>
        </header>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="grid gap-6 sm:gap-7">

          {/* Email */}
          <div className="grid gap-2.5">
            <label htmlFor="email" className="font-semibold">
              CPUT email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="student@mycput.ac.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              aria-describedby="email-hint"
              className="h-14 w-full rounded-lg border border-[#dedede] bg-white px-4 text-base text-[#161616] shadow-[0_2px_5px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[#929292] focus:border-[#087dbb] focus:ring-4 focus:ring-[#087dbb]/20 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <span
              id="email-hint"
              className="text-sm leading-5 text-gray-500"
            >
              Use your university email ending in .ac.za
            </span>
          </div>

          {/* Password */}
          <div className="grid gap-2.5">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-14 w-full rounded-lg border border-[#dedede] bg-white px-4 text-base text-[#161616] shadow-[0_2px_5px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[#929292] focus:border-[#087dbb] focus:ring-4 focus:ring-[#087dbb]/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="mt-0.5 shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Sign In */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="mt-1 min-h-[58px] w-full rounded-lg bg-[#087dbb] text-base font-bold text-white shadow-[0_3px_8px_rgba(8,125,187,0.2)] transition hover:bg-[#066a9f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#087dbb]/20 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Register */}
        <p className="mt-9 text-base text-gray-600 sm:mt-11">
          New to the university?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#087dbb] hover:text-[#066a9f] hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#087dbb]/20"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
