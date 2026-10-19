import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Varun Industries",
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0b1b33",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
