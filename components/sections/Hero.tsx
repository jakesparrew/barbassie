// components/sections/Hero.tsx
"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/cn"
import { instagramUrl } from "@/lib/contact"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
} as const

export function Hero({ onHappeningClick }: { onHappeningClick: () => void }) {
  const t = useTranslations()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [menuOpen])

  const navItems = [
    { label: t("nav.menu"), href: "#menu" },
    { label: t("nav.location"), href: "#location" },
    { label: t("nav.reservation"), href: "#reserve" },
    { label: t("nav.happening"), onClick: onHappeningClick },
  ] as const

  return (
    <section
      id="hero"
      className="relative h-[100svh] w-full overflow-hidden text-white"
      aria-label="Bar Bassie"
    >
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero/hero-poster.jpg"
        aria-hidden
      >
        <source src="/hero/hero-1080.mp4" type="video/mp4" />
      </video>
      {/* Poster fallback for prefers-reduced-motion */}
      {/* eslint-disable-next-line @next/next/no-img-element -- intentional poster fallback */}
      <img
        src="/hero/hero-poster.jpg"
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
        aria-hidden
      />
      {/* Dark grain overlay for legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
        aria-hidden
      />

      {/* Top bar — just INSTAGRAM left, CONTACT right (mockup p1) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="font-body absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 px-4 pt-5 text-xs tracking-wide uppercase md:px-8 md:pt-7 md:text-sm"
      >
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          {t("nav.instagram")}
        </a>
        <a href="#footer" className="hover:text-accent transition-colors">
          {t("nav.contact")}
        </a>
      </motion.div>

      {/* Center stack: BASSIE logo → tagline → hours → hamburger */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.14, delayChildren: 0.15 }}
      >
        {/* BASSIE wordmark */}
        {/* eslint-disable-next-line @next/next/no-img-element -- crisp transparent PNG, no optimization needed */}
        <motion.img
          variants={fadeUp}
          src="/logo-bassie.png"
          alt="BASSIE"
          className="w-[80vw] max-w-[900px] drop-shadow-2xl"
        />

        {/* Tagline (font-subtitle uppercase) */}
        <motion.p
          variants={fadeUp}
          className="font-subtitle mt-3 text-xs tracking-[0.18em] uppercase drop-shadow-lg md:text-sm"
        >
          {t("hero.taglineLine1")}
          <br />
          {t("hero.taglineLine2")}
        </motion.p>

        {/* Hours block — 3 lines stacked, smaller than tagline */}
        <motion.div
          variants={fadeUp}
          className="font-subtitle mt-6 text-[10px] leading-relaxed tracking-[0.15em] uppercase drop-shadow-lg md:text-[11px]"
        >
          <p>{t("hours.weekdays")}</p>
          <p>{t("hours.weekends")}</p>
          <p>{t("hours.closed")}</p>
        </motion.div>

        {/* Magenta hamburger / expanded menu */}
        <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center md:mt-10">
          {!menuOpen ? (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("nav.openMenu")}
              aria-expanded={false}
              className="text-accent focus-visible:ring-accent group flex h-12 w-12 items-center justify-center rounded-md transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:outline-none"
            >
              {/* Equal-bar (=) icon per mockup, not the 3-line hamburger */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="h-8 w-8 drop-shadow-lg"
                aria-hidden
              >
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
              </svg>
            </button>
          ) : (
            <nav
              aria-label="Hero navigation"
              className="animate-in fade-in slide-in-from-top-2 flex flex-col items-center gap-3 duration-300"
            >
              {navItems.map((item) => {
                const baseClass = cn(
                  "font-subtitle text-accent text-xl md:text-2xl tracking-widest uppercase",
                  "drop-shadow-lg transition-transform duration-150",
                  "hover:scale-105 hover:text-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1"
                )
                if ("href" in item) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={baseClass}
                    >
                      {item.label}
                    </a>
                  )
                }
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.onClick()
                      setMenuOpen(false)
                    }}
                    className={baseClass}
                  >
                    {item.label}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t("nav.closeMenu")}
                className="text-accent/70 hover:text-accent focus-visible:ring-accent mt-2 rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </nav>
          )}
        </motion.div>
      </motion.div>

      {/* Bottom address strip (mockup p1) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.9 }}
        className="font-body absolute inset-x-0 bottom-6 z-10 px-4 text-center text-[11px] tracking-[0.18em] uppercase drop-shadow-lg md:text-xs"
      >
        <p>{t("hero.address")}</p>
      </motion.div>
    </section>
  )
}
