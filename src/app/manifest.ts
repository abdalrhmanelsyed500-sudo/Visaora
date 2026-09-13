import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Visaora",
    short_name: "Visaora",
    description: "Explore every visa pathway for every country.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fc",
    theme_color: "#0b1730",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
