

# Pixel-Perfect BlueKiosk Multi-Page Site Clone

## Current State
- Only the "How It Works" page exists at `/` with broken CDN image URLs
- No other pages exist (about, pricing, contact, compare, case-studies, global, terms)
- The uploaded `index.html` shows a **completely different homepage** than what's currently built (the current index is the "how it works" page content)
- Branding is "BlueKiosk" (rebranded allwhere)

## What Changes

### Phase 1: Fix shared layout and design system
- Move Navbar and Footer into `__root.tsx` layout so they're shared across all routes
- Update `src/styles.css` with IBM Plex Sans font (the actual font from the live site), fix color tokens
- Fix all CDN image URLs using the real ones from the live site HTML

### Phase 2: Restructure routes (9 pages total)
| Route file | URL | Content |
|---|---|---|
| `index.tsx` | `/` | New homepage: hero, trusted-by logos, 3 side-by-side sections (Procurement, Retrievals, Fleet), testimonials, video embed, CTA |
| `how-remote-first-setups-work.tsx` | `/how-remote-first-setups-work` | Current "How It Works" content (Deploy, Lifecycle, Redeploy, Connect, Fleet, CTA) |
| `about.tsx` | `/about` | Values, benefits, job listings (JazzHR) |
| `pricing.tsx` | `/pricing` | Hero with form, consultation section, pay-as-you-go tiers |
| `contact.tsx` | `/contact` | Demo scheduling form, trusted-by logos, "How It Works" summary |
| `contact-us.tsx` | `/contact-us` | Support contact form, admin/employee help sections |
| `compare.tsx` | `/compare` | Competitor comparison grid with filters |
| `case-studies.tsx` | `/case-studies` | Featured case study, case study cards grid, newsletter signup |
| `global.tsx` | `/global` | Country coverage lists by region, "Why Choose" section |
| `terms.tsx` | `/terms` | Full Terms & Conditions + Privacy Policy legal text |

### Phase 3: Update shared components
- **Navbar**: Add `Link` navigation to all routes, fix nav items
- **Footer**: Update links to match real footer structure (Product, Solutions, Resources, Company columns with correct items), add social icon SVGs, update stats text to match ("96% on-time delivery rate", "91% on-time retrieval success rate (80% more than industry standard)")

### Phase 4: Build page-specific components
Each page will have dedicated section components as needed. Reusable patterns:
- Contact/demo form component (used on pricing, contact, contact-us pages)
- Testimonial card component (used on homepage)
- Case study card component
- "Trusted by" logo strip (homepage, contact)
- "Why Choose BlueKiosk" section (compare, global)

## Technical Details

### Font
The live site uses **IBM Plex Sans** (weights 300-700). Will add Google Fonts link in `__root.tsx`.

### Images
All illustrations and screenshots will use real CDN URLs from `cdn.prod.website-files.com/637be80ebdeb9e966b7a84cd/...` (extracted from live HTML).

### Files to create/modify
**Modified:** `__root.tsx`, `styles.css`, `index.tsx`, `Navbar.tsx`, `Footer.tsx`, `HeroSection.tsx`
**New routes:** `how-remote-first-setups-work.tsx`, `about.tsx`, `pricing.tsx`, `contact.tsx`, `contact-us.tsx`, `compare.tsx`, `case-studies.tsx`, `global.tsx`, `terms.tsx`
**New components:** ~15-20 section components for the various pages

### Implementation order
Due to the large scope, this will be built incrementally:
1. Shared layout (Navbar/Footer in root, font, design tokens)
2. Homepage (index) with all sections
3. How It Works page (move current content)
4. Remaining pages in batches

