import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CategoryIcon } from "./category-icon";
import type { VisaCategory } from "@/lib/types";

export function CategoryCard({ category, compact = false }: { category: VisaCategory; compact?: boolean }) {
  if (compact) {
    return (
      <Link className="category-card-compact" href={`/categories/${category.slug}`}>
        <span className="category-icon"><CategoryIcon name={category.icon} /></span>
        <span>
          <h3>{category.name}</h3>
          <p>Explore this pathway</p>
        </span>
        <ArrowUpRight className="category-arrow" size={15} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Link className="category-card" href={`/categories/${category.slug}`}>
      <div>
        <span className="category-icon"><CategoryIcon name={category.icon} /></span>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
      <div className="category-card-footer">
        <span>Explore directory</span>
        <ArrowUpRight size={15} aria-hidden="true" />
      </div>
    </Link>
  );
}
