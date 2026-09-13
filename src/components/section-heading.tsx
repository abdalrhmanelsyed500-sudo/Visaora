import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function SectionHeading({ eyebrow, title, description, href, linkLabel = "View all" }: { eyebrow?: string; title: string; description?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {href ? <Link className="section-link" href={href}>{linkLabel}<ArrowRight size={15} aria-hidden="true" /></Link> : null}
    </div>
  );
}
