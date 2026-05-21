// components/sections/About.tsx
import { useTranslations } from "next-intl"

export function About() {
  const t = useTranslations("about")
  return (
    <section id="about" className="bg-bg py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <blockquote className="font-subtitle uppercase tracking-wide text-accent text-2xl md:text-3xl leading-tight">
          {t("pullQuote")}
        </blockquote>
        <p className="mt-8 font-body text-ink/80 text-lg leading-relaxed">{t("body")}</p>
      </div>
    </section>
  )
}
