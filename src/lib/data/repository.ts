import type { Country, SearchResult, Visa, VisaCategory } from "../types";

export type CountryFilters = { query?: string; continent?: string; region?: string; page?: number; limit?: number };
export type VisaFilters = { query?: string; countryId?: string; categorySlug?: string; region?: string; page?: number; limit?: number };

/** Persistence-agnostic contract used by routes and server components. */
export interface DirectoryRepository {
  listCountries(filters?: CountryFilters): Promise<{ data: Country[]; total: number }>;
  getCountryBySlug(slug: string): Promise<Country | undefined>;
  listCategories(): Promise<VisaCategory[]>;
  listPublishedVisas(filters?: VisaFilters): Promise<{ data: Visa[]; total: number }>;
  getPublishedVisa(countrySlug: string, visaSlug: string): Promise<Visa | undefined>;
  search(query: string, limit?: number): Promise<SearchResult[]>;
}

/**
 * PrismaRepository is intentionally an interface at this stage. The static
 * repository in data/index.ts is the zero-service implementation; a future
 * Prisma adapter can implement this contract without touching page components.
 */
export type RepositoryFactory = () => DirectoryRepository;
