import { NextResponse } from "next/server";
import { getPublishedVisas, getVisaById } from "@/lib/data";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const countrySlug = new URL(request.url).searchParams.get("country");
  const visa = getVisaById(slug) || (countrySlug ? getPublishedVisas().find((item) => item.countrySlug === countrySlug && item.slug === slug) : getPublishedVisas().find((item) => item.slug === slug));
  if (!visa) return NextResponse.json({ error: "Visa guide not found" }, { status: 404 });
  return NextResponse.json({ data: visa }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
