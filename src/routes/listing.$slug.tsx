import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, MapPin, Heart, Phone, MessageCircle, Eye, ChevronLeft, ChevronRight, ShieldCheck, Tag } from "lucide-react";
import { CONDITION_LABELS, formatPrice, timeAgo, getWhatsAppUrl, getCallUrl } from "@/lib/constants";

export const Route = createFileRoute("/listing/$slug")({
  head: () => ({
    meta: [
      { title: "Listing | BlueKiosk" },
      { name: "description", content: "View listing details on BlueKiosk marketplace." },
    ],
  }),
  component: ListingDetailPage,
});

function ListingDetailPage() {
  const { slug } = Route.useParams();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [relatedListings, setRelatedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [slug]);

  useEffect(() => {
    if (listing && user) checkFavorite();
  }, [listing, user]);

  const fetchListing = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*, categories(name, slug, icon_name), kiosks(name, slug, phone, is_verified, owner_id), listing_stats(views_count)")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setListing(data);
    supabase.rpc("increment_listing_views", { _listing_id: data.id });

    const { data: imgs } = await supabase
      .from("listing_images")
      .select("*")
      .eq("listing_id", data.id)
      .order("sort_order");
    setImages(imgs || []);

    // Related from same kiosk
    const { data: related } = await supabase
      .from("listings")
      .select("id, title, slug, price, currency, condition, listing_images(image_url)")
      .eq("kiosk_id", data.kiosk_id)
      .eq("status", "active")
      .neq("id", data.id)
      .limit(4);
    setRelatedListings(related || []);

    setLoading(false);
  };

  const checkFavorite = async () => {
    if (!user || !listing) return;
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("listing_id", listing.id)
      .maybeSingle();
    setIsFavorited(!!data);
  };

  const toggleFavorite = async () => {
    if (!user || !listing) return;
    setFavLoading(true);
    if (isFavorited) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listing.id);
      setIsFavorited(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, listing_id: listing.id });
      setIsFavorited(true);
    }
    setFavLoading(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream">
          <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
        </div>
      </>
    );
  }

  if (notFound || !listing) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream px-4">
          <div className="text-center">
            <h1 className="text-[28px] font-bold text-bk-dark mb-2">Listing not found</h1>
            <Link to="/discover" className="inline-block text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">
              Browse Listings
            </Link>
          </div>
        </div>
      </>
    );
  }

  const phone = listing.kiosks?.phone;
  const whatsappMsg = `Hi, I saw your listing "${listing.title}" on BlueKiosk. Is it still available?`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-cream">
        <div className="mx-auto max-w-[1280px] px-6 pt-6">
          <Link to="/discover" className="inline-flex items-center gap-2 text-[14px] text-bk-muted hover:text-bk-dark transition">
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>

        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Images */}
            <div className="flex-1 max-w-[640px]">
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-bk-beige mb-4">
                {images.length > 0 ? (
                  <>
                    <img src={images[currentImg].image_url} alt={listing.title} className="w-full h-full object-contain" />
                    {images.length > 1 && (
                      <>
                        <button onClick={() => setCurrentImg((p) => (p - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-bk-dark/50 rounded-full flex items-center justify-center">
                          <ChevronLeft className="w-5 h-5 text-bk-cream" />
                        </button>
                        <button onClick={() => setCurrentImg((p) => (p + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-bk-dark/50 rounded-full flex items-center justify-center">
                          <ChevronRight className="w-5 h-5 text-bk-cream" />
                        </button>
                        <span className="absolute bottom-3 right-3 text-[12px] bg-bk-dark/60 text-bk-cream px-3 py-1 rounded-full">
                          {currentImg + 1}/{images.length}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-bk-muted">
                    <Tag className="w-12 h-12 opacity-30" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition ${i === currentImg ? "border-bk-dark" : "border-bk-beige"}`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-[28px] md:text-[36px] font-bold text-bk-dark tracking-tight">{listing.title}</h1>
                {isAuthenticated && (
                  <button
                    onClick={toggleFavorite}
                    disabled={favLoading}
                    className="mt-2 shrink-0"
                    title={isFavorited ? "Remove from saved" : "Save listing"}
                  >
                    <Heart className={`w-7 h-7 transition ${isFavorited ? "fill-red-500 text-red-500" : "text-bk-muted hover:text-red-400"}`} />
                  </button>
                )}
              </div>

              <p className="text-[28px] font-bold text-bk-dark mb-4">
                {formatPrice(Number(listing.price), listing.currency)}
                {listing.pricing_type === "range" && listing.price_max && (
                  <span> - {formatPrice(Number(listing.price_max), listing.currency)}</span>
                )}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-[12px] font-medium bg-bk-beige text-bk-dark px-3 py-1 rounded-full">
                  {CONDITION_LABELS[listing.condition] || listing.condition}
                </span>
                {listing.is_negotiable && (
                  <span className="text-[12px] font-medium bg-bk-teal text-bk-dark px-3 py-1 rounded-full">
                    Negotiable
                  </span>
                )}
                <span className="text-[12px] font-medium bg-bk-beige text-bk-dark px-3 py-1 rounded-full capitalize">
                  {listing.listing_type}
                </span>
                {listing.categories && (
                  <span className="text-[12px] font-medium bg-bk-cream-dark text-bk-dark px-3 py-1 rounded-full">
                    {listing.categories.name}
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-[13px] text-bk-muted">
                {listing.region && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.city ? `${listing.city}, ` : ""}{listing.region}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {(listing.listing_stats?.views_count || 0) + 1} views
                </span>
                <span>{timeAgo(listing.created_at)}</span>
              </div>

              {/* Description */}
              {listing.description && (
                <div className="mb-8">
                  <h2 className="text-[16px] font-bold text-bk-dark mb-2">Description</h2>
                  <p className="text-[15px] text-bk-muted leading-relaxed whitespace-pre-line">{listing.description}</p>
                </div>
              )}

              {/* Contact buttons */}
              <div className="space-y-3 mb-8">
                {phone ? (
                  <>
                    <a
                      href={getWhatsAppUrl(phone, whatsappMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full text-[15px] font-semibold bg-green-600 text-white py-3.5 rounded-full hover:bg-green-700 transition"
                    >
                      <MessageCircle className="w-5 h-5" /> WhatsApp
                    </a>
                    <a
                      href={getCallUrl(phone)}
                      className="flex items-center justify-center gap-2 w-full text-[15px] font-semibold border-2 border-bk-dark text-bk-dark py-3.5 rounded-full hover:bg-bk-beige transition"
                    >
                      <Phone className="w-5 h-5" /> Call Seller
                    </a>
                  </>
                ) : (
                  <Link
                    to="/kiosk/$slug"
                    params={{ slug: listing.kiosks?.slug || "" }}
                    className="flex items-center justify-center gap-2 w-full text-[15px] font-semibold border-2 border-bk-dark text-bk-dark py-3.5 rounded-full hover:bg-bk-beige transition"
                  >
                    Visit Kiosk to Contact Seller
                  </Link>
                )}
              </div>

              {/* Seller card */}
              <div className="bg-white rounded-2xl border border-bk-beige p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-bk-beige flex items-center justify-center text-[16px] font-bold text-bk-dark">
                    {listing.kiosks?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] font-bold text-bk-dark">{listing.kiosks?.name}</span>
                      {listing.kiosks?.is_verified && <ShieldCheck className="w-4 h-4 text-green-600" />}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/kiosk/$slug"
                    params={{ slug: listing.kiosks?.slug || "" }}
                    className="block text-center text-[13px] font-semibold text-bk-dark border border-bk-beige py-2.5 rounded-full hover:bg-bk-beige transition"
                  >
                    View Kiosk
                  </Link>
                  <Link
                    to="/seller/$id"
                    params={{ id: listing.kiosks?.owner_id || "" }}
                    className="block text-center text-[13px] font-medium text-bk-muted hover:text-bk-dark py-2 transition"
                  >
                    View Seller Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related listings */}
          {relatedListings.length > 0 && (
            <div className="mt-16 mb-8">
              <h2 className="text-[20px] font-bold text-bk-dark mb-6">More from this seller</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedListings.map((rl: any) => (
                  <Link
                    key={rl.id}
                    to="/listing/$slug"
                    params={{ slug: rl.slug }}
                    className="bg-white rounded-xl overflow-hidden border border-bk-beige hover:shadow-md transition group block"
                  >
                    <div className="aspect-square bg-bk-beige overflow-hidden">
                      {rl.listing_images?.[0]?.image_url ? (
                        <img src={rl.listing_images[0].image_url} alt={rl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Tag className="w-8 h-8 text-bk-muted opacity-30" /></div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-[14px] font-semibold text-bk-dark truncate">{rl.title}</h3>
                      <p className="text-[14px] font-bold text-bk-dark">{formatPrice(Number(rl.price), rl.currency)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
