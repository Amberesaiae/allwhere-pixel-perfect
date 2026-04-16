import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In | BlueKiosk" },
      { name: "description", content: "Log in to your BlueKiosk account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err.message);
    } else {
      navigate({ to: "/" });
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-bk-cream px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-bk-dark">Welcome back</h1>
            <p className="text-bk-muted mt-1">Log in to your BlueKiosk account</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-bk-beige space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-[14px] rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[14px] font-medium text-bk-dark mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-[14px] font-medium text-bk-dark">Password</label>
                <Link to="/forgot-password" className="text-[13px] text-bk-muted hover:text-bk-dark transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow pr-12"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bk-muted hover:text-bk-dark"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bk-yellow text-bk-dark font-semibold text-[15px] py-3 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Log In
            </button>
          </form>

          <p className="text-center text-[14px] text-bk-muted mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-bk-dark font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
