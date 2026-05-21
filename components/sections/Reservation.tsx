// components/sections/Reservation.tsx
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Pill } from "@/components/ui/Pill"
import { Icon } from "@/components/ui/Icon"

const PHONE = "32470487252"

export function Reservation() {
  const t = useTranslations("reserve")
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(t("whatsappPrefill"))}`
  return (
    <section id="reserve" className="bg-bg py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="font-body text-ink/80 space-y-4">
            <p>{t("walkIns")}</p>
            <p>{t("groups")}</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Pill href={href} className="text-lg px-6 py-3">
              <Icon.Whatsapp className="w-5 h-5 mr-2" aria-hidden />
              {t("whatsappCta")}
            </Pill>
          </div>
        </div>
      </div>
    </section>
  )
}
