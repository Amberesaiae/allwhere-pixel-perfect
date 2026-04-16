import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import KioskCard from "@/components/KioskCard";

export default function VerifiedKiosksNearYou() {
  const [kiosks, setKiosks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("kiosks")
      .select("id, name, slug, description, region, city, is_verified, cover_image_url, categories(name, icon_name), listings(count)")
      .eq("status", "active")
      .eq("is_verified", true)
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => {
        setKiosks(data || []);
        setLoading(false);
      });
  }, []);

  if (!loading && kiosks.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-bk-page">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[22px] md:text-[28px] font-bold text-bk-dark tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-bk-red" /> Verified Kiosks Near You
            </h2>
            <p className="text-[13px] md:text-[14px] text-bk-muted mt-1">Trusted vendors ready to serve buyers in Ghana</p>
          </div>
          <Link to="/discover" search={{ tab: "kiosks", category: "", q: "" }} className="inline-flex items-center gap-1 text-[13px] font-semibold text-bk-dark hover:text-bk-orange transition">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-bk-muted" /></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {kiosks.map((k) => <KioskCard key={k.id} kiosk={k} />)}
          </div>
        )}
      </div>
    </section>
  );
}
