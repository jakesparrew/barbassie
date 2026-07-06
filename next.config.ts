// next.config.ts
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n.ts")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Serve modern formats (AVIF first, WebP fallback) for all next/image assets.
    formats: ["image/avif", "image/webp"],
    // Source images are capped at ~2000px, so drop the default 3840 candidate —
    // it would only upscale (no quality gain) and slow down optimization.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  async redirects() {
    // Send "/" to the default locale. Replaces the next-intl middleware
    // (removed because Next 15.5 + edge runtime + next-intl had stacked
    // bundling bugs that crashed every request).
    return [{ source: "/", destination: "/en", permanent: false }]
  },
}

export default withNextIntl(nextConfig)
