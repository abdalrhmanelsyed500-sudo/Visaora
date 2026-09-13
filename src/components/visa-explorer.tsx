"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Country, Visa, VisaCategory } from "@/lib/types";
import { EmptyState } from "./empty-state";
import { VisaCard } from "./visa-card";

export function VisaExplorer({ visas, countries, categories }: { visas: Visa[]; countries: Country[]; categories: VisaCategory[] }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");

  const regions = useMemo(() => Array.from(new Set(countries.map((item) => item.region))).sort(), [countries]);
  const filteredVisas = useMemo(() => visas.filter((visa) => {
    const matchesQuery = !query.trim() || `${visa.name} ${visa.countryName} ${visa.category}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCountry = !country || visa.countryId === country;
    const matchesCategory = !category || visa.categorySlug === category;
    const matchesRegion = !region || countries.find((item) => item.id === visa.countryId)?.region === region;
    return matchesQuery && matchesCountry && matchesCategory && matchesRegion;
  }), [visas, countries, query, country, category, region]);

  return (
    <section className="directory-section" aria-labelledby="visa-results-heading">
      <h2 id="visa-results-heading" className="sr-only">Visa directory results</h2>
      <div className="filter-panel">
        <div className="filter-field">
          <label htmlFor="visa-search">Search</label>
          <label className="control-search">
            <Search size={14} aria-hidden="true" />
            <span className="sr-only">Search visa guides</span>
            <input id="visa-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Visa name or purpose" />
          </label>
        </div>
        <div className="filter-field">
          <label htmlFor="visa-country">Country</label>
          <select id="visa-country" className="select-control" value={country} onChange={(event) => setCountry(event.target.value)}>
            <option value="">All countries</option>
            {countries.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="visa-category">Category</label>
          <select id="visa-category" className="select-control" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="visa-region">Region</label>
          <select id="visa-region" className="select-control" value={region} onChange={(event) => setRegion(event.target.value)}>
            <option value="">All regions</option>
            {regions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="directory-toolbar">
        <p className="directory-toolbar-copy"><strong>{filteredVisas.length}</strong> published guides</p>
        <span className="directory-toolbar-copy">Only source-backed content appears here</span>
      </div>

      {filteredVisas.length ? <div className="visa-card-grid">{filteredVisas.map((visa) => <VisaCard key={visa.id} visa={visa} />)}</div> : <EmptyState kind="visa" />}
    </section>
  );
}
