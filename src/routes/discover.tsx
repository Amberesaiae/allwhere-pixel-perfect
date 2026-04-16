import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, MapPin, Eye, ShieldCheck } from "lucide-react";
import { GHANA_REGIONS, getCategoryIcon } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Kiosks | BlueKiosk" },
      { name: "description", content: "Browse verified vendors and kiosks near you in Ghana." },
      { property: "og:title", content: "Discover Kiosks | BlueKiosk" },
      { property: "og:description", content: "Browse verified vendors and kiosks near you in Ghana." },
    ],
  }),
  component: DiscoverPage,
});

type Kiosk = Tables<"kiosks"> & {
  categories: { name: string; slug: string; icon_name: string | null } | null;
  kiosk_stats: { views_count: number } | null;
};

function DiscoverPage() {
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

  useEffect(() => {
    fetchKiosks();
  }, [selectedCategory, selectedRegion]);

  const fetchKiosks = async () => {
    setLoading(true);
    let query = supabase
      .from("kiosks")
      .select("*, categories(name, slug, icon_name), kiosk_stats(views_count)")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (selectedCategory) query = query.eq("category_id", selectedCategory);
    if (selectedRegion) query = query.eq("region", selectedRegion);

    const { data } = await query;
    setKiosks((data as unknown as Kiosk[]) || []);
    setLoading(false);
  };

  const filtered = search.trim()
    ? kiosks.filter(
        (k) =>
          k.name.toLowerCase().includes(search.toLowerCase()) ||
          k.description?.toLowerCase().includes(search.toLowerCase())
      )
    : kiosks;

  return (
    <>
      <Navbar />
      <main className="bg-bk-cream py-10 min-h-screen">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="text-[36px] font-bold text-bk-dark mb-2">Discover Kiosks</h1>
          <p className="text-[16px] text-bk-muted mb-8">Browse verified vendors near you</p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bk-muted" />
              <input
                type="text"
                placeholder="Search kiosks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
            >
              <option value="">All Regions</option>
              {GHANA_REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-bk-beige p-12 text-center">
              <p className="text-[18px] text-bk-dark font-semibold mb-2">No kiosks found</p>
              <p className="text-[15px] text-bk-muted">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((kiosk) => {
                const IconComponent = kiosk.categories?.icon_name
                  ? getCategoryIcon(kiosk.categories.icon_name)
                  : null;
                return (
                  <Link
                    key={kiosk.id}
                    to="/kiosk/$slug"
                    params={{ slug: kiosk.slug }}
                    className="bg-white rounded-2xl overflow-hidden border border-bk-beige hover:shadow-lg transition group block"
                  >
                    <div className="aspect-[16/10] bg-bk-beige overflow-hidden">
                      {kiosk.cover_image_url ? (
                        <img
                          src={kiosk.cover_image_url}
                          alt={kiosk.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-bk-muted">
                          {IconComponent && <IconComponent className="w-12 h-12 opacity-30" />}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-[16px] font-semibold text-bk-dark truncate">{kiosk.name}</h3>
                        {kiosk.is_verified && <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />}
                      </div>
                      {kiosk.categories && (
                        <span className="inline-block text-[12px] font-medium text-bk-muted bg-bk-cream px-2 py-0.5 rounded-full mb-2">
                          {kiosk.categories.name}
                        </span>
                      )}
                      {kiosk.description && (
                        <p className="text-[13px] text-bk-muted line-clamp-2 mb-3">{kiosk.description}</p>
                      )}
                      <div className="flex items-center justify-between text-[12px] text-bk-muted">
                        {kiosk.region && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {kiosk.city ? `${kiosk.city}, ` : ""}{kiosk.region}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {kiosk.kiosk_stats?.views_count || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
