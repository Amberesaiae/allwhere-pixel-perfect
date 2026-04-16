import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, MapPin, Tag, ShieldCheck } from "lucide-react";
import { formatPrice, timeAgo, getWhatsAppUrl } from "@/lib/constants";

type Listing = {
  id: string;
  title: string;
  slug: string;
  price: number | string;
  currency?: string | null;
  is_negotiable?: boolean | null;
  region?: string | null;
  city?: string | null;
  created_at?: string;
  description?: string | null;
  listing_images?: { image_url: string }[] | null;
  kiosks?: { name?: string | null; phone?: string | null; is_verified?: boolean | null } | null;
};

interface Props {
  listing: Listing;
  variant?: "grid" | "list";
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

export default function ListingCard({ listing, variant = "grid", isFavorited, onToggleFavorite }: Props) {
  const img = listing.listing_images?.[0]?.image_url;
  const phone = listing.kiosks?.phone;
  const verified = listing.kiosks?.is_verified;

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const handleWa = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!phone) return;
    const url = getWhatsAppUrl(phone, `Hi, I saw "${listing.title}" on BlueKiosk. Is it still available?`);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (variant === "list") {
    return (
      <Link
        to="/listing/$slug"
        params={{ slug: listing.slug }}
        className="bg-white rounded-xl border border-bk-beige hover:shadow-md transition flex gap-4 p-3 group"
      >
        <div className="w-32 sm:w-40 aspect-square shrink-0 rounded-lg bg-bk-page overflow-hidden relative">
          {img ? (
            <img src={img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Tag className="w-8 h-8 text-bk-muted opacity-30" /></div>
          )}
          {verified && (
            <span className="absolute top-2 left-2 w-7 h-7 rounded-full bg-bk-red text-white flex items-center justify-center" title="Verified">
              <ShieldCheck className="w-4 h-4" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          {listing.kiosks?.name && (
            <p className="text-[10px] uppercase tracking-wider text-bk-muted font-semibold truncate">{listing.kiosks.name}</p>
          )}
          <h3 className="text-[15px] font-semibold text-bk-dark line-clamp-2 mt-0.5">{listing.title}</h3>
          {listing.description && (
            <p className="text-[13px] text-bk-muted line-clamp-2 mt-1">{listing.description}</p>
          )}
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div>
              <p className="text-[18px] font-bold text-bk-orange leading-none">{formatPrice(Number(listing.price), listing.currency || "GHS")}</p>
              <div className="flex items-center gap-2 text-[11px] text-bk-muted mt-1.5">
                {(listing.city || listing.region) && (
                  <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{listing.city || listing.region}</span>
                )}
                {listing.created_at && <span>{timeAgo(listing.created_at)}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {onToggleFavorite && (
                <button onClick={handleFav} className="w-8 h-8 rounded-full border border-bk-beige bg-white flex items-center justify-center hover:border-bk-red transition" title="Save">
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-bk-red text-bk-red" : "text-bk-muted"}`} />
                </button>
              )}
              {phone && (
                <button onClick={handleWa} className="w-9 h-9 rounded-full bg-bk-yellow hover:bg-bk-yellow-hover flex items-center justify-center transition" title="Contact on WhatsApp">
                  <MessageCircle className="w-4 h-4 text-bk-dark" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/listing/$slug"
      params={{ slug: listing.slug }}
      className="bg-white rounded-xl border border-bk-beige hover:shadow-md transition group block overflow-hidden"
    >
      <div className="relative aspect-square bg-bk-page overflow-hidden">
        {img ? (
          <img src={img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Tag className="w-10 h-10 text-bk-muted opacity-30" /></div>
        )}
        {verified && (
          <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-bk-red text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3" /> Verified
          </span>
        )}
        {!verified && listing.is_negotiable && (
          <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-bk-teal text-bk-dark text-[10px] font-bold shadow-sm">Negotiable</span>
        )}
        {onToggleFavorite && (
          <button
            onClick={handleFav}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition"
            title="Save"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-bk-red text-bk-red" : "text-bk-muted"}`} />
          </button>
        )}
      </div>
      <div className="p-3">
        {listing.kiosks?.name && (
          <p className="text-[10px] uppercase tracking-wider text-bk-muted font-semibold truncate mb-1">{listing.kiosks.name}</p>
        )}
        <h3 className="text-[14px] font-semibold text-bk-dark line-clamp-2 leading-snug min-h-[2.6em]">{listing.title}</h3>
        <p className="text-[16px] font-bold text-bk-orange mt-2">{formatPrice(Number(listing.price), listing.currency || "GHS")}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-[11px] text-bk-muted truncate">
            {(listing.city || listing.region) && (
              <><MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{listing.city || listing.region}</span></>
            )}
          </div>
          {phone && (
            <button onClick={handleWa} className="w-8 h-8 rounded-full bg-bk-yellow hover:bg-bk-yellow-hover flex items-center justify-center transition shrink-0" title="Contact on WhatsApp">
              <MessageCircle className="w-4 h-4 text-bk-dark" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
