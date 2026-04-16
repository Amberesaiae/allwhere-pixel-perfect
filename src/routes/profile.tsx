import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, User, MapPin, Phone, LogOut, Store } from "lucide-react";
import { GHANA_REGIONS } from "@/lib/constants";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile | BlueKiosk" },
      { name: "description", content: "Manage your BlueKiosk profile." },
    ],
  }),
  component: ProfilePage,
});

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  region: string | null;
  city: string | null;
}

function ProfilePage() {
  const { user, isLoading: authLoading, isAuthenticated, signOut } = useAuth();
  const { isVendor, loading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    fetchProfile();
  }, [authLoading, isAuthenticated]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, phone, region, city")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setDisplayName(data.display_name || "");
      setPhone(data.phone || "");
      setRegion(data.region || "");
      setCity(data.city || "");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    await supabase
      .from("profiles")
      .update({ display_name: displayName, phone, region, city })
      .eq("user_id", user.id);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream">
          <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] bg-bk-cream py-12 px-4">
        <div className="mx-auto max-w-[600px]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[28px] font-bold text-bk-dark">Your Profile</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[14px] text-bk-muted hover:text-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-bk-beige space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-bk-beige">
              <div className="w-16 h-16 rounded-full bg-bk-beige flex items-center justify-center">
                <User className="w-8 h-8 text-bk-muted" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-bk-dark">{displayName || "No name set"}</p>
                <p className="text-[14px] text-bk-muted">{user?.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-bk-dark mb-1.5">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-bk-dark mb-1.5">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                placeholder="+233 XX XXX XXXX"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] font-medium text-bk-dark mb-1.5">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                >
                  <option value="">Select region</option>
                  {GHANA_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[14px] font-medium text-bk-dark mb-1.5">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                  placeholder="e.g. Accra"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-bk-yellow text-bk-dark font-semibold text-[15px] px-8 py-3 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
              {success && <span className="text-[14px] text-green-600 font-medium">Saved!</span>}
            </div>
          </div>

          {/* Become a Vendor */}
          {!rolesLoading && !isVendor && (
            <div className="mt-6 bg-white rounded-2xl p-6 border border-bk-beige">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-bk-yellow/20 flex items-center justify-center">
                  <Store className="w-6 h-6 text-bk-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-bk-dark mb-0.5">Start selling on BlueKiosk</h3>
                  <p className="text-[13px] text-bk-muted">Create your kiosk and list products or services</p>
                </div>
                <Link
                  to="/become-vendor"
                  className="shrink-0 text-[13px] font-semibold bg-bk-yellow text-bk-dark px-5 py-2.5 rounded-full hover:bg-bk-yellow-hover transition"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
