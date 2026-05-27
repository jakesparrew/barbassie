// components/sections/Location.tsx
"use client"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Icon } from "@/components/ui/Icon"
import { RevealOnView } from "@/components/ui/RevealOnView"

// Mockup shows 2 venue tiles on mobile (rooftop + interior).
// We expose 4 in the array but only render 2 on mobile / 4 on desktop.
const photos = [
  "/gallery/interior-sofa.jpg",
  "/gallery/cocktail-bassie-glass.jpg",
  "/gallery/oysters-trio.jpg",
  "/gallery/cocktails-rim.jpg",
]

const FLOORPLAN = "/photos/wintercircus-floorplan.jpg"

export function Location() {
  const t = useTranslations("location")
  return (
    <section id="location" className="bg-bg px-4 py-24">
      <RevealOnView className="mx-auto max-w-6xl">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <p className="font-body text-ink/80 mx-auto mt-8 max-w-3xl text-center text-lg leading-relaxed">
          {t("body")}
        </p>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.map((src, i) => (
            <div
              key={src}
              className={
                // Mockup shows 2 tiles on mobile; reveal the other 2 from md+
                i >= 2
                  ? "relative hidden aspect-square overflow-hidden rounded md:block"
                  : "relative aspect-square overflow-hidden rounded"
              }
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>

        {/* Wintercircus floorplan — entrances + elevator to the 4th-floor boardroom (Bar Bassie). */}
        <figure className="mt-8 overflow-hidden rounded">
          <Image
            src={FLOORPLAN}
            alt="Wintercircus floorplan: entrances from Sint-Pietersnieuwstraat, Makeba Plein, and Lammerstraat 13. Elevator to the 4th-floor boardroom where Bar Bassie lives."
            width={1600}
            height={960}
            sizes="(max-width:768px) 100vw, 1100px"
            className="bg-bg h-auto w-full"
          />
          <figcaption className="font-body text-ink/60 mt-3 text-center text-[10px] tracking-[0.2em] uppercase">
            {t("floorplanCaption")}
          </figcaption>
        </figure>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="font-body text-ink text-xs tracking-[0.18em] uppercase md:text-sm">
            Wintercircus, {t("addressLine1")}, {t("addressLine2")}
          </p>
          <a
            href="https://maps.google.com/?q=Lammerstraat+13,+9000+Gent"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-accent inline-flex items-center gap-1.5 text-xs tracking-wide uppercase hover:underline"
          >
            <Icon.MapPin className="h-3.5 w-3.5" /> {t("directions")}
          </a>
        </div>
      </RevealOnView>
    </section>
  )
}
