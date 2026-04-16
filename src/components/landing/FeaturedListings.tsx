import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Tag } from "lucide-react";
import { formatPrice, CONDITION_LABELS, timeAgo } from "@/lib/constants";

export default function FeaturedListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await supabase
          .from("listings")
          .select("id, title, slug, price, currency, condition, is_negotiable, region, city, created_at, listing_images(image_url), kiosks(name, is_verified)")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(8);
        setListings(data || []);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <section className="bg-bk-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <h2 className="text-[36px] md:text-[48px] font-bold text-bk-dark tracking-tight text-center mb-4">
          Featured Listings
        </h2>
        <p className="text-[18px] text-bk-muted text-center mb-12 max-w-[600px] mx-auto">
          Browse the latest items and services from verified vendors on BlueKiosk
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-bk-beige rounded-2xl p-12 text-center">
            <p className="text-[18px] text-bk-dark font-semibold mb-2">No listings yet</p>
            <p className="text-[15px] text-bk-muted">Listings will appear here once vendors add them to the marketplace.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {listings.map((listing: any) => (
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
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="w-10 h-10 text-bk-muted opacity-30" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-[14px] font-semibold text-bk-dark truncate mb-1">{listing.title}</h3>
                    <p className="text-[16px] font-bold text-bk-dark mb-1.5">
                      {formatPrice(Number(listing.price), listing.currency)}
                    </p>
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
                          {listing.city || listing.region}
                        </span>
                      )}
                      <span className="shrink-0">{timeAgo(listing.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/discover"
                className="inline-block text-[15px] font-semibold text-bk-dark bg-bk-yellow px-8 py-4 rounded-full hover:bg-bk-yellow-hover transition"
              >
                View All Listings
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
