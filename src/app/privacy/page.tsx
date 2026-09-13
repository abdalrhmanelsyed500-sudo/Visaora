import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Visaora is designed to handle privacy and local preferences.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <div className="container prose-page"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} /><span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Privacy</span><h1>Privacy by a small default.</h1><p className="prose-intro">This release does not require an account to browse the directory. Saved countries and visas are designed to stay in your browser unless you choose a future account feature.</p><h2>Data we process</h2><p>Normal server logs may contain technical request information needed to operate the site. Search requests are rate-limited to protect availability. No paid analytics service is required by this release.</p><h2>Local favorites</h2><p>The save feature uses local browser storage. It does not send your saved list to Visaora in this version. You can clear it through your browser settings.</p><h2>Future services</h2><p>Any future analytics, authentication or personalization provider will be documented before it is enabled and will sit behind an explicit product abstraction.</p></div>;
}
