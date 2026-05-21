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
