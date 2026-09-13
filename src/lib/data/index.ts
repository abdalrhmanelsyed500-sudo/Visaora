import { CONTINENTS, VISA_CATEGORIES, COUNTRY_PAGE_INDEXING_THRESHOLD } from "../constants";
import type { Country, SearchResult, Visa, VisaCategory } from "../types";
import type { DirectoryRepository, CountryFilters, VisaFilters } from "./repository";
import { COUNTRIES, getCountryById, getCountryBySlug } from "./countries";

/**
 * This repository is intentionally small and database-agnostic at runtime.
 * Prisma is the persistence contract; swapping this module for Prisma queries
 * does not require changes in routes or components.
 */
const PUBLISHED_VISAS: Visa[] = [];

export function getCountries() {
  return COUNTRIES;
}

export function getCountry(slug: string) {
  return getCountryBySlug(slug);
}

export function getCategories() {
  return VISA_CATEGORIES;
}

export function getCategory(slug: string) {
  return VISA_CATEGORIES.find((category) => category.slug === slug);
}

export function getPublishedVisas() {
  return PUBLISHED_VISAS.filter((visa) => visa.status === "PUBLISHED" && !visa.isDemo);
}

export function getVisaBySlug(countrySlug: string, visaSlug: string) {
  return getPublishedVisas().find(
    (visa) => visa.countrySlug === countrySlug && visa.slug === visaSlug,
  );
}

export function getVisaById(id: string) {
  return getPublishedVisas().find((visa) => visa.id === id);
}

export function getCountryVisaCount(countryId: string) {
  return getPublishedVisas().filter((visa) => visa.countryId === countryId).length;
}

export function getCategoryVisaCount(categorySlug: string) {
  return getPublishedVisas().filter((visa) => visa.categorySlug === categorySlug).length;
}

export function getRelatedCountries(country: Country, limit = 4) {
  return COUNTRIES.filter(
    (candidate) =>
      candidate.id !== country.id &&
      candidate.region === country.region,
  ).slice(0, limit);
}

export function getCountriesByContinent(continent: string) {
  return COUNTRIES.filter((country) => country.continent === continent);
}

export function getDirectoryStats() {
  const visas = getPublishedVisas();
  return {
    totalCountries: COUNTRIES.length,
    publishedVisaGuides: visas.length,
    draftVisaGuides: 0,
    categories: VISA_CATEGORIES.length,
    indexableCountries: COUNTRIES.filter(
      (country) => country.publishedVisaCount >= COUNTRY_PAGE_INDEXING_THRESHOLD,
    ).length,
  };
}

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreMatch(query: string, ...values: string[]) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const normalizedValues = values.map(normalize);
  const hasTokenCoverage = queryTokens.every((token) => normalizedValues.some((value) => value.includes(token)));

  const directScore = values.reduce((best, value) => {
    const normalizedValue = normalize(value);
    if (normalizedValue === normalizedQuery) return Math.max(best, 100);
    if (normalizedValue.startsWith(normalizedQuery)) return Math.max(best, 80);
    if (normalizedValue.split(" ").some((word) => word.startsWith(normalizedQuery))) {
      return Math.max(best, 65);
    }
    if (normalizedValue.includes(normalizedQuery)) return Math.max(best, 40);
    return best;
  }, 0);

  return Math.max(directScore, hasTokenCoverage ? 55 : 0);
}

export function searchDirectory(query: string, limit = 8): SearchResult[] {
  const cleanQuery = query.trim().slice(0, 80);
  if (!cleanQuery) return [];

  const countryResults = COUNTRIES.map((country) => ({
    country,
    score: scoreMatch(cleanQuery, country.name, country.officialName, ...country.aliases),
  }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.country.name.localeCompare(b.country.name))
    .map(({ country }) => ({
      id: country.id,
      type: "country" as const,
      title: country.name,
      subtitle: `${country.region} · Country directory`,
      href: `/countries/${country.slug}`,
      meta: country.flag,
    }));

  const categoryAliases: Record<string, string[]> = {
    visit: ["tourist", "tourism", "visitor", "travel"],
    study: ["student", "education", "school", "university"],
    work: ["employment", "job", "worker"],
    business: ["commercial", "founder", "entrepreneur"],
    family: ["reunification", "spouse", "dependent"],
    investment: ["investor", "entrepreneur"],
    immigration: ["residence", "permanent", "relocation"],
    "transit-other": ["transit", "other"],
  };

  const categoryResults = VISA_CATEGORIES.map((category) => ({
    category,
    score: scoreMatch(
      cleanQuery,
      category.name,
      `${category.name} visa`,
      ...(categoryAliases[category.slug] ?? []),
    ),
  }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.category.order - b.category.order)
    .map(({ category }) => ({
      id: category.id,
      type: "category" as const,
      title: `${category.name} pathways`,
      subtitle: "Category directory",
      href: `/categories/${category.slug}`,
    }));

  const visaResults = getPublishedVisas()
    .map((visa) => ({
      visa,
      score: scoreMatch(cleanQuery, visa.name, visa.countryName, visa.category),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ visa }) => ({
      id: visa.id,
      type: "visa" as const,
      title: visa.name,
      subtitle: `${visa.countryName} · ${visa.category}`,
      href: `/countries/${visa.countrySlug}/visas/${visa.slug}`,
    }));

  return [...countryResults, ...visaResults, ...categoryResults].slice(0, limit);
}

export function isCountryIndexable(country: Country) {
  return country.publishedVisaCount >= COUNTRY_PAGE_INDEXING_THRESHOLD;
}

export function isCategoryIndexable(category: VisaCategory) {
  return getCategoryVisaCount(category.slug) > 0;
}

export { CONTINENTS, COUNTRIES, getCountryById };

/** Zero-service implementation used by the first release and local previews. */
export const staticRepository: DirectoryRepository = {
  async listCountries(filters: CountryFilters = {}) {
    const normalizedQuery = filters.query ? normalize(filters.query) : "";
    const filtered = COUNTRIES.filter((country) => {
      const matchesQuery = !normalizedQuery || normalize([country.name, country.officialName, country.iso2, country.iso3, ...country.aliases].join(" ")).includes(normalizedQuery);
      return matchesQuery && (!filters.continent || country.continent === filters.continent) && (!filters.region || country.region === filters.region);
    });
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 24));
    return { data: filtered.slice((page - 1) * limit, page * limit), total: filtered.length };
  },
  async getCountryBySlug(slug: string) {
    return getCountry(slug);
  },
  async listCategories() {
    return getCategories();
  },
  async listPublishedVisas(filters: VisaFilters = {}) {
    const filtered = getPublishedVisas().filter((visa) => {
      const matchesQuery = !filters.query || normalize(`${visa.name} ${visa.countryName} ${visa.category}`).includes(normalize(filters.query));
      const matchesCountry = !filters.countryId || visa.countryId === filters.countryId;
      const matchesCategory = !filters.categorySlug || visa.categorySlug === filters.categorySlug;
      const visaCountry = getCountryById(visa.countryId);
      const matchesRegion = !filters.region || visaCountry?.region === filters.region;
      return matchesQuery && matchesCountry && matchesCategory && matchesRegion;
    });
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 24));
    return { data: filtered.slice((page - 1) * limit, page * limit), total: filtered.length };
  },
  async getPublishedVisa(countrySlug: string, visaSlug: string) {
    return getVisaBySlug(countrySlug, visaSlug);
  },
  async search(query: string, limit = 8) {
    return searchDirectory(query, limit);
  },
};
