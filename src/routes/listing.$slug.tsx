import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, MapPin, Heart, Phone, MessageCircle, Eye, ChevronLeft, ChevronRight, ShieldCheck, Tag, Share2, Star, Flag } from "lucide-react";
import { CONDITION_LABELS, formatPrice, timeAgo, getWhatsAppUrl, getCallUrl } from "@/lib/constants";
import ListingCard from "@/components/ListingCard";
import ShareDialog from "@/components/ShareDialog";
import ReportDialog from "@/components/ReportDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/listing/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Listing · bluekiosk" },
      { name: "description", content: "View listing details on bluekiosk marketplace." },
      { property: "og:title", content: "Listing · bluekiosk" },
      { property: "og:description", content: "View listing details on bluekiosk marketplace." },
    ],
  }),
  component: ListingDetailPage,
});

type Tab = "description" | "specs" | "reviews";

function ListingDetailPage() {
  const { slug } = Route.useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("description");
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => { fetchListing(); }, [slug]);
  useEffect(() => { if (listing && user) checkFavorite(); }, [listing, user]);

  // Update document head with cover image once loaded (client-only OG)
  useEffect(() => {
    if (typeof document === "undefined" || !listing) return;
    document.title = `${listing.title} · bluekiosk`;
    const cover = images?.[0]?.image_url;
    const set = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const [k, v] = sel.replace(/[\[\]"]/g, "").split("=");
        el.setAttribute(k, v);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    if (cover) {
      set('meta[property="og:image"]', "content", cover);
      set('meta[name="twitter:image"]', "content", cover);
      set('meta[name="twitter:card"]', "content", "summary_large_image");
    }
    set('meta[property="og:title"]', "content", `${listing.title} · bluekiosk`);
    if (listing.description) {
      set('meta[name="description"]', "content", listing.description.slice(0, 160));
      set('meta[property="og:description"]', "content", listing.description.slice(0, 160));
    }
  }, [listing, images]);

  const fetchListing = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listings")
      .select("*, categories(name, slug, icon_name), kiosks(name, slug, phone, is_verified, cover_image_url, owner_id, region, city, created_at, categories(name)), listing_stats(views_count)")
      .eq("slug", slug)
      .single();
    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setListing(data);
    supabase.rpc("increment_listing_views", { _listing_id: data.id });

    const { data: imgs } = await supabase.from("listing_images").select("*").eq("listing_id", data.id).order("sort_order");
    setImages(imgs || []);

    const { data: rel } = await supabase
      .from("listings")
      .select("id, title, slug, price, currency, condition, is_negotiable, region, city, created_at, listing_images(image_url), kiosks(name, phone, is_verified)")
      .eq("kiosk_id", data.kiosk_id)
      .eq("status", "active")
      .neq("id", data.id)
      .limit(6);
    setRelated(rel || []);

    setLoading(false);
  };

  const checkFavorite = async () => {
    if (!user || !listing) return;
    const { data } = await supabase.from("favorites").select("id").eq("user_id", user.id).eq("listing_id", listing.id).maybeSingle();
    setIsFavorited(!!data);
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast("Sign in to save", {
        action: { label: "Sign in", onClick: () => navigate({ to: "/login", search: { redirect: `/listing/${slug}` } }) },
      });
      return;
    }
    if (!user || !listing) return;
    setFavLoading(true);
    if (isFavorited) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listing.id);
      setIsFavorited(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, listing_id: listing.id });
      setIsFavorited(true);
      toast.success("Saved to favorites");
    }
    setFavLoading(false);
  };

  const share = () => setShareOpen(true);

  if (loading) {
    return (
      <><Navbar /><div className="min-h-[60vh] flex items-center justify-center bg-bk-page"><Loader2 className="w-8 h-8 animate-spin text-bk-muted" /></div></>
    );
  }

  if (notFound || !listing) {
    return (
      <><Navbar /><div className="min-h-[60vh] flex items-center justify-center bg-bk-page px-4">
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-bk-dark mb-2">Listing not found</h1>
          <Link to="/discover" className="inline-block text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">Browse Listings</Link>
        </div>
      </div></>
    );
  }

  const phone = listing.kiosks?.phone;
  const whatsappMsg = `Hi, I saw "${listing.title}" on BlueKiosk. Is it still available?`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-page">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 pt-5">
          <p className="text-[12px] text-bk-muted">
            <Link to="/" className="hover:text-bk-dark">Home</Link> / <Link to="/discover" className="hover:text-bk-dark">Discover</Link>
            {listing.categories && <> / <span className="capitalize">{listing.categories.name}</span></>}
            <> / <span className="text-bk-dark">{listing.title}</span></>
          </p>
          <Link to="/discover" className="inline-flex items-center gap-1.5 text-[13px] text-bk-muted hover:text-bk-dark transition mt-3">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
          </Link>
        </div>

        <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-6">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            {/* Left: gallery + tabs */}
            <div>
              <div className="bg-white rounded-2xl border border-bk-beige p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Thumbnail strip */}
                  {images.length > 1 && (
                    <div className="flex md:flex-col gap-2 md:order-1 order-2 md:max-h-[440px] overflow-auto scrollbar-hide">
                      {images.map((img: any, i: number) => (
                        <button key={i} onClick={() => setCurrentImg(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition ${i === currentImg ? "border-bk-yellow" : "border-bk-beige"}`}>
                          <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Main image */}
                  <div className="relative aspect-square flex-1 bg-bk-page rounded-xl overflow-hidden md:order-2 order-1">
                    {images.length > 0 ? (
                      <>
                        <img src={images[currentImg].image_url} alt={listing.title} className="w-full h-full object-contain" />
                        {images.length > 1 && (
                          <>
                            <button onClick={() => setCurrentImg((p) => (p - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white">
                              <ChevronLeft className="w-5 h-5 text-bk-dark" />
                            </button>
                            <button onClick={() => setCurrentImg((p) => (p + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white">
                              <ChevronRight className="w-5 h-5 text-bk-dark" />
                            </button>
                            <span className="absolute bottom-3 right-3 text-[11px] bg-bk-dark/70 text-white px-2.5 py-1 rounded-full">{currentImg + 1}/{images.length}</span>
                          </>
                        )}
                        {listing.kiosks?.is_verified && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bk-red text-white text-[11px] font-bold shadow">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-bk-muted"><Tag className="w-12 h-12 opacity-30" /></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl border border-bk-beige mt-5 overflow-hidden">
                <div className="flex border-b border-bk-beige">
                  {([
                    { id: "description" as const, label: "Description" },
                    { id: "specs" as const, label: "Specifications" },
                    { id: "reviews" as const, label: "Reviews" },
                  ]).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex-1 sm:flex-none px-5 py-4 text-[13px] font-semibold transition border-b-2 ${
                        tab === t.id ? "border-bk-yellow text-bk-dark" : "border-transparent text-bk-muted hover:text-bk-dark"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="p-5 md:p-6">
                  {tab === "description" && (
                    <div className="text-[14px] text-bk-dark leading-relaxed whitespace-pre-line">
                      {listing.description || <span className="text-bk-muted">No description provided.</span>}
                    </div>
                  )}
                  {tab === "specs" && (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                      <div className="flex justify-between border-b border-bk-beige py-2"><dt className="text-bk-muted">Condition</dt><dd className="font-semibold text-bk-dark">{CONDITION_LABELS[listing.condition] || listing.condition}</dd></div>
                      <div className="flex justify-between border-b border-bk-beige py-2"><dt className="text-bk-muted">Type</dt><dd className="font-semibold text-bk-dark capitalize">{listing.listing_type}</dd></div>
                      <div className="flex justify-between border-b border-bk-beige py-2"><dt className="text-bk-muted">Negotiable</dt><dd className="font-semibold text-bk-dark">{listing.is_negotiable ? "Yes" : "No"}</dd></div>
                      {listing.categories && <div className="flex justify-between border-b border-bk-beige py-2"><dt className="text-bk-muted">Category</dt><dd className="font-semibold text-bk-dark">{listing.categories.name}</dd></div>}
                      {listing.region && <div className="flex justify-between border-b border-bk-beige py-2"><dt className="text-bk-muted">Location</dt><dd className="font-semibold text-bk-dark">{listing.city ? `${listing.city}, ` : ""}{listing.region}</dd></div>}
                      {listing.stock_quantity != null && <div className="flex justify-between border-b border-bk-beige py-2"><dt className="text-bk-muted">In stock</dt><dd className="font-semibold text-bk-dark">{listing.stock_quantity}</dd></div>}
                      <div className="flex justify-between border-b border-bk-beige py-2"><dt className="text-bk-muted">Posted</dt><dd className="font-semibold text-bk-dark">{timeAgo(listing.created_at)}</dd></div>
                    </dl>
                  )}
                  {tab === "reviews" && (
                    <div className="text-center py-8 text-bk-muted">
                      <Star className="w-10 h-10 opacity-30 mx-auto mb-2" />
                      <p className="text-[14px]">Reviews coming soon.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: details + seller */}
            <aside>
              <div className="bg-white rounded-2xl border border-bk-beige p-5 md:p-6 lg:sticky lg:top-28">
                {listing.categories && <p className="text-[11px] uppercase tracking-wider text-bk-muted font-semibold mb-2">{listing.categories.name}</p>}
                <h1 className="text-[22px] md:text-[26px] font-bold text-bk-dark leading-tight">{listing.title}</h1>

                {/* Rating placeholder */}
                <div className="flex items-center gap-1 mt-2 text-bk-muted text-[12px]">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5" />)}
                  <span className="ml-1">No reviews yet</span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-[28px] font-bold text-bk-orange">{formatPrice(Number(listing.price), listing.currency)}</p>
                  {listing.pricing_type === "range" && listing.price_max && (
                    <span className="text-[14px] text-bk-muted">– {formatPrice(Number(listing.price_max), listing.currency)}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="text-[11px] font-semibold bg-bk-page text-bk-dark px-2.5 py-1 rounded-full">{CONDITION_LABELS[listing.condition] || listing.condition}</span>
                  {listing.is_negotiable && <span className="text-[11px] font-semibold bg-bk-teal text-bk-dark px-2.5 py-1 rounded-full">Negotiable</span>}
                </div>

                <div className="flex items-center gap-3 mt-4 text-[12px] text-bk-muted">
                  {listing.region && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{listing.city || listing.region}</span>}
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{(listing.listing_stats?.views_count || 0) + 1}</span>
                  <span>{timeAgo(listing.created_at)}</span>
                </div>

                {/* Action row */}
                <div className="space-y-2 mt-5">
                  {phone ? (
                    <a href={getWhatsAppUrl(phone, whatsappMsg)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full text-[14px] font-bold bg-bk-yellow text-bk-dark py-3.5 rounded-full hover:bg-bk-yellow-hover transition">
                      <MessageCircle className="w-4 h-4" /> Contact via WhatsApp
                    </a>
                  ) : (
                    <Link to="/kiosk/$slug" params={{ slug: listing.kiosks?.slug || "" }} className="flex items-center justify-center gap-2 w-full text-[14px] font-bold bg-bk-yellow text-bk-dark py-3.5 rounded-full hover:bg-bk-yellow-hover transition">
                      Visit Kiosk to Contact
                    </Link>
                  )}
                  {phone && (
                    <a href={getCallUrl(phone)} className="flex items-center justify-center gap-2 w-full text-[14px] font-semibold border-2 border-bk-dark text-bk-dark py-3 rounded-full hover:bg-bk-page transition">
                      <Phone className="w-4 h-4" /> Call Seller
                    </a>
                  )}
                  <div className="flex gap-2">
                    {isAuthenticated && (
                      <button onClick={toggleFavorite} disabled={favLoading} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full border border-bk-beige hover:border-bk-red text-[13px] font-semibold transition">
                        <Heart className={`w-4 h-4 ${isFavorited ? "fill-bk-red text-bk-red" : "text-bk-muted"}`} />
                        {isFavorited ? "Saved" : "Save"}
                      </button>
                    )}
                    <button onClick={share} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full border border-bk-beige hover:border-bk-dark text-[13px] font-semibold text-bk-dark transition">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>

                {/* Vendor card */}
                <div className="border-t border-bk-beige mt-6 pt-5">
                  <p className="text-[11px] uppercase tracking-wider text-bk-muted font-bold mb-3">Sold by</p>
                  <Link
                    to="/kiosk/$slug"
                    params={{ slug: listing.kiosks?.slug || "" }}
                    className="flex items-center gap-3 mb-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-bk-page overflow-hidden shrink-0 border border-bk-beige">
                      {listing.kiosks?.cover_image_url ? (
                        <img src={listing.kiosks.cover_image_url} alt={listing.kiosks?.name || ""} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-bk-yellow flex items-center justify-center text-[16px] font-bold text-bk-dark">
                          {listing.kiosks?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-bold text-bk-dark truncate group-hover:text-bk-orange transition">{listing.kiosks?.name}</span>
                        {listing.kiosks?.is_verified && <ShieldCheck className="w-4 h-4 text-bk-red shrink-0" />}
                      </div>
                      {listing.kiosks?.categories?.name && (
                        <p className="text-[11px] uppercase tracking-wider text-bk-muted font-semibold">{listing.kiosks.categories.name}</p>
                      )}
                      {(listing.kiosks?.city || listing.kiosks?.region) && (
                        <p className="text-[11px] text-bk-muted flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />{listing.kiosks?.city || listing.kiosks?.region}
                        </p>
                      )}
                    </div>
                  </Link>
                  <div className="space-y-2">
                    <Link to="/kiosk/$slug" params={{ slug: listing.kiosks?.slug || "" }} className="block text-center text-[12px] font-bold bg-bk-dark text-white py-2.5 rounded-full hover:bg-bk-dark/90 transition">
                      View Kiosk
                    </Link>
                    <Link to="/seller/$id" params={{ id: listing.kiosks?.owner_id || "" }} className="block text-center text-[12px] font-medium text-bk-muted hover:text-bk-dark transition">
                      View Seller Profile
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* More from this kiosk */}
          {related.length > 0 && (
            <div className="mt-12">
              <div className="flex items-end justify-between mb-5">
                <h2 className="text-[20px] md:text-[24px] font-bold text-bk-dark">More from {listing.kiosks?.name}</h2>
                {listing.kiosks?.slug && (
                  <Link to="/kiosk/$slug" params={{ slug: listing.kiosks.slug }} className="text-[13px] font-semibold text-bk-dark hover:text-bk-orange transition">
                    Visit kiosk →
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {related.map((rl) => <ListingCard key={rl.id} listing={rl} />)}
              </div>
            </div>
          )}
        </div>
        <ShareDialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title={listing.title}
          url={typeof window !== "undefined" ? window.location.href : ""}
        />
        <ReportDialog
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          subject={listing.title}
          targetType="listing"
          targetId={listing.id}
        />

        {/* Floating report link */}
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 mt-8">
          <button
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center gap-1.5 text-[12px] text-bk-muted hover:text-bk-red transition"
          >
            <Flag className="w-3.5 h-3.5" /> Report this listing
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
