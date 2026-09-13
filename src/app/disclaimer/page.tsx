import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = { title: "Disclaimer", description: "Visaora's informational platform disclaimer.", alternates: { canonical: "/disclaimer" } };

export default function DisclaimerPage() {
  return <div className="container prose-page"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} /><span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Trust & transparency</span><h1>Important information, clearly framed.</h1><p className="prose-intro">Visaora is an independent informational platform. It is not affiliated with, endorsed by or operated by any government, embassy or immigration authority.</p><h2>Not legal advice</h2><p>Visaora does not provide immigration or legal advice. Information on the platform is intended for general educational purposes and should not be used as a substitute for advice from a qualified professional.</p><h2>Verify before you act</h2><p>Visa rules and official procedures can change. Always verify important requirements, fees, timelines and eligibility with the relevant official government authority before applying or traveling.</p><h2>No guarantee</h2><p>Nothing on Visaora guarantees visa issuance, entry, processing time or any particular outcome. We do not represent that every page is complete or current at all times.</p></div>;
}
