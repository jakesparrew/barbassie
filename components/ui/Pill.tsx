import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/cn"

type Common = {
  children: ReactNode
  className?: string
  variant?: "solid" | "outline"
}

type LinkPill = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; onClick?: never }
type ButtonPill = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type PillProps = LinkPill | ButtonPill

const base =
  "inline-flex items-center justify-center rounded-full px-5 py-2 font-subtitle uppercase tracking-wide text-sm transition-transform duration-150 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg"

const variants: Record<NonNullable<Common["variant"]>, string> = {
  solid: "bg-accent text-white shadow-sm",
  outline: "border-2 border-accent text-accent",
}

export function Pill({ children, className, variant = "solid", ...rest }: PillProps) {
  const cls = cn(base, variants[variant], className)
  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
