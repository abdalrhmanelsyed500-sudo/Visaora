export type ContentStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

export type Country = {
  id: string;
  name: string;
  officialName: string;
  iso2: string;
  iso3: string;
  numericCode: string;
  continent: string;
  region: string;
  subregion: string;
  capital: string;
  flag: string;
  slug: string;
  description: string | null;
  status: ContentStatus;
  publishedVisaCount: number;
  aliases: string[];
};

export type VisaCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  status: ContentStatus;
  publishedVisaCount: number;
};

export type Visa = {
  id: string;
  countryId: string;
  countrySlug: string;
  countryName: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  purpose: string | null;
  eligibility: string | null;
  documents: string[];
  fees: string | null;
  processingTime: string | null;
  validity: string | null;
  stayDuration: string | null;
  entries: string | null;
  applicationMethod: string | null;
  applicationSteps: string[];
  officialSources: Source[];
  lastVerified: string | null;
  status: ContentStatus;
  featured: boolean;
  isDemo: boolean;
};

export type Source = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  country: string | null;
  sourceType: string;
  accessedAt: string | null;
};

export type SearchResult = {
  id: string;
  type: "country" | "category" | "visa";
  title: string;
  subtitle: string;
  href: string;
  meta?: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type EmptyStateKind = "country" | "visa" | "category" | "search" | "compare";
