// components/sections/About.tsx
"use client"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { RevealOnView } from "@/components/ui/RevealOnView"

/**
 * About — mockup-aligned (CONTACT.pdf p4):
 * - Section near-full viewport so the interior photo dominates
 * - Pull quote in wide-bold VTC Marsha, right-aligned, BIG
 * - Body in uppercase font-body, left-aligned in a constrained column
 * - Light gradient overlay so the chandelier + ceiling stay visible up top
 */
export function About() {
  const t = useTranslations("about")
  return (
    <section
      id="about"
      className="relative flex min-h-[100svh] items-start overflow-hidden px-4 pt-24 pb-32 md:px-8 md:pt-32"
    >
      {/* Background: the iconic mint-sofa + chandelier + Ghent skyline interior shot */}
      <Image
        src="/gallery/interior-sofa.jpg"
        alt=""
        fill
        priority={false}
        sizes="100vw"
        className="absolute inset-0 object-cover object-center"
        aria-hidden
      />
      {/* Top-weighted overlay per mockup: dark in the upper half (where the pull
          quote + body sit so the magenta + white stay legible), fading to
          transparent across the middle, leaving the lower half of the photo
          (bar + chandelier + sofa) untouched. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0) 55%)",
        }}
        aria-hidden
      />

      <RevealOnView className="relative mx-auto w-full max-w-3xl text-[color:var(--color-bg)]">
        <blockquote className="font-subtitle text-accent text-right text-4xl leading-[0.95] tracking-tight uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] md:text-6xl">
          {t("pullQuote")}
        </blockquote>
        <p className="font-body mt-8 max-w-xl text-left text-sm leading-relaxed tracking-wide uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] md:text-base">
          {t("body")}
        </p>
      </RevealOnView>
    </section>
  )
}
