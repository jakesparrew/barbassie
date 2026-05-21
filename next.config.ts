// next.config.ts
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n.ts")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Send "/" to the default locale. Replaces the next-intl middleware
    // (removed because Next 15.5 + edge runtime + next-intl had stacked
    // bundling bugs that crashed every request).
    return [
      { source: "/", destination: "/en", permanent: false },
    ]
  },
}

export default withNextIntl(nextConfig)
