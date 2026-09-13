import { NextResponse } from "next/server";
import { getCountry, getCountryVisaCount, getRelatedCountries } from "@/lib/data";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) return NextResponse.json({ error: "Country not found" }, { status: 404 });

  return NextResponse.json({
    data: {
      ...country,
      publishedVisaCount: getCountryVisaCount(country.id),
      relatedCountries: getRelatedCountries(country).map((related) => ({ id: related.id, name: related.name, slug: related.slug, flag: related.flag })),
    },
  }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
