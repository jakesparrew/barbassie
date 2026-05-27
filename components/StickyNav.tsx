// components/StickyNav.tsx
"use client"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Pill } from "@/components/ui/Pill"
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher"
import { cn } from "@/lib/cn"

export function StickyNav({ onHappeningClick }: { onHappeningClick: () => void }) {
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
        <a href="#hero" className="font-subtitle text-ink text-2xl tracking-tight">
          BASSIE
        </a>
        <div className="flex items-center gap-2">
          <Pill href="#menu" className="hidden sm:inline-flex">
            {t("menu")}
          </Pill>
          <Pill href="#reserve" className="hidden sm:inline-flex">
            {t("reservation")}
          </Pill>
          <Pill onClick={onHappeningClick}>{t("happening")}</Pill>
          <LocaleSwitcher className="ml-2" />
        </div>
      </div>
    </header>
  )
}
