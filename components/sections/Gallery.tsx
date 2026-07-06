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
    src: "/gallery/1.jpg",
    alt: "Ceviche with verbena leaves and olive oil on a metal plate",
  },
  {
    src: "/gallery/2.jpg",
    alt: "Sliced Ibérico charcuterie on Bassie-branded paper",
  },
  {
    src: "/gallery/3.jpg",
    alt: "Cucumber cocktail in a BASSIE-branded wine glass beside a globe",
  },
  {
    src: "/gallery/4.jpg",
    alt: "Cocktail poured into a coupe with a chili-salt rim",
  },
  {
    src: "/gallery/5.jpg",
    alt: "Crème brûlée with berries in a silver coupe",
  },
  {
    src: "/gallery/7.jpg",
    alt: "Trio of dressed oysters on ice in a metal bowl",
  },
  {
    src: "/gallery/9.jpg",
    alt: "BASSIE-branded card on a silver tray with cutlery",
  },
  {
    src: "/gallery/14.jpg",
    alt: "Creamy small plate topped with herbs and cucumber",
  },
  {
    src: "/gallery/15.jpg",
    alt: "Table spread of small plates, charcuterie and drinks",
  },
  {
    src: "/gallery/16.jpg",
    alt: "Rooftop terrace garden with a Champagne bucket",
  },
  {
    src: "/gallery/17.jpg",
    alt: "Spritz cocktail held up against the Ghent skyline",
  },
  {
    src: "/gallery/18.jpg",
    alt: "Overhead of a round table full of cocktails and bites",
  },
]

export function Gallery() {
  const t = useTranslations("gallery")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const active = activeIndex !== null ? photos[activeIndex] : null

  return (
    <section id="gallery" className="bg-bg px-4 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Heading: the BASSIE'S wordmark image (designer-supplied, cropped
            tight) colorized to magenta via CSS mask, plus the small underlined
            "Gallery" kicker below it. Single image — no separate 'S.
            Only the header fades in on scroll; the tall photo grid renders
            unconditionally so it can't get stuck hidden when it's taller than
            the viewport (framer's whileInView amount can't be reached then). */}
        <RevealOnView>
        <header className="flex flex-col items-center">
          <h2
            role="img"
            aria-label="Bassie's"
            className="bg-accent block h-14 w-auto md:h-24"
            style={{
              // Exact aspect of the cropped wordmark (2684 x 424); width
              // follows height so a single height knob controls scale.
              aspectRatio: "2684 / 424",
              maskImage: "url(/logo-bassies.png)",
              WebkitMaskImage: "url(/logo-bassies.png)",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
          <p className="font-body text-ink mt-3 inline-block border-b border-current text-xs tracking-[0.25em] uppercase">
            {t("label")}
          </p>
        </header>
        </RevealOnView>

        {/* Two photos per row on every screen; masonry keeps each photo's
            natural aspect ratio. */}
        <div className="mt-10 columns-2 gap-3 [&>button]:mb-3">
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
                sizes="50vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

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
