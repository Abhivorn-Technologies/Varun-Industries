import { site } from "@/lib/site";

/** Organisation details for search engines (schema.org JSON-LD). */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#organization`,
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    logo: `${site.url}/brand/varun-industries-logo.png`,
    image: `${site.url}/og-image.jpg`,
    email: site.email,
    telephone: site.phones.map((phone) => phone.tel),
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    contactPoint: site.phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: phone.tel,
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["en"],
    })),
    knowsAbout: ["CNC vertical milling", "Drilling", "Tapping", "Engraving", "Precision machining"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
