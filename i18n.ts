// i18n.ts
import { getRequestConfig } from "next-intl/server"
import { notFound } from "next/navigation"
import { isLocale, defaultLocale } from "./lib/i18n"

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? defaultLocale
  if (!isLocale(locale)) notFound()
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
