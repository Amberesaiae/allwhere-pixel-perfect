import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getOrCreateConversation } from "@/lib/chat";
import { useNavigate } from "@tanstack/react-router";
import { TrendingDown, TrendingUp, Minus, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  listingId: string;
  categoryId: string | null;
  basePrice: number;
  currency: string;
}

interface Compared {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  thumb: string | null;
  kiosk_id: string;
  kiosk_name: string;
  vendor_id: string;
}

function fmt(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

export default function PriceComparison({ listingId, categoryId, basePrice, currency }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Compared[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      if (!categoryId) {
        if (!cancelled) {
          setItems([]);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("listings")
        .select("id, slug, title, price, currency, kiosk_id, owner_id, listing_images(image_url, sort_order), kiosks(name)")
        .eq("category_id", categoryId)
        .eq("status", "active")
        .neq("id", listingId)
        .order("price", { ascending: true })
        .limit(8);
      if (cancelled) return;
      const mapped: Compared[] = (data ?? []).map((r: any) => {
        const img = (r.listing_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)[0];
        return {
          id: r.id,
          slug: r.slug,
          title: r.title,
          price: Number(r.price),
          currency: r.currency,
          thumb: img?.image_url ?? null,
          kiosk_id: r.kiosk_id,
          kiosk_name: r.kiosks?.name ?? "Kiosk",
          vendor_id: r.owner_id,
        };
      });
      setItems(mapped);
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [listingId, categoryId]);

  const openChatWith = async (c: Compared) => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/chat" } });
      return;
    }
    if (user.id === c.vendor_id) {
      toast.error("That's your own listing.");
      return;
    }
    setOpening(c.id);
    try {
      const id = await getOrCreateConversation({
        customerId: user.id,
        vendorId: c.vendor_id,
        kioskId: c.kiosk_id,
        listingId: c.id,
      });
      navigate({ to: "/chat/$conversationId", params: { conversationId: id } });
    } catch (e: any) {
      toast.error(e?.message ?? "Could not open chat.");
    } finally {
      setOpening(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-bk-muted">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <p className="text-[12px] text-bk-muted px-3 py-4 text-center">
        No comparable listings in this category yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((c) => {
        const delta = basePrice > 0 ? ((c.price - basePrice) / basePrice) * 100 : 0;
        const cheaper = delta < -0.5;
        const pricier = delta > 0.5;
        const Icon = cheaper ? TrendingDown : pricier ? TrendingUp : Minus;
        const tone = cheaper
          ? "text-green-700 bg-green-50"
          : pricier
            ? "text-amber-700 bg-amber-50"
            : "text-bk-muted bg-bk-page";
        return (
          <li key={c.id} className="rounded-xl border border-bk-beige bg-white p-2.5 hover:shadow-sm transition">
            <Link
              to="/listing/$slug"
              params={{ slug: c.slug }}
              className="flex items-start gap-2.5"
            >
              <div className="w-12 h-12 rounded-lg bg-bk-page overflow-hidden flex-shrink-0">
                {c.thumb ? (
                  <img src={c.thumb} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-bk-dark line-clamp-2 leading-tight">{c.title}</p>
                <p className="text-[10.5px] text-bk-muted truncate mt-0.5">{c.kiosk_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[13px] font-bold text-bk-dark">{fmt(c.price, c.currency)}</span>
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tone}`}>
                    <Icon className="w-3 h-3" />
                    {cheaper ? `${Math.abs(delta).toFixed(0)}% cheaper` : pricier ? `${delta.toFixed(0)}% pricier` : "Same price"}
                  </span>
                </div>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => openChatWith(c)}
              disabled={opening === c.id}
              className="mt-2 w-full flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-bk-dark bg-bk-page hover:bg-bk-beige rounded-md py-1.5 transition disabled:opacity-50"
            >
              {opening === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
              Chat with this vendor
            </button>
          </li>
        );
      })}
    </ul>
  );
}
