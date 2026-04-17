import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { MapPin, ShieldCheck, Eye, Phone, ArrowLeft, Loader2, MessageCircle, Tag, Plus, Share2, Store } from "lucide-react";
import { getCategoryIcon, getWhatsAppUrl, getCallUrl } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";
import ListingCard from "@/components/ListingCard";
import KioskCard from "@/components/KioskCard";

export const Route = createFileRoute("/kiosk/$slug")({
  head: () => ({
    meta: [
      { title: "Kiosk · bluekiosk" },
      { name: "description", content: "View vendor kiosk details on bluekiosk." },
      { property: "og:title", content: "Kiosk · bluekiosk" },
      { property: "og:description", content: "View vendor kiosk details on bluekiosk." },
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
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [listingTab, setListingTab] = useState<"all" | "products" | "services">("all");
  const [memberDate, setMemberDate] = useState("");
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => { fetchKiosk(); }, [slug]);

  const fetchKiosk = async () => {
    setLoading(true);
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

    const d = new Date(data.created_at);
    setMemberDate(`${d.toLocaleString("en-GB", { month: "short" })} ${d.getFullYear()}`);

    supabase.from("profiles").select("display_name").eq("user_id", data.owner_id).single().then(({ data: profile }) => {
      if (profile?.display_name) setOwnerName(profile.display_name);
    });

    const { data: listingsData } = await supabase
      .from("listings")
      .select("*, listing_images(image_url), kiosks(name, slug, phone, is_verified)")
      .eq("kiosk_id", data.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });
    setListings(listingsData || []);

    if (data.category_id) {
      const { data: rel } = await supabase
        .from("kiosks")
        .select("id, name, slug, description, region, city, is_verified, cover_image_url, categories(name, icon_name), listings(count)")
        .eq("category_id", data.category_id)
        .eq("status", "active")
        .neq("id", data.id)
        .limit(6);
      setRelated(rel || []);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <><Navbar /><div className="min-h-[60vh] flex items-center justify-center bg-bk-page"><Loader2 className="w-8 h-8 animate-spin text-bk-muted" /></div></>
    );
  }

  if (notFound || !kiosk) {
    return (
      <><Navbar /><div className="min-h-[60vh] flex items-center justify-center bg-bk-page px-4">
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-bk-dark mb-2">Kiosk not found</h1>
          <p className="text-[15px] text-bk-muted mb-6">This kiosk doesn't exist or has been removed.</p>
          <Link to="/discover" search={{ tab: "kiosks", category: "", q: "" }} className="inline-block text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">
            Browse Kiosks
          </Link>
        </div>
      </div></>
    );
  }

  const Icon = getCategoryIcon(kiosk.categories?.icon_name || null);
  const filteredListings = listingTab === "all" ? listings :
    listings.filter((l: any) => l.listing_type === (listingTab === "products" ? "product" : "service"));
  const whatsappMsg = `Hi, I found your kiosk "${kiosk.name}" on BlueKiosk. I'd like to enquire about your offerings.`;

  const share = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: kiosk.name, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); } catch {}
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-page pb-16">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-5">
          <Link to="/discover" search={{ tab: "kiosks", category: "", q: "" }} className="inline-flex items-center gap-1.5 text-[13px] text-bk-muted hover:text-bk-dark transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Kiosks
          </Link>
        </div>

        {/* Cover banner */}
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-4">
          <div className="relative rounded-2xl overflow-hidden bg-bk-beige aspect-[3/1] max-h-[320px]">
            {kiosk.cover_image_url ? (
              <img src={kiosk.cover_image_url} alt={kiosk.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bk-yellow/30 to-bk-page">
                {Icon ? <Icon className="w-16 h-16 text-bk-muted" /> : <Store className="w-16 h-16 text-bk-muted" />}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bk-dark/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 text-white">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-[26px] md:text-[36px] font-bold tracking-tight">{kiosk.name}</h1>
                {kiosk.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-bk-red text-white text-[11px] font-bold">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[13px] text-white/90">
                {kiosk.categories && (
                  <span className="flex items-center gap-1.5">{Icon && <Icon className="w-4 h-4" />}{kiosk.categories.name}</span>
                )}
                {(kiosk.city || kiosk.region) && (
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {kiosk.city ? `${kiosk.city}, ` : ""}{kiosk.region}</span>
                )}
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {(kiosk.kiosk_stats?.views_count || 0) + 1} views</span>
              </div>
            </div>
          </div>

          {/* Sticky action bar */}
          <div className="sticky top-[120px] md:top-[148px] z-30 mt-4 bg-white border border-bk-beige rounded-2xl p-3 flex items-center gap-2 shadow-sm">
            {kiosk.phone ? (
              <>
                <a href={getWhatsAppUrl(kiosk.phone, whatsappMsg)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 text-[13px] font-bold bg-bk-yellow text-bk-dark py-2.5 rounded-full hover:bg-bk-yellow-hover transition">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a href={getCallUrl(kiosk.phone)} className="inline-flex items-center justify-center gap-2 text-[13px] font-semibold border-2 border-bk-dark text-bk-dark px-4 py-2 rounded-full hover:bg-bk-page transition">
                  <Phone className="w-4 h-4" /> <span className="hidden sm:inline">Call</span>
                </a>
              </>
            ) : (
              <span className="flex-1 text-center text-[13px] text-bk-muted py-2">Contact details not provided</span>
            )}
            <button onClick={share} className="inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold border border-bk-beige text-bk-dark px-4 py-2 rounded-full hover:bg-bk-page transition">
              <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="bg-white rounded-2xl border border-bk-beige p-5">
                <h3 className="text-[12px] uppercase tracking-wider font-bold text-bk-muted mb-3">About</h3>
                {kiosk.description ? (
                  <p className="text-[13px] text-bk-dark leading-relaxed whitespace-pre-line">{kiosk.description}</p>
                ) : (
                  <p className="text-[13px] text-bk-muted italic">No description provided.</p>
                )}
              </div>
              <div className="bg-white rounded-2xl border border-bk-beige p-5">
                <h3 className="text-[12px] uppercase tracking-wider font-bold text-bk-muted mb-3">Owner</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-bk-yellow flex items-center justify-center text-[16px] font-bold text-bk-dark">
                    {(ownerName || kiosk.name).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-bk-dark truncate">{ownerName || kiosk.name}</p>
                    {memberDate && <p className="text-[11px] text-bk-muted">Member since {memberDate}</p>}
                  </div>
                </div>
                <Link to="/seller/$id" params={{ id: kiosk.owner_id }} className="block w-full text-center text-[12px] font-semibold border border-bk-beige py-2 rounded-full hover:bg-bk-page transition">
                  View Seller Profile
                </Link>
              </div>
              {kiosk.region && (
                <div className="bg-white rounded-2xl border border-bk-beige p-5">
                  <h3 className="text-[12px] uppercase tracking-wider font-bold text-bk-muted mb-3">Location</h3>
                  <p className="text-[14px] text-bk-dark flex items-center gap-2"><MapPin className="w-4 h-4 text-bk-muted" />{kiosk.city ? `${kiosk.city}, ` : ""}{kiosk.region}</p>
                  <div className="mt-3 aspect-[16/9] rounded-lg bg-bk-page flex items-center justify-center text-[11px] text-bk-muted border border-bk-beige">
                    Map preview coming soon
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl border border-bk-beige p-5">
                <h3 className="text-[12px] uppercase tracking-wider font-bold text-bk-muted mb-3">Status</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${kiosk.status === "active" ? "bg-green-500" : "bg-amber-500"}`} />
                  <span className="text-[13px] text-bk-dark capitalize">{kiosk.status}</span>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="min-w-0">
              <div className="bg-white rounded-2xl border border-bk-beige overflow-hidden">
                <div className="flex items-center justify-between border-b border-bk-beige p-3">
                  <div className="flex gap-1 bg-bk-page rounded-lg p-1">
                    {(["all", "products", "services"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setListingTab(t)}
                        className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition capitalize ${listingTab === t ? "bg-bk-dark text-white" : "text-bk-muted hover:text-bk-dark"}`}
                      >
                        {t === "all" ? `All (${listings.length})` : t}
                      </button>
                    ))}
                  </div>
                  {user && kiosk.owner_id === user.id && (
                    <Link to="/dashboard/create-listing" className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-bk-yellow text-bk-dark px-3 py-1.5 rounded-full hover:bg-bk-yellow-hover transition">
                      <Plus className="w-3.5 h-3.5" /> Add Listing
                    </Link>
                  )}
                </div>
                <div className="p-4">
                  {filteredListings.length === 0 ? (
                    <div className="text-center py-12">
                      <Tag className="w-10 h-10 text-bk-muted mx-auto mb-3 opacity-40" />
                      <p className="text-[14px] text-bk-muted">
                        {listings.length === 0 ? "This vendor hasn't listed anything yet." : "No listings match this filter."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                      {filteredListings.map((l: any) => <ListingCard key={l.id} listing={l} />)}
                    </div>
                  )}
                </div>
              </div>

              {/* Related kiosks */}
              {related.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-[20px] md:text-[24px] font-bold text-bk-dark mb-5">More kiosks like this</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {related.map((k: any) => <KioskCard key={k.id} kiosk={k} variant="compact" />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
