// app/sitemap.ts
import type { MetadataRoute } from "next"
import { locales } from "@/lib/i18n"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://barbassie.be"
  // Point at the URL that actually returns 200. Listing "/" advertised a hop,
  // since "/" 308-redirects to "/en".
  // Legal pages are deliberately absent: they are noindex.
  return locales.map((loc) => ({
    url: `${base}/${loc}`,
    changeFrequency: "weekly" as const,
    priority: loc === "en" ? 1 : 0.8,
  }))
}
