// components/JobsBadge.tsx
"use client"
import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Modal } from "@/components/ui/Modal"
import { Pill } from "@/components/ui/Pill"
import { Icon } from "@/components/ui/Icon"
import { getJobs } from "@/lib/content"
import { cn } from "@/lib/cn"
import type { Locale } from "@/lib/i18n"

/**
 * Floating "Jobs" badge anchored to the bottom-right of the viewport.
 * Clicking it opens a modal with the current openings list.
 * Replaces the previous full-page Jobs section.
 */
export function JobsBadge() {
  const t = useTranslations("jobs")
  const locale = useLocale() as Locale
  const jobs = getJobs()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("label")}
        className={cn(
          "fixed right-4 bottom-4 z-30 md:right-6 md:bottom-6",
          "bg-ink text-bg hover:bg-accent hover:text-white",
          "font-subtitle text-xs tracking-[0.18em] uppercase",
          "rounded-full px-4 py-3 shadow-2xl backdrop-blur",
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(224,54,183,0.35)]",
          "focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "flex items-center gap-2"
        )}
      >
        <span aria-hidden className="inline-block h-2 w-2 animate-pulse rounded-full bg-current" />
        {t("label")}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel={t("label")}
        className="bg-bg w-[min(92vw,520px)] overflow-hidden rounded-xl"
      >
        <div className="relative px-6 py-8 md:px-8 md:py-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
            aria-label="Close"
            className="text-ink/60 hover:text-ink hover:bg-ink/5 focus-visible:ring-accent absolute top-3 right-3 rounded-full p-2 transition focus-visible:ring-2 focus-visible:outline-none"
          >
            <Icon.X className="h-4 w-4" />
          </button>

          <p className="font-subtitle text-accent text-xs tracking-[0.25em] uppercase">
            {t("label")}
          </p>
          <h2 className="font-title text-ink mt-2 text-3xl leading-none md:text-4xl">
            {t("label")}
          </h2>

          {jobs.length === 0 ? (
            <p className="font-body text-ink/70 mt-6 leading-relaxed">{t("noOpenings")}</p>
          ) : (
            <ul className="mt-6 space-y-6">
              {jobs.map((job) => (
                <li key={job.id} className="border-accent border-l-2 pl-4">
                  <h3 className="font-title text-ink text-xl">{job.title[locale]}</h3>
                  <p className="font-body text-ink/80 mt-2 text-sm leading-relaxed">
                    {job.description[locale]}
                  </p>
                  <Pill
                    href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(`Bar Bassie — application: ${job.title.en}`)}`}
                    className="mt-3 text-xs"
                  >
                    {t("apply")}
                  </Pill>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </>
  )
}
