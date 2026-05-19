import { ImageResponse } from "next/og";
import { AUTHOR_NAME, BOOK_TITLE, SITE_NAME } from "@/lib/constants";

export const alt = `${SITE_NAME} — ${AUTHOR_NAME}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f4",
          padding: 80,
        }}
      >
        <p
          style={{
            fontSize: 28,
            color: "#57534e",
            marginBottom: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {AUTHOR_NAME}
        </p>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: "#1c1917",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {BOOK_TITLE}
        </h1>
        <p style={{ fontSize: 24, color: "#57534e", marginTop: 32 }}>
          45 şiir · 11 deneme
        </p>
      </div>
    ),
    { ...size },
  );
}
