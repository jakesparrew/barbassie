// components/FoldBrochure.tsx
"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Modal } from "@/components/ui/Modal"
import { cn } from "@/lib/cn"

type FoldBrochureProps = {
  /** Panel image URLs. First N are cover side, next N are the inside spread. */
  panels: string[]
  /** Number of panels per side (3 = rolvouw, 2 = luik). */
  panelsPerSide: 2 | 3
  /** Label shown above the brochure (e.g. "Drinks"). */
  label: string
  /** Where the downloadable PDF lives. */
  pdfHref: string
  /** Alt text per panel (or one fallback for all). */
  alt: string
}

export function FoldBrochure({ panels, panelsPerSide, label, pdfHref, alt }: FoldBrochureProps) {
  const t = useTranslations("menu")
  const [open, setOpen] = useState(false)

  const cover = panels[0]
  // First N panels are the cover/back side; next N are the inside spread.
  const inside = panels.slice(panelsPerSide, panelsPerSide * 2)

  return (
    <>
      <div className="flex flex-col items-stretch gap-4">
        {/* Big magenta VTC Marsha title + small underlined "Menu" tagline */}
        <header className="text-center">
          <h3 className="font-subtitle text-accent text-4xl leading-none tracking-tight uppercase md:text-5xl">
            {label}
          </h3>
          <p className="font-body text-ink mt-1 inline-block border-b border-current text-xs tracking-[0.25em] uppercase">
            {t("label")}
          </p>
        </header>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`${t("tapToOpen")} — ${label}`}
          className="focus-visible:ring-accent group block w-full rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-md shadow-xl transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element -- intentional for poster-style cover */}
            <img src={cover} alt={alt} className="h-full w-full object-cover" loading="lazy" />
            {/* Subtle "tap to open" overlay hint, visible on hover/focus */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="font-subtitle text-sm tracking-wide text-white uppercase">
                {t("tapToOpen")}
              </span>
            </div>
          </div>
          <p className="font-body text-ink/60 mt-2 text-center text-sm md:hidden">
            {t("tapToOpen")}
          </p>
        </button>

        <a
          href={pdfHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-subtitle text-accent inline-flex items-center gap-2 self-center text-sm tracking-wide uppercase hover:underline"
        >
          {t("download")}
        </a>
      </div>

      {/* Lightbox: shows the unfolded inside spread at readable size.
          closeOnContentClick=true so tapping anywhere on the open menu refolds it. */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel={`${label} menu`}
        closeOnContentClick
        className="w-full"
      >
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
            aria-label="Close"
            className="absolute -top-12 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:scale-110 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Desktop: inside spread side-by-side. Mobile: vertical stack.
              Clicks here bubble to the modal content wrapper, which closes the modal. */}
          <div
            className={cn(
              "max-h-[85vh] gap-2 overflow-y-auto rounded-md md:gap-3",
              "flex flex-col md:grid",
              panelsPerSide === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            )}
          >
            {inside.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- intentional for direct sizing in modal
              <img
                key={i}
                src={src}
                alt={`${alt} — panel ${i + 1}`}
                className="h-auto w-full rounded-sm bg-white shadow-2xl"
              />
            ))}
          </div>

          <div className="mt-4 text-center" onClick={(e) => e.stopPropagation()}>
            <a
              href={pdfHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-subtitle text-sm tracking-wide text-white/90 uppercase hover:text-white hover:underline"
            >
              {t("download")}
            </a>
          </div>
        </div>
      </Modal>
    </>
  )
}
