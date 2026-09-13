import { NextResponse } from "next/server";
import { getCategories } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ data: getCategories() }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
