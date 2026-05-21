// components/sections/Gallery.tsx
import Image from "next/image"
import { useTranslations } from "next-intl"
import { SectionLabel } from "@/components/ui/SectionLabel"

const photos = [
  "/photos/gallery-1.jpg",
  "/photos/gallery-2.jpg",
  "/photos/gallery-3.jpg",
  "/photos/gallery-4.jpg",
  "/photos/gallery-5.jpg",
  "/photos/gallery-6.jpg",
]

export function Gallery() {
  const t = useTranslations("gallery")
  return (
    <section id="gallery" className="bg-bg py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionLabel className="text-center">{t("label").toUpperCase()}</SectionLabel>
        <div className="mt-10 columns-2 md:columns-3 gap-3 [&>div]:mb-3">
          {photos.map((src) => (
            <div key={src} className="break-inside-avoid">
              <Image
                src={src}
                alt=""
                width={800}
                height={1000}
                className="w-full h-auto rounded shadow"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
