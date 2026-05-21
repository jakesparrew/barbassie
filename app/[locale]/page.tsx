// app/[locale]/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server"
import { isLocale, defaultLocale } from "@/lib/i18n"

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(isLocale(locale) ? locale : defaultLocale)
  const t = await getTranslations()
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-title text-6xl">{t("hero.tagline")}</h1>
    </main>
  )
}
