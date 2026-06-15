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
    <section
      id="reserve"
      className="relative flex min-h-[min(640px,75svh)] flex-col items-center overflow-hidden px-4 py-16 text-center md:py-20"
    >
      {/* Background: warm-lit cocktail shot.
          We keep the gradient light so the cucumber-cocktail glass stays the visual anchor. */}
      {!bgFailed && (
        <Image
          src="/gallery/cocktail-bassie-glass.jpg"
          alt=""
          fill
          sizes="100vw"
          priority={false}
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
            : "bg-gradient-to-b from-black/30 via-black/15 to-black/55"
        )}
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-[color:var(--color-bg)]">
        <SectionLabel>{t("label").toUpperCase()}</SectionLabel>

        <p
          className={cn(
            "font-body mt-6 max-w-xl text-sm leading-relaxed tracking-wide uppercase",
            "drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] md:text-base"
          )}
        >
          {t.rich("groups", {
            pink: (chunks) => <span className="text-accent">{chunks}</span>,
          })}
        </p>
        <p
          className={cn(
            "font-body mt-3 text-sm tracking-wide uppercase",
            "drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] md:text-base"
          )}
        >
          {t("walkIns")}
        </p>
      </div>

      {/* Spacer pushes the CTA toward the bottom of the section,
          letting the glass photo breathe in the middle */}
      <div className="grow" aria-hidden />

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "relative z-10 mt-12",
          "inline-flex w-full max-w-md items-center justify-center gap-3 md:w-auto md:max-w-none md:px-10",
          "rounded-full px-8 py-4",
          "bg-[#25D366] text-white",
          "font-subtitle text-base tracking-wide uppercase",
          "shadow-[0_18px_50px_-12px_rgba(37,211,102,0.7)]",
          "transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1FB855] hover:shadow-[0_22px_60px_-14px_rgba(37,211,102,0.85)]",
          "active:translate-y-0",
          "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
        )}
      >
        <Icon.Whatsapp className="h-5 w-5 shrink-0" aria-hidden />
        <span>{t("whatsappCta")}</span>
      </a>
    </section>
  )
}
