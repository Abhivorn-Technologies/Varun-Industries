import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Condensed, Manrope } from "next/font/google";
import localFont from "next/font/local";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StructuredData } from "@/components/StructuredData";
import { baseOpenGraph } from "@/lib/metadata";
import { site } from "@/lib/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexCondensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-plex-condensed",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const roundo = localFont({
  src: [
    {
      path: "../../public/fonts/roundo-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/roundo-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/roundo-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/roundo-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roundo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Varun Industries | CNC Precision Machining in Hyderabad",
    template: "%s | Varun Industries",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: { ...baseOpenGraph, url: "/" },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1b33",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${plexSans.variable} ${plexCondensed.variable} ${plexMono.variable} ${manrope.variable} ${roundo.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CookieConsent />
        <ScrollReveal />
        <StructuredData />
      </body>
    </html>
  );
}
