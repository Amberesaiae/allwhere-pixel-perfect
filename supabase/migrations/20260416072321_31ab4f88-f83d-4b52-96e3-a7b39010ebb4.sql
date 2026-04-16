
-- Create listing condition enum
CREATE TYPE public.listing_condition AS ENUM ('new', 'used', 'refurbished');

-- Create listings table
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kiosk_id UUID NOT NULL REFERENCES public.kiosks(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GHS',
  condition listing_condition NOT NULL DEFAULT 'new',
  is_negotiable BOOLEAN NOT NULL DEFAULT false,
  listing_type TEXT NOT NULL DEFAULT 'product' CHECK (listing_type IN ('product', 'service')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
  category_id UUID REFERENCES public.categories(id),
  region TEXT,
  city TEXT,
  stock_quantity INTEGER,
  pricing_type TEXT NOT NULL DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'range', 'quote')),
  price_max NUMERIC(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings are viewable by everyone" ON public.listings
  FOR SELECT USING (true);

CREATE POLICY "Owners can insert their own listings" ON public.listings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own listings" ON public.listings
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own listings" ON public.listings
  FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create listing_images table
CREATE TABLE public.listing_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listing images are viewable by everyone" ON public.listing_images
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage listing images" ON public.listing_images
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND owner_id = auth.uid())
  );

CREATE POLICY "Owners can update listing images" ON public.listing_images
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND owner_id = auth.uid())
  );

CREATE POLICY "Owners can delete listing images" ON public.listing_images
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND owner_id = auth.uid())
  );

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, listing_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON public.favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" ON public.favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create listing_stats table
CREATE TABLE public.listing_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE UNIQUE,
  views_count INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.listing_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listing stats are viewable by everyone" ON public.listing_stats
  FOR SELECT USING (true);

-- Auto-create listing_stats on new listing
CREATE OR REPLACE FUNCTION public.handle_new_listing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.listing_stats (listing_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_listing_created
  AFTER INSERT ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_listing();

-- Increment listing views function
CREATE OR REPLACE FUNCTION public.increment_listing_views(_listing_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.listing_stats
  SET views_count = views_count + 1
  WHERE listing_id = _listing_id;
$$;

-- Enable realtime for listings
ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;

-- Seed sample listings
-- TechZone Accra (electronics)
INSERT INTO public.listings (kiosk_id, owner_id, title, slug, description, price, condition, is_negotiable, listing_type, category_id, region, city) VALUES
  ('6e3706c7-7f78-4620-9ed3-5c78801261ee', '00000000-0000-0000-0000-000000000000', 'iPhone 14 Pro Max 256GB', 'iphone-14-pro-max-256gb', 'Slightly used iPhone 14 Pro Max in excellent condition. Comes with charger and case.', 8500.00, 'used', true, 'product', 'd6f1160d-dd81-4de9-91b3-e9a1e9840827', 'Greater Accra', 'Accra'),
  ('6e3706c7-7f78-4620-9ed3-5c78801261ee', '00000000-0000-0000-0000-000000000000', 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Brand new Samsung Galaxy S24 Ultra. Sealed in box with warranty.', 12000.00, 'new', false, 'product', 'd6f1160d-dd81-4de9-91b3-e9a1e9840827', 'Greater Accra', 'Accra');

-- Mama Adwoa Kitchen (food)
INSERT INTO public.listings (kiosk_id, owner_id, title, slug, description, price, condition, listing_type, category_id, region, city) VALUES
  ('823c2f7d-19c7-4a5d-88e1-cbbe2a826ae1', '00000000-0000-0000-0000-000000000000', 'Party Jollof Rice Catering', 'party-jollof-rice-catering', 'Professional jollof rice catering for events. Price per 50 guests. Includes sides and drinks.', 2500.00, 'new', 'service', '8feeea07-0ad4-4b32-bc44-6a61dcba25ee', 'Greater Accra', 'Accra'),
  ('823c2f7d-19c7-4a5d-88e1-cbbe2a826ae1', '00000000-0000-0000-0000-000000000000', 'Fresh Palm Oil - 5 Litres', 'fresh-palm-oil-5-litres', 'Pure unrefined palm oil from the Western Region. 5 litre gallon.', 120.00, 'new', 'product', '8feeea07-0ad4-4b32-bc44-6a61dcba25ee', 'Greater Accra', 'Accra');

-- Kumasi Fashion House (fashion)
INSERT INTO public.listings (kiosk_id, owner_id, title, slug, description, price, condition, is_negotiable, listing_type, category_id, region, city) VALUES
  ('c72f09fc-68fb-4fd7-baba-2da1c7cba0ef', '00000000-0000-0000-0000-000000000000', 'Kente Cloth - Premium Weave', 'kente-cloth-premium-weave', 'Authentic hand-woven Kente cloth from Bonwire. Perfect for special occasions.', 800.00, 'new', true, 'product', '07eb71fc-df5d-42e5-a8b3-5701a0d3adc2', 'Ashanti', 'Kumasi'),
  ('c72f09fc-68fb-4fd7-baba-2da1c7cba0ef', '00000000-0000-0000-0000-000000000000', 'Custom Suit Tailoring', 'custom-suit-tailoring', 'Bespoke suit tailoring. Measurement, fitting, and delivery within 2 weeks.', 1500.00, 'new', false, 'service', '07eb71fc-df5d-42e5-a8b3-5701a0d3adc2', 'Ashanti', 'Kumasi');

-- Cape Coast Books
INSERT INTO public.listings (kiosk_id, owner_id, title, slug, description, price, condition, is_negotiable, listing_type, category_id, region, city) VALUES
  ('82ef50c8-edaf-431b-9d79-f0fe5558c9f9', '00000000-0000-0000-0000-000000000000', 'WASSCE Past Questions Bundle', 'wassce-past-questions-bundle', 'Complete WASSCE past questions for all core subjects (2015-2024). Includes answers.', 150.00, 'new', false, 'product', '18e82275-2d6a-4b5a-998a-fd187c97efda', 'Central', 'Cape Coast'),
  ('82ef50c8-edaf-431b-9d79-f0fe5558c9f9', '00000000-0000-0000-0000-000000000000', 'Used Laptop - HP EliteBook', 'used-laptop-hp-elitebook', 'HP EliteBook 840 G5, 8GB RAM, 256GB SSD. Good condition, battery holds 4hrs.', 3200.00, 'used', true, 'product', 'd6f1160d-dd81-4de9-91b3-e9a1e9840827', 'Central', 'Cape Coast');

-- GlowUp Beauty
INSERT INTO public.listings (kiosk_id, owner_id, title, slug, description, price, condition, listing_type, category_id, region, city) VALUES
  ('3ed0a83b-4515-4f0a-8d07-3ff8e001169a', '00000000-0000-0000-0000-000000000000', 'Shea Butter - Raw Organic 1kg', 'shea-butter-raw-organic-1kg', 'Pure raw shea butter from Northern Ghana. Unrefined, organic, for skin and hair.', 80.00, 'new', 'product', '20cd7065-7bbd-4ce3-94bb-49e76c85eabb', 'Greater Accra', 'Accra'),
  ('3ed0a83b-4515-4f0a-8d07-3ff8e001169a', '00000000-0000-0000-0000-000000000000', 'Bridal Makeup Package', 'bridal-makeup-package', 'Full bridal makeup including trial, wedding day, and touch-up kit. Covers Accra area.', 3000.00, 'new', 'service', '20cd7065-7bbd-4ce3-94bb-49e76c85eabb', 'Greater Accra', 'Accra');

-- Tamale Auto Works
INSERT INTO public.listings (kiosk_id, owner_id, title, slug, description, price, condition, is_negotiable, listing_type, category_id, region, city) VALUES
  ('d8e80a59-ed0a-4ff9-ad11-05d4febb1962', '00000000-0000-0000-0000-000000000000', 'Toyota Camry 2018 Engine', 'toyota-camry-2018-engine', 'Refurbished Toyota Camry 2018 2.5L engine. Tested and ready for installation.', 15000.00, 'refurbished', true, 'product', '37da116a-a980-4401-9d25-44db2440d0bc', 'Northern', 'Tamale'),
  ('d8e80a59-ed0a-4ff9-ad11-05d4febb1962', '00000000-0000-0000-0000-000000000000', 'Full Car Service', 'full-car-service-tamale', 'Complete car servicing: oil change, filter, brake check, AC service. All vehicle types.', 500.00, 'new', false, 'service', '37da116a-a980-4401-9d25-44db2440d0bc', 'Northern', 'Tamale');

-- HomeStyle Interiors
INSERT INTO public.listings (kiosk_id, owner_id, title, slug, description, price, condition, is_negotiable, listing_type, category_id, region, city) VALUES
  ('9a39ec75-3f45-4e32-97a6-503c5ea5f8a1', '00000000-0000-0000-0000-000000000000', 'L-Shaped Sofa Set', 'l-shaped-sofa-set', 'Modern L-shaped sofa in grey fabric. Seats 6 comfortably. Free delivery in Accra.', 5500.00, 'new', true, 'product', '43965932-bab7-44ad-866e-2e71cbed0538', 'Greater Accra', 'Accra'),
  ('9a39ec75-3f45-4e32-97a6-503c5ea5f8a1', '00000000-0000-0000-0000-000000000000', 'Interior Design Consultation', 'interior-design-consultation', 'Professional interior design consultation for homes and offices. Includes 3D rendering.', 2000.00, 'new', false, 'service', '43965932-bab7-44ad-866e-2e71cbed0538', 'Greater Accra', 'Accra');

-- FixIt Services
INSERT INTO public.listings (kiosk_id, owner_id, title, slug, description, price, condition, listing_type, pricing_type, price_max, category_id, region, city) VALUES
  ('e8e26005-51d2-4b47-ac25-270307f1defa', '00000000-0000-0000-0000-000000000000', 'Plumbing Repair Service', 'plumbing-repair-service', 'Professional plumbing repairs: leaks, blockages, installations. Same-day service available.', 200.00, 'new', 'service', 'range', 1500.00, 'f8529a8c-0afa-4ec5-b58d-5d63d9687d1b', 'Greater Accra', 'Accra'),
  ('e8e26005-51d2-4b47-ac25-270307f1defa', '00000000-0000-0000-0000-000000000000', 'Electrical Wiring & Installation', 'electrical-wiring-installation', 'Licensed electrician for residential and commercial wiring. Free inspection and quote.', 300.00, 'new', 'service', 'range', 5000.00, 'f8529a8c-0afa-4ec5-b58d-5d63d9687d1b', 'Greater Accra', 'Accra');
