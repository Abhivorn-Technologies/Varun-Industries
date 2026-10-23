/**
 * Single source of truth for company details shown across the site.
 * Everything here was supplied by Varun Industries; do not add claims
 * (certifications, figures, client names) that the company has not confirmed.
 */

export const site = {
  name: "Varun Industries",
  legalName: "Varun Industries",
  tagline: "Precision Without Compromise",
  founded: 2013,
  description:
    "Varun Industries is a CNC precision machining company in Hyderabad manufacturing components for the space, defence, telecommunications and pharma sectors.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  contactPerson: "V Janardhan",
  email: "varunindustries2013@gmail.com",
  whatsapp: { display: "+91 63000 26605", number: "916300026605" },
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
  sectors: ["Space", "Defence", "Telecom", "Pharma"],
  values: ["Precision", "Quality", "Trust"],
  geo: {
    latitude: 17.4819444,
    longitude: 78.42625,
  },
} as const;

/**
 * Hero statistics row.
 * Edit figures or labels here if company records require adjustments before publishing.
 */
export const heroStats = [
  { value: "25+", label: "Clients", isText: false },
  { value: "1,000+", label: "Projects", isText: false },
  { value: "Fast Turnaround", label: "Quick Delivery", isText: true },
] as const;

export const mapsUrl =
  "https://www.google.com/maps/place//@17.4819453,78.4261348,21z/data=!4m6!1m5!3m4!2zMTfCsDI4JzU1LjAiTiA3OMKwMjUnMzQuNSJF!8m2!3d17.4819444!4d78.42625?hl=en&entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D";

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/components", label: "Gallery" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Target destination for "Apply for a Position" on the Careers page.
 * Can be configured to a mailto link, form anchor, or dedicated careers endpoint.
 */
export const careersApplicationHref = "/careers/apply";

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

export const equipmentList = [
  {
    name: "CNC vertical milling centre",
    usedFor: "Used for machining housings, plates, pockets and profiles.",
  },
  {
    name: "Drilling equipment",
    usedFor: "Used for producing accurate holes and hole patterns.",
  },
  {
    name: "Tapping equipment",
    usedFor: "Used for creating internal threads in drilled holes.",
  },
  {
    name: "Engraving equipment",
    usedFor: "Used for engraving part identification and markings.",
  },
] as const;

export const vendorProcesses = [
  "Wire EDM and wire-cut machining",
  "CNC turning",
  "Special fasteners and hardware",
  "Surface treatment",
  "Plating",
  "Other secondary operations",
] as const;
