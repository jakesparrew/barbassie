// components/ui/SectionLabel.tsx
import { type ReactNode } from "react"
import { cn } from "@/lib/cn"

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "font-subtitle uppercase tracking-wide text-accent text-3xl md:text-4xl",
        className
      )}
    >
      {children}
    </h2>
  )
}
