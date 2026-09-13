# Visaora architecture

## Product boundary

Visaora is an independent, source-aware discovery platform, not an authority. The application is designed around one non-negotiable rule: no requirement, fee, timeline, eligibility rule, document or application step is shown unless it exists as reviewed content in the database. In the initial release the platform contains country metadata and category taxonomy only.

The experience is intentionally useful before the content corpus exists:

```text
Country metadata → category framework → empty/pending state → future source-backed guide
```

Empty states are not demo data. They protect users from invented facts and protect search quality from thin programmatic pages.

## Runtime layers

### 1. Presentation and routing — `src/app`

Next.js App Router supplies server-rendered HTML for public discovery pages, dynamic metadata, route-level loading/error states and technical endpoints. Server components read from the repository boundary; client components are limited to interactions that need browser state:

- `SiteHeader`, `SearchBox`: navigation, debounced search and keyboard interactions.
- `CountryExplorer`, `VisaExplorer`: filters and pagination.
- `FavoriteButton`: localStorage only; no account requirement.
- `ShareActions`: browser share, email and copy-link affordances.
- `VisaGuide`: modular rendering of structured Visa fields.

The browser never talks to PostgreSQL. Public reads go through server components or the read-only `/api` boundary.

### 2. Content/repository layer — `src/lib/data`

`src/lib/data/index.ts` is the current read model. It deliberately returns the country catalog and category taxonomy from deterministic source files so the site runs without a database. The `PUBLISHED_VISAS` collection is empty by design.

The module is the swap point for Prisma queries. `src/lib/data/prisma-repository.ts` contains the production-shaped adapter and maps normalized Prisma rows to the public read model. Wiring it in can be controlled by environment/deployment policy. The adapter implements the same operations:

```text
listCountries(filters, pagination)
getCountryBySlug(slug)
listCategories()
listPublishedVisas(filters, pagination)
getPublishedVisa(countrySlug, visaSlug)
searchPublishedContent(query)
```

All public queries must enforce `status = PUBLISHED` and `isDemo = false` at the repository boundary. Admin queries must be separate and session-authorized.

### 3. Persistence — PostgreSQL + Prisma

`prisma/schema.prisma` is normalized for the target scale: 200+ countries, 1,000+ visa entities, 10,000+ documents and 20,000+ FAQs. Repeated blocks are rows rather than a large opaque page blob:

- `Country` and `Region` provide the directory hierarchy.
- `VisaCategory` provides the stable taxonomy.
- `Visa` is the canonical visa entity.
- `VisaRequirement`, `VisaDocument`, `VisaFee`, `VisaStep` model repeated structured sections.
- `Source` and `VisaSource` provide transparent provenance.
- `Faq`, related-entity join tables and `Revision` support content quality and discovery.
- `SeoMetadata` allows controlled overrides without hardcoding metadata in routes.
- `AdminUser` provides the role boundary for editorial operations.

### 4. Operational boundaries

- `src/lib/validation.ts`: Zod draft and publish validation.
- `src/lib/security.ts`: input sanitization and a process-local rate-limit starter. Production can replace it with shared Redis/edge KV without changing callers.
- `src/lib/auth.ts`: admin session boundary. Local preview is enabled in development; production requires a real session cookie from the future auth provider.
- `src/lib/analytics.ts`: provider-neutral event boundary. No paid analytics SDK is loaded.
- `src/lib/seo.ts`: one place for metadata, canonical URLs and JSON-LD builders.

## Request and publishing flow

```text
Public request
  → route params/search params normalized
  → repository query for published, non-demo content
  → server-rendered page
  → metadata + canonical + applicable JSON-LD
  → sitemap inclusion only when indexable

Admin edit
  → authenticated role check
  → validated draft
  → source relationships attached
  → revision snapshot written
  → review
  → publish guardrails
  → cache invalidation/revalidation
  → public route + metadata + sitemap become eligible
```

## URL decisions

Canonical public guide URLs are nested under the country:

```text
/countries
/countries/{country-slug}
/countries/{country-slug}/visas
/countries/{country-slug}/visas/{visa-slug}
/categories
/categories/{category-slug}
/visas
/compare
/search?q={query}
```

Nesting keeps the country entity visible in the URL, creates a strong breadcrumb hierarchy and makes country-specific slug uniqueness safe. Legacy `/country/{slug}` and `/visa/{country}/{slug}` patterns redirect permanently through `next.config.ts`.

## Rendering and caching plan

- Public directory and published guide pages should be statically generated or ISR-backed from the database.
- The current country pages are generated at build time from metadata and are `noindex` until content exists.
- Public API responses send `s-maxage`/stale-while-revalidate hints.
- On publish/update, invalidate the affected country, category, visa and sitemap tags. `sitemap.xml` should be regenerated immediately after a successful publish transaction.
- Do not prefetch every guide or load a search engine on page load. Search is debounced and can later switch from PostgreSQL indexes to Meilisearch, Typesense or Elasticsearch behind the repository interface.

Recommended future cache tags:

```text
countries:list
country:{countryId}
categories:list
category:{categoryId}
visa:{visaId}
sitemap
```

## Scale and performance

- Keep public pages server-rendered and send only interactive islands to the browser.
- Index `Country.name`, ISO fields, `Visa.name`, `Visa.slug`, status/category/country composites and source joins as represented in Prisma.
- Use cursor pagination for very large admin tables; public directories may use page-number pagination for crawlable collections.
- Use `next/image` when country/OG assets become real files. Current flags are Unicode metadata, so no image payload is required.
- Keep related links curated (same category/region and explicit joins), never a full graph dump.
- Add a shared search index only when PostgreSQL search is no longer sufficient; the UI does not need to change.

## i18n and RTL readiness

The content model should evolve from one language column to locale-aware records (`CountryTranslation`, `VisaTranslation`, etc.) rather than duplicating entities. Route locale prefixes can be added later (`/ar/...`, `/es/...`) with `hreflang` generated from the same canonical entity. UI copy should move to locale dictionaries before translations are introduced. CSS is designed to use logical spacing in new components and can be switched with `dir="rtl"`; no English content is falsely presented as Arabic in this release.

## Admin boundary

The visible local admin workspace is an architecture preview, not a production login. In production:

1. Replace the session placeholder with an OIDC/passwordless provider.
2. Store only secure, httpOnly, sameSite session cookies.
3. Authorize every mutation by role (`EDITOR`, `REVIEWER`, `ADMIN`).
4. Put mutations under private server actions or `/api/admin/*`; never expose them through the public read routes.
5. Apply CSRF protection to cookie-authenticated mutations and audit every revision.

No admin mutation endpoint is shipped in this stage, so no sensitive admin write surface is exposed.
