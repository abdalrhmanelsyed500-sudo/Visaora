import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/empty-state";
import { CategoryCard } from "@/components/category-card";
import { getCategories, getCategory, getPublishedVisas } from "@/lib/data";
import { breadcrumbJsonLd, categoryMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return category ? categoryMetadata(category) : { title: "Category not found" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const visas = getPublishedVisas().filter((visa) => visa.categorySlug === category.slug);
  const otherCategories = getCategories().filter((item) => item.slug !== category.slug).slice(0, 4);

  return (
    <>
      <section className="page-top">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: category.name }]} />
          <span className="eyebrow" style={{ marginTop: 34 }}><span className="eyebrow-dot" />Visa category</span>
          <h1>{category.name} pathways.</h1>
          <p>{category.description} Explore source-backed country guides here when they are ready to publish.</p>
        </div>
      </section>
      <div className="container directory-section">
        {visas.length ? <div className="visa-card-grid">{visas.map((visa) => <Link className="visa-card" key={visa.id} href={`/countries/${visa.countrySlug}/visas/${visa.slug}`}><span className="visa-card-category">{visa.countryName}</span><h2>{visa.name}</h2><p>{visa.shortDescription}</p></Link>)}</div> : <EmptyState kind="category" />}
        <section className="related-section" aria-labelledby="other-categories-heading">
          <h2 id="other-categories-heading">Explore another category</h2>
          <div className="category-grid-compact">{otherCategories.map((item) => <CategoryCard key={item.id} category={item} compact />)}</div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Categories", url: "/categories" }, { name: category.name }])) }} />
    </>
  );
}
