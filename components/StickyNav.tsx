// components/StickyNav.tsx
"use client"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Pill } from "@/components/ui/Pill"
import { cn } from "@/lib/cn"

export function StickyNav() {
  const t = useTranslations("nav")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-transform duration-300",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
      aria-hidden={!visible}
    >
      <div className="bg-bg/90 mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between gap-4 px-4 shadow-sm backdrop-blur-md md:px-8">
        {/* Real BASSIE wordmark — cropped PNG colorized to ink (burgundy) via
            CSS mask, so it matches the hero wordmark instead of being styled
            text. Aspect ratio is the exact aspect of the cropped logo. */}
        <a href="#hero" aria-label="BASSIE" className="inline-block">
          <span
            role="img"
            aria-hidden
            className="bg-ink block h-5 md:h-6"
            style={{
              aspectRatio: "3144 / 584",
              maskImage: "url(/logo-bassie.png)",
              WebkitMaskImage: "url(/logo-bassie.png)",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "left center",
              WebkitMaskPosition: "left center",
            }}
          />
        </a>
        <div className="flex items-center gap-2">
          <Pill href="#menu" className="hidden sm:inline-flex">
            {t("menu")}
          </Pill>
          <Pill href="#reserve" className="hidden sm:inline-flex">
            {t("reservation")}
          </Pill>
          <Pill href="#events">{t("happening")}</Pill>
        </div>
      </div>
    </header>
  )
}
