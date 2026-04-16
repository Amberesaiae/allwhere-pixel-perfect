import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Loader2, Tag } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import ListingCard from "@/components/ListingCard";

const tabs = [
  { label: "Latest", category: null as string | null },
  { label: "Electronics", category: "electronics" },
  { label: "Fashion", category: "fashion" },
  { label: "Food", category: "food-groceries" },
  { label: "Home", category: "home-living" },
];

export default function DealsOfTheDay() {
  const [active, setActive] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let q = supabase
        .from("listings")
        .select("id, title, slug, price, currency, is_negotiable, region, city, created_at, listing_images(image_url), kiosks(name, phone, is_verified), categories!inner(slug)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(7);
      const cat = tabs[active].category;
      if (cat) q = q.eq("categories.slug", cat);
      const { data } = await q;
      setItems(data || []);
      setLoading(false);
    };
    fetchData();
  }, [active]);

  const featured = items[0];
  const grid = items.slice(1, 7);

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[24px] md:text-[32px] font-bold text-bk-dark tracking-tight">Trending Now</h2>
            <p className="text-[14px] md:text-[15px] text-bk-muted mt-1">Hot picks across Ghana's marketplace</p>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto -mx-1 px-1 scrollbar-hide">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setActive(i)}
                className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition ${
                  i === active ? "bg-bk-dark text-white" : "bg-bk-page text-bk-muted hover:text-bk-dark"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-bk-muted" /></div>
        ) : items.length === 0 ? (
          <div className="bg-bk-page rounded-2xl p-12 text-center">
            <Tag className="w-10 h-10 text-bk-muted opacity-30 mx-auto mb-3" />
            <p className="text-[15px] text-bk-muted">No listings in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
            {/* Featured large card */}
            {featured && (
              <Link
                to="/listing/$slug"
                params={{ slug: featured.slug }}
                className="lg:col-span-1 relative rounded-2xl overflow-hidden bg-gradient-to-br from-bk-orange to-bk-red text-white min-h-[380px] group flex flex-col justify-end p-6"
              >
                {featured.listing_images?.[0]?.image_url && (
                  <>
                    <img src={featured.listing_images[0].image_url} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bk-dark/85 via-bk-dark/30 to-transparent" />
                  </>
                )}
                <div className="relative">
                  <span className="inline-block bg-bk-yellow text-bk-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2">Top Pick</span>
                  <p className="text-[11px] uppercase tracking-wider opacity-80 font-semibold mb-1">{featured.kiosks?.name || "BlueKiosk"}</p>
                  <h3 className="text-[20px] md:text-[24px] font-bold leading-tight line-clamp-2 mb-3">{featured.title}</h3>
                  <p className="text-[24px] font-bold text-bk-yellow mb-3">{formatPrice(Number(featured.price), featured.currency || "GHS")}</p>
                  <span className="inline-flex items-center gap-1 text-[13px] font-bold">View listing <ArrowRight className="w-4 h-4" /></span>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {grid.map((listing: any) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
