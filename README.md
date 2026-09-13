# Visaora

> Every country. Every pathway. One clear guide.

Visaora is a global visa discovery and knowledge platform. This first release builds the engine — the country directory, taxonomy, database contract, routing, SEO system, search layer, CMS workspace and reusable content modules — without publishing real visa facts.

## Current status

- ✅ Next.js 16 App Router + TypeScript strict mode
- ✅ Mobile-first editorial/SaaS design system with accessible focus states and reduced-motion support
- ✅ Country directory seeded with 195 country metadata records
- ✅ Eight reusable visa categories (taxonomy only)
- ✅ Country, visa-directory, category, search and compare routes
- ✅ Empty states that explicitly avoid invented fees, requirements, timelines or eligibility facts
- ✅ PostgreSQL + Prisma normalized schema for future content
- ✅ Draft → review → published → archived content lifecycle and revision model
- ✅ Debounced, keyboard-friendly search with aliases and a provider-neutral search boundary
- ✅ LocalStorage favorites without mandatory accounts
- ✅ Source-aware visa component with verification and share modules, ready for the first published record
- ✅ Dynamic metadata, canonical URLs, robots.txt, sitemap.xml, breadcrumbs and JSON-LD where appropriate
- ✅ Read-only public API routes with input limits and search rate limiting
- ✅ Admin/CMS information architecture with real repository counts (local preview only)
- ✅ Tests for directory integrity, slugs, search, publish validation, metadata and sitemap policy
- 🚫 No real visa content, no AI API, no paid API dependency, no fake popularity metrics

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run typecheck
npm test
npm run build
npm run db:generate   # when Prisma engines/network are available
npm run db:push       # apply schema to DATABASE_URL
npm run db:seed       # countries, regions and categories only; never visa facts
```

The UI currently uses a deterministic repository in `src/lib/data`. Prisma is the persistence contract and can be connected behind that boundary when a PostgreSQL database is provisioned. This means the site remains runnable with zero paid services and without a database in the first build.

## Project structure

```text
src/
├── app/
│   ├── page.tsx                         home / discovery engine
│   ├── countries/                       country explorer and country routes
│   │   └── [slug]/visas/[visa]/          source-backed visa guide route
│   ├── visas/                            global visa explorer
│   ├── categories/                       taxonomy directory and landing routes
│   ├── search/                           noindex search results
│   ├── compare/                          comparison-ready empty state
│   ├── admin/                            noindex CMS workspace
│   ├── api/                              public read-only API boundary
│   ├── robots.ts / sitemap.ts            technical SEO endpoints
│   └── opengraph-image.tsx               shared dynamic social image
├── components/                           reusable UI and content modules
├── lib/
│   ├── data/                             repository boundary + country catalog
│   ├── seo.ts                            metadata and structured data builders
│   ├── validation.ts                     publish-time Zod validation
│   ├── security.ts                       sanitization and rate-limit boundary
│   ├── analytics.ts                      provider-neutral event boundary
│   ├── auth.ts                            admin session boundary
│   └── db.ts                              Prisma singleton
prisma/
├── schema.prisma                         normalized PostgreSQL model
└── seed.ts                               metadata/taxonomy seed; no Visa rows
tests/                                     Node test runner coverage
```

## Route map

| Route | Purpose | Indexing |
| --- | --- | --- |
| `/` | Visa discovery engine | index |
| `/countries` | Searchable, filterable country directory | index |
| `/countries/[country]` | Country landing page and category explorer | `noindex` until a source-backed guide exists |
| `/countries/[country]/visas` | Country visa directory | noindex until content exists |
| `/countries/[country]/visas/[visa]` | Modular structured visa guide | index after published status + verification |
| `/visas` | Global visa explorer with filters | index as a collection; results are data-driven |
| `/categories` | Taxonomy directory | index |
| `/categories/[category]` | Category landing page | noindex until published guides exist |
| `/compare` | Comparison architecture | noindex until comparisons exist |
| `/search?q=` | Search results | noindex; query URLs are not in sitemap |
| `/admin/*` | CMS workspace | noindex and session-protected in production |

The current country and category pages intentionally render helpful directory context, but remain `noindex,follow` while they have no published visa guides. This prevents a launch with 195 thin, near-empty SEO pages. Once content is reviewed, the same route automatically becomes indexable and enters the sitemap.

## Add the first country's visas later

Do not hardcode a visa into a component. When you are ready:

1. Choose the existing country by its stable `slug`/ISO identifier, for example the record returned by `getCountry("<country-slug>")`.
2. Choose one of the existing category slugs, or create a taxonomy record in Admin/Prisma first.
3. Create a `Visa` record with `status: DRAFT`, a lowercase stable slug, and structured fields. Add requirements, documents, fees, steps, FAQs and related entities through their normalized tables.
4. Create `Source` records for official government/embassy/immigration/application sources and join them through `VisaSource`.
5. Run `validateVisaForPublish` before a status change. A publish attempt fails without name, country, category, slug, descriptions, at least one source and `lastVerified`.
6. Save a `Revision` snapshot, move the record to `REVIEW`, then have a reviewer change it to `PUBLISHED`.
7. The public repository exposes the record; metadata, canonical, breadcrumbs, source section, related links and `sitemap.xml` update from the same entity. Drafts, archives and demo rows never appear publicly.

See [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) for the content payload shape, and [`DATABASE.md`](./DATABASE.md) for the relationship details.

## Further reading

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — boundaries, scaling and component map
- [`DATABASE.md`](./DATABASE.md) — Prisma schema and editorial workflow
- [`SEO.md`](./SEO.md) — indexing, metadata, sitemap and internal-linking policy
- [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) — how future source-backed content is added
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — PostgreSQL, environment and production checklist
