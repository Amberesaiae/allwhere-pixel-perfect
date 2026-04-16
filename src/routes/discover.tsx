import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, MapPin, Eye, ShieldCheck, Tag, SlidersHorizontal } from "lucide-react";
import { GHANA_REGIONS, getCategoryIcon, formatPrice, timeAgo, CONDITION_LABELS } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Listings & Kiosks | BlueKiosk" },
      { name: "description", content: "Browse listings and verified vendors near you in Ghana." },
      { property: "og:title", content: "Discover Listings & Kiosks | BlueKiosk" },
      { property: "og:description", content: "Browse listings and verified vendors near you in Ghana." },
    ],
  }),
  component: DiscoverPage,
});

type Kiosk = Tables<"kiosks"> & {
  categories: { name: string; slug: string; icon_name: string | null } | null;
  kiosk_stats: { views_count: number } | null;
};

function DiscoverPage() {
  const [tab, setTab] = useState<"listings" | "kiosks">("listings");
  const [listings, setListings] = useState<any[]>([]);
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

  useEffect(() => {
    if (tab === "listings") fetchListings();
    else fetchKiosks();
  }, [tab, selectedCategory, selectedRegion, selectedCondition, sortBy, minPrice, maxPrice]);

  const fetchListings = async () => {
    setLoading(true);
    let query = supabase
      .from("listings")
      .select("*, categories(name, slug), listing_images(image_url), kiosks(name, slug, is_verified)")
      .eq("status", "active");

    if (selectedCategory) query = query.eq("category_id", selectedCategory);
    if (selectedRegion) query = query.eq("region", selectedRegion);
    if (selectedCondition) query = query.eq("condition", selectedCondition as "new" | "used" | "refurbished");
    if (minPrice) query = query.gte("price", parseFloat(minPrice));
    if (maxPrice) query = query.lte("price", parseFloat(maxPrice));

    if (sortBy === "price_low") query = query.order("price", { ascending: true });
    else if (sortBy === "price_high") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const { data } = await query;
    setListings(data || []);
    setLoading(false);
  };

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

  const filteredListings = search.trim()
    ? listings.filter((l: any) =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description?.toLowerCase().includes(search.toLowerCase())
      )
    : listings;

  const filteredKiosks = search.trim()
    ? kiosks.filter((k) =>
        k.name.toLowerCase().includes(search.toLowerCase()) ||
        k.description?.toLowerCase().includes(search.toLowerCase())
      )
    : kiosks;

  return (
    <>
      <Navbar />
      <main className="bg-bk-cream py-10 min-h-screen">
        <div className="mx-auto max-w-[1280px] px-6">
          <h1 className="text-[36px] font-bold text-bk-dark mb-2">Discover</h1>
          <p className="text-[16px] text-bk-muted mb-6">Browse listings and verified vendors near you</p>

          {/* Tabs */}
          <div className="flex gap-1 bg-bk-beige rounded-xl p-1 mb-6 w-fit">
            {(["listings", "kiosks"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition capitalize ${
                  tab === t ? "bg-bk-dark text-bk-cream" : "text-bk-muted hover:text-bk-dark"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bk-muted" />
              <input
                type="text"
                placeholder={tab === "listings" ? "Search listings..." : "Search kiosks..."}
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

          {/* Listing-specific filters */}
          {tab === "listings" && (
            <div className="flex flex-wrap gap-3 mb-6">
              {/* Condition chips */}
              <div className="flex gap-1.5">
                {["", "new", "used", "refurbished"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCondition(c)}
                    className={`px-3 py-1.5 rounded-full text-[13px] font-medium border transition ${
                      selectedCondition === c ? "border-bk-dark bg-bk-dark text-bk-cream" : "border-bk-beige text-bk-muted hover:text-bk-dark"
                    }`}
                  >
                    {c === "" ? "All" : CONDITION_LABELS[c]}
                  </button>
                ))}
              </div>

              {/* Price range */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min GHS"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-24 px-3 py-1.5 rounded-lg border border-bk-beige bg-white text-bk-dark text-[13px] focus:outline-none focus:ring-1 focus:ring-bk-yellow"
                />
                <span className="text-bk-muted text-[13px]">-</span>
                <input
                  type="number"
                  placeholder="Max GHS"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-24 px-3 py-1.5 rounded-lg border border-bk-beige bg-white text-bk-dark text-[13px] focus:outline-none focus:ring-1 focus:ring-bk-yellow"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-bk-beige bg-white text-bk-dark text-[13px] focus:outline-none focus:ring-1 focus:ring-bk-yellow"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
            </div>
          ) : tab === "listings" ? (
            /* Listings grid */
            filteredListings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-bk-beige p-12 text-center">
                <p className="text-[18px] text-bk-dark font-semibold mb-2">No listings found</p>
                <p className="text-[15px] text-bk-muted">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredListings.map((listing: any) => (
                  <Link
                    key={listing.id}
                    to="/listing/$slug"
                    params={{ slug: listing.slug }}
                    className="bg-white rounded-xl overflow-hidden border border-bk-beige hover:shadow-lg transition group block"
                  >
                    <div className="aspect-square bg-bk-beige overflow-hidden">
                      {listing.listing_images?.[0]?.image_url ? (
                        <img
                          src={listing.listing_images[0].image_url}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Tag className="w-10 h-10 text-bk-muted opacity-30" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-[14px] font-semibold text-bk-dark truncate mb-1">{listing.title}</h3>
                      <p className="text-[16px] font-bold text-bk-dark mb-1.5">{formatPrice(Number(listing.price), listing.currency)}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-[11px] font-medium bg-bk-cream px-2 py-0.5 rounded-full text-bk-muted">
                          {CONDITION_LABELS[listing.condition] || listing.condition}
                        </span>
                        {listing.is_negotiable && (
                          <span className="text-[11px] font-medium bg-bk-teal px-2 py-0.5 rounded-full text-bk-dark">
                            Negotiable
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-bk-muted">
                        {listing.region && (
                          <span className="flex items-center gap-0.5 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {listing.city ? `${listing.city}` : listing.region}
                          </span>
                        )}
                        <span className="shrink-0">{timeAgo(listing.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          ) : (
            /* Kiosks grid */
            filteredKiosks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-bk-beige p-12 text-center">
                <p className="text-[18px] text-bk-dark font-semibold mb-2">No kiosks found</p>
                <p className="text-[15px] text-bk-muted">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredKiosks.map((kiosk) => {
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
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
