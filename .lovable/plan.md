

# BlueKiosk: Ghana Marketplace — Phase 1 + Landing Page

## Overview
Replace the entire allwhere website clone with the BlueKiosk marketplace application. Build the landing page and all Phase 1 features (auth, kiosk discovery, vendor onboarding, kiosk management) using Lovable Cloud (Supabase) for backend, with migration documentation for FastAPI.

## Architecture

```text
src/
├── routes/
│   ├── __root.tsx          — Shell + bottom nav + QueryClientProvider
│   ├── index.tsx           — Landing page (public)
│   ├── login.tsx           — Login form
│   ├── register.tsx        — Registration form
│   ├── reset-password.tsx  — Password reset
│   ├── discover.tsx        — Kiosk discovery feed (public)
│   ├── search.tsx          — Search results
│   ├── kiosk.$kioskId.tsx  — Kiosk detail page
│   ├── vendor/
│   │   ├── dashboard.tsx   — Vendor dashboard
│   │   ├── create-kiosk.tsx — 4-step kiosk wizard
│   │   └── edit-kiosk.$kioskId.tsx
│   ├── profile.tsx         — User profile/settings
│   └── terms.tsx           — Terms & Privacy
├── components/
│   ├── ui/                 — shadcn/ui (keep existing)
│   ├── landing/            — Landing page sections
│   ├── discovery/          — Kiosk cards, filters, search
│   ├── kiosk/              — Kiosk detail, wizard steps
│   ├── auth/               — Auth forms, guards
│   └── layout/             — BottomNav, Header, AuthGuard
├── hooks/
│   ├── use-auth.ts
│   └── use-kiosks.ts
└── styles.css              — New BlueKiosk design tokens
```

## Database Schema (Supabase/Lovable Cloud)

**Tables to create via migrations:**

1. **profiles** — extends auth.users (full_name, phone, avatar_url, created_at)
2. **user_roles** — role enum (customer, vendor, admin) per security guidelines
3. **categories** — id, name, slug, icon (seeded: Food & Beverage, Electronics, Fashion, Services, etc.)
4. **kiosks** — id, owner_id (FK profiles), name, category_id, description, region, city, landmark, lat, lng, cover_image_url, logo_url, status (draft/published), whatsapp_number, created_at
5. **kiosk_stats** — kiosk_id, views_count, avg_response_time (computed later)

**RLS policies:** Users read all published kiosks. Vendors CRUD their own kiosks. has_role() security definer function for admin checks.

**Storage buckets:** `kiosk-images` for cover photos and logos.

## Design System (replacing allwhere tokens)

- **Primary**: `#2563EB` (Blue-600) — BlueKiosk brand blue
- **Primary foreground**: White
- **Accent/CTA**: `#3B82F6` (Blue-500)
- **Background**: `#FAFAFA` (near-white)
- **Surface/Cards**: `#FFFFFF`
- **Text**: `#111827` (Gray-900), muted `#6B7280` (Gray-500)
- **Success**: `#10B981`, Warning: `#F59E0B`, Error: `#EF4444`
- **Font**: Inter (body + headings)
- **Border radius**: 12px cards, 8px inputs, full-round pills
- **Mobile-first** with bottom navigation bar

## Implementation Batches

### Batch 1: Clean slate + design system + landing page
- Delete all allwhere components and routes
- Update `styles.css` with BlueKiosk tokens (blue palette, Inter font)
- Update `__root.tsx` — remove allwhere Navbar/Footer, add responsive shell
- Build landing page at `/` with:
  - Hero: "Find Trusted Vendors Near You in Ghana"
  - Benefits section (Trust, Discovery, Secure Payments)
  - How it works (3 steps)
  - CTA: "Browse Kiosks" + "Sign Up"

### Batch 2: Auth (Supabase)
- Enable Lovable Cloud auth (email/password)
- Create `profiles` table + `user_roles` table via migrations
- Build `/register` — form with name, email, password, phone (optional)
- Build `/login` — email/password + "Forgot password?"
- Build `/reset-password` — password reset flow
- Auth guard component for protected routes
- Profile menu with "Become a Vendor" option

### Batch 3: Discovery feed + kiosk detail
- Seed `categories` table (Food, Electronics, Fashion, Services, Health, Education, etc.)
- Create `kiosks` table with RLS
- Build `/discover` — search bar, location indicator, category chips, kiosk card grid, infinite scroll
- Build `/kiosk/$kioskId` — cover image, logo, name, badge, tabs (Products/Services/About), Chat + WhatsApp buttons
- Build `/search` — categorized results (kiosks, products, services sections)
- Empty state with fallback suggestions

### Batch 4: Vendor onboarding + kiosk management
- "Become a Vendor" flow — adds vendor role
- Build `/vendor/create-kiosk` — 4-step wizard (Basic Info → Location → Branding → Review)
- Image upload to Supabase Storage for cover/logo
- Build `/vendor/dashboard` — kiosk cards with status badges, stats, FAB
- Publish flow with confirmation modal
- Build `/vendor/edit-kiosk/$kioskId` — pre-filled edit form
- Bottom navigation: Home, Search, Profile (customer) / Dashboard, Profile (vendor)

### Batch 5: Polish + migration docs
- Responsive bottom nav with role-aware items
- Location auto-detection (browser Geolocation API)
- Kiosk view count tracking
- Create `MIGRATION_GUIDE.md` documenting:
  - Supabase → PostgreSQL + SQLAlchemy schema mapping
  - Server functions → FastAPI endpoint mapping
  - Auth → FastAPI JWT auth mapping
  - Storage → S3 adapter mapping

## Technical Details

- **Auth**: Supabase auth with `onAuthStateChange` listener + `requireSupabaseAuth` middleware for server functions
- **Data fetching**: TanStack Query via route loaders + server functions
- **Image upload**: Supabase Storage with signed URLs
- **Search**: Supabase full-text search on kiosk name + description
- **Location**: Browser Geolocation API → reverse geocode to Ghana regions
- **No Celery/Socket.io**: These are deferred to the FastAPI migration. Document as migration items.

## Files to delete
All allwhere-specific files: `HeroSection.tsx`, `DeploySection.tsx`, `LifecycleSection.tsx`, `RedeploySection.tsx`, `ConnectSection.tsx`, `FleetSection.tsx`, `CTASection.tsx`, `Navbar.tsx`, `Footer.tsx`, and all allwhere route files (`about.tsx`, `pricing.tsx`, `contact.tsx`, `contact-us.tsx`, `compare.tsx`, `case-studies.tsx`, `global.tsx`, `how-remote-first-setups-work.tsx`).

