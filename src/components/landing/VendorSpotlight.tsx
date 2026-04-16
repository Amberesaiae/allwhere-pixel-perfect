import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, ShieldCheck, Store, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getCategoryIcon } from "@/lib/constants";

export default function VendorSpotlight() {
  const [kiosks, setKiosks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("kiosks")
      .select("id, name, slug, description, region, city, is_verified, cover_image_url, categories(name, icon_name)")
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
            <Link to="/discover" search={{ tab: "kiosks", category: "" }} className="inline-flex items-center gap-1 text-[13px] font-semibold text-bk-dark hover:text-bk-orange transition ml-2">
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
            {kiosks.map((k) => {
              const Icon = k.categories?.icon_name ? getCategoryIcon(k.categories.icon_name) : Store;
              return (
                <Link
                  key={k.id}
                  to="/kiosk/$slug"
                  params={{ slug: k.slug }}
                  className="w-[260px] md:w-[280px] shrink-0 bg-white rounded-2xl border border-bk-beige hover:shadow-lg transition group block overflow-hidden"
                >
                  <div className="aspect-[16/10] bg-bk-page overflow-hidden relative">
                    {k.cover_image_url ? (
                      <img src={k.cover_image_url} alt={k.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-bk-muted">
                        {Icon && <Icon className="w-12 h-12 opacity-30" />}
                      </div>
                    )}
                    {k.is_verified && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-bk-red text-white text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[15px] font-bold text-bk-dark truncate">{k.name}</h3>
                    {k.categories && (
                      <p className="text-[11px] uppercase tracking-wider text-bk-muted font-semibold mt-0.5">{k.categories.name}</p>
                    )}
                    {k.description && <p className="text-[13px] text-bk-muted line-clamp-2 mt-2">{k.description}</p>}
                    {(k.city || k.region) && (
                      <p className="text-[12px] text-bk-muted flex items-center gap-1 mt-3">
                        <MapPin className="w-3 h-3" /> {k.city ? `${k.city}, ` : ""}{k.region}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
