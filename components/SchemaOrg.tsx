// components/SchemaOrg.tsx
export function SchemaOrg() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: "Bar Bassie",
    image: "https://barbassie.be/og/cover.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lammerstraat 13",
      postalCode: "9000",
      addressLocality: "Ghent",
      addressCountry: "BE",
    },
    telephone: "+32470487252",
    url: "https://barbassie.be",
    servesCuisine: ["Small plates", "Cocktails"],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Wednesday","Thursday"], opens: "16:00", closes: "00:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday","Saturday"], opens: "12:00", closes: "01:00" },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
