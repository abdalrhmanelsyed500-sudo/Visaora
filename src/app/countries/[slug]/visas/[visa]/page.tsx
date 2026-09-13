import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VisaGuide } from "@/components/visa-guide";
import { getPublishedVisas, getVisaBySlug } from "@/lib/data";
import { breadcrumbJsonLd, visaMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getPublishedVisas().map((visa) => ({ slug: visa.countrySlug, visa: visa.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; visa: string }> }): Promise<Metadata> {
  const { slug, visa } = await params;
  const item = getVisaBySlug(slug, visa);
  return item ? visaMetadata(item) : { title: "Visa guide not found", robots: { index: false, follow: true } };
}

export default async function VisaPage({ params }: { params: Promise<{ slug: string; visa: string }> }) {
  const { slug, visa } = await params;
  const item = getVisaBySlug(slug, visa);
  if (!item) notFound();

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Countries", url: "/countries" },
    { name: item.countryName, url: `/countries/${item.countrySlug}` },
    { name: "Visas", url: `/countries/${item.countrySlug}/visas` },
    { name: item.name },
  ]);

  return (
    <>
      <VisaGuide visa={item} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
