// components/sections/Hero.tsx
"use client"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { instagramUrl, whatsappUrl, mailtoUrl, CONTACT } from "@/lib/contact"

/**
 * Hero — center stack matches the desktop reference:
 *   - Full-bleed chrome background (video + reduced-motion poster fallback)
 *   - Center: BASSIE wordmark + tagline + hours + 3-line hamburger
 *   - Bottom-left: @barbassie (Instagram)
 *   - Bottom-center: rooftop blurb + "reservation via WHATSAPP" link
 *   - Bottom-right: CONTACT (mailto:hello@barbassie.be)
 */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
} as const

const accountHandle = `@${CONTACT.instagramHandle.split(".")[0]}` // "@barbassie"

export function Hero() {
  const t = useTranslations()

  // Note: the hamburger is decorative for now (the StickyNav takes over once
  // the user scrolls past the hero). If we later want it to expand inline,
  // wire it through here.
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

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-16 pb-24 text-center md:pt-20 md:pb-28"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.14, delayChildren: 0.15 }}
      >
        {/* BASSIE wordmark */}
        <motion.img
          variants={fadeUp}
          src="/logo-bassie.png"
          alt="BASSIE"
          className="h-auto max-h-[28vh] w-full max-w-[640px] object-contain drop-shadow-2xl md:max-h-[34vh] md:max-w-[820px]"
        />

        {/* Tagline — small uppercase font-body, with tiny underlined "AND" mid-line */}
        <motion.p
          variants={fadeUp}
          className="font-body mt-5 text-[11px] leading-snug tracking-[0.2em] uppercase drop-shadow-lg md:text-xs"
        >
          {t("hero.taglineLine1")}
          <br />
          {t("hero.taglineLine2Prefix")}{" "}
          <span className="text-[0.6em] tracking-normal underline underline-offset-2">
            {t("hero.taglineLine2Joiner")}
          </span>{" "}
          {t("hero.taglineLine2Suffix")}
        </motion.p>

        {/* Hours block — 3 lines, same font as tagline, smaller */}
        <motion.div
          variants={fadeUp}
          className="font-body mt-4 space-y-1 text-[10px] leading-snug tracking-[0.18em] uppercase drop-shadow-lg md:text-[11px]"
        >
          <p>{t("hours.weekdays")}</p>
          <p>{t("hours.weekends")}</p>
          <p>{t("hours.sunday")}</p>
        </motion.div>

        {/* Magenta 3-line hamburger — purely visual cue for now */}
        <motion.div variants={fadeUp} className="mt-6 md:mt-8">
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

      {/* Bottom strip: @barbassie (left) · info block (center) · CONTACT mailto (right) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.9 }}
        className="font-body absolute inset-x-0 bottom-5 z-10 grid grid-cols-3 items-end gap-4 px-4 text-[10px] tracking-[0.18em] uppercase drop-shadow-lg md:bottom-6 md:px-8 md:text-xs"
      >
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent justify-self-start transition-colors"
        >
          {accountHandle}
        </a>

        <div className="space-y-1 justify-self-center text-center">
          <p>{t("hero.infoLine1")}</p>
          <p>
            {t("hero.infoLine2Prefix")}{" "}
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent underline underline-offset-2 transition-colors"
            >
              {t("hero.infoLine2Link")}
            </a>
          </p>
        </div>

        <a
          href={mailtoUrl()}
          className="hover:text-accent justify-self-end transition-colors"
        >
          {t("nav.contact")}
        </a>
      </motion.div>
    </section>
  )
}
