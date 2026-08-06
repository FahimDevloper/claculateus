import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Calculateus.com — Free Online Calculators",
    short_name: "Calculateus",
    description: "220+ free, fast, accurate online calculators for finance, health, math and everyday life.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7fb",
    theme_color: "#5538f0",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
