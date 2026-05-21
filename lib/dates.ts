// lib/dates.ts
const TZ = "Europe/Brussels"

export const toIsoDate = (d: Date): string => {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  })
  return fmt.format(d) // "YYYY-MM-DD"
}

export const todayBrussels = (): string => toIsoDate(new Date())

export const isWithinRange = (
  date: string, // ISO yyyy-mm-dd
  start: string,
  end: string
): boolean => date >= start && date <= end
