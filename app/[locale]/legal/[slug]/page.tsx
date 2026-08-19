// app/[locale]/legal/[slug]/page.tsx
import Link from "next/link"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Footer } from "@/components/sections/Footer"
import { getLegalDoc, legalSlugs } from "@/lib/content"
import { isLocale, locales, defaultLocale } from "@/lib/i18n"

/** Pre-render every locale x document combination at build time. */
export const generateStaticParams = () =>
  locales.flatMap((locale) => legalSlugs.map((slug) => ({ locale, slug })))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const doc = getLegalDoc(slug)
  if (!doc) return {}
  return {
    title: doc.title,
    description: doc.intro.slice(0, 155),
    alternates: { canonical: `/${locale}/legal/${slug}` },
    // Useful to a visitor, but not something we want ranking above the venue.
    robots: { index: false, follow: true },
  }
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  setRequestLocale(locale)

  const doc = getLegalDoc(slug)
  if (!doc) notFound()

  const t = await getTranslations("jobs")
  const homeHref = locale === defaultLocale ? "/" : `/${locale}`

  return (
    <>
      <main className="bg-bg text-ink min-h-screen px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <Link
            href={homeHref}
            className="font-body text-ink/60 hover:text-accent inline-flex items-center gap-2 text-xs tracking-wide uppercase transition-colors"
          >
            ← {t("back")}
          </Link>

          <header className="mt-10">
            <h1 className="font-subtitle text-ink text-4xl leading-none tracking-tight uppercase md:text-6xl">
              {doc.title}
            </h1>
            <p className="font-body text-ink/50 mt-4 text-xs tracking-[0.2em] uppercase">
              Last updated {formatDate(doc.updated)}
            </p>
            <p className="font-body text-ink/80 mt-6 leading-relaxed">{doc.intro}</p>
          </header>

          <div className="mt-14 space-y-12">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-subtitle text-ink text-xl tracking-tight uppercase md:text-2xl">
                  {section.heading}
                </h2>

                {section.body?.map((paragraph) => (
                  <p key={paragraph} className="font-body text-ink/80 mt-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                {section.items && (
                  <ul className="mt-4 space-y-3">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="font-body text-ink/80 border-accent border-l-2 pl-4 leading-relaxed"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.after?.map((paragraph) => (
                  <p key={paragraph} className="font-body text-ink/80 mt-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Sideways links to the other legal documents */}
          <nav className="border-ink/15 mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t pt-8">
            {legalSlugs
              .filter((s) => s !== slug)
              .map((s) => {
                const other = getLegalDoc(s)
                if (!other) return null
                return (
                  <Link
                    key={s}
                    href={`/${locale}/legal/${s}`}
                    className="font-body text-ink/60 hover:text-accent text-xs tracking-wide uppercase transition-colors"
                  >
                    {other.title}
                  </Link>
                )
              })}
          </nav>
        </div>
      </main>
      <Footer />
    </>
  )
}
