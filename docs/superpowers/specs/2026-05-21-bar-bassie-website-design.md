# Bar Bassie — Website Design Spec

**Date:** 2026-05-21
**Status:** Draft for user review
**Repo:** https://github.com/jakesparrew/barbassie
**Replaces:** barbassie.be (current site)

---

## 1. Goal

Build a one-page scroll marketing site for **Bar Bassie**, the rooftop bar inside Ghent's Wintercircus (Lammerstraat 13, 9000 Gent). The site must:

- Render the brand exactly as defined in the 2024 stylesheet (logo, palette, type).
- Feature a chrome-blur **video hero** with the BASSIE wordmark and tagline.
- Show an entry **pop-up modal** that auto-opens once per visitor per day (and is reopenable from the nav).
- Present the drinks and food menus as **fold-open brochures** mirroring the physical printed pieces.
- Drive group reservations through **WhatsApp** for V1; integrate **supershift.work** in V2.
- Support **EN (default) / NL / FR** with a locale switcher.
- Ship from a clean Next.js codebase that can grow into a Supabase-backed CMS in V2 without re-architecting.

## 2. Brand system

### Colors (Tailwind tokens; CSS variables in `app/globals.css`)
| Token | Hex | Use |
|---|---|---|
| `bg` | `#F5F2EA` | Off white, default page background |
| `ink` | `#381215` | Deep burgundy, body text and headings |
| `accent` | `#E036B7` | Bright magenta, section labels, pills, links, focus rings |
| `moss` | `#819779` | Secondary accent, dividers, subtle blocks |

### Typography
Self-hosted via `next/font/local`. Original OTF/TTF files kept in `src/assets/fonts/`; converted to WOFF2 at install via `scripts/convert-fonts.mjs` (uses `fonttools`).

| Token | Family | Source file | Role |
|---|---|---|---|
| `font-title` | **Lioney Regular** | `Lioney-Regular.otf` | Titles / display |
| `font-subtitle` | **VTC Marsha Bold** | `VTCMarsha-Bold.otf` | All-caps subtitles / pull quotes |
| `font-body` | **Century Gothic Regular** | `CenturyGothic.ttf` | Body, navigation, footer |

Fallback chain (visible until WOFF2 loads): `system-ui, -apple-system, "Segoe UI", sans-serif`.

### Photography & motion
- Hero video: `Bassie_fragment5 CROP.mp4` (22 MB source), transcoded by `scripts/transcode-hero.mjs` into:
  - `/public/hero/hero-1080.mp4` + `hero-1080.webm`
  - `/public/hero/hero-720.mp4` + `hero-720.webm`
  - `/public/hero/hero-poster.jpg` (frame 0)
- `<video autoplay muted loop playsInline poster="/hero/hero-poster.jpg">` with `<source type="video/webm">` first, MP4 fallback.
- `prefers-reduced-motion: reduce` → render `hero-poster.jpg` only, no video element.
- Interior / rooftop / food photos: stored in `/public/photos/`, served via `next/image`.

## 3. Information architecture

Single page, single route per locale. Section anchors:

```
#hero        Hero with video bg + pills
#about       "Plunge in, move with it" pull quote + brand paragraph
#menu        Fold-open drinks + food brochures
#location    Wintercircus story + interior photo grid + address
#gallery     Atmosphere photo grid
#jobs        "Werken bij Bassie" openings list
#reserve     Walk-in policy + WhatsApp CTA (groups 6+)
#footer      Contact, hours, social, locale switcher
```

### Navigation
- **Hero in-place pills** (matches mockup): three magenta `<Pill>` buttons — `Menu` · `Reservatie` · `Happening` — that smooth-scroll to the corresponding anchor (or open the pop-up for `Happening`).
- **Sticky compact nav** fades in once the hero scrolls past. Logo on left, `<LocaleSwitcher>` + same 3 pills on right.
- Scroll behavior: `scroll-behavior: smooth` on `<html>`, with `scroll-margin-top` on section anchors equal to sticky nav height.

## 4. Sections

### 4.1 Hero
- Full-viewport (`100svh`) video background, dark vignette overlay (`linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)`) for text contrast.
- Centered: **BASSIE** wordmark in `font-title`, then `font-subtitle` tagline **"COOLING DRINKS · SMALL PLATES · STUNNING VIEWS"**.
- 3 magenta pills below.
- Bottom strip: opening hours in `font-subtitle` — `MON · WED · THU 16:00 → MIDNIGHT  ·  FRI · SAT 12:00 → 01:00  ·  CLOSED TUE · SUN`. Source of truth: `content/hours.json`.

### 4.2 Pop-up modal
See §6 for full behavior. Renders **as a child of the page root** via a portal (`<dialog>` element with focus trap) so it overlays everything including sticky nav.

### 4.3 About
- Pull quote in `font-subtitle`: **"PLUNGE IN, MOVE WITH IT — AND ENJOY LIFE'S CIRCUS"**.
- 2–3 sentences in `font-body` about the bar concept (placeholder copy in V1; final from owner).
- Locale-specific copy in `messages/{en,nl,fr}.json` under `about.headline` / `about.body`.

### 4.4 Menu (fold-open)
See §7 for full behavior. Two brochures side-by-side on desktop (`grid-cols-2`), stacked on mobile (`flex-col`):

| | Drinks | Food |
|---|---|---|
| Source | `public/menu/bar-bassie-drinks.pdf` | `public/menu/bar-bassie-food.pdf` |
| Fold type | 3-fold (rolvouw, 6 panels) | 2-fold (luik, 4 panels) |
| Cover artwork | Panel 1 of PDF | Panel 1 of PDF (magenta stripes) |
| Download | "Download menu (PDF)" button | "Download menu (PDF)" button |

### 4.5 Location
- Magenta section label `LOCATION`.
- Paragraph: "Bassie's location is just as unique. Set inside Ghent's iconic Wintercircus, all the way at the top, the bar's beautiful interior flows into a rooftop terrace with views over the city skyline — a front-row seat overlooking the central arena. Great drinks, sharp flavors, and views that steal the show."
- 4-up photo grid: interior, dome, rooftop view, exterior.
- Address block in `font-subtitle`: **LAMMERSTRAAT 13 · 9000 GHENT**. Link to Google Maps.

### 4.6 Gallery
- Magenta section label `GALLERY`.
- Masonry / 3-column grid of additional photos. Source: `/public/photos/gallery/*.jpg`.
- Lightbox on click (lazy-loaded chunk — `yet-another-react-lightbox` or similar; final library chosen at implementation time).

### 4.7 Jobs
- Magenta section label `JOBS` (or `VACATURES` / `EMPLOIS` per locale).
- Driven by `content/jobs.json`. Empty array → section hides entirely.
- Each opening: title, 2–3 line description, `mailto:` apply button with prefilled subject (`Bar Bassie — application: {title}`).

### 4.8 Reserveren
- Magenta section label `RESERVEREN`.
- Two-column block:
  - Left: short copy explaining the policy (walk-ins welcome for small groups, larger groups via WhatsApp).
  - Right: large WhatsApp button (icon + label) → `https://wa.me/32470487252?text=...` with prefilled message in the active locale.

### 4.9 Footer
- Three columns on desktop, stacked on mobile:
  1. **Contact** — email link (`hello@barbassie.be`), WhatsApp link, address.
  2. **Hours** — same data as hero hours strip, formatted as table.
  3. **Follow** — Instagram link (`@barbassie.wintercircus` → instagram.com/...), locale switcher.
- Bottom strip: © Bar Bassie · designed by [LOBSTER Antwerp].

## 5. Internationalization

### Library
`next-intl` v3 with App Router middleware.

### URL strategy (`as-needed`)
| URL | Locale |
|---|---|
| `/` | English (default — no prefix, best for SEO) |
| `/nl` | Dutch |
| `/fr` | French |

### Asset / build scripts (all manual, outputs committed)
| Script | Purpose | Runs when |
|---|---|---|
| `npm run convert-fonts` | OTF/TTF → WOFF2 in `public/fonts/` | Once when new font files arrive |
| `npm run transcode-hero` | Source MP4 → 2× MP4 + 2× WebM + poster JPG in `public/hero/` | Once when new hero video arrives |
| `npm run extract-panels` | Drinks + food PDFs → cropped panel JPGs in `public/menu/{drinks,food}/` | When menu PDFs change |

All three scripts run only on the developer's machine. Vercel just runs `next build`. Outputs are committed so the repo is self-contained.

### Files
- `messages/en.json` — primary source of truth for copy
- `messages/nl.json` — Dutch translations
- `messages/fr.json` — French translations

For V1, the implementer writes EN copy from brand voice, generates NL/FR drafts using a translation service, and the owner refines. Missing keys fall back to EN with a console warning (dev only).

### Locale switcher
- Lives in nav + footer.
- Writes `NEXT_LOCALE` cookie on click, navigates to the equivalent path in the new locale.
- Persists across pop-up state (i.e. dismissing the pop-up doesn't reset the locale).

### Structured content
Per-locale fields embedded directly in `content/*.json`:

```json
{
  "title": { "en": "…", "nl": "…", "fr": "…" }
}
```

This keeps content separate from UI copy and maps 1:1 to future Supabase columns.

## 6. Pop-up modal

### Data shape (`content/popup.json`)
```ts
type Popup = {
  active: boolean
  kind: "poster" | "card"
  image: string                                  // /popup/<slug>.jpg
  imageAlt: Record<"en"|"nl"|"fr", string>
  dateStart: string                              // ISO yyyy-mm-dd, inclusive
  dateEnd:   string                              // ISO yyyy-mm-dd, inclusive
  // structured fields, used only when kind === "card"
  title?:    Record<"en"|"nl"|"fr", string>
  subtitle?: Record<"en"|"nl"|"fr", string>
  detail?:   Record<"en"|"nl"|"fr", string>
}
```

### V1 content (Bassie Goes Mexico)
```json
{
  "active": true,
  "kind": "poster",
  "image": "/popup/bassie-goes-mexico.jpg",
  "imageAlt": {
    "en": "Bassie Goes Mexico — live mariachi band on Saturdays + custom menu, 11–31 May",
    "nl": "Bassie Goes Mexico — live mariachi-band op zaterdag + speciale kaart, 11–31 mei",
    "fr": "Bassie Goes Mexico — orchestre mariachi le samedi + carte spéciale, 11–31 mai"
  },
  "dateStart": "2026-05-11",
  "dateEnd":   "2026-05-31"
}
```

### Logic (`lib/popup.ts`)
- `isActiveNow(popup, now = new Date())` → `popup.active && now ∈ [dateStart, dateEnd]` (date-only comparison in Europe/Brussels TZ).
- `shouldAutoOpenToday(popupId)` → read `localStorage["barbassie:popup:lastSeenDate"]` and `localStorage["barbassie:popup:id"]`. Returns true if either is missing OR `lastSeenDate !== today` OR `id !== popupId`.
- `markSeen(popupId)` → write `lastSeenDate = today` and `id = popupId` on dismiss.
- Pop-up id = stable hash of `image + dateStart` so the dedupe key changes when the campaign changes.

### Behavior
- On mount of `<PopupGate>`, if `isActiveNow && shouldAutoOpenToday`, mount the `<PopupModal>` and call `markSeen` on dismiss.
- The "Happening" pill always force-opens (`forceOpen` prop) regardless of `shouldAutoOpenToday`.
- Dismiss triggers: Esc · backdrop click · close button (X, top-right) · **tap anywhere on the modal body** (per owner's "click and close" preference).
- Modal is a `<dialog>` element with `aria-modal="true"`, `aria-labelledby` pointing to the title (card mode) or `aria-label="Current event"` (poster mode). Focus trap inside on open; focus returns to last trigger on close.

### Render modes
- **`kind: "poster"`** — modal body is a single `<img>` with `object-fit: contain`, full-bleed inside a card with a max viewport-relative size (`max-w-[90vw] max-h-[85vh]`). Tap anywhere on the image closes (per "click and close").
- **`kind: "card"`** — structured: image at top (smaller), `title` in `font-title`, `subtitle` in `font-subtitle`, optional `detail` in `font-body`, date range badge.

## 7. Fold-open menu

### Goal
Make the on-page menu component evoke the physical print piece: tap the cover, watch it unfold to reveal the inside, tap again to refold.

### Tech
- CSS 3D: `perspective: 1200px` on container, `transform: rotateY(<deg>)` on each panel, `transform-origin` at the fold seam, `transform-style: preserve-3d` on parent.
- Choreography: Framer Motion sequences (`animate` with delays) — drinks unfolds in two beats (open the right flap, then the left), food unfolds in one beat.
- Backface visibility hidden on the back face of each panel.

### Panel extraction
**Manual / one-time script** — `npm run extract-panels`. Outputs are committed to the repo so Vercel builds need zero extra binaries. Re-run only when source PDFs change.
- Drinks PDF (1249 × 843 landscape, 2 pages):
  - Page 1 cropped into 3 equal vertical strips → `panel-1.jpg`, `panel-2.jpg`, `panel-3.jpg` (cover side)
  - Page 2 cropped into 3 equal vertical strips → `panel-4.jpg`, `panel-5.jpg`, `panel-6.jpg` (inside spread)
- Food PDF (910 × 910 square, 2 pages):
  - Page 1 → `panel-1.jpg` (cover, magenta stripes) and `panel-2.jpg` (back stripes)
  - Page 2 → `panel-3.jpg` (inside left, Bar Bites) and `panel-4.jpg` (inside right, Small Plates + Sweets)
- Output: `/public/menu/drinks/panel-N.jpg`, `/public/menu/food/panel-N.jpg` — checked into git.

### Mobile fallback (< 768px)
- No 3D rotation. Each menu is rendered as a vertical stack of its **inside panels** (drinks: panels 4–6, food: panels 3–4) so every block of text is full-width and legible.
- "Download menu (PDF)" button still present.
- `prefers-reduced-motion: reduce` triggers the same fallback on any viewport.

## 8. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Matches the team's existing flesjesfabriek setup; Vercel native; SSG/SSR flexibility for V2 |
| Language | **TypeScript strict** | Type safety; matches existing project |
| UI | **React 19** | Pulled in by Next.js 15 |
| Styling | **Tailwind CSS v4** + CSS variables | Token-driven design system, no runtime CSS-in-JS |
| Fonts | **`next/font/local`** | Self-hosted WOFF2 with zero CLS |
| i18n | **`next-intl` v3** | App Router native, message catalog model |
| Animation | **Framer Motion** | Menu fold choreography, modal enter/exit |
| Video | HTML5 `<video>` + ffmpeg transcoding script | No external CDN required |
| Package manager | **npm** | Mirrors flesjesfabriek convention; deterministic via `package-lock.json` |
| Lint | ESLint (Next.js + `@typescript-eslint`) | Standard |
| Format | Prettier (with `prettier-plugin-tailwindcss`) | Consistent formatting |
| CI | GitHub Actions: typecheck + lint on every PR | Cheap, catches regressions |
| Deploy | Vercel (preview per branch, prod on `main`) | Native Next.js host, analytics built-in |
| Analytics | Vercel Analytics | Free tier sufficient for V1 |

### Notable libraries
- `lucide-react` for iconography (WhatsApp icon, Instagram, close X, fold chevron, etc.)
- `yet-another-react-lightbox` (or similar — finalized at implementation time) for Gallery
- `clsx` + `tailwind-merge` for className composition

### Notable libraries deliberately NOT used in V1
- No CMS yet (V2 = Supabase)
- No email service yet (V2 = Resend)
- No analytics beyond Vercel's built-in
- No A/B testing
- No Sentry / error monitoring (Vercel logs sufficient for a marketing site)

## 9. Folder structure

```
barbassie/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                  # locale-aware root layout, fonts, metadata
│   │   └── page.tsx                    # composes all sections
│   ├── api/                            # empty in V1, V2 admin routes live here
│   └── globals.css                     # CSS variables, base styles, Tailwind
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Menu.tsx                    # composes <FoldBrochure> twice
│   │   ├── Location.tsx
│   │   ├── Gallery.tsx
│   │   ├── Jobs.tsx
│   │   ├── Reservation.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Pill.tsx
│   │   ├── Modal.tsx                   # <dialog> primitive with focus trap
│   │   ├── SectionLabel.tsx
│   │   ├── LocaleSwitcher.tsx
│   │   └── Icon.tsx                    # lucide-react wrapper
│   ├── FoldBrochure.tsx                # the 3D fold-open menu
│   ├── PopupGate.tsx                   # localStorage check, mount PopupModal
│   ├── PopupModal.tsx                  # renders poster vs card mode
│   └── StickyNav.tsx
├── content/
│   ├── popup.json
│   ├── jobs.json
│   ├── menu.json                       # signature drinks (optional, used in V1 if no panel mode)
│   └── hours.json
├── messages/
│   ├── en.json
│   ├── nl.json
│   └── fr.json
├── public/
│   ├── hero/                           # transcoded video + poster
│   ├── popup/                          # Bassie Goes Mexico + future
│   ├── menu/
│   │   ├── bar-bassie-drinks.pdf
│   │   ├── bar-bassie-food.pdf
│   │   ├── drinks/                     # extracted panels
│   │   └── food/                       # extracted panels
│   ├── photos/                         # interior, rooftop, gallery
│   ├── og/                             # social preview images per locale
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   └── assets/fonts/                   # original OTF/TTF (committed, not served)
├── lib/
│   ├── content.ts                      # typed JSON loaders
│   ├── popup.ts                        # isActiveNow, shouldAutoOpenToday, markSeen
│   ├── dates.ts                        # Europe/Brussels date helpers
│   └── i18n.ts                         # next-intl config
├── scripts/
│   ├── transcode-hero.mjs              # ffmpeg pass on hero MP4
│   ├── extract-menu-panels.mjs         # crop drinks + food PDFs into panels
│   └── convert-fonts.mjs               # OTF/TTF → WOFF2
├── docs/
│   ├── superpowers/specs/              # this spec
│   └── superpowers/plans/              # impl plan, added later
├── .github/workflows/ci.yml            # typecheck + lint
├── i18n.ts                             # next-intl bootstrap
├── middleware.ts                       # next-intl locale routing
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── .env.example                        # reserves SUPABASE_*, RESEND_* for V2
├── .gitignore
├── README.md
└── CLAUDE.md                           # project conventions for future Claude sessions
```

## 10. Data shapes (TypeScript)

```ts
// lib/content.ts
import type { Locale } from "@/lib/i18n"

type Localized<T> = Record<Locale, T>

export type Popup = {
  active: boolean
  kind: "poster" | "card"
  image: string
  imageAlt: Localized<string>
  dateStart: string                    // ISO yyyy-mm-dd
  dateEnd:   string                    // ISO yyyy-mm-dd
  title?:    Localized<string>
  subtitle?: Localized<string>
  detail?:   Localized<string>
}

export type Job = {
  id: string
  title:       Localized<string>
  description: Localized<string>
  applyEmail:  string
}

export type SignatureDrink = {
  id: string
  name: string                         // brand names stay as-is across locales
  description: Localized<string>
  price?: string                       // e.g. "€12"
  image?: string
}

export type Hours = {
  weekday: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
  open?: string                        // "16:00", omit if closed
  close?: string                       // "00:00" / "01:00"
}
```

## 11. Accessibility

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- Section labels are real `<h2>`s (visually styled, semantically headings).
- Color contrast: ink-on-bg = 13.4:1 (AAA); accent-on-bg = 4.7:1 (AA); white-on-accent = 4.6:1 (AA). Pill states verified manually.
- All interactive elements keyboard accessible. Focus rings visible (burgundy outline on magenta, white on burgundy).
- Hero video: `aria-label="Decorative background video of Bar Bassie"`; respects `prefers-reduced-motion`.
- Pop-up: `<dialog>` semantics, focus trap, returns focus to opener on close.
- Fold-open menu: keyboard accessible — Enter/Space on cover toggles fold; `aria-expanded` reflects state. Panels behind cover have `aria-hidden="true"` until unfolded.
- Lang attribute set per locale on `<html>`.
- Alt text on all photos, sourced from `messages/*.json`.

## 12. Performance budget

| Metric | Target | Notes |
|---|---|---|
| LCP (mobile, 4G) | < 2.5 s | Hero poster + Lioney font preloaded |
| CLS | < 0.1 | `next/image` with explicit dimensions; fonts preloaded |
| TBT | < 200 ms | Framer Motion code-split; lightbox lazy-loaded |
| Total JS (initial) | < 150 KB gz | next-intl + React + section hydration |
| Hero video | < 3 MB desktop, < 1 MB mobile | Per `<source>` `media` query |
| Fonts total | < 100 KB | Three families × WOFF2 + subset |

`scripts/transcode-hero.mjs` enforces video budget. CI fails if `next build` size exceeds budget (configurable threshold).

## 13. SEO basics

- `app/[locale]/layout.tsx` sets `<html lang={locale}>`, `<title>`, `<meta name="description">` per locale.
- OpenGraph + Twitter Card meta from `messages/*.json` (title, description, og:image).
- `app/sitemap.ts` emits 3 URLs (one per locale) with `hreflang` alternates.
- `public/robots.txt` allows everything.
- Structured data: `<script type="application/ld+json">` with `@type: BarOrClub` schema (address, opening hours, geo, telephone).

## 14. V1 ship scope (definition of done)

- [ ] Repo scaffolded at `C:\Users\gaeta\Documents\Claude\Projects\barbassie\`, pushed to `github.com/jakesparrew/barbassie`
- [ ] Vercel project linked, preview deploys per PR, prod deploy on `main`
- [ ] All sections render at desktop + mobile breakpoints
- [ ] EN/NL/FR locales load with copy in all 3 languages (placeholder where owner copy is missing)
- [ ] Self-hosted brand fonts loading without CLS
- [ ] Hero video plays autoplay-muted-loop on desktop and mobile, with poster fallback for reduced-motion
- [ ] Pop-up auto-opens once per day per visitor with Bassie Goes Mexico content; reopenable via "Happening" pill
- [ ] Drinks + food menus render fold-open on desktop, stacked spread on mobile
- [ ] Both menu PDFs downloadable
- [ ] WhatsApp reservation CTA links to `https://wa.me/32470487252` with prefilled message per locale
- [ ] Jobs section reads from `content/jobs.json` (empty array OK for V1)
- [ ] Footer links: email, WhatsApp, Instagram, address, hours, locale switcher
- [ ] Lighthouse scores: Perf > 85 mobile, A11y > 95, Best Practices > 95, SEO > 95
- [ ] Domain cutover `barbassie.be` → Vercel done as a final separate step

## 15. V2 roadmap (deferred)

| Feature | Notes |
|---|---|
| Supabase Postgres for popups / jobs / menu | Same JSON shape → table columns; zero re-architecture |
| Admin UI at `/admin` | Supabase Auth + RLS, simple forms |
| File uploads (popup posters, menu PDFs) | Supabase Storage bucket, signed URLs |
| Resend integration | Job applications → owner inbox; possible newsletter |
| supershift.work reservations | Replace WhatsApp CTA; embed or deep-link |
| Newsletter signup | Decide later; supershift may handle |
| Instagram embed | If owner wants live feed; Basic Display API |
| Plausible / Umami | If Vercel Analytics is insufficient |

## 16. Open questions / pending from user

1. **Pop-up source file path** — high-res JPG/PNG of "Bassie Goes Mexico" poster to drop into `/public/popup/bassie-goes-mexico.jpg`.
2. **Photos** — interior, rooftop, food, atmosphere. Zip is fine. V1 uses extracted-from-mockup placeholders where needed.
3. **Copy in EN** — owner-written paragraphs for About, Location, Reserveren, Jobs descriptions. V1 ships with brand-voice placeholder copy until provided.
4. **Font web licensing** — confirm licenses for Lioney, VTC Marsha Bold, Century Gothic cover web embedding. Assumed yes unless owner says otherwise.
5. **Domain cutover timing** — when to repoint `barbassie.be` DNS at Vercel. Separate task.

## 17. Deployment & repo workflow

- **Repo**: `github.com/jakesparrew/barbassie`, `main` branch is production.
- **Branches**: feature work on `feat/<topic>` or `fix/<topic>`, PR to `main`, Vercel preview deploy on every PR.
- **CI**: GitHub Actions `.github/workflows/ci.yml` runs `npm run typecheck` + `npm run lint` on every PR. Must pass before merge.
- **Local dev**: `npm install && npm run dev` → `http://localhost:3000`.
- **Env vars** (`.env.example`):
  ```env
  # V1 — no required env vars
  # V2 — reserved slots:
  # NEXT_PUBLIC_SUPABASE_URL=
  # NEXT_PUBLIC_SUPABASE_ANON_KEY=
  # SUPABASE_SERVICE_ROLE_KEY=
  # RESEND_API_KEY=
  # SUPERSHIFT_URL=
  ```
- **Vercel project**: link via `vercel link` in the local repo; production domain wired up via Vercel dashboard.
- **Domain**: barbassie.be DNS points to Vercel A/AAAA + CNAME records when ready to cut over from current host.

## 18. Out of scope (V1)

- No CMS, no admin panel
- No email sending
- No reservation API (WhatsApp link only)
- No user accounts
- No comments / reviews
- No e-commerce
- No newsletter signup
- No A/B testing
- No PWA / offline support
- No third-party analytics beyond Vercel built-in
