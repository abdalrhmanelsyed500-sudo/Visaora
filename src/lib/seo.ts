import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "./constants";
import type { Country, Visa, VisaCategory } from "./types";
import { isCategoryIndexable, isCountryIndexable } from "./data";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

function noIndexRobots(index: boolean) {
  return {
    index,
    follow: true,
    googleBot: {
      index,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — Explore Every Visa Pathway`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Explore Every Visa Pathway`,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Visaora" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Explore Every Visa Pathway`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: noIndexRobots(true),
};

export function countryMetadata(country: Country): Metadata {
  const title = `${country.name} Visas — Explore Visa Types`;
  const description = `Explore the Visaora directory for ${country.name} visa and immigration pathways. Structured guides are published as they are reviewed.`;
  const index = isCountryIndexable(country);

  return {
    title,
    description,
    alternates: { canonical: `/countries/${country.slug}` },
    robots: noIndexRobots(index),
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(`/countries/${country.slug}`),
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${country.name} on Visaora` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}

export function categoryMetadata(category: VisaCategory): Metadata {
  const title = `${category.name} Visa Pathways`;
  const description = `Browse structured ${category.name.toLowerCase()} visa pathways by country on Visaora.`;
  const index = isCategoryIndexable(category);

  return {
    title,
    description,
    alternates: { canonical: `/categories/${category.slug}` },
    robots: noIndexRobots(index),
    openGraph: { type: "website", title, description, url: absoluteUrl(`/categories/${category.slug}`) },
  };
}

export function visaMetadata(visa: Visa): Metadata {
  const title = `${visa.name} — Requirements, Eligibility & Application`;
  const description = visa.shortDescription || `A structured ${visa.name} guide for ${visa.countryName}, with reviewed sources and practical visa information.`;

  return {
    title,
    description,
    alternates: { canonical: `/countries/${visa.countrySlug}/visas/${visa.slug}` },
    robots: noIndexRobots(visa.status === "PUBLISHED" && !visa.isDemo),
    openGraph: {
      type: "article",
      title,
      description,
      url: absoluteUrl(`/countries/${visa.countrySlug}/visas/${visa.slug}`),
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${visa.name} on Visaora` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: absoluteUrl("/icon.svg"),
    description: SITE_DESCRIPTION,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: absoluteUrl(item.url) } : {}),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
