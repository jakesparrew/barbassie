// components/sections/Location.tsx
"use client"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Icon } from "@/components/ui/Icon"
import { RevealOnView } from "@/components/ui/RevealOnView"

// Using gallery shots until we have dedicated Wintercircus venue photography.
// Drop new files into /public/photos/ and switch the paths back when ready.
const photos = [
  "/gallery/interior-sofa.jpg",
  "/gallery/cocktail-bassie-glass.jpg",
  "/gallery/oysters-trio.jpg",
  "/gallery/cocktails-rim.jpg",
]

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
          {photos.map((src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded">
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
        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="font-subtitle text-ink tracking-wide uppercase">
            {t("addressLine1")} · {t("addressLine2")}
          </p>
          <a
            href="https://maps.google.com/?q=Lammerstraat+13,+9000+Gent"
            target="_blank"
            rel="noopener noreferrer"
            className="font-subtitle text-accent inline-flex items-center gap-2 text-sm tracking-wide uppercase hover:underline"
          >
            <Icon.MapPin className="h-4 w-4" /> {t("directions")}
          </a>
        </div>
      </RevealOnView>
    </section>
  )
}
