import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Country } from "@/lib/types";

export function CountryCard({ country }: { country: Country }) {
  return (
    <Link className="country-card" href={`/countries/${country.slug}`}>
      <div className="country-card-top">
        <span className="flag" aria-label={`${country.name} flag`} role="img">{country.flag}</span>
        <ArrowUpRight className="country-arrow" size={16} aria-hidden="true" />
      </div>
      <div>
        <h3>{country.name}</h3>
        <div className="country-card-meta">{country.region}</div>
        <div className="country-card-status">Visa guides coming soon</div>
      </div>
    </Link>
  );
}
