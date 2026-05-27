// components/ui/SectionLabel.tsx
import { type ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * The big magenta section title used at the top of each scroll section.
 * Uses VTC Marsha Bold (font-subtitle) — wide, heavy, sign-paint sans —
 * to match the BASSIE wordmark and the user's reference mockup.
 */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "font-subtitle text-accent text-5xl leading-[0.95] tracking-tight uppercase md:text-7xl",
        className
      )}
    >
      {children}
    </h2>
  )
}
