import assert from "node:assert/strict";
import test from "node:test";
import { getCategory, getCountries, getCountry, getDirectoryStats, searchDirectory } from "../src/lib/data";
import { categoryMetadata, countryMetadata } from "../src/lib/seo";
import { isStableSlug, slugify } from "../src/lib/slug";
import { validateVisaForPublish } from "../src/lib/validation";
import sitemap from "../src/app/sitemap";


test("country directory contains broad country metadata without visa facts", () => {
  const countries = getCountries();
  assert.ok(countries.length >= 190);
  const unitedStates = getCountry("united-states");
  assert.equal(unitedStates?.iso2, "US");
  assert.equal(unitedStates?.publishedVisaCount, 0);
  assert.equal(unitedStates?.description, null);
});

test("slug generation stays lowercase, readable and stable", () => {
  assert.equal(slugify("Côte d'Ivoire"), "cote-d-ivoire");
  assert.equal(slugify("United States"), "united-states");
  assert.equal(isStableSlug("united-states"), true);
  assert.equal(isStableSlug("United States"), false);
});

test("search resolves aliases and category intent", () => {
  const usa = searchDirectory("USA");
  assert.equal(usa[0]?.title, "United States");
  assert.equal(usa[0]?.href, "/countries/united-states");
  const student = searchDirectory("student visa");
  assert.equal(student.some((result) => result.type === "category" && result.title === "Study pathways"), true);
});

test("publish validation rejects incomplete visa records and accepts source-backed shape", () => {
  const incomplete = validateVisaForPublish({
    countryId: "country-usa",
    categoryId: "category-study",
    name: "Example Visa",
    slug: "example-visa",
    sourceIds: [],
  });
  assert.equal(incomplete.success, false);

  const complete = validateVisaForPublish({
    countryId: "country-usa",
    categoryId: "category-study",
    name: "Example Visa",
    slug: "example-visa",
    shortDescription: "A reviewed guide.",
    longDescription: "A reviewed overview.",
    sourceIds: ["source-1"],
    lastVerified: "2026-09-13",
  });
  assert.equal(complete.success, true);
});

test("metadata and sitemap avoid thin country and category URLs", () => {
  const country = getCountry("united-states");
  const category = getCategory("work");
  assert.ok(country && category);
  const countryMeta = countryMetadata(country);
  const categoryMeta = categoryMetadata(category);
  assert.equal((countryMeta.robots as { index?: boolean })?.index, false);
  assert.equal((categoryMeta.robots as { index?: boolean })?.index, false);

  const urls = sitemap().map((entry) => entry.url);
  assert.equal(urls.includes("http://localhost:3000/countries"), true);
  assert.equal(urls.includes("http://localhost:3000/countries/united-states"), false);
  assert.equal(urls.some((url) => url.includes("/visas/") && !url.endsWith("/visas")), false);
});

test("dashboard numbers are database/repository truths, not fake popularity", () => {
  const stats = getDirectoryStats();
  assert.equal(stats.publishedVisaGuides, 0);
  assert.equal(stats.draftVisaGuides, 0);
  assert.equal(stats.indexableCountries, 0);
});
