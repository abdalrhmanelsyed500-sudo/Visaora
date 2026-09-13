import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { VisaExplorer } from "@/components/visa-explorer";
import { getCategories, getCountries, getDirectoryStats, getPublishedVisas } from "@/lib/data";

export const metadata: Metadata = {
  title: "Visa Types — Explore Global Pathways",
  description: "Explore Visaora's structured directory of visa types by country, category and region.",
  alternates: { canonical: "/visas" },
};

export default function VisasPage() {
  const stats = getDirectoryStats();
  return (
    <>
      <section className="page-top">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Visa types" }]} />
          <span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Global visa explorer</span>
          <h1>Find the right pathway.</h1>
          <p>Filter a global collection of structured visa guides by destination, purpose and region. Nothing is presented as a fact until it has been published and reviewed.</p>
        </div>
      </section>
      <div className="container">
        <div className="directory-stats" style={{ paddingTop: 31 }}>
          <div className="directory-stat"><strong>{stats.totalCountries}</strong><span>Destinations</span></div>
          <div className="directory-stat"><strong>{stats.categories}</strong><span>Categories</span></div>
          <div className="directory-stat"><strong>{stats.publishedVisaGuides}</strong><span>Published guides</span></div>
        </div>
        <VisaExplorer visas={getPublishedVisas()} countries={getCountries()} categories={getCategories()} />
      </div>
    </>
  );
}
