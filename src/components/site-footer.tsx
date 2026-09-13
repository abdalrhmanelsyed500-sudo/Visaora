import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { LEGAL_LINKS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link className="brand" href="/" aria-label={`${SITE_NAME} home`}>
            <span className="brand-mark" aria-hidden="true">
              <CompassMark />
            </span>
            <span>{SITE_NAME}</span>
          </Link>
          <p className="footer-brand-copy">{SITE_TAGLINE} A structured, independent starting point for understanding global visa pathways.</p>
          <span className="footer-independent">
            <ShieldCheck size={13} aria-hidden="true" /> Independent informational platform
          </span>
        </div>

        <FooterColumn title="Explore" links={[
          ["Countries", "/countries"],
          ["Visa types", "/visas"],
          ["Categories", "/categories"],
          ["Search", "/search"],
        ]} />
        <FooterColumn title="Platform" links={[
          ["How it works", "/#how-it-works"],
          ["Official sources", "/sources"],
          ["About Visaora", "/about"],
          ["Contact", "/contact"],
        ]} />
        <FooterColumn title="Trust & legal" links={LEGAL_LINKS.map((link) => [link.label, link.href])} />
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {SITE_NAME}. Built for clarity across borders.</span>
        <div className="footer-bottom-links">
          <Link href="/disclaimer">Information changes — verify with official authorities.</Link>
          <span>Independent, source-aware directory</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div className="footer-col">
      <h3>{title}</h3>
      <div className="footer-links">
        {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </div>
    </div>
  );
}

function CompassMark() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" opacity=".42" />
      <path d="m15.7 8.3-2.2 5.2-5.2 2.2 2.2-5.2 5.2-2.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
