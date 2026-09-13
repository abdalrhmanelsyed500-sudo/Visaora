import type { Metadata } from "next";
import { ExternalLink, Link2, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "Official Sources",
  description: "Understand how Visaora plans to connect visa guides to official government and immigration sources.",
  alternates: { canonical: "/sources" },
};

export default function SourcesPage() {
  return (
    <div className="container prose-page">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sources" }]} />
      <span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Source transparency</span>
      <h1>Every important detail needs somewhere to point.</h1>
      <p className="prose-intro">Visaora is designed to connect each future visa guide to clear, official source records — government websites, embassies, immigration authorities, consulates and official application portals.</p>
      <div className="prose-callout"><ShieldCheck size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> We do not use unnamed sources for core visa facts. When a guide is not ready, we say so.</div>
      <div style={{ marginTop: 28 }}><EmptyState kind="category" /></div>
      <h2>Source records, not hidden citations</h2>
      <p>Sources are first-class records in the content model. Editors can attach more than one source to a guide, record the publisher and source type, and store when the source was accessed. Published pages will show those links plainly.</p>
      <div className="source-card" style={{ marginTop: 20 }}><Link2 size={16} /><span><strong>Source model ready</strong><span>Government · embassy · immigration authority · consulate · application portal</span></span><ExternalLink size={13} /></div>
    </div>
  );
}
