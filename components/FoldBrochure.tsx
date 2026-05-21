// components/FoldBrochure.tsx
"use client"
import { useState, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/cn"

type FoldBrochureProps = {
  /** Panel image URLs. Index 0 = cover. */
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
  const id = useId()

  // First N panels are the cover/back side; second N are the inside spread.
  const inside = panels.slice(panelsPerSide, panelsPerSide * 2)

  return (
    <div className="flex flex-col items-stretch gap-4">
      <h3 className="font-subtitle text-ink tracking-wide uppercase">{label}</h3>

      {/* Desktop: 3D fold */}
      <div className="relative hidden md:block">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`brochure-${id}`}
          className="focus-visible:ring-accent block w-full rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <motion.div
            className="relative mx-auto aspect-[3/4] w-full max-w-[420px]"
            style={{ perspective: 1200 }}
          >
            {/* Using motion.img intentionally for explicit 3D transform/positioning control */}
            <motion.img
              src={panels[0]}
              alt={alt}
              className="absolute inset-0 h-full w-full rounded-md object-cover shadow-xl"
              animate={{ rotateY: open ? -180 : 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: "left center", backfaceVisibility: "hidden" }}
            />
          </motion.div>
          <p className="font-body text-ink/70 mt-2 text-center text-sm motion-reduce:hidden">
            {open ? "" : t("tapToOpen")}
          </p>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              id={`brochure-${id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className={cn("mt-4 grid gap-2", panelsPerSide === 3 ? "grid-cols-3" : "grid-cols-2")}
              role="group"
              aria-label={label}
              onClick={() => setOpen(false)}
            >
              {inside.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- intentional: explicit positioning control in fold grid
                <img key={i} src={src} alt={alt} className="h-auto w-full rounded-sm shadow-md" />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: vertical stack of inside panels (no 3D) */}
      <div className="flex flex-col gap-3 md:hidden">
        {inside.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- intentional: explicit positioning control in mobile stack
          <img key={i} src={src} alt={alt} className="h-auto w-full rounded-sm shadow" />
        ))}
      </div>

      <a
        href={pdfHref}
        target="_blank"
        rel="noopener noreferrer"
        className="font-subtitle text-accent inline-flex items-center gap-2 self-center text-sm tracking-wide uppercase hover:underline"
      >
        {t("download")}
      </a>
    </div>
  )
}
