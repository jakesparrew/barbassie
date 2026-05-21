// components/sections/Hero.tsx
"use client"
import { useTranslations } from "next-intl"
import { Pill } from "@/components/ui/Pill"

export function Hero({ onHappeningClick }: { onHappeningClick: () => void }) {
  const t = useTranslations()
  return (
    <section
      id="hero"
      className="relative h-[100svh] w-full overflow-hidden text-white"
      aria-label="Bar Bassie"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero/hero-poster.jpg"
        aria-hidden
      >
        <source src="/hero/hero-1080.webm" type="video/webm" />
        <source src="/hero/hero-1080.mp4"  type="video/mp4" />
      </video>
      <img
        src="/hero/hero-poster.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover hidden motion-reduce:block"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" aria-hidden />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <h1 className="font-title text-[18vw] md:text-[12rem] leading-none tracking-tight drop-shadow-lg">
          BASSIE
        </h1>
        <p className="mt-6 font-subtitle uppercase tracking-widest text-sm md:text-base">
          {t("hero.tagline")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Pill href="#menu">{t("nav.menu")}</Pill>
          <Pill href="#reserve">{t("nav.reservation")}</Pill>
          <Pill onClick={onHappeningClick}>{t("nav.happening")}</Pill>
        </div>
      </div>

      <div className="absolute bottom-6 inset-x-0 z-10 px-4 text-center font-subtitle text-xs md:text-sm tracking-wider">
        <p>{t("hours.weekdays")} · {t("hours.weekends")} · {t("hours.closed")}</p>
      </div>
    </section>
  )
}
