import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Visaora — Explore every visa pathway";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ background: "#0b1730", color: "white", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", fontFamily: "Arial" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px", color: "#9cb5ff", fontSize: 28, fontWeight: 700 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#3462f5", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24 }}>V</div>
          Visaora
        </div>
        <div style={{ marginTop: 36, fontSize: 72, lineHeight: 1.04, letterSpacing: -3, fontWeight: 800, maxWidth: 850 }}>Every country. Every pathway. One clear guide.</div>
        <div style={{ marginTop: 28, color: "#b8c2d5", fontSize: 25 }}>A global visa discovery and knowledge platform.</div>
      </div>
    ),
    { ...size },
  );
}
