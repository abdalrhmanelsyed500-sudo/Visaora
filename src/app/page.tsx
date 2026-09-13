import { CheckCircle2, Globe2, Search, ShieldCheck } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { CountryCard } from "@/components/country-card";
import { SearchBox } from "@/components/search-box";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getCountries } from "@/lib/data";

const directoryHighlights = [
  "united-states",
  "canada",
  "united-kingdom",
  "germany",
  "australia",
  "france",
  "japan",
  "united-arab-emirates",
];

export default function HomePage() {
  const countries = getCountries();
  const highlights = countries.filter((country) => directoryHighlights.includes(country.slug));
  const categories = getCategories();

  return (
    <>
      <div className="container hero-wrap">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-content">
            <div>
              <span className="eyebrow eyebrow-light"><span className="eyebrow-dot" />Global visa discovery</span>
              <h1 id="hero-title">Explore every visa. <em>For every country.</em></h1>
              <p className="hero-copy">Find, compare and understand visa pathways around the world — organized into one clear, source-aware directory.</p>
              <SearchBox className="hero-search" />
              <div className="hero-note"><ShieldCheck size={13} aria-hidden="true" /> No guesses. No government affiliation. Just a clearer place to start.</div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="hero-center"><strong>Visaora</strong><span>Global paths</span></div>
              <div className="hero-float-card float-one"><Globe2 size={15} /> 195 destinations</div>
              <div className="hero-float-card float-two"><CheckCircle2 size={15} /> Source-aware</div>
              <div className="hero-float-card float-three"><Search size={15} /> One clear search</div>
            </div>
          </div>
        </section>
      </div>

      <section className="container home-section" aria-labelledby="highlights-heading">
        <SectionHeading eyebrow="Start with a destination" title="A clearer way to explore the world" description="Browse the directory by country, then move from broad categories into structured guides when they are published." href="/countries" linkLabel="All countries" />
        <div id="highlights-heading" className="country-grid">
          {highlights.map((country) => <CountryCard key={country.id} country={country} />)}
        </div>
      </section>

      <section className="container home-section home-section-tight" aria-labelledby="purpose-heading">
        <SectionHeading eyebrow="Browse by purpose" title="Start with what brings you there" description="A consistent category system makes it easier to find the right path, whatever the destination." href="/categories" linkLabel="All categories" />
        <div id="purpose-heading" className="category-grid">
          {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
        </div>
      </section>

      <section id="how-it-works" className="container info-band" aria-labelledby="how-heading">
        <div className="info-band-copy">
          <span className="eyebrow"><span className="eyebrow-dot" />How Visaora works</span>
          <h2 id="how-heading">Clarity before complexity.</h2>
          <p>Visa systems can feel fragmented. Visaora gives every destination a predictable structure, so useful information can grow without making the experience harder to navigate.</p>
        </div>
        <div className="step-list">
          <div className="step-item"><span className="step-number">01</span><span><strong>Choose a country</strong><span>Start from a destination you are considering.</span></span></div>
          <div className="step-item"><span className="step-number">02</span><span><strong>Explore visa types</strong><span>Move through a consistent set of purposes and pathways.</span></span></div>
          <div className="step-item"><span className="step-number">03</span><span><strong>Open the visa guide</strong><span>Read source-backed details when a guide is ready.</span></span></div>
        </div>
      </section>

      <div className="container trust-note"><ShieldCheck size={14} aria-hidden="true" /> Content is added only when it can be structured, reviewed and connected to an official source.</div>
    </>
  );
}
