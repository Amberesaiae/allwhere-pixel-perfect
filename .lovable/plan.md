

# BlueKiosk: Listing-Centric Marketplace Implementation

## Current State

**Completed (Phases 1-4 of original plan):**
- Auth (email/password + Google OAuth), profiles, user_roles
- Kiosk CRUD with image upload, vendor dashboard
- Discovery feed (kiosk-centric), kiosk detail page
- Vendor onboarding (become-vendor flow)
- 8 seeded demo kiosks, categories table

**Existing DB tables:** categories, kiosks, kiosk_stats, profiles, user_roles

**What is missing per the uploaded specs:**
- No `listings` table (the atomic unit of a classifieds marketplace)
- No `listing_images` table (multi-photo support)
- No `favorites` table
- No listing CRUD routes
- Kiosk detail page says "no products yet" with no way to add any
- No WhatsApp/Call contact buttons on kiosk or listing pages
- No seller public profile
- Discovery is kiosk-centric, not listing-centric (Jiji/Tonaton model)
- No chat infrastructure (Phase 2 spec -- deferred to FastAPI migration)
- No transactions/orders (Phase 2 spec -- deferred to FastAPI migration)
- Hydration error from SSR date formatting in kiosk detail
- `product.$handle.tsx` is a leftover from allwhere -- should be removed

---

## Plan: Phase 2A -- Listings, Favorites, and Contact Flows

This implements the listing layer that makes BlueKiosk function like Jiji/Tonaton, while deferring chat and transactions to the FastAPI migration as specified in the specs.

### Step 1: Database Migration

Create tables via migration:

**`listing_condition` enum:** `new`, `used`, `refurbished`

**`listings` table:**
- id, kiosk_id (FK kiosks), owner_id, title, slug, description
- price (numeric), currency (text, default 'GHS')
- condition (listing_condition enum), is_negotiable (boolean, default false)
- listing_type (text: 'product' or 'service')
- status (text: 'active', 'sold', 'inactive', default 'active')
- category_id (FK categories), region, city
- stock_quantity (integer, nullable), pricing_type (text: 'fixed', 'range', 'quote')
- price_max (numeric, nullable -- for range pricing)
- created_at, updated_at

**`listing_images` table:**
- id, listing_id (FK listings), image_url, sort_order, created_at

**`favorites` table:**
- id, user_id, listing_id (FK listings), created_at
- unique(user_id, listing_id)

**`listing_stats` table:**
- id, listing_id (FK listings), views_count (default 0)

**RLS:** Public SELECT for active listings, owner INSERT/UPDATE/DELETE for listings and listing_images, authenticated user CRUD own favorites, public SELECT on listing_stats.

**Triggers:** Auto-create listing_stats on new listing, increment_listing_views function.

**Seed data:** 12-16 sample listings across existing demo kiosks with realistic Ghana items and GHS prices.

### Step 2: Listing CRUD Routes

**`/dashboard/create-listing`** -- 3-step wizard:
1. Basic Info: type (product/service), title, category, description, kiosk select
2. Pricing: price (GHS), condition, negotiable toggle, stock (products), pricing type (services)
3. Images: up to 5 image uploads with preview and reorder

**`/dashboard/edit-listing/$id`** -- Pre-filled edit form with image management

**Update `/dashboard`** -- Add "Listings" tab alongside "Kiosks" tab with listing cards, status toggle (active/sold), edit/delete actions

### Step 3: Listing-Centric Discovery

**Refactor `/discover`** -- Two tabs: "Listings" (default) and "Kiosks"
- Listings tab: card grid with thumbnail, title, price (GHS), condition badge, "Negotiable" badge, location, time-ago
- Add price range filter (min/max)
- Add condition filter chips
- Sort options: Newest, Price Low-High, Price High-Low

### Step 4: Listing Detail Page

**New route `/listing/$slug`:**
- Image gallery (horizontal scroll mobile, grid desktop)
- Title, price, condition badge, negotiable badge, posted date
- Description, seller info card
- Contact sidebar: WhatsApp button (pre-filled message), Call button, link to kiosk
- Heart/favorite toggle (requires auth)
- View count tracking
- Related listings from same kiosk

### Step 5: WhatsApp and Call Contact Buttons

- Add helper functions: `getWhatsAppUrl(phone, message)`, `getCallUrl(phone)`
- Add WhatsApp + Call buttons to listing detail and kiosk detail pages
- Update kiosk detail page to replace "Contact Vendor" register link with real contact buttons

### Step 6: Favorites System

**New route `/favorites`** -- grid of saved listings for authenticated users
- Heart icon on listing cards and detail page
- Add "Saved" link to Navbar for logged-in users

### Step 7: Kiosk Detail Enhancement

- Update `/kiosk/$slug` to show the kiosk's actual listings grid (Products tab, Services tab)
- Fix hydration error (stable date formatting)
- Add WhatsApp/Call buttons to vendor sidebar

### Step 8: Seller Public Profile

**New route `/seller/$id`:**
- Display name, avatar, member since, region, verification badge
- Active listings count
- Grid of their active listings, links to their kiosks

### Step 9: Cleanup

- Delete `product.$handle.tsx` (allwhere leftover)
- Update Navbar with "Saved" link for authenticated users
- Save updated architecture to project memory

---

## Technical Details

**New files:**
- `src/routes/listing.$slug.tsx`
- `src/routes/dashboard.create-listing.tsx`
- `src/routes/dashboard.edit-listing.$id.tsx`
- `src/routes/favorites.tsx`
- `src/routes/seller.$id.tsx`
- Migration SQL file

**Modified files:**
- `src/routes/discover.tsx` -- listing-centric tabs, new filters
- `src/routes/kiosk.$slug.tsx` -- listings grid, contact buttons, hydration fix
- `src/routes/dashboard.index.tsx` -- listings tab
- `src/components/Navbar.tsx` -- Saved link
- `src/lib/constants.ts` -- WhatsApp/Call helpers, condition labels

**Deleted files:**
- `src/routes/product.$handle.tsx`

**Storage:** Reuse existing `kiosk-images` bucket for listing images.

**What is NOT in scope (deferred to FastAPI migration per specs):**
- In-app chat (Socket.io)
- Orders and transactions
- BluPay escrow and payments
- Disputes and admin console
- Celery background jobs

