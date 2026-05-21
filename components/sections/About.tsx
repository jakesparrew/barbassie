// components/sections/About.tsx
import { useTranslations } from "next-intl"

export function About() {
  const t = useTranslations("about")
  return (
    <section id="about" className="bg-bg px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <blockquote className="font-subtitle text-accent text-2xl leading-tight tracking-wide uppercase md:text-3xl">
          {t("pullQuote")}
        </blockquote>
        <p className="font-body text-ink/80 mt-8 text-lg leading-relaxed">{t("body")}</p>
      </div>
    </section>
  )
}
