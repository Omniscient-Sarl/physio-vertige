import { db } from "@/db/index";
import { pages } from "@/db/schema";
import { PagesAdmin } from "./client";

export default async function AdminPagesPage() {
  const all = await db.select().from(pages);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Pages</h1>
      <p className="mt-1 text-muted-foreground">
        Gérez les pages du site et leurs sections.
      </p>
      <div className="mt-8">
        <PagesAdmin pages={all} />
      </div>
    </div>
  );
}
