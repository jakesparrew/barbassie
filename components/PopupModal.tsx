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
  popup,
  open,
  onClose,
}: {
  popup: Popup
  open: boolean
  onClose: () => void
}) {
  const t = useTranslations("popup")
  const locale = useLocale() as Locale
  const isPoster = popup.kind === "poster"

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={popup.imageAlt[locale]}
      closeOnContentClick={isPoster}
      className={cn("bg-bg overflow-hidden rounded-lg", isPoster ? "" : "max-w-md")}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("close")}
        className="text-ink absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-white"
      >
        <Icon.X className="h-4 w-4" />
      </button>

      {isPoster ? (
        <Image
          src={popup.image}
          alt={popup.imageAlt[locale]}
          width={900}
          height={1200}
          className="block h-auto max-h-[85vh] w-full object-contain"
          priority
        />
      ) : (
        <div className="p-6">
          <Image
            src={popup.image}
            alt={popup.imageAlt[locale]}
            width={600}
            height={400}
            className="block h-auto w-full rounded"
          />
          {popup.title && (
            <h3 className="font-title text-ink mt-4 text-3xl">{popup.title[locale]}</h3>
          )}
          {popup.subtitle && (
            <p className="font-subtitle text-accent mt-1 text-sm tracking-wide uppercase">
              {popup.subtitle[locale]}
            </p>
          )}
          {popup.detail && <p className="font-body text-ink/80 mt-3">{popup.detail[locale]}</p>}
        </div>
      )}
    </Modal>
  )
}
