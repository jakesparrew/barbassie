// components/sections/Gallery.tsx
"use client"
import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Modal } from "@/components/ui/Modal"
import { RevealOnView } from "@/components/ui/RevealOnView"
import { cn } from "@/lib/cn"

type Photo = { src: string; alt: string }

const photos: Photo[] = [
  {
    src: "/gallery/interior-sofa.jpg",
    alt: "Bar Bassie interior: mint green curved sofa, chandelier, and rooftop window view",
  },
  {
    src: "/gallery/cocktails-rim.jpg",
    alt: "Two coupe cocktails with chili-salt rims being poured",
  },
  {
    src: "/gallery/oysters-trio.jpg",
    alt: "Trio of dressed oysters on ice in a metal bowl",
  },
  {
    src: "/gallery/charcuterie-paleta.jpg",
    alt: "Charcuterie plate with paleta iberico on Bassie-branded paper",
  },
  {
    src: "/gallery/cocktail-bassie-glass.jpg",
    alt: "Cucumber cocktail in a BASSIE-branded wine glass on a warm-lit shelf",
  },
  {
    src: "/gallery/ceviche-verbena.jpg",
    alt: "Ceviche with verbena leaves and olive oil drizzle on a moss-green surface",
  },
  {
    src: "/gallery/dessert-brulee.jpg",
    alt: "Crème brûlée with berries in a silver coupe",
  },
]

export function Gallery() {
  const t = useTranslations("gallery")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const active = activeIndex !== null ? photos[activeIndex] : null

  return (
    <section id="gallery" className="bg-bg px-4 py-24">
      <RevealOnView className="mx-auto max-w-6xl">
        {/* Heading: "BASSIE'S" as one cohesive piece of text in the same VTC
            Marsha Bold the logo uses, so BASSIE and 'S are proportionally
            matched (the prior PNG + separate 'S approach made the 'S look
            oversized because the logo PNG has transparent padding around the
            letters). Plus the small underlined "Gallery" kicker. */}
        <header className="text-center">
          <h2 className="font-subtitle text-accent text-6xl leading-[0.95] tracking-tight uppercase md:text-8xl">
            BASSIE&rsquo;S
          </h2>
          <p className="font-body text-ink mt-2 inline-block border-b border-current text-xs tracking-[0.25em] uppercase">
            {t("label")}
          </p>
        </header>

        {/* Mockup p6 shows a 2x2 grid on mobile (4 photos).
            We render a 2-col grid on mobile and reveal the rest from md+ in 3 cols. */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:hidden">
          {photos.slice(0, 4).map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.alt}`}
              className="focus-visible:ring-accent group relative block aspect-square w-full overflow-hidden rounded focus-visible:ring-2 focus-visible:outline-none"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
        <div className="mt-10 hidden columns-3 gap-3 md:block [&>button]:mb-3">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.alt}`}
              className="focus-visible:ring-accent group block w-full break-inside-avoid overflow-hidden rounded focus-visible:ring-2 focus-visible:outline-none"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={1200}
                height={1600}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </RevealOnView>

      {/* Lightbox */}
      <Modal
        open={active !== null}
        onClose={() => setActiveIndex(null)}
        ariaLabel={active?.alt ?? "Photo"}
      >
        {active && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
              className="absolute -top-12 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
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

            <Image
              src={active.src}
              alt={active.alt}
              width={1600}
              height={2400}
              priority
              className="max-h-[85vh] w-auto max-w-full rounded shadow-2xl"
            />

            {/* Prev / Next */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((i) =>
                      i === null ? null : (i - 1 + photos.length) % photos.length
                    )
                  }
                  aria-label="Previous photo"
                  className={cn(
                    "absolute top-1/2 left-2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full",
                    "bg-white/10 text-white backdrop-blur transition hover:bg-white/20",
                    "focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  )}
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
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length))
                  }
                  aria-label="Next photo"
                  className={cn(
                    "absolute top-1/2 right-2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full",
                    "bg-white/10 text-white backdrop-blur transition hover:bg-white/20",
                    "focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  )}
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
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </section>
  )
}
