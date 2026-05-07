import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Loader2, Package, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE, type OrderStatus } from "@/lib/orders";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/dashboard/orders")({
  head: () => ({
    meta: [{ title: "Vendor orders · bluekiosk" }],
  }),
  component: VendorOrdersPage,
});

function VendorOrdersPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { isVendor, loading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  useEffect(() => {
    if (isLoading || rolesLoading) return;
    if (!isAuthenticated) navigate({ to: "/login", search: { redirect: "/dashboard/orders" } });
    else if (!isVendor) navigate({ to: "/become-vendor" });
  }, [isLoading, rolesLoading, isAuthenticated, isVendor]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, status, total_amount, currency, created_at, quantity, delivery_name, listings(title, slug, listing_images(image_url, sort_order))")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });
      if (!cancelled) {
        setOrders(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const tabs: Array<{ id: "all" | OrderStatus; label: string }> = [
    { id: "all", label: "All" },
    { id: "paid_held", label: "Awaiting shipment" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "released", label: "Released" },
    { id: "disputed", label: "Disputed" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-page">
        <div className="mx-auto max-w-[1100px] px-4 md:px-6 py-6">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-bk-red" />
            <h1 className="text-[22px] font-bold text-bk-dark">Orders</h1>
          </div>
          <p className="text-[13px] text-bk-muted mb-4">Buyer orders for your kiosks. Mark items shipped to start the escrow release clock.</p>

          <div className="flex flex-wrap gap-1.5 mb-4 overflow-x-auto">
            {tabs.map((t) => {
              const count = t.id === "all" ? orders.length : orders.filter((o) => o.status === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={`text-[12.5px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition ${
                    filter === t.id ? "bg-bk-dark text-white" : "bg-white border border-bk-beige text-bk-dark hover:bg-bk-page"
                  }`}
                >
                  {t.label} <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-bk-muted" /></div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-bk-beige p-10 text-center">
              <Package className="w-10 h-10 mx-auto text-bk-muted opacity-40 mb-3" />
              <p className="text-[14px] text-bk-dark font-semibold">No orders here yet</p>
              <p className="text-[12.5px] text-bk-muted mt-1">When buyers checkout with BluPay, you'll see them here.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((o: any) => {
                const thumb = (o.listings?.listing_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url;
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
                            <p className="text-[11.5px] text-bk-muted truncate">Buyer: {o.delivery_name} · qty {o.quantity}</p>
                          </div>
                          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${ORDER_STATUS_TONE[o.status as OrderStatus]}`}>
                            {ORDER_STATUS_LABELS[o.status as OrderStatus]}
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
