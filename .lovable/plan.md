

The user wants to clarify how the **kiosk** concept fits into the Mowafer-style flow we just adopted. Mowafer's reference is pure single-storefront ecommerce -- it has no vendor/kiosk layer. BlueKiosk is multi-vendor (each kiosk = a vendor's storefront), so we need to extend the Mowafer information architecture to include kiosks as first-class entities alongside listings.

## Current state of kiosks

- `kiosks` table exists with owner, category, region, verification flag
- `/discover` has a "Kiosks" tab (search/filter kiosks)
- `/kiosk/$slug` shows kiosk detail + listings
- `/dashboard` lets vendors manage their kiosks
- `kiosk_id` is required on every listing -- so listings already belong to a kiosk

What's missing: kiosks aren't surfaced in the Mowafer-style architecture (home, category strip, listing card, detail page, mobile nav).

## Plan: Kiosks as a parallel entity to Listings

### 1. Information Architecture extension
```text
Home
├── Listings flow (Mowafer-style)
│   Categories → Listing → Contact Seller
└── Kiosks flow (NEW parallel branch)
    Browse Kiosks → Kiosk Detail → Listings within kiosk → Contact
```

### 2. Navbar additions
- Add "Kiosks" link in the desktop nav between "Discover" and "Sell"
- Mobile bottom nav: replace one tab with "Kiosks" (final order: Home, Discover, Sell, Kiosks, Profile) -- or keep 5 tabs and put Kiosks under Discover sub-tab
- Category strip: add a "Top Vendors" pill at the end that links to `/discover?tab=kiosks`

### 3. Landing page additions
- Keep `VendorSpotlight` (top-rated kiosks horizontal scroll) -- already exists
- Add a small **"Verified Kiosks Near You"** band above the footer: 4-up grid of kiosk cards filtered by user region (or default Greater Accra)
- In `DealsOfTheDay`, show the kiosk name as a clickable subtitle on each listing card so users discover the vendor

### 4. Listing card -- kiosk attribution
On every `ListingCard`, the small uppercase label above the title becomes a **clickable kiosk name** (links to `/kiosk/$slug`). Add a tiny verified checkmark next to it when the kiosk `is_verified`. This mirrors Jiji's "from Seller XYZ" attribution.

### 5. Listing detail -- kiosk sidebar enhancement
The right sidebar already shows seller/kiosk info. Restructure into a clear **"Vendor Card"**:
- Kiosk cover thumbnail (small)
- Kiosk name + verified badge
- Owner display name + "Member since"
- Kiosk category + region
- 3 buttons: `View Kiosk` (primary, yellow), `Contact via WhatsApp` (green), `View Seller Profile` (text link)
- Below: "More from this kiosk" -- horizontal scroll of 4 other listings from the same kiosk

### 6. Kiosk detail page -- Mowafer treatment
Refactor `/kiosk/$slug` to match the Mowafer storefront aesthetic:
- Cover banner with kiosk name, verified badge, category, region overlay
- Sticky action bar below cover: WhatsApp / Call / Save / Share
- Two-column layout below:
  - Left sidebar: About, Location (with map placeholder), Owner card, Member since, Status
  - Right main: Tabs `All Listings | Products | Services` with filter chips (condition, price sort) + ListingCard grid
- "More kiosks like this" horizontal scroll at bottom (same category)

### 7. Discover page -- kiosk tab parity
The Kiosks tab on `/discover` should mirror the Listings tab visually:
- Same sidebar filter (Category, Region, Verified-only toggle, Sort by name/newest/most-listings)
- Kiosk cards in grid: cover image + name + verified badge + category + region + listing count + "View Kiosk" button
- Grid/list toggle works the same way

### 8. Vendor dashboard cross-link
On `/dashboard`, when viewing the "My Kiosks" list, each kiosk card gets a "View Public Page" link to `/kiosk/$slug` so vendors can preview what buyers see.

### 9. Profile page -- saved kiosks
Add a "Saved Kiosks" section alongside saved listings (requires reusing the favorites table -- already supports `listing_id`; we'd add a parallel `kiosk_favorites` table OR reuse favorites with a discriminator).

**Simpler MVP approach:** defer saved-kiosks. Just add "My Kiosks" link in profile that goes to `/dashboard` for vendors.

## Files to change

**Modify:**
- `src/components/Navbar.tsx` -- add Kiosks link
- `src/components/MobileBottomNav.tsx` -- reorder/add Kiosks tab
- `src/components/CategoryStrip.tsx` -- add "Top Vendors" pill
- `src/components/ListingCard.tsx` -- clickable kiosk name + verified mark
- `src/routes/index.tsx` -- add "Verified Kiosks Near You" section
- `src/routes/listing.$slug.tsx` -- enhanced vendor card + "More from this kiosk"
- `src/routes/kiosk.$slug.tsx` -- Mowafer-style storefront layout
- `src/routes/discover.tsx` -- kiosk tab visual parity with listings tab
- `src/routes/dashboard.index.tsx` -- "View Public Page" link per kiosk

**Create:**
- `src/components/KioskCard.tsx` -- shared kiosk card used in VendorSpotlight, discover kiosks tab, related kiosks, and the new "Verified Kiosks Near You" section

**No database changes.** All workflow integration uses existing tables.

**Deferred:** saved/favorited kiosks (needs new table), kiosk reviews/ratings (Phase 3+ per specs), kiosk follow notifications.

