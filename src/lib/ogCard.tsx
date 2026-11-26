import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { AUTHOR_INFO, SITE_DEFAULT_TITLE, SITE_NAME } from "@/lib/siteConfig";

export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = SITE_DEFAULT_TITLE;

const ASSETS_DIR = path.join(process.cwd(), "src", "lib", "og-assets");

interface LoadedOgAssets {
  garamond: ArrayBuffer;
  figtreeRegular: ArrayBuffer;
  figtreeMedium: ArrayBuffer;
  jetbrainsMono: ArrayBuffer;
  roomCutoutDataUri: string;
}

let cachedAssets: LoadedOgAssets | null = null;

function readFontArrayBuffer(fileName: string): ArrayBuffer {
  const buf = fs.readFileSync(path.join(ASSETS_DIR, fileName));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function loadOgAssets(): LoadedOgAssets {
  if (cachedAssets) return cachedAssets;

  const garamond = readFontArrayBuffer("eb-garamond-500.ttf");
  const figtreeRegular = readFontArrayBuffer("figtree-400.ttf");
  const figtreeMedium = readFontArrayBuffer("figtree-500.ttf");
  const jetbrainsMono = readFontArrayBuffer("jetbrains-mono-400.ttf");
  const roomPng = fs.readFileSync(path.join(ASSETS_DIR, "room-cutout.png"));

  cachedAssets = {
    garamond,
    figtreeRegular,
    figtreeMedium,
    jetbrainsMono,
    roomCutoutDataUri: `data:image/png;base64,${roomPng.toString("base64")}`,
  };

  return cachedAssets;
}

function CornerMark({
  top,
  bottom,
  left,
  right,
}: {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}) {
  const posStyle: React.CSSProperties = {
    position: "absolute",
    width: 13,
    height: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  if (top !== undefined) posStyle.top = top;
  if (bottom !== undefined) posStyle.bottom = bottom;
  if (left !== undefined) posStyle.left = left;
  if (right !== undefined) posStyle.right = right;

  return (
    <div style={posStyle}>
      <div
        style={{
          position: "absolute",
          width: 13,
          height: 1,
          background: "#C9C7C0",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1,
          height: 13,
          background: "#C9C7C0",
        }}
      />
    </div>
  );
}

/**
 * Single authoritative OpenGraph & X/Twitter card renderer.
 * Pure warm gallery-white editorial composition paired with the transparent
 * 3D isometric studio cutout and local brand typography (EB Garamond, Figtree, JetBrains Mono).
 */
export function renderPortfolioOgImage(): ImageResponse {
  const {
    garamond,
    figtreeRegular,
    figtreeMedium,
    jetbrainsMono,
    roomCutoutDataUri,
  } = loadOgAssets();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAFAF8",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "46px 64px 44px 64px",
          position: "relative",
          color: "#111111",
          fontFamily: "Figtree",
        }}
      >
        {/* Subtle outer editorial registration marks */}
        <CornerMark top={24} left={28} />
        <CornerMark top={24} right={28} />
        <CornerMark bottom={24} left={28} />
        <CornerMark bottom={24} right={28} />

        {/* Top Header Hairline Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "18px",
            borderBottom: "1px solid #E6E5E0",
            fontFamily: "JetBrains Mono",
            fontSize: 14,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#6C6A64",
          }}
        >
          <span>naphierawalie.tech</span>
          <span style={{ color: "#8B8982" }}>Zamboanga City, PH</span>
        </div>

        {/* Center Asymmetric Editorial Stage */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
            width: "100%",
          }}
        >
          {/* Left Typographic Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: "600px",
              paddingRight: "24px",
            }}
          >
            <div
              style={{
                fontFamily: "EB Garamond",
                fontSize: 86,
                fontWeight: 500,
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
                color: "#0F0F0E",
              }}
            >
              {SITE_NAME}
            </div>

            <div
              style={{
                display: "flex",
                width: "44px",
                height: "2px",
                background: "#141413",
                marginTop: "24px",
                marginBottom: "20px",
              }}
            />

            <div
              style={{
                fontFamily: "Figtree",
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.015em",
                color: "#1C1C1A",
                lineHeight: 1.2,
              }}
            >
              {AUTHOR_INFO.jobTitle}
            </div>

            <div
              style={{
                fontFamily: "Figtree",
                fontSize: 20,
                fontWeight: 400,
                lineHeight: 1.48,
                color: "#5C5B55",
                marginTop: "12px",
                maxWidth: "490px",
              }}
            >
              Crafting practical web applications, interactive UI systems, and clean software.
            </div>
          </div>

          {/* Right Studio Visual Anchor */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "440px",
              height: "445px",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={roomCutoutDataUri}
              alt=""
              width={424}
              height={445}
              style={{
                width: "424px",
                height: "445px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Bottom Index Strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "16px",
            borderTop: "1px solid #E6E5E0",
            fontFamily: "JetBrains Mono",
            fontSize: 13,
            letterSpacing: "0.08em",
            color: "#72706A",
          }}
        >
          <span>Selected Work  ·  Experience  ·  Components  ·  Field Notes</span>
          <span style={{ color: "#9A9891" }}>2026</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "EB Garamond",
          data: garamond,
          weight: 500,
          style: "normal",
        },
        {
          name: "Figtree",
          data: figtreeRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Figtree",
          data: figtreeMedium,
          weight: 500,
          style: "normal",
        },
        {
          name: "JetBrains Mono",
          data: jetbrainsMono,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
