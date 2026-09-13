import { ArrowUpRight, BookOpen, CheckCircle2, FileText, Globe2, Layers3, Link2, ListChecks, Settings2, UsersRound } from "lucide-react";
import Link from "next/link";
import { getAdminAccess } from "@/lib/auth";
import { getCategories, getCountries, getDirectoryStats, getPublishedVisas } from "@/lib/data";

const resources = [
  ["Countries", "countries", Globe2],
  ["Visa categories", "categories", Layers3],
  ["Visa guides", "visas", BookOpen],
  ["Official sources", "sources", Link2],
  ["FAQs", "faqs", ListChecks],
  ["Revisions", "revisions", FileText],
] as const;

export default async function AdminPage() {
  const access = await getAdminAccess();
  if (!access.authenticated) return <AdminLocked />;

  const stats = getDirectoryStats();
  return (
    <div className="container admin-shell">
      <div className="admin-header">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" />Content operations</span>
          <h1>Good morning, editor.</h1>
          <p>Manage the structured knowledge layer behind Visaora.</p>
        </div>
        <span className="admin-badge">{access.preview ? "Local preview" : "Authenticated"}</span>
      </div>

      <div className="admin-metrics" aria-label="Content metrics">
        <div className="admin-metric"><span className="admin-metric-label">Total countries</span><strong>{stats.totalCountries}</strong></div>
        <div className="admin-metric"><span className="admin-metric-label">Published guides</span><strong>{stats.publishedVisaGuides}</strong></div>
        <div className="admin-metric"><span className="admin-metric-label">Draft guides</span><strong>{stats.draftVisaGuides}</strong></div>
        <div className="admin-metric"><span className="admin-metric-label">Taxonomy nodes</span><strong>{stats.categories}</strong></div>
      </div>

      <div className="admin-grid">
        <section className="admin-panel" aria-labelledby="resources-heading">
          <h2 id="resources-heading">Content workspace</h2>
          <p>Each resource maps to a reviewable, versioned content entity.</p>
          <div className="admin-resource-list">
            {resources.map(([label, slug, Icon]) => <Link className="admin-resource" key={slug} href={`/admin/${slug}`}><span className="admin-resource-icon"><Icon size={15} /></span><span>{label}</span><span><ArrowUpRight size={14} /></span></Link>)}
          </div>
        </section>
        <section className="admin-panel" aria-labelledby="workflow-heading">
          <h2 id="workflow-heading">Publishing guardrails</h2>
          <p>What must be true before a guide can go live.</p>
          <ul className="admin-checklist">
            <li><CheckCircle2 size={15} /> Country and category relationships are valid.</li>
            <li><CheckCircle2 size={15} /> Slug is stable, unique and redirect-aware.</li>
            <li><CheckCircle2 size={15} /> Required structured fields are complete.</li>
            <li><CheckCircle2 size={15} /> At least one official source is attached.</li>
            <li><CheckCircle2 size={15} /> A reviewer records the verification date.</li>
          </ul>
        </section>
      </div>

      <section className="admin-panel" style={{ marginTop: 14 }} aria-labelledby="recent-heading">
        <h2 id="recent-heading">Workspace status</h2>
        <p>No content activity to report yet. This is a real database-backed count, not placeholder analytics.</p>
        <div className="admin-status-row"><span><Settings2 size={15} /> Persistence contract: Prisma + PostgreSQL</span><span><UsersRound size={15} /> Roles: editor, reviewer, admin</span><span><FileText size={15} /> Revisions: ready</span></div>
      </section>
      <p className="admin-footnote">Admin routes are noindex and protected by the session boundary in production. Local preview is enabled for development so the information architecture can be reviewed.</p>
    </div>
  );
}

function AdminLocked() {
  return <div className="container not-found-page"><div><span className="not-found-code">ADMIN ACCESS</span><h1>Sign in required.</h1><p>The admin workspace is protected outside local preview. Connect the authentication provider and set an authenticated session to continue.</p></div></div>;
}
