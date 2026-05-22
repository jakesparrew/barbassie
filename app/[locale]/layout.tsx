// app/[locale]/layout.tsx
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import localFont from "next/font/local"
import { isLocale, locales } from "@/lib/i18n"
import { SchemaOrg } from "@/components/SchemaOrg"
import "../globals.css"

const lioney = localFont({
  src: "../../public/fonts/Lioney-Regular.woff2",
  display: "swap",
  variable: "--font-lioney",
})
const marsha = localFont({
  src: "../../public/fonts/VTCMarsha-Bold.woff2",
  display: "swap",
  variable: "--font-marsha",
})
const gothic = localFont({
  src: "../../public/fonts/CenturyGothic.woff2",
  display: "swap",
  variable: "--font-gothic",
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "hero" })
  const description = `${t("taglineLine1")} · ${t("taglineLine2")}`
  return {
    metadataBase: new URL("https://barbassie.be"),
    title: { default: "Bar Bassie · Wintercircus Ghent", template: "%s · Bar Bassie" },
    description,
    openGraph: {
      title: "Bar Bassie · Wintercircus Ghent",
      description,
      url: "/",
      siteName: "Bar Bassie",
      images: ["/og/cover.jpg"],
      type: "website",
      locale,
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
      languages: {
        en: "/",
        nl: "/nl",
        fr: "/fr",
      },
    },
  }
}

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${lioney.variable} ${marsha.variable} ${gothic.variable}`}>
      <body>
        <SchemaOrg />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
