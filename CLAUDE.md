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

These are dev-machine scripts only. Vercel runs `next build`, nothing else.

## V2 roadmap (not in scope yet)
Supabase CMS, Resend email, supershift.work reservations. See the spec
for the full deferred list.

## Spec & plan
- Spec: `docs/superpowers/specs/2026-05-21-bar-bassie-website-design.md`
- Plan: `docs/superpowers/plans/2026-05-21-bar-bassie-website-v1.md`