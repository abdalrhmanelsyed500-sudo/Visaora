export const CACHE_TAGS = {
  countries: "countries:list",
  categories: "categories:list",
  sitemap: "sitemap",
  country: (id: string) => `country:${id}`,
  category: (id: string) => `category:${id}`,
  visa: (id: string) => `visa:${id}`,
} as const;

/**
 * Keep invalidation names in one place. The production repository can call
 * Next revalidation APIs after a successful publish transaction without making
 * content components aware of cache implementation details.
 */
export function cacheTagsForVisa(visa: { id: string; countryId: string; categoryId: string }) {
  return [CACHE_TAGS.visa(visa.id), CACHE_TAGS.country(visa.countryId), CACHE_TAGS.category(visa.categoryId), CACHE_TAGS.sitemap];
}
