import { db } from "../db";
import type { Country, SearchResult, Source, Visa, VisaCategory } from "../types";
import type { CountryFilters, DirectoryRepository, VisaFilters } from "./repository";

function toCountry(row: any): Country {
  return {
    id: row.id,
    name: row.name,
    officialName: row.officialName,
    iso2: row.iso2,
    iso3: row.iso3,
    numericCode: row.numericCode,
    continent: row.continent,
    region: row.region?.name ?? row.continent,
    subregion: row.subregion,
    capital: row.capital,
    flag: row.flag,
    slug: row.slug,
    description: row.description ?? null,
    status: row.status,
    publishedVisaCount: row._count?.visas ?? 0,
    aliases: [],
  };
}

function toSource(row: any): Source {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    publisher: row.publisher,
    country: row.country?.name ?? null,
    sourceType: row.sourceType,
    accessedAt: row.accessedAt?.toISOString?.() ?? null,
  };
}

function toVisa(row: any): Visa {
  return {
    id: row.id,
    countryId: row.countryId,
    countrySlug: row.country.slug,
    countryName: row.country.name,
    name: row.name,
    slug: row.slug,
    category: row.category.name,
    categorySlug: row.category.slug,
    subcategory: row.subcategory ?? null,
    shortDescription: row.shortDescription ?? null,
    longDescription: row.longDescription ?? null,
    purpose: row.purpose ?? null,
    eligibility: row.eligibility ?? null,
    documents: (row.documents ?? []).map((item: any) => item.name),
    fees: (row.fees ?? []).length ? (row.fees as any[]).map((item) => [item.label, item.amount ? `${item.amount} ${item.currency ?? ""}`.trim() : item.notes].filter(Boolean).join(": ")).join("; ") : null,
    processingTime: row.processingTime ?? null,
    validity: row.validity ?? null,
    stayDuration: row.stayDuration ?? null,
    entries: row.entryType === "UNKNOWN" ? null : row.entryType,
    applicationMethod: row.applicationMethod ?? null,
    applicationSteps: (row.steps ?? []).sort((a: any, b: any) => a.stepNumber - b.stepNumber).map((item: any) => [item.title, item.description].filter(Boolean).join(": ")),
    officialSources: (row.sources ?? []).sort((a: any, b: any) => a.sortOrder - b.sortOrder).map((item: any) => toSource(item.source)),
    lastVerified: row.lastVerified?.toISOString?.() ?? null,
    status: row.status,
    featured: row.featured,
    isDemo: row.isDemo,
  };
}

const publicVisaInclude = {
  country: { include: { region: true } },
  category: true,
  documents: { orderBy: { sortOrder: "asc" as const } },
  fees: { orderBy: { sortOrder: "asc" as const } },
  steps: { orderBy: { stepNumber: "asc" as const } },
  sources: { orderBy: { sortOrder: "asc" as const }, include: { source: { include: { country: true } } } },
} as const;

/** PostgreSQL implementation kept behind the same interface as the launch repository. */
export function createPrismaRepository(): DirectoryRepository {
  return {
    async listCountries(filters: CountryFilters = {}) {
      const page = Math.max(1, filters.page ?? 1);
      const limit = Math.min(100, Math.max(1, filters.limit ?? 24));
      const where = {
        status: "PUBLISHED",
        ...(filters.continent ? { continent: filters.continent } : {}),
        ...(filters.region ? { region: { slug: filters.region.toLowerCase().replace(/[^a-z0-9]+/g, "-") } } : {}),
        ...(filters.query ? { OR: [{ name: { contains: filters.query, mode: "insensitive" } }, { officialName: { contains: filters.query, mode: "insensitive" } }, { iso2: { equals: filters.query.toUpperCase() } }, { iso3: { equals: filters.query.toUpperCase() } }] } : {}),
      };
      const [rows, total] = await Promise.all([
        db.country.findMany({ where, include: { region: true, _count: { select: { visas: { where: { status: "PUBLISHED", isDemo: false } } } } }, orderBy: { name: "asc" }, skip: (page - 1) * limit, take: limit }),
        db.country.count({ where }),
      ]);
      return { data: rows.map(toCountry), total };
    },

    async getCountryBySlug(slug: string) {
      const row = await db.country.findFirst({ where: { slug, status: "PUBLISHED" }, include: { region: true, _count: { select: { visas: { where: { status: "PUBLISHED", isDemo: false } } } } } });
      return row ? toCountry(row) : undefined;
    },

    async listCategories() {
      const rows = await db.visaCategory.findMany({ where: { status: "PUBLISHED" }, orderBy: { sortOrder: "asc" }, include: { _count: { select: { visas: { where: { status: "PUBLISHED", isDemo: false } } } } } });
      return rows.map((row: any): VisaCategory => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, icon: row.icon, order: row.sortOrder, status: row.status, publishedVisaCount: row._count?.visas ?? 0 }));
    },

    async listPublishedVisas(filters: VisaFilters = {}) {
      const page = Math.max(1, filters.page ?? 1);
      const limit = Math.min(100, Math.max(1, filters.limit ?? 24));
      const where = {
        status: "PUBLISHED",
        isDemo: false,
        ...(filters.countryId ? { countryId: filters.countryId } : {}),
        ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
        ...(filters.region ? { country: { region: { slug: filters.region.toLowerCase().replace(/[^a-z0-9]+/g, "-") } } } : {}),
        ...(filters.query ? { OR: [{ name: { contains: filters.query, mode: "insensitive" } }, { shortDescription: { contains: filters.query, mode: "insensitive" } }] } : {}),
      };
      const [rows, total] = await Promise.all([
        db.visa.findMany({ where, include: publicVisaInclude, orderBy: [{ featured: "desc" }, { name: "asc" }], skip: (page - 1) * limit, take: limit }),
        db.visa.count({ where }),
      ]);
      return { data: rows.map(toVisa), total };
    },

    async getPublishedVisa(countrySlug: string, visaSlug: string) {
      const row = await db.visa.findFirst({ where: { slug: visaSlug, status: "PUBLISHED", isDemo: false, country: { slug: countrySlug, status: "PUBLISHED" } }, include: publicVisaInclude });
      return row ? toVisa(row) : undefined;
    },

    async search(query: string, limit = 8): Promise<SearchResult[]> {
      const [countries, categories, visas] = await Promise.all([
        db.country.findMany({ where: { status: "PUBLISHED", OR: [{ name: { contains: query, mode: "insensitive" } }, { officialName: { contains: query, mode: "insensitive" } }, { iso2: { equals: query.toUpperCase() } }, { iso3: { equals: query.toUpperCase() } }] }, include: { region: true }, take: limit }),
        db.visaCategory.findMany({ where: { status: "PUBLISHED", name: { contains: query, mode: "insensitive" } }, take: limit }),
        db.visa.findMany({ where: { status: "PUBLISHED", isDemo: false, OR: [{ name: { contains: query, mode: "insensitive" } }, { shortDescription: { contains: query, mode: "insensitive" } }] }, include: { country: true, category: true }, take: limit }),
      ]);
      return [
        ...countries.map((country: any) => ({ id: country.id, type: "country" as const, title: country.name, subtitle: `${country.region?.name ?? country.continent} · Country directory`, href: `/countries/${country.slug}`, meta: country.flag })),
        ...visas.map((visa: any) => ({ id: visa.id, type: "visa" as const, title: visa.name, subtitle: `${visa.country.name} · ${visa.category.name}`, href: `/countries/${visa.country.slug}/visas/${visa.slug}` })),
        ...categories.map((category: any) => ({ id: category.id, type: "category" as const, title: `${category.name} pathways`, subtitle: "Category directory", href: `/categories/${category.slug}` })),
      ].slice(0, limit);
    },
  };
}
