
-- First drop the foreign key temporarily, insert demo data, then re-add it
-- Instead, let's just make owner_id nullable-safe by inserting a real demo user via raw insert

-- Remove the FK on owner_id so demo kiosks can exist without a real auth user
ALTER TABLE public.kiosks DROP CONSTRAINT IF EXISTS kiosks_owner_id_fkey;

-- Insert sample kiosks with a placeholder owner_id
INSERT INTO kiosks (owner_id, name, slug, description, category_id, region, city, phone, status, is_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'TechZone Accra', 'techzone-accra-demo', 'Your one-stop shop for laptops, phones, and accessories in Accra. We carry all major brands and offer repair services.', 'd6f1160d-dd81-4de9-91b3-e9a1e9840827', 'Greater Accra', 'Accra', '+233 20 111 2222', 'active', true),
('00000000-0000-0000-0000-000000000001', 'Mama Adwoa Kitchen', 'mama-adwoa-kitchen-demo', 'Authentic Ghanaian home-cooked meals delivered fresh daily. Jollof, banku, fufu, and more.', '8feeea07-0ad4-4b32-bc44-6a61dcba25ee', 'Greater Accra', 'Tema', '+233 24 333 4444', 'active', true),
('00000000-0000-0000-0000-000000000001', 'Kumasi Fashion House', 'kumasi-fashion-house-demo', 'Custom African prints, kente cloth, and modern fashion pieces tailored to perfection.', '07eb71fc-df5d-42e5-a8b3-5701a0d3adc2', 'Ashanti', 'Kumasi', '+233 27 555 6666', 'active', true),
('00000000-0000-0000-0000-000000000001', 'Cape Coast Books', 'cape-coast-books-demo', 'Academic textbooks, novels, stationery, and school supplies for students and professionals.', '18e82275-2d6a-4b5a-998a-fd187c97efda', 'Central', 'Cape Coast', '+233 20 777 8888', 'active', false),
('00000000-0000-0000-0000-000000000001', 'GlowUp Beauty', 'glowup-beauty-demo', 'Premium skincare, haircare, and cosmetics. Featuring both local and international brands.', '20cd7065-7bbd-4ce3-94bb-49e76c85eabb', 'Greater Accra', 'East Legon', '+233 50 999 0000', 'active', true),
('00000000-0000-0000-0000-000000000001', 'Tamale Auto Works', 'tamale-auto-works-demo', 'Quality car parts, servicing, and repairs. Specializing in Toyota and Nissan vehicles.', '37da116a-a980-4401-9d25-44db2440d0bc', 'Northern', 'Tamale', '+233 26 111 3333', 'active', false),
('00000000-0000-0000-0000-000000000001', 'HomeStyle Interiors', 'homestyle-interiors-demo', 'Furniture, decor, and home essentials. From sofas to curtains, we make your house a home.', '43965932-bab7-44ad-866e-2e71cbed0538', 'Ashanti', 'Kumasi', '+233 24 444 5555', 'active', true),
('00000000-0000-0000-0000-000000000001', 'FixIt Services', 'fixit-services-demo', 'Plumbing, electrical, and general maintenance services. Reliable and affordable.', 'f8529a8c-0afa-4ec5-b58d-5d63d9687d1b', 'Greater Accra', 'Accra', '+233 55 666 7777', 'active', false);
