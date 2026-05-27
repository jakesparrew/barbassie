// components/sections/Hero.tsx
"use client"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { instagramUrl, whatsappUrl, CONTACT } from "@/lib/contact"

/**
 * Hero — matches the user-supplied desktop reference exactly:
 *   - Full-bleed chrome/oyster background (video + reduced-motion poster fallback)
 *   - Center: BASSIE wordmark + tagline ("COOLING DRINKS / SMALL PLATES <small>AND</small> STUNNING VIEWS")
 *     + three hours lines stacked underneath
 *   - Bottom-left: @INSTAGRAM
 *   - Bottom-center: "ROOFTOP BAR - WINTERCIRCUS, ..." + "JUST WALK IN ... reservation via WHATSAPP"
 *   - Bottom-right: CONTACT
 *   - No hamburger / no inline nav — navigation flows from the StickyNav after scroll
 */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
} as const

const accountHandle = `@${CONTACT.instagramHandle.split(".")[0]}` // "@barbassie"

export function Hero() {
  const t = useTranslations()

  return (
    <section
      id="hero"
      className="relative h-[100svh] w-full overflow-hidden text-white"
      aria-label="Bar Bassie"
    >
      {/* Background video (chrome / oyster shell loop). Reduced-motion users get the poster. */}
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
      {/* eslint-disable-next-line @next/next/no-img-element -- intentional poster fallback */}
      <img
        src="/hero/hero-poster.jpg"
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
        aria-hidden
      />
      {/* Slight uniform vignette so white text stays readable across the dark center */}
      <div className="absolute inset-0 bg-black/15" aria-hidden />

      {/* Center stack: BASSIE wordmark + tagline + hours, all centered */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.14, delayChildren: 0.15 }}
      >
        {/* BASSIE wordmark (VTC Marsha Bold, white) */}
        {/* eslint-disable-next-line @next/next/no-img-element -- crisp transparent PNG, no optimization needed */}
        <motion.img
          variants={fadeUp}
          src="/logo-bassie.png"
          alt="BASSIE"
          className="h-auto max-h-[28vh] w-full max-w-[640px] object-contain drop-shadow-2xl md:max-h-[34vh] md:max-w-[820px]"
        />

        {/* Tagline — small uppercase font-body, with mid-word "AND" rendered tiny + underlined */}
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

        {/* Hours block — 3 lines, even smaller, same font as tagline */}
        <motion.div
          variants={fadeUp}
          className="font-body mt-4 space-y-1 text-[10px] leading-snug tracking-[0.18em] uppercase drop-shadow-lg md:text-[11px]"
        >
          <p>{t("hours.weekdays")}</p>
          <p>{t("hours.weekends")}</p>
          <p>{t("hours.sunday")}</p>
        </motion.div>
      </motion.div>

      {/* Bottom strip: @INSTAGRAM (left) · info block (center) · CONTACT (right) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.9 }}
        className="font-body absolute inset-x-0 bottom-5 z-10 grid grid-cols-3 items-end gap-4 px-4 text-[10px] tracking-[0.18em] uppercase drop-shadow-lg md:bottom-6 md:px-8 md:text-xs"
      >
        {/* Bottom-left */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent justify-self-start transition-colors"
        >
          {accountHandle}
        </a>

        {/* Bottom-center: 2 info lines */}
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

        {/* Bottom-right */}
        <a href="#footer" className="hover:text-accent justify-self-end transition-colors">
          {t("nav.contact")}
        </a>
      </motion.div>
    </section>
  )
}
