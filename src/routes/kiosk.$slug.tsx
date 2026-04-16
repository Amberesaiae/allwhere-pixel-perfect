import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { MapPin, CheckCircle, Eye, Phone, ArrowLeft, Loader2, MessageCircle, Tag, Plus } from "lucide-react";
import { getCategoryIcon, getWhatsAppUrl, getCallUrl, formatPrice, CONDITION_LABELS, timeAgo } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/kiosk/$slug")({
  head: () => ({
    meta: [
      { title: "Kiosk | BlueKiosk" },
      { name: "description", content: "View vendor kiosk details on BlueKiosk." },
    ],
  }),
  component: KioskDetailPage,
});

type KioskDetail = Tables<"kiosks"> & {
  categories: { name: string; slug: string; icon_name: string | null } | null;
  kiosk_stats: { views_count: number } | null;
};

function KioskDetailPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [kiosk, setKiosk] = useState<KioskDetail | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [listingTab, setListingTab] = useState<"all" | "products" | "services">("all");
  const [memberDate, setMemberDate] = useState("");
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    fetchKiosk();
  }, [slug]);

  const fetchKiosk = async () => {
    const { data, error } = await supabase
      .from("kiosks")
      .select("*, categories(name, slug, icon_name), kiosk_stats(views_count)")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setKiosk(data as unknown as KioskDetail);
    supabase.rpc("increment_kiosk_views", { _kiosk_id: data.id });

    // Stable date formatting (avoid hydration mismatch)
    const d = new Date(data.created_at);
    setMemberDate(`${d.toLocaleString("en-GB", { month: "short" })} ${d.getFullYear()}`);

    // Fetch owner display name
    supabase.from("profiles").select("display_name").eq("user_id", data.owner_id).single().then(({ data: profile }) => {
      if (profile?.display_name) setOwnerName(profile.display_name);
    });

    // Fetch listings for this kiosk
    const { data: listingsData } = await supabase
      .from("listings")
      .select("*, listing_images(image_url)")
      .eq("kiosk_id", data.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    setListings(listingsData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream">
          <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
        </div>
      </>
    );
  }

  if (notFound || !kiosk) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream px-4">
          <div className="text-center">
            <h1 className="text-[28px] font-bold text-bk-dark mb-2">Kiosk not found</h1>
            <p className="text-[15px] text-bk-muted mb-6">This kiosk doesn't exist or has been removed.</p>
            <Link
              to="/discover"
              className="inline-block text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition"
            >
              Browse Kiosks
            </Link>
          </div>
        </div>
      </>
    );
  }

  const Icon = getCategoryIcon(kiosk.categories?.icon_name || null);
  const filteredListings = listingTab === "all" ? listings :
    listings.filter((l: any) => l.listing_type === (listingTab === "products" ? "product" : "service"));

  const whatsappMsg = `Hi, I found your kiosk "${kiosk.name}" on BlueKiosk. I'd like to enquire about your offerings.`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-cream">
        <div className="mx-auto max-w-[1280px] px-6 pt-6">
          <Link to="/discover" className="inline-flex items-center gap-2 text-[14px] text-bk-muted hover:text-bk-dark transition">
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>

        {/* Cover */}
        <div className="mx-auto max-w-[1280px] px-6 pt-4 pb-8">
          <div className="rounded-2xl overflow-hidden bg-bk-beige aspect-[3/1] max-h-[360px]">
            {kiosk.cover_image_url ? (
              <img src={kiosk.cover_image_url} alt={kiosk.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {Icon ? <Icon className="w-16 h-16 text-bk-muted" /> : <MapPin className="w-16 h-16 text-bk-muted" />}
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-[1280px] px-6 pb-16">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main content */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-[28px] md:text-[36px] font-bold text-bk-dark tracking-tight">{kiosk.name}</h1>
                {kiosk.is_verified && <CheckCircle className="w-6 h-6 text-bk-dark mt-2 shrink-0" />}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-[14px] text-bk-muted">
                {kiosk.categories && (
                  <span className="bg-bk-beige px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                    {Icon && <Icon className="w-4 h-4" />}
                    {kiosk.categories.name}
                  </span>
                )}
                {kiosk.city && kiosk.region && (
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {kiosk.city}, {kiosk.region}</span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> {(kiosk.kiosk_stats?.views_count || 0) + 1} views
                </span>
              </div>

              {kiosk.description && (
                <div className="mb-8">
                  <h2 className="text-[18px] font-bold text-bk-dark mb-3">About this Kiosk</h2>
                  <p className="text-[15px] text-bk-muted leading-relaxed whitespace-pre-line">{kiosk.description}</p>
                </div>
              )}

              {/* Listings section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[18px] font-bold text-bk-dark">Listings ({listings.length})</h2>
                  <div className="flex items-center gap-3">
                    {user && kiosk.owner_id === user.id && (
                      <Link
                        to="/dashboard/create-listing"
                        className="flex items-center gap-1.5 text-[13px] font-semibold bg-bk-yellow text-bk-dark px-4 py-2 rounded-full hover:bg-bk-yellow-hover transition"
                      >
                        <Plus className="w-4 h-4" /> Add Listing
                      </Link>
                    )}
                    <div className="flex gap-1 bg-bk-beige rounded-lg p-0.5">
                    {(["all", "products", "services"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setListingTab(t)}
                        className={`px-3 py-1 rounded-md text-[12px] font-medium transition capitalize ${
                          listingTab === t ? "bg-bk-dark text-bk-cream" : "text-bk-muted"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  </div>
                </div>

                {filteredListings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-bk-beige p-8 text-center">
                    <Tag className="w-10 h-10 text-bk-muted mx-auto mb-3 opacity-40" />
                    <p className="text-[14px] text-bk-muted">
                      {listings.length === 0
                        ? "This vendor hasn't listed anything yet. Check back soon!"
                        : "No listings match this filter."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredListings.map((listing: any) => (
                      <Link
                        key={listing.id}
                        to="/listing/$slug"
                        params={{ slug: listing.slug }}
                        className="bg-white rounded-xl overflow-hidden border border-bk-beige hover:shadow-md transition group block"
                      >
                        <div className="aspect-square bg-bk-beige overflow-hidden">
                          {listing.listing_images?.[0]?.image_url ? (
                            <img src={listing.listing_images[0].image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Tag className="w-8 h-8 text-bk-muted opacity-30" /></div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="text-[13px] font-semibold text-bk-dark truncate mb-1">{listing.title}</h3>
                          <p className="text-[14px] font-bold text-bk-dark">{formatPrice(Number(listing.price), listing.currency)}</p>
                          <div className="flex gap-1 mt-1">
                            <span className="text-[10px] bg-bk-cream text-bk-muted px-1.5 py-0.5 rounded-full">{CONDITION_LABELS[listing.condition]}</span>
                            {listing.is_negotiable && <span className="text-[10px] bg-bk-teal text-bk-dark px-1.5 py-0.5 rounded-full">Negotiable</span>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-[320px] shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Vendor card */}
                <div className="bg-white rounded-2xl border border-bk-beige p-6">
                  <h3 className="text-[14px] font-semibold text-bk-muted mb-4">Vendor</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-bk-beige flex items-center justify-center text-[18px] font-bold text-bk-dark">
                      {kiosk.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-bk-dark">{ownerName || kiosk.name}</p>
                      {memberDate && <p className="text-[12px] text-bk-muted">Member since {memberDate}</p>}
                    </div>
                  </div>

                  {/* Contact buttons */}
                  <div className="space-y-2">
                    {kiosk.phone && (
                      <>
                        <a
                          href={getWhatsAppUrl(kiosk.phone, whatsappMsg)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full text-[14px] font-semibold bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition"
                        >
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </a>
                        <a
                          href={getCallUrl(kiosk.phone)}
                          className="flex items-center justify-center gap-2 w-full text-[14px] font-semibold border border-bk-dark text-bk-dark py-3 rounded-full hover:bg-bk-beige transition"
                        >
                          <Phone className="w-4 h-4" /> Call
                        </a>
                      </>
                    )}
                    <Link
                      to="/seller/$id"
                      params={{ id: kiosk.owner_id }}
                      className="block w-full text-center text-[13px] font-medium text-bk-muted hover:text-bk-dark py-2 transition"
                    >
                      View Seller Profile
                    </Link>
                  </div>
                </div>

                {/* Location card */}
                {kiosk.region && (
                  <div className="bg-white rounded-2xl border border-bk-beige p-6">
                    <h3 className="text-[14px] font-semibold text-bk-muted mb-3">Location</h3>
                    <p className="text-[15px] text-bk-dark flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-bk-muted" />
                      {kiosk.city ? `${kiosk.city}, ` : ""}{kiosk.region}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="bg-white rounded-2xl border border-bk-beige p-6">
                  <h3 className="text-[14px] font-semibold text-bk-muted mb-3">Status</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${kiosk.status === "active" ? "bg-green-500" : "bg-amber-500"}`} />
                    <span className="text-[14px] text-bk-dark capitalize">{kiosk.status}</span>
                  </div>
                  {kiosk.is_verified && (
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="w-4 h-4 text-bk-dark" />
                      <span className="text-[14px] text-bk-dark">Verified Vendor</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
