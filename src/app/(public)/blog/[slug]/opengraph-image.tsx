import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  OgCard,
  loadFonts,
  createOgImage,
} from "@/lib/og-utils";
import { getBlogPostBySlug } from "@/db/queries";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const fonts = await loadFonts();

  return createOgImage(
    <OgCard
      eyebrow={post?.category ?? "Blog"}
      title={post?.title ?? "Article"}
      subtitle="Arnaud Canadas — Physio-Vertige"
    />,
    fonts,
  );
}
