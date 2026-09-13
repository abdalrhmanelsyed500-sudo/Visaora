import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryCard } from "@/components/category-card";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Visa Categories — Browse by Purpose",
  description: "Explore Visaora's consistent visa category system, from visit and study to work, family and immigration pathways.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const categories = getCategories();
  return (
    <>
      <section className="page-top">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
          <span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />A consistent taxonomy</span>
          <h1>Browse by purpose.</h1>
          <p>Every destination will use the same high-level structure, making it easier to compare pathways without learning a new navigation system each time.</p>
        </div>
      </section>
      <div className="container directory-section">
        <div className="category-directory-grid">
          {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
        </div>
        <div style={{ marginTop: 24 }} className="prose-callout">Categories are a navigation framework, not a claim that a specific pathway exists in every country. Published guides will be added only with country-specific, official source material.</div>
      </div>
    </>
  );
}
