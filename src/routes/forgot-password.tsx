import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password · bluekiosk" },
      { name: "description", content: "Reset your bluekiosk password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await resetPassword(email);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
      toast.success("Reset link sent — check your email");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-bk-cream px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-bk-dark">Reset your password</h1>
            <p className="text-bk-muted mt-1">Enter your email to receive a reset link</p>
          </div>

          {sent ? (
            <div className="bg-white rounded-2xl p-8 border border-bk-beige text-center">
              <h2 className="text-[18px] font-bold text-bk-dark mb-2">Check your email</h2>
              <p className="text-[15px] text-bk-muted">
                We sent a password reset link to <span className="font-medium text-bk-dark">{email}</span>.
              </p>
            </div>
          ) : (
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-bk-yellow text-bk-dark font-semibold text-[15px] py-3 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Reset Link
              </button>
            </form>
          )}

          <p className="text-center text-[14px] text-bk-muted mt-6">
            <Link to="/login" className="text-bk-dark font-medium hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </>
  );
}
