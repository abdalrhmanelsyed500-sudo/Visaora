import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe2, Info, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryCard } from "@/components/category-card";
import { EmptyState } from "@/components/empty-state";
import { FavoriteButton } from "@/components/favorite-button";
import { getCategories, getCountry, getCountryVisaCount, getCountries, getRelatedCountries } from "@/lib/data";
import { absoluteUrl, breadcrumbJsonLd, countryMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getCountries().map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountry(slug);
  return country ? countryMetadata(country) : { title: "Country not found" };
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) notFound();

  const categories = getCategories();
  const visaCount = getCountryVisaCount(country.id);
  const relatedCountries = getRelatedCountries(country);
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Countries", url: "/countries" },
    { name: country.name },
  ];
  const countryJsonLd = {
    "@context": "https://schema.org",
    "@type": "Country",
    name: country.name,
    alternateName: country.officialName,
    identifier: country.iso3,
    containedInPlace: { "@type": "Continent", name: country.continent },
    url: absoluteUrl(`/countries/${country.slug}`),
  };

  return (
    <>
      <section className="country-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Countries", href: "/countries" }, { label: country.name }]} />
          <div className="country-hero-main">
            <div className="country-identity">
              <span className="country-hero-flag" role="img" aria-label={`${country.name} flag`}>{country.flag}</span>
              <div>
                <h1>{country.name}</h1>
                <p className="country-official-name">{country.officialName}</p>
              </div>
            </div>
            <div className="country-hero-tag"><ShieldCheck size={15} /> Directory destination</div>
          </div>
          <div className="country-quick-facts" aria-label={`${country.name} facts`}>
            <div className="quick-fact"><span className="quick-fact-label">Region</span><strong className="quick-fact-value">{country.region}</strong></div>
            <div className="quick-fact"><span className="quick-fact-label">Subregion</span><strong className="quick-fact-value">{country.subregion}</strong></div>
            <div className="quick-fact"><span className="quick-fact-label">ISO 2</span><strong className="quick-fact-value">{country.iso2}</strong></div>
            <div className="quick-fact"><span className="quick-fact-label">Guides</span><strong className="quick-fact-value">{visaCount ? visaCount : "Coming soon"}</strong></div>
          </div>
        </div>
      </section>

      <div className="container country-content">
        <div className="country-content-grid">
          <div className="content-column">
            <div className="content-heading">
              <span className="eyebrow"><span className="eyebrow-dot" />Visa explorer</span>
              <h2>Explore visas for {country.name}</h2>
              <p>Choose a pathway category to see the guides available for this destination.</p>
              <Link className="section-link" href={`/countries/${country.slug}/visas`} style={{ marginTop: 15 }}>View all visa types <ArrowRight size={15} /></Link>
            </div>
            <div className="category-grid-compact">
              {categories.map((category) => <CategoryCard key={category.id} category={category} compact />)}
            </div>
            <div style={{ marginTop: 25 }}><EmptyState kind="country" countryHref="/countries" /></div>
          </div>

          <aside className="country-sidebar" aria-label="Country details">
            <div className="sidebar-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                <h3>Save this destination</h3>
                <FavoriteButton type="country" id={country.id} label={country.name} />
              </div>
              <p className="sidebar-note"><Info size={15} /> Save locally in your browser without creating an account. Your list stays on this device.</p>
            </div>
            <div className="sidebar-card">
              <h3>Directory details</h3>
              <ul className="sidebar-list">
                <li><span>Continent</span><strong>{country.continent}</strong></li>
                <li><span>Capital</span><strong>{country.capital}</strong></li>
                <li><span>ISO 3</span><strong>{country.iso3}</strong></li>
                <li><span>Numeric code</span><strong>{country.numericCode}</strong></li>
              </ul>
            </div>
            <div className="sidebar-card">
              <h3>About the data</h3>
              <p className="sidebar-note"><Globe2 size={15} /> Country metadata helps organize the directory. Visa details are not displayed until they are source-backed and reviewed.</p>
            </div>
          </aside>
        </div>

        {relatedCountries.length ? (
          <section className="related-section" aria-labelledby="related-countries-heading">
            <h2 id="related-countries-heading">More in {country.region}</h2>
            <div className="related-grid">
              {relatedCountries.map((related) => (
                <Link className="related-country-card" key={related.id} href={`/countries/${related.slug}`}>
                  <span className="flag" role="img" aria-label={`${related.name} flag`}>{related.flag}</span>
                  <span>{related.name}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(countryJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
    </>
  );
}
