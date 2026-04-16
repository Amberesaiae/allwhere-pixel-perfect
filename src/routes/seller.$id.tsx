import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, MapPin, ShieldCheck, Store, Tag } from "lucide-react";
import { formatPrice } from "@/lib/constants";

export const Route = createFileRoute("/seller/$id")({
  head: () => ({
    meta: [
      { title: "Seller Profile | BlueKiosk" },
      { name: "description", content: "View seller profile on BlueKiosk." },
    ],
  }),
  component: SellerProfilePage,
});

function SellerProfilePage() {
  const { id } = Route.useParams();
  const [profile, setProfile] = useState<any>(null);
  const [kiosks, setKiosks] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchSeller();
  }, [id]);

  const fetchSeller = async () => {
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", id)
      .single();

    if (!prof) { setNotFound(true); setLoading(false); return; }
    setProfile(prof);

    const [kRes, lRes] = await Promise.all([
      supabase.from("kiosks").select("id, name, slug, cover_image_url, is_verified, categories(name)").eq("owner_id", id).eq("status", "active"),
      supabase.from("listings").select("id, title, slug, price, currency, condition, region, city, listing_images(image_url)").eq("owner_id", id).eq("status", "active").order("created_at", { ascending: false }).limit(20),
    ]);

    setKiosks(kRes.data || []);
    setListings(lRes.data || []);
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

  if (notFound || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream">
          <div className="text-center">
            <h1 className="text-[28px] font-bold text-bk-dark mb-2">Seller not found</h1>
            <Link to="/discover" className="inline-block text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">
              Browse Listings
            </Link>
          </div>
        </div>
      </>
    );
  }

  const memberSince = new Date(profile.created_at);
  const memberDate = `${memberSince.toLocaleString("en-GB", { month: "short" })} ${memberSince.getFullYear()}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-cream py-10">
        <div className="mx-auto max-w-[1280px] px-6">
          {/* Profile header */}
          <div className="bg-white rounded-2xl border border-bk-beige p-8 mb-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-bk-beige flex items-center justify-center text-[32px] font-bold text-bk-dark shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.display_name?.charAt(0)?.toUpperCase() || "?"
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-[28px] font-bold text-bk-dark">{profile.display_name || "Seller"}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-[14px] text-bk-muted">
                {profile.region && (
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.city ? `${profile.city}, ` : ""}{profile.region}</span>
                )}
                <span>Member since {memberDate}</span>
                <span>{listings.length} active listing{listings.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>

          {/* Kiosks */}
          {kiosks.length > 0 && (
            <div className="mb-10">
              <h2 className="text-[20px] font-bold text-bk-dark mb-4">Kiosks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kiosks.map((k: any) => (
                  <Link key={k.id} to="/kiosk/$slug" params={{ slug: k.slug }} className="bg-white rounded-xl border border-bk-beige p-4 hover:shadow-md transition flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-bk-beige overflow-hidden shrink-0">
                      {k.cover_image_url ? (
                        <img src={k.cover_image_url} alt={k.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Store className="w-6 h-6 text-bk-muted" /></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[15px] font-semibold text-bk-dark">{k.name}</span>
                        {k.is_verified && <ShieldCheck className="w-4 h-4 text-green-600" />}
                      </div>
                      {k.categories?.name && <span className="text-[12px] text-bk-muted">{k.categories.name}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Listings */}
          <h2 className="text-[20px] font-bold text-bk-dark mb-4">Listings</h2>
          {listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-bk-beige p-8 text-center">
              <p className="text-[15px] text-bk-muted">No active listings</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map((l: any) => (
                <Link key={l.id} to="/listing/$slug" params={{ slug: l.slug }} className="bg-white rounded-xl overflow-hidden border border-bk-beige hover:shadow-md transition group block">
                  <div className="aspect-square bg-bk-beige overflow-hidden">
                    {l.listing_images?.[0]?.image_url ? (
                      <img src={l.listing_images[0].image_url} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Tag className="w-8 h-8 text-bk-muted opacity-30" /></div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-[14px] font-semibold text-bk-dark truncate">{l.title}</h3>
                    <p className="text-[14px] font-bold text-bk-dark">{formatPrice(Number(l.price), l.currency)}</p>
                    {l.region && (
                      <span className="text-[11px] text-bk-muted flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{l.city ? `${l.city}, ` : ""}{l.region}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
