# Bar Bassie — Codebase Guide for Claude

## What this is
One-page scroll marketing site for Bar Bassie, a rooftop bar at the
Wintercircus in Ghent. Next.js 15 + TypeScript strict + Tailwind v4 +
next-intl (EN default, NL, FR).

## Where things live
- `app/[locale]/` — route segment per locale; `page.tsx` composes all sections
- `components/sections/` — one file per scroll section (Hero, About, Menu, ...)
- `components/ui/` — design primitives (Pill, Modal, SectionLabel, ...)
- `content/*.json` — page content (popup, jobs, hours, menu)
- `messages/*.json` — locale catalogs for next-intl
- `lib/` — typed loaders + business logic (popup, dates, i18n config)
- `scripts/` — one-time asset scripts; outputs committed to `public/`
- `public/menu/{drinks,food}/` — extracted brochure panels (do not edit by hand)
- `public/hero/` — transcoded hero video + poster
- `public/popup/` — pop-up artwork

## Conventions
- TypeScript strict + `noUncheckedIndexedAccess` — no `as any`, narrow with type guards
- One section per file; sections compose primitives from `components/ui/`
- Localized strings always come from next-intl `useTranslations()` or
  the per-locale fields inside `content/*.json`. Never hardcode user-facing copy.
- Tests next to the code: `Foo.tsx` + `Foo.test.tsx`
- Commits follow conventional commits (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`)

## Asset pipeline (manual, outputs committed)
- `npm run convert-fonts` — OTF/TTF → WOFF2
- `npm run transcode-hero` — source MP4 → multi-format hero
- `npm run extract-panels` — drinks + food PDFs → panel JPGs
- `npm run optimize-assets` — compress oversized images/PDFs under `public/`

These are dev-machine scripts only. Vercel runs `next build`, nothing else.

## Always compress new images & PDFs
Whenever images or PDFs are added to `public/` (uploaded by hand or introduced
in a task), they MUST be compressed before use — raw camera exports can be
20–40 MB each and tank page speed.

- Run `npm run optimize-assets`. It downsizes any raster image whose long edge
  exceeds ~2000px and re-encodes at web quality **in place** (same filename &
  format, so references never break), and downsamples large PDFs when
  Ghostscript is available. It's idempotent — safe to run every time.
- A Stop hook runs this automatically after each turn, but run it yourself too
  when you add assets so verification uses the compressed files.
- When it makes sense, also convert formats for extra savings — photos stored
  as PNG → JPEG, and posters/graphics loaded via a raw `<img>` (Events,
  PopupModal) → WebP — and update the reference in code/`content/*.json`. The
  auto-script never renames, so these format swaps are a manual step.
- Target sizes: gallery/background photos ≲400 KB, posters ≲300 KB.

## V2 roadmap (not in scope yet)
Supabase CMS, Resend email, supershift.work reservations. See the spec
for the full deferred list.

## Spec & plan
- Spec: `docs/superpowers/specs/2026-05-21-bar-bassie-website-design.md`
- Plan: `docs/superpowers/plans/2026-05-21-bar-bassie-website-v1.md`