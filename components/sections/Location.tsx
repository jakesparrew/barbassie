// components/sections/Location.tsx
"use client"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Icon } from "@/components/ui/Icon"
import { RevealOnView } from "@/components/ui/RevealOnView"

export function Location() {
  const t = useTranslations("location")
  return (
    <section id="location" className="bg-bg px-4 py-24">
      <RevealOnView className="mx-auto max-w-6xl">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <p className="font-body text-ink/80 mx-auto mt-8 max-w-3xl text-center text-lg leading-relaxed whitespace-pre-line">
          {t("body")}
        </p>
        <div className="relative mt-12 aspect-[3/2] overflow-hidden rounded">
          <Image
            src="/gallery/13.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width:1152px) 100vw, 1152px"
          />
        </div>

        <div className="mt-12 flex flex-col items-center gap-2">
          <p className="font-body text-ink text-xs tracking-[0.18em] uppercase md:text-sm">
            Wintercircus, {t("addressLine1")}, {t("addressLine2")}
          </p>
          <a
            href="https://maps.google.com/?q=Lammerstraat+13,+9000+Gent"
            target="_blank"
            rel="noopener noreferrer"
            className="font-subtitle text-accent inline-flex items-center gap-1.5 text-xs tracking-wide uppercase hover:underline"
          >
            <Icon.MapPin className="h-3.5 w-3.5" /> {t("directions")}
          </a>
        </div>
      </RevealOnView>
    </section>
  )
}
