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

export default function Home() {
  return (
    <>
      <StickyNav />
      <main>
        <Hero />
        <Menu />
        <About />
        <Location />
        <Gallery />
        <Events />
        <Reservation />
      </main>
      <Footer />
    </>
  )
}
