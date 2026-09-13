import { NextRequest, NextResponse } from "next/server";
import { getCountries } from "@/lib/data";
import { sanitizeSearchQuery } from "@/lib/security";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = sanitizeSearchQuery(searchParams.get("q"));
  const continent = sanitizeSearchQuery(searchParams.get("continent"));
  const region = sanitizeSearchQuery(searchParams.get("region"));
  const page = Math.max(1, Number(searchParams.get("page") || 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 24) || 24));

  const countries = getCountries().filter((country) => {
    const matchesQuery = !query || [country.name, country.officialName, country.iso2, country.iso3, ...country.aliases].some((value) => value.toLowerCase().includes(query.toLowerCase()));
    return matchesQuery && (!continent || country.continent === continent) && (!region || country.region === region);
  });
  const start = (page - 1) * limit;

  return NextResponse.json({
    data: countries.slice(start, start + limit),
    pagination: { page, limit, total: countries.length, totalPages: Math.max(1, Math.ceil(countries.length / limit)) },
  }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
