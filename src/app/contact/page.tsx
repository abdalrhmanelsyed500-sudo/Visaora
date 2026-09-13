import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = { title: "Contact Visaora", description: "Contact the Visaora team about sources, corrections and the platform.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <div className="container prose-page"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} /><span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Get in touch</span><h1>Help us make the directory better.</h1><p className="prose-intro">Have a source correction, a content question or feedback about the experience? The contact workflow is ready for the editorial team to connect it to a real inbox.</p><div className="category-grid" style={{ marginTop: 27 }}><a className="category-card" href="mailto:hello@visaora.example"><span className="category-icon"><Mail size={18} /></span><h3>General questions</h3><p>hello@visaora.example</p></a><a className="category-card" href="mailto:editorial@visaora.example"><span className="category-icon"><MessageCircle size={18} /></span><h3>Source corrections</h3><p>editorial@visaora.example</p></a></div><div className="prose-callout" style={{ marginTop: 27 }}>These addresses are placeholders for the initial build and are not monitored yet.</div></div>;
}
