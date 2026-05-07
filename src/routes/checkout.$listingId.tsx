import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import { formatPrice, GHANA_REGIONS } from "@/lib/constants";
import { createOrder, mockPayOrder } from "@/lib/orders";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout/$listingId")({
  head: () => ({
    meta: [
      { title: "Secure checkout · BluPay · bluekiosk" },
      { name: "description", content: "Buy safely with BluPay escrow on bluekiosk." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { listingId } = Route.useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    region: "Greater Accra",
    notes: "",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: `/checkout/${listingId}` } });
    }
  }, [isLoading, isAuthenticated, listingId]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      const { data } = await supabase
        .from("listings")
        .select("id, title, slug, price, currency, kiosk_id, owner_id, status, listing_images(image_url, sort_order), kiosks(name, slug)")
        .eq("id", listingId)
        .maybeSingle();
      if (cancelled) return;
      setListing(data);
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  // Prefill from profile
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, phone, city, region")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setForm((f) => ({
          ...f,
          name: f.name || data.display_name || "",
          phone: f.phone || data.phone || "",
          city: f.city || data.city || "",
          region: data.region || f.region,
        }));
      });
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !listing) return;
    if (listing.owner_id === user.id) {
      toast.error("You cannot buy from your own listing.");
      return;
    }
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error("Please fill in all delivery details.");
      return;
    }
    setSubmitting(true);
    try {
      const orderId = await createOrder({
        listingId: listing.id,
        kioskId: listing.kiosk_id,
        buyerId: user.id,
        vendorId: listing.owner_id,
        quantity: qty,
        unitPrice: Number(listing.price),
        currency: listing.currency,
        delivery: form,
      });
      // Simulate redirect-to-PSP delay
      await new Promise((r) => setTimeout(r, 700));
      await mockPayOrder(orderId, user.id);
      toast.success("Payment held in escrow. Seller has been notified.");
      navigate({ to: "/orders/$orderId", params: { orderId } });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not complete checkout.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-page">
          <Loader2 className="w-6 h-6 animate-spin text-bk-muted" />
        </div>
      </>
    );
  }
  if (!listing) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-page">
          <p className="text-bk-muted">Listing not found.</p>
        </div>
      </>
    );
  }

  const thumb = (listing.listing_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url;
  const subtotal = qty * Number(listing.price);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-page">
        <div className="mx-auto max-w-[1100px] px-4 md:px-6 py-6">
          <Link to="/listing/$slug" params={{ slug: listing.slug }} className="inline-flex items-center gap-1.5 text-[13px] text-bk-muted hover:text-bk-dark">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to listing
          </Link>

          <div className="flex items-center gap-2 mt-4 mb-2">
            <ShieldCheck className="w-5 h-5 text-bk-red" />
            <h1 className="text-[22px] md:text-[26px] font-bold text-bk-dark">Secure checkout with BluPay</h1>
          </div>
          <p className="text-[13px] text-bk-muted mb-6">
            Your payment is held in escrow and only released to the seller once you confirm delivery.
          </p>

          <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-6">
            <section className="bg-white rounded-2xl border border-bk-beige p-5 md:p-6 space-y-5">
              <div>
                <h2 className="text-[15px] font-bold text-bk-dark mb-3">Delivery details</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Full name">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 rounded-lg border border-bk-beige bg-white px-3 text-[13.5px] text-bk-dark focus:outline-none focus:border-bk-yellow" />
                  </Field>
                  <Field label="Phone">
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 rounded-lg border border-bk-beige bg-white px-3 text-[13.5px] text-bk-dark focus:outline-none focus:border-bk-yellow" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Address">
                      <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full h-10 rounded-lg border border-bk-beige bg-white px-3 text-[13.5px] text-bk-dark focus:outline-none focus:border-bk-yellow" />
                    </Field>
                  </div>
                  <Field label="City / Town">
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full h-10 rounded-lg border border-bk-beige bg-white px-3 text-[13.5px] text-bk-dark focus:outline-none focus:border-bk-yellow" />
                  </Field>
                  <Field label="Region">
                    <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full h-10 rounded-lg border border-bk-beige bg-white px-3 text-[13.5px] text-bk-dark focus:outline-none focus:border-bk-yellow">
                      {GHANA_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Notes for seller (optional)">
                      <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full rounded-lg border border-bk-beige bg-white px-3 py-2 text-[13.5px] text-bk-dark focus:outline-none focus:border-bk-yellow" />
                    </Field>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[15px] font-bold text-bk-dark mb-3">Payment method</h2>
                <div className="rounded-xl border border-bk-beige bg-bk-page p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-bk-yellow flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-bk-dark" />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-bold text-bk-dark">BluPay escrow (mock)</p>
                    <p className="text-[12px] text-bk-muted mt-0.5">
                      Mobile Money + card. Funds are held until you confirm delivery. This is a demo — no real payment is taken.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <aside className="bg-white rounded-2xl border border-bk-beige p-5 h-max lg:sticky lg:top-28">
              <h2 className="text-[14px] font-bold text-bk-dark mb-3">Order summary</h2>
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-bk-page overflow-hidden flex-shrink-0">
                  {thumb && <img src={thumb} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-bk-dark line-clamp-2 leading-tight">{listing.title}</p>
                  <p className="text-[11.5px] text-bk-muted truncate mt-0.5">{listing.kiosks?.name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-[13px] text-bk-muted">Quantity</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-md border border-bk-beige text-bk-dark hover:bg-bk-page">−</button>
                  <span className="w-8 text-center text-[13.5px] font-bold text-bk-dark">{qty}</span>
                  <button type="button" onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-md border border-bk-beige text-bk-dark hover:bg-bk-page">+</button>
                </div>
              </div>

              <dl className="mt-4 space-y-1.5 text-[13px]">
                <div className="flex justify-between"><dt className="text-bk-muted">Subtotal</dt><dd className="text-bk-dark font-semibold">{formatPrice(subtotal, listing.currency)}</dd></div>
                <div className="flex justify-between"><dt className="text-bk-muted">Delivery</dt><dd className="text-bk-muted">Arranged with seller</dd></div>
                <div className="border-t border-bk-beige my-2" />
                <div className="flex justify-between text-[15px]"><dt className="font-bold text-bk-dark">Total</dt><dd className="font-bold text-bk-dark">{formatPrice(subtotal, listing.currency)}</dd></div>
              </dl>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-5 inline-flex items-center justify-center gap-2 text-[14px] font-bold bg-bk-yellow text-bk-dark py-3.5 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {submitting ? "Processing…" : `Pay ${formatPrice(subtotal, listing.currency)}`}
              </button>
              <p className="text-[10.5px] text-bk-muted text-center mt-2">
                By paying, you agree to BlueKiosk's BluPay terms.
              </p>
            </aside>
          </form>
        </div>
        <Footer />
      </main>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11.5px] font-semibold text-bk-muted uppercase tracking-wider mb-1">{label}</span>
      {children}
    </label>
  );
}
