// components/ui/Modal.tsx
"use client"
import { useEffect, useRef, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            data-testid="modal-backdrop"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            ref={contentRef}
            onClick={closeOnContentClick ? onClose : undefined}
            className={cn("relative max-h-[90vh] max-w-[90vw]", className)}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
