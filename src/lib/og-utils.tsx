import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG = "#FAF7F0";
const PRIMARY = "#0D6B6E";
const FOREGROUND = "#1A1A2E";
const MUTED = "#6B7280";

export async function loadFonts() {
  const fontsDir = join(process.cwd(), "public", "fonts");
  const [fraunces, inter] = await Promise.all([
    readFile(join(fontsDir, "Fraunces-Bold.ttf")),
    readFile(join(fontsDir, "Inter-Regular.ttf")),
  ]);
  return [
    { name: "Fraunces", data: Uint8Array.from(fraunces).buffer, weight: 700 as const },
    { name: "Inter", data: Uint8Array.from(inter).buffer, weight: 400 as const },
  ];
}

export function createOgImage(
  jsx: React.ReactElement,
  fonts: Array<{ name: string; data: ArrayBuffer; weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 }>,
) {
  return new ImageResponse(jsx, {
    ...OG_SIZE,
    fonts,
  });
}

export function OgCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: BG,
        padding: "80px",
      }}
    >
      {/* Decorative top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: PRIMARY,
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "1040px",
          textAlign: "center",
        }}
      >
        {eyebrow && (
          <div
            style={{
              fontSize: 20,
              fontFamily: "Inter",
              color: PRIMARY,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "20px",
              fontWeight: 400,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: title.length > 60 ? 44 : title.length > 40 ? 52 : 60,
            fontFamily: "Fraunces",
            color: FOREGROUND,
            lineHeight: 1.2,
            fontWeight: 700,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 24,
              fontFamily: "Inter",
              color: MUTED,
              marginTop: "24px",
              lineHeight: 1.4,
              fontWeight: 400,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Brand footer */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontFamily: "Inter",
            color: PRIMARY,
            fontWeight: 400,
          }}
        >
          physio-vertige.ch
        </div>
      </div>
    </div>
  );
}
