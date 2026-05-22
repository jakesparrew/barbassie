// components/PopupModal.tsx
"use client"
import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Modal } from "@/components/ui/Modal"
import { Icon } from "@/components/ui/Icon"
import type { Popup } from "@/lib/popup"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/cn"

export function PopupModal({
  popup,
  open,
  onClose,
}: {
  popup: Popup
  open: boolean
  onClose: () => void
}) {
  const t = useTranslations("popup")
  const locale = useLocale() as Locale
  const [imageFailed, setImageFailed] = useState(false)

  // We render the poster image when it's available; otherwise fall back to a
  // branded card built from the popup's structured fields. This keeps the
  // modal meaningful even before the high-res poster artwork is uploaded.
  const showPoster = popup.kind === "poster" && !imageFailed
  const closeOnContent = showPoster

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={popup.imageAlt[locale]}
      closeOnContentClick={closeOnContent}
      className={cn("overflow-hidden rounded-xl shadow-2xl", showPoster ? "" : "max-w-md")}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label={t("close")}
        className="text-ink absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 shadow-lg transition hover:scale-110 hover:bg-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      >
        <Icon.X className="h-4 w-4" />
      </button>

      {showPoster ? (
        // Real poster artwork. Using <img> so we can detect 404 and gracefully
        // swap to the fallback card without a runtime crash.
        // eslint-disable-next-line @next/next/no-img-element -- need onError + intrinsic size
        <img
          src={popup.image}
          alt={popup.imageAlt[locale]}
          onError={() => setImageFailed(true)}
          className="block h-auto max-h-[85vh] w-auto max-w-[90vw] object-contain"
        />
      ) : (
        // Branded fallback card: yellow/red Mexico-poster vibe driven by
        // structured fields. Used until the real poster lands in /public/popup/.
        <FallbackCard popup={popup} locale={locale} />
      )}
    </Modal>
  )
}

function FallbackCard({ popup, locale }: { popup: Popup; locale: Locale }) {
  return (
    <div
      className="relative flex max-h-[85vh] w-[88vw] max-w-md flex-col items-center overflow-hidden text-center"
      style={{
        background:
          "radial-gradient(circle at top, #ffd84d 0%, #f4c020 45%, #e09a1c 100%)",
      }}
    >
      {/* Decorative stars border */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Stars />
      </div>

      <div className="relative flex flex-col items-center px-8 pt-12 pb-10 text-[color:#a31a1a]">
        <p className="font-subtitle text-xs tracking-[0.25em] uppercase">
          {popup.subtitle?.[locale] ?? ""}
        </p>
        <h2 className="font-title mt-4 text-5xl leading-[0.9] tracking-tight md:text-6xl">
          {popup.title?.[locale] ?? popup.imageAlt[locale]}
        </h2>
        <div className="mx-auto mt-8 inline-block rounded-full border-2 border-[color:#a31a1a] px-4 py-1">
          <p className="font-subtitle text-sm tracking-wide uppercase">
            {formatRange(popup.dateStart, popup.dateEnd, locale)}
          </p>
        </div>
        {popup.detail && (
          <p className="font-subtitle mt-6 max-w-xs text-xs leading-relaxed tracking-wide uppercase">
            {popup.detail[locale]}
          </p>
        )}
      </div>
    </div>
  )
}

function Stars() {
  // 10 small star characters around the border. Pure decoration.
  const positions = [
    "top-3 left-4", "top-3 right-4",
    "top-1/4 left-2", "top-1/4 right-2",
    "top-1/2 left-2", "top-1/2 right-2",
    "top-3/4 left-2", "top-3/4 right-2",
    "bottom-3 left-4", "bottom-3 right-4",
  ]
  return (
    <>
      {positions.map((cls, i) => (
        <span
          key={i}
          className={`absolute ${cls} text-[color:#a31a1a]/80 text-lg`}
        >
          ★
        </span>
      ))}
    </>
  )
}

function formatRange(start: string, end: string, locale: Locale): string {
  const monthName = (iso: string) => {
    const d = new Date(iso + "T00:00:00")
    return d.toLocaleDateString(locale === "en" ? "en-GB" : locale, { month: "long" })
  }
  const day = (iso: string) => Number(iso.slice(8, 10))
  const startMonth = monthName(start)
  const endMonth = monthName(end)
  if (startMonth === endMonth) {
    return `${day(start)} → ${day(end)} ${endMonth}`
  }
  return `${day(start)} ${startMonth} → ${day(end)} ${endMonth}`
}
