// next.config.ts
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n.ts")

const YEAR = 31_536_000
const MONTH = 2_592_000
const WEEK = 604_800

// Vercel serves everything in public/ as `max-age=0, must-revalidate` by
// default, so every asset re-hits the edge on every repeat visit (a 304 is
// still a billed request). These two tiers fix that.
//
// `immutable` is only safe for files we never overwrite in place — the videos
// and the WOFF2 fonts. Replace one of those and you must rename it.
const immutableAsset = [{ key: "Cache-Control", value: `public, max-age=${YEAR}, immutable` }]
// Artwork IS re-encoded in place by `npm run optimize-assets` (same filename),
// so it gets a bounded TTL instead — a swapped photo goes live within a week
// rather than being pinned in browsers for a year.
const artwork = [
  { key: "Cache-Control", value: `public, max-age=${WEEK}, stale-while-revalidate=${MONTH}` },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Serve modern formats (AVIF first, WebP fallback) for all next/image assets.
    formats: ["image/avif", "image/webp"],
    // Every source image is <= ~2000px, so the 1200/2048 rungs only ever
    // upscaled. Trimming to four widths shrinks the generated srcset surface.
    deviceSizes: [640, 828, 1080, 1920],
    // Cache-Control the optimizer stamps on /_next/image responses; kept equal
    // to the artwork max-age so both staleness windows are the same number.
    minimumCacheTTL: WEEK,
  },
  async redirects() {
    return [
      // Canonical host: www duplicates the whole site for crawlers. Must come
      // before the "/" rule, or www visitors land on www/en instead of the apex.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.barbassie.be" }],
        destination: "https://barbassie.be/:path*",
        permanent: true,
      },
      // Send "/" to the default locale. Replaces the next-intl middleware
      // (removed because Next 15.5 + edge runtime + next-intl had stacked
      // bundling bugs that crashed every request).
      // permanent: true => 308, which browsers cache. The old 307 did not, so
      // the hop was re-requested on every single apex visit.
      { source: "/", destination: "/en", permanent: true },
    ]
  },
  async headers() {
    return [
      // Never overwritten in place -> safe to freeze for a year.
      { source: "/hero/hero-1080.mp4", headers: immutableAsset },
      { source: "/video-mexico.mp4", headers: immutableAsset },
      { source: "/fonts/:path*", headers: immutableAsset },
      // Rewritten in place by the asset pipeline -> bounded TTL.
      { source: "/hero/hero-poster.jpg", headers: artwork },
      { source: "/gallery/:path*", headers: artwork },
      { source: "/events/:path*", headers: artwork },
      { source: "/menu/:path*", headers: artwork },
      { source: "/popup/:path*", headers: artwork },
      { source: "/photos/:path*", headers: artwork },
      { source: "/og/:path*", headers: artwork },
      { source: "/logo-bassie.png", headers: artwork },
      { source: "/logo-bassies.png", headers: artwork },
    ]
  },
}

export default withNextIntl(nextConfig)
