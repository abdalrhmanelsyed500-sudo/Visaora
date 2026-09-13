import { CheckCircle2, ExternalLink, Info, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Visa } from "@/lib/types";
import { Breadcrumbs } from "./breadcrumbs";
import { EmptyState } from "./empty-state";
import { FavoriteButton } from "./favorite-button";
import { ShareActions } from "./share-actions";

function Fact({ label, value }: { label: string; value: string | null }) {
  return <div className="visa-fact-card"><span>{label}</span><strong className={value ? "" : "is-empty"}>{value || "Information not yet published."}</strong></div>;
}

function VisaSection({ title, children, id }: { title: string; children: React.ReactNode; id: string }) {
  return <section className="visa-section" id={id} aria-labelledby={`${id}-heading`}><h2 id={`${id}-heading`}>{title}</h2>{children}</section>;
}

export function VisaGuide({ visa }: { visa: Visa }) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Countries", href: "/countries" },
    { label: visa.countryName, href: `/countries/${visa.countrySlug}` },
    { label: "Visas", href: `/countries/${visa.countrySlug}/visas` },
    { label: visa.name },
  ];

  return (
    <div className="container visa-shell">
      <Breadcrumbs items={breadcrumbItems} />
      <header className="visa-header">
        <span className="eyebrow"><span className="eyebrow-dot" />{visa.category} pathway</span>
        <h1>{visa.name}</h1>
        <p>{visa.shortDescription || "A structured guide for understanding this pathway."}</p>
        <div className="visa-header-actions">
          <FavoriteButton type="visa" id={visa.id} label={visa.name} />
          <ShareActions title={visa.name} />
        </div>
      </header>

      <div className="visa-layout">
        <article>
          <div className="visa-facts" aria-label="Visa quick facts">
            <Fact label="Category" value={visa.category} />
            <Fact label="Purpose" value={visa.purpose} />
            <Fact label="Validity" value={visa.validity} />
            <Fact label="Stay" value={visa.stayDuration} />
            <Fact label="Entries" value={visa.entries} />
            <Fact label="Processing" value={visa.processingTime} />
            <Fact label="Fee" value={visa.fees} />
            <Fact label="Application" value={visa.applicationMethod} />
          </div>

          <VisaSection title="Overview" id="overview">
            <p>{visa.longDescription || "The overview for this guide has not been published yet."}</p>
          </VisaSection>
          <VisaSection title="Who is it for?" id="purpose"><p>{visa.purpose || "Eligibility context will be added when this guide is reviewed."}</p></VisaSection>
          <VisaSection title="Eligibility" id="eligibility"><p>{visa.eligibility || "Eligibility details are not yet published."}</p></VisaSection>
          <VisaSection title="Required documents" id="documents">
            {visa.documents.length ? <ul>{visa.documents.map((document) => <li key={document}>{document}</li>)}</ul> : <p>Document requirements are not yet published.</p>}
          </VisaSection>
          <VisaSection title="Application process" id="application-process">
            {visa.applicationSteps.length ? <ol>{visa.applicationSteps.map((step) => <li key={step}>{step}</li>)}</ol> : <p>Application steps are not yet published.</p>}
          </VisaSection>
          <VisaSection title="Important notes" id="notes"><p>Visa information can change. Always verify important requirements with the relevant official government authority before applying or traveling.</p></VisaSection>
          <VisaSection title="Frequently asked questions" id="faq"><p>FAQs will be added when this guide has reviewed, source-backed answers.</p></VisaSection>
          <VisaSection title="Official sources" id="sources">
            {visa.officialSources.length ? visa.officialSources.map((source) => <a className="source-card" key={source.id} href={source.url} target="_blank" rel="noreferrer"><ShieldCheck size={15} /><span><strong>{source.title}</strong><span>{source.publisher} · {source.sourceType}</span></span><ExternalLink size={13} /></a>) : <p>No official sources have been attached to this guide yet.</p>}
          </VisaSection>
        </article>

        <aside className="visa-sidebar" aria-label="Visa guide details">
          <div className="sidebar-card visa-toc">
            <h3>In this guide</h3>
            <nav className="sidebar-links" aria-label="Visa guide sections">
              {[["Overview", "overview"], ["Eligibility", "eligibility"], ["Documents", "documents"], ["Application process", "application-process"], ["Official sources", "sources"]].map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
            </nav>
          </div>
          <div className="sidebar-card">
            <h3>Verification</h3>
            <p className="sidebar-note"><Info size={15} /> {visa.lastVerified ? `Last verified ${new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(visa.lastVerified))}.` : "This guide has not been verified yet."}</p>
          </div>
          <div className="sidebar-card">
            <h3>Need the official answer?</h3>
            <p className="sidebar-note"><CheckCircle2 size={15} /> Visaora is an independent informational platform, not a government authority or legal adviser.</p>
            <Link className="button button-secondary" href="/disclaimer" style={{ marginTop: 14, width: "100%" }}>Read our disclaimer</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
