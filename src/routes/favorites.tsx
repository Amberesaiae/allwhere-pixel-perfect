import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, Heart, MapPin, Tag } from "lucide-react";
import { formatPrice, timeAgo, CONDITION_LABELS } from "@/lib/constants";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Saved Listings | BlueKiosk" },
      { name: "description", content: "Your saved listings on BlueKiosk." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { navigate({ to: "/login" }); return; }
    fetchFavorites();
  }, [authLoading, isAuthenticated]);

  const fetchFavorites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("favorites")
      .select("listing_id, listings(id, title, slug, price, currency, condition, is_negotiable, region, city, created_at, listing_images(image_url))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setListings((data || []).map((f: any) => f.listings).filter(Boolean));
    setLoading(false);
  };

  const removeFavorite = async (listingId: string) => {
    if (!user) return;
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listingId);
    setListings((prev) => prev.filter((l) => l.id !== listingId));
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
      <main className="min-h-screen bg-bk-cream py-10">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="text-[36px] font-bold text-bk-dark mb-2">Saved Listings</h1>
          <p className="text-[16px] text-bk-muted mb-8">Items you've saved for later</p>

          {listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-bk-beige p-12 text-center">
              <Heart className="w-12 h-12 text-bk-muted mx-auto mb-4" />
              <p className="text-[18px] text-bk-dark font-semibold mb-2">No saved listings yet</p>
              <p className="text-[15px] text-bk-muted mb-6">Browse listings and tap the heart icon to save them here.</p>
              <Link to="/discover" className="inline-block text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">
                Browse Listings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing: any) => (
                <div key={listing.id} className="bg-white rounded-2xl overflow-hidden border border-bk-beige group relative">
                  <button
                    onClick={() => removeFavorite(listing.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
                    title="Remove from saved"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                  <Link to="/listing/$slug" params={{ slug: listing.slug }} className="block">
                    <div className="aspect-square bg-bk-beige overflow-hidden">
                      {listing.listing_images?.[0]?.image_url ? (
                        <img src={listing.listing_images[0].image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Tag className="w-12 h-12 text-bk-muted opacity-30" /></div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-[15px] font-semibold text-bk-dark truncate mb-1">{listing.title}</h3>
                      <p className="text-[16px] font-bold text-bk-dark mb-2">{formatPrice(Number(listing.price), listing.currency)}</p>
                      <div className="flex items-center gap-2 text-[12px] text-bk-muted">
                        <span className="bg-bk-cream px-2 py-0.5 rounded-full">{CONDITION_LABELS[listing.condition]}</span>
                        {listing.is_negotiable && <span className="bg-bk-teal px-2 py-0.5 rounded-full">Negotiable</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[12px] text-bk-muted">
                        {listing.region && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.city ? `${listing.city}, ` : ""}{listing.region}</span>
                        )}
                        <span>{timeAgo(listing.created_at)}</span>
                      </div>
                    </div>
                  </Link>
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
