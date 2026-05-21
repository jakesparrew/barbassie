// components/ui/Modal.tsx
"use client"
import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/cn"

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  ariaLabel?: string
  closeOnContentClick?: boolean
  className?: string
}

export function Modal({
  open,
  onClose,
  children,
  ariaLabel = "Dialog",
  closeOnContentClick = false,
  className,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        data-testid="modal-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div
        ref={contentRef}
        onClick={closeOnContentClick ? onClose : undefined}
        className={cn("relative max-w-[90vw] max-h-[90vh]", className)}
      >
        {children}
      </div>
    </div>
  )
}
