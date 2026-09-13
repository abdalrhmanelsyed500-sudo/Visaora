import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { VisaExplorer } from "@/components/visa-explorer";
import { getCategories, getCountry, getPublishedVisas } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) return { title: "Country not found" };
  return {
    title: `${country.name} Visa Types`,
    description: `Explore published visa guides and structured pathways for ${country.name} on Visaora.`,
    alternates: { canonical: `/countries/${country.slug}/visas` },
    robots: { index: false, follow: true },
  };
}

export default async function CountryVisasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) notFound();
  const visas = getPublishedVisas().filter((visa) => visa.countryId === country.id);

  return (
    <>
      <section className="page-top">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Countries", href: "/countries" }, { label: country.name, href: `/countries/${country.slug}` }, { label: "Visa types" }]} />
          <span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Country visa directory</span>
          <h1>{country.name} visa types.</h1>
          <p>Browse the published visa guides for {country.name}. Only source-backed content that has passed review is shown here.</p>
        </div>
      </section>
      <div className="container">
        {visas.length ? <VisaExplorer visas={visas} countries={[country]} categories={getCategories()} /> : <div className="directory-section"><EmptyState kind="country" countryHref={`/countries/${country.slug}`} /></div>}
      </div>
    </>
  );
}
