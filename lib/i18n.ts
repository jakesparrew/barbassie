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
