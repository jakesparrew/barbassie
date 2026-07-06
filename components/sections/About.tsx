// components/sections/About.tsx
"use client"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { RevealOnView } from "@/components/ui/RevealOnView"

/**
 * About — mockup-aligned (CONTACT.pdf p4):
 * - Section is at least 100svh tall; the interior photo fills it via Image.fill
 * - Dark band sits at the TOP and auto-sizes to the text content (pull quote
 *   + body + padding). Below the band, the photo shows at full brightness.
 *   Auto-sizing means the band always wraps the text exactly — no fragile
 *   percentage tweaks per breakpoint when the body re-wraps.
 */
export function About() {
  const t = useTranslations("about")
  return (
    <section id="about" className="relative min-h-[100svh] overflow-hidden">
      {/* Background: gallery photo 8 */}
      <Image
        src="/gallery/8.jpg"
        alt=""
        fill
        priority={false}
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />

      {/* Text band — solid dark backdrop that auto-sizes to its content.
          Padding here defines the band's vertical extent above and below the
          text; no fixed height percentages. */}
      <div className="relative bg-black/70 px-4 pt-24 pb-16 md:px-8 md:pt-32 md:pb-20">
        <RevealOnView className="mx-auto w-full max-w-3xl text-[color:var(--color-bg)]">
          <blockquote className="font-subtitle text-accent text-right text-4xl leading-[0.95] tracking-tight uppercase md:text-6xl">
            {t("pullQuote")}
          </blockquote>
          <p className="font-body mt-8 max-w-xl text-left text-sm leading-relaxed tracking-wide uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] md:text-base">
            {t("body")}
          </p>
        </RevealOnView>
      </div>
    </section>
  )
}
