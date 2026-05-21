// components/sections/Jobs.tsx
import { useTranslations, useLocale } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Pill } from "@/components/ui/Pill"
import { getJobs } from "@/lib/content"
import type { Locale } from "@/lib/i18n"

export function Jobs() {
  const t = useTranslations("jobs")
  const locale = useLocale() as Locale
  const jobs = getJobs()

  return (
    <section id="jobs" className="bg-bg py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        {jobs.length === 0 ? (
          <p className="mt-8 text-center font-body text-ink/70">{t("noOpenings")}</p>
        ) : (
          <ul className="mt-10 space-y-8">
            {jobs.map((job) => (
              <li key={job.id} className="border-l-2 border-accent pl-4">
                <h3 className="font-title text-2xl text-ink">{job.title[locale]}</h3>
                <p className="mt-2 font-body text-ink/80">{job.description[locale]}</p>
                <Pill
                  href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(`Bar Bassie — application: ${job.title.en}`)}`}
                  className="mt-3"
                >
                  {t("apply")}
                </Pill>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
