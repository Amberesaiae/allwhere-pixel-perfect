import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Eye, Store, CheckCircle, MapPin } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Vendor Dashboard | BlueKiosk" },
      { name: "description", content: "Manage your kiosks on BlueKiosk." },
    ],
  }),
  component: DashboardPage,
});

type Kiosk = Tables<"kiosks"> & {
  categories: { name: string } | null;
  kiosk_stats: { views_count: number } | null;
};

function DashboardPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { isVendor, loading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || rolesLoading) return;
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    if (!isVendor) {
      navigate({ to: "/become-vendor" });
      return;
    }
    fetchKiosks();
  }, [authLoading, rolesLoading, isAuthenticated, isVendor]);

  const fetchKiosks = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("kiosks")
      .select("*, categories(name), kiosk_stats(views_count)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    setKiosks((data as unknown as Kiosk[]) || []);
    setLoading(false);
  };

  const handleDelete = async (kioskId: string) => {
    if (!confirm("Are you sure you want to delete this kiosk? This cannot be undone.")) return;
    setDeleting(kioskId);
    await supabase.from("kiosks").delete().eq("id", kioskId);
    setKiosks((prev) => prev.filter((k) => k.id !== kioskId));
    setDeleting(null);
  };

  if (authLoading || rolesLoading || loading) {
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
      <main className="min-h-screen bg-bk-cream py-8">
        <div className="mx-auto max-w-[960px] px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-bk-dark">Your Kiosks</h1>
              <p className="text-[14px] text-bk-muted mt-1">Manage your vendor kiosks on BlueKiosk</p>
            </div>
            <Link
              to="/dashboard/create-kiosk"
              className="inline-flex items-center gap-2 text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition"
            >
              <Plus className="w-4 h-4" /> New Kiosk
            </Link>
          </div>

          {kiosks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-bk-beige p-12 text-center">
              <Store className="w-12 h-12 text-bk-muted mx-auto mb-4" />
              <h2 className="text-[18px] font-bold text-bk-dark mb-2">No kiosks yet</h2>
              <p className="text-[15px] text-bk-muted mb-6">
                Create your first kiosk to start reaching buyers across Ghana.
              </p>
              <Link
                to="/dashboard/create-kiosk"
                className="inline-flex items-center gap-2 text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition"
              >
                <Plus className="w-4 h-4" /> Create Kiosk
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {kiosks.map((kiosk) => (
                <div
                  key={kiosk.id}
                  className="bg-white rounded-2xl border border-bk-beige p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* Cover thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-bk-beige overflow-hidden shrink-0">
                    {kiosk.cover_image_url ? (
                      <img src={kiosk.cover_image_url} alt={kiosk.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-8 h-8 text-bk-muted" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[16px] font-bold text-bk-dark truncate">{kiosk.name}</h3>
                      {kiosk.is_verified && <CheckCircle className="w-4 h-4 text-bk-dark shrink-0" />}
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        kiosk.status === "active" ? "bg-green-100 text-green-700" :
                        kiosk.status === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {kiosk.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[12px] text-bk-muted">
                      {kiosk.categories && <span>{kiosk.categories.name}</span>}
                      {kiosk.city && kiosk.region && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {kiosk.city}, {kiosk.region}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {kiosk.kiosk_stats?.views_count || 0} views
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to="/kiosk/$slug"
                      params={{ slug: kiosk.slug }}
                      className="p-2.5 rounded-xl border border-bk-beige text-bk-muted hover:text-bk-dark hover:bg-bk-beige transition"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/dashboard/edit-kiosk/$id"
                      params={{ id: kiosk.id }}
                      className="p-2.5 rounded-xl border border-bk-beige text-bk-muted hover:text-bk-dark hover:bg-bk-beige transition"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(kiosk.id)}
                      disabled={deleting === kiosk.id}
                      className="p-2.5 rounded-xl border border-bk-beige text-bk-muted hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === kiosk.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
