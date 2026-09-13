import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CountryExplorer } from "@/components/country-explorer";
import { getCountries } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Countries — Explore Visa Pathways",
  description: "Browse Visaora's global country directory and explore structured visa pathways by destination.",
  alternates: { canonical: "/countries" },
};

export default function CountriesPage() {
  const countries = getCountries();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Countries — Visaora",
    url: absoluteUrl("/countries"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: countries.length,
      itemListElement: countries.slice(0, 24).map((country, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: country.name,
        url: absoluteUrl(`/countries/${country.slug}`),
      })),
    },
  };

  return (
    <>
      <section className="page-top">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Countries" }]} />
          <span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Country explorer</span>
          <h1>Find your next destination.</h1>
          <p>Explore country metadata and a consistent starting point for visa pathways around the world. Guides appear as they are researched and reviewed.</p>
        </div>
      </section>
      <div className="container">
        <CountryExplorer countries={countries} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
