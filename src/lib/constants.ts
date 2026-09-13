import type { VisaCategory } from "./types";

export const SITE_NAME = "Visaora";
export const SITE_TAGLINE = "Every country. Every pathway. One clear guide.";
export const SITE_DESCRIPTION =
  "Explore visa pathways around the world with a clear, structured directory built for better decisions.";
export const DEFAULT_OG_IMAGE = "/opengraph-image";

export const NAV_ITEMS = [
  { label: "Countries", href: "/countries" },
  { label: "Visa types", href: "/visas" },
  { label: "Categories", href: "/categories" },
  { label: "Compare", href: "/compare" },
] as const;

export const CONTINENTS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
] as const;

export const REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "Middle East",
  "North America",
  "Oceania",
  "South America",
] as const;

export const VISA_CATEGORIES: VisaCategory[] = [
  {
    id: "category-visit",
    name: "Visit",
    slug: "visit",
    description: "Short stays, tourism and visiting pathways.",
    icon: "compass",
    order: 1,
    status: "PUBLISHED",
    publishedVisaCount: 0,
  },
  {
    id: "category-study",
    name: "Study",
    slug: "study",
    description: "Pathways for education, research and learning.",
    icon: "book-open",
    order: 2,
    status: "PUBLISHED",
    publishedVisaCount: 0,
  },
  {
    id: "category-work",
    name: "Work",
    slug: "work",
    description: "Employment and professional opportunities abroad.",
    icon: "briefcase-business",
    order: 3,
    status: "PUBLISHED",
    publishedVisaCount: 0,
  },
  {
    id: "category-business",
    name: "Business",
    slug: "business",
    description: "Business travel, founders and commercial activity.",
    icon: "building-2",
    order: 4,
    status: "PUBLISHED",
    publishedVisaCount: 0,
  },
  {
    id: "category-family",
    name: "Family",
    slug: "family",
    description: "Family reunification and joining loved ones.",
    icon: "users-round",
    order: 5,
    status: "PUBLISHED",
    publishedVisaCount: 0,
  },
  {
    id: "category-investment",
    name: "Investment",
    slug: "investment",
    description: "Investment and entrepreneur-led pathways.",
    icon: "landmark",
    order: 6,
    status: "PUBLISHED",
    publishedVisaCount: 0,
  },
  {
    id: "category-immigration",
    name: "Immigration",
    slug: "immigration",
    description: "Long-term residence and permanent pathways.",
    icon: "route",
    order: 7,
    status: "PUBLISHED",
    publishedVisaCount: 0,
  },
  {
    id: "category-transit",
    name: "Transit & other",
    slug: "transit-other",
    description: "Transit and pathways that do not fit another category.",
    icon: "arrow-right-left",
    order: 8,
    status: "PUBLISHED",
    publishedVisaCount: 0,
  },
];

export const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  VISA_CATEGORIES.map((category) => [category.slug, category.icon]),
);

export const COUNTRY_PAGE_INDEXING_THRESHOLD = 1;

export const LEGAL_LINKS = [
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;
