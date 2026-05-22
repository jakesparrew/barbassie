// lib/contact.ts
// Single source of truth for Bar Bassie contact info. Update once, it propagates.

export const CONTACT = {
  email: "hello@barbassie.be",
  /** Digits only, used to build wa.me/<phone> and tel: links */
  phoneDigits: "32470487252",
  /** Pretty-formatted for display */
  phoneDisplay: "+32 470 48 72 52",
  /** Public Instagram handle (no @, no URL) */
  instagramHandle: "barbassie.wintercircus",
  address: {
    line1: "Lammerstraat 13",
    line2: "9000 Ghent",
    country: "BE",
    postalCode: "9000",
    googleMapsUrl: "https://maps.google.com/?q=Lammerstraat+13,+9000+Gent",
  },
} as const

export const instagramUrl = `https://instagram.com/${CONTACT.instagramHandle}`
export const whatsappUrl = (text?: string) =>
  `https://wa.me/${CONTACT.phoneDigits}${text ? `?text=${encodeURIComponent(text)}` : ""}`
export const mailtoUrl = (subject?: string) =>
  `mailto:${CONTACT.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`
