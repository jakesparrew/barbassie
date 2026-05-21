// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import localFont from "next/font/local"
import { isLocale, locales } from "@/lib/i18n"
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
