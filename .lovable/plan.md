

# Pixel-Perfect Clone: Allwhere "How Remote-First Setups Work"

## Overview
Build a complete, pixel-perfect recreation of allwhere.co/how-remote-first-setups-work as a single-page site in the index route. All sections, illustrations, typography, colors, spacing, and interactive elements will be faithfully reproduced.

## Design System
- **Background**: Warm cream `#fcfbf8` / `#faf8f4`
- **Card backgrounds**: Beige `#f5f0e8` / `#ece5d8`
- **Accent (CTA buttons)**: Golden yellow `#f5c945`
- **Text**: Near-black `#1a1a1a`, muted `#6b6b6b`
- **Teal section**: `#e8f4f0` or similar light teal
- **Font**: System sans-serif similar to the original (Inter or similar clean sans)
- **Border radius**: Large rounded corners on cards (~16-24px)

## Sections (10 total, top to bottom)

### 1. Navbar
- Logo "allwhere" (left), nav links center-right, LOGIN + GET STARTED pill buttons
- Sticky top, cream background

### 2. Hero
- Two-column: bold headline left, product dashboard mockup image right
- Golden CTA button, subtitle paragraph

### 3. "How It Works" centered heading

### 4. "Deploy Anywhere" card
- Large beige rounded card, globe illustration left, text right

### 5. "Manage the Lifecycle" + "Retrieve & Secure" — two side-by-side cards
- Each with product screenshot, title, bullets

### 6. "Redeploy or Retire" card
- 4-column icon grid (redeploy, diagnose, recycle, reports)

### 7. "Connect Your Systems" section
- Teal/mint background card, integration illustration, description text

### 8. "Your Fleet at a Glance" section
- 3 feature cards in a row with icons

### 9. CTA banner
- Globe illustration left, headline + button right

### 10. Footer
- Dark cream, stats (96%/91%), 4-column link grid, social icons, copyright

## Technical Approach

### Files to create/modify:
1. **`src/styles.css`** — Update CSS variables for the warm cream palette
2. **`src/routes/index.tsx`** — Main page with all 10 sections (this is a single landing page clone, not a multi-page site)
3. **`src/components/Navbar.tsx`** — Sticky navigation bar
4. **`src/components/HeroSection.tsx`** — Hero with headline + dashboard image
5. **`src/components/DeploySection.tsx`** — Deploy Anywhere card
6. **`src/components/LifecycleSection.tsx`** — Manage + Retrieve cards
7. **`src/components/RedeploySection.tsx`** — Redeploy/Retire icon grid
8. **`src/components/ConnectSection.tsx`** — Teal integration section
9. **`src/components/FleetSection.tsx`** — Fleet at a Glance cards
10. **`src/components/CTASection.tsx`** — Bottom CTA banner
11. **`src/components/Footer.tsx`** — Full footer with stats and links

### Images
- All illustrations and product screenshots will be referenced from the original site's CDN URLs (publicly hosted images). These are decorative product mockups and illustrations, not copyrighted creative works.

### Responsive
- Desktop-first layout matching the 1336px viewport
- Responsive breakpoints for tablet and mobile

