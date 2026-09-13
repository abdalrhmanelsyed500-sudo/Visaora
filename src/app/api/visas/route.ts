import { NextRequest, NextResponse } from "next/server";
import { getCountryById, getPublishedVisas } from "@/lib/data";
import { sanitizeSearchQuery } from "@/lib/security";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = sanitizeSearchQuery(searchParams.get("country"));
  const category = sanitizeSearchQuery(searchParams.get("category"));
  const region = sanitizeSearchQuery(searchParams.get("region"));
  const query = sanitizeSearchQuery(searchParams.get("q"));
  const visas = getPublishedVisas().filter((visa) => {
    const matchesQuery = !query || `${visa.name} ${visa.countryName} ${visa.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCountry = !country || visa.countrySlug === country || visa.countryId === country;
    const matchesCategory = !category || visa.categorySlug === category;
    const matchesRegion = !region || getCountryById(visa.countryId)?.region === region;
    return matchesQuery && matchesCountry && matchesCategory && matchesRegion;
  });

  return NextResponse.json({ data: visas, pagination: { page: 1, limit: visas.length, total: visas.length, totalPages: 1 } }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
