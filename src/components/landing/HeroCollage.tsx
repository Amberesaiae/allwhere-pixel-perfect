import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Tag, ShieldCheck, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/constants";

export default function HeroCollage() {
  const [featured, setFeatured] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("listings")
      .select("id, title, slug, price, currency, region, city, listing_images(image_url), kiosks(name, is_verified)")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        const list = data || [];
        setFeatured(list[0] || null);
        setItems(list.slice(1, 5));
      });
  }, []);

  return (
    <section className="py-6 md:py-8">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* Large featured tile */}
          <Link
            to={featured ? "/listing/$slug" : "/discover"}
            params={featured ? { slug: featured.slug } : undefined as any}
            className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden bg-gradient-to-br from-bk-yellow via-bk-yellow/70 to-bk-teal min-h-[280px] md:min-h-[420px] group"
          >
            {featured?.listing_images?.[0]?.image_url ? (
              <img src={featured.listing_images[0].image_url} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-bk-dark/80 via-bk-dark/20 to-transparent" />
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-bk-red text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow">
              <ShieldCheck className="w-3 h-3" /> Featured
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 text-white">
              <p className="text-[11px] uppercase tracking-wider font-semibold opacity-80 mb-1">
                {featured?.kiosks?.name || "BlueKiosk"}
              </p>
              <h2 className="text-[22px] md:text-[32px] font-bold leading-tight line-clamp-2 mb-2">
                {featured?.title || "Find trusted vendors near you in Ghana"}
              </h2>
              <div className="flex items-center justify-between gap-3">
                <div>
                  {featured ? (
                    <p className="text-[20px] md:text-[26px] font-bold text-bk-yellow">
                      {formatPrice(Number(featured.price), featured.currency || "GHS")}
                    </p>
                  ) : (
                    <p className="text-[14px] opacity-90">Browse the marketplace and connect with sellers via WhatsApp</p>
                  )}
                  {featured && (featured.city || featured.region) && (
                    <p className="text-[12px] opacity-80 inline-flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {featured.city || featured.region}
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 bg-bk-yellow text-bk-dark text-[13px] font-bold px-4 py-2.5 rounded-full">
                  {featured ? "View" : "Browse"} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Small tiles */}
          {items.length > 0 ? items.map((it) => (
            <Link
              key={it.id}
              to="/listing/$slug"
              params={{ slug: it.slug }}
              className="relative rounded-2xl overflow-hidden bg-white border border-bk-beige min-h-[140px] md:min-h-[200px] group"
            >
              {it.listing_images?.[0]?.image_url ? (
                <img src={it.listing_images[0].image_url} alt={it.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-bk-page"><Tag className="w-8 h-8 text-bk-muted opacity-30" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bk-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-[11px] font-medium line-clamp-1 opacity-90">{it.title}</p>
                <p className="text-[14px] font-bold text-bk-yellow mt-0.5">{formatPrice(Number(it.price), it.currency || "GHS")}</p>
              </div>
            </Link>
          )) : Array.from({ length: 4 }).map((_, i) => (
            <Link
              key={i}
              to="/discover"
              className="relative rounded-2xl overflow-hidden bg-bk-page border border-bk-beige min-h-[140px] md:min-h-[200px] flex items-center justify-center text-bk-muted hover:bg-bk-beige transition"
            >
              <Tag className="w-8 h-8 opacity-30" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
