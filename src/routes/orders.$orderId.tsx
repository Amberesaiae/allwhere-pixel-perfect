import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldCheck, MessageSquare, Truck, Check, AlertTriangle, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONE,
  type OrderStatus,
  markShipped,
  markDelivered,
  releaseFunds,
  disputeOrder,
} from "@/lib/orders";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/orders/$orderId")({
  head: () => ({
    meta: [{ title: "Order · bluekiosk" }],
  }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [tx, setTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [trackInput, setTrackInput] = useState("");
  const [disputeInput, setDisputeInput] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: "/login", search: { redirect: `/orders/${orderId}` } });
  }, [isLoading, isAuthenticated]);

  const refresh = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, listings(title, slug, listing_images(image_url, sort_order)), kiosks(name, slug)")
      .eq("id", orderId)
      .maybeSingle();
    setOrder(data);
    const { data: txs } = await supabase
      .from("transactions")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    setTx(txs ?? []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [orderId]);

  if (loading || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-page">
          <Loader2 className="w-6 h-6 animate-spin text-bk-muted" />
        </div>
      </>
    );
  }

  const status = order.status as OrderStatus;
  const isBuyer = user?.id === order.buyer_id;
  const isVendor = user?.id === order.vendor_id;
  const thumb = (order.listings?.listing_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url;

  const wrap = async (fn: () => Promise<void>, msg: string) => {
    setActing(true);
    try {
      await fn();
      toast.success(msg);
      await refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Action failed.");
    } finally {
      setActing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-page">
        <div className="mx-auto max-w-[960px] px-4 md:px-6 py-6">
          <Link to="/orders" className="inline-flex items-center gap-1.5 text-[13px] text-bk-muted hover:text-bk-dark">
            <ArrowLeft className="w-3.5 h-3.5" /> All orders
          </Link>

          <div className="flex items-start justify-between gap-3 mt-4 mb-5 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-bk-red" />
                <h1 className="text-[22px] font-bold text-bk-dark">Order</h1>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ORDER_STATUS_TONE[status]}`}>
                  {ORDER_STATUS_LABELS[status]}
                </span>
              </div>
              <p className="text-[12px] text-bk-muted mt-1">
                Placed {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })} · #{order.id.slice(0, 8)}
              </p>
            </div>
            {order.conversation_id && (
              <Link to="/chat/$conversationId" params={{ conversationId: order.conversation_id }} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold border border-bk-beige text-bk-dark px-3 py-2 rounded-full hover:bg-bk-page">
                <MessageSquare className="w-3.5 h-3.5" /> Open chat
              </Link>
            )}
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-5">
            <section className="space-y-4">
              {/* Item */}
              <div className="bg-white rounded-2xl border border-bk-beige p-4 flex gap-3">
                <div className="w-20 h-20 rounded-lg bg-bk-page overflow-hidden flex-shrink-0">
                  {thumb && <img src={thumb} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to="/listing/$slug" params={{ slug: order.listings?.slug }} className="text-[14px] font-bold text-bk-dark hover:underline">
                    {order.listings?.title}
                  </Link>
                  <p className="text-[12px] text-bk-muted mt-0.5">{order.kiosks?.name}</p>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-[12px] text-bk-muted">qty {order.quantity}</span>
                    <span className="text-[15px] font-bold text-bk-dark">{formatPrice(Number(order.total_amount), order.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl border border-bk-beige p-5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-bk-muted mb-3">Timeline</h2>
                <ol className="relative border-l border-bk-beige pl-5 space-y-3 text-[13px]">
                  <Step ok at={order.created_at} label="Order placed" />
                  <Step ok={!!order.paid_at} at={order.paid_at} label="Payment held in escrow" />
                  <Step ok={!!order.shipped_at} at={order.shipped_at} label="Shipped" detail={order.tracking_note} />
                  <Step ok={!!order.delivered_at} at={order.delivered_at} label="Delivered" />
                  <Step ok={!!order.released_at} at={order.released_at} label="Funds released to seller" />
                </ol>
                {order.auto_release_at && status !== "released" && status !== "refunded" && status !== "cancelled" && (
                  <p className="text-[11.5px] text-bk-muted mt-3">
                    Funds auto-release on <strong className="text-bk-dark">{format(new Date(order.auto_release_at), "MMM d, yyyy 'at' p")}</strong>.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl border border-bk-beige p-5 space-y-3">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-bk-muted">Actions</h2>

                {isVendor && status === "paid_held" && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input value={trackInput} onChange={(e) => setTrackInput(e.target.value)} placeholder="Tracking note (optional)" className="flex-1 h-10 rounded-lg border border-bk-beige px-3 text-[13px]" />
                    <button disabled={acting} onClick={() => wrap(() => markShipped(order.id, trackInput || undefined), "Marked shipped")} className="inline-flex items-center justify-center gap-1.5 text-[13px] font-bold bg-bk-yellow text-bk-dark px-4 py-2.5 rounded-full hover:bg-bk-yellow-hover disabled:opacity-60">
                      <Truck className="w-3.5 h-3.5" /> Mark shipped
                    </button>
                  </div>
                )}
                {isVendor && status === "shipped" && (
                  <button disabled={acting} onClick={() => wrap(() => markDelivered(order.id), "Marked delivered")} className="inline-flex items-center gap-1.5 text-[13px] font-bold bg-bk-yellow text-bk-dark px-4 py-2.5 rounded-full hover:bg-bk-yellow-hover disabled:opacity-60">
                    <Check className="w-3.5 h-3.5" /> Mark delivered
                  </button>
                )}
                {isBuyer && (status === "shipped" || status === "delivered") && (
                  <button disabled={acting} onClick={() => wrap(() => releaseFunds(order.id, order.vendor_id), "Funds released to seller")} className="inline-flex items-center gap-1.5 text-[13px] font-bold bg-emerald-600 text-white px-4 py-2.5 rounded-full hover:bg-emerald-700 disabled:opacity-60">
                    <Check className="w-3.5 h-3.5" /> Confirm received & release funds
                  </button>
                )}
                {isBuyer && (status === "paid_held" || status === "shipped" || status === "delivered") && (
                  <details className="rounded-xl border border-bk-beige p-3">
                    <summary className="text-[12.5px] font-semibold text-bk-dark cursor-pointer flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Open a dispute
                    </summary>
                    <div className="mt-3 space-y-2">
                      <textarea value={disputeInput} onChange={(e) => setDisputeInput(e.target.value)} rows={3} placeholder="Tell us what went wrong…" className="w-full rounded-lg border border-bk-beige px-3 py-2 text-[13px]" />
                      <button disabled={acting || !disputeInput.trim()} onClick={() => wrap(() => disputeOrder(order.id, disputeInput.trim()), "Dispute opened")} className="text-[12.5px] font-bold bg-red-600 text-white px-3 py-2 rounded-full hover:bg-red-700 disabled:opacity-60">
                        Submit dispute
                      </button>
                    </div>
                  </details>
                )}
                {!isBuyer && !isVendor && <p className="text-[12.5px] text-bk-muted">You're viewing this order as an admin.</p>}
              </div>
            </section>

            <aside className="space-y-4">
              <div className="bg-white rounded-2xl border border-bk-beige p-5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-bk-muted mb-3">Delivery</h2>
                <p className="text-[13px] font-semibold text-bk-dark">{order.delivery_name}</p>
                <p className="text-[12.5px] text-bk-muted">{order.delivery_phone}</p>
                <p className="text-[12.5px] text-bk-dark mt-2">{order.delivery_address}</p>
                <p className="text-[12.5px] text-bk-muted">{order.delivery_city}, {order.delivery_region}</p>
                {order.notes && <p className="text-[12px] text-bk-muted mt-3 italic">"{order.notes}"</p>}
              </div>

              <div className="bg-white rounded-2xl border border-bk-beige p-5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-bk-muted mb-3">Transactions</h2>
                {tx.length === 0 ? (
                  <p className="text-[12px] text-bk-muted">No transactions yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {tx.map((t) => (
                      <li key={t.id} className="text-[12.5px] flex justify-between gap-2 border-b border-bk-beige last:border-0 py-1.5">
                        <div>
                          <p className="font-semibold text-bk-dark capitalize">{t.type}</p>
                          <p className="text-[10.5px] text-bk-muted">{formatDistanceToNow(new Date(t.created_at), { addSuffix: true })}</p>
                        </div>
                        <span className="font-bold text-bk-dark">{formatPrice(Number(t.amount), t.currency)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

function Step({ ok, at, label, detail }: { ok: boolean; at?: string | null; label: string; detail?: string | null }) {
  return (
    <li className="relative">
      <span className={`absolute -left-[26px] top-0.5 w-3 h-3 rounded-full border-2 ${ok ? "bg-bk-yellow border-bk-yellow" : "bg-white border-bk-beige"}`} />
      <p className={`font-semibold ${ok ? "text-bk-dark" : "text-bk-muted"}`}>{label}</p>
      {at && <p className="text-[11px] text-bk-muted">{format(new Date(at), "MMM d, yyyy 'at' p")}</p>}
      {detail && ok && <p className="text-[11.5px] text-bk-muted italic mt-0.5">{detail}</p>}
    </li>
  );
}
