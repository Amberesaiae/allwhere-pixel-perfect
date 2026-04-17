import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, Heart, Store, Tag } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import KioskCard from "@/components/KioskCard";
import EmptyState from "@/components/EmptyState";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Saved · bluekiosk" },
      { name: "description", content: "Your saved listings and kiosks on bluekiosk." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"listings" | "kiosks">("listings");
  const [listings, setListings] = useState<any[]>([]);
  const [kiosks, setKiosks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { navigate({ to: "/login", search: { redirect: "/favorites" } }); return; }
    fetchFavorites();
  }, [authLoading, isAuthenticated]);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    const [lRes, kRes] = await Promise.all([
      supabase
        .from("favorites")
        .select("listing_id, listings(id, title, slug, price, currency, condition, is_negotiable, region, city, created_at, listing_images(image_url), kiosks(name, slug, phone, is_verified))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("kiosk_favorites")
        .select("kiosk_id, kiosks(id, name, slug, description, region, city, is_verified, cover_image_url, categories(name, icon_name), listings(count))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);
    setListings(((lRes.data || []) as any[]).map((f) => f.listings).filter(Boolean));
    setKiosks(((kRes.data || []) as any[]).map((f) => f.kiosks).filter(Boolean));
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-page">
          <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-page py-8">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <h1 className="text-[28px] md:text-[32px] font-bold text-bk-dark mb-1">Saved</h1>
          <p className="text-[14px] text-bk-muted mb-6">Items and vendors you've saved for later.</p>

          <div className="flex gap-1 bg-white rounded-xl p-1 mb-6 w-fit border border-bk-beige">
            {([
              { id: "listings" as const, label: `Listings (${listings.length})`, icon: Tag },
              { id: "kiosks" as const, label: `Kiosks (${kiosks.length})`, icon: Store },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition inline-flex items-center gap-1.5 ${
                  tab === t.id ? "bg-bk-dark text-white" : "text-bk-muted hover:text-bk-dark"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            ))}
          </div>

          {tab === "listings" ? (
            listings.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No saved listings yet"
                description="Browse listings and tap the heart icon to save them here."
                primaryCta={{ label: "Browse listings", to: "/discover" }}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {listings.map((l: any) => <ListingCard key={l.id} listing={l} />)}
              </div>
            )
          ) : kiosks.length === 0 ? (
            <EmptyState
              icon={Store}
              title="No saved kiosks yet"
              description="When you find a vendor you like, tap the heart on their kiosk page to save it here."
              primaryCta={{ label: "Browse kiosks", to: "/discover" }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {kiosks.map((k: any) => <KioskCard key={k.id} kiosk={k} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

// silence unused if path used: _ = Link
const _ = Link;
