

# Mowafer-Style Architecture Adoption for BlueKiosk

## What I observed in the references

**Visual system (Mowafer):**
- White card surfaces on light grey page bg (not full cream)
- Logo tile (yellow rounded square) + tagline beneath, large pill search bar, account + cart top-right
- Horizontal category strip with line icons under header (always visible)
- Hero is a **collage of promo tiles** (1 large + small grid) -- not a single illustration
- "Deals of the Day" section with **category tabs** + featured large card + dense product grid
- Product cards: white, red circular `-10%` badge top-left, image, tiny SUBCATEGORY label, title, strike-through old price + bold orange new price, yellow circle add-to-cart + heart + compare icons
- **Teal full-width promo banners** between sections (e.g. "50% OFF ALL ELECTRONICS")
- Category page = left sidebar (Category yellow box, Sub-Category, Brand, Ratings, Price) + product grid + right vertical promo card + sort/grid-list toggle
- Product detail = thumbnail strip + main image + title + rating + price + qty + Add to Cart, then Description/Specifications/Reviews tabs, then Related Products
- Cart = list of rows with qty stepper + summary card, or grid of cards on mobile
- Footer = dark with Categories / About / Contact / Help columns, payment icons, social
- **Mobile** = same logo header, search, horizontal category chips, bottom tab bar (Home, Categories, Cart, Search, Account)

**Workflow (User Journey diagram):**
Home → (Latest Offers / Best Sellers / All Categories / Cart) → Category Page → Product Page → Product Info → Add to Wishlist / Compare / Cart → Checkout → Login/Signup → Address → Payment → Done. Plus Account, Articles, About, Contact branches.

## How this maps to BlueKiosk (classifieds, no cart/checkout)

BlueKiosk is contact-to-buy (WhatsApp/phone), so I'll **adopt the visual architecture** but **not** the cart/checkout flow. The "Add to Cart" yellow button becomes "Contact Seller", compare icon becomes "Save". Everything else translates 1:1.

## Plan

### 1. Global shell rework (Navbar)
Two-row sticky header matching Mowafer:
- **Row 1**: Logo (yellow rounded square + "BlueKiosk" + tiny Ghana tagline) | large pill search with yellow circular search button | language/region | account dropdown | "Sell" yellow pill (replaces cart)
- **Row 2**: Horizontal scrollable category strip with line icons (Electronics, Fashion, Food, Health & Beauty, Home, Auto, Books, Services) -- click navigates to `/discover?category=slug`
- **Mobile**: Logo + search + menu icon in row 1; category chips horizontally scrollable in row 2; bottom tab bar (Home, Discover, Sell, Saved, Profile)

### 2. Landing page rebuild (`src/routes/index.tsx`)
Replace current section list with Mowafer-aligned flow:
1. **HeroCollage** (new) -- 1 large featured-listing tile + 4 smaller category/promo tiles in a grid
2. **DealsOfTheDay** (new) -- category tabs (Electronics/Food/Fashion/...) with one large featured card on the left + 2-column listing grid on the right; switching tabs swaps content
3. **Teal promo banner** -- "Verified vendors across Ghana -- Browse all listings"
4. **TopListings** (refactored FeaturedListings) -- horizontally scrolling row of dense product cards
5. **CategoryTiles** (refactored CategoryShowcase) -- 3 large color tiles (Mobile Phones / Food & Supplies / Crisps & Snacks pattern) using bk-teal, bk-pink-ish, bk-yellow
6. **TopRatedKiosks** (refactored VendorSpotlight) -- horizontal scroll of verified kiosk cards
7. **Dark footer** (refactored)

Delete: `StatsStrip`, `ValueProp`, `BenefitsSection`, `HowItWorks`, `Testimonials`, `FAQSection`, `BottomCTA` from landing (move FAQ to a separate `/faq` route later).

### 3. Listing card redesign (used everywhere)
White card, image fills top, optional red `Verified` or `Negotiable` circular badge top-left, tiny uppercase kiosk-name label, title (2-line clamp), strike-through old price (when applicable) + bold orange price, bottom row = yellow circular WhatsApp/Contact button + heart save + small location chip. Replace current card markup in `FeaturedListings`, `discover.tsx` listings grid, and `kiosk.$slug.tsx` listings.

### 4. Discover page rework (Mowafer category page layout)
- **Desktop**: left sidebar (yellow Category box highlighting active, then Sub-Category, Region, Condition chips, Price min/max with apply button) + main grid + right vertical promo card
- Top of main: "Electronics -- 24 Results" + Sort By dropdown + grid/list toggle
- **Mobile**: filters behind a bottom-sheet "Filters" toggle, horizontal category chip row sticks under header
- Add list-view variant (wider cards, description snippet visible)
- Pagination controls at bottom (matching circular pager style)

### 5. Listing detail rework (`listing.$slug.tsx`)
Restructure to Mowafer product detail:
- Left thumbnail column + large main image
- Right: title, star rating, strike-through price + new price, qty placeholder removed (since classifieds), `Contact via WhatsApp` yellow pill + heart + share icons
- Tabs: **Description / Specifications / Reviews & Ratings**
- **Related Products** horizontal scroll
- Seller card moves into sidebar with kiosk name, owner display name, "View Kiosk" + "View Seller Profile" links, fallback contact note

### 6. Footer redesign
Dark `bk-dark` background, four columns (Categories / About Us / Contact / Help Center), small "BK" logo top-left with one-line description, payment-method placeholders (Mobile Money / Visa), social icons, copyright row. Replace current Footer.

### 7. Mobile bottom tab bar (new component)
Fixed bottom on mobile only: Home, Discover, **Sell** (centered, larger, yellow), Saved, Profile. Hidden on desktop. Add bottom padding to main content so it doesn't get covered.

### 8. Color & token additions
Add to `src/styles.css`:
- `bk-teal` already exists; add `bk-orange` (for prices), `bk-red` (for discount badges), `bk-page` (light grey page bg `#f5f5f5`)
- Switch page background from `bk-cream` to `bk-page` so white cards pop (Mowafer's signature look)

### 9. Workflow alignment with User Journey diagram
Map Mowafer journey to BlueKiosk reality:
- Home → Latest Listings / Top Kiosks / All Categories / **Saved** (replaces Cart)
- Category Page (`/discover?category=`) → Listing Page → **Contact Seller via WhatsApp** (replaces Add to Cart→Checkout flow)
- Account → Profile → Edit, Saved Listings, My Kiosks (vendors), Become a Vendor (customers)
- No cart/address/payment branch -- explicitly omitted (deferred to BluPay phase per specs)

## Files

**Create:**
- `src/components/landing/HeroCollage.tsx`
- `src/components/landing/DealsOfTheDay.tsx`
- `src/components/landing/PromoBanner.tsx`
- `src/components/landing/CategoryTiles.tsx` (replaces CategoryShowcase)
- `src/components/ListingCard.tsx` (shared card used everywhere)
- `src/components/MobileBottomNav.tsx`
- `src/components/CategoryStrip.tsx` (horizontal category icons row)

**Rewrite:**
- `src/components/Navbar.tsx` -- two-row Mowafer header
- `src/components/Footer.tsx` -- dark Mowafer footer
- `src/routes/index.tsx` -- new section order
- `src/routes/discover.tsx` -- sidebar filter layout, list/grid toggle, pagination
- `src/routes/listing.$slug.tsx` -- thumbnail+main+tabs+related
- `src/components/landing/FeaturedListings.tsx` -- horizontal scroll using ListingCard
- `src/components/landing/VendorSpotlight.tsx` -- horizontal scroll of kiosk cards
- `src/routes/__root.tsx` -- mount MobileBottomNav, switch page bg to bk-page
- `src/styles.css` -- add bk-page, bk-orange, bk-red tokens

**Delete (from landing flow only):**
- `src/components/landing/StatsStrip.tsx`
- `src/components/landing/ValueProp.tsx`
- `src/components/landing/BenefitsSection.tsx`
- `src/components/landing/HowItWorks.tsx`
- `src/components/landing/Testimonials.tsx`
- `src/components/landing/FAQSection.tsx`
- `src/components/landing/BottomCTA.tsx`
- `src/components/landing/HeroSection.tsx` (replaced by HeroCollage)
- `src/components/landing/CategoryShowcase.tsx` (replaced by CategoryTiles)

**No database changes.** All work is UI architecture.

**Deferred (per specs, FastAPI phase):** in-app chat, orders, escrow/BluPay, true cart+checkout flow.

