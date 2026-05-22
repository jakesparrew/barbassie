// components/sections/Reservation.tsx
"use client"
import Image from "next/image"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Icon } from "@/components/ui/Icon"
import { cn } from "@/lib/cn"

const PHONE = "32470487252"

export function Reservation() {
  const t = useTranslations("reserve")
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(t("whatsappPrefill"))}`
  const [bgFailed, setBgFailed] = useState(false)

  return (
    <section id="reserve" className="relative overflow-hidden px-4 py-24 md:py-32">
      {/* Background: warm-lit cocktail shot. Falls back to a burgundy gradient
          if the source isn't on disk yet. */}
      {!bgFailed && (
        <Image
          src="/gallery/cocktail-bassie-glass.jpg"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 object-cover"
          onError={() => setBgFailed(true)}
          aria-hidden
        />
      )}
      <div
        className={cn(
          "absolute inset-0",
          bgFailed
            ? "bg-gradient-to-b from-[#1a0708] via-[color:var(--color-ink)] to-[#1a0708]"
            : "bg-gradient-to-b from-black/65 via-black/45 to-black/75"
        )}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-[color:var(--color-bg)]">
        <SectionLabel className="text-accent text-center drop-shadow-lg">
          {t("label").toUpperCase()}
        </SectionLabel>

        <div className="mt-10 grid items-center gap-10 md:mt-14 md:grid-cols-2 md:gap-12">
          <div className="font-body space-y-4 text-center drop-shadow-md md:text-left">
            <p className="text-lg leading-relaxed">{t("walkIns")}</p>
            <p className="text-lg leading-relaxed">{t("groups")}</p>
          </div>

          <div className="flex justify-center md:justify-end">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                // Sizing — full width on mobile, sized to content on desktop
                "w-full max-w-sm md:w-auto",
                // Touch target — generous on mobile
                "inline-flex items-center justify-center gap-3",
                "rounded-full px-8 py-4 md:px-7 md:py-4",
                // Visual weight
                "bg-accent text-white",
                "font-subtitle text-base tracking-wide uppercase md:text-sm",
                "shadow-[0_10px_40px_-10px_rgba(224,54,183,0.55)]",
                // Hover / press
                "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_rgba(224,54,183,0.7)]",
                "active:translate-y-0 active:shadow-[0_6px_20px_-6px_rgba(224,54,183,0.5)]",
                // Focus ring on the lit background
                "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
              )}
            >
              <Icon.Whatsapp className="h-5 w-5 shrink-0" aria-hidden />
              <span>{t("whatsappCta")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
