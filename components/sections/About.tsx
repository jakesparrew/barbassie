// components/sections/About.tsx
"use client"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { RevealOnView } from "@/components/ui/RevealOnView"

export function About() {
  const t = useTranslations("about")
  return (
    <section id="about" className="relative overflow-hidden px-4 py-32 md:py-40">
      {/* Background: bar interior shot */}
      <Image
        src="/gallery/interior-sofa.jpg"
        alt=""
        fill
        priority={false}
        sizes="100vw"
        className="absolute inset-0 object-cover"
        aria-hidden
      />
      {/* Dark overlay so the off-white & magenta copy stays legible */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75"
        aria-hidden
      />

      <RevealOnView className="relative mx-auto max-w-3xl text-center text-[color:var(--color-bg)]">
        <blockquote className="font-subtitle text-accent text-2xl leading-tight tracking-wide uppercase drop-shadow-lg md:text-4xl">
          {t("pullQuote")}
        </blockquote>
        <p className="font-body mt-8 text-lg leading-relaxed drop-shadow-md md:text-xl">
          {t("body")}
        </p>
      </RevealOnView>
    </section>
  )
}
