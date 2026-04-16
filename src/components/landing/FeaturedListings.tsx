import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ListingCard from "@/components/ListingCard";

export default function FeaturedListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("listings")
      .select("id, title, slug, price, currency, condition, is_negotiable, region, city, created_at, listing_images(image_url), kiosks(name, phone, is_verified)")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setListings(data || []);
        setLoading(false);
      });
  }, []);

  const scroll = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-14 bg-bk-page">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[24px] md:text-[32px] font-bold text-bk-dark tracking-tight">Latest Listings</h2>
            <p className="text-[14px] md:text-[15px] text-bk-muted mt-1">Fresh from verified vendors across Ghana</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll(-1)} className="hidden md:flex w-10 h-10 rounded-full bg-white border border-bk-beige hover:border-bk-dark items-center justify-center transition" aria-label="Scroll left">
              <ChevronLeft className="w-4 h-4 text-bk-dark" />
            </button>
            <button onClick={() => scroll(1)} className="hidden md:flex w-10 h-10 rounded-full bg-white border border-bk-beige hover:border-bk-dark items-center justify-center transition" aria-label="Scroll right">
              <ChevronRight className="w-4 h-4 text-bk-dark" />
            </button>
            <Link to="/discover" className="inline-flex items-center gap-1 text-[13px] font-semibold text-bk-dark hover:text-bk-orange transition ml-2">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-bk-muted" /></div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-bk-beige p-12 text-center">
            <p className="text-[16px] text-bk-dark font-semibold mb-1">No listings yet</p>
            <p className="text-[14px] text-bk-muted">Check back soon for new items from local vendors.</p>
          </div>
        ) : (
          <div ref={scrollRef} className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide -mx-4 md:-mx-6 px-4 md:px-6 pb-2 snap-x snap-mandatory">
            {listings.map((l) => (
              <div key={l.id} className="w-[160px] sm:w-[200px] md:w-[220px] shrink-0 snap-start">
                <ListingCard listing={l} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
