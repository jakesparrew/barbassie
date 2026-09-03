// components/PopupModal.tsx
"use client"
import { useEffect, useState } from "react"
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
  const [playing, setPlaying] = useState(false)
  // Posters can carry a second "details" panel; page 1 is that panel.
  const [page, setPage] = useState<0 | 1>(0)

  // We render the poster image when it's available; otherwise fall back to a
  // branded card built from the popup's structured fields. This keeps the
  // modal meaningful even before the high-res poster artwork is uploaded.
  const showPoster = popup.kind === "poster" && !imageFailed
  const hasVideo = Boolean(popup.video)
  const hasDetail = Boolean(popup.image2)
  // A click starts the video, or advances to the details panel when there is
  // one. Only on the last panel does a click dismiss the modal.
  const closeOnContent = showPoster && !hasVideo && !playing && !(hasDetail && page === 0)

  // Rewind back to the poster whenever the modal is dismissed so the next
  // open starts fresh.
  useEffect(() => {
    if (!open) {
      setPlaying(false)
      setPage(0)
    }
  }, [open])

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

      {showPoster && playing && popup.video ? (
        // Video takes over once the poster is clicked.
        <video
          src={popup.video}
          autoPlay
          controls
          playsInline
          className="block h-auto max-h-[85vh] w-auto max-w-[90vw] object-contain"
        />
      ) : showPoster ? (
        // Real poster artwork. Using <img> so we can detect 404 and gracefully
        // swap to the fallback card without a runtime crash.
        hasVideo ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setPlaying(true)
            }}
            aria-label={t("play")}
            className="group relative block cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- need onError + intrinsic size */}
            <img
              src={popup.image}
              alt={popup.imageAlt[locale]}
              onError={() => setImageFailed(true)}
              className="block h-auto max-h-[85vh] w-auto max-w-[90vw] object-contain"
            />
            {/* Play affordance overlaid on the poster. */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/55 text-white shadow-lg transition group-hover:scale-110 group-hover:bg-black/70">
                <Icon.Play className="ml-0.5 h-7 w-7 fill-current" />
              </span>
            </span>
          </button>
        ) : hasDetail ? (
          // Poster with a details panel. The control sits BELOW the artwork so
          // it never covers any of the poster's own type.
          <div className="flex max-h-[85vh] flex-col">
            {page === 0 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPage(1)
                  }}
                  aria-label={t("moreInfo")}
                  className="group block min-h-0 cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- need onError + intrinsic size */}
                  <img
                    src={popup.image}
                    alt={popup.imageAlt[locale]}
                    onError={() => setImageFailed(true)}
                    className="block h-auto max-h-[calc(85vh-3.25rem)] w-auto max-w-[90vw] object-contain"
                  />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPage(1)
                  }}
                  className="font-subtitle flex shrink-0 items-center justify-center gap-2 bg-black px-4 py-3.5 text-[10px] tracking-[0.2em] text-white uppercase transition hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none md:text-xs"
                >
                  {t("moreInfo")}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3.5 w-3.5"
                    aria-hidden
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- need onError + intrinsic size */}
                <img
                  src={popup.image2}
                  alt={popup.imageAlt[locale]}
                  onError={() => setImageFailed(true)}
                  className="block h-auto max-h-[calc(85vh-3.25rem)] w-auto max-w-[90vw] object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPage(0)
                  }}
                  className="font-subtitle flex shrink-0 items-center justify-center gap-2 bg-black px-4 py-3.5 text-[10px] tracking-[0.2em] text-white uppercase transition hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none md:text-xs"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3.5 w-3.5"
                    aria-hidden
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  {t("back")}
                </button>
              </>
            )}
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- need onError + intrinsic size
          <img
            src={popup.image}
            alt={popup.imageAlt[locale]}
            onError={() => setImageFailed(true)}
            className="block h-auto max-h-[85vh] w-auto max-w-[90vw] object-contain"
          />
        )
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
        background: "radial-gradient(circle at top, #ffd84d 0%, #f4c020 45%, #e09a1c 100%)",
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
        <h2 className="font-subtitle mt-4 text-5xl leading-[0.9] tracking-tight uppercase md:text-6xl">
          {popup.title?.[locale] ?? popup.imageAlt[locale]}
        </h2>
        <div className="mx-auto mt-8 inline-block rounded-full border-2 border-[color:#a31a1a] px-4 py-1">
          <p className="font-subtitle text-sm tracking-wide uppercase">
            {formatRange(popup.dateStart, popup.dateEnd, locale)}
          </p>
        </div>
        {popup.detail && (
          <p className="font-body mt-6 max-w-xs text-xs leading-relaxed tracking-wide uppercase">
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
    "top-3 left-4",
    "top-3 right-4",
    "top-1/4 left-2",
    "top-1/4 right-2",
    "top-1/2 left-2",
    "top-1/2 right-2",
    "top-3/4 left-2",
    "top-3/4 right-2",
    "bottom-3 left-4",
    "bottom-3 right-4",
  ]
  return (
    <>
      {positions.map((cls, i) => (
        <span key={i} className={`absolute ${cls} text-lg text-[color:#a31a1a]/80`}>
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
