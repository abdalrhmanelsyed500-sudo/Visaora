import type { MetadataRoute } from "next";
import { getCategories, getCountries, getPublishedVisas, isCategoryIndexable, isCountryIndexable } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/countries"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/visas"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/categories"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/sources"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/disclaimer"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const countryRoutes = getCountries().filter(isCountryIndexable).map((country) => ({
    url: absoluteUrl(`/countries/${country.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryRoutes = getCategories().filter(isCategoryIndexable).map((category) => ({
    url: absoluteUrl(`/categories/${category.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const visaRoutes = getPublishedVisas().map((visa) => ({
    url: absoluteUrl(`/countries/${visa.countrySlug}/visas/${visa.slug}`),
    lastModified: visa.lastVerified ? new Date(visa.lastVerified) : now,
    changeFrequency: "monthly" as const,
    priority: visa.featured ? 0.8 : 0.7,
  }));

  return [...staticRoutes, ...countryRoutes, ...categoryRoutes, ...visaRoutes];
}
