/**
 * Single source of truth for company details shown across the site.
 * Everything here was supplied by Varun Industries; do not add claims
 * (certifications, figures, client names) that the company has not confirmed.
 */

export const site = {
  name: "Varun Industries",
  legalName: "Varun Industries",
  tagline: "Precision Without Compromise",
  founded: 2021,
  description:
    "Varun Industries is a CNC precision machining company in Hyderabad manufacturing components for the space, defence and telecommunications sectors.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  contactPerson: "V Janardhan",
  email: "varunindustries2013@gmail.com",
  phones: [
    { display: "+91 77949 87472", tel: "+917794987472", whatsapp: "917794987472" },
    { display: "+91 73867 93251", tel: "+917386793251", whatsapp: "917386793251" },
  ],
  address: {
    lines: ["Plot No. 49, 5-5-35/211A", "Shakthipuram, Prashanth Nagar", "Hyderabad, Telangana 500072", "India"],
    street: "Plot No. 49, 5-5-35/211A, Shakthipuram, Prashanth Nagar",
    locality: "Hyderabad",
    region: "Telangana",
    postalCode: "500072",
    country: "IN",
  },
  sectors: ["Space", "Defence", "Telecommunications"],
  values: ["Precision", "Quality", "Trust"],
} as const;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Plot No. 49, 5-5-35/211A, Shakthipuram, Prashanth Nagar, Hyderabad, Telangana 500072",
)}`;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/components", label: "Components" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalNavigation = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
] as const;

export const inHouse = [
  {
    title: "CNC vertical milling",
    text: "Milling of housings, plates, pockets and profiles to the customer's drawing on our CNC vertical milling centres.",
  },
  {
    title: "Drilling",
    text: "Hole patterns and drilled features produced on dedicated drilling equipment.",
  },
  {
    title: "Tapping",
    text: "Threaded holes produced on dedicated tapping equipment.",
  },
  {
    title: "Engraving",
    text: "Engraved markings such as part identification, carried out in-house.",
  },
] as const;

export const machines = [
  { name: "BFW XTRON 544", type: "CNC vertical milling centre" },
  { name: "BFW Chandra", type: "CNC vertical milling centre" },
] as const;

export const vendorProcesses = [
  "Wire EDM and wire-cut machining",
  "CNC turning",
  "Special fasteners and hardware",
  "Surface treatment",
  "Plating",
  "Other secondary operations",
] as const;
