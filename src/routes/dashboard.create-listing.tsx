import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, ArrowRight, Upload, X, ImageIcon } from "lucide-react";
import { GHANA_REGIONS, CONDITION_LABELS } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/dashboard/create-listing")({
  head: () => ({
    meta: [
      { title: "Create Listing | BlueKiosk" },
      { name: "description", content: "Post a new item or service on BlueKiosk." },
    ],
  }),
  component: CreateListingPage,
});

function CreateListingPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { isVendor, loading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [kiosks, setKiosks] = useState<Tables<"kiosks">[]>([]);
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    listing_type: "product",
    title: "",
    description: "",
    kiosk_id: "",
    category_id: "",
    price: "",
    price_max: "",
    condition: "new" as string,
    is_negotiable: false,
    pricing_type: "fixed",
    stock_quantity: "",
    region: "",
    city: "",
  });

  useEffect(() => {
    if (authLoading || rolesLoading) return;
    if (!isAuthenticated) { navigate({ to: "/login" }); return; }
    if (!isVendor) { navigate({ to: "/become-vendor" }); return; }
    loadData();
  }, [authLoading, rolesLoading, isAuthenticated, isVendor]);

  const loadData = async () => {
    if (!user) return;
    const [kRes, cRes] = await Promise.all([
      supabase.from("kiosks").select("*").eq("owner_id", user.id).eq("status", "active"),
      supabase.from("categories").select("*").order("name"),
    ]);
    setKiosks(kRes.data || []);
    setCategories(cRes.data || []);
    if (kRes.data?.length === 1) {
      setForm((f) => ({ ...f, kiosk_id: kRes.data![0].id }));
    }
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - images.length;
    const toAdd = files.slice(0, remaining);
    setImages((prev) => [...prev, ...toAdd]);
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
      "-" + Math.random().toString(36).slice(2, 8);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    const slug = generateSlug(form.title);
    const selectedKiosk = kiosks.find((k) => k.id === form.kiosk_id);

    const { data: listing, error } = await supabase.from("listings").insert({
      kiosk_id: form.kiosk_id,
      owner_id: user.id,
      title: form.title,
      slug,
      description: form.description || null,
      price: parseFloat(form.price) || 0,
      price_max: form.pricing_type === "range" && form.price_max ? parseFloat(form.price_max) : null,
      condition: form.condition as "new" | "used" | "refurbished",
      is_negotiable: form.is_negotiable,
      listing_type: form.listing_type,
      pricing_type: form.pricing_type,
      category_id: form.category_id || null,
      region: form.region || selectedKiosk?.region || null,
      city: form.city || selectedKiosk?.city || null,
      stock_quantity: form.listing_type === "product" && form.stock_quantity ? parseInt(form.stock_quantity) : null,
    }).select("id").single();

    if (error || !listing) {
      alert("Failed to create listing. Please try again.");
      setSubmitting(false);
      return;
    }

    // Upload images
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const ext = file.name.split(".").pop();
        const path = `listings/${listing.id}/${i}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("kiosk-images").upload(path, file);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("kiosk-images").getPublicUrl(path);
          await supabase.from("listing_images").insert({
            listing_id: listing.id,
            image_url: urlData.publicUrl,
            sort_order: i,
          });
        }
      }
    }

    navigate({ to: "/dashboard" });
  };

  if (authLoading || rolesLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream">
          <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
        </div>
      </>
    );
  }

  const canGoStep2 = form.title.trim() && form.kiosk_id;
  const canGoStep3 = form.price && parseFloat(form.price) >= 0;
  const canSubmit = canGoStep2 && canGoStep3;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-cream py-8">
        <div className="mx-auto max-w-[640px] px-6">
          <button onClick={() => navigate({ to: "/dashboard" })} className="inline-flex items-center gap-2 text-[14px] text-bk-muted hover:text-bk-dark transition mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <h1 className="text-[28px] font-bold text-bk-dark mb-2">Create Listing</h1>
          <p className="text-[14px] text-bk-muted mb-8">Post an item or service for sale</p>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${step >= s ? "bg-bk-dark" : "bg-bk-beige"}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-[18px] font-bold text-bk-dark">Basic Info</h2>

              {/* Type */}
              <div className="flex gap-3">
                {(["product", "service"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, listing_type: t }))}
                    className={`flex-1 py-3 rounded-xl text-[14px] font-semibold border transition ${
                      form.listing_type === t ? "border-bk-dark bg-bk-dark text-bk-cream" : "border-bk-beige text-bk-dark hover:border-bk-dark"
                    }`}
                  >
                    {t === "product" ? "Product" : "Service"}
                  </button>
                ))}
              </div>

              {/* Title */}
              <div>
                <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. iPhone 14 Pro Max 256GB"
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                />
              </div>

              {/* Kiosk */}
              <div>
                <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Kiosk</label>
                <select
                  value={form.kiosk_id}
                  onChange={(e) => setForm((f) => ({ ...f, kiosk_id: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                >
                  <option value="">Select a kiosk</option>
                  {kiosks.map((k) => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Category</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe your item or service..."
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow resize-none"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!canGoStep2}
                className="w-full flex items-center justify-center gap-2 text-[15px] font-semibold bg-bk-yellow text-bk-dark py-3.5 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50"
              >
                Next: Pricing <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-[18px] font-bold text-bk-dark">Pricing & Details</h2>

              {/* Price */}
              <div>
                <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">
                  Price (GHS){form.pricing_type === "range" ? " - Min" : ""}
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0.00"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                />
              </div>

              {/* Pricing type */}
              {form.listing_type === "service" && (
                <div>
                  <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Pricing Type</label>
                  <div className="flex gap-2">
                    {["fixed", "range", "quote"].map((pt) => (
                      <button
                        key={pt}
                        onClick={() => setForm((f) => ({ ...f, pricing_type: pt }))}
                        className={`px-4 py-2 rounded-full text-[13px] font-medium border transition ${
                          form.pricing_type === pt ? "border-bk-dark bg-bk-dark text-bk-cream" : "border-bk-beige text-bk-dark"
                        }`}
                      >
                        {pt === "fixed" ? "Fixed" : pt === "range" ? "Range" : "Get Quote"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.pricing_type === "range" && (
                <div>
                  <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Max Price (GHS)</label>
                  <input
                    type="number"
                    value={form.price_max}
                    onChange={(e) => setForm((f) => ({ ...f, price_max: e.target.value }))}
                    placeholder="0.00"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                  />
                </div>
              )}

              {/* Condition */}
              <div>
                <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Condition</label>
                <div className="flex gap-2">
                  {Object.entries(CONDITION_LABELS).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setForm((f) => ({ ...f, condition: val }))}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium border transition ${
                        form.condition === val ? "border-bk-dark bg-bk-dark text-bk-cream" : "border-bk-beige text-bk-dark"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Negotiable */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_negotiable}
                  onChange={(e) => setForm((f) => ({ ...f, is_negotiable: e.target.checked }))}
                  className="w-5 h-5 rounded border-bk-beige accent-bk-dark"
                />
                <span className="text-[14px] font-medium text-bk-dark">Price is negotiable</span>
              </label>

              {/* Stock (products only) */}
              {form.listing_type === "product" && (
                <div>
                  <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Stock Quantity (optional)</label>
                  <input
                    type="number"
                    value={form.stock_quantity}
                    onChange={(e) => setForm((f) => ({ ...f, stock_quantity: e.target.value }))}
                    placeholder="Leave empty for unlimited"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                  />
                </div>
              )}

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Region</label>
                  <select
                    value={form.region}
                    onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                  >
                    <option value="">From kiosk</option>
                    {GHANA_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">City</label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="From kiosk"
                    className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 text-[15px] font-semibold border border-bk-beige text-bk-dark py-3.5 rounded-full hover:bg-bk-beige transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canGoStep3}
                  className="flex-1 flex items-center justify-center gap-2 text-[15px] font-semibold bg-bk-yellow text-bk-dark py-3.5 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50"
                >
                  Next: Images <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-[18px] font-bold text-bk-dark">Images</h2>
              <p className="text-[14px] text-bk-muted">Add up to 5 photos. The first image will be the cover.</p>

              <div className="grid grid-cols-3 gap-3">
                {previews.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-bk-beige">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-bk-dark/70 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5 text-bk-cream" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-bk-dark/70 text-bk-cream px-2 py-0.5 rounded-full">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-bk-beige hover:border-bk-dark transition flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-6 h-6 text-bk-muted mb-1" />
                    <span className="text-[12px] text-bk-muted">Add photo</span>
                    <input type="file" accept="image/*" onChange={handleImageAdd} className="hidden" multiple />
                  </label>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 text-[15px] font-semibold border border-bk-beige text-bk-dark py-3.5 rounded-full hover:bg-bk-beige transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="flex-1 text-[15px] font-semibold bg-bk-yellow text-bk-dark py-3.5 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Publish Listing"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
