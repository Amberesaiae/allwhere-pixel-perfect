import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, Upload, X, CheckCircle, Plus, ExternalLink } from "lucide-react";
import { GHANA_REGIONS } from "@/lib/constants";
import type { Tables } from "@/integrations/supabase/types";
import StepProgress from "@/components/StepProgress";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/create-kiosk")({
  head: () => ({
    meta: [
      { title: "Create kiosk · bluekiosk" },
      { name: "description", content: "Create a new vendor kiosk on bluekiosk." },
    ],
  }),
  component: CreateKioskPage,
});

type Category = Tables<"categories">;

function CreateKioskPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { isVendor, loading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ slug: string; name: string } | null>(null);

  useEffect(() => {
    if (authLoading || rolesLoading) return;
    if (!isAuthenticated) { navigate({ to: "/login" }); return; }
    if (!isVendor) { navigate({ to: "/become-vendor" }); return; }
    fetchCategories();
  }, [authLoading, rolesLoading, isAuthenticated, isVendor]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) + "-" + Date.now().toString(36);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");

    if (!name.trim()) { setError("Kiosk name is required"); return; }
    if (name.trim().length > 100) { setError("Name must be under 100 characters"); return; }
    if (description.length > 2000) { setError("Description must be under 2000 characters"); return; }

    setSaving(true);

    let coverUrl: string | null = null;

    // Upload cover image
    if (coverFile) {
      const ext = coverFile.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("kiosk-images")
        .upload(path, coverFile, { cacheControl: "3600", upsert: false });

      if (uploadErr) {
        setError("Failed to upload image: " + uploadErr.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("kiosk-images").getPublicUrl(path);
      coverUrl = urlData.publicUrl;
    }

    const slug = generateSlug(name);

    const { error: insertErr } = await supabase.from("kiosks").insert({
      owner_id: user.id,
      name: name.trim(),
      slug,
      description: description.trim() || null,
      category_id: categoryId || null,
      region: region || null,
      city: city.trim() || null,
      phone: phone.trim() || null,
      cover_image_url: coverUrl,
    });

    if (insertErr) {
      setError(insertErr.message);
      setSaving(false);
      return;
    }

    toast.success("Kiosk created");
    setCreated({ slug, name: name.trim() });
    setSaving(false);
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

  if (created) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-bk-cream py-8">
          <div className="mx-auto max-w-[640px] px-6">
            <StepProgress steps={["Activate vendor", "Create kiosk", "Post listing"]} current={3} />
            <div className="bg-white rounded-2xl border border-bk-beige p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-[24px] font-bold text-bk-dark mb-2">"{created.name}" is live</h1>
              <p className="text-[14px] text-bk-muted mb-6 max-w-md mx-auto">
                Your kiosk is set up. The next step is to post your first listing so buyers can find you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/dashboard/create-listing" className="inline-flex items-center gap-2 text-[14px] font-bold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition">
                  <Plus className="w-4 h-4" /> Post your first listing
                </Link>
                <Link to="/kiosk/$slug" params={{ slug: created.slug }} className="inline-flex items-center gap-2 text-[14px] font-semibold border border-bk-beige text-bk-dark px-5 py-2.5 rounded-full hover:bg-bk-page transition">
                  <ExternalLink className="w-4 h-4" /> View public page
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bk-cream py-8">
        <div className="mx-auto max-w-[640px] px-6">
          <StepProgress steps={["Activate vendor", "Create kiosk", "Post listing"]} current={2} />
          <h1 className="text-[28px] font-bold text-bk-dark mb-2">Create a kiosk</h1>
          <p className="text-[14px] text-bk-muted mb-8">Set up your storefront on bluekiosk</p>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-bk-beige p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-[14px] rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Cover image */}
            <div>
              <label className="block text-[14px] font-medium text-bk-dark mb-2">Cover Image</label>
              {coverPreview ? (
                <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-bk-beige mb-2">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-[16/9] rounded-xl border-2 border-dashed border-bk-beige bg-bk-cream cursor-pointer hover:border-bk-dark transition">
                  <Upload className="w-8 h-8 text-bk-muted mb-2" />
                  <span className="text-[14px] text-bk-muted">Click to upload (max 5MB)</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-[14px] font-medium text-bk-dark mb-1.5">
                Kiosk Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                placeholder="e.g. Kwame's Tech Hub"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="desc" className="block text-[14px] font-medium text-bk-dark mb-1.5">Description</label>
              <textarea
                id="desc"
                maxLength={2000}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow resize-none"
                placeholder="Tell buyers what your kiosk offers..."
              />
              <p className="text-[12px] text-bk-muted mt-1">{description.length}/2000</p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-[14px] font-medium text-bk-dark mb-1.5">Category</label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="region" className="block text-[14px] font-medium text-bk-dark mb-1.5">Region</label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                >
                  <option value="">Select region</option>
                  {GHANA_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-[14px] font-medium text-bk-dark mb-1.5">City</label>
                <input
                  id="city"
                  type="text"
                  maxLength={100}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                  placeholder="e.g. Accra"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-[14px] font-medium text-bk-dark mb-1.5">Contact Phone</label>
              <input
                id="phone"
                type="tel"
                maxLength={20}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-bk-beige bg-bk-cream text-bk-dark text-[15px] focus:outline-none focus:ring-2 focus:ring-bk-yellow"
                placeholder="+233 XX XXX XXXX"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-bk-yellow text-bk-dark font-semibold text-[15px] py-3 rounded-full hover:bg-bk-yellow-hover transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Kiosk
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
