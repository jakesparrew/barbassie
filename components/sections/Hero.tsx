// components/sections/Hero.tsx
"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { instagramUrl, mailtoUrl } from "@/lib/contact"
import { cn } from "@/lib/cn"

/**
 * Hero — matches the user's reference screenshot:
 *   - Full-bleed chrome video background (poster fallback for reduced-motion)
 *   - TOP-LEFT: INSTAGRAM   TOP-RIGHT: CONTACT (mailto)
 *   - Center: BASSIE wordmark + tagline + 3-line hours + 3-bar hamburger
 *     The hamburger toggles an inline nav (Menu / Location / Reservation / Happening)
 *   - BOTTOM: venue address on 2 centered lines
 */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
} as const

export function Hero() {
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

  // All hero nav items are anchor links now — Happening scrolls to the
  // Events carousel section instead of opening a modal.
  const navItems = [
    { label: t("nav.menu"), href: "#menu" },
    { label: t("nav.location"), href: "#location" },
    { label: t("nav.reservation"), href: "#reserve" },
    { label: t("nav.happening"), href: "#events" },
  ] as const

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
        <source src="/hero/hero-1080.mp4" type="video/mp4" />
      </video>
      {/* eslint-disable-next-line @next/next/no-img-element -- reduced-motion poster fallback */}
      <img
        src="/hero/hero-poster.jpg"
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/15" aria-hidden />

      {/* Top corners */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="font-body absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 px-4 pt-5 text-xs tracking-[0.18em] uppercase drop-shadow-lg md:px-8 md:pt-7 md:text-sm"
      >
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          {t("nav.instagram")}
        </a>
        <a href={mailtoUrl()} className="hover:text-accent transition-colors">
          {t("nav.contact")}
        </a>
      </motion.div>

      {/* Center stack. pointer-events-none on the full-height column so the
          top-corner INSTAGRAM / CONTACT links (siblings with the same z-10)
          stay clickable — the hamburger below re-enables pointer events on
          itself so it can still receive clicks. */}
      <motion.div
        className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-4 pt-20 pb-24 text-center md:pt-24 md:pb-28"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.14, delayChildren: 0.15 }}
      >
        {/* BASSIE wordmark — using the tight-cropped PNG (no transparent padding) */}
        <motion.img
          variants={fadeUp}
          src="/logo-bassie.png"
          alt="BASSIE"
          className="h-auto w-[90vw] max-w-[1100px] object-contain drop-shadow-2xl"
        />

        {/* Tagline + hours block — heavy VTC Marsha Bold per the user's
            reference (the geometric Gothic Regular reads too thin here). */}
        <motion.p
          variants={fadeUp}
          className="font-subtitle mt-4 text-[11px] leading-snug tracking-[0.18em] uppercase drop-shadow-lg md:mt-6 md:text-sm"
        >
          {t("hero.taglineLine1")}
          <br />
          {t("hero.taglineLine2Prefix")}{" "}
          <span className="text-[0.65em] tracking-normal underline underline-offset-2">
            {t("hero.taglineLine2Joiner")}
          </span>{" "}
          {t("hero.taglineLine2Suffix")}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="font-subtitle mt-3 space-y-1 text-[10px] leading-snug tracking-[0.16em] uppercase drop-shadow-lg md:mt-4 md:text-xs"
        >
          <p>{t("hours.weekdays")}</p>
          <p>{t("hours.weekends")}</p>
          <p>{t("hours.sunday")}</p>
        </motion.div>

        {/* Hamburger / expanded nav — pointer-events-auto re-enables clicks
            inside the pointer-events-none center column above. */}
        <motion.div
          variants={fadeUp}
          className="pointer-events-auto mt-5 flex flex-col items-center md:mt-7"
        >
          <AnimatePresence initial={false} mode="wait">
            {!menuOpen ? (
              <motion.button
                key="bars"
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t("nav.openMenu")}
                aria-expanded={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-accent focus-visible:ring-accent group flex h-12 w-12 items-center justify-center rounded-md transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="h-8 w-8 drop-shadow-lg md:h-10 md:w-10"
                  aria-hidden
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </motion.button>
            ) : (
              <motion.nav
                key="nav"
                aria-label="Hero navigation"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col items-center gap-3"
              >
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "font-subtitle text-accent text-xl md:text-2xl tracking-widest uppercase",
                      "drop-shadow-lg transition-transform duration-150",
                      "hover:scale-105 hover:text-white",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1"
                    )}
                  >
                    {item.label}
                  </a>
                ))}
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
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Bottom address — 2 centered lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.9 }}
        className="font-body absolute inset-x-0 bottom-6 z-10 px-4 text-center text-[11px] leading-relaxed tracking-[0.2em] uppercase drop-shadow-lg md:bottom-8 md:text-xs"
      >
        <p>{t("hero.addressLine1")}</p>
        <p>{t("hero.addressLine2")}</p>
      </motion.div>
    </section>
  )
}
