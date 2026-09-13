import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return <div className="container not-found-page"><div><span className="not-found-code">404 / NOT FOUND</span><h1>That path is not here.</h1><p>We couldn't find that country or visa guide. Try the directory search, or start again from the country index.</p><div className="not-found-actions"><Link className="button button-primary" href="/search"><Search size={15} /> Search Visaora</Link><Link className="button button-secondary" href="/"><ArrowLeft size={15} /> Back home</Link></div></div></div>;
}
