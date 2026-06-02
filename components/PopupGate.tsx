// components/PopupGate.tsx
"use client"
import { useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { PopupModal } from "./PopupModal"
import { getPopup } from "@/lib/content"
import { isPopupActiveNow, shouldAutoOpenToday, markSeen, popupId } from "@/lib/popup"
import { todayBrussels } from "@/lib/dates"

export type PopupGateHandle = { open: () => void }

export const PopupGate = forwardRef<PopupGateHandle>(function PopupGate(_, ref) {
  const popup = getPopup()
  const [open, setOpen] = useState(false)
  const id = popupId(popup)
  const today = todayBrussels()
  const activeForAutoOpen = isPopupActiveNow(popup, today)

  // Auto-open: only when the campaign is in its date range AND the visitor
  // hasn't dismissed it today.
  useEffect(() => {
    if (activeForAutoOpen && shouldAutoOpenToday(id, today)) setOpen(true)
  }, [activeForAutoOpen, id, today])

  // Manual open via the "Happening" pill / hero menu: always honored as long
  // as the campaign is switched on, even if today falls outside the date
  // range. This lets staff preview the active poster off-window and prevents
  // the pill from looking broken when the dates lapse.
  useImperativeHandle(
    ref,
    () => ({
      open: () => setOpen(true),
    }),
    []
  )

  const onClose = () => {
    setOpen(false)
    markSeen(id, today)
  }

  // Only hide entirely when popup.active is explicitly false (campaign off).
  if (!popup.active) return null
  return <PopupModal popup={popup} open={open} onClose={onClose} />
})
