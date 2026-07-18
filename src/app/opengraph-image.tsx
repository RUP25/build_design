import { ImageResponse } from "next/og";

export const alt =
  "Build Design Projects — one-stop turnkey execution since 1979";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#172218",
          color: "#f4f0e8",
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(145deg, rgba(204,166,98,.24), transparent 52%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#cda966",
              display: "flex",
              fontSize: 24,
              letterSpacing: 7,
              textTransform: "uppercase",
            }}
          >
            Established 1979 · Kolkata · Pan India
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "serif",
                fontSize: 92,
                lineHeight: 0.95,
              }}
            >
              Build Design
            </div>
            <div
              style={{
                color: "#cda966",
                display: "flex",
                fontFamily: "serif",
                fontSize: 92,
                lineHeight: 0.95,
              }}
            >
              Projects
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(244,240,232,.35)",
              display: "flex",
              fontSize: 29,
              justifyContent: "space-between",
              paddingTop: 28,
            }}
          >
            <span>One-Stop Turnkey Execution</span>
            <span>buildesignprojects.com</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
