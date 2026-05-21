// components/ui/LocaleSwitcher.tsx
"use client"
import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useState, useRef, useEffect } from "react"
import { locales, localeNames, type Locale, isLocale, defaultLocale } from "@/lib/i18n"
import { cn } from "@/lib/cn"
import { Icon } from "./Icon"

const stripLocale = (pathname: string): string => {
  const [, maybeLocale, ...rest] = pathname.split("/")
  if (maybeLocale && isLocale(maybeLocale)) return "/" + rest.join("/")
  return pathname
}

const buildPath = (target: Locale, bare: string): string => {
  const path = bare === "/" ? "" : bare
  return target === defaultLocale ? path || "/" : `/${target}${path}`
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const current = useLocale() as Locale
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  const onPick = (loc: Locale) => {
    document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000; samesite=lax`
    const bare = stripLocale(pathname)
    router.push(buildPath(loc, bare))
    setOpen(false)
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="font-subtitle inline-flex items-center gap-1 text-sm tracking-wide uppercase"
      >
        <Icon.Globe className="h-4 w-4" aria-hidden />
        {localeNames[current]}
        <Icon.ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          role="menu"
          className="bg-bg ring-ink/10 absolute right-0 z-50 mt-2 min-w-[10rem] rounded-md p-1 shadow-lg ring-1"
        >
          {locales.map((loc) => (
            <li key={loc}>
              <button
                role="menuitem"
                onClick={() => onPick(loc)}
                className={cn(
                  "font-body w-full rounded px-3 py-2 text-left text-sm",
                  loc === current ? "bg-accent/10 text-accent" : "hover:bg-ink/5"
                )}
              >
                {localeNames[loc]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
