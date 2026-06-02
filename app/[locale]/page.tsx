// app/[locale]/page.tsx
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Menu } from "@/components/sections/Menu"
import { Location } from "@/components/sections/Location"
import { Gallery } from "@/components/sections/Gallery"
import { Events } from "@/components/sections/Events"
import { Reservation } from "@/components/sections/Reservation"
import { Footer } from "@/components/sections/Footer"
import { StickyNav } from "@/components/StickyNav"
import { PopupGate } from "@/components/PopupGate"

export default function Home() {
  return (
    <>
      <StickyNav />
      <main>
        <Hero />
        {/* Section order per the user's brief:
              Happening (Events) -> Menu -> Reservation -> Location -> About,
              and finish on Gallery as the visual closer. */}
        <Events />
        <Menu />
        <Reservation />
        <Location />
        <About />
        <Gallery />
      </main>
      <Footer />
      {/* Auto-opens the currently-running campaign once per day per visitor,
          driven by the same events.json the carousel reads. */}
      <PopupGate />
    </>
  )
}
