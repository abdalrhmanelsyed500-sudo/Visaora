import { ArrowRight, BookOpen, Compass, FileSearch, Layers3, SearchX } from "lucide-react";
import Link from "next/link";
import type { EmptyStateKind } from "@/lib/types";

const content: Record<EmptyStateKind, { title: string; body: string; icon: typeof Compass }> = {
  country: {
    title: "Visa information is being prepared",
    body: "This destination is in the Visaora directory. Reviewed visa guides will appear here as our content team adds official sources and structured details.",
    icon: Compass,
  },
  visa: {
    title: "We couldn't find that visa",
    body: "The guide may not have been published yet, or the link may have changed. Search the directory or return to the country page.",
    icon: FileSearch,
  },
  category: {
    title: "No guides in this category yet",
    body: "This category is ready for structured content. There are no published guides to show until a source-backed guide passes review.",
    icon: Layers3,
  },
  search: {
    title: "No matches yet",
    body: "Try a country name, an abbreviation, or a pathway such as work, study, visit or family.",
    icon: SearchX,
  },
  compare: {
    title: "Comparison starts with published guides",
    body: "Once there are source-backed visa guides, you will be able to place them side by side here.",
    icon: BookOpen,
  },
};

export function EmptyState({ kind, countryHref }: { kind: EmptyStateKind; countryHref?: string }) {
  const item = content[kind];
  const Icon = item.icon;
  return (
    <section className="empty-state" aria-live="polite">
      <span className="empty-state-icon"><Icon size={23} aria-hidden="true" /></span>
      <h2>{item.title}</h2>
      <p>{item.body}</p>
      <div className="empty-state-actions">
        {countryHref ? <Link className="button button-primary" href={countryHref}>Explore the directory <ArrowRight size={15} /></Link> : null}
        {kind !== "search" ? <Link className="button button-secondary" href="/countries">Browse countries</Link> : <Link className="button button-secondary" href="/countries">Browse all countries</Link>}
      </div>
    </section>
  );
}
