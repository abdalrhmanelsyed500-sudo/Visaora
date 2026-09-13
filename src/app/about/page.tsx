import type { Metadata } from "next";
import { Compass, Database, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "About Visaora",
  description: "Learn how Visaora organizes global visa and immigration pathways into a clearer, source-aware directory.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container prose-page">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />About Visaora</span>
      <h1>A better starting point for a complicated question.</h1>
      <p className="prose-intro">Visaora is an independent informational platform built to make global visa discovery more structured, understandable and honest about what is — and is not — known.</p>
      <div className="prose-callout">Visaora is not a government website, immigration authority, law firm or travel agency. We do not guarantee approval and we do not provide legal advice.</div>
      <h2>What we are building</h2>
      <p>The long-term product is a structured knowledge infrastructure: countries connect to categories, categories connect to visa entities, and every published detail can be traced back to a source and a verification event.</p>
      <div className="category-grid" style={{ marginTop: 24 }}>
        <div className="category-card"><span className="category-icon"><Compass size={18} /></span><h3>Designed for discovery</h3><p>Start with a country or intent, then move through a predictable hierarchy.</p></div>
        <div className="category-card"><span className="category-icon"><Database size={18} /></span><h3>Structured by default</h3><p>Content is stored as reusable fields and modules, not hardcoded page copy.</p></div>
        <div className="category-card"><span className="category-icon"><ShieldCheck size={18} /></span><h3>Clear about sources</h3><p>Published guides are designed to show where important information came from.</p></div>
      </div>
      <h2>Why the directory is intentionally light right now</h2>
      <p>This first release establishes the product, taxonomy, routing, database contract and editorial workflow. It deliberately contains no real visa requirements, fees, processing times or application instructions. Empty states are a product decision, not missing polish.</p>
    </div>
  );
}
