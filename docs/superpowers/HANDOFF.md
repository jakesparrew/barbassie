# Bar Bassie — Handoff

**Last touched:** 2026-05-21
**Repo state:** V1 implementation complete on `main` (46 commits). Build green, 27 tests passing.
**Spec:** `docs/superpowers/specs/2026-05-21-bar-bassie-website-design.md`
**Plan:** `docs/superpowers/plans/2026-05-21-bar-bassie-website-v1.md`

---

## TL;DR for the next run

The site is fully built and pushed to [jakesparrew/barbassie](https://github.com/jakesparrew/barbassie). What remains is **assets the user owns + a 5-minute Vercel hookup**. No code work is blocking deployment.

Three concrete next steps, in priority:

1. **Connect Vercel** — vercel.com/new → import `jakesparrew/barbassie`, region `cdg1`, deploy. ~3 min.
2. **Install ffmpeg + transcode the hero video** — needed for the chrome-blur video hero. ~5 min total.
3. **Drop in the photography + pop-up poster** — see the asset checklist below.

After those three, V1 is shippable to barbassie.be.

---

## Quick-start when resuming

```bash
cd C:\Users\gaeta\Documents\Claude\Projects\barbassie
npm install            # if node_modules is missing
npm run dev            # http://localhost:3000
```

The dev server boots clean. Every route works: `/`, `/nl`, `/fr`, `/sitemap.xml`. The hero will show a black background (no video files yet) and image paths in Location/Gallery will 404 until you drop in photos.

---

## What's done (V1 ship scope)

- Next.js 15 App Router + TypeScript strict + Tailwind v4
- Self-hosted brand fonts as WOFF2 (Lioney / VTC Marsha Bold / Century Gothic)
- Brand tokens — Off White `#F5F2EA`, Deep Burgundy `#381215`, Bright Magenta `#E036B7`, Moss Green `#819779`
- `next-intl` with EN (default, no prefix) / NL / FR routing
- Sections: Hero, About, Menu, Location, Gallery, Jobs, Reservation, Footer
- Sticky nav appearing after hero scroll-past
- Pop-up modal with **Bassie Goes Mexico** content, auto-opens once/day per visitor, click-anywhere-to-close
- Fold-open drinks (3-fold rolvouw, 6 panels) + food (2-fold luik, 4 panels) brochures with Framer Motion choreography
- Mobile fallback: panels stack vertically below 768px or under reduced-motion
- WhatsApp reservation CTA: `https://wa.me/32470487252` with prefilled message per locale
- Locale switcher with `NEXT_LOCALE` cookie + path navigation
- SEO: per-locale metadata, hreflang alternates, sitemap.xml, robots.txt, JSON-LD `BarOrPub` schema
- 27 Vitest tests passing — covering `cn`, `dates`, `popup` logic, Pill, SectionLabel, Modal, LocaleSwitcher, StickyNav
- GitHub Actions CI on every PR

---

## What's pending

### 1. Hero video transcoding (Task 12 of the plan)
Source MP4 exists at `C:\Users\gaeta\Downloads\Bassie_fragment5 CROP.mp4`. ffmpeg is not on PATH.

```powershell
winget install Gyan.FFmpeg
# restart terminal
cd C:\Users\gaeta\Documents\Claude\Projects\barbassie
cp "C:\Users\gaeta\Downloads\Bassie_fragment5 CROP.mp4" assets/hero/source.mp4
npm run transcode-hero
git add public/hero/
git commit -m "assets: transcoded hero video (1080p MP4+WebM + poster)"
git push
```

Produces `public/hero/hero-1080.{webm,mp4}` and `hero-poster.jpg`. Outputs target < 3 MB MP4, ~70% of that for WebM.

### 2. Vercel project setup (Task 44 of the plan)
User-driven, browser-based:
- Visit [vercel.com/new](https://vercel.com/new)
- Import `jakesparrew/barbassie`
- Production branch: `main`
- Region: `cdg1` (Paris — closest to Ghent)
- No env vars needed for V1
- Production domain `barbassie.be` cutover is a separate step — see the spec §17

### 3. User-provided assets

Drop these into `public/` at the indicated paths. They're referenced by components and will 404 until present.

| Destination | Source | Used by |
|---|---|---|
| `public/popup/bassie-goes-mexico.jpg` | Mexican event poster (user has it locally) | Pop-up modal |
| `public/photos/wintercircus-dome.jpg` | Photo | Location section grid |
| `public/photos/wintercircus-interior.jpg` | Photo | Location section grid |
| `public/photos/wintercircus-rooftop.jpg` | Photo | Location section grid |
| `public/photos/wintercircus-exterior.jpg` | Photo | Location section grid |
| `public/photos/gallery-1.jpg` … `gallery-6.jpg` | 6 atmosphere photos | Gallery section |
| `public/og/cover.jpg` | 1200×630 social preview | OpenGraph metadata |

A zip is acceptable — extract + rename to the canonical filenames above + commit.

### 4. Copy refinement
The current copy in `messages/{en,nl,fr}.json` is brand-voice placeholders. Owner should review and polish each catalog, especially the About paragraph, Location paragraph, and Reservation policy text.

---

## V2 roadmap (deferred — not part of V1)

Documented fully in the spec §15. Summary:

- Supabase Postgres CMS for popup / jobs / menu (same JSON shape → table columns, no schema change)
- Admin UI at `/admin` with Supabase Auth + RLS + Storage uploads
- Resend integration for jobs apply notifications + future contact form
- **supershift.work** reservation flow replacing the WhatsApp CTA
- Optional: newsletter, Instagram embed, Plausible/Umami analytics

`.env.example` already reserves slots for the V2 env vars.

---

## Known small things to revisit

| Item | Severity | Notes |
|---|---|---|
| Hero `<img>` lint warning | Low | Reduced-motion fallback uses `<img>` intentionally; can silence with `eslint-disable-next-line` if you want green lint |
| `<PopupGate>` forwardRef deprecation in React 19 | Low | Migrate to ref-as-prop in a small follow-up; works today |
| First Load JS 177 KB (budget 150 KB) | Medium | Framer Motion is the heavy contributor. Lazy-load the fold animation if Lighthouse flags it |
| ESLint `next lint` deprecation | Resolved | Switched to `eslint .` with flat config + `typescript-eslint` |
| `lucide-react@1.x` dropped brand icons | Resolved | Whatsapp + Instagram are inline SVGs from simpleicons.org |
| Vitest CSS PostCSS conflict with Tailwind v4 | Resolved | `vitest.config.ts` sets `css.postcss.plugins: []` |

---

## Repo layout reference

```
barbassie/
├── app/[locale]/page.tsx          # single-page scroll composition (client)
├── app/[locale]/layout.tsx        # i18n + fonts + metadata + SchemaOrg (server)
├── app/sitemap.ts                 # 3 locale URLs
├── components/sections/           # one file per scroll section
├── components/ui/                 # Pill, SectionLabel, Modal, Icon, LocaleSwitcher
├── components/FoldBrochure.tsx    # the 3D fold-open menu primitive
├── components/PopupModal.tsx      # poster + card render modes
├── components/PopupGate.tsx       # auto-open gate + force-open ref
├── components/StickyNav.tsx       # scroll-triggered top nav
├── components/SchemaOrg.tsx       # JSON-LD BarOrPub
├── content/                       # popup.json · jobs.json · hours.json
├── messages/                      # en.json · nl.json · fr.json
├── lib/                           # cn · dates · popup · content · i18n
├── public/fonts/                  # WOFF2 brand fonts
├── public/menu/                   # PDFs + extracted panel JPGs
├── src/assets/fonts/              # original OTF/TTFs (for re-running convert-fonts)
├── scripts/                       # convert-fonts · transcode-hero · extract-panels
└── docs/superpowers/              # specs + plans + this handoff
```

---

## Asset pipeline scripts

All three are dev-machine-only — outputs are committed so Vercel never runs them.

| Command | Inputs | Outputs |
|---|---|---|
| `npm run convert-fonts` | `src/assets/fonts/*.otf,*.ttf` | `public/fonts/*.woff2` |
| `npm run transcode-hero` | `assets/hero/source.mp4` (gitignored) | `public/hero/hero-1080.{webm,mp4}` + `hero-poster.jpg` |
| `npm run extract-panels` | `public/menu/bar-bassie-{drinks,food}.pdf` | `public/menu/{drinks,food}/panel-*.jpg` |

Re-run only when the source asset changes.

---

## How a future Claude / engineer should resume

1. Read this file first
2. Read the spec at `docs/superpowers/specs/2026-05-21-bar-bassie-website-design.md` if you need design intent
3. Read the plan at `docs/superpowers/plans/2026-05-21-bar-bassie-website-v1.md` if you need task-level detail
4. Check `git log --oneline | head -20` to see most recent work
5. Run `npm install && npm run dev` to confirm the site still boots
6. Proceed with whichever pending item is highest priority for the owner

If picking up to start V2 (Supabase CMS): write a new spec at `docs/superpowers/specs/2026-XX-XX-bar-bassie-admin-v2.md`, then a new plan, then execute. Don't modify the V1 spec/plan — those are the historical record.
