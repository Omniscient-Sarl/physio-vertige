import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  OgCard,
  loadFonts,
  createOgImage,
} from "@/lib/og-utils";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Physio-Vertige — Physiothérapie vestibulaire à Morges";

export default async function Image() {
  const fonts = await loadFonts();
  return createOgImage(
    <OgCard
      eyebrow="Physiothérapie vestibulaire"
      title="Retrouvez votre équilibre."
      subtitle="Arnaud Canadas — Physiothérapeute vestibulaire spécialisé à Morges"
    />,
    fonts,
  );
}
