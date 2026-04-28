import { db } from "@/db/index";
import { media } from "@/db/schema";
import { desc } from "drizzle-orm";
import { MediaAdmin } from "./client";

export default async function AdminMediaPage() {
  const all = await db
    .select()
    .from(media)
    .orderBy(desc(media.uploadedAt));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Médias</h1>
      <p className="mt-1 text-muted-foreground">
        Bibliothèque de médias et images uploadées.
      </p>
      <div className="mt-8">
        <MediaAdmin items={all} />
      </div>
    </div>
  );
}
