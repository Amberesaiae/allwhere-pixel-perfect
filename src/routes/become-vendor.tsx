import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2, Store, CheckCircle, Shield, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/become-vendor")({
  head: () => ({
    meta: [
      { title: "Become a Vendor | BlueKiosk" },
      { name: "description", content: "Set up your kiosk on BlueKiosk and start selling to buyers across Ghana." },
    ],
  }),
  component: BecomeVendorPage,
});

function BecomeVendorPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { isVendor, loading: rolesLoading, refetch } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [promoting, setPromoting] = useState(false);
  const [error, setError] = useState("");

  if (authLoading || rolesLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream">
          <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="text-[28px] font-bold text-bk-dark mb-3">Sign up to sell on BlueKiosk</h1>
            <p className="text-[15px] text-bk-muted mb-6">Create an account first, then set up your vendor kiosk.</p>
            <Link
              to="/register"
              className="inline-block text-[15px] font-semibold bg-bk-yellow text-bk-dark px-8 py-3 rounded-full hover:bg-bk-yellow-hover transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (isVendor) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream px-4">
          <div className="w-full max-w-md text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-[28px] font-bold text-bk-dark mb-3">You're already a vendor</h1>
            <p className="text-[15px] text-bk-muted mb-6">Go to your dashboard to manage your kiosks.</p>
            <Link
              to="/dashboard"
              className="inline-block text-[15px] font-semibold bg-bk-yellow text-bk-dark px-8 py-3 rounded-full hover:bg-bk-yellow-hover transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handlePromote = async () => {
    setPromoting(true);
    setError("");
    const { error: err } = await supabase.rpc("promote_to_vendor");
    if (err) {
      setError(err.message);
      setPromoting(false);
      return;
    }
    await refetch();
    setPromoting(false);
    navigate({ to: "/dashboard" });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-cream">
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[800px] px-6">
            <div className="text-center mb-14">
              <h1 className="text-[36px] md:text-[48px] font-bold text-bk-dark tracking-tight mb-4">
                Start Selling on BlueKiosk
              </h1>
              <p className="text-[18px] text-bk-muted max-w-[520px] mx-auto">
                Set up your kiosk in minutes and reach buyers across all 16 regions of Ghana
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl border border-bk-beige p-6 text-center">
                <Store className="w-10 h-10 text-bk-dark mx-auto mb-3" />
                <h3 className="text-[16px] font-bold text-bk-dark mb-2">Create Your Kiosk</h3>
                <p className="text-[13px] text-bk-muted">
                  Name your kiosk, pick a category, add your location and a cover photo.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-bk-beige p-6 text-center">
                <MessageSquare className="w-10 h-10 text-bk-dark mx-auto mb-3" />
                <h3 className="text-[16px] font-bold text-bk-dark mb-2">Connect with Buyers</h3>
                <p className="text-[13px] text-bk-muted">
                  Buyers discover your kiosk, chat with you in real-time, and place orders.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-bk-beige p-6 text-center">
                <Shield className="w-10 h-10 text-bk-dark mx-auto mb-3" />
                <h3 className="text-[16px] font-bold text-bk-dark mb-2">Get Paid Securely</h3>
                <p className="text-[13px] text-bk-muted">
                  BluPay escrow protects both parties. Funds are released when buyers confirm delivery.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-bk-beige p-8 text-center">
              <h2 className="text-[20px] font-bold text-bk-dark mb-3">Ready to get started?</h2>
              <p className="text-[15px] text-bk-muted mb-6 max-w-[400px] mx-auto">
                Activate your vendor account — it's free. No listing fees, just a small commission on completed sales.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[14px] rounded-xl px-4 py-3 mb-4 max-w-[400px] mx-auto">
                  {error}
                </div>
              )}

              <button
                onClick={handlePromote}
                disabled={promoting}
                className="inline-flex items-center gap-2 text-[15px] font-semibold bg-bk-yellow text-bk-dark px-10 py-4 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50"
              >
                {promoting && <Loader2 className="w-4 h-4 animate-spin" />}
                Activate Vendor Account
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
