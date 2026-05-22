// components/ui/RevealOnView.tsx
"use client"
import { motion, type Variants } from "framer-motion"
import { type ReactNode } from "react"

/**
 * Fades + slides children up when they scroll into view. Used to give sections
 * a tasteful entrance without anything heavy. Respects prefers-reduced-motion
 * (framer-motion checks the media query and skips the transform automatically).
 */
const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export function RevealOnView({
  children,
  className,
  delay = 0,
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  /** Stagger offset in seconds */
  delay?: number
  /** 0..1 — what portion of the element must be visible before reveal triggers */
  amount?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
