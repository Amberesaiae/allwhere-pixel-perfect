import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, LayoutGrid, List as ListIcon, SlidersHorizontal, X, Store } from "lucide-react";
import { GHANA_REGIONS, CONDITION_LABELS } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";
import KioskCard from "@/components/KioskCard";

const discoverSearchSchema = z.object({
  category: fallback(z.string(), "").default(""),
  tab: fallback(z.enum(["listings", "kiosks"]), "listings").default("listings"),
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/discover")({
  validateSearch: zodValidator(discoverSearchSchema),
  head: () => ({
    meta: [
      { title: "Discover · bluekiosk" },
      { name: "description", content: "Browse listings and verified vendors near you in Ghana." },
      { property: "og:title", content: "Discover · bluekiosk" },
      { property: "og:description", content: "Browse listings and verified vendors across Ghana." },
    ],
  }),
  component: DiscoverPage,
});

type Kiosk = Tables<"kiosks"> & {
  categories: { name: string; slug: string; icon_name: string | null } | null;
  kiosk_stats: { views_count: number } | null;
};

function useDebounce<T>(value: T, delay: number): T {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

const PAGE_SIZE = 24;

function DiscoverPage() {
  const { category: urlCategory, tab: urlTab, q: urlQ } = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });

  const [tab, setTab] = useState<"listings" | "kiosks">(urlTab);
  const [listings, setListings] = useState<any[]>([]);
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlQ);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const dMin = useDebounce(minPrice, 300);
  const dMax = useDebounce(maxPrice, 300);
  const dSearch = useDebounce(search, 300);

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      const cats = data || [];
      setCategories(cats);
      if (urlCategory) {
        const match = cats.find((c) => c.slug === urlCategory);
        if (match) setSelectedCategory(match.id);
      } else {
        setSelectedCategory("");
      }
    });
  }, [urlCategory]);

  useEffect(() => { setTab(urlTab); }, [urlTab]);

  const handleTabChange = (t: "listings" | "kiosks") => {
    setTab(t);
    setPage(1);
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, tab: t }) });
  };

  useEffect(() => { setPage(1); }, [selectedCategory, selectedRegion, selectedCondition, sortBy, dMin, dMax, dSearch, tab]);

  useEffect(() => {
    if (tab === "listings") fetchListings();
    else fetchKiosks();
  }, [tab, selectedCategory, selectedRegion, selectedCondition, sortBy, dMin, dMax]);

  const fetchListings = async () => {
    setLoading(true);
    let q = supabase
      .from("listings")
      .select("*, categories(name, slug), listing_images(image_url), kiosks(name, slug, phone, is_verified)")
      .eq("status", "active");
    if (selectedCategory) q = q.eq("category_id", selectedCategory);
    if (selectedRegion) q = q.eq("region", selectedRegion);
    if (selectedCondition) q = q.eq("condition", selectedCondition as "new" | "used" | "refurbished");
    if (dMin) q = q.gte("price", parseFloat(dMin));
    if (dMax) q = q.lte("price", parseFloat(dMax));
    if (sortBy === "price_low") q = q.order("price", { ascending: true });
    else if (sortBy === "price_high") q = q.order("price", { ascending: false });
    else q = q.order("created_at", { ascending: false });
    const { data } = await q;
    setListings(data || []);
    setLoading(false);
  };

  const fetchKiosks = async () => {
    setLoading(true);
    let q = supabase
      .from("kiosks")
      .select("*, categories(name, slug, icon_name), kiosk_stats(views_count), listings(count)")
      .eq("status", "active")
      .order("is_verified", { ascending: false })
      .order("created_at", { ascending: false });
    if (selectedCategory) q = q.eq("category_id", selectedCategory);
    if (selectedRegion) q = q.eq("region", selectedRegion);
    const { data } = await q;
    setKiosks((data as unknown as Kiosk[]) || []);
    setLoading(false);
  };

  const filteredListings = dSearch.trim()
    ? listings.filter((l) =>
        l.title.toLowerCase().includes(dSearch.toLowerCase()) ||
        l.description?.toLowerCase().includes(dSearch.toLowerCase()))
    : listings;

  const filteredKiosks = dSearch.trim()
    ? kiosks.filter((k) =>
        k.name.toLowerCase().includes(dSearch.toLowerCase()) ||
        k.description?.toLowerCase().includes(dSearch.toLowerCase()))
    : kiosks;

  const items = tab === "listings" ? filteredListings : filteredKiosks;
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeCategoryName = categories.find((c) => c.id === selectedCategory)?.name || "All Categories";

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedRegion("");
    setSelectedCondition("");
    setMinPrice("");
    setMaxPrice("");
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, category: "" }) });
  };

  const Sidebar = () => (
    <div className="space-y-5">
      {/* Category box */}
      <div className="bg-bk-yellow rounded-2xl p-4">
        <h3 className="text-[14px] font-bold uppercase tracking-wider text-bk-dark mb-3">Categories</h3>
        <div className="space-y-1">
          <button
            onClick={() => { setSelectedCategory(""); navigate({ search: (p: Record<string, unknown>) => ({ ...p, category: "" }) }); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition ${selectedCategory === "" ? "bg-bk-dark text-white" : "text-bk-dark hover:bg-white/40"}`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelectedCategory(c.id); navigate({ search: (p: Record<string, unknown>) => ({ ...p, category: c.slug }) }); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition ${selectedCategory === c.id ? "bg-bk-dark text-white" : "text-bk-dark hover:bg-white/40"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Region */}
      <div className="bg-white rounded-2xl border border-bk-beige p-4">
        <h3 className="text-[14px] font-bold uppercase tracking-wider text-bk-dark mb-3">Region</h3>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-bk-beige bg-bk-page text-bk-dark text-[13px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
        >
          <option value="">All Regions</option>
          {GHANA_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {tab === "listings" && (
        <>
          {/* Condition */}
          <div className="bg-white rounded-2xl border border-bk-beige p-4">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-bk-dark mb-3">Condition</h3>
            <div className="flex flex-wrap gap-1.5">
              {["", "new", "used", "refurbished"].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCondition(c)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition ${
                    selectedCondition === c ? "border-bk-dark bg-bk-dark text-white" : "border-bk-beige text-bk-muted hover:text-bk-dark"
                  }`}
                >
                  {c === "" ? "Any" : CONDITION_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl border border-bk-beige p-4">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-bk-dark mb-3">Price (GHS)</h3>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-bk-beige bg-bk-page text-bk-dark text-[13px] focus:outline-none focus:ring-1 focus:ring-bk-yellow" />
              <span className="text-bk-muted text-[12px]">to</span>
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-bk-beige bg-bk-page text-bk-dark text-[13px] focus:outline-none focus:ring-1 focus:ring-bk-yellow" />
            </div>
          </div>
        </>
      )}

      <button onClick={clearFilters} className="w-full text-[13px] font-semibold text-bk-muted hover:text-bk-dark py-2 transition">
        Clear all filters
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-page py-6">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          {/* Breadcrumb / title */}
          <div className="mb-5">
            <p className="text-[12px] text-bk-muted mb-1">
              <Link to="/" className="hover:text-bk-dark">Home</Link> / <span className="text-bk-dark">Discover</span>
              {urlCategory && <> / <span className="text-bk-dark capitalize">{urlCategory.replace(/-/g, " ")}</span></>}
            </p>
            <h1 className="text-[24px] md:text-[32px] font-bold text-bk-dark">{activeCategoryName}</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 mb-5 w-fit border border-bk-beige">
            {(["listings", "kiosks"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition capitalize ${
                  tab === t ? "bg-bk-dark text-white" : "text-bk-muted hover:text-bk-dark"
                }`}
              >
                {t === "listings" ? <span className="inline-flex items-center gap-1.5"><LayoutGrid className="w-3.5 h-3.5" />Listings</span> : <span className="inline-flex items-center gap-1.5"><Store className="w-3.5 h-3.5" />Kiosks</span>}
              </button>
            ))}
          </div>

          <div className="flex gap-6">
            {/* Sidebar (desktop) */}
            <aside className="hidden lg:block w-[260px] shrink-0">
              <Sidebar />
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0">
              {/* Top bar */}
              <div className="flex items-center justify-between gap-3 mb-4 bg-white rounded-xl border border-bk-beige p-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button onClick={() => setFiltersOpen(true)} className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-bk-beige text-[13px] font-semibold text-bk-dark">
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                  </button>
                  <div className="relative flex-1 max-w-[360px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bk-muted" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={tab === "listings" ? "Search listings..." : "Search kiosks..."}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-bk-page text-bk-dark text-[13px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                    />
                  </div>
                  <span className="hidden sm:inline text-[12px] text-bk-muted whitespace-nowrap">{items.length} {items.length === 1 ? "result" : "results"}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {tab === "listings" && (
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-bk-beige bg-white text-bk-dark text-[12px] font-medium focus:outline-none focus:ring-1 focus:ring-bk-yellow"
                    >
                      <option value="newest">Newest</option>
                      <option value="price_low">Price ↑</option>
                      <option value="price_high">Price ↓</option>
                    </select>
                  )}
                  {tab === "listings" && (
                    <div className="hidden sm:flex items-center bg-bk-page rounded-lg p-0.5">
                      <button onClick={() => setView("grid")} className={`w-8 h-8 rounded flex items-center justify-center transition ${view === "grid" ? "bg-white text-bk-dark shadow-sm" : "text-bk-muted"}`} aria-label="Grid view">
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button onClick={() => setView("list")} className={`w-8 h-8 rounded flex items-center justify-center transition ${view === "list" ? "bg-white text-bk-dark shadow-sm" : "text-bk-muted"}`} aria-label="List view">
                        <ListIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Results */}
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-bk-muted" /></div>
              ) : pageItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-bk-beige p-10 md:p-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-bk-page flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-bk-muted" />
                  </div>
                  <h3 className="text-[18px] font-bold text-bk-dark mb-1.5">
                    {dSearch ? `No ${tab} match "${dSearch}"` : `No ${tab} found`}
                  </h3>
                  <p className="text-[14px] text-bk-muted max-w-md mx-auto mb-6">
                    Try adjusting your filters, search for something else, or browse popular categories.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button onClick={() => { clearFilters(); setSearch(""); }} className="text-[13px] font-semibold bg-bk-yellow text-bk-dark px-5 py-2.5 rounded-full hover:bg-bk-yellow-hover transition">
                      Clear filters
                    </button>
                    <Link to="/" className="text-[13px] font-semibold border border-bk-beige text-bk-dark px-5 py-2.5 rounded-full hover:bg-bk-page transition">
                      Browse categories
                    </Link>
                  </div>
                </div>
              ) : tab === "listings" ? (
                view === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {pageItems.map((l: any) => <ListingCard key={l.id} listing={l} />)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pageItems.map((l: any) => <ListingCard key={l.id} listing={l} variant="list" />)}
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pageItems.map((kiosk: Kiosk) => (
                    <KioskCard key={kiosk.id} kiosk={kiosk as any} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 rounded-full border border-bk-beige bg-white text-bk-dark text-[13px] font-semibold disabled:opacity-40 hover:bg-bk-page transition">‹</button>
                  {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-full text-[13px] font-semibold transition ${p === page ? "bg-bk-dark text-white" : "bg-white border border-bk-beige text-bk-dark hover:bg-bk-page"}`}>{p}</button>
                    );
                  })}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-9 h-9 rounded-full border border-bk-beige bg-white text-bk-dark text-[13px] font-semibold disabled:opacity-40 hover:bg-bk-page transition">›</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filters drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-bk-dark/50" onClick={() => setFiltersOpen(false)} />
            <div className="absolute bottom-0 inset-x-0 bg-bk-page rounded-t-2xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between p-5 pb-3 border-b border-bk-beige bg-bk-page sticky top-0 z-10">
                <h3 className="text-[18px] font-bold text-bk-dark">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} className="w-9 h-9 rounded-full bg-white border border-bk-beige flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 pt-4 pb-24">
                <Sidebar />
              </div>
              <div className="sticky bottom-0 inset-x-0 bg-white border-t border-bk-beige p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full bg-bk-yellow text-bk-dark py-3 rounded-full font-bold text-[14px] hover:bg-bk-yellow-hover transition"
                >
                  Apply ({items.length} {items.length === 1 ? "result" : "results"})
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
