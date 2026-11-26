import {
  OG_ALT,
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderPortfolioOgImage,
} from "@/lib/ogCard";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderPortfolioOgImage();
}
