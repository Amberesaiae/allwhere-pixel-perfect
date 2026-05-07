import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldCheck, Package } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE, type OrderStatus } from "@/lib/orders";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My orders · bluekiosk" },
      { name: "description", content: "Track your BluPay-protected orders." },
    ],
  }),
  component: OrdersPage,
});

interface Row {
  id: string;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  created_at: string;
  quantity: number;
  listings: { title: string; slug: string; listing_images: { image_url: string; sort_order: number }[] } | null;
  kiosks: { name: string } | null;
}

function OrdersPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: "/login", search: { redirect: "/orders" } });
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, status, total_amount, currency, created_at, quantity, listings(title, slug, listing_images(image_url, sort_order)), kiosks(name)")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });
      if (!cancelled) {
        setOrders((data as any) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-page">
        <div className="mx-auto max-w-[960px] px-4 md:px-6 py-6">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-bk-red" />
            <h1 className="text-[22px] font-bold text-bk-dark">My orders</h1>
          </div>
          <p className="text-[13px] text-bk-muted mb-5">All your BluPay-protected purchases.</p>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-bk-muted" /></div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-bk-beige p-10 text-center">
              <Package className="w-10 h-10 mx-auto text-bk-muted opacity-40 mb-3" />
              <p className="text-[14px] text-bk-dark font-semibold">No orders yet</p>
              <p className="text-[12.5px] text-bk-muted mt-1">When you buy something with BluPay, it shows up here.</p>
              <Link to="/discover" className="inline-block mt-4 text-[13px] font-bold bg-bk-yellow text-bk-dark px-5 py-2.5 rounded-full hover:bg-bk-yellow-hover">Browse listings</Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => {
                const thumb = (o.listings?.listing_images ?? []).sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url;
                return (
                  <li key={o.id}>
                    <Link to="/orders/$orderId" params={{ orderId: o.id }} className="flex gap-3 bg-white rounded-2xl border border-bk-beige p-3 hover:shadow-sm transition">
                      <div className="w-16 h-16 rounded-lg bg-bk-page overflow-hidden flex-shrink-0">
                        {thumb && <img src={thumb} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-bold text-bk-dark truncate">{o.listings?.title}</p>
                            <p className="text-[11.5px] text-bk-muted truncate">{o.kiosks?.name} · qty {o.quantity}</p>
                          </div>
                          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${ORDER_STATUS_TONE[o.status]}`}>
                            {ORDER_STATUS_LABELS[o.status]}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[14px] font-bold text-bk-dark">{formatPrice(Number(o.total_amount), o.currency)}</p>
                          <span className="text-[11px] text-bk-muted">{formatDistanceToNow(new Date(o.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}
