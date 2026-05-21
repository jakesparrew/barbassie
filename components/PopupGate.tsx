// components/PopupGate.tsx
"use client"
import { useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { PopupModal } from "./PopupModal"
import { getPopup } from "@/lib/content"
import {
  isPopupActiveNow, shouldAutoOpenToday, markSeen, popupId,
} from "@/lib/popup"
import { todayBrussels } from "@/lib/dates"

export type PopupGateHandle = { open: () => void }

export const PopupGate = forwardRef<PopupGateHandle>(function PopupGate(_, ref) {
  const popup = getPopup()
  const [open, setOpen] = useState(false)
  const id = popupId(popup)
  const today = todayBrussels()
  const active = isPopupActiveNow(popup, today)

  useEffect(() => {
    if (active && shouldAutoOpenToday(id, today)) setOpen(true)
  }, [active, id, today])

  useImperativeHandle(ref, () => ({
    open: () => { if (active) setOpen(true) },
  }), [active])

  const onClose = () => {
    setOpen(false)
    markSeen(id, today)
  }

  if (!active) return null
  return <PopupModal popup={popup} open={open} onClose={onClose} />
})
