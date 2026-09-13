"use client";

import { ChevronLeft, ChevronRight, ListFilter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Country } from "@/lib/types";
import { CONTINENTS, REGIONS } from "@/lib/constants";
import { track } from "@/lib/analytics";
import { CountryCard } from "./country-card";

const PAGE_SIZE = 24;

type SortMode = "alphabetical" | "region";

export function CountryExplorer({ countries }: { countries: Country[] }) {
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("All regions");
  const [region, setRegion] = useState("All editorial regions");
  const [sort, setSort] = useState<SortMode>("alphabetical");
  const [page, setPage] = useState(1);

  const filteredCountries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return countries
      .filter((country) => {
        const matchesQuery = !normalized || [country.name, country.officialName, country.iso2, country.iso3, ...country.aliases]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
        const matchesContinent = continent === "All regions" || country.continent === continent;
        const matchesRegion = region === "All editorial regions" || country.region === region;
        return matchesQuery && matchesContinent && matchesRegion;
      })
      .sort((a, b) => {
        if (sort === "region") return a.region.localeCompare(b.region) || a.name.localeCompare(b.name);
        return a.name.localeCompare(b.name);
      });
  }, [countries, continent, query, region, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredCountries.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visibleCountries = filteredCountries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function updateFilter(setter: (value: string) => void, value: string, filter: string) {
    setter(value);
    setPage(1);
    track("filter", { filter, value });
  }

  return (
    <section className="directory-section" aria-labelledby="country-directory-heading">
      <div className="directory-toolbar">
        <p className="directory-toolbar-copy"><strong>{filteredCountries.length}</strong> destinations in the directory</p>
        <div className="directory-controls">
          <label className="control-search">
            <Search size={15} aria-hidden="true" />
            <span className="sr-only">Search countries</span>
            <input
              value={query}
              onChange={(event) => updateFilter(setQuery, event.target.value, "country_search")}
              placeholder="Find a country"
              type="search"
            />
          </label>
          <label>
            <span className="sr-only">Sort countries</span>
            <select className="select-control" value={sort} onChange={(event) => { setSort(event.target.value as SortMode); setPage(1); track("filter", { filter: "country_sort", value: event.target.value }); }}>
              <option value="alphabetical">A to Z</option>
              <option value="region">By region</option>
            </select>
          </label>
        </div>
      </div>

      <div className="filter-tabs" aria-label="Filter by continent">
        <button className="filter-tab" type="button" aria-pressed={continent === "All regions"} onClick={() => updateFilter(setContinent, "All regions", "continent")}>
          <ListFilter size={12} aria-hidden="true" /> All
        </button>
        {CONTINENTS.map((item) => (
          <button key={item} className="filter-tab" type="button" aria-pressed={continent === item} onClick={() => updateFilter(setContinent, item, "continent")}>
            {item}
          </button>
        ))}
      </div>

      <div className="directory-controls" style={{ justifyContent: "flex-start", marginBottom: 23 }}>
        <label>
          <span className="sr-only">Filter by editorial region</span>
          <select className="select-control" value={region} onChange={(event) => updateFilter(setRegion, event.target.value, "editorial_region")}>
            <option>All editorial regions</option>
            {REGIONS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {visibleCountries.length ? (
        <>
          <h2 id="country-directory-heading" className="sr-only">Country directory results</h2>
          <div className="directory-grid">
            {visibleCountries.map((country) => <CountryCard key={country.id} country={country} />)}
          </div>
          {pageCount > 1 ? (
            <nav className="pagination" aria-label="Country directory pages">
              <button className="pagination-button" type="button" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Previous page"><ChevronLeft size={15} /></button>
              <span>Page {safePage} of {pageCount}</span>
              <button className="pagination-button" type="button" disabled={safePage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} aria-label="Next page"><ChevronRight size={15} /></button>
            </nav>
          ) : null}
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon"><Search size={22} /></span>
          <h2>No destinations match those filters</h2>
          <p>Try another name or reset the region filters to browse the complete directory.</p>
          <button className="button button-secondary" type="button" onClick={() => { setQuery(""); setContinent("All regions"); setRegion("All editorial regions"); setPage(1); }}>Reset filters</button>
        </div>
      )}
    </section>
  );
}
