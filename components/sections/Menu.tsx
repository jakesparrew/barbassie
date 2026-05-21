// components/sections/Menu.tsx
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { FoldBrochure } from "@/components/FoldBrochure"

const drinksPanels = [
  "/menu/drinks/panel-1.jpg",
  "/menu/drinks/panel-2.jpg",
  "/menu/drinks/panel-3.jpg",
  "/menu/drinks/panel-4.jpg",
  "/menu/drinks/panel-5.jpg",
  "/menu/drinks/panel-6.jpg",
]
const foodPanels = [
  "/menu/food/panel-1.jpg",
  "/menu/food/panel-2.jpg",
  "/menu/food/panel-3.jpg",
  "/menu/food/panel-4.jpg",
]

export function Menu() {
  const t = useTranslations("menu")
  return (
    <section id="menu" className="bg-bg py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <div className="mt-12 grid md:grid-cols-2 gap-12">
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
      </div>
    </section>
  )
}
