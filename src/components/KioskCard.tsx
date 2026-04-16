import { Link } from "@tanstack/react-router";
import { MapPin, ShieldCheck, Store, ArrowRight } from "lucide-react";
import { getCategoryIcon } from "@/lib/constants";

type Kiosk = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  region?: string | null;
  city?: string | null;
  is_verified?: boolean | null;
  cover_image_url?: string | null;
  categories?: { name?: string | null; icon_name?: string | null } | null;
  listings?: { count: number }[] | null;
  kiosk_stats?: { views_count?: number } | null;
};

interface Props {
  kiosk: Kiosk;
  variant?: "default" | "compact";
}

export default function KioskCard({ kiosk, variant = "default" }: Props) {
  const Icon = kiosk.categories?.icon_name ? getCategoryIcon(kiosk.categories.icon_name) : Store;
  const listingCount = kiosk.listings?.[0]?.count;

  if (variant === "compact") {
    return (
      <Link
        to="/kiosk/$slug"
        params={{ slug: kiosk.slug }}
        className="bg-white rounded-xl border border-bk-beige hover:shadow-md transition group block overflow-hidden"
      >
        <div className="aspect-[16/9] bg-bk-page overflow-hidden relative">
          {kiosk.cover_image_url ? (
            <img src={kiosk.cover_image_url} alt={kiosk.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-bk-muted">{Icon && <Icon className="w-10 h-10 opacity-30" />}</div>
          )}
          {kiosk.is_verified && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bk-red text-white text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-[13px] font-bold text-bk-dark truncate">{kiosk.name}</h3>
          {(kiosk.city || kiosk.region) && (
            <p className="text-[11px] text-bk-muted flex items-center gap-1 mt-1 truncate">
              <MapPin className="w-3 h-3 shrink-0" /> {kiosk.city || kiosk.region}
            </p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/kiosk/$slug"
      params={{ slug: kiosk.slug }}
      className="bg-white rounded-2xl border border-bk-beige hover:shadow-lg transition group block overflow-hidden"
    >
      <div className="aspect-[16/10] bg-bk-page overflow-hidden relative">
        {kiosk.cover_image_url ? (
          <img src={kiosk.cover_image_url} alt={kiosk.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-bk-muted">{Icon && <Icon className="w-12 h-12 opacity-30" />}</div>
        )}
        {kiosk.is_verified && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-bk-red text-white text-[10px] font-bold shadow-sm">
            <ShieldCheck className="w-3 h-3" /> Verified
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-[15px] font-bold text-bk-dark truncate flex-1">{kiosk.name}</h3>
        </div>
        {kiosk.categories?.name && (
          <p className="text-[10px] uppercase tracking-wider text-bk-muted font-semibold mt-0.5">{kiosk.categories.name}</p>
        )}
        {kiosk.description && <p className="text-[13px] text-bk-muted line-clamp-2 mt-2">{kiosk.description}</p>}
        <div className="flex items-center justify-between mt-3 text-[11px] text-bk-muted">
          {(kiosk.city || kiosk.region) ? (
            <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" />{kiosk.city || kiosk.region}</span>
          ) : <span />}
          {typeof listingCount === "number" && (
            <span className="font-semibold text-bk-dark">{listingCount} listing{listingCount === 1 ? "" : "s"}</span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[12px] font-bold text-bk-dark inline-flex items-center gap-1 group-hover:text-bk-orange transition">
            View Kiosk <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
