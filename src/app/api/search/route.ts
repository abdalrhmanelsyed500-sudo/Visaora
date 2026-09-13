import { NextRequest, NextResponse } from "next/server";
import { searchDirectory } from "@/lib/data";
import { rateLimit, sanitizeSearchQuery } from "@/lib/security";

export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const limitResult = rateLimit(`search:${forwardedFor}`, 60, 60_000);
  if (!limitResult.allowed) {
    return NextResponse.json({ error: "Too many search requests" }, { status: 429, headers: { "Retry-After": String(limitResult.retryAfterSeconds) } });
  }

  const query = sanitizeSearchQuery(request.nextUrl.searchParams.get("q"));
  if (!query) return NextResponse.json({ results: [] });

  return NextResponse.json({ results: searchDirectory(query) }, {
    headers: {
      "Cache-Control": "public, max-age=30, stale-while-revalidate=300",
      "X-RateLimit-Remaining": String(limitResult.remaining),
    },
  });
}
