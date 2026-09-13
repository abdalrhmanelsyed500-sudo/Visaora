"use client";

import { ArrowRight, FileText, Layers3, LoaderCircle, MapPin, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import type { SearchResult } from "@/lib/types";
import { track } from "@/lib/analytics";

export function SearchBox({
  className = "",
  initialQuery = "",
  autoFocus = false,
}: {
  className?: string;
  initialQuery?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const inputId = useId();
  const listId = `${inputId}-results`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(autoFocus);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsFocused(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      setResults([]);
      setIsLoading(false);
      requestRef.current?.abort();
      return;
    }

    const timeout = window.setTimeout(async () => {
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(cleanQuery)}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Search request failed");
        const payload = (await response.json()) as { results?: SearchResult[] };
        setResults(payload.results ?? []);
        setActiveIndex(-1);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 240);

    return () => window.clearTimeout(timeout);
  }, [query]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    track("search", { query: cleanQuery });
    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    }
    if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    }
    if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault();
      const result = results[activeIndex];
      track(result.type === "country" ? "country_click" : "visa_click", { result: result.title });
      setIsFocused(false);
      router.push(result.href);
    }
    if (event.key === "Escape") {
      setIsFocused(false);
      (event.target as HTMLInputElement).blur();
    }
  }

  const showDropdown = isFocused && query.trim().length > 0;

  return (
    <div ref={wrapperRef} className={`search-box ${className}`}>
      <form onSubmit={submitSearch} role="search">
        <label className="sr-only" htmlFor={inputId}>Search countries, visa types and categories</label>
        <div className="search-input-wrap">
          <Search size={20} aria-hidden="true" />
          <input
            id={inputId}
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search a country or visa type..."
            autoComplete="off"
            autoFocus={autoFocus}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            aria-controls={showDropdown ? listId : undefined}
            aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          />
          {query ? (
            <button
              className="button button-quiet"
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              style={{ minHeight: 34, padding: "0 7px" }}
            >
              <X size={15} />
            </button>
          ) : null}
          <button className="search-submit" type="submit" aria-label="Submit search">
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </form>

      {showDropdown ? (
        <div id={listId} className="search-results" role="listbox" aria-label="Search results">
          {isLoading ? (
            <div className="search-status"><LoaderCircle className="spin" size={16} aria-hidden="true" /> Searching the directory...</div>
          ) : results.length ? (
            <>
              <div className="search-results-label">Directory results</div>
              {results.map((result, index) => (
                <button
                  id={`${listId}-${index}`}
                  className="search-result"
                  key={`${result.type}-${result.id}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    track(result.type === "country" ? "country_click" : "visa_click", { result: result.title });
                    setIsFocused(false);
                    router.push(result.href);
                  }}
                >
                  <span className="search-result-icon">
                    {result.type === "country" ? <>{result.meta ?? <MapPin size={15} />}</> : result.type === "category" ? <Layers3 size={15} /> : <FileText size={15} />}
                  </span>
                  <span className="search-result-copy">
                    <span className="search-result-title">{result.title}</span>
                    <span className="search-result-subtitle">{result.subtitle}</span>
                  </span>
                  <ArrowRight className="search-result-arrow" size={14} aria-hidden="true" />
                </button>
              ))}
            </>
          ) : (
            <div className="search-status">No directory matches yet. Try a country, “work”, or “student”.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function SearchPageForm({ initialQuery = "" }: { initialQuery?: string }) {
  return <SearchBox className="search-page-form" initialQuery={initialQuery} autoFocus />;
}
