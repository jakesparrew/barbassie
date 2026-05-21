// app/[locale]/page.tsx
"use client"
import { useRef } from "react"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Menu } from "@/components/sections/Menu"
import { Location } from "@/components/sections/Location"
import { Gallery } from "@/components/sections/Gallery"
import { Jobs } from "@/components/sections/Jobs"
import { Reservation } from "@/components/sections/Reservation"
import { Footer } from "@/components/sections/Footer"
import { StickyNav } from "@/components/StickyNav"
import { PopupGate, type PopupGateHandle } from "@/components/PopupGate"

export default function Home() {
  const popupRef = useRef<PopupGateHandle>(null)
  const openHappening = () => popupRef.current?.open()

  return (
    <>
      <StickyNav onHappeningClick={openHappening} />
      <main>
        <Hero onHappeningClick={openHappening} />
        <About />
        <Menu />
        <Location />
        <Gallery />
        <Jobs />
        <Reservation />
      </main>
      <Footer />
      <PopupGate ref={popupRef} />
    </>
  )
}
