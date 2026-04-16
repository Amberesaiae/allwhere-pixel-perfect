import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Store, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import KioskCard from "@/components/KioskCard";

export default function VendorSpotlight() {
  const [kiosks, setKiosks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("kiosks")
      .select("id, name, slug, description, region, city, is_verified, cover_image_url, categories(name, icon_name), listings(count)")
      .eq("status", "active")
      .order("is_verified", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setKiosks(data || []);
        setLoading(false);
      });
  }, []);

  const scroll = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[24px] md:text-[32px] font-bold text-bk-dark tracking-tight">Top-Rated Kiosks</h2>
            <p className="text-[14px] md:text-[15px] text-bk-muted mt-1">Verified vendors trusted by buyers across Ghana</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll(-1)} className="hidden md:flex w-10 h-10 rounded-full bg-bk-page hover:bg-bk-beige items-center justify-center transition" aria-label="Scroll left">
              <ChevronLeft className="w-4 h-4 text-bk-dark" />
            </button>
            <button onClick={() => scroll(1)} className="hidden md:flex w-10 h-10 rounded-full bg-bk-page hover:bg-bk-beige items-center justify-center transition" aria-label="Scroll right">
              <ChevronRight className="w-4 h-4 text-bk-dark" />
            </button>
            <Link to="/discover" search={{ tab: "kiosks", category: "", q: "" }} className="inline-flex items-center gap-1 text-[13px] font-semibold text-bk-dark hover:text-bk-orange transition ml-2">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-bk-muted" /></div>
        ) : kiosks.length === 0 ? (
          <div className="bg-bk-page rounded-2xl p-12 text-center">
            <Store className="w-10 h-10 text-bk-muted opacity-30 mx-auto mb-3" />
            <p className="text-[15px] text-bk-muted">No kiosks yet. Be the first to register!</p>
          </div>
        ) : (
          <div ref={scrollRef} className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide -mx-4 md:-mx-6 px-4 md:px-6 pb-2">
            {kiosks.map((k) => (
              <div key={k.id} className="w-[260px] md:w-[280px] shrink-0">
                <KioskCard kiosk={k} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
