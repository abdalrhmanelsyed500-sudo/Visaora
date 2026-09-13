# Visaora database design

## Database choice

The target persistence layer is PostgreSQL accessed through Prisma. PostgreSQL gives reliable relational constraints, indexed filtering, full-text options and a straightforward path from the initial catalog to thousands of structured content blocks. The running UI uses a static read repository until `DATABASE_URL` is available; this avoids making a paid service or local database mandatory for the first release.

## Core entities

### `Region`

Editorial/geographic grouping used for discovery. It stores `name`, `slug`, `continent` and an optional description. A country may belong to one region.

### `Country`

Directory metadata:

```text
id, name, officialName, iso2, iso3, numericCode,
continent, regionId, subregion, capital, flag, slug,
description, status, createdAt, updatedAt
```

ISO codes and `slug` are unique. `continent`, `regionId`, `status` and `name` are indexed for directory filters. The initial seed contains 195 records and no visa content.

### `VisaCategory`

A reusable taxonomy node:

```text
id, name, slug, description, icon, sortOrder, status
```

The initial taxonomy contains Visit, Study, Work, Business, Family, Investment, Immigration and Transit & other. A category is a framework; it is not a claim that a pathway exists in every country.

### `Visa`

The canonical content entity. It belongs to exactly one country and one category and uses a unique `(countryId, slug)` pair:

```text
id, countryId, categoryId, name, slug, subcategory,
shortDescription, longDescription, purpose, eligibility,
validity, stayDuration, entryType, applicationMethod,
processingTime, status, featured, isDemo, lastVerified,
createdAt, updatedAt
```

Published public queries must filter `status = PUBLISHED AND isDemo = false`. Every unknown field stays `NULL`; it is never filled with a guessed value.

### Repeated structured blocks

- `VisaRequirement`: requirement title, description and order.
- `VisaDocument`: document name, description, required flag and order.
- `VisaFee`: label, optional decimal amount/currency and notes. Do not publish an amount without source support.
- `VisaStep`: numbered application step, title, description.
- `Faq`: question, answer and order. FAQ JSON-LD is emitted only for published, actual FAQ rows.

These tables prevent the frontend from depending on one hardcoded HTML article. The page renderer composes them into modules.

### Sources and relationships

`Source` is reusable and records `title`, `url`, `publisher`, `countryId`, `sourceType` and `accessedAt`. `VisaSource` is the ordered many-to-many join. Allowed source types include government, embassy, immigration authority, consulate and application portal.

`RelatedVisa` and `RelatedCountry` are explicit ordered joins. They are safer than automatically linking every entity to every other entity. The repository can additionally suggest same-country/same-category items, but editorial joins should win.

### Governance

- `ContentStatus`: `DRAFT`, `REVIEW`, `PUBLISHED`, `ARCHIVED`.
- `Revision`: immutable JSON snapshot, version, status, creator and timestamp. A publish action should write a revision in the same transaction as the status update.
- `SeoMetadata`: optional title/description/OG/canonical overrides and `noIndex` flag. Defaults remain generated from the entity.
- `AdminUser`: email, password hash or future identity reference, role and revision relation. Never expose this model through public APIs.

## Relationship diagram

```text
Region 1 ─── * Country 1 ─── * Visa * ─── 1 VisaCategory
                         │       │
                         │       ├── * VisaRequirement
                         │       ├── * VisaDocument
                         │       ├── * VisaFee
                         │       ├── * VisaStep
                         │       ├── * Faq
                         │       ├── * VisaSource * ─── 1 Source
                         │       ├── * RelatedVisa
                         │       ├── * RelatedCountry
                         │       └── * Revision
                         └── * Source
```

## Seed policy

`npm run db:seed` upserts regions, countries and categories only. It intentionally creates zero `Visa`, `Source`, `Faq`, fee, document or requirement rows. This protects the first release from accidental false content.

## Publish validation

`validateVisaForPublish` in `src/lib/validation.ts` checks shape and then requires:

- valid country and category references,
- non-empty name and stable slug,
- short and long descriptions,
- at least one attached source ID,
- a recorded `lastVerified` date.

A production mutation service must also verify that every source URL is valid, the source is allowed for the country, the slug is unique, and the actor has reviewer permission. Missing optional facts remain absent.

## Transaction outline

```sql
BEGIN;
-- create/update Visa as DRAFT
-- upsert structured blocks and VisaSource joins
-- insert Revision(version + 1, snapshot)
-- reviewer changes status to REVIEW/PUBLISHED after validation
-- write an audit event / cache invalidation
COMMIT;
```

Slug changes must create a redirect record before updating the canonical slug. A future `SlugRedirect` model should contain `fromPath`, `toPath`, status code and creation metadata; never silently break an indexed URL.

## Adding the first real guide

Use an existing country ISO/slug and category slug. Create the visa in draft, attach source records through `VisaSource`, add only verified fields, run publish validation, create a revision, review it, then publish. The public read repository will then make the guide available to its nested route, metadata and sitemap. See `CONTENT_GUIDE.md` for the exact editorial sequence.
