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
