import { notFound } from "next/navigation";
import { getPageWithSections } from "@/app/admin/_actions/pages";
import { PageEditor } from "./client";

type Props = { params: Promise<{ id: string }> };

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const pageId = parseInt(id, 10);
  if (isNaN(pageId)) notFound();

  const data = await getPageWithSections(pageId);
  if (!data) notFound();

  return (
    <div>
      <PageEditor page={data.page} sections={data.sections} />
    </div>
  );
}
