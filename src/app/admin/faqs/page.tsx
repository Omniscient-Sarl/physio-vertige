import { db } from "@/db/index";
import { faqs } from "@/db/schema";
import { asc } from "drizzle-orm";
import { FaqsAdmin } from "./client";

export default async function AdminFaqsPage() {
  const all = await db.select().from(faqs).orderBy(asc(faqs.order));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">FAQ</h1>
      <p className="mt-1 text-muted-foreground">
        Gérez les questions fréquentes.
      </p>
      <div className="mt-8">
        <FaqsAdmin faqs={all} />
      </div>
    </div>
  );
}
