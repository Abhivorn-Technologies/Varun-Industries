import type { MetadataRoute } from "next";
import { legalNavigation, navigation, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-19");
  const main = navigation.map((item) => ({
    url: `${site.url}${item.href === "/" ? "" : item.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: item.href === "/" ? 1 : 0.8,
  }));
  const legal = legalNavigation.map((item) => ({
    url: `${site.url}${item.href}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));
  return [...main, ...legal];
}
