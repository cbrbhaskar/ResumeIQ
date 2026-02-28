# ResumeOps UI Overhaul — Design Document
**Date:** 2025-01-28
**Status:** Approved
**Reference sites:** rezi.ai, resume.io, enhancv.com, resumeiq.pro

---

## Design Philosophy

**"Only 2% of resumes win. Yours will be one of them."** — Resume.io

Lead with fear → pivot to empowerment → show the product working → zero friction entry. This is the conversion pattern used by the highest-traffic resume SaaS products. ResumeOps adopts this pattern with a Light Magic UI aesthetic: white/off-white base, animated gradient orbs, subtle dot grid, violet/indigo/cyan palette.

---

## Design System

### Colors (unchanged palette, elevated usage)
- Primary violet: `#7c3aed`
- Indigo: `#4f46e5`
- Cyan: `#06b6d4`
- Heading: `#0f172a`
- Body: `#374151`
- Muted: `#64748b`
- Background: `#ffffff` / `#f8fafc`

### New Animations (Magic UI patterns, no external deps)
- `@keyframes orb-float` — slow floating orbs in hero
- `@keyframes count-up` — number ticker via JS
- `@keyframes marquee` — dual-row testimonials
- `@keyframes shimmer` — CTA button shimmer
- `@keyframes grid-fade` — dot grid subtle pulse
- `@keyframes bento-glow` — bento card edge glow on hover

### Typography
- Font: Instrument Sans (existing)
- Hero headline: `clamp(2.75rem, 6vw, 4.5rem)`, weight 800
- Section headings: `clamp(1.75rem, 3vw, 2.5rem)`, weight 700

### Styling approach
- **Tailwind-first** across all pages (migrate away from inline styles)
- Custom utilities in `globals.css` for animations
- Framer Motion for page transitions and scroll-triggered reveals

---

## New Utility Components (Magic UI primitives)

| Component | File | Purpose |
|---|---|---|
| `NumberTicker` | `components/ui/number-ticker.tsx` | Animated count-up numbers |
| `MagicOrbs` | `components/ui/magic-orbs.tsx` | Animated gradient orb background |
| `DotGrid` | `components/ui/dot-grid.tsx` | Subtle dot grid overlay |
| `MarqueeRow` | `components/ui/marquee-row.tsx` | Infinite scroll marquee |
| `BentoGrid` | `components/ui/bento-grid.tsx` | Asymmetric bento layout |
| `BentoCard` | `components/ui/bento-card.tsx` | Individual bento cell |
| `ShimmerButton` | `components/ui/shimmer-button.tsx` | CTA with shimmer animation |
| `AnimatedBorder` | `components/ui/animated-border.tsx` | Gradient animated border |
| `MiniSparkline` | `components/ui/mini-sparkline.tsx` | Tiny SVG line chart |

---

## Page Designs

---

### 1. Landing Page (`app/page.tsx`)

**Headline (fear → empowerment):**
> "75% of resumes are rejected before a human reads them."
> *subhead:* "ResumeOps tells you exactly why — and fixes it in 30 seconds."

**Section order:**

#### 1.1 Navbar
- Floating pill design: `backdrop-blur-md bg-white/80 border border-white/20`
- Logo left, links center (Pricing, Sign In), CTA right ("Get Free Score →")
- On scroll: shadow appears, border strengthens
- Mobile: hamburger with slide-down sheet

#### 1.2 Hero
- Background: `MagicOrbs` (3 orbs: violet, indigo, cyan, slow float) + `DotGrid` overlay
- Badge pill: "✦ Trusted by 10,000+ job seekers"
- Headline: gradient on "rejected" → empowerment pivot in subhead
- CTAs: `ShimmerButton` ("Analyse My Resume Free →") + ghost "See How It Works"
- Hero card: floating mock ATS result card (glass morphism) showing score 84/100 with 4 animated progress bars ticking up. `NumberTicker` on the score.
- Stats row below card: 3 inline stats with `NumberTicker`: "75% filtered" / "6 sec scan" / "3× interviews"

#### 1.3 Social Proof Ticker
- Label: "Candidates who landed roles at"
- Single row of company logos scrolling: Google, Meta, Stripe, Amazon, Airbnb, Notion, Linear, Figma, Shopify, Netflix, Apple, Microsoft
- CSS marquee animation, no JS

#### 1.4 Bento Grid Features
Asymmetric 4-column grid:

```
[  ATS Score — 2 cols  ] [ Keyword Gap — 2 cols ]
[ Section Review — 1 ] [ Suggestions — 2 cols ] [ Export — 1 ]
```

- **ATS Score (large)**: Animated circular gauge counting from 0→84, violet gradient fill
- **Keyword Gap (large)**: Animated keyword chips appearing one by one with matched (green) / missing (red) states
- **Section Review**: Animated checklist items checking off
- **Suggestions (large)**: Typewriter text showing an AI-generated bullet rewrite
- **Export**: Download icon with shimmer, "PDF & DOCX" label
- Each card: `AnimatedBorder` glow on hover, glass background

#### 1.5 Stats Strip
Full-width gradient banner (violet→indigo→cyan):
- 3 `NumberTicker` stats: "75%", "6sec", "3×"
- Labels below each number
- Subtle radial glow behind each number

#### 1.6 Testimonials Marquee
- Section label: "What job seekers are saying"
- **Row 1**: 6 cards scrolling left
- **Row 2**: 6 cards scrolling right (opposite direction)
- Each card: avatar initials (gradient bg), name, role, "Now at [Company]" badge (green), quote, 5 stars
- Cards: `glass-card` style, subtle violet shadow

#### 1.7 Pricing
- Monthly/yearly toggle (pill switcher)
- 3 cards: Free / Pro (highlighted with `AnimatedBorder`) / Teams
- Pro card: violet gradient border animation, "Most Popular" badge
- Feature lists with green checkmarks
- All prices animate in on toggle switch

#### 1.8 Final CTA
- `glass-card` full-width section
- Headline: "Ready to find out what's holding your resume back?"
- Subtext: "Free analysis. No credit card. Results in 30 seconds."
- `ShimmerButton`: "Start Free Analysis →"

#### 1.9 Footer
- Logo + tagline left
- Links: Privacy, Terms, Contact
- Copyright + "Made with ♥ for job seekers"

---

### 2. Auth Pages (`login/page.tsx`, `signup/page.tsx`)

**Split panel — reversed from current:**

**Left panel (60% width):**
- Clean white background
- Logo top-left
- Headline: "Welcome back" / "Start for free"
- Google OAuth button (bordered, with Google icon)
- "or continue with email" divider
- Email + password fields (Tailwind-styled, violet focus ring)
- Submit button: `ShimmerButton`
- Footer: "Don't have an account? Sign up"

**Right panel (40% width):**
- Animated mesh gradient background (violet→indigo→cyan)
- Floating glass card showing mock ATS score result
- 3 bullet points of value props with checkmark icons
- Testimonial quote at bottom with avatar

---

### 3. Dashboard (`app/(dashboard)/dashboard/page.tsx`)

#### 3.1 Sidebar (redesigned)
- Width: 64px collapsed (icons + tooltips) → 220px expanded on hover
- Top: Logo mark only (collapsed) / Full logo (expanded)
- Nav items: Dashboard, New Scan, History, Export, Billing, Settings
- Active: violet left border + violet icon + light violet bg
- Bottom: user avatar circle + email (expanded only) + sign out

#### 3.2 Main content

**Header row:**
- "Good morning, [Name]" (time-aware greeting)
- "+ New Scan" `ShimmerButton` right-aligned

**Stats row (3 cards):**
- Scans Used: donut chart (mini SVG) + "X of 3 used" / "Unlimited"
- Avg ATS Score: large number with color-coded trend arrow (↑ green / ↓ red)
- Best Score: sparkle icon + score number + job title it was for

**Score trend (if 2+ scans):**
- `MiniSparkline` line chart (Recharts, 200px tall)
- "Your ATS score over time" label
- Last 5 scans plotted

**Recent scans table:**
- Clean rows: job title | company (if provided) | date | score badge | arrow
- Score badge: color-coded pill (red <50, amber 50-70, green >70)
- Empty state: animated upload illustration + "No scans yet — analyse your first resume"

**Upgrade banner (free users only):**
- Gradient pill banner pinned below header
- "X free scans remaining → Upgrade to Pro"
- Dismissible

---

### 4. Upload Page (`app/(dashboard)/upload/page.tsx`)

**Step indicator:** 3-step horizontal: Upload → Job Description → Analyse

**Step 1 — Dropzone:**
- Large dashed border card with `AnimatedBorder` pulse on hover
- Upload icon + "Drag & drop your resume" + "PDF or DOCX, max 5MB"
- On file drop: file name appears with green checkmark + animated progress bar

**Step 2 — Job Description:**
- Auto-expanding textarea
- Character count ring (SVG circle, fills violet as user types)
- Validation: < 30 chars → amber warning / ≥ 30 → green checkmark

**Analyse button:**
- Full-width `ShimmerButton`, disabled until both fields valid
- Loading: animated step cards ("Parsing resume..." → "Running AI..." → "Almost done...")
- Progress bar: gradient fill, smooth animation

---

### 5. Results Page (`app/(dashboard)/results/[id]/page.tsx`)

**Top section:**
- Back button + "Analysis Results" title + Export button (sticky top bar)

**Score hero:**
- Large `ScoreGauge` (animated fill on mount, 0→score)
- 5 breakdown bars animating in sequence with 100ms stagger
- Color: red <50 / amber 50-70 / green >70

**Quick stats bento (4 cards):**
- Keywords Matched / Missing Keywords / Skills Gap / Suggestions Count
- Each with `NumberTicker` animation on mount

**Tabbed content (4 tabs):**
- **Keywords**: table with matched (green chip) / missing (red chip) keywords
- **Skills**: hard skills + soft skills breakdown with match %
- **Suggestions**: numbered list of AI recommendations, each expandable
- **Formatting**: list of ATS formatting issues with severity badges

**Export FAB:**
- Floating action button bottom-right: "Export Report ↓"
- Dropdown: PDF / DOCX

---

### 6. Billing Page (`app/(dashboard)/billing/page.tsx`)

**Current plan card:**
- Plan name with icon, scan usage, progress bar (free only)
- "Manage Billing" button → Stripe portal

**Upgrade section (free users):**
- Same `PricingSection` component reused with `mode="billing"`
- Highlighted Pro card with `AnimatedBorder`

---

## Implementation Order

1. **Utility components** (NumberTicker, MagicOrbs, DotGrid, MarqueeRow, BentoGrid, ShimmerButton, AnimatedBorder, MiniSparkline)
2. **globals.css** animation additions
3. **Landing page** (highest impact)
4. **Auth pages** (login + signup together)
5. **Dashboard** (sidebar + main)
6. **Upload page**
7. **Results page**
8. **Billing page**
9. **Commit + push**

---

## Packages Required
- `framer-motion` — already installed (check package.json)
- `recharts` — for MiniSparkline (install if missing)
- `clsx` + `tailwind-merge` — already installed via shadcn

## Non-Goals
- No dark mode changes (light mode only per user preference)
- No backend changes (all existing APIs unchanged)
- No new features — UI redesign only
- Stripe not touched
