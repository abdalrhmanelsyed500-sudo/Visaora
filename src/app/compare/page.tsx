import type { Metadata } from "next";
import { ArrowRight, GitCompareArrows, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "Compare Visa Pathways",
  description: "Compare structured visa pathways side by side on Visaora when published guides are available.",
  alternates: { canonical: "/compare" },
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  return (
    <div className="container prose-page">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
      <span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Decision support</span>
      <h1>Compare with confidence.</h1>
      <p className="prose-intro">Visaora is designed to put structured pathways side by side — without forcing you to open a dozen tabs or compare mismatched facts.</p>
      <div style={{ marginTop: 31 }}><EmptyState kind="compare" /></div>
      <div className="info-band" style={{ marginTop: 24 }}>
        <div className="info-band-copy">
          <span className="eyebrow"><span className="eyebrow-dot" />Comparison architecture</span>
          <h2>Built around the fields that matter.</h2>
          <p>Future comparison views will use the same database fields as each guide: purpose, eligibility, duration, validity, fees, processing, documents, family and entry.</p>
        </div>
        <div className="step-list">
          <div className="step-item"><span className="step-number"><GitCompareArrows size={16} /></span><span><strong>Select up to three guides</strong><span>No comparison until source-backed guides exist.</span></span></div>
          <div className="step-item"><span className="step-number"><ShieldCheck size={16} /></span><span><strong>See what is known</strong><span>Unpublished fields remain clearly marked, never invented.</span></span></div>
        </div>
      </div>
      <Link className="section-link" href="/countries" style={{ marginTop: 24 }}>Explore countries <ArrowRight size={15} /></Link>
    </div>
  );
}
