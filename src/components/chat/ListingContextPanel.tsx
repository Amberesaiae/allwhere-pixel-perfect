import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag, Store, Loader2 } from "lucide-react";
import PriceComparison from "./PriceComparison";

interface Props {
  listingId: string | null;
  kioskId: string;
  kioskName: string;
  kioskSlug: string;
}

interface ListingDetail {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  category_id: string | null;
  thumb: string | null;
}

interface KioskListing {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  thumb: string | null;
}

function fmt(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

export default function ListingContextPanel({ listingId, kioskId, kioskName, kioskSlug }: Props) {
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [kioskListings, setKioskListings] = useState<KioskListing[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      if (listingId) {
        const { data } = await supabase
          .from("listings")
          .select("id, slug, title, price, currency, category_id, listing_images(image_url, sort_order)")
          .eq("id", listingId)
          .maybeSingle();
        if (cancelled) return;
        if (data) {
          const img = ((data as any).listing_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)[0];
          setListing({
            id: data.id,
            slug: data.slug,
            title: data.title,
            price: Number(data.price),
            currency: data.currency,
            category_id: data.category_id,
            thumb: img?.image_url ?? null,
          });
        }
        setKioskListings(null);
      } else {
        // Kiosk-level chat: load other listings from this kiosk
        const { data } = await supabase
          .from("listings")
          .select("id, slug, title, price, currency, listing_images(image_url, sort_order)")
          .eq("kiosk_id", kioskId)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(8);
        if (cancelled) return;
        setKioskListings(
          (data ?? []).map((r: any) => {
            const img = (r.listing_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)[0];
            return {
              id: r.id,
              slug: r.slug,
              title: r.title,
              price: Number(r.price),
              currency: r.currency,
              thumb: img?.image_url ?? null,
            };
          })
        );
        setListing(null);
      }
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [listingId, kioskId]);

  return (
    <aside className="bg-white md:rounded-2xl md:border md:border-bk-beige h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-bk-beige flex items-center gap-2 flex-shrink-0">
        <Tag className="w-4 h-4 text-bk-muted" />
        <h2 className="text-[14px] font-bold text-bk-dark">Context</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-bk-muted">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {listing ? (
              <>
                <Link
                  to="/listing/$slug"
                  params={{ slug: listing.slug }}
                  className="block rounded-xl border border-bk-beige overflow-hidden hover:shadow-sm transition"
                >
                  {listing.thumb && (
                    <img src={listing.thumb} alt="" className="w-full aspect-[4/3] object-cover" />
                  )}
                  <div className="p-3">
                    <p className="text-[13px] font-bold text-bk-dark line-clamp-2 leading-tight">{listing.title}</p>
                    <p className="text-[15px] font-bold text-bk-dark mt-1">{fmt(listing.price, listing.currency)}</p>
                    <Link
                      to="/kiosk/$slug"
                      params={{ slug: kioskSlug }}
                      className="text-[11px] text-bk-muted hover:text-bk-dark inline-flex items-center gap-1 mt-1"
                    >
                      <Store className="w-3 h-3" /> {kioskName}
                    </Link>
                  </div>
                </Link>

                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-bk-muted mb-2 px-1">
                    Price comparison
                  </h3>
                  <PriceComparison
                    listingId={listing.id}
                    categoryId={listing.category_id}
                    basePrice={listing.price}
                    currency={listing.currency}
                  />
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/kiosk/$slug"
                  params={{ slug: kioskSlug }}
                  className="block rounded-xl border border-bk-beige p-3 hover:shadow-sm transition"
                >
                  <p className="text-[11px] uppercase tracking-wider text-bk-muted">Kiosk</p>
                  <p className="text-[14px] font-bold text-bk-dark mt-0.5">{kioskName}</p>
                </Link>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-bk-muted mb-2 px-1">
                    Other listings
                  </h3>
                  {kioskListings && kioskListings.length > 0 ? (
                    <ul className="space-y-2">
                      {kioskListings.map((l) => (
                        <li key={l.id}>
                          <Link
                            to="/listing/$slug"
                            params={{ slug: l.slug }}
                            className="flex items-start gap-2.5 rounded-xl border border-bk-beige bg-white p-2.5 hover:shadow-sm transition"
                          >
                            <div className="w-12 h-12 rounded-lg bg-bk-page overflow-hidden flex-shrink-0">
                              {l.thumb && <img src={l.thumb} alt="" className="w-full h-full object-cover" loading="lazy" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12.5px] font-semibold text-bk-dark line-clamp-2 leading-tight">{l.title}</p>
                              <p className="text-[13px] font-bold text-bk-dark mt-1">{fmt(l.price, l.currency)}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[12px] text-bk-muted px-3 py-4 text-center">No other listings yet.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      )}
    </aside>
  );
}
