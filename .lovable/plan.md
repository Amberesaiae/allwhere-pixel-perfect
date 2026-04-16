

## Audit findings

### 1. Logo: must be text-only lowercase
Currently `Navbar.tsx` and `Footer.tsx` render a yellow rounded square tile with "BK" inside + "BlueKiosk" beside it. Per `mem://constraints/brand-text-only`, the brand is text-only — and the user now specifies **lowercase**. So everywhere should read `bluekiosk` as styled text only, no tile, no "BK" mark.

Files to fix: `Navbar.tsx`, `Footer.tsx`, `MobileBottomNav.tsx` (if any mark), auth pages (`login.tsx`, `register.tsx`, `forgot-password.tsx`, `reset-password.tsx`), `become-vendor.tsx`, meta titles in route `head()` blocks, and any mention in landing components.

### 2. Missing UX / journeys / workflows

After tracing the current routes against the Phase 1–2 specs and the Mowafer architecture we adopted, these gaps remain:

**A. Search journey is incomplete**
- Navbar search uses `window.location.href` (full page reload) instead of TanStack `useNavigate` — loses SPA state, slower.
- No search suggestions / recent searches / popular searches dropdown.
- No empty-state guidance on `/discover` when `q` returns 0 results (suggest categories, clear filters CTA).
- Search doesn't search across kiosks when on the Kiosks tab consistently.

**B. Saved/Favorites journey**
- Heart toggle on `ListingCard` exists visually but isn't wired to favorites table for unauthenticated users (should prompt sign-in).
- `/favorites` route exists but no empty state CTA, no "Browse listings" fallback.
- No saved-kiosks (deferred earlier — fine, but need to communicate it).

**C. Vendor onboarding journey**
- `become-vendor` → `dashboard/create-kiosk` → `dashboard/create-listing`: no progress indicator showing the user where they are in the 3-step flow.
- After creating first kiosk, no "next step" nudge to create a listing.
- After creating first listing, no "share your kiosk" success state with copy-link / WhatsApp share.

**D. Buyer → Seller contact journey**
- WhatsApp deep links exist but no fallback when seller has no WhatsApp number (should fall back to phone `tel:` or in-app message placeholder).
- No "Report listing" or "Report kiosk" affordance (trust signal expected in Ghana classifieds).
- No share button on listing detail (copy link / WhatsApp share / X share).

**E. Listing lifecycle**
- No visible status on listings (active/sold/paused) on the vendor dashboard cards.
- No "Mark as sold" quick action.
- No "Bump listing" / "Boost" placeholder (deferred to monetization phase, but UI slot should exist).

**F. Empty states & loading**
- `/discover` listings tab: no skeleton loader, no empty state when filters return nothing.
- Kiosk detail page: no empty state when kiosk has 0 listings ("This kiosk hasn't posted yet — check back soon").
- Dashboard with 0 kiosks: needs friendlier empty state with illustration + clear CTA.
- Profile page with 0 favorites/0 kiosks: same.

**G. Mobile UX**
- Mobile bottom nav has 5 tabs (Home, Discover, Sell, Kiosks, Profile) — Saved/Favorites is gone from mobile primary nav. Either swap one tab or add a header heart icon on mobile.
- Filter sheet on `/discover` mobile: needs a sticky "Apply (N results)" footer button.
- Sticky header height + bottom nav height: ensure content padding accounts for both, esp. on listing detail.

**H. Trust & verification surfacing**
- "Verified" badge appears on kiosk cards but the *meaning* is never explained. Add a small "What does Verified mean?" link/popover on kiosk detail.
- No member-since date on listing card (Jiji-style "3+ years" tenure signal).
- No view count on listings (cheap trust signal, no DB change needed if we add a column later — for now add UI placeholder hidden behind feature flag, or skip).

**I. Auth flows**
- `/login` and `/register` lack social proof, lack "continue as guest" fallback, no Google OAuth CTA (specs mention Google).
- After login, redirect should respect `redirect=` query param (e.g. user clicked Save → login → return to listing). Currently goes to `/discover`.
- Password reset flow exists but no success toast confirming email sent.

**J. SEO / meta**
- Many routes lack per-page `og:image`. Listing detail and kiosk detail should pass the cover image into og:image / twitter:image (per TanStack Start guidance).
- Route titles should follow `<Page> · bluekiosk` pattern with lowercase brand.

**K. Footer & navigation**
- Footer has Categories/Company/Contact but missing: "Help", "Safety tips", "Report abuse", "Sell on bluekiosk" landing link separate from become-vendor.
- No `/about`, `/safety`, `/help` routes — referenced implicitly but absent.

**L. Notifications / toasts**
- Many actions (save, contact-revealed, listing created) lack toast confirmations.

### 3. Plan (concise scope for this iteration)

I'll fix in two waves to keep this tractable:

**Wave 1 — Brand + critical UX gaps (this approval)**

1. **Logo**: Replace BK tile with text-only `bluekiosk` (lowercase) everywhere — Navbar, Footer, MobileBottomNav, auth pages, all `head()` titles. Style: bold, tight tracking, `text-bk-dark` (or white in dark footer), with the "k" in `text-bk-yellow` for a subtle brand accent (or pure text if you prefer — see question below).

2. **Search journey**: Switch navbar search to `useNavigate` (no reload). Add empty state on `/discover` with "No results for 'X' — try clearing filters" + "Browse all categories" CTA.

3. **Auth redirect**: Honour `?redirect=` param on `/login` and `/register` so save/contact actions return users to where they came from. Add toast on successful login.

4. **Empty states**: Add proper empty states to `/discover` (no results), `/favorites` (no saved items), `/dashboard` (no kiosks), `/kiosk/$slug` (no listings yet), `/profile` (no activity).

5. **Save flow**: Wire heart toggle on `ListingCard` to `favorites` table. Unauthenticated users get a toast + redirect to login with `?redirect=` back.

6. **Listing detail**: Add Share button (copy link + WhatsApp share). Add "Report listing" link (opens a simple form/dialog — stores into a `reports` table, OR for now a mailto fallback).

7. **Vendor flow polish**: Add 3-step progress indicator on become-vendor → create-kiosk → create-listing. Add success screens after each step with the next CTA.

8. **WhatsApp fallback**: If no WhatsApp number on the kiosk, show `tel:` button instead. Hide the WhatsApp button entirely if neither exists.

9. **Mobile filter sheet**: Add sticky "Apply (N results)" footer button.

10. **Per-page SEO**: Pass cover/main image into `og:image` for listing detail and kiosk detail. Update all titles to `<Page> · bluekiosk` lowercase.

11. **Footer additions**: Add `/safety`, `/help` placeholder routes and link them in the footer.

**Wave 2 — Deferred (mention only; do later)**

- Saved kiosks (needs `kiosk_favorites` table)
- Listing status (active/sold/paused) — needs `status` column on `listings`
- View counts — needs `view_count` column
- "Bump listing" — monetization phase
- Reviews & ratings — Phase 3+ per specs
- Google OAuth — separate flow
- In-app reports table — start with mailto, upgrade later

### 4. Files to modify (Wave 1)

**Brand:** `Navbar.tsx`, `Footer.tsx`, `MobileBottomNav.tsx`, `login.tsx`, `register.tsx`, `forgot-password.tsx`, `reset-password.tsx`, `become-vendor.tsx`, all route `head()` titles in `index.tsx`, `discover.tsx`, `listing.$slug.tsx`, `kiosk.$slug.tsx`, `profile.tsx`, `favorites.tsx`, `dashboard.*.tsx`.

**UX:** `Navbar.tsx` (search nav), `discover.tsx` (empty state, mobile sticky apply), `ListingCard.tsx` (save wiring + auth gate), `favorites.tsx` (empty state), `dashboard.index.tsx` (empty state, status placeholder), `kiosk.$slug.tsx` (empty state, og:image), `listing.$slug.tsx` (share, report, og:image, WhatsApp fallback), `become-vendor.tsx`, `dashboard.create-kiosk.tsx`, `dashboard.create-listing.tsx` (3-step progress), `login.tsx`, `register.tsx` (redirect param + toast), `Footer.tsx` (safety/help links).

**Create:** `src/routes/safety.tsx`, `src/routes/help.tsx` (simple static pages), `src/components/StepProgress.tsx`, `src/components/ShareDialog.tsx`, `src/components/ReportDialog.tsx`, `src/components/EmptyState.tsx` (shared).

**No DB changes required for Wave 1** (favorites table already exists; reports use mailto for now).

