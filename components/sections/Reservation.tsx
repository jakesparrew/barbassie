// components/sections/Reservation.tsx
import Image from "next/image"
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Pill } from "@/components/ui/Pill"
import { Icon } from "@/components/ui/Icon"

const PHONE = "32470487252"

export function Reservation() {
  const t = useTranslations("reserve")
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(t("whatsappPrefill"))}`
  return (
    <section id="reserve" className="relative overflow-hidden px-4 py-28 md:py-36">
      {/* Background: warm-lit cocktail shot */}
      <Image
        src="/gallery/cocktail-bassie-glass.jpg"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-[color:var(--color-bg)]">
        <SectionLabel className="text-accent text-center drop-shadow-lg">
          {t("label").toUpperCase()}
        </SectionLabel>
        <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
          <div className="font-body space-y-4 drop-shadow-md">
            <p>{t("walkIns")}</p>
            <p>{t("groups")}</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Pill href={href} className="px-6 py-3 text-lg">
              <Icon.Whatsapp className="mr-2 h-5 w-5" aria-hidden />
              {t("whatsappCta")}
            </Pill>
          </div>
        </div>
      </div>
    </section>
  )
}
