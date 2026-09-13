import type { Metadata } from "next";
import { ArrowRight, FileText, Layers3, MapPin } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { SearchPageForm } from "@/components/search-box";
import { searchDirectory } from "@/lib/data";
import { sanitizeSearchQuery } from "@/lib/security";
import type { SearchResult } from "@/lib/types";

export const metadata: Metadata = {
  title: "Search the Visaora Directory",
  description: "Search countries, visa types and categories in the Visaora directory.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

function ResultIcon({ type }: { type: SearchResult["type"] }) {
  if (type === "country") return <MapPin size={17} />;
  if (type === "category") return <Layers3 size={17} />;
  return <FileText size={17} />;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = sanitizeSearchQuery(rawQuery);
  const results = query ? searchDirectory(query, 30) : [];

  return (
    <div className="container search-page">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <div className="search-page-header">
        <span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Directory search</span>
        <h1>What are you looking for?</h1>
        <p>Search country names, common abbreviations, visa types and pathway categories.</p>
      </div>
      <SearchPageForm initialQuery={query} />

      {query ? (
        <section className="search-results-section" aria-labelledby="search-results-heading">
          <h2 id="search-results-heading" className="sr-only">Search results</h2>
          <div className="directory-toolbar">
            <p className="directory-toolbar-copy">Results for <strong>“{query}”</strong></p>
            <span className="directory-toolbar-copy">{results.length} matches</span>
          </div>
          {results.length ? (
            <div className="search-page-results">
              {results.map((result) => (
                <Link className="search-page-result" key={`${result.type}-${result.id}`} href={result.href}>
                  <span className="search-result-icon"><ResultIcon type={result.type} /></span>
                  <span className="search-page-result-copy"><h2>{result.title}</h2><p>{result.subtitle}</p></span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : <div className="search-empty"><EmptyState kind="search" /></div>}
        </section>
      ) : (
        <div className="search-empty"><EmptyState kind="search" /></div>
      )}
    </div>
  );
}
