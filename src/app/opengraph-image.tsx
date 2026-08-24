import { ImageResponse } from "next/og";

export const alt = "Naphier Awalie — Developer Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0b0d0e",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#f8fafc",
          border: "1px solid #1e293b",
        }}
      >
        {/* Top Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "9999px",
              background: "#10b981",
            }}
          />
          <span
            style={{
              fontSize: 20,
              fontFamily: "monospace",
              color: "#94a3b8",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            PORTFOLIO // 2026
          </span>
        </div>

        {/* Main Title & Subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Naphier Awalie
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "#94a3b8",
              margin: 0,
              lineHeight: 1.4,
              maxWidth: "800px",
            }}
          >
            IT Student & Full-Stack Developer crafting high-performance, accessible, and clean digital solutions.
          </p>
        </div>

        {/* Bottom Tag Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"].map(
            (tech) => (
              <div
                key={tech}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  background: "#161c22",
                  border: "1px solid #334155",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#e2e8f0",
                }}
              >
                {tech}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
