import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";
import type { Visa } from "@/lib/types";

export function VisaCard({ visa }: { visa: Visa }) {
  return (
    <Link className="visa-card" href={`/countries/${visa.countrySlug}/visas/${visa.slug}`}>
      <div className="visa-card-heading">
        <span className="visa-card-category">{visa.category}</span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </div>
      <h2>{visa.name}</h2>
      <p>{visa.shortDescription || "A structured visa guide with reviewed source material."}</p>
      <div className="visa-card-footer"><span><Clock3 size={13} /> {visa.processingTime || "Details in guide"}</span><span>{visa.countryName}</span></div>
    </Link>
  );
}
