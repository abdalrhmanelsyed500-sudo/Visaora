# Visaora content guide

## Editorial promise

Do not add real visa information until it can be tied to an official source. Never fill a blank with an assumption for SEO. The UI's `Information not yet published.` state is intentional.

Do not add:

- visa requirements, documents, eligibility or application steps without a source,
- invented fees, processing times, validity or stay durations,
- fake popularity, approval rates, reviews, FAQs or update dates,
- government-affiliation language or guaranteed outcomes,
- long generic paragraphs repeated across countries.

## Workflow

```text
Editor creates draft
  ↓
Select existing Country + VisaCategory
  ↓
Add Visa fields and structured blocks
  ↓
Attach official Source records
  ↓
Validation checks completeness and relationships
  ↓
Editor submits REVIEW
  ↓
Reviewer checks source freshness and content accuracy
  ↓
Revision snapshot + PUBLISHED
  ↓
Metadata, links, cache and sitemap update
```

## Structured payload

The public `Visa` entity has the following shape. Optional values should remain `null`, not a made-up string:

```json
{
  "countryId": "<existing-country-id>",
  "categoryId": "<existing-category-id>",
  "name": "<official pathway name>",
  "slug": "<lowercase-stable-slug>",
  "subcategory": null,
  "shortDescription": "<source-backed one or two sentence summary>",
  "longDescription": "<source-backed overview>",
  "purpose": null,
  "eligibility": null,
  "validity": null,
  "stayDuration": null,
  "entryType": "UNKNOWN",
  "applicationMethod": null,
  "processingTime": null,
  "status": "DRAFT",
  "featured": false,
  "isDemo": false,
  "lastVerified": null
}
```

Repeated data belongs in related rows, not a comma-separated paragraph:

- one `VisaRequirement` per requirement,
- one `VisaDocument` per document,
- one `VisaFee` per fee line,
- one `VisaStep` per application step,
- one `Faq` per reviewed question,
- one `VisaSource` join for each source.

## Source standard

Create a `Source` first or reuse an existing source record:

```json
{
  "title": "<clear page title>",
  "url": "https://<official-domain>/<path>",
  "publisher": "<government or authority>",
  "countryId": "<country-id-or-null>",
  "sourceType": "GOVERNMENT",
  "accessedAt": "<date-time>"
}
```

Use `GOVERNMENT`, `EMBASSY`, `IMMIGRATION_AUTHORITY`, `CONSULATE` or `APPLICATION_PORTAL` where appropriate. The page should show official source links plainly. A source is not automatically proof of every field; editors should record which source supports the relevant content.

## Publish gate

`src/lib/validation.ts` is the shared shape check. Before publishing, it requires:

- country, category, name and stable slug,
- short and long descriptions,
- one or more source IDs,
- a verification date.

The production service should add URL/domain checks, source-to-country checks, duplicate checks, reviewer authorization and a revision transaction. A Visa can be saved as draft with incomplete optional content; it cannot be public in that state.

## Exact method for the first country's visas

When instructed to add a country:

1. Locate the country with `getCountry("<country-slug>")` or its ISO2/ISO3. Do not create a duplicate country.
2. Map each real pathway to one existing category. Create a new category only if the editorial taxonomy genuinely lacks it.
3. For each pathway, insert a `Visa` with a stable slug and `DRAFT` status. Do not change the public React components.
4. Add only facts present in authoritative sources. Keep unknown fields `null`.
5. Add requirements, documents, fees, steps and FAQs as normalized related rows. Give every row an order.
6. Attach at least one official source through `VisaSource`; record access/verification dates.
7. Run `validateVisaForPublish`. Fix validation errors rather than bypassing them.
8. Create a `Revision` snapshot, submit for review, and publish only after a reviewer confirms the source links and content.
9. Confirm the generated URL `/countries/<country-slug>/visas/<visa-slug>`, canonical, metadata, breadcrumbs, source links and sitemap entry.
10. Run `npm test`, `npm run typecheck` and the technical SEO checklist.

If the instruction says “add all visas,” use a content inventory and process each guide independently. Do not generate a bulk set of empty entities simply to create URLs.

## Demo records

No demo Visa records are shipped. If the UI needs a fixture in development, set `isDemo: true`, use an unmistakable name such as `Example Visa`, keep it out of the public repository and sitemap, and never use it in production.
