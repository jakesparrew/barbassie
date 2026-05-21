// components/PopupModal.tsx
"use client"
import { useTranslations, useLocale } from "next-intl"
import Image from "next/image"
import { Modal } from "@/components/ui/Modal"
import { Icon } from "@/components/ui/Icon"
import type { Popup } from "@/lib/popup"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/cn"

export function PopupModal({
  popup, open, onClose,
}: { popup: Popup; open: boolean; onClose: () => void }) {
  const t = useTranslations("popup")
  const locale = useLocale() as Locale
  const isPoster = popup.kind === "poster"

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={popup.imageAlt[locale]}
      closeOnContentClick={isPoster}
      className={cn("rounded-lg overflow-hidden bg-bg", isPoster ? "" : "max-w-md")}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("close")}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/90 text-ink p-2 shadow hover:bg-white"
      >
        <Icon.X className="w-4 h-4" />
      </button>

      {isPoster ? (
        <Image
          src={popup.image}
          alt={popup.imageAlt[locale]}
          width={900}
          height={1200}
          className="block w-full h-auto max-h-[85vh] object-contain"
          priority
        />
      ) : (
        <div className="p-6">
          <Image
            src={popup.image}
            alt={popup.imageAlt[locale]}
            width={600}
            height={400}
            className="block w-full h-auto rounded"
          />
          {popup.title && (
            <h3 className="mt-4 font-title text-3xl text-ink">{popup.title[locale]}</h3>
          )}
          {popup.subtitle && (
            <p className="mt-1 font-subtitle uppercase text-accent text-sm tracking-wide">
              {popup.subtitle[locale]}
            </p>
          )}
          {popup.detail && (
            <p className="mt-3 font-body text-ink/80">{popup.detail[locale]}</p>
          )}
        </div>
      )}
    </Modal>
  )
}
