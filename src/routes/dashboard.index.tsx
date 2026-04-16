import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Eye, Store, CheckCircle, MapPin, Tag, Package } from "lucide-react";
import { formatPrice, CONDITION_LABELS } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Vendor Dashboard | BlueKiosk" },
      { name: "description", content: "Manage your kiosks and listings on BlueKiosk." },
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
  const [tab, setTab] = useState<"kiosks" | "listings">("kiosks");
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || rolesLoading) return;
    if (!isAuthenticated) { navigate({ to: "/login" }); return; }
    if (!isVendor) { navigate({ to: "/become-vendor" }); return; }
    fetchData();
  }, [authLoading, rolesLoading, isAuthenticated, isVendor]);

  const fetchData = async () => {
    if (!user) return;
    const [kRes, lRes] = await Promise.all([
      supabase.from("kiosks").select("*, categories(name), kiosk_stats(views_count)").eq("owner_id", user.id).order("created_at", { ascending: false }),
      supabase.from("listings").select("*, listing_images(image_url)").eq("owner_id", user.id).order("created_at", { ascending: false }),
    ]);
    setKiosks((kRes.data as unknown as Kiosk[]) || []);
    setListings(lRes.data || []);
    setLoading(false);
  };

  const handleDeleteKiosk = async (kioskId: string) => {
    if (!confirm("Are you sure you want to delete this kiosk? All its listings will also be removed.")) return;
    setDeleting(kioskId);
    await supabase.from("kiosks").delete().eq("id", kioskId);
    setKiosks((prev) => prev.filter((k) => k.id !== kioskId));
    setListings((prev) => prev.filter((l: any) => l.kiosk_id !== kioskId));
    setDeleting(null);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Delete this listing?")) return;
    setDeleting(listingId);
    await supabase.from("listings").delete().eq("id", listingId);
    setListings((prev) => prev.filter((l: any) => l.id !== listingId));
    setDeleting(null);
  };

  const toggleListingStatus = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "sold" : "active";
    await supabase.from("listings").update({ status: newStatus }).eq("id", listingId);
    setListings((prev) => prev.map((l: any) => l.id === listingId ? { ...l, status: newStatus } : l));
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[28px] font-bold text-bk-dark">Dashboard</h1>
              <p className="text-[14px] text-bk-muted mt-1">Manage your kiosks and listings</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1 bg-bk-beige rounded-xl p-1">
              <button
                onClick={() => setTab("kiosks")}
                className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition ${
                  tab === "kiosks" ? "bg-bk-dark text-bk-cream" : "text-bk-muted"
                }`}
              >
                Kiosks ({kiosks.length})
              </button>
              <button
                onClick={() => setTab("listings")}
                className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition ${
                  tab === "listings" ? "bg-bk-dark text-bk-cream" : "text-bk-muted"
                }`}
              >
                Listings ({listings.length})
              </button>
            </div>

            <Link
              to={tab === "kiosks" ? "/dashboard/create-kiosk" : "/dashboard/create-listing"}
              className="inline-flex items-center gap-2 text-[14px] font-semibold bg-bk-yellow text-bk-dark px-5 py-2.5 rounded-full hover:bg-bk-yellow-hover transition"
            >
              <Plus className="w-4 h-4" /> New {tab === "kiosks" ? "Kiosk" : "Listing"}
            </Link>
          </div>

          {tab === "kiosks" ? (
            /* Kiosks tab */
            kiosks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-bk-beige p-12 text-center">
                <Store className="w-12 h-12 text-bk-muted mx-auto mb-4" />
                <h2 className="text-[18px] font-bold text-bk-dark mb-2">No kiosks yet</h2>
                <p className="text-[15px] text-bk-muted mb-6">Create your first kiosk to start reaching buyers.</p>
                <Link to="/dashboard/create-kiosk" className="inline-flex items-center gap-2 text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">
                  <Plus className="w-4 h-4" /> Create Kiosk
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {kiosks.map((kiosk) => (
                  <div key={kiosk.id} className="bg-white rounded-2xl border border-bk-beige p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-bk-beige overflow-hidden shrink-0">
                      {kiosk.cover_image_url ? (
                        <img src={kiosk.cover_image_url} alt={kiosk.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Store className="w-8 h-8 text-bk-muted" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[16px] font-bold text-bk-dark truncate">{kiosk.name}</h3>
                        {kiosk.is_verified && <CheckCircle className="w-4 h-4 text-bk-dark shrink-0" />}
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          kiosk.status === "active" ? "bg-green-100 text-green-700" : kiosk.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                        }`}>{kiosk.status}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[12px] text-bk-muted">
                        {kiosk.categories && <span>{kiosk.categories.name}</span>}
                        {kiosk.city && kiosk.region && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {kiosk.city}, {kiosk.region}</span>}
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {kiosk.kiosk_stats?.views_count || 0} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to="/kiosk/$slug" params={{ slug: kiosk.slug }} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-bk-beige text-[12px] font-semibold text-bk-dark hover:bg-bk-page transition" title="View public page">
                        <Eye className="w-3.5 h-3.5" /> View Public Page
                      </Link>
                      <Link to="/kiosk/$slug" params={{ slug: kiosk.slug }} className="sm:hidden p-2.5 rounded-xl border border-bk-beige text-bk-muted hover:text-bk-dark hover:bg-bk-beige transition" title="View"><Eye className="w-4 h-4" /></Link>
                      <Link to="/dashboard/edit-kiosk/$id" params={{ id: kiosk.id }} className="p-2.5 rounded-xl border border-bk-beige text-bk-muted hover:text-bk-dark hover:bg-bk-beige transition" title="Edit"><Pencil className="w-4 h-4" /></Link>
                      <button onClick={() => handleDeleteKiosk(kiosk.id)} disabled={deleting === kiosk.id} className="p-2.5 rounded-xl border border-bk-beige text-bk-muted hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition disabled:opacity-50" title="Delete">
                        {deleting === kiosk.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Listings tab */
            listings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-bk-beige p-12 text-center">
                <Package className="w-12 h-12 text-bk-muted mx-auto mb-4" />
                <h2 className="text-[18px] font-bold text-bk-dark mb-2">No listings yet</h2>
                <p className="text-[15px] text-bk-muted mb-6">Post your first item or service for sale.</p>
                <Link to="/dashboard/create-listing" className="inline-flex items-center gap-2 text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">
                  <Plus className="w-4 h-4" /> Create Listing
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing: any) => (
                  <div key={listing.id} className="bg-white rounded-2xl border border-bk-beige p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-bk-beige overflow-hidden shrink-0">
                      {listing.listing_images?.[0]?.image_url ? (
                        <img src={listing.listing_images[0].image_url} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Tag className="w-6 h-6 text-bk-muted" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[15px] font-bold text-bk-dark truncate">{listing.title}</h3>
                        <button
                          onClick={() => toggleListingStatus(listing.id, listing.status)}
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium cursor-pointer transition ${
                            listing.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-200" :
                            listing.status === "sold" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" :
                            "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {listing.status}
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-[13px]">
                        <span className="font-bold text-bk-dark">{formatPrice(Number(listing.price), listing.currency)}</span>
                        <span className="text-bk-muted">{CONDITION_LABELS[listing.condition]}</span>
                        {listing.is_negotiable && <span className="text-bk-muted">Negotiable</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to="/listing/$slug" params={{ slug: listing.slug }} className="p-2.5 rounded-xl border border-bk-beige text-bk-muted hover:text-bk-dark hover:bg-bk-beige transition" title="View"><Eye className="w-4 h-4" /></Link>
                      <Link to="/dashboard/edit-listing/$id" params={{ id: listing.id }} className="p-2.5 rounded-xl border border-bk-beige text-bk-muted hover:text-bk-dark hover:bg-bk-beige transition" title="Edit"><Pencil className="w-4 h-4" /></Link>
                      <button onClick={() => handleDeleteListing(listing.id)} disabled={deleting === listing.id} className="p-2.5 rounded-xl border border-bk-beige text-bk-muted hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition disabled:opacity-50" title="Delete">
                        {deleting === listing.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
