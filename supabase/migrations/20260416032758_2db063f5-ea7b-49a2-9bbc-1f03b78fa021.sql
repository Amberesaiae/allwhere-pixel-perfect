-- Categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT USING (true);

-- Only admins can manage categories (via has_role)
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Kiosks table
CREATE TABLE public.kiosks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  region TEXT,
  city TEXT,
  cover_image_url TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kiosks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kiosks are viewable by everyone"
  ON public.kiosks FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create kiosks"
  ON public.kiosks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own kiosks"
  ON public.kiosks FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own kiosks"
  ON public.kiosks FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE INDEX idx_kiosks_category ON public.kiosks(category_id);
CREATE INDEX idx_kiosks_region ON public.kiosks(region);
CREATE INDEX idx_kiosks_status ON public.kiosks(status);
CREATE INDEX idx_kiosks_slug ON public.kiosks(slug);
CREATE INDEX idx_kiosks_owner ON public.kiosks(owner_id);

CREATE TRIGGER update_kiosks_updated_at
  BEFORE UPDATE ON public.kiosks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Kiosk stats table
CREATE TABLE public.kiosk_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kiosk_id UUID NOT NULL UNIQUE REFERENCES public.kiosks(id) ON DELETE CASCADE,
  views_count INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.kiosk_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kiosk stats are viewable by everyone"
  ON public.kiosk_stats FOR SELECT USING (true);

CREATE POLICY "Anyone can increment views"
  ON public.kiosk_stats FOR UPDATE USING (true);

-- Auto-create stats row when kiosk is created
CREATE OR REPLACE FUNCTION public.handle_new_kiosk()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.kiosk_stats (kiosk_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_kiosk_created
  AFTER INSERT ON public.kiosks
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_kiosk();

-- Function to increment kiosk views
CREATE OR REPLACE FUNCTION public.increment_kiosk_views(_kiosk_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.kiosk_stats
  SET views_count = views_count + 1
  WHERE kiosk_id = _kiosk_id;
$$;

-- Storage bucket for kiosk images
INSERT INTO storage.buckets (id, name, public) VALUES ('kiosk-images', 'kiosk-images', true);

CREATE POLICY "Kiosk images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'kiosk-images');

CREATE POLICY "Authenticated users can upload kiosk images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'kiosk-images');

CREATE POLICY "Users can update their own kiosk images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'kiosk-images');

CREATE POLICY "Users can delete their own kiosk images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'kiosk-images');

-- Seed categories
INSERT INTO public.categories (name, slug, description, icon_name) VALUES
  ('Electronics', 'electronics', 'Phones, laptops, accessories & gadgets', 'Monitor'),
  ('Fashion', 'fashion', 'Clothing, shoes, bags & jewelry', 'Shirt'),
  ('Food & Groceries', 'food-groceries', 'Fresh produce, spices & packaged goods', 'UtensilsCrossed'),
  ('Health & Beauty', 'health-beauty', 'Skincare, cosmetics & wellness products', 'Sparkles'),
  ('Home & Living', 'home-living', 'Furniture, decor & kitchen essentials', 'Home'),
  ('Auto & Parts', 'auto-parts', 'Vehicle parts, tools & accessories', 'Car'),
  ('Books & Stationery', 'books-stationery', 'Textbooks, office supplies & art materials', 'BookOpen'),
  ('Services', 'services', 'Repairs, tailoring, printing & more', 'Wrench');