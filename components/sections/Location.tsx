// components/sections/Location.tsx
import Image from "next/image"
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Icon } from "@/components/ui/Icon"

const photos = [
  "/photos/wintercircus-dome.jpg",
  "/photos/wintercircus-interior.jpg",
  "/photos/wintercircus-rooftop.jpg",
  "/photos/wintercircus-exterior.jpg",
]

export function Location() {
  const t = useTranslations("location")
  return (
    <section id="location" className="bg-bg py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <p className="mt-8 max-w-3xl mx-auto font-body text-ink/80 text-lg leading-relaxed text-center">
          {t("body")}
        </p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded">
              <Image src={src} alt="" fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="font-subtitle uppercase tracking-wide text-ink">
            {t("addressLine1")} · {t("addressLine2")}
          </p>
          <a
            href="https://maps.google.com/?q=Lammerstraat+13,+9000+Gent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-subtitle uppercase text-sm tracking-wide text-accent hover:underline"
          >
            <Icon.MapPin className="w-4 h-4" /> {t("directions")}
          </a>
        </div>
      </div>
    </section>
  )
}
