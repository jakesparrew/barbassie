// app/[locale]/jobs/page.tsx
import Link from "next/link"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Pill } from "@/components/ui/Pill"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Footer } from "@/components/sections/Footer"
import { getJobs } from "@/lib/content"
import { isLocale, locales, type Locale, defaultLocale } from "@/lib/i18n"

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "jobs" })
  return {
    title: t("label"),
    description: t("intro"),
  }
}

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations("jobs")
  const jobs = getJobs()
  const homeHref = locale === defaultLocale ? "/" : `/${locale}`

  return (
    <>
      <main className="bg-bg text-ink min-h-screen px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href={homeHref}
            className="font-subtitle text-ink/60 hover:text-accent inline-flex items-center gap-2 text-xs tracking-wide uppercase transition-colors"
          >
            ← {t("back")}
          </Link>

          <header className="mt-10">
            <SectionLabel>{t("label").toUpperCase()}</SectionLabel>
            <h1 className="font-title text-ink mt-3 text-5xl leading-none tracking-tight md:text-7xl">
              {t("heading")}
            </h1>
            <p className="font-body text-ink/80 mt-6 max-w-2xl text-lg leading-relaxed">
              {t("intro")}
            </p>
          </header>

          {jobs.length === 0 ? (
            <p className="font-body text-ink/70 mt-16 text-center">{t("noOpenings")}</p>
          ) : (
            <ul className="mt-16 space-y-12">
              {jobs.map((job) => (
                <li key={job.id} className="border-accent border-l-2 pl-6">
                  <h2 className="font-title text-ink text-3xl">{job.title[locale as Locale]}</h2>
                  <p className="font-body text-ink/80 mt-3 leading-relaxed">
                    {job.description[locale as Locale]}
                  </p>
                  <Pill
                    href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(
                      `Bar Bassie — application: ${job.title.en}`
                    )}`}
                    className="mt-5"
                  >
                    {t("apply")}
                  </Pill>
                </li>
              ))}
            </ul>
          )}

          <p className="font-body text-ink/60 mt-20 text-center text-sm">
            {t("openApplicationLine")}{" "}
            <a
              href="mailto:hello@barbassie.be?subject=Bar%20Bassie%20%E2%80%94%20open%20application"
              className="text-accent hover:underline"
            >
              hello@barbassie.be
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
