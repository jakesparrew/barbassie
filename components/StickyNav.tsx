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
        "fixed top-0 inset-x-0 z-40 transition-transform duration-300",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-[var(--nav-h)] flex items-center justify-between gap-4 bg-bg/90 backdrop-blur-md shadow-sm">
        <a href="#hero" className="font-title text-2xl tracking-tight text-ink">BASSIE</a>
        <div className="flex items-center gap-2">
          <Pill href="#menu" className="hidden sm:inline-flex">{t("menu")}</Pill>
          <Pill href="#reserve" className="hidden sm:inline-flex">{t("reservation")}</Pill>
          <Pill onClick={onHappeningClick}>{t("happening")}</Pill>
          <LocaleSwitcher className="ml-2" />
        </div>
      </div>
    </header>
  )
}
