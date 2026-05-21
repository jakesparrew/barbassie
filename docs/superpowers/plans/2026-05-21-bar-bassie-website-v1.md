# Bar Bassie Website V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the V1 Bar Bassie marketing site — a one-page scroll site in EN/NL/FR with a chrome-blur video hero, daily-recurring pop-up modal, fold-open drinks + food brochures, and WhatsApp reservation flow.

**Architecture:** Next.js 15 App Router + TypeScript strict + Tailwind v4 + `next-intl` v3. Self-hosted brand fonts via `next/font/local`. Content lives in versioned JSON. Manual asset scripts (font conversion, video transcode, panel extraction) run once on the developer's machine and commit their outputs — Vercel builds are pure `next build`.

**Tech Stack:** Next.js 15.5 · React 19 · TypeScript 5 · Tailwind CSS 4 · next-intl 3 · Framer Motion 11 · Vitest 2 · @testing-library/react 16 · lucide-react · npm

**Spec:** `docs/superpowers/specs/2026-05-21-bar-bassie-website-design.md`

**Repo:** https://github.com/jakesparrew/barbassie

---

## Pre-flight: assets the user must drop in

Before Phase 0, the engineer needs these files placed at the indicated locations (the user has them in `C:\Users\gaeta\Downloads\`):

| Source file | Destination |
|---|---|
| `Lioney-Regular.otf` | `src/assets/fonts/Lioney-Regular.otf` |
| `VTCMarsha-Bold.otf` | `src/assets/fonts/VTCMarsha-Bold.otf` |
| `CenturyGothic.ttf` | `src/assets/fonts/CenturyGothic.ttf` |
| `Bassie_fragment5 CROP.mp4` | `assets/hero/source.mp4` (gitignored — too large) |
| `BarBassie_Drinks_US+-rolvouw_OUT.pdf` | `public/menu/bar-bassie-drinks.pdf` |
| `07012026_BarBassie_Food_2-luik_USplus.pdf` | `public/menu/bar-bassie-food.pdf` |
| Bassie Goes Mexico poster (TBD path) | `public/popup/bassie-goes-mexico.jpg` |

Tasks below assume the files at the destinations. If they are missing, the engineer should stop and ask the user.

---

## Phase 0 — Scaffolding

### Task 1: Initialize Next.js project

**Files:**
- Create: many (Next.js scaffold)

- [ ] **Step 1: Run create-next-app inside the empty repo**

The repo at `C:\Users\gaeta\Documents\Claude\Projects\barbassie\` is currently empty except for `docs/`. We need to run `create-next-app` in-place.

```bash
cd "C:\Users\gaeta\Documents\Claude\Projects\barbassie"
npx create-next-app@15.5.15 . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm --no-eslint --no-turbopack --yes
```

Expected output: scaffolds Next.js 15 with TypeScript, Tailwind, App Router, `@/*` alias. The `docs/` folder is preserved.

- [ ] **Step 2: Verify scaffold**

Run: `ls "C:\Users\gaeta\Documents\Claude\Projects\barbassie"`
Expected: `app/`, `public/`, `docs/`, `node_modules/`, `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts` (or v4 equivalent), `.gitignore`.

- [ ] **Step 3: Confirm dev server boots**

Run: `npm run dev` (kill with Ctrl+C after confirming).
Expected: `Local: http://localhost:3000`, no errors.

- [ ] **Step 4: Commit scaffold**

```bash
git add .
git commit -m "chore: scaffold Next.js 15 app router project"
```

---

### Task 2: Enable TypeScript strict mode

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Edit `tsconfig.json` to set strict mode**

Open `tsconfig.json` and ensure `compilerOptions` contains:

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true
}
```

Final `compilerOptions` should look like (preserving everything Next.js generated):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Add typecheck script**

In `package.json`, add to `scripts`:

```json
"typecheck": "tsc --noEmit"
```

- [ ] **Step 3: Run typecheck — verify clean**

Run: `npm run typecheck`
Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json package.json
git commit -m "chore: enable TypeScript strict + noUncheckedIndexedAccess"
```

---

### Task 3: Install runtime dependencies

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install runtime deps**

```bash
npm install next-intl@3 framer-motion@11 lucide-react@latest clsx tailwind-merge
```

- [ ] **Step 2: Verify**

Run: `npm ls next-intl framer-motion lucide-react clsx tailwind-merge`
Expected: each appears with a version.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add next-intl, framer-motion, lucide, clsx, tailwind-merge"
```

---

### Task 4: Install dev dependencies (testing + lint)

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install**

```bash
npm install -D vitest@2 @vitest/ui @testing-library/react@16 @testing-library/jest-dom @testing-library/user-event happy-dom eslint@9 eslint-config-next@15.5.15 prettier prettier-plugin-tailwindcss @types/node
```

- [ ] **Step 2: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "format": "prettier --write ."
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add vitest, RTL, eslint, prettier"
```

---

### Task 5: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
})
```

- [ ] **Step 2: Install missing vite-react plugin**

```bash
npm install -D @vitejs/plugin-react
```

- [ ] **Step 3: Write `vitest.setup.ts`**

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest"
```

- [ ] **Step 4: Verify vitest boots with no tests**

Run: `npm test`
Expected: "No test files found" — exits 0 OR 1 (acceptable, just no errors about config).

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json package-lock.json
git commit -m "chore(test): configure vitest with happy-dom + RTL"
```

---

### Task 6: Configure Prettier + ESLint

**Files:**
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Modify: `eslint.config.mjs` (or `.eslintrc.json` depending on what `create-next-app` produced)

- [ ] **Step 1: Write `.prettierrc.json`**

```json
{
  "semi": false,
  "singleQuote": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 2: Write `.prettierignore`**

```
node_modules
.next
public
*.lock
package-lock.json
docs/superpowers
```

- [ ] **Step 3: Initialize ESLint config if not present**

If `eslint.config.mjs` does not exist, run:

```bash
npx eslint --init --no-default-config 2>/dev/null || true
```

If create-next-app gave us `.eslintrc.json`, edit it to:

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

If we have flat config (`eslint.config.mjs`):

```js
import next from "eslint-config-next"
export default [...next()]
```

- [ ] **Step 4: Run format + lint**

```bash
npm run format
npm run lint
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add .prettierrc.json .prettierignore eslint.config.mjs .eslintrc.json package.json
git commit -m "chore: prettier + eslint config"
```

---

### Task 7: Add `.env.example`, `CLAUDE.md`, `README.md`

**Files:**
- Create: `.env.example`
- Create: `CLAUDE.md`
- Modify: `README.md`

- [ ] **Step 1: Write `.env.example`**

```env
# Bar Bassie — environment variables
#
# V1: no required env vars. The site is fully static.
#
# V2 reserved slots — uncomment & fill when implementing the admin / email features:
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
# RESEND_API_KEY=
# SUPERSHIFT_URL=
```

- [ ] **Step 2: Write `CLAUDE.md`**

```md
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
```

- [ ] **Step 3: Rewrite `README.md`**

```md
# Bar Bassie

The rooftop bar at the Wintercircus in Ghent. Source for [barbassie.be](https://barbassie.be).

## Stack
Next.js 15 · TypeScript strict · Tailwind CSS v4 · next-intl (EN / NL / FR) · Framer Motion · self-hosted brand fonts.

## Develop
```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts
| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run typecheck` | TypeScript compile check |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |
| `npm run format` | Prettier write |
| `npm run convert-fonts` | OTF/TTF → WOFF2 (manual) |
| `npm run transcode-hero` | Hero video transcode (manual, needs ffmpeg) |
| `npm run extract-panels` | Crop menu PDFs into panel JPGs (manual, needs python+pymupdf) |

## Deploy
Pushes to `main` deploy to Vercel production. PRs get preview deploys.

## Spec & plan
- [`docs/superpowers/specs/`](docs/superpowers/specs/) — design specs
- [`docs/superpowers/plans/`](docs/superpowers/plans/) — implementation plans
- [`CLAUDE.md`](CLAUDE.md) — codebase guide
```

- [ ] **Step 4: Commit**

```bash
git add .env.example CLAUDE.md README.md
git commit -m "docs: env example, CLAUDE.md, README"
```

---

### Task 8: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write CI workflow**

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: typecheck + lint + test + build on PR"
```

---

## Phase 1 — Brand assets

### Task 9: Font conversion script

**Files:**
- Create: `scripts/convert-fonts.mjs`
- Create: `src/assets/fonts/.gitkeep`
- Create: `public/fonts/.gitkeep`
- Modify: `package.json` (add `convert-fonts` script)

- [ ] **Step 1: Make folders for fonts**

```bash
mkdir -p src/assets/fonts public/fonts
touch src/assets/fonts/.gitkeep public/fonts/.gitkeep
```

- [ ] **Step 2: Write `scripts/convert-fonts.mjs`**

This uses the `wawoff2` npm package which is JS-only — no native deps.

```js
// scripts/convert-fonts.mjs
// Converts every .otf and .ttf in src/assets/fonts/ to WOFF2 in public/fonts/.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises"
import { join, basename, extname } from "node:path"
import wawoff2 from "wawoff2"

const SRC = "src/assets/fonts"
const OUT = "public/fonts"

const files = (await readdir(SRC)).filter((f) => /\.(otf|ttf)$/i.test(f))
if (files.length === 0) {
  console.error(`No .otf/.ttf files in ${SRC}. Drop the original brand fonts there and re-run.`)
  process.exit(1)
}

await mkdir(OUT, { recursive: true })

for (const file of files) {
  const inputPath = join(SRC, file)
  const buf = await readFile(inputPath)
  const woff2 = Buffer.from(await wawoff2.compress(buf))
  const outName = basename(file, extname(file)) + ".woff2"
  const outputPath = join(OUT, outName)
  await writeFile(outputPath, woff2)
  console.log(`${inputPath} -> ${outputPath} (${woff2.length} bytes)`)
}
console.log(`Converted ${files.length} font file(s).`)
```

- [ ] **Step 3: Install `wawoff2`**

```bash
npm install -D wawoff2
```

- [ ] **Step 4: Add npm script**

In `package.json` `scripts`:

```json
"convert-fonts": "node scripts/convert-fonts.mjs"
```

- [ ] **Step 5: Commit (script only, no fonts yet)**

```bash
git add scripts/convert-fonts.mjs src/assets/fonts/.gitkeep public/fonts/.gitkeep package.json package-lock.json
git commit -m "tools: font conversion script (OTF/TTF -> WOFF2)"
```

---

### Task 10: Run font conversion

**Files:**
- Add: `src/assets/fonts/Lioney-Regular.otf`, `VTCMarsha-Bold.otf`, `CenturyGothic.ttf`
- Add: `public/fonts/Lioney-Regular.woff2`, `VTCMarsha-Bold.woff2`, `CenturyGothic.woff2`

- [ ] **Step 1: Copy source fonts**

The user has them in `C:\Users\gaeta\Downloads\`. Copy:

```bash
cp "C:\Users\gaeta\Downloads\Lioney-Regular.otf" src/assets/fonts/
cp "C:\Users\gaeta\Downloads\VTCMarsha-Bold.otf" src/assets/fonts/
cp "C:\Users\gaeta\Downloads\CenturyGothic.ttf" src/assets/fonts/
```

- [ ] **Step 2: Run conversion**

```bash
npm run convert-fonts
```
Expected: three lines like `src/assets/fonts/Lioney-Regular.otf -> public/fonts/Lioney-Regular.woff2 (XXXX bytes)`.

- [ ] **Step 3: Verify outputs exist**

```bash
ls public/fonts/
```
Expected: `Lioney-Regular.woff2`, `VTCMarsha-Bold.woff2`, `CenturyGothic.woff2`.

- [ ] **Step 4: Commit fonts (originals + WOFF2)**

```bash
git add src/assets/fonts/*.otf src/assets/fonts/*.ttf public/fonts/*.woff2
git commit -m "assets: add brand fonts (Lioney, VTC Marsha Bold, Century Gothic)"
```

---

### Task 11: Hero video transcode script

**Files:**
- Create: `scripts/transcode-hero.mjs`
- Create: `assets/hero/.gitkeep`
- Modify: `.gitignore`
- Modify: `package.json`

- [ ] **Step 1: Create staging folder + gitignore source video**

```bash
mkdir -p assets/hero public/hero
touch assets/hero/.gitkeep
```

Append to `.gitignore`:
```
# raw assets — too large to commit
assets/hero/source.mp4
```

- [ ] **Step 2: Write `scripts/transcode-hero.mjs`**

```js
// scripts/transcode-hero.mjs
// Transcodes assets/hero/source.mp4 into delivery formats in public/hero/.
// Requires ffmpeg on PATH.
import { execSync } from "node:child_process"
import { existsSync } from "node:fs"

const SRC = "assets/hero/source.mp4"
const OUT = "public/hero"

if (!existsSync(SRC)) {
  console.error(`Missing ${SRC}. Drop the source MP4 there and re-run.`)
  process.exit(1)
}

try {
  execSync("ffmpeg -version", { stdio: "ignore" })
} catch {
  console.error("ffmpeg not found on PATH. Install ffmpeg first.")
  process.exit(1)
}

const passes = [
  // 1080p WebM (VP9) — smallest modern format, browser tries this first
  { out: `${OUT}/hero-1080.webm`, args: '-vf "scale=-2:1080" -c:v libvpx-vp9 -b:v 0 -crf 34 -an' },
  // 1080p MP4 (H.264) — fallback for Safari + older browsers, no audio
  { out: `${OUT}/hero-1080.mp4`,  args: '-vf "scale=-2:1080" -c:v libx264 -crf 26 -preset slow -an -movflags +faststart' },
  // Poster JPG (frame 1)
  { out: `${OUT}/hero-poster.jpg`, args: '-vf "select=eq(n\\,0),scale=-2:1080" -frames:v 1 -q:v 4' },
]

for (const p of passes) {
  console.log(`-> ${p.out}`)
  execSync(`ffmpeg -y -i "${SRC}" ${p.args} "${p.out}"`, { stdio: "inherit" })
}
console.log("Hero transcoding complete.")
```

- [ ] **Step 3: Add npm script**

In `package.json`:

```json
"transcode-hero": "node scripts/transcode-hero.mjs"
```

- [ ] **Step 4: Commit**

```bash
git add scripts/transcode-hero.mjs assets/hero/.gitkeep .gitignore package.json
git commit -m "tools: hero video transcode script (mp4 + webm + poster)"
```

---

### Task 12: Run hero transcoding

**Files:**
- Add: `assets/hero/source.mp4` (gitignored)
- Add: `public/hero/hero-1080.mp4`, `hero-720.mp4`, `hero-1080.webm`, `hero-720.webm`, `hero-poster.jpg`

- [ ] **Step 1: Copy the source video**

```bash
cp "C:\Users\gaeta\Downloads\Bassie_fragment5 CROP.mp4" assets/hero/source.mp4
```

- [ ] **Step 2: Verify ffmpeg is installed**

```bash
ffmpeg -version
```
If missing on Windows: install via `winget install Gyan.FFmpeg` or `choco install ffmpeg`.

- [ ] **Step 3: Run transcoding**

```bash
npm run transcode-hero
```
Expected: three output files in `public/hero/` — `hero-1080.webm`, `hero-1080.mp4`, `hero-poster.jpg`. MP4 target < 3 MB, WebM ~70% of that.

- [ ] **Step 4: Verify and commit**

```bash
ls -la public/hero/
git add public/hero/
git commit -m "assets: transcoded hero video (1080p MP4+WebM + poster)"
```

---

### Task 13: Menu PDFs in place + panel extraction script

**Files:**
- Add: `public/menu/bar-bassie-drinks.pdf`, `public/menu/bar-bassie-food.pdf`
- Create: `scripts/extract-menu-panels.mjs`
- Modify: `package.json`

- [ ] **Step 1: Copy PDFs into `public/menu/`**

```bash
mkdir -p public/menu/drinks public/menu/food
cp "C:\Users\gaeta\Downloads\BarBassie_Drinks_US+-rolvouw_OUT.pdf" public/menu/bar-bassie-drinks.pdf
cp "C:\Users\gaeta\Downloads\07012026_BarBassie_Food_2-luik_USplus.pdf" public/menu/bar-bassie-food.pdf
```

- [ ] **Step 2: Write `scripts/extract-menu-panels.mjs`**

This shells out to Python + PyMuPDF (already installed for the user — `import fitz` works locally).

```js
// scripts/extract-menu-panels.mjs
// Crops the drinks (3-fold, 2 pages) and food (2-fold, 2 pages) PDFs into panel JPGs.
// Requires Python 3 with `pymupdf`. No Pillow needed — uses pix.tobytes("jpeg") directly.
import { execSync } from "node:child_process"
import { writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const PY = `
import fitz, os
def crop(pdf_path, out_dir, layout):
    doc = fitz.open(pdf_path)
    os.makedirs(out_dir, exist_ok=True)
    counter = 1
    for page_index, panels in enumerate(layout):
        page = doc[page_index]
        w, h = page.rect.width, page.rect.height
        for px in range(panels):
            x0 = w * px / panels
            x1 = w * (px + 1) / panels
            clip = fitz.Rect(x0, 0, x1, h)
            pix = page.get_pixmap(clip=clip, dpi=200)
            data = pix.tobytes("jpeg", jpg_quality=88)
            out = os.path.join(out_dir, f"panel-{counter}.jpg")
            with open(out, "wb") as f:
                f.write(data)
            print(out, len(data), "bytes")
            counter += 1
    doc.close()

crop("public/menu/bar-bassie-drinks.pdf", "public/menu/drinks", [3, 3])
crop("public/menu/bar-bassie-food.pdf",   "public/menu/food",   [2, 2])
`

const scriptPath = join(tmpdir(), "extract-menu-panels.py")
writeFileSync(scriptPath, PY)
execSync(`python "${scriptPath}"`, { stdio: "inherit" })
```

- [ ] **Step 3: Add npm script**

```json
"extract-panels": "node scripts/extract-menu-panels.mjs"
```

- [ ] **Step 4: Commit script + PDFs**

```bash
git add public/menu/ scripts/extract-menu-panels.mjs package.json
git commit -m "tools: menu panel extraction script; add drinks + food PDFs"
```

---

### Task 14: Run panel extraction

**Files:**
- Add: `public/menu/drinks/panel-1.jpg` ... `panel-6.jpg`
- Add: `public/menu/food/panel-1.jpg` ... `panel-4.jpg`

- [ ] **Step 1: Run extraction**

```bash
npm run extract-panels
```
Expected: 6 drinks panels + 4 food panels printed, each ~50-300 KB JPEG.

- [ ] **Step 2: Eyeball the output**

```bash
ls -la public/menu/drinks public/menu/food
```
Expected sizes: each panel between 50 KB and 500 KB. If any are 0 bytes or > 2 MB, investigate.

- [ ] **Step 3: Commit panels**

```bash
git add public/menu/drinks/ public/menu/food/
git commit -m "assets: extracted menu panels (drinks 6, food 4)"
```

---

## Phase 2 — Design system & primitives

### Task 15: CSS variables and globals

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `app/globals.css` contents**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-bg: #F5F2EA;
  --color-ink: #381215;
  --color-accent: #E036B7;
  --color-moss: #819779;

  --font-title:    var(--font-lioney);
  --font-subtitle: var(--font-marsha);
  --font-body:     var(--font-gothic);
}

:root {
  --nav-h: 64px;
}

@media (min-width: 768px) {
  :root { --nav-h: 80px; }
}

html {
  scroll-behavior: smooth;
  background: var(--color-bg);
  color: var(--color-ink);
}

body {
  font-family: var(--font-body), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

section[id] {
  scroll-margin-top: calc(var(--nav-h) + 16px);
}

::selection {
  background: var(--color-accent);
  color: #fff;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat(theme): brand colour tokens + base styles"
```

---

### Task 16: cn() utility for classname composition

**Files:**
- Create: `lib/cn.ts`
- Create: `lib/cn.test.ts`

- [ ] **Step 1: Write test `lib/cn.test.ts`**

```ts
import { describe, it, expect } from "vitest"
import { cn } from "./cn"

describe("cn", () => {
  it("joins string classes", () => {
    expect(cn("a", "b")).toBe("a b")
  })
  it("filters falsy", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b")
  })
  it("merges conflicting tailwind classes (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })
})
```

- [ ] **Step 2: Run test — fails (no module)**

Run: `npm test -- lib/cn.test.ts`
Expected: FAIL — cannot find module `./cn`.

- [ ] **Step 3: Write `lib/cn.ts`**

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
```

- [ ] **Step 4: Re-run — passes**

Run: `npm test -- lib/cn.test.ts`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/cn.ts lib/cn.test.ts
git commit -m "feat(lib): cn() classname helper"
```

---

### Task 17: Pill component

**Files:**
- Create: `components/ui/Pill.tsx`
- Create: `components/ui/Pill.test.tsx`

- [ ] **Step 1: Write test `components/ui/Pill.test.tsx`**

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Pill } from "./Pill"

describe("Pill", () => {
  it("renders as <a> when href is provided", () => {
    render(<Pill href="#menu">Menu</Pill>)
    const el = screen.getByRole("link", { name: "Menu" })
    expect(el.tagName).toBe("A")
    expect(el).toHaveAttribute("href", "#menu")
  })

  it("renders as <button> when no href", () => {
    render(<Pill onClick={() => {}}>Happening</Pill>)
    const el = screen.getByRole("button", { name: "Happening" })
    expect(el.tagName).toBe("BUTTON")
  })

  it("applies the magenta accent class", () => {
    render(<Pill href="#x">X</Pill>)
    expect(screen.getByRole("link")).toHaveClass("bg-accent")
  })
})
```

- [ ] **Step 2: Run test — fails**

Run: `npm test -- components/ui/Pill.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write `components/ui/Pill.tsx`**

```tsx
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/cn"

type Common = {
  children: ReactNode
  className?: string
  variant?: "solid" | "outline"
}

type LinkPill = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; onClick?: never }
type ButtonPill = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type PillProps = LinkPill | ButtonPill

const base =
  "inline-flex items-center justify-center rounded-full px-5 py-2 font-subtitle uppercase tracking-wide text-sm transition-transform duration-150 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg"

const variants: Record<NonNullable<Common["variant"]>, string> = {
  solid:   "bg-accent text-white shadow-sm",
  outline: "border-2 border-accent text-accent",
}

export function Pill({ children, className, variant = "solid", ...rest }: PillProps) {
  const cls = cn(base, variants[variant], className)
  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Run tests — pass**

Run: `npm test -- components/ui/Pill.test.tsx`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add components/ui/Pill.tsx components/ui/Pill.test.tsx
git commit -m "feat(ui): Pill primitive (link/button + solid/outline variants)"
```

---

### Task 18: SectionLabel component

**Files:**
- Create: `components/ui/SectionLabel.tsx`
- Create: `components/ui/SectionLabel.test.tsx`

- [ ] **Step 1: Write test**

```tsx
// components/ui/SectionLabel.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SectionLabel } from "./SectionLabel"

describe("SectionLabel", () => {
  it("renders as an h2 with accent color", () => {
    render(<SectionLabel>MENU</SectionLabel>)
    const h2 = screen.getByRole("heading", { level: 2, name: "MENU" })
    expect(h2).toHaveClass("text-accent")
  })
})
```

- [ ] **Step 2: Run — fails**

`npm test -- components/ui/SectionLabel.test.tsx`

- [ ] **Step 3: Implement**

```tsx
// components/ui/SectionLabel.tsx
import { type ReactNode } from "react"
import { cn } from "@/lib/cn"

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "font-subtitle uppercase tracking-wide text-accent text-3xl md:text-4xl",
        className
      )}
    >
      {children}
    </h2>
  )
}
```

- [ ] **Step 4: Pass + commit**

```bash
npm test -- components/ui/SectionLabel.test.tsx
git add components/ui/SectionLabel.tsx components/ui/SectionLabel.test.tsx
git commit -m "feat(ui): SectionLabel (magenta h2)"
```

---

### Task 19: Modal primitive

**Files:**
- Create: `components/ui/Modal.tsx`
- Create: `components/ui/Modal.test.tsx`

- [ ] **Step 1: Write test**

```tsx
// components/ui/Modal.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Modal } from "./Modal"

describe("Modal", () => {
  it("does not render when open=false", () => {
    render(<Modal open={false} onClose={() => {}}>hi</Modal>)
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("renders content when open", () => {
    render(<Modal open onClose={() => {}}>hi</Modal>)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("hi")).toBeInTheDocument()
  })

  it("calls onClose when Escape pressed", () => {
    const onClose = vi.fn()
    render(<Modal open onClose={onClose}>hi</Modal>)
    fireEvent.keyDown(document, { key: "Escape" })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it("calls onClose when backdrop clicked", () => {
    const onClose = vi.fn()
    render(<Modal open onClose={onClose}>hi</Modal>)
    fireEvent.click(screen.getByTestId("modal-backdrop"))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it("does not call onClose when content is clicked", () => {
    const onClose = vi.fn()
    render(<Modal open onClose={onClose}>hi</Modal>)
    fireEvent.click(screen.getByText("hi"))
    expect(onClose).not.toHaveBeenCalled()
  })

  it("calls onClose on click when closeOnContentClick=true", () => {
    const onClose = vi.fn()
    render(<Modal open onClose={onClose} closeOnContentClick>hi</Modal>)
    fireEvent.click(screen.getByText("hi"))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run — fails**

`npm test -- components/ui/Modal.test.tsx`

- [ ] **Step 3: Implement**

```tsx
// components/ui/Modal.tsx
"use client"
import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/cn"

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  ariaLabel?: string
  closeOnContentClick?: boolean
  className?: string
}

export function Modal({
  open,
  onClose,
  children,
  ariaLabel = "Dialog",
  closeOnContentClick = false,
  className,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        data-testid="modal-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div
        ref={contentRef}
        onClick={closeOnContentClick ? onClose : undefined}
        className={cn("relative max-w-[90vw] max-h-[90vh]", className)}
      >
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Pass + commit**

```bash
npm test -- components/ui/Modal.test.tsx
git add components/ui/Modal.tsx components/ui/Modal.test.tsx
git commit -m "feat(ui): Modal primitive (esc + backdrop + optional click-through)"
```

---

### Task 20: Icon wrapper

**Files:**
- Create: `components/ui/Icon.tsx`

- [ ] **Step 1: Write**

```tsx
// components/ui/Icon.tsx
import * as L from "lucide-react"
import { type LucideProps } from "lucide-react"

export const Icon = {
  Whatsapp: (p: LucideProps) => <L.MessageCircle {...p} />,
  Instagram: (p: LucideProps) => <L.Instagram {...p} />,
  MapPin: (p: LucideProps) => <L.MapPin {...p} />,
  X: (p: LucideProps) => <L.X {...p} />,
  ChevronDown: (p: LucideProps) => <L.ChevronDown {...p} />,
  Mail: (p: LucideProps) => <L.Mail {...p} />,
  Clock: (p: LucideProps) => <L.Clock {...p} />,
  Globe: (p: LucideProps) => <L.Globe {...p} />,
} as const
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/Icon.tsx
git commit -m "feat(ui): Icon wrapper around lucide-react"
```

---

## Phase 3 — Internationalization plumbing

### Task 21: Configure next-intl

**Files:**
- Create: `i18n.ts`
- Create: `middleware.ts`
- Create: `lib/i18n.ts`
- Create: `messages/en.json`, `messages/nl.json`, `messages/fr.json`
- Modify: `next.config.ts`

- [ ] **Step 1: Write `lib/i18n.ts`**

```ts
// lib/i18n.ts
export const locales = ["en", "nl", "fr"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
  fr: "Français",
}

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v)
```

- [ ] **Step 2: Write `i18n.ts` (next-intl request config)**

```ts
// i18n.ts
import { getRequestConfig } from "next-intl/server"
import { notFound } from "next/navigation"
import { isLocale, defaultLocale } from "./lib/i18n"

export default getRequestConfig(async ({ locale }) => {
  const resolved = locale ?? defaultLocale
  if (!isLocale(resolved)) notFound()
  return {
    locale: resolved,
    messages: (await import(`./messages/${resolved}.json`)).default,
  }
})
```

- [ ] **Step 3: Write `middleware.ts`**

```ts
// middleware.ts
import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./lib/i18n"

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
})

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
```

- [ ] **Step 4: Update `next.config.ts`**

```ts
// next.config.ts
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n.ts")

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

export default withNextIntl(nextConfig)
```

- [ ] **Step 5: Write initial messages JSON**

```json
// messages/en.json
{
  "nav": {
    "menu": "Menu",
    "reservation": "Reservation",
    "happening": "Happening"
  },
  "hero": {
    "tagline": "Cooling drinks · Small plates · Stunning views"
  },
  "hours": {
    "weekdays": "Mon · Wed · Thu  16:00 — Midnight",
    "weekends": "Fri · Sat  12:00 — 01:00",
    "closed": "Closed Tue · Sun"
  },
  "about": {
    "pullQuote": "Plunge in, move with it — and enjoy life's circus.",
    "body": "Bar Bassie is the rooftop bar perched at the very top of Ghent's Wintercircus. Cooling drinks, sharable small plates, and a front-row seat overlooking the central arena."
  },
  "menu": {
    "label": "Menu",
    "drinks": "Drinks",
    "food": "Food",
    "download": "Download menu (PDF)",
    "tapToOpen": "Tap to open"
  },
  "location": {
    "label": "Location",
    "body": "Set inside Ghent's iconic Wintercircus, all the way at the top, the bar's interior flows into a rooftop terrace with sweeping views over the city skyline — a front-row seat overlooking the central arena.",
    "addressLine1": "Lammerstraat 13",
    "addressLine2": "9000 Ghent",
    "directions": "Get directions"
  },
  "gallery": {
    "label": "Gallery"
  },
  "jobs": {
    "label": "Jobs",
    "noOpenings": "No current openings. Send us a hello anyway.",
    "apply": "Apply"
  },
  "reserve": {
    "label": "Reserve",
    "walkIns": "Walk-ins always welcome for small groups.",
    "groups": "For groups of 6 or more, message us on WhatsApp and we'll set you up.",
    "whatsappCta": "Message us on WhatsApp",
    "whatsappPrefill": "Hi Bassie! We'd love to reserve a table — "
  },
  "footer": {
    "contact": "Contact",
    "hours": "Hours",
    "follow": "Follow",
    "designed": "Designed by LOBSTER Antwerp"
  },
  "popup": {
    "close": "Close",
    "happening": "Happening"
  }
}
```

```json
// messages/nl.json — initial Dutch, refine with native speaker later
{
  "nav": { "menu": "Menu", "reservation": "Reservatie", "happening": "Wat is er" },
  "hero": { "tagline": "Frisse drinks · Kleine gerechten · Schitterend uitzicht" },
  "hours": {
    "weekdays": "Ma · Wo · Do  16:00 — Middernacht",
    "weekends": "Vr · Za  12:00 — 01:00",
    "closed": "Gesloten op di · zo"
  },
  "about": {
    "pullQuote": "Duik erin, beweeg mee — en geniet van het circus van het leven.",
    "body": "Bar Bassie is de rooftop bar op de top van het Wintercircus in Gent. Frisse drinks, deelbare hapjes en een vooraan-plaats boven de centrale arena."
  },
  "menu": {
    "label": "Menu",
    "drinks": "Drank",
    "food": "Eten",
    "download": "Download menu (PDF)",
    "tapToOpen": "Tik om te openen"
  },
  "location": {
    "label": "Locatie",
    "body": "Binnenin het iconische Wintercircus van Gent, helemaal bovenaan. Het interieur loopt over in een rooftop-terras met weids zicht over de stad — een vooraan-plek boven de centrale arena.",
    "addressLine1": "Lammerstraat 13",
    "addressLine2": "9000 Gent",
    "directions": "Routebeschrijving"
  },
  "gallery": { "label": "Galerij" },
  "jobs": {
    "label": "Jobs",
    "noOpenings": "Geen openstaande vacatures op dit moment. Stuur ons toch een berichtje.",
    "apply": "Solliciteer"
  },
  "reserve": {
    "label": "Reserveren",
    "walkIns": "Walk-ins altijd welkom voor kleine groepen.",
    "groups": "Voor groepen vanaf 6 personen: stuur ons een WhatsApp en we regelen het.",
    "whatsappCta": "Stuur ons een WhatsApp",
    "whatsappPrefill": "Hoi Bassie! We willen graag een tafel reserveren — "
  },
  "footer": {
    "contact": "Contact",
    "hours": "Openingsuren",
    "follow": "Volg ons",
    "designed": "Ontworpen door LOBSTER Antwerpen"
  },
  "popup": { "close": "Sluiten", "happening": "Wat is er" }
}
```

```json
// messages/fr.json — initial French, refine later
{
  "nav": { "menu": "Menu", "reservation": "Réservation", "happening": "Évènement" },
  "hero": { "tagline": "Boissons fraîches · Petites assiettes · Vue imprenable" },
  "hours": {
    "weekdays": "Lun · Mer · Jeu  16h — Minuit",
    "weekends": "Ven · Sam  12h — 1h",
    "closed": "Fermé mar · dim"
  },
  "about": {
    "pullQuote": "Plonge, suis le mouvement — et profite du cirque de la vie.",
    "body": "Bar Bassie est le rooftop bar tout en haut du Wintercircus de Gand. Boissons fraîches, assiettes à partager et une vue plongeante sur l'arène centrale."
  },
  "menu": {
    "label": "Menu",
    "drinks": "Boissons",
    "food": "À manger",
    "download": "Télécharger le menu (PDF)",
    "tapToOpen": "Touchez pour ouvrir"
  },
  "location": {
    "label": "Localisation",
    "body": "À l'intérieur du Wintercircus emblématique de Gand, tout en haut. L'intérieur s'ouvre sur une terrasse en rooftop avec vue sur la ville — une place de choix au-dessus de l'arène centrale.",
    "addressLine1": "Lammerstraat 13",
    "addressLine2": "9000 Gand",
    "directions": "Itinéraire"
  },
  "gallery": { "label": "Galerie" },
  "jobs": {
    "label": "Emplois",
    "noOpenings": "Aucun poste ouvert pour le moment. Écris-nous quand même.",
    "apply": "Postuler"
  },
  "reserve": {
    "label": "Réserver",
    "walkIns": "Walk-ins toujours les bienvenus pour les petits groupes.",
    "groups": "Pour les groupes de 6 personnes ou plus, écris-nous sur WhatsApp.",
    "whatsappCta": "Écris-nous sur WhatsApp",
    "whatsappPrefill": "Salut Bassie ! On aimerait réserver une table — "
  },
  "footer": {
    "contact": "Contact",
    "hours": "Horaires",
    "follow": "Suis-nous",
    "designed": "Conçu par LOBSTER Anvers"
  },
  "popup": { "close": "Fermer", "happening": "Évènement" }
}
```

- [ ] **Step 6: Typecheck**

```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add i18n.ts middleware.ts lib/i18n.ts messages/ next.config.ts
git commit -m "feat(i18n): wire next-intl + EN/NL/FR message catalogs"
```

---

### Task 22: Move root layout under [locale]

**Files:**
- Move: `app/layout.tsx` → `app/[locale]/layout.tsx`
- Move: `app/page.tsx` → `app/[locale]/page.tsx`
- Modify: both to use next-intl provider and `next/font/local`
- Delete: `app/layout.tsx`, `app/page.tsx` (old)

- [ ] **Step 1: Create `[locale]` folder + move**

```bash
mkdir -p "app/[locale]"
mv app/layout.tsx "app/[locale]/layout.tsx"
mv app/page.tsx "app/[locale]/page.tsx"
```

- [ ] **Step 2: Rewrite `app/[locale]/layout.tsx`**

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import localFont from "next/font/local"
import { type Locale, isLocale, locales } from "@/lib/i18n"
import "../globals.css"

const lioney = localFont({
  src: "../../public/fonts/Lioney-Regular.woff2",
  display: "swap",
  variable: "--font-lioney",
})
const marsha = localFont({
  src: "../../public/fonts/VTCMarsha-Bold.woff2",
  display: "swap",
  variable: "--font-marsha",
})
const gothic = localFont({
  src: "../../public/fonts/CenturyGothic.woff2",
  display: "swap",
  variable: "--font-gothic",
})

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${lioney.variable} ${marsha.variable} ${gothic.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Rewrite `app/[locale]/page.tsx` (temporary stub)**

```tsx
// app/[locale]/page.tsx
import { getTranslations } from "next-intl/server"

export default async function Home() {
  const t = await getTranslations()
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-title text-6xl">{t("hero.tagline")}</h1>
    </main>
  )
}
```

- [ ] **Step 4: Run dev server + manual smoke**

```bash
npm run dev
```
Open in browser:
- `http://localhost:3000/` → English tagline
- `http://localhost:3000/nl` → Dutch tagline
- `http://localhost:3000/fr` → French tagline

Kill with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat(i18n): move app under [locale] + wire next/font/local"
```

---

### Task 23: Locale switcher

**Files:**
- Create: `components/ui/LocaleSwitcher.tsx`
- Create: `components/ui/LocaleSwitcher.test.tsx`

- [ ] **Step 1: Write test**

```tsx
// components/ui/LocaleSwitcher.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const push = vi.fn()
vi.mock("next/navigation", () => ({
  usePathname: () => "/about",
  useRouter: () => ({ push, replace: push, refresh: vi.fn() }),
}))
vi.mock("next-intl", () => ({
  useLocale: () => "en",
}))

import { LocaleSwitcher } from "./LocaleSwitcher"

describe("LocaleSwitcher", () => {
  beforeEach(() => push.mockReset())

  it("renders all locales", () => {
    render(<LocaleSwitcher />)
    expect(screen.getByRole("button", { name: /english/i })).toBeInTheDocument()
  })

  it("navigates to /nl when Dutch picked", async () => {
    const user = userEvent.setup()
    render(<LocaleSwitcher />)
    await user.click(screen.getByRole("button", { name: /english/i }))
    await user.click(screen.getByRole("menuitem", { name: /nederlands/i }))
    expect(push).toHaveBeenCalledWith("/nl/about")
  })
})
```

- [ ] **Step 2: Run — fails**

- [ ] **Step 3: Implement `components/ui/LocaleSwitcher.tsx`**

```tsx
// components/ui/LocaleSwitcher.tsx
"use client"
import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useState, useRef, useEffect } from "react"
import { locales, localeNames, type Locale, isLocale, defaultLocale } from "@/lib/i18n"
import { cn } from "@/lib/cn"
import { Icon } from "./Icon"

const stripLocale = (pathname: string): string => {
  const [, maybeLocale, ...rest] = pathname.split("/")
  if (maybeLocale && isLocale(maybeLocale)) return "/" + rest.join("/")
  return pathname
}

const buildPath = (target: Locale, bare: string): string => {
  const path = bare === "/" ? "" : bare
  return target === defaultLocale ? path || "/" : `/${target}${path}`
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const current = useLocale() as Locale
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  const onPick = (loc: Locale) => {
    document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000; samesite=lax`
    const bare = stripLocale(pathname)
    router.push(buildPath(loc, bare))
    setOpen(false)
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 font-subtitle uppercase text-sm tracking-wide"
      >
        <Icon.Globe className="w-4 h-4" aria-hidden />
        {localeNames[current]}
        <Icon.ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 mt-2 min-w-[10rem] rounded-md bg-bg shadow-lg ring-1 ring-ink/10 p-1 z-50"
        >
          {locales.map((loc) => (
            <li key={loc}>
              <button
                role="menuitem"
                onClick={() => onPick(loc)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded font-body text-sm",
                  loc === current ? "bg-accent/10 text-accent" : "hover:bg-ink/5"
                )}
              >
                {localeNames[loc]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Pass + commit**

```bash
npm test -- components/ui/LocaleSwitcher.test.tsx
git add components/ui/LocaleSwitcher.tsx components/ui/LocaleSwitcher.test.tsx
git commit -m "feat(ui): LocaleSwitcher with cookie + navigation"
```

---

## Phase 4 — Content & date logic

### Task 24: Date helpers (Europe/Brussels)

**Files:**
- Create: `lib/dates.ts`
- Create: `lib/dates.test.ts`

- [ ] **Step 1: Write tests**

```ts
// lib/dates.test.ts
import { describe, it, expect } from "vitest"
import { todayBrussels, isWithinRange, toIsoDate } from "./dates"

describe("dates", () => {
  it("todayBrussels returns YYYY-MM-DD string", () => {
    const d = todayBrussels()
    expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it("toIsoDate formats a Date in Europe/Brussels", () => {
    // 2026-05-21T22:00Z is already 2026-05-22 in Brussels (UTC+2)
    expect(toIsoDate(new Date("2026-05-21T22:00:00Z"))).toBe("2026-05-22")
  })

  it("isWithinRange — start <= d <= end", () => {
    expect(isWithinRange("2026-05-15", "2026-05-11", "2026-05-31")).toBe(true)
    expect(isWithinRange("2026-05-11", "2026-05-11", "2026-05-31")).toBe(true)  // start inclusive
    expect(isWithinRange("2026-05-31", "2026-05-11", "2026-05-31")).toBe(true)  // end inclusive
    expect(isWithinRange("2026-06-01", "2026-05-11", "2026-05-31")).toBe(false)
    expect(isWithinRange("2026-05-10", "2026-05-11", "2026-05-31")).toBe(false)
  })
})
```

- [ ] **Step 2: Run — fails**

- [ ] **Step 3: Implement**

```ts
// lib/dates.ts
const TZ = "Europe/Brussels"

export const toIsoDate = (d: Date): string => {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  })
  return fmt.format(d) // "YYYY-MM-DD"
}

export const todayBrussels = (): string => toIsoDate(new Date())

export const isWithinRange = (
  date: string, // ISO yyyy-mm-dd
  start: string,
  end: string
): boolean => date >= start && date <= end
```

- [ ] **Step 4: Pass + commit**

```bash
npm test -- lib/dates.test.ts
git add lib/dates.ts lib/dates.test.ts
git commit -m "feat(lib): TZ-safe date helpers for Europe/Brussels"
```

---

### Task 25: Popup logic

**Files:**
- Create: `lib/popup.ts`
- Create: `lib/popup.test.ts`

- [ ] **Step 1: Write tests**

```ts
// lib/popup.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  isPopupActiveNow, shouldAutoOpenToday, markSeen, popupId, type Popup,
} from "./popup"

const sample: Popup = {
  active: true,
  kind: "poster",
  image: "/popup/bassie-goes-mexico.jpg",
  imageAlt: { en: "x", nl: "x", fr: "x" },
  dateStart: "2026-05-11",
  dateEnd:   "2026-05-31",
}

describe("popupId", () => {
  it("derives a stable id from image + dateStart", () => {
    expect(popupId(sample)).toBe(popupId({ ...sample }))
    expect(popupId(sample)).not.toBe(popupId({ ...sample, dateStart: "2026-06-01" }))
  })
})

describe("isPopupActiveNow", () => {
  it("returns false if active=false", () => {
    expect(isPopupActiveNow({ ...sample, active: false }, "2026-05-15")).toBe(false)
  })
  it("returns true inside the range", () => {
    expect(isPopupActiveNow(sample, "2026-05-15")).toBe(true)
  })
  it("returns false outside the range", () => {
    expect(isPopupActiveNow(sample, "2026-06-01")).toBe(false)
  })
})

describe("shouldAutoOpenToday + markSeen", () => {
  beforeEach(() => localStorage.clear())

  it("opens on first visit", () => {
    expect(shouldAutoOpenToday("abc", "2026-05-15")).toBe(true)
  })
  it("does not open after markSeen with same id same day", () => {
    markSeen("abc", "2026-05-15")
    expect(shouldAutoOpenToday("abc", "2026-05-15")).toBe(false)
  })
  it("opens again next day", () => {
    markSeen("abc", "2026-05-15")
    expect(shouldAutoOpenToday("abc", "2026-05-16")).toBe(true)
  })
  it("opens again when popup id changes", () => {
    markSeen("abc", "2026-05-15")
    expect(shouldAutoOpenToday("xyz", "2026-05-15")).toBe(true)
  })
})
```

- [ ] **Step 2: Run — fails**

- [ ] **Step 3: Implement**

```ts
// lib/popup.ts
import { isWithinRange } from "./dates"

type LocalizedString = { en: string; nl: string; fr: string }

export type Popup = {
  active: boolean
  kind: "poster" | "card"
  image: string
  imageAlt: LocalizedString
  dateStart: string
  dateEnd: string
  title?: LocalizedString
  subtitle?: LocalizedString
  detail?: LocalizedString
}

const KEY_DATE = "barbassie:popup:lastSeenDate"
const KEY_ID   = "barbassie:popup:id"

/** Stable identifier so a swapped pop-up re-shows. */
export const popupId = (p: Popup): string => {
  const raw = `${p.image}|${p.dateStart}|${p.dateEnd}`
  let h = 5381
  for (let i = 0; i < raw.length; i++) h = ((h << 5) + h) ^ raw.charCodeAt(i)
  return (h >>> 0).toString(36)
}

export const isPopupActiveNow = (p: Popup, todayIso: string): boolean =>
  p.active && isWithinRange(todayIso, p.dateStart, p.dateEnd)

export const shouldAutoOpenToday = (id: string, todayIso: string): boolean => {
  if (typeof window === "undefined") return false
  const seenDate = localStorage.getItem(KEY_DATE)
  const seenId   = localStorage.getItem(KEY_ID)
  return seenDate !== todayIso || seenId !== id
}

export const markSeen = (id: string, todayIso: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY_DATE, todayIso)
  localStorage.setItem(KEY_ID, id)
}
```

- [ ] **Step 4: Pass + commit**

```bash
npm test -- lib/popup.test.ts
git add lib/popup.ts lib/popup.test.ts
git commit -m "feat(lib): popup active/auto-open logic with localStorage gate"
```

---

### Task 26: Content loaders + content JSON

**Files:**
- Create: `lib/content.ts`
- Create: `content/popup.json`
- Create: `content/jobs.json`
- Create: `content/hours.json`

- [ ] **Step 1: Write JSON files**

`content/popup.json`:

```json
{
  "active": true,
  "kind": "poster",
  "image": "/popup/bassie-goes-mexico.jpg",
  "imageAlt": {
    "en": "Bassie Goes Mexico — Tequila Surprise. Live mariachi band on Saturdays. Custom menu. 11–31 May.",
    "nl": "Bassie Goes Mexico — Tequila Surprise. Live mariachi-band op zaterdag. Speciale kaart. 11–31 mei.",
    "fr": "Bassie Goes Mexico — Tequila Surprise. Orchestre mariachi le samedi. Carte spéciale. 11–31 mai."
  },
  "dateStart": "2026-05-11",
  "dateEnd": "2026-05-31"
}
```

`content/jobs.json`:

```json
[]
```

`content/hours.json`:

```json
[
  { "weekday": "mon", "open": "16:00", "close": "00:00" },
  { "weekday": "tue" },
  { "weekday": "wed", "open": "16:00", "close": "00:00" },
  { "weekday": "thu", "open": "16:00", "close": "00:00" },
  { "weekday": "fri", "open": "12:00", "close": "01:00" },
  { "weekday": "sat", "open": "12:00", "close": "01:00" },
  { "weekday": "sun" }
]
```

- [ ] **Step 2: Write `lib/content.ts`**

```ts
// lib/content.ts
import popupRaw from "@/content/popup.json"
import jobsRaw from "@/content/jobs.json"
import hoursRaw from "@/content/hours.json"
import { type Popup } from "./popup"

export type Job = {
  id: string
  title: { en: string; nl: string; fr: string }
  description: { en: string; nl: string; fr: string }
  applyEmail: string
}

export type HoursEntry = {
  weekday: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
  open?: string
  close?: string
}

export const getPopup = (): Popup => popupRaw as Popup
export const getJobs = (): Job[] => jobsRaw as Job[]
export const getHours = (): HoursEntry[] => hoursRaw as HoursEntry[]
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts content/
git commit -m "feat(content): typed JSON loaders + initial content"
```

---

## Phase 5 — Layout shell

### Task 27: Sticky nav

**Files:**
- Create: `components/StickyNav.tsx`
- Create: `components/StickyNav.test.tsx`

- [ ] **Step 1: Write test**

```tsx
// components/StickyNav.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("next-intl", () => ({
  useTranslations: () => (k: string) => k,
  useLocale: () => "en",
}))
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}))

import { StickyNav } from "./StickyNav"

describe("StickyNav", () => {
  it("renders three pills (menu, reservation, happening) and locale switcher", () => {
    render(<StickyNav onHappeningClick={() => {}} />)
    expect(screen.getByText("menu")).toBeInTheDocument()
    expect(screen.getByText("reservation")).toBeInTheDocument()
    expect(screen.getByText("happening")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — fails**

- [ ] **Step 3: Implement**

```tsx
// components/StickyNav.tsx
"use client"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Pill } from "@/components/ui/Pill"
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher"
import { cn } from "@/lib/cn"

export function StickyNav({ onHappeningClick }: { onHappeningClick: () => void }) {
  const t = useTranslations("nav")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-transform duration-300",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-[var(--nav-h)] flex items-center justify-between gap-4 bg-bg/90 backdrop-blur-md shadow-sm">
        <a href="#hero" className="font-title text-2xl tracking-tight text-ink">BASSIE</a>
        <div className="flex items-center gap-2">
          <Pill href="#menu" className="hidden sm:inline-flex">{t("menu")}</Pill>
          <Pill href="#reserve" className="hidden sm:inline-flex">{t("reservation")}</Pill>
          <Pill onClick={onHappeningClick}>{t("happening")}</Pill>
          <LocaleSwitcher className="ml-2" />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Pass + commit**

```bash
npm test -- components/StickyNav.test.tsx
git add components/StickyNav.tsx components/StickyNav.test.tsx
git commit -m "feat(ui): StickyNav (appears after hero scrolls past)"
```

---

## Phase 6 — Sections

### Task 28: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/sections/Hero.tsx
"use client"
import { useTranslations } from "next-intl"
import { Pill } from "@/components/ui/Pill"

export function Hero({ onHappeningClick }: { onHappeningClick: () => void }) {
  const t = useTranslations()
  return (
    <section
      id="hero"
      className="relative h-[100svh] w-full overflow-hidden text-white"
      aria-label="Bar Bassie"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero/hero-poster.jpg"
        aria-hidden
      >
        <source src="/hero/hero-1080.webm" type="video/webm" />
        <source src="/hero/hero-1080.mp4"  type="video/mp4" />
      </video>
      <img
        src="/hero/hero-poster.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover hidden motion-reduce:block"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" aria-hidden />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <h1 className="font-title text-[18vw] md:text-[12rem] leading-none tracking-tight drop-shadow-lg">
          BASSIE
        </h1>
        <p className="mt-6 font-subtitle uppercase tracking-widest text-sm md:text-base">
          {t("hero.tagline")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Pill href="#menu">{t("nav.menu")}</Pill>
          <Pill href="#reserve">{t("nav.reservation")}</Pill>
          <Pill onClick={onHappeningClick}>{t("nav.happening")}</Pill>
        </div>
      </div>

      <div className="absolute bottom-6 inset-x-0 z-10 px-4 text-center font-subtitle text-xs md:text-sm tracking-wider">
        <p>{t("hours.weekdays")} · {t("hours.weekends")} · {t("hours.closed")}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat(sections): Hero with video bg, pills, hours strip"
```

---

### Task 29: PopupModal

**Files:**
- Create: `components/PopupModal.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/PopupModal.tsx
"use client"
import { useTranslations, useLocale } from "next-intl"
import Image from "next/image"
import { Modal } from "@/components/ui/Modal"
import { Icon } from "@/components/ui/Icon"
import type { Popup } from "@/lib/popup"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/cn"

export function PopupModal({
  popup, open, onClose,
}: { popup: Popup; open: boolean; onClose: () => void }) {
  const t = useTranslations("popup")
  const locale = useLocale() as Locale
  const isPoster = popup.kind === "poster"

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={popup.imageAlt[locale]}
      closeOnContentClick={isPoster}
      className={cn("rounded-lg overflow-hidden bg-bg", isPoster ? "" : "max-w-md")}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("close")}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/90 text-ink p-2 shadow hover:bg-white"
      >
        <Icon.X className="w-4 h-4" />
      </button>

      {isPoster ? (
        <Image
          src={popup.image}
          alt={popup.imageAlt[locale]}
          width={900}
          height={1200}
          className="block w-full h-auto max-h-[85vh] object-contain"
          priority
        />
      ) : (
        <div className="p-6">
          <Image
            src={popup.image}
            alt={popup.imageAlt[locale]}
            width={600}
            height={400}
            className="block w-full h-auto rounded"
          />
          {popup.title && (
            <h3 className="mt-4 font-title text-3xl text-ink">{popup.title[locale]}</h3>
          )}
          {popup.subtitle && (
            <p className="mt-1 font-subtitle uppercase text-accent text-sm tracking-wide">
              {popup.subtitle[locale]}
            </p>
          )}
          {popup.detail && (
            <p className="mt-3 font-body text-ink/80">{popup.detail[locale]}</p>
          )}
        </div>
      )}
    </Modal>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PopupModal.tsx
git commit -m "feat: PopupModal (poster + card render modes)"
```

---

### Task 30: PopupGate

**Files:**
- Create: `components/PopupGate.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/PopupGate.tsx
"use client"
import { useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { PopupModal } from "./PopupModal"
import { getPopup } from "@/lib/content"
import {
  isPopupActiveNow, shouldAutoOpenToday, markSeen, popupId,
} from "@/lib/popup"
import { todayBrussels } from "@/lib/dates"

export type PopupGateHandle = { open: () => void }

export const PopupGate = forwardRef<PopupGateHandle>(function PopupGate(_, ref) {
  const popup = getPopup()
  const [open, setOpen] = useState(false)
  const id = popupId(popup)
  const today = todayBrussels()
  const active = isPopupActiveNow(popup, today)

  useEffect(() => {
    if (active && shouldAutoOpenToday(id, today)) setOpen(true)
  }, [active, id, today])

  useImperativeHandle(ref, () => ({
    open: () => { if (active) setOpen(true) },
  }), [active])

  const onClose = () => {
    setOpen(false)
    markSeen(id, today)
  }

  if (!active) return null
  return <PopupModal popup={popup} open={open} onClose={onClose} />
})
```

- [ ] **Step 2: Commit**

```bash
git add components/PopupGate.tsx
git commit -m "feat: PopupGate (auto-open + force-open via ref)"
```

---

### Task 31: FoldBrochure primitive

**Files:**
- Create: `components/FoldBrochure.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/FoldBrochure.tsx
"use client"
import { useState, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/cn"

type FoldBrochureProps = {
  /** Panel image URLs. Index 0 = cover. */
  panels: string[]
  /** Number of panels per side (3 = rolvouw, 2 = luik). */
  panelsPerSide: 2 | 3
  /** Label shown above the brochure (e.g. "Drinks"). */
  label: string
  /** Where the downloadable PDF lives. */
  pdfHref: string
  /** Alt text per panel (or one fallback for all). */
  alt: string
}

export function FoldBrochure({ panels, panelsPerSide, label, pdfHref, alt }: FoldBrochureProps) {
  const t = useTranslations("menu")
  const [open, setOpen] = useState(false)
  const id = useId()

  // First N panels are the cover/back side; second N are the inside spread.
  const inside = panels.slice(panelsPerSide, panelsPerSide * 2)

  return (
    <div className="flex flex-col items-stretch gap-4">
      <h3 className="font-subtitle uppercase tracking-wide text-ink">{label}</h3>

      {/* Desktop: 3D fold */}
      <div className="relative hidden md:block">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`brochure-${id}`}
          className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
        >
          <motion.div
            className="relative aspect-[3/4] w-full max-w-[420px] mx-auto"
            style={{ perspective: 1200 }}
          >
            <motion.img
              src={panels[0]}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover rounded-md shadow-xl"
              animate={{ rotateY: open ? -180 : 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: "left center", backfaceVisibility: "hidden" }}
            />
          </motion.div>
          <p className="mt-2 text-center font-body text-sm text-ink/70 motion-reduce:hidden">
            {open ? "" : t("tapToOpen")}
          </p>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              id={`brochure-${id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className={cn(
                "mt-4 grid gap-2",
                panelsPerSide === 3 ? "grid-cols-3" : "grid-cols-2"
              )}
              role="group"
              aria-label={label}
              onClick={() => setOpen(false)}
            >
              {inside.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={alt}
                  className="w-full h-auto rounded-sm shadow-md"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile + reduced motion: vertical stack of inside panels */}
      <div className="md:hidden motion-safe:md:hidden flex flex-col gap-3">
        {inside.map((src, i) => (
          <img key={i} src={src} alt={alt} className="w-full h-auto rounded-sm shadow" />
        ))}
      </div>

      <a
        href={pdfHref}
        target="_blank"
        rel="noopener noreferrer"
        className="self-center inline-flex items-center gap-2 font-subtitle uppercase text-sm tracking-wide text-accent hover:underline"
      >
        {t("download")}
      </a>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/FoldBrochure.tsx
git commit -m "feat: FoldBrochure (3D fold-open menu + mobile stack)"
```

---

### Task 32: Menu section

**Files:**
- Create: `components/sections/Menu.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/sections/Menu.tsx
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { FoldBrochure } from "@/components/FoldBrochure"

const drinksPanels = [
  "/menu/drinks/panel-1.jpg",
  "/menu/drinks/panel-2.jpg",
  "/menu/drinks/panel-3.jpg",
  "/menu/drinks/panel-4.jpg",
  "/menu/drinks/panel-5.jpg",
  "/menu/drinks/panel-6.jpg",
]
const foodPanels = [
  "/menu/food/panel-1.jpg",
  "/menu/food/panel-2.jpg",
  "/menu/food/panel-3.jpg",
  "/menu/food/panel-4.jpg",
]

export function Menu() {
  const t = useTranslations("menu")
  return (
    <section id="menu" className="bg-bg py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <div className="mt-12 grid md:grid-cols-2 gap-12">
          <FoldBrochure
            label={t("drinks")}
            panels={drinksPanels}
            panelsPerSide={3}
            pdfHref="/menu/bar-bassie-drinks.pdf"
            alt={`Bar Bassie ${t("drinks")} menu`}
          />
          <FoldBrochure
            label={t("food")}
            panels={foodPanels}
            panelsPerSide={2}
            pdfHref="/menu/bar-bassie-food.pdf"
            alt={`Bar Bassie ${t("food")} menu`}
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Menu.tsx
git commit -m "feat(sections): Menu with drinks + food fold-open brochures"
```

---

### Task 33: About section

**Files:**
- Create: `components/sections/About.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/sections/About.tsx
import { useTranslations } from "next-intl"

export function About() {
  const t = useTranslations("about")
  return (
    <section id="about" className="bg-bg py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <blockquote className="font-subtitle uppercase tracking-wide text-accent text-2xl md:text-3xl leading-tight">
          {t("pullQuote")}
        </blockquote>
        <p className="mt-8 font-body text-ink/80 text-lg leading-relaxed">{t("body")}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/About.tsx
git commit -m "feat(sections): About with pull quote + body"
```

---

### Task 34: Location section

**Files:**
- Create: `components/sections/Location.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/sections/Location.tsx
import Image from "next/image"
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Icon } from "@/components/ui/Icon"

const photos = [
  "/photos/wintercircus-dome.jpg",
  "/photos/wintercircus-interior.jpg",
  "/photos/wintercircus-rooftop.jpg",
  "/photos/wintercircus-exterior.jpg",
]

export function Location() {
  const t = useTranslations("location")
  return (
    <section id="location" className="bg-bg py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <p className="mt-8 max-w-3xl mx-auto font-body text-ink/80 text-lg leading-relaxed text-center">
          {t("body")}
        </p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded">
              <Image src={src} alt="" fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="font-subtitle uppercase tracking-wide text-ink">
            {t("addressLine1")} · {t("addressLine2")}
          </p>
          <a
            href="https://maps.google.com/?q=Lammerstraat+13,+9000+Gent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-subtitle uppercase text-sm tracking-wide text-accent hover:underline"
          >
            <Icon.MapPin className="w-4 h-4" /> {t("directions")}
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Location.tsx
git commit -m "feat(sections): Location with photo grid + maps link"
```

---

### Task 35: Gallery section

**Files:**
- Create: `components/sections/Gallery.tsx`

- [ ] **Step 1: Implement (no lightbox in V1 — keep it simple)**

```tsx
// components/sections/Gallery.tsx
import Image from "next/image"
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"

const photos = [
  "/photos/gallery-1.jpg",
  "/photos/gallery-2.jpg",
  "/photos/gallery-3.jpg",
  "/photos/gallery-4.jpg",
  "/photos/gallery-5.jpg",
  "/photos/gallery-6.jpg",
]

export function Gallery() {
  const t = useTranslations("gallery")
  return (
    <section id="gallery" className="bg-bg py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <div className="mt-10 columns-2 md:columns-3 gap-3 [&>div]:mb-3">
          {photos.map((src) => (
            <div key={src} className="break-inside-avoid">
              <Image
                src={src}
                alt=""
                width={800}
                height={1000}
                className="w-full h-auto rounded shadow"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Gallery.tsx
git commit -m "feat(sections): Gallery masonry grid"
```

---

### Task 36: Jobs section

**Files:**
- Create: `components/sections/Jobs.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/sections/Jobs.tsx
import { useTranslations, useLocale } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Pill } from "@/components/ui/Pill"
import { getJobs } from "@/lib/content"
import type { Locale } from "@/lib/i18n"

export function Jobs() {
  const t = useTranslations("jobs")
  const locale = useLocale() as Locale
  const jobs = getJobs()

  return (
    <section id="jobs" className="bg-bg py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        {jobs.length === 0 ? (
          <p className="mt-8 text-center font-body text-ink/70">{t("noOpenings")}</p>
        ) : (
          <ul className="mt-10 space-y-8">
            {jobs.map((job) => (
              <li key={job.id} className="border-l-2 border-accent pl-4">
                <h3 className="font-title text-2xl text-ink">{job.title[locale]}</h3>
                <p className="mt-2 font-body text-ink/80">{job.description[locale]}</p>
                <Pill
                  href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(`Bar Bassie — application: ${job.title.en}`)}`}
                  className="mt-3"
                >
                  {t("apply")}
                </Pill>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Jobs.tsx
git commit -m "feat(sections): Jobs (driven by content/jobs.json)"
```

---

### Task 37: Reservation section

**Files:**
- Create: `components/sections/Reservation.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/sections/Reservation.tsx
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Pill } from "@/components/ui/Pill"
import { Icon } from "@/components/ui/Icon"

const PHONE = "32470487252"

export function Reservation() {
  const t = useTranslations("reserve")
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(t("whatsappPrefill"))}`
  return (
    <section id="reserve" className="bg-bg py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="font-body text-ink/80 space-y-4">
            <p>{t("walkIns")}</p>
            <p>{t("groups")}</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Pill href={href} className="text-lg px-6 py-3">
              <Icon.Whatsapp className="w-5 h-5 mr-2" aria-hidden />
              {t("whatsappCta")}
            </Pill>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Reservation.tsx
git commit -m "feat(sections): Reservation with WhatsApp CTA"
```

---

### Task 38: Footer

**Files:**
- Create: `components/sections/Footer.tsx`

- [ ] **Step 1: Implement**

```tsx
// components/sections/Footer.tsx
import { useTranslations } from "next-intl"
import { Icon } from "@/components/ui/Icon"
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher"

const EMAIL = "hello@barbassie.be"
const PHONE = "32470487252"
const IG = "https://instagram.com/barbassie.wintercircus"

export function Footer() {
  const t = useTranslations()
  return (
    <footer className="bg-ink text-bg py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <h4 className="font-subtitle uppercase text-accent text-sm tracking-wide">
            {t("footer.contact")}
          </h4>
          <ul className="mt-4 space-y-2 font-body">
            <li>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 hover:text-accent">
                <Icon.Mail className="w-4 h-4" /> {EMAIL}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${PHONE}`} className="inline-flex items-center gap-2 hover:text-accent">
                <Icon.Whatsapp className="w-4 h-4" /> +32 470 48 72 52
              </a>
            </li>
            <li className="font-body">
              {t("location.addressLine1")}, {t("location.addressLine2")}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-subtitle uppercase text-accent text-sm tracking-wide">
            {t("footer.hours")}
          </h4>
          <ul className="mt-4 space-y-2 font-body">
            <li>{t("hours.weekdays")}</li>
            <li>{t("hours.weekends")}</li>
            <li>{t("hours.closed")}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-subtitle uppercase text-accent text-sm tracking-wide">
            {t("footer.follow")}
          </h4>
          <ul className="mt-4 space-y-2 font-body">
            <li>
              <a href={IG} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <Icon.Instagram className="w-4 h-4" /> @barbassie.wintercircus
              </a>
            </li>
          </ul>
          <div className="mt-6">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
      <p className="mt-12 text-center font-body text-bg/60 text-xs">
        © Bar Bassie · {t("footer.designed")}
      </p>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Footer.tsx
git commit -m "feat(sections): Footer with contact, hours, social, locale switcher"
```

---

## Phase 7 — Page composition

### Task 39: Compose the single-page scroll

**Files:**
- Replace: `app/[locale]/page.tsx`

- [ ] **Step 1: Rewrite**

```tsx
// app/[locale]/page.tsx
"use client"
import { useRef } from "react"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Menu } from "@/components/sections/Menu"
import { Location } from "@/components/sections/Location"
import { Gallery } from "@/components/sections/Gallery"
import { Jobs } from "@/components/sections/Jobs"
import { Reservation } from "@/components/sections/Reservation"
import { Footer } from "@/components/sections/Footer"
import { StickyNav } from "@/components/StickyNav"
import { PopupGate, type PopupGateHandle } from "@/components/PopupGate"

export default function Home() {
  const popupRef = useRef<PopupGateHandle>(null)
  const openHappening = () => popupRef.current?.open()

  return (
    <>
      <StickyNav onHappeningClick={openHappening} />
      <main>
        <Hero onHappeningClick={openHappening} />
        <About />
        <Menu />
        <Location />
        <Gallery />
        <Jobs />
        <Reservation />
      </main>
      <Footer />
      <PopupGate ref={popupRef} />
    </>
  )
}
```

- [ ] **Step 2: Run dev + smoke**

```bash
npm run dev
```
Open `http://localhost:3000` — verify:
- Hero loads (video plays muted)
- Scroll past hero → sticky nav fades in
- Click `Happening` pill → pop-up opens with Bassie Goes Mexico
- Close pop-up, click `Happening` again → opens (force-open)
- Reload page (same day) → pop-up does NOT auto-open
- Locale switcher to NL → URL becomes `/nl`, copy translates

Kill server.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "feat: compose single-page scroll with all sections"
```

---

## Phase 8 — SEO + polish

### Task 40: Metadata + OG tags

**Files:**
- Modify: `app/[locale]/layout.tsx` to export `generateMetadata`

- [ ] **Step 1: Add metadata**

In `app/[locale]/layout.tsx`, above the `LocaleLayout` function, add:

```tsx
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "hero" })
  return {
    metadataBase: new URL("https://barbassie.be"),
    title: { default: "Bar Bassie · Wintercircus Ghent", template: "%s · Bar Bassie" },
    description: t("tagline"),
    openGraph: {
      title: "Bar Bassie · Wintercircus Ghent",
      description: t("tagline"),
      url: "/",
      siteName: "Bar Bassie",
      images: ["/og/cover.jpg"],
      type: "website",
      locale,
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
      languages: {
        en: "/", nl: "/nl", fr: "/fr",
      },
    },
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "feat(seo): per-locale metadata + alternates"
```

---

### Task 41: Sitemap and robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `public/robots.txt`

- [ ] **Step 1: Sitemap**

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next"
import { locales } from "@/lib/i18n"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://barbassie.be"
  return locales.map((loc) => ({
    url: loc === "en" ? `${base}/` : `${base}/${loc}`,
    changeFrequency: "weekly",
    priority: loc === "en" ? 1 : 0.8,
  }))
}
```

- [ ] **Step 2: Robots**

```
User-agent: *
Allow: /
Sitemap: https://barbassie.be/sitemap.xml
```

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts public/robots.txt
git commit -m "feat(seo): sitemap + robots"
```

---

### Task 42: JSON-LD schema

**Files:**
- Create: `components/SchemaOrg.tsx`
- Modify: `app/[locale]/layout.tsx` to render `<SchemaOrg/>` in `<body>`

- [ ] **Step 1: Write**

```tsx
// components/SchemaOrg.tsx
export function SchemaOrg() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: "Bar Bassie",
    image: "https://barbassie.be/og/cover.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lammerstraat 13",
      postalCode: "9000",
      addressLocality: "Ghent",
      addressCountry: "BE",
    },
    telephone: "+32470487252",
    url: "https://barbassie.be",
    servesCuisine: ["Small plates", "Cocktails"],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Wednesday","Thursday"], opens: "16:00", closes: "00:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday","Saturday"], opens: "12:00", closes: "01:00" },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
```

In `app/[locale]/layout.tsx` add `<SchemaOrg/>` inside `<body>`:

```tsx
import { SchemaOrg } from "@/components/SchemaOrg"
// ...
<body>
  <SchemaOrg />
  <NextIntlClientProvider ...>...</NextIntlClientProvider>
</body>
```

- [ ] **Step 2: Commit**

```bash
git add components/SchemaOrg.tsx app/[locale]/layout.tsx
git commit -m "feat(seo): JSON-LD BarOrPub structured data"
```

---

## Phase 9 — Verification

### Task 43: Build + run all checks

- [ ] **Step 1: Production build**

```bash
npm run build
```
Expected: build succeeds, no type errors, no lint errors.

- [ ] **Step 2: Run all tests**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 3: Smoke test prod build**

```bash
npm run start
```
Open `http://localhost:3000` — repeat the smoke flow from Task 39 step 2.

- [ ] **Step 4: Lighthouse (Chrome DevTools, mobile preset)**

Target scores:
- Performance > 85
- Accessibility > 95
- Best Practices > 95
- SEO > 95

Note any failures, file follow-up if not blocking V1.

---

### Task 44: Push and open PR

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Connect Vercel**

In the Vercel dashboard, import `jakesparrew/barbassie`. Use defaults (Next.js detected automatically). Set:
- Production branch: `main`
- No env vars needed for V1
- Region: `cdg1` (Paris, closest to Ghent)

- [ ] **Step 3: Verify first prod deploy**

Vercel deploys automatically. Open the assigned `*.vercel.app` URL and smoke-test as before.

- [ ] **Step 4: Domain (separate, with user)**

Coordinate with the user to point `barbassie.be` DNS at Vercel (CNAME `cname.vercel-dns.com` or A `76.76.21.21`). Verify SSL provisions automatically.

---

## Definition of done checklist

Run through this checklist at the end. Every item must be ✓.

- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm test` — all tests pass
- [ ] `npm run build` — succeeds
- [ ] Production Lighthouse mobile: Perf > 85, A11y > 95, Best Practices > 95, SEO > 95
- [ ] Hero video autoplays muted on Chrome desktop, Safari mobile
- [ ] `prefers-reduced-motion: reduce` → no video, poster shown
- [ ] Pop-up auto-opens once per day per visitor; reopens via Happening pill
- [ ] Locale switcher writes cookie + navigates; `/`, `/nl`, `/fr` all render
- [ ] Drinks fold-open works on desktop; food fold-open works on desktop
- [ ] Mobile menu shows inside panels stacked
- [ ] Both menu PDFs download (drinks 3-fold, food 2-fold)
- [ ] WhatsApp link opens chat to `+32 470 48 72 52` with pre-filled message
- [ ] Footer email, WhatsApp, Instagram, address, hours all correct
- [ ] Vercel prod deploy live at `*.vercel.app`
- [ ] Repo `main` is green in GitHub Actions

---

## Out of scope (V1) — defer to V2

- Supabase CMS for popup/jobs/menu editing
- Resend email (job applications, contact, newsletter)
- supershift.work reservation integration (replaces WhatsApp CTA)
- Newsletter signup
- Instagram embed
- Plausible / Umami if Vercel Analytics insufficient
