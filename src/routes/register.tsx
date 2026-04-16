import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";
import { useState, useEffect, type FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Sign Up | BlueKiosk" },
      { name: "description", content: "Create your BlueKiosk account and start discovering verified vendors in Ghana." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated]);

  if (isAuthenticated) return null;

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError(result.error instanceof Error ? result.error.message : String(result.error));
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/" });
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
    setGoogleLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error: err } = await signUp(email, password, displayName);
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center bg-bk-cream px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-2xl p-8 border border-bk-beige">
              <h2 className="text-[22px] font-bold text-bk-dark mb-3">Check your email</h2>
              <p className="text-[15px] text-bk-muted">
                We sent a confirmation link to <span className="font-medium text-bk-dark">{email}</span>. Click the link to activate your account.
              </p>
            </div>
            <p className="text-[14px] text-bk-muted mt-6">
              Already confirmed?{" "}
              <Link to="/login" className="text-bk-dark font-medium hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-bk-cream px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-bk-dark">Create your account</h1>
            <p className="text-bk-muted mt-1">Join BlueKiosk as a buyer or vendor</p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-bk-beige space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-[14px] rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 border border-bk-beige bg-bk-cream text-bk-dark font-medium text-[15px] py-3 rounded-full hover:bg-bk-beige transition disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-bk-beige" />
              <span className="text-[13px] text-bk-muted">or</span>
              <div className="flex-1 h-px bg-bk-beige" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-[14px] font-medium text-bk-dark mb-1.5">Display Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                  placeholder="Your name"
                />
              </div>

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
                <label htmlFor="password" className="block text-[14px] font-medium text-bk-dark mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow pr-12"
                    placeholder="Min. 6 characters"
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
                disabled={loading || googleLoading}
                className="w-full bg-bk-yellow text-bk-dark font-semibold text-[15px] py-3 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Account
              </button>

              <p className="text-[12px] text-bk-muted text-center">
                By signing up, you agree to BlueKiosk's{" "}
                <Link to="/terms" className="underline hover:text-bk-dark">Terms of Service</Link>
              </p>
            </form>
          </div>

          <p className="text-center text-[14px] text-bk-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-bk-dark font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
