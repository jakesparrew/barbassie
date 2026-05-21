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