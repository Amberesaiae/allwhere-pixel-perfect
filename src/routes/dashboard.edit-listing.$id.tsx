import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Upload, X, Save } from "lucide-react";
import { GHANA_REGIONS, CONDITION_LABELS } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/dashboard/edit-listing/$id")({
  head: () => ({
    meta: [
      { title: "Edit Listing | BlueKiosk" },
      { name: "description", content: "Edit your listing on BlueKiosk." },
    ],
  }),
  component: EditListingPage,
});

function EditListingPage() {
  const { id } = Route.useParams();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { isVendor, loading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; image_url: string; sort_order: number }[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const [form, setForm] = useState({
    listing_type: "product",
    title: "",
    description: "",
    price: "",
    price_max: "",
    condition: "new",
    is_negotiable: false,
    pricing_type: "fixed",
    stock_quantity: "",
    region: "",
    city: "",
    category_id: "",
    status: "active",
  });

  useEffect(() => {
    if (authLoading || rolesLoading) return;
    if (!isAuthenticated) { navigate({ to: "/login" }); return; }
    if (!isVendor) { navigate({ to: "/become-vendor" }); return; }
    loadListing();
  }, [authLoading, rolesLoading, isAuthenticated, isVendor]);

  const loadListing = async () => {
    const [lRes, cRes, iRes] = await Promise.all([
      supabase.from("listings").select("*").eq("id", id).single(),
      supabase.from("categories").select("*").order("name"),
      supabase.from("listing_images").select("*").eq("listing_id", id).order("sort_order"),
    ]);

    if (!lRes.data || (user && lRes.data.owner_id !== user.id)) {
      navigate({ to: "/dashboard" });
      return;
    }

    const l = lRes.data;
    setForm({
      listing_type: l.listing_type,
      title: l.title,
      description: l.description || "",
      price: l.price?.toString() || "0",
      price_max: l.price_max?.toString() || "",
      condition: l.condition,
      is_negotiable: l.is_negotiable,
      pricing_type: l.pricing_type,
      stock_quantity: l.stock_quantity?.toString() || "",
      region: l.region || "",
      city: l.city || "",
      category_id: l.category_id || "",
      status: l.status,
    });
    setCategories(cRes.data || []);
    setExistingImages((iRes.data || []).map((img) => ({
      id: img.id,
      image_url: img.image_url,
      sort_order: img.sort_order,
    })));
    setLoading(false);
  };

  const handleNewImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCurrent = existingImages.filter((img) => !removedImageIds.includes(img.id)).length + newImages.length;
    const remaining = 5 - totalCurrent;
    const toAdd = files.slice(0, remaining);
    setNewImages((prev) => [...prev, ...toAdd]);
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setNewPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    await supabase.from("listings").update({
      title: form.title,
      description: form.description || null,
      price: parseFloat(form.price) || 0,
      price_max: form.pricing_type === "range" && form.price_max ? parseFloat(form.price_max) : null,
      condition: form.condition as "new" | "used" | "refurbished",
      is_negotiable: form.is_negotiable,
      listing_type: form.listing_type,
      pricing_type: form.pricing_type,
      category_id: form.category_id || null,
      region: form.region || null,
      city: form.city || null,
      stock_quantity: form.listing_type === "product" && form.stock_quantity ? parseInt(form.stock_quantity) : null,
      status: form.status,
    }).eq("id", id);

    // Remove deleted images
    if (removedImageIds.length > 0) {
      await supabase.from("listing_images").delete().in("id", removedImageIds);
    }

    // Upload new images
    const startOrder = existingImages.length;
    for (let i = 0; i < newImages.length; i++) {
      const file = newImages[i];
      const ext = file.name.split(".").pop();
      const path = `listings/${id}/${Date.now()}-${i}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("kiosk-images").upload(path, file);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("kiosk-images").getPublicUrl(path);
        await supabase.from("listing_images").insert({
          listing_id: id,
          image_url: urlData.publicUrl,
          sort_order: startOrder + i,
        });
      }
    }

    navigate({ to: "/dashboard" });
  };

  if (authLoading || rolesLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center bg-bk-cream">
          <Loader2 className="w-8 h-8 animate-spin text-bk-muted" />
        </div>
      </>
    );
  }

  const visibleExisting = existingImages.filter((img) => !removedImageIds.includes(img.id));
  const totalImages = visibleExisting.length + newImages.length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-cream py-8">
        <div className="mx-auto max-w-[640px] px-6">
          <button onClick={() => navigate({ to: "/dashboard" })} className="inline-flex items-center gap-2 text-[14px] text-bk-muted hover:text-bk-dark transition mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <h1 className="text-[28px] font-bold text-bk-dark mb-8">Edit Listing</h1>

          <div className="space-y-5">
            {/* Status */}
            <div>
              <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Status</label>
              <div className="flex gap-2">
                {["active", "sold", "inactive"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium border transition capitalize ${
                      form.status === s ? "border-bk-dark bg-bk-dark text-bk-cream" : "border-bk-beige text-bk-dark"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow resize-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Price (GHS)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
              />
            </div>

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

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[14px] font-semibold text-bk-dark mb-1.5 block">Region</label>
                <select
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                >
                  <option value="">Select region</option>
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
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-white text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="text-[14px] font-semibold text-bk-dark mb-2 block">Images ({totalImages}/5)</label>
              <div className="grid grid-cols-3 gap-3">
                {visibleExisting.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-bk-beige">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setRemovedImageIds((prev) => [...prev, img.id])}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-bk-dark/70 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5 text-bk-cream" />
                    </button>
                  </div>
                ))}
                {newPreviews.map((p, i) => (
                  <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-bk-beige">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setNewImages((prev) => prev.filter((_, j) => j !== i));
                        setNewPreviews((prev) => prev.filter((_, j) => j !== i));
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-bk-dark/70 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5 text-bk-cream" />
                    </button>
                  </div>
                ))}
                {totalImages < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-bk-beige hover:border-bk-dark transition flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-6 h-6 text-bk-muted mb-1" />
                    <span className="text-[12px] text-bk-muted">Add</span>
                    <input type="file" accept="image/*" onChange={handleNewImageAdd} className="hidden" multiple />
                  </label>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !form.title.trim()}
              className="w-full flex items-center justify-center gap-2 text-[15px] font-semibold bg-bk-yellow text-bk-dark py-3.5 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
