// components/ui/SectionLabel.tsx
import { type ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * The big magenta Lioney section title used at the top of each scroll section.
 * (Mockup style: condensed serif, huge, uppercase.)
 */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "font-title text-accent text-5xl leading-[0.95] tracking-tight uppercase md:text-7xl",
        className
      )}
    >
      {children}
    </h2>
  )
}
