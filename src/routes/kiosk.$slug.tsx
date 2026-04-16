import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { MapPin, CheckCircle, Eye, Phone, ArrowLeft, Loader2 } from "lucide-react";
import { getCategoryIcon } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/kiosk/$slug")({
  head: () => ({
    meta: [
      { title: "Kiosk | BlueKiosk" },
      { name: "description", content: "View vendor kiosk details on BlueKiosk." },
    ],
  }),
  component: KioskDetailPage,
});

type KioskDetail = Tables<"kiosks"> & {
  categories: { name: string; slug: string; icon_name: string | null } | null;
  kiosk_stats: { views_count: number } | null;
};

function KioskDetailPage() {
  const { slug } = Route.useParams();
  const [kiosk, setKiosk] = useState<KioskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchKiosk();
  }, [slug]);

  const fetchKiosk = async () => {
    const { data, error } = await supabase
      .from("kiosks")
      .select("*, categories(name, slug, icon_name), kiosk_stats(views_count)")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setKiosk(data as unknown as KioskDetail);
      // Increment views
      supabase.rpc("increment_kiosk_views", { _kiosk_id: data.id });
    }
    setLoading(false);
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

  if (notFound || !kiosk) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream px-4">
          <div className="text-center">
            <h1 className="text-[28px] font-bold text-bk-dark mb-2">Kiosk not found</h1>
            <p className="text-[15px] text-bk-muted mb-6">This kiosk doesn't exist or has been removed.</p>
            <Link
              to="/discover"
              className="inline-block text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition"
            >
              Browse Kiosks
            </Link>
          </div>
        </div>
      </>
    );
  }

  const Icon = getCategoryIcon(kiosk.categories?.icon_name || null);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-cream">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1280px] px-6 pt-6">
          <Link to="/discover" className="inline-flex items-center gap-2 text-[14px] text-bk-muted hover:text-bk-dark transition">
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>

        {/* Cover */}
        <div className="mx-auto max-w-[1280px] px-6 pt-4 pb-8">
          <div className="rounded-2xl overflow-hidden bg-bk-beige aspect-[3/1] max-h-[360px]">
            {kiosk.cover_image_url ? (
              <img
                src={kiosk.cover_image_url}
                alt={kiosk.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {Icon ? <Icon className="w-16 h-16 text-bk-muted" /> : <MapPin className="w-16 h-16 text-bk-muted" />}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mx-auto max-w-[1280px] px-6 pb-16">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main content */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-[28px] md:text-[36px] font-bold text-bk-dark tracking-tight">
                  {kiosk.name}
                </h1>
                {kiosk.is_verified && (
                  <CheckCircle className="w-6 h-6 text-bk-dark mt-2 shrink-0" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-[14px] text-bk-muted">
                {kiosk.categories && (
                  <span className="bg-bk-beige px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                    {Icon && <Icon className="w-4 h-4" />}
                    {kiosk.categories.name}
                  </span>
                )}
                {kiosk.city && kiosk.region && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {kiosk.city}, {kiosk.region}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> {(kiosk.kiosk_stats?.views_count || 0) + 1} views
                </span>
              </div>

              {kiosk.description && (
                <div className="mb-8">
                  <h2 className="text-[18px] font-bold text-bk-dark mb-3">About this Kiosk</h2>
                  <p className="text-[15px] text-bk-muted leading-relaxed whitespace-pre-line">
                    {kiosk.description}
                  </p>
                </div>
              )}

              {/* Placeholder for products */}
              <div className="bg-white rounded-2xl border border-bk-beige p-8 text-center">
                <h2 className="text-[18px] font-bold text-bk-dark mb-2">Products</h2>
                <p className="text-[14px] text-bk-muted">
                  This vendor hasn't listed any products yet. Check back soon!
                </p>
              </div>
            </div>

            {/* Sidebar: Vendor info */}
            <div className="lg:w-[320px] shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Vendor card */}
                <div className="bg-white rounded-2xl border border-bk-beige p-6">
                  <h3 className="text-[14px] font-semibold text-bk-muted mb-4">Vendor</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-bk-beige flex items-center justify-center text-[18px] font-bold text-bk-dark">
                      {kiosk.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-bk-dark">
                        {kiosk.name}
                      </p>
                      <p className="text-[12px] text-bk-muted">
                        Member since {new Date(kiosk.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {kiosk.phone && (
                    <a
                      href={`tel:${kiosk.phone}`}
                      className="flex items-center gap-2 text-[14px] text-bk-dark hover:text-bk-muted transition mb-4"
                    >
                      <Phone className="w-4 h-4" /> {kiosk.phone}
                    </a>
                  )}

                  <Link
                    to="/register"
                    className="block w-full text-center text-[14px] font-semibold bg-bk-yellow text-bk-dark py-3 rounded-full hover:bg-bk-yellow-hover transition"
                  >
                    Contact Vendor
                  </Link>
                </div>

                {/* Location card */}
                {kiosk.region && (
                  <div className="bg-white rounded-2xl border border-bk-beige p-6">
                    <h3 className="text-[14px] font-semibold text-bk-muted mb-3">Location</h3>
                    <p className="text-[15px] text-bk-dark flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-bk-muted" />
                      {kiosk.city ? `${kiosk.city}, ` : ""}{kiosk.region}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="bg-white rounded-2xl border border-bk-beige p-6">
                  <h3 className="text-[14px] font-semibold text-bk-muted mb-3">Status</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${kiosk.status === "active" ? "bg-green-500" : "bg-amber-500"}`} />
                    <span className="text-[14px] text-bk-dark capitalize">{kiosk.status}</span>
                  </div>
                  {kiosk.is_verified && (
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="w-4 h-4 text-bk-dark" />
                      <span className="text-[14px] text-bk-dark">Verified Vendor</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
