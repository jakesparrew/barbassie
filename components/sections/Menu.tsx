// components/sections/Menu.tsx
"use client"
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { FoldBrochure } from "@/components/FoldBrochure"
import { RevealOnView } from "@/components/ui/RevealOnView"

// panels[0] = front cover (the burgundy / green hand-cut artwork) shown on the
// card; panels[1..] = the readable menu columns shown, in order, in the modal
// (all pages of the extracted PDF — page 1 columns then page 2 columns).
const drinksPanels = [
  "/menu/drinks/cover.jpg", // burgundy cover artwork
  "/menu/drinks/panel-1.jpg",
  "/menu/drinks/panel-2.jpg",
  "/menu/drinks/panel-3.jpg",
  "/menu/drinks/panel-4.jpg",
  "/menu/drinks/panel-5.jpg",
  "/menu/drinks/panel-6.jpg",
]
const foodPanels = [
  "/menu/food/cover.jpg", // green cover artwork
  "/menu/food/panel-1.jpg",
  "/menu/food/panel-2.jpg",
]

export function Menu() {
  const t = useTranslations("menu")
  return (
    <section id="menu" className="bg-bg px-4 py-24">
      <RevealOnView className="mx-auto max-w-6xl">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <FoldBrochure
            label={t("drinks")}
            panels={drinksPanels}
            panelsPerSide={3}
            pdfHref="/menu/bar-bassie-drinks.pdf"
            alt={`Bar Bassie ${t("drinks")} menu`}
          />
          <FoldBrochure
            label={t("food")}
            panels={foodPanels}
            panelsPerSide={2}
            pdfHref="/menu/bar-bassie-food.pdf"
            alt={`Bar Bassie ${t("food")} menu`}
          />
        </div>
      </RevealOnView>
    </section>
  )
}
