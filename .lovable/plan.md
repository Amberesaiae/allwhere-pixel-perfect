

# BlueKiosk: Comprehensive UI/UX Audit and Conformance Fix

## Critical Issues (Runtime-Breaking)

### 1. Remove ALL Shopify remnants
The app crashes because `FeaturedProducts.tsx` references the deleted `product.$handle` route, and `__root.tsx` calls `useCartSync` which imports the Shopify cart store.

**Delete files:**
- `src/components/CartDrawer.tsx`
- `src/stores/cartStore.ts`
- `src/lib/shopify.ts`
- `src/hooks/useCartSync.ts`
- `src/components/landing/FeaturedProducts.tsx`

**Modify:**
- `src/routes/__root.tsx` -- remove `useCartSync` import and call
- `src/components/Navbar.tsx` -- remove `CartDrawer` import and `<CartDrawer />` usage
- `src/routes/index.tsx` -- replace `FeaturedProducts` with new `FeaturedListings` component

### 2. Create `FeaturedListings.tsx`
New component that queries the 8 most recent active listings from the database and displays them in a card grid with thumbnail, price, condition badge, location, and link to `/listing/$slug`. Same visual style as discover listing cards.

---

## Navbar Fixes (390px mobile-first)

### 3. Remove cart icon
Cart icon is Shopify-specific. Remove entirely from Navbar.

### 4. Fix heart icon auth timing
Ensure heart icon only renders after auth state fully resolves. Verified it has the guard, but removing CartDrawer will shift layout -- needs re-check.

### 5. Improve mobile menu hierarchy (per Phase 1 spec Section 7)
Current mobile menu is a flat list. Restructure to:
- Navigation links (Home, Discover, Saved) -- grouped at top
- Visual divider
- Action links (Dashboard / Start Selling)
- Auth CTAs at bottom as full-width buttons

---

## Landing Page Fixes

### 6. Update Hero CTA
Change "BROWSE KIOSKS" to "Browse Listings" -- the platform is now listing-centric (Jiji/Tonaton model).

### 7. Replace hero image
Current image is from allwhere CDN (`cdn.prod.website-files.com`). Replace with a simple CSS-gradient illustration or abstract SVG pattern relevant to a Ghana marketplace.

### 8. CategoryShowcase -- pass category to discover
Currently links to `/discover` without params. Update to pass `?category=electronics` (using slug). The discover page must also read this URL param.

### 9. VendorSpotlight CTA
Update "VIEW ALL VENDORS" link to navigate to `/discover` with the kiosks tab selected.

---

## Discover Page Fixes (390px mobile)

### 10. Mobile filter UX improvements
At 390px, three dropdowns stack vertically consuming half the viewport. Fix:
- Search bar stays full-width
- Category + Region in a horizontally scrollable row on mobile
- Listing filters (condition chips, price range, sort) behind a collapsible "Filters" toggle on mobile
- Reduce grid gap from `gap-4` to `gap-3` and horizontal padding from `px-6` to `px-4` on mobile

### 11. Search debounce
Add 300ms debounce before firing `fetchListings`/`fetchKiosks` on filter changes.

### 12. Accept category from URL search params
When arriving from CategoryShowcase, read `?category=slug` from URL and pre-select the matching category filter.

---

## Listing Detail Fixes

### 13. Add seller profile link
Currently only shows "View Kiosk" button in seller card. Add "View Seller Profile" link below it, linking to `/seller/$id` using `listing.kiosks.owner_id`.

### 14. Fallback contact when no phone
When kiosk has no phone number, show: "Visit the kiosk page to contact this seller" with a link to `/kiosk/$slug` instead of an empty space.

---

## Kiosk Detail Fixes

### 15. Show vendor display_name in sidebar
Currently shows `kiosk.name` as the vendor identity. Fetch the owner's profile (`profiles.display_name` via `owner_id`) and display it in the vendor card.

### 16. "Add Listing" button for kiosk owners
When the logged-in user is the kiosk's `owner_id`, show an "Add Listing" floating button or inline button that links to `/dashboard/create-listing`.

---

## Dashboard and Post-Action Redirects

### 17. Redirect after listing creation to kiosk page
Currently redirects to `/dashboard`. Change to redirect to `/kiosk/$slug` (the kiosk the listing was added to) so the vendor sees their new listing in context.

---

## Profile Page Fixes

### 18. Add "Become a Vendor" link for non-vendors
Per spec: profile menu should include "Become a Vendor" for customers. Add a card or link in the profile page linking to `/become-vendor` when the user is not a vendor.

---

## Auth Flow Redirect Fix

### 19. Redirect to /discover after login/register
Currently both `login.tsx` and `register.tsx` redirect to `/` on success. Per Phase 1 spec: "Auto-login and redirect to Discovery feed." Change redirect target to `/discover`.

---

## Technical Summary

**Delete 5 files:** CartDrawer, cartStore, shopify.ts, useCartSync, FeaturedProducts

**Create 1 file:** `src/components/landing/FeaturedListings.tsx`

**Modify 11 files:**
- `__root.tsx` -- remove useCartSync
- `index.tsx` -- swap FeaturedProducts for FeaturedListings
- `Navbar.tsx` -- remove CartDrawer, restructure mobile menu
- `HeroSection.tsx` -- update CTA text and hero image
- `CategoryShowcase.tsx` -- pass category search param
- `discover.tsx` -- URL search params, mobile filter UX, debounce
- `listing.$slug.tsx` -- seller profile link, fallback contact
- `kiosk.$slug.tsx` -- owner profile name, owner "Add Listing" button
- `dashboard.create-listing.tsx` -- redirect to kiosk page
- `profile.tsx` -- become-vendor link for non-vendors
- `login.tsx` -- redirect to /discover

**No database changes required.**

**Deferred (FastAPI migration per specs):**
- In-app chat (Socket.io/WebSocket)
- Orders, transactions, escrow (BluPay)
- Admin console and disputes
- Bottom navigation bar (requires chat + orders tabs)
- Push notifications, read receipts, typing indicators

