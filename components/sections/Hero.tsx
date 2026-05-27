// components/sections/Hero.tsx
"use client"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { instagramUrl, mailtoUrl } from "@/lib/contact"

/**
 * Hero — matches the user's reference screenshot:
 *   - Full-bleed chrome video background (poster fallback for reduced-motion)
 *   - TOP-LEFT: INSTAGRAM   TOP-RIGHT: CONTACT (mailto:hello@barbassie.be)
 *   - Center: large BASSIE wordmark + tagline + 3-line hours + magenta hamburger
 *   - BOTTOM: venue address on 2 centered lines
 */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
} as const

export function Hero() {
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

      {/* Top corners: INSTAGRAM (left), CONTACT (right) */}
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

      {/* Center stack: BASSIE wordmark → tagline → hours → hamburger */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-20 pb-24 text-center md:pt-24 md:pb-28"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.14, delayChildren: 0.15 }}
      >
        {/* BASSIE wordmark — bigger again per user's reference. Keep an upper
            height cap so the rest of the stack always stays underneath. */}
        <motion.img
          variants={fadeUp}
          src="/logo-bassie.png"
          alt="BASSIE"
          className="h-auto max-h-[42vh] w-[90vw] max-w-[1100px] object-contain drop-shadow-2xl md:max-h-[48vh]"
        />

        {/* Tagline — sits directly under the wordmark. Tight margins so the
            small text reads as part of the logo lockup, not a separate block. */}
        <motion.p
          variants={fadeUp}
          className="font-body mt-1 text-[11px] leading-snug tracking-[0.2em] uppercase drop-shadow-lg md:mt-2 md:text-xs"
        >
          {t("hero.taglineLine1")}
          <br />
          {t("hero.taglineLine2Prefix")}{" "}
          <span className="text-[0.6em] tracking-normal underline underline-offset-2">
            {t("hero.taglineLine2Joiner")}
          </span>{" "}
          {t("hero.taglineLine2Suffix")}
        </motion.p>

        {/* Hours block — 3 lines, tight to the tagline */}
        <motion.div
          variants={fadeUp}
          className="font-body mt-3 space-y-1 text-[10px] leading-snug tracking-[0.18em] uppercase drop-shadow-lg md:mt-4 md:text-[11px]"
        >
          <p>{t("hours.weekdays")}</p>
          <p>{t("hours.weekends")}</p>
          <p>{t("hours.sunday")}</p>
        </motion.div>

        {/* Magenta 3-line hamburger */}
        <motion.div variants={fadeUp} className="mt-4 md:mt-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-accent h-8 w-8 drop-shadow-lg md:h-10 md:w-10"
            aria-hidden
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Bottom: venue address on 2 centered lines */}
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
