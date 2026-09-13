import type { LucideIcon } from "lucide-react";
import { ArrowLeft, BookOpen, CheckCircle2, FileText, Globe2, Layers3, Link2, ListChecks } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminAccess } from "@/lib/auth";
import { getCategories, getCountries, getDirectoryStats, getPublishedVisas } from "@/lib/data";

const sectionConfig: Record<string, { title: string; description: string; icon: LucideIcon }> = {
  countries: { title: "Countries", description: "Directory metadata, regional taxonomy and publication status.", icon: Globe2 },
  categories: { title: "Visa categories", description: "The stable, reusable purpose taxonomy for every destination.", icon: Layers3 },
  visas: { title: "Visa guides", description: "Draft, review, publish and archive structured visa entities.", icon: BookOpen },
  sources: { title: "Official sources", description: "Source records that can be attached to one or more guides.", icon: Link2 },
  faqs: { title: "FAQs", description: "Reviewable question and answer blocks attached to visa guides.", icon: ListChecks },
  revisions: { title: "Revisions", description: "Version history and snapshots for editorial accountability.", icon: FileText },
};

export async function generateStaticParams() {
  return Object.keys(sectionConfig).map((section) => ({ section }));
}

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const config = sectionConfig[section];
  if (!config) notFound();
  const access = await getAdminAccess();
  if (!access.authenticated) return <div className="container not-found-page"><div><span className="not-found-code">ADMIN ACCESS</span><h1>Sign in required.</h1><p>This workspace is protected outside local preview.</p></div></div>;
  const Icon = config.icon;
  const stats = getDirectoryStats();

  return (
    <div className="container admin-shell">
      <div className="breadcrumbs"><Link href="/admin">Admin workspace</Link><span>/</span><span>{config.title}</span></div>
      <div className="admin-header" style={{ marginTop: 32 }}>
        <div><span className="eyebrow"><span className="eyebrow-dot" /><Icon size={13} /> Content resource</span><h1>{config.title}</h1><p>{config.description}</p></div>
        <Link className="button button-secondary" href="/admin"><ArrowLeft size={14} /> Dashboard</Link>
      </div>
      <section className="admin-panel">
        <h2>Resource controls</h2>
        <p>Create and edit actions belong behind the authenticated admin API. The current workspace exposes the content contract without creating unreviewed records.</p>
        <div className="admin-status-row"><span><CheckCircle2 size={15} /> Draft / review / published / archived</span><span><CheckCircle2 size={15} /> Validation before publish</span><span><CheckCircle2 size={15} /> Revision snapshot on save</span></div>
      </section>
      <section className="admin-panel" style={{ marginTop: 14 }}>
        <h2>Current records</h2>
        <p>These values come from the content repository and remain truthful while the platform is empty of visa guides.</p>
        {section === "countries" ? <div className="admin-record-preview"><strong>{getCountries().length} country records</strong><span>Directory metadata seeded. No visa facts are included.</span></div> : null}
        {section === "categories" ? <div className="admin-record-preview"><strong>{getCategories().length} category records</strong><span>Taxonomy seeded. Category labels do not imply a pathway exists in every country.</span></div> : null}
        {section === "visas" ? <div className="admin-record-preview"><strong>{getPublishedVisas().length} published visa guides</strong><span>No visa entities are seeded in this stage by design.</span></div> : null}
        {!['countries', 'categories', 'visas'].includes(section) ? <div className="admin-record-preview"><strong>0 {section} attached to published guides</strong><span>Records become available as source-backed visa content moves through review.</span></div> : null}
      </section>
      <p className="admin-footnote">Content changes will invalidate the relevant cache tags and regenerate metadata and sitemap entries in the production repository implementation.</p>
    </div>
  );
}
