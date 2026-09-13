export const supportedLocales = ["en", "ar", "es", "fr", "de"] as const;
export type Locale = (typeof supportedLocales)[number];

export function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function directionForLocale(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

/**
 * English is the only shipped locale. Keep UI copy in dictionaries before
 * enabling locale-prefixed routes; content translations belong in database
 * translation tables, not duplicated Country/Visa entities.
 */
export const uiCopy = {
  en: {
    searchPlaceholder: "Search a country or visa type...",
    informationNotPublished: "Information not yet published.",
  },
} as const;
