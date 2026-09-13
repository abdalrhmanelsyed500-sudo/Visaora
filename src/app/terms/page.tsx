import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = { title: "Terms of Use", description: "Terms for using the Visaora informational platform.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <div className="container prose-page"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} /><span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Terms of use</span><h1>Use Visaora as a starting point.</h1><p className="prose-intro">By using Visaora, you agree to use the platform responsibly and to verify important information with official authorities.</p><h2>Informational use</h2><p>Content is provided for general information. You are responsible for decisions you make after reviewing the platform and for checking official requirements before acting.</p><h2>Respect the platform</h2><p>Do not attempt to disrupt, scrape at an unreasonable rate, bypass access controls or use the platform for unlawful purposes. Public APIs are read-only discovery interfaces and do not expose admin data.</p><h2>Content changes</h2><p>Visa information can change. Visaora may correct, update, archive or remove content as source material and editorial status change.</p></div>;
}
