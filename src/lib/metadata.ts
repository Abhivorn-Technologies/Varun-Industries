import type { Metadata } from "next";
import { site } from "@/lib/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

const ogImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Varun Industries logo beside machined components",
};

/** Shared Open Graph fields. Next.js replaces (not merges) openGraph per page, so each page repeats them. */
export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  locale: "en_IN",
  siteName: site.name,
  images: [ogImage],
};

/** Per-page metadata with a canonical URL and matching social preview fields. */
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, title: `${title} | ${site.name}`, description, url: path },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: [ogImage.url] },
  };
}
