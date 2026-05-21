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
    <section id="reserve" className="bg-bg px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
          <div className="font-body text-ink/80 space-y-4">
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
